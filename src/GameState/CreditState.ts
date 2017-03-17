class CreditState extends Phaser.State{
    constructor(){
        super();
    }

    create():void{
        super.create();

        let xButton:XButtonEntity = new XButtonEntity(this.game, 0.75 * Global.TILE_SIZE, 0.75 * Global.TILE_SIZE, ()=>{
                if(Global.sfxEnabled){this.game.add.sound("Undo").play();}
                this.game.state.start("GameMenu", true, false);
            });
        this.add.existing(xButton);

        this.add.existing(new OptionsStatsEntity(this.game, this.game.width/2, this.game.height/2));

        let overlayer:OverlayEntity = new OverlayEntity(this.game, this.game.width/2, 
            this.game.width/2, this.game.rnd.integerInRange(0, 1));
        this.add.existing(overlayer);
    }

    update():void{
        super.update();

        Global.playMusic(this.game);
    }
}