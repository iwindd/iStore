---
trigger: always_on
---

# Project Constraints: Next.js, TanStack Query

## Data Fetching & State Management (TanStack Query)

- **Rule**: Do NOT call Server Actions directly inside `useEffect` or Event Handlers in Client Components.
- **Requirement**: Use **TanStack Query** (`@tanstack/react-query`) to wrap Server Actions for caching, loading states, and optimistic updates.
