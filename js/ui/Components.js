export function createModal(modalEl, { title, previewNode, name, category, path }) {
  const titleEl = modalEl.querySelector("#archive-modal-title");
  const previewEl = modalEl.querySelector("#detail-preview");
  const nameEl = modalEl.querySelector("#detail-name");
  const categoryEl = modalEl.querySelector("#detail-category");
  const pathEl = modalEl.querySelector("#detail-path");

  titleEl.textContent = title || "Detalle del asset";
  previewEl.innerHTML = "";
  previewEl.appendChild(previewNode.cloneNode(true));
  nameEl.textContent = name || "—";
  categoryEl.textContent = category || "—";
  pathEl.textContent = path || "—";

  modalEl.hidden = false;
}

export function closeModal(modalEl) {
  modalEl.hidden = true;
}
