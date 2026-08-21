
// 2. LOGIKA DROPDOWN MENU SMOOTH & PANAH
const dropdownToggle = document.getElementById('dropdownToggle');
const submenuMaster = document.getElementById('submenuMaster');
const iconDropdown = document.getElementById('iconDropdown');

const komponenToggle = document.getElementById('komponenToggle');
const submenuKomponen = document.getElementById('submenuKomponen');
const iconKomponen = document.getElementById('iconKomponen');

if(submenuMaster) {
    submenuMaster.style.maxHeight = submenuMaster.scrollHeight + 300 + "px"; 
    iconDropdown.classList.add('rotate');
}

if(dropdownToggle) {
    dropdownToggle.addEventListener('click', () => {
        if (submenuMaster.style.maxHeight && submenuMaster.style.maxHeight !== "0px") {
            submenuMaster.style.maxHeight = "0px";
            iconDropdown.classList.remove('rotate');
            if(submenuKomponen) submenuKomponen.style.maxHeight = "0px";
            if(iconKomponen) iconKomponen.classList.remove('rotate');
        } else {
            submenuMaster.style.maxHeight = submenuMaster.scrollHeight + 300 + "px";
            iconDropdown.classList.add('rotate');
        }
    });
}

if(komponenToggle) {
    komponenToggle.addEventListener('click', (e) => {
        e.stopPropagation(); 
        if (submenuKomponen.style.maxHeight && submenuKomponen.style.maxHeight !== "0px") {
            submenuKomponen.style.maxHeight = "0px";
            iconKomponen.classList.remove('rotate');
        } else {
            submenuKomponen.style.maxHeight = submenuKomponen.scrollHeight + "px";
            iconKomponen.classList.add('rotate');
            submenuMaster.style.maxHeight = (submenuMaster.scrollHeight + submenuKomponen.scrollHeight + 50) + "px"; 
        }
    });
}

// =========================================
// 3. LOGIKA CRUD & INTEGRASI BACKEND
// =========================================

// Sesuaikan URL jika routing utama Anda berbeda (misal: /admin/teknis)
const API_URL = 'http://127.0.0.1:3000/master/teknis'; 


let dataTeknis = [];
let editIndex = -1;
let indexToDelete = -1; 

// =========================================
// Fungsi Bikin Notifikasi Animasi (TETAP)
// =========================================
function showNotifikasi(pesan) {
    const kontainer = document.getElementById('notifikasiKontainer');
    if(!kontainer) return;

    const notifDiv = document.createElement('div');
    notifDiv.classList.add('notifikasi-sukses');
    
    notifDiv.innerHTML = `<span class="material-symbols-outlined">check_circle</span> <span>${pesan}</span>`;
    kontainer.appendChild(notifDiv);
    
    setTimeout(() => {
        notifDiv.classList.add('hapus');
        setTimeout(() => {
            if (notifDiv.parentNode) {
                notifDiv.parentNode.removeChild(notifDiv);
            }
        }, 500); 
    }, 3000);
}
// =========================================

function showForm(isEdit = false) {
    document.getElementById('tableView').style.display = 'none';
    document.getElementById('formView').style.display = 'block';
    
    const inputElement = document.getElementById('inputTeknis');
    const errorMsg = document.getElementById('errorMsg');
    
    inputElement.classList.remove('input-error');
    if(errorMsg) errorMsg.style.display = 'none';

    if (!isEdit) {
        document.getElementById('formTitle').textContent = "Tambah Data Teknis";
        inputElement.value = '';
        editIndex = -1;
    }
}

function hideForm() {
    document.getElementById('formView').style.display = 'none';
    document.getElementById('tableView').style.display = 'block';
    document.getElementById('inputTeknis').value = '';
    editIndex = -1;
}

// [BARU] Fungsi mengambil data dari Server
async function fetchDataTeknis() {
    try {
        const response = await fetch(API_URL, {
          method: "GET",
          credentials: "include",
        });
        const result = await response.json();
        
        // Sesuai dengan controller yang mengirimkan { success: true }
        if (result.success) {
            dataTeknis = result.data;
            renderTable();
        }
    } catch (error) {
        console.error('Gagal mengambil data:', error);
    }
}

function renderTable() {
    const tableBody = document.getElementById('tableBody');
    if(!tableBody) return;
    
    tableBody.innerHTML = '';

    if (dataTeknis.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="3" style="text-align:center; padding: 20px;">Belum ada data teknis.</td></tr>`;
        return;
    }

    dataTeknis.forEach((item, index) => {
        // Asumsi nama kolom di database Anda adalah 'teknis' (fallback ke 'nama' jika berbeda)
        const nilaiTeks = item.teknis || item.nama || '-';
        
        const row = `
            <tr>
                <td>${index + 1}</td>
                <td>${nilaiTeks}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon edit" onclick="editData(${index})" title="Edit">
                            <span class="material-symbols-outlined">edit</span>
                        </button>
                        <button class="btn-icon delete" onclick="hapusData(${index})" title="Hapus">
                            <span class="material-symbols-outlined">delete</span>
                        </button>
                    </div>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

window.editData = function(index) {
    document.getElementById('formTitle').textContent = "Edit Data Teknis";
    document.getElementById('inputTeknis').value = dataTeknis[index].teknis || dataTeknis[index].nama;
    editIndex = index;
    showForm(true);
};

// [DIUBAH] Fungsi Simpan terhubung ke API (POST/PUT)
window.simpanData = async function() {
    const inputElement = document.getElementById('inputTeknis');
    const nilaiInput = inputElement.value;
    const errorMsg = document.getElementById('errorMsg');

    if (nilaiInput.trim() === '') {
        inputElement.classList.remove('input-error'); 
        void inputElement.offsetWidth; // Memicu ulang animasi CSS (Getar)
        inputElement.classList.add('input-error'); 
        errorMsg.style.display = 'block'; 
        return;
    }

    inputElement.classList.remove('input-error');
    errorMsg.style.display = 'none';

    try {
        if (editIndex > -1) {
            // UPDATE DATA KE SERVER (PUT)
            const idToUpdate = dataTeknis[editIndex].id_teknis; // Ambil ID dari database
            const response = await fetch(`${API_URL}/${idToUpdate}`, {
              method: "PUT",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ teknis: nilaiInput }), // Sesuai req.body.teknis di controller
            });
            const result = await response.json();
            
            if (result.success) {
                showNotifikasi('Data Teknis berhasil diperbarui!');
            } else {
                alert(result.message);
            }
        } else {
            // TAMBAH DATA KE SERVER (POST ke endpoint /baru)
            const response = await fetch(`${API_URL}/baru`, {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ teknis: nilaiInput }), // Sesuai req.body.teknis di controller
            });
            const result = await response.json();
            
            if (result.success) {
                showNotifikasi('Data Teknis berhasil disimpan!');
            } else {
                alert(result.message);
            }
        }
        
        hideForm();
        fetchDataTeknis(); // Memuat ulang data tabel dari database
        
    } catch (error) {
        console.error('Error saat menyimpan:', error);
        alert(`Gagal terhubung ke serverrrr. ${error.message}`);
    }
};

window.hapusData = function(index) {
    indexToDelete = index;
    document.getElementById('deleteModal').style.display = 'flex';
};

window.closeDeleteModal = function() {
    document.getElementById('deleteModal').style.display = 'none';
    indexToDelete = -1;
};

// [DIUBAH] Fungsi Hapus terhubung ke API (DELETE)
window.konfirmasiHapus = async function() {
    if (indexToDelete > -1) {
        const idToDelete = dataTeknis[indexToDelete].id_teknis; // Ambil ID asli
        
        try {
            const response = await fetch(`${API_URL}/${idToDelete}`, {
              method: "DELETE",
              credentials: "include"
            });
            const result = await response.json();

            if (result.success) {
                closeDeleteModal();
                showNotifikasi('Data Teknis berhasil dihapus!');
                fetchDataTeknis(); // Memuat ulang data tabel setelah dihapus
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error('Error saat menghapus:', error);
            alert('Gagal menghapus data.');
        }
    }
};

// Menu Accordion Sidebar
    const menuToggles = document.querySelectorAll('.menu-toggle');
    menuToggles.forEach(function(toggle) {
        toggle.addEventListener('click', function(e) {
            e.preventDefault(); 
            const parentLi = this.parentElement;
            parentLi.classList.toggle('open');
        });
    });

document.addEventListener('DOMContentLoaded', () => {
    // Memuat data pertama kali ketika halaman dibuka
    fetchDataTeknis();
});