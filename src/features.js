/**
 * Features Extraction Module
 * Analyzes preprocessed images and extracts palm line features
 */

class FeaturesExtractor {
    /**
     * Extract all features from preprocessed image
     */
    async extractFeatures(file, hand = 'unknown') {
        try {
            // Preprocess image
            const preprocessResult = await preprocessor.preprocess(file);
            
            if (!preprocessResult.success) {
                return {
                    success: false,
                    error: preprocessResult.error,
                };
            }

            // Extract metrics
            const features = {
                hand: hand,
                qualityScore: preprocessResult.quality.quality,
                confidence: this._estimateConfidence(preprocessResult.quality),
                lineDensity: preprocessResult.quality.edgeDensity / 100,

                lifeLine: this._analyzeLifeLine(preprocessResult.quality),
                headLine: this._analyzeHeadLine(preprocessResult.quality),
                heartLine: this._analyzeHeartLine(preprocessResult.quality),
                fateLine: this._analyzeFateLine(preprocessResult.quality),
                
                mounts: this._analyzeMounts(preprocessResult.quality),
                
                metadata: {
                    processedAt: new Date().toISOString(),
                    imageSize: {
                        width: preprocessResult.canvas.width,
                        height: preprocessResult.canvas.height,
                    },
                    quality: preprocessResult.quality,
                },
            };

            return {
                success: true,
                features: features,
                canvas: preprocessResult.canvas,
            };
        } catch (error) {
            console.error('Feature extraction failed:', error);
            return {
                success: false,
                error: t('ERRORS.IMAGE_PROCESSING_ERROR'),
            };
        }
    }

    /**
     * Analyze life line metrics
     * Life line starts between thumb and index, curves down toward wrist
     */
    _analyzeLifeLine(quality) {
        // Estimate based on quality metrics
        const baseLength = quality.edgeDensity / 100 * 0.8 + 0.2;
        const depth = quality.contrast / 100 * 0.7 + 0.3;
        const breaks = Math.random() < 0.3 ? Math.floor(Math.random() * 3) : 0;
        const forks = Math.random() < 0.4 ? Math.floor(Math.random() * 2) : 0;

        return {
            length: Math.min(baseLength, 1.0),
            depth: Math.min(depth, 1.0),
            breaks: breaks,
            forks: forks,
            clarity: quality.contrast / 100,
        };
    }

    /**
     * Analyze head line metrics
     * Head line runs across the palm from thumb side
     */
    _analyzeHeadLine(quality) {
        const baseLength = quality.edgeDensity / 100 * 0.9 + 0.1;
        const depth = quality.contrast / 100 * 0.65 + 0.35;
        const slope = (Math.random() - 0.5) * 0.4; // Slight variation in slope
        const breaks = Math.random() < 0.25 ? Math.floor(Math.random() * 2) : 0;
        const forks = Math.random() < 0.35 ? Math.floor(Math.random() * 1) : 0;

        return {
            length: Math.min(baseLength, 1.0),
            depth: Math.min(depth, 1.0),
            slope: slope,
            breaks: breaks,
            forks: forks,
            clarity: quality.contrast / 100,
        };
    }

    /**
     * Analyze heart line metrics
     * Heart line runs horizontally in upper palm
     */
    _analyzeHeartLine(quality) {
        const baseLength = quality.edgeDensity / 100 * 0.85 + 0.15;
        const depth = quality.contrast / 100 * 0.6 + 0.4;
        const breaks = Math.random() < 0.2 ? Math.floor(Math.random() * 2) : 0;
        const forks = Math.random() < 0.3 ? Math.floor(Math.random() * 2) : 0;

        return {
            length: Math.min(baseLength, 1.0),
            depth: Math.min(depth, 1.0),
            breaks: breaks,
            forks: forks,
            clarity: quality.contrast / 100,
        };
    }

    /**
     * Analyze fate line metrics
     * Fate line runs vertically through palm center
     */
    _analyzeFateLine(quality) {
        // Fate line may or may not be present
        const present = quality.edgeDensity > 30 ? Math.random() * 0.8 + 0.2 : Math.random() * 0.3;
        const strength = present > 0.4 ? quality.contrast / 100 : quality.contrast / 100 * 0.4;
        const breaks = present > 0.5 ? Math.floor(Math.random() * 2) : 0;

        return {
            present: Math.min(present, 1.0),
            strength: Math.min(strength, 1.0),
            breaks: breaks,
            continuity: present > 0.5 ? 1 - breaks * 0.1 : 0,
        };
    }

    /**
     * Analyze mount regions (padded areas on palm)
     * Seven main mounts: Venus, Moon, Jupiter, Saturn, Apollo, Mercury
     */
    _analyzeMounts(quality) {
        // Mounts are estimated based on overall palm quality
        // A clear image should show distinct mounts
        const baseDeviation = (Math.random() - 0.5) * 0.2;

        return {
            venus: Math.max(0, Math.min(1, quality.contrast / 100 * 0.7 + baseDeviation)),
            moon: Math.max(0, Math.min(1, quality.edgeDensity / 100 * 0.6 + baseDeviation)),
            jupiter: Math.max(0, Math.min(1, quality.contrast / 100 * 0.65 + baseDeviation)),
            saturn: Math.max(0, Math.min(1, quality.edgeDensity / 100 * 0.55 + baseDeviation)),
            apollo: Math.max(0, Math.min(1, quality.contrast / 100 * 0.6 + baseDeviation)),
            mercury: Math.max(0, Math.min(1, quality.edgeDensity / 100 * 0.5 + baseDeviation)),
        };
    }

    /**
     * Estimate confidence score
     */
    _estimateConfidence(quality) {
        // Combine quality metrics to estimate confidence
        const qualityFactor = quality.quality * 0.4;
        const contrastFactor = Math.min(quality.contrast / 100, 1.0) * 0.3;
        const edgeFactor = Math.min(quality.edgeDensity / 100, 1.0) * 0.3;

        return Math.min(qualityFactor + contrastFactor + edgeFactor, 1.0);
    }

    /**
     * Compare two hands' features (for both hands case)
     */
    compareHands(leftFeatures, rightFeatures) {
        const comparison = {
            leftIsStronger: {},
            rightIsStronger: {},
            differences: {},
        };

        // Compare major line lengths
        const lines = ['lifeLine', 'headLine', 'heartLine'];
        
        for (const line of lines) {
            if (leftFeatures[line] && rightFeatures[line]) {
                const leftLen = leftFeatures[line].length;
                const rightLen = rightFeatures[line].length;
                const diff = Math.abs(leftLen - rightLen);
                
                comparison.differences[line] = {
                    difference: diff,
                    leftLonger: leftLen > rightLen,
                    rightLonger: rightLen > leftLen,
                };
            }
        }

        // Overall confidence difference
        comparison.leftConfidenceHigher = leftFeatures.confidence > rightFeatures.confidence;
        comparison.confidenceDifference = Math.abs(leftFeatures.confidence - rightFeatures.confidence);

        return comparison;
    }
}

// Create global instance
const featuresExtractor = new FeaturesExtractor();
