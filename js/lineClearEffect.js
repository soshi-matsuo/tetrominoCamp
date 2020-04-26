class Ball extends Drawable {
    x;
    y;
    velX;
    velY;
    accX;
    accY;
    mass;
    color;
    diameter;
    alive;
    diameter_min;
    constructor(x, y, color, diameter, ctx) {
        super(ctx, IN_PRODUCTION);
        this.x = x;
        this.y = y;
        this.velX = 0;
        this.velY = 0;
        this.accX = 0;
        this.accY = 0;
        this.mass = 1;
        this.color = color;
        this.diameter = diameter;
        this.alive = true;
        this.diameter_min = diameter * 0.1;
    }

    applyForce(forceX, forceY) {
        this.accX += forceX / this.mass;
        this.accY += forceY / this.mass;
    }

    update() {
        this.diameter -= 0.5;
        this.alive = this.isAlive();

        this.applyForce(0, 0.4);
        this.velX += this.accX;
        this.velY += this.accY; // -0.5, -1, -1.5..
        this.x += this.velX;
        this.y += this.velY;
        this.accX = 0;
        this.accY = 0;
    }

    isAlive () {
        return this.diameter >= this.diameter_min;
    }

    draw() {
        this.drawFillArc(this.x, this.y, this.diameter * 0.5, this.color);
    }
}

class LineClearEffect {
    balls;
    ball_num;
    ctx;
    colors;
    constructor(colors, num, ctx) {
        this.balls = [];
        this.ball_num = num;
        this.ctx = ctx;
        this.colors = colors;
    }

    fire(x, y, diameter, xRange, yRange) {
        for(let i = 0; i < this.ball_num; i++) {
            const x_ = x + Math.random() * xRange
            const y_ = y + Math.random() * yRange;
            const diameter_ = diameter + (Math.random() * 10 - 5);
            const color = this.colors[randInt(0, this.colors.length - 1)];
            this.balls[i] = new Ball(x_, y_, color, diameter_, this.ctx);
            this.balls[i].applyForce(Math.random() * 5 - 2.5, -8);
        }
    }

    update() {
        this.balls.forEach(ball => {
            ball.update();
        });
        this.balls = this.balls.filter(ball => ball.alive);
    }

    draw() {
        this.balls.forEach(ball => {
            ball.draw();
        });
    }
}