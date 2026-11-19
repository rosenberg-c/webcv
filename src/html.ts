const htmlEscapes: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/** Escape a value for interpolation into HTML text or a quoted attribute. */
export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => htmlEscapes[char] ?? char);
}

const safeHrefSchemes = new Set(["http:", "https:", "mailto:", "tel:"]);

/** Return `href` only if it parses with an allowed scheme, otherwise `null`. */
export function safeHref(href: string): string | null {
  try {
    return safeHrefSchemes.has(new URL(href).protocol) ? href : null;
  } catch {
    return null;
  }
}
