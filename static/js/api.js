/**
 * api.js — Capa de comunicación con la API REST de Flask
 * Restaurante "El Buen Sabor"
 */

const API = {
  BASE: "/api",

  async request(method, endpoint, body = null) {
    const opts = {
      method,
      headers: { "Content-Type": "application/json" },
    };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(this.BASE + endpoint, opts);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error en la solicitud");
    return data;
  },

  // ── Platos ──
  getPlatos: () => API.request("GET", "/platos"),
  getPlato: (id) => API.request("GET", `/platos/${id}`),
  crearPlato: (data) => API.request("POST", "/platos", data),
  editarPlato: (id, data) => API.request("PUT", `/platos/${id}`, data),
  eliminarPlato: (id) => API.request("DELETE", `/platos/${id}`),

  // ── Likes ──
  darLike: (id) => API.request("POST", `/platos/${id}/like`, { accion: "like" }),
  darDislike: (id) => API.request("POST", `/platos/${id}/like`, { accion: "dislike" }),

  // ── Comentarios ──
  agregarComentario: (id, comentario, autor) =>
    API.request("POST", `/platos/${id}/comentarios`, { comentario, autor }),
  eliminarComentario: (comentarioId) =>
    API.request("DELETE", `/comentarios/${comentarioId}`),

  // ── Estadísticas ──
  getEstadisticas: () => API.request("GET", "/estadisticas"),
};

export default API;
