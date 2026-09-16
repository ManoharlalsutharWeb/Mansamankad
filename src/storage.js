/**
 * Storage Module
 * Handles IndexedDB operations for auth, reports, and assets
 */

class StorageManager {
    constructor() {
        this.db = null;
        this.dbName = CONFIG.DATABASE.NAME;
        this.dbVersion = CONFIG.DATABASE.VERSION;
        this.stores = CONFIG.DATABASE.STORES;
    }

    /**
     * Initialize IndexedDB
     */
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = () => reject(new Error('Database initialization failed'));
            request.onsuccess = (event) => {
                this.db = event.target.result;
                this._initializeStores();
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Auth store
                if (!db.objectStoreNames.contains(this.stores.AUTH)) {
                    db.createObjectStore(this.stores.AUTH, { keyPath: 'id' });
                }

                // Reports store
                if (!db.objectStoreNames.contains(this.stores.REPORTS)) {
                    const reportStore = db.createObjectStore(this.stores.REPORTS, { keyPath: 'id' });
                    reportStore.createIndex('createdAt', 'createdAt', { unique: false });
                    reportStore.createIndex('name', 'name', { unique: false });
                }

                // Assets store
                if (!db.objectStoreNames.contains(this.stores.ASSETS)) {
                    db.createObjectStore(this.stores.ASSETS, { keyPath: 'id' });
                }
            };
        });
    }

    /**
     * Ensure stores exist on initialization
     */
    _initializeStores() {
        if (!this.db.objectStoreNames.contains(this.stores.AUTH)) {
            console.warn('Auth store not found, will be created on next version upgrade');
        }
    }

    /**
     * Get value from store
     */
    async get(storeName, key) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.get(key);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Put value in store
     */
    async put(storeName, value) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.put(value);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Delete value from store
     */
    async delete(storeName, key) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.delete(key);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Clear entire store
     */
    async clear(storeName) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.clear();

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Get all items from store
     */
    async getAll(storeName) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Query by index
     */
    async queryByIndex(storeName, indexName, value) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const index = store.index(indexName);
            const request = index.getAll(value);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // ============= AUTH STORAGE =============

    /**
     * Save auth data (hash + salt)
     */
    async saveAuthData(username, passwordHash, salt, iterations) {
        const authData = {
            id: 'admin',
            username,
            passwordHash,
            salt,
            iterations,
            createdAt: new Date().toISOString(),
        };
        return this.put(this.stores.AUTH, authData);
    }

    /**
     * Get auth data
     */
    async getAuthData() {
        return this.get(this.stores.AUTH, 'admin');
    }

    /**
     * Delete auth data
     */
    async deleteAuthData() {
        return this.delete(this.stores.AUTH, 'admin');
    }

    // ============= REPORT STORAGE =============

    /**
     * Save report
     */
    async saveReport(report) {
        const reportData = {
            id: report.id || this._generateId(),
            name: report.name,
            clientName: report.clientName,
            clientDOB: report.clientDOB || null,
            clientTime: report.clientTime || null,
            handSelection: report.handSelection,
            timelineRange: report.timelineRange,
            features: report.features,
            predictions: report.predictions,
            images: report.images || {},
            pdfBlob: report.pdfBlob || null,
            createdAt: report.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        return this.put(this.stores.REPORTS, reportData);
    }

    /**
     * Get report
     */
    async getReport(reportId) {
        return this.get(this.stores.REPORTS, reportId);
    }

    /**
     * Get all reports
     */
    async getAllReports() {
        return this.getAll(this.stores.REPORTS);
    }

    /**
     * Delete report
     */
    async deleteReport(reportId) {
        return this.delete(this.stores.REPORTS, reportId);
    }

    /**
     * Clear all reports
     */
    async clearAllReports() {
        return this.clear(this.stores.REPORTS);
    }

    // ============= ASSET STORAGE =============

    /**
     * Save asset (logo crop settings, etc.)
     */
    async saveAsset(assetId, assetData) {
        const asset = {
            id: assetId,
            data: assetData,
            updatedAt: new Date().toISOString(),
        };
        return this.put(this.stores.ASSETS, asset);
    }

    /**
     * Get asset
     */
    async getAsset(assetId) {
        return this.get(this.stores.ASSETS, assetId);
    }

    /**
     * Delete asset
     */
    async deleteAsset(assetId) {
        return this.delete(this.stores.ASSETS, assetId);
    }

    // ============= UTILITY =============

    /**
     * Generate unique ID
     */
    _generateId() {
        return `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Export all data as JSON
     */
    async exportAllData() {
        const auth = await this.getAuthData();
        const reports = await this.getAllReports();
        
        return {
            version: this.dbVersion,
            exportedAt: new Date().toISOString(),
            auth: auth || null,
            reports: reports || [],
        };
    }

    /**
     * Clear everything
     */
    async clearAll() {
        await this.clear(this.stores.AUTH);
        await this.clear(this.stores.REPORTS);
        await this.clear(this.stores.ASSETS);
    }
}

// Create global instance
const storage = new StorageManager();
