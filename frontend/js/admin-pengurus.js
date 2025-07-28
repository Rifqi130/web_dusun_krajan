// Admin Pengurus JavaScript
const BASE_URL = "http://localhost:5001";
let currentPengurusData = []; // Store current data for dropdown management

document.addEventListener("DOMContentLoaded", function () {
  loadPengurusData();
  setupEventListeners();
  setupNavbarAndLogout();
});

// Load pengurus data
async function loadPengurusData() {
  try {
    const response = await fetch(`${BASE_URL}/kepengurusan`);
    const data = await response.json();
    currentPengurusData = data; // Store data globally
    displayPengurusData(data);
    updateDropdownOptions(data); // Update dropdown options
  } catch (error) {
    console.error("Error loading pengurus data:", error);
    showModernAlert("Gagal memuat data pengurus", "error");
  }
}

// Update dropdown options based on existing data
function updateDropdownOptions(existingData) {
  const allJabatan = ["Kepala Wilayah", "Rw", "Rt 1", "Rt 2", "Rt 3", "Rt 4", "Ketua Pemuda"];

  // Get jabatan that are already in the database
  const usedJabatan = existingData.map((item) => item.Jabatan);

  // Filter out used jabatan to get available ones
  const availableJabatan = allJabatan.filter((jabatan) => !usedJabatan.includes(jabatan));

  // Update register dropdown only
  updateDropdown("jabatan", availableJabatan);
}

// Update dropdown with available options
function updateDropdown(selectId, options) {
  const selectElement = document.getElementById(selectId);
  if (!selectElement) return;

  selectElement.innerHTML = "";

  if (options.length === 0) {
    selectElement.innerHTML = '<option value="">Semua jabatan sudah terisi</option>';
    selectElement.disabled = true;
  } else {
    selectElement.disabled = false;
    // Add default option
    selectElement.innerHTML = '<option value="">Pilih Jabatan</option>';

    options.forEach((option) => {
      const optionElement = document.createElement("option");
      optionElement.value = option;
      optionElement.textContent = option;
      selectElement.appendChild(optionElement);
    });
  }
}

// Update edit dropdown for specific editing (allows current value + available options)
function updateEditDropdownForEdit(existingData, currentValue) {
  const allJabatan = ["Kepala Wilayah", "Rw", "Rt 1", "Rt 2", "Rt 3", "Rt 4", "Ketua Pemuda"];

  // Get jabatan that are already used (excluding current item being edited)
  const usedJabatan = existingData.filter((item) => item.Jabatan !== currentValue).map((item) => item.Jabatan);

  // Available jabatan = all jabatan - used jabatan + current value
  const availableJabatan = allJabatan.filter((jabatan) => !usedJabatan.includes(jabatan) || jabatan === currentValue);

  // Update edit dropdown
  const editSelectElement = document.getElementById("editJabatan");
  if (!editSelectElement) return;

  editSelectElement.innerHTML = "";
  availableJabatan.forEach((option) => {
    const optionElement = document.createElement("option");
    optionElement.value = option;
    optionElement.textContent = option;
    editSelectElement.appendChild(optionElement);
  });
}

// Display pengurus data in table
function displayPengurusData(data) {
  const memberListEl = document.getElementById("member-list");

  if (data.length === 0) {
    memberListEl.innerHTML = `
      <tr>
        <td colspan="4" class="text-center text-muted">
          <i class="bi bi-person-x fs-1 mb-3 d-block"></i>
          <p class="mb-0">Belum ada data pengurus</p>
        </td>
      </tr>
    `;
    return;
  }

  memberListEl.innerHTML = data
    .map(
      (pengurus, index) => `
        <tr class="fade-in-up" style="animation-delay: ${index * 0.1}s">
          <td class="fw-semibold">${index + 1}</td>
          <td class="fw-medium">${pengurus.name}</td>
          <td>
            <span class="badge bg-primary px-3 py-2">${pengurus.Jabatan}</span>
          </td>
          <td>
            <div class="btn-group" role="group">
              <button class="btn btn-outline-primary btn-sm" onclick="editPengurus(${pengurus.id})" title="Edit">
                <i class="bi bi-pencil"></i> Edit
              </button>
              <button class="btn btn-outline-danger btn-sm" onclick="deletePengurus(${pengurus.id}, '${pengurus.name}')" title="Hapus">
                <i class="bi bi-trash"></i> Hapus
              </button>
            </div>
          </td>
        </tr>
      `
    )
    .join("");
}

// Setup event listeners
function setupEventListeners() {
  // Register form
  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      await registerPengurus();
    });
  }

  // Edit form
  const editForm = document.getElementById("editUserForm");
  if (editForm) {
    editForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      await updatePengurus();
    });
  }

  // Back to dashboard button
  const backBtn = document.getElementById("backDashboardBtn");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      window.location.href = "admindashboard.html";
    });
  }
}

// Register new pengurus
async function registerPengurus() {
  const nama = document.getElementById("member-name").value.trim();
  const jabatan = document.getElementById("jabatan").value;

  if (!nama || !jabatan) {
    showModernAlert("Semua field harus diisi!", "warning");
    return;
  }

  const submitBtn = document.querySelector('#register-form button[type="submit"]');
  showLoading(true, submitBtn);

  try {
    const response = await fetch(`${BASE_URL}/kepengurusan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: nama,
        Jabatan: jabatan,
      }),
    });

    if (response.ok) {
      showModernAlert("Pengurus berhasil didaftarkan!", "success");
      document.getElementById("register-form").reset();
      loadPengurusData(); // Reload data and update dropdown
    } else {
      throw new Error("Gagal mendaftarkan pengurus");
    }
  } catch (error) {
    console.error("Error registering pengurus:", error);
    showModernAlert("Terjadi kesalahan saat mendaftarkan pengurus", "error");
  } finally {
    showLoading(false, submitBtn);
  }
}

// Edit pengurus
async function editPengurus(id) {
  try {
    const response = await fetch(`${BASE_URL}/kepengurusan/${id}`);
    const pengurus = await response.json();

    if (response.ok) {
      // Update edit dropdown with available options for this specific edit
      updateEditDropdownForEdit(currentPengurusData, pengurus.Jabatan);

      // Fill form
      document.getElementById("editName").value = pengurus.name;
      document.getElementById("editJabatan").value = pengurus.Jabatan;

      // Store current edit ID
      document.getElementById("editUserForm").dataset.editId = id;

      // Show modal
      const editModal = new bootstrap.Modal(document.getElementById("editModal"));
      editModal.show();
    } else {
      throw new Error("Gagal mengambil data pengurus");
    }
  } catch (error) {
    console.error("Error fetching pengurus:", error);
    showModernAlert("Terjadi kesalahan saat mengambil data pengurus", "error");
  }
}

// Update pengurus
async function updatePengurus() {
  const form = document.getElementById("editUserForm");
  const id = form.dataset.editId;
  const nama = document.getElementById("editName").value.trim();
  const jabatan = document.getElementById("editJabatan").value;

  if (!nama || !jabatan) {
    showModernAlert("Semua field harus diisi!", "warning");
    return;
  }

  const submitBtn = document.querySelector('#editUserForm button[type="submit"]');
  showLoading(true, submitBtn);

  try {
    const response = await fetch(`${BASE_URL}/kepengurusan/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: nama,
        Jabatan: jabatan,
      }),
    });

    if (response.ok) {
      showModernAlert("Pengurus berhasil diperbarui!", "success");

      // Close modal
      const editModal = bootstrap.Modal.getInstance(document.getElementById("editModal"));
      editModal.hide();

      loadPengurusData(); // Reload data and update dropdown
    } else {
      throw new Error("Gagal memperbarui pengurus");
    }
  } catch (error) {
    console.error("Error updating pengurus:", error);
    showModernAlert("Terjadi kesalahan saat memperbarui pengurus", "error");
  } finally {
    showLoading(false, submitBtn);
  }
}

// Delete pengurus
async function deletePengurus(id, nama) {
  showModernConfirm(`Apakah Anda yakin ingin menghapus pengurus "${nama}"? Tindakan ini tidak dapat dibatalkan.`, async () => {
    try {
      const response = await fetch(`${BASE_URL}/kepengurusan/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        showModernAlert("Pengurus berhasil dihapus!", "success");
        loadPengurusData(); // Reload data and update dropdown
      } else {
        throw new Error("Gagal menghapus pengurus");
      }
    } catch (error) {
      console.error("Error deleting pengurus:", error);
      showModernAlert("Terjadi kesalahan saat menghapus pengurus", "error");
    }
  });
}

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

  document.body.appendChild(alertDiv);

  // Animate in
  setTimeout(() => {
    alertDiv.style.opacity = "1";
    alertDiv.style.transform = "translateX(0)";
  }, 50);

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (alertDiv.parentNode) {
      alertDiv.style.opacity = "0";
      alertDiv.style.transform = "translateX(100%)";
      setTimeout(() => {
        if (alertDiv.parentNode) {
          alertDiv.remove();
        }
      }, 300);
    }
  }, 5000);
}

// Modern Confirm Function
function showModernConfirm(message, onConfirm, onCancel = null) {
  const confirmDiv = document.createElement("div");
  confirmDiv.className = "modern-confirm-backdrop";

  confirmDiv.innerHTML = `
    <div class="modern-confirm-content">
      <div class="modern-confirm-header">
        <i class="bi bi-question-circle-fill text-warning"></i>
        <h5>Konfirmasi</h5>
      </div>
      <div class="modern-confirm-body">
        <p>${message}</p>
      </div>
      <div class="modern-confirm-footer">
        <button class="btn btn-secondary modern-confirm-cancel">Batal</button>
        <button class="btn btn-danger modern-confirm-ok">Ya, Hapus</button>
      </div>
    </div>
  `;

  confirmDiv.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    opacity: 0;
    transition: opacity 0.3s ease;
  `;

  document.body.appendChild(confirmDiv);

  // Animate in
  setTimeout(() => {
    confirmDiv.style.opacity = "1";
  }, 50);

  // Event listeners
  confirmDiv.querySelector(".modern-confirm-cancel").onclick = () => {
    confirmDiv.style.opacity = "0";
    setTimeout(() => {
      confirmDiv.remove();
    }, 300);
    if (onCancel) onCancel();
  };

  confirmDiv.querySelector(".modern-confirm-ok").onclick = () => {
    confirmDiv.style.opacity = "0";
    setTimeout(() => {
      confirmDiv.remove();
    }, 300);
    onConfirm();
  };

  // Close on backdrop click
  confirmDiv.onclick = (e) => {
    if (e.target === confirmDiv) {
      confirmDiv.querySelector(".modern-confirm-cancel").click();
    }
  };
}

// Loading function
function showLoading(show, targetButton = null) {
  if (targetButton) {
    targetButton.disabled = show;
    if (show) {
      targetButton.dataset.originalText = targetButton.innerHTML;
      targetButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status"></span> Loading...';
    } else {
      if (targetButton.dataset.originalText) {
        targetButton.innerHTML = targetButton.dataset.originalText;
      }
    }
  }
}

// Fade in animation for table rows
const style = document.createElement("style");
style.textContent = `
  .fade-in-up {
    animation: fadeInUp 0.6s ease forwards;
    opacity: 0;
    transform: translateY(30px);
  }

  @keyframes fadeInUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style);

// Make functions globally available
window.editPengurus = editPengurus;
window.updatePengurus = updatePengurus;
window.deletePengurus = deletePengurus;
window.loadPengurusData = loadPengurusData;

// Setup navbar and logout functionality
function setupNavbarAndLogout() {
  // Add fade-in animation to cards
  const cards = document.querySelectorAll(".pengurus-card");
  cards.forEach((card, index) => {
    setTimeout(() => {
      card.classList.add("card-fade-in");
    }, index * 200);
  });

  // Setup logout functionality for navbar
  const logoutLinks = document.querySelectorAll('a[href="loginadmin.html"]');
  logoutLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      if (confirm("Apakah Anda yakin ingin logout?")) {
        localStorage.clear();
        window.location.href = "loginadmin.html";
      }
    });
  });

  // Setup responsive navbar functionality
  setupNavbarControls();
}

function setupNavbarControls() {
  const navbar = document.querySelector("#navbarNav");
  const navbarToggler = document.querySelector(".navbar-toggler");
  let lastScrollTop = 0;

  // Auto-close navbar on scroll (mobile only)
  window.addEventListener("scroll", function () {
    if (window.innerWidth <= 991) {
      // Bootstrap lg breakpoint
      const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

      // Hide navbar when scrolling down
      if (currentScroll > lastScrollTop && currentScroll > 100) {
        if (navbar.classList.contains("show")) {
          const bsCollapse = new bootstrap.Collapse(navbar, { toggle: false });
          bsCollapse.hide();
        }
      }
      lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    }
  });

  // Close navbar when clicking outside (mobile only)
  document.addEventListener("click", function (event) {
    if (window.innerWidth <= 991) {
      // Bootstrap lg breakpoint
      const isClickInsideNav = navbar.contains(event.target);
      const isToggleButton = navbarToggler.contains(event.target);

      if (!isClickInsideNav && !isToggleButton && navbar.classList.contains("show")) {
        const bsCollapse = new bootstrap.Collapse(navbar, { toggle: false });
        bsCollapse.hide();
      }
    }
  });

  // Close navbar when clicking on nav links (mobile only)
  const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      if (window.innerWidth <= 991 && navbar.classList.contains("show")) {
        const bsCollapse = new bootstrap.Collapse(navbar, { toggle: false });
        bsCollapse.hide();
      }
    });
  });

  // Handle window resize
  window.addEventListener("resize", function () {
    if (window.innerWidth > 991 && navbar.classList.contains("show")) {
      const bsCollapse = new bootstrap.Collapse(navbar, { toggle: false });
      bsCollapse.hide();
    }
  });
}
