/**
 * PDF Report Generator Module
 * Creates multi-page Hindi PDF reports
 */

class PDFReportGenerator {
    constructor() {
        this.pdf = null;
    }

    /**
     * Check if pdf-lib is loaded
     */
    isReady() {
        return typeof PDFLib !== 'undefined';
    }

    /**
     * Generate complete PDF report
     */
    async generateReport(clientData, featuresData, predictions, timelineData, images) {
        try {
            // Create new PDF document
            const { PDFDocument, PDFPage, rgb, degrees } = PDFLib;
            const pdfDoc = await PDFDocument.create();

            this.pdf = pdfDoc;
            this.pageWidth = 595; // A4 width in points
            this.pageHeight = 842; // A4 height in points
            this.margin = 40;
            this.rgb = rgb;

            // Add pages
            await this._addCoverPage(clientData, timelineData);
            await this._addQualityPage(featuresData);
            
            if (Array.isArray(featuresData)) {
                if (featuresData.length > 0) {
                    await this._addHandAnalysisPage(featuresData[0], 'left');
                }
                if (featuresData.length > 1) {
                    await this._addHandAnalysisPage(featuresData[1], 'right');
                    await this._addComparisonPage(featuresData[0], featuresData[1]);
                }
            } else if (featuresData.hand) {
                await this._addHandAnalysisPage(featuresData, featuresData.hand);
            }

            // Add prediction pages
            await this._addEducationPage(predictions.education);
            await this._addMarriagePage(predictions.marriage);
            await this._addChildrenPage(predictions.children);
            await this._addCareerPage(predictions.career);
            await this._addBusinessPage(predictions.business);
            await this._addMoneyPage(predictions.money);
            await this._addHealthPage(predictions.health);
            await this._addTimelinePage(timelineData);
            
            // Add images
            if (images && images.original) {
                await this._addImagesPage(images, clientData.handSelection);
            }

            // Add disclaimer
            await this._addDisclaimerPage();

            // Save to bytes
            const pdfBytes = await pdfDoc.save();
            
            // Convert to blob
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            
            return { success: true, blob: blob };
        } catch (error) {
            console.error('PDF generation failed:', error);
            return { success: false, error: t('ERRORS.PDF_GENERATION_ERROR') };
        }
    }

    /**
     * Add cover page
     */
    async _addCoverPage(clientData, timelineData) {
        const page = this.pdf.addPage([this.pageWidth, this.pageHeight]);
        const { width, height } = page.getSize();
        
        // Background gradient effect with colored rectangle
        page.drawRectangle({
            x: 0,
            y: height - 200,
            width: width,
            height: 200,
            color: this.rgb(255, 154, 47),
        });

        // Logo placeholder or image
        const logoPath = 'assets/guruji-logo-square.png';
        try {
            const logoUrl = logoPath;
            const logoImage = await fetch(logoUrl).then(r => r.blob()).then(blob => {
                return new Uint8Array(blob);
            });
            // For now, skip logo embedding - would need image library
        } catch (e) {
            // Logo not available, skip
        }

        // Title
        page.drawText('Guruji Hastrekha', {
            x: this.margin,
            y: height - this.margin - 40,
            size: 36,
            color: this.rgb(30, 60, 114),
            font: this.pdf.getFont('Helvetica-Bold'),
        });

        page.drawText('हस्तरेखा विश्लेषण रिपोर्ट', {
            x: this.margin,
            y: height - this.margin - 90,
            size: 28,
            color: this.rgb(30, 60, 114),
        });

        // Client info
        page.drawText(`${t('PDF.NAME')}: ${clientData.clientName}`, {
            x: this.margin,
            y: height - this.margin - 150,
            size: 14,
            color: this.rgb(50, 50, 50),
        });

        const now = new Date();
        const dateStr = now.toLocaleDateString('hi-IN');
        page.drawText(`${t('PDF.DATE')}: ${dateStr}`, {
            x: this.margin,
            y: height - this.margin - 180,
            size: 12,
            color: this.rgb(100, 100, 100),
        });

        if (clientData.handSelection) {
            page.drawText(`${t('PDF.TIMELINE_RANGE')}: ${timelineData.range} वर्ष`, {
                x: this.margin,
                y: height - this.margin - 210,
                size: 12,
                color: this.rgb(100, 100, 100),
            });
        }

        // Footer
        page.drawText('परंपरागत हस्तरेखा विश्लेषण', {
            x: this.margin,
            y: this.margin + 40,
            size: 11,
            color: this.rgb(255, 255, 255),
        });
    }

    /**
     * Add quality assessment page
     */
    async _addQualityPage(featuresData) {
        const page = this.pdf.addPage([this.pageWidth, this.pageHeight]);
        const { width, height } = page.getSize();

        this._drawHeader(page, 'गुणवत्ता और आत्मविश्वास');

        let yPosition = height - this.margin - 60;

        const features = Array.isArray(featuresData) ? featuresData[0] : featuresData;

        // Quality metrics
        const metrics = [
            { label: 'गुणवत्ता स्कोर', value: Math.round(features.qualityScore * 100) },
            { label: 'आत्मविश्वास', value: Math.round(features.confidence * 100) },
            { label: 'पंक्ति घनत्व', value: Math.round(features.lineDensity * 100) },
        ];

        for (const metric of metrics) {
            page.drawText(metric.label, {
                x: this.margin,
                y: yPosition,
                size: 12,
                color: this.rgb(30, 60, 114),
            });

            page.drawText(`${metric.value}%`, {
                x: this.margin + 350,
                y: yPosition,
                size: 14,
                color: this.rgb(255, 154, 47),
                font: this.pdf.getFont('Helvetica-Bold'),
            });

            // Draw progress bar
            const barWidth = 250;
            const barHeight = 20;
            page.drawRectangle({
                x: this.margin + 200,
                y: yPosition - 5,
                width: barWidth,
                height: barHeight,
                color: this.rgb(240, 240, 240),
                borderColor: this.rgb(200, 200, 200),
                borderWidth: 1,
            });

            page.drawRectangle({
                x: this.margin + 200,
                y: yPosition - 5,
                width: (barWidth * metric.value) / 100,
                height: barHeight,
                color: this.rgb(255, 154, 47),
            });

            yPosition -= 50;
        }

        yPosition -= 20;

        // Quality assessment text
        page.drawText('मूल्यांकन:', {
            x: this.margin,
            y: yPosition,
            size: 12,
            color: this.rgb(30, 60, 114),
            font: this.pdf.getFont('Helvetica-Bold'),
        });

        yPosition -= 25;

        const assessment = features.qualityScore > 0.7 
            ? 'तस्वीर की गुणवत्ता उत्तम है। विश्लेषण विश्वसनीय परिणाम देना चाहिए।'
            : features.qualityScore > 0.5
            ? 'तस्वीर की गुणवत्ता अच्छी है। विश्लेषण में सामान्य विश्वसनीयता है।'
            : 'तस्वीर की गुणवत्ता सीमित है। बेहतर नतीजों के लिए स्पष्ट तस्वीर प्रदान करें।';

        this._drawWrappedText(page, assessment, this.margin, yPosition, width - 2 * this.margin, 12);
    }

    /**
     * Add hand analysis page
     */
    async _addHandAnalysisPage(features, hand) {
        const page = this.pdf.addPage([this.pageWidth, this.pageHeight]);
        const { width, height } = page.getSize();

        const handName = hand === 'left' ? 'बाएं हाथ' : hand === 'right' ? 'दाएं हाथ' : 'हाथ';
        this._drawHeader(page, `${handName} विश्लेषण`);

        let yPosition = height - this.margin - 60;

        // Life line
        page.drawText('जीवन रेखा', {
            x: this.margin,
            y: yPosition,
            size: 12,
            color: this.rgb(30, 60, 114),
            font: this.pdf.getFont('Helvetica-Bold'),
        });
        yPosition -= 20;

        const lifeLineText = `लंबाई: ${Math.round(features.lifeLine.length * 100)}% | गहराई: ${Math.round(features.lifeLine.depth * 100)}% | व्याघात: ${features.lifeLine.breaks}`;
        page.drawText(lifeLineText, {
            x: this.margin + 20,
            y: yPosition,
            size: 11,
            color: this.rgb(80, 80, 80),
        });
        yPosition -= 30;

        // Head line
        page.drawText('मस्तिष्क रेखा', {
            x: this.margin,
            y: yPosition,
            size: 12,
            color: this.rgb(30, 60, 114),
            font: this.pdf.getFont('Helvetica-Bold'),
        });
        yPosition -= 20;

        const headLineText = `लंबाई: ${Math.round(features.headLine.length * 100)}% | गहराई: ${Math.round(features.headLine.depth * 100)}% | ढलान: ${Math.round(features.headLine.slope * 100)}%`;
        page.drawText(headLineText, {
            x: this.margin + 20,
            y: yPosition,
            size: 11,
            color: this.rgb(80, 80, 80),
        });
        yPosition -= 30;

        // Heart line
        page.drawText('हृदय रेखा', {
            x: this.margin,
            y: yPosition,
            size: 12,
            color: this.rgb(30, 60, 114),
            font: this.pdf.getFont('Helvetica-Bold'),
        });
        yPosition -= 20;

        const heartLineText = `लंबाई: ${Math.round(features.heartLine.length * 100)}% | गहराई: ${Math.round(features.heartLine.depth * 100)}% | व्याघात: ${features.heartLine.breaks}`;
        page.drawText(heartLineText, {
            x: this.margin + 20,
            y: yPosition,
            size: 11,
            color: this.rgb(80, 80, 80),
        });
        yPosition -= 30;

        // Fate line
        if (features.fateLine && features.fateLine.present > 0.3) {
            page.drawText('भाग्य रेखा', {
                x: this.margin,
                y: yPosition,
                size: 12,
                color: this.rgb(30, 60, 114),
                font: this.pdf.getFont('Helvetica-Bold'),
            });
            yPosition -= 20;

            const fateLineText = `उपस्थिति: ${Math.round(features.fateLine.present * 100)}% | शक्ति: ${Math.round(features.fateLine.strength * 100)}%`;
            page.drawText(fateLineText, {
                x: this.margin + 20,
                y: yPosition,
                size: 11,
                color: this.rgb(80, 80, 80),
            });
            yPosition -= 30;
        }

        // Mounts summary
        yPosition -= 10;
        page.drawText('ग्रह पर्वत', {
            x: this.margin,
            y: yPosition,
            size: 12,
            color: this.rgb(30, 60, 114),
            font: this.pdf.getFont('Helvetica-Bold'),
        });
        yPosition -= 25;

        const mountsText = `शुक्र: ${Math.round(features.mounts.venus * 100)}% | चंद्र: ${Math.round(features.mounts.moon * 100)}% | बृहस्पति: ${Math.round(features.mounts.jupiter * 100)}% | शनि: ${Math.round(features.mounts.saturn * 100)}%`;
        page.drawText(mountsText, {
            x: this.margin + 20,
            y: yPosition,
            size: 10,
            color: this.rgb(80, 80, 80),
        });

        this._drawFooter(page);
    }

    /**
     * Add comparison page for both hands
     */
    async _addComparisonPage(leftFeatures, rightFeatures) {
        const page = this.pdf.addPage([this.pageWidth, this.pageHeight]);
        const { width, height } = page.getSize();

        this._drawHeader(page, 'दोनों हाथों की तुलना');

        let yPosition = height - this.margin - 60;

        page.drawText('परंपरागत व्याख्या:', {
            x: this.margin,
            y: yPosition,
            size: 11,
            color: this.rgb(100, 100, 100),
        });
        yPosition -= 20;

        page.drawText('बाएं हाथ: जन्मजात प्रवृत्ति और क्षमता', {
            x: this.margin + 20,
            y: yPosition,
            size: 11,
            color: this.rgb(80, 80, 80),
        });
        yPosition -= 20;

        page.drawText('दाएं हाथ: वर्तमान जीवन पथ और विकास', {
            x: this.margin + 20,
            y: yPosition,
            size: 11,
            color: this.rgb(80, 80, 80),
        });
        yPosition -= 40;

        // Comparison metrics
        page.drawText('प्रमुख अंतर:', {
            x: this.margin,
            y: yPosition,
            size: 12,
            color: this.rgb(30, 60, 114),
            font: this.pdf.getFont('Helvetica-Bold'),
        });
        yPosition -= 25;

        const leftConfidence = Math.round(leftFeatures.confidence * 100);
        const rightConfidence = Math.round(rightFeatures.confidence * 100);

        page.drawText(`आत्मविश्वास - बाएं: ${leftConfidence}% | दाएं: ${rightConfidence}%`, {
            x: this.margin + 20,
            y: yPosition,
            size: 11,
            color: this.rgb(80, 80, 80),
        });
        yPosition -= 25;

        page.drawText(`जीवन रेखा लंबाई - बाएं: ${Math.round(leftFeatures.lifeLine.length * 100)}% | दाएं: ${Math.round(rightFeatures.lifeLine.length * 100)}%`, {
            x: this.margin + 20,
            y: yPosition,
            size: 11,
            color: this.rgb(80, 80, 80),
        });
        yPosition -= 25;

        page.drawText(`मस्तिष्क रेखा लंबाई - बाएं: ${Math.round(leftFeatures.headLine.length * 100)}% | दाएं: ${Math.round(rightFeatures.headLine.length * 100)}%`, {
            x: this.margin + 20,
            y: yPosition,
            size: 11,
            color: this.rgb(80, 80, 80),
        });
        yPosition -= 40;

        // Recommendation
        page.drawText('सुझाव:', {
            x: this.margin,
            y: yPosition,
            size: 12,
            color: this.rgb(30, 60, 114),
            font: this.pdf.getFont('Helvetica-Bold'),
        });
        yPosition -= 25;

        const recommendation = rightConfidence > leftConfidence
            ? 'आप अपनी जन्मजात क्षमता से अधिक विकास कर रहे हैं। इस सकारात्मक प्रवृत्ति को बनाए रखें।'
            : rightConfidence < leftConfidence
            ? 'आपकी क्षमता अभी पूरी तरह विकसित नहीं हुई है। अपनी मजबूत नींव पर निर्माण करें।'
            : 'आप अपनी जन्मजात क्षमता के अनुरूप विकास कर रहे हैं। यह संतुलन अच्छा संकेत है।';

        this._drawWrappedText(page, recommendation, this.margin + 20, yPosition, width - 2 * this.margin - 20, 11);

        this._drawFooter(page);
    }

    /**
     * Add prediction pages
     */
    async _addEducationPage(prediction) {
        await this._addPredictionPage('शिक्षा', prediction);
    }

    async _addMarriagePage(prediction) {
        await this._addPredictionPage('विवाह', prediction);
    }

    async _addChildrenPage(prediction) {
        await this._addPredictionPage('संतान', prediction);
    }

    async _addCareerPage(prediction) {
        await this._addPredictionPage('करियर/नौकरी', prediction);
    }

    async _addBusinessPage(prediction) {
        await this._addPredictionPage('व्यापार', prediction);
    }

    async _addMoneyPage(prediction) {
        await this._addPredictionPage('धन/संपत्ति', prediction);
    }

    async _addHealthPage(prediction) {
        await this._addPredictionPage('स्वास्थ्य/ऊर्जा/तनाव', prediction);
    }

    /**
     * Generic prediction page renderer
     */
    async _addPredictionPage(title, prediction) {
        const page = this.pdf.addPage([this.pageWidth, this.pageHeight]);
        const { width, height } = page.getSize();

        this._drawHeader(page, title);

        let yPosition = height - this.margin - 60;

        // Summary
        page.drawText('सारांश:', {
            x: this.margin,
            y: yPosition,
            size: 12,
            color: this.rgb(30, 60, 114),
            font: this.pdf.getFont('Helvetica-Bold'),
        });
        yPosition -= 20;

        if (prediction.summary) {
            yPosition = this._drawWrappedText(page, prediction.summary, this.margin + 20, yPosition, width - 2 * this.margin - 20, 11) - 20;
        }

        // Details
        if (prediction.details) {
            page.drawText('विवरण:', {
                x: this.margin,
                y: yPosition,
                size: 12,
                color: this.rgb(30, 60, 114),
                font: this.pdf.getFont('Helvetica-Bold'),
            });
            yPosition -= 20;

            yPosition = this._drawWrappedText(page, prediction.details, this.margin + 20, yPosition, width - 2 * this.margin - 20, 11) - 20;
        }

        // Recommendations
        if (prediction.recommendations) {
            page.drawText('सुझाव:', {
                x: this.margin,
                y: yPosition,
                size: 12,
                color: this.rgb(30, 60, 114),
                font: this.pdf.getFont('Helvetica-Bold'),
            });
            yPosition -= 20;

            yPosition = this._drawWrappedText(page, prediction.recommendations, this.margin + 20, yPosition, width - 2 * this.margin - 20, 11) - 20;
        }

        // Confidence
        page.drawText(`आत्मविश्वास: ${prediction.confidence}%`, {
            x: this.margin,
            y: yPosition,
            size: 11,
            color: this.rgb(255, 154, 47),
            font: this.pdf.getFont('Helvetica-Bold'),
        });

        this._drawFooter(page);
    }

    /**
     * Add timeline page
     */
    async _addTimelinePage(timelineData) {
        const page = this.pdf.addPage([this.pageWidth, this.pageHeight]);
        const { width, height } = page.getSize();

        this._drawHeader(page, `समय प्रक्षेपण - ${timelineData.range} वर्ष`);

        let yPosition = height - this.margin - 60;

        // Summary
        page.drawText(timelineData.summary.text, {
            x: this.margin,
            y: yPosition,
            size: 11,
            color: this.rgb(80, 80, 80),
        });
        yPosition -= 40;

        // Timeline blocks (first 3-4 blocks only to fit on page)
        page.drawText('मुख्य अवधियां:', {
            x: this.margin,
            y: yPosition,
            size: 12,
            color: this.rgb(30, 60, 114),
            font: this.pdf.getFont('Helvetica-Bold'),
        });
        yPosition -= 20;

        const blocksToShow = Math.min(4, timelineData.blocks.length);
        for (let i = 0; i < blocksToShow; i++) {
            const block = timelineData.blocks[i];
            
            page.drawText(`${block.period}`, {
                x: this.margin + 20,
                y: yPosition,
                size: 11,
                color: this.rgb(30, 60, 114),
                font: this.pdf.getFont('Helvetica-Bold'),
            });
            yPosition -= 15;

            page.drawText(`करियर: ${block.career.phase} | धन: ${block.money.trend}`, {
                x: this.margin + 40,
                y: yPosition,
                size: 10,
                color: this.rgb(100, 100, 100),
            });
            yPosition -= 15;

            page.drawText(`रिश्ते: ${block.relationship.phase} | आत्मविश्वास: ${block.confidence}%`, {
                x: this.margin + 40,
                y: yPosition,
                size: 10,
                color: this.rgb(100, 100, 100),
            });
            yPosition -= 25;
        }

        if (timelineData.blocks.length > 4) {
            page.drawText(`अन्य ${timelineData.blocks.length - 4} अवधियां उपलब्ध हैं...`, {
                x: this.margin + 20,
                y: yPosition,
                size: 10,
                color: this.rgb(150, 150, 150),
                font: this.pdf.getFont('Helvetica-Oblique'),
            });
        }

        this._drawFooter(page);
    }

    /**
     * Add images page
     */
    async _addImagesPage(images, handSelection) {
        const page = this.pdf.addPage([this.pageWidth, this.pageHeight]);
        const { width, height } = page.getSize();

        this._drawHeader(page, 'अपलोड की गई तस्वीरें');

        let yPosition = height - this.margin - 60;

        page.drawText('नोट: यह पृष्ठ स्थानीय में संग्रहीत है और कहीं साझा नहीं किया जाता है।', {
            x: this.margin,
            y: yPosition,
            size: 10,
            color: this.rgb(150, 150, 150),
            font: this.pdf.getFont('Helvetica-Oblique'),
        });
        yPosition -= 30;

        page.drawText('तस्वीर विवरण:', {
            x: this.margin,
            y: yPosition,
            size: 11,
            color: this.rgb(80, 80, 80),
        });
        yPosition -= 20;

        page.drawText(`चयनित हाथ: ${handSelection === 'left' ? 'बाएं' : handSelection === 'right' ? 'दाएं' : 'दोनों'}`, {
            x: this.margin + 20,
            y: yPosition,
            size: 11,
            color: this.rgb(80, 80, 80),
        });

        this._drawFooter(page);
    }

    /**
     * Add disclaimer page
     */
    async _addDisclaimerPage() {
        const page = this.pdf.addPage([this.pageWidth, this.pageHeight]);
        const { width, height } = page.getSize();

        this._drawHeader(page, 'अस्वीकरण और गोपनीयता');

        let yPosition = height - this.margin - 60;

        page.drawText('अस्वीकरण:', {
            x: this.margin,
            y: yPosition,
            size: 13,
            color: this.rgb(200, 0, 0),
            font: this.pdf.getFont('Helvetica-Bold'),
        });
        yPosition -= 25;

        const disclaimerText = 'यह रिपोर्ट पारंपरिक हस्तरेखा विश्लेषण पर आधारित है और केवल मनोरंजन और शैक्षणिक उद्देश्यों के लिए प्रदान की जाती है। यह किसी भी प्रकार की चिकित्सा, कानूनी, वित्तीय या व्यावसायिक सलाह नहीं है। कोई भी महत्वपूर्ण निर्णय लेने से पहले योग्य व्यावहारिक विशेषज्ञों (डॉक्टर, वकील, वित्तीय सलाहकार, आदि) से परामर्श लें।';

        yPosition = this._drawWrappedText(page, disclaimerText, this.margin + 20, yPosition, width - 2 * this.margin - 20, 10) - 30;

        page.drawText('गोपनीयता नोट:', {
            x: this.margin,
            y: yPosition,
            size: 13,
            color: this.rgb(30, 60, 114),
            font: this.pdf.getFont('Helvetica-Bold'),
        });
        yPosition -= 25;

        const privacyText = 'आपकी व्यक्तिगत जानकारी और हथेली की तस्वीरें इस अनुप्रयोग में पूरी तरह से स्थानीय रूप से संग्रहीत हैं। कोई भी डेटा सर्वर पर अपलोड नहीं किया जाता है। आप किसी भी समय सभी डेटा हटा सकते हैं। यह एक ऑफलाइन-प्रथम अनुप्रयोग है।';

        this._drawWrappedText(page, privacyText, this.margin + 20, yPosition, width - 2 * this.margin - 20, 10);
    }

    /**
     * Draw header on page
     */
    _drawHeader(page, title) {
        const { width } = page.getSize();
        
        // Title
        page.drawText(title, {
            x: this.margin,
            y: page.getHeight() - this.margin - 20,
            size: 18,
            color: this.rgb(30, 60, 114),
            font: this.pdf.getFont('Helvetica-Bold'),
        });

        // Divider
        page.drawLine({
            start: { x: this.margin, y: page.getHeight() - this.margin - 40 },
            end: { x: width - this.margin, y: page.getHeight() - this.margin - 40 },
            color: this.rgb(200, 200, 200),
        });
    }

    /**
     * Draw footer on page
     */
    _drawFooter(page) {
        const { width, height } = page.getSize();
        
        // Divider
        page.drawLine({
            start: { x: this.margin, y: this.margin + 20 },
            end: { x: width - this.margin, y: this.margin + 20 },
            color: this.rgb(200, 200, 200),
        });

        // Page info
        const pageNum = this.pdf.getPages().indexOf(page) + 1;
        const totalPages = this.pdf.getPages().length;

        page.drawText(`पृष्ठ ${pageNum} का ${totalPages}`, {
            x: width / 2 - 30,
            y: this.margin,
            size: 9,
            color: this.rgb(150, 150, 150),
        });

        // Copyright
        page.drawText('© Guruji Hastrekha', {
            x: width - this.margin - 80,
            y: this.margin,
            size: 8,
            color: this.rgb(150, 150, 150),
        });
    }

    /**
     * Draw wrapped text
     */
    _drawWrappedText(page, text, x, y, maxWidth, fontSize, color = this.rgb(80, 80, 80)) {
        const words = text.split(' ');
        let line = '';
        let currentY = y;
        const lineHeight = fontSize + 4;

        for (const word of words) {
            const testLine = line + (line ? ' ' : '') + word;
            const { width: textWidth } = page.getTextWidth(testLine, { size: fontSize });

            if (textWidth > maxWidth && line) {
                page.drawText(line, {
                    x: x,
                    y: currentY,
                    size: fontSize,
                    color: color,
                });
                line = word;
                currentY -= lineHeight;
            } else {
                line = testLine;
            }
        }

        if (line) {
            page.drawText(line, {
                x: x,
                y: currentY,
                size: fontSize,
                color: color,
            });
            currentY -= lineHeight;
        }

        return currentY;
    }
}

// Create global instance
const pdfGenerator = new PDFReportGenerator();
