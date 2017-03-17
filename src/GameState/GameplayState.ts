class GameplayState extends Phaser.State{
    colorMap:ColorTileEntity[][];
    hudEntity:HUDEntity;
    difficulty:string[];

    constructor(){
        super();
        this.difficulty = ["easy", "medium", "hard"];
    }

    create(){
        Global.interpretDifficulty();

        if (Global.firstTime[Global.selectedDifficulty] <= 0) {
            this.game.rnd.sow([Global.randomSeed[Global.selectedDifficulty]]);
            this.generateLevel();
        }
        else {
            this.loadTutorial();
        }

        var mapWidth:number = this.colorMap.length;
        var mapHeight:number = this.colorMap[0].length;

        this.game.world.setBounds(-this.game.width, -this.game.height, 
            2 * this.game.width, 2* this.game.height);
        this.game.camera.x = -(this.game.width - mapWidth * Global.TILE_SIZE) / 2 - Global.TILE_SIZE / 2;
        this.game.camera.y = -((this.game.height - 2 * Global.TILE_SIZE) - mapHeight * Global.TILE_SIZE) / 2 - 
            Global.TILE_SIZE / 2;
        
        this.hudEntity = new HUDEntity(this.game);
        this.game.add.existing(this.hudEntity);
        
        let overlayer:OverlayEntity = new OverlayEntity(this.game, this.game.width/2, 
            this.game.width/2, this.game.rnd.integerInRange(0, 1));
        this.add.existing(overlayer);
    }

    loadTutorial():void{
        let tutorialText:string[] = this.game.cache.getText(this.difficulty[Global.selectedDifficulty] + 
            (4 - Global.firstTime[Global.selectedDifficulty])).split("\n");
        let levelText:string[] = [];
        for(let y:number=0; y<tutorialText.length; y++){
            if(tutorialText[y].trim().length == 0){
                break;
            }
            levelText.push(tutorialText[y]);
        }

        this.colorMap = [];
        for(let x:number=0; x<levelText[0].length; x++){
            this.colorMap.push([]);
            for(let y:number=0; y<levelText.length; y++){
                let tile:ColorTileEntity = null;
                if(parseInt(levelText[y].charAt(x)) == 2){
                    tile = new GrayTileEntity(this.game, 
                        x * Global.TILE_SIZE, y * Global.TILE_SIZE);
                }
                else{
                    tile = new ColorTileEntity(this.game, 
                        x * Global.TILE_SIZE, y * Global.TILE_SIZE, Global.currentColor);
                    if(parseInt(levelText[y].charAt(x)) == 1){
                        tile.flipColor();
                    }
                }

                this.colorMap[x].push(tile);
                this.game.add.existing(this.colorMap[x][y]);
            }
        }
    }

    generateLevel():void{
        var lowWidth:number = 0;
        for(let i:number=Global.MIN_WIDTH[Global.selectedDifficulty]; i<Global.MAX_WIDTH[Global.selectedDifficulty]; i++){
            if(this.game.rnd.realInRange(0, 1) < Global.getSizeDifficulty()){
                lowWidth += 1;
            }
        }
        var lowHeight:number = 0;
        for(let i:number=Global.MIN_HEIGHT[Global.selectedDifficulty]; i<Global.MAX_HEIGHT[Global.selectedDifficulty]; i++){
            if(this.game.rnd.realInRange(0, 1) < Global.getSizeDifficulty()){
                lowHeight += 1;
            }
        }

        var mapWidth:number = Global.MIN_WIDTH[Global.selectedDifficulty] + 
            this.game.rnd.integerInRange(0, lowWidth);
        var mapHeight:number = Global.MIN_HEIGHT[Global.selectedDifficulty] + 
            this.game.rnd.integerInRange(0, lowHeight);
        this.colorMap = [];
        Global.currentColor = 1;
        if(Global.changeColor){
            Global.currentColor = this.game.rnd.integerInRange(0, 1);
        }
        if(Global.firstTime[Global.selectedDifficulty] > 0){
            mapWidth = 5;
            mapHeight = 5;
            Global.currentColor = 1;
        }
        let whiteProbability:number = 0.25 * Global.getWhiteDifficulty();
        for(var x:number=0; x<mapWidth; x++){
            this.colorMap.push([]);
            for(var y:number=0; y<mapHeight; y++){
                var tile:ColorTileEntity = null;
                if(Global.whiteEnable && this.game.rnd.realInRange(0, 1) < whiteProbability){
                    tile = new GrayTileEntity(this.game, 
                        x * Global.TILE_SIZE, y * Global.TILE_SIZE);
                    whiteProbability = 0;
                }
                else{
                    tile = new ColorTileEntity(this.game, 
                        x * Global.TILE_SIZE, y * Global.TILE_SIZE, Global.currentColor);
                    whiteProbability += 0.25 * Global.getWhiteDifficulty();
                }
                this.colorMap[x].push(tile);
                this.game.add.existing(this.colorMap[x][y]);
            }
        }
    }
    
    update(){
        super.update();

        Global.playMusic(this.game);
        
        for(var x:number = 0; x<this.colorMap.length; x++){
            for(var y:number = 0; y<this.colorMap[x].length; y++){
                this.colorMap[x][y].highligh(false);
            }
        }
    }
    
    checkWin(){
        var firstColor:number = -1;
        for(var x:number = 0; x<this.colorMap.length; x++){
            for(var y:number = 0; y<this.colorMap[x].length; y++){
                if(this.colorMap[x][y].color == -1){
                    continue;
                }
                if(firstColor == -1){
                    firstColor = this.colorMap[x][y].color;
                }
                else if(firstColor != this.colorMap[x][y].color){
                    return false;
                }
            }
        }
        return true;
    }
}