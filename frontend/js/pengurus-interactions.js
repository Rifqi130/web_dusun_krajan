// Pengurus Page Interactive Animations and Features
import { BASE_URL } from "../utils.js";

document.addEventListener("DOMContentLoaded", function () {
  // Initialize all interactive features
  initScrollAnimations();
  initParticleEffect();
  initOrganizationStructure();
  initModalInteractions();
  initResponsiveFeatures();
});

// Scroll-triggered animations
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate");

        // Add staggered animation for multiple elements
        const siblings = entry.target.parentElement.children;
        Array.from(siblings).forEach((sibling, index) => {
          if (sibling.classList.contains("org-card")) {
            setTimeout(() => {
              sibling.classList.add("animate");
            }, index * 100);
          }
        });
      }
    });
  }, observerOptions);

  // Observe all animation elements
  const animatedElements = document.querySelectorAll(".fade-in-up, .scale-in, .slide-in-left, .slide-in-right");
  animatedElements.forEach((el) => observer.observe(el));
}

// Particle effect for background
function initParticleEffect() {
  const particlesContainer = document.createElement("div");
  particlesContainer.className = "particles";
  document.querySelector(".org-structure-container").appendChild(particlesContainer);

  // Create floating particles
  function createParticle() {
    const particle = document.createElement("div");
    particle.className = "particle";
    particle.style.left = Math.random() * 100 + "%";
    particle.style.animationDelay = Math.random() * 6 + "s";
    particle.style.animationDuration = Math.random() * 3 + 3 + "s";

    particlesContainer.appendChild(particle);

    // Remove particle after animation
    setTimeout(() => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    }, 6000);
  }

  // Create particles periodically
  setInterval(createParticle, 1000);
}

// Enhanced organization structure with improved data loading
async function initOrganizationStructure() {
  const strukturDiv = document.getElementById("struktur-pengurus");

  if (!strukturDiv) {
    console.error("❌ Element struktur-pengurus tidak ditemukan!");
    return;
  }

  // Show enhanced loading animation
  showEnhancedLoadingAnimation(strukturDiv);

  // Always show data (either from backend or fallback)
  let dataLoaded = false;
  let positions = null;

  // Try to load from backend with timeout
  try {
    console.log("🔄 Mencoba memuat data dari backend...");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(`${BASE_URL}/kepengurusan`, {
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("✅ Data berhasil dimuat dari backend:", data);

    if (Array.isArray(data) && data.length > 0) {
      // Smart mapping dengan multiple checks
      positions = mapDataToPositions(data);
      console.log("📋 Positions mapped:", positions);
      dataLoaded = true;
    } else {
      throw new Error("Data kosong atau tidak valid");
    }
  } catch (error) {
    console.warn("⚠️ Backend tidak tersedia:", error.message);
    dataLoaded = false;

    // Show error message when database is not connected
    await new Promise((resolve) => setTimeout(resolve, 800));
    showErrorMessage(strukturDiv);
    return;
  }

  // Use fallback data if backend failed OR if positions is empty
  if (!positions || Object.values(positions).every((p) => !p)) {
    console.log("🔄 Menggunakan data fallback karena tidak ada data dari backend...");
    positions = getFallbackData();
    dataLoaded = false;
  }

  // Ensure all positions have valid data
  const fallbackPositions = getFallbackData();
  Object.keys(fallbackPositions).forEach((key) => {
    if (!positions[key]) {
      console.log(`📝 Mengisi posisi ${key} dengan data fallback`);
      positions[key] = fallbackPositions[key];
    }
  });

  console.log("📊 Final positions data:", positions);

  // Add loading delay for better UX
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Render with enhanced UI
  renderEnhancedOrganizationStructure(strukturDiv, positions, dataLoaded);
}

// Smart data mapping function
function mapDataToPositions(data) {
  console.log("🔍 Data yang diterima untuk mapping:", data);

  const findPosition = (keywords) => {
    const found = data.find((d) => {
      if (!d.Jabatan) return false;
      const jabatan = d.Jabatan.toLowerCase().trim();
      const matched = keywords.some((keyword) => jabatan.includes(keyword.toLowerCase()));
      if (matched) {
        console.log(`✅ Found match: ${d.name} - ${d.Jabatan} untuk keywords: ${keywords.join(", ")}`);
      }
      return matched;
    });
    return found;
  };

  const positions = {
    kadus: findPosition(["kepala wilayah", "kadus", "kepala dusun", "kepala"]),
    rw: findPosition(["rw", "rukun warga"]),
    rt1: findPosition(["rt 1", "rt1", "rt-1", "rt1"]),
    rt2: findPosition(["rt 2", "rt2", "rt-2", "rt2"]),
    rt3: findPosition(["rt 3", "rt3", "rt-3", "rt3"]),
    rt4: findPosition(["rt 4", "rt4", "rt-4", "rt4"]),
    ketuaPemuda: findPosition(["ketua pemuda", "pemuda", "karang taruna", "ketua"]),
  };

  console.log("📋 Hasil mapping positions:", positions);
  return positions;
}

// Fallback data function
function getFallbackData() {
  return {
    kadus: {
      name: "Bapak Sumantri",
      Nama: "Bapak Sumantri",
      Jabatan: "Kepala Wilayah",
      id: "fallback-kadus",
    },
    rw: {
      name: "Bapak Shodiq Rahman",
      Nama: "Bapak Shodiq Rahman",
      Jabatan: "RW (Rukun Warga)",
      id: "fallback-rw",
    },
    rt1: {
      name: "Bapak Ahmad Sutrisno",
      Nama: "Bapak Ahmad Sutrisno",
      Jabatan: "RT 1",
      id: "fallback-rt1",
    },
    rt2: {
      name: "Bapak Joko Widodo",
      Nama: "Bapak Joko Widodo",
      Jabatan: "RT 2",
      id: "fallback-rt2",
    },
    rt3: {
      name: "Bapak Bambang Susilo",
      Nama: "Bapak Bambang Susilo",
      Jabatan: "RT 3",
      id: "fallback-rt3",
    },
    rt4: {
      name: "Bapak Andi Prasetya",
      Nama: "Bapak Andi Prasetya",
      Jabatan: "RT 4",
      id: "fallback-rt4",
    },
    ketuaPemuda: {
      name: "Saudara Rifki Ramadhan",
      Nama: "Saudara Rifki Ramadhan",
      Jabatan: "Ketua Pemuda",
      id: "fallback-pemuda",
    },
  };
}

// Enhanced loading animation
function showEnhancedLoadingAnimation(container) {
  container.innerHTML = `
    <div class="enhanced-loading-container">
      <div class="loading-spinner-enhanced">
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
      </div>
      <div class="loading-text-enhanced">
        <h4>Memuat Struktur Kepengurusan</h4>
        <p>Sedang mengambil data terbaru...</p>
        <div class="loading-progress">
          <div class="progress-bar"></div>
        </div>
      </div>
    </div>
    <style>
      .enhanced-loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 4rem 2rem;
        min-height: 400px;
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        border-radius: 15px;
        margin: 2rem 0;
      }
      
      .loading-spinner-enhanced {
        position: relative;
        width: 80px;
        height: 80px;
        margin-bottom: 2rem;
      }
      
      .spinner-ring {
        position: absolute;
        border: 4px solid transparent;
        border-radius: 50%;
        animation: spin 2s linear infinite;
      }
      
      .spinner-ring:nth-child(1) {
        width: 80px;
        height: 80px;
        border-top-color: #007bff;
        animation-delay: 0s;
      }
      
      .spinner-ring:nth-child(2) {
        width: 60px;
        height: 60px;
        top: 10px;
        left: 10px;
        border-top-color: #28a745;
        animation-delay: -0.5s;
      }
      
      .spinner-ring:nth-child(3) {
        width: 40px;
        height: 40px;
        top: 20px;
        left: 20px;
        border-top-color: #ffc107;
        animation-delay: -1s;
      }
      
      .loading-text-enhanced {
        text-align: center;
        max-width: 400px;
      }
      
      .loading-text-enhanced h4 {
        color: #007bff;
        font-weight: 700;
        margin-bottom: 0.5rem;
      }
      
      .loading-text-enhanced p {
        color: #6c757d;
        margin-bottom: 1.5rem;
      }
      
      .loading-progress {
        width: 200px;
        height: 4px;
        background: #e9ecef;
        border-radius: 2px;
        overflow: hidden;
        margin: 0 auto;
      }
      
      .progress-bar {
        width: 0;
        height: 100%;
        background: linear-gradient(90deg, #007bff, #28a745);
        border-radius: 2px;
        animation: progress 3s ease-in-out infinite;
      }
      
      @keyframes progress {
        0% { width: 0; }
        50% { width: 80%; }
        100% { width: 100%; }
      }
    </style>
  `;
}

function showLoadingAnimation(container) {
  container.innerHTML = `
    <div class="loading-container">
      <div class="loading-spinner"></div>
      <div class="loading-text">Memuat struktur kepengurusan...</div>
    </div>
  `;
}

function showErrorMessage(container) {
  container.innerHTML = `
    <div class="alert alert-warning fade-in-up text-center">
      <div class="mb-3">
        <i class="bi bi-exclamation-triangle" style="font-size: 3rem; color: #f0ad4e;"></i>
      </div>
      <h5><i class="bi bi-exclamation-triangle"></i> Gagal Memuat Data</h5>
      <p>Terjadi kesalahan saat memuat data kepengurusan. Silakan coba lagi.</p>
      <p class="text-muted mb-3"><small>Pastikan database server sudah berjalan (xampp/nodemon)</small></p>
      <button class="btn btn-outline-warning" onclick="location.reload()">
        <i class="bi bi-arrow-clockwise"></i> Coba Lagi
      </button>
    </div>
  `;
}

// Enhanced organization structure renderer
function renderEnhancedOrganizationStructure(container, positions, dataLoaded) {
  // Helper function to get person name safely
  const getPersonName = (person) => {
    if (!person) {
      console.log("⚠️ Person is null/undefined");
      return "Belum Ada Data";
    }

    const name = person.name || person.Nama;
    console.log(`👤 Getting person name for:`, person, `-> Result: ${name || "Belum Ada Data"}`);
    return name || "Belum Ada Data";
  };

  // Status indicator
  const statusIndicator = dataLoaded
    ? '<span class="badge bg-success mb-3"><i class="bi bi-check-circle"></i> Data Live dari Server</span>'
    : '<span class="badge bg-warning mb-3"><i class="bi bi-exclamation-triangle"></i> Data Demo (Server Offline)</span>';

  container.innerHTML = `
    <div class="text-center mb-4">
      ${statusIndicator}
    </div>
    
    <h3 class="section-title fade-in-up text-center mb-5">
      <i class="bi bi-diagram-3 me-2"></i>
      Struktur Organisasi Dusun Krajan
    </h3>
    
    <!-- Kepala Wilayah -->
    <div class="kadus-section fade-in-up mb-4">
      <div class="enhanced-org-card kadus-card" data-position="kadus" data-person='${JSON.stringify(positions.kadus)}'>
        <div class="card-header-enhanced">
          <div class="avatar-circle kadus-avatar">
            <i class="bi bi-person-badge"></i>
          </div>
          <div class="person-info">
            <h5 class="person-name">${getPersonName(positions.kadus)}</h5>
            <p class="person-title">Kepala Wilayah</p>
          </div>
          <div class="status-dot ${positions.kadus ? "active" : "inactive"}"></div>
        </div>
        <div class="card-body-enhanced">
          <span class="responsibility-badge">Membawahi: RW, RT 1-4, Ketua Pemuda</span>
          ${positions.kadus ? '<p class="contact-info"><i class="bi bi-person-check"></i> Data Tersedia</p>' : '<p class="contact-info text-muted"><i class="bi bi-person-x"></i> Belum Ada Data</p>'}
        </div>
      </div>
      <div class="connector-line vertical"></div>
    </div>

    <!-- RW -->
    <div class="rw-section slide-in-left mb-4">
      <div class="enhanced-org-card rw-card" data-position="rw" data-person='${JSON.stringify(positions.rw)}'>
        <div class="card-header-enhanced">
          <div class="avatar-circle rw-avatar">
            <i class="bi bi-people"></i>
          </div>
          <div class="person-info">
            <h5 class="person-name">${getPersonName(positions.rw)}</h5>
            <p class="person-title">RW (Rukun Warga)</p>
          </div>
          <div class="status-dot ${positions.rw ? "active" : "inactive"}"></div>
        </div>
        <div class="card-body-enhanced">
          <span class="responsibility-badge">Membawahi: RT 1-4</span>
          ${positions.rw ? '<p class="contact-info"><i class="bi bi-person-check"></i> Data Tersedia</p>' : '<p class="contact-info text-muted"><i class="bi bi-person-x"></i> Belum Ada Data</p>'}
        </div>
      </div>
      <div class="connector-line vertical"></div>
    </div>

    <!-- RT Section -->
    <div class="rt-section mb-4">
      <!-- Desktop layout -->
      <div class="d-none d-md-block">
        <div class="row justify-content-center g-3">
          ${createEnhancedRTCard(positions.rt1, "RT 1", "scale-in", 1)}
          ${createEnhancedRTCard(positions.rt2, "RT 2", "scale-in", 2)}
          ${createEnhancedRTCard(positions.rt3, "RT 3", "scale-in", 3)}
          ${createEnhancedRTCard(positions.rt4, "RT 4", "scale-in", 4)}
        </div>
      </div>
      
      <!-- Mobile layout -->
      <div class="d-md-none">
        <div class="row g-3">
          <div class="col-12">${createEnhancedRTCard(positions.rt1, "RT 1", "fade-in-up", 1)}</div>
          <div class="col-12">${createEnhancedRTCard(positions.rt2, "RT 2", "fade-in-up", 2)}</div>
          <div class="col-12">${createEnhancedRTCard(positions.rt3, "RT 3", "fade-in-up", 3)}</div>
          <div class="col-12">${createEnhancedRTCard(positions.rt4, "RT 4", "fade-in-up", 4)}</div>
        </div>
      </div>
      <div class="connector-line vertical"></div>
    </div>

    <!-- Ketua Pemuda -->
    <div class="pemuda-section slide-in-right">
      <div class="enhanced-org-card pemuda-card" data-position="pemuda" data-person='${JSON.stringify(positions.ketuaPemuda)}'>
        <div class="card-header-enhanced">
          <div class="avatar-circle pemuda-avatar">
            <i class="bi bi-star"></i>
          </div>
          <div class="person-info">
            <h5 class="person-name">${getPersonName(positions.ketuaPemuda)}</h5>
            <p class="person-title">Ketua Pemuda</p>
          </div>
          <div class="status-dot ${positions.ketuaPemuda ? "active" : "inactive"}"></div>
        </div>
        <div class="card-body-enhanced">
          <span class="responsibility-badge">Koordinator Kegiatan Pemuda</span>
          ${positions.ketuaPemuda ? '<p class="contact-info"><i class="bi bi-person-check"></i> Data Tersedia</p>' : '<p class="contact-info text-muted"><i class="bi bi-person-x"></i> Belum Ada Data</p>'}
        </div>
      </div>
    </div>

    <!-- Enhanced Styling -->
    <style>
      .enhanced-org-card {
        background: linear-gradient(145deg, #ffffff, #f8f9fa);
        border: none;
        border-radius: 20px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        cursor: pointer;
        overflow: hidden;
        position: relative;
        margin: 0 auto 2rem;
        max-width: 400px;
      }

      .enhanced-org-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
        transition: left 0.5s;
      }

      .enhanced-org-card:hover::before {
        left: 100%;
      }

      .enhanced-org-card:hover {
        transform: translateY(-15px) scale(1.03);
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
      }

      .card-header-enhanced {
        display: flex;
        align-items: center;
        padding: 1.5rem;
        position: relative;
      }

      .avatar-circle {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        color: white;
        margin-right: 1rem;
        transition: all 0.3s ease;
      }

      .kadus-avatar { background: linear-gradient(135deg, #dc3545, #c82333); }
      .rw-avatar { background: linear-gradient(135deg, #28a745, #218838); }
      .rt-avatar { background: linear-gradient(135deg, #007bff, #0056b3); }
      .pemuda-avatar { background: linear-gradient(135deg, #fd7e14, #e55a00); }

      .person-info {
        flex-grow: 1;
      }

      .person-name {
        font-size: 1.2rem;
        font-weight: 700;
        margin: 0 0 0.25rem 0;
        color: #333;
      }

      .person-title {
        font-size: 0.9rem;
        color: #666;
        margin: 0;
        font-weight: 500;
      }

      .status-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        position: absolute;
        top: 1rem;
        right: 1rem;
      }

      .status-dot.active {
        background: #28a745;
        box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.3);
        animation: pulse 2s infinite;
      }

      .status-dot.inactive {
        background: #dc3545;
        opacity: 0.6;
      }

      .card-body-enhanced {
        padding: 0 1.5rem 1.5rem;
      }

      .responsibility-badge {
        display: inline-block;
        background: linear-gradient(135deg, #e3f2fd, #bbdefb);
        color: #1976d2;
        padding: 0.5rem 1rem;
        border-radius: 50px;
        font-size: 0.8rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
      }

      .contact-info {
        font-size: 0.85rem;
        margin: 0.5rem 0 0 0;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .connector-line.vertical {
        width: 4px;
        height: 40px;
        background: linear-gradient(to bottom, #007bff, #0056b3);
        margin: 0 auto;
        border-radius: 2px;
        position: relative;
      }

      .connector-line.vertical::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 12px;
        height: 12px;
        background: #007bff;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      }

      .section-title {
        font-size: 2.5rem;
        font-weight: 800;
        background: linear-gradient(135deg, #007bff, #0056b3);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        position: relative;
      }

      .section-title::after {
        content: '';
        position: absolute;
        bottom: -10px;
        left: 50%;
        transform: translateX(-50%);
        width: 100px;
        height: 4px;
        background: linear-gradient(135deg, #007bff, #0056b3);
        border-radius: 2px;
      }

      @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(40, 167, 69, 0.5); }
        70% { box-shadow: 0 0 0 10px rgba(40, 167, 69, 0); }
        100% { box-shadow: 0 0 0 0 rgba(40, 167, 69, 0); }
      }

      /* Mobile responsive */
      @media (max-width: 768px) {
        .enhanced-org-card {
          max-width: none;
          margin: 0 0 1.5rem 0;
        }
        
        .section-title {
          font-size: 2rem;
        }
        
        .avatar-circle {
          width: 50px;
          height: 50px;
          font-size: 1.2rem;
        }
        
        .person-name {
          font-size: 1.1rem;
        }
      }
    </style>
  `;

  // Add enhanced click listeners
  setTimeout(() => {
    addEnhancedCardClickListeners();
    initEnhancedAnimations();
  }, 500);
}

function renderOrganizationStructure(container, positions) {
  container.innerHTML = `
    <h3 class="section-title fade-in-up">Struktur Organisasi Dusun Krajan</h3>
    
    <!-- Kepala Wilayah -->
    <div class="kadus-section fade-in-up">
      <div class="org-card kadus-card" data-position="kadus" data-person='${JSON.stringify(positions.kadus)}'>
        <i class="bi bi-person-badge display-6 mb-2"></i>
        <h5>${positions.kadus ? positions.kadus.name || positions.kadus.Nama || "Belum Ada Data" : "Belum Ada Data"}</h5>
        <p>Kepala Wilayah</p>
        <span class="badge bg-light text-dark">Membawahi: RW, RT 1-4, Ketua Pemuda</span>

      </div>
      <div class="vertical-line" style="height: 40px;"></div>
    </div>

    <!-- RW -->
    <div class="rw-section slide-in-left">
      <div class="org-card rw-card" data-position="rw" data-person='${JSON.stringify(positions.rw)}'>
        <i class="bi bi-people display-6 mb-2"></i>
        <h5>${positions.rw ? positions.rw.name || positions.rw.Nama || "Belum Ada Data" : "Belum Ada Data"}</h5>
        <p>RW (Rukun Warga)</p>
        <span class="badge bg-light text-dark">Membawahi: RT 1-4</span>

      </div>
      <div class="vertical-line" style="height: 40px;"></div>
    </div>

    <!-- RT Section -->
    <div class="rt-section">
      <!-- Desktop layout: horizontal flexbox -->
      <div class="d-none d-md-block">
        <div class="row justify-content-center g-3 mb-4">
          <div class="col-lg-3 col-md-6">
            ${createRTCard(positions.rt1, "RT 1", "scale-in")}
          </div>
          <div class="col-lg-3 col-md-6">
            ${createRTCard(positions.rt2, "RT 2", "scale-in")}
          </div>
          <div class="col-lg-3 col-md-6">
            ${createRTCard(positions.rt3, "RT 3", "scale-in")}
          </div>
          <div class="col-lg-3 col-md-6">
            ${createRTCard(positions.rt4, "RT 4", "scale-in")}
          </div>
        </div>
      </div>
      
      <!-- Mobile layout: stacked cards -->
      <div class="d-md-none">
        <div class="row g-3 mb-4">
          <div class="col-12">
            ${createRTCard(positions.rt1, "RT 1", "fade-in-up")}
          </div>
          <div class="col-12">
            ${createRTCard(positions.rt2, "RT 2", "fade-in-up")}
          </div>
          <div class="col-12">
            ${createRTCard(positions.rt3, "RT 3", "fade-in-up")}
          </div>
          <div class="col-12">
            ${createRTCard(positions.rt4, "RT 4", "fade-in-up")}
          </div>
        </div>
      </div>
      <div class="vertical-line" style="height: 40px;"></div>
    </div>

    <!-- Ketua Pemuda -->
    <div class="pemuda-section slide-in-right">
      <div class="org-card pemuda-card" data-position="pemuda" data-person='${JSON.stringify(positions.ketuaPemuda)}'>
        <i class="bi bi-star display-6 mb-2"></i>
        <h5>${positions.ketuaPemuda ? positions.ketuaPemuda.Nama || positions.ketuaPemuda.name || "Belum Ada Data" : "Belum Ada Data"}</h5>
        <p>Ketua Pemuda</p>
        <span class="badge bg-light text-dark">Koordinator Kegiatan Pemuda</span>

      </div>
    </div>
  `;

  // Add click listeners to all org cards
  setTimeout(() => {
    addCardClickListeners();
  }, 500);
  initEnhancedAnimations();
}

// Enhanced RT Card creator
function createEnhancedRTCard(person, title, animationClass, rtNumber) {
  const getPersonName = (person) => {
    if (!person) {
      console.log(`⚠️ Person is null/undefined for RT ${rtNumber}`);
      return "Belum Ada Data";
    }

    const name = person.name || person.Nama;
    console.log(`👤 Getting RT${rtNumber} person name for:`, person, `-> Result: ${name || "Belum Ada Data"}`);
    return name || "Belum Ada Data";
  };

  return `
    <div class="col-lg-3 col-md-6">
      <div class="enhanced-org-card rt-card ${animationClass}" data-position="rt${rtNumber}" data-person='${JSON.stringify(person)}'>
        <div class="card-header-enhanced">
          <div class="avatar-circle rt-avatar">
            <i class="bi bi-house"></i>
          </div>
          <div class="person-info">
            <h5 class="person-name">${getPersonName(person)}</h5>
            <p class="person-title">${title}</p>
          </div>
          <div class="status-dot ${person ? "active" : "inactive"}"></div>
        </div>
        <div class="card-body-enhanced">
          <span class="responsibility-badge">Wilayah RT ${rtNumber}</span>
          ${person ? '<p class="contact-info"><i class="bi bi-person-check"></i> Data Tersedia</p>' : '<p class="contact-info text-muted"><i class="bi bi-person-x"></i> Belum Ada Data</p>'}
        </div>
      </div>
    </div>
  `;
}

// Enhanced event listeners
function addEnhancedCardClickListeners() {
  const orgCards = document.querySelectorAll(".enhanced-org-card");

  orgCards.forEach((card, index) => {
    // Add ripple effect
    card.addEventListener("click", function (e) {
      // Create ripple effect
      const ripple = document.createElement("span");
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.6);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
        z-index: 1000;
      `;

      this.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);

      // Show enhanced modal
      const personData = JSON.parse(this.dataset.person || "null");
      const position = this.dataset.position;

      if (personData) {
        showEnhancedPersonModal(personData, position);
      } else {
        showEnhancedEmptyModal(position);
      }

      // Add success animation
      this.style.animation = "successPulse 0.6s ease-out";
      setTimeout(() => {
        this.style.animation = "";
      }, 600);
    });

    // Enhanced hover effects
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-15px) scale(1.03)";

      // Add glow effect to avatar
      const avatar = this.querySelector(".avatar-circle");
      if (avatar) {
        avatar.style.boxShadow = "0 0 20px rgba(0, 123, 255, 0.5)";
      }
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "";

      // Remove glow effect
      const avatar = this.querySelector(".avatar-circle");
      if (avatar) {
        avatar.style.boxShadow = "";
      }
    });
  });

  // Add styles for ripple effect
  if (!document.getElementById("ripple-styles")) {
    const style = document.createElement("style");
    style.id = "ripple-styles";
    style.textContent = `
      @keyframes ripple {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
      
      @keyframes successPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
    `;
    document.head.appendChild(style);
  }
}

// Enhanced animations initialization
function initEnhancedAnimations() {
  const observerOptions = {
    threshold: 0.2,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add("animate");
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0) scale(1)";
        }, index * 100);
      }
    });
  }, observerOptions);

  // Observe enhanced cards
  const cards = document.querySelectorAll(".enhanced-org-card");
  cards.forEach((card) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(30px) scale(0.95)";
    card.style.transition = "all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
    observer.observe(card);
  });
}

// Enhanced modals
function showEnhancedPersonModal(person, position) {
  // Create enhanced modal if it doesn't exist
  if (!document.getElementById("enhancedPengurusModal")) {
    createEnhancedModal();
  }

  const modal = new bootstrap.Modal(document.getElementById("enhancedPengurusModal"));
  const modalBody = document.querySelector("#enhancedPengurusModal .modal-body");

  const positionTitles = {
    kadus: "Kepala Wilayah",
    rw: "RW (Rukun Warga)",
    rt1: "RT 1",
    rt2: "RT 2",
    rt3: "RT 3",
    rt4: "RT 4",
    pemuda: "Ketua Pemuda",
  };

  const responsibilities = {
    kadus: ["Memimpin dan mengkoordinasikan seluruh kegiatan", "Bertanggung jawab atas kesejahteraan masyarakat", "Menjalin hubungan dengan pemerintah desa"],
    rw: ["Mengkoordinasikan kegiatan di tingkat RW", "Mengelola administrasi warga", "Mengorganisir kegiatan sosial"],
    rt1: ["Mengelola administrasi RT 1", "Melayani keperluan warga", "Koordinasi dengan RW"],
    rt2: ["Mengelola administrasi RT 2", "Melayani keperluan warga", "Koordinasi dengan RW"],
    rt3: ["Mengelola administrasi RT 3", "Melayani keperluan warga", "Koordinasi dengan RW"],
    rt4: ["Mengelola administrasi RT 4", "Melayani keperluan warga", "Koordinasi dengan RW"],
    pemuda: ["Mengorganisir kegiatan pemuda", "Mengembangkan potensi generasi muda", "Menyelenggarakan event dan kompetisi"],
  };

  const personName = person.name || person.Nama || "Tidak Diketahui";

  modalBody.innerHTML = `
    <div class="enhanced-modal-content">
      <div class="person-avatar-large">
        <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(personName)}&size=150&background=007bff&color=ffffff&bold=true" 
             alt="${personName}" class="avatar-img">
        <div class="avatar-overlay">
          <i class="bi bi-person-check"></i>
        </div>
      </div>
      
      <div class="person-details">
        <h3 class="person-name-large">${personName}</h3>
        <p class="person-position">${positionTitles[position] || person.Jabatan}</p>
        
        <div class="info-card">
          <h6><i class="bi bi-list-check me-2"></i>Tanggung Jawab:</h6>
          <ul class="responsibility-list">
            ${(responsibilities[position] || ["Menjalankan tugas sesuai jabatan"]).map((resp) => `<li><i class="bi bi-check-circle text-success me-2"></i>${resp}</li>`).join("")}
          </ul>
        </div>
        
        <div class="contact-section">
          <p class="mb-2"><i class="bi bi-calendar-check me-2"></i>Status: <span class="badge bg-success">Aktif</span></p>
          <p class="mb-0"><i class="bi bi-geo-alt me-2"></i>Wilayah: Dusun Krajan</p>
        </div>
      </div>
    </div>
  `;

  modal.show();
}

function showEnhancedEmptyModal(position) {
  if (!document.getElementById("enhancedPengurusModal")) {
    createEnhancedModal();
  }

  const modal = new bootstrap.Modal(document.getElementById("enhancedPengurusModal"));
  const modalBody = document.querySelector("#enhancedPengurusModal .modal-body");

  modalBody.innerHTML = `
    <div class="enhanced-modal-content text-center">
      <div class="empty-state">
        <i class="bi bi-person-plus display-1 text-muted mb-4"></i>
        <h4>Posisi Kosong</h4>
        <p class="text-muted mb-4">Posisi ini belum memiliki pengurus yang terdaftar dalam sistem.</p>
        
        <div class="alert alert-info">
          <i class="bi bi-info-circle me-2"></i>
          Silakan hubungi administrator untuk informasi lebih lanjut mengenai kekosongan posisi ini.
        </div>
        
        <div class="suggestion-box">
          <h6><i class="bi bi-lightbulb me-2"></i>Saran:</h6>
          <ul class="text-start">
            <li>Periksa kembali data di sistem admin</li>
            <li>Konfirmasi dengan pengurus desa</li>
            <li>Laporkan jika ada kesalahan data</li>
          </ul>
        </div>
      </div>
    </div>
  `;

  modal.show();
}

function createEnhancedModal() {
  const modalHTML = `
    <div class="modal fade" id="enhancedPengurusModal" tabindex="-1">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content enhanced-modal">
          <div class="modal-header enhanced-header">
            <h5 class="modal-title">
              <i class="bi bi-person-lines-fill me-2"></i>
              Detail Pengurus Dusun
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body p-0"></div>
          <div class="modal-footer enhanced-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              <i class="bi bi-x-circle me-2"></i>Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <style>
      .enhanced-modal .modal-content {
        border: none;
        border-radius: 20px;
        overflow: hidden;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      }
      
      .enhanced-header {
        background: linear-gradient(135deg, #007bff, #0056b3);
        color: white;
        border: none;
        padding: 1.5rem;
      }
      
      .enhanced-footer {
        background: #f8f9fa;
        border: none;
        padding: 1.5rem;
      }
      
      .enhanced-modal-content {
        padding: 2rem;
      }
      
      .person-avatar-large {
        position: relative;
        width: 150px;
        height: 150px;
        margin: 0 auto 2rem;
      }
      
      .avatar-img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
        border: 4px solid #007bff;
      }
      
      .avatar-overlay {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 40px;
        height: 40px;
        background: #28a745;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        border: 3px solid white;
      }
      
      .person-name-large {
        font-size: 2rem;
        font-weight: 700;
        color: #007bff;
        margin-bottom: 0.5rem;
        text-align: center;
      }
      
      .person-position {
        font-size: 1.2rem;
        color: #6c757d;
        text-align: center;
        margin-bottom: 2rem;
        font-style: italic;
      }
      
      .info-card {
        background: #f8f9fa;
        border-radius: 15px;
        padding: 1.5rem;
        margin-bottom: 1.5rem;
      }
      
      .responsibility-list {
        list-style: none;
        padding: 0;
        margin: 1rem 0 0 0;
      }
      
      .responsibility-list li {
        padding: 0.5rem 0;
        display: flex;
        align-items: center;
      }
      
      .contact-section {
        background: linear-gradient(135deg, #e3f2fd, #bbdefb);
        border-radius: 15px;
        padding: 1.5rem;
        text-align: center;
      }
      
      .empty-state {
        padding: 2rem;
      }
      
      .suggestion-box {
        background: #f8f9fa;
        border-radius: 10px;
        padding: 1rem;
        text-align: left;
        margin-top: 1rem;
      }
      
      .suggestion-box ul {
        margin: 0.5rem 0 0 0;
        padding-left: 1.5rem;
      }
      
      .suggestion-box li {
        margin-bottom: 0.25rem;
      }
    </style>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);
}

function createRTCard(person, title, animationClass) {
  return `
    <div class="org-card rt-card ${animationClass}" data-position="rt" data-person='${JSON.stringify(person)}'>
      <i class="bi bi-house display-6 mb-2"></i>
      <h5>${person ? person.name || person.Nama || "Belum Ada Data" : "Belum Ada Data"}</h5>
      <p>${title}</p>

    </div>
  `;
}

function addCardClickListeners() {
  const orgCards = document.querySelectorAll(".org-card");
  orgCards.forEach((card) => {
    card.addEventListener("click", function (e) {
      // Contact functionality removed for security reasons
      const personData = JSON.parse(this.dataset.person || "null");
      const position = this.dataset.position;

      if (personData) {
        showPersonModal(personData, position);
      } else {
        showEmptyPositionModal(position);
      }

      // Add success animation
      this.classList.add("success-animation");
      setTimeout(() => {
        this.classList.remove("success-animation");
      }, 600);
    });

    // Add hover sound effect (optional)
    card.addEventListener("mouseenter", function () {
      // You can add sound effects here if needed
      this.style.animationPlayState = "paused";
    });

    card.addEventListener("mouseleave", function () {
      this.style.animationPlayState = "running";
    });
  });
}

// Contact functionality removed for security reasons to prevent harassment

function initModalInteractions() {
  // Create main modal if it doesn't exist
  if (!document.getElementById("pengurusModal")) {
    createPengurusModal();
  }
}

function createPengurusModal() {
  const modalHTML = `
    <div class="modal fade pengurus-modal" id="pengurusModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Detail Pengurus</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body"></div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
            <button type="button" class="contact-btn" id="contactFromModal">
              <i class="bi bi-envelope"></i> Hubungi
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);
}

function showPersonModal(person, position) {
  const modal = new bootstrap.Modal(document.getElementById("pengurusModal"));
  const modalBody = document.querySelector("#pengurusModal .modal-body");

  const positionTitles = {
    kadus: "Kepala Wilayah",
    rw: "RW (Rukun Warga)",
    rt: person.Jabatan,
    pemuda: "Ketua Pemuda",
  };

  const responsibilities = {
    kadus: ["Memimpin dan mengkoordinasikan seluruh kegiatan di wilayah", "Bertanggung jawab atas kesejahteraan masyarakat", "Menjalin hubungan dengan pemerintah desa", "Mengawasi kinerja RW dan RT"],
    rw: ["Mengkoordinasikan kegiatan di tingkat RW", "Menghubungkan RT dengan kepala wilayah", "Mengelola administrasi warga", "Mengorganisir kegiatan sosial"],
    rt: ["Mengelola administrasi di tingkat RT", "Melayani keperluan warga RT", "Mengkoordinasikan kegiatan RT", "Menjadi penghubung dengan RW"],
    pemuda: ["Mengorganisir kegiatan pemuda", "Mengembangkan potensi generasi muda", "Menyelenggarakan event dan kompetisi", "Membantu kegiatan sosial masyarakat"],
  };

  modalBody.innerHTML = `
    <div class="text-center">
      <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&size=120&background=007bff&color=ffffff&bold=true" 
           alt="${person.name}" class="pengurus-avatar">
      <div class="pengurus-info">
        <h4>${person.name}</h4>
        <p class="job-title">${positionTitles[position] || person.Jabatan}</p>
        <div class="pengurus-responsibilities">
          <h6><i class="bi bi-list-check"></i> Tanggung Jawab:</h6>
          <ul class="list-unstyled">
            ${(responsibilities[position] || ["Menjalankan tugas sesuai jabatan"]).map((resp) => `<li><i class="bi bi-check-circle text-success"></i> ${resp}</li>`).join("")}
          </ul>
        </div>
      </div>
    </div>
  `;

  // Set up contact button
  document.getElementById("contactFromModal").onclick = () => {
    modal.hide();
    setTimeout(() => showContactOptions(person), 300);
  };

  modal.show();
}

function showEmptyPositionModal(position) {
  const modal = new bootstrap.Modal(document.getElementById("pengurusModal"));
  const modalBody = document.querySelector("#pengurusModal .modal-body");

  modalBody.innerHTML = `
    <div class="text-center">
      <i class="bi bi-person-plus display-1 text-muted mb-3"></i>
      <h4>Posisi Kosong</h4>
      <p class="text-muted">Posisi ini belum memiliki pengurus yang terdaftar.</p>
      <div class="alert alert-info">
        <i class="bi bi-info-circle"></i>
        Silakan hubungi administrator untuk informasi lebih lanjut mengenai pengurus di posisi ini.
      </div>
    </div>
  `;

  // Hide contact button for empty positions
  document.getElementById("contactFromModal").style.display = "none";

  modal.show();

  // Show contact button again when modal is hidden
  document.getElementById("pengurusModal").addEventListener(
    "hidden.bs.modal",
    function () {
      document.getElementById("contactFromModal").style.display = "inline-block";
    },
    { once: true }
  );
}

function initResponsiveFeatures() {
  // Handle window resize
  window.addEventListener("resize", function () {
    const isMobile = window.innerWidth <= 768;

    // Disable complex animations on mobile for better performance
    if (isMobile) {
      document.body.classList.add("mobile-view");
    } else {
      document.body.classList.remove("mobile-view");
    }
  });

  // Add touch feedback for mobile
  if ("ontouchstart" in window) {
    document.addEventListener("touchstart", function (e) {
      if (e.target.closest(".org-card")) {
        e.target.closest(".org-card").classList.add("touching");
      }
    });

    document.addEventListener("touchend", function (e) {
      if (e.target.closest(".org-card")) {
        setTimeout(() => {
          e.target.closest(".org-card").classList.remove("touching");
        }, 150);
      }
    });
  }
}

// Add keyboard navigation
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    // Close any open modals
    const openModals = document.querySelectorAll(".modal.show");
    openModals.forEach((modal) => {
      const bsModal = bootstrap.Modal.getInstance(modal);
      if (bsModal) bsModal.hide();
    });
  }
});

// Add smooth scrolling for any anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});
