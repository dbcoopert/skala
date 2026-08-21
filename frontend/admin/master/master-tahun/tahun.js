document.addEventListener("DOMContentLoaded", () => {
  /* =========================================================
     CONFIG
  ========================================================== */

  const API_URL = "http://127.0.0.1:3000/master/tahun";
  const LAPORAN_URL = "./laporan.html";

  /* =========================================================
     VARIABLE
  ========================================================== */

  let dataTahunSKALA = [];
  let dataTahunGrouped = [];
  let indexToDelete = -1;
  let isDeleting = false;

  /* =========================================================
     ELEMENT
  ========================================================== */

  const tableBody = document.getElementById("tableBody");
  const deleteModal = document.getElementById("deleteModal");
  const notificationContainer = document.getElementById("notifikasiKontainer");

  const deleteStepWarning = document.getElementById("deleteStepWarning");

  const deleteStepConfirm = document.getElementById("deleteStepConfirm");

  const deleteTahunText = document.getElementById("deleteTahunText");

  const deleteTahunConfirm = document.getElementById("deleteTahunConfirm");

  const btnKonfirmasiHapus = document.getElementById("btnKonfirmasiHapus");

  const deleteButtonText = document.getElementById("deleteButtonText");

  const deleteButtonLoading = document.getElementById("deleteButtonLoading");

  /* =========================================================
     NOTIFIKASI
  ========================================================== */

  function showNotifikasi(pesan) {
    if (!notificationContainer) return;

    const div = document.createElement("div");

    div.className =
      "flex items-center gap-3 rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm font-bold text-emerald-700 shadow-lg transition-all duration-300";

    div.innerHTML = `
      <span
        class="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500"
      >
        <i class="fa-solid fa-circle-check text-sm"></i>
      </span>

      <span class="min-w-0 flex-1">
        ${escapeHTML(pesan)}
      </span>
    `;

    notificationContainer.appendChild(div);

    setTimeout(() => {
      div.classList.add("translate-x-5", "opacity-0");

      setTimeout(() => {
        div.remove();
      }, 300);
    }, 3000);
  }

  /* =========================================================
     ERROR INPUT
  ========================================================== */

  function showError(input, error = null) {
    if (!input) return;

    input.classList.remove("border-red-500", "ring-4", "ring-red-500/10");

    void input.offsetWidth;

    input.classList.add("border-red-500", "ring-4", "ring-red-500/10");

    if (error) {
      error.classList.remove("hidden");
    }
  }

  function clearError(input, error = null) {
    if (input) {
      input.classList.remove("border-red-500", "ring-4", "ring-red-500/10");
    }

    if (error) {
      error.classList.add("hidden");
    }
  }

  /* =========================================================
     FETCH DATA TAHUN
  ========================================================== */

  async function fetchTahunData() {
    try {
      const response = await fetch(API_URL, {
        method: "GET",
        credentials: "include",
      });

      const result = await response.json();

      if (response.status === 401 || response.status === 403) {
        console.error(result.message || "Sesi login telah berakhir.");

        return;
      }

      if (response.ok && result.success === true) {
        dataTahunSKALA = Array.isArray(result.data) ? result.data : [];

        groupData();
        renderTable();
      } else {
        console.error(result.message || "Gagal mengambil data tahun.");
      }
    } catch (error) {
      console.error("Gagal mengambil data tahun:", error);
    }
  }

  /* =========================================================
     GROUP DATA BERDASARKAN TAHUN
  ========================================================== */

  function groupData() {
    const grouped = {};

    dataTahunSKALA.forEach((item) => {
      const tahun = Number(item.tahun);

      if (!grouped[tahun]) {
        grouped[tahun] = {
          tahun,
          triwulan: [],
          keterangan: [],
          records: [],
        };
      }

      if (item.triwulan !== null && item.triwulan !== undefined) {
        grouped[tahun].triwulan.push(Number(item.triwulan));
      }

      grouped[tahun].keterangan.push(item.keterangan || "");

      grouped[tahun].records.push(item);
    });

    dataTahunGrouped = Object.values(grouped).sort((a, b) => b.tahun - a.tahun);
  }

  /* =========================================================
     TRIWULAN
  ========================================================== */

  function getTriwulanText(nomor) {
    const data = {
      1: "I",
      2: "II",
      3: "III",
      4: "IV",
    };

    return data[nomor] || nomor;
  }

  /* =========================================================
     BUKA LAPORAN
  ========================================================== */

  function bukaLaporan(tahun, triwulan = null) {
    const params = new URLSearchParams();

    params.set("tahun", tahun);

    if (triwulan !== null && triwulan !== undefined) {
      params.set("triwulan", triwulan);
    }

    window.location.href = `${LAPORAN_URL}?${params.toString()}`;
  }

  /* =========================================================
     RENDER TABLE
  ========================================================== */

  function renderTable() {
    if (!tableBody) return;

    tableBody.innerHTML = "";

    if (!dataTahunGrouped.length) {
      tableBody.innerHTML = `
        <tr>
          <td
            colspan="5"
            class="px-5 py-10 text-center text-sm font-semibold text-[#71839a]"
          >
            <div
              class="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f1f5f9] text-[#94a3b8]"
            >
              <i class="fa-solid fa-calendar-xmark"></i>
            </div>

            <p class="mt-3">
              Belum ada data master tahun.
            </p>
          </td>
        </tr>
      `;

      return;
    }

    dataTahunGrouped.forEach((item, index) => {
      const tr = document.createElement("tr");

      renderNormalRow(tr, item, index);

      tableBody.appendChild(tr);
    });
  }

  /* =========================================================
     NORMAL ROW
  ========================================================== */

  function renderNormalRow(tr, item, index) {
    tr.className = "cursor-pointer transition hover:bg-[#a8ccfb]";

    const sortedTriwulan = [...item.triwulan]
      .filter((value, index, array) => array.indexOf(value) === index)
      .sort((a, b) => a - b);

    const triwulanHTML = sortedTriwulan
      .map(
        (triwulan) => `
            <span
              class="inline-flex min-w-8 items-center justify-center rounded-lg bg-[#e8f2fc] px-2 py-1 text-[10px] font-black text-[#0d4fa6]"
            >
              ${getTriwulanText(triwulan)}
            </span>
          `,
      )
      .join("");

    const keteranganHTML = item.keterangan
      .filter((value, index, array) => value && array.indexOf(value) === index)
      .map(
        (keterangan) => `
            <div class="leading-5">
              ${escapeHTML(keterangan)}
            </div>
          `,
      )
      .join("");

    tr.innerHTML = `
      <!-- NOMOR -->
      <td
        class="px-5 py-4 text-center text-xs font-bold text-[#71839a]"
      >
        ${index + 1}
      </td>

      <!-- TAHUN -->
      <td class="px-5 py-4">
        <div class="flex items-center gap-2">

          <span
            class="text-sm font-black italic text-[#172033]"
          >
            ${escapeHTML(item.tahun)}
          </span>

          <i
            class="fa-solid fa-arrow-up-right-from-square text-[9px] text-[#94a3b8]"
          ></i>

        </div>
      </td>

      <!-- TRIWULAN -->
      <td class="px-5 py-4">
        <div
          class="flex flex-wrap justify-center gap-1.5"
        >
          ${triwulanHTML}
        </div>
      </td>

      <!-- KETERANGAN -->
      <td
        class="px-5 py-4 text-xs font-semibold text-[#53657b]"
      >
        <div class="space-y-1">
          ${keteranganHTML || "-"}
        </div>
      </td>

      <!-- AKSI -->
      <td class="px-5 py-4">

        <div
          class="flex items-center justify-center"
        >

          <!-- HAPUS -->
          <button
            type="button"
            class="btn-hapus flex h-9 w-9 items-center justify-center rounded-xl border border-[#f2d2d2] bg-[#fff8f8] text-[#c63a3a] transition hover:border-[#c63a3a] hover:bg-[#c63a3a] hover:text-white"
            data-index="${index}"
            title="Hapus Tahun"
          >
            <i
              class="fa-solid fa-trash text-xs"
            ></i>
          </button>

        </div>

      </td>
    `;

    /* =====================================================
       KLIK BARIS → LAPORAN
    ====================================================== */

    tr.addEventListener("click", () => {
      bukaLaporan(item.tahun);
    });

    /* =====================================================
       HAPUS
    ====================================================== */

    const btnHapus = tr.querySelector(".btn-hapus");

    if (btnHapus) {
      btnHapus.addEventListener("click", (event) => {
        event.stopPropagation();

        hapusData(Number(btnHapus.dataset.index));
      });
    }
  }

  /* =========================================================
     BUKA MODAL HAPUS
  ========================================================== */

  function hapusData(index) {
    const data = dataTahunGrouped[index];

    if (!data) {
      return;
    }

    indexToDelete = index;

    const tahun = Number(data.tahun);

    if (deleteTahunText) {
      deleteTahunText.textContent = tahun;
    }

    if (deleteTahunConfirm) {
      deleteTahunConfirm.textContent = tahun;
    }

    // Kembali ke tahap pertama
    if (deleteStepWarning) {
      deleteStepWarning.classList.remove("hidden");
    }

    if (deleteStepConfirm) {
      deleteStepConfirm.classList.add("hidden");
    }

    if (deleteModal) {
      deleteModal.classList.remove("hidden");

      deleteModal.classList.add("flex");
    }
  }

  /* =========================================================
     LANJUT KE KONFIRMASI KEDUA
  ========================================================== */

  window.lanjutKonfirmasiHapus = function () {
    if (indexToDelete < 0) {
      return;
    }

    if (deleteStepWarning) {
      deleteStepWarning.classList.add("hidden");
    }

    if (deleteStepConfirm) {
      deleteStepConfirm.classList.remove("hidden");
    }
  };

  /* =========================================================
     KEMBALI KE WARNING
  ========================================================== */

  window.kembaliPeringatanHapus = function () {
    if (isDeleting) {
      return;
    }

    if (deleteStepConfirm) {
      deleteStepConfirm.classList.add("hidden");
    }

    if (deleteStepWarning) {
      deleteStepWarning.classList.remove("hidden");
    }
  };

  /* =========================================================
     CLOSE MODAL
  ========================================================== */

  window.closeDeleteModal = function () {
    if (isDeleting) {
      return;
    }

    if (deleteModal) {
      deleteModal.classList.remove("flex");

      deleteModal.classList.add("hidden");
    }

    if (deleteStepConfirm) {
      deleteStepConfirm.classList.add("hidden");
    }

    if (deleteStepWarning) {
      deleteStepWarning.classList.remove("hidden");
    }

    indexToDelete = -1;
  };

  /* =========================================================
     SET LOADING DELETE
  ========================================================== */

  function setDeleteLoading(loading) {
    if (btnKonfirmasiHapus) {
      btnKonfirmasiHapus.disabled = loading;
    }

    if (deleteButtonText) {
      deleteButtonText.textContent = loading ? "Menghapus..." : "Ya, Hapus";
    }

    if (deleteButtonLoading) {
      if (loading) {
        deleteButtonLoading.classList.remove("hidden");
      } else {
        deleteButtonLoading.classList.add("hidden");
      }
    }
  }

  /* =========================================================
     DELAY
  ========================================================== */

  function delay(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  /* =========================================================
     KONFIRMASI HAPUS
  ========================================================== */

  window.konfirmasiHapus = async function () {
    if (indexToDelete < 0 || isDeleting) {
      return;
    }

    const data = dataTahunGrouped[indexToDelete];

    if (!data) {
      alert("Data tahun tidak ditemukan.");

      return;
    }

    const tahun = Number(data.tahun);

    try {
      isDeleting = true;

      setDeleteLoading(true);

      /*
          Simpan waktu mulai.

          Tujuannya agar loading
          minimal tampil selama 2 detik.
        */

      const startTime = Date.now();

      const response = await fetch(`${API_URL}/by-tahun/${tahun}`, {
        method: "DELETE",
        credentials: "include",
      });

      const result = await response.json();

      /*
          HITUNG SISA WAKTU
          AGAR TOTAL MINIMAL 2 DETIK
        */

      const elapsedTime = Date.now() - startTime;

      const remainingTime = Math.max(0, 2000 - elapsedTime);

      if (remainingTime > 0) {
        await delay(remainingTime);
      }

      if (response.ok && result.success === true) {
        isDeleting = false;

        setDeleteLoading(false);

        /*
            Tutup modal secara manual
            karena closeDeleteModal()
            diblokir saat isDeleting.
          */

        if (deleteModal) {
          deleteModal.classList.remove("flex");

          deleteModal.classList.add("hidden");
        }

        indexToDelete = -1;

        await fetchTahunData();

        showNotifikasi(`Tahun ${tahun} berhasil dihapus!`);
      } else {
        isDeleting = false;

        setDeleteLoading(false);

        alert(result.message || "Gagal menghapus data tahun.");
      }
    } catch (error) {
      console.error("Gagal menghapus data:", error);

      /*
          Jika request error terlalu cepat,
          loading tetap dibuat minimal
          agar transisi UI tetap halus.
        */

      await delay(2000);

      isDeleting = false;

      setDeleteLoading(false);

      alert("Terjadi kesalahan saat menghapus data tahun.");
    }
  };

  /* =========================================================
     FORM TAMBAH TAHUN
  ========================================================== */

  const formTambah = document.getElementById("formTambahTahun");

  if (formTambah) {
    formTambah.addEventListener("submit", async (event) => {
      event.preventDefault();

      const inputTahun = document.getElementById("inputTahun");

      const errorMsg = document.getElementById("errorMsg");

      if (!inputTahun) {
        return;
      }

      const tahun = inputTahun.value.trim();

      if (!tahun) {
        showError(inputTahun, errorMsg);

        return;
      }

      const tahunNumber = Number(tahun);

      if (
        !Number.isInteger(tahunNumber) ||
        tahunNumber < 2000 ||
        tahunNumber > 2100
      ) {
        if (errorMsg) {
          errorMsg.textContent =
            "Tahun harus berupa angka antara 2000 sampai 2100.";

          errorMsg.classList.remove("hidden");
        }

        showError(inputTahun);

        return;
      }

      clearError(inputTahun, errorMsg);

      try {
        const response = await fetch(`${API_URL}/baru`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tahun: tahunNumber,
          }),
        });

        const result = await response.json();

        if (response.ok && result.success === true) {
          showNotifikasi(`Tahun ${tahunNumber} berhasil disimpan!`);

          setTimeout(() => {
            window.location.href = "tahun.html";
          }, 800);
        } else {
          alert(result.message || "Gagal menyimpan data tahun.");
        }
      } catch (error) {
        console.error("Gagal menyimpan data tahun:", error);

        alert("Terjadi kesalahan saat menyimpan data tahun.");
      }
    });

    const inputTahun = document.getElementById("inputTahun");

    const errorMsg = document.getElementById("errorMsg");

    if (inputTahun) {
      inputTahun.addEventListener("input", () => {
        clearError(inputTahun, errorMsg);
      });
    }
  }

  /* =========================================================
     ESCAPE HTML
  ========================================================== */

  function escapeHTML(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  /* =========================================================
     LOAD DATA
  ========================================================== */

  if (tableBody) {
    fetchTahunData();
  }
});
