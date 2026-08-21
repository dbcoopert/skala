document.addEventListener("DOMContentLoaded", async () => {
  const API_URL = "http://127.0.0.1:3000/master/kegiatan";

  // ==========================================
  // ELEMENT
  // ==========================================

  const viewList = document.getElementById("view-list");
  const viewForm = document.getElementById("view-form");

  const btnTambah = document.getElementById("btnTambah");
  const btnSimpan = document.getElementById("btnSimpan");
  const btnBatal = document.getElementById("btnBatal");

  const inputNama = document.getElementById("inputNamaKegiatan");
  const tableBody = document.getElementById("tableBody");

  const deleteModal = document.getElementById("deleteModal");
  const btnModalBatal = document.getElementById("btnModalBatal");
  const btnModalHapus = document.getElementById("btnModalHapus");

  const sidebar = document.getElementById("sidebar");
  const sidebarOverlay = document.getElementById("sidebarOverlay");
  const openSidebar = document.getElementById("openSidebar");

  const notifikasiKontainer = document.getElementById("notifikasiKontainer");

  // ==========================================
  // STATE
  // ==========================================

  let dataKegiatan = [];

  let editIndex = -1;

  let indexYangAkanDihapus = -1;

  // ==========================================
  // NOTIFIKASI
  // ==========================================

  function showNotification(message, type = "success") {
    const notification = document.createElement("div");

    const isSuccess = type === "success";

    notification.className = `
      flex items-center gap-3
      rounded-xl border
      px-4 py-3
      text-xs font-bold
      shadow-lg
      transition-all duration-300
      ${
        isSuccess
          ? "border-green-200 bg-green-50 text-green-700"
          : "border-red-200 bg-red-50 text-red-700"
      }
    `;

    notification.innerHTML = `
      <i class="fa-solid ${
        isSuccess ? "fa-circle-check" : "fa-circle-exclamation"
      } text-sm"></i>

      <span>${message}</span>
    `;

    notifikasiKontainer.appendChild(notification);

    setTimeout(() => {
      notification.classList.add("opacity-0", "-translate-y-2");

      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }

  // ==========================================
  // VIEW
  // ==========================================

  function showList() {
    viewList.classList.remove("hidden");
    viewForm.classList.add("hidden");

    inputNama.value = "";

    editIndex = -1;
  }

  function showForm() {
    viewList.classList.add("hidden");
    viewForm.classList.remove("hidden");
  }

  // ==========================================
  // LOAD DATA
  // ==========================================

  async function loadDataFromDB() {
    try {
      const response = await fetch(API_URL, {
        method: "GET",
        credentials: "include",
      });

      // Jika session habis
      if (response.status === 401) {
        window.location.href = "http://127.0.0.1:3000/login.html";

        return;
      }

      if (!response.ok) {
        throw new Error("Gagal mengambil data dari server");
      }

      const result = await response.json();

      dataKegiatan = result.data || result || [];

      renderTable();
    } catch (error) {
      console.error("Error load data:", error);

      showNotification("Gagal memuat data kegiatan.", "error");
    }
  }

  // ==========================================
  // RENDER TABLE
  // ==========================================

  function renderTable() {
    tableBody.innerHTML = "";

    if (!Array.isArray(dataKegiatan) || dataKegiatan.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td
            colspan="3"
            class="px-5 py-12 text-center"
          >
            <div class="flex flex-col items-center justify-center gap-3">
              
              <div
                class="flex h-12 w-12 items-center justify-center
                rounded-2xl bg-slate-100 text-slate-400"
              >
                <i class="fa-solid fa-folder-open text-lg"></i>
              </div>

              <div>
                <p class="text-sm font-bold text-slate-600">
                  Belum ada data kegiatan
                </p>

                <p class="mt-1 text-xs text-slate-400">
                  Silakan tambahkan kegiatan baru.
                </p>
              </div>

            </div>
          </td>
        </tr>
      `;

      return;
    }

    dataKegiatan.forEach((item, index) => {
      const namaKegiatan =
        item.tambah_kegiatan || item.kegiatan || item.nama_kegiatan || "-";

      const tr = document.createElement("tr");

      tr.className = "group transition hover:bg-[#f7faff]";

      tr.innerHTML = `
        <td
          class="px-5 py-4 text-sm font-bold text-slate-500"
        >
          ${index + 1}
        </td>

        <td
          class="px-5 py-4 text-sm font-bold text-[#172033]"
        >
          ${namaKegiatan}
        </td>

        <td class="px-5 py-4">

          <div class="flex items-center justify-center gap-2">

            <button
              type="button"
              data-edit="${index}"
              title="Edit"
              class="
                flex h-9 w-9 items-center justify-center
                rounded-lg
                border border-blue-100
                bg-blue-50
                text-blue-600
                transition
                hover:bg-blue-600
                hover:text-white
              "
            >
              <i class="fa-solid fa-pen text-xs"></i>
            </button>

            <button
              type="button"
              data-delete="${index}"
              title="Hapus"
              class="
                flex h-9 w-9 items-center justify-center
                rounded-lg
                border border-red-100
                bg-red-50
                text-red-500
                transition
                hover:bg-red-500
                hover:text-white
              "
            >
              <i class="fa-solid fa-trash text-xs"></i>
            </button>

          </div>

        </td>
      `;

      tableBody.appendChild(tr);
    });

    // ==========================================
    // EVENT EDIT
    // ==========================================

    document.querySelectorAll("[data-edit]").forEach((button) => {
      button.addEventListener("click", () => {
        const index = Number(button.dataset.edit);

        editData(index);
      });
    });

    // ==========================================
    // EVENT DELETE
    // ==========================================

    document.querySelectorAll("[data-delete]").forEach((button) => {
      button.addEventListener("click", () => {
        const index = Number(button.dataset.delete);

        hapusData(index);
      });
    });
  }

  // ==========================================
  // TAMBAH
  // ==========================================

  btnTambah.addEventListener("click", () => {
    editIndex = -1;

    inputNama.value = "";

    showForm();

    setTimeout(() => {
      inputNama.focus();
    }, 100);
  });

  // ==========================================
  // BATAL
  // ==========================================

  btnBatal.addEventListener("click", () => {
    showList();
  });

  // ==========================================
  // SIMPAN
  // ==========================================

  btnSimpan.addEventListener("click", async () => {
    const namaBaru = inputNama.value.trim();

    if (!namaBaru) {
      showNotification("Nama kegiatan tidak boleh kosong.", "error");

      inputNama.focus();

      return;
    }

    btnSimpan.disabled = true;

    const originalContent = btnSimpan.innerHTML;

    btnSimpan.innerHTML = `
      <i class="fa-solid fa-spinner fa-spin mr-1.5"></i>
      Menyimpan...
    `;

    try {
      // ======================================
      // UPDATE
      // ======================================

      if (editIndex > -1) {
        const item = dataKegiatan[editIndex];

        const idKegiatan = item.id_kegiatan || item.id;

        const response = await fetch(`${API_URL}/${idKegiatan}`, {
          method: "PUT",

          credentials: "include",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            tambah_kegiatan: namaBaru,
          }),
        });

        if (!response.ok) {
          throw new Error("Gagal update data");
        }

        showNotification("Data kegiatan berhasil diperbarui.");
      }

      // ======================================
      // CREATE
      // ======================================
      else {
        const response = await fetch(`${API_URL}/baru`, {
          method: "POST",

          credentials: "include",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            tambah_kegiatan: namaBaru,
          }),
        });

        if (!response.ok) {
          throw new Error("Gagal menambah data");
        }

        showNotification("Data kegiatan berhasil ditambahkan.");
      }

      await loadDataFromDB();

      showList();
    } catch (error) {
      console.error("Error simpan:", error);

      showNotification("Gagal menyimpan data kegiatan.", "error");
    } finally {
      btnSimpan.disabled = false;

      btnSimpan.innerHTML = originalContent;
    }
  });

  // ==========================================
  // EDIT
  // ==========================================

  function editData(index) {
    editIndex = index;

    const item = dataKegiatan[index];

    inputNama.value =
      item.tambah_kegiatan || item.kegiatan || item.nama_kegiatan || "";

    showForm();

    setTimeout(() => {
      inputNama.focus();
    }, 100);
  }

  // ==========================================
  // HAPUS
  // ==========================================

  function hapusData(index) {
    indexYangAkanDihapus = index;

    deleteModal.classList.remove("hidden");

    deleteModal.classList.add("flex");
  }

  // ==========================================
  // BATAL HAPUS
  // ==========================================

  btnModalBatal.addEventListener("click", () => {
    deleteModal.classList.add("hidden");

    deleteModal.classList.remove("flex");

    indexYangAkanDihapus = -1;
  });

  // ==========================================
  // KONFIRMASI HAPUS
  // ==========================================

  btnModalHapus.addEventListener("click", async () => {
    if (indexYangAkanDihapus < 0) {
      return;
    }

    const item = dataKegiatan[indexYangAkanDihapus];

    const idKegiatan = item.id_kegiatan || item.id;

    btnModalHapus.disabled = true;

    const originalText = btnModalHapus.innerHTML;

    btnModalHapus.innerHTML = `
      <i class="fa-solid fa-spinner fa-spin mr-1"></i>
      Menghapus...
    `;

    try {
      const response = await fetch(`${API_URL}/${idKegiatan}`, {
        method: "DELETE",

        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Gagal menghapus data");
      }

      await loadDataFromDB();

      showNotification("Data kegiatan berhasil dihapus.");
    } catch (error) {
      console.error("Error hapus:", error);

      showNotification("Gagal menghapus data.", "error");
    } finally {
      deleteModal.classList.add("hidden");

      deleteModal.classList.remove("flex");

      indexYangAkanDihapus = -1;

      btnModalHapus.disabled = false;

      btnModalHapus.innerHTML = originalText;
    }
  });

  // ==========================================
  // CLOSE MODAL JIKA KLIK BACKGROUND
  // ==========================================

  deleteModal.addEventListener("click", (event) => {
    if (event.target === deleteModal) {
      deleteModal.classList.add("hidden");

      deleteModal.classList.remove("flex");

      indexYangAkanDihapus = -1;
    }
  });

  // ==========================================
  // SIDEBAR MOBILE
  // ==========================================

  function openSidebarMenu() {
    sidebar.classList.remove("-translate-x-full");

    sidebarOverlay.classList.remove("hidden");
  }

  function closeSidebarMenu() {
    sidebar.classList.add("-translate-x-full");

    sidebarOverlay.classList.add("hidden");
  }

  if (openSidebar) {
    openSidebar.addEventListener("click", openSidebarMenu);
  }

  if (sidebarOverlay) {
    sidebarOverlay.addEventListener("click", closeSidebarMenu);
  }

  // ==========================================
  // SUBMENU
  // ==========================================

  document.querySelectorAll(".menu-toggle").forEach((toggle) => {
    toggle.addEventListener("click", (event) => {
      event.preventDefault();

      const parent = toggle.parentElement;

      parent.classList.toggle("hidden-submenu");

      const submenu = parent.querySelector(":scope > .submenu");

      const icon = toggle.querySelector(".arrow-icon");

      if (submenu) {
        submenu.classList.toggle("hidden");
      }

      if (icon) {
        icon.classList.toggle("rotate-180");
      }
    });
  });

  // ==========================================
  // LOAD DATA PERTAMA
  // ==========================================

  await loadDataFromDB();
});
