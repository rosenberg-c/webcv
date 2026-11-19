import { Marked, type Tokens } from "marked";
import { escapeHtml, safeHref } from "./html.ts";

const markdown = new Marked({
  gfm: true,
  renderer: {
    html({ text }: Tokens.HTML | Tokens.Tag): string {
      return escapeHtml(text);
    },
    link({ href, title, tokens, text, autolink }: Tokens.Link): string {
      const label = autolink ? escapeHtml(text) : this.parser.parseInline(tokens);
      const safe = safeHref(href);

      if (safe === null) {
        return label;
      }

      const titleAttr =
        title === null || title === undefined ? "" : ` title="${escapeHtml(title)}"`;
      return `<a href="${escapeHtml(safe)}"${titleAttr}>${label}</a>`;
    },
    image({ text }: Tokens.Image): string {
      return escapeHtml(text);
    },
  },
});

/** Render Markdown to HTML without allowing raw HTML, images, or unsafe links. */
export function renderMarkdown(source: string): string {
  return markdown.parse(source, { async: false });
}
