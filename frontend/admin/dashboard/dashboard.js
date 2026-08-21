document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "http://127.0.0.1:3000/api/dashboard/admin";
  const bulanLabels = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  const canvas = document.getElementById("progressChart");
  const btnBack = document.getElementById("btnBackToYearly");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  Chart.defaults.font.family = "Nunito,sans-serif";
  Chart.defaults.font.weight = "600";
  Chart.defaults.color = "#52657d";
  let currentYear = new Date().getFullYear();
  let currentView = "YEARLY";
  let currentSelectedMonth = "";
  let progressChart = null;

  async function getData(url) {
    try {
      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const result = await response.json();
      if (response.status === 401 || response.status === 403) {
        alert(result.message || "Sesi login telah berakhir.");
        window.location.href = "../../login.html";
        return null;
      }
      if (!response.ok || !result.success)
        throw new Error(result.message || "Gagal mengambil data dashboard");
      return result;
    } catch (error) {
      throw error;
    }
  }

  function isAdmin(item) {
    const role = String(item.role ?? item.user_role ?? item.userRole ?? "")
      .trim()
      .toLowerCase();
    return role === "admin";
  }

  function buatArrayTahunan(data) {
    const kegiatan = Array(12).fill(0);
    const tl = Array(12).fill(0);
    data
      .filter((item) => !isAdmin(item))
      .forEach((item) => {
        const index = Number(item.bulan) - 1;
        if (index >= 0 && index < 12) {
          kegiatan[index] = Number(item.kegiatan) || 0;
          tl[index] = Number(item.tl) || 0;
        }
      });
    return { kegiatan, tl };
  }

  function buatChart() {
    progressChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: bulanLabels,
        datasets: [
          {
            label: "Kegiatan",
            data: Array(12).fill(0),
            backgroundColor: "#3264b5",
            borderRadius: 7,
            barPercentage: 0.58,
            categoryPercentage: 0.72,
          },
          {
            label: "Tindak Lanjut",
            data: Array(12).fill(0),
            backgroundColor: "#f0a35b",
            borderRadius: 7,
            barPercentage: 0.58,
            categoryPercentage: 0.72,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        onHover: (event, elements) => {
          if (event.native)
            event.native.target.style.cursor =
              elements.length > 0 && currentView === "YEARLY"
                ? "pointer"
                : "default";
        },
        onClick: (event, elements) => {
          if (elements.length > 0 && currentView === "YEARLY") {
            showMonthlyDetail(elements[0].index + 1);
          }
        },
        plugins: {
          title: {
            display: true,
            text: `Progress SKALA - ${currentYear}`,
            font: { family: "Nunito", size: 20, weight: "800" },
            color: "#172033",
            padding: { bottom: 28 },
          },
          legend: {
            position: "bottom",
            labels: {
              usePointStyle: true,
              pointStyle: "circle",
              padding: 20,
              font: { family: "Nunito", size: 12, weight: "700" },
              color: "#52657d",
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              color: "#71839a",
              font: { family: "Nunito", weight: "600" },
            },
            grid: { color: "#edf1f5" },
          },
          x: {
            grid: { display: false },
            ticks: {
              maxRotation: 0,
              minRotation: 0,
              color: "#52657d",
              font: { family: "Nunito", size: 11, weight: "700" },
            },
          },
        },
      },
    });
  }

  function tampilkanTahunan(data) {
    currentView = "YEARLY";
    currentSelectedMonth = "";
    btnBack.style.display = "none";
    progressChart.data.labels = bulanLabels;
    progressChart.data.datasets[0].data = data.kegiatan;
    progressChart.data.datasets[1].data = data.tl;
    progressChart.options.plugins.title.text = `Progress SKALA - ${currentYear}`;
    progressChart.update();
  }

  async function loadDashboard() {
    try {
      const result = await getData(`${API_URL}?tahun=${currentYear}`);
      if (!result) return;
      const data = buatArrayTahunan(result.data || []);
      tampilkanTahunan(data);
    } catch (error) {
      console.error("Gagal mengambil dashboard:", error);
      alert(error.message || "Gagal mengambil data dashboard");
    }
  }

  async function showMonthlyDetail(bulan) {
    try {
      currentView = "MONTHLY";
      currentSelectedMonth = bulan;
      btnBack.style.display = "inline-flex";
      const result = await getData(
        `${API_URL}/monthly?tahun=${currentYear}&bulan=${bulan}`,
      );
      if (!result) return;
      const data = (result.data || []).filter((item) => !isAdmin(item));
      const labels = [];
      const kegiatan = [];
      const tl = [];
      data.forEach((item) => {
        labels.push(item.nama || "-");
        kegiatan.push(Number(item.kegiatan) || 0);
        tl.push(Number(item.tl) || 0);
      });
      progressChart.data.labels = labels;
      progressChart.data.datasets[0].data = kegiatan;
      progressChart.data.datasets[1].data = tl;
      progressChart.options.plugins.title.text = `Progress SKALA - ${bulanLabels[bulan - 1]} ${currentYear}`;
      progressChart.update();
    } catch (error) {
      console.error("Gagal mengambil detail bulan:", error);
      alert(error.message || "Gagal mengambil detail bulan");
    }
  }

  async function showYearlyDetail() {
    await loadDashboard();
  }

  if (btnBack) btnBack.addEventListener("click", showYearlyDetail);
  buatChart();
  loadDashboard();
});
