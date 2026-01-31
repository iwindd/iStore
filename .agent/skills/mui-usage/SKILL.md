---
name: mui-usage
description: Guidelines for using Material UI (MUI) components instead of native HTML elements. Use this when creating or refactoring UI components.
---

# Material UI (MUI) Usage Guidelines

## Core Principle

**Always prioritize Material UI components over native HTML tags.**
This ensures consistency in design, theming, and accessibility across the application.

## HTML to MUI Mapping

Use the following replacements as a general rule:

| Native HTML                    | MUI Component                         | Notes                                                                         |
| ------------------------------ | ------------------------------------- | ----------------------------------------------------------------------------- |
| `<div>`                        | `<Box>`                               | For generic containers. Use `sx` prop for styling.                            |
| `<div>` (flex)                 | `<Stack>`                             | For one-dimensional layouts (vertical/horizontal).                            |
| `<div>` (grid)                 | `<Grid>`                              | For two-dimensional layouts or responsive grids.                              |
| `<h1>`-`<h6>`, `<p>`, `<span>` | `<Typography>`                        | Use `variant` prop (e.g., `h1`, `body1`) to control semantics and style.      |
| `<button>`                     | `<Button>`, `<IconButton>`            | Use `IconButton` for icon-only buttons.                                       |
| `<input>`, `<textarea>`        | `<TextField>`                         | Handles labels, errors, and various input types.                              |
| `<hr>`                         | `<Divider>`                           |                                                                               |
| `<a>`                          | `<Link>`                              | Import from `@mui/material/Link` (or use Next.js Link wrapped with MUI Link). |
| `<ul>`/`<ol>`, `<li>`          | `<List>`, `<ListItem>`                | For structured lists.                                                         |
| `<img>`                        | `<Box component="img">` or `<Avatar>` | Use Box for responsive images or Avatar for user profiles.                    |
| `<dialog>`                     | `<Dialog>`                            | Built-in accessibility and overlay management.                                |
| `<select>`                     | `<Select>` or `<TextField select>`    |                                                                               |
| `<table>`                      | `<Table>`, `<TableBody>`, etc.        | Use `TableContainer` -> `Table` structure.                                    |
| `<card>` (concept)             | `<Card>`                              | Use `CardContent`, `CardActions`, `CardHeader`.                               |

## Documentation & Best Practices

- **Reference**: See `llms.txt` in the project root for a comprehensive list of available MUI components.
- **Styling**: Prefer using the `sx` prop for one-off styles or `styled()` for reusable components over plain CSS classes, to leverage the MUI theme system.
- **Layout**: Avoid using margin/padding on child elements for spacing. Use `<Stack spacing={2}>` or `Grid` gaps instead.

## Example

**Avoid (HTML):**

```jsx
<div className="card">
  <h1>Title</h1>
  <p>Description</p>
  <button>Action</button>
</div>
```

**Prefer (MUI):**

```jsx
<Card>
  <CardContent>
    <Typography variant="h4">Title</Typography>
    <Typography variant="body1">Description</Typography>
  </CardContent>
  <CardActions>
    <Button variant="contained">Action</Button>
  </CardActions>
</Card>
```
