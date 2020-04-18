class Drawable {
    ctx;
    inProduction;
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

    drawText(text, x, y, fontSize) {
        this.ctx.fillStyle = 'black';
        this.ctx.font = `${fontSize}px sans-serif`;
        const y_ = fontSize + y;
        this.ctx.fillText(text, x, y_);
    }

    drawImage(imageData, x, y) {
        const image = new Image(imageData.width, imageData.height);
        image.src = imageData.src;
        this.ctx.drawImage(image, x, y);
    }
}