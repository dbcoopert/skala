document.addEventListener("DOMContentLoaded", () => {
  // =====================================================
  // CONFIG
  // =====================================================

  const API_BASE = "http://127.0.0.1:3000";

  const API = {
    tahun: `${API_BASE}/api/download/tahun`,
    tujuan: `${API_BASE}/api/download/tujuan`,
    sasaran: `${API_BASE}/api/download/sasaran`,
    indikator: `${API_BASE}/api/download/indikator`,
    kegiatan: `${API_BASE}/api/download/kegiatan`,
    users: `${API_BASE}/api/download/users`,
    laporan: `${API_BASE}/api/download/laporan`,
  };

  /*
   * Tailwind CSS HASIL BUILD.
   *
   * Jangan menggunakan CDN.
   *
   * Sesuaikan path ini dengan lokasi file CSS hasil build
   * Tailwind CSS project Anda.
   */
  const TAILWIND_CSS = new URL(
    "../../assets/css/output.css",
    window.location.href,
  ).href;

  const LOGO_URL = new URL("../../assets/logo-bps.png", window.location.href).href;

  // =====================================================
  // DATA
  // =====================================================

  let dataTahun = [];
  let dataTujuan = [];
  let dataSasaran = [];
  let dataIndikator = [];
  let dataKegiatan = [];
  let dataUsers = [];

  let selectedUsers = new Set();

  // =====================================================
  // ELEMENT
  // =====================================================

  const selectTahun = document.getElementById("selectTahun");
  const selectTriwulan = document.getElementById("selectTriwulan");

  const selectTujuan = document.getElementById("selectTujuan");
  const selectSasaran = document.getElementById("selectSasaran");
  const selectIndikator = document.getElementById("selectIndikator");
  const selectKegiatan = document.getElementById("selectKegiatan");

  const descTujuan = document.getElementById("descTujuan");
  const descSasaran = document.getElementById("descSasaran");
  const descIndikator = document.getElementById("descIndikator");
  const descKegiatan = document.getElementById("descKegiatan");

  const userList = document.getElementById("userList");
  const userFilterInfo = document.getElementById("userFilterInfo");

  const btnPilihSemua = document.getElementById("btnPilihSemua");
  const btnHapusPilihan = document.getElementById("btnHapusPilihan");

  // =====================================================
  // FETCH API
  // =====================================================

  async function fetchAPI(url) {
    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
    });

    let result;

    try {
      result = await response.json();
    } catch {
      throw new Error("Response server tidak valid.");
    }

    if (response.status === 401 || response.status === 403) {
      throw new Error(result.message || "Sesi login telah berakhir.");
    }

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Gagal mengambil data.");
    }

    return Array.isArray(result.data) ? result.data : [];
  }

  // =====================================================
  // RESET SELECT
  // =====================================================

  function resetSelect(select, placeholder) {
    if (!select) return;

    select.innerHTML = `
      <option value="">${placeholder}</option>
    `;

    select.disabled = true;
  }

  // =====================================================
  // RESET DESCRIPTIONS
  // =====================================================

  function resetDescriptions() {
    if (descTujuan) descTujuan.value = "";
    if (descSasaran) descSasaran.value = "";
    if (descIndikator) descIndikator.value = "";
    if (descKegiatan) descKegiatan.value = "";
  }

  // =====================================================
  // RESET USER
  // =====================================================

  function resetUsers(message = "User akan tampil setelah filter dipilih.") {
    dataUsers = [];
    selectedUsers.clear();

    if (userFilterInfo) {
      userFilterInfo.textContent = message;
    }

    if (userList) {
      userList.innerHTML = `
        <div class="rounded-xl border border-dashed border-slate-200 p-5 text-center text-xs font-semibold text-slate-400">
          ${escapeHTML(message)}
        </div>
      `;
    }
  }

  // =====================================================
  // FILL TAHUN
  // =====================================================

  function fillTahun() {
    if (!selectTahun) return;

    selectTahun.innerHTML = `
      <option value="">Pilih Tahun</option>
    `;

    dataTahun.forEach((item) => {
      if (!item.tahun) return;

      const option = document.createElement("option");

      option.value = item.tahun;
      option.textContent = item.tahun;

      selectTahun.appendChild(option);
    });

    selectTahun.disabled = dataTahun.length === 0;
  }

  // =====================================================
  // FILL TUJUAN
  // =====================================================

  function fillTujuan() {
    resetSelect(selectTujuan, "Pilih Kode Tujuan");

    dataTujuan.forEach((item) => {
      const option = document.createElement("option");

      option.value = item.id_tujuan;

      option.textContent = item.kode_tujuan || `Tujuan ${item.id_tujuan}`;

      option.dataset.desc = item.tujuan || "";

      selectTujuan.appendChild(option);
    });

    selectTujuan.disabled = dataTujuan.length === 0;
  }

  // =====================================================
  // FILL SASARAN
  // =====================================================

  function fillSasaran() {
    resetSelect(selectSasaran, "Pilih Kode Sasaran");

    dataSasaran.forEach((item) => {
      const option = document.createElement("option");

      option.value = item.id_sasaran;

      option.textContent = item.kode_sasaran || `Sasaran ${item.id_sasaran}`;

      option.dataset.desc = item.deskripsi_sasaran || "";

      selectSasaran.appendChild(option);
    });

    selectSasaran.disabled = dataSasaran.length === 0;
  }

  // =====================================================
  // FILL INDIKATOR
  // =====================================================

  function fillIndikator() {
    resetSelect(selectIndikator, "Pilih Kode Indikator");

    dataIndikator.forEach((item) => {
      const option = document.createElement("option");

      option.value = item.id_indikator;

      option.textContent =
        item.kode_indikator || `Indikator ${item.id_indikator}`;

      option.dataset.desc = item.uraian_indikator || "";

      selectIndikator.appendChild(option);
    });

    selectIndikator.disabled = dataIndikator.length === 0;
  }

  // =====================================================
  // FILL KEGIATAN
  // =====================================================

  function fillKegiatan() {
    resetSelect(selectKegiatan, "Pilih Kegiatan");

    dataKegiatan.forEach((item) => {
      const option = document.createElement("option");

      option.value = item.id_kegiatan;

      option.textContent =
        item.tambah_kegiatan || `Kegiatan ${item.id_kegiatan}`;

      option.dataset.desc = item.tambah_kegiatan || "";

      selectKegiatan.appendChild(option);
    });

    selectKegiatan.disabled = dataKegiatan.length === 0;
  }

  // =====================================================
  // RENDER USERS
  // =====================================================

  function renderUsers() {
    if (!userList) return;

    if (dataUsers.length === 0) {
      userList.innerHTML = `
        <div class="rounded-xl border border-dashed border-slate-200 p-5 text-center text-xs font-semibold text-slate-400">
          Tidak ada user yang sesuai dengan filter.
        </div>
      `;

      if (userFilterInfo) {
        userFilterInfo.textContent = "0 pengguna ditemukan.";
      }

      return;
    }

    if (userFilterInfo) {
      userFilterInfo.textContent = `${dataUsers.length} pengguna ditemukan • ${selectedUsers.size} dipilih.`;
    }

    userList.innerHTML = dataUsers
      .map((user) => {
        const checked = selectedUsers.has(String(user.id_user));

        return `
          <label
            class="
              flex
              cursor-pointer
              items-center
              gap-3
              rounded-xl
              border
              border-slate-200
              bg-white
              p-3
              transition
              hover:border-blue-600
              hover:bg-blue-50/40
            "
          >

            <input
              type="checkbox"
              class="
                user-checkbox
                h-4
                w-4
                rounded
                border-slate-300
                text-blue-700
                focus:ring-blue-600
              "
              value="${escapeHTML(user.id_user)}"
              ${checked ? "checked" : ""}
            >

            <div class="min-w-0 flex-1">

              <p
                class="
                  truncate
                  text-sm
                  font-black
                  text-slate-800
                "
              >
                ${escapeHTML(user.nama || "-")}
              </p>

              <p
                class="
                  mt-0.5
                  text-[10px]
                  font-semibold
                  text-slate-500
                "
              >
                NIP:
                ${escapeHTML(user.nip || "-")}
              </p>

            </div>

            <i
              class="
                fa-solid
                fa-user
                text-slate-400
              "
            ></i>

          </label>
        `;
      })
      .join("");

    document.querySelectorAll(".user-checkbox").forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
          selectedUsers.add(checkbox.value);
        } else {
          selectedUsers.delete(checkbox.value);
        }

        if (userFilterInfo) {
          userFilterInfo.textContent = `${dataUsers.length} pengguna ditemukan • ${selectedUsers.size} dipilih.`;
        }
      });
    });
  }

  // =====================================================
  // LOAD USERS
  // =====================================================

  async function loadUsers() {
    const tahun = selectTahun.value;

    if (!tahun) {
      resetUsers();
      return;
    }

    const params = new URLSearchParams();

    params.set("tahun", tahun);

    if (selectTriwulan?.value) {
      params.set("triwulan", selectTriwulan.value);
    }

    if (selectTujuan?.value) {
      params.set("id_tujuan", selectTujuan.value);
    }

    if (selectSasaran?.value) {
      params.set("id_sasaran", selectSasaran.value);
    }

    if (selectIndikator?.value) {
      params.set("id_indikator", selectIndikator.value);
    }

    if (selectKegiatan?.value) {
      params.set("id_kegiatan_master", selectKegiatan.value);
    }

    try {
      dataUsers = await fetchAPI(`${API.users}?${params.toString()}`);

      selectedUsers.clear();

      renderUsers();
    } catch (error) {
      console.error("ERROR LOAD USERS:", error);

      resetUsers(error.message);
    }
  }

  // =====================================================
  // LOAD TUJUAN
  // =====================================================

  async function loadTujuan() {
    const params = new URLSearchParams();

    params.set("tahun", selectTahun.value);

    if (selectTriwulan.value) {
      params.set("triwulan", selectTriwulan.value);
    }

    dataTujuan = await fetchAPI(`${API.tujuan}?${params.toString()}`);

    fillTujuan();
  }

  // =====================================================
  // LOAD SASARAN
  // =====================================================

  async function loadSasaran() {
    const params = new URLSearchParams();

    params.set("tahun", selectTahun.value);

    params.set("id_tujuan", selectTujuan.value);

    if (selectTriwulan.value) {
      params.set("triwulan", selectTriwulan.value);
    }

    dataSasaran = await fetchAPI(`${API.sasaran}?${params.toString()}`);

    fillSasaran();
  }

  // =====================================================
  // LOAD INDIKATOR
  // =====================================================

  async function loadIndikator() {
    const params = new URLSearchParams();

    params.set("tahun", selectTahun.value);

    params.set("id_tujuan", selectTujuan.value);

    params.set("id_sasaran", selectSasaran.value);

    if (selectTriwulan.value) {
      params.set("triwulan", selectTriwulan.value);
    }

    dataIndikator = await fetchAPI(`${API.indikator}?${params.toString()}`);

    fillIndikator();
  }

  // =====================================================
  // LOAD KEGIATAN
  // =====================================================

  async function loadKegiatan() {
    const params = new URLSearchParams();

    params.set("tahun", selectTahun.value);

    params.set("id_tujuan", selectTujuan.value);

    params.set("id_sasaran", selectSasaran.value);

    params.set("id_indikator", selectIndikator.value);

    if (selectTriwulan.value) {
      params.set("triwulan", selectTriwulan.value);
    }

    dataKegiatan = await fetchAPI(`${API.kegiatan}?${params.toString()}`);

    fillKegiatan();
  }

  // =====================================================
  // RESET FILTER
  // =====================================================

  function resetAfterTahun() {
    resetSelect(selectTujuan, "Pilih Kode Tujuan");

    resetSelect(selectSasaran, "Pilih Kode Sasaran");

    resetSelect(selectIndikator, "Pilih Kode Indikator");

    resetSelect(selectKegiatan, "Pilih Kegiatan");

    resetDescriptions();
    resetUsers();
  }

  function resetAfterTujuan() {
    resetSelect(selectSasaran, "Pilih Kode Sasaran");

    resetSelect(selectIndikator, "Pilih Kode Indikator");

    resetSelect(selectKegiatan, "Pilih Kegiatan");

    if (descSasaran) {
      descSasaran.value = "";
    }

    if (descIndikator) {
      descIndikator.value = "";
    }

    if (descKegiatan) {
      descKegiatan.value = "";
    }

    resetUsers();
  }

  function resetAfterSasaran() {
    resetSelect(selectIndikator, "Pilih Kode Indikator");

    resetSelect(selectKegiatan, "Pilih Kegiatan");

    if (descIndikator) {
      descIndikator.value = "";
    }

    if (descKegiatan) {
      descKegiatan.value = "";
    }

    resetUsers();
  }

  function resetAfterIndikator() {
    resetSelect(selectKegiatan, "Pilih Kegiatan");

    if (descKegiatan) {
      descKegiatan.value = "";
    }

    resetUsers();
  }

  // =====================================================
  // EVENT TAHUN
  // =====================================================

  if (selectTahun) {
    selectTahun.addEventListener("change", async () => {
      resetAfterTahun();

      try {
        await loadTujuan();
        await loadUsers();
      } catch (error) {
        alert(error.message);
      }
    });
  }

  // =====================================================
  // EVENT TRIWULAN
  // =====================================================

  if (selectTriwulan) {
    selectTriwulan.addEventListener("change", async () => {
      resetAfterTahun();

      if (!selectTahun.value) {
        return;
      }

      try {
        await loadTujuan();
        await loadUsers();
      } catch (error) {
        alert(error.message);
      }
    });
  }

  // =====================================================
  // EVENT TUJUAN
  // =====================================================

  if (selectTujuan) {
    selectTujuan.addEventListener("change", async () => {
      const option = selectTujuan.options[selectTujuan.selectedIndex];

      if (descTujuan) {
        descTujuan.value = option?.dataset.desc || "";
      }

      resetAfterTujuan();

      try {
        await loadSasaran();
        await loadUsers();
      } catch (error) {
        alert(error.message);
      }
    });
  }

  // =====================================================
  // EVENT SASARAN
  // =====================================================

  if (selectSasaran) {
    selectSasaran.addEventListener("change", async () => {
      const option = selectSasaran.options[selectSasaran.selectedIndex];

      if (descSasaran) {
        descSasaran.value = option?.dataset.desc || "";
      }

      resetAfterSasaran();

      try {
        await loadIndikator();
        await loadUsers();
      } catch (error) {
        alert(error.message);
      }
    });
  }

  // =====================================================
  // EVENT INDIKATOR
  // =====================================================

  if (selectIndikator) {
    selectIndikator.addEventListener("change", async () => {
      const option = selectIndikator.options[selectIndikator.selectedIndex];

      if (descIndikator) {
        descIndikator.value = option?.dataset.desc || "";
      }

      resetAfterIndikator();

      try {
        await loadKegiatan();
        await loadUsers();
      } catch (error) {
        alert(error.message);
      }
    });
  }

  // =====================================================
  // EVENT KEGIATAN
  // =====================================================

  if (selectKegiatan) {
    selectKegiatan.addEventListener("change", async () => {
      const option = selectKegiatan.options[selectKegiatan.selectedIndex];

      if (descKegiatan) {
        descKegiatan.value = option?.dataset.desc || "";
      }

      await loadUsers();
    });
  }

  // =====================================================
  // PILIH SEMUA USER
  // =====================================================

  if (btnPilihSemua) {
    btnPilihSemua.addEventListener("click", () => {
      selectedUsers.clear();

      dataUsers.forEach((user) => {
        selectedUsers.add(String(user.id_user));
      });

      renderUsers();
    });
  }

  // =====================================================
  // HAPUS PILIHAN USER
  // =====================================================

  if (btnHapusPilihan) {
    btnHapusPilihan.addEventListener("click", () => {
      selectedUsers.clear();

      renderUsers();
    });
  }

  // =====================================================
  // FETCH LAPORAN
  // =====================================================

  async function fetchLaporan() {
    if (!selectTahun.value) {
      throw new Error("Silakan pilih tahun terlebih dahulu.");
    }

    if (selectedUsers.size === 0) {
      throw new Error("Silakan pilih minimal satu user untuk dicetak.");
    }

    const params = new URLSearchParams();

    params.set("tahun", selectTahun.value);

    if (selectTriwulan.value) {
      params.set("triwulan", selectTriwulan.value);
    }

    if (selectTujuan.value) {
      params.set("id_tujuan", selectTujuan.value);
    }

    if (selectSasaran.value) {
      params.set("id_sasaran", selectSasaran.value);
    }

    if (selectIndikator.value) {
      params.set("id_indikator", selectIndikator.value);
    }

    if (selectKegiatan.value) {
      params.set("id_kegiatan_master", selectKegiatan.value);
    }

    params.set("user_ids", JSON.stringify(Array.from(selectedUsers)));

    const response = await fetch(`${API.laporan}?${params.toString()}`, {
      method: "GET",
      credentials: "include",
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Gagal mengambil laporan.");
    }

    return result.data;
  }

  // =====================================================
  // ESCAPE HTML
  // =====================================================

  function escapeHTML(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // =====================================================
  // FORMAT JAM
  // =====================================================

  function formatJam(value) {
    if (!value) return "-";

    return String(value).substring(0, 5);
  }

  // =====================================================
  // FORMAT TANGGAL
  // =====================================================

  function formatTanggal(value) {
    if (!value) return "-";

    if (/^\d{2}-\d{2}-\d{4}$/.test(String(value))) {
      return value;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1,
    ).padStart(2, "0")}-${date.getFullYear()}`;
  }

  // =====================================================
  // URL TTD
  // =====================================================

  function getTTDUrl(ttd) {
    if (!ttd) return "";

    return `${API_BASE}/uploads/ttd/${encodeURIComponent(ttd)}`;
  }

  // =====================================================
  // URL FOTO
  // =====================================================

  function getFotoUrl(folder, namaFile) {
    if (!namaFile) return "";

    return `${API_BASE}/uploads/${folder}/${encodeURIComponent(namaFile)}`;
  }

  // =====================================================
  // RENDER DOKUMENTASI
  // =====================================================

  function renderDokumentasi(dokumentasi) {
    if (!Array.isArray(dokumentasi) || !dokumentasi.length) {
      return `
        <p class="text-xs italic text-slate-500">
          Tidak ada dokumentasi.
        </p>
      `;
    }

    return `
      <div
        class="
          grid
          grid-cols-2
          gap-3
        "
      >

        ${dokumentasi
          .map((foto, index) => {
            const url = getFotoUrl("kegiatan", foto.nama_file);

            return `
                <div
                  class="
                    break-inside-avoid
                    text-center
                  "
                >

                  <img
                    src="${escapeHTML(url)}"
                    alt="Dokumentasi ${index + 1}"
                    class="
                      block
                      h-[105mm]
                      w-full
                      border
                      border-slate-300
                      object-contain
                    "
                  >

                  <p
                    class="
                      mt-1
                      text-[9px]
                      text-slate-600
                    "
                  >
                    Dokumentasi ${index + 1}
                  </p>

                </div>
              `;
          })
          .join("")}

      </div>
    `;
  }

  // =====================================================
  // RENDER DOKUMENTASI RTL
  // =====================================================

  function renderDokumentasiRTL(dokumentasi) {
    if (!Array.isArray(dokumentasi) || !dokumentasi.length) {
      return `
        <p class="text-xs italic text-slate-500">
          Tidak ada dokumentasi RTL.
        </p>
      `;
    }

    return `
      <div
        class="
          grid
          grid-cols-2
          gap-3
        "
      >

        ${dokumentasi
          .map((foto, index) => {
            const url = getFotoUrl("kegiatan", foto.nama_file);

            return `
                <div
                  class="
                    break-inside-avoid
                    text-center
                  "
                >

                  <img
                    src="${escapeHTML(url)}"
                    alt="Dokumentasi RTL ${index + 1}"
                    class="
                      block
                      h-[105mm]
                      w-full
                      border
                      border-slate-300
                      object-contain
                    "
                  >

                  <p
                    class="
                      mt-1
                      text-[9px]
                      text-slate-600
                    "
                  >
                    Dokumentasi RTL ${index + 1}
                  </p>

                </div>
              `;
          })
          .join("")}

      </div>
    `;
  }

  // =====================================================
  // RENDER RTL
  // =====================================================

  function renderRTL(item) {
    const rtl = item.pelaksanaan_rtl || [];

    if (!rtl.length) {
      return `
        <div
          class="
            mt-6
            mb-2
            border-b
            border-slate-900
            pb-1
            text-xs
            font-extrabold
          "
        >
          TINDAK LANJUT
        </div>

        <table
          class="
            w-full
            border-collapse
            text-[11px]
          "
        >

          <tr>
            <th
              class="
                w-[165px]
                border
                border-slate-900
                bg-slate-100
                p-2
                text-left
                font-extrabold
              "
            >
              Rencana Tindak Lanjut
            </th>

            <td
              class="
                border
                border-slate-900
                p-2
                align-top
              "
            >
              ${escapeHTML(item.rtl || "-")}
            </td>
          </tr>

          <tr>
            <th
              class="
                border
                border-slate-900
                bg-slate-100
                p-2
                text-left
                font-extrabold
              "
            >
              Batas Waktu
            </th>

            <td
              class="
                border
                border-slate-900
                p-2
              "
            >
              ${escapeHTML(item.batas_rtl_format || "-")}
            </td>
          </tr>

          <tr>
            <th
              class="
                border
                border-slate-900
                bg-slate-100
                p-2
                text-left
                font-extrabold
              "
            >
              PIC
            </th>

            <td
              class="
                border
                border-slate-900
                p-2
              "
            >
              ${escapeHTML(item.pic_rtl || "-")}
            </td>
          </tr>

        </table>
      `;
    }

    return `
      <div
        class="
          mt-6
          mb-2
          border-b
          border-slate-900
          pb-1
          text-xs
          font-extrabold
        "
      >
        TINDAK LANJUT
      </div>

      <table
        class="
          w-full
          border-collapse
          text-[11px]
        "
      >

        <tr>
          <th
            class="
              w-[165px]
              border
              border-slate-900
              bg-slate-100
              p-2
              text-left
              font-extrabold
            "
          >
            Rencana Tindak Lanjut
          </th>

          <td
            class="
              border
              border-slate-900
              p-2
            "
          >
            ${escapeHTML(item.rtl || "-")}
          </td>
        </tr>

        <tr>
          <th
            class="
              border
              border-slate-900
              bg-slate-100
              p-2
              text-left
              font-extrabold
            "
          >
            Batas Waktu
          </th>

          <td
            class="
              border
              border-slate-900
              p-2
            "
          >
            ${escapeHTML(item.batas_rtl_format || "-")}
          </td>
        </tr>

        <tr>
          <th
            class="
              border
              border-slate-900
              bg-slate-100
              p-2
              text-left
              font-extrabold
            "
          >
            PIC
          </th>

          <td
            class="
              border
              border-slate-900
              p-2
            "
          >
            ${escapeHTML(item.pic_rtl || "-")}
          </td>
        </tr>

      </table>

      ${rtl
        .map(
          (data, index) => `
            <div
              class="
                mt-4
                break-inside-avoid
              "
            >

              <div
                class="
                  mb-2
                  text-[11px]
                  font-extrabold
                "
              >
                PELAKSANAAN RTL ${index + 1}
              </div>

              <table
                class="
                  w-full
                  border-collapse
                  text-[11px]
                "
              >

                <tr>
                  <th
                    class="
                      w-[165px]
                      border
                      border-slate-900
                      bg-slate-100
                      p-2
                      text-left
                      font-extrabold
                    "
                  >
                    Tanggal
                  </th>

                  <td
                    class="
                      border
                      border-slate-900
                      p-2
                    "
                  >
                    ${escapeHTML(
                      data.tanggal_format || formatTanggal(data.tanggal),
                    )}
                  </td>
                </tr>

                <tr>
                  <th
                    class="
                      border
                      border-slate-900
                      bg-slate-100
                      p-2
                      text-left
                      font-extrabold
                    "
                  >
                    Waktu
                  </th>

                  <td
                    class="
                      border
                      border-slate-900
                      p-2
                    "
                  >
                    ${escapeHTML(formatJam(data.jam_mulai))}
                    -
                    ${escapeHTML(formatJam(data.jam_selesai))}
                  </td>
                </tr>

                <tr>
                  <th
                    class="
                      border
                      border-slate-900
                      bg-slate-100
                      p-2
                      text-left
                      font-extrabold
                    "
                  >
                    Tempat
                  </th>

                  <td
                    class="
                      border
                      border-slate-900
                      p-2
                    "
                  >
                    ${escapeHTML(data.tempat || "-")}
                  </td>
                </tr>

                <tr>
                  <th
                    class="
                      border
                      border-slate-900
                      bg-slate-100
                      p-2
                      text-left
                      font-extrabold
                    "
                  >
                    Kegiatan
                  </th>

                  <td
                    class="
                      border
                      border-slate-900
                      p-2
                    "
                  >
                    ${escapeHTML(data.kegiatan || "-")}
                  </td>
                </tr>

                <tr>
                  <th
                    class="
                      border
                      border-slate-900
                      bg-slate-100
                      p-2
                      text-left
                      font-extrabold
                    "
                  >
                    Detail
                  </th>

                  <td
                    class="
                      border
                      border-slate-900
                      p-2
                    "
                  >
                    ${escapeHTML(data.detail || "-")}
                  </td>
                </tr>

                <tr>
                  <th
                    class="
                      border
                      border-slate-900
                      bg-slate-100
                      p-2
                      text-left
                      font-extrabold
                    "
                  >
                    Judul
                  </th>

                  <td
                    class="
                      border
                      border-slate-900
                      p-2
                    "
                  >
                    ${escapeHTML(data.judul || "-")}
                  </td>
                </tr>

                <tr>
                  <th
                    class="
                      border
                      border-slate-900
                      bg-slate-100
                      p-2
                      text-left
                      font-extrabold
                    "
                  >
                    Uraian
                  </th>

                  <td
                    class="
                      border
                      border-slate-900
                      p-2
                    "
                  >
                    ${escapeHTML(data.uraian || "-")}
                  </td>
                </tr>

                <tr>
                  <th
                    class="
                      border
                      border-slate-900
                      bg-slate-100
                      p-2
                      text-left
                      font-extrabold
                    "
                  >
                    Hasil
                  </th>

                  <td
                    class="
                      border
                      border-slate-900
                      p-2
                    "
                  >
                    ${escapeHTML(data.hasil || "-")}
                  </td>
                </tr>

              </table>

              <div
                class="
                  mb-2
                  mt-4
                  text-[10px]
                  font-extrabold
                "
              >
                DOKUMENTASI RTL
              </div>

              ${renderDokumentasiRTL(data.dokumentasi)}

            </div>
          `,
        )
        .join("")}

    `;
  }

  // =====================================================
  // RENDER LAPORAN
  // =====================================================

  function renderLaporan(item, index) {
    const ttdURL = getTTDUrl(item.ttd_user);

    const periodeTahun = selectTahun.value || "-";

    const periodeTriwulan =
      selectTriwulan.options[selectTriwulan.selectedIndex]?.text ||
      "Semua Triwulan";

    /*
     * ==================================================
     * HEADER
     * ==================================================
     *
     * TIDAK CENTER.
     *
     * Kiri:
     * - Logo BPS
     * - Nama instansi
     *
     * Tengah:
     * - alamat
     * - kontak
     *
     * Kanan:
     * - SKALA
     * - jenis laporan
     * - periode
     *
     * Menggunakan flex agar proporsional memenuhi lebar.
     */

    return `
      ${index > 0 ? `<div class="break-before-page"></div>` : ""}

      <!-- =================================================
           HEADER / KOP SURAT
           ================================================= -->

      <div
        class="
          mb-5
          flex
          w-full
          items-center
          justify-between
          gap-5
          border-b-[3px]
          border-slate-900
          pb-3
        "
      >

        <!-- KIRI -->
        <div
          class="
            flex
            w-[58%]
            min-w-0
            items-center
            gap-4
          "
        >

          <img
            src="${escapeHTML(LOGO_URL)}"
            alt="Logo BPS"
            class="
              h-[72px]
              w-[72px]
              shrink-0
              object-contain
            "
          >

          <div
            class="
              min-w-0
              text-left
            "
          >

            <h1
              class="
                m-0
                text-[17px]
                font-black
                leading-tight
                tracking-tight
                text-slate-950
              "
            >
              BADAN PUSAT STATISTIK
            </h1>

            <h2
              class="
                m-0
                mt-0.5
                text-[16px]
                font-black
                leading-tight
                text-slate-950
              "
            >
              KOTA SUKABUMI
            </h2>

            <p
              class="
                mt-1
                text-[8.5px]
                font-medium
                leading-snug
                text-slate-700
              "
            >
              Jl. Selabintana No.14 Sukabumi 43113
            </p>

            <p
              class="
                text-[8.5px]
                font-medium
                leading-snug
                text-slate-700
              "
            >
              Telp. : (0266) 221926
            </p>

            <p
              class="
                text-[8.5px]
                font-medium
                leading-snug
                text-slate-700
              "
            >
              E-mail: bps3272@bps.go.id
            </p>

          </div>

        </div>


        <!-- KANAN -->
        <div
          class="
            w-[42%]
            shrink-0
            text-right
          "
        >

          <p
            class="
              m-0
              text-[13px]
              font-black
              tracking-wide
              text-slate-950
            "
          >
            SKALA
          </p>

          <p
            class="
              mt-1
              text-[10px]
              font-bold
              uppercase
              tracking-wide
              text-slate-700
            "
          >
            SISTEM KELOLA ARSIP
            DAN LAPORAN
          </p>

          <div
            class="
              mt-3
              ml-auto
              w-fit
              rounded-md
              border
              border-slate-300
              px-3
              py-1.5
              text-right
            "
          >

            <p
              class="
                text-[8px]
                font-semibold
                uppercase
                text-slate-500
              "
            >
              Periode
            </p>

            <p
              class="
                text-[10px]
                font-black
                text-slate-900
              "
            >
              ${escapeHTML(periodeTahun)}
              •
              ${escapeHTML(periodeTriwulan)}
            </p>

          </div>

        </div>

      </div>


      <!-- =================================================
           JUDUL
           ================================================= -->

      <div
        class="
          mb-5
          text-center
        "
      >

        <h1
          class="
            m-0
            text-[15px]
            font-black
            uppercase
            tracking-wide
            text-slate-950
          "
        >
          LEMBAR RINCIAN DATA
          KINERJA DAN KEGIATAN
        </h1>

      </div>


      <!-- =================================================
           IDENTITAS PELAKSANA
           ================================================= -->

      <div
        class="
          mb-2
          border-b
          border-slate-900
          pb-1
          text-xs
          font-extrabold
        "
      >
        IDENTITAS PELAKSANA
      </div>

      <table
        class="
          w-full
          border-collapse
          text-[11px]
        "
      >

        <tr>

          <th
            class="
              w-[165px]
              border
              border-slate-900
              bg-slate-100
              p-2
              text-left
              font-extrabold
            "
          >
            Nama
          </th>

          <td
            class="
              border
              border-slate-900
              p-2
              align-top
            "
          >
            ${escapeHTML(item.nama_user || "-")}
          </td>

        </tr>

        <tr>

          <th
            class="
              border
              border-slate-900
              bg-slate-100
              p-2
              text-left
              font-extrabold
            "
          >
            NIP
          </th>

          <td
            class="
              border
              border-slate-900
              p-2
            "
          >
            ${escapeHTML(item.nip_user || "-")}
          </td>

        </tr>

        <tr>

          <th
            class="
              border
              border-slate-900
              bg-slate-100
              p-2
              text-left
              font-extrabold
            "
          >
            Teknis
          </th>

          <td
            class="
              border
              border-slate-900
              p-2
            "
          >
            ${escapeHTML(item.teknis || "-")}
          </td>

        </tr>

      </table>


      <!-- =================================================
           KOMPONEN KINERJA
           ================================================= -->

      <div
        class="
          mb-2
          mt-6
          border-b
          border-slate-900
          pb-1
          text-xs
          font-extrabold
        "
      >
        KOMPONEN KINERJA
      </div>

      <table
        class="
          w-full
          border-collapse
          text-[11px]
        "
      >

        <tr>

          <th
            class="
              w-[165px]
              border
              border-slate-900
              bg-slate-100
              p-2
              text-left
              font-extrabold
            "
          >
            Periode Tahun
          </th>

          <td
            class="
              border
              border-slate-900
              p-2
            "
          >
            ${escapeHTML(periodeTahun)}
          </td>

        </tr>

        <tr>

          <th
            class="
              border
              border-slate-900
              bg-slate-100
              p-2
              text-left
              font-extrabold
            "
          >
            Triwulan
          </th>

          <td
            class="
              border
              border-slate-900
              p-2
            "
          >
            ${escapeHTML(periodeTriwulan)}
          </td>

        </tr>

        <!--
          KODE TUJUAN DIHILANGKAN
          KODE SASARAN DIHILANGKAN
          KODE INDIKATOR DIHILANGKAN
        -->

        <tr>

          <th
            class="
              border
              border-slate-900
              bg-slate-100
              p-2
              text-left
              font-extrabold
            "
          >
            Tujuan
          </th>

          <td
            class="
              border
              border-slate-900
              p-2
            "
          >
            ${escapeHTML(item.tujuan || "-")}
          </td>

        </tr>

        <tr>

          <th
            class="
              border
              border-slate-900
              bg-slate-100
              p-2
              text-left
              font-extrabold
            "
          >
            Sasaran
          </th>

          <td
            class="
              border
              border-slate-900
              p-2
            "
          >
            ${escapeHTML(item.deskripsi_sasaran || "-")}
          </td>

        </tr>

        <tr>

          <th
            class="
              border
              border-slate-900
              bg-slate-100
              p-2
              text-left
              font-extrabold
            "
          >
            Indikator Kinerja
          </th>

          <td
            class="
              border
              border-slate-900
              p-2
            "
          >
            ${escapeHTML(item.uraian_indikator || "-")}
          </td>

        </tr>

        <tr>

          <th
            class="
              border
              border-slate-900
              bg-slate-100
              p-2
              text-left
              font-extrabold
            "
          >
            Kegiatan
          </th>

          <td
            class="
              border
              border-slate-900
              p-2
            "
          >
            ${escapeHTML(item.kegiatan_master || item.kegiatan || "-")}
          </td>

        </tr>

      </table>


      <!-- =================================================
           RINCIAN KEGIATAN
           ================================================= -->

      <div
        class="
          mb-2
          mt-6
          border-b
          border-slate-900
          pb-1
          text-xs
          font-extrabold
        "
      >
        RINCIAN KEGIATAN
      </div>

      <table
        class="
          w-full
          border-collapse
          text-[11px]
        "
      >

        <tr>

          <th
            class="
              w-[165px]
              border
              border-slate-900
              bg-slate-100
              p-2
              text-left
              font-extrabold
            "
          >
            Tanggal
          </th>

          <td
            class="
              border
              border-slate-900
              p-2
            "
          >
            ${escapeHTML(item.tanggal_format || formatTanggal(item.tanggal))}
          </td>

        </tr>

        <tr>

          <th
            class="
              border
              border-slate-900
              bg-slate-100
              p-2
              text-left
              font-extrabold
            "
          >
            Waktu
          </th>

          <td
            class="
              border
              border-slate-900
              p-2
            "
          >
            ${escapeHTML(formatJam(item.jam_mulai))}
            -
            ${escapeHTML(formatJam(item.jam_selesai))}
          </td>

        </tr>

        <tr>

          <th
            class="
              border
              border-slate-900
              bg-slate-100
              p-2
              text-left
              font-extrabold
            "
          >
            Tempat
          </th>

          <td
            class="
              border
              border-slate-900
              p-2
            "
          >
            ${escapeHTML(item.tempat || "-")}
          </td>

        </tr>

        <tr>

          <th
            class="
              border
              border-slate-900
              bg-slate-100
              p-2
              text-left
              font-extrabold
            "
          >
            Judul
          </th>

          <td
            class="
              border
              border-slate-900
              p-2
            "
          >
            ${escapeHTML(item.judul || "-")}
          </td>

        </tr>

        <tr>

          <th
            class="
              border
              border-slate-900
              bg-slate-100
              p-2
              text-left
              font-extrabold
            "
          >
            Uraian
          </th>

          <td
            class="
              border
              border-slate-900
              p-2
            "
          >
            ${escapeHTML(item.uraian || "-")}
          </td>

        </tr>

        <tr>

          <th
            class="
              border
              border-slate-900
              bg-slate-100
              p-2
              text-left
              font-extrabold
            "
          >
            Hasil
          </th>

          <td
            class="
              border
              border-slate-900
              p-2
            "
          >
            ${escapeHTML(item.hasil || "-")}
          </td>

        </tr>

        <tr>

          <th
            class="
              border
              border-slate-900
              bg-slate-100
              p-2
              text-left
              font-extrabold
            "
          >
            Kendala
          </th>

          <td
            class="
              border
              border-slate-900
              p-2
            "
          >
            ${escapeHTML(item.kendala || "-")}
          </td>

        </tr>

        <tr>

          <th
            class="
              border
              border-slate-900
              bg-slate-100
              p-2
              text-left
              font-extrabold
            "
          >
            Solusi
          </th>

          <td
            class="
              border
              border-slate-900
              p-2
            "
          >
            ${escapeHTML(item.solusi || "-")}
          </td>

        </tr>

      </table>


      <!-- =================================================
           RTL
           ================================================= -->

      ${renderRTL(item)}


      <!-- =================================================
           DOKUMENTASI
           ================================================= -->

      <div
        class="
          mb-2
          mt-6
          border-b
          border-slate-900
          pb-1
          text-xs
          font-extrabold
        "
      >
        DOKUMENTASI KEGIATAN
      </div>

      ${renderDokumentasi(item.dokumentasi)}


      <!-- =================================================
           TANDA TANGAN
           ================================================= -->

      <div
        class="
          ml-auto
          mt-8
          w-[230px]
          break-inside-avoid
          text-center
        "
      >

        <p
          class="
            text-[11px]
          "
        >
          Sukabumi,
          ${escapeHTML(item.tanggal_format || formatTanggal(item.tanggal))}
        </p>

        <p
          class="
            text-[11px]
          "
        >
          Pelaksana,
        </p>

        <div
          class="
            flex
            h-[90px]
            items-center
            justify-center
          "
        >

          ${
            ttdURL
              ? `
                <img
                  src="${escapeHTML(ttdURL)}"
                  alt="Tanda Tangan"
                  class="
                    max-h-[85px]
                    max-w-[180px]
                    object-contain
                  "
                >
              `
              : `
                <span
                  class="
                    text-xs
                    italic
                    text-slate-500
                  "
                >
                  TTD tidak tersedia
                </span>
              `
          }

        </div>

        <p
          class="
            font-extrabold
            underline
          "
        >
          ${escapeHTML(item.nama_user || "-")}
        </p>

        <p
          class="
            text-[11px]
          "
        >
          NIP.
          ${escapeHTML(item.nip_user || "-")}
        </p>

      </div>
    `;
  }

  // =====================================================
  // PRINT WINDOW
  // =====================================================

  function bukaPrintWindow(data) {
    const printWindow = window.open("", "_blank", "width=1000,height=800");

    if (!printWindow) {
      throw new Error("Popup diblokir browser. Silakan izinkan popup.");
    }

    printWindow.document.open();

    printWindow.document.write(`
      <!doctype html>

      <html lang="id">

      <head>

        <meta charset="UTF-8">

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        >

        <title>
        </title>

        <!-- =========================================
             TAILWIND CSS LOKAL
             ========================================= -->

        <link
          rel="stylesheet"
          href="${escapeHTML(TAILWIND_CSS)}"
        >

        <!--
          CSS berikut hanya untuk kebutuhan
          halaman print/PDF.

          Bukan Tailwind CDN.
        -->

        <style>

          @page {
            size: A4;
            margin: 12mm 15mm;
          }

          @media print {

            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }

            .break-before-page {
              page-break-before: always;
            }

            .break-inside-avoid {
              break-inside: avoid;
              page-break-inside: avoid;
            }

          }

        </style>

      </head>

   <body
  class="
    m-0
    bg-white
    font-sans
    text-slate-950
  "
>
  <main
    class="
      mx-auto
      w-full
      max-w-[180mm]
      px-[3mm]
      py-[3mm]
    "
  >
    ${data.map((item, index) => renderLaporan(item, index)).join("")}
  </main>
</body>

      </html>
    `);

    printWindow.document.close();
    printWindow.document.title = "";

    waitForImages(printWindow).then(() => {
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
      }, 500);
    });
  }

  // =====================================================
  // WAIT FOR IMAGE
  // =====================================================

  function waitForImages(printWindow) {
    return new Promise((resolve) => {
      const images = printWindow.document.images;

      if (!images.length) {
        resolve();
        return;
      }

      let loaded = 0;

      const done = () => {
        loaded++;

        if (loaded >= images.length) {
          resolve();
        }
      };

      Array.from(images).forEach((img) => {
        if (img.complete) {
          done();
        } else {
          img.addEventListener("load", done, {
            once: true,
          });

          img.addEventListener("error", done, {
            once: true,
          });
        }
      });
    });
  }

  // =====================================================
  // PROSES CETAK
  // =====================================================

  window.prosesCetak = async function () {
    try {
      const data = await fetchLaporan();

      if (!data.length) {
        throw new Error("Tidak ada data yang dapat dicetak.");
      }

      bukaPrintWindow(data);
    } catch (error) {
      console.error("ERROR CETAK LAPORAN:", error);

      alert(error.message || "Gagal membuat laporan.");
    }
  };

  // =====================================================
  // LOAD TAHUN
  // =====================================================

  async function loadTahun() {
    try {
      dataTahun = await fetchAPI(API.tahun);

      fillTahun();
    } catch (error) {
      console.error("ERROR LOAD TAHUN:", error);

      alert(error.message);
    }
  }

  // =====================================================
  // START
  // =====================================================

  loadTahun();
});
