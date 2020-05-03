class Drawable {
    ctx;
    inProduction;
    imageElements = {};
    constructor(ctx, inProduction) {
        this.ctx = ctx;
        this.inProduction = inProduction;
    }

    drawGuideBoxOnDebug(x, y, width, height, description='') {
        if (this.inProduction) return;
        this.ctx.lineWidth = 1;
        this.ctx.fillStyle = 'green';
        this.ctx.strokeStyle = 'green';
        const fontSize = 12;
        const textOffsetX = 5;
        const textOffsetY = 5;
        this.ctx.font = `${fontSize}px sans-serif`;
        this.ctx.strokeRect(x, y, width, height);
        this.ctx.fillText(description, x + textOffsetX, y + fontSize + textOffsetY);   
        this.ctx.fillText(`x:${x}, y:${y}, w:${width}, h:${height}`, x + textOffsetX, y + fontSize * 2 + textOffsetY);
    }

    drawText(text, x, y, fontSize, color = BLACK, align = 'left') {
        this.ctx.fillStyle = color;
        this.ctx.font = `${fontSize}px "${FONT_DEFAULT}"`;
        this.ctx.textAlign = align;
        const y_ = fontSize + y;
        this.ctx.fillText(text, x, y_);
    }

    drawStrokeRect(x, y, width, height, lineWidth, lineColor = BLACK) {
        this.ctx.strokeStyle = lineColor;
        this.ctx.lineWidth = lineWidth;
        this.ctx.strokeRect(x, y, width, height);
    }

    drawFillRect(x, y, width, height, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, width, height);
    }

    drawFillArc(x, y, radius, color) {
        this.ctx.beginPath();
        this.ctx.fillStyle = color;
        this.ctx.strokeStyle = color;
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
        this.ctx.stroke();
        this.ctx.fill();
    }

    drawLine(beginX, beginY, endX, endY, lineWidth, color) {
        this.ctx.lineWidth = lineWidth;
        this.ctx.strokeStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(beginX, beginY);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();
    }

    drawImage(imageElem, x, y) {
        this.ctx.drawImage(imageElem, x, y);
    }

    async loadSpriteSheet(sheetSrc, spritesheetCol, spritesheetRow, spriteSize) {
        return new Promise((resolve, reject) => {
            const spritesheet = new Image();
            spritesheet.onload = async () => {
                const imageBitmaps = [];
                for (let i = 0; i < spritesheetRow; i++) {
                    for (let j = 0; j < spritesheetCol; j++) {
                        imageBitmaps.push(createImageBitmap(spritesheet, j * spriteSize, i * spriteSize, spriteSize, spriteSize));
                    }
                }
                const sprites = await Promise.all(imageBitmaps);
                resolve(sprites);
            }
            spritesheet.src = sheetSrc;
            spritesheet.onerror = reject;
        }); 
        
    }
}