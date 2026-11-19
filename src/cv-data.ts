import profileData from "./data/profile.json";
import contactData from "./data/contact.json";
import educationData from "./data/education.json";
import experienceData from "./data/experience.json";
import skillsData from "./data/skills.json";
import languagesData from "./data/languages.json";
import referencesData from "./data/references.json";
import careerSummaryData from "./data/career-summary.json";
import privateProjectsData from "./data/private-projects.json";
import otherData from "./data/other.json";

export interface ContactItem {
  icon: "phone" | "mail" | "location" | "web";
  text: string;
  href?: string;
}

export interface EducationItem {
  years: string;
  school: string;
  details: string[];
}

export interface ExperienceItem {
  company: string;
  years: string;
  role: string;
  body?: string;
  bodyMarkdown?: string;
  bullets: string[];
}

export interface PrivateProjectItem {
  name: string;
  tagline: string;
  href?: string;
  linkText?: string;
  description: string;
}

export interface OtherGroup {
  title: string;
  items: string[];
}

export interface ReferenceItem {
  name: string;
  company: string;
  role: string;
  phone: string;
  email: string;
}

export interface CvData {
  firstName: string;
  lastName: string;
  title: string;
  contact: ContactItem[];
  education: EducationItem[];
  skills: string[];
  languages: string[];
  profile: string;
  careerSummary: string;
  experience: ExperienceItem[];
  privateProjects: PrivateProjectItem[];
  other: OtherGroup[];
  references: ReferenceItem[];
}

interface RawExperienceItem {
  company: string;
  years: string;
  role: string;
  body?: string;
  bodyMd?: string;
  bullets: string[];
}

const experienceBodyFiles = import.meta.glob("./data/experience/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

export function resolveExperienceBody(file: string, company: string): string {
  const path = `./data/experience/${file}`;
  const markdown = experienceBodyFiles[path];

  if (markdown === undefined) {
    throw new Error(
      `Experience body Markdown file not found for ${company}: ${path} (referenced as "${file}")`,
    );
  }

  return markdown;
}

const experience: ExperienceItem[] = (experienceData as RawExperienceItem[]).map((item) => ({
  company: item.company,
  years: item.years,
  role: item.role,
  body: item.body,
  bodyMarkdown:
    item.bodyMd === undefined ? undefined : resolveExperienceBody(item.bodyMd, item.company),
  bullets: item.bullets,
}));

const CONTACT_ICONS = ["phone", "mail", "location", "web"] as const;

type ContactIcon = (typeof CONTACT_ICONS)[number];

function isContactIcon(value: unknown): value is ContactIcon {
  return typeof value === "string" && CONTACT_ICONS.includes(value as ContactIcon);
}

const contact: ContactItem[] = contactData.map((item) => {
  if (!isContactIcon(item.icon)) {
    throw new Error(`Invalid contact icon: ${String(item.icon)}`);
  }

  return {
    icon: item.icon,
    text: item.text,
    href: item.href,
  };
});

export const cvData: CvData = {
  firstName: profileData.firstName,
  lastName: profileData.lastName,
  title: profileData.title,
  contact,
  education: educationData,
  skills: skillsData,
  languages: languagesData,
  profile: profileData.profile,
  careerSummary: careerSummaryData,
  experience,
  privateProjects: privateProjectsData,
  other: otherData,
  references: referencesData,
};
