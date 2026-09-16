/**
 * Authentication Module
 * Handles PBKDF2-based password hashing and verification
 */

class AuthManager {
    constructor() {
        this.isAuthenticated = false;
        this.currentUser = null;
    }

    /**
     * Initialize auth - check if user is logged in and handle first-run seed
     */
    async init() {
        try {
            await storage.init();
            const authData = await storage.getAuthData();

            if (!authData) {
                // First run - seed default admin credentials
                await this.seedDefaultAdmin();
            }

            // Check if there's an active session
            const sessionToken = this._getSessionToken();
            if (sessionToken && this._validateSessionToken(sessionToken)) {
                this.isAuthenticated = true;
                this.currentUser = CONFIG.ADMIN_USERNAME;
                return true;
            }

            return false;
        } catch (error) {
            console.error('Auth initialization failed:', error);
            return false;
        }
    }

    /**
     * Seed default admin on first run
     */
    async seedDefaultAdmin() {
        try {
            const password = CONFIG.ADMIN_DEFAULT_PASSWORD;
            const username = CONFIG.ADMIN_USERNAME;

            const { hash, salt } = await this.hashPassword(password);
            const iterations = CONFIG.PBKDF2.iterations;

            await storage.saveAuthData(username, hash, salt, iterations);
            console.log('Default admin seeded successfully');
        } catch (error) {
            console.error('Failed to seed default admin:', error);
            throw error;
        }
    }

    /**
     * Hash password using PBKDF2
     */
    async hashPassword(password) {
        // Generate random salt
        const salt = this._generateSalt();
        const iterations = CONFIG.PBKDF2.iterations;

        const encoded = new TextEncoder().encode(password);
        const saltBytes = this._hexToBytes(salt);

        // Use SubtleCrypto for PBKDF2
        const key = await crypto.subtle.importKey('raw', encoded, 'PBKDF2', false, ['deriveBits']);

        const bits = await crypto.subtle.deriveBits(
            {
                name: 'PBKDF2',
                hash: 'SHA-256',
                salt: saltBytes,
                iterations: iterations,
            },
            key,
            CONFIG.PBKDF2.keyLength * 8
        );

        const hash = this._bytesToHex(new Uint8Array(bits));

        return { hash, salt };
    }

    /**
     * Verify password against stored hash
     */
    async verifyPassword(password, storedHash, salt, iterations) {
        try {
            const encoded = new TextEncoder().encode(password);
            const saltBytes = this._hexToBytes(salt);

            const key = await crypto.subtle.importKey('raw', encoded, 'PBKDF2', false, ['deriveBits']);

            const bits = await crypto.subtle.deriveBits(
                {
                    name: 'PBKDF2',
                    hash: 'SHA-256',
                    salt: saltBytes,
                    iterations: iterations,
                },
                key,
                CONFIG.PBKDF2.keyLength * 8
            );

            const hash = this._bytesToHex(new Uint8Array(bits));
            return hash === storedHash;
        } catch (error) {
            console.error('Password verification failed:', error);
            return false;
        }
    }

    /**
     * Login with username and password
     */
    async login(username, password) {
        try {
            if (username !== CONFIG.ADMIN_USERNAME) {
                return { success: false, error: t('LOGIN.INVALID_CREDENTIALS') };
            }

            const authData = await storage.getAuthData();
            if (!authData) {
                return { success: false, error: t('LOGIN.LOGIN_FAILED') };
            }

            const isValid = await this.verifyPassword(
                password,
                authData.passwordHash,
                authData.salt,
                authData.iterations
            );

            if (!isValid) {
                return { success: false, error: t('LOGIN.INVALID_CREDENTIALS') };
            }

            // Create session
            this.isAuthenticated = true;
            this.currentUser = username;
            this._setSessionToken();

            return { success: true, user: username };
        } catch (error) {
            console.error('Login failed:', error);
            return { success: false, error: t('LOGIN.LOGIN_FAILED') };
        }
    }

    /**
     * Logout
     */
    logout() {
        this.isAuthenticated = false;
        this.currentUser = null;
        this._clearSessionToken();
    }

    /**
     * Change password
     */
    async changePassword(currentPassword, newPassword) {
        try {
            // Verify current password
            const authData = await storage.getAuthData();
            if (!authData) {
                return { success: false, error: t('SETTINGS.CURRENT_PASSWORD_INCORRECT') };
            }

            const isValid = await this.verifyPassword(
                currentPassword,
                authData.passwordHash,
                authData.salt,
                authData.iterations
            );

            if (!isValid) {
                return { success: false, error: t('SETTINGS.CURRENT_PASSWORD_INCORRECT') };
            }

            // Hash new password
            const { hash, salt } = await this.hashPassword(newPassword);
            const iterations = CONFIG.PBKDF2.iterations;

            await storage.saveAuthData(CONFIG.ADMIN_USERNAME, hash, salt, iterations);

            return { success: true, message: t('SETTINGS.PASSWORD_CHANGED') };
        } catch (error) {
            console.error('Change password failed:', error);
            return { success: false, error: t('COMMON.ERROR') };
        }
    }

    /**
     * Check if authenticated
     */
    isLoggedIn() {
        return this.isAuthenticated;
    }

    // ============= SESSION MANAGEMENT =============

    /**
     * Create session token
     */
    _setSessionToken() {
        const token = {
            user: this.currentUser,
            timestamp: Date.now(),
            hash: this._hashToken(`${this.currentUser}${Date.now()}`),
        };
        sessionStorage.setItem('guruji_session', JSON.stringify(token));
    }

    /**
     * Get session token
     */
    _getSessionToken() {
        const token = sessionStorage.getItem('guruji_session');
        return token ? JSON.parse(token) : null;
    }

    /**
     * Validate session token
     */
    _validateSessionToken(token) {
        if (!token) return false;
        
        // Session expires in 24 hours
        const maxAge = 24 * 60 * 60 * 1000;
        const now = Date.now();
        
        return (now - token.timestamp) < maxAge;
    }

    /**
     * Clear session token
     */
    _clearSessionToken() {
        sessionStorage.removeItem('guruji_session');
    }

    // ============= CRYPTO UTILITIES =============

    /**
     * Generate random salt (32 hex characters = 16 bytes)
     */
    _generateSalt() {
        const bytes = new Uint8Array(16);
        crypto.getRandomValues(bytes);
        return this._bytesToHex(bytes);
    }

    /**
     * Convert hex string to bytes
     */
    _hexToBytes(hex) {
        const bytes = new Uint8Array(hex.length / 2);
        for (let i = 0; i < hex.length; i += 2) {
            bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
        }
        return bytes;
    }

    /**
     * Convert bytes to hex string
     */
    _bytesToHex(bytes) {
        return Array.prototype.map.call(bytes, x => ('00' + x.toString(16)).slice(-2)).join('');
    }

    /**
     * Simple hash for session token
     */
    _hashToken(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(36);
    }
}

// Create global instance
const auth = new AuthManager();
