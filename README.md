# webcv-2

A static, data-driven CV site for Christian Rosenberg. TypeScript/Vite+ code in `src/` reads JSON content, renders the CV into `#app`, and styles it with plain CSS. Optional experience descriptions can be written as Markdown.

## Prerequisites

- The Vite+ global CLI, `vp` (see https://viteplus.dev/guide/global-cli/). It manages the Node.js and pnpm versions used by this project; `package.json` pins pnpm 12.21.0.
- No separate Node.js or pnpm installation is required when `vp` manages the environment.

## Local commands

```bash
vp install      # install dependencies (also run after pulling changes)
vp dev          # start the Vite+ development server
vp check        # format check, lint, and type check
vp test         # run the Vitest test suite
vp run build    # run the package.json build script: tsc && vp build
vp preview      # preview the production build
```

`vp run build` is the full build: it runs TypeScript first, then Vite+. Plain `vp build` invokes only the built-in Vite+ build. Likewise, `vp dev` is the built-in dev server; `vp run dev` here simply calls that same command.

## CV content

- CV JSON files live in `src/data/`: `profile`, `contact`, `education`, `experience`, `skills`, `languages`, `references`, `career-summary`, `private-projects`, and `other` (each with a `.json` extension).
- `src/cv-data.ts` imports those files and exposes the combined `cvData` used by `src/cv-dom.ts`.
- For a richer experience entry, add `"bodyMd": "example.md"` to an item in `src/data/experience.json` and put the Markdown file at `src/data/experience/example.md`. The `bodyMd` field is optional; a plain-text `body` field is still supported. A missing referenced file raises a clear error.
- The portrait placeholder is `src/assets/cv-photo.svg`, imported as raw SVG by `src/cv-dom.ts`. Images under `ref/` and `ref-images/` are design references, not application assets.

## Configuration

- `vite.config.ts` configures Vite+ and its lint rules.
- `package.json` provides the `dev`, `build`, and `preview` scripts.
- `index.html` is the app entry point; `src/main.ts` mounts the rendered CV.
