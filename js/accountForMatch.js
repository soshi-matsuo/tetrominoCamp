class AccountForMatch extends Drawable {
    level;
    lines;
    player1HP;
    player2HP;
    setTimeLevel;
    currentTurn;
    animationController1;
    animationController2;
    btnAnimCtrs1;
    btnAnimCtrs2;

    constructor(setTimeLevel, ctx) {
        super(ctx, IN_PRODUCTION);

        this.animationController1 = new AnimationController();
        this.animationController2 = new AnimationController();

        this.btnAnimCtrs1 = new Array(5).fill(new AnimationController());
        this.btnAnimCtrs2 = new Array(5).fill(new AnimationController());

        this.loadSpriteSheet('img/spritesheet_5x.png', 8, 2, 240)
            .then(sprites => {
                this.animationController2.addAnimation('idle');
                this.animationController2.addAnimation('attack');
                this.animationController2.addAnimation('damaged');
                this.animationController2.addAnimation('dead');
                this.animationController2.addAnimation('win');
                this.animationController2.addAnimation('draw');
                this.animationController2.addAnimation('face');
                this.animationController2.setAnimationData('idle', sprites.slice(8, 13), true, 55);
                this.animationController2.setAnimationData('attack', sprites.slice(13, 14));
                this.animationController2.setAnimationData('damaged', sprites.slice(14, 15));
                this.animationController2.setAnimationData('dead', sprites.slice(14, 15));
                this.animationController2.setAnimationData('win', sprites.slice(13, 14));
                this.animationController2.setAnimationData('draw', sprites.slice(8, 9));
                this.animationController2.setAnimationData('face', sprites.slice(15, 16));
                this.animationController2.connectAnimation('attack', 'idle', (params) => params.getAnimTime() > 600);
                this.animationController2.connectAnimation('damaged', 'idle', (params) => params.getAnimTime() > 600);
                this.animationController2.setAnimationState('idle');

                this.animationController1.addAnimation('idle');
                this.animationController1.addAnimation('attack');
                this.animationController1.addAnimation('damaged');
                this.animationController1.addAnimation('dead');
                this.animationController1.addAnimation('win');
                this.animationController1.addAnimation('draw');
                this.animationController1.addAnimation('face');
                this.animationController1.setAnimationData('idle', sprites.slice(0, 5), true, 55);
                this.animationController1.setAnimationData('attack', sprites.slice(5, 6));
                this.animationController1.setAnimationData('damaged', sprites.slice(6, 7));
                this.animationController1.setAnimationData('dead', sprites.slice(6, 7));
                this.animationController1.setAnimationData('win', sprites.slice(5, 6));
                this.animationController1.setAnimationData('draw', sprites.slice(0, 1));
                this.animationController1.setAnimationData('face', sprites.slice(7, 8));
                this.animationController1.connectAnimation('attack', 'idle', (params) => params.getAnimTime() > 600);
                this.animationController1.connectAnimation('damaged', 'idle', (params) => params.getAnimTime() > 600);
                this.animationController1.setAnimationState('idle');
            });

        this.loadSpriteSheet('', 10, 2, 240)
            .then(sprites => {
                const keyMap = ['Up', 'Left', 'Down', 'Right', 'Space'];
                this.btnAnimCtrs1.forEach((ctr, i) => {
                    ctr.addAnimation(`notPressed${keyMap[i]}`);
                    ctr.addAnimation(`pressed${keyMap[i]}`);
                    ctr.setAnimation(`notPressed${keyMap[i]}`, sprites.slice(i, i+1));
                    ctr.setAnimation(`pressed${keyMap[i]}`, sprites.slice(i+5, i+6));
                    ctr.connectAnimation(`pressed${keyMap[i]}`, `notPressed${keyMap[i]}`, (params) => params.getAnimTime() > 200);
                    ctr.setAnimationState(`notPressed${keyMap[i]}`);
                });
                this.btnAnimCtrs2.forEach((ctr, i) => {
                    ctr.addAnimation(`notPressed${keyMap[i]}`);
                    ctr.addAnimation(`pressed${keyMap[i]}`);
                    ctr.setAnimation(`notPressed${keyMap[i]}`, sprites.slice(i+10, i+11));
                    ctr.setAnimation(`pressed${keyMap[i]}`, sprites.slice(i+15, i+16));
                    ctr.connectAnimation(`pressed${keyMap[i]}`, `notPressed${keyMap[i]}`, (params) => params.getAnimTime() > 200);
                    ctr.setAnimationState(`notPressed${keyMap[i]}`);
                });
            });

        this.resetAccount();

        this.setTimeLevel = setTimeLevel;
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
        this.animationController1.setAnimationState('idle');
        this.animationController2.setAnimationState('idle');
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
            this.animationController2.setAnimationState('damaged');
            this.animationController1.setAnimationState('attack');
        } else {
            this.minusPlayerHP(TURN.PLAYER1, damage);
            this.animationController1.setAnimationState('damaged');
            this.animationController2.setAnimationState('attack');
        }
    }

    minusPlayerHP(playerId, damage) {
        const newHP = (playerId == TURN.PLAYER1) ? 
            this.player1HP - damage :
            this.player2HP - damage;
        this.setPlayerHP(playerId, newHP);
    }

    update() {
        this.animationController1.update();
        this.animationController2.update();
    }

    drawTurn() {
        this.drawGuideBoxOnDebug(
            0,
            0,
            ACCOUNT_SCREEN_WIDTH,
            KEY_MAP_HEIGHT,
            'TURN'
        );
        this.drawText("TURN", TURN_X, TURN_Y, 20, 'black', 'center');
        switch(this.currentTurn) {
            case TURN.PLAYER1:
                this.drawImage(this.animationController1.getSpecifiedSprite('face', 0), TURN_AVATOR_X, TURN_AVATOR_Y + 30);
                break;
            case TURN.PLAYER2:
                this.drawImage(this.animationController2.getSpecifiedSprite('face', 0), TURN_AVATOR_X, TURN_AVATOR_Y + 30);
                break;
            default:
                // not started yet!
                break;
        }
    }

    drawNext() {
        this.drawGuideBoxOnDebug(
            ACCOUNT_SCREEN_WIDTH + BOARD_SCREEN_WIDTH,
            0,
            ACCOUNT_SCREEN_WIDTH,
            KEY_MAP_HEIGHT,
            'NEXT'
        );
        this.drawText("NEXT", NEXT_X, NEXT_Y, 20, 'black', 'center');
    }
    
    drawPlayer1() {
        this.drawGuideBoxOnDebug(
            0,
            KEY_MAP_HEIGHT,
            ACCOUNT_SCREEN_WIDTH,
            BOARD_SCREEN_HEIGHT - KEY_MAP_HEIGHT,
            'PLAYER 1 (RED)'
        );
        this.drawText(
            `HP`,
            PLAYER1_HP_X,
            PLAYER1_HP_Y,
            20
        );
        const player1HPHeight = this.player1HP / MAX_HP * PLAYER_HPBAR_HEIGHT;
        this.drawFillRect(
            PLAYER1_HPBAR_X,
            PLAYER1_HPBAR_Y + PLAYER_HPBAR_HEIGHT - player1HPHeight,
            PLAYER_HPBAR_WIDTH,
            player1HPHeight,
            PLAYER1_HPBAR_FILL_COLOR
        );
        this.drawStrokeRect(
            PLAYER1_HPBAR_X,
            PLAYER1_HPBAR_Y,
            PLAYER_HPBAR_WIDTH,
            PLAYER_HPBAR_HEIGHT,
            PLAYER_HPBAR_LINEWIDTH, 
            PLAYER_HPBAR_BORDER_COLOR1
        );
        this.drawKeyMapPlayer1();
        if (this.animationController1.getCurrentSprite())
            this.drawImage(this.animationController1.getCurrentSprite(), PLAYER1_X, PLAYER1_Y);
    }
    
    drawPlayer2() {
        this.drawGuideBoxOnDebug(
            ACCOUNT_SCREEN_WIDTH + BOARD_SCREEN_WIDTH,
            KEY_MAP_HEIGHT,
            ACCOUNT_SCREEN_WIDTH,
            BOARD_SCREEN_HEIGHT - KEY_MAP_HEIGHT,
            'PLAYER 2 (BLUE)'
        );
        this.drawText(
            `HP`,
            PLAYER2_HP_X,
            PLAYER2_HP_Y,
            20
        );
        const player2HPHeight = this.player2HP / MAX_HP * PLAYER_HPBAR_HEIGHT;
        this.drawFillRect(
            PLAYER2_HPBAR_X,
            PLAYER2_HPBAR_Y + PLAYER_HPBAR_HEIGHT - player2HPHeight,
            PLAYER_HPBAR_WIDTH,
            player2HPHeight,
            PLAYER2_HPBAR_FILL_COLOR
        );
        this.drawStrokeRect(
            PLAYER2_HPBAR_X,
            PLAYER2_HPBAR_Y,
            PLAYER_HPBAR_WIDTH,
            PLAYER_HPBAR_HEIGHT,
            PLAYER_HPBAR_LINEWIDTH, 
            PLAYER_HPBAR_BORDER_COLOR2
        );
        this.drawKeyMapPlayer2();
        if (this.animationController2.getCurrentSprite())    
            this.drawImage(this.animationController2.getCurrentSprite(), PLAYER2_X, PLAYER2_Y);
    }

    drawKeyMapPlayer1() {
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
    }

    drawKeyMapPlayer2() {
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

    draw() {
        this.drawTurn();
        this.drawNext();
        this.drawPlayer1();
        this.drawPlayer2();
    }
}