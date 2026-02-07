/**
 * Request deduplication cache
 * Prevents multiple simultaneous fetches for the same serial
 */
class RequestCache {
  private readonly cache = new Map<string, Promise<any>>();
  private readonly timers = new Map<string, NodeJS.Timeout>();

  async deduplicate<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl: number = 5000,
  ): Promise<T> {
    // Check if request is already in flight
    if (this.cache.has(key)) {
      return this.cache.get(key)!;
    }

    // Create new request
    const promise = fetchFn().finally(() => {
      // Clear from cache after completion
      this.cache.delete(key);
      const timer = this.timers.get(key);
      if (timer) {
        clearTimeout(timer);
        this.timers.delete(key);
      }
    });

    this.cache.set(key, promise);

    // Set TTL to auto-clear stale entries
    const timer = setTimeout(() => {
      this.cache.delete(key);
      this.timers.delete(key);
    }, ttl);
    this.timers.set(key, timer);

    return promise;
  }

  clear() {
    this.cache.clear();
    this.timers.forEach((timer) => clearTimeout(timer));
    this.timers.clear();
  }
}

export const requestCache = new RequestCache();
