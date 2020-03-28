class Board {
    ctx;
    ctxNext;
    grid;
    piece;
    next; // next piece
    requestId;
    time;
    updateByClearedLines;
    clearCtxNext;

    constructor(ctx, ctxNext, updateByClearedLines, clearCtxNext) {
        this.ctx = ctx;
        this.ctxNext = ctxNext;
        this.init();
        this.updateByClearedLines = updateByClearedLines;
        this.clearCtxNext = clearCtxNext;
    }

    init() {
        // calculate size of canvas from constants.
        this.ctx.canvas.width = COLS * BLOCK_SIZE;
        this.ctx.canvas.height = ROWS * BLOCK_SIZE;
        // scale blocks
        this.ctx.scale(BLOCK_SIZE, BLOCK_SIZE);

        // init next
        this.ctxNext.canvas.width = 4 * BLOCK_SIZE;
        this.ctxNext.canvas.height = 4 * BLOCK_SIZE;
        this.ctxNext.scale(BLOCK_SIZE, BLOCK_SIZE);
    }

    // Reset the board when we start a new game
    reset() {
        this.grid = this.getEmptyGrid();
        this.piece = new Piece(this.ctx);
        this.piece.setStartingPosition();

        this.getNewPiece();
    }

    getNewPiece() {
        this.next = new Piece(this.ctxNext);

        this.clearCtxNext();
        this.next.draw();
    }

    draw() {
        this.piece.draw();
        this.drawBoard();
    }

    // drop piece automatically for game loop
    drop() {
        let p = moves[KEY.DOWN](this.piece);
        if (this.valid(p)) {
            this.piece.move(p);
        } else {
            this.freeze();
            this.clearLines();
            if (this.piece.y === 0) {
                // Game Over
                return false;
            }
            this.piece = this.next;
            this.piece.ctx = this.ctx;
            this.piece.setStartingPosition();
            this.getNewPiece();
        }
        return true;
    }

    clearLines() {
        let lines = 0;
        this.grid.forEach((row, y) => {
            // if the row is filled with block
            if (row.every(value => value > 0)) {
                lines++;

                // remove the row from grid
                this.grid.splice(y, 1);

                // add zero filled row at the top of grid
                this.grid.unshift(Array(COLS).fill(0));
            }
        });
        this.updateByClearedLines(lines);
    }

    drawBoard() {
        this.grid.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value > 0) {
                    this.ctx.fillStyle = COLORS[value];
                    this.ctx.fillRect(x, y, 1, 1);
                }
            });
        });
    }

    freeze() {
        this.piece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value > 0) {
                    this.grid[y + this.piece.y][x + this.piece.x] = value;
                }
            });
        });
    }

    // Get matrix filled with zero
    getEmptyGrid() {
        return Array.from({ length: ROWS }, () => new Array(COLS).fill(0));
    }

    isNotOccupied(x, y) {
        return this.grid[y] && this.grid[y][x] === 0;
    }

    insideWalls(x) {
        return x >= 0 && x < COLS;
    }

    aboveFloor(y) {
        return y <= ROWS;
    }

    // accept potential new position of piece and check its all cells
    valid(p) {
        return p.shape.every((row, dy) => {
            return row.every((value, dx) => {
                // p.x, p.y represent the left upper position of potential new position of the piece in the board
                // dx, dy represent the cell's distance from p.x, p.y
                // therefore x, y represent the cell's position in the board
                let x = p.x + dx;
                let y = p.y + dy;
                return (
                    value === 0 ||
                    (this.insideWalls(x) && this.aboveFloor(y) && this.isNotOccupied(x, y))
                );
            });
        });
    }

    // rotate piece clockwise
    rotate(p) {
        // copy p deeply with JSON for immutability
        let clone = JSON.parse(JSON.stringify(p));

        // transpose piece
        for (let y = 0; y < clone.shape.length; y++) {
            for (let x = 0; x < y; x++) {
                [clone.shape[x][y], clone.shape[y][x]] = [clone.shape[y][x], clone.shape[x][y]];
            }
        }
        // reverse the order of the colmuns
        clone.shape.forEach(row => row.reverse());

        return clone;
    }
}