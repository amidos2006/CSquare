class SureEntity extends Phaser.Group{

    constructor(game:Phaser.Game, x:number, y:number){
        super(game);

        this.x = x;
        this.y = y;

        let question:Phaser.BitmapText = this.game.add.bitmapText(0, 0, "visitor", "Are you sure\nyou want to reset\nC-Square?\n\nyou will lose\nall your progress", 
            Global.SMALL_FONT, this);
        question.anchor.set(0.5, 1);
        question.align = "center";
        question.tint = Global.GREY;
        question.smoothed = false;

        let xButton:XButtonEntity = new XButtonEntity(this.game, 1.5 * Global.TILE_SIZE, Global.TILE_SIZE, ()=>{
                if(Global.sfxEnabled){this.game.add.sound("Undo").play();}
                this.game.state.start("Credits", true, false);
            });
        this.add(xButton);

        let oButton:OButtonEntity = new OButtonEntity(this.game, -1.5 * Global.TILE_SIZE, Global.TILE_SIZE, ()=>{
                if(Global.sfxEnabled){this.game.add.sound("Undo").play();}
                Global.deleteCookie(this.game);
                this.game.state.start("Credits", true, false);
            });
        this.add(oButton);
    }
}