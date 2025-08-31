// Application State Management
class RoarThreadsApp {
    constructor() {
        this.currentUser = null;
        this.cart = [];
        this.wishlist = [];
        this.isAuthenticated = false;
        
        // Ensure DOM is fully loaded before initialization
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        // Check for existing session
        this.checkAuthState();
        
        // Initialize event listeners
        this.initAuthEventListeners();
        this.initHomepageEventListeners();
        
        // Show appropriate page
        this.showAppropriateView();
        
        // Debug log to confirm initialization
        console.log('Roar Threads App initialized');
    }

    checkAuthState() {
        const sessionData = localStorage.getItem('roarThreadsSession');
        if (sessionData) {
            try {
                const session = JSON.parse(sessionData);
                const now = new Date().getTime();
                
                // Check if session is still valid (2 days = 172800000 milliseconds)
                if (now - session.timestamp < 172800000) {
                    this.isAuthenticated = true;
                    this.currentUser = session.user;
                    this.loadUserData();
                } else {
                    // Session expired
                    localStorage.removeItem('roarThreadsSession');
                    localStorage.removeItem('roarThreadsCart');
                    localStorage.removeItem('roarThreadsWishlist');
                }
            } catch (e) {
                console.error('Error parsing session data:', e);
                localStorage.removeItem('roarThreadsSession');
            }
        }
    }

    showAppropriateView() {
        const authPage = document.getElementById('auth-page');
        const homepage = document.getElementById('homepage');
        
        if (authPage && homepage) {
            if (this.isAuthenticated) {
                authPage.classList.add('hidden');
                homepage.classList.remove('hidden');
            } else {
                authPage.classList.remove('hidden');
                homepage.classList.add('hidden');
            }
        }
    }

    setAuthenticatedUser(userData) {
        this.isAuthenticated = true;
        this.currentUser = userData;
        
        // Save session to localStorage
        const sessionData = {
            user: userData,
            timestamp: new Date().getTime()
        };
        localStorage.setItem('roarThreadsSession', JSON.stringify(sessionData));
        
        this.showAppropriateView();
        this.showSuccessMessage('Welcome to Roar Threads! You have been successfully logged in.');
    }

    logout() {
        this.isAuthenticated = false;
        this.currentUser = null;
        this.cart = [];
        this.wishlist = [];
        
        // Clear localStorage
        localStorage.removeItem('roarThreadsSession');
        localStorage.removeItem('roarThreadsCart');
        localStorage.removeItem('roarThreadsWishlist');
        
        this.showAppropriateView();
        this.showSuccessMessage('You have been successfully logged out.');
    }

    loadUserData() {
        // Load cart and wishlist from localStorage
        const cartData = localStorage.getItem('roarThreadsCart');
        const wishlistData = localStorage.getItem('roarThreadsWishlist');
        
        if (cartData) {
            try {
                this.cart = JSON.parse(cartData);
                this.updateCartBadge();
            } catch (e) {
                console.error('Error parsing cart data:', e);
                this.cart = [];
            }
        }
        
        if (wishlistData) {
            try {
                this.wishlist = JSON.parse(wishlistData);
                this.updateWishlistBadge();
            } catch (e) {
                console.error('Error parsing wishlist data:', e);
                this.wishlist = [];
            }
        }
    }

    saveUserData() {
        localStorage.setItem('roarThreadsCart', JSON.stringify(this.cart));
        localStorage.setItem('roarThreadsWishlist', JSON.stringify(this.wishlist));
    }

    updateCartBadge() {
        const badge = document.querySelector('#cart-btn .badge');
        if (badge) {
            badge.textContent = this.cart.length;
        }
    }

    updateWishlistBadge() {
        const badge = document.querySelector('#wishlist-btn .badge');
        if (badge) {
            badge.textContent = this.wishlist.length;
        }
    }

    showSuccessMessage(message) {
        this.showToast(message, 'success');
    }

    showErrorMessage(message) {
        this.showToast(message, 'error');
    }

    showToast(message, type = 'info') {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-message">${message}</span>
                <button class="toast-close">&times;</button>
            </div>
        `;

        // Add toast styles if not already present
        if (!document.querySelector('#toast-styles')) {
            const style = document.createElement('style');
            style.id = 'toast-styles';
            style.textContent = `
                .toast {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: var(--color-surface);
                    border: 1px solid var(--color-border);
                    border-radius: var(--radius-lg);
                    padding: var(--space-16);
                    box-shadow: var(--shadow-lg);
                    z-index: 10000;
                    transform: translateX(100%);
                    transition: transform var(--duration-normal) var(--ease-standard);
                    max-width: 400px;
                }
                .toast.show {
                    transform: translateX(0);
                }
                .toast--success {
                    border-left: 4px solid var(--color-success);
                }
                .toast--error {
                    border-left: 4px solid var(--color-error);
                }
                .toast--info {
                    border-left: 4px solid var(--color-info);
                }
                .toast-content {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: var(--space-12);
                }
                .toast-message {
                    color: var(--color-text);
                    font-size: var(--font-size-sm);
                }
                .toast-close {
                    background: none;
                    border: none;
                    color: var(--color-text-secondary);
                    cursor: pointer;
                    font-size: var(--font-size-lg);
                    padding: 0;
                    line-height: 1;
                }
                .toast-close:hover {
                    color: var(--color-text);
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(toast);

        // Show toast
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        // Auto-hide after 5 seconds
        const autoHide = setTimeout(() => {
            this.hideToast(toast);
        }, 5000);

        // Close button functionality
        const closeBtn = toast.querySelector('.toast-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                clearTimeout(autoHide);
                this.hideToast(toast);
            });
        }
    }

    hideToast(toast) {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }

    initAuthEventListeners() {
        console.log('Initializing auth event listeners');
        
        // Toggle between login and signup forms
        const toggleBtns = document.querySelectorAll('.toggle-btn');
        toggleBtns.forEach(btn => {
            // Remove existing listeners to avoid duplicates
            btn.removeEventListener('click', this.handleToggleClick);
            
            // Add click listener
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const formType = btn.getAttribute('data-form') || btn.dataset.form;
                console.log('Form toggle clicked:', formType);
                this.switchAuthForm(formType);
            });
        });

        // Login form submission
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log('Login form submitted');
                this.handleLogin(e);
            });
        }

        // Signup form submission
        const signupForm = document.getElementById('signup-form');
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log('Signup form submitted');
                this.handleSignup(e);
            });
        }

        // Social login buttons - login form
        const googleLoginBtn = document.getElementById('google-login');
        if (googleLoginBtn) {
            googleLoginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Google login clicked');
                this.handleSocialLogin('google');
            });
        }

        const appleLoginBtn = document.getElementById('apple-login');
        if (appleLoginBtn) {
            appleLoginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Apple login clicked');
                this.handleSocialLogin('apple');
            });
        }

        // Social signup buttons - signup form
        const googleSignupBtn = document.getElementById('google-signup');
        if (googleSignupBtn) {
            googleSignupBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Google signup clicked');
                this.handleSocialLogin('google');
            });
        }

        const appleSignupBtn = document.getElementById('apple-signup');
        if (appleSignupBtn) {
            appleSignupBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Apple signup clicked');
                this.handleSocialLogin('apple');
            });
        }

        // Real-time form validation
        const formControls = document.querySelectorAll('.form-control');
        formControls.forEach(input => {
            // Ensure input can be focused and typed in
            input.addEventListener('click', () => {
                input.focus();
            });
            
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });

        // Fix password field type
        const passwordInputs = document.querySelectorAll('input[type="password"]');
        passwordInputs.forEach(input => {
            input.setAttribute('type', 'password');
        });
    }

    initHomepageEventListeners() {
        console.log('Initializing homepage event listeners');
        
        // User menu toggle
        const userMenuBtn = document.getElementById('user-menu-btn');
        const userDropdown = document.getElementById('user-dropdown');
        
        if (userMenuBtn && userDropdown) {
            userMenuBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('User menu clicked');
                userDropdown.classList.toggle('hidden');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!userMenuBtn.contains(e.target) && !userDropdown.contains(e.target)) {
                    userDropdown.classList.add('hidden');
                }
            });
        }

        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Logout clicked');
                this.logout();
            });
        }

        // Search functionality
        const searchBtn = document.querySelector('.search-btn');
        const searchInput = document.querySelector('.search-input');

        if (searchBtn) {
            searchBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const query = searchInput ? searchInput.value.trim() : '';
                console.log('Search clicked:', query);
                if (query) {
                    this.handleSearch(query);
                } else {
                    this.showErrorMessage('Please enter a search term.');
                }
            });
        }

        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const query = e.target.value.trim();
                    console.log('Search enter pressed:', query);
                    if (query) {
                        this.handleSearch(query);
                    }
                }
            });

            // Ensure search input can be clicked and typed in
            searchInput.addEventListener('click', () => {
                searchInput.focus();
            });
        }

        // Newsletter form
        const newsletterForm = document.getElementById('newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log('Newsletter form submitted');
                this.handleNewsletterSignup(e);
            });
        }

        // Ensure newsletter input is clickable
        const newsletterInput = document.querySelector('.newsletter-input');
        if (newsletterInput) {
            newsletterInput.addEventListener('click', () => {
                newsletterInput.focus();
            });
        }

        // Cart and wishlist buttons
        const cartBtn = document.getElementById('cart-btn');
        const wishlistBtn = document.getElementById('wishlist-btn');

        if (cartBtn) {
            cartBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Cart clicked');
                this.showCart();
            });
        }

        if (wishlistBtn) {
            wishlistBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Wishlist clicked');
                this.showWishlist();
            });
        }

        // Navigation menu links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const linkText = e.target.textContent;
                console.log('Navigation link clicked:', linkText);
                this.showSuccessMessage(`Navigating to ${linkText} collection...`);
            });
        });

        // Collection and product buttons - using event delegation
        document.addEventListener('click', (e) => {
            // Hero CTA button
            if (e.target.matches('.hero-cta') || e.target.closest('.hero-cta')) {
                e.preventDefault();
                console.log('Hero CTA clicked');
                this.handleShopCollection();
            }
            
            // Collection explore buttons
            if (e.target.matches('.collection-overlay .btn') || e.target.closest('.collection-overlay .btn')) {
                e.preventDefault();
                const collectionCard = e.target.closest('.collection-card');
                if (collectionCard) {
                    const collectionName = collectionCard.querySelector('h3').textContent;
                    console.log('Collection explore clicked:', collectionName);
                    this.handleExploreCollection(collectionName);
                }
            }

            // Banner sale button
            if (e.target.matches('.primary-banner .btn') || e.target.closest('.primary-banner .btn')) {
                e.preventDefault();
                console.log('Sale banner clicked');
                this.handleShopSale();
            }

            // Footer links
            if (e.target.matches('.footer-column a')) {
                e.preventDefault();
                const linkText = e.target.textContent;
                console.log('Footer link clicked:', linkText);
                this.showSuccessMessage(`Navigating to ${linkText}...`);
            }

            // Social links
            if (e.target.matches('.social-links a') || e.target.closest('.social-links a')) {
                e.preventDefault();
                console.log('Social link clicked');
                this.showSuccessMessage('Opening social media page...');
            }

            // Terms and privacy links
            if (e.target.matches('a[href="#"]')) {
                e.preventDefault();
                const linkText = e.target.textContent;
                console.log('Link clicked:', linkText);
                this.showSuccessMessage(`Opening ${linkText}...`);
            }
        });

        // Navigation menu hover effects
        const dropdownItems = document.querySelectorAll('.has-dropdown');
        dropdownItems.forEach(item => {
            let hoverTimeout;
            
            item.addEventListener('mouseenter', () => {
                clearTimeout(hoverTimeout);
                const megaMenu = item.querySelector('.mega-menu');
                if (megaMenu) {
                    megaMenu.style.opacity = '1';
                    megaMenu.style.visibility = 'visible';
                    megaMenu.style.transform = 'translateX(-50%) translateY(0)';
                }
            });

            item.addEventListener('mouseleave', () => {
                hoverTimeout = setTimeout(() => {
                    const megaMenu = item.querySelector('.mega-menu');
                    if (megaMenu) {
                        megaMenu.style.opacity = '0';
                        megaMenu.style.visibility = 'hidden';
                        megaMenu.style.transform = 'translateX(-50%) translateY(-10px)';
                    }
                }, 150);
            });
        });
    }

    switchAuthForm(formType) {
        console.log('Switching to form:', formType);
        
        const loginForm = document.getElementById('login-form');
        const signupForm = document.getElementById('signup-form');
        const toggleBtns = document.querySelectorAll('.toggle-btn');

        if (!loginForm || !signupForm) {
            console.error('Forms not found');
            return;
        }

        // Update toggle buttons
        toggleBtns.forEach(btn => {
            btn.classList.remove('active');
            const btnFormType = btn.getAttribute('data-form') || btn.dataset.form;
            if (btnFormType === formType) {
                btn.classList.add('active');
            }
        });

        // Switch forms
        if (formType === 'login') {
            loginForm.classList.add('active');
            loginForm.style.display = 'block';
            signupForm.classList.remove('active');
            signupForm.style.display = 'none';
        } else if (formType === 'signup') {
            signupForm.classList.add('active');
            signupForm.style.display = 'block';
            loginForm.classList.remove('active');
            loginForm.style.display = 'none';
        }

        // Clear any existing errors
        this.clearAllErrors();
    }

    validateField(field) {
        const fieldId = field.id;
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Clear previous error
        this.clearFieldError(field);

        switch (fieldId) {
            case 'login-email':
            case 'signup-email':
                if (!value) {
                    errorMessage = 'Email is required';
                    isValid = false;
                } else if (!this.isValidEmail(value)) {
                    errorMessage = 'Please enter a valid email address';
                    isValid = false;
                }
                break;

            case 'login-password':
                if (!value) {
                    errorMessage = 'Password is required';
                    isValid = false;
                }
                break;

            case 'signup-password':
                if (!value) {
                    errorMessage = 'Password is required';
                    isValid = false;
                } else if (value.length < 8) {
                    errorMessage = 'Password must be at least 8 characters long';
                    isValid = false;
                }
                break;

            case 'signup-confirm':
                const signupPassword = document.getElementById('signup-password');
                const signupPasswordValue = signupPassword ? signupPassword.value : '';
                if (!value) {
                    errorMessage = 'Please confirm your password';
                    isValid = false;
                } else if (value !== signupPasswordValue) {
                    errorMessage = 'Passwords do not match';
                    isValid = false;
                }
                break;

            case 'signup-name':
                if (!value) {
                    errorMessage = 'Full name is required';
                    isValid = false;
                } else if (value.length < 2) {
                    errorMessage = 'Name must be at least 2 characters long';
                    isValid = false;
                }
                break;
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showFieldError(field, message) {
        const errorElement = document.getElementById(field.id + '-error');
        if (errorElement) {
            errorElement.textContent = message;
        }
        field.style.borderColor = 'var(--color-error)';
    }

    clearFieldError(field) {
        const errorElement = document.getElementById(field.id + '-error');
        if (errorElement) {
            errorElement.textContent = '';
        }
        field.style.borderColor = '';
    }

    clearAllErrors() {
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(error => {
            error.textContent = '';
        });
        
        const formControls = document.querySelectorAll('.form-control');
        formControls.forEach(field => {
            field.style.borderColor = '';
        });
    }

    handleLogin(e) {
        const form = e.target;
        const emailInput = form.querySelector('#login-email');
        const passwordInput = form.querySelector('#login-password');
        
        if (!emailInput || !passwordInput) {
            this.showErrorMessage('Form fields not found. Please refresh the page.');
            return;
        }
        
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        console.log('Processing login for:', email);

        // Validate fields
        const emailValid = this.validateField(emailInput);
        const passwordValid = this.validateField(passwordInput);

        if (!emailValid || !passwordValid) {
            this.showErrorMessage('Please fix the errors above and try again.');
            return;
        }

        // Simulate login process
        this.showLoadingState(form);

        setTimeout(() => {
            // Simulate successful login
            const userData = {
                email: email,
                name: email.split('@')[0], // Use part before @ as name
                loginMethod: 'email'
            };

            this.setAuthenticatedUser(userData);
            this.hideLoadingState(form);
        }, 1500);
    }

    handleSignup(e) {
        const form = e.target;
        const nameInput = form.querySelector('#signup-name');
        const emailInput = form.querySelector('#signup-email');
        const passwordInput = form.querySelector('#signup-password');
        const confirmInput = form.querySelector('#signup-confirm');
        const termsCheck = form.querySelector('#terms-check');
        
        if (!nameInput || !emailInput || !passwordInput || !confirmInput || !termsCheck) {
            this.showErrorMessage('Form fields not found. Please refresh the page.');
            return;
        }
        
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const confirmPassword = confirmInput.value.trim();
        const termsChecked = termsCheck.checked;

        console.log('Processing signup for:', email);

        // Validate all fields
        const nameValid = this.validateField(nameInput);
        const emailValid = this.validateField(emailInput);
        const passwordValid = this.validateField(passwordInput);
        const confirmValid = this.validateField(confirmInput);

        if (!termsChecked) {
            this.showErrorMessage('Please accept the Terms of Service and Privacy Policy.');
            return;
        }

        if (!nameValid || !emailValid || !passwordValid || !confirmValid) {
            this.showErrorMessage('Please fix the errors above and try again.');
            return;
        }

        // Simulate signup process
        this.showLoadingState(form);

        setTimeout(() => {
            // Simulate successful signup
            const userData = {
                email: email,
                name: name,
                loginMethod: 'email'
            };

            this.setAuthenticatedUser(userData);
            this.hideLoadingState(form);
        }, 2000);
    }

    handleSocialLogin(provider) {
        this.showSuccessMessage(`Redirecting to ${provider.charAt(0).toUpperCase() + provider.slice(1)}...`);
        
        // Simulate social login redirect
        setTimeout(() => {
            const userData = {
                email: `user@${provider}.com`,
                name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
                loginMethod: provider
            };

            this.setAuthenticatedUser(userData);
        }, 2000);
    }

    showLoadingState(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="loading-spinner">⟳</span> Please wait...';
        }
    }

    hideLoadingState(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = false;
            const isLogin = form.id === 'login-form';
            submitBtn.innerHTML = isLogin ? 'Sign In' : 'Create Account';
        }
    }

    handleSearch(query) {
        this.showSuccessMessage(`Searching for "${query}"...`);
        console.log('Search query:', query);
        // In a real app, this would trigger a search API call
    }

    handleNewsletterSignup(e) {
        const form = e.target;
        const emailInput = form.querySelector('.newsletter-input');
        
        if (!emailInput) {
            this.showErrorMessage('Newsletter input not found.');
            return;
        }
        
        const email = emailInput.value.trim();

        console.log('Newsletter signup for:', email);

        if (!email || !this.isValidEmail(email)) {
            this.showErrorMessage('Please enter a valid email address.');
            return;
        }

        // Simulate newsletter signup
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="loading-spinner">⟳</span> Subscribing...';
        }

        setTimeout(() => {
            this.showSuccessMessage('Welcome to the Roar Threads family! Check your email for your 15% discount code.');
            emailInput.value = '';
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Get 15% Off';
            }
        }, 1500);
    }

    handleShopCollection() {
        this.showSuccessMessage('Navigating to our luxury collection...');
        console.log('Shop Collection clicked');
    }

    handleExploreCollection(collectionName) {
        this.showSuccessMessage(`Exploring ${collectionName}...`);
        console.log('Explore collection:', collectionName);
    }

    handleShopSale() {
        this.showSuccessMessage('Navigating to sale items...');
        console.log('Shop Sale clicked');
    }

    showCart() {
        if (this.cart.length === 0) {
            this.showSuccessMessage('Your cart is empty. Start shopping to add items!');
        } else {
            this.showSuccessMessage(`You have ${this.cart.length} item(s) in your cart.`);
        }
        console.log('Cart:', this.cart);
    }

    showWishlist() {
        if (this.wishlist.length === 0) {
            this.showSuccessMessage('Your wishlist is empty. Add items you love!');
        } else {
            this.showSuccessMessage(`You have ${this.wishlist.length} item(s) in your wishlist.`);
        }
        console.log('Wishlist:', this.wishlist);
    }

    addToCart(item) {
        this.cart.push(item);
        this.updateCartBadge();
        this.saveUserData();
        this.showSuccessMessage(`${item.name} added to cart!`);
    }

    addToWishlist(item) {
        this.wishlist.push(item);
        this.updateWishlistBadge();
        this.saveUserData();
        this.showSuccessMessage(`${item.name} added to wishlist!`);
    }
}

// Initialize the application when DOM is loaded
let app = null;

function initializeApp() {
    if (!app) {
        console.log('DOM loaded, initializing app...');
        app = new RoarThreadsApp();
        window.roarThreadsApp = app;
    }
}

// Multiple initialization approaches to ensure compatibility
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Fallback initialization
setTimeout(initializeApp, 100);

// Handle page visibility change (for session management)
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && window.roarThreadsApp) {
        window.roarThreadsApp.checkAuthState();
    }
});

// Handle browser back/forward navigation
window.addEventListener('popstate', () => {
    if (window.roarThreadsApp) {
        window.roarThreadsApp.showAppropriateView();
    }
});

// Add loading spinner styles to head
const spinnerStyles = document.createElement('style');
spinnerStyles.textContent = `
    @keyframes loading-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    .loading-spinner {
        display: inline-block;
        animation: loading-spin 1s linear infinite;
    }
`;
document.head.appendChild(spinnerStyles);