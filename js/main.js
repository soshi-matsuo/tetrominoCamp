class GameMaster {
    canvas;
    ctx;
    canvasNext;
    ctxNext;
    requestId;
    gameState;
    turn;
    commands;

    account;
    time;
    board;
    keyInputHandler;

    constructor() {
        this.canvas = document.getElementById('board');
        this.ctx = this.canvas.getContext('2d');
        this.canvasNext = document.getElementById('next');
        this.ctxNext = this.canvasNext.getContext('2d');
        this.requestId = null;
        this.gameState = GAME_STATES.READY;

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
        this.account = new AccountForMatch(this.ctxNext, this.time.setLevel.bind(this));
        this.turn.addListener(this.account.onTurnChanged.bind(this.account));
        this.board = new Board(this.ctx, this.ctxNext, this.account.updateByClearedLines.bind(this.account), this.account.clearCtxNext.bind(this.account));

        this.commands = {
            hardDrop: (() => {
                while (this.board.movePiece(0, 1));
            }).bind(this),
            softDrop: (() => {
                this.board.movePiece(0, 1);
            }).bind(this),
            player1: {
                up: this.board.rotate.bind(this.board),
                left: this.board.movePiece.bind(this.board, -1, 0),
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

        this.keyInputHandler = new KeyInputHandler({});
    }

    start() {
        this.resetGame(this.account.resetAccount.bind(this.account));
        this.time.start = performance.now();
        // if old game is running, cancel it
        if (this.requestId) cancelAnimationFrame(this.requestId);
        this.gameState = GAME_STATES.PLAYING;
        this.loopGame();
    }

    resetGame(resetAccount) {
        resetAccount();
        this.turn.setTurn(TURN.PLAYER1);
        this.time.init();
        this.board.reset(COLORS[this.turn.getTurn()], COLORS[this.turn.getNextTurn()]);
        this.keyInputHandler.setCommands(this.commands.player1);
    }

    update(now) {
        switch (this.gameState) {
            case GAME_STATES.READY:
                break;
            case GAME_STATES.PLAYING:
                this.time.update(now);
                if (!this.time.isElapsedEnough(now)) return;

                const isDropped = this.board.drop();
                if (this.board.isReachedRoof() || (this.account.player1HP <= 0) || (this.account.player2HP <= 0)) {
                    this.gameOver();
                    return;
                }
                if (!isDropped) {
                    // switch turn
                    this.turn.switchTurn();
                    // move next mino to currrent one
                    this.board.switchCurrentPiece();
                    // generate next piece
                    this.board.getNewPiece(COLORS[this.turn.getNextTurn()]);
                }
                break;
            case GAME_STATES.PAUSE:
                break;
            case GAME_STATES.GAMEOVER:
                break;
            default:
                break;
        }
    }

    flip() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    draw() {
        switch (this.gameState) {
            case GAME_STATES.READY:
                break;
            case GAME_STATES.PLAYING:
                this.board.draw();
                break;
            case GAME_STATES.PAUSE:
                this.board.draw();
                this.drawPause(this.ctx);
                break;
            case GAME_STATES.GAMEOVER:
                this.board.draw();
                this.drawGameOver(this.ctx);
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
        if (this.turn.getTurn() === TURN.PLAYER1) this.account.minusPlayer1HP(parseInt(MAX_HP / 3));
        if (this.turn.getTurn() === TURN.PLAYER2) this.account.minusPlayer2HP(parseInt(MAX_HP / 3));

        this.gameState = GAME_STATES.GAMEOVER;
        this.keyInputHandler.setCommands(this.commands.gameOver);
    }

    drawGameOver(ctx) {
        ctx.fillStyle = 'black';
        ctx.fillRect(1, 3, 8, 1.2);
        ctx.font = '1px Arial';
        ctx.fillStyle = 'red';
        if (this.account.player1HP < this.account.player2HP) {
            ctx.fillText('Player2 Win!!', 1.8, 4);
        } else if (this.account.player1HP > this.account.player2HP) {
            ctx.fillText('Player1 Win!!', 1.8, 4);
        } else {
            ctx.fillText('DRAW', 1.8, 4);
        }
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

    drawPause(ctx) {
        ctx.fillStyle = 'black';
        ctx.fillRect(1, 3, 8, 1.2);
        ctx.font = '1px Arial';
        ctx.fillStyle = 'yellow';
        ctx.fillText('PAUSED', 3, 4);
    }
}

const gameMaster = new GameMaster();
const play = () => {
    if (gameMaster === undefined) return;
    gameMaster.start();
}