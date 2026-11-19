import { describe, expect, it } from "vite-plus/test";
import { renderMarkdown } from "./markdown.ts";

describe("renderMarkdown", () => {
  it("renders paragraphs, lists, emphasis, and safe links", () => {
    const html = renderMarkdown("Hello **world**\n\n- one\n- [two](https://example.com)");

    expect(html).toContain("<p>Hello <strong>world</strong></p>");
    expect(html).toContain("<ul>");
    expect(html).toContain("<li>one</li>");
    expect(html).toContain('<a href="https://example.com">two</a>');
  });

  it("escapes raw HTML instead of emitting it", () => {
    const html = renderMarkdown('<script>alert("x")</script>');

    expect(html).not.toContain("<script");
    expect(html).toContain("&lt;script&gt;");
  });

  it("drops unsafe links and images but keeps their text", () => {
    const html = renderMarkdown(
      "[bad](javascript:alert(1)) ![alt](javascript:alert(1)) [good](mailto:a@example.com)",
    );

    expect(html).not.toContain('href="javascript:');
    expect(html).not.toContain("<img");
    expect(html).toContain("bad");
    expect(html).toContain("alt");
    expect(html).toContain('<a href="mailto:a@example.com">good</a>');
  });
});
