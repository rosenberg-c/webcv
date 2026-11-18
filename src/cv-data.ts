import profileData from "./data/profile.json";
import contactData from "./data/contact.json";
import educationData from "./data/education.json";
import experienceData from "./data/experience.json";
import skillsData from "./data/skills.json";
import languagesData from "./data/languages.json";
import referencesData from "./data/references.json";

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
  bullets: string[];
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
  experience: ExperienceItem[];
  references: ReferenceItem[];
}

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
  experience: experienceData,
  references: referencesData,
};
