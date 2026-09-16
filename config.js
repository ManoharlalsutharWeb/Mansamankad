/**
 * Configuration Module
 * Centralized configuration for the Guruji Hastrekha Admin Dashboard
 */

const CONFIG = {
    // Admin Credentials
    ADMIN_USERNAME: 'Admin',
    ADMIN_DEFAULT_PASSWORD: 'Guruji@1379',
    
    // PBKDF2 Settings
    PBKDF2: {
        iterations: 100000,
        keyLength: 32,
        algorithm: 'SHA-256',
    },

    // Image Processing
    IMAGE_PROCESSING: {
        MAX_WIDTH: 1200,
        MAX_HEIGHT: 1200,
        JPEG_QUALITY: 0.9,
    },

    // Feature Extraction
    FEATURES: {
        MIN_CONFIDENCE: 0.5,
        MIN_QUALITY: 0.3,
    },

    // PDF Report
    PDF: {
        PAGE_SIZE: 'A4',
        MARGIN: { top: 10, bottom: 10, left: 10, right: 10 }, // mm
        FONT_SIZE_TITLE: 24,
        FONT_SIZE_HEADING: 14,
        FONT_SIZE_BODY: 11,
        FONT_SIZE_SMALL: 9,
    },

    // Timeline Options
    TIMELINE_RANGES: [5, 10, 15, 20], // years

    // Database
    DATABASE: {
        NAME: 'GurujiHastrekha',
        VERSION: 1,
        STORES: {
            AUTH: 'auth',
            REPORTS: 'reports',
            ASSETS: 'assets',
        },
    },

    // UI
    UI: {
        MODAL_FADE_DURATION: 300, // ms
        ANIMATION_DURATION: 300, // ms
    },

    // Rules Engine
    RULES: {
        MIN_PRIORITY: 0,
        MAX_PRIORITY: 100,
        CATEGORIES: [
            'education',
            'marriage',
            'children',
            'career',
            'business',
            'money',
            'health',
            'overall',
        ],
    },

    // Branding
    BRANDING: {
        APP_NAME: 'Guruji Hastrekha Admin Dashboard',
        APP_TITLE: 'Guruji Hastrekha',
        LOGO_PATH: 'assets/guruji-logo.png',
        LOGO_SQUARE_PATH: 'assets/guruji-logo-square.png',
        LOGO_PLACEHOLDER_SVG: `data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 512 512%22%3E%3Ccircle cx=%22256%22 cy=%22256%22 r=%22250%22 fill=%22%23FF9A2F%22/%3E%3Ccircle cx=%22256%22 cy=%22200%22 r=%2260%22 fill=%22white%22/%3E%3Cellipse cx=%22256%22 cy=%22350%22 rx=%2270%22 ry=%2280%22 fill=%22white%22/%3E%3Ctext x=%22256%22 y=%22480%22 text-anchor=%22middle%22 font-size=%2240%22 fill=%22white%22 font-weight=%22bold%22%3E%E0%A4%97%E0%A5%81%E0%A4%B0%E0%A5%81%E0%A4%9C%E0%A5%80%3C/text%3E%3C/svg%3E`,
    },

    // Predictions Defaults
    PREDICTIONS: {
        DEFAULT_CONFIDENCE: 0.7,
        RANGE_BUFFER: 2, // years for marriage/children timing
    },
};

// Export for Node-like environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
