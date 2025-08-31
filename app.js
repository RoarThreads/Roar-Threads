// Roar Threads - Luxury Fashion E-commerce Application
document.addEventListener('DOMContentLoaded', function() {
    // Global state
    let isAuthenticated = checkAuthStatus();
    let cartItems = [];
    let cartCount = 0;

    // DOM Elements
    const authPage = document.getElementById('auth-page');
    const homepage = document.getElementById('homepage');
    const authForm = document.getElementById('auth-form');
    const signinTab = document.getElementById('signin-tab');
    const signupTab = document.getElementById('signup-tab');
    const authTitle = document.getElementById('auth-title');
    const authSubtitle = document.getElementById('auth-subtitle');
    const submitBtn = document.getElementById('submit-btn');
    const confirmPasswordGroup = document.getElementById('confirm-password-group');
    const logoutBtn = document.getElementById('logout-btn');
    const productModal = document.getElementById('product-modal');
    const cartCountElement = document.querySelector('.cart-count');
    const newsletterForm = document.getElementById('newsletter-form');
    const searchInput = document.querySelector('.search-input');

    // Initialize app
    init();

    function init() {
        console.log('Initializing Roar Threads app...');
        
        if (isAuthenticated) {
            showHomepage();
        } else {
            showAuthPage();
        }
        
        setupEventListeners();
        startCountdownTimer();
        updateCartUI();
        
        console.log('App initialized successfully');
    }

    function checkAuthStatus() {
        // Check for stored auth
        const authStatus = sessionStorage.getItem('roarThreadsAuth') === 'true';
        console.log('Auth status:', authStatus);
        return authStatus;
    }

    function showAuthPage() {
        console.log('Showing auth page');
        authPage.classList.remove('hidden');
        homepage.classList.add('hidden');
    }

    function showHomepage() {
        console.log('Showing homepage');
        authPage.classList.add('hidden');
        homepage.classList.remove('hidden');
    }

    function setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Auth form toggle - Fixed with proper error handling
        if (signinTab && signupTab) {
            signinTab.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Sign in tab clicked');
                switchToSignIn();
            });
            
            signupTab.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Sign up tab clicked');
                switchToSignUp();
            });
        }

        // Auth form submission - Fixed with proper validation
        if (authForm) {
            authForm.addEventListener('submit', function(e) {
                console.log('Auth form submitted');
                handleAuthSubmit(e);
            });
        }

        // Social auth buttons - Fixed with proper selectors
        const googleBtn = document.querySelector('.google-btn');
        const appleBtn = document.querySelector('.apple-btn');
        
        if (googleBtn) {
            googleBtn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Google auth clicked');
                handleGoogleAuth();
            });
        }
        
        if (appleBtn) {
            appleBtn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Apple auth clicked');
                handleAppleAuth();
            });
        }

        // Logout button
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                handleLogout();
            });
        }

        // Setup other listeners only if on homepage
        if (!homepage.classList.contains('hidden')) {
            setupHomepageListeners();
        }
    }

    function setupHomepageListeners() {
        // Product interactions
        setupProductListeners();

        // Newsletter form
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', handleNewsletterSignup);
        }

        // Search functionality
        if (searchInput) {
            searchInput.addEventListener('input', handleSearch);
            searchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    handleSearchSubmit(e.target.value);
                }
            });
        }

        // Modal functionality
        setupModalListeners();

        // Cart functionality
        setupCartListeners();

        // Hero CTA
        const heroCTA = document.querySelector('.hero-cta');
        if (heroCTA) {
            heroCTA.addEventListener('click', function(e) {
                e.preventDefault();
                document.querySelector('.collections').scrollIntoView({ 
                    behavior: 'smooth' 
                });
            });
        }

        // Navigation links
        setupNavigationListeners();
    }

    function switchToSignIn() {
        console.log('Switching to sign in mode');
        
        if (signinTab && signupTab) {
            signinTab.classList.add('active');
            signupTab.classList.remove('active');
        }
        
        if (authTitle) authTitle.textContent = 'Welcome Back';
        if (authSubtitle) authSubtitle.textContent = 'Sign in to access your luxury fashion experience';
        if (submitBtn) submitBtn.textContent = 'Sign In';
        
        if (confirmPasswordGroup) {
            confirmPasswordGroup.classList.add('hidden');
        }
        
        const confirmPasswordInput = document.getElementById('confirm-password');
        if (confirmPasswordInput) {
            confirmPasswordInput.removeAttribute('required');
        }
    }

    function switchToSignUp() {
        console.log('Switching to sign up mode');
        
        if (signinTab && signupTab) {
            signupTab.classList.add('active');
            signinTab.classList.remove('active');
        }
        
        if (authTitle) authTitle.textContent = 'Join Roar Threads';
        if (authSubtitle) authSubtitle.textContent = 'Create your account for exclusive access';
        if (submitBtn) submitBtn.textContent = 'Sign Up';
        
        if (confirmPasswordGroup) {
            confirmPasswordGroup.classList.remove('hidden');
        }
        
        const confirmPasswordInput = document.getElementById('confirm-password');
        if (confirmPasswordInput) {
            confirmPasswordInput.setAttribute('required', 'required');
        }
    }

    function handleAuthSubmit(e) {
        e.preventDefault();
        console.log('Handling auth submission...');
        
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirm-password');
        const rememberMeInput = document.getElementById('remember-me');
        
        if (!emailInput || !passwordInput) {
            showNotification('Form elements not found', 'error');
            return;
        }
        
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput ? confirmPasswordInput.value : '';
        const rememberMe = rememberMeInput ? rememberMeInput.checked : false;
        const isSignUp = signupTab && signupTab.classList.contains('active');

        console.log('Form data:', { email, isSignUp, rememberMe });

        // Basic validation
        if (!email || !password) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }

        if (isSignUp && password !== confirmPassword) {
            showNotification('Passwords do not match', 'error');
            return;
        }

        if (password.length < 6) {
            showNotification('Password must be at least 6 characters long', 'error');
            return;
        }

        // Proceed with authentication
        authenticateUser(email, rememberMe);
    }

    function handleGoogleAuth() {
        console.log('Handling Google authentication');
        showNotification('Google authentication initiated...', 'info');
        
        // Simulate Google auth delay
        setTimeout(() => {
            authenticateUser('user@gmail.com', false);
        }, 1500);
    }

    function handleAppleAuth() {
        console.log('Handling Apple authentication');
        showNotification('Apple ID authentication initiated...', 'info');
        
        // Simulate Apple auth delay
        setTimeout(() => {
            authenticateUser('user@icloud.com', false);
        }, 1500);
    }

    function authenticateUser(email, rememberMe) {
        console.log('Authenticating user:', email);
        
        // Show loading state
        if (submitBtn) {
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Authenticating...';
        }
        
        showNotification('Authenticating...', 'info');
        
        setTimeout(() => {
            // Set authentication status
            sessionStorage.setItem('roarThreadsAuth', 'true');
            sessionStorage.setItem('userEmail', email);
            
            if (rememberMe) {
                localStorage.setItem('roarThreadsRememberMe', 'true');
                showNotification('Login credentials saved for 2 days', 'success');
            }
            
            isAuthenticated = true;
            console.log('Authentication successful');
            
            showNotification('Welcome to Roar Threads!', 'success');
            
            // Reset button state
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = signinTab.classList.contains('active') ? 'Sign In' : 'Sign Up';
            }
            
            // Smooth transition to homepage
            setTimeout(() => {
                showHomepage();
                setupHomepageListeners(); // Setup homepage listeners after showing
                console.log('Redirected to homepage');
            }, 1000);
            
        }, 1200);
    }

    function handleLogout() {
        console.log('Logging out user');
        
        sessionStorage.removeItem('roarThreadsAuth');
        sessionStorage.removeItem('userEmail');
        localStorage.removeItem('roarThreadsRememberMe');
        
        isAuthenticated = false;
        cartItems = [];
        cartCount = 0;
        updateCartUI();
        
        showNotification('Logged out successfully', 'info');
        showAuthPage();
        
        // Reset auth form
        if (authForm) {
            authForm.reset();
        }
        switchToSignIn();
    }

    function setupProductListeners() {
        // Add to cart buttons
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productCard = e.target.closest('.product-card');
                if (productCard) {
                    addToCart(productCard);
                }
            });
        });

        // Quick view buttons
        document.querySelectorAll('.quick-view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productCard = e.target.closest('.product-card');
                if (productCard) {
                    showProductModal(productCard);
                }
            });
        });

        // Product card clicks (for quick view)
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', () => {
                showProductModal(card);
            });
        });
    }

    function addToCart(productCard) {
        const nameEl = productCard.querySelector('h4');
        const priceEl = productCard.querySelector('.price');
        const imageEl = productCard.querySelector('img');
        
        if (!nameEl || !priceEl || !imageEl) {
            console.error('Product card missing required elements');
            return;
        }
        
        const productName = nameEl.textContent;
        const productPrice = priceEl.textContent;
        const productImage = imageEl.src;
        const productId = productCard.dataset.product || productName.toLowerCase().replace(/\s+/g, '-');

        // Check if item already exists in cart
        const existingItem = cartItems.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
            showNotification(`Increased ${productName} quantity in cart`, 'success');
        } else {
            const cartItem = {
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: 1
            };
            
            cartItems.push(cartItem);
            showNotification(`${productName} added to cart!`, 'success');
        }
        
        cartCount += 1;
        updateCartUI();
        console.log('Added to cart:', productName, 'Total items:', cartCount);
    }

    function updateCartUI() {
        if (cartCountElement) {
            cartCountElement.textContent = cartCount;
            cartCountElement.style.display = cartCount > 0 ? 'flex' : 'none';
        }
    }

    function showProductModal(productCard) {
        const nameEl = productCard.querySelector('h4');
        const priceEl = productCard.querySelector('.price');
        const imageEl = productCard.querySelector('img');
        
        if (!nameEl || !priceEl || !imageEl) {
            console.error('Product card missing required elements for modal');
            return;
        }
        
        const productName = nameEl.textContent;
        const productPrice = priceEl.textContent;
        const productImage = imageEl.src;
        
        // Populate modal content
        const modalName = document.getElementById('modal-product-name');
        const modalPrice = document.getElementById('modal-product-price');
        const modalImage = document.getElementById('modal-product-image');
        
        if (modalName) modalName.textContent = productName;
        if (modalPrice) modalPrice.textContent = productPrice;
        if (modalImage) {
            modalImage.src = productImage;
            modalImage.alt = productName;
        }
        
        // Show modal
        if (productModal) {
            productModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            console.log('Product modal opened for:', productName);
        }
    }

    function setupModalListeners() {
        const closeModalBtn = document.querySelector('.close-modal');
        const addToCartModalBtn = document.querySelector('.add-to-cart-modal');
        
        // Close modal button
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', closeModal);
        }
        
        // Close modal on outside click
        if (productModal) {
            productModal.addEventListener('click', (e) => {
                if (e.target === productModal) {
                    closeModal();
                }
            });
        }
        
        // ESC key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && productModal && !productModal.classList.contains('hidden')) {
                closeModal();
            }
        });
        
        // Add to cart from modal
        if (addToCartModalBtn) {
            addToCartModalBtn.addEventListener('click', () => {
                const modalName = document.getElementById('modal-product-name');
                const modalPrice = document.getElementById('modal-product-price');
                const modalImage = document.getElementById('modal-product-image');
                const sizeSelect = document.querySelector('.size-selector select');
                
                if (!modalName || !modalPrice || !modalImage) {
                    console.error('Modal elements not found');
                    return;
                }
                
                const productName = modalName.textContent;
                const productPrice = modalPrice.textContent;
                const productImage = modalImage.src;
                const selectedSize = sizeSelect ? sizeSelect.value : 'M';
                
                const cartItem = {
                    id: productName.toLowerCase().replace(/\s+/g, '-') + '-' + selectedSize,
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    size: selectedSize,
                    quantity: 1
                };
                
                cartItems.push(cartItem);
                cartCount += 1;
                updateCartUI();
                
                showNotification(`${productName} (Size ${selectedSize}) added to cart!`, 'success');
                closeModal();
            });
        }
    }

    function closeModal() {
        if (productModal) {
            productModal.classList.add('hidden');
            document.body.style.overflow = 'auto';
            console.log('Product modal closed');
        }
    }

    function setupCartListeners() {
        const cartBtn = document.querySelector('.cart-btn');
        if (cartBtn) {
            cartBtn.addEventListener('click', () => {
                if (cartItems.length === 0) {
                    showNotification('Your cart is empty', 'info');
                    return;
                }
                
                // Show cart contents
                const itemsText = cartItems.map(item => 
                    `${item.name} ${item.size ? '(Size ' + item.size + ')' : ''} - ${item.price} (x${item.quantity})`
                ).join('\n');
                
                showNotification(`Cart: ${cartCount} items`, 'info');
                console.log('Cart contents:', cartItems);
            });
        }
    }

    function handleNewsletterSignup(e) {
        e.preventDefault();
        const emailInput = e.target.querySelector('input[type="email"]');
        
        if (!emailInput) {
            showNotification('Email input not found', 'error');
            return;
        }
        
        const email = emailInput.value.trim();
        
        if (!email) {
            showNotification('Please enter your email address', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Simulate newsletter signup
        showNotification('Subscribing...', 'info');
        
        setTimeout(() => {
            showNotification('Welcome to the club! Check your email for your 15% discount code.', 'success');
            e.target.reset();
        }, 1500);
    }

    function handleSearch(e) {
        const query = e.target.value.toLowerCase().trim();
        
        if (query.length < 2) return;
        
        // Simple search simulation
        const searchTerms = ['dress', 'blazer', 'handbag', 'coat', 'shoes', 'watch', 'silk', 'cashmere', 'leather', 'wool'];
        const suggestions = searchTerms.filter(term => term.includes(query));
        
        console.log('Search suggestions:', suggestions);
    }

    function handleSearchSubmit(query) {
        const trimmedQuery = query.trim();
        
        if (!trimmedQuery) {
            showNotification('Please enter a search term', 'info');
            return;
        }
        
        showNotification(`Searching for "${trimmedQuery}"...`, 'info');
        
        // Simulate search results
        setTimeout(() => {
            const resultCount = Math.floor(Math.random() * 20) + 5;
            showNotification(`Found ${resultCount} items for "${trimmedQuery}"`, 'success');
        }, 1000);
    }

    function setupNavigationListeners() {
        // Navigation menu links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const category = e.target.textContent;
                showNotification(`Browsing ${category} collection...`, 'info');
                
                // Scroll to collections section
                const collectionsSection = document.querySelector('.collections');
                if (collectionsSection) {
                    collectionsSection.scrollIntoView({ 
                        behavior: 'smooth' 
                    });
                }
            });
        });

        // Collection cards
        document.querySelectorAll('.collection-card').forEach(card => {
            card.addEventListener('click', () => {
                const nameEl = card.querySelector('h3');
                if (nameEl) {
                    const collectionName = nameEl.textContent;
                    showNotification(`Exploring ${collectionName}...`, 'info');
                }
            });
        });

        // Promotional banners
        document.querySelectorAll('.promo-card').forEach(card => {
            card.addEventListener('click', () => {
                const titleEl = card.querySelector('h4');
                if (titleEl) {
                    const promoTitle = titleEl.textContent;
                    showNotification(`Learn more about ${promoTitle}`, 'info');
                }
            });
        });
    }

    function startCountdownTimer() {
        const countdownElement = document.getElementById('countdown');
        if (!countdownElement) return;
        
        let timeLeft = 47 * 3600 + 32 * 60 + 15; // 47:32:15 in seconds
        
        const timer = setInterval(() => {
            const hours = Math.floor(timeLeft / 3600);
            const minutes = Math.floor((timeLeft % 3600) / 60);
            const seconds = timeLeft % 60;
            
            countdownElement.textContent = 
                `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                countdownElement.textContent = 'EXPIRED';
                showNotification('Limited Edition offer has expired!', 'warning');
            }
            
            timeLeft--;
        }, 1000);
    }

    function showNotification(message, type = 'info') {
        console.log(`Notification (${type}):`, message);
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 20px',
            borderRadius: '8px',
            color: 'white',
            fontSize: '14px',
            fontWeight: '500',
            zIndex: '10000',
            maxWidth: '300px',
            wordWrap: 'break-word',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            cursor: 'pointer'
        });
        
        // Set background color based on type
        const colors = {
            success: '#27ae60',
            error: '#e74c3c',
            warning: '#f39c12',
            info: '#3498db'
        };
        
        notification.style.backgroundColor = colors[type] || colors.info;
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove after 4 seconds
        const removeNotification = () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        };
        
        setTimeout(removeNotification, 4000);
        
        // Click to dismiss
        notification.addEventListener('click', removeNotification);
    }

    // Initialize scroll animations when homepage is shown
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe elements for scroll animations
        document.querySelectorAll('.collection-card, .product-card, .review-card, .usp-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    // Initialize scroll animations when page loads
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
        
        if (!homepage.classList.contains('hidden')) {
            initScrollAnimations();
        }
    });

    console.log('Roar Threads app script loaded');
});