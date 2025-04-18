// This is a modified version of the admin.js file to fix connection issues

// API Base URL and Authentication
const API_BASE_URL = "http://localhost:5000/api";

// Authentication API
const authAPI = {
  login: async (username, password) => {
    try {
      console.log("Attempting login for:", username);
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Invalid username or password");
      }

      const result = await response.json();
      console.log("Login successful");
      return result;
    } catch (error) {
      console.error("Login failed:", error.message);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "admin-login.html";
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },

  getToken: () => {
    return localStorage.getItem("token");
  },
};

// Gallery API
const galleryAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/gallery`, {
      headers: {
        "Authorization": `Bearer ${authAPI.getToken()}`
      }
    });
    if (!response.ok) throw new Error("Failed to fetch gallery items");
    return response.json();
  },
  
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/gallery/${id}`, {
      headers: {
        "Authorization": `Bearer ${authAPI.getToken()}`
      }
    });
    if (!response.ok) throw new Error("Failed to fetch gallery item");
    return response.json();
  },
  
  create: async (formData) => {
    const response = await fetch(`${API_BASE_URL}/gallery`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${authAPI.getToken()}`
      },
      body: formData // Don't set Content-Type, let browser set it with boundary
    });
    if (!response.ok) throw new Error("Failed to create gallery item");
    return response.json();
  },
  
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/gallery/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${authAPI.getToken()}`
      }
    });
    if (!response.ok) throw new Error("Failed to delete gallery item");
    return response.json();
  }
};

// Blog API
const blogAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/blog`);
    if (!response.ok) throw new Error("Failed to fetch blog posts");
    return response.json();
  },
  
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/blog/${id}`, {
      headers: {
        "Authorization": `Bearer ${authAPI.getToken()}`
      }
    });
    if (!response.ok) throw new Error("Failed to fetch blog post");
    return response.json();
  },
  
  create: async (formData) => {
    const response = await fetch(`${API_BASE_URL}/blog`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${authAPI.getToken()}`
      },
      body: formData // Don't set Content-Type, let browser set it with boundary
    });
    if (!response.ok) throw new Error("Failed to create blog post");
    return response.json();
  },
  
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/blog/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${authAPI.getToken()}`
      }
    });
    if (!response.ok) throw new Error("Failed to delete blog post");
    return response.json();
  }
};

// Products API
const productsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) throw new Error("Failed to fetch products");
    return response.json();
  },
  
  create: async (data) => {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${authAPI.getToken()}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error("Failed to create product");
    return response.json();
  },
  
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${authAPI.getToken()}`
      }
    });
    if (!response.ok) throw new Error("Failed to delete product");
    return response.json();
  }
};

// Check API health
async function checkAPIHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/test`);
    return { status: response.ok ? "online" : "offline" };
  } catch (error) {
    return { status: "offline", error: error.message };
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  // Check if user is authenticated
  if (!authAPI.isAuthenticated()) {
    window.location.href = "admin-login.html";
    return;
  }

  // Set current date
  const currentDateElement = document.getElementById("current-date");
  if (currentDateElement) {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    currentDateElement.textContent = new Date().toLocaleDateString(
      "en-US",
      options
    );
  }

  // Check API health first
  try {
    const apiStatus = await checkAPIHealth();
    console.log("API Status:", apiStatus);

    if (apiStatus.status === "offline") {
      // Show API connection error to user
      const dashboard = document.getElementById("dashboard");
      if (dashboard) {
        const errorAlert = document.createElement("div");
        errorAlert.className = "api-error-alert";
        errorAlert.innerHTML = `
          <strong>API Connection Error</strong>
          <p>${
            apiStatus.error ||
            "Unable to connect to the server. Please check if the server is running."
          }</p>
          <p>Server URL: ${API_BASE_URL}</p>
          <button id="retry-connection" class="retry-btn">Retry Connection</button>
        `;
        dashboard.insertBefore(errorAlert, dashboard.firstChild);

        // Add retry button listener
        document
          .getElementById("retry-connection")
          .addEventListener("click", () => {
            window.location.reload();
          });
      }

      // Continue with offline mode - initialize UI but disable data modifications
      console.log("Running in offline mode due to API connection failure");
    }
  } catch (error) {
    console.error("Error checking API health:", error);
  }

  // Initialize navigation
  initNavigation();

  // Initialize dashboard with error handling
  initDashboard().catch((error) => {
    console.error("Error initializing dashboard:", error);
    // Load empty placeholders if data couldn't be fetched
    loadPlaceholders();
  });

  // Initialize content sections
  initBlogManagement();
  initGalleryManagement();
  initProductManagement();

  // Logout functionality
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      authAPI.logout();
    });
  }
});

// Load placeholders for dashboard if data can't be fetched
function loadPlaceholders() {
  document.getElementById("blog-count").textContent = "?";
  document.getElementById("gallery-count").textContent = "?";
  document.getElementById("product-count").textContent = "?";

  const recentContentTable = document.getElementById("recent-content-table");
  if (recentContentTable) {
    recentContentTable.innerHTML =
      '<tr><td colspan="4" class="text-center">Could not load recent content. Server connection issue.</td></tr>';
  }
}

// Navigation functionality
function initNavigation() {
  const navLinks = document.querySelectorAll(".admin-nav a");
  const sections = document.querySelectorAll(".admin-section");

  navLinks.forEach((link) => {
    if (link.id === "logout-btn" || !link.getAttribute("data-section")) return;
    
    link.addEventListener("click", function (e) {
      e.preventDefault();
      console.log("Navigation clicked:", this.getAttribute("data-section"));

      // Remove active class from all links and sections
      navLinks.forEach((link) => link.classList.remove("active"));
      sections.forEach((section) => {
        section.style.display = "none";
        section.classList.remove("active");
      });

      // Add active class to clicked link
      this.classList.add("active");

      // Show the corresponding section
      const sectionId = this.getAttribute("data-section");
      if (sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
          section.style.display = "block";
          section.classList.add("active");
          console.log("Activated section:", sectionId);
        }
      }
    });
  });

  // Set initial active section
  const activeLink = document.querySelector(".admin-nav a.active");
  if (activeLink && activeLink.getAttribute("data-section")) {
    const initialSection = document.getElementById(activeLink.getAttribute("data-section"));
    if (initialSection) {
      sections.forEach(section => section.style.display = "none");
      initialSection.style.display = "block";
      initialSection.classList.add("active");
    }
  }
}

// Initialize dashboard with error handling and timeouts
async function initDashboard() {
  try {
    // Use Promise.allSettled instead of Promise.all to handle partial failures
    const results = await Promise.allSettled([
      fetchWithTimeout(blogAPI.getAll(), 5000),
      fetchWithTimeout(galleryAPI.getAll(), 5000),
      fetchWithTimeout(productsAPI.getAll(), 5000),
    ]);

    // Extract successful results
    const [blogsResult, galleryResult, productsResult] = results;

    // Update stats based on available data
    const blogs = blogsResult.status === "fulfilled" ? blogsResult.value : [];
    const gallery =
      galleryResult.status === "fulfilled" ? galleryResult.value : [];
    const products =
      productsResult.status === "fulfilled" ? productsResult.value : [];

    // Update counts
    updateCounts(blogs.length, gallery.length, products.length);

    // Load recent content if any data is available
    const allItems = [
      ...blogs.map((item) => ({ ...item, type: "Blog" })),
      ...gallery.map((item) => ({ ...item, type: "Gallery" })),
      ...products.map((item) => ({ ...item, type: "Product" })),
    ];

    if (allItems.length > 0) {
      loadRecentContent(allItems);
    } else {
      // If no data at all, show offline message
      const tbody = document.getElementById("recent-content-table");
      if (tbody) {
        tbody.innerHTML =
          '<tr><td colspan="4" class="text-center">No content available or unable to fetch data from server.</td></tr>';
      }
    }
  } catch (error) {
    console.error("Dashboard initialization error:", error);
    throw error; // Re-throw so the caller can handle it
  }
}

// Helper function to fetch with timeout
function fetchWithTimeout(promise, timeout) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), timeout)
    ),
  ]);
}

// Update dashboard counts
function updateCounts(blogCount, galleryCount, productCount) {
  const blogCountElement = document.getElementById("blog-count");
  const galleryCountElement = document.getElementById("gallery-count");
  const productCountElement = document.getElementById("product-count");

  if (blogCountElement) blogCountElement.textContent = blogCount;
  if (galleryCountElement) galleryCountElement.textContent = galleryCount;
  if (productCountElement) productCountElement.textContent = productCount;
}

// Load recent content with error handling
function loadRecentContent(items) {
  const tbody = document.getElementById("recent-content-table");
  if (!tbody) return;

  try {
    // Sort by date (newest first) and take only 5 most recent
    const recentItems = items
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    if (recentItems.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="4" class="text-center">No recent content available.</td></tr>';
      return;
    }

    tbody.innerHTML = recentItems
      .map((item) => {
        const date = new Date(item.createdAt).toLocaleDateString();
        const contentType = item.type;
        const editFunction = `handle${contentType}Edit`;

        return `
        <tr>
          <td>${item.title}</td>
          <td>${contentType}</td>
          <td>${date}</td>
          <td>
            <div class="action-buttons">
              <button class="action-btn edit" onclick="${editFunction}('${item._id}')">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                </svg>
              </button>
            </div>
          </td>
        </tr>
      `;
      })
      .join("");
  } catch (error) {
    console.error("Error rendering recent content:", error);
    tbody.innerHTML =
      '<tr><td colspan="4" class="text-center">Error displaying recent content.</td></tr>';
  }
}

// Initialize Blog Management
function initBlogManagement() {
  const addBlogBtn = document.getElementById("add-blog-btn");
  const blogForm = document.getElementById("blog-post-form");

  // Load existing blog posts with error handling
  loadBlogPosts().catch((error) => {
    console.error("Error loading blog posts:", error);
    const tbody = document.getElementById("blog-table");
    if (tbody) {
      tbody.innerHTML = '<tr><td colspan="5" class="text-center">Error loading blog posts. Please check console for details.</td></tr>';
    }
  });

  // Add new blog post
  if (addBlogBtn) {
    addBlogBtn.addEventListener("click", () => {
      resetBlogForm();
      // Show form by scrolling to it
      blogForm.scrollIntoView({ behavior: "smooth" });
    });
  }

  // Handle form submission
  if (blogForm) {
    blogForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      try {
        const formData = new FormData(blogForm);
        const blogId = document.getElementById("blog-id").value;

        // Log form data for debugging
        console.log("Form data:");
        for (let [key, value] of formData.entries()) {
          console.log(`${key}: ${value}`);
        }

        // Convert isPublished to boolean
        const isPublished = formData.get('isPublished') === 'published';
        formData.set('isPublished', isPublished ? 'true' : 'false');

        let response;
        if (blogId) {
          // Handle update
          formData.append('id', blogId);
          response = await fetch(`${API_BASE_URL}/blog/${blogId}`, {
            method: 'PUT',
            headers: {
              "Authorization": `Bearer ${authAPI.getToken()}`
            },
            body: formData
          });
        } else {
          // Handle create - use fetch directly for more control
          response = await fetch(`${API_BASE_URL}/blog`, {
            method: 'POST',
            headers: {
              "Authorization": `Bearer ${authAPI.getToken()}`
            },
            body: formData
          });
        }

        // Check for error responses
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
          throw new Error(errorData.message || `Failed with status: ${response.status}`);
        }

        // Reset form and reload posts
        resetBlogForm();
        await loadBlogPosts();
        await initDashboard();

        alert(blogId ? "Blog post updated successfully!" : "Blog post created successfully!");
      } catch (error) {
        console.error("Error saving blog post:", error);
        alert("Error saving blog post: " + (error.message || "Server connection issue"));
      }
    });
  }

  // Cancel button for blog form
  const cancelBtn = blogForm && blogForm.querySelector(".cancel-btn");
  if (cancelBtn) {
    cancelBtn.addEventListener("click", (e) => {
      e.preventDefault();
      resetBlogForm();
    });
  }

  // Image preview for blog
  const blogImageInput = document.getElementById("blog-featured-image");
  const blogImagePreview = document.getElementById("blog-image-preview");

  if (blogImageInput && blogImagePreview) {
    blogImageInput.addEventListener("change", function () {
      if (this.files && this.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
          blogImagePreview.src = e.target.result;
          blogImagePreview.style.display = "block";
        };
        reader.readAsDataURL(this.files[0]);
      }
    });
  }
}

// Load blog posts with error handling
async function loadBlogPosts() {
  try {
    const blogs = await blogAPI.getAll();
    const tbody = document.getElementById("blog-table");

    if (!tbody) return;

    if (blogs.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="5" class="text-center">No blog posts found</td></tr>';
      return;
    }

    tbody.innerHTML = blogs
      .map((blog) => {
        const date = new Date(blog.createdAt).toLocaleDateString();
        const status = blog.isPublished ? "published" : "draft";

        return `
        <tr>
          <td>${blog.title}</td>
          <td>${blog.category || "Uncategorized"}</td>
          <td>${date}</td>
          <td><span class="status-badge ${status}">${status}</span></td>
          <td>
            <div class="action-buttons">
              <button class="action-btn edit" onclick="handleEditBlog('${
                blog._id
              }')">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                </svg>
              </button>
              <button class="action-btn delete" onclick="handleDeleteBlog('${
                blog._id
              }')">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </td>
        </tr>
      `;
      })
      .join("");
  } catch (error) {
    console.error("Error loading blog posts:", error);
    throw error; // Re-throw for caller handling
  }
}

// Reset blog form
function resetBlogForm() {
  const form = document.getElementById("blog-post-form");
  if (!form) return;

  form.reset();
  document.getElementById("blog-id").value = "";
  document.getElementById("blog-image-preview").style.display = "none";
  document.getElementById("blog-image-preview").src = "";

  // Scroll back to blog list
  document
    .querySelector('[data-section="blog-manage"]')
    .scrollIntoView({ behavior: "smooth" });
}

// Gallery Management initialization
function initGalleryManagement() {
  const addGalleryBtn = document.getElementById("add-gallery-btn");
  const galleryForm = document.getElementById("gallery-item-form");
  const formContainer = document.getElementById("gallery-form-container");

  // Load existing gallery items with error handling
  loadGalleryItems().catch((error) => {
    console.error("Error loading gallery items:", error);
    const grid = document.getElementById("admin-gallery-grid");
    if (grid) {
      grid.innerHTML = '<div class="error-message">Error loading gallery items. Please check console for details.</div>';
    }
  });

  // Add new gallery item
  if (addGalleryBtn) {
    addGalleryBtn.addEventListener("click", () => {
      resetGalleryForm();
      if (formContainer) formContainer.style.display = "block";
    });
  }

  // Handle form submission
  if (galleryForm) {
    galleryForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      try {
        const formData = new FormData(galleryForm);
        const galleryId = document.getElementById("gallery-id").value;

        // Validate required fields
        const title = formData.get('title');
        const category = formData.get('category');
        const image = formData.get('image');

        if (!title || !category) {
          throw new Error('Title and category are required fields');
        }

        if (!galleryId && !image) {
          throw new Error('Image is required for new gallery items');
        }

        // Log form data for debugging
        console.log("Gallery form data:");
        for (let [key, value] of formData.entries()) {
          console.log(`${key}: ${value}`);
        }

        // Convert isFeatured to boolean string
        const isFeatured = formData.get('isFeatured') === 'on';
        formData.set('isFeatured', String(isFeatured));

        let response;
        if (galleryId) {
          // Handle update
          response = await fetch(`${API_BASE_URL}/gallery/${galleryId}`, {
            method: 'PUT',
            headers: {
              "Authorization": `Bearer ${authAPI.getToken()}`
            },
            body: formData
          });
        } else {
          // Handle create
          response = await fetch(`${API_BASE_URL}/gallery`, {
            method: 'POST',
            headers: {
              "Authorization": `Bearer ${authAPI.getToken()}`
            },
            body: formData
          });
        }

        // Check for error responses
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
          throw new Error(errorData.message || `Server error: ${response.status}`);
        }

        const result = await response.json();
        console.log("Gallery save result:", result);

        // Reset and hide form
        resetGalleryForm();
        if (formContainer) formContainer.style.display = "none";

        // Reload data
        await loadGalleryItems();
        await initDashboard();

        alert(galleryId ? "Gallery item updated successfully!" : "Gallery item created successfully!");
      } catch (error) {
        console.error("Error saving gallery item:", error);
        alert("Error saving gallery item: " + (error.message || "Server connection issue"));
      }
    });
  }

  // Close form button
  const closeFormBtn = formContainer && formContainer.querySelector(".close-form-btn");
  if (closeFormBtn) {
    closeFormBtn.addEventListener("click", () => {
      formContainer.style.display = "none";
    });
  }

  // Cancel button
  const cancelBtn = galleryForm && galleryForm.querySelector(".cancel-btn");
  if (cancelBtn) {
    cancelBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (formContainer) formContainer.style.display = "none";
    });
  }

  // Image preview for gallery
  const galleryImageInput = document.getElementById("gallery-image");
  const galleryImagePreview = document.getElementById("gallery-image-preview");

  if (galleryImageInput && galleryImagePreview) {
    galleryImageInput.addEventListener("change", function () {
      if (this.files && this.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
          galleryImagePreview.src = e.target.result;
          galleryImagePreview.style.display = "block";
        };
        reader.readAsDataURL(this.files[0]);
      }
    });
  }
}

// Load gallery items with error handling
async function loadGalleryItems() {
  try {
    const gallery = await galleryAPI.getAll();
    const grid = document.getElementById("admin-gallery-grid");

    if (!grid) return;

    if (!gallery || gallery.length === 0) {
      grid.innerHTML = '<div class="no-items">No gallery items found</div>';
      return;
    }

    grid.innerHTML = gallery
      .map(
        (item) => `
      <div class="gallery-item">
        <div class="gallery-item-image">
          <img src="${item.imageUrl}" alt="${item.title}" onerror="this.src='./images/fallback.jpg'">
        </div>
        <div class="gallery-item-content">
          <h3 class="gallery-item-title">${item.title}</h3>
          <p class="gallery-item-description">${item.description || ""}</p>
          <p class="gallery-item-category">${item.category}</p>
          <div class="gallery-item-actions">
            <button class="action-btn edit" onclick="handleEditGallery('${item._id}')">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
              </svg>
            </button>
            <button class="action-btn delete" onclick="handleDeleteGallery('${item._id}')">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </div>
        ${item.isFeatured ? '<div class="gallery-item-badge">Featured</div>' : ''}
      </div>
    `
      )
      .join("");
  } catch (error) {
    console.error("Error loading gallery items:", error);
    throw error;
  }
}

// Reset gallery form
function resetGalleryForm() {
  const form = document.getElementById("gallery-item-form");
  if (!form) return;

  form.reset();
  document.getElementById("gallery-id").value = "";
  document.getElementById("gallery-image-preview").style.display = "none";
  document.getElementById("gallery-image-preview").src = "";

  const formTitle = document.getElementById("gallery-form-title");
  if (formTitle) formTitle.textContent = "Add New Gallery Item";
}

// Products Management
function initProductManagement() {
  const addProductBtn = document.getElementById("add-product-btn");
  const productForm = document.getElementById("product-form");
  const productFormContainer = document.getElementById(
    "product-form-container"
  );

  // Load existing products with error handling
  loadProducts().catch((error) => {
    console.error("Error loading products:", error);
    const tbody = document.getElementById("products-table");
    if (tbody) {
      tbody.innerHTML =
        '<tr><td colspan="5" class="text-center">Error loading products. Server connection issue.</td></tr>';
    }
  });

  // Add new product
  if (addProductBtn) {
    addProductBtn.addEventListener("click", () => {
      if (productForm) {
        resetProductForm();
        // Show the form
        if (productFormContainer) productFormContainer.style.display = "block";
      }
    });
  }

  // Handle form submission
  if (productForm) {
    productForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(productForm);
      const productId = document.getElementById("product-id").value;

      try {
        if (productId) {
          await productsAPI.update(productId, formData);
        } else {
          await productsAPI.create(formData);
        }

        // Reset and hide form
        resetProductForm();
        if (productFormContainer) productFormContainer.style.display = "none";

        // Reload products and dashboard
        await loadProducts();
        await initDashboard();

        alert(
          productId
            ? "Product updated successfully!"
            : "Product created successfully!"
        );
      } catch (error) {
        console.error("Error saving product:", error);
        alert(
          "Error saving product: " +
            (error.message || "Server connection issue")
        );
      }
    });
  }

  // Close form button
  const closeFormBtn =
    productFormContainer &&
    productFormContainer.querySelector(".close-form-btn");
  if (closeFormBtn) {
    closeFormBtn.addEventListener("click", () => {
      productFormContainer.style.display = "none";
    });
  }

  // Cancel button
  const cancelBtn = productForm && productForm.querySelector(".cancel-btn");
  if (cancelBtn) {
    cancelBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (productFormContainer) productFormContainer.style.display = "none";
    });
  }

  // Image preview
  const productImageInput = document.getElementById("product-image");
  const productImagePreview = document.getElementById("product-image-preview");

  if (productImageInput && productImagePreview) {
    productImageInput.addEventListener("change", function () {
      if (this.files && this.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
          productImagePreview.src = e.target.result;
          productImagePreview.style.display = "block";
        };
        reader.readAsDataURL(this.files[0]);
      }
    });
  }
}

// Reset product form
function resetProductForm() {
  const form = document.getElementById("product-form");
  if (!form) return;

  form.reset();

  // Reset the hidden ID field
  const productIdInput = document.getElementById("product-id");
  if (productIdInput) productIdInput.value = "";

  // Reset the image preview
  const imagePreview = document.getElementById("product-image-preview");
  if (imagePreview) {
    imagePreview.style.display = "none";
    imagePreview.src = "";
  }

  // Update form title
  const formTitle = document.getElementById("product-form-title");
  if (formTitle) formTitle.textContent = "Add New Product";
}

// Load products with error handling
async function loadProducts() {
  try {
    const products = await productsAPI.getAll();
    const tbody = document.getElementById("products-table");

    if (!tbody) return;

    if (products.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="5" class="text-center">No products found</td></tr>';
      return;
    }

    tbody.innerHTML = products
      .map(
        (product) => `
      <tr>
        <td><img src="${product.imageUrl}" alt="${
          product.title
        }" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;" onerror="this.src='./images/fallback.jpg'"></td>
        <td>${product.title}<br><small>${product.subtitle || ""}</small></td>
        <td>${getCategoryName(product.category)}</td>
        <td>${
          product.featured
            ? '<span class="status-badge featured">Featured</span>'
            : ""
        }</td>
        <td>
          <div class="action-buttons">
            <button class="action-btn edit" onclick="handleEditProduct('${
              product._id
            }')">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
              </svg>
            </button>
            <button class="action-btn delete" onclick="handleDeleteProduct('${
              product._id
            }')">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </td>
      </tr>
    `
      )
      .join("");
  } catch (error) {
    console.error("Error loading products:", error);
    throw error; // Re-throw for caller handling
  }
}

function getCategoryName(category) {
  const categories = {
    windows: "Windows & Glass",
    doors: "Door Systems",
    signature: "Signature Series",
    architectural: "Architectural Elements",
  };

  return categories[category] || category;
}

// Handle functions for global scope
window.handleEditBlog = async (id) => {
  try {
    const blog = await blogAPI.getById(id);
    const form = document.getElementById("blog-post-form");

    if (!form) return;

    // Set form values
    document.getElementById("blog-id").value = id;
    document.getElementById("blog-title").value = blog.title || "";
    document.getElementById("blog-content").value = blog.content || "";
    document.getElementById("blog-author").value = blog.author || "";

    // For category and status, check if elements exist first
    const categoryField = document.getElementById("blog-category");
    if (categoryField) categoryField.value = blog.category || "";

    const statusField = document.getElementById("blog-status");
    if (statusField)
      statusField.value = blog.isPublished ? "published" : "draft";

    // Handle image preview
    if (blog.imageUrl) {
      const preview = document.getElementById("blog-image-preview");
      if (preview) {
        preview.src = blog.imageUrl;
        preview.style.display = "block";
      }
    }

    // Scroll to form
    form.scrollIntoView({ behavior: "smooth" });
  } catch (error) {
    console.error("Error loading blog post:", error);
    alert(
      "Error loading blog post: " + (error.message || "Server connection issue")
    );
  }
};

window.handleDeleteBlog = async (id) => {
  if (confirm("Are you sure you want to delete this blog post?")) {
    try {
      await blogAPI.delete(id);
      await loadBlogPosts();
      await initDashboard();
      alert("Blog post deleted successfully!");
    } catch (error) {
      console.error("Error deleting blog post:", error);
      alert(
        "Error deleting blog post: " +
          (error.message || "Server connection issue")
      );
    }
  }
};

window.handleEditGallery = async (id) => {
  try {
    const gallery = await galleryAPI.getById(id);
    const form = document.getElementById("gallery-item-form");
    const formContainer = document.getElementById("gallery-form-container");

    if (!form || !formContainer) return;

    // Set form values
    document.getElementById("gallery-id").value = id;
    document.getElementById("gallery-title").value = gallery.title || "";

    // Optional fields
    const subtitleField = document.getElementById("gallery-subtitle");
    if (subtitleField) subtitleField.value = gallery.subtitle || "";

    const descriptionField = document.getElementById("gallery-description");
    if (descriptionField) descriptionField.value = gallery.description || "";

    const categoryField = document.getElementById("gallery-category");
    if (categoryField) categoryField.value = gallery.category || "";

    const featuredField = document.getElementById("gallery-featured");
    if (featuredField) featuredField.checked = gallery.isFeatured || false;

    // Image preview
    if (gallery.imageUrl) {
      const preview = document.getElementById("gallery-image-preview");
      if (preview) {
        preview.src = gallery.imageUrl;
        preview.style.display = "block";
      }
    }

    // Update form title and show
    document.getElementById("gallery-form-title").textContent =
      "Edit Gallery Item";
    formContainer.style.display = "block";
  } catch (error) {
    console.error("Error loading gallery item:", error);
    alert(
      "Error loading gallery item: " +
        (error.message || "Server connection issue")
    );
  }
};

window.handleDeleteGallery = async (id) => {
  if (confirm("Are you sure you want to delete this gallery item?")) {
    try {
      await galleryAPI.delete(id);
      await loadGalleryItems();
      await initDashboard();
      alert("Gallery item deleted successfully!");
    } catch (error) {
      console.error("Error deleting gallery item:", error);
      alert(
        "Error deleting gallery item: " +
          (error.message || "Server connection issue")
      );
    }
  }
};

window.handleEditProduct = async (id) => {
  try {
    const product = await productsAPI.getById(id);
    const form = document.getElementById("product-form");
    const formContainer = document.getElementById("product-form-container");

    if (!form || !formContainer) {
      console.error("Product form or container not found");
      return;
    }

    // Set form values
    document.getElementById("product-id").value = id;

    const titleInput = document.getElementById("product-title");
    if (titleInput) titleInput.value = product.title || "";

    const subtitleInput = document.getElementById("product-subtitle");
    if (subtitleInput) subtitleInput.value = product.subtitle || "";

    const descriptionInput = document.getElementById("product-description");
    if (descriptionInput) descriptionInput.value = product.description || "";

    const categoryInput = document.getElementById("product-category");
    if (categoryInput) categoryInput.value = product.category || "";

    const featuredInput = document.getElementById("product-featured");
    if (featuredInput) featuredInput.checked = product.featured || false;

    const orderInput = document.getElementById("product-order");
    if (orderInput) orderInput.value = product.order || 0;

    // Handle image preview
    if (product.imageUrl) {
      const preview = document.getElementById("product-image-preview");
      if (preview) {
        preview.src = product.imageUrl;
        preview.style.display = "block";
      }
    }

    // Update form title
    const formTitle = document.getElementById("product-form-title");
    if (formTitle) formTitle.textContent = "Edit Product";

    // Show the form
    formContainer.style.display = "block";
  } catch (error) {
    console.error("Error loading product:", error);
    alert(
      "Error loading product: " + (error.message || "Server connection issue")
    );
  }
};

window.handleDeleteProduct = async (id) => {
  if (confirm("Are you sure you want to delete this product?")) {
    try {
      await productsAPI.delete(id);
      await loadProducts();
      await initDashboard();
      alert("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert(
        "Error deleting product: " +
          (error.message || "Server connection issue")
      );
    }
  }
};
