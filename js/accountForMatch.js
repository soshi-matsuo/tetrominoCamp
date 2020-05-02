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

        this.btnAnimCtrs1 = {};
        this.btnAnimCtrs2 = {};

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

        this.loadSpriteSheet('img/spreadsheet_buttons_2x.png', 5, 4, 64)
            .then(sprites => {
                const keyMap = ['rotate', 'left', 'down', 'right', 'hardDown'];
                const keyNum = keyMap.length;
                for (let i =0; i<keyNum; i++) {
                    this.btnAnimCtrs1[keyMap[i]] = new AnimationController();
                    this.btnAnimCtrs1[keyMap[i]].addAnimation('notPressed');
                    this.btnAnimCtrs1[keyMap[i]].addAnimation('pressed');
                    this.btnAnimCtrs1[keyMap[i]].setAnimationData('notPressed', sprites.slice(i, i+1));
                    this.btnAnimCtrs1[keyMap[i]].setAnimationData('pressed', sprites.slice(i+5, i+6));
                    this.btnAnimCtrs1[keyMap[i]].connectAnimation('pressed', 'notPressed', (params) => params.getAnimTime() > 100);
                    this.btnAnimCtrs1[keyMap[i]].setAnimationState('notPressed');
                }
                for (let i =0; i<keyNum; i++) {
                    this.btnAnimCtrs2[keyMap[i]] = new AnimationController();
                    this.btnAnimCtrs2[keyMap[i]].addAnimation('notPressed');
                    this.btnAnimCtrs2[keyMap[i]].addAnimation('pressed');
                    this.btnAnimCtrs2[keyMap[i]].setAnimationData('notPressed', sprites.slice(i+10, i+11));
                    this.btnAnimCtrs2[keyMap[i]].setAnimationData('pressed', sprites.slice(i+15, i+16));
                    this.btnAnimCtrs2[keyMap[i]].connectAnimation('pressed', 'notPressed', (params) => params.getAnimTime() > 100);
                    this.btnAnimCtrs2[keyMap[i]].setAnimationState('notPressed');
                }
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
        for(let key in this.btnAnimCtrs1) {
            this.btnAnimCtrs1[key].update();
        }
        for(let key in this.btnAnimCtrs2) {
            this.btnAnimCtrs2[key].update();
        }
    }

    drawTurn() {
        this.drawGuideBoxOnDebug(
            0,
            0,
            ACCOUNT_SCREEN_WIDTH,
            KEY_MAP_HEIGHT,
            'TURN'
        );
        this.drawStrokeRect(TURN_X - 80, TURN_Y + 10, 160, 120, 5, BLACK);
        this.drawFillRect(TURN_X - 45, TURN_Y - 15, 90, 30, 'white');
        this.drawText("TURN", TURN_X, TURN_Y, 20, BLACK, 'center');
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
        this.drawStrokeRect(NEXT_X - 80, NEXT_Y + 10, 160, 120, 5, BLACK);
        this.drawFillRect(NEXT_X - 45, NEXT_Y - 15, 85, 30, 'white');
        this.drawText("NEXT", NEXT_X, NEXT_Y, 20, BLACK, 'center');
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
            20,
            BLACK
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
            20,
            BLACK
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

    drawButtonAnimation(buttonAnimationController, description, x, y, textXBuffer, textYBuffer) {
        if (buttonAnimationController?.getCurrentSprite())
            this.drawImage(buttonAnimationController.getCurrentSprite(), x, y);
        this.drawText(description, x + textXBuffer, y + textYBuffer, 11, BLACK, 'center');
    }

    drawKeyMapPlayer1() {
        this.drawGuideBoxOnDebug(
            0,
            BOARD_SCREEN_HEIGHT,
            KEY_MAP_WIDTH,
            KEY_MAP_HEIGHT,
            'KEY MAP (PLAYER 1)'
        );
        const x = 30;
        const y = 620;
        const buttonSize = 70;
        const rowSpace = -10;
        const textYBuffer = 10;
        this.drawButtonAnimation(this.btnAnimCtrs1['left'], '[left]', x, y, buttonSize * 0.5, textYBuffer);
        this.drawButtonAnimation(this.btnAnimCtrs1['rotate'], '[up]', x + buttonSize, y, buttonSize * 0.5, textYBuffer);
        this.drawButtonAnimation(this.btnAnimCtrs1['right'], '[right]', x + buttonSize * 2, y, buttonSize * 0.5, textYBuffer);
        this.drawButtonAnimation(this.btnAnimCtrs1['down'], '[down]', x + buttonSize * 1.5, y + buttonSize + rowSpace, buttonSize * 0.5, textYBuffer);
        this.drawButtonAnimation(this.btnAnimCtrs1['hardDown'], '[space]', x + buttonSize * 2.5, y + buttonSize + rowSpace, buttonSize * 0.5, textYBuffer);
    }

    drawKeyMapPlayer2() {
        this.drawGuideBoxOnDebug(
            KEY_MAP_WIDTH,
            BOARD_SCREEN_HEIGHT,
            KEY_MAP_WIDTH,
            KEY_MAP_HEIGHT,
            'KEY MAP (PLAYER 2)'
        );
        const x = SCREEN_WIDTH - 64 - 30;
        const y = 620;
        const buttonSize = 70;
        const rowSpace = -10;
        const textYBuffer = 10;
        this.drawButtonAnimation(this.btnAnimCtrs2['left'], 'A', x - buttonSize * 2, y, buttonSize * 0.5, textYBuffer);
        this.drawButtonAnimation(this.btnAnimCtrs2['rotate'], 'W', x - buttonSize, y, buttonSize * 0.5, textYBuffer);
        this.drawButtonAnimation(this.btnAnimCtrs2['right'], 'D', x, y, buttonSize * 0.5, textYBuffer);
        this.drawButtonAnimation(this.btnAnimCtrs2['down'], 'S', x - buttonSize * 2.5, y + buttonSize + rowSpace, buttonSize * 0.5, textYBuffer);
        this.drawButtonAnimation(this.btnAnimCtrs2['hardDown'], 'C', x - buttonSize * 1.5, y + buttonSize + rowSpace, buttonSize * 0.5, textYBuffer);
    }

    draw() {
        this.drawTurn();
        this.drawNext();
        this.drawPlayer1();
        this.drawPlayer2();
    }
}