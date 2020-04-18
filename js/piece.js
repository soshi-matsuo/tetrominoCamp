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

    draw(offsetX, offsetY) {
        this.ctx.fillStyle = this.color;
        this.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                // this.x, this.y gives the left upper position of the shape
                // x, y(args of callback) gives the position of the cell in the shape
                // this.x + x is then the position of the cell on the board
                if (value > 0) {
                    this.ctx.fillRect(offsetX + (this.x + x) * BLOCK_SIZE, offsetY + (this.y + y) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
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
        this.y = 0;
    }

    setNextPiecePosition() {
        this.x = NEXT_PIECE_X;
        this.y = NEXT_PIECE_Y;
    }

    randomizeTetrominoTypes(noOfTypes, colorId) {
        // typeId ranges 1 to 7
        const baseId = noOfTypes * (colorId - 1);
        return baseId + Math.floor(Math.random() * noOfTypes + 1);
    }
}