/**
 * likes.js — Gestión de likes y dislikes persistentes
 */

import API from "./api.js";
import UI from "./ui.js";

const Likes = {
  // Registra el click de like/dislike y actualiza la UI
  async toggleLike(platoId, accion, btnLike, btnDislike) {
    try {
      btnLike.disabled = true;
      btnDislike.disabled = true;

      const resultado = await (accion === "like"
        ? API.darLike(platoId)
        : API.darDislike(platoId));

      // Actualizar contadores en el botón
      btnLike.querySelector(".like-count").textContent = resultado.likes;
      btnDislike.querySelector(".dislike-count").textContent = resultado.dislikes;

      UI.toast(
        accion === "like" ? "¡Te gustó este plato! 👍" : "Registramos tu opinión 👎",
        "success"
      );

      // Pequeña animación de bounce
      const btn = accion === "like" ? btnLike : btnDislike;
      btn.classList.add("btn-bounce");
      setTimeout(() => btn.classList.remove("btn-bounce"), 400);

      // Re-habilitar tras 1s para evitar spam
      setTimeout(() => {
        btnLike.disabled = false;
        btnDislike.disabled = false;
      }, 1000);

      return resultado;
    } catch (err) {
      UI.toast("Error al registrar voto: " + err.message, "error");
      btnLike.disabled = false;
      btnDislike.disabled = false;
    }
  },

  // Crea el bloque HTML de botones like/dislike
  renderBotones(plato) {
    return `
      <div class="likes-wrapper" data-plato-id="${plato.id}">
        <button class="btn-like" data-accion="like" title="Me gusta">
            👍
            <span class="like-count">${plato.likes}</span>
        </button>
        <button class="btn-dislike" data-accion="dislike" title="No me gusta">
            👎
            <span class="dislike-count">${plato.dislikes}</span>
        </button>
      </div>
    `;
  },

  // Inicializa event listeners en un contenedor
  initListeners(container) {
    container.querySelectorAll(".likes-wrapper").forEach((wrapper) => {
      const platoId = wrapper.dataset.platoId;
      const btnLike = wrapper.querySelector(".btn-like");
      const btnDislike = wrapper.querySelector(".btn-dislike");

      btnLike.addEventListener("click", () =>
        Likes.toggleLike(platoId, "like", btnLike, btnDislike)
      );
      btnDislike.addEventListener("click", () =>
        Likes.toggleLike(platoId, "dislike", btnLike, btnDislike)
      );
    });
  },
};

export default Likes;
