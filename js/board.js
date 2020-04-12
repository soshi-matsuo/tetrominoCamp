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
    reset(color1st, color2nd) {
        this.grid = this.getEmptyGrid();
        this.piece = new Piece(this.ctx, color1st);
        this.piece.setStartingPosition();

        this.getNewPiece(color2nd); 
    }

    getNewPiece(color) {
        this.next = new Piece(this.ctxNext, color);
        this.clearCtxNext();
        this.next.draw();
    }

    draw() {
        this.piece.draw();
        this.drawBoard();
    }

    movePiece(horizontal, vertical) {
        const newPiece = {...this.piece};
        newPiece.x += horizontal;
        newPiece.y += vertical;

        if (this.valid(newPiece)) {
            this.piece.move(newPiece);
            return true;
        }
        return false;
    }

    // rotate piece clockwise
    rotate() {
        // copy p deeply with JSON for immutability
        let clone = JSON.parse(JSON.stringify(this.piece));

        // transpose piece
        for (let y = 0; y < clone.shape.length; y++) {
            for (let x = 0; x < y; x++) {
                [clone.shape[x][y], clone.shape[y][x]] = [clone.shape[y][x], clone.shape[x][y]];
            }
        }
        // reverse the order of the colmuns
        clone.shape.forEach(row => row.reverse());

        if (this.valid(clone)) {
            this.piece.move(clone);
        }
    }

    // drop piece automatically for game loop
    drop() {
        // drop mino
        if (this.movePiece(0, 1)) return true;
        this.freeze();
        this.clearLines();

        return false;
    }
    
    // move next mino to currrent one
    switchCurrentPiece() {
        this.piece = this.next;
        this.piece.ctx = this.ctx;
        this.piece.setStartingPosition();
    }

    // updateByClearedLinesに渡したい
    clearLines() {
        let rows = [];
        this.grid.forEach((row, y) => {
            // if the row is filled with block
            if (row.every(value => value > 0)) {
                // remove the row from grid
                rows.push(this.grid.splice(y, 1)[0]);

                // add zero filled row at the top of grid
                this.grid.unshift(Array(COLS).fill(0));
            }
        });
        this.updateByClearedLines(rows);
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

    isInsideWalls(x) {
        return x >= 0 && x < COLS;
    }

    isAboveFloor(y) {
        return y <= ROWS;
    }

    isReachedRoof() {
        return this.piece.y === 0;
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
                    (this.isInsideWalls(x) && this.isAboveFloor(y) && this.isNotOccupied(x, y))
                );
            });
        });
    }
}