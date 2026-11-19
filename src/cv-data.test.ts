import { expect, it } from "vite-plus/test";
import { cvData, resolveExperienceBody } from "./cv-data.ts";

it("resolves experience bodyMd files while keeping bullets separate", () => {
  const sbab = cvData.experience.find((item) => item.company === "SBAB Bank");

  expect(sbab?.bodyMarkdown).toContain("The body text");
  expect(sbab?.body).toBeUndefined();
  expect(sbab?.bullets.length).toBeGreaterThan(0);
  expect(sbab?.bullets[0]).not.toContain("The body text");
});

it("keeps plain-text experience bodies backward compatible", () => {
  const lifepod = cvData.experience.find((item) => item.company.startsWith("Lifepod"));

  expect(lifepod?.bodyMarkdown).toBeUndefined();
  expect(lifepod?.bullets.length).toBeGreaterThan(0);
});

it("fails clearly when a bodyMd reference has no matching file", () => {
  expect(() => resolveExperienceBody("missing.md", "Test Co")).toThrow(
    /Experience body Markdown file not found for Test Co: \.\/data\/experience\/missing\.md/,
  );
});
