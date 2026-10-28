/**
 * admin.js — Panel de Administración
 * Crear, editar y eliminar platos
 */

import API from "./api.js";
import UI from "./ui.js";

let platosData = [];
let modoEdicion = null;  // null = crear, string (P001, P002...) = editar

async function init() {
  UI.initDarkMode();
  UI.showLoader();
  try {
    platosData = await API.getPlatos();
    document.dispatchEvent(new CustomEvent("admin:platos-cargados", { detail: platosData }));
    renderTabla();
  } catch (err) {
    UI.toast("Error al cargar platos: " + err.message, "error");
  } finally {
    UI.hideLoader();
  }

  document.getElementById("btn-nuevo")?.addEventListener("click", abrirModalCrear);
  document.getElementById("form-plato")?.addEventListener("submit", handleSubmit);
  document.getElementById("btn-cancelar")?.addEventListener("click", cerrarModal);
  document.getElementById("modal-overlay")?.addEventListener("click", (e) => {
    if (e.target === e.currentTarget) cerrarModal();
  });
}

function renderTabla() {
  const tbody = document.getElementById("admin-tbody");
  if (!tbody) return;

  if (platosData.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">No hay platos registrados</td></tr>`;
    return;
  }

  tbody.innerHTML = platosData
    .map(
      (p) => `
      <tr data-id="${p.id}">
        <td>${p.id}</td>
        <td>
          <div class="admin-plato-cell">
            <img src="${UI.imagenPorId(p)}" alt="${p.nombre}" class="admin-thumb" />
            <strong>${p.nombre}</strong>
          </div>
        </td>
        <td>${p.descripcion ? p.descripcion.substring(0, 50) + "…" : "—"}</td>
        <td>S/ ${Number(p.precio || 0).toFixed(2)}</td>
        <td>
          <span class="text-success">👍 ${p.likes}</span> /
          <span class="text-danger">👎 ${p.dislikes}</span>
        </td>
        <td>
          <div class="admin-actions">
            <button class="btn-admin-edit" data-id="${p.id}" title="Editar">
              <i class="bi bi-pencil-fill"></i>
            </button>
            <button class="btn-admin-del" data-id="${p.id}" title="Eliminar">
              <i class="bi bi-trash-fill"></i>
            </button>
          </div>
        </td>
      </tr>`
    )
    .join("");

  // Listeners
  tbody.querySelectorAll(".btn-admin-edit").forEach((btn) => {
    btn.addEventListener("click", () => abrirModalEditar(btn.dataset.id));
  });
  tbody.querySelectorAll(".btn-admin-del").forEach((btn) => {
    btn.addEventListener("click", () => confirmarEliminar(btn.dataset.id));
  });
}

function abrirModalCrear() {
  modoEdicion = null;
  limpiarForm();
  document.getElementById("modal-titulo").textContent = "➕ Nuevo Plato";
  document.getElementById("modal-overlay").classList.add("show");
}

function abrirModalEditar(id) {
  modoEdicion = id;
  const plato = platosData.find((p) => p.id === id);
  if (!plato) return;

  document.getElementById("input-nombre").value = plato.nombre || "";
  document.getElementById("input-descripcion").value = plato.descripcion || "";
  document.getElementById("input-precio").value = plato.precio || "";
  document.getElementById("input-imagen").value = plato.imagen || "";
  document.getElementById("modal-titulo").textContent = `✏️ Editar: ${plato.nombre}`;
  document.getElementById("modal-overlay").classList.add("show");
}

function cerrarModal() {
  document.getElementById("modal-overlay").classList.remove("show");
  limpiarForm();
}

function limpiarForm() {
  ["input-nombre", "input-descripcion", "input-precio", "input-imagen"].forEach(
    (id) => (document.getElementById(id).value = "")
  );
}

async function handleSubmit(e) {
  e.preventDefault();
  const nombre = document.getElementById("input-nombre").value.trim();
  const descripcion = document.getElementById("input-descripcion").value.trim();
  const precio = parseFloat(document.getElementById("input-precio").value) || 0;
  const imagen = document.getElementById("input-imagen").value.trim();

  if (!nombre) {
    UI.toast("El nombre es obligatorio", "warning");
    return;
  }

  const btn = document.getElementById("btn-guardar");
  btn.disabled = true;

  try {
    if (modoEdicion !== null) {
      await API.editarPlato(modoEdicion, { nombre, descripcion, precio, imagen });
      UI.toast("Plato actualizado correctamente ✏️", "success");
    } else {
      await API.crearPlato({ nombre, descripcion, precio, imagen });
      UI.toast("¡Plato creado exitosamente! 🎉", "success");
    }
    cerrarModal();
    platosData = await API.getPlatos();
    document.dispatchEvent(new CustomEvent("admin:platos-cargados", { detail: platosData }));
    renderTabla();
  } catch (err) {
    UI.toast("Error: " + err.message, "error");
  } finally {
    btn.disabled = false;
  }
}

async function confirmarEliminar(id) {
  const plato = platosData.find((p) => p.id === id);
  if (!plato) return;

  const confirmEl = document.getElementById("confirm-overlay");
  document.getElementById("confirm-nombre").textContent = plato.nombre;
  confirmEl.classList.add("show");

  document.getElementById("btn-confirm-si").onclick = async () => {
    confirmEl.classList.remove("show");
    try {
      await API.eliminarPlato(id);
      UI.toast(`"${plato.nombre}" eliminado`, "info");
      platosData = await API.getPlatos();
      document.dispatchEvent(new CustomEvent("admin:platos-cargados", { detail: platosData }));
      renderTabla();
    } catch (err) {
      UI.toast("Error al eliminar: " + err.message, "error");
    }
  };

  document.getElementById("btn-confirm-no").onclick = () => {
    confirmEl.classList.remove("show");
  };
}

document.addEventListener("DOMContentLoaded", init);
