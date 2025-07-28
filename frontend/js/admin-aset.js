import { BASE_URL } from "../utils.js";

// =========================
// ==== MODERN POPUP FUNCTIONS ====
// =========================

// Modern Alert Function
function showModernAlert(message, type = "info") {
  // Remove existing alerts
  const existingAlerts = document.querySelectorAll(".modern-alert");
  existingAlerts.forEach((alert) => alert.remove());

  const alertDiv = document.createElement("div");
  alertDiv.className = `modern-alert alert-${type} fade-in`;

  let icon = "";
  let bgColor = "";

  switch (type) {
    case "success":
      icon = '<i class="bi bi-check-circle-fill"></i>';
      bgColor = "#28a745";
      break;
    case "error":
      icon = '<i class="bi bi-x-circle-fill"></i>';
      bgColor = "#dc3545";
      break;
    case "warning":
      icon = '<i class="bi bi-exclamation-triangle-fill"></i>';
      bgColor = "#ffc107";
      break;
    default:
      icon = '<i class="bi bi-info-circle-fill"></i>';
      bgColor = "#007bff";
  }

  alertDiv.innerHTML = `
    <div class="modern-alert-content">
      ${icon}
      <span class="modern-alert-message">${message}</span>
      <button class="modern-alert-close" onclick="this.parentElement.parentElement.remove()">
        <i class="bi bi-x"></i>
      </button>
    </div>
  `;

  alertDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${bgColor};
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 8px 20px rgba(0,0,0,0.3);
    z-index: 9999;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    max-width: 400px;
    min-width: 300px;
    opacity: 0;
    transform: translateX(100%);
    transition: all 0.3s ease;
  `;

  alertDiv.querySelector(".modern-alert-content").style.cssText = `
    display: flex;
    align-items: center;
    gap: 12px;
  `;

  alertDiv.querySelector(".modern-alert-message").style.cssText = `
    flex: 1;
    font-weight: 500;
  `;

  alertDiv.querySelector(".modern-alert-close").style.cssText = `
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    padding: 2px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    opacity: 0.7;
    transition: opacity 0.2s ease;
  `;

  // Add hover effect for close button
  alertDiv.querySelector(".modern-alert-close").onmouseover = function () {
    this.style.opacity = "1";
    this.style.backgroundColor = "rgba(255,255,255,0.2)";
  };

  alertDiv.querySelector(".modern-alert-close").onmouseout = function () {
    this.style.opacity = "0.7";
    this.style.backgroundColor = "transparent";
  };

  document.body.appendChild(alertDiv);

  // Animate in
  setTimeout(() => {
    alertDiv.style.opacity = "1";
    alertDiv.style.transform = "translateX(0)";
  }, 50);

  // Auto remove after 5 seconds
  setTimeout(() => {
    alertDiv.style.opacity = "0";
    alertDiv.style.transform = "translateX(100%)";
    setTimeout(() => {
      if (alertDiv.parentNode) {
        alertDiv.remove();
      }
    }, 300);
  }, 5000);
}

// Modern Confirm Function
function showModernConfirm(message, onConfirm, onCancel = null) {
  // Remove existing confirms
  const existingConfirms = document.querySelectorAll(".modern-confirm");
  existingConfirms.forEach((confirm) => confirm.remove());

  const confirmDiv = document.createElement("div");
  confirmDiv.className = "modern-confirm fade-in";

  confirmDiv.innerHTML = `
    <div class="modern-confirm-backdrop">
      <div class="modern-confirm-content">
        <div class="modern-confirm-header">
          <i class="bi bi-question-circle-fill text-warning"></i>
          <h5>Konfirmasi</h5>
        </div>
        <div class="modern-confirm-body">
          <p>${message}</p>
        </div>
        <div class="modern-confirm-footer">
          <button class="btn btn-outline-secondary modern-confirm-cancel">
            <i class="bi bi-x-circle me-1"></i>Batal
          </button>
          <button class="btn btn-danger modern-confirm-ok">
            <i class="bi bi-check-circle me-1"></i>Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  `;

  confirmDiv.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
  `;

  confirmDiv.querySelector(".modern-confirm-backdrop").style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
  `;

  confirmDiv.querySelector(".modern-confirm-content").style.cssText = `
    background: white;
    border-radius: 12px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
    min-width: 400px;
    max-width: 500px;
    transform: scale(0.8);
    transition: transform 0.3s ease;
  `;

  confirmDiv.querySelector(".modern-confirm-header").style.cssText = `
    padding: 20px 24px 0;
    display: flex;
    align-items: center;
    gap: 12px;
  `;

  confirmDiv.querySelector(".modern-confirm-header i").style.cssText = `
    font-size: 24px;
  `;

  confirmDiv.querySelector(".modern-confirm-header h5").style.cssText = `
    margin: 0;
    font-weight: 600;
    color: #333;
  `;

  confirmDiv.querySelector(".modern-confirm-body").style.cssText = `
    padding: 16px 24px;
  `;

  confirmDiv.querySelector(".modern-confirm-body p").style.cssText = `
    margin: 0;
    color: #666;
    line-height: 1.5;
  `;

  confirmDiv.querySelector(".modern-confirm-footer").style.cssText = `
    padding: 0 24px 24px;
    display: flex;
    gap: 12px;
    justify-content: flex-end;
  `;

  document.body.appendChild(confirmDiv);

  // Animate in
  setTimeout(() => {
    confirmDiv.style.opacity = "1";
    confirmDiv.querySelector(".modern-confirm-content").style.transform = "scale(1)";
  }, 50);

  // Event listeners
  confirmDiv.querySelector(".modern-confirm-cancel").onclick = () => {
    confirmDiv.style.opacity = "0";
    confirmDiv.querySelector(".modern-confirm-content").style.transform = "scale(0.8)";
    setTimeout(() => {
      confirmDiv.remove();
    }, 300);
    if (onCancel) onCancel();
  };

  confirmDiv.querySelector(".modern-confirm-ok").onclick = () => {
    confirmDiv.style.opacity = "0";
    confirmDiv.querySelector(".modern-confirm-content").style.transform = "scale(0.8)";
    setTimeout(() => {
      confirmDiv.remove();
    }, 300);
    onConfirm();
  };

  // Close on backdrop click
  confirmDiv.querySelector(".modern-confirm-backdrop").onclick = (e) => {
    if (e.target === confirmDiv.querySelector(".modern-confirm-backdrop")) {
      confirmDiv.querySelector(".modern-confirm-cancel").click();
    }
  };
}

document.addEventListener("DOMContentLoaded", function () {
  // Load aset saat halaman dimuat
  loadAset();

  // Setup event listeners
  setupEventListeners();
});

function setupEventListeners() {
  // Form submit untuk tambah aset
  const asetForm = document.getElementById("asetForm");
  asetForm.addEventListener("submit", handleAddAset);

  // Reset form
  asetForm.addEventListener("reset", function () {
    document.getElementById("fotoPreview").style.display = "none";
  });

  // Preview foto saat upload
  const fotoInput = document.getElementById("foto");
  fotoInput.addEventListener("change", handlePhotoPreview);

  // Search functionality
  const searchBtn = document.getElementById("searchBtn");
  const searchInput = document.getElementById("searchInput");

  searchBtn.addEventListener("click", handleSearch);
  searchInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      handleSearch();
    }
  });

  // Edit foto preview
  const editFotoInput = document.getElementById("editFoto");
  editFotoInput.addEventListener("change", handleEditPhotoPreview);
}

function handlePhotoPreview(event) {
  const file = event.target.files[0];
  const preview = document.getElementById("fotoPreview");
  const previewImage = document.getElementById("previewImage");

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      previewImage.src = e.target.result;
      preview.style.display = "block";
    };
    reader.readAsDataURL(file);
  } else {
    preview.style.display = "none";
  }
}

function handleEditPhotoPreview(event) {
  const file = event.target.files[0];
  const preview = document.getElementById("editFotoPreview");
  const previewImage = document.getElementById("editPreviewImage");

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      previewImage.src = e.target.result;
      preview.style.display = "block";
    };
    reader.readAsDataURL(file);
  }
}

async function handleAddAset(event) {
  event.preventDefault();

  const formData = new FormData();
  const nama = document.getElementById("nama").value.trim();
  const tempat = document.getElementById("tempat").value.trim();
  const fotoFile = document.getElementById("foto").files[0];

  // Validasi
  if (!nama || !tempat) {
    showAlert("Nama dan tempat harus diisi!", "danger");
    return;
  }

  formData.append("nama", nama);
  formData.append("tempat", tempat);
  if (fotoFile) {
    formData.append("foto", fotoFile);
  }

  try {
    const submitButton = document.querySelector('#asetForm button[type="submit"]');
    showLoading(true, submitButton);

    const response = await fetch(`${BASE_URL}/aset`, {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (response.ok) {
      showAlert("Aset berhasil ditambahkan!", "success");
      document.getElementById("asetForm").reset();
      document.getElementById("fotoPreview").style.display = "none";
      loadAset(); // Refresh list
    } else {
      showAlert(result.error || "Gagal menambahkan aset", "danger");
    }
  } catch (error) {
    console.error("Error adding aset:", error);
    showAlert("Terjadi kesalahan saat menambahkan aset", "danger");
  } finally {
    const submitButton = document.querySelector('#asetForm button[type="submit"]');
    showLoading(false, submitButton);
  }
}

async function loadAset() {
  const loadingEl = document.getElementById("loadingAset");
  const asetListEl = document.getElementById("asetList");
  const noDataEl = document.getElementById("noDataMessage");

  try {
    loadingEl.style.display = "block";
    asetListEl.innerHTML = "";
    noDataEl.style.display = "none";

    const response = await fetch(`${BASE_URL}/aset`);
    const asetData = await response.json();

    if (response.ok) {
      if (asetData.length === 0) {
        noDataEl.style.display = "block";
      } else {
        renderAsetList(asetData);
      }
    } else {
      showAlert("Gagal memuat data aset", "danger");
    }
  } catch (error) {
    console.error("Error loading aset:", error);
    showAlert("Terjadi kesalahan saat memuat data aset", "danger");
  } finally {
    loadingEl.style.display = "none";
  }
}

function renderAsetList(asetData) {
  const asetListEl = document.getElementById("asetList");

  asetListEl.innerHTML = asetData
    .map(
      (aset) => `
        <div class="col-md-6 col-lg-4">
            <div class="card h-100 shadow-sm">
                ${
                  aset.foto
                    ? `
                    <img src="${BASE_URL}/uploads/aset/${aset.foto}" 
                         class="card-img-top" 
                         alt="${aset.nama}"
                         style="height: 200px; object-fit: cover;"
                         onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'" />
                `
                    : `
                    <div class="card-img-top bg-light d-flex align-items-center justify-content-center" style="height: 200px;">
                        <i class="bi bi-image text-muted" style="font-size: 3rem;"></i>
                    </div>
                `
                }
                <div class="card-body">
                    <h5 class="card-title">${aset.nama}</h5>
                    <p class="card-text">
                        <i class="bi bi-geo-alt text-primary"></i> ${aset.tempat}
                    </p>
                    <small class="text-muted">
                        <i class="bi bi-calendar"></i> ${formatDate(aset.createdAt)}
                    </small>
                </div>
                <div class="card-footer bg-transparent">
                    <div class="btn-group w-100" role="group">
                        <button type="button" class="btn btn-outline-primary btn-sm" onclick="editAset(${aset.id})">
                            <i class="bi bi-pencil"></i> Edit
                        </button>
                        <button type="button" class="btn btn-outline-danger btn-sm" onclick="deleteAset(${aset.id}, '${aset.nama}')">
                            <i class="bi bi-trash"></i> Hapus
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `
    )
    .join("");
}

async function editAset(id) {
  try {
    const response = await fetch(`${BASE_URL}/aset/${id}`);
    const aset = await response.json();

    if (response.ok) {
      // Populate modal form
      document.getElementById("editId").value = aset.id;
      document.getElementById("editNama").value = aset.nama;
      document.getElementById("editTempat").value = aset.tempat;

      // Show current photo if exists
      const editPreview = document.getElementById("editFotoPreview");
      const editPreviewImage = document.getElementById("editPreviewImage");

      if (aset.foto) {
        editPreviewImage.src = `${BASE_URL}/uploads/aset/${aset.foto}`;
        editPreview.style.display = "block";
      } else {
        editPreview.style.display = "none";
      }

      // Show modal
      const modal = new bootstrap.Modal(document.getElementById("editModal"));
      modal.show();
    } else {
      showAlert("Gagal memuat data aset untuk diedit", "danger");
    }
  } catch (error) {
    console.error("Error loading aset for edit:", error);
    showAlert("Terjadi kesalahan saat memuat data aset", "danger");
  }
}

async function updateAset() {
  const id = document.getElementById("editId").value;
  const nama = document.getElementById("editNama").value.trim();
  const tempat = document.getElementById("editTempat").value.trim();
  const fotoFile = document.getElementById("editFoto").files[0];

  if (!nama || !tempat) {
    showAlert("Nama dan tempat harus diisi!", "danger");
    return;
  }

  const formData = new FormData();
  formData.append("nama", nama);
  formData.append("tempat", tempat);
  if (fotoFile) {
    formData.append("foto", fotoFile);
  }

  try {
    const updateButton = document.querySelector('#editModal .btn-primary[onclick="updateAset()"]');
    showLoading(true, updateButton);

    const response = await fetch(`${BASE_URL}/aset/${id}`, {
      method: "PATCH",
      body: formData,
    });

    const result = await response.json();

    if (response.ok) {
      showAlert("Aset berhasil diupdate!", "success");

      // Hide modal
      const modal = bootstrap.Modal.getInstance(document.getElementById("editModal"));
      modal.hide();

      // Refresh list
      loadAset();
    } else {
      showAlert(result.error || "Gagal mengupdate aset", "danger");
    }
  } catch (error) {
    console.error("Error updating aset:", error);
    showAlert("Terjadi kesalahan saat mengupdate aset", "danger");
  } finally {
    const updateButton = document.querySelector('#editModal .btn-primary[onclick="updateAset()"]');
    showLoading(false, updateButton);
  }
}

async function deleteAset(id, nama) {
  showModernConfirm(`Apakah Anda yakin ingin menghapus aset "${nama}"? Tindakan ini tidak dapat dibatalkan.`, async () => {
    try {
      // For delete operations, we'll disable all delete buttons to prevent multiple clicks
      const deleteButtons = document.querySelectorAll(".btn-outline-danger");
      deleteButtons.forEach((btn) => (btn.disabled = true));

      const response = await fetch(`${BASE_URL}/aset/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (response.ok) {
        showModernAlert("Aset berhasil dihapus!", "success");
        loadAset(); // Refresh list
      } else {
        showModernAlert(result.error || "Gagal menghapus aset", "error");
      }
    } catch (error) {
      console.error("Error deleting aset:", error);
      showModernAlert("Terjadi kesalahan saat menghapus aset", "error");
    } finally {
      // Re-enable delete buttons
      const deleteButtons = document.querySelectorAll(".btn-outline-danger");
      deleteButtons.forEach((btn) => (btn.disabled = false));
    }
  });
}

async function handleSearch() {
  const query = document.getElementById("searchInput").value.trim();

  if (!query) {
    loadAset(); // Load all if no search query
    return;
  }

  const loadingEl = document.getElementById("loadingAset");
  const asetListEl = document.getElementById("asetList");
  const noDataEl = document.getElementById("noDataMessage");

  try {
    loadingEl.style.display = "block";
    asetListEl.innerHTML = "";
    noDataEl.style.display = "none";

    const response = await fetch(`${BASE_URL}/aset/search?query=${encodeURIComponent(query)}`);
    const asetData = await response.json();

    if (response.ok) {
      if (asetData.length === 0) {
        asetListEl.innerHTML = `
                    <div class="col-12 text-center py-5">
                        <i class="bi bi-search display-1 text-muted"></i>
                        <p class="mt-3 text-muted">Tidak ada aset yang ditemukan dengan kata kunci "${query}"</p>
                        <button class="btn btn-outline-primary" onclick="document.getElementById('searchInput').value=''; loadAset();">
                            <i class="bi bi-arrow-left"></i> Kembali ke semua aset
                        </button>
                    </div>
                `;
      } else {
        renderAsetList(asetData);
      }
    } else {
      showAlert("Gagal melakukan pencarian", "danger");
    }
  } catch (error) {
    console.error("Error searching aset:", error);
    showAlert("Terjadi kesalahan saat melakukan pencarian", "danger");
  } finally {
    loadingEl.style.display = "none";
  }
}

function showAlert(message, type = "info") {
  // Remove existing alerts
  const existingAlerts = document.querySelectorAll(".alert-custom");
  existingAlerts.forEach((alert) => alert.remove());

  const alertHTML = `
        <div class="alert alert-${type} alert-dismissible fade show alert-custom" role="alert" style="position: fixed; top: 20px; right: 20px; z-index: 9999; min-width: 300px;">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;

  document.body.insertAdjacentHTML("beforeend", alertHTML);

  // Auto dismiss after 5 seconds
  setTimeout(() => {
    const alert = document.querySelector(".alert-custom");
    if (alert) {
      const bsAlert = new bootstrap.Alert(alert);
      bsAlert.close();
    }
  }, 5000);
}

function showLoading(show, targetButton = null) {
  if (targetButton) {
    // Target specific button
    targetButton.disabled = show;
    if (show) {
      targetButton.dataset.originalText = targetButton.innerHTML;
      targetButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status"></span> Loading...';
    } else {
      if (targetButton.dataset.originalText) {
        targetButton.innerHTML = targetButton.dataset.originalText;
        delete targetButton.dataset.originalText;
      }
    }
  } else {
    // Fallback to old behavior for backward compatibility
    const submitBtns = document.querySelectorAll('button[type="submit"]');
    submitBtns.forEach((btn) => {
      btn.disabled = show;
      if (show) {
        btn.dataset.originalText = btn.innerHTML;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status"></span> Loading...';
      } else {
        if (btn.dataset.originalText) {
          btn.innerHTML = btn.dataset.originalText;
          delete btn.dataset.originalText;
        }
      }
    });
  }
}

function formatDate(dateString) {
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateString).toLocaleDateString("id-ID", options);
}

// Make functions globally available
window.editAset = editAset;
window.updateAset = updateAset;
window.deleteAset = deleteAset;
window.loadAset = loadAset;
