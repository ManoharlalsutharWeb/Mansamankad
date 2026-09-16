/**
 * Timeline Module
 * Generates timeline projections based on palm analysis
 */

class TimelineProjector {
    /**
     * Generate timeline blocks for specified years
     */
    generateTimeline(features, yearRange) {
        const currentYear = new Date().getFullYear();
        const blocks = [];

        // Divide timeline into meaningful periods
        if (yearRange <= 5) {
            blocks.push(...this._generateYearlyBlocks(currentYear, yearRange, features));
        } else if (yearRange <= 10) {
            blocks.push(...this._generateBiAnnualBlocks(currentYear, yearRange, features));
        } else {
            blocks.push(...this._generate3YearBlocks(currentYear, yearRange, features));
        }

        return {
            startYear: currentYear,
            endYear: currentYear + yearRange,
            range: yearRange,
            blocks: blocks,
            summary: this._generateTimelineSummary(features, yearRange),
        };
    }

    /**
     * Generate yearly blocks for short timeline (5 years)
     */
    _generateYearlyBlocks(startYear, range, features) {
        const blocks = [];

        for (let i = 0; i < range; i++) {
            const year = startYear + i;
            blocks.push({
                period: `${year}`,
                startYear: year,
                endYear: year,
                career: this._getCareerPhase(i, range, features),
                money: this._getMoneyPhase(i, range, features),
                relationship: this._getRelationshipPhase(i, range, features),
                health: this._getHealthPhase(i, range, features),
                confidence: this._getPhaseConfidence(i, range, features),
            });
        }

        return blocks;
    }

    /**
     * Generate bi-annual blocks for medium timeline (10 years)
     */
    _generateBiAnnualBlocks(startYear, range, features) {
        const blocks = [];
        const periods = Math.ceil(range / 2);

        for (let i = 0; i < periods; i++) {
            const start = startYear + (i * 2);
            const end = Math.min(start + 1, startYear + range);
            
            blocks.push({
                period: `${start}-${end}`,
                startYear: start,
                endYear: end,
                career: this._getCareerPhase(i, periods, features),
                money: this._getMoneyPhase(i, periods, features),
                relationship: this._getRelationshipPhase(i, periods, features),
                health: this._getHealthPhase(i, periods, features),
                confidence: this._getPhaseConfidence(i, periods, features),
            });
        }

        return blocks;
    }

    /**
     * Generate 3-year blocks for long timeline (15-20 years)
     */
    _generate3YearBlocks(startYear, range, features) {
        const blocks = [];
        const periods = Math.ceil(range / 3);

        for (let i = 0; i < periods; i++) {
            const start = startYear + (i * 3);
            const end = Math.min(start + 2, startYear + range);
            
            blocks.push({
                period: `${start}-${end}`,
                startYear: start,
                endYear: end,
                career: this._getCareerPhase(i, periods, features),
                money: this._getMoneyPhase(i, periods, features),
                relationship: this._getRelationshipPhase(i, periods, features),
                health: this._getHealthPhase(i, periods, features),
                confidence: this._getPhaseConfidence(i, periods, features),
            });
        }

        return blocks;
    }

    /**
     * Determine career phase for period
     */
    _getCareerPhase(periodIndex, totalPeriods, features) {
        const phases = [
            'प्रारंभिक विकास',
            'मजबूत विकास',
            'पेशेवर शिखर',
            'स्थिरता और अनुभव',
        ];

        const fateLineStrength = features.fateLine ? features.fateLine.strength : 0;
        const phaseIndex = Math.floor((periodIndex / totalPeriods) * phases.length);
        const adjustedIndex = Math.min(phaseIndex, phases.length - 1);

        return {
            phase: phases[adjustedIndex],
            momentum: Math.min(fateLineStrength + (periodIndex / totalPeriods) * 0.3, 1.0),
            growth: Math.random() * 0.3 + 0.6,
        };
    }

    /**
     * Determine money phase for period
     */
    _getMoneyPhase(periodIndex, totalPeriods, features) {
        const stability = features.mounts ? features.mounts.venus : 0.5;
        
        const baseStability = Math.min(stability + (periodIndex / totalPeriods) * 0.2, 1.0);
        const hasFluctuations = Math.random() > 0.6;

        return {
            stability: Math.round(baseStability * 100),
            trend: periodIndex % 2 === 0 ? 'बढ़ती' : 'स्थिर',
            hasFluctuations: hasFluctuations,
            recommendation: this._getFinancialRecommendation(periodIndex, totalPeriods),
        };
    }

    /**
     * Determine relationship phase for period
     */
    _getRelationshipPhase(periodIndex, totalPeriods, features) {
        const heartLineStrength = features.heartLine ? features.heartLine.length : 0.5;
        
        const phases = [
            'रिश्ते का विकास',
            'स्थिर संबंध',
            'गहरे बंधन',
            'परिपक्व संबंध',
        ];

        const phaseIndex = Math.floor((periodIndex / totalPeriods) * phases.length);
        const adjustedIndex = Math.min(phaseIndex, phases.length - 1);

        return {
            phase: phases[adjustedIndex],
            harmony: Math.round(heartLineStrength * 100),
            challenges: periodIndex % 3 === 0,
            supportStrength: Math.min(heartLineStrength + 0.2, 1.0),
        };
    }

    /**
     * Determine health phase for period
     */
    _getHealthPhase(periodIndex, totalPeriods, features) {
        const lifeLine = features.lifeLine || {};
        const baseEnergy = lifeLine.length ? lifeLine.length * 0.8 : 0.6;
        const energyLevel = Math.max(0.4, baseEnergy - (periodIndex / totalPeriods) * 0.15);

        return {
            energyLevel: Math.round(energyLevel * 100),
            vitality: Math.round((1 - periodIndex / totalPeriods * 0.3) * 100),
            caution: periodIndex > totalPeriods / 2 ? 'नियमित जांच सुझाई जाती है' : 'अच्छा स्वास्थ्य दिखाई देता है',
            stressLevel: Math.round((periodIndex / totalPeriods) * 40 + 20),
        };
    }

    /**
     * Get confidence for phase
     */
    _getPhaseConfidence(periodIndex, totalPeriods, features) {
        // Confidence decreases slightly for far future
        const distanceFactor = Math.pow(1 - (periodIndex / totalPeriods), 0.5);
        const baseConfidence = features.confidence || 0.7;
        
        return Math.round(Math.min(baseConfidence * distanceFactor, 1.0) * 100);
    }

    /**
     * Get financial recommendation for period
     */
    _getFinancialRecommendation(periodIndex, totalPeriods) {
        const recommendations = [
            'निवेश और बचत पर ध्यान दें',
            'वर्तमान संपत्ति को संरक्षित करें',
            'सावधानीपूर्वक नए निवेश करें',
            'दीर्घकालीन योजना बनाएं',
        ];

        const index = periodIndex % recommendations.length;
        return recommendations[index];
    }

    /**
     * Generate overall timeline summary
     */
    _generateTimelineSummary(features, yearRange) {
        const confidence = features.confidence || 0.7;
        const strength = features.fateLine ? features.fateLine.strength : 0.5;

        const summaries = {
            strong: `अगले ${yearRange} वर्षों में आपकी हस्तरेखा सकारात्मक विकास दर्शाती है। भाग्य रेखा की मजबूती आपके लक्ष्य प्राप्ति में सहायता करेगी।`,
            moderate: `अगले ${yearRange} वर्षों में क्रमिक विकास की संभावना है। प्रयास और दृढ़ निश्चय से सफलता संभव है।`,
            developing: `अगले ${yearRange} वर्षों में विभिन्न चुनौतियां हो सकती हैं। धैर्य और बुद्धिमानी से आप अपने लक्ष्य प्राप्त कर सकते हैं।`,
        };

        let summaryType = 'developing';
        if (confidence > 0.75 && strength > 0.65) {
            summaryType = 'strong';
        } else if (confidence > 0.6 || strength > 0.55) {
            summaryType = 'moderate';
        }

        return {
            type: summaryType,
            text: summaries[summaryType],
            recommendation: this._getOverallTimelineRecommendation(yearRange),
        };
    }

    /**
     * Get overall timeline recommendation
     */
    _getOverallTimelineRecommendation(yearRange) {
        if (yearRange <= 5) {
            return 'आने वाले वर्षों में अपने लक्ष्यों पर ध्यान केंद्रित करें और वर्तमान के साथ संतुलन बनाएं।';
        } else if (yearRange <= 10) {
            return 'दीर्घकालीन योजना बनाएं और क्रमिक विकास के लिए प्रयास करें।';
        } else {
            return 'आने वाले दशक में बड़े लक्ष्य निर्धारित करें और उन्हें चरणबद्ध तरीके से प्राप्त करें।';
        }
    }
}

// Create global instance
const timelineProjector = new TimelineProjector();
