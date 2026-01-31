---
name: tanstack-query
description: Best practices for data fetching and state management using TanStack Query. Use this when calling Server Actions from Client Components.
---

# TanStack Query Guide

## Core Principles

1. **No Direct Server Actions**: Do NOT call Server Actions directly inside `useEffect` or Event Handlers in Client Components.
2. **Wrapper Requirement**: Use **TanStack Query** (`@tanstack/react-query`) to wrap Server Actions for:
   - Caching
   - Loading states
   - Optimistic updates

## Usage

When implementing data fetching or mutations in Client Components, always create or use a custom hook that wraps the Server Action with `useQuery` (for fetching) or `useMutation` (for updates).

**Example Pattern:**
Instead of calling `myServerAction()` directly locally, use a hook:

```tsx
// Correct
const { data, isLoading } = useQuery({
  queryKey: ["my-data"],
  queryFn: () => myServerAction(),
});
```
