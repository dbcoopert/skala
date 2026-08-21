const BASE_URL = "http://127.0.0.1:3000";

/* =========================================================
   LOAD USER
========================================================= */

async function loadUser(expectedRole = null) {
  try {
    const response = await fetch(`${BASE_URL}/api/me`, {
      credentials: "include",
    });

    const result = await response.json();

    /* =====================================================
       SESSION INVALID
    ====================================================== */

    if (!response.ok || !result.success) {
      window.location.href = "../login.html";

      return null;
    }

    /* =====================================================
       ROLE CHECK
    ====================================================== */

    if (expectedRole && result.data.role !== expectedRole) {
      alert("Anda tidak memiliki akses.");

      window.location.href = "../login.html";

      return null;
    }

    /* =====================================================
       ELEMENT
    ====================================================== */

    const nama = document.getElementById("namaUser");

    const role = document.getElementById("roleUser");

    const teknis = document.getElementById("teknisUser");

    /* =====================================================
       DESKTOP USER
    ====================================================== */

    if (nama) {
      nama.innerText = "Hallo " + (result.data.nama || "Pengguna");
    }

    if (role) {
      role.innerText = "Role : " + (result.data.role || "user");
    }

    if (teknis) {
      teknis.innerText = result.data.teknis || "-";
    }

    /* =====================================================
       MOBILE USER
       
       Dashboard juga melakukan sinkronisasi.
       Bagian ini dibuat sebagai fallback agar
       data tetap dinamis.
    ====================================================== */

    const mobileNama = document.getElementById("mobileNamaUser");

    const mobileRole = document.getElementById("mobileRoleUser");

    const mobileTeknis = document.getElementById("mobileTeknisUser");

    if (mobileNama) {
      mobileNama.innerText = "Hallo, " + (result.data.nama || "Pengguna");
    }

    if (mobileRole) {
      mobileRole.innerText = "Role : " + (result.data.role || "user");
    }

    if (mobileTeknis) {
      mobileTeknis.innerText = result.data.teknis || "-";
    }

    /* =====================================================
       MENU USER
    ====================================================== */

    const menuUserName = document.getElementById("menuUserName");

    const menuUserRole = document.getElementById("menuUserRole");

    const menuUserTeknis = document.getElementById("menuUserTeknis");

    if (menuUserName) {
      menuUserName.innerText = "Hallo, " + (result.data.nama || "Pengguna");
    }

    if (menuUserRole) {
      menuUserRole.innerText = "Role : " + (result.data.role || "user");
    }

    if (menuUserTeknis) {
      menuUserTeknis.innerText = result.data.teknis || "-";
    }

    return result.data;
  } catch (err) {
    console.error("Gagal mengambil data user:", err);

    window.location.href = "../login.html";

    return null;
  }
}

/* =========================================================
   LOGOUT

   Tidak lagi membuat tombol logout.
   Logout dipanggil dari menu burger dashboard.
========================================================= */

async function logout() {
  const confirmLogout = confirm("Apakah Anda yakin ingin keluar?");

  if (!confirmLogout) {
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/api/logout`, {
      method: "POST",
      credentials: "include",
    });

    let result = null;

    try {
      result = await response.json();
    } catch {
      result = null;
    }

    console.log("Logout:", result);
  } catch (err) {
    console.error("Logout error:", err);
  }

  /* =====================================================
     REDIRECT
  ====================================================== */

  window.location.href = "../login.html";
}
