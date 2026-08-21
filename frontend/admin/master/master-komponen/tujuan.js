document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "http://127.0.0.1:3000/master/komponen/tujuan";

  const viewData = document.getElementById("view-data");
  const viewForm = document.getElementById("view-form");
  const tableBody = document.querySelector("#dataTable tbody");

  const btnTambah = document.getElementById("btn-tambah");
  const btnBatal = document.getElementById("btn-batal");

  const form = document.getElementById("dataForm");

  let idEdit = null;
  let idHapus = null;

  // =========================================================
  // LOAD DATA
  // =========================================================

  async function loadData() {
    try {
      const res = await fetch(API_URL, {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Gagal mengambil data tujuan");
      }

      const result = await res.json();

      const data = result.data || result;

      renderTable(data);
    } catch (err) {
      console.error("Gagal load data tujuan:", err);

      tableBody.innerHTML = `
        <tr>
          <td colspan="4" class="px-5 py-12 text-center">
            <div class="flex flex-col items-center justify-center">
              
              <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8f2fc] text-[#0d4fa6]">
                <i class="fa-solid fa-bullseye"></i>
              </div>

              <p class="mt-3 text-sm font-extrabold text-[#172033]">
                Gagal memuat data
              </p>

              <p class="mt-1 text-xs font-semibold text-[#71839a]">
                Periksa koneksi ke server.
              </p>

            </div>
          </td>
        </tr>
      `;
    }
  }

  // =========================================================
  // RENDER TABLE
  // =========================================================

  function renderTable(data) {
    tableBody.innerHTML = "";

    if (!data || data.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="4" class="px-5 py-12 text-center">

            <div class="flex flex-col items-center justify-center">

              <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8f2fc] text-[#0d4fa6]">
                <i class="fa-solid fa-bullseye"></i>
              </div>

              <p class="mt-3 text-sm font-extrabold text-[#172033]">
                Belum ada data tujuan
              </p>

              <p class="mt-1 text-xs font-semibold text-[#71839a]">
                Tambahkan tujuan baru untuk mulai mengelola data.
              </p>

            </div>

          </td>
        </tr>
      `;

      return;
    }

    data.forEach((item, index) => {
      const tr = document.createElement("tr");

      tr.className = "transition hover:bg-[#f8fbff]";

      tr.innerHTML = `
        <td class="px-5 py-4 text-xs font-extrabold text-[#71839a]">
          ${index + 1}
        </td>

        <td class="px-5 py-4">
          <span
            class="inline-flex rounded-lg bg-[#e8f2fc] px-3 py-1.5 text-[10px] font-black text-[#0d4fa6]"
          >
            ${escapeHtml(item.kode_tujuan || "-")}
          </span>
        </td>

        <td class="px-5 py-4 text-center text-xs font-semibold leading-relaxed text-[#172033]">
          ${escapeHtml(item.tujuan || "-")}
        </td>

        <td class="px-5 py-4">

          <div class="flex items-center justify-center gap-2">

            <button
              type="button"
              class="btn-edit flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition hover:bg-blue-100"
              data-id="${item.id_tujuan}"
              data-kode="${escapeAttribute(item.kode_tujuan)}"
              data-tujuan="${escapeAttribute(item.tujuan)}"
              title="Edit"
            >
              <i class="fa-solid fa-pen text-[10px]"></i>
            </button>

            <button
              type="button"
              class="btn-hapus flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500 transition hover:bg-red-100"
              data-id="${item.id_tujuan}"
              title="Hapus"
            >
              <i class="fa-solid fa-trash text-[10px]"></i>
            </button>

          </div>

        </td>
      `;

      tableBody.appendChild(tr);
    });
  }

  // =========================================================
  // ESCAPE HTML
  // =========================================================

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function escapeAttribute(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  // =========================================================
  // EVENT TABLE
  // =========================================================

  tableBody.addEventListener("click", (e) => {
    const editBtn = e.target.closest(".btn-edit");
    const hapusBtn = e.target.closest(".btn-hapus");

    // =======================================================
    // EDIT
    // =======================================================

    if (editBtn) {
      idEdit = editBtn.dataset.id;

      document.getElementById("in-index").value = idEdit;

      document.getElementById("in-kode").value = editBtn.dataset.kode || "";

      document.getElementById("in-uraian").value = editBtn.dataset.tujuan || "";

      document.querySelector(".form-tambah-title").textContent = "Edit Tujuan";

      viewData.classList.remove("active");
      viewData.classList.add("hidden");

      viewForm.classList.remove("hidden");
      viewForm.classList.add("active");

      return;
    }

    // =======================================================
    // HAPUS
    // =======================================================

    if (hapusBtn) {
      idHapus = hapusBtn.dataset.id;

      document.getElementById("modalHapus").classList.remove("hidden");

      document.getElementById("modalHapus").classList.add("flex");
    }
  });

  // =========================================================
  // TAMBAH
  // =========================================================

  btnTambah.addEventListener("click", () => {
    idEdit = null;

    form.reset();

    document.getElementById("in-index").value = "";

    document.querySelector(".form-tambah-title").textContent = "Tambah Tujuan";

    viewData.classList.remove("active");
    viewData.classList.add("hidden");

    viewForm.classList.remove("hidden");
    viewForm.classList.add("active");

    document.getElementById("in-kode").focus();
  });

  // =========================================================
  // BATAL
  // =========================================================

  btnBatal.addEventListener("click", () => {
    form.reset();

    idEdit = null;

    document.getElementById("in-index").value = "";

    viewForm.classList.remove("active");
    viewForm.classList.add("hidden");

    viewData.classList.remove("hidden");
    viewData.classList.add("active");
  });

  // =========================================================
  // SIMPAN
  // POST / PUT
  // =========================================================

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const kodeInput = document.getElementById("in-kode");
    const uraianInput = document.getElementById("in-uraian");

    const kodeTujuan = kodeInput.value.trim();
    const tujuan = uraianInput.value.trim();

    // =======================================================
    // VALIDASI
    // =======================================================

    if (kodeTujuan === "") {
      kodeInput.classList.remove("input-error");

      void kodeInput.offsetWidth;

      kodeInput.classList.add("input-error");

      kodeInput.focus();

      return;
    }

    if (tujuan === "") {
      uraianInput.classList.remove("input-error");

      void uraianInput.offsetWidth;

      uraianInput.classList.add("input-error");

      uraianInput.focus();

      return;
    }

    kodeInput.classList.remove("input-error");
    uraianInput.classList.remove("input-error");

    const payload = {
      kode_tujuan: kodeTujuan,
      tujuan: tujuan,
    };

    try {
      // =====================================================
      // UPDATE
      // =====================================================

      if (idEdit) {
        const response = await fetch(`${API_URL}/${idEdit}`, {
          method: "PUT",

          credentials: "include",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error("Gagal memperbarui data tujuan");
        }

        const result = await response.json();

        if (result.success === false) {
          throw new Error(result.message || "Gagal memperbarui data tujuan");
        }
      }

      // =====================================================
      // TAMBAH
      // =====================================================
      else {
        const response = await fetch(`${API_URL}/baru`, {
          method: "POST",

          credentials: "include",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error("Gagal menambahkan data tujuan");
        }

        const result = await response.json();

        if (result.success === false) {
          throw new Error(result.message || "Gagal menambahkan data tujuan");
        }
      }

      // =====================================================
      // KEMBALI KE DATA
      // =====================================================

      form.reset();

      idEdit = null;

      document.getElementById("in-index").value = "";

      viewForm.classList.remove("active");
      viewForm.classList.add("hidden");

      viewData.classList.remove("hidden");
      viewData.classList.add("active");

      await loadData();
    } catch (err) {
      console.error("Error simpan tujuan:", err);

      alert(err.message || "Gagal menyimpan data tujuan.");
    }
  });

  // =========================================================
  // MODAL TUTUP
  // =========================================================

  window.tutupModal = function () {
    const modal = document.getElementById("modalHapus");

    modal.classList.remove("flex");
    modal.classList.add("hidden");

    idHapus = null;
  };

  // =========================================================
  // KONFIRMASI HAPUS
  // =========================================================

  window.konfirmasiHapus = async function () {
    if (!idHapus) {
      return;
    }

    try {
      const res = await fetch(`${API_URL}/${idHapus}`, {
        method: "DELETE",

        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Delete gagal");
      }

      const result = await res.json();

      if (result.success === false) {
        throw new Error(result.message || "Gagal menghapus data");
      }

      tutupModal();

      await loadData();
    } catch (err) {
      console.error("Error hapus tujuan:", err);

      alert(err.message || "Gagal menghapus data tujuan.");
    }
  };

  // =========================================================
  // ESC UNTUK MODAL
  // =========================================================

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const modal = document.getElementById("modalHapus");

      if (!modal.classList.contains("hidden")) {
        tutupModal();
      }
    }
  });

  // =========================================================
  // LOAD DATA PERTAMA
  // =========================================================

  loadData();
});
