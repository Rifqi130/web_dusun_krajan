// Aset Scroll Animation Handler
class AsetScrollAnimations {
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

    // Re-observe elements when new aset data is loaded
    this.setupMutationObserver();
  }

  observeElements() {
    // Observe all animation elements
    const animationElements = document.querySelectorAll([".fade-in-up", ".scale-in", ".slide-in-up", ".aset-title"].join(", "));

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
    // Watch for new aset content being added
    const targetNode = document.getElementById("asetGrid");
    if (!targetNode) return;

    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          // Re-observe new elements
          setTimeout(() => {
            this.observeElements();
            // Add animation classes to new aset cards
            this.animateNewAsetCards();
          }, 100);
        }
      });
    });

    mutationObserver.observe(targetNode, {
      childList: true,
      subtree: true,
    });
  }

  // Animate newly added aset cards
  animateNewAsetCards() {
    const newCards = document.querySelectorAll("#asetGrid .aset-card:not(.fade-in-up)");
    newCards.forEach((card, index) => {
      // Add animation classes
      card.classList.add("fade-in-up");
      if (index % 3 === 1) card.classList.add("delay-1");
      if (index % 3 === 2) card.classList.add("delay-2");

      // Observe the new card
      this.observer.observe(card);
    });
  }

  // Method to manually trigger animations (useful for testing)
  triggerAllAnimations() {
    const elements = document.querySelectorAll([".fade-in-up", ".scale-in", ".slide-in-up", ".aset-title"].join(", "));

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

  // Add search highlight animation
  addSearchHighlight(element) {
    element.classList.add("search-highlight");
    setTimeout(() => {
      element.classList.remove("search-highlight");
    }, 2000);
  }
}

// Initialize scroll animations
const asetAnimations = new AsetScrollAnimations();

// Add some utility functions for enhanced interactivity
document.addEventListener("DOMContentLoaded", function () {
  // Enhanced hover effects for aset cards
  document.addEventListener("mouseover", function (e) {
    if (e.target.closest(".aset-card")) {
      const card = e.target.closest(".aset-card");
      card.style.transform = "translateY(-8px)";
      card.style.boxShadow = "0 12px 30px rgba(0, 0, 0, 0.2)";
    }
  });

  document.addEventListener("mouseout", function (e) {
    if (e.target.closest(".aset-card")) {
      const card = e.target.closest(".aset-card");
      card.style.transform = "translateY(0)";
      card.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
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

  // Animate search results
  const originalSearch = window.searchAset;
  if (typeof originalSearch === "function") {
    window.searchAset = function (...args) {
      const result = originalSearch.apply(this, args);

      // Add highlight to search results after a short delay
      setTimeout(() => {
        document.querySelectorAll("#asetGrid .aset-card").forEach((card) => {
          asetAnimations.addSearchHighlight(card);
        });
      }, 500);

      return result;
    };
  }
});

// Export for potential use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = AsetScrollAnimations;
}
