/**
 * UI Module
 * Manages all user interface interactions and screen rendering
 */

class UIManager {
    constructor() {
        this.currentView = 'login';
        this.currentScreen = 'login';
        this.reportData = null;
        this.images = {};
    }

    /**
     * Initialize UI
     */
    init() {
        this._attachEventListeners();
        this._showLoginScreen();
    }

    /**
     * Attach all event listeners
     */
    _attachEventListeners() {
        // Login form
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this._handleLogin();
        });

        // Navigation buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.target.dataset.view;
                this.switchView(view);
            });
        });

        // Logout
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this._handleLogout();
        });

        // Settings
        document.getElementById('settingsBtn').addEventListener('click', () => {
            this.switchView('settings');
        });

        // New Report Form
        document.getElementById('newReportForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this._handleReportFormSubmit();
        });

        // Hand selection change
        document.querySelectorAll('input[name="handType"]').forEach(radio => {
            radio.addEventListener('change', () => {
                this._updateImageUploadArea();
            });
        });

        // Image uploads
        this._attachImageUploadListeners();

        // Preview back button
        document.getElementById('previewBackBtn').addEventListener('click', () => {
            this.switchView('new-report');
        });

        // Generate PDF
        document.getElementById('generatePdfBtn').addEventListener('click', () => {
            this._handleGeneratePDF();
        });

        // Change password form
        document.getElementById('changePasswordForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this._handleChangePassword();
        });

        // Delete all data
        document.getElementById('deleteAllDataBtn').addEventListener('click', () => {
            this._handleDeleteAllData();
        });

        // Adjust logo (optional)
        document.getElementById('adjustLogoBtn').addEventListener('click', () => {
            this._showLogoCropModal();
        });

        // Modal close buttons
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.target.closest('.modal').style.display = 'none';
            });
        });
    }

    /**
     * Attach image upload listeners
     */
    _attachImageUploadListeners() {
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('file-input')) {
                this._handleImageUpload(e);
            }
        });
    }

    /**
     * Update image upload area based on hand selection
     */
    _updateImageUploadArea() {
        const handType = document.querySelector('input[name="handType"]:checked')?.value;
        const uploadArea = document.getElementById('imageUploadArea');
        
        uploadArea.innerHTML = '';

        if (handType === 'left') {
            uploadArea.innerHTML = `
                <div class="upload-slot" data-hand="single">
                    <input type="file" accept="image/*" class="file-input" id="palmImage">
                    <div class="upload-placeholder">
                        <p>बाएं हाथ की तस्वीर क्लिक करके चुनें</p>
                    </div>
                </div>
            `;
        } else if (handType === 'right') {
            uploadArea.innerHTML = `
                <div class="upload-slot" data-hand="single">
                    <input type="file" accept="image/*" class="file-input" id="palmImage">
                    <div class="upload-placeholder">
                        <p>दाएं हाथ की तस्वीर क्लिक करके चुनें</p>
                    </div>
                </div>
            `;
        } else if (handType === 'both') {
            uploadArea.innerHTML = `
                <div class="upload-slot" data-hand="left">
                    <input type="file" accept="image/*" class="file-input" id="palmImageLeft">
                    <div class="upload-placeholder">
                        <p>बाएं हाथ की तस्वीर</p>
                    </div>
                </div>
                <div class="upload-slot" data-hand="right">
                    <input type="file" accept="image/*" class="file-input" id="palmImageRight">
                    <div class="upload-placeholder">
                        <p>दाएं हाथ की तस्वीर</p>
                    </div>
                </div>
            `;
        }
        
        this._attachImageUploadListeners();
    }

    /**
     * Handle image upload
     */
    async _handleImageUpload(event) {
        const input = event.target;
        const file = input.files[0];

        if (!file) return;

        // Validate file
        if (!file.type.startsWith('image/')) {
            this.showError(t('ERRORS.INVALID_IMAGE'));
            return;
        }

        // Show loading
        this.showLoading(t('COMMON.PROCESSING'));

        try {
            // Store file
            const hand = input.id.includes('Left') ? 'left' : input.id.includes('Right') ? 'right' : 'single';
            this.images[hand] = file;

            // Show preview
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.className = 'upload-preview';

                const slot = input.closest('.upload-slot');
                const placeholder = slot.querySelector('.upload-placeholder');
                if (placeholder) {
                    placeholder.style.display = 'none';
                }

                const existing = slot.querySelector('.upload-preview');
                if (existing) {
                    existing.remove();
                }

                slot.appendChild(img);
                slot.classList.add('has-image');
            };
            reader.readAsDataURL(file);

            this.hideLoading();
        } catch (error) {
            this.hideLoading();
            this.showError(error.message || t('ERRORS.FILE_UPLOAD_ERROR'));
        }
    }

    /**
     * Handle report form submission
     */
    async _handleReportFormSubmit() {
        const clientName = document.getElementById('clientName').value.trim();
        const clientDOB = document.getElementById('clientDOB').value;
        const clientTime = document.getElementById('clientTime').value;
        const handType = document.querySelector('input[name="handType"]:checked')?.value;
        const timelineRange = parseInt(document.getElementById('timelineRange').value);

        // Validation
        if (!clientName) {
            this.showError(t('FORM.NAME_REQUIRED'));
            return;
        }

        if (!handType) {
            this.showError(t('FORM.HAND_REQUIRED'));
            return;
        }

        if (!timelineRange) {
            this.showError(t('FORM.TIMELINE_REQUIRED'));
            return;
        }

        // Check images
        const imageCount = Object.keys(this.images).length;
        const requiredImages = handType === 'both' ? 2 : 1;

        if (imageCount < requiredImages) {
            this.showError(t('FORM.IMAGE_REQUIRED'));
            return;
        }

        // Store report data
        this.reportData = {
            clientName,
            clientDOB,
            clientTime,
            handSelection: handType,
            timelineRange,
            createdAt: new Date().toISOString(),
        };

        // Process images and generate predictions
        await this._processImagesAndPredictions();
    }

    /**
     * Process images and generate predictions
     */
    async _processImagesAndPredictions() {
        this.showLoading(t('PREVIEW.GENERATING_PDF'));

        try {
            // Initialize if needed
            if (!preprocessor.opencvReady) {
                await preprocessor.waitForOpenCV();
            }
            if (!ruleEngine.rules || Object.keys(ruleEngine.rules).length === 0) {
                await ruleEngine.init();
            }

            // Extract features from images
            const featuresArray = [];
            const overlayCanvases = [];

            for (const [hand, file] of Object.entries(this.images)) {
                const result = await featuresExtractor.extractFeatures(file, hand);
                
                if (!result.success) {
                    throw new Error(result.error);
                }

                featuresArray.push(result.features);
                overlayCanvases.push(result.canvas);

                // Generate overlay
                const overlay = await overlayGenerator.generateOverlay(result.canvas, result.canvas);
                overlayCanvases.push(overlay);
            }

            // Generate predictions
            const predictions = await ruleEngine.generatePredictions(
                featuresArray.length === 1 ? featuresArray[0] : featuresArray,
                this.reportData.timelineRange
            );

            // Generate timeline
            const features = featuresArray.length === 1 ? featuresArray[0] : featuresArray[0];
            const timeline = timelineProjector.generateTimeline(features, this.reportData.timelineRange);

            // Store in report data
            this.reportData.features = featuresArray;
            this.reportData.predictions = predictions;
            this.reportData.timeline = timeline;
            this.reportData.overlayCanvases = overlayCanvases;

            // Display preview
            this._displayPreview(featuresArray, overlayCanvases, predictions);

            this.hideLoading();
            this.switchView('preview');
        } catch (error) {
            this.hideLoading();
            this.showError(error.message || t('ERRORS.IMAGE_PROCESSING_ERROR'));
        }
    }

    /**
     * Display preview
     */
    _displayPreview(features, overlays, predictions) {
        // Show original images
        const previewImagesDiv = document.getElementById('previewImages');
        previewImagesDiv.innerHTML = '';

        for (const [idx, file] of Object.entries(this.images)) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const card = document.createElement('div');
                card.className = 'image-card';
                card.innerHTML = `
                    <img src="${e.target.result}" alt="Palm image">
                    <div class="image-card-label">${this.reportData.handSelection === 'both' ? idx === '0' ? 'बाएं हाथ' : 'दाएं हाथ' : 'हथेली'}</div>
                `;
                previewImagesDiv.appendChild(card);
            };
            reader.readAsDataURL(file);
        }

        // Show overlays
        const previewOverlayDiv = document.getElementById('previewOverlay');
        previewOverlayDiv.innerHTML = '';

        for (const canvas of overlays) {
            const card = document.createElement('div');
            card.className = 'image-card';
            card.innerHTML = `
                <img src="${canvas.toDataURL()}" alt="Overlay">
                <div class="image-card-label">पंक्ति विश्लेषण</div>
            `;
            previewOverlayDiv.appendChild(card);
        }

        // Show quality scores
        const qualityDiv = document.getElementById('qualityScore');
        qualityDiv.innerHTML = '';

        for (const feature of features) {
            const item = document.createElement('div');
            item.className = 'score-item';
            item.innerHTML = `
                <div class="score-label">${feature.hand === 'left' ? 'बाएं हाथ' : feature.hand === 'right' ? 'दाएं हाथ' : 'गुणवत्ता'}</div>
                <div class="score-value">${Math.round(feature.confidence * 100)}</div>
                <div class="score-percentage">आत्मविश्वास</div>
            `;
            qualityDiv.appendChild(item);
        }
    }

    /**
     * Handle generate PDF
     */
    async _handleGeneratePDF() {
        const modal = document.getElementById('pdfProgressModal');
        modal.style.display = 'flex';

        try {
            // Prepare data
            const images = {};
            for (const [hand, file] of Object.entries(this.images)) {
                const reader = new FileReader();
                images[hand] = await new Promise((resolve) => {
                    reader.onload = (e) => resolve(e.target.result);
                    reader.readAsDataURL(file);
                });
            }

            document.getElementById('pdfStatus').textContent = 'PDF लाइब्रेरी लोड हो रही है...';
            document.getElementById('pdfProgress').style.width = '20%';

            // Generate PDF
            const pdfResult = await pdfGenerator.generateReport(
                this.reportData,
                this.reportData.features,
                this.reportData.predictions,
                this.reportData.timeline,
                images
            );

            if (!pdfResult.success) {
                throw new Error(pdfResult.error);
            }

            document.getElementById('pdfStatus').textContent = 'रिपोर्ट को संग्रहीत किया जा रहा है...';
            document.getElementById('pdfProgress').style.width = '90%';

            // Save to IndexedDB
            const reportId = `report_${Date.now()}`;
            this.reportData.id = reportId;
            this.reportData.pdfBlob = pdfResult.blob;

            await storage.saveReport(this.reportData);

            document.getElementById('pdfStatus').textContent = 'पूर्ण!';
            document.getElementById('pdfProgress').style.width = '100%';

            // Download PDF
            setTimeout(() => {
                this._downloadPDF(pdfResult.blob, `${this.reportData.clientName}_hastrekha.pdf`);
                modal.style.display = 'none';
                this.showSuccess(t('PREVIEW.PDF_GENERATED'));
            }, 500);
        } catch (error) {
            modal.style.display = 'none';
            this.showError(error.message || t('ERRORS.PDF_GENERATION_ERROR'));
        }
    }

    /**
     * Download PDF
     */
    _downloadPDF(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * Handle login
     */
    async _handleLogin() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (!username || !password) {
            this.showLoginError(t('LOGIN.INVALID_CREDENTIALS'));
            return;
        }

        this.showLoading(t('COMMON.LOADING'));

        try {
            const result = await auth.login(username, password);

            if (result.success) {
                this.hideLoading();
                this._showDashboard();
            } else {
                this.hideLoading();
                this.showLoginError(result.error);
            }
        } catch (error) {
            this.hideLoading();
            this.showLoginError(t('LOGIN.LOGIN_FAILED'));
        }
    }

    /**
     * Handle logout
     */
    _handleLogout() {
        if (confirm('क्या आप लॉगआउट करना चाहते हैं?')) {
            auth.logout();
            this.images = {};
            this.reportData = null;
            this._showLoginScreen();
        }
    }

    /**
     * Handle change password
     */
    async _handleChangePassword() {
        const current = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirm = document.getElementById('confirmPassword').value;

        if (!current || !newPassword || !confirm) {
            this.showError(t('COMMON.ERROR'));
            return;
        }

        if (newPassword !== confirm) {
            this.showError(t('SETTINGS.PASSWORD_MISMATCH'));
            return;
        }

        this.showLoading(t('COMMON.PROCESSING'));

        try {
            const result = await auth.changePassword(current, newPassword);

            this.hideLoading();
            
            if (result.success) {
                this.showSuccess(result.message);
                document.getElementById('changePasswordForm').reset();
            } else {
                this.showError(result.error);
            }
        } catch (error) {
            this.hideLoading();
            this.showError(t('COMMON.ERROR'));
        }
    }

    /**
     * Handle delete all data
     */
    async _handleDeleteAllData() {
        if (confirm(t('SETTINGS.DELETE_ALL_CONFIRM'))) {
            this.showLoading(t('COMMON.PROCESSING'));

            try {
                await storage.clearAll();
                this.hideLoading();
                this.showSuccess(t('SETTINGS.ALL_DATA_DELETED'));
                this.images = {};
                this.reportData = null;
            } catch (error) {
                this.hideLoading();
                this.showError(t('COMMON.ERROR'));
            }
        }
    }

    /**
     * Switch view
     */
    switchView(viewName) {
        // Hide all views
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });

        // Update nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.view === viewName) {
                btn.classList.add('active');
            }
        });

        // Show selected view
        const viewMap = {
            'new-report': 'newReportView',
            'history': 'historyView',
            'settings': 'settingsView',
            'preview': 'previewView',
        };

        const viewId = viewMap[viewName];
        if (viewId) {
            document.getElementById(viewId).classList.add('active');
        }

        if (viewName === 'history') {
            this._loadHistory();
        }
    }

    /**
     * Load history
     */
    async _loadHistory() {
        try {
            const reports = await storage.getAllReports();
            const historyDiv = document.getElementById('historyList');
            const emptyDiv = document.getElementById('historyEmpty');

            if (reports.length === 0) {
                historyDiv.style.display = 'none';
                emptyDiv.style.display = 'block';
            } else {
                historyDiv.style.display = 'grid';
                emptyDiv.style.display = 'none';
                historyDiv.innerHTML = '';

                for (const report of reports.reverse()) {
                    const item = document.createElement('div');
                    item.className = 'history-item';
                    
                    const date = new Date(report.createdAt).toLocaleDateString('hi-IN');
                    
                    item.innerHTML = `
                        <div class="history-item-info">
                            <h4>${report.clientName}</h4>
                            <p class="history-item-date">${date}</p>
                        </div>
                        <div class="history-item-actions">
                            <button class="btn btn-primary btn-sm" onclick="ui._downloadReportPDF('${report.id}')">डाउनलोड</button>
                            <button class="btn btn-danger btn-sm" onclick="ui._deleteReport('${report.id}')">हटाएं</button>
                        </div>
                    `;
                    historyDiv.appendChild(item);
                }
            }
        } catch (error) {
            console.error('Failed to load history:', error);
        }
    }

    /**
     * Download report PDF from history
     */
    async _downloadReportPDF(reportId) {
        try {
            const report = await storage.getReport(reportId);
            if (report && report.pdfBlob) {
                this._downloadPDF(report.pdfBlob, `${report.clientName}_hastrekha.pdf`);
            }
        } catch (error) {
            this.showError(t('COMMON.ERROR'));
        }
    }

    /**
     * Delete report
     */
    async _deleteReport(reportId) {
        if (confirm(t('HISTORY.DELETE_CONFIRM'))) {
            try {
                await storage.deleteReport(reportId);
                this._loadHistory();
                this.showSuccess(t('HISTORY.DELETED'));
            } catch (error) {
                this.showError(t('COMMON.ERROR'));
            }
        }
    }

    /**
     * Show login screen
     */
    _showLoginScreen() {
        document.getElementById('loginScreen').classList.add('active');
        document.getElementById('dashboardScreen').classList.remove('active');
        document.getElementById('username').focus();
    }

    /**
     * Show dashboard
     */
    _showDashboard() {
        document.getElementById('loginScreen').classList.remove('active');
        document.getElementById('dashboardScreen').classList.add('active');
        this.switchView('new-report');
        this._updateImageUploadArea();
    }

    /**
     * Show logo crop modal (optional feature)
     */
    _showLogoCropModal() {
        const modal = document.getElementById('logoCropModal');
        modal.style.display = 'flex';
        // Implementation for logo crop would go here
    }

    /**
     * UI helper methods
     */
    showLoading(text = t('COMMON.LOADING')) {
        document.getElementById('loadingText').textContent = text;
        document.getElementById('loadingIndicator').style.display = 'flex';
    }

    hideLoading() {
        document.getElementById('loadingIndicator').style.display = 'none';
    }

    showError(message) {
        const errorDiv = document.getElementById('loginError') || this._createMessageDiv();
        errorDiv.textContent = message;
        errorDiv.className = 'error-message';
        errorDiv.style.display = 'block';

        if (this.currentScreen === 'login') {
            document.getElementById('loginError').textContent = message;
        }

        setTimeout(() => {
            if (errorDiv.parentElement) {
                errorDiv.style.display = 'none';
            }
        }, 5000);
    }

    showSuccess(message) {
        const msgDiv = document.getElementById('passwordMessage') || this._createMessageDiv();
        msgDiv.textContent = message;
        msgDiv.className = 'message success';

        setTimeout(() => {
            if (msgDiv.parentElement) {
                msgDiv.classList.remove('success');
            }
        }, 5000);
    }

    _createMessageDiv() {
        const div = document.createElement('div');
        document.body.appendChild(div);
        return div;
    }
}

// Create global instance
const ui = new UIManager();
