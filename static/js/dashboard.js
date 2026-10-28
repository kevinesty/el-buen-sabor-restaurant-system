/**
 * dashboard.js — Dashboard de estadísticas con Chart.js
 */

import API from "./api.js";
import UI from "./ui.js";

const Dashboard = {
  charts: {},

  async init() {
    UI.showLoader();
    try {
      const datos = await API.getEstadisticas();
      this.renderKPIs(datos);
      this.renderChartLikesDislikes(datos);
      this.renderChartComentarios(datos);
      this.renderChartPopularidad(datos);
      this.renderTabla(datos);
    } catch (err) {
      UI.toast("Error al cargar estadísticas: " + err.message, "error");
    } finally {
      UI.hideLoader();
    }
  },

  renderKPIs(datos) {
    const totalLikes = datos.reduce((s, d) => s + d.likes, 0);
    const totalDislikes = datos.reduce((s, d) => s + d.dislikes, 0);
    const totalComentarios = datos.reduce((s, d) => s + d.total_comentarios, 0);
    const masPopular = datos.reduce((a, b) => (a.likes > b.likes ? a : b), datos[0] || {});

    document.getElementById("kpi-likes").textContent = totalLikes;
    document.getElementById("kpi-dislikes").textContent = totalDislikes;
    document.getElementById("kpi-comentarios").textContent = totalComentarios;
    document.getElementById("kpi-popular").textContent = masPopular?.nombre || "—";
  },

  renderChartLikesDislikes(datos) {
    const ctx = document.getElementById("chart-likes")?.getContext("2d");
    if (!ctx) return;
    if (this.charts.likes) this.charts.likes.destroy();

    const isDark = document.body.classList.contains("dark");
    const textColor = isDark ? "#e2e8f0" : "#2d3748";

    this.charts.likes = new Chart(ctx, {
      type: "bar",
      data: {
          labels: datos.map(
              d => `${d.nombre} (${d.total_comentarios})`
          ),
        datasets: [
          {
            label: "👍 Likes",
            data: datos.map((d) => d.likes),
            backgroundColor: "rgba(72, 199, 142, 0.8)",
            borderColor: "#48c78e",
            borderWidth: 2,
            borderRadius: 8,
          },
          {
            label: "👎 Dislikes",
            data: datos.map((d) => d.dislikes),
            backgroundColor: "rgba(241, 70, 104, 0.8)",
            borderColor: "#f14668",
            borderWidth: 2,
            borderRadius: 8,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { labels: { color: textColor } },
          tooltip: { mode: "index" },
        },
        scales: {
          x: { ticks: { color: textColor }, grid: { display: false } },
          y: { ticks: { color: textColor }, beginAtZero: true },
        },
      },
    });
  },

  renderChartComentarios(datos) {
    const ctx = document.getElementById("chart-comentarios")?.getContext("2d");
    if (!ctx) return;
    if (this.charts.comentarios) this.charts.comentarios.destroy();

    const isDark = document.body.classList.contains("dark");
    const textColor = isDark ? "#e2e8f0" : "#2d3748";

    const palette = [
      "#f6c90e", "#3fc1c9", "#fc5185", "#43aa8b",
      "#f8961e", "#577590", "#9b5de5",
    ];

    this.charts.comentarios = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: datos.map((d) => d.nombre),
        datasets: [
          {
            data: datos.map((d) => d.total_comentarios),
            backgroundColor: datos.map((_, i) =>
            palette[i % palette.length]
            ),
            borderWidth: 3,
            borderColor: isDark ? "#1a1f2e" : "#ffffff",
          },
        ],
      },
      options: {
        responsive: true,
        cutout: "65%",
        plugins: {
          legend: {
            position: "bottom",
            labels: { color: textColor, padding: 16 },
          },
        },
      },
    });
  },

  renderChartPopularidad(datos) {
    const ctx = document.getElementById("chart-popularidad")?.getContext("2d");
    if (!ctx) return;
    if (this.charts.popularidad) this.charts.popularidad.destroy();

    const isDark = document.body.classList.contains("dark");
    const textColor = isDark ? "#e2e8f0" : "#2d3748";

    const scores = datos.map((d) => {
      const total = d.likes + d.dislikes;
      return total > 0 ? Math.round((d.likes / total) * 100) : 0;
    });

    this.charts.popularidad = new Chart(ctx, {
      type: "radar",
      data: {
        labels: datos.map((d) => d.nombre),
        datasets: [
          {
            label: "% Popularidad",
            data: scores,
            backgroundColor: "rgba(99, 179, 237, 0.25)",
            borderColor: "#63b3ed",
            borderWidth: 2,
            pointBackgroundColor: "#63b3ed",
            pointRadius: 5,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            ticks: { color: textColor, stepSize: 20 },
            grid: { color: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)" },
            pointLabels: { color: textColor, font: { size: 12 } },
          },
        },
        plugins: { legend: { labels: { color: textColor } } },
      },
    });
  },

  renderTabla(datos) {
    const tbody = document.getElementById("tabla-stats");
    if (!tbody) return;

    const ordenado = [...datos].sort((a, b) => b.likes - a.likes);
    tbody.innerHTML = ordenado
      .map(
        (d, i) => `
        <tr>
          <td><span class="rank-badge">#${i + 1}</span></td>
          <td><strong>${d.nombre}</strong></td>
          <td><span class="text-success fw-bold">👍 ${d.likes}</span></td>
          <td><span class="text-danger fw-bold">👎 ${d.dislikes}</span></td>
          <td>${d.total_comentarios}</td>
          <td>${UI.popularidadBadge(d.likes, d.dislikes)}</td>
        </tr>`
      )
      .join("");
  },
};

export default Dashboard;
