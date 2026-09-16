/**
 * Rule Engine Module
 * Applies rules to extracted features to generate predictions
 */

class RuleEngine {
    constructor() {
        this.rules = {};
        this.results = {};
    }

    /**
     * Initialize rule engine with rules from JSON files
     */
    async init() {
        try {
            // Load all rule files
            const ruleFiles = [
                'src/rules/00-core.json',
                'src/rules/10-education.json',
                'src/rules/20-marriage.json',
                'src/rules/30-children.json',
                'src/rules/40-career-job.json',
                'src/rules/50-business.json',
                'src/rules/60-money.json',
                'src/rules/70-health.json',
                'src/rules/80-timeline.json',
            ];

            this.rules = {};

            for (const file of ruleFiles) {
                try {
                    const response = await fetch(file);
                    if (response.ok) {
                        const rules = await response.json();
                        for (const rule of rules) {
                            if (!this.rules[rule.category]) {
                                this.rules[rule.category] = [];
                            }
                            this.rules[rule.category].push(rule);
                        }
                    }
                } catch (error) {
                    console.warn(`Failed to load rules from ${file}:`, error);
                }
            }

            console.log('Rules loaded:', Object.keys(this.rules));
            return true;
        } catch (error) {
            console.error('Failed to initialize rule engine:', error);
            return false;
        }
    }

    /**
     * Generate predictions from features
     */
    async generatePredictions(features, timelineRange = 10) {
        try {
            const predictions = {};

            // Initialize category predictions
            for (const category of CONFIG.RULES.CATEGORIES) {
                predictions[category] = this._generateCategoryPrediction(
                    category,
                    features,
                    timelineRange
                );
            }

            return predictions;
        } catch (error) {
            console.error('Prediction generation failed:', error);
            return this._getDefaultPredictions(timelineRange);
        }
    }

    /**
     * Generate prediction for a specific category
     */
    _generateCategoryPrediction(category, features, timelineRange) {
        const categoryRules = this.rules[category] || [];
        const matchedRules = [];
        let totalConfidence = 0;
        const outputs = [];

        // Apply rules
        for (const rule of categoryRules) {
            if (this._ruleMatches(rule, features)) {
                matchedRules.push(rule);
                totalConfidence += rule.weight || 0.5;
                
                if (rule.outputs && rule.outputs.text) {
                    outputs.push(rule.outputs.text);
                }
            }
        }

        // Calculate confidence
        const confidence = Math.min(totalConfidence / Math.max(1, matchedRules.length), 1.0);

        // Generate category-specific content
        const content = this._generateCategoryContent(category, features, confidence, timelineRange);

        return {
            category: category,
            title: content.title,
            summary: content.summary,
            details: outputs.length > 0 ? outputs.join('\n\n') : content.defaultDetails,
            recommendations: content.recommendations,
            confidence: Math.round(confidence * 100),
            timelineRange: timelineRange,
            tags: [...new Set(matchedRules.flatMap(r => r.tags || []))],
        };
    }

    /**
     * Check if a rule matches the features
     */
    _ruleMatches(rule, features) {
        if (!rule.when || rule.when.length === 0) {
            return true;
        }

        for (const condition of rule.when) {
            if (!this._evaluateCondition(condition, features)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Evaluate a single condition
     */
    _evaluateCondition(condition, features) {
        const { path, op, value } = condition;
        
        // Navigate to the value using path
        const actualValue = this._getValueByPath(path, features);
        
        if (actualValue === undefined) {
            return false;
        }

        // Evaluate operation
        switch (op) {
            case '>=': return actualValue >= value;
            case '>': return actualValue > value;
            case '<=': return actualValue <= value;
            case '<': return actualValue < value;
            case '==': return actualValue === value;
            case '!=': return actualValue !== value;
            default: return false;
        }
    }

    /**
     * Get value from object using dot notation path
     */
    _getValueByPath(path, obj) {
        const keys = path.split('.');
        let value = obj;

        for (const key of keys) {
            if (value && typeof value === 'object' && key in value) {
                value = value[key];
            } else {
                return undefined;
            }
        }

        return value;
    }

    /**
     * Generate default content for each category
     */
    _generateCategoryContent(category, features, confidence, timelineRange) {
        const templates = {
            education: {
                title: 'शिक्षा',
                summary: this._generateEducationSummary(features, confidence),
                defaultDetails: 'आपकी हस्तरेखा विश्लेषण के अनुसार शिक्षा क्षेत्र में संभावनाएं हैं।',
                recommendations: 'निरंतर सीखना और कौशल विकास पर ध्यान दें।',
            },
            marriage: {
                title: 'विवाह',
                summary: this._generateMarriageSummary(features, confidence, timelineRange),
                defaultDetails: 'विवाह संबंधी संभावनाएं आपकी हस्तरेखा में दिखाई देती हैं।',
                recommendations: 'सकारात्मक रिश्तों पर ध्यान केंद्रित करें।',
            },
            children: {
                title: 'संतान',
                summary: this._generateChildrenSummary(features, confidence, timelineRange),
                defaultDetails: 'संतान के संदर्भ में संभावनाएं आपकी विशेषताओं में परिलक्षित होती हैं।',
                recommendations: 'स्वास्थ्य और कल्याण पर ध्यान दें।',
            },
            career: {
                title: 'करियर/नौकरी',
                summary: this._generateCareerSummary(features, confidence),
                defaultDetails: 'आपकी करियर संभावनाएं सकारात्मक दिखाई देती हैं।',
                recommendations: 'कौशल विकास और नेटवर्किंग पर काम करें।',
            },
            business: {
                title: 'व्यापार',
                summary: this._generateBusinessSummary(features, confidence),
                defaultDetails: 'व्यापारिक उद्यम के लिए आपके में सकारात्मक संकेत हैं।',
                recommendations: 'सावधानीपूर्वक योजना और जोखिम प्रबंधन आवश्यक है।',
            },
            money: {
                title: 'धन/संपत्ति',
                summary: this._generateMoneySummary(features, confidence),
                defaultDetails: 'आर्थिक समृद्धि की संभावनाएं आपकी प्रोफाइल में दिखाई देती हैं।',
                recommendations: 'बुद्धिमानी से निवेश और बचत करें।',
            },
            health: {
                title: 'स्वास्थ्य/ऊर्जा/तनाव',
                summary: this._generateHealthSummary(features, confidence),
                defaultDetails: 'स्वास्थ्य और ऊर्जा स्तर आपकी विशेषताओं से जुड़े हैं।',
                recommendations: 'स्वस्थ जीवनशैली बनाए रखें, नियमित व्यायाम करें।',
            },
            overall: {
                title: 'समग्र सारांश',
                summary: this._generateOverallSummary(features, confidence),
                defaultDetails: 'आपकी हस्तरेखा विश्लेषण एक बहुआयामी प्रोफाइल दिखाता है।',
                recommendations: 'संतुलित जीवन और सकारात्मक दृष्टिकोण अपनाएं।',
            },
        };

        return templates[category] || {
            title: category,
            summary: '',
            defaultDetails: '',
            recommendations: '',
        };
    }

    // ============= CATEGORY-SPECIFIC GENERATORS =============

    _generateEducationSummary(features, confidence) {
        if (features.headLine && features.headLine.length > 0.7) {
            return `उच्च शिक्षा की संभावना: ${Math.round(confidence * 100)}%\nआपकी मस्तिष्क रेखा स्पष्ट और लंबी दिखती है, जो सीखने की क्षमता को दर्शाती है।`;
        }
        return `शिक्षा में प्रगति संभव है: ${Math.round(confidence * 100)}%`;
    }

    _generateMarriageSummary(features, confidence, timelineRange) {
        const startYear = new Date().getFullYear();
        const endYear = startYear + timelineRange;
        const marriageWindow = `${startYear + Math.floor(timelineRange * 0.3)} - ${startYear + Math.floor(timelineRange * 0.7)}`;
        
        return `विवाह की संभावना: ${marriageWindow}\nआत्मविश्वास: ${Math.round(confidence * 100)}%\nआपकी हृदय रेखा रिश्तों की स्थिरता दर्शाती है।`;
    }

    _generateChildrenSummary(features, confidence, timelineRange) {
        const childCount = Math.random() < 0.6 ? '1-2' : '2-3';
        const startYear = new Date().getFullYear() + Math.floor(timelineRange * 0.2);
        
        return `संतान की संख्या: ${childCount}\nसंभावित समय: ${startYear} के बाद\nआत्मविश्वास: ${Math.round(confidence * 100)}%`;
    }

    _generateCareerSummary(features, confidence) {
        const isFavorable = confidence > 0.6;
        return isFavorable
            ? `करियर में सफलता की संभावना: ${Math.round(confidence * 100)}%\nआपकी विशेषताएं पेशेवर विकास का संकेत देती हैं।`
            : `करियर विकास संभव है: ${Math.round(confidence * 100)}%\nप्रयास और निरंतरता आवश्यक है।`;
    }

    _generateBusinessSummary(features, confidence) {
        const success = Math.round(confidence * 100 * 0.8 + 20);
        const risk = 100 - success;
        return `व्यापार सफलता की संभावना: ${success}%\nजोखिम स्तर: ${risk}%\nआत्मविश्वास: ${Math.round(confidence * 100)}%`;
    }

    _generateMoneySummary(features, confidence) {
        if (features.mounts && features.mounts.mercury > 0.6) {
            return `आर्थिक लाभ की संभावना अच्छी है: ${Math.round(confidence * 100)}%\nव्यापार और वाणिज्य में सफलता के संकेत।`;
        }
        return `आर्थिक स्थिरता संभव है: ${Math.round(confidence * 100)}%`;
    }

    _generateHealthSummary(features, confidence) {
        const energyLevel = Math.round(confidence * 100 * 0.8 + 20);
        return `ऊर्जा स्तर: ${energyLevel}%\nतनाव सहन क्षमता: ${Math.round(confidence * 100)}%\nस्वास्थ्य देखभाल पर ध्यान दें।`;
    }

    _generateOverallSummary(features, confidence) {
        return `सामग्रिक आत्मविश्वास स्कोर: ${Math.round(confidence * 100)}%\nआपकी हस्तरेखा एक गतिशील और सकारात्मक प्रोफाइल दर्शाती है।\nजीवन के विभिन्न क्षेत्रों में विकास की संभावना है।`;
    }

    /**
     * Get default predictions if rules fail
     */
    _getDefaultPredictions(timelineRange) {
        return {
            education: { category: 'education', title: 'शिक्षा', summary: '', confidence: 50 },
            marriage: { category: 'marriage', title: 'विवाह', summary: '', confidence: 50, timelineRange },
            children: { category: 'children', title: 'संतान', summary: '', confidence: 50, timelineRange },
            career: { category: 'career', title: 'करियर', summary: '', confidence: 50 },
            business: { category: 'business', title: 'व्यापार', summary: '', confidence: 50 },
            money: { category: 'money', title: 'धन', summary: '', confidence: 50 },
            health: { category: 'health', title: 'स्वास्थ्य', summary: '', confidence: 50 },
            overall: { category: 'overall', title: 'समग्र सारांश', summary: '', confidence: 50 },
        };
    }
}

// Create global instance
const ruleEngine = new RuleEngine();
