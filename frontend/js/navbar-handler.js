// Navbar Fixed and Mobile Menu Handler
document.addEventListener("DOMContentLoaded", function () {
  const navbar = document.querySelector(".navbar");
  const body = document.body;
  const navbarToggler = document.querySelector(".navbar-toggler");
  const navbarCollapse = document.querySelector(".navbar-collapse");

  // Make navbar fixed and add body padding
  if (navbar) {
    navbar.classList.add("fixed-top");
    body.classList.add("has-fixed-navbar");
  }

  // Close mobile menu when clicking outside or scrolling
  function closeMobileMenu() {
    if (navbarCollapse && navbarCollapse.classList.contains("show")) {
      const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
        toggle: false,
      });
      bsCollapse.hide();
    }
  }

  // Close menu when scrolling on mobile
  let scrollTimer = null;
  window.addEventListener("scroll", function () {
    if (window.innerWidth <= 991) {
      // Mobile breakpoint
      closeMobileMenu();
    }

    // Clear the timer
    if (scrollTimer) {
      clearTimeout(scrollTimer);
    }

    // Set a timer to close menu after scroll ends
    scrollTimer = setTimeout(function () {
      if (window.innerWidth <= 991) {
        closeMobileMenu();
      }
    }, 150);
  });

  // Close menu when clicking on a nav link (mobile)
  const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      if (window.innerWidth <= 991) {
        setTimeout(closeMobileMenu, 100);
      }
    });
  });

  // Close menu when clicking outside navbar (mobile)
  document.addEventListener("click", function (event) {
    if (window.innerWidth <= 991) {
      const isClickInsideNav = navbar.contains(event.target);
      if (!isClickInsideNav && navbarCollapse.classList.contains("show")) {
        closeMobileMenu();
      }
    }
  });

  // Handle window resize
  window.addEventListener("resize", function () {
    if (window.innerWidth > 991) {
      // Desktop view - ensure collapse is not shown
      if (navbarCollapse.classList.contains("show")) {
        navbarCollapse.classList.remove("show");
      }
    }
  });

  // Prevent navbar collapse from interfering with page navigation
  if (navbarToggler) {
    navbarToggler.addEventListener("click", function (e) {
      e.stopPropagation();
    });
  }
});
