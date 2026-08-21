document.addEventListener("DOMContentLoaded", () => {
  /* ===========================================================
       API
    =========================================================== */

  const API_INDIKATOR = "http://127.0.0.1:3000/master/komponen/indikator";

  const API_TUJUAN = "http://127.0.0.1:3000/master/komponen/tujuan";

  const API_SASARAN = "http://127.0.0.1:3000/master/komponen/sasaran";

  const API_TEKNIS = "http://127.0.0.1:3000/master/teknis";

  /* ===========================================================
       ELEMENT
    =========================================================== */

  const viewData = document.getElementById("view-data");

  const viewForm = document.getElementById("view-form");

  const btnTambah = document.getElementById("btn-tambah");

  const btnBatal = document.getElementById("btn-batal");

  const dataForm = document.getElementById("dataForm");

  const tableBody = document.querySelector("#dataTable tbody");

  const inIndex = document.getElementById("in-index");

  const selTujuan = document.getElementById("sel-tujuan");

  const uraianTujuan = document.getElementById("uraian-tujuan");

  const selSasaran = document.getElementById("sel-sasaran");

  const uraianSasaran = document.getElementById("uraian-sasaran");

  const inKode = document.getElementById("in-kode");

  const inUraian = document.getElementById("in-uraian");

  const inTeknis = document.getElementById("in-teknis");

  /* ===========================================================
       VARIABLE GLOBAL
    =========================================================== */

  let daftarIndikator = [];
  let daftarTujuan = [];
  let daftarSasaran = [];
  let daftarTeknis = [];

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
       FETCH MASTER SASARAN
    =========================================================== */

  async function loadSasaran() {
    try {
      const response = await fetch(API_SASARAN, {
        credentials: "include",
      });

      const result = await response.json();

      daftarSasaran = Array.isArray(result) ? result : result.data || [];
    } catch (err) {
      console.error(err);

      daftarSasaran = [];
    }
  }

  /* ===========================================================
       FETCH MASTER TEKNIS
    =========================================================== */

  async function loadTeknis() {
    try {
      const response = await fetch(API_TEKNIS, {
        credentials: "include",
      });

      const result = await response.json();

      daftarTeknis = Array.isArray(result) ? result : result.data || [];
    } catch (err) {
      console.error(err);

      daftarTeknis = [];
    }
  }

  /* ===========================================================
       FETCH MASTER INDIKATOR
    =========================================================== */

  async function loadIndikator() {
    try {
      const response = await fetch(API_INDIKATOR, {
        credentials: "include",
      });

      const result = await response.json();

      daftarIndikator = Array.isArray(result) ? result : result.data || [];

      renderTable();
    } catch (err) {
      console.error(err);
    }
  }

  /* ===========================================================
       LOAD DROPDOWN
    =========================================================== */

  async function loadDropdown() {
    await Promise.all([loadTujuan(), loadSasaran(), loadTeknis()]);

    /* ===============================
           TUJUAN
        =============================== */

    selTujuan.innerHTML = `<option value="">Pilih Tujuan</option>`;

    daftarTujuan.forEach((item) => {
      selTujuan.innerHTML += `
                <option value="${item.id_tujuan}">
                    ${item.kode_tujuan}
                </option>
            `;
    });

    /* ===============================
           TEKNIS
        =============================== */

    inTeknis.innerHTML = `<option value="">Pilih Teknis</option>`;

    daftarTeknis.forEach((item) => {
      inTeknis.innerHTML += `
                <option value="${item.id_teknis}">
                    ${item.teknis}
                </option>
            `;
    });

    /* ===============================
           SASARAN
        =============================== */

    selSasaran.innerHTML = `<option value="">Pilih Sasaran</option>`;
  }

  /* ===========================================================
       TUJUAN CHANGE
    =========================================================== */

  selTujuan.addEventListener("change", () => {
    const idTujuan = selTujuan.value;

    const tujuan = daftarTujuan.find((t) => t.id_tujuan == idTujuan);

    uraianTujuan.value = tujuan ? tujuan.tujuan : "";

    selSasaran.innerHTML = `<option value="">Pilih Sasaran</option>`;

    daftarSasaran
      .filter((s) => s.id_tujuan == idTujuan)
      .forEach((item) => {
        selSasaran.innerHTML += `
                    <option value="${item.id_sasaran}">
                        ${item.kode_sasaran}
                    </option>
                `;
      });

    uraianSasaran.value = "";
  });

  /* ===========================================================
       SASARAN CHANGE
    =========================================================== */

  selSasaran.addEventListener("change", () => {
    const sasaran = daftarSasaran.find((s) => s.id_sasaran == selSasaran.value);

    uraianSasaran.value = sasaran ? sasaran.deskripsi_sasaran : "";
  });

  /* ===========================================================
       RENDER TABLE
    =========================================================== */

  function renderTable() {
    tableBody.innerHTML = "";

    if (daftarIndikator.length === 0) {
      tableBody.innerHTML = `
                <tr>
                    <td
                        colspan="5"
                        class="px-5 py-10 text-center text-xs font-semibold text-[#94a3b8]">

                        Belum ada data indikator.

                    </td>
                </tr>
            `;

      return;
    }

    daftarIndikator.forEach((item, index) => {
      const tujuan = daftarTujuan.find((t) => t.id_tujuan == item.tujuan_id);

      const sasaran = daftarSasaran.find(
        (s) => s.id_sasaran == item.sasaran_id,
      );

      const teknis = daftarTeknis.find((t) => t.id_teknis == item.teknis_id);

      const kodeTujuan = tujuan ? tujuan.kode_tujuan : "";

      const kodeSasaran = sasaran ? sasaran.kode_sasaran : "";

      const kodeLengkap = `${kodeTujuan} ${kodeSasaran} ${item.kode_indikator}`;

      const tr = document.createElement("tr");

      tr.className = "transition-colors duration-150 hover:bg-[#f8fbff]";

      tr.innerHTML = `

                <!-- NO -->
                <td
                    class="px-5 py-4 text-center text-xs font-bold text-[#71839a]">

                    ${index + 1}

                </td>


                <!-- KODE -->
                <td
                    class="px-5 py-4 text-center text-xs font-black text-[#0d4fa6]">

                    ${kodeLengkap}

                </td>


                <!-- URAIAN -->
                <td
                    class="px-5 py-4 text-xs font-semibold leading-5 text-[#475569]">

                    ${item.uraian_indikator}

                </td>


                <!-- TEKNIS -->
                <td
                    class="px-5 py-4 text-center text-xs font-bold text-[#53657b]">

                    ${teknis ? teknis.teknis : "-"}

                </td>


                <!-- AKSI -->
                <td
                    class="px-5 py-4">

                    <div class="flex items-center justify-center gap-2">

                        <!-- EDIT -->
                        <button
                            type="button"
                            class="btn-action btn-edit group flex h-9 w-9 items-center justify-center rounded-xl border border-[#dce5ee] bg-white text-[#0d4fa6] shadow-sm transition-all duration-200 hover:border-[#0d4fa6] hover:bg-[#e8f2fc] hover:-translate-y-0.5"
                            onclick="editData(${index})"
                            title="Edit">

                            <i
                                class="fa-solid fa-pen-to-square text-[11px] transition-transform duration-200 group-hover:scale-105">
                            </i>

                        </button>


                        <!-- HAPUS -->
                        <button
                            type="button"
                            class="btn-action btn-hapus group flex h-9 w-9 items-center justify-center rounded-xl border border-[#f1d5d5] bg-white text-[#dc4b4b] shadow-sm transition-all duration-200 hover:border-[#dc4b4b] hover:bg-[#fff1f1] hover:-translate-y-0.5"
                            onclick="hapusData(${item.id_indikator})"
                            title="Hapus">

                            <i
                                class="fa-solid fa-trash text-[11px] transition-transform duration-200 group-hover:scale-105">
                            </i>

                        </button>

                    </div>

                </td>

            `;

      tableBody.appendChild(tr);
    });
  }

  /* ===========================================================
       FORM
    =========================================================== */

  window.bukaForm = async function () {
    dataForm.reset();

    inIndex.value = "";

    uraianTujuan.value = "";

    uraianSasaran.value = "";

    await loadDropdown();

    viewData.classList.add("hidden");
    viewData.classList.remove("flex");

    viewForm.classList.remove("hidden");
    viewForm.classList.add("flex");
  };

  window.tutupForm = function () {
    viewForm.classList.add("hidden");
    viewForm.classList.remove("flex");

    viewData.classList.remove("hidden");
    viewData.classList.add("flex");
  };

  btnTambah.addEventListener("click", bukaForm);

  btnBatal.addEventListener("click", tutupForm);

  /* ===========================================================
       LOAD AWAL
    =========================================================== */

  (async () => {
    await loadDropdown();

    await loadIndikator();
  })();

  /* ===========================================================
       SIMPAN DATA
    =========================================================== */

  dataForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const idEdit = inIndex.value;

    const payload = {
      tujuan_id: selTujuan.value,

      sasaran_id: selSasaran.value,

      teknis_id: inTeknis.value,

      kode_indikator: inKode.value.trim(),

      uraian_indikator: inUraian.value.trim(),
    };

    if (!payload.tujuan_id) {
      alert("Silakan pilih tujuan terlebih dahulu.");

      return;
    }

    if (!payload.sasaran_id) {
      alert("Silakan pilih sasaran terlebih dahulu.");

      return;
    }

    if (!payload.kode_indikator) {
      alert("Kode indikator wajib diisi.");

      return;
    }

    if (!payload.uraian_indikator) {
      alert("Uraian indikator wajib diisi.");

      return;
    }

    if (!payload.teknis_id) {
      alert("Silakan pilih teknis terlebih dahulu.");

      return;
    }

    try {
      let response;

      /* CREATE */

      if (!idEdit) {
        response = await fetch(`${API_INDIKATOR}/baru`, {
          method: "POST",

          credentials: "include",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(payload),
        });
      } else {

      /* UPDATE */
        response = await fetch(`${API_INDIKATOR}/${idEdit}`, {
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

      await loadDropdown();

      await loadIndikator();
    } catch (err) {
      console.error(err);

      alert("Terjadi kesalahan saat menyimpan data.");
    }
  });

  /* ===========================================================
       EDIT DATA
    =========================================================== */

  window.editData = async function (index) {
    const data = daftarIndikator[index];

    await loadDropdown();

    viewData.classList.add("hidden");
    viewData.classList.remove("flex");

    viewForm.classList.remove("hidden");
    viewForm.classList.add("flex");

    inIndex.value = data.id_indikator;

    selTujuan.value = data.tujuan_id;

    selTujuan.dispatchEvent(new Event("change"));

    selSasaran.value = data.sasaran_id;

    selSasaran.dispatchEvent(new Event("change"));

    inTeknis.value = data.teknis_id;

    inKode.value = data.kode_indikator;

    inUraian.value = data.uraian_indikator;
  };

  /* ===========================================================
       DELETE
    =========================================================== */

  let idHapus = null;

  const modalHapus = document.getElementById("modalHapus");

  window.hapusData = function (id) {
    idHapus = id;

    modalHapus.classList.remove("hidden");

    modalHapus.classList.add("flex");
  };

  window.tutupModal = function () {
    modalHapus.classList.add("hidden");

    modalHapus.classList.remove("flex");

    idHapus = null;
  };

  window.konfirmasiHapus = async function () {
    if (!idHapus) return;

    try {
      const response = await fetch(`${API_INDIKATOR}/${idHapus}`, {
        method: "DELETE",

        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Gagal menghapus data");
      }

      tutupModal();

      await loadDropdown();

      await loadIndikator();
    } catch (err) {
      console.error(err);

      alert("Gagal menghapus data.");
    }
  };

  /* ===========================================================
       SIDEBAR
    =========================================================== */

  const sidebar = document.getElementById("sidebar");

  const overlay = document.getElementById("sidebarOverlay");

  const openSidebarBtn = document.getElementById("openSidebar");

  function openSidebar() {
    sidebar.classList.remove("-translate-x-full");

    overlay.classList.remove("hidden");

    document.body.classList.add("overflow-hidden");
  }

  function closeSidebar() {
    sidebar.classList.add("-translate-x-full");

    overlay.classList.add("hidden");

    document.body.classList.remove("overflow-hidden");
  }

  if (openSidebarBtn) {
    openSidebarBtn.addEventListener("click", openSidebar);
  }

  if (overlay) {
    overlay.addEventListener("click", closeSidebar);
  }

  /* ===========================================================
       KELOLA MASTER
    =========================================================== */

  const btnMaster = document.getElementById("btnKelolaMaster");

  const masterMenu = document.getElementById("menuKelolaMaster");

  const masterIcon = document.getElementById("iconDropdown");

  if (btnMaster && masterMenu) {
    btnMaster.addEventListener("click", () => {
      masterMenu.classList.toggle("hidden");

      if (masterIcon) {
        masterIcon.classList.toggle("rotate-180");
      }
    });
  }

  /* ===========================================================
       MASTER KOMPONEN
    =========================================================== */

  const btnKomponen = document.getElementById("btnKomponenKinerja");

  const komponenMenu = document.getElementById("menuKomponenKinerja");

  const komponenIcon = document.getElementById("iconDropKomponen");

  if (btnKomponen && komponenMenu) {
    btnKomponen.addEventListener("click", (e) => {
      e.preventDefault();

      e.stopPropagation();

      komponenMenu.classList.toggle("hidden");

      if (komponenIcon) {
        komponenIcon.classList.toggle("rotate-180");
      }
    });
  }

  /* ===========================================================
       OTOMATIS BUKA MASTER
    =========================================================== */

  if (masterMenu) {
    masterMenu.classList.remove("hidden");
  }

  if (masterIcon) {
    masterIcon.classList.add("rotate-180");
  }

  if (komponenMenu) {
    komponenMenu.classList.remove("hidden");
  }

  if (komponenIcon) {
    komponenIcon.classList.add("rotate-180");
  }

  /* ===========================================================
       MOBILE SIDEBAR
    =========================================================== */

  document.querySelectorAll("#sidebar a").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth < 1024) {
        closeSidebar();
      }
    });
  });

  /* ===========================================================
       RESIZE
    =========================================================== */

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 1024) {
      overlay.classList.add("hidden");

      document.body.classList.remove("overflow-hidden");
    }
  });
});
