export function renderNavigation(nav, onNavigate) {
  nav.innerHTML = "";

  const items = [
    { id: "home", label: "Inicio" },
    { id: "archive", label: "Archivo Galá¡¡ctico" },
  ];

  items.forEach((item) => {
    const btn = document.createElement("button");
    btn.className = "btn";
    btn.textContent = item.label;
    btn.addEventListener("click", () => onNavigate(item.id));
    nav.appendChild(btn);
  });
}
