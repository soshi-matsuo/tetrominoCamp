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

            if (event.keyCode === KEY.I) {
                this.commands.i?.();
            }
            if (event.keyCode === KEY.W) {
                this.commands.w?.();
            }

            if (event.keyCode === KEY.K) {
                this.commands.k?.();
            }
            if (event.keyCode === KEY.S) {
                this.commands.s?.();
            }

            if (event.keyCode === KEY.J) {
                this.commands.j?.();
            }
            if (event.keyCode === KEY.A) {
                this.commands.a?.();
            }

            if (event.keyCode === KEY.L) {
                this.commands.l?.();
            }
            if (event.keyCode === KEY.D) {
                this.commands.d?.();
            }

            if (event.keyCode === KEY.O) {
                this.commands.o?.();
            }
            if (event.keyCode === KEY.Q) {
                this.commands.q?.();
            }
        };
        document.addEventListener('keydown', this.listner);
    }

    // switch the way of processing of eventListener
    setCommands(commands) {
        this.commands = commands;
    }
}