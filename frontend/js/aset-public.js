import { BASE_URL } from "../utils.js";

document.addEventListener("DOMContentLoaded", function () {
  // Load aset saat halaman dimuat
  loadAset();

  // Setup event listeners
  setupEventListeners();
});

function setupEventListeners() {
  // Search functionality
  const searchBtn = document.getElementById("searchBtn");
  const searchInput = document.getElementById("searchInput");

  searchBtn.addEventListener("click", handleSearch);
  searchInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      handleSearch();
    }
  });
}

async function loadAset() {
  const loadingEl = document.getElementById("loadingAset");
  const asetGridEl = document.getElementById("asetGrid");
  const noDataEl = document.getElementById("noDataMessage");
  const noSearchEl = document.getElementById("noSearchResults");

  try {
    loadingEl.style.display = "block";
    asetGridEl.innerHTML = "";
    noDataEl.style.display = "none";
    noSearchEl.style.display = "none";

    const response = await fetch(`${BASE_URL}/aset`);
    const asetData = await response.json();

    if (response.ok) {
      if (asetData.length === 0) {
        noDataEl.style.display = "block";
      } else {
        renderAsetGrid(asetData);
        updateStatistics(asetData);
      }
    } else {
      console.error("Failed to load aset data");
      showErrorMessage();
    }
  } catch (error) {
    console.error("Error loading aset:", error);
    showErrorMessage();
  } finally {
    loadingEl.style.display = "none";
  }
}

function renderAsetGrid(asetData) {
  const asetGridEl = document.getElementById("asetGrid");

  asetGridEl.innerHTML = asetData
    .map(
      (aset, index) => `
        <div class="col-md-6 col-lg-4 fade-in-up ${index % 3 === 1 ? "delay-1" : index % 3 === 2 ? "delay-2" : ""}">
            <div class="card aset-card h-100 border-0" onclick="showAsetDetail(${aset.id})">
                ${
                  aset.foto
                    ? `
                    <img src="${BASE_URL}/uploads/aset/${aset.foto}" 
                         class="aset-img" 
                         alt="${aset.nama}"
                         onerror="this.src='https://via.placeholder.com/400x250?text=Foto+Tidak+Tersedia'" />
                `
                    : `
                    <div class="aset-img bg-light d-flex align-items-center justify-content-center">
                        <div class="text-center">
                            <i class="bi bi-image text-muted" style="font-size: 3rem;"></i>
                            <p class="text-muted mt-2 mb-0">Foto tidak tersedia</p>
                        </div>
                    </div>
                `
                }
                <div class="card-body d-flex flex-column">
                    <div class="mb-2">
                        <span class="category-badge">Aset Dusun</span>
                    </div>
                    <h5 class="card-title font-weight-bold mb-2">${aset.nama}</h5>
                    <p class="card-text text-muted mb-3">
                        <i class="bi bi-geo-alt text-primary"></i> ${aset.tempat}
                    </p>
                </div>
                <div class="card-footer bg-transparent border-0 pt-0">
                    <div class="d-flex justify-content-between align-items-center">
                        <small class="text-muted">
                            <i class="bi bi-eye"></i> Klik untuk detail
                        </small>
                        <i class="bi bi-arrow-right text-primary"></i>
                    </div>
                </div>
            </div>
        </div>
    `
    )
    .join("");
}

function updateStatistics(asetData) {
  // Total aset
  document.getElementById("totalAset").textContent = asetData.length;

  // Total lokasi unik
  const uniqueLocations = [...new Set(asetData.map((aset) => aset.tempat))];
  document.getElementById("totalLokasi").textContent = uniqueLocations.length;

  // Total dengan foto
  const withPhoto = asetData.filter((aset) => aset.foto).length;
  document.getElementById("totalFoto").textContent = withPhoto;
}

async function handleSearch() {
  const query = document.getElementById("searchInput").value.trim();

  if (!query) {
    loadAset(); // Load all if no search query
    return;
  }

  const loadingEl = document.getElementById("loadingAset");
  const asetGridEl = document.getElementById("asetGrid");
  const noDataEl = document.getElementById("noDataMessage");
  const noSearchEl = document.getElementById("noSearchResults");

  try {
    loadingEl.style.display = "block";
    asetGridEl.innerHTML = "";
    noDataEl.style.display = "none";
    noSearchEl.style.display = "none";

    const response = await fetch(`${BASE_URL}/aset/search?query=${encodeURIComponent(query)}`);
    const asetData = await response.json();

    if (response.ok) {
      if (asetData.length === 0) {
        noSearchEl.style.display = "block";
      } else {
        renderAsetGrid(asetData);
        updateStatistics(asetData);
      }
    } else {
      console.error("Search failed");
      showErrorMessage();
    }
  } catch (error) {
    console.error("Error searching aset:", error);
    showErrorMessage();
  } finally {
    loadingEl.style.display = "none";
  }
}

async function showAsetDetail(id) {
  try {
    const response = await fetch(`${BASE_URL}/aset/${id}`);
    const aset = await response.json();

    if (response.ok) {
      // Populate modal
      document.getElementById("modalNama").textContent = aset.nama;
      document.getElementById("modalTempat").textContent = aset.tempat;

      // Set image
      const modalImage = document.getElementById("modalImage");
      if (aset.foto) {
        modalImage.src = `${BASE_URL}/uploads/aset/${aset.foto}`;
        modalImage.onerror = function () {
          this.src = "https://via.placeholder.com/400x300?text=Foto+Tidak+Tersedia";
        };
      } else {
        modalImage.src = "https://via.placeholder.com/400x300?text=Foto+Tidak+Tersedia";
      }

      // Show modal
      const modal = new bootstrap.Modal(document.getElementById("detailModal"));
      modal.show();
    } else {
      console.error("Failed to load aset detail");
    }
  } catch (error) {
    console.error("Error loading aset detail:", error);
  }
}

function clearSearch() {
  document.getElementById("searchInput").value = "";
  loadAset();
}

function showErrorMessage() {
  const asetGridEl = document.getElementById("asetGrid");
  asetGridEl.innerHTML = `
        <div class="col-12 text-center py-5 fade-in-up">
            <i class="bi bi-exclamation-triangle display-1 text-warning scale-in"></i>
            <h4 class="mt-3 text-muted slide-in-up">Gagal Memuat Data</h4>
            <p class="text-muted slide-in-up delay-1">Terjadi kesalahan saat memuat data aset. Silakan coba lagi.</p>
            <button class="btn btn-primary fade-in-up delay-2" onclick="loadAset()">
                <i class="bi bi-arrow-clockwise"></i> Coba Lagi
            </button>
        </div>
    `;
}

function formatDate(dateString) {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateString).toLocaleDateString("id-ID", options);
}

// Make functions globally available
window.showAsetDetail = showAsetDetail;
window.clearSearch = clearSearch;
window.loadAset = loadAset;
