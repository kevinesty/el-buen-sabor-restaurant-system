/**
 * comentarios.js — Sistema dinámico de comentarios
 */

import API from "./api.js";
import UI from "./ui.js";

const Comentarios = {
  // Renderiza lista de comentarios
  renderLista(comentarios) {
    if (!comentarios || comentarios.length === 0) {
      return `<p class="sin-comentarios">Sé el primero en comentar 💬</p>`;
    }
    return comentarios
      .map(
        (c) => `
        <div class="comentario-item" data-id="${c.id}">
          <div class="comentario-avatar">${(c.autor || "A")[0].toUpperCase()}</div>
          <div class="comentario-body">
            <strong>${c.autor || "Anónimo"}</strong>
            <span class="comentario-fecha">${UI.formatFecha(c.fecha)}</span>
            <p>${c.comentario}</p>
          </div>
          <button class="btn-del-comentario" data-id="${c.id}" title="Eliminar">✕</button>
        </div>`
      )
      .join("");
  },

  // Renderiza formulario de nuevo comentario
  renderFormulario(platoId) {
    return `
      <div class="comentario-form" data-plato-id="${platoId}">
        <input type="text" class="input-autor" placeholder="Tu nombre (opcional)" maxlength="50" />
        <textarea class="input-comentario" placeholder="¿Qué opinas de este plato?" rows="2" maxlength="300"></textarea>
        <button class="btn-enviar-comentario">
          <i class="bi bi-send-fill"></i> Enviar
        </button>
      </div>
    `;
  },

  // Inicializa listeners de comentarios en un contenedor
  initListeners(container, onActualizar) {
    // Enviar comentario
    container.querySelectorAll(".btn-enviar-comentario").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const form = btn.closest(".comentario-form");
        const platoId = form.dataset.platoId;
        const texto = form.querySelector(".input-comentario").value.trim();
        const autor = form.querySelector(".input-autor").value.trim() || "Anónimo";

        if (!texto) {
          UI.toast("Escribe un comentario primero", "warning");
          return;
        }

        btn.disabled = true;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span>';

        try {
          await API.agregarComentario(platoId, texto, autor);
          form.querySelector(".input-comentario").value = "";
          form.querySelector(".input-autor").value = "";
          UI.toast("¡Comentario publicado! 🎉", "success");
          if (onActualizar) onActualizar(platoId);
        } catch (err) {
          UI.toast("Error: " + err.message, "error");
        } finally {
          btn.disabled = false;
          btn.innerHTML = '<i class="bi bi-send-fill"></i> Enviar';
        }
      });
    });

    // Eliminar comentario
    container.querySelectorAll(".btn-del-comentario").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        const item = btn.closest(".comentario-item");
        const platoId = item
          .closest("[data-plato-id]")
          ?.dataset.platoId;

        try {
          await API.eliminarComentario(id);
          item.style.opacity = "0";
          setTimeout(() => item.remove(), 300);
          UI.toast("Comentario eliminado", "info");
          if (onActualizar && platoId) onActualizar(platoId);
        } catch (err) {
          UI.toast("Error al eliminar: " + err.message, "error");
        }
      });
    });
  },
};

export default Comentarios;
