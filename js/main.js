class GameMaster {
    canvas;
    ctx;
    canvasNext;
    ctxNext;
    requestId;
    gameState;

    account;
    time;
    board;

    constructor() {
        this.canvas = document.getElementById('board');
        this.ctx = this.canvas.getContext('2d');
        this.canvasNext = document.getElementById('next');
        this.ctxNext = this.canvasNext.getContext('2d');
        this.requestId = null;
        this.gameState = GAME_STATES.READY;

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
            }
        };
        this.account = new Account(this.ctxNext, this.time.setLevel.bind(this));
        
        this.board = new Board(this.ctx, this.ctxNext, this.account.updateByClearedLines.bind(this.account), this.account.clearCtxNext.bind(this.account));
        this.keyDownEventListener(this.account.addScore.bind(this.account));
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
    }

    loopGame(now = 0) {
        // update elapsed time
        this.time.elapsed = now - this.time.start;
    
        // if elapsed time has passed time for current level
        if (this.time.elapsed > this.time.level) {
            // restart counting from now
            this.time.start = now;
            if (!this.board.drop()) {
                this.gameOver();
                return;
            }
        }
    
        // draw new state
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.board.draw();
    
        this.requestId = requestAnimationFrame(this.loopGame.bind(this));
    }

    keyDownEventListener(addScore) {
        // 'keydown' event is fired for all keys unlike 'keypress'
        document.addEventListener('keydown', event => {
            const pausable = this.gameState == GAME_STATES.PLAYING || 
                            this.gameState == GAME_STATES.PAUSE;
            if (event.keyCode === KEY.P && pausable) {
                this.pause();
            }
            if (event.keyCode === KEY.ESC && this.gameState == GAME_STATES.PLAYING) {
                this.gameOver();
            } 
            if (this.gameState == GAME_STATES.PLAYING) {
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
                    addScore(POINTS.SOFT_DROP);
                }
                if (event.keyCode === KEY.UP) {
                    this.board.rotate();
                }
                if (event.keyCode === KEY.SPACE) {
                    while (this.board.movePiece(0, 1)) {
                        addScore(POINTS.HARD_DROP);
                    }
                }
            }
        });
    }
    
    gameOver() {
        cancelAnimationFrame(this.requestId);
        this.gameState = GAME_STATES.GAMEOVER;
    
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(1, 3, 8, 1.2);
        this.ctx.font = '1px Arial';
        this.ctx.fillStyle = 'red';
        this.ctx.fillText('GAME OVER', 1.8, 4);
    }
    
    pause() {
        this.gameState = GAME_STATES.PAUSE;
        // pause state is toggled by P key?
        if (!this.requestId) {
            this.gameState = GAME_STATES.PLAYING;
            this.loopGame();
            return;
        }
    
        cancelAnimationFrame(this.requestId);
        this.requestId = null;
    
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(1, 3, 8, 1.2);
        this.ctx.font = '1px Arial';
        this.ctx.fillStyle = 'yellow';
        this.ctx.fillText('PAUSED', 3, 4);
    }
}

const gameMaster = new GameMaster();
const play = () => {
    if (gameMaster === undefined) return;
    gameMaster.start();
}