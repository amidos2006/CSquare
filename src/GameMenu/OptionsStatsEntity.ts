class OptionsStatsEntity extends Phaser.Group{
    DIFF:string[] = ["Easy", "Medium", "Hard"];
    ENABLE:string[] = ["On", "Off"];

    completedText:Phaser.BitmapText;
    skippedText:Phaser.BitmapText;
    difficulty:Phaser.BitmapText;
    sfxText:Phaser.BitmapText;
    musicText:Phaser.BitmapText;

    constructor(game:Phaser.Game, x:number, y:number){
        super(game);

        this.x = x;
        this.y = y;

        let style = { font: Global.SMALL_FONT + "px pixelFont", fill: "#cccccc", align: "center" };
        let text:Phaser.BitmapText = this.game.add.bitmapText(0, 2 * Global.TILE_SIZE - Global.TILE_SIZE, "visitor", "Difficulty", 
            Global.SMALL_FONT, this);
        text.anchor.set(0.5, 1);
        text.tint = Global.GREY;
        text.smoothed = false;
        
        style = { font: Global.MEDIUM_FONT + "px pixelFont", fill: "#cccccc", align: "center" };
        this.difficulty = this.game.add.bitmapText(text.x, text.y + Math.floor(Global.MEDIUM_FONT/2), "visitor",
            this.DIFF[Global.selectedDifficulty], Global.MEDIUM_FONT, this);
        this.difficulty.anchor.set(0.5, 0.5);
        this.difficulty.tint = Global.GREY;
        this.difficulty.smoothed = false;

        let leftButton:ArrowButtonEntity = new ArrowButtonEntity(this.game, -Global.MEDIUM_FONT * 3, this.difficulty.y - 2, -1, 
        ()=>{if(Global.sfxEnabled){this.game.add.sound("Pickup").play();}
            Global.selectedDifficulty -= 1;
            if(Global.selectedDifficulty < 0){
                Global.selectedDifficulty += this.DIFF.length;
            }
            Global.saveCookie(this.game);}, false);
        this.add(leftButton);

        let rightButton:ArrowButtonEntity = new ArrowButtonEntity(this.game,  Global.MEDIUM_FONT * 3, this.difficulty.y - 2, 1, 
        ()=>{if(Global.sfxEnabled){this.game.add.sound("Pickup").play();}
            Global.selectedDifficulty += 1;
            if(Global.selectedDifficulty >= this.DIFF.length){
                Global.selectedDifficulty -= this.DIFF.length;
            }
            Global.saveCookie(this.game);}, false);
        this.add(rightButton);

        style = { font: Global.SMALL_FONT + "px pixelFont", fill: "#cccccc", align: "center" };
        this.completedText = this.game.add.bitmapText(0, this.difficulty.y + 2 * Global.MEDIUM_FONT - 2, "visitor", 
            "Completed Levels - " + Global.currentLevels[Global.selectedDifficulty], Global.SMALL_FONT, this);
        this.completedText.anchor.set(0.5, 1);
        this.completedText.tint = Global.GREY;
        this.completedText.smoothed = false;

        this.skippedText = this.game.add.bitmapText(0, this.completedText.y + Global.MEDIUM_FONT - 2, "visitor",
             "Skipped Levels - " + Global.skippedLevels[Global.selectedDifficulty], Global.SMALL_FONT, this);
        this.skippedText.anchor.set(0.5, 1);
        this.skippedText.tint = Global.GREY;
        this.skippedText.smoothed = false;

        let deleteButton:XButtonEntity = new XButtonEntity(this.game, 0, this.skippedText.y + 
            Global.TILE_SIZE / 2 + Global.MEDIUM_FONT, ()=>{
                if(Global.sfxEnabled){this.game.add.sound("Pickup").play();}
                this.game.state.start("Sure", true, false);
            }, true);
        this.add(deleteButton);

        style = { font: Global.SMALL_FONT + "px pixelFont", fill: "#cccccc", align: "center" };
        text = this.game.add.bitmapText(0, -2 * Global.TILE_SIZE - Global.TILE_SIZE, "visitor", "Music", 
            Global.SMALL_FONT, this);
        text.anchor.set(0.5, 1);
        text.tint = Global.GREY;
        text.smoothed = false;
        
        style = { font: Global.MEDIUM_FONT + "px pixelFont", fill: "#cccccc", align: "center" };
        this.musicText = this.game.add.bitmapText(text.x, text.y + Math.floor(Global.MEDIUM_FONT/2), "visitor",
            this.ENABLE[Global.musicEnabled?0:1], Global.MEDIUM_FONT, this);
        this.musicText.anchor.set(0.5, 0.5);
        this.musicText.tint = Global.GREY;
        this.musicText.smoothed = false;

        leftButton = new ArrowButtonEntity(this.game, -Global.MEDIUM_FONT * 3, this.musicText.y - 2, -1, 
        ()=>{if(Global.sfxEnabled){this.game.add.sound("Pickup").play();}
            Global.musicEnabled = !Global.musicEnabled;
            if(!Global.musicEnabled){
                Global.soundPlayed.stop();
            }
            Global.saveCookie(this.game);}, false);
        this.add(leftButton);

        rightButton = new ArrowButtonEntity(this.game,  Global.MEDIUM_FONT * 3, this.musicText.y - 2, 1, 
        ()=>{if(Global.sfxEnabled){this.game.add.sound("Pickup").play();}
            Global.musicEnabled = !Global.musicEnabled;
            if(!Global.musicEnabled){
                Global.soundPlayed.stop();
            }
            Global.saveCookie(this.game);}, false);
        this.add(rightButton);

        style = { font: Global.SMALL_FONT + "px pixelFont", fill: "#cccccc", align: "center" };
        text = this.game.add.bitmapText(0, -Global.TILE_SIZE, "visitor", "Sound Effects", 
            Global.SMALL_FONT, this);
        text.anchor.set(0.5, 1);
        text.tint = Global.GREY;
        text.smoothed = false;
        
        style = { font: Global.MEDIUM_FONT + "px pixelFont", fill: "#cccccc", align: "center" };
        this.sfxText = this.game.add.bitmapText(text.x, text.y + Math.floor(Global.MEDIUM_FONT/2), "visitor",
            this.ENABLE[Global.sfxEnabled?0:1], Global.MEDIUM_FONT, this);
        this.sfxText.anchor.set(0.5, 0.5);
        this.sfxText.tint = Global.GREY;
        this.sfxText.smoothed = false;

        leftButton = new ArrowButtonEntity(this.game, -Global.MEDIUM_FONT * 3, this.sfxText.y - 2, -1, 
        ()=>{if(Global.sfxEnabled){this.game.add.sound("Pickup").play();}
            Global.sfxEnabled = !Global.sfxEnabled;
            Global.saveCookie(this.game);}, false);
        this.add(leftButton);

        rightButton = new ArrowButtonEntity(this.game,  Global.MEDIUM_FONT * 3, this.sfxText.y - 2, 1, 
        ()=>{if(Global.sfxEnabled){this.game.add.sound("Pickup").play();}
            Global.sfxEnabled = !Global.sfxEnabled;
            Global.saveCookie(this.game);}, false);
        this.add(rightButton);

        
    }

    update(){
        super.update();

        this.difficulty.text = this.DIFF[Global.selectedDifficulty];
        this.musicText.text = this.ENABLE[Global.musicEnabled?0:1];
        this.sfxText.text = this.ENABLE[Global.sfxEnabled?0:1];
        this.completedText.text = "Completed Levels - " + Global.currentLevels[Global.selectedDifficulty].toString();
        this.skippedText.text = "Skipped Levels - " + Global.skippedLevels[Global.selectedDifficulty].toString();
    }
}