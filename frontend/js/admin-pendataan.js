// Admin Pendataan JavaScript
const BASE_URL = "http://localhost:5001";
let currentPendataanData = []; // Store current data for dropdown management

document.addEventListener("DOMContentLoaded", function () {
  loadPendataanData();
  setupEventListeners();
});

// Load pendataan data
async function loadPendataanData() {
  try {
    const response = await fetch(`${BASE_URL}/pendataan`);
    const data = await response.json();
    currentPendataanData = data; // Store data globally
    displayPendataanData(data);
    updateDropdownOptions(data); // Update dropdown options
  } catch (error) {
    console.error("Error loading pendataan data:", error);
    showModernAlert("Gagal memuat data pendataan", "error");
  }
}

// Update dropdown options based on existing data
function updateDropdownOptions(existingData) {
  const allCategories = ["Laki-laki", "Perempuan", "Bayi (<1 Tahun)", "Balita (1-5 tahun)", "Anak-anak (6-12 Tahun)", "Remaja (13-19 Tahun)", "Dewasa (20-59 Tahun)", "Lansia (>60 Tahun)"];

  // Get categories that are already in the database
  const usedCategories = existingData.map((item) => item.Pendataan);

  // Filter out used categories to get available ones
  const availableCategories = allCategories.filter((category) => !usedCategories.includes(category));

  // Update register dropdown only
  updateDropdown("pendataan", availableCategories);
}

// Update dropdown with available options
function updateDropdown(selectId, options) {
  const selectElement = document.getElementById(selectId);
  if (!selectElement) return;

  selectElement.innerHTML = "";

  if (options.length === 0) {
    selectElement.innerHTML = '<option value="">Semua kategori sudah digunakan</option>';
    selectElement.disabled = true;
  } else {
    selectElement.disabled = false;
    options.forEach((option) => {
      const optionElement = document.createElement("option");
      optionElement.value = option;
      optionElement.textContent = option;
      selectElement.appendChild(optionElement);
    });
  }
}

// Update edit dropdown with all options (for editing existing data)
function updateEditDropdown(allOptions) {
  const editSelectElement = document.getElementById("editPendataan");
  if (!editSelectElement) return;

  editSelectElement.innerHTML = "";
  allOptions.forEach((option) => {
    const optionElement = document.createElement("option");
    optionElement.value = option;
    optionElement.textContent = option;
    editSelectElement.appendChild(optionElement);
  });
}

// Update edit dropdown for specific editing (allows current value + available options)
function updateEditDropdownForEdit(existingData, currentValue) {
  const allCategories = ["Laki-laki", "Perempuan", "Bayi (<1 Tahun)", "Balita (1-5 tahun)", "Anak-anak (6-12 Tahun)", "Remaja (13-19 Tahun)", "Dewasa (20-59 Tahun)", "Lansia (>60 Tahun)"];

  // Get categories that are already used (excluding current item being edited)
  const usedCategories = existingData.filter((item) => item.Pendataan !== currentValue).map((item) => item.Pendataan);

  // Available categories = all categories - used categories + current value
  const availableCategories = allCategories.filter((category) => !usedCategories.includes(category) || category === currentValue);

  const editSelectElement = document.getElementById("editPendataan");
  if (!editSelectElement) return;

  editSelectElement.innerHTML = "";
  availableCategories.forEach((option) => {
    const optionElement = document.createElement("option");
    optionElement.value = option;
    optionElement.textContent = option;
    editSelectElement.appendChild(optionElement);
  });
}

// Display pendataan data in table
function displayPendataanData(data) {
  const tableBody = document.getElementById("member-list");
  tableBody.innerHTML = "";

  if (data && data.length > 0) {
    data.forEach((item, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${item.jumlah}</td>
        <td>${item.Pendataan}</td>
        <td>
          <button class="btn btn-outline-primary btn-sm me-1" onclick="editPendataan(${item.id}, ${item.jumlah}, '${item.Pendataan}')">
            <i class="bi bi-pencil"></i> Edit
          </button>
          <button class="btn btn-outline-danger btn-sm" onclick="deletePendataan(${item.id})">
            <i class="bi bi-trash"></i> Hapus
          </button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  } else {
    tableBody.innerHTML = `
      <tr>
        <td colspan="4" class="text-center text-muted">
          <i class="bi bi-inbox display-6"></i><br>
          Belum ada data pendataan
        </td>
      </tr>
    `;
  }
}

// Setup event listeners
function setupEventListeners() {
  // Register form submit
  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    registerForm.addEventListener("submit", handleRegisterSubmit);
  }

  // Edit form submit
  const editForm = document.getElementById("editUserForm");
  if (editForm) {
    editForm.addEventListener("submit", handleEditSubmit);
  }

  // Back to dashboard button
  const backButton = document.getElementById("backDashboardBtn");
  if (backButton) {
    backButton.addEventListener("click", () => {
      window.location.href = "admindashboard.html";
    });
  }
}

// Handle register form submit
async function handleRegisterSubmit(e) {
  e.preventDefault();

  const jumlah = document.getElementById("member-jumlah").value;
  const pendataan = document.getElementById("pendataan").value;

  if (!jumlah || !pendataan) {
    showModernAlert("Semua field harus diisi", "warning");
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/pendataan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jumlah: parseInt(jumlah),
        Pendataan: pendataan,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      showModernAlert("Data pendataan berhasil ditambahkan", "success");
      document.getElementById("register-form").reset();
      loadPendataanData();

      // Notify data change for cross-tab synchronization
      if (window.demographicsSync) {
        window.demographicsSync.notifyDataChange();
      }

      // Refresh homepage charts if function is available
      if (window.opener && window.opener.refreshDemographicsData) {
        window.opener.refreshDemographicsData();
      }
    } else {
      showModernAlert(result.message || "Gagal menambahkan data", "error");
    }
  } catch (error) {
    console.error("Error adding pendataan data:", error);
    showModernAlert("Terjadi kesalahan saat menambahkan data", "error");
  }
}

// Edit pendataan data
let currentEditId = null;

function editPendataan(id, jumlah, pendataan) {
  currentEditId = id;
  document.getElementById("editJumlah").value = jumlah;

  // Update edit dropdown with available options for this edit
  updateEditDropdownForEdit(currentPendataanData, pendataan);
  document.getElementById("editPendataan").value = pendataan;

  const modal = new bootstrap.Modal(document.getElementById("editModal"));
  modal.show();
}

// Handle edit form submit
async function handleEditSubmit(e) {
  e.preventDefault();

  if (!currentEditId) return;

  const jumlah = document.getElementById("editJumlah").value;
  const pendataan = document.getElementById("editPendataan").value;

  try {
    const response = await fetch(`${BASE_URL}/pendataan/${currentEditId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jumlah: parseInt(jumlah),
        Pendataan: pendataan,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      showModernAlert("Data pendataan berhasil diupdate", "success");
      const modal = bootstrap.Modal.getInstance(document.getElementById("editModal"));
      modal.hide();
      loadPendataanData();

      // Notify data change for cross-tab synchronization
      if (window.demographicsSync) {
        window.demographicsSync.notifyDataChange();
      }

      // Refresh homepage charts if function is available
      if (window.opener && window.opener.refreshDemographicsData) {
        window.opener.refreshDemographicsData();
      }
    } else {
      showModernAlert(result.message || "Gagal mengupdate data", "error");
    }
  } catch (error) {
    console.error("Error updating pendataan data:", error);
    showModernAlert("Terjadi kesalahan saat mengupdate data", "error");
  }
}

// Delete pendataan data
function deletePendataan(id) {
  showModernConfirm("Apakah Anda yakin ingin menghapus data pendataan ini?", async () => {
    try {
      const response = await fetch(`${BASE_URL}/pendataan/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (response.ok) {
        showModernAlert("Data pendataan berhasil dihapus", "success");
        loadPendataanData();

        // Refresh homepage charts if function is available
        if (window.opener && window.opener.refreshDemographicsData) {
          window.opener.refreshDemographicsData();
        }
      } else {
        showModernAlert(result.message || "Gagal menghapus data", "error");
      }
    } catch (error) {
      console.error("Error deleting pendataan data:", error);
      showModernAlert("Terjadi kesalahan saat menghapus data", "error");
    }
  });
}

// Modern Alert Function (already exists in HTML, but included for completeness)
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
      icon = '<i class="bi bi-exclamation-triangle-fill"></i>';
      bgColor = "#dc3545";
      break;
    case "warning":
      icon = '<i class="bi bi-exclamation-circle-fill"></i>';
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
        ×
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
          <i class="bi bi-question-circle-fill text-warning" style="font-size: 24px;"></i>
          <h5 style="margin: 0; font-weight: 600; color: #333;">Konfirmasi</h5>
        </div>
        <div class="modern-confirm-body">
          <p style="margin: 0; color: #666; line-height: 1.5;">${message}</p>
        </div>
        <div class="modern-confirm-footer">
          <button class="modern-confirm-cancel btn btn-secondary">Batal</button>
          <button class="modern-confirm-ok btn btn-danger">Ya, Hapus</button>
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

  confirmDiv.querySelector(".modern-confirm-body").style.cssText = `
    padding: 16px 24px;
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
