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

export const cvData: CvData = {
  firstName: "Richard",
  lastName: "Sanchez",
  title: "Marketing Manager",
  contact: [
    { icon: "phone", text: "+123-456-7890", href: "tel:+1234567890" },
    { icon: "mail", text: "hello@reallygreatsite.com", href: "mailto:hello@reallygreatsite.com" },
    { icon: "location", text: "123 Anywhere St., Any City" },
    { icon: "web", text: "www.reallygreatsite.com", href: "https://www.reallygreatsite.com" },
  ],
  education: [
    {
      years: "2029 - 2030",
      school: "Wardiere University",
      details: ["Master of Business Management"],
    },
    {
      years: "2025 - 2029",
      school: "Wardiere University",
      details: ["Bachelor of Business", "GPA: 3.8 / 4.0"],
    },
  ],
  skills: [
    "Project Management",
    "Public Relations",
    "Teamwork",
    "Time Management",
    "Leadership",
    "Effective Communication",
    "Critical Thinking",
  ],
  languages: ["English (Fluent)", "French (Fluent)", "German (Basics)", "Spanish (Intermediate)"],
  profile:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  experience: [
    {
      company: "Borcelle Studio",
      years: "2030 - Present",
      role: "Marketing Manager & Specialist",
      bullets: [
        "Develop and execute comprehensive marketing strategies and campaigns that align with the company's goals and objectives.",
        "Lead, mentor, and manage a high-performing marketing team, fostering a collaborative and results-driven work environment.",
        "Monitor brand consistency across marketing channels and materials.",
      ],
    },
    {
      company: "Fauget Studio",
      years: "2025 - 2029",
      role: "Marketing Manager & Specialist",
      bullets: [
        "Create and manage the marketing budget, ensuring efficient allocation of resources and optimizing ROI.",
        "Oversee market research to identify emerging trends, customer needs, and competitor strategies.",
        "Monitor brand consistency across marketing channels and materials.",
      ],
    },
    {
      company: "Studio Shodwe",
      years: "2024 - 2025",
      role: "Marketing Manager & Specialist",
      bullets: [
        "Develop and maintain strong relationships with partners, agencies, and vendors to support marketing initiatives.",
        "Monitor and maintain brand consistency across all marketing channels and materials.",
      ],
    },
  ],
  references: [
    {
      name: "Estelle Darcy",
      company: "Wardiere Inc.",
      role: "CTO",
      phone: "123-456-7890",
      email: "hello@reallygreatsite.com",
    },
    {
      name: "Harper Richard",
      company: "Wardiere Inc.",
      role: "CEO",
      phone: "123-456-7890",
      email: "hello@reallygreatsite.com",
    },
  ],
};
