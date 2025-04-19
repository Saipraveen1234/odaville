/**
 * Odaville Website - Products Section with Category Filtering
 * Enhanced version with reliable Swiper initialization and error handling
 */

document.addEventListener("DOMContentLoaded", function () {
  console.log("Products.js loaded - Fixed version");

  // Variables for storing state
  let productSwiper = null;
  let currentCategory = "windows"; // Default category
  let initializationAttempts = 0;
  const MAX_ATTEMPTS = 5;

  // Initialize products section
  initializeProducts();

  function initializeProducts() {
    console.log("Initializing products section");

    // Check if we're on a page with products section
    const productsSection = document.querySelector(".products-section");
    if (!productsSection) {
      console.log("No products section found on this page");
      return;
    }

    // Check if Swiper is available
    if (typeof Swiper === "undefined") {
      console.warn("Swiper is not available! Waiting for it to load...");
      
      // Try to load Swiper dynamically if not available
      if (initializationAttempts < MAX_ATTEMPTS) {
        initializationAttempts++;
        setTimeout(initializeProducts, 500);
        return;
      } else {
        console.error("Failed to load Swiper after multiple attempts.");
        showFallbackProducts();
        return;
      }
    }

    // Make sure we have a container for products
    const swiperContainer = document.querySelector(".products-swiper");
    const swiperWrapper = swiperContainer ? swiperContainer.querySelector(".swiper-wrapper") : null;
    
    if (!swiperContainer || !swiperWrapper) {
      console.error("Required Swiper elements not found");
      return;
    }

    // Generate initial products for default category
    generateProductCards(currentCategory);

    // Initialize category filtering
    initCategoryFilters();

    // Add scroll animations
    initScrollAnimations();

    // Setup product navigation buttons if they exist
    setupProductNavigation();
  }

  function initSwiper() {
    const swiperContainer = document.querySelector(".products-swiper");
    if (!swiperContainer) {
      console.error("Swiper container not found");
      return;
    }

    // Clean up existing Swiper instance if it exists
    if (productSwiper && typeof productSwiper.destroy === 'function') {
      productSwiper.destroy(true, true);
      productSwiper = null;
    }

    // Create necessary Swiper elements if they don't exist
    if (!swiperContainer.querySelector('.swiper-pagination')) {
      const pagination = document.createElement('div');
      pagination.className = 'swiper-pagination products-pagination';
      swiperContainer.appendChild(pagination);
    }

    if (!document.querySelector('.swiper-button-next')) {
      const nextButton = document.createElement('div');
      nextButton.className = 'swiper-button-next';
      nextButton.style.opacity = '0'; // Hide default buttons
      swiperContainer.appendChild(nextButton);
    }

    if (!document.querySelector('.swiper-button-prev')) {
      const prevButton = document.createElement('div');
      prevButton.className = 'swiper-button-prev';
      prevButton.style.opacity = '0'; // Hide default buttons
      swiperContainer.appendChild(prevButton);
    }

    try {
      // Create new Swiper instance with more reliable configuration
      productSwiper = new Swiper(swiperContainer, {
        slidesPerView: 1,
        spaceBetween: 30,
        centeredSlides: true,
        loop: true,
        speed: 800,
        effect: 'fade',
        fadeEffect: {
          crossFade: true
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        on: {
          init: function() {
            console.log("Swiper initialized successfully");
            // Update slide visibility
            this.slides.forEach((slide, index) => {
              if (index === this.activeIndex) {
                slide.style.opacity = '1';
              } else {
                slide.style.opacity = index === this.previousIndex || index === (this.activeIndex + 1) % this.slides.length ? '0.6' : '0.3';
              }
            });
            
            // Remove loading state
            swiperContainer.classList.remove('loading');
          },
          slideChange: function() {
            // Update active states
            this.slides.forEach((slide, index) => {
              if (index === this.activeIndex) {
                slide.style.opacity = '1';
              } else {
                slide.style.opacity = index === this.previousIndex || index === (this.activeIndex + 1) % this.slides.length ? '0.6' : '0.3';
              }
            });
          }
        }
      });
      
      // Force update to ensure correct initialization
      setTimeout(() => {
        if (productSwiper && typeof productSwiper.update === 'function') {
          productSwiper.update();
        }
      }, 100);
      
    } catch (error) {
      console.error("Error initializing Swiper:", error);
      showFallbackProducts();
    }
  }

  function setupProductNavigation() {
    // Get custom navigation buttons
    const prevBtn = document.getElementById("prev-product");
    const nextBtn = document.getElementById("next-product");
    
    if (!prevBtn || !nextBtn) {
      console.log("Custom navigation buttons not found, creating them");
      createNavigationButtons();
      return;
    }
    
    // Clear any existing event listeners to prevent duplicates
    const newPrevBtn = prevBtn.cloneNode(true);
    const newNextBtn = nextBtn.cloneNode(true);
    
    if (prevBtn.parentNode) {
      prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);
    }
    
    if (nextBtn.parentNode) {
      nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);
    }
    
    // Add event listeners to the new buttons
    newPrevBtn.addEventListener("click", function() {
      if (productSwiper && typeof productSwiper.slidePrev === 'function') {
        console.log("Previous slide via Swiper API");
        productSwiper.slidePrev();
      } else {
        // Fallback to clicking built-in buttons
        const swiperPrevButton = document.querySelector(".swiper-button-prev");
        if (swiperPrevButton) {
          console.log("Clicking built-in previous button");
          swiperPrevButton.click();
        }
      }
    });
    
    newNextBtn.addEventListener("click", function() {
      if (productSwiper && typeof productSwiper.slideNext === 'function') {
        console.log("Next slide via Swiper API");
        productSwiper.slideNext();
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
    [newPrevBtn, newNextBtn].forEach((btn) => {
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
      
      btn.addEventListener("mousedown", function() {
        this.style.transform = "translateY(-2px)";
        this.style.boxShadow = "0 8px 15px rgba(202, 131, 85, 0.2)";
      });
      
      btn.addEventListener("mouseup", function() {
        this.style.transform = "translateY(-4px)";
        this.style.boxShadow = "0 10px 25px rgba(202, 131, 85, 0.25)";
      });
    });
  }

  function createNavigationButtons() {
    console.log("Creating navigation buttons");
    
    const productsContainer = document.querySelector(".products-container");
    if (!productsContainer) return;
    
    // Create button container
    const navContainer = document.createElement("div");
    navContainer.style.display = "flex";
    navContainer.style.justifyContent = "center";
    navContainer.style.alignItems = "center";
    navContainer.style.margin = "30px auto 40px";
    navContainer.style.gap = "30px";
    navContainer.style.position = "relative";
    navContainer.style.zIndex = "10";
    
    // Create prev button
    const prevBtn = document.createElement("button");
    prevBtn.id = "prev-product";
    prevBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="19" y1="12" x2="5" y2="12"></line>
        <polyline points="12 19 5 12 12 5"></polyline>
      </svg>
    `;
    
    // Create next button
    const nextBtn = document.createElement("button");
    nextBtn.id = "next-product";
    nextBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="5" y1="12" x2="19" y2="12"></line>
        <polyline points="12 5 19 12 12 19"></polyline>
      </svg>
    `;
    
    // Add styles
    [prevBtn, nextBtn].forEach((btn) => {
      btn.style.width = "56px";
      btn.style.height = "56px";
      btn.style.borderRadius = "50%";
      btn.style.backgroundColor = "#fff";
      btn.style.border = "none";
      btn.style.boxShadow = "0 6px 20px rgba(0, 0, 0, 0.08)";
      btn.style.cursor = "pointer";
      btn.style.display = "flex";
      btn.style.alignItems = "center";
      btn.style.justifyContent = "center";
      btn.style.transition = "all 0.3s ease";
      btn.style.position = "relative";
      btn.style.overflow = "hidden";
      btn.style.marginTop = "20px";
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
    
    // Now initialize the navigation again
    setTimeout(setupProductNavigation, 100);
  }

  async function generateProductCards(category) {
    const swiperWrapper = document.querySelector('.products-swiper .swiper-wrapper');
    const swiperContainer = document.querySelector('.products-swiper');
    
    if (!swiperWrapper || !swiperContainer) {
      console.error('Required elements not found');
      return;
    }
    
    // Show loading state
    swiperContainer.classList.add('loading');
    swiperWrapper.innerHTML = '';
    
    try {
      const products = await fetchProducts(category);
      
      if (!products || products.length === 0) {
        swiperWrapper.innerHTML = '<div class="swiper-slide"><div class="no-products">No products found in this category.</div></div>';
        swiperContainer.classList.remove('loading');
        return;
      }
      
      const productCards = products.map(product => `
        <div class="swiper-slide">
          <div class="product-card">
            <div class="product-image">
              <img src="${product.imageUrl}" alt="${product.title}" onerror="this.src='./images/fallback.jpg'">
            </div>
            <div class="product-info">
              <h3>${product.title}</h3>
              <p>${product.subtitle || ''}</p>
            </div>
          </div>
        </div>
      `).join('');
      
      swiperWrapper.innerHTML = productCards;
      
      // Initialize Swiper after content is loaded
      setTimeout(() => {
        initSwiper();
      }, 100);
      
    } catch (error) {
      console.error('Error generating product cards:', error);
      swiperWrapper.innerHTML = '<div class="swiper-slide"><div class="error-message">Error loading products. Please try again later.</div></div>';
      swiperContainer.classList.remove('loading');
    }
  }

  function initCategoryFilters() {
    const categoryButtons = document.querySelectorAll('.category-button');
    
    if (!categoryButtons.length) {
      console.warn('Category buttons not found');
      return;
    }
    
    categoryButtons.forEach(button => {
      button.addEventListener('click', function() {
        const category = this.dataset.category;
        
        // Skip if already on this category
        if (category === currentCategory) return;
        
        // Update active state
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        // Update current category and regenerate cards
        currentCategory = category;
        generateProductCards(category);
      });
    });
  }

  function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    function isInViewport(element) {
      const rect = element.getBoundingClientRect();
      return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
        rect.bottom >= 0
      );
    }
    
    function handleScroll() {
      animatedElements.forEach(element => {
        if (isInViewport(element) && !element.classList.contains('visible')) {
          element.classList.add('visible');
        }
      });
    }
    
    // Initial check
    handleScroll();
    
    // Add scroll listener
    window.addEventListener('scroll', handleScroll);
  }

  // Fetch products with fallback data
  async function fetchProducts(category) {
    console.log(`Fetching products for category: ${category}`);
    
    try {
      const API_URL = `http://localhost:5000/api/products?category=${category}`;
      console.log(`Making API request to: ${API_URL}`);
      
      const response = await fetch(API_URL);
      
      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }
      
      const products = await response.json();
      console.log(`Successfully loaded ${products.length} products from API`);
      return products;
      
    } catch (error) {
      console.warn('Using fallback data:', error);
      
      // Return fallback data if API fails
      const fallbackData = {
        windows: [
          {
            title: "Window System",
            subtitle: "PANORAMA",
            imageUrl: "./images/W1.jpg"
          },
          {
            title: "Premium Glass",
            subtitle: "CLEARVIEW",
            imageUrl: "./images/W2.jpg"
          },
          {
            title: "Corner Window",
            subtitle: "SKYLINE",
            imageUrl: "./images/W3.jpg"
          }
        ],
        doors: [
          {
            title: "Door System",
            subtitle: "ELEGANCE",
            imageUrl: "./images/D1.jpg"
          },
          {
            title: "Sliding Door",
            subtitle: "HORIZON",
            imageUrl: "./images/D2.jpg"
          },
          {
            title: "Entry Door",
            subtitle: "PRESTIGE",
            imageUrl: "./images/D3.jpg"
          }
        ],
        signature: [
          {
            title: "Giana Design",
            subtitle: "MADEIRA",
            imageUrl: "./images/S1.jpg"
          },
          {
            title: "Lightrup",
            subtitle: "E4 CATHERINE",
            imageUrl: "./images/S2.jpg"
          },
          {
            title: "Signature Frame",
            subtitle: "TITANIUM",
            imageUrl: "./images/S3.jpg"
          }
        ],
        architectural: [
          {
            title: "Architectural",
            subtitle: "FACADE ELEMENT",
            imageUrl: "./images/A1.jpg"
          },
          {
            title: "Sun Control",
            subtitle: "SOLARIS",
            imageUrl: "./images/A2.jpg"
          },
          {
            title: "Glass Railings",
            subtitle: "SKYGUARD",
            imageUrl: "./images/A3.jpg"
          }
        ]
      };
      
      return fallbackData[category] || fallbackData.windows; // Default to windows if category not found
    }
  }

  // Fallback to show static products if Swiper fails
  function showFallbackProducts() {
    console.log("Using fallback product display");
    
    const productsContainer = document.querySelector(".products-container");
    if (!productsContainer) return;
    
    // Replace the entire swiper with a static grid
    const fallbackHTML = `
      <div class="products-fallback" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; margin: 0 auto;">
        <div class="product-card" style="background: #fff; border-radius: 10px; overflow: hidden; transition: all 0.3s; box-shadow: 0 5px 15px rgba(0,0,0,0.05);">
          <div class="product-image" style="height: 250px;">
            <img src="./images/W1.jpg" alt="Window System" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
          <div class="product-info" style="padding: 20px; text-align: center;">
            <h3 style="font-size: 1.5rem; margin: 0 0 5px;">Window System</h3>
            <p style="color: #666; margin: 0;">PANORAMA</p>
          </div>
        </div>
        <div class="product-card" style="background: #fff; border-radius: 10px; overflow: hidden; transition: all 0.3s; box-shadow: 0 5px 15px rgba(0,0,0,0.05);">
          <div class="product-image" style="height: 250px;">
            <img src="./images/W2.jpg" alt="Premium Glass" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
          <div class="product-info" style="padding: 20px; text-align: center;">
            <h3 style="font-size: 1.5rem; margin: 0 0 5px;">Premium Glass</h3>
            <p style="color: #666; margin: 0;">CLEARVIEW</p>
          </div>
        </div>
        <div class="product-card" style="background: #fff; border-radius: 10px; overflow: hidden; transition: all 0.3s; box-shadow: 0 5px 15px rgba(0,0,0,0.05);">
          <div class="product-image" style="height: 250px;">
            <img src="./images/W3.jpg" alt="Corner Window" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
          <div class="product-info" style="padding: 20px; text-align: center;">
            <h3 style="font-size: 1.5rem; margin: 0 0 5px;">Corner Window</h3>
            <p style="color: #666; margin: 0;">SKYLINE</p>
          </div>
        </div>
      </div>
    `;
    
    // Find and replace the swiper container
    const swiperContainer = document.querySelector(".products-swiper");
    if (swiperContainer) {
      const div = document.createElement('div');
      div.innerHTML = fallbackHTML;
      swiperContainer.parentNode.replaceChild(div.firstElementChild, swiperContainer);
    } else {
      // If no swiper container, just append to products container
      const div = document.createElement('div');
      div.innerHTML = fallbackHTML;
      productsContainer.appendChild(div.firstElementChild);
    }
    
    // Keep category buttons functional
    initCategoryFilters();
  }
});