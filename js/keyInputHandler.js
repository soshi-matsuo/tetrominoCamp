class KeyInputHandler {
    listner;
    commands;

    constructor(commands) {
        this.commands = commands;
        this.listner = (event) => {
            event.preventDefault();
            if (event.keyCode === KEY.P) {
                this.commands.p?.();
            }

            if (event.keyCode === KEY.ESC) {
                this.commands.esc?.();
            }

            if (event.keyCode === KEY.UP) {
                this.commands.up?.();
            }
            if (event.keyCode === KEY.W) {
                this.commands.w?.();
            }

            if (event.keyCode === KEY.DOWN) {
                this.commands.down?.();
            }
            if (event.keyCode === KEY.S) {
                this.commands.s?.();
            }

            if (event.keyCode === KEY.LEFT) {
                this.commands.left?.();
            }
            if (event.keyCode === KEY.A) {
                this.commands.a?.();
            }

            if (event.keyCode === KEY.RIGHT) {
                this.commands.right?.();
            }
            if (event.keyCode === KEY.D) {
                this.commands.d?.();
            }

            if (event.keyCode === KEY.SPACE) {
                this.commands.space?.();
            }
        };
        document.addEventListener('keydown', this.listner);
    }

    // switch the way of processing of eventListener
    setCommands(commands) {
        this.commands = commands;
    }
}