/**
 * Debounced validation queue
 * Groups rapid scans and validates them together
 */
class ValidationQueue {
  private readonly queue = new Map<string, NodeJS.Timeout>();
  private readonly callbacks = new Map<string, Array<() => void>>();

  schedule(key: string, callback: () => void, delay: number = 300) {
    // Clear existing timer
    const existingTimer = this.queue.get(key);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // Add callback to queue
    if (!this.callbacks.has(key)) {
      this.callbacks.set(key, []);
    }
    this.callbacks.get(key)!.push(callback);

    // Schedule new validation
    const timer = setTimeout(() => {
      const cbs = this.callbacks.get(key) || [];
      this.callbacks.delete(key);
      this.queue.delete(key);

      // Execute all queued callbacks
      cbs.forEach((cb) => cb());
    }, delay);

    this.queue.set(key, timer);
  }

  clear() {
    this.queue.forEach((timer) => clearTimeout(timer));
    this.queue.clear();
    this.callbacks.clear();
  }
}

export const validationQueue = new ValidationQueue();
