class GameNameEntity extends Phaser.Group{
    DIFF:string[] = ["Easy", "Medium", "Hard"];
    rotationSpeed:number;
    logo:Phaser.Image;

    difficulty:Phaser.BitmapText;

    playButton:ArrowButtonEntity;
    rightButton:ArrowButtonEntity;
    leftButton:ArrowButtonEntity;
    
    constructor(game:Phaser.Game, x:number, y:number){
        super(game);
        
        this.x = x;
        this.y = y;
        this.rotationSpeed = 2;
        
        this.logo = new Phaser.Image(this.game, 0, 0, GameTextures.logo);
        this.logo.anchor.set(0.5, 0.5);
        this.logo.angle = 135;
        this.add(this.logo);
        
        var style = { font: Global.BIG_FONT + "px pixelFont", fill: "#cccccc", align: "center" };
        var text:Phaser.BitmapText = this.game.add.bitmapText(0, 0, "visitor", "C-Square", Global.BIG_FONT, this);
        text.anchor.set(0.5, 0.5);
        text.tint = Global.GREY;
        text.smoothed = false;
        
        style = { font: Global.SMALL_FONT + "px pixelFont", fill: "#cccccc", align: "center" };
        text = this.game.add.bitmapText(0, 2 * Global.TILE_SIZE, "visitor", "Difficulty", Global.SMALL_FONT, this);
        text.anchor.set(0.5, 1);
        text.tint = Global.GREY;
        text.smoothed = false;
        
        style = { font: Global.MEDIUM_FONT + "px pixelFont", fill: "#cccccc", align: "center" };
        this.difficulty = this.game.add.bitmapText(text.x, text.y + Math.floor(Global.MEDIUM_FONT/2), "visitor",
            this.DIFF[Global.selectedDifficulty], Global.MEDIUM_FONT, this);
        this.difficulty.anchor.set(0.5, 0.5);
        this.difficulty.tint = Global.GREY;
        this.difficulty.smoothed = false;
        
        style = { font: Global.SMALL_FONT + "px pixelFont", fill: "#cccccc", align: "center" };
        var lastPixel:number = this.game.height - this.y - Math.floor(Global.SMALL_FONT / 2);
        text = this.game.add.bitmapText(0, lastPixel - Global.SMALL_FONT, "visitor", "Game by Amidos", Global.SMALL_FONT, this);
        text.anchor.set(0.5, 1);
        text.tint = Global.GREY;
        text.smoothed = false;

        text = this.game.add.bitmapText(0, lastPixel, "visitor", "Music by Abstraction", Global.SMALL_FONT, this);
        text.anchor.set(0.5, 1);
        text.tint = Global.GREY;
        text.smoothed = false;

        let creditsButton:CreditsButtonEntity = new CreditsButtonEntity(this.game, 
        (this.game.width - this.x) - 0.75 * Global.TILE_SIZE, -this.y + 0.75 * Global.TILE_SIZE, 
            ()=>{if(Global.sfxEnabled){this.game.add.sound("Place").play();}
                this.game.state.start("Credits", true, false);});
        this.add(creditsButton);

        // let scoringButton:ScoringButtonEntity = new ScoringButtonEntity(this.game, 
        //     -this.x + Global.TILE_SIZE/2, -this.y + Global.TILE_SIZE / 2, 1, 
        //     ()=>{this.game.add.sound("Place").play();
        //         this.game.state.start("Credits", true, false);});
        // this.add(scoringButton);

        this.playButton = new ArrowButtonEntity(this.game, 0, 4 * Global.TILE_SIZE, 1, 
            ()=>{if(Global.sfxEnabled){this.game.add.sound("Place").play();}
                this.game.state.start("Gameplay", true, false);});
        this.add(this.playButton);

        this.leftButton = new ArrowButtonEntity(this.game, -Global.MEDIUM_FONT * 3, this.difficulty.y - 2, -1, 
        ()=>{if(Global.sfxEnabled){this.game.add.sound("Pickup").play();}
            Global.selectedDifficulty -= 1;
            if(Global.selectedDifficulty < 0){
                Global.selectedDifficulty += this.DIFF.length;
            }
            Global.saveCookie(this.game);}, false);
        this.add(this.leftButton);

        this.rightButton = new ArrowButtonEntity(this.game,  Global.MEDIUM_FONT * 3, this.difficulty.y - 2, 1, 
        ()=>{if(Global.sfxEnabled){this.game.add.sound("Pickup").play();}
            Global.selectedDifficulty += 1;
            if(Global.selectedDifficulty >= this.DIFF.length){
                Global.selectedDifficulty -= this.DIFF.length;
            }
            Global.saveCookie(this.game);}, false);
        this.add(this.rightButton);
    }

    update(){
        super.update();
        
        this.logo.angle -= this.rotationSpeed;
        if(this.logo.angle < 0){
            this.logo.angle += 360;
        }

        this.difficulty.text = this.DIFF[Global.selectedDifficulty];
    }
}