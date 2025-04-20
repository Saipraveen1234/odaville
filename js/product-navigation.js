/**
 * Odaville Website - Product Navigation Buttons - Fixed Version
 * This script handles the navigation buttons for the product slider
 * Note: This is now integrated into products.js and is kept as a backup
 */

document.addEventListener("DOMContentLoaded", function () {
  console.log("Product navigation script loaded (backup version)");

  // This file is no longer needed as the navigation functionality is now
  // integrated directly into products.js for better coordination.
  // We'll keep this as a backup in case the main file fails to load.
  
  // Wait for a moment to check if the main products.js has initialized
  setTimeout(checkAndInitializeNavigation, 2000);
  
  function checkAndInitializeNavigation() {
    // Check if we're on a page with products section
    const productsSection = document.querySelector(".products-section");
    if (!productsSection) {
      console.log("No products section found, skipping navigation setup");
      return;
    }
    
    // Skip if buttons already have click handlers (set by products.js)
    const prevBtn = document.getElementById("prev-product");
    const nextBtn = document.getElementById("next-product");
    
    if (!prevBtn || !nextBtn) {
      console.warn("Product navigation buttons not found in DOM");
      createNavigationButtons();
      return;
    }
    
    // Check if buttons already have event listeners by testing a class
    if (prevBtn.classList.contains('initialized') || nextBtn.classList.contains('initialized')) {
      console.log("Navigation buttons already initialized by products.js");
      return;
    }
    
    // Mark buttons as initialized
    prevBtn.classList.add('initialized');
    nextBtn.classList.add('initialized');
    
    // Get any Swiper instance
    const swiperElement = document.querySelector(".products-swiper");
    const swiperInstance = swiperElement && swiperElement.swiper ? swiperElement.swiper : null;
    
    // Add click handlers
    prevBtn.addEventListener("click", function() {
      if (swiperInstance && typeof swiperInstance.slidePrev === 'function') {
        console.log("Previous slide via Swiper API");
        swiperInstance.slidePrev();
      } else {
        // Fallback to clicking built-in buttons
        const swiperPrevButton = document.querySelector(".swiper-button-prev");
        if (swiperPrevButton) {
          console.log("Clicking built-in previous button");
          swiperPrevButton.click();
        }
      }
    });
    
    nextBtn.addEventListener("click", function() {
      if (swiperInstance && typeof swiperInstance.slideNext === 'function') {
        console.log("Next slide via Swiper API");
        swiperInstance.slideNext();
      } else {
        // Fallback to clicking built-in buttons
        const swiperNextButton = document.querySelector(".swiper-button-next");
        if (swiperNextButton) {
          console.log("Clicking built-in next button");
          swiperNextButton.click();
        }
      }
    });
    
    // Add hover effects
    [prevBtn, nextBtn].forEach((btn) => {
      btn.addEventListener("mouseenter", function() {
        this.style.backgroundColor = "#ca8355";
        this.style.transform = "translateY(-4px)";
        this.style.boxShadow = "0 10px 25px rgba(202, 131, 85, 0.25)";
        const svg = this.querySelector("svg");
        if (svg) svg.style.stroke = "#fff";
      });
      
      btn.addEventListener("mouseleave", function() {
        this.style.backgroundColor = "#fff";
        this.style.transform = "translateY(0)";
        this.style.boxShadow = "0 6px 20px rgba(0, 0, 0, 0.08)";
        const svg = this.querySelector("svg");
        if (svg) svg.style.stroke = "#333";
      });
    });
  }
  
  // Function to create navigation buttons if they don't exist
  function createNavigationButtons() {
    console.log("Creating navigation buttons (backup)");
    
    const productsContainer = document.querySelector(".products-container");
    if (!productsContainer) return;
    
    // Create button container
    const navContainer = document.createElement("div");
    navContainer.style.display = "flex";
    navContainer.style.justifyContent = "center";
    navContainer.style.alignItems = "center";
    navContainer.style.margin = "30px auto";
    navContainer.style.gap = "30px";
    
    // Create prev button
    const prevBtn = document.createElement("button");
    prevBtn.id = "prev-product";
    prevBtn.className = "product-nav-btn initialized";
    prevBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="19" y1="12" x2="5" y2="12"></line>
        <polyline points="12 19 5 12 12 5"></polyline>
      </svg>
    `;
    
    // Create next button
    const nextBtn = document.createElement("button");
    nextBtn.id = "next-product";
    nextBtn.className = "product-nav-btn initialized";
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
    if (swiperContainer && swiperContainer.parentNode) {
      swiperContainer.parentNode.insertBefore(
        navContainer,
        swiperContainer.nextSibling
      );
    } else {
      // If swiper not found, add at the end of products container
      productsContainer.appendChild(navContainer);
    }
    
    // Initialize event listeners after a short delay
    setTimeout(checkAndInitializeNavigation, 500);
  }
});