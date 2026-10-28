/**
 * ui.js — Componentes de UI reutilizables
 * Toast Notifications, Dark Mode, Loader, helpers
 */

const UI = {
  // ─── Toast Notifications ───
  toast(mensaje, tipo = "success", duracion = 3000) {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const icons = {
      success: "✓",
      error: "✕",
      warning: "⚠",
      info: "ℹ",
    };

    const toast = document.createElement("div");
    toast.className = `toast-item toast-${tipo}`;
    toast.innerHTML = `
      <span class="toast-icon">${icons[tipo] || "ℹ"}</span>
      <span class="toast-msg">${mensaje}</span>
    `;
    container.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add("show"));

    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 400);
    }, duracion);
  },

  // ─── Dark Mode ───
  initDarkMode() {
    const saved = localStorage.getItem("darkMode");
    if (saved === "true") {
      document.body.classList.add("dark");
    }
    const btn = document.getElementById("dark-mode-toggle");
    if (btn) {
      btn.addEventListener("click", () => {
        document.body.classList.toggle("dark");
        const isDark = document.body.classList.contains("dark");
        localStorage.setItem("darkMode", isDark);
        btn.innerHTML = isDark
          ? '<i class="bi bi-sun-fill"></i>'
          : '<i class="bi bi-moon-fill"></i>';
      });
      const isDark = document.body.classList.contains("dark");
      btn.innerHTML = isDark
        ? '<i class="bi bi-sun-fill"></i>'
        : '<i class="bi bi-moon-fill"></i>';
    }
  },

  // ─── Loader ───
  showLoader(id = "global-loader") {
    const el = document.getElementById(id);
    if (el) el.classList.remove("d-none");
  },

  hideLoader(id = "global-loader") {
    const el = document.getElementById(id);
    if (el) el.classList.add("d-none");
  },

  initPasswordToggles() {
      document.querySelectorAll("[data-password-toggle]").forEach((boton) => {
          boton.addEventListener("click", () => {
              const input = document.getElementById(
                  boton.dataset.passwordTarget
              );

              if (!input) return;

              const mostrarPassword = input.type === "password";

              input.type = mostrarPassword ? "text" : "password";

              boton.innerHTML = mostrarPassword
                  ? '<i class="bi bi-eye-slash"></i>'
                  : '<i class="bi bi-eye"></i>';
          });
      });
  },

  // ─── Renderizar estrellas de popularidad ───
  popularidadBadge(likes, dislikes) {
    const total = likes + dislikes;
    if (total === 0) return `<span class="badge bg-secondary">Sin votos</span>`;
    const pct = Math.round((likes / total) * 100);
    let color = pct >= 70 ? "success" : pct >= 40 ? "warning" : "danger";
    return `<span class="badge bg-${color}">${pct}% positivo</span>`;
  },

  // ─── Imagen de plato por ID (mapeo) ───
imagenPorId(plato) {
    if (plato.imagen && plato.imagen.trim() !== "") {
        return `/static/img/${plato.imagen}`;
    }

    const mapa = {
        P001: "arroz_con_pollo.jpg",
        P002: "lomo_saltado.jpeg",
        P003: "ceviche.jpg",
        P004: "causa.jpg",
        P005: "ensalada_rusa.jpg"
    };

    return `/static/img/${mapa[plato.id] || "ceviche.jpg"}`;
},
  // ─── Formatear fecha legible ───
  formatFecha(fechaStr) {
    if (!fechaStr) return "";
    try {
      return new Date(fechaStr).toLocaleDateString("es-PE", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return fechaStr;
    }
  },
};

document.addEventListener("DOMContentLoaded", () => {
    UI.initPasswordToggles();
});

export default UI;
