const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const canvasNext = document.getElementById('next');
const ctxNext = canvasNext.getContext('2d');

let requestId;

const accountValues = {
    score: 0,
    level: 0,
    lines: 0
};

const updateAccount = (key, value) => {
    let element = document.getElementById(key);
    if (element) {
        element.textContent = value;
    }
};

// this Proxy combines setting account's property with updating DOM
const account = new Proxy(accountValues, {
    set: (target, key, value) => {
        target[key] = value;
        updateAccount(key, value);
        return true;
    }
});

// map key events to function to get the new state of the original piece
// ex. const newP = this.moves[event.key](this.piece);
const moves = {
    [KEY.LEFT]:  p => ({ ...p, x: p.x - 1 }),
    [KEY.RIGHT]: p => ({ ...p, x: p.x + 1 }),
    [KEY.DOWN]:  p => ({ ...p, y: p.y + 1 }),
    [KEY.SPACE]: p => ({ ...p, y: p.y + 1 }),
    [KEY.UP]:    p => board.rotate(p)
};

const initNext = () => {
    ctxNext.canvas.width = 4 * BLOCK_SIZE;
    ctxNext.canvas.height = 4 * BLOCK_SIZE;
    ctxNext.scale(BLOCK_SIZE, BLOCK_SIZE);
};

const addEventListener = () => {
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
                    account.score += POINTS.HARD_DROP;
                    board.piece.move(p);
                    p = moves[KEY.DOWN](board.piece);
                }
            } else if (board.valid(p)){
                board.piece.move(p);
                if (event.keyCode === KEY.DOWN) {
                    account.score += POINTS.SOFT_DROP;
                }
            }
        }
    });
};

const resetGame = () => {
    account.score = 0;
    account.level = 0;
    account.lines = 0;
    board.reset();
    time = { start: 0, elapsed: 0, level: LEVEL[account.level] };
};

const play = () => {
    resetGame();
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

let board = new Board(ctx, ctxNext);
addEventListener();
initNext();