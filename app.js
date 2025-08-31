// Roar Threads Authentication System
let currentMode = 'login';
let isSubmitting = false;

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('🦁 Roar Threads Auth System Loading...');
    setupEventListeners();
    checkCachedAuth();
    console.log('✅ Auth System Ready');
});

function setupEventListeners() {
    // Toggle buttons
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            switchMode(this.getAttribute('data-mode'));
        });
    });

    // Form submission
    const authForm = document.getElementById('auth-form');
    authForm.addEventListener('submit', function(e) {
        e.preventDefault();
        if (!isSubmitting) {
            handleFormSubmit();
        }
    });

    // Social login buttons
    document.getElementById('google-login').addEventListener('click', function(e) {
        e.preventDefault();
        handleSocialLogin('google');
    });

    document.getElementById('apple-login').addEventListener('click', function(e) {
        e.preventDefault();
        handleSocialLogin('apple');
    });

    // Modal continue button
    document.getElementById('continue-btn').addEventListener('click', function(e) {
        e.preventDefault();
        redirectToHomepage();
    });

    // Form validation on blur
    document.getElementById('email').addEventListener('blur', validateEmail);
    document.getElementById('password').addEventListener('blur', validatePassword);
    document.getElementById('confirm-password').addEventListener('blur', validateConfirmPassword);

    // Clear errors on input
    document.getElementById('email').addEventListener('input', function() {
        clearError('email-error');
    });
    document.getElementById('password').addEventListener('input', function() {
        clearError('password-error');
        if (currentMode === 'signup') {
            document.getElementById('password-requirements').style.display = 'block';
        }
    });
    document.getElementById('confirm-password').addEventListener('input', function() {
        clearError('confirm-password-error');
    });

    // Modal backdrop click
    document.getElementById('success-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
}

function switchMode(mode) {
    if (currentMode === mode) return;
    
    currentMode = mode;
    console.log('Switching to mode:', mode);
    
    // Update toggle buttons
    document.querySelectorAll('.toggle-btn').forEach(btn => {
        if (btn.getAttribute('data-mode') === mode) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Update UI text
    const isSignup = mode === 'signup';
    document.getElementById('auth-title').textContent = isSignup ? 'Join Roar Threads' : 'Welcome Back';
    document.getElementById('auth-subtitle').textContent = isSignup 
        ? 'Create your account to access exclusive fashion collections'
        : 'Sign in to access your exclusive fashion collection';
    
    document.querySelector('#submit-btn .btn-text').textContent = isSignup ? 'Create Account' : 'Sign In';
    
    // Show/hide confirm password
    const confirmGroup = document.getElementById('confirm-password-group');
    const requirements = document.getElementById('password-requirements');
    
    if (isSignup) {
        confirmGroup.style.display = 'block';
    } else {
        confirmGroup.style.display = 'none';
        requirements.style.display = 'none';
    }

    // Clear form
    clearAllErrors();
    document.getElementById('auth-form').reset();
}

function validateEmail() {
    const email = document.getElementById('email').value.trim();
    const errorEl = document.getElementById('email-error');
    
    if (!email) {
        showError('email-error', 'Email is required');
        return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('email-error', 'Please enter a valid email address');
        return false;
    }
    
    clearError('email-error');
    return true;
}

function validatePassword() {
    const password = document.getElementById('password').value;
    const errorEl = document.getElementById('password-error');
    
    if (!password) {
        showError('password-error', 'Password is required');
        return false;
    }
    
    if (currentMode === 'signup') {
        if (password.length < 8) {
            showError('password-error', 'Password must be at least 8 characters');
            return false;
        }
        if (!/[A-Z]/.test(password)) {
            showError('password-error', 'Password must contain uppercase letter');
            return false;
        }
        if (!/[a-z]/.test(password)) {
            showError('password-error', 'Password must contain lowercase letter');
            return false;
        }
        if (!/\d/.test(password)) {
            showError('password-error', 'Password must contain a number');
            return false;
        }
    }
    
    clearError('password-error');
    return true;
}

function validateConfirmPassword() {
    if (currentMode !== 'signup') return true;
    
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    if (!confirmPassword) {
        showError('confirm-password-error', 'Please confirm your password');
        return false;
    }
    
    if (password !== confirmPassword) {
        showError('confirm-password-error', 'Passwords do not match');
        return false;
    }
    
    clearError('confirm-password-error');
    return true;
}

function showError(elementId, message) {
    const errorEl = document.getElementById(elementId);
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.style.display = 'block';
    }
}

function clearError(elementId) {
    const errorEl = document.getElementById(elementId);
    if (errorEl) {
        errorEl.textContent = '';
    }
}

function clearAllErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(el => {
        el.textContent = '';
    });
}

async function handleFormSubmit() {
    console.log('Form submitted');
    
    // Validate all fields
    const emailValid = validateEmail();
    const passwordValid = validatePassword();
    const confirmValid = validateConfirmPassword();
    
    if (!emailValid || !passwordValid || !confirmValid) {
        console.log('Validation failed');
        return;
    }
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    
    if (!email || !password) {
        showError('email-error', 'Please fill in all required fields');
        return;
    }
    
    isSubmitting = true;
    showLoadingState(true);
    
    try {
        // Simulate API call
        await simulateAuthRequest(email, password);
        
        // Cache credentials
        cacheCredentials(email);
        
        // Show success modal
        showSuccessModal();
        
    } catch (error) {
        showError('email-error', error.message || 'Authentication failed');
    } finally {
        isSubmitting = false;
        showLoadingState(false);
    }
}

async function simulateAuthRequest(email, password) {
    console.log('Simulating auth request...');
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Simple validation for demo
    if (email && password.length >= 3) {
        console.log('Auth successful');
        return { success: true, user: { email } };
    } else {
        throw new Error('Invalid credentials');
    }
}

async function handleSocialLogin(provider) {
    console.log('Social login:', provider);
    
    const button = document.getElementById(`${provider}-login`);
    const originalContent = button.innerHTML;
    
    // Show loading state
    button.disabled = true;
    button.innerHTML = `
        <div class="loading-spinner" style="display: inline-block; margin-right: 8px;"></div>
        Connecting to ${provider === 'google' ? 'Google' : 'Apple ID'}...
    `;
    
    try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Simulate successful login
        const email = `user@${provider === 'google' ? 'gmail.com' : 'icloud.com'}`;
        cacheCredentials(email);
        showSuccessModal();
        
    } catch (error) {
        showError('email-error', `Failed to connect with ${provider}`);
    } finally {
        button.disabled = false;
        button.innerHTML = originalContent;
    }
}

function showLoadingState(loading) {
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const spinner = submitBtn.querySelector('.loading-spinner');
    
    if (loading) {
        submitBtn.disabled = true;
        btnText.textContent = currentMode === 'signup' ? 'Creating Account...' : 'Signing In...';
        spinner.style.display = 'inline-block';
    } else {
        submitBtn.disabled = false;
        btnText.textContent = currentMode === 'signup' ? 'Create Account' : 'Sign In';
        spinner.style.display = 'none';
    }
}

function cacheCredentials(email) {
    const authData = {
        email: email,
        timestamp: Date.now(),
        expiry: Date.now() + (2 * 24 * 60 * 60 * 1000), // 2 days
        mode: currentMode
    };
    
    try {
        localStorage.setItem('roarThreadsAuth', JSON.stringify(authData));
        console.log('✅ Credentials cached for 2 days');
    } catch (error) {
        console.warn('Could not cache credentials:', error);
    }
}

function checkCachedAuth() {
    try {
        const cached = localStorage.getItem('roarThreadsAuth');
        if (cached) {
            const authData = JSON.parse(cached);
            
            if (Date.now() < authData.expiry) {
                console.log('✅ Found valid cached credentials');
                setTimeout(() => {
                    showSuccessModal(true, authData.email);
                }, 1000);
                return;
            } else {
                console.log('⏰ Cached credentials expired');
                localStorage.removeItem('roarThreadsAuth');
            }
        }
    } catch (error) {
        console.warn('Error checking cache:', error);
        localStorage.removeItem('roarThreadsAuth');
    }
}

function showSuccessModal(fromCache = false, cachedEmail = '') {
    console.log('Showing success modal');
    
    const modal = document.getElementById('success-modal');
    const modalBody = modal.querySelector('.modal-body');
    
    if (fromCache) {
        modalBody.innerHTML = `
            <p>Welcome back! You're already signed in${cachedEmail ? ` as ${cachedEmail}` : ''}.</p>
            <p>Your session is still valid. Redirecting to your exclusive fashion collection...</p>
        `;
    } else {
        const actionText = currentMode === 'signup' ? 'created your account' : 'signed in';
        modalBody.innerHTML = `
            <p>Welcome to Roar Threads! You have successfully ${actionText}.</p>
            <p>Your credentials have been saved securely for 2 days.</p>
            <p>Redirecting to your exclusive fashion collection...</p>
        `;
    }
    
    modal.classList.remove('hidden');
    
    // Auto redirect after 4 seconds
    setTimeout(() => {
        redirectToHomepage();
    }, 4000);
}

function closeModal() {
    document.getElementById('success-modal').classList.add('hidden');
}

function redirectToHomepage() {
    alert('Success! In a real application, you would now be redirected to the Roar Threads homepage. Your login credentials have been securely cached for 2 days.');
    closeModal();
    
    // Reset form for demo
    document.getElementById('auth-form').reset();
    clearAllErrors();
    switchMode('login');
}

// Utility functions for testing
function clearCache() {
    localStorage.removeItem('roarThreadsAuth');
    console.log('🧹 Authentication cache cleared');
}

function viewCache() {
    const cached = localStorage.getItem('roarThreadsAuth');
    if (cached) {
        console.log('📦 Cached data:', JSON.parse(cached));
    } else {
        console.log('📦 No cached data found');
    }
}

// Make functions available globally for testing
window.clearCache = clearCache;
window.viewCache = viewCache;