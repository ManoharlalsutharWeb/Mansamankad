/**
 * Image Preprocessing Module
 * Handles image loading, resizing, enhancement, and edge detection
 */

class ImagePreprocessor {
    constructor() {
        this.opencvReady = false;
    }

    /**
     * Check if OpenCV.js is loaded
     */
    isReady() {
        return typeof cv !== 'undefined' && cv.getBuildInformation !== undefined;
    }

    /**
     * Wait for OpenCV to load
     */
    async waitForOpenCV(timeout = 30000) {
        const startTime = Date.now();
        while (!this.isReady()) {
            if (Date.now() - startTime > timeout) {
                throw new Error(t('ERRORS.OPENCV_NOT_LOADED'));
            }
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        this.opencvReady = true;
    }

    /**
     * Load image from file
     */
    async loadImageFromFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    try {
                        const canvas = document.createElement('canvas');
                        canvas.width = img.width;
                        canvas.height = img.height;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0);
                        
                        const mat = cv.imread(canvas);
                        resolve({ mat, canvas, originalImage: img });
                    } catch (error) {
                        reject(new Error(t('ERRORS.IMAGE_PROCESSING_ERROR')));
                    }
                };
                img.onerror = () => reject(new Error(t('ERRORS.INVALID_IMAGE')));
                img.src = event.target.result;
            };
            
            reader.onerror = () => reject(new Error(t('ERRORS.FILE_UPLOAD_ERROR')));
            reader.readAsDataURL(file);
        });
    }

    /**
     * Resize image
     */
    resize(src, maxWidth = CONFIG.IMAGE_PROCESSING.MAX_WIDTH) {
        const dst = new cv.Mat();
        let height = src.rows;
        let width = src.cols;

        if (width > maxWidth) {
            const scale = maxWidth / width;
            width = maxWidth;
            height = Math.round(height * scale);
        }

        cv.resize(src, dst, new cv.Size(width, height), 0, 0, cv.INTER_LINEAR);
        return dst;
    }

    /**
     * Convert to grayscale
     */
    toGrayscale(src) {
        const dst = new cv.Mat();
        
        if (src.channels() === 4) {
            cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
        } else if (src.channels() === 3) {
            cv.cvtColor(src, dst, cv.COLOR_RGB2GRAY);
        } else {
            src.copyTo(dst);
        }
        
        return dst;
    }

    /**
     * Enhance contrast using CLAHE (Contrast Limited Adaptive Histogram Equalization)
     */
    enhanceContrast(src) {
        const dst = new cv.Mat();
        const clahe = cv.createCLAHE(2.0, new cv.Size(8, 8));
        clahe.apply(src, dst);
        clahe.delete();
        return dst;
    }

    /**
     * Denoise using bilateral filter
     */
    denoise(src) {
        const dst = new cv.Mat();
        cv.bilateralFilter(src, dst, 9, 75, 75);
        return dst;
    }

    /**
     * Detect edges using Canny
     */
    detectEdges(src) {
        const dst = new cv.Mat();
        const blurred = new cv.Mat();
        
        // Blur to reduce noise
        cv.GaussianBlur(src, blurred, new cv.Size(5, 5), 1.5);
        
        // Canny edge detection
        cv.Canny(blurred, dst, 50, 150);
        
        blurred.delete();
        return dst;
    }

    /**
     * Morphological operations to close/open edges
     */
    morphologicalClose(src, kernelSize = 5) {
        const dst = new cv.Mat();
        const kernel = cv.getStructuringElement(cv.MORPH_ELLIPSE, new cv.Size(kernelSize, kernelSize));
        
        cv.morphologyEx(src, dst, cv.MORPH_CLOSE, kernel);
        
        kernel.delete();
        return dst;
    }

    /**
     * Find palm region (largest contour)
     */
    findPalmRegion(src) {
        const contours = new cv.MatVector();
        const hierarchy = new cv.Mat();
        
        // Find contours
        cv.findContours(src, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
        
        let largestContourIdx = -1;
        let largestArea = 0;
        
        for (let i = 0; i < contours.size(); i++) {
            const area = cv.contourArea(contours.get(i));
            if (area > largestArea) {
                largestArea = area;
                largestContourIdx = i;
            }
        }
        
        const result = {
            contourIndex: largestContourIdx,
            area: largestArea,
            contours: contours,
            hierarchy: hierarchy,
        };
        
        return result;
    }

    /**
     * Estimate image quality
     */
    estimateQuality(grayscale, edges) {
        // Quality metrics:
        // 1. Contrast (standard deviation of pixel values)
        // 2. Edge density (ratio of edge pixels to total pixels)
        // 3. Size (larger = better, normalized)

        const stats = cv.mean(grayscale);
        const meanVal = stats[0];
        const variance = this._calculateVariance(grayscale);
        const stddev = Math.sqrt(variance);

        // Normalize contrast (0-255 scale)
        const contrastScore = Math.min(stddev / 128, 1.0);

        // Edge density
        const totalPixels = edges.rows * edges.cols;
        let edgePixels = 0;
        
        for (let i = 0; i < edges.data8U.length; i++) {
            if (edges.data8U[i] > 0) {
                edgePixels++;
            }
        }
        
        const edgeDensity = Math.min(edgePixels / totalPixels / 0.15, 1.0);

        // Size factor (prefer larger images)
        const sizeFactor = Math.min(Math.sqrt(totalPixels) / 600, 1.0);

        // Combine scores with weights
        const qualityScore = (contrastScore * 0.4 + edgeDensity * 0.4 + sizeFactor * 0.2);

        return {
            quality: Math.round(qualityScore * 100) / 100,
            contrast: Math.round(contrastScore * 100),
            edgeDensity: Math.round(edgeDensity * 100),
            size: Math.round(sizeFactor * 100),
        };
    }

    /**
     * Calculate variance of pixel values
     */
    _calculateVariance(src) {
        const mean = cv.mean(src);
        const meanVal = mean[0];
        
        let variance = 0;
        const data = src.data8U;
        
        for (let i = 0; i < data.length; i++) {
            const diff = data[i] - meanVal;
            variance += diff * diff;
        }
        
        variance /= data.length;
        return variance;
    }

    /**
     * Full preprocessing pipeline
     */
    async preprocess(file) {
        try {
            await this.waitForOpenCV();

            // Load image
            const { mat: original, canvas } = await this.loadImageFromFile(file);

            // Resize
            const resized = this.resize(original);

            // Convert to grayscale
            const gray = this.toGrayscale(resized);

            // Enhance contrast
            const enhanced = this.enhanceContrast(gray);

            // Denoise
            const denoised = this.denoise(enhanced);

            // Detect edges
            const edges = this.detectEdges(denoised);

            // Morphological operations
            const closed = this.morphologicalClose(edges);

            // Estimate quality
            const quality = this.estimateQuality(gray, closed);

            // Create output canvas
            const outputCanvas = document.createElement('canvas');
            outputCanvas.width = resized.cols;
            outputCanvas.height = resized.rows;
            cv.imshow(outputCanvas, gray);

            // Clean up
            original.delete();
            resized.delete();
            gray.delete();
            enhanced.delete();
            denoised.delete();
            edges.delete();
            closed.delete();

            return {
                success: true,
                canvas: outputCanvas,
                quality: quality,
                originalFile: file,
            };
        } catch (error) {
            console.error('Preprocessing failed:', error);
            return {
                success: false,
                error: error.message || t('ERRORS.IMAGE_PROCESSING_ERROR'),
            };
        }
    }

    /**
     * Convert canvas to blob
     */
    canvasToBlob(canvas, quality = 0.95) {
        return new Promise((resolve, reject) => {
            canvas.toBlob(
                blob => resolve(blob),
                'image/jpeg',
                quality
            );
        });
    }

    /**
     * Convert canvas to data URL
     */
    canvasToDataURL(canvas, quality = 0.95) {
        return canvas.toDataURL('image/jpeg', quality);
    }
}

// Create global instance
const preprocessor = new ImagePreprocessor();
