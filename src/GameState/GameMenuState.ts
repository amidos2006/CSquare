class GameMenuState extends Phaser.State{
    constructor(){
        super();
    }
    
    create(){
        this.game.camera.setPosition(0, 0);
        this.add.existing(new GameNameEntity(this.game, this.game.width/2, this.game.height / 2 - 50));
        
        let overlayer:OverlayEntity = new OverlayEntity(this.game, this.game.width/2, 
            this.game.width/2, this.game.rnd.integerInRange(0, 1));
        this.add.existing(overlayer);
    }
    
    update(){
        super.update();
        
        Global.playMusic(this.game);
    }
}