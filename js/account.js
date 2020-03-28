class Account {
    ctxNext;
    score;
    level;
    lines;
    setTimeLevel;

    constructor(ctxNext, setTimeLevel) {
        this.setScore(0);
        this.setLevel(0);
        this.setLines(0);

        this.ctxNext = ctxNext;
        this.initCtxNext();

        this.setTimeLevel = setTimeLevel;
    }

    setScore(score) {
        this.score = score;
        this.updateAccountDom('score', score);
    }

    setLevel(level) {
        this.level = level;
        this.updateAccountDom('level', level);
    }

    setLines(lines) {
        this.lines = lines;
        this.updateAccountDom('lines', lines);
    }

    updateAccountDom(key, value) {
        let element = document.getElementById(key);
        if (element) {
            element.textContent = value;
        }
    };

    resetAccount() {
        this.setScore(0);
        this.setLevel(0);
        this.setLines(0);
    }

    addScore(score) {
        const newScore = this.score + score;
        this.setScore(newScore);
    }

    addLines(lines) {
        const newLines = this.lines + lines;
        this.setLines(newLines);
    }

    addLevel(level) {
        const newLevel = this.level + level;
        this.setLevel(newLevel);
    }

    initCtxNext() {
        this.ctxNext.canvas.width = 4 * BLOCK_SIZE;
        this.ctxNext.canvas.height = 4 * BLOCK_SIZE;
        this.ctxNext.scale(BLOCK_SIZE, BLOCK_SIZE);
    }

    clearCtxNext() {
        this.ctxNext.clearRect(0, 0, 
            this.ctxNext.canvas.width,
            this.ctxNext.canvas.height
        );
    }

    updateByClearedLines(clearedLines) {
        if (clearedLines <= 0) return;
        // calculate points from cleared lines and current level
        this.addScore(this.getLinesClearedPoints(clearedLines));
        this.addLines(clearedLines);

        // if it reached the lines for next level
        if (this.lines >= LINES_PER_LEVEL) {
            this.addLevel(1);

            // remove account's lines so start next level
            this.addLines(-1 * LINES_PER_LEVEL);

            // increase speed of game
            this.setTimeLevel(LEVEL[this.level]);
        }
    }

    getLinesClearedPoints(lines) {
        const lineClearPoints = lines === 1 ? POINTS.SINGLE
            : lines === 2 ? POINTS.DOUBLE
            : lines === 3 ? POINTS.TRIPLE
            : lines === 4 ? POINTS.TETRIS
            : 0;
        return (this.level + 1) * lineClearPoints;
    }

}