console.log("Upload JS Loaded");

window.addEventListener("beforeunload", () => {
  console.log("BEFORE UNLOAD");
});

window.addEventListener("unload", () => {
  console.log("UNLOAD");
});

window.addEventListener("pageshow", () => {
  console.log("PAGESHOW");
});

window.addEventListener("pagehide", () => {
  console.log("PAGEHIDE");
});

// ======================================
// SKALA - Upload Dokumentasi
// ======================================
console.log(window.location.href);

console.log(window.location.search);

const params = new URLSearchParams(window.location.search);

console.log(params.toString());

const idKegiatan = params.get("id");

console.log("ID =", idKegiatan);

console.log("upload.js dimuat");

window.addEventListener("beforeunload", () => {
  console.log("HALAMAN AKAN RELOAD");
});

// ======================================
// ELEMENT
// ======================================

const indikator = document.getElementById("indikator");
const kegiatan = document.getElementById("kegiatan");
const judul = document.getElementById("judul");
const tanggal = document.getElementById("tanggal");
const jam = document.getElementById("jam");

const fileInput = document.getElementById("fileInput");

const previewContainer = document.getElementById("previewContainer");

const jumlahFoto = document.getElementById("jumlahFoto");

const btnUpload = document.getElementById("btnUpload");

const loading = document.getElementById("loadingScreen");

// ======================================
// DATA KEGIATAN
// ======================================

let kegiatanData = null;

// ======================================
// LOAD PAGE
// ======================================

window.addEventListener("DOMContentLoaded", () => {
  if (!idKegiatan) {
    alert("ID kegiatan tidak ditemukan");

    location.href = "dashboard.html";

    return;
  }

  loadKegiatan();
});

// ======================================
// LOAD DETAIL KEGIATAN
// ======================================

async function loadKegiatan() {
  try {
    const response = await fetch(`${BASE_URL}/api/kegiatan/${idKegiatan}`, {
      credentials: "include",
    });

    const result = await response.json();

    if (!result.success) {
      alert(result.message);

      return;
    }

    kegiatanData = result.data;

    indikator.textContent = kegiatanData.indikator;

    kegiatan.textContent = kegiatanData.kegiatan;

    judul.textContent = kegiatanData.judul;

    tanggal.textContent = formatTanggal(kegiatanData.tanggal);

    jam.textContent = kegiatanData.jam_mulai + " - " + kegiatanData.jam_selesai;
  } catch (err) {
    console.error(err);

    alert("Gagal mengambil data kegiatan");
  }
}

// ======================================
// FORMAT TANGGAL
// ======================================

function formatTanggal(tgl) {
  return new Date(tgl).toLocaleDateString("id-ID", {
    day: "numeric",

    month: "long",

    year: "numeric",
  });
}

// ======================================
// PREVIEW FOTO
// ======================================

fileInput.addEventListener("change", previewFiles);

function previewFiles() {
  previewContainer.innerHTML = "";

  jumlahFoto.innerHTML = fileInput.files.length + " Foto dipilih";

  Array.from(fileInput.files).forEach((file) => {
    const reader = new FileReader();

    reader.onload = function (e) {
      const img = document.createElement("img");

      img.src = e.target.result;

      previewContainer.appendChild(img);
    };

    reader.readAsDataURL(file);
  });
}

// ======================================
// BUTTON
// ======================================

btnUpload.addEventListener("click", kirimData);

// ======================================
// UPLOAD
// ======================================

async function kirimData() {
  if (fileInput.files.length === 0) {
    alert("Silakan pilih foto.");

    return;
  }

  btnUpload.disabled = true;

  loading.classList.add("show");

  try {
    const formData = new FormData();

    formData.append("id_kegiatan", idKegiatan);

    Array.from(fileInput.files).forEach((file) => {
      formData.append("foto", file);
    });

    const response = await fetch(`${BASE_URL}/api/dokumentasi/kegiatan`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    console.log(response.status);
    console.log(response.headers.get("content-type"));
    const result = await response.json();

    loading.classList.remove("show");

    btnUpload.disabled = false;

    if (!result.success) {
      alert(result.message);

      return;
    }
    console.log("SUCCESS DIMULAI");
    tampilkanSuccess();
   
  } catch (err) {
    loading.classList.remove("show");
    btnUpload.disabled = false;

    console.error("ERROR :", err);
    console.error(err.stack);

    alert(err.message);
  }
}

// ======================================
// SUCCESS PAGE
// ======================================

function tampilkanSuccess() {
  console.log("=== SUCCESS PAGE ===");
  console.log(kegiatanData);

  const uploadPage = document.getElementById("uploadPage");
  const successPage = document.getElementById("successPage");

  uploadPage.style.display = "none";
  successPage.classList.add("show");
  console.log("SUCCESS SUDAH TAMPIL");

  document.getElementById("sNama").textContent = kegiatanData.nama;
  document.getElementById("sRole").textContent = kegiatanData.role;
  document.getElementById("sIndikator").textContent = kegiatanData.indikator;
  document.getElementById("sKegiatan").textContent = kegiatanData.kegiatan;
  document.getElementById("sJudul").textContent = kegiatanData.judul;
  document.getElementById("sTanggal").textContent = formatTanggal(
    kegiatanData.tanggal,
  );
  document.getElementById("sJam").textContent =
    kegiatanData.jam_mulai + " - " + kegiatanData.jam_selesai;
  document.getElementById("sFoto").textContent =
    fileInput.files.length + " Foto";

  console.log("Success page ditampilkan");
}

// ======================================
// HOME
// ======================================

document.getElementById("btnHome").addEventListener("click", () => {
  location.href = "dashboard.html";
});

// ======================================
// MENU
// ======================================

document.getElementById("btnMenu").addEventListener("click", () => {
  alert("Menu akan ditambahkan pada Sprint berikutnya.");
});
