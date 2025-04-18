/**
 * Odaville Website - Product Navigation Buttons - Fixed Version
 * This script safely adds navigation functionality to product slider
 */

document.addEventListener("DOMContentLoaded", function () {
  console.log("Product navigation script loaded");

  // Check if we're on a page with products section
  const productsSection = document.querySelector(".products-section");
  if (!productsSection) {
    console.log("No products section found, skipping navigation setup");
    return;
  }

  // Make sure nav buttons exist
  const prevBtn = document.getElementById("prev-product");
  const nextBtn = document.getElementById("next-product");

  if (!prevBtn || !nextBtn) {
    console.warn("Product navigation buttons not found in DOM");

    // If buttons don't exist, try to recreate them
    createNavigationButtons();
    return;
  }

  // Function to create navigation buttons if they don't exist
  function createNavigationButtons() {
    console.log("Creating navigation buttons");

    const productsContainer = document.querySelector(".products-container");
    if (!productsContainer) return;

    // Create button container
    const navContainer = document.createElement("div");
    navContainer.className = "product-navigation";
    navContainer.style.display = "flex";
    navContainer.style.justifyContent = "center";
    navContainer.style.margin = "30px auto";
    navContainer.style.gap = "30px";

    // Create prev button
    const prevBtn = document.createElement("button");
    prevBtn.id = "prev-product";
    prevBtn.className = "product-nav-btn";
    prevBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="19" y1="12" x2="5" y2="12"></line>
        <polyline points="12 19 5 12 12 5"></polyline>
      </svg>
    `;

    // Create next button
    const nextBtn = document.createElement("button");
    nextBtn.id = "next-product";
    nextBtn.className = "product-nav-btn";
    nextBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="5" y1="12" x2="19" y2="12"></line>
        <polyline points="12 5 19 12 12 19"></polyline>
      </svg>
    `;

    // Add styles
    [prevBtn, nextBtn].forEach((btn) => {
      btn.style.width = "50px";
      btn.style.height = "50px";
      btn.style.borderRadius = "50%";
      btn.style.backgroundColor = "white";
      btn.style.border = "none";
      btn.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
      btn.style.cursor = "pointer";
      btn.style.display = "flex";
      btn.style.alignItems = "center";
      btn.style.justifyContent = "center";
      btn.style.transition = "all 0.3s ease";
    });

    // Add buttons to container
    navContainer.appendChild(prevBtn);
    navContainer.appendChild(nextBtn);

    // Add container after product swiper
    const swiperContainer = document.querySelector(".products-swiper");
    if (swiperContainer) {
      swiperContainer.parentNode.insertBefore(
        navContainer,
        swiperContainer.nextSibling
      );
    } else {
      // If swiper not found, add at the end of products container
      productsContainer.appendChild(navContainer);
    }

    // Now initialize again
    setTimeout(initializeNavButtons, 500);
  }

  // Wait for Swiper to be fully initialized
  function waitForSwiper(callback, maxAttempts = 10) {
    let attempts = 0;

    const checkSwiper = () => {
      attempts++;
      console.log(`Checking for Swiper (attempt ${attempts}/${maxAttempts})`);

      const swiperElement = document.querySelector(".products-swiper");
      if (swiperElement && swiperElement.swiper) {
        console.log("Swiper instance found");
        callback(swiperElement.swiper);
        return;
      }

      if (attempts >= maxAttempts) {
        console.warn(
          "Max attempts reached, falling back to alternative navigation"
        );
        setupAlternativeNavigation();
        return;
      }

      setTimeout(checkSwiper, 500);
    };

    checkSwiper();
  }

  // Setup alternative navigation using fake events
  function setupAlternativeNavigation() {
    console.log("Setting up alternative navigation");

    // Get nav buttons again in case they were just created
    const prevBtn = document.getElementById("prev-product");
    const nextBtn = document.getElementById("next-product");

    if (!prevBtn || !nextBtn) return;

    // Click the built-in Swiper navigation buttons
    prevBtn.addEventListener("click", function () {
      const swiperPrevButton = document.querySelector(".swiper-button-prev");
      if (swiperPrevButton) {
        console.log("Clicking built-in previous button");
        swiperPrevButton.click();
      } else {
        // Manual slide change using DOM manipulation
        manualSlideChange("prev");
      }
    });

    nextBtn.addEventListener("click", function () {
      const swiperNextButton = document.querySelector(".swiper-button-next");
      if (swiperNextButton) {
        console.log("Clicking built-in next button");
        swiperNextButton.click();
      } else {
        // Manual slide change using DOM manipulation
        manualSlideChange("next");
      }
    });

    // Add hover effects
    [prevBtn, nextBtn].forEach((btn) => {
      btn.addEventListener("mouseenter", function () {
        this.style.backgroundColor = "#ca8355";
        this.style.transform = "translateY(-4px)";
        this.style.boxShadow = "0 10px 25px rgba(202, 131, 85, 0.25)";
        const svg = this.querySelector("svg");
        if (svg) svg.style.stroke = "#fff";
      });

      btn.addEventListener("mouseleave", function () {
        this.style.backgroundColor = "#fff";
        this.style.transform = "translateY(0)";
        this.style.boxShadow = "0 6px 20px rgba(0, 0, 0, 0.08)";
        const svg = this.querySelector("svg");
        if (svg) svg.style.stroke = "#333";
      });
    });
  }

  // Manual slide change when all else fails
  function manualSlideChange(direction) {
    console.log(`Manual ${direction} slide`);

    const slides = document.querySelectorAll(".swiper-slide");
    if (!slides.length) return;

    // Find the active slide
    let activeIndex = -1;
    slides.forEach((slide, index) => {
      if (slide.classList.contains("swiper-slide-active")) {
        activeIndex = index;
      }
    });

    if (activeIndex === -1) {
      // If no active slide found, assume first slide
      activeIndex = 0;
    }

    // Calculate next index based on direction
    let nextIndex =
      direction === "next"
        ? (activeIndex + 1) % slides.length
        : (activeIndex - 1 + slides.length) % slides.length;

    // Remove active class from all slides
    slides.forEach((slide) => {
      slide.classList.remove(
        "swiper-slide-active",
        "swiper-slide-next",
        "swiper-slide-prev"
      );
    });

    // Add active class to new slide
    slides[nextIndex].classList.add("swiper-slide-active");

    // Add prev/next classes to adjacent slides
    slides[(nextIndex + 1) % slides.length].classList.add("swiper-slide-next");
    slides[(nextIndex - 1 + slides.length) % slides.length].classList.add(
      "swiper-slide-prev"
    );
  }

  // Initialize navigation buttons
  function initializeNavButtons() {
    console.log("Initializing product navigation buttons");

    // Get navigation buttons
    const prevBtn = document.getElementById("prev-product");
    const nextBtn = document.getElementById("next-product");

    if (!prevBtn || !nextBtn) {
      console.warn("Navigation buttons not found after initialization attempt");
      return;
    }

    // First try to use Swiper's API directly
    waitForSwiper(function (swiper) {
      // Add click handlers using Swiper's API
      prevBtn.addEventListener("click", function () {
        console.log("Previous slide via Swiper API");
        swiper.slidePrev();
      });

      nextBtn.addEventListener("click", function () {
        console.log("Next slide via Swiper API");
        swiper.slideNext();
      });

      // Add hover effects
      [prevBtn, nextBtn].forEach((btn) => {
        btn.addEventListener("mouseenter", function () {
          this.style.backgroundColor = "#ca8355";
          this.style.transform = "translateY(-4px)";
          this.style.boxShadow = "0 10px 25px rgba(202, 131, 85, 0.25)";
          const svg = this.querySelector("svg");
          if (svg) svg.style.stroke = "#fff";
        });

        btn.addEventListener("mouseleave", function () {
          this.style.backgroundColor = "#fff";
          this.style.transform = "translateY(0)";
          this.style.boxShadow = "0 6px 20px rgba(0, 0, 0, 0.08)";
          const svg = this.querySelector("svg");
          if (svg) svg.style.stroke = "#333";
        });
      });
    });
  }

  // Start the initialization process
  initializeNavButtons();
});
