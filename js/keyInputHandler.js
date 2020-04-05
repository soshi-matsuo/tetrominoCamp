class KeyInputHandler {

    currentListener;

    constructor(firstEventListener) {
        this.currentListener = firstEventListener;
    }
    
    // register eventListner
    registerEventListener() {
        document.addEventListener('keydown', this.currentListener);
    }

    // switch the way of processing of eventListener
    switchEventListener(nextListener) {
        document.removeEventListener('keydown', this.currentListener);
        this.currentListener = nextListener;
        document.addEventListener('keydown', this.currentListener);
    }

}