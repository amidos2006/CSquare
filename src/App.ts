class SimpleGame {
    game: Phaser.Game;
    
    constructor() {
        if(Global.browserTesting){
            this.game = new Phaser.Game("100%", "100%", Phaser.AUTO, 'content');
        }
        else{
            this.game = new Phaser.Game(screen.width, screen.height, Phaser.AUTO, 'content');
        }
        
        this.game.state.add("Gameplay", GameplayState, false);
        this.game.state.add("GameMenu", GameMenuState, false);
        this.game.state.add("Loading", LoadingState, false);
        this.game.state.add("Credits", CreditState, false);
        this.game.state.add("Sure", SureState, false);
        Global.loadCookie(this.game);
        this.game.state.start("Loading", false, false);
    }
}

function onDeviceReady():void{
    var game:SimpleGame = new SimpleGame();

    document.addEventListener("pause", onPause, false);
    document.addEventListener("resume", onResume, false);
}

function onPause():void{
    if(Global.soundManager != null){
        Global.soundManager.pauseAll();
        if(!Global.browserTesting){
            navigator.splashscreen.show();
        }
        Global.pause = true;
    }
}

function onResume():void{
    if(Global.soundManager != null){
        Global.soundManager.resumeAll();
        if(!Global.browserTesting){
            navigator.splashscreen.hide();
        }
        Global.pause = false;
    }
}

window.onload = () => {
    if(Global.browserTesting){
        onDeviceReady();
    }

    document.addEventListener("deviceready", onDeviceReady, false);
};