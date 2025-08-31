// Roar Threads - Main JavaScript Application

// Application state
const appState = {
    currentUser: null,
    currentPage: 'home',
    cart: [],
    wishlist: [],
    products: [
        {
            id: 1,
            name: "Fierce Graphic Tee",
            price: 29.99,
            category: "T-Shirts",
            image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop",
            description: "Unleash your inner power with this bold graphic tee. Made from premium cotton blend for ultimate comfort.",
            sizes: ["S", "M", "L", "XL"],
            colors: ["Black", "White", "Navy"],
            inStock: true,
            stockCount: 15
        },
        {
            id: 2,
            name: "Power Hoodie",
            price: 59.99,
            category: "Hoodies",
            image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&auto=format&fit=crop",
            description: "Premium comfort hoodie for the bold and confident. Perfect for layering or wearing solo.",
            sizes: ["S", "M", "L", "XL", "XXL"],
            colors: ["Black", "Gray", "Maroon"],
            inStock: true,
            stockCount: 8
        },
        {
            id: 3,
            name: "Roar Cap",
            price: 24.99,
            category: "Accessories",
            image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&auto=format&fit=crop",
            description: "Complete your look with this signature cap. Adjustable fit for maximum comfort.",
            sizes: ["One Size"],
            colors: ["Black", "White", "Gold"],
            inStock: true,
            stockCount: 25
        },
        {
            id: 4,
            name: "Bold Statement Joggers",
            price: 49.99,
            category: "Bottoms",
            image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&auto=format&fit=crop",
            description: "Comfortable joggers that make a statement. Perfect for casual days and workouts.",
            sizes: ["S", "M", "L", "XL"],
            colors: ["Black", "Gray", "Navy"],
            inStock: true,
            stockCount: 12
        },
        {
            id: 5,
            name: "Empowerment Tank",
            price: 34.99,
            category: "T-Shirts",
            image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500&auto=format&fit=crop",
            description: "Lightweight tank top perfect for workouts or casual wear.",
            sizes: ["S", "M", "L", "XL"],
            colors: ["Black", "White", "Pink"],
            inStock: true,
            stockCount: 20
        },
        {
            id: 6,
            name: "Street Style Jacket",
            price: 89.99,
            category: "Jackets",
            image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop",
            description: "Urban-inspired jacket for the modern warrior.",
            sizes: ["S", "M", "L", "XL"],
            colors: ["Black", "Olive", "Navy"],
            inStock: true,
            stockCount: 6
        }
    ],
    collections: [
        {
            id: 1,
            name: "Urban Roar",
            description: "Street-inspired pieces for the modern warrior",
            image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&auto=format&fit=crop",
            products: [1, 4, 6]
        },
        {
            id: 2,
            name: "Premium Power",
            description: "Elevated essentials for confident leaders",
            image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&auto=format&fit=crop",
            products: [2, 5]
        },
        {
            id: 3,
            name: "Fierce Femininity",
            description: "Empowering pieces for strong women",
            image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&auto=format&fit=crop",
            products: [1, 5]
        }
    ],
    promoCodes: {
        'ROAR20': { discount: 20, type: 'percentage', description: '20% off your order' },
        'FIRST10': { discount: 10, type: 'percentage', description: '10% off for first-time customers' },
        'SAVE15': { discount: 15, type: 'fixed', description: '$15 off orders over $100' }
    }
};

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    console.log('Initializing Roar Threads app...');
    
    // Hide loading spinner
    setTimeout(() => {
        const loadingSpinner = document.getElementById('loadingSpinner');
        if (loadingSpinner) {
            loadingSpinner.style.display = 'none';
        }
        
        // Check if user is logged in
        const savedAuth = getCookie('roarThreadsAuth');
        if (savedAuth) {
            try {
                appState.currentUser = JSON.parse(savedAuth);
                console.log('User already logged in:', appState.currentUser);
                showMainWebsite();
            } catch (e) {
                console.error('Error parsing saved auth:', e);
                showAuthPage();
            }
        } else {
            console.log('No saved auth, showing auth page');
            showAuthPage();
        }
        
        // Show cookie consent if not accepted
        if (!getCookie('cookieConsent')) {
            const cookieConsent = document.getElementById('cookieConsent');
            if (cookieConsent) {
                cookieConsent.classList.remove('hidden');
            }
        }
    }, 1000);

    // Initialize event listeners
    initializeEventListeners();
}

function initializeEventListeners() {
    console.log('Initializing event listeners...');
    
    // Authentication forms
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
        console.log('Login form listener added');
    }
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
        console.log('Signup form listener added');
    }
    
    // Tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach((btn, index) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (index === 0) {
                showLogin();
            } else {
                showSignup();
            }
        });
    });
    
    // Social login buttons
    const googleBtn = document.querySelector('.social-btn');
    const appleBtn = document.querySelectorAll('.social-btn')[1];
    
    if (googleBtn) {
        googleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loginWithGoogle();
        });
    }
    
    if (appleBtn) {
        appleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loginWithApple();
        });
    }
    
    // Newsletter signup
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSignup);
    }
    
    // Contact form
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
    
    // Filter and sort events
    const categoryFilter = document.getElementById('categoryFilter');
    const sortFilter = document.getElementById('sortFilter');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterProducts);
    }
    if (sortFilter) {
        sortFilter.addEventListener('change', sortProducts);
    }
    
    // Mobile menu toggle
    window.addEventListener('resize', handleResize);
    
    console.log('All event listeners initialized');
}

// Authentication Functions
function showLogin() {
    console.log('Switching to login tab');
    
    // Update tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabButtons[0].classList.add('active');
    
    // Show/hide forms
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (loginForm) {
        loginForm.classList.remove('hidden');
        // Update submit button text
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.textContent = 'Login';
        }
    }
    if (signupForm) {
        signupForm.classList.add('hidden');
    }
}

function showSignup() {
    console.log('Switching to signup tab');
    
    // Update tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabButtons[1].classList.add('active');
    
    // Show/hide forms
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (signupForm) {
        signupForm.classList.remove('hidden');
        // Update submit button text
        const submitBtn = signupForm.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.textContent = 'Sign Up';
        }
    }
    if (loginForm) {
        loginForm.classList.add('hidden');
    }
}

function handleLogin(event) {
    event.preventDefault();
    console.log('Login form submitted');
    
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    const enable2FAInput = document.getElementById('enable2FA');
    
    if (!emailInput || !passwordInput) {
        console.error('Login form inputs not found');
        showValidationError('Login form elements not found');
        return;
    }
    
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const enable2FA = enable2FAInput ? enable2FAInput.checked : false;
    
    console.log('Login attempt:', { email, passwordLength: password.length, enable2FA });
    
    // Clear previous errors
    clearValidationErrors();
    
    // Validation
    if (!email) {
        showValidationError('Email is required');
        emailInput.focus();
        return;
    }
    
    if (!password) {
        showValidationError('Password is required');
        passwordInput.focus();
        return;
    }
    
    if (!isValidEmail(email)) {
        showValidationError('Please enter a valid email address');
        emailInput.focus();
        return;
    }
    
    if (password.length < 3) {
        showValidationError('Password must be at least 3 characters long');
        passwordInput.focus();
        return;
    }
    
    // Simulate authentication success
    console.log('Login validation passed, proceeding with authentication');
    
    if (enable2FA) {
        show2FAModal();
    } else {
        completeLogin(email);
    }
}

function handleSignup(event) {
    event.preventDefault();
    console.log('Signup form submitted');
    
    const nameInput = document.getElementById('signupName');
    const emailInput = document.getElementById('signupEmail');
    const passwordInput = document.getElementById('signupPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    
    if (!nameInput || !emailInput || !passwordInput || !confirmPasswordInput) {
        console.error('Signup form inputs not found');
        showValidationError('Signup form elements not found');
        return;
    }
    
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();
    
    console.log('Signup attempt:', { name, email, passwordLength: password.length });
    
    // Clear previous errors
    clearValidationErrors();
    
    // Validation
    if (!name) {
        showValidationError('Full name is required');
        nameInput.focus();
        return;
    }
    
    if (!email) {
        showValidationError('Email is required');
        emailInput.focus();
        return;
    }
    
    if (!password) {
        showValidationError('Password is required');
        passwordInput.focus();
        return;
    }
    
    if (!confirmPassword) {
        showValidationError('Please confirm your password');
        confirmPasswordInput.focus();
        return;
    }
    
    if (!isValidEmail(email)) {
        showValidationError('Please enter a valid email address');
        emailInput.focus();
        return;
    }
    
    if (password.length < 6) {
        showValidationError('Password must be at least 6 characters long');
        passwordInput.focus();
        return;
    }
    
    if (password !== confirmPassword) {
        showValidationError('Passwords do not match');
        confirmPasswordInput.focus();
        return;
    }
    
    console.log('Signup validation passed, creating account');
    completeLogin(email, name);
}

function showValidationError(message) {
    // Remove existing error messages
    clearValidationErrors();
    
    // Create error element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'validation-error';
    errorDiv.style.cssText = `
        color: var(--color-error);
        font-size: var(--font-size-sm);
        margin-top: var(--space-8);
        padding: var(--space-8);
        background-color: rgba(var(--color-error-rgb), 0.1);
        border: 1px solid rgba(var(--color-error-rgb), 0.3);
        border-radius: var(--radius-base);
    `;
    errorDiv.textContent = message;
    
    // Add to form
    const activeForm = document.querySelector('#loginForm:not(.hidden), #signupForm:not(.hidden)');
    if (activeForm) {
        activeForm.appendChild(errorDiv);
    }
    
    console.log('Validation error displayed:', message);
}

function clearValidationErrors() {
    const errorElements = document.querySelectorAll('.validation-error');
    errorElements.forEach(error => error.remove());
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function show2FAModal() {
    const modal = document.getElementById('twoFAModal');
    if (modal) {
        modal.classList.remove('hidden');
        const codeInput = document.getElementById('twoFACode');
        if (codeInput) {
            codeInput.focus();
        }
    }
}

function closeTwoFA() {
    const modal = document.getElementById('twoFAModal');
    const codeInput = document.getElementById('twoFACode');
    
    if (modal) {
        modal.classList.add('hidden');
    }
    if (codeInput) {
        codeInput.value = '';
    }
}

function verifyTwoFA() {
    const codeInput = document.getElementById('twoFACode');
    if (!codeInput) return;
    
    const code = codeInput.value.trim();
    if (code.length === 6 && /^\d+$/.test(code)) {
        const emailInput = document.getElementById('loginEmail');
        const email = emailInput ? emailInput.value : 'user@example.com';
        completeLogin(email);
        closeTwoFA();
    } else {
        alert('Please enter a valid 6-digit code');
        codeInput.focus();
    }
}

function completeLogin(email, name = null) {
    console.log('Completing login for:', { email, name });
    
    const userData = {
        email: email,
        name: name || email.split('@')[0],
        loginTime: new Date().toISOString()
    };
    
    appState.currentUser = userData;
    setCookie('roarThreadsAuth', JSON.stringify(userData), 2); // 2 days
    
    console.log('Login completed, showing main website');
    showMainWebsite();
}

function loginWithGoogle() {
    console.log('Google login clicked');
    // Simulate Google OAuth
    completeLogin('user@gmail.com', 'Google User');
}

function loginWithApple() {
    console.log('Apple login clicked');
    // Simulate Apple ID OAuth
    completeLogin('user@icloud.com', 'Apple User');
}

function logout() {
    console.log('Logging out user');
    appState.currentUser = null;
    deleteCookie('roarThreadsAuth');
    appState.cart = [];
    appState.wishlist = [];
    showAuthPage();
}

// Page Navigation
function showAuthPage() {
    console.log('Showing auth page');
    const authPage = document.getElementById('authPage');
    const mainWebsite = document.getElementById('mainWebsite');
    
    if (authPage) authPage.classList.remove('hidden');
    if (mainWebsite) mainWebsite.classList.add('hidden');
}

function showMainWebsite() {
    console.log('Showing main website');
    const authPage = document.getElementById('authPage');
    const mainWebsite = document.getElementById('mainWebsite');
    
    if (authPage) authPage.classList.add('hidden');
    if (mainWebsite) mainWebsite.classList.remove('hidden');
    
    showPage('home');
    updateCartUI();
    loadFeaturedProducts();
    loadCollections();
}

function showPage(pageName) {
    console.log('Showing page:', pageName);
    
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Remove active class from nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Show selected page
    const targetPage = document.getElementById(pageName + 'Page');
    if (targetPage) {
        targetPage.classList.add('active');
        appState.currentPage = pageName;
        
        // Add active class to corresponding nav link
        const activeLink = document.querySelector(`[onclick*="'${pageName}'"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
        
        // Load page-specific content
        loadPageContent(pageName);
    }
}

function loadPageContent(pageName) {
    switch(pageName) {
        case 'shop':
            loadShopProducts();
            break;
        case 'collections':
            loadCollections();
            break;
        case 'account':
            loadAccountData();
            break;
        case 'admin':
            loadAdminData();
            break;
    }
}

// Product Functions
function loadFeaturedProducts() {
    const container = document.getElementById('featuredProducts');
    if (!container) return;
    
    const featuredProducts = appState.products.slice(0, 4);
    container.innerHTML = featuredProducts.map(product => createProductCard(product)).join('');
}

function loadShopProducts() {
    const container = document.getElementById('productsGrid');
    if (!container) return;
    
    container.innerHTML = appState.products.map(product => createProductCard(product)).join('');
}

function createProductCard(product) {
    const stockIndicator = product.stockCount <= 5 ? 
        `<span class="stock-indicator" style="color: var(--color-error); font-size: var(--font-size-sm);">Only ${product.stockCount} left!</span>` : '';
    
    return `
        <div class="product-card" onclick="showProductDetail(${product.id})">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                <div class="product-actions">
                    <button class="action-btn" onclick="event.stopPropagation(); toggleWishlist(${product.id})" title="Add to Wishlist">♡</button>
                    <button class="action-btn" onclick="event.stopPropagation(); showProductDetail(${product.id})" title="Quick View">👁</button>
                </div>
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                ${stockIndicator}
                <button class="btn btn--primary add-to-cart-btn" onclick="event.stopPropagation(); addToCart(${product.id})">Add to Cart</button>
            </div>
        </div>
    `;
}

function showProductDetail(productId) {
    const product = appState.products.find(p => p.id === productId);
    if (!product) return;
    
    const container = document.getElementById('productDetail');
    if (!container) return;
    
    container.innerHTML = `
        <div class="product-detail">
            <div class="product-gallery">
                <div class="main-image">
                    <img src="${product.image}" alt="${product.name}" id="mainProductImage">
                </div>
                <div class="thumbnail-images">
                    <img src="${product.image}" alt="${product.name}" class="thumbnail active" onclick="changeMainImage('${product.image}')">
                    <img src="${product.image}" alt="${product.name}" class="thumbnail" onclick="changeMainImage('${product.image}')">
                </div>
            </div>
            <div class="product-details">
                <nav class="breadcrumb" style="margin-bottom: var(--space-16); font-size: var(--font-size-sm); color: var(--color-text-secondary);">
                    <a href="#" onclick="showPage('home')">Home</a> > 
                    <a href="#" onclick="showPage('shop')">Shop</a> > 
                    <span>${product.name}</span>
                </nav>
                <h1>${product.name}</h1>
                <div class="product-price-large">$${product.price.toFixed(2)}</div>
                <p style="margin-bottom: var(--space-20); color: var(--color-text-secondary);">${product.description}</p>
                
                <div class="size-selector">
                    <label class="form-label">Size:</label>
                    <div class="size-options">
                        ${product.sizes.map((size, index) => `<button class="size-option ${index === 0 ? 'active' : ''}" onclick="selectSize('${size}')">${size}</button>`).join('')}
                    </div>
                </div>
                
                <div class="color-selector">
                    <label class="form-label">Color:</label>
                    <div class="color-options">
                        ${product.colors.map((color, index) => `<button class="color-option ${index === 0 ? 'active' : ''}" onclick="selectColor('${color}')">${color}</button>`).join('')}
                    </div>
                </div>
                
                <div class="quantity-selector">
                    <label class="form-label">Quantity:</label>
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="changeQuantity(-1)">-</button>
                        <input type="number" class="quantity-input" value="1" min="1" max="${product.stockCount}" id="productQuantity">
                        <button class="quantity-btn" onclick="changeQuantity(1)">+</button>
                    </div>
                </div>
                
                <div class="product-actions-large">
                    <button class="btn btn--primary btn--lg" onclick="addToCart(${product.id})">Add to Cart</button>
                    <button class="btn btn--outline btn--lg" onclick="toggleWishlist(${product.id})">♡ Wishlist</button>
                </div>
                
                <div class="product-details-tabs" style="margin-top: var(--space-32);">
                    <div class="tab-buttons" style="display: flex; gap: var(--space-16); border-bottom: 1px solid var(--color-border); margin-bottom: var(--space-16);">
                        <button class="tab-btn active" onclick="showProductTab('description')">Description</button>
                        <button class="tab-btn" onclick="showProductTab('sizeguide')">Size Guide</button>
                        <button class="tab-btn" onclick="showProductTab('reviews')">Reviews</button>
                    </div>
                    <div id="descriptionTab" class="product-tab-content active">
                        <p>${product.description}</p>
                        <ul style="margin-top: var(--space-16);">
                            <li>Premium quality materials</li>
                            <li>Comfortable fit</li>
                            <li>Machine washable</li>
                            <li>Made with sustainable practices</li>
                        </ul>
                    </div>
                    <div id="sizeguideTab" class="product-tab-content hidden">
                        <h4>Size Guide</h4>
                        <p>Please refer to our size chart for the best fit. If you're between sizes, we recommend sizing up for a more relaxed fit.</p>
                    </div>
                    <div id="reviewsTab" class="product-tab-content hidden">
                        <div class="reviews-summary" style="margin-bottom: var(--space-20);">
                            <h4>Customer Reviews (4.8/5)</h4>
                            <div style="display: flex; align-items: center; gap: var(--space-8);">
                                <span>⭐⭐⭐⭐⭐</span>
                                <span style="color: var(--color-text-secondary);">(127 reviews)</span>
                            </div>
                        </div>
                        <div class="review-item" style="border-bottom: 1px solid var(--color-border); padding-bottom: var(--space-16); margin-bottom: var(--space-16);">
                            <div style="display: flex; justify-content: space-between; margin-bottom: var(--space-8);">
                                <strong>Sarah M.</strong>
                                <span>⭐⭐⭐⭐⭐</span>
                            </div>
                            <p style="color: var(--color-text-secondary);">Amazing quality and fits perfectly! The material is so soft and comfortable.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div style="margin-top: var(--space-32);">
            <h3 style="text-align: center; margin-bottom: var(--space-24);">Related Products</h3>
            <div class="products-carousel">
                ${appState.products.filter(p => p.id !== product.id && p.category === product.category)
                    .slice(0, 3)
                    .map(p => createProductCard(p))
                    .join('')}
            </div>
        </div>
    `;
    
    showPage('product');
}

function changeMainImage(src) {
    const mainImage = document.getElementById('mainProductImage');
    if (mainImage) {
        mainImage.src = src;
    }
    
    // Update thumbnail active state
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach(thumb => {
        thumb.classList.remove('active');
        if (thumb.src === src) {
            thumb.classList.add('active');
        }
    });
}

function selectSize(size) {
    const sizeOptions = document.querySelectorAll('.size-option');
    sizeOptions.forEach(btn => btn.classList.remove('active'));
    
    if (event && event.target) {
        event.target.classList.add('active');
    }
}

function selectColor(color) {
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(btn => btn.classList.remove('active'));
    
    if (event && event.target) {
        event.target.classList.add('active');
    }
}

function changeQuantity(delta) {
    const input = document.getElementById('productQuantity');
    if (!input) return;
    
    const currentValue = parseInt(input.value) || 1;
    const maxValue = parseInt(input.max) || 99;
    const newValue = Math.max(1, Math.min(currentValue + delta, maxValue));
    input.value = newValue;
}

function showProductTab(tabName) {
    const tabBtns = document.querySelectorAll('.product-details-tabs .tab-btn');
    const tabContents = document.querySelectorAll('.product-tab-content');
    
    tabBtns.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.add('hidden'));
    
    if (event && event.target) {
        event.target.classList.add('active');
    }
    
    const targetTab = document.getElementById(tabName + 'Tab');
    if (targetTab) {
        targetTab.classList.remove('hidden');
    }
}

// Shopping Cart Functions
function addToCart(productId, quantity = 1) {
    const product = appState.products.find(p => p.id === productId);
    if (!product) return;
    
    const quantityInput = document.getElementById('productQuantity');
    if (quantityInput) {
        quantity = parseInt(quantityInput.value) || 1;
    }
    
    // Get selected size and color
    const selectedSizeEl = document.querySelector('.size-option.active');
    const selectedColorEl = document.querySelector('.color-option.active');
    
    const selectedSize = selectedSizeEl ? selectedSizeEl.textContent : product.sizes[0];
    const selectedColor = selectedColorEl ? selectedColorEl.textContent : product.colors[0];
    
    const existingItem = appState.cart.find(item => 
        item.product.id === productId && 
        item.selectedSize === selectedSize && 
        item.selectedColor === selectedColor
    );
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        appState.cart.push({
            product: product,
            quantity: quantity,
            selectedSize: selectedSize,
            selectedColor: selectedColor
        });
    }
    
    updateCartUI();
    showCartNotification(`${product.name} added to cart!`);
}

function removeFromCart(productId, size, color) {
    appState.cart = appState.cart.filter(item => 
        !(item.product.id === productId && item.selectedSize === size && item.selectedColor === color)
    );
    updateCartUI();
}

function updateCartQuantity(productId, newQuantity, size, color) {
    const item = appState.cart.find(item => 
        item.product.id === productId && item.selectedSize === size && item.selectedColor === color
    );
    
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId, size, color);
        } else {
            item.quantity = newQuantity;
        }
    }
    updateCartUI();
}

function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartContent = document.getElementById('cartContent');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartCount || !cartContent || !cartTotal) return;
    
    const totalItems = appState.cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = appState.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    
    cartCount.textContent = totalItems;
    cartTotal.textContent = `Total: $${totalPrice.toFixed(2)}`;
    
    if (appState.cart.length === 0) {
        cartContent.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
    } else {
        cartContent.innerHTML = appState.cart.map((item, index) => `
            <div class="cart-item">
                <img src="${item.product.image}" alt="${item.product.name}">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.product.name}</div>
                    <div class="cart-item-details" style="font-size: var(--font-size-sm); color: var(--color-text-secondary);">
                        ${item.selectedSize} • ${item.selectedColor}
                    </div>
                    <div class="cart-item-price">$${item.product.price.toFixed(2)} x ${item.quantity}</div>
                    <div class="cart-item-actions" style="margin-top: var(--space-8);">
                        <button onclick="updateCartQuantity(${item.product.id}, ${item.quantity - 1}, '${item.selectedSize}', '${item.selectedColor}')" style="background: none; border: none; cursor: pointer;">-</button>
                        <span style="margin: 0 var(--space-8);">${item.quantity}</span>
                        <button onclick="updateCartQuantity(${item.product.id}, ${item.quantity + 1}, '${item.selectedSize}', '${item.selectedColor}')" style="background: none; border: none; cursor: pointer;">+</button>
                        <button onclick="removeFromCart(${item.product.id}, '${item.selectedSize}', '${item.selectedColor}')" style="background: none; border: none; color: var(--color-error); cursor: pointer; margin-left: var(--space-8);">Remove</button>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    if (cartSidebar) {
        cartSidebar.classList.toggle('open');
    }
}

function proceedToCheckout() {
    if (appState.cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const checkoutModal = document.getElementById('checkoutModal');
    if (checkoutModal) {
        checkoutModal.classList.remove('hidden');
    }
    toggleCart();
}

function closeCheckout() {
    const checkoutModal = document.getElementById('checkoutModal');
    if (checkoutModal) {
        checkoutModal.classList.add('hidden');
    }
}

function applyPromoCode() {
    const promoInput = document.getElementById('promoCode');
    if (!promoInput) return;
    
    const code = promoInput.value.toUpperCase();
    
    if (appState.promoCodes[code]) {
        const promo = appState.promoCodes[code];
        showCartNotification(`Promo code applied: ${promo.description}`);
        // Apply discount logic here
    } else {
        alert('Invalid promo code');
    }
}

function placeOrder() {
    // Simulate order processing
    showCartNotification('Order placed successfully! You will receive a confirmation email shortly.');
    appState.cart = [];
    updateCartUI();
    closeCheckout();
    
    // Show order confirmation
    setTimeout(() => {
        alert('Thank you for your order! Order #RT' + Math.floor(Math.random() * 10000) + ' has been placed.');
    }, 1000);
}

// Wishlist Functions
function toggleWishlist(productId) {
    const product = appState.products.find(p => p.id === productId);
    if (!product) return;
    
    const existingIndex = appState.wishlist.findIndex(item => item.id === productId);
    
    if (existingIndex > -1) {
        appState.wishlist.splice(existingIndex, 1);
        showCartNotification(`${product.name} removed from wishlist`);
    } else {
        appState.wishlist.push(product);
        showCartNotification(`${product.name} added to wishlist`);
    }
    
    updateWishlistUI();
}

function updateWishlistUI() {
    const wishlistContainer = document.getElementById('wishlistItems');
    if (!wishlistContainer) return;
    
    if (appState.wishlist.length === 0) {
        wishlistContainer.innerHTML = '<p style="text-align: center; color: var(--color-text-secondary);">Your wishlist is empty</p>';
    } else {
        wishlistContainer.innerHTML = `
            <div class="products-grid">
                ${appState.wishlist.map(product => createProductCard(product)).join('')}
            </div>
        `;
    }
}

// Collections Functions
function loadCollections() {
    const container = document.getElementById('collectionsGrid');
    if (!container) return;
    
    container.innerHTML = appState.collections.map(collection => `
        <div class="collection-card" onclick="viewCollection(${collection.id})">
            <img src="${collection.image}" alt="${collection.name}">
            <div class="collection-overlay">
                <h3>${collection.name}</h3>
                <p>${collection.description}</p>
                <button class="btn btn--primary" onclick="event.stopPropagation(); viewCollection(${collection.id})">Explore Collection</button>
            </div>
        </div>
    `).join('');
}

function viewCollection(collectionId) {
    const collection = appState.collections.find(c => c.id === collectionId);
    if (!collection) return;
    
    // Filter products by collection
    const collectionProducts = appState.products.filter(p => collection.products.includes(p.id));
    
    // Show filtered products on shop page
    const container = document.getElementById('productsGrid');
    if (container) {
        container.innerHTML = collectionProducts.map(product => createProductCard(product)).join('');
        showPage('shop');
    }
}

// Filter and Sort Functions
function filterProducts() {
    const categoryFilter = document.getElementById('categoryFilter');
    if (!categoryFilter) return;
    
    const category = categoryFilter.value;
    let filteredProducts = appState.products;
    
    if (category) {
        filteredProducts = appState.products.filter(p => p.category === category);
    }
    
    const container = document.getElementById('productsGrid');
    if (container) {
        container.innerHTML = filteredProducts.map(product => createProductCard(product)).join('');
    }
}

function sortProducts() {
    const sortFilter = document.getElementById('sortFilter');
    if (!sortFilter) return;
    
    const sortBy = sortFilter.value;
    let sortedProducts = [...appState.products];
    
    switch(sortBy) {
        case 'price-low':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
        case 'newest':
            sortedProducts.sort((a, b) => b.id - a.id);
            break;
        default:
            // Keep original order for featured
            break;
    }
    
    const container = document.getElementById('productsGrid');
    if (container) {
        container.innerHTML = sortedProducts.map(product => createProductCard(product)).join('');
    }
}

// Account Functions
function showAccountTab(tabName) {
    const accountTabs = document.querySelectorAll('.account-tab');
    const accountContents = document.querySelectorAll('.account-tab-content');
    
    accountTabs.forEach(tab => tab.classList.remove('active'));
    accountContents.forEach(content => content.classList.remove('active'));
    
    if (event && event.target) {
        event.target.classList.add('active');
    }
    
    const targetContent = document.getElementById(tabName + 'Tab');
    if (targetContent) {
        targetContent.classList.add('active');
    }
    
    if (tabName === 'wishlist') {
        updateWishlistUI();
    }
}

function loadAccountData() {
    // Load user-specific data
    updateWishlistUI();
}

// Admin Functions
function showAdminTab(tabName) {
    const adminTabs = document.querySelectorAll('.admin-tab');
    const adminContents = document.querySelectorAll('.admin-tab-content');
    
    adminTabs.forEach(tab => tab.classList.remove('active'));
    adminContents.forEach(content => content.classList.remove('active'));
    
    if (event && event.target) {
        event.target.classList.add('active');
    }
    
    const targetContent = document.getElementById(tabName + 'Tab');
    if (targetContent) {
        targetContent.classList.add('active');
    }
    
    if (tabName === 'products') {
        loadAdminProducts();
    }
}

function loadAdminData() {
    // Load admin dashboard data
    loadAdminProducts();
}

function loadAdminProducts() {
    const container = document.getElementById('adminProductsList');
    if (!container) return;
    
    container.innerHTML = `
        <div style="margin-top: var(--space-20);">
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="border-bottom: 1px solid var(--color-border);">
                        <th style="padding: var(--space-12); text-align: left;">Product</th>
                        <th style="padding: var(--space-12); text-align: left;">Category</th>
                        <th style="padding: var(--space-12); text-align: left;">Price</th>
                        <th style="padding: var(--space-12); text-align: left;">Stock</th>
                        <th style="padding: var(--space-12); text-align: left;">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${appState.products.map(product => `
                        <tr style="border-bottom: 1px solid var(--color-border);">
                            <td style="padding: var(--space-12);">
                                <div style="display: flex; align-items: center; gap: var(--space-12);">
                                    <img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: var(--radius-base);">
                                    <span>${product.name}</span>
                                </div>
                            </td>
                            <td style="padding: var(--space-12);">${product.category}</td>
                            <td style="padding: var(--space-12);">$${product.price.toFixed(2)}</td>
                            <td style="padding: var(--space-12);">${product.stockCount}</td>
                            <td style="padding: var(--space-12);">
                                <button class="btn btn--sm btn--outline" onclick="editProduct(${product.id})">Edit</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function showAddProductForm() {
    alert('Add Product form would open here. This is a demo interface.');
}

function editProduct(productId) {
    alert(`Edit product ${productId} form would open here. This is a demo interface.`);
}

// Chatbot Functions
function toggleChatbot() {
    const chatWindow = document.getElementById('chatWindow');
    const chatToggle = document.getElementById('chatToggle');
    
    if (chatWindow && chatToggle) {
        chatWindow.classList.toggle('hidden');
        chatToggle.textContent = chatWindow.classList.contains('hidden') ? '▼' : '▲';
    }
}

function handleChatInput(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    if (!input) return;
    
    const message = input.value.trim();
    
    if (!message) return;
    
    addChatMessage(message, 'user');
    input.value = '';
    
    // Simulate bot response
    setTimeout(() => {
        const response = generateChatResponse(message);
        addChatMessage(response, 'bot');
    }, 1000);
}

function addChatMessage(message, type) {
    const messagesContainer = document.getElementById('chatMessages');
    if (!messagesContainer) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `${type}-message`;
    messageDiv.textContent = message;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function generateChatResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('color') || lowerMessage.includes('combination')) {
        return "Great question! For versatile styling, try: Black + Gold for luxury, Navy + White for classic looks, or Earth tones (brown, olive, cream) for natural vibes. What's your personal style preference?";
    }
    
    if (lowerMessage.includes('size') || lowerMessage.includes('fit')) {
        return "Our sizing runs true to size. Check our size guide for measurements, or if you're between sizes, I recommend sizing up for a relaxed fit. What item are you interested in?";
    }
    
    if (lowerMessage.includes('shipping') || lowerMessage.includes('delivery')) {
        return "We offer free shipping on orders over $75! Standard delivery takes 3-5 business days, express is 1-2 days. You'll get tracking info once your order ships.";
    }
    
    if (lowerMessage.includes('return') || lowerMessage.includes('exchange')) {
        return "We have a 30-day return policy! Items must be unworn with tags. Returns are free, and we'll send you a prepaid label. Need help starting a return?";
    }
    
    if (lowerMessage.includes('product') || lowerMessage.includes('recommend')) {
        return "I'd love to help you find the perfect piece! Our Power Hoodie and Fierce Graphic Tees are customer favorites. What style are you looking for - casual, streetwear, or something more elevated?";
    }
    
    return "Thanks for reaching out! I'm here to help with styling advice, product questions, sizing, orders, and more. What can I assist you with today?";
}

// Utility Functions
function showCartNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--color-success);
        color: white;
        padding: var(--space-12) var(--space-16);
        border-radius: var(--radius-base);
        box-shadow: var(--shadow-lg);
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        if (notification && notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

function toggleSearch() {
    const searchBar = document.getElementById('searchBar');
    if (searchBar) {
        searchBar.classList.toggle('hidden');
        
        if (!searchBar.classList.contains('hidden')) {
            const searchInput = searchBar.querySelector('.search-input');
            if (searchInput) {
                searchInput.focus();
            }
        }
    }
}

function toggleMobileMenu() {
    const navMenu = document.getElementById('navMenu');
    if (navMenu) {
        navMenu.classList.toggle('active');
    }
}

function handleResize() {
    // Close mobile menu on desktop
    if (window.innerWidth > 768) {
        const navMenu = document.getElementById('navMenu');
        if (navMenu) {
            navMenu.classList.remove('active');
        }
    }
}

// Newsletter and Contact Form Functions
function handleNewsletterSignup(event) {
    event.preventDefault();
    const emailInput = event.target.querySelector('input[type="email"]');
    const email = emailInput ? emailInput.value : '';
    
    if (email) {
        showCartNotification('Successfully subscribed to our newsletter!');
        event.target.reset();
    }
}

function handleContactForm(event) {
    event.preventDefault();
    showCartNotification('Message sent successfully! We\'ll get back to you soon.');
    event.target.reset();
}

// Cookie Functions
function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function deleteCookie(name) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict";
}

function acceptCookies() {
    setCookie('cookieConsent', 'accepted', 365);
    const cookieConsent = document.getElementById('cookieConsent');
    if (cookieConsent) {
        cookieConsent.classList.add('hidden');
    }
}

// Initialize search functionality
function initializeSearch() {
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
}

function handleSearch(event) {
    const query = event.target.value.toLowerCase();
    
    if (query.length < 2) return;
    
    const filteredProducts = appState.products.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
    );
    
    const container = document.getElementById('productsGrid');
    if (container && appState.currentPage === 'shop') {
        container.innerHTML = filteredProducts.map(product => createProductCard(product)).join('');
    }
}

// Add slide-in animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Initialize additional features on page load
window.addEventListener('load', function() {
    initializeSearch();
    
    // Add admin page access via /admin
    if (window.location.hash === '#admin') {
        setTimeout(() => {
            if (appState.currentUser) {
                showPage('admin');
            }
        }, 1500);
    }
});

// Make functions globally available
window.showLogin = showLogin;
window.showSignup = showSignup;
window.loginWithGoogle = loginWithGoogle;
window.loginWithApple = loginWithApple;
window.closeTwoFA = closeTwoFA;
window.verifyTwoFA = verifyTwoFA;
window.logout = logout;
window.showPage = showPage;
window.showProductDetail = showProductDetail;
window.addToCart = addToCart;
window.toggleWishlist = toggleWishlist;
window.toggleCart = toggleCart;
window.proceedToCheckout = proceedToCheckout;
window.closeCheckout = closeCheckout;
window.applyPromoCode = applyPromoCode;
window.placeOrder = placeOrder;
window.viewCollection = viewCollection;
window.filterProducts = filterProducts;
window.showAccountTab = showAccountTab;
window.showAdminTab = showAdminTab;
window.showAddProductForm = showAddProductForm;
window.editProduct = editProduct;
window.toggleChatbot = toggleChatbot;
window.handleChatInput = handleChatInput;
window.sendMessage = sendMessage;
window.toggleSearch = toggleSearch;
window.toggleMobileMenu = toggleMobileMenu;
window.acceptCookies = acceptCookies;
window.selectSize = selectSize;
window.selectColor = selectColor;
window.changeQuantity = changeQuantity;
window.showProductTab = showProductTab;
window.changeMainImage = changeMainImage;
window.removeFromCart = removeFromCart;
window.updateCartQuantity = updateCartQuantity;