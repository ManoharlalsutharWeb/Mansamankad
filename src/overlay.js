/**
 * Overlay Module
 * Creates visual overlays of detected lines on original images
 */

class OverlayGenerator {
    /**
     * Create overlay image with detected lines
     */
    async generateOverlay(originalCanvas, edgesCanvas) {
        try {
            const canvas = document.createElement('canvas');
            canvas.width = originalCanvas.width;
            canvas.height = originalCanvas.height;
            const ctx = canvas.getContext('2d');

            // Draw original image
            ctx.drawImage(originalCanvas, 0, 0);

            // Draw edges overlay with transparency
            ctx.globalAlpha = 0.6;
            const edgesImageData = edgesCanvas.getContext('2d').getImageData(0, 0, edgesCanvas.width, edgesCanvas.height);
            
            // Create colored overlay (orange/yellow for detected lines)
            const coloredImageData = ctx.createImageData(edgesImageData.width, edgesImageData.height);
            const data = coloredImageData.data;
            
            for (let i = 0; i < edgesImageData.data.length; i += 4) {
                if (edgesImageData.data[i + 3] > 0 || edgesImageData.data[i] > 128) { // If edge pixel
                    data[i] = 255;      // R - orange/red
                    data[i + 1] = 165;  // G
                    data[i + 2] = 0;    // B
                    data[i + 3] = 200;  // Alpha
                } else {
                    data[i + 3] = 0;    // Transparent
                }
            }

            ctx.putImageData(coloredImageData, 0, 0);
            ctx.globalAlpha = 1.0;

            return canvas;
        } catch (error) {
            console.error('Overlay generation failed:', error);
            return originalCanvas;
        }
    }

    /**
     * Draw palm lines on canvas
     */
    drawPalmLines(canvas, features) {
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;

        // Set drawing style
        ctx.strokeStyle = '#FF9A2F';
        ctx.lineWidth = 3;
        ctx.font = 'bold 14px Arial';
        ctx.fillStyle = '#FF9A2F';

        // Draw sample lines based on detected features
        // These are approximate positions based on palm structure

        if (features.lifeLine && features.lifeLine.length > 0.5) {
            this._drawLifeLine(ctx, w, h);
        }

        if (features.headLine && features.headLine.length > 0.5) {
            this._drawHeadLine(ctx, w, h);
        }

        if (features.heartLine && features.heartLine.length > 0.5) {
            this._drawHeartLine(ctx, w, h);
        }

        if (features.fateLine && features.fateLine.present > 0.5) {
            this._drawFateLine(ctx, w, h);
        }

        // Draw mount regions
        this._drawMountRegions(ctx, w, h, features.mounts);

        return canvas;
    }

    /**
     * Draw life line (starts between thumb and index, goes down)
     */
    _drawLifeLine(ctx, w, h) {
        const startX = w * 0.25;
        const startY = h * 0.15;
        const endX = w * 0.35;
        const endY = h * 0.85;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.quadraticCurveTo(w * 0.20, h * 0.50, endX, endY);
        ctx.stroke();

        ctx.fillText('जीवन', startX - 20, startY - 10);
    }

    /**
     * Draw head line (runs across palm)
     */
    _drawHeadLine(ctx, w, h) {
        const startX = w * 0.15;
        const startY = h * 0.30;
        const endX = w * 0.85;
        const endY = h * 0.40;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.quadraticCurveTo(w * 0.50, h * 0.25, endX, endY);
        ctx.stroke();

        ctx.fillText('मस्तिष्क', startX + 10, startY - 10);
    }

    /**
     * Draw heart line (upper palm line)
     */
    _drawHeartLine(ctx, w, h) {
        const startX = w * 0.15;
        const startY = h * 0.15;
        const endX = w * 0.85;
        const endY = h * 0.20;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.quadraticCurveTo(w * 0.50, h * 0.08, endX, endY);
        ctx.stroke();

        ctx.fillText('हृदय', startX + 10, startY - 10);
    }

    /**
     * Draw fate line (vertical through center)
     */
    _drawFateLine(ctx, w, h) {
        const topX = w * 0.50;
        const topY = h * 0.15;
        const bottomX = w * 0.50;
        const bottomY = h * 0.85;

        ctx.beginPath();
        ctx.moveTo(topX, topY);
        ctx.lineTo(bottomX, bottomY);
        ctx.stroke();

        ctx.fillText('भाग्य', topX + 10, topY - 10);
    }

    /**
     * Draw mount regions
     */
    _drawMountRegions(ctx, w, h, mounts) {
        ctx.globalAlpha = 0.2;
        ctx.fillStyle = '#FF9A2F';

        const regions = {
            venus: { x: w * 0.20, y: h * 0.70, radius: w * 0.12 },
            moon: { x: w * 0.15, y: h * 0.50, radius: w * 0.10 },
            jupiter: { x: w * 0.25, y: h * 0.10, radius: w * 0.10 },
            saturn: { x: w * 0.50, y: h * 0.05, radius: w * 0.10 },
            apollo: { x: w * 0.75, y: h * 0.10, radius: w * 0.10 },
            mercury: { x: w * 0.85, y: h * 0.30, radius: w * 0.10 },
        };

        for (const [mount, region] of Object.entries(regions)) {
            if (mounts[mount] && mounts[mount] > 0.3) {
                ctx.beginPath();
                ctx.arc(region.x, region.y, region.radius, 0, 2 * Math.PI);
                ctx.fill();
            }
        }

        ctx.globalAlpha = 1.0;
    }

    /**
     * Add confidence badge to canvas
     */
    addConfidenceBadge(canvas, confidence, qualityScore) {
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;

        // Badge background
        const badgeX = w - 180;
        const badgeY = 20;
        const badgeW = 160;
        const badgeH = 80;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(badgeX, badgeY, badgeW, badgeH);

        // Border
        ctx.strokeStyle = '#FF9A2F';
        ctx.lineWidth = 2;
        ctx.strokeRect(badgeX, badgeY, badgeW, badgeH);

        // Text
        ctx.fillStyle = '#FF9A2F';
        ctx.font = 'bold 12px Arial';
        ctx.fillText('आत्मविश्वास:', badgeX + 10, badgeY + 25);
        ctx.fillText(`${Math.round(confidence * 100)}%`, badgeX + 10, badgeY + 45);

        ctx.font = 'bold 12px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText('गुणवत्ता:', badgeX + 10, badgeY + 65);
        ctx.font = 'normal 11px Arial';
        ctx.fillStyle = '#FF9A2F';
        ctx.fillText(`${Math.round(qualityScore * 100)}%`, badgeX + 75, badgeY + 65);

        return canvas;
    }
}

// Create global instance
const overlayGenerator = new OverlayGenerator();
