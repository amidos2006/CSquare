class SureState extends Phaser.State{
    constructor(){
        super();
    }

    create():void{
        super.create();
        this.add.existing(new SureEntity(this.game, this.game.width/2, this.game.height/2));

        let overlayer:OverlayEntity = new OverlayEntity(this.game, this.game.width/2, 
            this.game.width/2, this.game.rnd.integerInRange(0, 1));
        this.add.existing(overlayer);
    }

    update():void{
        super.update();

        Global.playMusic(this.game);
    }
}