class AccountForMatch extends Drawable {
    level;
    lines;
    player1HP;
    player2HP;
    setTimeLevel;
    currentTurn;
    images;
    timeElapsed;
    animDuration;
    playerStatus;

    constructor(setTimeLevel, ctx) {
        super(ctx, IN_PRODUCTION);
        const imageData = [
            { p1Normal: 'img/player1/player1_normal.png' },
            { p1Damaged: 'img/player1/player1_damaged.png' },
            { p1Front: 'img/player1/player1_front.png' },
            { p2Normal: 'img/player2/player2_normal.png' },
            { p2Damaged: 'img/player2/player2_damaged.png' },
            { p2Front: 'img/player2/player2_front.png' }
        ];
        this.loadImage(imageData);

        this.resetAccount();

        this.setTimeLevel = setTimeLevel;

        this.playerStatus = {
            player1: PLAYER_STATUS_NORMAL,
            player2: PLAYER_STATUS_NORMAL,
        }

        this.timeElapsed = -1;
        this.animDuration = -1;
    }

    setLevel(level) {
        this.level = level;
    }

    setLines(lines) {
        this.lines = lines;
    }

    setPlayerHP(playerId, playerHP) {
        if (playerHP <= 0) playerHP = 0;
        if (playerId == TURN.PLAYER1) {
            this.player1HP = playerHP;
        }
        else {
            this.player2HP = playerHP;
        }
    }

    resetAccount() {
        this.setLevel(0);
        this.setLines(0);
        this.setPlayerHP(TURN.PLAYER1, MAX_HP);
        this.setPlayerHP(TURN.PLAYER2, MAX_HP);
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
            this.minusPlayerHP(TURN.PLAYER2, damage);
            this.changePlayerStatus(TURN.PLAYER2, PLAYER_STATUS_DAMAGED, 1000);
        } else {
            this.minusPlayerHP(TURN.PLAYER1, damage);
            this.changePlayerStatus(TURN.PLAYER1, PLAYER_STATUS_DAMAGED, 1000);
        }
    }

    changePlayerStatus(playerId, state, duration=-1, stateBack=PLAYER_STATUS_NORMAL) {
        if (playerId == TURN.PLAYER1) {
            this.playerStatus.player1 = state;
            if (duration > -1)
                setTimeout(() => {
                    this.playerStatus.player1 = stateBack;
                }, duration);
        }
        else {
            this.playerStatus.player2 = state;
            if (duration > -1)
                setTimeout(() => {
                    this.playerStatus.player2 = stateBack;
                }, duration);
        }
    }

    updateTimeElapsed() {
        this.timeElapsed++;
        this.timeElapsed / 60;
    }

    minusPlayerHP(playerId, damage) {
        const newHP = (playerId == TURN.PLAYER1) ? 
            this.player1HP - damage :
            this.player2HP - damage;
        this.setPlayerHP(playerId, newHP);
    }

    draw() {
        // secure turn area
        this.drawGuideBoxOnDebug(
            0, 
            0, 
            ACCOUNT_SCREEN_WIDTH,
            KEY_MAP_HEIGHT,
            'TURN'
        );
        this.drawText("TURN", TURN_X, TURN_Y, 20);
        switch(this.currentTurn) {
            case TURN.PLAYER1:
                this.drawImage('p1Front', TURN_X, TURN_Y + 30);
                break;
            case TURN.PLAYER2:
                this.drawImage('p2Front', TURN_X, TURN_Y + 30);
                break;
            default:
                // not started yet!
                break;
        }
        // secure next area
        this.drawGuideBoxOnDebug(
            ACCOUNT_SCREEN_WIDTH + BOARD_SCREEN_WIDTH,
            0,
            ACCOUNT_SCREEN_WIDTH,
            KEY_MAP_HEIGHT,
            'NEXT'
        );
        this.drawText("NEXT", NEXT_X, NEXT_Y, 20)
        // secure HP and avator area
        this.drawGuideBoxOnDebug(
            0,
            KEY_MAP_HEIGHT,
            ACCOUNT_SCREEN_WIDTH,
            BOARD_SCREEN_HEIGHT - KEY_MAP_HEIGHT,
            'PLAYER 1 (RED)'
        );
        this.drawText(
            `HP: ${this.player1HP}`,
            PLAYER1_HP_X,
            PLAYER1_HP_Y,
            20
        );
        switch(this.playerStatus.player1) {
            case PLAYER_STATUS_NORMAL:
                this.drawImage('p1Normal', PLAYER1_X, PLAYER1_Y);
                break;
            case PLAYER_STATUS_DAMAGED:
                this.drawImage('p1Damaged', PLAYER1_X, PLAYER1_Y);
                break;
        }
        this.drawGuideBoxOnDebug(
            ACCOUNT_SCREEN_WIDTH + BOARD_SCREEN_WIDTH,
            KEY_MAP_HEIGHT,
            ACCOUNT_SCREEN_WIDTH,
            BOARD_SCREEN_HEIGHT - KEY_MAP_HEIGHT,
            'PLAYER 2 (BLUE)'
        );
        this.drawText(
            `HP: ${this.player2HP}`,
            PLAYER2_HP_X,
            PLAYER2_HP_Y,
            20
        );
        switch(this.playerStatus.player2) {
            case PLAYER_STATUS_NORMAL:
                this.drawImage('p2Normal', PLAYER2_X, PLAYER2_Y);
                break;
            case PLAYER_STATUS_DAMAGED:
                this.drawImage('p2Damaged', PLAYER2_X, PLAYER2_Y);
                break;
        }
        // secure keyMap area
        this.drawGuideBoxOnDebug(
            0,
            BOARD_SCREEN_HEIGHT,
            KEY_MAP_WIDTH,
            KEY_MAP_HEIGHT,
            'KEY MAP (PLAYER 1)'
        );
        this.drawText(
            `left: ←, right: →, down: ↓`,
            0,
            BOARD_SCREEN_HEIGHT + 50,
            12
        );
        this.drawText(
            `hard drop: [space], rotate: ↑`,
            0,
            BOARD_SCREEN_HEIGHT + 50 + 12,
            12
        );
        this.drawGuideBoxOnDebug(
            KEY_MAP_WIDTH,
            BOARD_SCREEN_HEIGHT,
            KEY_MAP_WIDTH,
            KEY_MAP_HEIGHT,
            'KEY MAP (PLAYER 2)'
        );
        this.drawText(
            `left: a, right: d, down: s`,
            KEY_MAP_WIDTH,
            BOARD_SCREEN_HEIGHT + 50,
            12
        );
        this.drawText(
            `hard drop: c, rotate: w`,
            KEY_MAP_WIDTH,
            BOARD_SCREEN_HEIGHT + 50 + 12,
            12
        );
    }
}