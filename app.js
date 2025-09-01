const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});

 // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        this.logout();
      });
    }
  }

  simulateOAuthLogin(provider, button) {
    const providerName = provider === 'google' ? 'Google' : 'Apple ID';
    const btn = button.closest('button');
    const originalText = btn.innerHTML;
    
    btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Connecting...`;
    btn.disabled = true;
    
    setTimeout(() => {
      const userData = {
        email: `user@${provider}.com`,
        name: 'User Name',
        method: provider
      };
      
      this.authenticate(userData);
      this.showSuccessModal(`${providerName} Authentication`, `Successfully authenticated with ${providerName}!`);
      
      btn.innerHTML = originalText;
      btn.disabled = false;
    }, 1500);
  }

  validateEmail(email) {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  showSuccessModal(title, message) {
    const modal = document.getElementById('success-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    
    if (modal && modalTitle && modalMessage) {
      modalTitle.textContent = title;
      modalMessage.textContent = message;
      modal.classList.remove('hidden');
    }
  }

  initHomepage() {
    // Initialize homepage functionality
    this.renderProducts();
    this.setupHomepageEventListeners();
  }

  renderProducts() {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;

    productsGrid.innerHTML = '';
    
    appData.products.forEach(product => {
      const productCard = this.createProductCard(product);
      productsGrid.appendChild(productCard);
    });
  }

  createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    const stars = '★'.repeat(Math.floor(product.rating)) + 
                 (product.rating % 1 !== 0 ? '☆' : '');
    
    card.innerHTML = `
      <div class="product-image">
        <span>${product.image}</span>
      </div>
      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <div class="product-price">
          <span class="current-price">${product.price}</span>
          <span class="original-price">${product.originalPrice}</span>
        </div>
        <div class="product-rating">
          <span style="color: var(--brand-gold);">${stars}</span>
          <span>(${product.rating})</span>
        </div>
      </div>
    `;
    
    card.addEventListener('click', () => {
      this.showSuccessModal('Product Details', `Viewing ${product.name}. Full product page would be implemented in a real application.`);
    });
    
    return card;
  }

  setupHomepageEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          const query = e.target.value.trim();
          if (query) {
            this.performSearch(query);
          }
        }
      });
    }

    // Newsletter signup
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = e.target.querySelector('input[type="email"]')?.value;
        if (this.validateEmail(email)) {
          this.showSuccessModal('Newsletter Subscription', 'Thank you for subscribing! You\'ll receive 15% off your first purchase via email.');
          e.target.reset();
        } else {
          alert('Please enter a valid email address.');
        }
      });
    }

    // Collection buttons
    const collectionBtns = document.querySelectorAll('.collection-card .btn');
    collectionBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const collectionName = btn.closest('.collection-card')?.querySelector('h3')?.textContent;
        this.showSuccessModal('Collection', `Browsing ${collectionName} collection. Product listing would be implemented in a real application.`);
      });
    });

    // Hero CTA button
    const heroCta = document.querySelector('.hero-cta');
    if (heroCta) {
      heroCta.addEventListener('click', () => {
        const collectionsSection = document.querySelector('.collections');
        if (collectionsSection) {
          collectionsSection.scrollIntoView({ 
            behavior: 'smooth' 
          });
        }
      });
    }

    // Cart functionality
    let cartCount = 0;
    const cartCountElement = document.querySelector('.cart-count');
    const addToCartBtns = document.querySelectorAll('.product-card');
    
    addToCartBtns.forEach(card => {
      card.addEventListener('dblclick', () => {
        cartCount++;
        if (cartCountElement) {
          cartCountElement.textContent = cartCount;
        }
        const productName = card.querySelector('.product-name')?.textContent;
        this.showSuccessModal('Added to Cart', `${productName} has been added to your cart!`);
      });
    });

    // Modal close functionality
    const modal = document.getElementById('success-modal');
    const closeModalBtn = document.getElementById('close-modal');
    
    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', () => {
        if (modal) modal.classList.add('hidden');
      });
    }
    
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.add('hidden');
        }
      });
    }

    // Navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const category = link.textContent;
        this.showSuccessModal('Navigation', `Browsing ${category} section. Category pages would be implemented in a real application.`);
      });
    });

    // Footer links
    const footerLinks = document.querySelectorAll('.footer a');
    footerLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        if (link.getAttribute('href') === '#') {
          e.preventDefault();
          const linkText = link.textContent;
          this.showSuccessModal('Page Navigation', `${linkText} page would be implemented in a real application.`);
        }
      });
    });

    // Social media links
    const socialLinks = document.querySelectorAll('.social-links a');
    socialLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const platform = link.querySelector('i')?.className.split('-')[1];
        if (platform) {
          this.showSuccessModal('Social Media', `Opening ${platform.charAt(0).toUpperCase() + platform.slice(1)} page in a new tab.`);
        }
      });
    });
  }

  performSearch(query) {
    const filteredProducts = appData.products.filter(product => 
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase())
    );
    
    if (filteredProducts.length > 0) {
      this.showSuccessModal('Search Results', `Found ${filteredProducts.length} products matching "${query}". Search results page would be implemented in a real application.`);
    } else {
      this.showSuccessModal('Search Results', `No products found matching "${query}". Try searching for "cashmere", "silk", "leather", or "wool".`);
    }
  }
}

// Global variable to store auth manager instance
let authManager;

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize authentication manager
  authManager = new AuthManager();
  
  // Keyboard navigation support
  document.addEventListener('keydown', (e) => {
    // Close modal with Escape key
    if (e.key === 'Escape') {
      const modal = document.getElementById('success-modal');
      if (modal && !modal.classList.contains('hidden')) {
        modal.classList.add('hidden');
      }
    }
    
    // Quick search with Ctrl/Cmd + K
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      const searchInput = document.getElementById('search-input');
      if (searchInput && authManager.isAuthenticated) {
        searchInput.focus();
      }
    }
  });

  // Add visual feedback for interactive elements
  const interactiveElements = document.querySelectorAll('button, .btn, .product-card, .collection-card');
  
  interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
      if (!element.disabled) {
        element.style.transform = 'translateY(-2px)';
      }
    });
    
    element.addEventListener('mouseleave', () => {
      element.style.transform = '';
    });
  });

  // Performance monitoring
  if ('performance' in window) {
    window.addEventListener('load', () => {
      const loadTime = performance.now();
      console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
    });
  }

  // Add error handling for failed image loads
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    img.addEventListener('error', () => {
      console.warn(`Failed to load image: ${img.src}`);
      // Don't hide the image, let it show the alt text or placeholder
    });
  });
});

// Utility functions
function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Export for testing purposes (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AuthManager };
}
