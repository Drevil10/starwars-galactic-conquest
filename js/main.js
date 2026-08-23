import { renderNavigation } from "./ui/Navigation.js";
import { registerScreens } from "./ui/Screens.js";
import { initArchiveScreen } from "./ui/Archive.js";

const app = document.getElementById("app");
const nav = document.getElementById("main-nav");
const modal = document.getElementById("archive-modal");

registerScreens(app);
renderNavigation(nav, (screenId) => {
  app.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
  const target = document.getElementById(screenId + "-screen");
  if (target) target.classList.add("active");
});

initArchiveScreen(app, modal);
