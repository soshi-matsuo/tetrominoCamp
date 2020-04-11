class Piece {
    x;
    y;
    color;
    shape;
    ctx;
    typeId;

    constructor(ctx, turn) {
        this.ctx = ctx;
        this.typeId = this.randomizeTetrominoTypes(SHAPES.length - 1);

        this.color = COLORS[turn];

        // pass by value to rewrite value in shape
        this.shape = JSON.parse(JSON.stringify(SHAPES[this.typeId]));
        for (let row=0; row < this.shape.length; row++) {
            for (let col=0; col < this.shape[row].length; col++) {
                if (this.shape[row][col] > 0) this.shape[row][col] = turn;
            }
        }

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

    randomizeTetrominoTypes(noOfTypes) {
        // typeId ranges 1 to 7
        return Math.floor(Math.random() * noOfTypes + 1);
    }
}