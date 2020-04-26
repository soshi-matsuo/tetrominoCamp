class GameMaster extends Drawable {
    canvas;
    ctx;
    requestId;
    gameState;
    turn;
    commands;
    winner; // 0: draw, 1: player1, 2: player2, -1: not set
    gameOveredOnce;

    account;
    time;
    board;
    keyInputHandler;

    constructor() {
        super(document.getElementById('board').getContext('2d'), IN_PRODUCTION);
        this.canvas = document.getElementById('board');
        this.ctx = this.canvas.getContext('2d');
        this.initCtx();

        this.requestId = null;
        this.gameState = GAME_STATES.READY;

        this.winner = -1;

        this.turn = {
            value: TURN.PLAYER1,
            listeners: [],
            setTurn: (val) => {
                this.turn.value = val;
                this.turn.notify(this.turn.getTurn());
            },
            switchTurn: () => {
                if (this.turn.getTurn() == TURN.PLAYER1) {
                    this.keyInputHandler.setCommands(this.commands.player2);
                } else {
                    this.keyInputHandler.setCommands(this.commands.player1);
                }
                this.turn.setTurn(this.turn.getNextTurn());
            },
            getNextTurn: () => {
                return (this.turn.getTurn() % 2) + 1;
            },
            getTurn: () => {
                return this.turn.value;
            },
            addListener: (listener) => {
                this.turn.listeners.push(listener);
            },
            removeListener: (listener) => {
                this.turn.listeners.splice(this.turn.listeners.indexOf(listener), 1);
            },
            notify: (data) => {
                for (let i = 0; i < this.turn.listeners.length; i++) {
                    this.turn.listeners[i](data);
                }
            }
        };

        this.time = {
            start: 0,
            elapsed: 0,
            level: LEVEL[0],
            init: () => {
                this.time.start = 0;
                this.time.elapsed = 0;
                this.time.level = LEVEL[0];
            },
            setLevel: (level) => {
                this.time.level = level;
            },
            update: (now) => {
                this.time.elapsed = now - this.time.start;
            },
            isElapsedEnough: (now) => {
                const elapsed = this.time.elapsed > this.time.level;
                if (elapsed) {
                    this.time.start = now;
                }
                return elapsed;
            }
        };
        this.account = new AccountForMatch(this.time.setLevel.bind(this), this.ctx);
        this.turn.addListener(this.account.onTurnChanged.bind(this.account));
        this.board = new Board(this.ctx, this.account.updateByClearedLines.bind(this.account));

        this.commands = {
            hardDrop: (() => {
                while (this.board.movePiece(0, 1));
            }).bind(this),
            softDrop: (() => {
                this.board.movePiece(0, 1);
            }).bind(this),
            player1: {
                up: this.board.rotate.bind(this.board), // this.account.btnCont.setAnimState('pressed');
                left: this.board.movePiece.bind(this.board, -1, 0), //this.account.btnCont..... per each inputs
                down: () => { this.commands.softDrop(); },
                right: this.board.movePiece.bind(this.board, 1, 0),
                space: () => { this.commands.hardDrop(); },
                p: this.pause.bind(this)
            },
            player2: {
                w: this.board.rotate.bind(this.board),
                a: this.board.movePiece.bind(this.board, -1, 0),
                s: () => { this.commands.softDrop(); },
                d: this.board.movePiece.bind(this.board, 1, 0),
                c: () => { this.commands.hardDrop(); },
                p: this.pause.bind(this)
            },
            pause: {
                p: this.pause.bind(this),
            }
        };

        this.gameOveredOnce = 0;

        this.keyInputHandler = new KeyInputHandler({});
    }

    initCtx() {
        // calculate size of canvas from constants.
        this.ctx.canvas.width = SCREEN_WIDTH;
        this.ctx.canvas.height = SCREEN_HEIGHT;
    }

    start() {
        this.resetGame(this.account.resetAccount.bind(this.account));
        this.time.start = performance.now();
        this.gameState = GAME_STATES.PLAYING;
    }

    resetGame(resetAccount) {
        resetAccount();
        this.turn.setTurn(TURN.PLAYER1);
        this.time.init();
        this.board.reset(COLORS[this.turn.getTurn()], COLORS[this.turn.getNextTurn()]);
        this.keyInputHandler.setCommands(this.commands.player1);
        this.gameOveredOnce = 0;
    }

    update(now) {
        this.account.update();
        switch (this.gameState) {
            case GAME_STATES.READY:
                break;
            case GAME_STATES.PLAYING:
                this.updatePlaying(now);
                break;
            case GAME_STATES.PAUSE:
                break;
            case GAME_STATES.GAMEOVER:
                break;
            default:
                break;
        }
    }

    updatePlaying(now) {
        this.board.clearLineFx.update();
        this.time.update(now);
        if (!this.time.isElapsedEnough(now)) return;

        const isDropped = this.board.drop();
        if (this.board.isReachedRoof()) {
            // -- normal pattern --
            // this.account.minusPlayerHP(this.turn.getTurn(), GAMEOVER_PENALTY);
            // this.gameOver();
            // -- a game without honor pattern --
            if (this.gameOveredOnce == 0) {
                this.gameOveredOnce++;
            }
            this.turn.switchTurn();
            this.board.reset(COLORS[this.turn.getTurn()], COLORS[this.turn.getNextTurn()]);
            return;
        }
        if ((this.account.player1HP <= 0) || (this.account.player2HP <= 0)) {
            this.gameOver();
            return;
        }
        if (!isDropped) {
            this.turn.switchTurn();
            this.board.switchCurrentPiece();
            this.board.getNewPiece(COLORS[this.turn.getNextTurn()]);
        }
    }

    flip() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    draw() {
        this.account.draw();
        switch (this.gameState) {
            case GAME_STATES.READY:
                this.board.draw(OFFSET_X, OFFSET_Y);
                break;
            case GAME_STATES.PLAYING:
                this.board.draw(OFFSET_X, OFFSET_Y);
                // -- jingi naki pattern --
                if (this.gameOveredOnce >= 1 && this.gameOveredOnce <= 180) {
                    const msg = "JINGI NAKI TATAKAI!!";
                    const fontSize = 36;
                    const length = msg.length * fontSize + 20;
                    const x = (SCREEN_WIDTH - length) * 0.5;
                    this.ctx.globalAlpha = 0.75;
                    this.drawFillRect(x, SCREEN_HEIGHT * 0.28, length, 75, 'black');
                    this.ctx.globalAlpha = 1;
                    this.drawText(msg, SCREEN_WIDTH * 0.5, SCREEN_HEIGHT * 0.3, fontSize, 'red', 'center');
                    this.gameOveredOnce++;
                }
                break;
            case GAME_STATES.PAUSE:
                this.board.draw(OFFSET_X, OFFSET_Y);
                this.drawPause();
                break;
            case GAME_STATES.GAMEOVER:
                this.board.draw(OFFSET_X, OFFSET_Y);
                this.drawGameOver();
                break;
            default:
                break;
        }
    }

    loopGame(now = 0) {
        this.update(now);
        this.flip();
        this.draw();
        this.requestId = requestAnimationFrame(this.loopGame.bind(this));
    }

    gameOver() {
        if (this.account.player1HP < this.account.player2HP){
            this.winner = 2;
            this.account.animationController2.setAnimationState('win');
            this.account.animationController1.setAnimationState('dead');
        }
        else if (this.account.player1HP > this.account.player2HP) {
            this.winner = 1;
            this.account.animationController1.setAnimationState('win');
            this.account.animationController2.setAnimationState('dead');
        }
        else {
            this.winner = 0;
            this.account.animationController1.setAnimationState('draw');
            this.account.animationController2.setAnimationState('draw');
        }
        this.gameState = GAME_STATES.GAMEOVER;
        this.keyInputHandler.setCommands(this.commands.gameOver);
    }

    drawGameOver() {
        let msg = '';
        let color = '';
        if (this.winner == 2) {
            msg = 'Player2 Win!!'; //#5e89f0
            color = PLAYER2_WIN_COLOR;
        } else if (this.winner == 1) {
            msg = 'Player1 Win!!';
            color = PLAYER1_WIN_COLOR; //#f05e5e //creamy white: #fffbe5
        } else {
            msg = 'DRAW';
            color = DRAW_COLOR;
        }
        const fontSize = 48;
        const length = msg.length * fontSize + 20;
        const x = (SCREEN_WIDTH - length) * 0.5;
        this.drawFillRect(x, SCREEN_HEIGHT * 0.28, length, 75, 'black');
        this.drawText(msg, SCREEN_WIDTH * 0.5, SCREEN_HEIGHT * 0.3, fontSize, color, 'center');
    }

    pause() {
        if (this.gameState == GAME_STATES.PLAYING) {
            this.gameState = GAME_STATES.PAUSE;
            this.keyInputHandler.setCommands(this.commands.pause);
        }
        else if (this.gameState == GAME_STATES.PAUSE) {
            this.gameState = GAME_STATES.PLAYING;
            if (this.turn.getTurn() === TURN.PLAYER1)
                this.keyInputHandler.setCommands(this.commands.player1);
            else
                this.keyInputHandler.setCommands(this.commands.player2);
        }
    }

    drawPause() {
        this.drawFillRect(OFFSET_X, SCREEN_HEIGHT * 0.28, BOARD_SCREEN_WIDTH, 75, 'black');
        this.drawText('PAUSED', SCREEN_WIDTH * 0.5, SCREEN_HEIGHT * 0.3, 48, 'yellow', 'center');
    }
}

const gameMaster = new GameMaster();
gameMaster.loopGame();
const play = () => {
    if (gameMaster === undefined) return;
    gameMaster.start();
}