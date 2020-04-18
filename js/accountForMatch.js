class AccountForMatch {
    level;
    lines;
    player1HP;
    player2HP;
    setTimeLevel;
    currentTurn;

    constructor(setTimeLevel) {
        this.resetAccount();

        this.setTimeLevel = setTimeLevel;
    }

    setLevel(level) {
        this.level = level;
    }

    setLines(lines) {
        this.lines = lines;
    }

    setPlayer1HP(player1HP) {
        if (player1HP <= 0) player1HP = 0;
        this.player1HP = player1HP;
    }

    setPlayer2HP(player2HP) {
        if (player2HP <= 0) player2HP = 0;
        this.player2HP = player2HP;
    }

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
        const damage = clearedRows.length;

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

    draw(ctx) {
        ctx.lineWidth = 1;
        // secure turn area
        ctx.strokeRect(0, 0, ACCOUNT_SCREEN_WIDTH, KEY_MAP_HEIGHT);
        // secure next area
        ctx.strokeRect(ACCOUNT_SCREEN_WIDTH + BOARD_SCREEN_WIDTH, 0, ACCOUNT_SCREEN_WIDTH, KEY_MAP_HEIGHT);
        // secure HP and avator area
        ctx.strokeRect(0, KEY_MAP_HEIGHT, ACCOUNT_SCREEN_WIDTH, BOARD_SCREEN_HEIGHT - KEY_MAP_HEIGHT);
        ctx.strokeRect(ACCOUNT_SCREEN_WIDTH + BOARD_SCREEN_WIDTH, KEY_MAP_HEIGHT, ACCOUNT_SCREEN_WIDTH, BOARD_SCREEN_HEIGHT - KEY_MAP_HEIGHT);
        // secure keyMap area
        ctx.strokeRect(0, BOARD_SCREEN_HEIGHT, KEY_MAP_WIDTH, KEY_MAP_HEIGHT);
        ctx.strokeRect(KEY_MAP_WIDTH, BOARD_SCREEN_HEIGHT, KEY_MAP_WIDTH, KEY_MAP_HEIGHT);
    }
}