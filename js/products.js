/**
 * Odaville Website - Products Section with Category Filtering
 * Fixed version with reliable Swiper initialization
 */

document.addEventListener("DOMContentLoaded", function () {
  console.log("Products.js loaded - Fixed version");

  // First check if we have products section on the page
  const productsSection = document.querySelector(".products-section");
  if (!productsSection) {
    console.log(
      "No products section found on this page, skipping initialization"
    );
    return;
  }

  // Variables for storing state
  let productSwiper;
  let currentCategory = "windows";

  // Make sure Swiper is available directly rather than dynamically loading it
  function initializeProducts() {
    console.log("Initializing products section");

    // Check if Swiper is already available
    if (typeof Swiper === "undefined") {
      console.error(
        "Swiper is not available! Please check Swiper script inclusion in HTML."
      );
      showFallbackProducts();
      return;
    }

    // Generate initial products for default category
    generateProductCards(currentCategory);

    // Add navigation buttons
    addProductNavigation();

    // Initialize category filtering
    initCategoryFilters();

    // Add scroll animations
    initScrollAnimations();
  }

  // Fallback to show static products if Swiper fails
  function showFallbackProducts() {
    console.log("Using fallback product display");
    const swiperWrapper = document.querySelector(
      ".products-swiper .swiper-wrapper"
    );
    if (!swiperWrapper) return;

    // Clear loading state
    const swiperContainer = document.querySelector(".products-swiper");
    if (swiperContainer) {
      swiperContainer.classList.remove("loading");
    }

    // Add static fallback products
    swiperWrapper.innerHTML = `
      <div class="swiper-slide">
        <div class="product-card">
          <div class="product-image">
            <img src="./images/W1.jpg" alt="Window System">
          </div>
          <div class="product-info">
            <h3>Window System</h3>
            <p>PANORAMA</p>
          </div>
        </div>
      </div>
      <div class="swiper-slide">
        <div class="product-card">
          <div class="product-image">
            <img src="./images/W2.jpg" alt="Premium Glass">
          </div>
          <div class="product-info">
            <h3>Premium Glass</h3>
            <p>CLEARVIEW</p>
          </div>
        </div>
      </div>
      <div class="swiper-slide">
        <div class="product-card">
          <div class="product-image">
            <img src="./images/W3.jpg" alt="Corner Window">
          </div>
          <div class="product-info">
            <h3>Corner Window</h3>
            <p>SKYLINE</p>
          </div>
        </div>
      </div>
    `;
  }

  // Function to fetch products from API with fallback
  async function fetchProducts(category) {
    try {
      // First try to get from API
      const response = await fetch(
        `http://localhost:5000/api/products?category=${category}`
      );

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }

      const products = await response.json();
      console.log(`Fetched ${products.length} ${category} products from API`);
      return products;
    } catch (error) {
      console.warn(
        "Error fetching products from API, using fallback data:",
        error
      );

      // Fallback data if API call fails
      const fallbackData = {
        windows: [
          {
            title: "Window System",
            subtitle: "PANORAMA",
            imageUrl: "./images/W1.jpg",
            category: "windows",
          },
          {
            title: "Premium Glass",
            subtitle: "CLEARVIEW",
            imageUrl: "./images/W2.jpg",
            category: "windows",
          },
          {
            title: "Corner Window",
            subtitle: "SKYLINE",
            imageUrl: "./images/W3.jpg",
            category: "windows",
          },
        ],
        doors: [
          {
            title: "Door System",
            subtitle: "ELEGANCE",
            imageUrl: "./images/D1.jpg",
            category: "doors",
          },
          {
            title: "Sliding Door",
            subtitle: "HORIZON",
            imageUrl: "./images/D2.jpg",
            category: "doors",
          },
          {
            title: "Entry Door",
            subtitle: "PRESTIGE",
            imageUrl: "./images/D3.jpg",
            category: "doors",
          },
        ],
        signature: [
          {
            title: "Giana Design",
            subtitle: "MADEIRA",
            imageUrl: "./images/S1.jpg",
            category: "signature",
          },
          {
            title: "Lightrup",
            subtitle: "E4 CATHERINE",
            imageUrl: "./images/S2.jpg",
            category: "signature",
          },
          {
            title: "Signature Frame",
            subtitle: "TITANIUM",
            imageUrl: "./images/S3.jpg",
            category: "signature",
          },
        ],
        architectural: [
          {
            title: "Architectural",
            subtitle: "FACADE ELEMENT",
            imageUrl: "./images/A1.jpg",
            category: "architectural",
          },
          {
            title: "Sun Control",
            subtitle: "SOLARIS",
            imageUrl: "./images/A2.jpg",
            category: "architectural",
          },
          {
            title: "Glass Railings",
            subtitle: "SKYGUARD",
            imageUrl: "./images/A3.jpg",
            category: "architectural",
          },
        ],
      };
      return fallbackData[category] || fallbackData.windows;
    }
  }

  // Function to initialize Swiper
  function initSwiper() {
    console.log("Initializing product swiper");

    // Destroy existing swiper instance if it exists
    if (productSwiper && typeof productSwiper.destroy === "function") {
      productSwiper.destroy(true, true);
    }

    const swiperContainer = document.querySelector(".products-swiper");
    if (!swiperContainer) {
      console.warn("Swiper container not found!");
      return;
    }

    // Create navigation arrows if they don't exist
    if (!swiperContainer.querySelector(".swiper-button-next")) {
      const nextButton = document.createElement("div");
      nextButton.className = "swiper-button-next";
      swiperContainer.appendChild(nextButton);
    }

    if (!swiperContainer.querySelector(".swiper-button-prev")) {
      const prevButton = document.createElement("div");
      prevButton.className = "swiper-button-prev";
      swiperContainer.appendChild(prevButton);
    }

    try {
      productSwiper = new Swiper(".products-swiper", {
        slidesPerView: "auto",
        spaceBetween: 30,
        centeredSlides: true,
        loop: true,
        grabCursor: true,
        speed: 600,
        autoplay: false,

        // Navigation arrows
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },

        // Responsive breakpoints
        breakpoints: {
          320: {
            slidesPerView: 1.2,
            spaceBetween: 20,
          },
          480: {
            slidesPerView: 1.5,
            spaceBetween: 30,
          },
          768: {
            slidesPerView: 1.8,
            spaceBetween: 40,
          },
          992: {
            slidesPerView: 2.2,
            spaceBetween: 50,
          },
          1200: {
            slidesPerView: 2.5,
            spaceBetween: 60,
          },
        },
      });

      console.log("Swiper initialized successfully");
    } catch (error) {
      console.error("Error initializing Swiper:", error);
      showFallbackProducts();
    }
  }

  // Function to generate product cards
  async function generateProductCards(category) {
    console.log(`Generating product cards for category: ${category}`);

    const swiperWrapper = document.querySelector(
      ".products-swiper .swiper-wrapper"
    );

    if (!swiperWrapper) {
      console.warn("Swiper wrapper element not found!");
      return;
    }

    // Show loading state
    const swiperContainer = document.querySelector(".products-swiper");
    if (swiperContainer) {
      swiperContainer.classList.add("loading");
    }

    // Clear existing slides
    swiperWrapper.innerHTML = "";

    try {
      // Fetch products from database/API
      const products = await fetchProducts(category);

      if (!products || products.length === 0) {
        console.warn(`No products found for category: ${category}`);
        swiperWrapper.innerHTML =
          '<div class="no-products">No products found for this category.</div>';

        if (swiperContainer) {
          swiperContainer.classList.remove("loading");
        }
        return;
      }

      // Create new slides based on the products data
      products.forEach((product) => {
        const slide = document.createElement("div");
        slide.className = "swiper-slide";
        slide.dataset.category = product.category;

        // Use imageUrl if available (from database) or fallback to image property
        const imageSource =
          product.imageUrl || product.image || "./images/fallback.jpg";

        slide.innerHTML = `
          <div class="product-card">
              <div class="product-image">
                  <img src="${imageSource}" alt="${product.title} ${
          product.subtitle || ""
        }" 
                       onerror="this.onerror=null; this.src='./images/fallback.jpg';">
              </div>
              <div class="product-info">
                  <h3>${product.title}</h3>
                  <p>${product.subtitle || ""}</p>
              </div>
          </div>
        `;

        swiperWrapper.appendChild(slide);
      });

      // Remove loading state
      if (swiperContainer) {
        swiperContainer.classList.remove("loading");
      }

      // Initialize the swiper
      initSwiper();
    } catch (error) {
      console.error("Error generating product cards:", error);
      showFallbackProducts();
    }
  }

  // Function to add custom navigation buttons
  function addProductNavigation() {
    // Check if navigation already exists
    if (
      document.querySelector("#prev-product") &&
      document.querySelector("#next-product")
    ) {
      console.log("Product navigation buttons already exist");
      attachNavigationEvents();
      return;
    }

    console.log("Adding product navigation buttons");

    // Add navigation buttons to DOM if needed
    const prevBtn = document.getElementById("prev-product");
    const nextBtn = document.getElementById("next-product");

    if (!prevBtn || !nextBtn) {
      console.log("Navigation buttons not found, functionality may be limited");
    }

    attachNavigationEvents();
  }

  // Attach events to navigation buttons
  function attachNavigationEvents() {
    const prevBtn = document.getElementById("prev-product");
    const nextBtn = document.getElementById("next-product");

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        if (productSwiper) {
          productSwiper.slidePrev();
          console.log("Previous slide triggered");
        } else {
          console.warn("Swiper instance not available for navigation");
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        if (productSwiper) {
          productSwiper.slideNext();
          console.log("Next slide triggered");
        } else {
          console.warn("Swiper instance not available for navigation");
        }
      });
    }
  }

  // Function to initialize category filtering
  function initCategoryFilters() {
    const categoryButtons = document.querySelectorAll(".category-button");

    if (categoryButtons.length === 0) {
      console.warn("No category buttons found!");
    } else {
      console.log(`Found ${categoryButtons.length} category buttons`);

      // Set initial active category
      categoryButtons.forEach((btn) => {
        if (btn.getAttribute("data-category") === currentCategory) {
          btn.classList.add("active");
        } else {
          btn.classList.remove("active");
        }
      });

      // Add click event listeners
      categoryButtons.forEach((button) => {
        button.addEventListener("click", function () {
          // Remove active class from all buttons
          categoryButtons.forEach((btn) => {
            btn.classList.remove("active");
          });

          // Add active class to clicked button
          this.classList.add("active");

          // Get the category data attribute
          const category = this.getAttribute("data-category");

          // Update current category
          currentCategory = category;

          // Show loading state
          const swiperContainer = document.querySelector(".products-swiper");
          if (swiperContainer) {
            swiperContainer.classList.add("loading");
          }

          // Generate new products with a slight delay for transition effect
          setTimeout(() => {
            generateProductCards(category);
            console.log(`Switched to category: ${category}`);
          }, 300);
        });
      });
    }
  }

  // Function for scroll animations
  function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
      ".products-section .animate-on-scroll"
    );

    function isInViewport(element) {
      if (!element) return false;
      const rect = element.getBoundingClientRect();
      return (
        rect.top <=
          (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
        rect.bottom >= 0
      );
    }

    function handleScroll() {
      animatedElements.forEach((element) => {
        if (isInViewport(element) && !element.classList.contains("visible")) {
          element.classList.add("visible");
        }
      });
    }

    // Listen for scroll events
    window.addEventListener("scroll", handleScroll);

    // Check on page load
    handleScroll();
  }

  // Start the products initialization
  initializeProducts();
});
