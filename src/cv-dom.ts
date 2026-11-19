import type { CvData } from "./cv-data.ts";
import { safeHref } from "./html.ts";
import { renderMarkdown } from "./markdown.ts";
import phoneIcon from "./assets/phone.svg?raw";
import mailIcon from "./assets/mail.svg?raw";
import locationIcon from "./assets/location.svg?raw";
import webIcon from "./assets/web.svg?raw";
import cvPhotoSvg from "./assets/cv-photo.svg?raw";

const icons: Record<CvData["contact"][number]["icon"], string> = {
  phone: phoneIcon,
  mail: mailIcon,
  location: locationIcon,
  web: webIcon,
};

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className !== undefined) {
    node.className = className;
  }
  if (text !== undefined) {
    node.textContent = text;
  }
  return node;
}

function trustedSvg(source: string): SVGSVGElement {
  const parsed = new DOMParser().parseFromString(source, "text/html");
  const svg = parsed.body.firstElementChild;
  if (svg?.localName !== "svg" || svg.namespaceURI !== "http://www.w3.org/2000/svg") {
    throw new Error("Invalid trusted SVG asset");
  }
  return document.importNode(svg, true) as SVGSVGElement;
}

function link(href: string | undefined, label: string): Node {
  const safe = href === undefined ? null : safeHref(href);
  if (safe === null) {
    return document.createTextNode(label);
  }
  const anchor = el("a", undefined, label);
  anchor.href = safe;
  return anchor;
}

function markdownBody(source: string): HTMLElement {
  const body = el("div", "cv-job-body");
  const parsed = new DOMParser().parseFromString(renderMarkdown(source), "text/html");
  for (const child of parsed.body.childNodes) {
    body.append(document.importNode(child, true));
  }
  return body;
}

function section(title: string, className = "cv-section"): HTMLElement {
  const node = el("section", className);
  node.append(
    el("h2", className === "cv-section" ? "cv-section-heading" : "cv-side-heading", title),
  );
  return node;
}

function paragraphs(text: string, className: string): DocumentFragment {
  const fragment = document.createDocumentFragment();
  for (const paragraph of text.split(/\n\s*\n/)) {
    fragment.append(el("p", className, paragraph.trim().replace(/\s+/g, " ")));
  }
  return fragment;
}

function bulletList(items: string[], className: string): HTMLUListElement {
  const list = el("ul", className);
  for (const item of items) {
    list.append(el("li", undefined, item));
  }
  return list;
}

function timelineEntry(
  title: string,
  years: string,
  className: string,
): {
  item: HTMLLIElement;
  article: HTMLElement;
} {
  const item = el("li", "cv-timeline-item");
  const dot = el("span", "cv-timeline-dot");
  dot.setAttribute("aria-hidden", "true");
  const article = el("article", className);
  const header = el("header", "cv-job-header");
  header.append(el("h3", "cv-job-company", title), el("span", "cv-job-years", years));
  article.append(header);
  item.append(dot, article);
  return { item, article };
}

export function buildCv(data: CvData): DocumentFragment {
  const fragment = document.createDocumentFragment();
  const cv = el("div", "cv");
  const main = el("main", "cv-main");
  main.id = "cv-main";
  const header = el("header", "cv-header");
  const name = el("h1", "cv-name");
  name.append(
    el("span", "cv-name-first", data.firstName),
    el("span", "cv-name-last", data.lastName),
  );
  const bar = el("span", "cv-title-bar");
  bar.setAttribute("aria-hidden", "true");
  header.append(name, el("p", "cv-title", data.title), bar);
  main.append(header);

  const profile = section("Profile");
  profile.append(paragraphs(data.profile, "cv-profile-text"));
  main.append(profile);

  const summary = section("Career Summary");
  summary.append(paragraphs(data.careerSummary, "cv-career-summary-text"));
  main.append(summary);

  const experience = section("Work Experience");
  const jobs = el("ol", "cv-timeline");
  for (const job of data.experience) {
    const { item, article } = timelineEntry(job.company, job.years, "cv-job");
    article.append(el("p", "cv-job-role", job.role));
    if (job.bodyMarkdown !== undefined) {
      article.append(markdownBody(job.bodyMarkdown));
    } else if (job.body !== undefined) {
      article.append(el("p", undefined, job.body));
    }
    article.append(bulletList(job.bullets, "cv-job-bullets"));
    jobs.append(item);
  }
  experience.append(jobs);
  main.append(experience);

  const education = section("Education");
  const schools = el("ol", "cv-timeline");
  for (const school of data.education) {
    const { item, article } = timelineEntry(school.school, school.years, "cv-edu");
    article.append(bulletList(school.details, "cv-job-bullets"));
    schools.append(item);
  }
  education.append(schools);
  main.append(education);

  const projects = section("Private Projects");
  const projectList = el("div", "cv-private-projects");
  for (const project of data.privateProjects) {
    const article = el("article", "cv-private-project");
    article.append(el("h3", "cv-private-project-title", project.name));
    const meta = el("p", "cv-private-project-meta");
    if (project.tagline !== undefined) {
      meta.append(document.createTextNode(project.tagline));
    }
    if (project.linkText || project.href) {
      if (project.tagline !== undefined) {
        meta.append(document.createTextNode(" - "));
      }
      meta.append(link(project.href, project.linkText ?? project.href ?? ""));
    }
    article.append(meta, el("p", "cv-private-project-description", project.description));
    projectList.append(article);
  }
  projects.append(projectList);
  main.append(projects);

  const other = section("Other");
  const groups = el("div", "cv-other-groups");
  for (const group of data.other) {
    const card = el("div", "stack-card cv-other-group");
    card.append(el("h3", "cv-other-group-heading", group.title));
    card.append(bulletList(group.items, "cv-other-group-list"));
    groups.append(card);
  }
  other.append(groups);
  main.append(other);

  if (data.references.length > 0) {
    const references = section("Reference");
    const list = el("ul", "cv-references");
    for (const reference of data.references) {
      const item = el("li", "cv-reference");
      item.append(el("h3", "cv-ref-name", reference.name));
      item.append(el("p", "cv-ref-role", `${reference.company} / ${reference.role}`));
      const phone = el("p", "cv-ref-detail");
      phone.append(
        el("span", "cv-ref-label", "Phone:"),
        document.createTextNode(` ${reference.phone}`),
      );
      const email = el("p", "cv-ref-detail");
      email.append(el("span", "cv-ref-label", "Email:"), document.createTextNode(" "));
      email.append(link(`mailto:${reference.email}`, reference.email));
      item.append(phone, email);
      list.append(item);
    }
    references.append(list);
    main.append(references);
  }

  const sidebar = el("aside", "cv-sidebar");
  sidebar.setAttribute("aria-label", "Contact, skills, and languages");
  const photoWrap = el("div", "cv-photo-wrap");
  const photo = trustedSvg(cvPhotoSvg);
  photo.setAttribute("aria-label", `Portrait placeholder for ${data.firstName} ${data.lastName}`);
  photoWrap.append(photo);
  sidebar.append(photoWrap);

  const contacts = section("Contact", "cv-side-section");
  const address = el("address", "cv-contact");
  const contactList = el("ul", "cv-contact-list");
  for (const contact of data.contact) {
    const item = el("li");
    const icon = el("span", "cv-icon");
    icon.append(trustedSvg(icons[contact.icon]));
    item.append(icon, link(contact.href, contact.text));
    contactList.append(item);
  }
  address.append(contactList);
  contacts.append(address);
  sidebar.append(contacts);

  const skills = section("Skills", "cv-side-section");
  skills.append(bulletList(data.skills, "cv-skills-list"));
  sidebar.append(skills);
  const languages = section("Languages", "cv-side-section");
  languages.append(bulletList(data.languages, "cv-languages-list"));
  sidebar.append(languages);

  cv.append(main, sidebar);
  fragment.append(cv);
  return fragment;
}
