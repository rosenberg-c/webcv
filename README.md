# webcv

A static CV site for Christian Rosenberg, built with TypeScript, Vite+, and CSS. Content lives in JSON files under `src/data/`.

## Get started

Install the [Vite+ CLI](https://viteplus.dev/guide/global-cli/); it manages Node.js and pnpm for this project. Then run:

```sh
vp install       # install dependencies
vp dev           # start the development server
vp check         # format, lint, and type-check
vp test          # run tests
vp run build     # type-check and build for production
vp preview       # preview the production build
```

Use `vp run build` for the full build (`tsc && vp build`); `vp build` alone skips the separate TypeScript check.

## Edit the CV

Edit the JSON files in `src/data/`. For an experience entry, set `body` for plain text or `bodyMd` to a Markdown filename in `src/data/experience/` (for example, `"bodyMd": "example.md"`). If both are set, Markdown takes precedence. Missing Markdown files cause an error.

`src/cv-data.ts` assembles the data, `src/cv-dom.ts` renders it, and `src/main.ts` mounts it in `#app`. The portrait placeholder is `src/assets/cv-photo.svg`.
