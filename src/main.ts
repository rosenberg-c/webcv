import "./style.css";
import "./cv.css";
import { cvData } from "./cv-data.ts";
import phoneIcon from "./assets/phone.svg?raw";
import mailIcon from "./assets/mail.svg?raw";
import locationIcon from "./assets/location.svg?raw";
import webIcon from "./assets/web.svg?raw";
import cvPhotoSvg from "./assets/cv-photo.svg?raw";

const icons: Record<string, string> = {
  phone: phoneIcon,
  mail: mailIcon,
  location: locationIcon,
  web: webIcon,
};

const htmlEscapes: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/** Escape a value for interpolation into HTML text or a quoted attribute. */
function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => htmlEscapes[char] ?? char);
}

const safeHrefSchemes = new Set(["http:", "https:", "mailto:", "tel:"]);

/** Return `href` only if it parses with an allowed scheme, otherwise `null`. */
function safeHref(href: string): string | null {
  try {
    return safeHrefSchemes.has(new URL(href).protocol) ? href : null;
  } catch {
    return null;
  }
}

function renderContact(item: (typeof cvData.contact)[number]): string {
  const text = escapeHtml(item.text);
  const href = item.href === undefined ? null : safeHref(item.href);
  const textNode = href === null ? text : `<a href="${escapeHtml(href)}">${text}</a>`;
  return `<li><span class="cv-icon">${icons[item.icon] ?? ""}</span>${textNode}</li>`;
}

function renderEducation(items: typeof cvData.education): string {
  return items
    .map(
      (item) => `
    <li class="cv-edu-item">
      <p class="cv-edu-years">${escapeHtml(item.years)}</p>
      <p class="cv-edu-school">${escapeHtml(item.school)}</p>
      <ul class="cv-edu-details">
        ${item.details.map((detail) => `<li>${escapeHtml(detail)}</li>`).join("")}
      </ul>
    </li>`,
    )
    .join("");
}

function renderBulletList(items: string[]): string {
  return items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
}

function renderExperience(items: typeof cvData.experience): string {
  return items
    .map(
      (item) => `
    <li class="cv-timeline-item">
      <span class="cv-timeline-dot" aria-hidden="true"></span>
      <article class="cv-job">
        <header class="cv-job-header">
          <h3 class="cv-job-company">${escapeHtml(item.company)}</h3>
          <span class="cv-job-years">${escapeHtml(item.years)}</span>
        </header>
        <p class="cv-job-role">${escapeHtml(item.role)}</p>
        <ul class="cv-job-bullets">
          ${item.bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join("")}
        </ul>
      </article>
    </li>`,
    )
    .join("");
}

function renderReferences(items: typeof cvData.references): string {
  return items
    .map((item) => {
      const email = escapeHtml(item.email);
      const emailHref = safeHref(`mailto:${item.email}`);
      const emailNode =
        emailHref === null ? email : `<a href="${escapeHtml(emailHref)}">${email}</a>`;
      return `
    <li class="cv-reference">
      <h3 class="cv-ref-name">${escapeHtml(item.name)}</h3>
      <p class="cv-ref-role">${escapeHtml(item.company)} / ${escapeHtml(item.role)}</p>
      <p class="cv-ref-detail"><span class="cv-ref-label">Phone:</span> ${escapeHtml(item.phone)}</p>
      <p class="cv-ref-detail"><span class="cv-ref-label">Email:</span> ${emailNode}</p>
    </li>`;
    })
    .join("");
}

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) {
  throw new Error("#app element not found");
}

app.innerHTML = `
  <a class="skip-link" href="#cv-main">Skip to main content</a>
  <div class="cv">
    <main class="cv-main" id="cv-main">
      <header class="cv-header">
        <h1 class="cv-name"><span class="cv-name-first">${escapeHtml(cvData.firstName)}</span> <span class="cv-name-last">${escapeHtml(cvData.lastName)}</span></h1>
        <p class="cv-title">${escapeHtml(cvData.title)}</p>
        <span class="cv-title-bar" aria-hidden="true"></span>
      </header>
      <section class="cv-section">
        <h2 class="cv-section-heading">Profile</h2>
        <p class="cv-profile-text">${escapeHtml(cvData.profile)}</p>
      </section>
      <section class="cv-section">
        <h2 class="cv-section-heading">Work Experience</h2>
        <ol class="cv-timeline">
          ${renderExperience(cvData.experience)}
        </ol>
      </section>
      <section class="cv-section">
        <h2 class="cv-section-heading">Reference</h2>
        <ul class="cv-references">
          ${renderReferences(cvData.references)}
        </ul>
      </section>
    </main>
    <aside class="cv-sidebar" aria-label="Contact, education, skills, and languages">
      <div class="cv-photo-wrap">
        ${cvPhotoSvg.replace("__CV_NAME__", `${escapeHtml(cvData.firstName)} ${escapeHtml(cvData.lastName)}`)}
      </div>
      <section class="cv-side-section">
        <h2 class="cv-side-heading">Contact</h2>
        <address class="cv-contact">
          <ul class="cv-contact-list">
            ${cvData.contact.map(renderContact).join("")}
          </ul>
        </address>
      </section>
      <section class="cv-side-section">
        <h2 class="cv-side-heading">Education</h2>
        <ul class="cv-edu-list">
          ${renderEducation(cvData.education)}
        </ul>
      </section>
      <section class="cv-side-section">
        <h2 class="cv-side-heading">Skills</h2>
        <ul class="cv-skills-list">
          ${renderBulletList(cvData.skills)}
        </ul>
      </section>
      <section class="cv-side-section">
        <h2 class="cv-side-heading">Languages</h2>
        <ul class="cv-languages-list">
          ${renderBulletList(cvData.languages)}
        </ul>
      </section>
    </aside>
  </div>
`;
