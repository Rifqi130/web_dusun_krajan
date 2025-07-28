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

// =========================
// ==== UMKM LOGIC (adminumkm.html) ====
// =========================
const isUmkmPage = !!document.querySelector(".admin-section-title") && document.querySelector(".admin-section-title").textContent.includes("UMKM");
if (isUmkmPage) {
  const umkmList = document.getElementById("member-list");
  const registerForm = document.getElementById("register-form");
  const editModal = document.getElementById("editModal") ? new bootstrap.Modal(document.getElementById("editModal")) : null;
  const editUserForm = document.getElementById("editUserForm");
  let currentUmkmId = null;

  function renderUmkm(data) {
    umkmList.innerHTML = "";

    if (data.length === 0) {
      // Show no data message
      const noDataDiv = document.getElementById("noDataMessage");
      if (noDataDiv) {
        noDataDiv.style.display = "block";
      }
      return;
    }

    // Hide no data message
    const noDataDiv = document.getElementById("noDataMessage");
    if (noDataDiv) {
      noDataDiv.style.display = "none";
    }

    data.forEach((item, i) => {
      const fotoDisplay = item.foto ? `${BASE_URL}${item.foto}` : `${BASE_URL}/uploads/default-umkm.jpg`;

      // Truncate description for card display
      const truncatedDescription = item.deskripsi && item.deskripsi.length > 100 ? item.deskripsi.substring(0, 100) + "..." : item.deskripsi || "Tidak ada deskripsi";

      const cardCol = document.createElement("div");
      cardCol.classList.add("col-lg-4", "col-md-6", "mb-4");

      cardCol.innerHTML = `
        <div class="card umkm-card h-100 card-fade-in" style="border-radius: 15px; overflow: hidden;" data-animation-delay="${i * 100}ms">
          <div class="position-relative" style="overflow: hidden;">
            <img src="${fotoDisplay}" alt="Foto UMKM" class="card-img-top" style="height: 200px; object-fit: cover;">
          </div>
          <div class="card-body d-flex flex-column p-3">
            <h5 class="card-title fw-bold text-dark mb-3" style="font-size: 1.2rem;">${item.nama}</h5>
            <p class="card-text text-muted flex-grow-1" style="font-size: 0.9rem; line-height: 1.5;">
              ${truncatedDescription}
            </p>
            <div class="mt-auto">
              <button class="btn btn-detail btn-primary btn-sm w-100 mb-2" onclick="showDetailModal(${item.id}, '${item.nama.replace(/'/g, "\\'")}', \`${
        item.deskripsi ? item.deskripsi.replace(/'/g, "\\'").replace(/`/g, "\\`") : ""
      }\`, '${fotoDisplay}')">
                <i class="bi bi-eye me-1"></i> Baca Selengkapnya
              </button>
            </div>
          </div>
          <div class="card-footer bg-transparent">
            <div class="btn-group w-100" role="group">
              <button type="button" class="btn btn-outline-primary btn-sm" onclick="editUmkm(${item.id})">
                <i class="bi bi-pencil"></i> Edit
              </button>
              <button type="button" class="btn btn-outline-danger btn-sm" onclick="deleteUmkm(${item.id})">
                <i class="bi bi-trash"></i> Hapus
              </button>
            </div>
          </div>
        </div>
      `;

      // Add animation delay
      const card = cardCol.querySelector(".card");
      const animationDelay = i * 100;
      card.style.animationDelay = `${animationDelay}ms`;

      umkmList.appendChild(cardCol);
    });
  }

  function fetchUmkm() {
    // Show loading indicator
    const loadingElement = document.getElementById("loadingUmkm");
    if (loadingElement) {
      loadingElement.style.display = "block";
    }

    fetch(`${BASE_URL}/umkm`)
      .then((res) => res.json())
      .then((data) => {
        // Hide loading indicator
        if (loadingElement) {
          loadingElement.style.display = "none";
        }
        renderUmkm(data);
      })
      .catch((error) => {
        console.error("Error fetching UMKM:", error);
        // Hide loading indicator
        if (loadingElement) {
          loadingElement.style.display = "none";
        }
        // Show error message
        umkmList.innerHTML = `
          <div class="col-12">
            <div class="text-center text-danger py-4">
              <i class="bi bi-exclamation-triangle display-6"></i>
              <p class="mt-2">Gagal memuat data UMKM. Silakan refresh halaman.</p>
              <button class="btn btn-outline-primary mt-2" onclick="location.reload()">
                <i class="bi bi-arrow-clockwise"></i> Refresh
              </button>
            </div>
          </div>
        `;
      });
  }

  if (registerForm) {
    // Preview image for register form
    const fotoInput = document.getElementById("foto");
    const previewImage = document.getElementById("previewImage");
    const removeFotoBtn = document.getElementById("removeFoto");
    const fotoPreview = document.getElementById("fotoPreview");

    if (fotoInput && previewImage) {
      fotoInput.addEventListener("change", function () {
        const file = this.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function (e) {
            previewImage.src = e.target.result;
            fotoPreview.style.display = "block";
            removeFotoBtn.style.display = "inline-block";
          };
          reader.readAsDataURL(file);
        }
      });

      if (removeFotoBtn) {
        removeFotoBtn.addEventListener("click", function () {
          fotoInput.value = "";
          fotoPreview.style.display = "none";
          removeFotoBtn.style.display = "none";
        });
      }
    }

    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const formData = new FormData();
      const nama = document.getElementById("member-name").value;
      const deskripsi = document.getElementById("jabatan").value;
      const foto = document.getElementById("foto").files[0];

      formData.append("nama", nama);
      formData.append("deskripsi", deskripsi);
      if (foto) {
        formData.append("foto", foto);
      }

      fetch(`${BASE_URL}/umkm`, {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then(() => {
          fetchUmkm();
          registerForm.reset();
          if (fotoPreview) fotoPreview.style.display = "none";
          if (removeFotoBtn) removeFotoBtn.style.display = "none";

          // Show success message
          showModernAlert("UMKM berhasil ditambahkan!", "success");
        })
        .catch((error) => {
          console.error("Error:", error);
          showModernAlert("Terjadi kesalahan saat menambahkan UMKM!", "error");
        });
    });
  }

  window.openEditUmkmModal = function (id, nama, deskripsi, foto) {
    if (!editModal) return;
    currentUmkmId = id;
    document.getElementById("editName").value = nama;
    document.getElementById("editJabatan").value = deskripsi;

    // Show current photo if exists
    const editPreviewImage = document.getElementById("editPreviewImage");
    const editFotoPreview = document.getElementById("editFotoPreview");

    if (foto && foto !== "null" && foto !== "") {
      editPreviewImage.src = `${BASE_URL}${foto}`;
      if (editFotoPreview) editFotoPreview.style.display = "block";
    } else {
      if (editFotoPreview) editFotoPreview.style.display = "none";
    }

    editModal.show();
  };

  if (editUserForm && umkmList && editModal) {
    // Preview image for edit form
    const editFotoInput = document.getElementById("editFoto");
    const editPreviewImage = document.getElementById("editPreviewImage");

    if (editFotoInput && editPreviewImage) {
      editFotoInput.addEventListener("change", function () {
        const file = this.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function (e) {
            editPreviewImage.src = e.target.result;
            const editFotoPreview = document.getElementById("editFotoPreview");
            if (editFotoPreview) editFotoPreview.style.display = "block";
          };
          reader.readAsDataURL(file);
        }
      });
    }

    editUserForm.addEventListener("submit", function (e) {
      e.preventDefault();
      updateUmkm();
    });
  }

  // Create updateUmkm function for the modal button
  window.updateUmkm = function () {
    const formData = new FormData();
    const nama = document.getElementById("editName").value;
    const deskripsi = document.getElementById("editJabatan").value;
    const foto = document.getElementById("editFoto").files[0];

    formData.append("nama", nama);
    formData.append("deskripsi", deskripsi);
    if (foto) {
      formData.append("foto", foto);
    }

    fetch(`${BASE_URL}/umkm/${currentUmkmId}`, {
      method: "PATCH",
      body: formData,
    })
      .then((res) => res.json())
      .then(() => {
        fetchUmkm();
        editModal.hide();
        showModernAlert("UMKM berhasil diperbarui!", "success");
      })
      .catch((error) => {
        console.error("Error:", error);
        showModernAlert("Terjadi kesalahan saat memperbarui UMKM!", "error");
      });
  };

  // Function to show edit modal
  window.editUmkm = function (id) {
    fetch(`${BASE_URL}/umkm/${id}`)
      .then((res) => res.json())
      .then((data) => {
        currentUmkmId = id;
        document.getElementById("editId").value = data.id;
        document.getElementById("editName").value = data.nama;
        document.getElementById("editJabatan").value = data.deskripsi;

        // Show current photo if exists
        const editFotoPreview = document.getElementById("editFotoPreview");
        const editPreviewImage = document.getElementById("editPreviewImage");
        if (data.foto) {
          const fotoUrl = data.foto.startsWith("http") ? data.foto : `${BASE_URL}${data.foto}`;
          editPreviewImage.src = fotoUrl;
          editFotoPreview.style.display = "block";
        } else {
          editFotoPreview.style.display = "none";
        }

        editModal.show();
      })
      .catch((error) => {
        console.error("Error:", error);
        showModernAlert("Terjadi kesalahan saat mengambil data UMKM!", "error");
      });
  };

  // Function to show detail modal
  window.showDetailModal = function (id, nama, deskripsi, foto) {
    const detailModal = new bootstrap.Modal(document.getElementById("detailModal"));

    document.getElementById("detailModalTitle").innerHTML = `<i class="bi bi-shop me-2"></i>UMKM ${nama}`;
    document.getElementById("detailModalName").textContent = nama;

    // Handle empty description
    const descriptionElement = document.getElementById("detailModalDescription");
    if (deskripsi && deskripsi.trim() !== "" && deskripsi !== "undefined") {
      // Format description with line breaks
      const formattedDescription = deskripsi.replace(/\n/g, "<br>");
      descriptionElement.innerHTML = formattedDescription;
    } else {
      descriptionElement.innerHTML = '<em class="text-muted">Tidak ada deskripsi tersedia untuk UMKM ini.</em>';
    }

    document.getElementById("detailModalImage").src = foto;

    detailModal.show();
  };

  window.deleteUmkm = function (id) {
    showModernConfirm("Apakah Anda yakin ingin menghapus UMKM ini?", () => {
      fetch(`${BASE_URL}/umkm/${id}`, { method: "DELETE" })
        .then((res) => res.json())
        .then(() => {
          fetchUmkm();
          showModernAlert("UMKM berhasil dihapus!", "success");
        })
        .catch((error) => {
          console.error("Error:", error);
          showModernAlert("Terjadi kesalahan saat menghapus UMKM!", "error");
        });
    });
  };

  // Initial fetch
  fetchUmkm();
}

// =========================
// ==== KEPENGURUSAN LOGIC (adminpengurus.html) ====
// =========================
const isKepengurusanPage = window.location.pathname.includes("adminpengurus.html") || (!!document.getElementById("jabatan") && !document.querySelector(".admin-section-title")?.textContent.includes("UMKM"));

if (isKepengurusanPage) {
  const memberList = document.getElementById("member-list");
  const registerForm = document.getElementById("register-form");
  const editModal = document.getElementById("editModal") ? new bootstrap.Modal(document.getElementById("editModal")) : null;
  const editUserForm = document.getElementById("editUserForm");
  let currentUserId = null;

  // --- ADMIN PAGE PROTECTION ---
  if (memberList && editModal && localStorage.getItem("role") !== "admin") {
    window.location.href = "loginadmin.html";
  }

  // --- RENDER MEMBERS (KEPENGURUSAN SAJA) ---
  function renderMembers(data) {
    if (memberList) {
      memberList.innerHTML = "";
      data.forEach((item, i) => {
        memberList.innerHTML += `
          <tr>
            <td>${i + 1}</td>
            <td>${item.name}</td>
            <td>${item.Jabatan}</td>
            <td>
              <div class="btn-group" role="group">
                <button type="button" class="btn btn-outline-primary btn-sm" onclick="window.openEditModal(${item.id}, '${item.name}', '${item.Jabatan}')">
                  <i class="bi bi-pencil"></i> Edit
                </button>
                <button type="button" class="btn btn-outline-danger btn-sm" onclick="window.deleteUser(${item.id})">
                  <i class="bi bi-trash"></i> Hapus
                </button>
              </div>
            </td>
          </tr>
        `;
      });
    }
  }

  // --- FETCH MEMBERS ---
  function fetchMembers() {
    fetch(`${BASE_URL}/kepengurusan`)
      .then((res) => res.json())
      .then((data) => renderMembers(data));
  }

  // --- REGISTER FORM (kepengurusan) ---
  if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = document.getElementById("member-name").value;
      const Jabatan = document.getElementById("jabatan").value;
      fetch(`${BASE_URL}/kepengurusan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, Jabatan }),
      })
        .then((res) => res.json())
        .then(() => {
          fetchMembers();
          registerForm.reset();
          // Show success message using modern alert
          if (typeof showModernAlert === "function") {
            showModernAlert("Pengurus berhasil ditambahkan!", "success");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          if (typeof showModernAlert === "function") {
            showModernAlert("Terjadi kesalahan saat menambahkan pengurus!", "error");
          }
        });
    });
  }

  // --- ADMIN: EDIT/DELETE ---
  window.openEditModal = function (id, name, jabatan) {
    if (!editModal) return;
    currentUserId = id;
    document.getElementById("editName").value = name;
    document.getElementById("editJabatan").value = jabatan;
    editModal.show();
  };

  if (editUserForm && memberList && editModal) {
    editUserForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = document.getElementById("editName").value;
      const Jabatan = document.getElementById("editJabatan").value;
      fetch(`${BASE_URL}/kepengurusan/${currentUserId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, Jabatan }),
      })
        .then((res) => res.json())
        .then(() => {
          fetchMembers();
          editModal.hide();
          // Show success message using modern alert
          if (typeof showModernAlert === "function") {
            showModernAlert("Pengurus berhasil diperbarui!", "success");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          if (typeof showModernAlert === "function") {
            showModernAlert("Terjadi kesalahan saat memperbarui pengurus!", "error");
          }
        });
    });
  }

  window.deleteUser = function (id) {
    // Use modern confirm dialog
    if (typeof showModernConfirm === "function") {
      showModernConfirm("Apakah Anda yakin ingin menghapus pengurus ini?", () => {
        fetch(`${BASE_URL}/kepengurusan/${id}`, { method: "DELETE" })
          .then((res) => res.json())
          .then(() => {
            fetchMembers();
            // Show success message
            if (typeof showModernAlert === "function") {
              showModernAlert("Pengurus berhasil dihapus!", "success");
            }
          })
          .catch((error) => {
            console.error("Error:", error);
            if (typeof showModernAlert === "function") {
              showModernAlert("Terjadi kesalahan saat menghapus pengurus!", "error");
            }
          });
      });
    } else {
      // Fallback to default confirm
      if (confirm("Are you sure you want to delete this member?")) {
        fetch(`${BASE_URL}/kepengurusan/${id}`, { method: "DELETE" })
          .then((res) => res.json())
          .then(() => fetchMembers());
      }
    }
  };

  // --- INITIAL FETCH (KEPENGURUSAN) ---
  if (memberList) {
    fetchMembers();
  }
}

document.addEventListener("DOMContentLoaded", function () {
  // --- ADMIN LOGIN HANDLER ---
  const adminLoginForm = document.getElementById("adminLoginForm");
  if (adminLoginForm) {
    adminLoginForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();

      const res = await fetch(`${BASE_URL}/admins/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("role", "admin");
        window.location.href = "../admin/admindashboard.html";
      } else {
        document.getElementById("loginError").style.display = "block";
        document.getElementById("loginError").innerText = data.error || "Login failed!";
      }
    });
    return; // Stop script here if on login page
  }

  // --- LOGOUT & BACK BUTTONS (admin) ---
  if (document.getElementById("logoutBtn")) {
    document.getElementById("logoutBtn").onclick = function () {
      localStorage.removeItem("role");
      window.location.href = "loginadmin.html";
    };
  }

  if (document.getElementById("backDashboardBtn")) {
    document.getElementById("backDashboardBtn").onclick = function () {
      window.location.href = "admindashboard.html";
    };
  }

  // =========================
  // ==== BOOKLIST LOGIC =====
  // =========================

  // Hanya aktif jika ada elemen bookTable (halaman booklist)
  const bookTable = document.getElementById("bookTable");
  if (bookTable) {
    const API_URL = "http://localhost:5001/books";
    // Deteksi halaman user (tanpa form admin)
    const isUserBooklist = !document.getElementById("bookForm");

    async function fetchBooks() {
      const response = await fetch(API_URL);
      const books = await response.json();
      const tbody = bookTable.querySelector("tbody");
      tbody.innerHTML = "";
      books.forEach((book, idx) => {
        const tr = document.createElement("tr");
        if (isUserBooklist) {
          // Hanya tampilkan data (tanpa tombol)
          tr.innerHTML = `
                    <td>${idx + 1}</td>
                    <td>${book.judul}</td>
                    <td>${book.tahun_terbit}</td>
                `;
        } else {
          // Tampilkan tombol Edit & Delete (admin)
          tr.innerHTML = `
                    <td>${book.id}</td>
                    <td>${book.judul}</td>
                    <td>${book.tahun_terbit}</td>
                    <td>
                        <button class="btn btn-edit" onclick="window.openBookForm('edit', ${book.id}, '${book.judul.replace(/'/g, "\\'")}', '${book.tahun_terbit.replace(/'/g, "\\'")}')">Edit</button>
                        <button class="btn btn-delete" onclick="window.deleteBook(${book.id})">Delete</button>
                    </td>
                `;
        }
        tbody.appendChild(tr);
      });
    }

    // Fitur tambah/edit/hapus hanya untuk admin
    if (!isUserBooklist) {
      const bookForm = document.getElementById("bookForm");
      const bookIdInput = document.getElementById("bookId");
      const judulInput = document.getElementById("judul");
      const tahunInput = document.getElementById("tahun_terbit");
      const formTitle = document.getElementById("formTitle");
      const submitBtn = document.getElementById("submitBtn");
      const formPopup = document.getElementById("formPopup");
      let bookModal = null;
      if (formPopup) {
        bookModal = new bootstrap.Modal(formPopup);
      }

      // --- FORM REGISTER BUKU STATIS ---
      const registerBookForm = document.getElementById("registerBookForm");
      if (registerBookForm) {
        registerBookForm.onsubmit = async function (e) {
          e.preventDefault();
          const judul = document.getElementById("register_judul").value;
          const tahun_terbit = document.getElementById("register_tahun_terbit").value;
          await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ judul, tahun_terbit }),
          });
          registerBookForm.reset();
          fetchBooks();
        };
      }

      // --- EDIT/DELETE BUKU (MODAL BOOTSTRAP) ---
      window.openBookForm = function (mode, id = "", judul = "", tahun_terbit = "") {
        if (!bookModal) return;
        if (bookForm) bookForm.reset();
        if (bookIdInput) bookIdInput.value = id;
        if (judulInput) judulInput.value = judul;
        if (tahunInput) tahunInput.value = tahun_terbit;
        if (formTitle) formTitle.innerText = mode === "add" ? "Add Book" : "Edit Book";
        if (submitBtn) submitBtn.innerText = mode === "add" ? "Save" : "Update";
        bookForm.onsubmit = function (e) {
          e.preventDefault();
          if (mode === "add") addBook();
          else updateBook();
        };
        bookModal.show();
      };

      window.deleteBook = async function (id) {
        if (confirm("Yakin ingin menghapus buku ini?")) {
          await fetch(`${API_URL}/${id}`, { method: "DELETE" });
          fetchBooks();
        }
      };

      async function addBook() {
        const judul = judulInput.value;
        const tahun_terbit = tahunInput.value;
        await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ judul, tahun_terbit }),
        });
        bookModal.hide();
        fetchBooks();
      }

      async function updateBook() {
        const id = bookIdInput.value;
        const judul = judulInput.value;
        const tahun_terbit = tahunInput.value;
        await fetch(`${API_URL}/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ judul, tahun_terbit }),
        });
        bookModal.hide();
        fetchBooks();
      }
    }

    // Initial fetch
    fetchBooks();
  }
});
