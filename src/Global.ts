class Global{
    static TILE_SIZE:number = 48;
    static SMALL_TILE:number = 12;
    static GAP_SIZE:number = 2;
    static SMALL_GAP_SIZE:number = 1;

    static BIG_FONT:number = 48;
    static MEDIUM_FONT:number = 24;
    static SMALL_FONT:number = 12;

    static COLORS:Array<number> = [0xff6666, 0x6666ff];
    static GREY:number = 0xcccccc;

    static MAX_WIDTH:number[] = [5, 7, 8];
    static MAX_HEIGHT:number[] = [5, 7, 8];
    static MIN_WIDTH:number[] = [4, 5, 5];
    static MIN_HEIGHT:number[] = [4, 5, 5];

    static MIN_PEICES:number[] = [3, 3, 3];
    static MAX_PEICES:number[] = [5, 7, 10];

    static MIN_DIFFERENT:number[] = [2, 3, 3];
    static MAX_DIFFERENT:number[] = [3, 4, 5];
    
    static firstTime:number[] = [3, 3, 3];
    static currentLevels:number[] = [0, 0, 0];
    static skippedLevels:number[] = [0, 0, 0];
    static gameOpening:boolean = true;
    
    static selectedDifficulty:number = 0;
    static levelSize:number = 0;
    static randomSeed:number[] = [0, 0, 0];

    static currentColor:number = 1;
    static whiteEnable:boolean = false;
    static rotateEnable:boolean = false;
    static changeColor:boolean = false;

    static musicEnabled:boolean = true;
    static sfxEnabled:boolean = true;

    static soundIndex:number = -1;
    static soundPlayed:Phaser.Sound = null;

    static soundManager:Phaser.SoundManager = null;
    static pause:boolean = false;
    static browserTesting:boolean = false;
    
    static getWhiteDifficulty(){
        var difficulty = Math.min((Global.currentLevels[Global.selectedDifficulty] + 1) / 100, 0.5);
        return difficulty;
    }
    
    static getSizeDifficulty(){
        var difficulty = Math.min(Math.max(0, 
            Math.floor((Global.currentLevels[Global.selectedDifficulty] - 
            Global.skippedLevels[Global.selectedDifficulty])/2)) / 20, 0.75);
        return difficulty;
    }
    
    static getFlippingDifficulty(){
        var difficulty = Math.min(Math.max(0, 
            Math.floor((Global.currentLevels[Global.selectedDifficulty] - 
            Global.skippedLevels[Global.selectedDifficulty])/2)) / 30, 0.75);
        return difficulty;
    }
    
    static getDifferentDifficulty(){
        var difficulty = Math.min(Math.max(0, 
            Math.floor((Global.currentLevels[Global.selectedDifficulty] - 
            Global.skippedLevels[Global.selectedDifficulty])/2)) / 40, 0.75);
        return difficulty;
    }

    static interpretDifficulty(){
        switch(Global.selectedDifficulty){
            case 0:
                Global.whiteEnable = false;
                Global.rotateEnable = false;
            break;
            case 1:
                Global.whiteEnable = true;
                Global.rotateEnable = false;
            break;
            case 2:
                Global.whiteEnable = true;
                Global.rotateEnable = true;
            break;
        }
    }

    static playMusic(game:Phaser.Game){
        if(!Global.musicEnabled){
            return;
        }
        if(Global.soundPlayed == null || (!Global.soundPlayed.isPlaying && !Global.pause)){
            if(!Global.gameOpening){
                Global.soundIndex = (Global.soundIndex + game.rnd.integerInRange(1, 3)) % 4;
            }
            else{
                Global.gameOpening = false;
            }
            Global.soundPlayed = game.add.sound("Music" + (Global.soundIndex + 1), 0.75, false);
            Global.soundPlayed.play();
            Global.soundPlayed.isPlaying = true;
            Global.soundPlayed.volume = 0.75;
        }
    }
    
    static deleteCookie(game:Phaser.Game){
        window.localStorage.setItem("levelSize", "0");
        window.localStorage.setItem("rotateEnable", "false");
        window.localStorage.setItem("whiteEnable", "false");
        window.localStorage.setItem("changeColor", "false");
        window.localStorage.setItem("selectedDifficulty", "0");
        window.localStorage.setItem("musicEnabled", "true");
        window.localStorage.setItem("sfxEnabled", "true");
        for(let i:number=0; i<this.randomSeed.length; i++){
            window.localStorage.setItem("randomSeed_" + i, "" + game.rnd.integer());
        }
        for(let i:number=0; i<this.firstTime.length; i++){
            window.localStorage.setItem("firstTime_" + i, "3");
        }
        for(let i:number=0; i<this.currentLevels.length; i++){
            window.localStorage.setItem("currentLevels_" + i, "0");
        }
        for(let i:number=0; i<this.skippedLevels.length; i++){
            window.localStorage.setItem("skippedLevels_" + i, "0");
        }
        Global.loadCookie(game);
    }

    static saveCookie(game:Phaser.Game){
        window.localStorage.setItem("runBefore", "true");
        window.localStorage.setItem("levelSize", "" + Global.levelSize);
        window.localStorage.setItem("rotateEnable", "" + Global.rotateEnable);
        window.localStorage.setItem("whiteEnable", "" + Global.whiteEnable);
        window.localStorage.setItem("changeColor", "" + Global.changeColor);
        window.localStorage.setItem("selectedDifficulty", "" + Global.selectedDifficulty);
        window.localStorage.setItem("musicEnabled", "" + Global.musicEnabled);
        window.localStorage.setItem("sfxEnabled", "" + Global.sfxEnabled);
        for(let i:number=0; i<this.randomSeed.length; i++){
            window.localStorage.setItem("randomSeed_" + i, "" + Global.randomSeed[i]);
        }
        for(let i:number=0; i<this.firstTime.length; i++){
            window.localStorage.setItem("firstTime_" + i, "" + Global.firstTime[i]);
        }
        for(let i:number=0; i<this.currentLevels.length; i++){
            window.localStorage.setItem("currentLevels_" + i, "" + Global.currentLevels[i]);
        }
        for(let i:number=0; i<this.skippedLevels.length; i++){
            window.localStorage.setItem("skippedLevels_" + i, "" + Global.skippedLevels[i]);
        }
    }
    
    static loadCookie(game:Phaser.Game){
        if(window.localStorage.getItem("runBefore") != "true"){
            return;
        }
        Global.levelSize = Number(window.localStorage.getItem("levelSize"));
        Global.rotateEnable = window.localStorage.getItem("rotateEnable") == "true";
        Global.whiteEnable = window.localStorage.getItem("whiteEnable") == "true";
        Global.changeColor = window.localStorage.getItem("changeColor") == "true";
        Global.selectedDifficulty = Number(window.localStorage.getItem("selectedDifficulty"));
        Global.musicEnabled = window.localStorage.getItem("musicEnabled") == "true";
        Global.sfxEnabled = window.localStorage.getItem("sfxEnabled") == "true";
        for(let i:number=0; i<this.randomSeed.length; i++){
            Global.randomSeed[i] = Number(window.localStorage.getItem("randomSeed_" + i));
        }
        for(let i:number=0; i<this.firstTime.length; i++){
            Global.firstTime[i] = Number(window.localStorage.getItem("firstTime_" + i));
        }
        for(let i:number=0; i<this.currentLevels.length; i++){
            Global.currentLevels[i] = Number(window.localStorage.getItem("currentLevels_" + i));
        }
        for(let i:number=0; i<this.skippedLevels.length; i++){
            Global.skippedLevels[i] = Number(window.localStorage.getItem("skippedLevels_" + i));
        }
    }
}