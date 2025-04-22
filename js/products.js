document.addEventListener('DOMContentLoaded', async function() {
  // API Base URL
  const API_BASE_URL = 'http://localhost:5000/api';
  
  // Default category and state
  let currentCategory = 'windows';
  let currentPage = 0;
  const productsPerPage = 3;
  let products = [];
  
  // Get DOM elements
  const sliderTrack = document.getElementById('sliderTrack');
  const paginationDots = document.getElementById('paginationDots');
  const prevButton = document.getElementById('prevSlide');
  const nextButton = document.getElementById('nextSlide');
  const filterButtons = document.querySelectorAll('.filter-button');
  
  // Function to fetch products from API
  async function fetchProducts(category = '') {
    try {
      const url = category 
        ? `${API_BASE_URL}/products?category=${category}`
        : `${API_BASE_URL}/products`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch products');
      return await response.json();
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }
  
  // Function to create product card
  function createProductCard(product) {
    return `
      <div class="product-slide">
        <div class="product-card">
          <div class="product-image">
            <img src="${product.imageUrl}" alt="${product.title}">
          </div>
          <div class="product-info">
            <h3>${product.title}</h3>
            <p>${product.description || ''}</p>
            ${product.subtitle ? `<p class="subtitle">${product.subtitle}</p>` : ''}
          </div>
        </div>
      </div>
    `;
  }
  
  // Function to initialize products slider
  async function initProductsSlider() {
    // Fetch initial products
    products = await fetchProducts(currentCategory);
    
    // Update the slider with fetched products
    updateSlider();
    
    // Add event listeners
    if (prevButton) prevButton.addEventListener('click', prevSlide);
    if (nextButton) nextButton.addEventListener('click', nextSlide);
    
    // Add filter button listeners
    filterButtons.forEach(button => {
      button.addEventListener('click', async () => {
        const category = button.getAttribute('data-category');
        await changeCategory(category);
        
        // Update active state of filter buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
      });
    });
  }
  
  // Function to update slider
  function updateSlider() {
    if (!products.length) {
      sliderTrack.innerHTML = '<div class="no-products">No products found in this category</div>';
      if (paginationDots) paginationDots.innerHTML = '';
      return;
    }
    
    const totalPages = Math.ceil(products.length / productsPerPage);
    const start = currentPage * productsPerPage;
    const end = start + productsPerPage;
    const currentProducts = products.slice(start, end);
    
    // Update slider track
    sliderTrack.innerHTML = currentProducts.map(createProductCard).join('');
    
    // Update pagination dots
    if (paginationDots) {
      paginationDots.innerHTML = Array(totalPages)
        .fill()
        .map((_, i) => `
          <button class="pagination-dot ${i === currentPage ? 'active' : ''}" 
                  onclick="goToPage(${i})"></button>
        `)
        .join('');
    }
    
    // Update button states
    if (prevButton) prevButton.disabled = currentPage === 0;
    if (nextButton) nextButton.disabled = currentPage === totalPages - 1;
  }
  
  // Function to go to specific page
  function goToPage(page) {
    currentPage = page;
    updateSlider();
  }
  
  // Function to go to next slide
  function nextSlide() {
    const totalPages = Math.ceil(products.length / productsPerPage);
    if (currentPage < totalPages - 1) {
      currentPage++;
      updateSlider();
    }
  }
  
  // Function to go to previous slide
  function prevSlide() {
    if (currentPage > 0) {
      currentPage--;
      updateSlider();
    }
  }
  
  // Function to change category
  async function changeCategory(category) {
    currentCategory = category;
    currentPage = 0;
    products = await fetchProducts(category);
    updateSlider();
  }
  
  // Make goToPage available globally
  window.goToPage = goToPage;
  
  // Initialize the slider
  initProductsSlider();
});