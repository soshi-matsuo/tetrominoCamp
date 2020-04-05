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
        this.turn = TURN.PLAYER1;
        
        
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
        this.account = new Account(this.ctxNext, this.time.setLevel.bind(this));
        
        this.commands = {
            addScore: this.account.addScore.bind(this.account),
            player1Commands: (event) => {
                const pausable = this.gameState == GAME_STATES.PLAYING || 
                            this.gameState == GAME_STATES.PAUSE;
                if (event.keyCode === KEY.P && pausable) {
                    this.pause();
                }
                if (event.keyCode === KEY.ESC && this.gameState == GAME_STATES.PLAYING) {
                    this.gameOver();
                } 
                if (this.gameState == GAME_STATES.PLAYING && this.turn == TURN.PLAYER1) {
                    // stop the event user activates
                    event.preventDefault();

                    if (event.keyCode === KEY.LEFT) {
                        this.board.movePiece(-1, 0);
                    } 
                    if (event.keyCode === KEY.RIGHT) {
                        this.board.movePiece(1, 0);
                    }
                    if (event.keyCode === KEY.DOWN) {
                        this.board.movePiece(0, 1);
                        this.commands.addScore(POINTS.SOFT_DROP);
                    }
                    if (event.keyCode === KEY.UP) {
                        this.board.rotate();
                    }
                    if (event.keyCode === KEY.SPACE) {
                        while (this.board.movePiece(0, 1)) {
                            this.commands.addScore(POINTS.HARD_DROP);
                        }
                    }
                }
            },
            player2Commands: (event) => {
                const pausable = this.gameState == GAME_STATES.PLAYING || 
                            this.gameState == GAME_STATES.PAUSE;
                if (event.keyCode === KEY.P && pausable) {
                    this.pause();
                }
                if (event.keyCode === KEY.ESC && this.gameState == GAME_STATES.PLAYING) {
                    this.gameOver();
                } 
                if (this.gameState == GAME_STATES.PLAYING && this.turn == TURN.PLAYER2) {
                    // stop the event user activates
                    event.preventDefault();

                    if (event.keyCode === KEY.A) {
                        this.board.movePiece(-1, 0);
                    } 
                    if (event.keyCode === KEY.D) {
                        this.board.movePiece(1, 0);
                    }
                    if (event.keyCode === KEY.S) {
                        this.board.movePiece(0, 1);
                        this.commands.addScore(POINTS.SOFT_DROP);
                    }
                    if (event.keyCode === KEY.W) {
                        this.board.rotate();
                    }
                    if (event.keyCode === KEY.SPACE) {
                        while (this.board.movePiece(0, 1)) {
                            this.commands.addScore(POINTS.HARD_DROP);
                        }
                    }
                }
            }
        };

        this.board = new Board(this.ctx, this.ctxNext, this.account.updateByClearedLines.bind(this.account), this.account.clearCtxNext.bind(this.account));
        this.keyInputHandler = new KeyInputHandler(this.commands.player1Commands.bind(this));
        this.keyInputHandler.registerEventListener();
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
        this.board.reset();
        this.time.init();
        this.turn = TURN.PLAYER1;
    }

    update(now) {
        switch(this.gameState) {
            case GAME_STATES.READY:
                break;
            case GAME_STATES.PLAYING:
                this.time.update(now);
                if (!this.time.isElapsedEnough(now)) return;
                const dropped = this.board.drop(this.switchTurn.bind(this));
                if (!dropped) {
                    this.gameOver();
                    return;
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
        switch(this.gameState) {
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

    switchTurn() {
        if (this.turn == TURN.PLAYER1) {
            this.keyInputHandler.switchEventListener(this.commands.player2Commands.bind(this));
        } else {
            this.keyInputHandler.switchEventListener(this.commands.player1Commands.bind(this));
        }
        this.turn = (this.turn + 1) % 2;
    }
    
    gameOver() {
        this.gameState = GAME_STATES.GAMEOVER;
    }

    drawGameOver(ctx) {
        ctx.fillStyle = 'black';
        ctx.fillRect(1, 3, 8, 1.2);
        ctx.font = '1px Arial';
        ctx.fillStyle = 'red';
        ctx.fillText('GAME OVER', 1.8, 4);
    }
    
    pause() {
        if (this.gameState == GAME_STATES.PLAYING)
            this.gameState = GAME_STATES.PAUSE;
        else if (this.gameState == GAME_STATES.PAUSE)
            this.gameState = GAME_STATES.PLAYING;
        console.log(this.gameState);
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