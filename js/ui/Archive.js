import { createModal, closeModal } from "./Components.js";

const CATEGORIES = [
  { id: "all", label: "Todos" },
  { id: "personajes", label: "Personajes" },
  { id: "naves", label: "Naves" },
  { id: "planetas", label: "Planetas" },
  { id: "armas", label: "Armas" },
  { id: "vehiculos", label: "Vehiculos" },
  { id: "droides", label: "Droides" },
  { id: "criaturas", label: "Criaturas" },
];

const ASSETS = [
  { name: "Darth Vader", category: "personajes", path: "assets/svg/characters/darth_vader.svg" },
  { name: "Luke Skywalker", category: "personajes", path: "assets/svg/characters/luke_skywalker.svg" },
  { name: "X-Wing", category: "naves", path: "assets/svg/ships/xwing.svg" },
  { name: "TIE Fighter", category: "naves", path: "assets/svg/ships/tie_fighter.svg" },
  { name: "Death Star", category: "naves", path: "assets/svg/ships/death_star.svg" },
  { name: "Tatooine", category: "planetas", path: "assets/svg/planets/tatooine.svg" },
  { name: "Endor", category: "planetas", path: "assets/svg/planets/endor.svg" },
  { name: "Lightsaber", category: "armas", path: "assets/svg/weapons/lightsaber.svg" },
  { name: "Blaster", category: "armas", path: "assets/svg/weapons/blaster.svg" },
  { name: "Speeder Bike", category: "vehiculos", path: "assets/svg/vehicles/speeder_bike.svg" },
  { name: "AT-AT", category: "vehiculos", path: "assets/svg/vehicles/at_at.svg" },
  { name: "R2-D2", category: "droides", path: "assets/svg/droids/r2d2.svg" },
  { name: "C-3PO", category: "droides", path: "assets/svg/droids/c3po.svg" },
  { name: "Wampa", category: "criaturas", path: "assets/svg/creatures/wampa.svg" },
  { name: "Rancor", category: "criaturas", path: "assets/svg/creatures/rancor.svg" },
];

export function initArchiveScreen(app, modalEl) {
  const gridEl = app.querySelector("#archive-grid");
  const categoriesEl = app.querySelector("#archive-categories");
  const searchInput = app.querySelector("#archive-search-input");

  let activeCategory = "all";
  let query = "";

  function renderCategories() {
    categoriesEl.innerHTML = "";
    CATEGORIES.forEach((cat) => {
      const chip = document.createElement("button");
      chip.className = "category-chip" + (cat.id === activeCategory ? " active" : "");
      chip.textContent = cat.label;
      chip.addEventListener("click", () => {
        activeCategory = cat.id;
        renderCategories();
        renderGrid();
      });
      categoriesEl.appendChild(chip);
    });
  }

  function getPlaceholderSVG() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "80");
    svg.setAttribute("height", "80");
    svg.setAttribute("viewBox", "0 0 80 80");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "#9aa4b2");
    svg.setAttribute("stroke-width", "2");

    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", "40");
    circle.setAttribute("cy", "40");
    circle.setAttribute("r", "28");
    svg.appendChild(circle);

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M30 40l6 6 14-14");
    svg.appendChild(path);

    return svg;
  }

  function renderGrid() {
    gridEl.innerHTML = "";
    const filtered = ASSETS.filter((asset) => {
      const matchCategory = activeCategory === "all" || asset.category === activeCategory;
      const matchQuery = !query || asset.name.toLowerCase().includes(query.toLowerCase());
      return matchCategory && matchQuery;
    });

    filtered.forEach((asset) => {
      const card = document.createElement("article");
      card.className = "archive-card";

      const preview = document.createElement("div");
      preview.className = "card-preview";
      preview.appendChild(getPlaceholderSVG());

      const body = document.createElement("div");
      body.className = "card-body";

      const title = document.createElement("h3");
      title.className = "card-title";
      title.textContent = asset.name;

      const category = document.createElement("div");
      category.className = "card-category";
      category.textContent = CATEGORIES.find((c) => c.id === asset.category)?.label || asset.category;

      body.append(title, category);
      card.append(preview, body);

      card.addEventListener("click", () => {
        createModal(modalEl, {
          title: "Detalle del asset",
          previewNode: getPlaceholderSVG(),
          name: asset.name,
          category: CATEGORIES.find((c) => c.id === asset.category)?.label || asset.category,
          path: asset.path,
        });
      });

      gridEl.appendChild(card);
    });
  }

  searchInput.addEventListener("input", (e) => {
    query = e.target.value;
    renderGrid();
  });

  modalEl.querySelectorAll("[data-close-modal]").forEach((btn) => {
    btn.addEventListener("click", () => closeModal(modalEl));
  });

  renderCategories();
  renderGrid();
}
