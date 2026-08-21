document.addEventListener("DOMContentLoaded", () => {
  // =================================
  // KONFIGURASI API
  // =================================

  const API_URL = "http://127.0.0.1:3000/api/admin/laporan";

  const FILE_BASE_URL = "http://127.0.0.1:3000/uploads";

  // =================================
  // AMBIL TAHUN DARI URL
  // =================================

  const urlParams = new URLSearchParams(window.location.search);

  const tahun = urlParams.get("tahun");

  const tahunValid = tahun && /^\d{4}$/.test(tahun);

  // =================================
  // ELEMENT LAPORAN
  // =================================

  const selectTriwulan = document.getElementById("selectTriwulan");
  const searchUser = document.getElementById("searchUser");
  const btnCariUser = document.getElementById("btnCariUser");
  const btnResetUser = document.getElementById("btnResetUser");
  const btnTampilkan = document.getElementById("btnTampilkan");

  const totalKegiatan = document.getElementById("totalKegiatan");
  const totalRTL = document.getElementById("totalRTL");

  const infoTahun = document.getElementById("infoTahun");
  const tahunAktifText = document.getElementById("tahunAktifText");
  const infoTriwulan = document.getElementById("infoTriwulan");

  const badgeKegiatan = document.getElementById("badgeKegiatan");
  const badgeRTL = document.getElementById("badgeRTL");

  const kegiatanContainer = document.getElementById("kegiatanContainer");
  const rtlContainer = document.getElementById("rtlContainer");

  const statusData = document.getElementById("statusData");

  const notificationContainer = document.getElementById("notifikasiKontainer");

  const detailKegiatanSection = document.getElementById(
    "detailKegiatanSection",
  );

  const detailKegiatanContainer = document.getElementById(
    "detailKegiatanContainer",
  );

  const btnTutupDetail = document.getElementById("btnTutupDetail");

  // =================================
  // SIDEBAR
  // =================================

  const btnKelolaMaster = document.getElementById("btnKelolaMaster");

  const menuKelolaMaster = document.getElementById("menuKelolaMaster");

  const iconDropdown = document.getElementById("iconDropdown");

  const btnKomponenKinerja = document.getElementById("btnKomponenKinerja");

  const menuKomponenKinerja = document.getElementById("menuKomponenKinerja");

  const iconDropKomponen = document.getElementById("iconDropKomponen");

  // =================================
  // DATA GLOBAL
  // =================================

  let kegiatanData = [];
  let rtlData = [];

  // =================================
  // NOTIFIKASI
  // =================================

  function showNotifikasi(pesan, type = "success") {
    if (!notificationContainer) {
      return;
    }

    const div = document.createElement("div");

    const isSuccess = type === "success";

    div.className = `
      flex items-center gap-3
      rounded-2xl border bg-white
      px-4 py-3 text-sm font-bold
      shadow-lg transition-all duration-300
      ${
        isSuccess
          ? "border-emerald-200 text-emerald-700"
          : "border-red-200 text-red-700"
      }
    `;

    div.innerHTML = `
      <span
        class="
          flex h-8 w-8 shrink-0
          items-center justify-center
          rounded-xl
          ${
            isSuccess
              ? "bg-emerald-50 text-emerald-500"
              : "bg-red-50 text-red-500"
          }
        "
      >
        <i
          class="
            fa-solid
            ${isSuccess ? "fa-circle-check" : "fa-circle-exclamation"}
          "
        ></i>
      </span>

      <span>
        ${escapeHTML(pesan)}
      </span>
    `;

    notificationContainer.appendChild(div);

    setTimeout(() => {
      div.classList.add("opacity-0", "translate-x-5");

      setTimeout(() => {
        div.remove();
      }, 300);
    }, 3000);
  }

  // =================================
  // VALIDASI TAHUN
  // =================================

  function initTahun() {
    if (!tahunValid) {
      if (infoTahun) {
        infoTahun.textContent = "-";
      }

      if (tahunAktifText) {
        tahunAktifText.textContent = "Tahun tidak valid";
      }

      if (statusData) {
        statusData.textContent = "Tahun tidak ditemukan";
      }

      if (btnTampilkan) {
        btnTampilkan.disabled = true;
      }

      if (kegiatanContainer) {
        kegiatanContainer.innerHTML = emptyState(
          "Parameter tahun tidak valid. Silakan buka halaman laporan melalui Master Tahun.",
        );
      }

      if (rtlContainer) {
        rtlContainer.innerHTML = emptyState(
          "Parameter tahun tidak valid. Silakan buka halaman laporan melalui Master Tahun.",
        );
      }

      showNotifikasi("Tahun laporan tidak ditemukan atau tidak valid", "error");

      return false;
    }

    if (infoTahun) {
      infoTahun.textContent = tahun;
    }

    if (tahunAktifText) {
      tahunAktifText.textContent = tahun;
    }

    if (statusData) {
      statusData.textContent = `Tahun ${tahun}`;
    }

    return true;
  }

  // =================================
  // SEMBUNYIKAN DETAIL
  // =================================

  function hideDetail() {
    if (!detailKegiatanSection) {
      return;
    }

    detailKegiatanSection.classList.add("hidden");

    if (detailKegiatanContainer) {
      detailKegiatanContainer.innerHTML = "";
    }
  }

  // =================================
  // RESET DATA LAPORAN
  // =================================

  function resetDataLaporan() {
    kegiatanData = [];
    rtlData = [];

    if (totalKegiatan) {
      totalKegiatan.textContent = "0";
    }

    if (totalRTL) {
      totalRTL.textContent = "0";
    }

    if (badgeKegiatan) {
      badgeKegiatan.textContent = "0 Data";
    }

    if (badgeRTL) {
      badgeRTL.textContent = "0 Data";
    }

    if (infoTriwulan) {
      infoTriwulan.textContent = "-";
    }

    if (searchUser) {
      searchUser.value = "";
    }
  }

  // =================================
  // LOAD LAPORAN
  // =================================

  async function loadLaporan() {
    const triwulan = selectTriwulan?.value;

    if (!tahunValid) {
      showNotifikasi("Tahun laporan tidak ditemukan", "error");

      return;
    }

    if (!triwulan) {
      showNotifikasi("Silakan pilih triwulan terlebih dahulu", "error");

      selectTriwulan?.focus();

      return;
    }

    hideDetail();

    if (searchUser) {
      searchUser.value = "";
    }

    if (btnTampilkan) {
      btnTampilkan.disabled = true;

      btnTampilkan.innerHTML = `
        <i class="fa-solid fa-spinner animate-spin"></i>
        Memuat...
      `;
    }

    if (kegiatanContainer) {
      kegiatanContainer.innerHTML = loadingState(
        "Memuat data kegiatan...",
        "text-[#0d4fa6]",
      );
    }

    if (rtlContainer) {
      rtlContainer.innerHTML = loadingState(
        "Memuat data tindak lanjut...",
        "text-emerald-600",
      );
    }

    try {
      const response = await fetch(`${API_URL}/${tahun}/triwulan/${triwulan}`, {
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Gagal mengambil laporan");
      }

      const data = result.data || {};

      kegiatanData = Array.isArray(data.kegiatan) ? data.kegiatan : [];

      rtlData = Array.isArray(data.rtl) ? data.rtl : [];

      if (totalKegiatan) {
        totalKegiatan.textContent = kegiatanData.length;
      }

      if (totalRTL) {
        totalRTL.textContent = rtlData.length;
      }

      if (infoTahun) {
        infoTahun.textContent = tahun;
      }

      if (infoTriwulan) {
        infoTriwulan.textContent = `Triwulan ${getTriwulanText(triwulan)}`;
      }

      if (badgeKegiatan) {
        badgeKegiatan.textContent = `${kegiatanData.length} Data`;
      }

      if (badgeRTL) {
        badgeRTL.textContent = `${rtlData.length} Data`;
      }

      if (statusData) {
        statusData.textContent = `Tahun ${tahun} - Triwulan ${getTriwulanText(
          triwulan,
        )}`;
      }

      renderKegiatan(kegiatanData);

      renderRTL(rtlData);

      showNotifikasi("Data laporan berhasil ditampilkan");
    } catch (error) {
      console.error("Gagal mengambil laporan:", error);

      resetDataLaporan();

      if (infoTahun) {
        infoTahun.textContent = tahun;
      }

      if (kegiatanContainer) {
        kegiatanContainer.innerHTML = emptyState(
          "Gagal mengambil data kegiatan.",
        );
      }

      if (rtlContainer) {
        rtlContainer.innerHTML = emptyState(
          "Gagal mengambil data tindak lanjut.",
        );
      }

      showNotifikasi(
        error.message || "Terjadi kesalahan saat mengambil laporan",
        "error",
      );
    } finally {
      if (btnTampilkan) {
        btnTampilkan.disabled = false;

        btnTampilkan.innerHTML = `
          <i class="fa-solid fa-magnifying-glass"></i>
          Tampilkan Laporan
        `;
      }
    }
  }

  // =================================
  // SEARCH USER
  // =================================

  function cariPengguna() {
    const keyword = searchUser?.value.trim().toLowerCase() || "";

    if (!kegiatanData.length && !rtlData.length) {
      showNotifikasi("Silakan tampilkan laporan terlebih dahulu", "error");

      return;
    }

    hideDetail();

    if (btnCariUser) {
      btnCariUser.disabled = true;

      btnCariUser.innerHTML = `
        <i class="fa-solid fa-spinner animate-spin"></i>
        <span>Mencari...</span>
      `;
    }

    if (kegiatanContainer) {
      kegiatanContainer.innerHTML = loadingState(
        keyword
          ? "Mencari data kegiatan pengguna..."
          : "Memuat seluruh kegiatan...",
        "text-[#0d4fa6]",
      );
    }

    if (rtlContainer) {
      rtlContainer.innerHTML = loadingState(
        keyword
          ? "Mencari data tindak lanjut pengguna..."
          : "Memuat seluruh tindak lanjut...",
        "text-emerald-600",
      );
    }

    setTimeout(() => {
      const filteredKegiatan = kegiatanData.filter((item) => {
        const namaUser = String(item.nama_user || "").toLowerCase();

        return namaUser.includes(keyword);
      });

      const filteredRTL = rtlData.filter((item) => {
        const namaUser = String(item.nama_user || "").toLowerCase();

        return namaUser.includes(keyword);
      });

      renderKegiatan(filteredKegiatan);

      renderRTL(filteredRTL);

      if (badgeKegiatan) {
        badgeKegiatan.textContent = `${filteredKegiatan.length} Data`;
      }

      if (badgeRTL) {
        badgeRTL.textContent = `${filteredRTL.length} Data`;
      }

      if (btnCariUser) {
        btnCariUser.disabled = false;

        btnCariUser.innerHTML = `
          <i class="fa-solid fa-magnifying-glass"></i>
          <span>Cari</span>
        `;
      }

      if (keyword) {
        showNotifikasi(
          `Ditemukan ${filteredKegiatan.length} kegiatan dan ${filteredRTL.length} data RTL`,
        );
      } else {
        showNotifikasi("Menampilkan seluruh data pengguna");
      }
    }, 500);
  }

  // =================================
  // RESET PENCARIAN
  // =================================

  function resetPencarianUser() {
    if (!kegiatanData.length && !rtlData.length) {
      return;
    }

    hideDetail();

    if (searchUser) {
      searchUser.value = "";
    }

    renderKegiatan(kegiatanData);

    renderRTL(rtlData);

    if (badgeKegiatan) {
      badgeKegiatan.textContent = `${kegiatanData.length} Data`;
    }

    if (badgeRTL) {
      badgeRTL.textContent = `${rtlData.length} Data`;
    }

    showNotifikasi("Pencarian pengguna berhasil direset");
  }

  // =================================
  // LOAD DETAIL KEGIATAN
  // =================================

  async function loadDetailKegiatan(idKegiatan) {
    if (!idKegiatan) {
      return;
    }

    detailKegiatanSection?.classList.remove("hidden");

    if (detailKegiatanContainer) {
      detailKegiatanContainer.innerHTML = loadingState(
        "Memuat detail kegiatan...",
        "text-[#0d4fa6]",
      );
    }

    scrollToDetail();

    try {
      const response = await fetch(`${API_URL}/kegiatan/${idKegiatan}/detail`, {
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Gagal mengambil detail kegiatan");
      }

      // renderDetailKegiatan sekarang async
      // karena akan mengambil dokumentasi RTL terbaru
      await renderDetailKegiatan(result.data);
    } catch (error) {
      console.error("Gagal mengambil detail kegiatan:", error);

      if (detailKegiatanContainer) {
        detailKegiatanContainer.innerHTML = emptyState(
          error.message || "Gagal mengambil detail kegiatan.",
        );
      }

      showNotifikasi("Gagal mengambil detail kegiatan", "error");
    }
  }

  // =================================
  // LOAD DETAIL RTL
  // =================================

  async function loadDetailRTL(idPelaksanaan) {
    if (!idPelaksanaan) {
      return;
    }

    detailKegiatanSection?.classList.remove("hidden");

    if (detailKegiatanContainer) {
      detailKegiatanContainer.innerHTML = loadingState(
        "Memuat detail tindak lanjut...",
        "text-emerald-600",
      );
    }

    scrollToDetail();

    try {
      const response = await fetch(`${API_URL}/rtl/${idPelaksanaan}/detail`, {
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Gagal mengambil detail tindak lanjut",
        );
      }

      renderDetailRTL(result.data);
    } catch (error) {
      console.error("Gagal mengambil detail RTL:", error);

      if (detailKegiatanContainer) {
        detailKegiatanContainer.innerHTML = emptyState(
          error.message || "Gagal mengambil detail tindak lanjut.",
        );
      }

      showNotifikasi("Gagal mengambil detail tindak lanjut", "error");
    }
  }

  // =================================
  // RENDER KEGIATAN
  // =================================

  function renderKegiatan(data) {
    if (!data.length) {
      kegiatanContainer.innerHTML = emptyState(
        "Tidak ada data kegiatan yang ditemukan.",
      );

      return;
    }

    kegiatanContainer.innerHTML = data
      .map(
        (item, index) => `
          <button
            type="button"
            data-id="${escapeHTML(item.id_kegiatan || "")}"
            class="
              btn-detail-kegiatan
              group mb-4 block w-full
              overflow-hidden rounded-2xl
              border border-[#dbe8f5]
              bg-[#f1f6fc]
              text-left
              transition-all duration-200
              hover:-translate-y-0.5
              hover:border-[#9fc3e8]
              hover:bg-[#eaf3fc]
              hover:shadow-[0_12px_30px_rgba(13,79,166,.08)]
              focus:outline-none
              focus:ring-4
              focus:ring-[#0d4fa6]/10
            "
          >
            <div
              class="
                flex flex-col gap-4
                p-5 md:flex-row
                md:items-start
              "
            >
              <div
                class="
                  flex h-11 w-11 shrink-0
                  items-center justify-center
                  rounded-2xl
                  bg-[#0d4fa6]
                  text-sm font-black
                  text-white shadow-sm
                "
              >
                ${index + 1}
              </div>

              <div class="min-w-0 flex-1">

                <div
                  class="
                    flex flex-col gap-4
                    md:flex-row
                    md:items-start
                    md:justify-between
                  "
                >

                  <div class="min-w-0">

                    <div
                      class="
                        mb-3 flex items-center gap-2
                      "
                    >

                      <div
                        class="
                          flex h-7 w-7 shrink-0
                          items-center justify-center
                          rounded-full bg-white
                          text-[10px] text-[#0d4fa6]
                          ring-1 ring-[#dbe8f5]
                        "
                      >
                        <i class="fa-solid fa-user"></i>
                      </div>

                      <span
                        class="
                          truncate text-[10px]
                          font-black uppercase
                          tracking-wide text-[#52708f]
                        "
                      >
                        ${escapeHTML(
                          item.nama_user || "Pengguna tidak diketahui",
                        )}
                      </span>

                    </div>

                    <h4
                      class="
                        text-sm font-black
                        leading-6 text-[#172033]
                        transition
                        group-hover:text-[#0d4fa6]
                      "
                    >
                      ${escapeHTML(
                        item.judul || item.kegiatan || "Tanpa Judul",
                      )}
                    </h4>

                    <p
                      class="
                        mt-2 text-xs font-semibold
                        leading-6 text-[#71839a]
                      "
                    >
                      ${escapeHTML(item.uraian || item.detail_survei || "-")}
                    </p>

                  </div>

                  <span
                    class="
                      flex w-fit shrink-0
                      items-center gap-2
                      rounded-xl bg-white/80
                      px-3 py-2 text-[10px]
                      font-black text-[#0d4fa6]
                      ring-1 ring-[#d8e6f3]
                      transition
                      group-hover:bg-[#0d4fa6]
                      group-hover:text-white
                    "
                  >
                    Detail

                    <i
                      class="fa-solid fa-arrow-right"
                    ></i>
                  </span>

                </div>

                <div
                  class="
                    mt-4 flex flex-wrap gap-2
                    border-t border-[#dbe8f5]
                    pt-4
                  "
                >

                  <span
                    class="
                      flex items-center gap-1.5
                      rounded-lg bg-white/70
                      px-3 py-2 text-[10px]
                      font-bold text-[#64748b]
                    "
                  >
                    <i
                      class="
                        fa-regular fa-calendar
                        text-[#0d4fa6]
                      "
                    ></i>

                    ${formatTanggal(item.tanggal)}
                  </span>

                  <span
                    class="
                      flex items-center gap-1.5
                      rounded-lg bg-white/70
                      px-3 py-2 text-[10px]
                      font-bold text-[#64748b]
                    "
                  >
                    <i
                      class="
                        fa-solid fa-location-dot
                        text-[#0d4fa6]
                      "
                    ></i>

                    ${escapeHTML(item.tempat || "-")}
                  </span>

                </div>

              </div>

            </div>
          </button>
        `,
      )
      .join("");

    document.querySelectorAll(".btn-detail-kegiatan").forEach((button) => {
      button.addEventListener("click", () => {
        loadDetailKegiatan(button.dataset.id);
      });
    });
  }

  // =================================
  // RENDER RTL
  // =================================

  function renderRTL(data) {
    if (!data.length) {
      rtlContainer.innerHTML = emptyState(
        "Tidak ada data tindak lanjut yang ditemukan.",
      );

      return;
    }

    rtlContainer.innerHTML = data
      .map(
        (item, index) => `
          <button
            type="button"
            data-id="${escapeHTML(item.id_pelaksanaan || "")}"
            class="
              btn-detail-rtl
              group mb-4 block w-full
              overflow-hidden rounded-2xl
              border border-[#d7eadf]
              bg-[#f1faf4]
              text-left
              transition-all duration-200
              hover:-translate-y-0.5
              hover:border-[#a8d8ba]
              hover:bg-[#ebf8ef]
              hover:shadow-[0_12px_30px_rgba(16,185,129,.07)]
              focus:outline-none
              focus:ring-4
              focus:ring-emerald-500/10
            "
          >
            <div class="flex gap-4 p-5">

              <div
                class="
                  flex h-11 w-11 shrink-0
                  items-center justify-center
                  rounded-2xl bg-emerald-500
                  text-sm font-black
                  text-white shadow-sm
                "
              >
                ${index + 1}
              </div>

              <div class="min-w-0 flex-1">

                <div
                  class="
                    flex flex-col gap-4
                    md:flex-row
                    md:items-start
                    md:justify-between
                  "
                >

                  <div class="min-w-0">

                    <div
                      class="mb-3 flex items-center gap-2"
                    >

                      <div
                        class="
                          flex h-7 w-7 shrink-0
                          items-center justify-center
                          rounded-full bg-white
                          text-[10px] text-emerald-600
                          ring-1 ring-[#d7eadf]
                        "
                      >
                        <i class="fa-solid fa-user"></i>
                      </div>

                      <span
                        class="
                          truncate text-[10px]
                          font-black uppercase
                          tracking-wide text-[#54806a]
                        "
                      >
                        ${escapeHTML(
                          item.nama_user || "Pengguna tidak diketahui",
                        )}
                      </span>

                    </div>

                    <h4
                      class="
                        text-sm font-black
                        leading-6 text-[#172033]
                        transition
                        group-hover:text-emerald-700
                      "
                    >
                      ${escapeHTML(
                        item.judul || item.kegiatan || "Pelaksanaan RTL",
                      )}
                    </h4>

                    <p
                      class="
                        mt-2 text-xs font-semibold
                        leading-6 text-[#71839a]
                      "
                    >
                      ${escapeHTML(item.uraian || item.detail || "-")}
                    </p>

                  </div>

                  <span
                    class="
                      flex w-fit shrink-0
                      items-center gap-2
                      rounded-xl bg-white/80
                      px-3 py-2 text-[10px]
                      font-black text-emerald-600
                      ring-1 ring-[#d7eadf]
                      transition
                      group-hover:bg-emerald-500
                      group-hover:text-white
                    "
                  >
                    Detail

                    <i
                      class="fa-solid fa-arrow-right"
                    ></i>
                  </span>

                </div>

                <div
                  class="
                    mt-4 flex flex-wrap gap-2
                    border-t border-[#d7eadf]
                    pt-4
                  "
                >

                  <span
                    class="
                      flex items-center gap-1.5
                      rounded-lg bg-white/80
                      px-3 py-2 text-[10px]
                      font-bold text-[#64748b]
                    "
                  >
                    <i
                      class="
                        fa-regular fa-calendar
                        text-emerald-600
                      "
                    ></i>

                    ${formatTanggal(item.tanggal)}
                  </span>

                  <span
                    class="
                      flex items-center gap-1.5
                      rounded-lg bg-white/80
                      px-3 py-2 text-[10px]
                      font-bold text-[#64748b]
                    "
                  >
                    <i
                      class="
                        fa-solid fa-location-dot
                        text-emerald-600
                      "
                    ></i>

                    ${escapeHTML(item.tempat || "-")}
                  </span>

                </div>

              </div>

            </div>
          </button>
        `,
      )
      .join("");

    document.querySelectorAll(".btn-detail-rtl").forEach((button) => {
      button.addEventListener("click", () => {
        loadDetailRTL(button.dataset.id);
      });
    });
  }

  // =================================
  // RENDER DETAIL KEGIATAN
  //
  // RTL TERBARU LANGSUNG MENGAMBIL
  // DOKUMENTASI RTL
  // =================================

  async function renderDetailKegiatan(data) {
    const kegiatan = data.kegiatan || {};

    const rtlData = Array.isArray(data.rtl) ? data.rtl : [];

    const rtl = rtlData.length > 0 ? rtlData[0] : null;

    // Dokumentasi kegiatan
    const dokumentasiKegiatan = Array.isArray(data.dokumentasi)
      ? data.dokumentasi
      : [];

    // Dokumentasi RTL terbaru
    let dokumentasiRTL = [];

    // =================================
    // AMBIL DETAIL RTL TERBARU
    // =================================

    if (rtl?.id_pelaksanaan) {
      try {
        const response = await fetch(
          `${API_URL}/rtl/${rtl.id_pelaksanaan}/detail`,
          {
            credentials: "include",
          },
        );

        const result = await response.json();

        if (response.ok && result.success && result.data) {
          dokumentasiRTL = Array.isArray(result.data.dokumentasi)
            ? result.data.dokumentasi
            : [];
        }
      } catch (error) {
        console.error("Gagal mengambil dokumentasi RTL:", error);
      }
    }

    detailKegiatanContainer.innerHTML = `
      <div class="grid gap-6 xl:grid-cols-2">

        <!-- ================================= -->
        <!-- DETAIL KEGIATAN -->
        <!-- ================================= -->

        <div
          class="
            rounded-2xl border
            border-[#cfe0f3]
            bg-[#edf5fd] p-5
          "
        >

          <div class="mb-5 flex items-center gap-3">

            <div
              class="
                flex h-11 w-11
                items-center justify-center
                rounded-2xl bg-white
                text-[#0d4fa6]
              "
            >
              <i class="fa-solid fa-list-check"></i>
            </div>

            <div>

              <p
                class="
                  text-[10px] font-black
                  uppercase tracking-wider
                  text-[#0d4fa6]
                "
              >
                Detail Kegiatan
              </p>

              <h4
                class="
                  text-base font-black
                  text-[#172033]
                "
              >
                ${escapeHTML(
                  kegiatan.judul || kegiatan.kegiatan || "Tanpa Judul",
                )}
              </h4>

            </div>

          </div>

          <div class="space-y-5">

            ${detailUser(
              kegiatan.nama_user,
              kegiatan.nip_user,
              kegiatan.teknis_user,
              "text-[#0d4fa6]",
            )}

            ${detailItem(
              "Uraian Kegiatan",
              kegiatan.uraian || kegiatan.detail_survei || "-",
            )}

            <div class="grid gap-3 sm:grid-cols-2">

              ${detailBox("Tanggal", formatTanggal(kegiatan.tanggal))}

              ${detailBox("Tempat", kegiatan.tempat || "-")}

              ${detailBox("Jam Mulai", kegiatan.jam_mulai || "-")}

              ${detailBox("Jam Selesai", kegiatan.jam_selesai || "-")}

            </div>

            ${detailItem("Hasil Kegiatan", kegiatan.hasil || "-")}

            ${detailItem("Kendala", kegiatan.kendala || "-")}

            ${detailItem("Solusi", kegiatan.solusi || "-")}

            ${detailItem("Rencana Tindak Lanjut", kegiatan.rtl || "-")}

            <!-- DOKUMENTASI KEGIATAN -->

            ${renderDokumentasi(
              dokumentasiKegiatan,
              "Dokumentasi Kegiatan",
              "blue",
              "kegiatan",
            )}

          </div>

        </div>

        <!-- ================================= -->
        <!-- TINDAK LANJUT TERBARU -->
        <!-- ================================= -->

        <div
          class="
            rounded-2xl border
            border-[#d7eadf]
            bg-[#f0faf3] p-5
          "
        >

          <div class="mb-5 flex items-center gap-3">

            <div
              class="
                flex h-11 w-11
                items-center justify-center
                rounded-2xl bg-white
                text-emerald-600
              "
            >
              <i
                class="fa-solid fa-arrow-rotate-right"
              ></i>
            </div>

            <div>

              <p
                class="
                  text-[10px] font-black
                  uppercase tracking-wider
                  text-emerald-600
                "
              >
                Tindak Lanjut Terbaru
              </p>

              <h4
                class="
                  text-base font-black
                  text-[#172033]
                "
              >
                ${
                  rtl
                    ? escapeHTML(rtl.judul || "Pelaksanaan Tindak Lanjut")
                    : "Belum Ada RTL"
                }
              </h4>

            </div>

          </div>

          ${
            rtl
              ? `
                <div class="space-y-5">

                  ${detailItem("Uraian", rtl.uraian || rtl.detail || "-")}

                  <div
                    class="
                      grid gap-3
                      sm:grid-cols-2
                    "
                  >

                    ${detailBox("Tanggal", formatTanggal(rtl.tanggal))}

                    ${detailBox("Tempat", rtl.tempat || "-")}

                    ${detailBox("Jam Mulai", rtl.jam_mulai || "-")}

                    ${detailBox("Jam Selesai", rtl.jam_selesai || "-")}

                  </div>

                  ${detailItem("Hasil Pelaksanaan", rtl.hasil || "-")}

                  <!-- ================================= -->
                  <!-- DOKUMENTASI RTL LANGSUNG DISINI -->
                  <!-- ================================= -->

                  ${renderDokumentasi(
                    dokumentasiRTL,
                    "Dokumentasi Tindak Lanjut",
                    "green",
                    "rtl",
                  )}

                </div>
              `
              : `
                <div
                  class="
                    flex min-h-[280px]
                    flex-col items-center
                    justify-center rounded-2xl
                    border border-dashed
                    border-[#b9dcc6]
                    bg-white/60 p-6
                    text-center
                  "
                >

                  <div
                    class="
                      flex h-12 w-12
                      items-center justify-center
                      rounded-2xl bg-white
                      text-emerald-500
                    "
                  >
                    <i
                      class="fa-solid fa-folder-open"
                    ></i>
                  </div>

                  <p
                    class="
                      mt-3 text-sm font-black
                      text-[#53657b]
                    "
                  >
                    Belum Ada RTL
                  </p>

                  <p
                    class="
                      mt-1 text-xs font-semibold
                      text-[#94a3b8]
                    "
                  >
                    Kegiatan ini belum memiliki
                    pelaksanaan tindak lanjut.
                  </p>

                </div>
              `
          }

        </div>

      </div>
    `;
  }

  // =================================
  // RENDER DETAIL RTL
  // =================================

  function renderDetailRTL(data) {
    const dokumentasi = Array.isArray(data.dokumentasi) ? data.dokumentasi : [];

    detailKegiatanContainer.innerHTML = `
      <div class="grid gap-6 xl:grid-cols-2">

        <!-- DETAIL RTL -->

        <div
          class="
            rounded-2xl border
            border-[#d7eadf]
            bg-[#f0faf3] p-5
          "
        >

          <div class="mb-5 flex items-center gap-3">

            <div
              class="
                flex h-11 w-11
                items-center justify-center
                rounded-2xl bg-white
                text-emerald-600
              "
            >
              <i
                class="fa-solid fa-arrow-rotate-right"
              ></i>
            </div>

            <div>

              <p
                class="
                  text-[10px] font-black
                  uppercase tracking-wider
                  text-emerald-600
                "
              >
                Pelaksanaan RTL
              </p>

              <h4
                class="
                  text-base font-black
                  text-[#172033]
                "
              >
                ${escapeHTML(
                  data.judul || data.kegiatan || "Pelaksanaan Tindak Lanjut",
                )}
              </h4>

            </div>

          </div>

          <div class="space-y-5">

            ${detailUser(
              data.nama_user,
              data.nip_user,
              data.teknis_user,
              "text-emerald-600",
            )}

            ${detailItem(
              "Uraian Pelaksanaan",
              data.uraian || data.detail || "-",
            )}

            <div class="grid gap-3 sm:grid-cols-2">

              ${detailBox("Tanggal", formatTanggal(data.tanggal))}

              ${detailBox("Tempat", data.tempat || "-")}

              ${detailBox("Jam Mulai", data.jam_mulai || "-")}

              ${detailBox("Jam Selesai", data.jam_selesai || "-")}

            </div>

            ${detailItem("Hasil Pelaksanaan", data.hasil || "-")}

            <!-- DOKUMENTASI RTL -->

            ${renderDokumentasi(dokumentasi, "Dokumentasi RTL", "green", "rtl")}

          </div>

        </div>

        <!-- KEGIATAN ASAL -->

        <div
          class="
            rounded-2xl border
            border-[#cfe0f3]
            bg-[#edf5fd] p-5
          "
        >

          <div class="mb-5 flex items-center gap-3">

            <div
              class="
                flex h-11 w-11
                items-center justify-center
                rounded-2xl bg-white
                text-[#0d4fa6]
              "
            >
              <i
                class="fa-solid fa-list-check"
              ></i>
            </div>

            <div>

              <p
                class="
                  text-[10px] font-black
                  uppercase tracking-wider
                  text-[#0d4fa6]
                "
              >
                Kegiatan Asal
              </p>

              <h4
                class="
                  text-base font-black
                  text-[#172033]
                "
              >
                ${escapeHTML(data.judul_kegiatan || "Tanpa Judul")}
              </h4>

            </div>

          </div>

          <div class="space-y-5">

            ${detailItem("Uraian Kegiatan", data.uraian_kegiatan || "-")}

            ${detailItem("Rencana Tindak Lanjut", data.rencana_rtl || "-")}

            ${detailBox("Batas RTL", formatTanggal(data.batas_rtl))}

            ${detailBox("PIC RTL", data.pic_rtl || "-")}

          </div>

        </div>

      </div>
    `;
  }

  // =================================
  // RENDER DOKUMENTASI
  // =================================

  function renderDokumentasi(
    dokumentasi,
    title = "Dokumentasi",
    color = "blue",
    folder = "kegiatan",
  ) {
    const colorConfig =
      color === "green"
        ? {
            text: "text-emerald-600",
            border: "border-[#b9dcc6]",
            bg: "bg-[#f0faf3]",
            icon: "text-emerald-600",
          }
        : {
            text: "text-[#0d4fa6]",
            border: "border-[#cfe0f3]",
            bg: "bg-[#edf5fd]",
            icon: "text-[#0d4fa6]",
          };

    if (!Array.isArray(dokumentasi) || !dokumentasi.length) {
      return `
        <div
          class="
            rounded-2xl border border-dashed
            ${colorConfig.border}
            ${colorConfig.bg}
            p-5 text-center
          "
        >

          <div
            class="
              mx-auto flex h-11 w-11
              items-center justify-center
              rounded-2xl bg-white
              ${colorConfig.icon}
            "
          >
            <i
              class="fa-solid fa-image"
            ></i>
          </div>

          <p
            class="
              mt-3 text-xs font-black
              ${colorConfig.text}
            "
          >
            Belum ada dokumentasi
          </p>

          <p
            class="
              mt-1 text-[10px]
              font-semibold text-[#94a3b8]
            "
          >
            Dokumentasi belum diunggah.
          </p>

        </div>
      `;
    }

    return `
      <div
        class="
          rounded-2xl border
          ${colorConfig.border}
          bg-white/70 p-4
        "
      >

        <div
          class="
            mb-4 flex items-center
            gap-2
          "
        >

          <div
            class="
              flex h-9 w-9
              items-center justify-center
              rounded-xl
              ${colorConfig.bg}
              ${colorConfig.icon}
            "
          >
            <i
              class="fa-solid fa-images"
            ></i>
          </div>

          <div>

            <p
              class="
                text-[10px] font-black
                uppercase tracking-wider
                ${colorConfig.text}
              "
            >
              ${escapeHTML(title)}
            </p>

            <p
              class="
                text-[10px]
                font-semibold text-[#94a3b8]
              "
            >
              ${dokumentasi.length}
              file dokumentasi
            </p>

          </div>

        </div>

        <div
          class="
            grid gap-3
            sm:grid-cols-2
          "
        >
          ${dokumentasi
            .map((item) => renderFileDokumentasi(item, colorConfig, folder))
            .join("")}
        </div>

      </div>
    `;
  }

  // =================================
  // RENDER FILE DOKUMENTASI
  //
  // KEGIATAN:
  // /uploads/kegiatan/nama_file
  //
  // RTL:
  // /uploads/rtl/nama_file
  // =================================

  function renderFileDokumentasi(item, colorConfig, folder = "kegiatan") {
    const namaFile = item.nama_file || "";

    const fileUrl = `${FILE_BASE_URL}/${folder}/${encodeURIComponent(
      namaFile,
    )}`;

    const extension = namaFile.split(".").pop()?.toLowerCase();

    const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp"];

    const isImage = imageExtensions.includes(extension);

    // =================================
    // JIKA FILE GAMBAR
    // =================================

    if (isImage) {
      return `
        <a
          href="${fileUrl}"
          target="_blank"
          rel="noopener noreferrer"
          class="
            group relative block
            overflow-hidden rounded-xl
            border border-[#e2e8f0]
            bg-[#f8fafc]
          "
        >

          <div
            class="
              aspect-video overflow-hidden
              bg-slate-100
            "
          >

            <img
              src="${fileUrl}"
              alt="Dokumentasi"
              class="
                h-full w-full
                object-cover
                transition duration-300
                group-hover:scale-105
              "
              onerror="
                this.style.display='none';
                this.parentElement.innerHTML=
                  '<div class=&quot;flex h-full w-full items-center justify-center text-slate-400&quot;><i class=&quot;fa-solid fa-image text-2xl&quot;></i></div>';
              "
            />

          </div>

          <div class="p-3">

            <p
              class="
                truncate text-[10px]
                font-bold text-[#53657b]
              "
              title="${escapeHTML(namaFile)}"
            >
              ${escapeHTML(namaFile)}
            </p>

          </div>

          <div
            class="
              absolute right-2 top-2
              flex h-8 w-8
              items-center justify-center
              rounded-lg bg-white/90
              text-xs shadow-sm
              ${colorConfig.icon}
            "
          >
            <i
              class="fa-solid fa-up-right-from-square"
            ></i>
          </div>

        </a>
      `;
    }

    // =================================
    // JIKA FILE BUKAN GAMBAR
    // =================================

    return `
      <a
        href="${fileUrl}"
        target="_blank"
        rel="noopener noreferrer"
        class="
          flex items-center gap-3
          rounded-xl border
          border-[#e2e8f0]
          bg-[#f8fafc]
          p-4 transition
          hover:-translate-y-0.5
          hover:shadow-sm
        "
      >

        <div
          class="
            flex h-11 w-11
            shrink-0 items-center
            justify-center
            rounded-xl bg-white
            ${colorConfig.icon}
          "
        >
          <i
            class="
              fa-solid
              ${getFileIcon(extension)}
              text-lg
            "
          ></i>
        </div>

        <div class="min-w-0 flex-1">

          <p
            class="
              truncate text-xs
              font-black text-[#172033]
            "
          >
            ${escapeHTML(namaFile)}
          </p>

          <p
            class="
              mt-1 text-[10px]
              font-semibold uppercase
              text-[#94a3b8]
            "
          >
            ${escapeHTML(extension || "FILE")}
          </p>

        </div>

        <i
          class="
            fa-solid fa-up-right-from-square
            text-xs ${colorConfig.icon}
          "
        ></i>

      </a>
    `;
  }

  // =================================
  // ICON FILE
  // =================================

  function getFileIcon(extension) {
    const icons = {
      pdf: "fa-file-pdf",
      doc: "fa-file-word",
      docx: "fa-file-word",
      xls: "fa-file-excel",
      xlsx: "fa-file-excel",
      ppt: "fa-file-powerpoint",
      pptx: "fa-file-powerpoint",
      zip: "fa-file-zipper",
      rar: "fa-file-zipper",
    };

    return icons[extension] || "fa-file";
  }

  // =================================
  // HELPER DETAIL USER
  // =================================

  function detailUser(nama, nip, teknis, colorClass) {
    return `
      <div
        class="
          rounded-2xl bg-white/70
          p-4 ring-1 ring-black/5
        "
      >

        <div class="flex items-center gap-3">

          <div
            class="
              flex h-10 w-10 shrink-0
              items-center justify-center
              rounded-full bg-[#f3f6f9]
              ${colorClass}
            "
          >
            <i class="fa-solid fa-user"></i>
          </div>

          <div class="min-w-0">

            <p
              class="
                text-[9px] font-black
                uppercase tracking-wider
                text-[#71839a]
              "
            >
              Pengguna
            </p>

            <p
              class="
                truncate text-sm font-black
                text-[#172033]
              "
            >
              ${escapeHTML(nama || "Pengguna tidak diketahui")}
            </p>

            <p
              class="
                mt-0.5 text-[10px]
                font-semibold text-[#71839a]
              "
            >
              NIP:
              ${escapeHTML(nip || "-")}

              ${teknis ? ` • ${escapeHTML(teknis)}` : ""}
            </p>

          </div>

        </div>

      </div>
    `;
  }

  // =================================
  // HELPER DETAIL ITEM
  // =================================

  function detailItem(label, value) {
    return `
      <div>

        <p
          class="
            text-[10px] font-black
            uppercase tracking-wider
            text-[#71839a]
          "
        >
          ${escapeHTML(label)}
        </p>

        <p
          class="
            mt-1 text-sm font-semibold
            leading-6 text-[#53657b]
          "
        >
          ${escapeHTML(value)}
        </p>

      </div>
    `;
  }

  // =================================
  // HELPER DETAIL BOX
  // =================================

  function detailBox(label, value) {
    return `
      <div
        class="
          rounded-xl bg-white/70
          p-3 ring-1 ring-black/5
        "
      >

        <p
          class="
            text-[9px] font-black
            uppercase text-[#71839a]
          "
        >
          ${escapeHTML(label)}
        </p>

        <p
          class="
            mt-1 text-xs font-bold
            text-[#172033]
          "
        >
          ${escapeHTML(value)}
        </p>

      </div>
    `;
  }

  // =================================
  // LOADING STATE
  // =================================

  function loadingState(message, colorClass) {
    return `
      <div
        class="
          flex min-h-[220px]
          flex-col items-center
          justify-center
          text-center
        "
      >

        <div
          class="
            flex h-14 w-14
            items-center justify-center
            rounded-2xl bg-white
            shadow-sm
          "
        >
          <i
            class="
              fa-solid fa-spinner
              animate-spin text-2xl
              ${colorClass}
            "
          ></i>
        </div>

        <p
          class="
            mt-4 text-sm font-black
            text-[#53657b]
          "
        >
          ${escapeHTML(message)}
        </p>

        <p
          class="
            mt-1 text-xs font-semibold
            text-[#94a3b8]
          "
        >
          Mohon tunggu sebentar...
        </p>

      </div>
    `;
  }

  // =================================
  // EMPTY STATE
  // =================================

  function emptyState(message) {
    return `
      <div
        class="
          rounded-2xl border
          border-dashed border-[#d5e0ea]
          bg-[#f5f8fb]
          px-5 py-10 text-center
        "
      >

        <div
          class="
            mx-auto flex h-12 w-12
            items-center justify-center
            rounded-2xl bg-white
            text-[#94a3b8]
            shadow-sm
          "
        >
          <i
            class="fa-solid fa-folder-open"
          ></i>
        </div>

        <p
          class="
            mt-3 text-xs font-bold
            text-[#71839a]
          "
        >
          ${escapeHTML(message)}
        </p>

      </div>
    `;
  }

  // =================================
  // DELAY
  // =================================

  function delay(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  // =================================
  // SCROLL DETAIL
  // =================================

  function scrollToDetail() {
    if (!detailKegiatanSection) {
      return;
    }

    setTimeout(() => {
      detailKegiatanSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  }

  // =================================
  // HELPER TRIWULAN
  // =================================

  function getTriwulanText(triwulan) {
    const data = {
      1: "I",
      2: "II",
      3: "III",
      4: "IV",
    };

    return data[Number(triwulan)] || triwulan;
  }

  // =================================
  // FORMAT TANGGAL
  // =================================

  function formatTanggal(tanggal) {
    if (!tanggal) {
      return "-";
    }

    const date = new Date(tanggal);

    if (Number.isNaN(date.getTime())) {
      return tanggal;
    }

    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(date);
  }

  // =================================
  // ESCAPE HTML
  // =================================

  function escapeHTML(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // =================================
  // EVENT LAPORAN
  // =================================

  if (btnTampilkan) {
    btnTampilkan.addEventListener("click", loadLaporan);
  }

  // =================================
  // EVENT GANTI TRIWULAN
  // =================================

  if (selectTriwulan) {
    selectTriwulan.addEventListener("change", () => {
      hideDetail();
    });
  }

  // =================================
  // EVENT CARI USER
  // =================================

  if (btnCariUser) {
    btnCariUser.addEventListener("click", cariPengguna);
  }

  // =================================
  // ENTER UNTUK CARI
  // =================================

  if (searchUser) {
    searchUser.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        cariPengguna();
      }
    });
  }

  // =================================
  // EVENT RESET USER
  // =================================

  if (btnResetUser) {
    btnResetUser.addEventListener("click", resetPencarianUser);
  }

  // =================================
  // TUTUP DETAIL
  // =================================

  if (btnTutupDetail) {
    btnTutupDetail.addEventListener("click", hideDetail);
  }

  // =================================
  // TOGGLE KELOLA MASTER
  // =================================

  if (btnKelolaMaster && menuKelolaMaster && iconDropdown) {
    btnKelolaMaster.addEventListener("click", () => {
      menuKelolaMaster.classList.toggle("hidden");

      iconDropdown.classList.toggle("rotate-180");
    });
  }

  // =================================
  // TOGGLE MASTER KOMPONEN
  // =================================

  if (btnKomponenKinerja && menuKomponenKinerja && iconDropKomponen) {
    btnKomponenKinerja.addEventListener("click", () => {
      menuKomponenKinerja.classList.toggle("hidden");

      iconDropKomponen.classList.toggle("rotate-180");
    });
  }

  // =================================
  // INIT
  // =================================

  initTahun();
});
