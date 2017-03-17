class UndoData {
    x: number;
    y: number;
    angle: number;
    index: number;

    constructor(x: number, y: number, angle: number, index: number) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.index = index;
    }
}

class HUDEntity extends Phaser.Group {
    selected: number = -1;
    flippingTile: FlippingEntity[];
    selectedHighLight: Phaser.Image;
    undoArray: UndoData[];
    undoButton: ArrowButtonEntity;
    rotateButton: RotateButtonEntity;
    outsideHighlights: Phaser.Image[];
    difficulty:string[];
    tutorialTimer:Phaser.Timer;

    constructor(game: Phaser.Game) {
        super(game);
        this.difficulty = ["easy", "medium", "hard"];

        let style = { font: Global.SMALL_FONT + "px pixelFont", fill: "#cccccc", align: "center" };
        let text: Phaser.BitmapText = this.game.add.bitmapText(this.game.width / 2,
            (Math.floor(this.game.height/Global.TILE_SIZE) - 1.25) * Global.TILE_SIZE - Global.SMALL_FONT, 
            "visitor", "TILES", Global.SMALL_FONT, this);
        text.anchor.set(0.5, 1);
        text.tint = Global.GREY;
        text.smoothed = false;

        style = { font: Global.SMALL_FONT + "px pixelFont", fill: "#cccccc", align: "center" };

        this.flippingTile = [];
        if (Global.firstTime[Global.selectedDifficulty] <= 0) {
            this.generatePuzzle();
        }
        else {
            this.loadTutorial();
        }
        for (let i: number = 0; i < this.flippingTile.length; i++) {
            this.game.add.existing(this.flippingTile[i]);
            this.flippingTile[i].baseX = this.game.width / 2 +
                (i - (this.flippingTile.length - 1) / 2) * 1.5 * Global.TILE_SIZE;
            this.flippingTile[i].baseY = text.y + Global.TILE_SIZE/2;
        }

        this.selectedHighLight = new Phaser.Image(this.game, 0, 0, GameTextures.highlight);
        this.selectedHighLight.anchor.set(0.5, 0.5);
        this.add(this.selectedHighLight);
        this.selectedHighLight.tint = Global.GREY;
        this.selectedHighLight.alpha = 0;

        this.undoArray = [];

        let xButton:XButtonEntity = new XButtonEntity(this.game, 0.75 * Global.TILE_SIZE, 0.75 * Global.TILE_SIZE, () => {
            if(this.selected < 0){
                if(Global.sfxEnabled){this.game.add.sound("Undo").play();}
                this.game.state.start("GameMenu", true, false);
            }
        });
        this.add(xButton);

        if(Global.firstTime[Global.selectedDifficulty] <= 0){
            let skipPuzzle: ArrowButtonEntity = new ArrowButtonEntity(this.game,
                this.game.width - 0.75 * Global.TILE_SIZE, 0.75 * Global.TILE_SIZE, 1, () => {
                    if(this.selected < 0){
                        if(Global.sfxEnabled){this.game.add.sound("Undo").play();}
                        Global.skippedLevels[Global.selectedDifficulty] += 1;
                        Global.randomSeed[Global.selectedDifficulty] = this.game.rnd.integer();
                        this.game.state.restart(true, false);
                        Global.saveCookie(this.game);
                    }
                }, false);
            this.add(skipPuzzle);
        }

        this.undoButton = new ArrowButtonEntity(this.game,
            0.75 * Global.TILE_SIZE, this.game.height - 0.75 * Global.TILE_SIZE, -1, () => {
                if(this.selected < 0){
                    this.undo();
                }
            }, false);
        this.add(this.undoButton);

        this.rotateButton = new RotateButtonEntity(this.game,
            this.game.width - 0.75 * Global.TILE_SIZE, this.game.height - 0.75 * Global.TILE_SIZE, () => {
                if (Global.rotateEnable && this.selected < 0) {
                    if(Global.sfxEnabled){this.game.add.sound("Pickup").play();}
                    for (let i: number = 0; i < this.flippingTile.length; i++) {
                        this.flippingTile[i].rotate(true);
                    }
                    this.game.input.keyboard.reset();
                }
            });
        this.add(this.rotateButton);

        this.outsideHighlights = [];
        for(let i:number=0; i<9; i++){
            let temp:Phaser.Image = new Phaser.Image(this.game, 0, 0, GameTextures.highlight);
            temp.anchor.set(0.5, 0.5);
            temp.alpha = 0;
            this.game.add.existing(temp);
            this.outsideHighlights.push(temp);
        }

        if(Global.firstTime[Global.selectedDifficulty] == 3 && Global.selectedDifficulty == 0){
            this.tutorialTimer = this.game.time.create();
            this.tutorialTimer.loop(500, ()=>{
                if(this.selected < 0){
                    this.selectedHighLight.x = this.flippingTile[0].baseX;
                    this.selectedHighLight.y = this.flippingTile[0].baseY;
                    this.selectedHighLight.alpha = 1 - this.selectedHighLight.alpha;
                }
            }, this);
            this.tutorialTimer.start();
        }

        this.fixedToCamera = true;
    }

    loadTutorial(): void {
        let tutorialText:string[] = this.game.cache.getText(this.difficulty[Global.selectedDifficulty] + 
            (4 - Global.firstTime[Global.selectedDifficulty])).split("\n");
        while(true){
            if(tutorialText[0].trim().length == 0){
                tutorialText.splice(0, 1);
                break;
            }
            tutorialText.splice(0, 1);
        }

        let parts:string[] = tutorialText[0].split(",");
        for(let i:number=0; i<parts.length; i++){
            let value:number = parseInt(parts[i].trim());
            if(this.previousTile(value) >= 0){
                this.flippingTile[this.previousTile(value)].times += 1;
                continue;
            }
            switch(value){
                case 0:
                    this.flippingTile.push(new LShapeFlipEntity(this.game));
                break;
                case 1:
                    this.flippingTile.push(new PlusShapeFlipEntity(this.game));
                break;
                case 2:
                    this.flippingTile.push(new SquareFlipEntity(this.game));
                break;
                case 3:
                    this.flippingTile.push(new TShapeFlipEntity(this.game));
                break;
                case 4:
                    this.flippingTile.push(new ZShapeFlipEntity(this.game));
                break;
                case 5:
                    this.flippingTile.push(new SShapeFlipEntity(this.game));
                break;
            }
        }
    }

    previousTile(type: number) {
        for (var i: number = 0; i < this.flippingTile.length; i++) {
            if (type == this.flippingTile[i].compareType) {
                return i;
            }
        }
        return -1;
    }

    isPreviousPoint(list: Phaser.Point[], test: Phaser.Point) {
        for (var i: number = 0; i < list.length; i++) {
            if (test.equals(list[i])) {
                return true;
            }
        }
        return false;
    }

    generatePuzzle() {
        let startingPoint: Phaser.Point = new Phaser.Point();
        let gameplayState: GameplayState = <GameplayState>this.game.state.getCurrentState();

        let lowPieces:number = 0;
        for(let i:number=Global.MIN_PEICES[Global.selectedDifficulty]; i<Global.MAX_PEICES[Global.selectedDifficulty]; i++){
            if(this.game.rnd.realInRange(0, 1) < Global.getFlippingDifficulty()){
                lowPieces += 1;
            }
        }

        let numberOfPieces:number = Global.MIN_PEICES[Global.selectedDifficulty] + 
            this.game.rnd.integerInRange(0, lowPieces);
        if(numberOfPieces > ((gameplayState.colorMap.length - 2) * (gameplayState.colorMap[0].length - 2))){
            numberOfPieces = ((gameplayState.colorMap.length - 2) * (gameplayState.colorMap[0].length - 2)) - 1;
        }

        let lowDifferent:number = 0;
        for(let i:number=Global.MIN_DIFFERENT[Global.selectedDifficulty]; i<Global.MAX_DIFFERENT[Global.selectedDifficulty]; i++){
            if(this.game.rnd.realInRange(0, 1) < Global.getDifferentDifficulty()){
                lowDifferent += 1;
            }
        }

        let different:number = Global.MIN_DIFFERENT[Global.selectedDifficulty] + this.game.rnd.integerInRange(0, lowDifferent);
        startingPoint.x = this.game.rnd.integerInRange(1, gameplayState.colorMap.length - 1);
        startingPoint.y = this.game.rnd.integerInRange(1, gameplayState.colorMap[0].length - 1);

        let listOfPoints:Phaser.Point[] = [];
        for (let i: number = 0; i < numberOfPieces; i++) {
            while (this.isPreviousPoint(listOfPoints, startingPoint) ||
                startingPoint.x < 1 || startingPoint.y < 1 || 
                startingPoint.x >= gameplayState.colorMap.length - 1 ||
                startingPoint.y >= gameplayState.colorMap[0].length - 1){
                startingPoint.x = this.game.rnd.integerInRange(1, gameplayState.colorMap.length - 1);
                startingPoint.y = this.game.rnd.integerInRange(1, gameplayState.colorMap[0].length - 1);
            }
            listOfPoints.push(new Phaser.Point(startingPoint.x, startingPoint.y));

            let type: number = this.game.rnd.integerInRange(0, 5);
            if(this.flippingTile.length >= different){
                type = this.flippingTile[this.game.rnd.integerInRange(0, this.flippingTile.length - 1)].compareType;
            }
            let prevIndex: number = this.previousTile(type);
            let tile: FlippingEntity;
            if (prevIndex >= 0) {
                tile = this.flippingTile[prevIndex];
                tile.times += 1;
            }
            else {
                switch (type) {
                    case 0:
                        tile = new LShapeFlipEntity(this.game);
                        break;
                    case 1:
                        tile = new PlusShapeFlipEntity(this.game);
                        break;
                    case 2:
                        tile = new SquareFlipEntity(this.game);
                        break;
                    case 3:
                        tile = new TShapeFlipEntity(this.game);
                        break;
                    case 4:
                        tile = new ZShapeFlipEntity(this.game);
                        break;
                    case 5:
                        tile = new SShapeFlipEntity(this.game);
                        break;
                }
                this.flippingTile.push(tile);
            }
            let tempR: number = 0;
            if (type != 1 && type != 2) {
                if (Global.rotateEnable && this.game.rnd.realInRange(0, 1) < 0.5) {
                    tempR = this.game.rnd.integerInRange(1, 3);
                }
            }
            for (let r: number = 0; r < tempR; r++) {
                tile.rotate(true);
            }

            for (let p:number = 0; p < tile.points.length; p++) {
                let posX: number = startingPoint.x + tile.points[p].x;
                let posY: number = startingPoint.y + tile.points[p].y;
                gameplayState.colorMap[posX][posY].flipColor();
            }

            for (let r: number = 0; r < tempR; r++) {
                tile.rotate(false);
                tile.angleIndex = 0;
            }

            startingPoint.x += this.game.rnd.integerInRange(-2, 2);
            startingPoint.y += this.game.rnd.integerInRange(-2, 2);
        }
    }

    placeTile(x: number, y: number) {
        this.undoArray.push(new UndoData(x, y, this.flippingTile[this.selected].angleIndex, this.selected));
        this.flippingTile[this.selected].times -= 1;
        this.selected = -1;
    }

    undo() {
        if (this.undoArray.length > 0) {
            if(Global.sfxEnabled){this.game.add.sound("Undo").play();}
            var tempIndex: number = this.undoArray.length - 1;
            var gameplayState: GameplayState = <GameplayState>this.game.state.getCurrentState();

            let tempR:number = 0;
            for (let i: number = 0; i < 4; i++) {
                if (this.flippingTile[this.undoArray[tempIndex].index].angleIndex == this.undoArray[tempIndex].angle) {
                    break;
                }
                tempR += 1;
                this.flippingTile[this.undoArray[tempIndex].index].rotate(true);
            }

            for (let i: number = 0; i < this.flippingTile[this.undoArray[tempIndex].index].points.length; i++) {
                var posX: number = this.undoArray[tempIndex].x + this.flippingTile[this.undoArray[tempIndex].index].points[i].x;
                var posY: number = this.undoArray[tempIndex].y + this.flippingTile[this.undoArray[tempIndex].index].points[i].y;
                gameplayState.colorMap[posX][posY].flipColor();
            }

            for (let i: number = 0; i < tempR; i++) {
                this.flippingTile[this.undoArray[tempIndex].index].rotate(false);
            }

            this.flippingTile[this.undoArray[tempIndex].index].times += 1;
            this.undoArray.splice(tempIndex, 1);
        }
    }

    update() {
        super.update();

        let gameplay: GameplayState = <GameplayState>this.game.state.getCurrentState();

        if (this.selected < 0) {
            if(Global.firstTime[Global.selectedDifficulty] != 3 || Global.selectedDifficulty != 0){
                this.selectedHighLight.alpha = 0;
            }
        }
        else {
            this.selectedHighLight.alpha = 1;
            this.selectedHighLight.x = this.flippingTile[this.selected].baseX;
            this.selectedHighLight.y = this.flippingTile[this.selected].baseY;

            let xPos = Math.floor((this.game.input.activePointer.worldX + Global.TILE_SIZE / 2) / Global.TILE_SIZE);
            let yPos = Math.floor((this.game.input.activePointer.worldY + Global.TILE_SIZE / 2) / Global.TILE_SIZE);
            if (this.flippingTile[this.selected].checkOnMap(new Phaser.Point(xPos, yPos),
                new Phaser.Point(gameplay.colorMap.length, gameplay.colorMap[0].length))) {
                for (let i: number = 0; i < this.flippingTile[this.selected].points.length; i++) {
                    let shiftPoint: Phaser.Point = this.flippingTile[this.selected].points[i];
                    gameplay.colorMap[xPos + shiftPoint.x][yPos + shiftPoint.y].highligh(true);
                }
                for(let i:number=0; i<this.outsideHighlights.length; i++){
                    this.outsideHighlights[i].alpha = 0;
                }
            }
            else{
                for(let i:number=0; i<this.flippingTile[this.selected].points.length; i++){
                    let shiftPoint:Phaser.Point = this.flippingTile[this.selected].points[i];
                    this.outsideHighlights[i].x = (xPos + shiftPoint.x) * Global.TILE_SIZE;
                    this.outsideHighlights[i].y = (yPos + shiftPoint.y) * Global.TILE_SIZE;
                    this.outsideHighlights[i].alpha = 1;
                    if(xPos + shiftPoint.x < 0 || xPos + shiftPoint.x >= gameplay.colorMap.length ||
                        yPos + shiftPoint.y < 0 || yPos + shiftPoint.y >= gameplay.colorMap[0].length){
                        this.outsideHighlights[i].tint = Global.COLORS[0];
                    }
                    else{
                        this.outsideHighlights[i].tint = Global.GREY;
                    }
                }
            }
        }

        if (this.game.input.activePointer.isDown && this.selected < 0) {
            for (let i: number = 0; i < this.flippingTile.length; i++) {
                let point: Phaser.Point = new Phaser.Point(this.game.input.activePointer.x,
                    this.game.input.activePointer.y);
                if (point.distance(new Phaser.Point(this.flippingTile[i].baseX,
                    this.flippingTile[i].baseY)) < 2 * Global.SMALL_TILE &&
                    this.flippingTile[i].times > 0) {
                    this.selectedHighLight.x = this.flippingTile[i].baseX;
                    this.selectedHighLight.y = this.flippingTile[i].baseY;
                    this.selectedHighLight.alpha = 1;
                    if(Global.sfxEnabled){this.game.add.sound("Pickup").play();}
                    this.selected = i;
                    break;
                }
            }
        }

        if (this.game.input.activePointer.isUp && this.selected >= 0) {
            var xPos = Math.floor((this.game.input.activePointer.worldX + Global.TILE_SIZE / 2) / Global.TILE_SIZE);
            var yPos = Math.floor((this.game.input.activePointer.worldY + Global.TILE_SIZE / 2) / Global.TILE_SIZE);
            if (this.flippingTile[this.selected].checkOnMap(new Phaser.Point(xPos, yPos),
                new Phaser.Point(gameplay.colorMap.length, gameplay.colorMap[0].length))) {
                for (var i: number = 0; i < this.flippingTile[this.selected].points.length; i++) {
                    let shiftPoint: Phaser.Point = this.flippingTile[this.selected].points[i];
                    if (gameplay.colorMap[xPos + shiftPoint.x][yPos + shiftPoint.y] != null) {
                        gameplay.colorMap[xPos + shiftPoint.x][yPos + shiftPoint.y].flipColor();
                    }
                }
                if(Global.sfxEnabled){this.game.add.sound("Place").play();}
                this.placeTile(xPos, yPos);
                if (gameplay.checkWin()) {
                    if (Global.firstTime[Global.selectedDifficulty] > 0) {
                        Global.firstTime[Global.selectedDifficulty] -= 1;
                    }
                    Global.currentLevels[Global.selectedDifficulty] += 1;
                    Global.randomSeed[Global.selectedDifficulty] = this.game.rnd.integer();
                    Global.saveCookie(this.game);
                    this.game.state.restart(true, false);
                }
            }
            else {
                //TODO: play sound of wrong
                this.selected = -1;
            }
            for(let i:number=0; i<this.outsideHighlights.length; i++){
                this.outsideHighlights[i].alpha = 0;
            }
            this.game.input.activePointer.reset();
        }

        this.rotateButton.alpha = 0;
        if (Global.rotateEnable) {
            this.rotateButton.alpha = 1;
        }

        this.undoButton.alpha = 0;
        if (this.undoArray.length > 0) {
            this.undoButton.alpha = 1;
        }
    }
}