/* css/faction-selection.css */
/* Estilos aislados para la selección de facción. */

.faction-selection-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: none;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background:
    radial-gradient(circle at center, rgba(42, 55, 125, 0.96), rgba(5, 7, 28, 0.99) 72%),
    #05071c;
  overflow-y: auto;
}

.faction-selection-panel {
  width: min(960px, 100%);
  max-height: 100%;
  padding: 24px;
  color: #ffffff;
}

.faction-selection-header {
  margin-bottom: 24px;
  text-align: center;
}

.faction-selection-kicker {
  display: block;
  margin-bottom: 8px;
  color: #ffd54f;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.18em;
}

.faction-selection-header h2 {
  margin: 0 0 10px;
  color: #ffffff;
  font-size: clamp(28px, 6vw, 48px);
}

.faction-selection-header p {
  max-width: 620px;
  margin: 0 auto;
  color: #c7cbea;
  font-size: 15px;
  line-height: 1.5;
}

.faction-selection-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.faction-card {
  position: relative;
  display: flex;
  min-height: 360px;
  flex-direction: column;
  padding: 22px;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--faction-color) 55%, #ffffff 10%);
  border-radius: 18px;
  background:
    linear-gradient(
      145deg,
      color-mix(in srgb, var(--faction-color) 22%, #11152f),
      rgba(7, 10, 30, 0.96)
    );
  box-shadow:
    0 12px 36px rgba(0, 0, 0, 0.35),
    inset 0 0 28px color-mix(in srgb, var(--faction-color) 8%, transparent);
  color: #ffffff;
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition:
    transform 160ms ease,
    border-color 160ms ease,
    box-shadow 160ms ease;
}

.faction-card::before {
  position: absolute;
  top: 0;
  right: 0;
  width: 130px;
  height: 130px;
  border-radius: 50%;
  background: var(--faction-color);
  content: "";
  filter: blur(48px);
  opacity: 0.18;
  pointer-events: none;
}

.faction-card:hover,
.faction-card:focus-visible {
  border-color: var(--faction-color);
  box-shadow:
    0 16px 44px rgba(0, 0, 0, 0.45),
    0 0 24px color-mix(in srgb, var(--faction-color) 25%, transparent);
  outline: none;
  transform: translateY(-4px);
}

.faction-card:active {
  transform: translateY(-1px);
}

.faction-card-top {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.faction-card-icon {
  display: grid;
  width: 48px;
  height: 48px;
  place-items: center;
  border: 1px solid var(--faction-color);
  border-radius: 50%;
  background: color-mix(in srgb, var(--faction-color) 18%, #090c26);
  font-size: 25px;
}

.faction-card-name {
  color: var(--faction-color);
  font-size: 21px;
  font-weight: 800;
}

.faction-card-description {
  min-height: 72px;
  margin: 0 0 18px;
  color: #d3d6e8;
  font-size: 14px;
  line-height: 1.5;
}

.faction-card-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 12px;
  color: #e7e9f5;
  font-size: 13px;
  line-height: 1.4;
}

.faction-card-section strong {
  color: #ffffff;
  font-size: 15px;
}

.faction-card-label {
  color: #959bc2;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.faction-card-resources {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
}

.faction-card-resources span {
  padding: 6px 8px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.08);
}

.faction-card-action {
  display: block;
  margin-top: 18px;
  color: var(--faction-color);
  font-size: 14px;
  font-weight: 800;
  text-align: center;
}

@media (max-width: 680px) {
  .faction-selection-overlay {
    align-items: flex-start;
    padding: 16px 12px 28px;
  }

  .faction-selection-panel {
    padding: 8px 0;
  }

  .faction-selection-header {
    margin-bottom: 18px;
  }

  .faction-selection-header h2 {
    font-size: 30px;
  }

  .faction-selection-header p {
    font-size: 13px;
  }

  .faction-selection-grid {
    grid-template-columns: 1fr;
    gap: 14px;
  }

  .faction-card {
    min-height: 0;
    padding: 18px;
  }

  .faction-card-description {
    min-height: 0;
  }
}
