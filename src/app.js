/**
 * Main Application Module
 * Orchestrates all components and manages application lifecycle
 */

class GurujiApp {
    constructor() {
        this.initialized = false;
        this.ready = false;
    }

    /**
     * Initialize the application
     */
    async init() {
        try {
            console.log('🔮 Initializing Guruji Hastrekha Admin Dashboard...');

            // Initialize storage
            console.log('📦 Initializing storage...');
            await storage.init();

            // Initialize authentication
            console.log('🔐 Initializing authentication...');
            const isLoggedIn = await auth.init();

            // Initialize UI
            console.log('🎨 Initializing UI...');
            ui.init();

            // Initialize rule engine
            console.log('⚙️ Initializing rule engine...');
            await ruleEngine.init();

            this.initialized = true;

            // If already logged in, show dashboard
            if (isLoggedIn) {
                ui._showDashboard();
            }

            this.ready = true;
            console.log('✅ Guruji Hastrekha initialized successfully!');

            // Listen for OpenCV to load
            this._initOpenCV();

        } catch (error) {
            console.error('❌ Application initialization failed:', error);
            ui.showError('आवेदन प्रारंभ करने में विफल: ' + error.message);
        }
    }

    /**
     * Initialize OpenCV.js loading
     */
    _initOpenCV() {
        // Check if OpenCV is loading
        if (typeof cv !== 'undefined' && cv.onRuntimeInitialized !== undefined) {
            cv.onRuntimeInitialized = () => {
                console.log('✅ OpenCV.js loaded successfully');
                preprocessor.opencvReady = true;
            };
        } else {
            // Poll for OpenCV
            const checkInterval = setInterval(() => {
                if (typeof cv !== 'undefined' && cv.onRuntimeInitialized !== undefined) {
                    console.log('✅ OpenCV.js available');
                    clearInterval(checkInterval);
                }
            }, 100);

            // Timeout after 30 seconds
            setTimeout(() => {
                clearInterval(checkInterval);
                if (!preprocessor.opencvReady) {
                    console.warn('⚠️ OpenCV.js may not be fully loaded. Some features may be limited.');
                }
            }, 30000);
        }
    }

    /**
     * Handle page visibility changes
     */
    handleVisibilityChange() {
        if (!document.hidden) {
            // Page is visible - refresh session if needed
            if (auth.isLoggedIn() && !auth._validateSessionToken(auth._getSessionToken())) {
                console.log('Session expired, redirecting to login...');
                auth.logout();
                ui._showLoginScreen();
            }
        }
    }

    /**
     * Handle before unload
     */
    handleBeforeUnload() {
        // Save any pending data
        // Currently not needed as we save immediately
    }

    /**
     * Get application state
     */
    getState() {
        return {
            initialized: this.initialized,
            ready: this.ready,
            isLoggedIn: auth.isLoggedIn(),
            currentUser: auth.currentUser,
            currentView: ui.currentView,
        };
    }

    /**
     * Log application info
     */
    logAppInfo() {
        console.log('🔮 Guruji Hastrekha Admin Dashboard');
        console.log('📱 Offline-first Application');
        console.log('💾 Storage: IndexedDB');
        console.log('🔐 Authentication: PBKDF2 Password Hashing');
        console.log('🖼️ Image Processing: OpenCV.js');
        console.log('📊 Rule Engine: JSON-based');
        console.log('📄 PDF Generation: pdf-lib');
        console.log('🌍 Deployment: GitHub Pages Compatible');
        console.log('---');
        console.log('State:', this.getState());
    }
}

// Create global app instance
const app = new GurujiApp();

// Application startup
document.addEventListener('DOMContentLoaded', async () => {
    console.log('📄 DOM Content Loaded');
    await app.init();
    app.logAppInfo();
});

// Handle visibility changes
document.addEventListener('visibilitychange', () => {
    app.handleVisibilityChange();
});

// Handle before unload
window.addEventListener('beforeunload', () => {
    app.handleBeforeUnload();
});

// Global error handler
window.addEventListener('error', (event) => {
    console.error('Global Error:', event.error);
    // Don't show error to user for all errors, only if app is ready
    if (app.ready) {
        ui.showError('एक त्रुटि हुई।');
    }
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise Rejection:', event.reason);
    // Don't show to user
    event.preventDefault();
});
