class AccountForMatch {
    ctxNext;
    level;
    lines;
    player1HP;
    player2HP;
    setTimeLevel;
    currentTurn;

    constructor(ctxNext, setTimeLevel) {
        this.resetAccount();

        this.ctxNext = ctxNext;
        this.initCtxNext();

        this.setTimeLevel = setTimeLevel;
    }

    setLevel(level) {
        this.level = level;
        this.updateAccountDom('level', level);
    }

    setLines(lines) {
        this.lines = lines;
        this.updateAccountDom('lines', lines);
    }

    setPlayer1HP(player1HP) {
        if (player1HP <= 0) player1HP = 0;
        this.player1HP = player1HP;
        this.updateAccountDom('player1HP', player1HP);
    }

    setPlayer2HP(player2HP) {
        if (player2HP <= 0) player2HP = 0;
        this.player2HP = player2HP;
        this.updateAccountDom('player2HP', player2HP);
    }

    updateAccountDom(key, value) {
        let element = document.getElementById(key);
        if (element) {
            element.textContent = value;
        }
    };

    resetAccount() {
        this.setLevel(0);
        this.setLines(0);
        this.setPlayer1HP(MAX_HP);
        this.setPlayer2HP(MAX_HP);
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

    onTurnChanged(turn) {
        this.currentTurn = turn;
    }

    updateByClearedLines(clearedRows) {
        if (clearedRows.length <= 0) return;
        this.addLines(clearedRows.length);

        // apply damage
        this.applyDamage(clearedRows);

        // if it reached the lines for next level
        if (this.lines >= LINES_PER_LEVEL) {
            this.addLevel(1);

            // remove account's lines so start next level
            this.addLines(-1 * LINES_PER_LEVEL);

            // increase speed of game
            this.setTimeLevel(LEVEL[this.level]);
        }
    }

    applyDamage(clearedRows) {
        let damage = 0;
        clearedRows.forEach(row => {
            row.forEach(cell => {
                if (cell === this.currentTurn) damage++;
            });
        });

        if (this.currentTurn === TURN.PLAYER1) {
            this.minusPlayer2HP(damage);
        } else {
            this.minusPlayer1HP(damage);
        }
    }

    minusPlayer1HP(damage) {
        const newHP = this.player1HP - damage;
        this.setPlayer1HP(newHP);
    }

    minusPlayer2HP(damage) {
        const newHP = this.player2HP - damage;
        this.setPlayer2HP(newHP);
    }
}