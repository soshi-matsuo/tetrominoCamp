const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const canvasNext = document.getElementById('next');
const ctxNext = canvasNext.getContext('2d');

let requestId;

const account = new Account(ctxNext);

// map key events to function to get the new state of the original piece
// ex. const newP = this.moves[event.key](this.piece);
const moves = {
    [KEY.LEFT]:  p => ({ ...p, x: p.x - 1 }),
    [KEY.RIGHT]: p => ({ ...p, x: p.x + 1 }),
    [KEY.DOWN]:  p => ({ ...p, y: p.y + 1 }),
    [KEY.SPACE]: p => ({ ...p, y: p.y + 1 }),
    [KEY.UP]:    p => board.rotate(p)
};

const keyDownEventListener = (addScore) => {
    // 'keydown' event is fired for all keys unlike 'keypress'
    document.addEventListener('keydown', event => {
        if (event.keyCode === KEY.P) {
            pause();
        }
        if (event.keyCode === KEY.ESC) {
            gameOver();
        } else if (moves[event.keyCode]) {
            // stop the event user activates
            event.preventDefault();
            // get new state of current piece
            let p = moves[event.keyCode](board.piece);
    
            if (event.keyCode === KEY.SPACE) {
                // hard drop
                while (board.valid(p)) {
                    addScore(POINTS.HARD_DROP);
                    board.piece.move(p);
                    p = moves[KEY.DOWN](board.piece);
                }
            } else if (board.valid(p)){
                board.piece.move(p);
                if (event.keyCode === KEY.DOWN) {
                    addScore(POINTS.SOFT_DROP);
                }
            }
        }
    });
};

const resetGame = (resetAccount) => {
    resetAccount();
    board.reset();
    time = { start: 0, elapsed: 0, level: LEVEL[account.level] };
}

const play = () => {
    resetGame(account.resetAccount.bind(account));
    time.start = performance.now();
    // if old game is running, cancel it
    if (requestId) cancelAnimationFrame(requestId);

    animate();
};

const animate = (now = 0) => {
    // update elapsed time
    time.elapsed = now - time.start;

    // if elapsed time has passed time for current level
    if (time.elapsed > time.level) {
        // restart counting from now
        time.start = now;
        if (!board.drop()) {
            gameOver();
            return;
        }
    }

    // draw new state
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    board.draw();

    requestId = requestAnimationFrame(animate);
};

const gameOver = () => {
    cancelAnimationFrame(requestId);

    ctx.fillStyle = 'black';
    ctx.fillRect(1, 3, 8, 1.2);
    ctx.font = '1px Arial';
    ctx.fillStyle = 'red';
    ctx.fillText('GAME OVER', 1.8, 4);
};

const pause = () => {
    // pause state is toggled by P key?
    if (!requestId) {
        animate();
        return;
    }

    cancelAnimationFrame(requestId);
    requestId = null;

    ctx.fillStyle = 'black';
    ctx.fillRect(1, 3, 8, 1.2);
    ctx.font = '1px Arial';
    ctx.fillStyle = 'yellow';
    ctx.fillText('PAUSED', 3, 4);
};

// TODO: extract as onReady()
let board = new Board(ctx, ctxNext, account.updateByClearedLines, account.clearCtxNext);
keyDownEventListener(account.addDropScore.bind(account));