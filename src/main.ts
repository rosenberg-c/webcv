import "./style.css";
import "./cv.css";
import { cvData } from "./cv-data.ts";

const icons: Record<string, string> = {
  phone:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
  location:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  web: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
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
        <svg class="cv-photo" viewBox="0 0 150 150" role="img" aria-label="Portrait placeholder for ${escapeHtml(cvData.firstName)} ${escapeHtml(cvData.lastName)}" xmlns="http://www.w3.org/2000/svg">
          <rect width="150" height="150" fill="#e8ecf1" />
          <circle cx="75" cy="58" r="26" fill="#9aa6b2" />
          <path d="M30 150 Q30 100 75 100 Q120 100 120 150 Z" fill="#9aa6b2" />
        </svg>
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
