const BASE_URL = "http://127.0.0.1:3000";

/**
 * Mengambil data admin yang sedang login
 */
async function loadAdmin() {
  try {
    const response = await fetch(`${BASE_URL}/api/me`, {
      method: "GET",
      credentials: "include",
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      window.location.href = `${BASE_URL}/login.html`;
      return null;
    }

    const admin = result.data;

    if (!admin || admin.role !== "admin") {
      alert("Akses ditolak. Halaman ini hanya untuk administrator.");

      window.location.href = `${BASE_URL}/login.html`;

      return null;
    }

    // =========================
    // NAMA ADMIN
    // =========================
    const namaAdminElements = document.querySelectorAll("[data-admin-nama]");

    namaAdminElements.forEach((element) => {
      element.textContent = admin.nama || "Administrator";
    });

    // Support ID lama
    const namaAdmin = document.getElementById("namaAdmin");

    if (namaAdmin) {
      namaAdmin.textContent = admin.nama || "Administrator";
    }

    // =========================
    // TEKNIS ADMIN
    // =========================
    const teknisAdminElements = document.querySelectorAll(
      "[data-admin-teknis]",
    );

    teknisAdminElements.forEach((element) => {
      element.textContent = admin.teknis || "Administrator";
    });

    // Support ID lama
    const teknisAdmin = document.getElementById("teknisAdmin");

    if (teknisAdmin) {
      teknisAdmin.textContent = admin.teknis || "Administrator";
    }

    return admin;
  } catch (error) {
    console.error("Error load admin:", error);

    window.location.href = `${BASE_URL}/login.html`;

    return null;
  }
}

/**
 * Logout admin
 */
async function logout() {
  const konfirmasi = window.confirm(
    "Apakah Anda yakin ingin keluar dari aplikasi?",
  );

  if (!konfirmasi) {
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/api/logout`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      console.warn("Response logout tidak berhasil.");
    }
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    window.location.href = `${BASE_URL}/login.html`;
  }
}

/**
 * Pastikan fungsi bisa dipanggil dari HTML
 */
window.logout = logout;
window.loadAdmin = loadAdmin;

/**
 * Load admin setelah DOM siap
 */
document.addEventListener("DOMContentLoaded", async () => {
  await loadAdmin();
});
