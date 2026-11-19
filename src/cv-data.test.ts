import { expect, it } from "vite-plus/test";
import { cvData, resolveExperienceBody } from "./cv-data.ts";

it("keeps experience bullets separate from optional bodies", () => {
  const sbab = cvData.experience.find((item) => item.company === "SBAB Bank");

  expect(sbab?.bodyMarkdown).toBeUndefined();
  expect(sbab?.bullets.length).toBeGreaterThan(0);
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
