class LoadingState extends Phaser.State{
    notDone:Boolean;
    difficulty:string[];
    
    constructor(){
        super();
        this.notDone = true;
        this.difficulty = ["easy", "medium", "hard"];
    }
    
    preload(){
        let minDimension:number = Math.min(this.game.width, this.game.height);
        
        Global.TILE_SIZE = Math.floor(minDimension / (Global.MAX_WIDTH[2] + 2));
        Global.SMALL_TILE = Math.floor(0.25 * Global.TILE_SIZE);
        Global.SMALL_GAP_SIZE = Math.max(Math.floor(Global.TILE_SIZE / 48), 1);
        Global.GAP_SIZE = 2 * Global.SMALL_GAP_SIZE;

        Global.SMALL_FONT = Math.round(Math.max(Math.floor(Global.TILE_SIZE / 4), 20) / 10) * 10;
        Global.MEDIUM_FONT = 2 * Global.SMALL_FONT;
        Global.BIG_FONT = Global.MEDIUM_FONT + 10;

        GameTextures.generateLogo(new Phaser.Graphics(this.game, 0, 0));
        if(Global.browserTesting){
            this.game.add.existing(new LoadingEntity(this.game, this.game.width/2, this.game.height/2));
        }
        
        GameTextures.generateTextures(new Phaser.Graphics(this.game, 0, 0));
        
        let index:number = this.game.rnd.integerInRange(0, 3);

        this.game.load.audio("Pickup", ["assets/SFX_PickUp.mp3"]);
        this.game.load.audio("Place", ["assets/SFX_Place.mp3"]);
        this.game.load.audio("Undo", ["assets/SFX_Undo.mp3"]);

        this.game.load.audio("Music" + ((index) % 4 + 1), ["assets/CSquare Mobile - Track " + ((index) % 4 + 1) + ".mp3"]);
        this.game.load.audio("Music" + ((index + 1) % 4 + 1), ["assets/CSquare Mobile - Track " + ((index + 1) % 4 + 1) + ".mp3"]);
        this.game.load.audio("Music" + ((index + 2) % 4 + 1), ["assets/CSquare Mobile - Track " + ((index + 2) % 4 + 1) + ".mp3"]);
        this.game.load.audio("Music" + ((index + 3) % 4 + 1), ["assets/CSquare Mobile - Track " + ((index + 3) % 4 + 1) + ".mp3"]);

        this.game.load.bitmapFont('visitor', 'assets/fonts/visitor.png', 'assets/fonts/visitor.fnt');

        for(let i:number=0; i<this.difficulty.length; i++){
            for(let j:number=1; j<=3; j++){
                this.game.load.text(this.difficulty[i] + j, "assets/" + this.difficulty[i] + j + ".txt");
            }
        }

        this.notDone = false;

        Global.soundIndex = index;
        Global.soundManager = this.game.sound;
        Global.loadCookie(this.game);
    }
    
    checkSfxDecoded():boolean{
        let allSound:boolean = true;

        if(!this.cache.isSoundDecoded("Pickup")){
            allSound = false;
        }
        if(!this.cache.isSoundDecoded("Place")){
            allSound = false;
        }
        if(!this.cache.isSoundDecoded("Undo")){
            allSound = false;
        }
        if(!this.cache.isSoundDecoded("Music" + ((Global.soundIndex) % 4 + 1))){
            allSound = false;
        }

        return allSound;
    }

    update(){
        super.update();

        if(this.checkSfxDecoded() && !this.notDone){
            if(!Global.browserTesting){
                navigator.splashscreen.hide();
            }

            this.game.cache.getBitmapFont("visitor").base.scaleMode = PIXI.scaleModes.NEAREST;
            this.game.state.start("GameMenu", true, false);
        }
    }
}