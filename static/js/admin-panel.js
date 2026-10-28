/**
 * admin-panel.js — Panel resumen del Dashboard del Administrador
 * KPIs y resumen de actividad, calculados a partir de los datos
 * que ya obtiene admin.js (evento "admin:platos-cargados").
 * No realiza ninguna llamada propia a la API.
 */

import UI from "./ui.js";

// ── KPIs (lógica adaptada de dashboard.js -> renderKPIs) ──
function renderKPIs(datos) {
  const totalLikes = datos.reduce((s, d) => s + d.likes, 0);
  const totalDislikes = datos.reduce((s, d) => s + d.dislikes, 0);
  const totalComentarios = datos.reduce((s, d) => s + (d.total_comentarios || 0), 0);
  const masPopular = datos.reduce((a, b) => (a.likes > b.likes ? a : b), datos[0] || {});

  document.getElementById("kpi-likes").textContent = totalLikes;
  document.getElementById("kpi-dislikes").textContent = totalDislikes;
  document.getElementById("kpi-comentarios").textContent = totalComentarios;
  document.getElementById("kpi-popular").textContent = masPopular?.nombre || "—";
}

// ── Resumen de actividad ──
// Estructura confirmada en controllers/platos_controller.py -> obtener_platos():
// cada plato incluye "comentarios": [{ id, comentario, autor, fecha }]
function renderActividad(platos) {
  const lista = document.getElementById("activity-list");
  if (!lista) return;

  const comentarios = platos
    .flatMap((p) => (Array.isArray(p.comentarios) ? p.comentarios : []).map((c) => ({ ...c, plato: p.nombre })))
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
    .slice(0, 5);

  if (comentarios.length === 0) {
    lista.innerHTML = `<li class="activity-item text-muted">Sin actividad reciente</li>`;
    return;
  }

  lista.innerHTML = comentarios
    .map(
      (c) => `
      <li class="activity-item">
        <span class="activity-icon">💬</span>
        <span class="activity-text">
          <strong>${c.autor || "Anónimo"}</strong> comentó en <strong>${c.plato}</strong>
        </span>
        <span class="activity-date">${UI.formatFecha(c.fecha)}</span>
      </li>`
    )
    .join("");
}

function actualizarPanel(datos) {
  if (!Array.isArray(datos)) return;
  renderKPIs(datos);
  renderActividad(datos);
}

// ── Acciones rápidas ──
function initAccionesRapidas() {
  // Reutiliza el botón "Nuevo Plato" y el modal ya manejados por admin.js
  document.getElementById("qa-nuevo-plato")?.addEventListener("click", () => {
    document.getElementById("btn-nuevo")?.click();
  });

  // Desplazamiento suave hacia la sección de gestión (sin ocultarla)
  document.getElementById("qa-gestionar-platos")?.addEventListener("click", () => {
    document.getElementById("gestion-platos")?.scrollIntoView({ behavior: "smooth" });
  });
}

function init() {
  // Escucha los datos ya obtenidos por admin.js (sin duplicar la petición)
  document.addEventListener("admin:platos-cargados", (e) => {
    actualizarPanel(e.detail);
  });

  initAccionesRapidas();
}

document.addEventListener("DOMContentLoaded", init);