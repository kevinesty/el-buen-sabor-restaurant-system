/**
 * main.js — Orquestador principal de la página de platos
 * Búsqueda, filtros, carrusel, render de platos
 */

import API from "./api.js";
import UI from "./ui.js";
import Likes from "./likes.js";
import Comentarios from "./comentarios.js";

let todosLosPlatos = [];
let indiceCarrusel = 0;

// ─── Inicialización ───
async function init() {

    console.log("1️⃣ Entró a init");
    UI.initDarkMode();
    UI.showLoader();

    try {
        console.log("2️⃣ Antes del fetch");
        todosLosPlatos = await API.getPlatos();

        console.log("3️⃣ Después del fetch");
        console.log(todosLosPlatos);

        console.log("4️⃣ Antes de renderPlatos");

        renderPlatos(todosLosPlatos);
        console.log("5️⃣ Después de renderPlatos");

        initBusqueda();
        console.log("6️⃣ initBusqueda OK");

        initFiltros();
        console.log("7️⃣ initFiltros OK");

        initCarrusel();
        console.log("8️⃣ initCarrusel OK");

    } catch (err) {
        console.error("❌ ERROR:", err);
        UI.toast("Error al cargar platos: " + err.message, "error");

    } finally {
        UI.hideLoader();
    }
}

document.addEventListener("DOMContentLoaded", init);
// ─── Render principal de platos ───
function renderPlatos(platos) {
  const container = document.getElementById("platos-grid");
  if (!container) return;

  container.innerHTML = "";

  if (platos.length === 0) {
    container.innerHTML = `<div class="sin-resultados">
      <span>🍽️</span><p>No se encontraron platos</p>
    </div>`;
    return;
  }

  platos.forEach((plato) => {
    const card = document.createElement("div");
    card.className = "plato-card";
    card.dataset.id = plato.id;

    card.innerHTML = `
      <div class="plato-card-img-wrap">
        <img src="${UI.imagenPorId(plato)}" alt="${plato.nombre}" loading="lazy" />
        <div class="plato-overlay">
          <span class="plato-precio">S/ ${Number(plato.precio || 0).toFixed(2)}</span>
        </div>
      </div>
      <div class="plato-card-body">
        <h3 class="plato-nombre">${plato.nombre}</h3>
        <p class="plato-desc">${plato.descripcion || "Delicioso plato tradicional peruano."}</p>
        <div class="plato-meta">
          ${UI.popularidadBadge(plato.likes, plato.dislikes)}
          <span class="badge bg-secondary">${plato.total_comentarios || 0} reseñas</span>
        </div>
        ${Likes.renderBotones(plato)}
        <hr class="divider" />
        <div class="comentarios-section" data-plato-id="${plato.id}">
          <h4 class="comentarios-titulo">💬 Reseñas</h4>
          <div class="comentarios-lista">
            ${Comentarios.renderLista(plato.comentarios)}
          </div>
          ${Comentarios.renderFormulario(plato.id)}
        </div>
      </div>
    `;

    container.appendChild(card);
  });

  // Inicializar listeners después de renderizar
  Likes.initListeners(container);
  Comentarios.initListeners(container, recargarComentarios);
}

// ─── Recargar comentarios de un plato específico ───
async function recargarComentarios(platoId) {
  try {
    const plato = await API.getPlato(platoId);
    const section = document.querySelector(
      `.comentarios-section[data-plato-id="${platoId}"]`
    );
    if (section) {
      const lista = section.querySelector(".comentarios-lista");
      if (lista) {
        lista.innerHTML = Comentarios.renderLista(plato.comentarios);
        // Re-init solo listeners de eliminar
        Comentarios.initListeners(section, recargarComentarios);
      }
    }
    // Actualizar en memoria
    const idx = todosLosPlatos.findIndex((p) => p.id == platoId);
    if (idx !== -1) todosLosPlatos[idx].comentarios = plato.comentarios;
  } catch (err) {
    console.error("Error recargando comentarios:", err);
  }
}

// ─── Búsqueda en tiempo real ───
function initBusqueda() {
  const input = document.getElementById("buscador");
  if (!input) return;
  input.addEventListener("input", () => {
    const q = input.value.toLowerCase().trim();
    const filtrados = q
      ? todosLosPlatos.filter((p) => p.nombre.toLowerCase().includes(q))
      : todosLosPlatos;
    renderPlatos(filtrados);
  });
}

// ─── Filtros ───
function initFiltros() {
  const btns = document.querySelectorAll("[data-filtro]");
  btns.forEach((btn) => {
    btn.addEventListener("click", () => {
      btns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      aplicarFiltro(btn.dataset.filtro);
    });
  });
}

function aplicarFiltro(tipo) {
  let ordenados = [...todosLosPlatos];
  switch (tipo) {
    case "mas-populares":
      ordenados.sort((a, b) => b.likes - a.likes);
      break;
    case "menos-populares":
      ordenados.sort((a, b) => a.likes - b.likes);
      break;
    case "mas-comentados":
      ordenados.sort(
        (a, b) => (b.total_comentarios || 0) - (a.total_comentarios || 0)
      );
      break;
    default:
      break;
  }
  renderPlatos(ordenados);
}

// ─── Carrusel ───
function initCarrusel() {
  const btnPrev = document.getElementById("carousel-prev");
  const btnNext = document.getElementById("carousel-next");

  if (btnPrev) {
    btnPrev.addEventListener("click", () => {
      indiceCarrusel =
        (indiceCarrusel - 1 + todosLosPlatos.length) % todosLosPlatos.length;
      renderCarruselSlide();
    });
  }
  if (btnNext) {
    btnNext.addEventListener("click", () => {
      indiceCarrusel = (indiceCarrusel + 1) % todosLosPlatos.length;
      renderCarruselSlide();
    });
  }

  renderCarruselSlide();
}

function renderCarruselSlide() {
  const plato = todosLosPlatos[indiceCarrusel];
  if (!plato) return;

  const img = document.getElementById("carousel-img");
  const nombre = document.getElementById("carousel-nombre");
  const desc = document.getElementById("carousel-desc");
  const dots = document.querySelectorAll(".carousel-dot");

  if (img) {
    img.style.opacity = "0";
    setTimeout(() => {
      img.src = UI.imagenPorId(plato);
      img.alt = plato.nombre;
      img.style.opacity = "1";
    }, 200);
  }
  if (nombre) nombre.textContent = plato.nombre;
  if (desc)
    desc.textContent =
      plato.descripcion || "Delicioso plato tradicional peruano.";

  dots.forEach((dot, i) => dot.classList.toggle("active", i === indiceCarrusel));
}

// ─── Arrancar ───
document.addEventListener("DOMContentLoaded", init);
  