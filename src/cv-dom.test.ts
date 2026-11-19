// @vitest-environment happy-dom
import { describe, expect, it } from "vite-plus/test";
import { cvData, type CvData } from "./cv-data.ts";
import { buildCv } from "./cv-dom.ts";

function render(overrides: Partial<CvData> = {}): HTMLElement {
  const root = document.createElement("div");
  root.append(buildCv({ ...cvData, ...overrides }));
  return root;
}

describe("buildCv", () => {
  it("preserves section order, timeline entries, and optional references", () => {
    const root = render();
    expect(
      Array.from(root.querySelectorAll(".cv-main > section > h2"), (node) => node.textContent),
    ).toEqual([
      "Profile",
      "Career Summary",
      "Work Experience",
      "Education",
      "Private Projects",
      "Other",
    ]);
    expect(root.querySelectorAll(".cv-timeline-dot")).toHaveLength(
      cvData.experience.length + cvData.education.length,
    );
    expect(root.querySelector(".cv-sidebar .cv-side-heading")?.textContent).toBe("Contact");
    expect(root.querySelectorAll(".cv-references")).toHaveLength(0);

    const withReference = render({
      references: [
        { name: "Name", company: "Company", role: "Role", phone: "123", email: "a@example.com" },
      ],
    });
    expect(withReference.querySelector(".cv-references a")?.getAttribute("href")).toBe(
      "mailto:a@example.com",
    );
  });

  it("treats CV text as text and allows only safe links", () => {
    const root = render({
      firstName: '<img src=x onerror="bad">',
      contact: [
        { icon: "web", text: "Unsafe <b>link</b>", href: "javascript:alert(1)" },
        { icon: "mail", text: "Safe & link", href: "mailto:test@example.com" },
      ],
      privateProjects: [
        {
          name: "Unsafe",
          tagline: "Test",
          href: "javascript:alert(1)",
          linkText: "Go",
          description: "<script>bad</script>",
        },
      ],
    });
    expect(root.querySelector(".cv-name-first")?.textContent).toBe('<img src=x onerror="bad">');
    expect(
      root.querySelector(".cv-name-first img, .cv-private-project-description script"),
    ).toBeNull();
    expect(root.querySelectorAll(".cv-contact-list a")).toHaveLength(1);
    expect(root.querySelector(".cv-contact-list a")?.getAttribute("href")).toBe(
      "mailto:test@example.com",
    );
    expect(root.querySelector(".cv-private-project a")).toBeNull();
    expect(root.querySelector(".cv-photo")?.getAttribute("aria-label")).toBe(
      'Portrait placeholder for <img src=x onerror="bad"> Rosenberg',
    );
  });

  it("renders Markdown content safely without merging the bullet list", () => {
    const root = render({
      experience: [
        {
          company: "Test",
          years: "2020",
          role: "Developer",
          bodyMarkdown:
            "Hello **world**\n\n- [good](https://example.com)\n- [bad](javascript:alert(1))\n\n<script>alert(1)</script>",
          bullets: ["Separate bullet"],
        },
      ],
    });
    expect(root.querySelector(".cv-job-body strong")?.textContent).toBe("world");
    expect(root.querySelector(".cv-job-body a")?.getAttribute("href")).toBe("https://example.com");
    expect(root.querySelector(".cv-job-body a[href^='javascript:']")).toBeNull();
    expect(root.querySelector(".cv-job-body script")).toBeNull();
    expect(root.querySelector(".cv-job-bullets li")?.textContent).toBe("Separate bullet");
  });
});
