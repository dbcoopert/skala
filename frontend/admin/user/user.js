document.addEventListener("DOMContentLoaded", function () {
  // =====================================================
  // VARIABEL GLOBAL
  // =====================================================

  let indexToDeleteUser = -1;
  let userIdToDelete = null;
  let dataPenggunaLocal = [];

  const BASE_URL = "http://127.0.0.1:3000/api";

  // =====================================================
  // ELEMENT
  // =====================================================

  const viewData = document.getElementById("view-data");
  const viewForm = document.getElementById("view-form");

  const btnTambah = document.getElementById("btn-tambah");
  const btnBatalForm = document.getElementById("btn-batal-form");

  const userForm = document.getElementById("userForm");
  const tableBody = document.querySelector("#userTable tbody");

  // =====================================================
  // FUNGSI DELAY
  // DIGUNAKAN UNTUK LOADING MINIMAL 2 DETIK
  // =====================================================

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // =====================================================
  // NOTIFIKASI
  // =====================================================

  function showNotifikasi(pesan, type = "success") {
    const kontainer = document.getElementById("notifikasiKontainer");

    if (!kontainer) return;

    const notifDiv = document.createElement("div");

    const config = {
      success: {
        icon: "check_circle",
        className: "bg-emerald-50 border-emerald-200 text-emerald-700",
      },
      error: {
        icon: "error",
        className: "bg-red-50 border-red-200 text-red-700",
      },
    };

    const current = config[type] || config.success;

    notifDiv.className = `
      flex
      items-center
      gap-3
      min-w-[280px]
      rounded-2xl
      border
      px-4
      py-3
      text-xs
      font-extrabold
      shadow-xl
      backdrop-blur-sm
      transition-all
      duration-300
      animate-[slideDown_.3s_ease]
      ${current.className}
    `;

    notifDiv.innerHTML = `
      <span class="material-symbols-outlined text-[20px]">
        ${current.icon}
      </span>

      <span>
        ${pesan}
      </span>
    `;

    kontainer.appendChild(notifDiv);

    setTimeout(() => {
      notifDiv.classList.add("opacity-0", "-translate-y-3");

      setTimeout(() => {
        if (notifDiv.parentNode) {
          notifDiv.parentNode.removeChild(notifDiv);
        }
      }, 300);
    }, 3000);
  }

  // =====================================================
  // LOAD DATA PENGGUNA
  // =====================================================

  async function loadDataPengguna() {
    try {
      const response = await fetch(`${BASE_URL}/user`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Gagal memuat data pengguna");
      }

      dataPenggunaLocal = await response.json();

      renderTable();
    } catch (error) {
      console.error("Error Load User:", error);

      dataPenggunaLocal = [];

      renderTable();

      showNotifikasi("Gagal memuat data pengguna.", "error");
    }
  }

  // =====================================================
  // RENDER TABLE
  // =====================================================

  function renderTable() {
    if (!tableBody) return;

    tableBody.innerHTML = "";

    if (dataPenggunaLocal.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td
            colspan="7"
            class="px-6 py-12 text-center"
          >
            <div class="flex flex-col items-center justify-center">

              <div
                class="
                  mb-3
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  bg-slate-100
                  text-slate-400
                "
              >
                <span class="material-symbols-outlined text-[28px]">
                  group
                </span>
              </div>

              <p class="text-sm font-black text-slate-600">
                Belum ada pengguna
              </p>

              <p class="mt-1 text-xs font-semibold text-slate-400">
                Data pengguna akan tampil di sini.
              </p>

            </div>
          </td>
        </tr>
      `;

      return;
    }

    dataPenggunaLocal.forEach((user, index) => {
      const tr = document.createElement("tr");

      tr.className = `
        border-b
        border-slate-100
        transition
        hover:bg-slate-50
      `;

      tr.innerHTML = `
        <td class="whitespace-nowrap px-5 py-4 text-xs font-bold text-slate-500">
          ${index + 1}
        </td>

        <td class="px-5 py-4">
          <div class="flex items-center gap-3">

            <div
              class="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-blue-50
                font-black
                text-blue-600
              "
            >
              ${(user.nama || "?").charAt(0).toUpperCase()}
            </div>

            <span class="font-extrabold text-slate-700">
              ${user.nama || "-"}
            </span>

          </div>
        </td>

        <td class="px-5 py-4 text-xs font-bold text-slate-500">
          ${user.teknis || "-"}
        </td>

        <td class="px-5 py-4 text-xs font-bold text-slate-600">
          ${user.username || "-"}
        </td>

        <td class="px-5 py-4">

          <div class="flex items-center gap-2">

            <span
              class="
                pwd-text
                font-mono
                text-xs
                font-bold
                text-slate-500
              "
              data-pwd="${user.password || ""}"
            >
              ********
            </span>

            <button
              type="button"
              class="
                pwd-toggle
                flex
                h-7
                w-7
                items-center
                justify-center
                rounded-lg
                text-slate-400
                transition
                hover:bg-blue-50
                hover:text-blue-600
              "
              onclick="togglePasswordTable(this)"
              title="Lihat Password"
            >
              <span class="material-symbols-outlined text-[18px]">
                visibility_off
              </span>
            </button>

          </div>

        </td>

        <td class="px-5 py-4">

          <span
            class="
              inline-flex
              rounded-full
              px-3
              py-1
              text-[10px]
              font-black
              ${
                user.role === "admin"
                  ? "bg-purple-50 text-purple-600"
                  : "bg-blue-50 text-blue-600"
              }
            "
          >
            ${user.role || "-"}
          </span>

        </td>

        <td class="px-5 py-4">

          <div class="flex items-center justify-center gap-2">

            <button
              type="button"
              class="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                bg-blue-50
                text-blue-600
                transition
                hover:-translate-y-0.5
                hover:bg-blue-100
              "
              onclick="editDataPengguna(${index})"
              title="Edit Pengguna"
            >
              <span class="material-symbols-outlined text-[18px]">
                edit
              </span>
            </button>

            <button
              type="button"
              class="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                bg-red-50
                text-red-500
                transition
                hover:-translate-y-0.5
                hover:bg-red-100
              "
              onclick="hapusDataPengguna(${index})"
              title="Hapus Pengguna"
            >
              <span class="material-symbols-outlined text-[18px]">
                delete
              </span>
            </button>

          </div>

        </td>
      `;

      tableBody.appendChild(tr);
    });
  }

  // =====================================================
  // LOAD MASTER TEKNIS
  // =====================================================

  async function loadMasterTeknis() {
    try {
      const response = await fetch(`${BASE_URL}/master-teknis`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Gagal memuat master teknis");
      }

      const teknis = await response.json();

      const select = document.getElementById("in-teknis");

      if (!select) return;

      select.innerHTML = `
        <option value="">
          -- Pilih Teknis --
        </option>
      `;

      teknis.forEach((item) => {
        select.innerHTML += `
          <option value="${item.teknis}">
            ${item.teknis}
          </option>
        `;
      });
    } catch (error) {
      console.error("Error Master Teknis:", error);
    }
  }

  // =====================================================
  // SIDEBAR ACCORDION
  // =====================================================

  const menuToggles = document.querySelectorAll(".menu-toggle");

  menuToggles.forEach(function (toggle) {
    toggle.addEventListener("click", function (e) {
      e.preventDefault();

      const parentLi = this.parentElement;

      parentLi.classList.toggle("open");
    });
  });

  // =====================================================
  // TOMBOL TAMBAH
  // =====================================================

  if (btnTambah) {
    btnTambah.addEventListener("click", () => {
      document.getElementById("in-index").value = "";

      userForm.reset();

      viewData.classList.remove("active");

      viewForm.classList.add("active");
    });
  }

  // =====================================================
  // BATAL FORM
  // =====================================================

  if (btnBatalForm) {
    btnBatalForm.addEventListener("click", () => {
      userForm.reset();

      document.getElementById("in-index").value = "";

      [
        "in-nama",
        "in-nip",
        "in-teknis",
        "in-username",
        "in-password",
        "in-role",
      ].forEach((id) => {
        const input = document.getElementById(id);

        if (input) {
          input.classList.remove("input-error");
        }
      });

      viewForm.classList.remove("active");

      viewData.classList.add("active");
    });
  }

  // =====================================================
  // SIMPAN / UPDATE DATA
  // =====================================================

  if (userForm) {
    userForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      let isFormValid = true;

      const indexEdit = document.getElementById("in-index").value;

      const requiredInputs = [
        "in-nama",
        "in-nip",
        "in-teknis",
        "in-username",
        "in-role",
      ];

      if (indexEdit === "") {
        requiredInputs.push("in-password");
      }

      requiredInputs.forEach((id) => {
        const inputEl = document.getElementById(id);

        if (!inputEl || inputEl.value.trim() === "") {
          if (inputEl) {
            inputEl.classList.remove("input-error");

            void inputEl.offsetWidth;

            inputEl.classList.add("input-error");
          }

          isFormValid = false;
        } else {
          inputEl.classList.remove("input-error");
        }
      });

      if (!isFormValid) return;

      const nama = document.getElementById("in-nama").value;

      const nip = document.getElementById("in-nip").value;

      const teknis = document.getElementById("in-teknis").value;

      const username = document.getElementById("in-username").value;

      const password = document.getElementById("in-password").value;

      const role = document.getElementById("in-role").value;

      const fileInput = document.getElementById("in-ttd");

      const formData = new FormData();

      formData.append("nama", nama);
      formData.append("NIP", nip);
      formData.append("teknis", teknis);
      formData.append("username", username);
      formData.append("role", role);

      if (password) {
        formData.append("password", password);
      }

      if (fileInput && fileInput.files.length > 0) {
        formData.append("ttd", fileInput.files[0]);
      }

      try {
        if (indexEdit !== "") {
          const userId = dataPenggunaLocal[indexEdit].id_user;

          const response = await fetch(`${BASE_URL}/user/${userId}`, {
            method: "PUT",
            credentials: "include",
            body: formData,
          });

          if (!response.ok) {
            const err = await response.json();

            throw new Error(err.message || "Gagal memperbarui data");
          }

          showNotifikasi("Data pengguna berhasil diperbarui!");
        } else {
          const response = await fetch(`${BASE_URL}/user`, {
            method: "POST",
            credentials: "include",
            body: formData,
          });

          if (!response.ok) {
            const err = await response.json();

            throw new Error(err.message || "Gagal menambahkan pengguna");
          }

          showNotifikasi("Pengguna baru berhasil ditambahkan!");
        }

        this.reset();

        document.getElementById("in-index").value = "";

        viewForm.classList.remove("active");

        viewData.classList.add("active");

        await loadDataPengguna();
      } catch (error) {
        console.error("Error Saving User:", error);

        showNotifikasi(
          error.message || "Terjadi kesalahan saat menyimpan data.",
          "error",
        );
      }
    });
  }

  // =====================================================
  // EDIT DATA PENGGUNA
  // =====================================================

  window.editDataPengguna = function (index) {
    const user = dataPenggunaLocal[index];

    if (!user) return;

    document.getElementById("in-index").value = index;

    document.getElementById("in-nama").value = user.nama || "";

    document.getElementById("in-nip").value = user.NIP || "";

    document.getElementById("in-teknis").value = user.teknis || "";

    document.getElementById("in-username").value = user.username || "";

    document.getElementById("in-password").value = "";

    document.getElementById("in-role").value = user.role || "";

    [
      "in-nama",
      "in-nip",
      "in-teknis",
      "in-username",
      "in-password",
      "in-role",
    ].forEach((id) => {
      const input = document.getElementById(id);

      if (input) {
        input.classList.remove("input-error");
      }
    });

    viewData.classList.remove("active");

    viewForm.classList.add("active");
  };

  // =====================================================
  // BUKA MODAL HAPUS
  // =====================================================

  window.hapusDataPengguna = function (index) {
    const user = dataPenggunaLocal[index];

    if (!user) return;

    indexToDeleteUser = index;

    userIdToDelete = user.id_user;

    // Tampilkan nama user di modal
    const deleteUserName = document.getElementById("deleteUserName");

    if (deleteUserName) {
      deleteUserName.textContent = user.nama || user.username || "Pengguna";
    }

    const modal = document.getElementById("deleteModal");

    if (modal) {
      modal.classList.remove("hidden");

      modal.classList.add("flex");

      requestAnimationFrame(() => {
        modal
          .querySelector("#deleteModalContent")
          ?.classList.remove("scale-95", "opacity-0");
      });
    }
  };

  // =====================================================
  // TUTUP MODAL
  // =====================================================

  window.closeDeleteModal = function () {
    const modal = document.getElementById("deleteModal");

    const modalContent = document.getElementById("deleteModalContent");

    if (modalContent) {
      modalContent.classList.add("scale-95", "opacity-0");
    }

    setTimeout(() => {
      if (modal) {
        modal.classList.add("hidden");

        modal.classList.remove("flex");
      }

      indexToDeleteUser = -1;

      userIdToDelete = null;
    }, 200);
  };

  // =====================================================
  // KONFIRMASI HAPUS USER
  // =====================================================

  window.konfirmasiHapusPengguna = async function () {
    if (!userIdToDelete) return;

    const btnDelete = document.getElementById("btnConfirmDelete");

    const btnCancel = document.getElementById("btnCancelDelete");

    const deleteButtonText = document.getElementById("deleteButtonText");

    const deleteSpinner = document.getElementById("deleteSpinner");

    // =============================================
    // UBAH KE MODE LOADING
    // =============================================

    if (btnDelete) {
      btnDelete.disabled = true;

      btnDelete.classList.add("cursor-not-allowed", "opacity-80");
    }

    if (btnCancel) {
      btnCancel.disabled = true;

      btnCancel.classList.add("cursor-not-allowed", "opacity-60");
    }

    if (deleteButtonText) {
      deleteButtonText.textContent = "Menghapus data...";
    }

    if (deleteSpinner) {
      deleteSpinner.classList.remove("hidden");

      deleteSpinner.classList.add("inline-block");
    }

    try {
      // =============================================
      // FETCH + DELAY 2 DETIK
      // =============================================

      const [response] = await Promise.all([
        fetch(`${BASE_URL}/user/${userIdToDelete}`, {
          method: "DELETE",
          credentials: "include",
        }),

        delay(2000),
      ]);

      if (!response.ok) {
        let message = "Gagal menghapus pengguna.";

        try {
          const errorData = await response.json();

          message = errorData.message || message;
        } catch (error) {
          console.error(error);
        }

        throw new Error(message);
      }

      // =============================================
      // BERHASIL
      // =============================================

      closeDeleteModal();

      showNotifikasi(
        "Pengguna beserta seluruh data kegiatan dan RTL berhasil dihapus!",
      );

      await loadDataPengguna();
    } catch (error) {
      console.error("Error Delete User:", error);

      showNotifikasi(
        error.message || "Gagal menghapus data pengguna.",
        "error",
      );

      // =============================================
      // KEMBALIKAN TOMBOL
      // =============================================

      if (btnDelete) {
        btnDelete.disabled = false;

        btnDelete.classList.remove("cursor-not-allowed", "opacity-80");
      }

      if (btnCancel) {
        btnCancel.disabled = false;

        btnCancel.classList.remove("cursor-not-allowed", "opacity-60");
      }

      if (deleteButtonText) {
        deleteButtonText.textContent = "Hapus Permanen";
      }

      if (deleteSpinner) {
        deleteSpinner.classList.add("hidden");

        deleteSpinner.classList.remove("inline-block");
      }
    }
  };

  // =====================================================
  // LIHAT / TUTUP PASSWORD
  // =====================================================

  window.togglePasswordTable = function (button) {
    const pwdTextSpan = button.previousElementSibling;

    const icon = button.querySelector(".material-symbols-outlined");

    const actualPassword = pwdTextSpan.getAttribute("data-pwd");

    if (pwdTextSpan.textContent.trim() === "********") {
      pwdTextSpan.textContent = actualPassword;

      icon.textContent = "visibility";

      button.classList.remove("text-slate-400");

      button.classList.add("text-blue-600");
    } else {
      pwdTextSpan.textContent = "********";

      icon.textContent = "visibility_off";

      button.classList.remove("text-blue-600");

      button.classList.add("text-slate-400");
    }
  };

  // =====================================================
  // TUTUP MODAL SAAT KLIK BACKDROP
  // =====================================================

  const deleteModal = document.getElementById("deleteModal");

  if (deleteModal) {
    deleteModal.addEventListener("click", function (e) {
      if (
        e.target === deleteModal &&
        !document.getElementById("btnConfirmDelete")?.disabled
      ) {
        closeDeleteModal();
      }
    });
  }

  // =====================================================
  // INISIALISASI
  // =====================================================

  loadDataPengguna();

  loadMasterTeknis();
});
