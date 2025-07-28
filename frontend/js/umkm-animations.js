// UMKM Scroll Animation Handler
class UmkmScrollAnimations {
  constructor() {
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.setupObserver());
    } else {
      this.setupObserver();
    }
  }

  setupObserver() {
    // Create intersection observer
    this.observer = new IntersectionObserver(this.handleIntersection.bind(this), this.observerOptions);

    // Start observing initially visible elements
    this.observeElements();

    // Re-observe elements when new UMKM data is loaded
    this.setupMutationObserver();
  }

  observeElements() {
    // Observe all animation elements
    const animationElements = document.querySelectorAll([".fade-in-up", ".fade-in-left", ".fade-in-right", ".scale-in", ".slide-in-up", ".umkm-title"].join(", "));

    animationElements.forEach((element) => {
      this.observer.observe(element);
    });
  }

  handleIntersection(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        this.animateElement(entry.target);
      }
    });
  }

  animateElement(element) {
    // Add visible class for CSS animations
    element.classList.add("visible");

    // Stop observing once animated (for performance)
    this.observer.unobserve(element);
  }

  setupMutationObserver() {
    // Watch for new UMKM content being added
    const targetNode = document.getElementById("umkm-container");
    if (!targetNode) return;

    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          // Re-observe new elements
          setTimeout(() => {
            this.observeElements();
          }, 100);
        }
      });
    });

    mutationObserver.observe(targetNode, {
      childList: true,
      subtree: true,
    });
  }

  // Method to manually trigger animations (useful for testing)
  triggerAllAnimations() {
    const elements = document.querySelectorAll([".fade-in-up", ".fade-in-left", ".fade-in-right", ".scale-in", ".slide-in-up", ".umkm-title"].join(", "));

    elements.forEach((element, index) => {
      setTimeout(() => {
        this.animateElement(element);
      }, index * 100);
    });
  }

  // Reset animations (useful for testing)
  resetAnimations() {
    const elements = document.querySelectorAll(".visible");
    elements.forEach((element) => {
      element.classList.remove("visible");
      this.observer.observe(element);
    });
  }
}

// Initialize scroll animations
const umkmAnimations = new UmkmScrollAnimations();

// Add some utility functions for enhanced interactivity
document.addEventListener("DOMContentLoaded", function () {
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

  // Add loading animation to spinner
  const loadingSpinner = document.querySelector(".spinner-border");
  if (loadingSpinner) {
    loadingSpinner.classList.add("loading-bounce");
  }

  // Enhanced hover effects for interactive elements
  document.addEventListener("mouseover", function (e) {
    if (e.target.closest(".umkm-card")) {
      e.target.closest(".umkm-card").style.transform = "translateY(-5px)";
    }
  });

  document.addEventListener("mouseout", function (e) {
    if (e.target.closest(".umkm-card")) {
      e.target.closest(".umkm-card").style.transform = "translateY(0)";
    }
  });
});

// Export for potential use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = UmkmScrollAnimations;
}
