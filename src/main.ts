import "./style.css";
import "./cv.css";
import { cvData } from "./cv-data.ts";
import { buildCv } from "./cv-dom.ts";

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) {
  throw new Error("#app element not found");
}

app.replaceChildren(buildCv(cvData));
