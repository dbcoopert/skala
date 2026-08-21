document.addEventListener("DOMContentLoaded", () => {
  /* ===========================================================
       API
    =========================================================== */

  const API_SASARAN = "http://127.0.0.1:3000/master/komponen/sasaran";

  const API_TUJUAN = "http://127.0.0.1:3000/master/komponen/tujuan";

  /* ===========================================================
       ELEMENT
    =========================================================== */

  const viewData = document.getElementById("view-data");

  const viewForm = document.getElementById("view-form");

  const dataForm = document.getElementById("dataForm");

  const tableBody = document.getElementById("tabelSasaranBody");

  const btnTambah = document.getElementById("btnTambahUtama");

  const badge = document.getElementById("teksBadge");

  const inIndex = document.getElementById("in-index");

  const inTujuan = document.getElementById("in-tujuan");

  const kodeTujuan = document.getElementById("kode-tujuan");

  const inKode = document.getElementById("in-kode");

  const inUraian = document.getElementById("in-uraian");

  const selectContainer = document.getElementById("selectContainer");

  const customList = document.getElementById("custom-tujuan-list");

  /* ===========================================================
       VARIABLE GLOBAL
    =========================================================== */

  let daftarTujuan = [];

  let daftarSasaran = [];

  /* ===========================================================
       FETCH MASTER TUJUAN
    =========================================================== */

  async function loadTujuan() {
    try {
      const response = await fetch(API_TUJUAN, {
        credentials: "include",
      });

      const result = await response.json();

      daftarTujuan = Array.isArray(result) ? result : result.data || [];
    } catch (err) {
      console.error(err);

      daftarTujuan = [];
    }
  }

  /* ===========================================================
       FETCH SASARAN
    =========================================================== */

  async function loadSasaran() {
    try {
      const response = await fetch(API_SASARAN, {
        credentials: "include",
      });

      const result = await response.json();

      daftarSasaran = Array.isArray(result) ? result : result.data || [];

      renderTable();
    } catch (err) {
      console.error(err);
    }
  }

  /* ===========================================================
       DROPDOWN TUJUAN
    =========================================================== */

  async function buildDropdown() {
    customList.innerHTML = "";

    if (daftarTujuan.length === 0) {
      const li = document.createElement("li");

      li.className = "px-4 py-3 text-xs font-semibold text-slate-400";

      li.textContent = "Belum ada data tujuan";

      customList.appendChild(li);

      return;
    }

    daftarTujuan.forEach((item) => {
      const li = document.createElement("li");

      li.className =
        "cursor-pointer px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-[#e8f2fc] hover:text-[#0d4fa6]";

      li.innerHTML = `
                <div class="flex items-center gap-3">

                    <span
                        class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#e8f2fc] text-[#0d4fa6]">

                        <i class="fa-solid fa-bullseye text-[10px]"></i>

                    </span>

                    <div class="min-w-0">

                        <span class="block truncate font-bold">
                            ${item.tujuan}
                        </span>

                        <span class="mt-0.5 block text-[10px] font-bold text-slate-400">
                            ${item.kode_tujuan}
                        </span>

                    </div>

                </div>
            `;

      li.addEventListener("click", () => {
        inTujuan.value = item.tujuan;

        kodeTujuan.value = item.kode_tujuan;

        inTujuan.dataset.id = item.id_tujuan;

        inTujuan.dataset.kode = item.kode_tujuan;

        closeDropdown();
      });

      customList.appendChild(li);
    });
  }

  /* ===========================================================
       OPEN DROPDOWN
       TAILWIND
    =========================================================== */

  function openDropdown() {
    customList.classList.remove("hidden");

    selectContainer.classList.add("ring-4");
    selectContainer.classList.add("ring-[#0d4fa6]/10");
  }

  /* ===========================================================
       CLOSE DROPDOWN
       TAILWIND
    =========================================================== */

  function closeDropdown() {
    customList.classList.add("hidden");

    selectContainer.classList.remove("ring-4");
    selectContainer.classList.remove("ring-[#0d4fa6]/10");
  }

  /* ===========================================================
       CLICK DROPDOWN
    =========================================================== */

  selectContainer.addEventListener("click", async () => {
    if (!customList.classList.contains("hidden")) {
      closeDropdown();
    } else {
      await buildDropdown();

      openDropdown();
    }
  });

  /* ===========================================================
       CLICK OUTSIDE DROPDOWN
    =========================================================== */

  document.addEventListener("click", (e) => {
    if (!selectContainer.contains(e.target)) {
      closeDropdown();
    }
  });

  /* ===========================================================
       RENDER TABLE
    =========================================================== */

  function renderTable() {
    tableBody.innerHTML = "";

    if (daftarSasaran.length === 0) {
      tableBody.innerHTML = `
                <tr>

                    <td
                        colspan="4"
                        class="px-5 py-12 text-center">

                        <div
                            class="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8f2fc] text-[#0d4fa6]">

                            <i class="fa-solid fa-crosshairs"></i>

                        </div>

                        <p class="mt-3 text-sm font-black text-slate-500">
                            Belum ada data sasaran
                        </p>

                        <p class="mt-1 text-xs font-semibold text-slate-400">
                            Silakan tambahkan sasaran baru.
                        </p>

                    </td>

                </tr>
            `;

      return;
    }

    daftarSasaran.forEach((item, index) => {
      const tujuan = daftarTujuan.find((t) => t.id_tujuan == item.id_tujuan);

      const kodeTujuan = tujuan ? tujuan.kode_tujuan : "";

      const kodeLengkap = item.kode_sasaran.startsWith(kodeTujuan)
        ? item.kode_sasaran
        : `${kodeTujuan}.${item.kode_sasaran}`;

      const tr = document.createElement("tr");

      tr.className = "transition hover:bg-[#f8fbfe]";

      tr.innerHTML = `

                <td
                    class="px-5 py-4 text-center text-xs font-bold text-slate-500">

                    ${index + 1}

                </td>


                <td
                    class="px-5 py-4 text-center">

                    <span
                        class="inline-flex rounded-lg bg-[#e8f2fc] px-3 py-1.5 text-xs font-black text-[#0d4fa6]">

                        ${kodeLengkap}

                    </span>

                </td>


                <td
                    class="px-5 py-4 text-sm font-semibold leading-6 text-slate-600">

                    ${item.deskripsi_sasaran}

                </td>


                <td
                    class="px-5 py-4 text-center">

                    <div class="flex justify-center gap-2">

                        <button
                            type="button"
                            class="btn-action btn-edit flex h-9 w-9 items-center justify-center rounded-lg bg-[#e8f2fc] text-[#0d4fa6] transition hover:bg-[#0d4fa6] hover:text-white"
                            onclick="editData(${index})"
                            title="Edit">

                            <i class="fa-solid fa-pen text-[10px]"></i>

                        </button>


                        <button
                            type="button"
                            class="btn-action btn-hapus flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-500 transition hover:bg-red-500 hover:text-white"
                            onclick="hapusData(${item.id_sasaran})"
                            title="Hapus">

                            <i class="fa-solid fa-trash text-[10px]"></i>

                        </button>

                    </div>

                </td>

            `;

      tableBody.appendChild(tr);
    });
  }

  /* ===========================================================
       FORM TAMBAH
    =========================================================== */

  window.bukaForm = function () {
    badge.innerText = "TAMBAH SASARAN";

    dataForm.reset();

    inIndex.value = "-1";

    kodeTujuan.value = "";

    inTujuan.dataset.id = "";

    inTujuan.dataset.kode = "";

    inTujuan.value = "";

    kodeTujuan.value = "";

    viewData.classList.add("hidden");

    viewForm.classList.remove("hidden");

    closeDropdown();

    inTujuan.focus();
  };

  /* ===========================================================
       FORM TUTUP
    =========================================================== */

  window.tutupForm = function () {
    badge.innerText = "SASARAN";

    dataForm.reset();

    inIndex.value = "-1";

    kodeTujuan.value = "";

    inTujuan.dataset.id = "";

    inTujuan.dataset.kode = "";

    viewForm.classList.add("hidden");

    viewData.classList.remove("hidden");

    closeDropdown();
  };

  /* ===========================================================
       BUTTON TAMBAH
    =========================================================== */

  btnTambah.addEventListener("click", () => bukaForm(-1));

  /* ===========================================================
       LOAD AWAL
    =========================================================== */

  (async () => {
    await loadTujuan();

    await loadSasaran();
  })();

  /* ===========================================================
       SIMPAN DATA
       CREATE & UPDATE
    =========================================================== */

  dataForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const idEdit = inIndex.value;

    const payload = {
      id_tujuan: inTujuan.dataset.id,

      kode_sasaran: inKode.value.trim(),

      deskripsi_sasaran: inUraian.value.trim(),
    };

    if (inKode.value.trim() === "") {
      alert("Kode sasaran wajib diisi");

      return;
    }

    if (inUraian.value.trim() === "") {
      alert("Uraian sasaran wajib diisi");

      return;
    }

    if (!payload.id_tujuan) {
      alert("Silakan pilih tujuan terlebih dahulu.");

      return;
    }

    try {
      let response;

      /* ==========================================
                   CREATE
                ========================================== */

      if (idEdit === "-1") {
        response = await fetch(`${API_SASARAN}/baru`, {
          method: "POST",

          credentials: "include",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(payload),
        });
      } else {

      /* ==========================================
                   UPDATE
                ========================================== */
        response = await fetch(`${API_SASARAN}/${idEdit}`, {
          method: "PUT",

          credentials: "include",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        throw new Error("Gagal menyimpan data");
      }

      tutupForm();

      await loadSasaran();
    } catch (err) {
      console.error(err);

      alert("Terjadi kesalahan saat menyimpan data.");
    }
  });

  /* ===========================================================
       EDIT DATA
    =========================================================== */

  window.editData = async function (index) {
    const data = daftarSasaran[index];

    await loadTujuan();

    const tujuan = daftarTujuan.find((t) => t.id_tujuan == data.id_tujuan);

    badge.innerText = "EDIT SASARAN";

    viewData.classList.add("hidden");

    viewForm.classList.remove("hidden");

    inIndex.value = data.id_sasaran;

    inKode.value = data.kode_sasaran;

    inUraian.value = data.deskripsi_sasaran;

    if (tujuan) {
      inTujuan.value = tujuan.tujuan;

      kodeTujuan.value = tujuan.kode_tujuan;

      inTujuan.dataset.id = tujuan.id_tujuan;

      inTujuan.dataset.kode = tujuan.kode_tujuan;
    }

    closeDropdown();
  };

  /* ===========================================================
       DELETE
    =========================================================== */

  let idHapus = null;

  const modalHapus = document.getElementById("modalHapus");

  const btnBatalHapus = document.getElementById("btnBatalHapus");

  const btnKonfirmasiHapus = document.getElementById("btnKonfirmasiHapus");

  /* ===========================================================
       BUKA MODAL
    =========================================================== */

  window.hapusData = function (id) {
    idHapus = id;

    modalHapus.classList.remove("hidden");

    modalHapus.classList.add("flex");
  };

  /* ===========================================================
       TUTUP MODAL
    =========================================================== */

  btnBatalHapus.addEventListener("click", () => {
    modalHapus.classList.remove("flex");

    modalHapus.classList.add("hidden");

    idHapus = null;
  });

  /* ===========================================================
       KONFIRMASI DELETE
    =========================================================== */

  btnKonfirmasiHapus.addEventListener("click", async () => {
    if (!idHapus) return;

    try {
      const response = await fetch(`${API_SASARAN}/${idHapus}`, {
        method: "DELETE",

        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Delete gagal");
      }

      modalHapus.classList.remove("flex");

      modalHapus.classList.add("hidden");

      idHapus = null;

      await loadSasaran();
    } catch (err) {
      console.error(err);

      alert("Gagal menghapus data.");
    }
  });
});
