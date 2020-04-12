class Piece {
    x;
    y;
    color;
    shape;
    ctx;
    typeId;

    constructor(ctx, color) {
        this.ctx = ctx;
        this.color = color;
        const colorId = COLORS.indexOf(color);
        this.typeId = this.randomizeTetrominoTypes(SHAPES_NUM, colorId);
        this.shape = SHAPES[this.typeId];

        this.x = 0;
        this.y = 0;
    }

    draw() {
        this.ctx.fillStyle = this.color;
        this.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                // this.x, this.y gives the left upper position of the shape
                // x, y(args of callback) gives the position of the cell in the shape
                // this.x + x is then the position of the cell on the board
                if (value > 0) {
                    this.ctx.fillRect(this.x + x, this.y + y, 1, 1);
                }
            });
        });
    }

    // change coordinate of current piece to change its position on the board
    move(p) {
        this.x = p.x;
        this.y = p.y;
        this.shape = p.shape;
    }

    setStartingPosition() {
        this.x = this.typeId === 4 ? 4 : 3;
    }

    randomizeTetrominoTypes(noOfTypes, colorId) {
        // typeId ranges 1 to 7
        const baseId = noOfTypes * (colorId - 1);
        return baseId + Math.floor(Math.random() * noOfTypes + 1);
    }
}