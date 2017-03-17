var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SimpleGame = (function () {
    function SimpleGame() {
        if (Global.browserTesting) {
            this.game = new Phaser.Game("100%", "100%", Phaser.AUTO, 'content');
        }
        else {
            this.game = new Phaser.Game(screen.width, screen.height, Phaser.AUTO, 'content');
        }
        this.game.state.add("Gameplay", GameplayState, false);
        this.game.state.add("GameMenu", GameMenuState, false);
        this.game.state.add("Loading", LoadingState, false);
        this.game.state.add("Credits", CreditState, false);
        this.game.state.add("Sure", SureState, false);
        Global.loadCookie(this.game);
        this.game.state.start("Loading", false, false);
    }
    return SimpleGame;
}());
function onDeviceReady() {
    var game = new SimpleGame();
    document.addEventListener("pause", onPause, false);
    document.addEventListener("resume", onResume, false);
}
function onPause() {
    if (Global.soundManager != null) {
        Global.soundManager.pauseAll();
        if (!Global.browserTesting) {
            navigator.splashscreen.show();
        }
        Global.pause = true;
    }
}
function onResume() {
    if (Global.soundManager != null) {
        Global.soundManager.resumeAll();
        if (!Global.browserTesting) {
            navigator.splashscreen.hide();
        }
        Global.pause = false;
    }
}
window.onload = function () {
    if (Global.browserTesting) {
        onDeviceReady();
    }
    document.addEventListener("deviceready", onDeviceReady, false);
};
var ColorTileEntity = (function (_super) {
    __extends(ColorTileEntity, _super);
    function ColorTileEntity(game, x, y, color) {
        _super.call(this, game);
        this.color = color;
        this.mainTile = new Phaser.Image(this.game, x, y, GameTextures.square);
        this.mainTile.anchor.set(0.5, 0.5);
        this.add(this.mainTile);
        this.highlightTile = new Phaser.Image(this.game, x, y, GameTextures.highlight);
        this.highlightTile.anchor.set(0.5, 0.5);
        this.add(this.highlightTile);
        this.highlightTile.alpha = 0;
    }
    ColorTileEntity.prototype.update = function () {
        _super.prototype.update.call(this);
        this.mainTile.tint = Global.COLORS[this.color];
        this.highlightTile.tint = 0xcccccc;
    };
    ColorTileEntity.prototype.flipColor = function () {
        this.color = Global.COLORS.length - this.color - 1;
    };
    ColorTileEntity.prototype.highligh = function (enable) {
        if (enable) {
            this.highlightTile.alpha = 1;
        }
        else {
            this.highlightTile.alpha = 0;
        }
    };
    return ColorTileEntity;
}(Phaser.Group));
var FlippingEntity = (function (_super) {
    __extends(FlippingEntity, _super);
    function FlippingEntity(game, points) {
        _super.call(this, game);
        this.points = points;
        this.angleIndex = 0;
        this.times = 1;
        this.compareType = -1;
        var style = { font: Global.SMALL_FONT + "px pixelFont", fill: "#cccccc", align: "center" };
        this.text = this.game.add.bitmapText(0, 0, "visitor", this.times.toString(), Global.SMALL_FONT, this);
        this.text.tint = Global.GREY;
        this.text.smoothed = false;
        this.images = [];
        for (var i = 0; i < points.length; i++) {
            var temp = new Phaser.Image(this.game, points[i].x * Global.SMALL_TILE, points[i].y * Global.SMALL_TILE, GameTextures.smallTile);
            temp.anchor.set(0.5, 0.5);
            this.add(temp);
            this.images.push(temp);
        }
        this.fixedToCamera = true;
    }
    FlippingEntity.prototype.update = function () {
        for (var i = 0; i < this.points.length; i++) {
            var temp = this.images[i];
            temp.x = this.baseX + this.points[i].x * Global.SMALL_TILE;
            temp.y = this.baseY + this.points[i].y * Global.SMALL_TILE;
        }
        this.text.text = this.times.toString();
        this.text.x = this.baseX + 2 * Global.SMALL_TILE;
        this.text.y = this.baseY + 2 * Global.SMALL_TILE;
        if (this.times > 0) {
            this.alpha = 1;
        }
        else {
            this.alpha = 0.25;
        }
    };
    FlippingEntity.prototype.checkOnMap = function (point, mapSize) {
        for (var i = 0; i < this.points.length; i++) {
            if (point.x + this.points[i].x < 0 || point.x + this.points[i].x >= mapSize.x ||
                point.y + this.points[i].y < 0 || point.y + this.points[i].y >= mapSize.y) {
                return false;
            }
        }
        return true;
    };
    FlippingEntity.prototype.modifyPoint = function (point, tileSize) {
        var result = new Phaser.Point(point.x, point.y);
        var minPoint = new Phaser.Point();
        var maxPoint = new Phaser.Point();
        for (var i = 0; i < this.points.length; i++) {
            if (minPoint.x >= this.points[i].x) {
                minPoint.x = this.points[i].x;
            }
            if (minPoint.y >= this.points[i].y) {
                minPoint.y = this.points[i].y;
            }
            if (maxPoint.x <= this.points[i].x) {
                maxPoint.x = this.points[i].x;
            }
            if (maxPoint.y <= this.points[i].y) {
                maxPoint.y = this.points[i].y;
            }
        }
        var modifiedPoint = new Phaser.Point(point.x, point.y).add(minPoint.x, minPoint.y);
        if (modifiedPoint.x < 0) {
            result.x = modifiedPoint.x * -1;
        }
        if (modifiedPoint.y < 0) {
            result.y = modifiedPoint.y * -1;
        }
        modifiedPoint = new Phaser.Point(point.x, point.y).add(maxPoint.x, maxPoint.y);
        if (modifiedPoint.x >= tileSize.x) {
            result.x = tileSize.x - maxPoint.x - 1;
        }
        if (modifiedPoint.y >= tileSize.y) {
            result.y = tileSize.y - maxPoint.y - 1;
        }
        return result;
    };
    FlippingEntity.prototype.rotate = function (antiClock) {
        var angle = 90;
        if (antiClock) {
            angle *= -1;
        }
        for (var i = 0; i < this.points.length; i++) {
            this.points[i] = this.points[i].rotate(0, 0, angle, true);
            this.points[i].x = Math.round(this.points[i].x);
            this.points[i].y = Math.round(this.points[i].y);
        }
        if (antiClock) {
            this.angleIndex = (this.angleIndex + 1) % 4;
        }
    };
    return FlippingEntity;
}(Phaser.Group));
var LShapeFlipEntity = (function (_super) {
    __extends(LShapeFlipEntity, _super);
    function LShapeFlipEntity(game) {
        _super.call(this, game, [new Phaser.Point(-1, -1), new Phaser.Point(-1, 0), new Phaser.Point(-1, 1),
            new Phaser.Point(0, 1), new Phaser.Point(1, 1)]);
        this.compareType = 0;
    }
    return LShapeFlipEntity;
}(FlippingEntity));
var PlusShapeFlipEntity = (function (_super) {
    __extends(PlusShapeFlipEntity, _super);
    function PlusShapeFlipEntity(game) {
        _super.call(this, game, [new Phaser.Point(0, -1),
            new Phaser.Point(-1, 0), new Phaser.Point(0, 0), new Phaser.Point(1, 0),
            new Phaser.Point(0, 1)]);
        this.compareType = 1;
    }
    return PlusShapeFlipEntity;
}(FlippingEntity));
var SquareFlipEntity = (function (_super) {
    __extends(SquareFlipEntity, _super);
    function SquareFlipEntity(game) {
        _super.call(this, game, [new Phaser.Point(-1, -1), new Phaser.Point(-1, 0), new Phaser.Point(-1, 1),
            new Phaser.Point(0, -1), new Phaser.Point(0, 0), new Phaser.Point(0, 1),
            new Phaser.Point(1, -1), new Phaser.Point(1, 0), new Phaser.Point(1, 1)]);
        this.compareType = 2;
    }
    return SquareFlipEntity;
}(FlippingEntity));
var SShapeFlipEntity = (function (_super) {
    __extends(SShapeFlipEntity, _super);
    function SShapeFlipEntity(game) {
        _super.call(this, game, [new Phaser.Point(1, -1), new Phaser.Point(0, -1),
            new Phaser.Point(0, 0),
            new Phaser.Point(0, 1), new Phaser.Point(-1, 1)]);
        this.compareType = 5;
    }
    return SShapeFlipEntity;
}(FlippingEntity));
var TShapeFlipEntity = (function (_super) {
    __extends(TShapeFlipEntity, _super);
    function TShapeFlipEntity(game) {
        _super.call(this, game, [new Phaser.Point(-1, -1), new Phaser.Point(0, -1), new Phaser.Point(1, -1),
            new Phaser.Point(0, 0),
            new Phaser.Point(0, 1)]);
        this.compareType = 3;
    }
    return TShapeFlipEntity;
}(FlippingEntity));
var ZShapeFlipEntity = (function (_super) {
    __extends(ZShapeFlipEntity, _super);
    function ZShapeFlipEntity(game) {
        _super.call(this, game, [new Phaser.Point(-1, -1), new Phaser.Point(0, -1),
            new Phaser.Point(0, 0),
            new Phaser.Point(0, 1), new Phaser.Point(1, 1)]);
        this.compareType = 4;
    }
    return ZShapeFlipEntity;
}(FlippingEntity));
var GrayTileEntity = (function (_super) {
    __extends(GrayTileEntity, _super);
    function GrayTileEntity(game, x, y) {
        _super.call(this, game, x, y, -1);
    }
    GrayTileEntity.prototype.update = function () {
        this.mainTile.tint = 0xcccccc;
        this.highlightTile.tint = 0xcccccc;
    };
    GrayTileEntity.prototype.flipColor = function () {
    };
    return GrayTileEntity;
}(ColorTileEntity));
var UndoData = (function () {
    function UndoData(x, y, angle, index) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.index = index;
    }
    return UndoData;
}());
var HUDEntity = (function (_super) {
    __extends(HUDEntity, _super);
    function HUDEntity(game) {
        var _this = this;
        _super.call(this, game);
        this.selected = -1;
        this.difficulty = ["easy", "medium", "hard"];
        var style = { font: Global.SMALL_FONT + "px pixelFont", fill: "#cccccc", align: "center" };
        var text = this.game.add.bitmapText(this.game.width / 2, (Math.floor(this.game.height / Global.TILE_SIZE) - 1.25) * Global.TILE_SIZE - Global.SMALL_FONT, "visitor", "TILES", Global.SMALL_FONT, this);
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
        for (var i = 0; i < this.flippingTile.length; i++) {
            this.game.add.existing(this.flippingTile[i]);
            this.flippingTile[i].baseX = this.game.width / 2 +
                (i - (this.flippingTile.length - 1) / 2) * 1.5 * Global.TILE_SIZE;
            this.flippingTile[i].baseY = text.y + Global.TILE_SIZE / 2;
        }
        this.selectedHighLight = new Phaser.Image(this.game, 0, 0, GameTextures.highlight);
        this.selectedHighLight.anchor.set(0.5, 0.5);
        this.add(this.selectedHighLight);
        this.selectedHighLight.tint = Global.GREY;
        this.selectedHighLight.alpha = 0;
        this.undoArray = [];
        var xButton = new XButtonEntity(this.game, 0.75 * Global.TILE_SIZE, 0.75 * Global.TILE_SIZE, function () {
            if (_this.selected < 0) {
                if (Global.sfxEnabled) {
                    _this.game.add.sound("Undo").play();
                }
                _this.game.state.start("GameMenu", true, false);
            }
        });
        this.add(xButton);
        if (Global.firstTime[Global.selectedDifficulty] <= 0) {
            var skipPuzzle = new ArrowButtonEntity(this.game, this.game.width - 0.75 * Global.TILE_SIZE, 0.75 * Global.TILE_SIZE, 1, function () {
                if (_this.selected < 0) {
                    if (Global.sfxEnabled) {
                        _this.game.add.sound("Undo").play();
                    }
                    Global.skippedLevels[Global.selectedDifficulty] += 1;
                    Global.randomSeed[Global.selectedDifficulty] = _this.game.rnd.integer();
                    _this.game.state.restart(true, false);
                    Global.saveCookie(_this.game);
                }
            }, false);
            this.add(skipPuzzle);
        }
        this.undoButton = new ArrowButtonEntity(this.game, 0.75 * Global.TILE_SIZE, this.game.height - 0.75 * Global.TILE_SIZE, -1, function () {
            if (_this.selected < 0) {
                _this.undo();
            }
        }, false);
        this.add(this.undoButton);
        this.rotateButton = new RotateButtonEntity(this.game, this.game.width - 0.75 * Global.TILE_SIZE, this.game.height - 0.75 * Global.TILE_SIZE, function () {
            if (Global.rotateEnable && _this.selected < 0) {
                if (Global.sfxEnabled) {
                    _this.game.add.sound("Pickup").play();
                }
                for (var i = 0; i < _this.flippingTile.length; i++) {
                    _this.flippingTile[i].rotate(true);
                }
                _this.game.input.keyboard.reset();
            }
        });
        this.add(this.rotateButton);
        this.outsideHighlights = [];
        for (var i = 0; i < 9; i++) {
            var temp = new Phaser.Image(this.game, 0, 0, GameTextures.highlight);
            temp.anchor.set(0.5, 0.5);
            temp.alpha = 0;
            this.game.add.existing(temp);
            this.outsideHighlights.push(temp);
        }
        if (Global.firstTime[Global.selectedDifficulty] == 3 && Global.selectedDifficulty == 0) {
            this.tutorialTimer = this.game.time.create();
            this.tutorialTimer.loop(500, function () {
                if (_this.selected < 0) {
                    _this.selectedHighLight.x = _this.flippingTile[0].baseX;
                    _this.selectedHighLight.y = _this.flippingTile[0].baseY;
                    _this.selectedHighLight.alpha = 1 - _this.selectedHighLight.alpha;
                }
            }, this);
            this.tutorialTimer.start();
        }
        this.fixedToCamera = true;
    }
    HUDEntity.prototype.loadTutorial = function () {
        var tutorialText = this.game.cache.getText(this.difficulty[Global.selectedDifficulty] +
            (4 - Global.firstTime[Global.selectedDifficulty])).split("\n");
        while (true) {
            if (tutorialText[0].trim().length == 0) {
                tutorialText.splice(0, 1);
                break;
            }
            tutorialText.splice(0, 1);
        }
        var parts = tutorialText[0].split(",");
        for (var i = 0; i < parts.length; i++) {
            var value = parseInt(parts[i].trim());
            if (this.previousTile(value) >= 0) {
                this.flippingTile[this.previousTile(value)].times += 1;
                continue;
            }
            switch (value) {
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
    };
    HUDEntity.prototype.previousTile = function (type) {
        for (var i = 0; i < this.flippingTile.length; i++) {
            if (type == this.flippingTile[i].compareType) {
                return i;
            }
        }
        return -1;
    };
    HUDEntity.prototype.isPreviousPoint = function (list, test) {
        for (var i = 0; i < list.length; i++) {
            if (test.equals(list[i])) {
                return true;
            }
        }
        return false;
    };
    HUDEntity.prototype.generatePuzzle = function () {
        var startingPoint = new Phaser.Point();
        var gameplayState = this.game.state.getCurrentState();
        var lowPieces = 0;
        for (var i = Global.MIN_PEICES[Global.selectedDifficulty]; i < Global.MAX_PEICES[Global.selectedDifficulty]; i++) {
            if (this.game.rnd.realInRange(0, 1) < Global.getFlippingDifficulty()) {
                lowPieces += 1;
            }
        }
        var numberOfPieces = Global.MIN_PEICES[Global.selectedDifficulty] +
            this.game.rnd.integerInRange(0, lowPieces);
        if (numberOfPieces > ((gameplayState.colorMap.length - 2) * (gameplayState.colorMap[0].length - 2))) {
            numberOfPieces = ((gameplayState.colorMap.length - 2) * (gameplayState.colorMap[0].length - 2)) - 1;
        }
        var lowDifferent = 0;
        for (var i = Global.MIN_DIFFERENT[Global.selectedDifficulty]; i < Global.MAX_DIFFERENT[Global.selectedDifficulty]; i++) {
            if (this.game.rnd.realInRange(0, 1) < Global.getDifferentDifficulty()) {
                lowDifferent += 1;
            }
        }
        var different = Global.MIN_DIFFERENT[Global.selectedDifficulty] + this.game.rnd.integerInRange(0, lowDifferent);
        startingPoint.x = this.game.rnd.integerInRange(1, gameplayState.colorMap.length - 1);
        startingPoint.y = this.game.rnd.integerInRange(1, gameplayState.colorMap[0].length - 1);
        var listOfPoints = [];
        for (var i = 0; i < numberOfPieces; i++) {
            while (this.isPreviousPoint(listOfPoints, startingPoint) ||
                startingPoint.x < 1 || startingPoint.y < 1 ||
                startingPoint.x >= gameplayState.colorMap.length - 1 ||
                startingPoint.y >= gameplayState.colorMap[0].length - 1) {
                startingPoint.x = this.game.rnd.integerInRange(1, gameplayState.colorMap.length - 1);
                startingPoint.y = this.game.rnd.integerInRange(1, gameplayState.colorMap[0].length - 1);
            }
            listOfPoints.push(new Phaser.Point(startingPoint.x, startingPoint.y));
            var type = this.game.rnd.integerInRange(0, 5);
            if (this.flippingTile.length >= different) {
                type = this.flippingTile[this.game.rnd.integerInRange(0, this.flippingTile.length - 1)].compareType;
            }
            var prevIndex = this.previousTile(type);
            var tile = void 0;
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
            var tempR = 0;
            if (type != 1 && type != 2) {
                if (Global.rotateEnable && this.game.rnd.realInRange(0, 1) < 0.5) {
                    tempR = this.game.rnd.integerInRange(1, 3);
                }
            }
            for (var r = 0; r < tempR; r++) {
                tile.rotate(true);
            }
            for (var p = 0; p < tile.points.length; p++) {
                var posX = startingPoint.x + tile.points[p].x;
                var posY = startingPoint.y + tile.points[p].y;
                gameplayState.colorMap[posX][posY].flipColor();
            }
            for (var r = 0; r < tempR; r++) {
                tile.rotate(false);
                tile.angleIndex = 0;
            }
            startingPoint.x += this.game.rnd.integerInRange(-2, 2);
            startingPoint.y += this.game.rnd.integerInRange(-2, 2);
        }
    };
    HUDEntity.prototype.placeTile = function (x, y) {
        this.undoArray.push(new UndoData(x, y, this.flippingTile[this.selected].angleIndex, this.selected));
        this.flippingTile[this.selected].times -= 1;
        this.selected = -1;
    };
    HUDEntity.prototype.undo = function () {
        if (this.undoArray.length > 0) {
            if (Global.sfxEnabled) {
                this.game.add.sound("Undo").play();
            }
            var tempIndex = this.undoArray.length - 1;
            var gameplayState = this.game.state.getCurrentState();
            var tempR = 0;
            for (var i = 0; i < 4; i++) {
                if (this.flippingTile[this.undoArray[tempIndex].index].angleIndex == this.undoArray[tempIndex].angle) {
                    break;
                }
                tempR += 1;
                this.flippingTile[this.undoArray[tempIndex].index].rotate(true);
            }
            for (var i = 0; i < this.flippingTile[this.undoArray[tempIndex].index].points.length; i++) {
                var posX = this.undoArray[tempIndex].x + this.flippingTile[this.undoArray[tempIndex].index].points[i].x;
                var posY = this.undoArray[tempIndex].y + this.flippingTile[this.undoArray[tempIndex].index].points[i].y;
                gameplayState.colorMap[posX][posY].flipColor();
            }
            for (var i = 0; i < tempR; i++) {
                this.flippingTile[this.undoArray[tempIndex].index].rotate(false);
            }
            this.flippingTile[this.undoArray[tempIndex].index].times += 1;
            this.undoArray.splice(tempIndex, 1);
        }
    };
    HUDEntity.prototype.update = function () {
        _super.prototype.update.call(this);
        var gameplay = this.game.state.getCurrentState();
        if (this.selected < 0) {
            if (Global.firstTime[Global.selectedDifficulty] != 3 || Global.selectedDifficulty != 0) {
                this.selectedHighLight.alpha = 0;
            }
        }
        else {
            this.selectedHighLight.alpha = 1;
            this.selectedHighLight.x = this.flippingTile[this.selected].baseX;
            this.selectedHighLight.y = this.flippingTile[this.selected].baseY;
            var xPos_1 = Math.floor((this.game.input.activePointer.worldX + Global.TILE_SIZE / 2) / Global.TILE_SIZE);
            var yPos_1 = Math.floor((this.game.input.activePointer.worldY + Global.TILE_SIZE / 2) / Global.TILE_SIZE);
            if (this.flippingTile[this.selected].checkOnMap(new Phaser.Point(xPos_1, yPos_1), new Phaser.Point(gameplay.colorMap.length, gameplay.colorMap[0].length))) {
                for (var i_1 = 0; i_1 < this.flippingTile[this.selected].points.length; i_1++) {
                    var shiftPoint = this.flippingTile[this.selected].points[i_1];
                    gameplay.colorMap[xPos_1 + shiftPoint.x][yPos_1 + shiftPoint.y].highligh(true);
                }
                for (var i_2 = 0; i_2 < this.outsideHighlights.length; i_2++) {
                    this.outsideHighlights[i_2].alpha = 0;
                }
            }
            else {
                for (var i_3 = 0; i_3 < this.flippingTile[this.selected].points.length; i_3++) {
                    var shiftPoint = this.flippingTile[this.selected].points[i_3];
                    this.outsideHighlights[i_3].x = (xPos_1 + shiftPoint.x) * Global.TILE_SIZE;
                    this.outsideHighlights[i_3].y = (yPos_1 + shiftPoint.y) * Global.TILE_SIZE;
                    this.outsideHighlights[i_3].alpha = 1;
                    if (xPos_1 + shiftPoint.x < 0 || xPos_1 + shiftPoint.x >= gameplay.colorMap.length ||
                        yPos_1 + shiftPoint.y < 0 || yPos_1 + shiftPoint.y >= gameplay.colorMap[0].length) {
                        this.outsideHighlights[i_3].tint = Global.COLORS[0];
                    }
                    else {
                        this.outsideHighlights[i_3].tint = Global.GREY;
                    }
                }
            }
        }
        if (this.game.input.activePointer.isDown && this.selected < 0) {
            for (var i_4 = 0; i_4 < this.flippingTile.length; i_4++) {
                var point = new Phaser.Point(this.game.input.activePointer.x, this.game.input.activePointer.y);
                if (point.distance(new Phaser.Point(this.flippingTile[i_4].baseX, this.flippingTile[i_4].baseY)) < 2 * Global.SMALL_TILE &&
                    this.flippingTile[i_4].times > 0) {
                    this.selectedHighLight.x = this.flippingTile[i_4].baseX;
                    this.selectedHighLight.y = this.flippingTile[i_4].baseY;
                    this.selectedHighLight.alpha = 1;
                    if (Global.sfxEnabled) {
                        this.game.add.sound("Pickup").play();
                    }
                    this.selected = i_4;
                    break;
                }
            }
        }
        if (this.game.input.activePointer.isUp && this.selected >= 0) {
            var xPos = Math.floor((this.game.input.activePointer.worldX + Global.TILE_SIZE / 2) / Global.TILE_SIZE);
            var yPos = Math.floor((this.game.input.activePointer.worldY + Global.TILE_SIZE / 2) / Global.TILE_SIZE);
            if (this.flippingTile[this.selected].checkOnMap(new Phaser.Point(xPos, yPos), new Phaser.Point(gameplay.colorMap.length, gameplay.colorMap[0].length))) {
                for (var i = 0; i < this.flippingTile[this.selected].points.length; i++) {
                    var shiftPoint = this.flippingTile[this.selected].points[i];
                    if (gameplay.colorMap[xPos + shiftPoint.x][yPos + shiftPoint.y] != null) {
                        gameplay.colorMap[xPos + shiftPoint.x][yPos + shiftPoint.y].flipColor();
                    }
                }
                if (Global.sfxEnabled) {
                    this.game.add.sound("Place").play();
                }
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
            for (var i_5 = 0; i_5 < this.outsideHighlights.length; i_5++) {
                this.outsideHighlights[i_5].alpha = 0;
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
    };
    return HUDEntity;
}(Phaser.Group));
var OverlayEntity = (function (_super) {
    __extends(OverlayEntity, _super);
    function OverlayEntity(game, x, y, index) {
        _super.call(this, game, 0, 0, GameTextures.overlayer[index]);
        this.scale.set(2 * this.game.width / Global.TILE_SIZE, 2 * this.game.height / Global.TILE_SIZE + 1);
        this.alpha = 1;
        this.fixedToCamera = true;
    }
    OverlayEntity.prototype.update = function () {
        _super.prototype.update.call(this);
        this.alpha -= 0.04;
        if (this.alpha <= 0) {
            this.kill();
        }
    };
    return OverlayEntity;
}(Phaser.Image));
var ArrowButtonEntity = (function (_super) {
    __extends(ArrowButtonEntity, _super);
    function ArrowButtonEntity(game, x, y, direction, action, closed) {
        if (closed === void 0) { closed = true; }
        _super.call(this, game);
        this.x = x;
        this.y = y;
        this.action = action;
        if (closed) {
            var image = new Phaser.Image(this.game, 0, 0, GameTextures.startButton);
            image.anchor.set(0.5, 0.5);
            this.add(image);
        }
        else {
            if (direction == 1) {
                var image = new Phaser.Image(this.game, 0, 0, GameTextures.arrows[0]);
                image.anchor.set(0.5, 0.5);
                this.add(image);
            }
            else {
                var image = new Phaser.Image(this.game, 0, 0, GameTextures.arrows[1]);
                image.anchor.set(0.5, 0.5);
                this.add(image);
            }
        }
    }
    ArrowButtonEntity.prototype.update = function () {
        _super.prototype.update.call(this);
        if (this.game.input.activePointer.x > this.worldPosition.x - Global.TILE_SIZE / 2 &&
            this.game.input.activePointer.y > this.worldPosition.y - Global.TILE_SIZE / 2 &&
            this.game.input.activePointer.x < this.worldPosition.x + Global.TILE_SIZE / 2 &&
            this.game.input.activePointer.y < this.worldPosition.y + Global.TILE_SIZE / 2 &&
            this.game.input.activePointer.isDown) {
            this.action();
            this.game.input.activePointer.reset();
        }
    };
    return ArrowButtonEntity;
}(Phaser.Group));
var CreditsButtonEntity = (function (_super) {
    __extends(CreditsButtonEntity, _super);
    function CreditsButtonEntity(game, x, y, action) {
        _super.call(this, game);
        this.x = x;
        this.y = y;
        this.action = action;
        var image = new Phaser.Image(game, 0, 0, GameTextures.credits);
        image.anchor.set(0.5, 0.5);
        this.add(image);
    }
    CreditsButtonEntity.prototype.update = function () {
        _super.prototype.update.call(this);
        if (this.game.input.activePointer.x > this.worldPosition.x - Global.TILE_SIZE / 2 &&
            this.game.input.activePointer.y > this.worldPosition.y - Global.TILE_SIZE / 2 &&
            this.game.input.activePointer.x < this.worldPosition.x + Global.TILE_SIZE / 2 &&
            this.game.input.activePointer.y < this.worldPosition.y + Global.TILE_SIZE / 2 &&
            this.game.input.activePointer.isDown) {
            this.action();
            this.game.input.activePointer.reset();
        }
    };
    return CreditsButtonEntity;
}(Phaser.Group));
var GameNameEntity = (function (_super) {
    __extends(GameNameEntity, _super);
    function GameNameEntity(game, x, y) {
        var _this = this;
        _super.call(this, game);
        this.DIFF = ["Easy", "Medium", "Hard"];
        this.x = x;
        this.y = y;
        this.rotationSpeed = 2;
        this.logo = new Phaser.Image(this.game, 0, 0, GameTextures.logo);
        this.logo.anchor.set(0.5, 0.5);
        this.logo.angle = 135;
        this.add(this.logo);
        var style = { font: Global.BIG_FONT + "px pixelFont", fill: "#cccccc", align: "center" };
        var text = this.game.add.bitmapText(0, 0, "visitor", "C-Square", Global.BIG_FONT, this);
        text.anchor.set(0.5, 0.5);
        text.tint = Global.GREY;
        text.smoothed = false;
        style = { font: Global.SMALL_FONT + "px pixelFont", fill: "#cccccc", align: "center" };
        text = this.game.add.bitmapText(0, 2 * Global.TILE_SIZE, "visitor", "Difficulty", Global.SMALL_FONT, this);
        text.anchor.set(0.5, 1);
        text.tint = Global.GREY;
        text.smoothed = false;
        style = { font: Global.MEDIUM_FONT + "px pixelFont", fill: "#cccccc", align: "center" };
        this.difficulty = this.game.add.bitmapText(text.x, text.y + Math.floor(Global.MEDIUM_FONT / 2), "visitor", this.DIFF[Global.selectedDifficulty], Global.MEDIUM_FONT, this);
        this.difficulty.anchor.set(0.5, 0.5);
        this.difficulty.tint = Global.GREY;
        this.difficulty.smoothed = false;
        style = { font: Global.SMALL_FONT + "px pixelFont", fill: "#cccccc", align: "center" };
        var lastPixel = this.game.height - this.y - Math.floor(Global.SMALL_FONT / 2);
        text = this.game.add.bitmapText(0, lastPixel - Global.SMALL_FONT, "visitor", "Game by Amidos", Global.SMALL_FONT, this);
        text.anchor.set(0.5, 1);
        text.tint = Global.GREY;
        text.smoothed = false;
        text = this.game.add.bitmapText(0, lastPixel, "visitor", "Music by Abstraction", Global.SMALL_FONT, this);
        text.anchor.set(0.5, 1);
        text.tint = Global.GREY;
        text.smoothed = false;
        var creditsButton = new CreditsButtonEntity(this.game, (this.game.width - this.x) - 0.75 * Global.TILE_SIZE, -this.y + 0.75 * Global.TILE_SIZE, function () {
            if (Global.sfxEnabled) {
                _this.game.add.sound("Place").play();
            }
            _this.game.state.start("Credits", true, false);
        });
        this.add(creditsButton);
        // let scoringButton:ScoringButtonEntity = new ScoringButtonEntity(this.game, 
        //     -this.x + Global.TILE_SIZE/2, -this.y + Global.TILE_SIZE / 2, 1, 
        //     ()=>{this.game.add.sound("Place").play();
        //         this.game.state.start("Credits", true, false);});
        // this.add(scoringButton);
        this.playButton = new ArrowButtonEntity(this.game, 0, 4 * Global.TILE_SIZE, 1, function () {
            if (Global.sfxEnabled) {
                _this.game.add.sound("Place").play();
            }
            _this.game.state.start("Gameplay", true, false);
        });
        this.add(this.playButton);
        this.leftButton = new ArrowButtonEntity(this.game, -Global.MEDIUM_FONT * 3, this.difficulty.y - 2, -1, function () {
            if (Global.sfxEnabled) {
                _this.game.add.sound("Pickup").play();
            }
            Global.selectedDifficulty -= 1;
            if (Global.selectedDifficulty < 0) {
                Global.selectedDifficulty += _this.DIFF.length;
            }
            Global.saveCookie(_this.game);
        }, false);
        this.add(this.leftButton);
        this.rightButton = new ArrowButtonEntity(this.game, Global.MEDIUM_FONT * 3, this.difficulty.y - 2, 1, function () {
            if (Global.sfxEnabled) {
                _this.game.add.sound("Pickup").play();
            }
            Global.selectedDifficulty += 1;
            if (Global.selectedDifficulty >= _this.DIFF.length) {
                Global.selectedDifficulty -= _this.DIFF.length;
            }
            Global.saveCookie(_this.game);
        }, false);
        this.add(this.rightButton);
    }
    GameNameEntity.prototype.update = function () {
        _super.prototype.update.call(this);
        this.logo.angle -= this.rotationSpeed;
        if (this.logo.angle < 0) {
            this.logo.angle += 360;
        }
        this.difficulty.text = this.DIFF[Global.selectedDifficulty];
    };
    return GameNameEntity;
}(Phaser.Group));
var LoadingEntity = (function (_super) {
    __extends(LoadingEntity, _super);
    function LoadingEntity(game, x, y) {
        _super.call(this, game);
        this.x = x;
        this.y = y;
        this.rotationSpeed = 2;
        this.logo = new Phaser.Image(this.game, 0, 0, GameTextures.logo);
        this.logo.anchor.set(0.5, 0.5);
        this.add(this.logo);
        this.logo.angle = 135;
        var style = { font: Global.BIG_FONT + "px pixelFont", fill: "#cccccc", align: "center" };
        this.text = this.game.add.text(0, 0, "Loading", style, this);
        this.text.anchor.set(0.5, 0.5);
        this.text.alpha = 0;
    }
    LoadingEntity.prototype.update = function () {
        // this.logo.angle -= this.rotationSpeed;
        // if(this.logo.angle < 0){
        //     this.logo.angle += 360;
        // }
    };
    return LoadingEntity;
}(Phaser.Group));
var OButtonEntity = (function (_super) {
    __extends(OButtonEntity, _super);
    function OButtonEntity(game, x, y, action) {
        _super.call(this, game);
        this.x = x;
        this.y = y;
        this.action = action;
        var image = new Phaser.Image(game, 0, 0, GameTextures.o);
        image.anchor.set(0.5, 0.5);
        this.add(image);
    }
    OButtonEntity.prototype.update = function () {
        _super.prototype.update.call(this);
        if (this.game.input.activePointer.x > this.worldPosition.x - Global.TILE_SIZE / 2 &&
            this.game.input.activePointer.y > this.worldPosition.y - Global.TILE_SIZE / 2 &&
            this.game.input.activePointer.x < this.worldPosition.x + Global.TILE_SIZE / 2 &&
            this.game.input.activePointer.y < this.worldPosition.y + Global.TILE_SIZE / 2 &&
            this.game.input.activePointer.isDown) {
            this.action();
            this.game.input.activePointer.reset();
        }
    };
    return OButtonEntity;
}(Phaser.Group));
var OptionsStatsEntity = (function (_super) {
    __extends(OptionsStatsEntity, _super);
    function OptionsStatsEntity(game, x, y) {
        var _this = this;
        _super.call(this, game);
        this.DIFF = ["Easy", "Medium", "Hard"];
        this.ENABLE = ["On", "Off"];
        this.x = x;
        this.y = y;
        var style = { font: Global.SMALL_FONT + "px pixelFont", fill: "#cccccc", align: "center" };
        var text = this.game.add.bitmapText(0, 2 * Global.TILE_SIZE - Global.TILE_SIZE, "visitor", "Difficulty", Global.SMALL_FONT, this);
        text.anchor.set(0.5, 1);
        text.tint = Global.GREY;
        text.smoothed = false;
        style = { font: Global.MEDIUM_FONT + "px pixelFont", fill: "#cccccc", align: "center" };
        this.difficulty = this.game.add.bitmapText(text.x, text.y + Math.floor(Global.MEDIUM_FONT / 2), "visitor", this.DIFF[Global.selectedDifficulty], Global.MEDIUM_FONT, this);
        this.difficulty.anchor.set(0.5, 0.5);
        this.difficulty.tint = Global.GREY;
        this.difficulty.smoothed = false;
        var leftButton = new ArrowButtonEntity(this.game, -Global.MEDIUM_FONT * 3, this.difficulty.y - 2, -1, function () {
            if (Global.sfxEnabled) {
                _this.game.add.sound("Pickup").play();
            }
            Global.selectedDifficulty -= 1;
            if (Global.selectedDifficulty < 0) {
                Global.selectedDifficulty += _this.DIFF.length;
            }
            Global.saveCookie(_this.game);
        }, false);
        this.add(leftButton);
        var rightButton = new ArrowButtonEntity(this.game, Global.MEDIUM_FONT * 3, this.difficulty.y - 2, 1, function () {
            if (Global.sfxEnabled) {
                _this.game.add.sound("Pickup").play();
            }
            Global.selectedDifficulty += 1;
            if (Global.selectedDifficulty >= _this.DIFF.length) {
                Global.selectedDifficulty -= _this.DIFF.length;
            }
            Global.saveCookie(_this.game);
        }, false);
        this.add(rightButton);
        style = { font: Global.SMALL_FONT + "px pixelFont", fill: "#cccccc", align: "center" };
        this.completedText = this.game.add.bitmapText(0, this.difficulty.y + 2 * Global.MEDIUM_FONT - 2, "visitor", "Completed Levels - " + Global.currentLevels[Global.selectedDifficulty], Global.SMALL_FONT, this);
        this.completedText.anchor.set(0.5, 1);
        this.completedText.tint = Global.GREY;
        this.completedText.smoothed = false;
        this.skippedText = this.game.add.bitmapText(0, this.completedText.y + Global.MEDIUM_FONT - 2, "visitor", "Skipped Levels - " + Global.skippedLevels[Global.selectedDifficulty], Global.SMALL_FONT, this);
        this.skippedText.anchor.set(0.5, 1);
        this.skippedText.tint = Global.GREY;
        this.skippedText.smoothed = false;
        var deleteButton = new XButtonEntity(this.game, 0, this.skippedText.y +
            Global.TILE_SIZE / 2 + Global.MEDIUM_FONT, function () {
            if (Global.sfxEnabled) {
                _this.game.add.sound("Pickup").play();
            }
            _this.game.state.start("Sure", true, false);
        }, true);
        this.add(deleteButton);
        style = { font: Global.SMALL_FONT + "px pixelFont", fill: "#cccccc", align: "center" };
        text = this.game.add.bitmapText(0, -2 * Global.TILE_SIZE - Global.TILE_SIZE, "visitor", "Music", Global.SMALL_FONT, this);
        text.anchor.set(0.5, 1);
        text.tint = Global.GREY;
        text.smoothed = false;
        style = { font: Global.MEDIUM_FONT + "px pixelFont", fill: "#cccccc", align: "center" };
        this.musicText = this.game.add.bitmapText(text.x, text.y + Math.floor(Global.MEDIUM_FONT / 2), "visitor", this.ENABLE[Global.musicEnabled ? 0 : 1], Global.MEDIUM_FONT, this);
        this.musicText.anchor.set(0.5, 0.5);
        this.musicText.tint = Global.GREY;
        this.musicText.smoothed = false;
        leftButton = new ArrowButtonEntity(this.game, -Global.MEDIUM_FONT * 3, this.musicText.y - 2, -1, function () {
            if (Global.sfxEnabled) {
                _this.game.add.sound("Pickup").play();
            }
            Global.musicEnabled = !Global.musicEnabled;
            if (!Global.musicEnabled) {
                Global.soundPlayed.stop();
            }
            Global.saveCookie(_this.game);
        }, false);
        this.add(leftButton);
        rightButton = new ArrowButtonEntity(this.game, Global.MEDIUM_FONT * 3, this.musicText.y - 2, 1, function () {
            if (Global.sfxEnabled) {
                _this.game.add.sound("Pickup").play();
            }
            Global.musicEnabled = !Global.musicEnabled;
            if (!Global.musicEnabled) {
                Global.soundPlayed.stop();
            }
            Global.saveCookie(_this.game);
        }, false);
        this.add(rightButton);
        style = { font: Global.SMALL_FONT + "px pixelFont", fill: "#cccccc", align: "center" };
        text = this.game.add.bitmapText(0, -Global.TILE_SIZE, "visitor", "Sound Effects", Global.SMALL_FONT, this);
        text.anchor.set(0.5, 1);
        text.tint = Global.GREY;
        text.smoothed = false;
        style = { font: Global.MEDIUM_FONT + "px pixelFont", fill: "#cccccc", align: "center" };
        this.sfxText = this.game.add.bitmapText(text.x, text.y + Math.floor(Global.MEDIUM_FONT / 2), "visitor", this.ENABLE[Global.sfxEnabled ? 0 : 1], Global.MEDIUM_FONT, this);
        this.sfxText.anchor.set(0.5, 0.5);
        this.sfxText.tint = Global.GREY;
        this.sfxText.smoothed = false;
        leftButton = new ArrowButtonEntity(this.game, -Global.MEDIUM_FONT * 3, this.sfxText.y - 2, -1, function () {
            if (Global.sfxEnabled) {
                _this.game.add.sound("Pickup").play();
            }
            Global.sfxEnabled = !Global.sfxEnabled;
            Global.saveCookie(_this.game);
        }, false);
        this.add(leftButton);
        rightButton = new ArrowButtonEntity(this.game, Global.MEDIUM_FONT * 3, this.sfxText.y - 2, 1, function () {
            if (Global.sfxEnabled) {
                _this.game.add.sound("Pickup").play();
            }
            Global.sfxEnabled = !Global.sfxEnabled;
            Global.saveCookie(_this.game);
        }, false);
        this.add(rightButton);
    }
    OptionsStatsEntity.prototype.update = function () {
        _super.prototype.update.call(this);
        this.difficulty.text = this.DIFF[Global.selectedDifficulty];
        this.musicText.text = this.ENABLE[Global.musicEnabled ? 0 : 1];
        this.sfxText.text = this.ENABLE[Global.sfxEnabled ? 0 : 1];
        this.completedText.text = "Completed Levels - " + Global.currentLevels[Global.selectedDifficulty].toString();
        this.skippedText.text = "Skipped Levels - " + Global.skippedLevels[Global.selectedDifficulty].toString();
    };
    return OptionsStatsEntity;
}(Phaser.Group));
var RotateButtonEntity = (function (_super) {
    __extends(RotateButtonEntity, _super);
    function RotateButtonEntity(game, x, y, action) {
        _super.call(this, game);
        this.x = x;
        this.y = y;
        this.action = action;
        var image = new Phaser.Image(game, 0, 0, GameTextures.rotate);
        image.anchor.set(0.5, 0.5);
        this.add(image);
    }
    RotateButtonEntity.prototype.update = function () {
        _super.prototype.update.call(this);
        if (this.game.input.activePointer.x > this.worldPosition.x - Global.TILE_SIZE / 2 &&
            this.game.input.activePointer.y > this.worldPosition.y - Global.TILE_SIZE / 2 &&
            this.game.input.activePointer.x < this.worldPosition.x + Global.TILE_SIZE / 2 &&
            this.game.input.activePointer.y < this.worldPosition.y + Global.TILE_SIZE / 2 &&
            this.game.input.activePointer.isDown) {
            this.action();
            this.game.input.activePointer.reset();
        }
    };
    return RotateButtonEntity;
}(Phaser.Group));
var ScoringButtonEntity = (function (_super) {
    __extends(ScoringButtonEntity, _super);
    function ScoringButtonEntity(game, x, y, type, action) {
        _super.call(this, game);
        this.x = x;
        this.y = y;
        this.action = action;
        var image = new Phaser.Image(game, 0, 0, type == 0 ? GameTextures.gameCenter : GameTextures.googlePlay);
        image.anchor.set(0.5, 0.5);
        this.add(image);
    }
    ScoringButtonEntity.prototype.update = function () {
        _super.prototype.update.call(this);
        if (this.game.input.activePointer.x > this.worldPosition.x - Global.TILE_SIZE / 2 &&
            this.game.input.activePointer.y > this.worldPosition.y - Global.TILE_SIZE / 2 &&
            this.game.input.activePointer.x < this.worldPosition.x + Global.TILE_SIZE / 2 &&
            this.game.input.activePointer.y < this.worldPosition.y + Global.TILE_SIZE / 2 &&
            this.game.input.activePointer.isDown) {
            this.action();
            this.game.input.activePointer.reset();
        }
    };
    return ScoringButtonEntity;
}(Phaser.Group));
var SureEntity = (function (_super) {
    __extends(SureEntity, _super);
    function SureEntity(game, x, y) {
        var _this = this;
        _super.call(this, game);
        this.x = x;
        this.y = y;
        var question = this.game.add.bitmapText(0, 0, "visitor", "Are you sure\nyou want to reset\nC-Square?\n\nyou will lose\nall your progress", Global.SMALL_FONT, this);
        question.anchor.set(0.5, 1);
        question.align = "center";
        question.tint = Global.GREY;
        question.smoothed = false;
        var xButton = new XButtonEntity(this.game, 1.5 * Global.TILE_SIZE, Global.TILE_SIZE, function () {
            if (Global.sfxEnabled) {
                _this.game.add.sound("Undo").play();
            }
            _this.game.state.start("Credits", true, false);
        });
        this.add(xButton);
        var oButton = new OButtonEntity(this.game, -1.5 * Global.TILE_SIZE, Global.TILE_SIZE, function () {
            if (Global.sfxEnabled) {
                _this.game.add.sound("Undo").play();
            }
            Global.deleteCookie(_this.game);
            _this.game.state.start("Credits", true, false);
        });
        this.add(oButton);
    }
    return SureEntity;
}(Phaser.Group));
var XButtonEntity = (function (_super) {
    __extends(XButtonEntity, _super);
    function XButtonEntity(game, x, y, action, closed) {
        if (closed === void 0) { closed = false; }
        _super.call(this, game);
        this.x = x;
        this.y = y;
        this.action = action;
        var image = null;
        if (closed) {
            image = new Phaser.Image(game, 0, 0, GameTextures.deleteButton);
        }
        else {
            image = new Phaser.Image(game, 0, 0, GameTextures.x);
        }
        image.anchor.set(0.5, 0.5);
        this.add(image);
    }
    XButtonEntity.prototype.update = function () {
        _super.prototype.update.call(this);
        if (this.game.input.activePointer.x > this.worldPosition.x - Global.TILE_SIZE / 2 &&
            this.game.input.activePointer.y > this.worldPosition.y - Global.TILE_SIZE / 2 &&
            this.game.input.activePointer.x < this.worldPosition.x + Global.TILE_SIZE / 2 &&
            this.game.input.activePointer.y < this.worldPosition.y + Global.TILE_SIZE / 2 &&
            this.game.input.activePointer.isDown) {
            this.action();
            this.game.input.activePointer.reset();
        }
    };
    return XButtonEntity;
}(Phaser.Group));
var CreditState = (function (_super) {
    __extends(CreditState, _super);
    function CreditState() {
        _super.call(this);
    }
    CreditState.prototype.create = function () {
        var _this = this;
        _super.prototype.create.call(this);
        var xButton = new XButtonEntity(this.game, 0.75 * Global.TILE_SIZE, 0.75 * Global.TILE_SIZE, function () {
            if (Global.sfxEnabled) {
                _this.game.add.sound("Undo").play();
            }
            _this.game.state.start("GameMenu", true, false);
        });
        this.add.existing(xButton);
        this.add.existing(new OptionsStatsEntity(this.game, this.game.width / 2, this.game.height / 2));
        var overlayer = new OverlayEntity(this.game, this.game.width / 2, this.game.width / 2, this.game.rnd.integerInRange(0, 1));
        this.add.existing(overlayer);
    };
    CreditState.prototype.update = function () {
        _super.prototype.update.call(this);
        Global.playMusic(this.game);
    };
    return CreditState;
}(Phaser.State));
var GameMenuState = (function (_super) {
    __extends(GameMenuState, _super);
    function GameMenuState() {
        _super.call(this);
    }
    GameMenuState.prototype.create = function () {
        this.game.camera.setPosition(0, 0);
        this.add.existing(new GameNameEntity(this.game, this.game.width / 2, this.game.height / 2 - 50));
        var overlayer = new OverlayEntity(this.game, this.game.width / 2, this.game.width / 2, this.game.rnd.integerInRange(0, 1));
        this.add.existing(overlayer);
    };
    GameMenuState.prototype.update = function () {
        _super.prototype.update.call(this);
        Global.playMusic(this.game);
    };
    return GameMenuState;
}(Phaser.State));
var GameplayState = (function (_super) {
    __extends(GameplayState, _super);
    function GameplayState() {
        _super.call(this);
        this.difficulty = ["easy", "medium", "hard"];
    }
    GameplayState.prototype.create = function () {
        Global.interpretDifficulty();
        if (Global.firstTime[Global.selectedDifficulty] <= 0) {
            this.game.rnd.sow([Global.randomSeed[Global.selectedDifficulty]]);
            this.generateLevel();
        }
        else {
            this.loadTutorial();
        }
        var mapWidth = this.colorMap.length;
        var mapHeight = this.colorMap[0].length;
        this.game.world.setBounds(-this.game.width, -this.game.height, 2 * this.game.width, 2 * this.game.height);
        this.game.camera.x = -(this.game.width - mapWidth * Global.TILE_SIZE) / 2 - Global.TILE_SIZE / 2;
        this.game.camera.y = -((this.game.height - 2 * Global.TILE_SIZE) - mapHeight * Global.TILE_SIZE) / 2 -
            Global.TILE_SIZE / 2;
        this.hudEntity = new HUDEntity(this.game);
        this.game.add.existing(this.hudEntity);
        var overlayer = new OverlayEntity(this.game, this.game.width / 2, this.game.width / 2, this.game.rnd.integerInRange(0, 1));
        this.add.existing(overlayer);
    };
    GameplayState.prototype.loadTutorial = function () {
        var tutorialText = this.game.cache.getText(this.difficulty[Global.selectedDifficulty] +
            (4 - Global.firstTime[Global.selectedDifficulty])).split("\n");
        var levelText = [];
        for (var y = 0; y < tutorialText.length; y++) {
            if (tutorialText[y].trim().length == 0) {
                break;
            }
            levelText.push(tutorialText[y]);
        }
        this.colorMap = [];
        for (var x = 0; x < levelText[0].length; x++) {
            this.colorMap.push([]);
            for (var y = 0; y < levelText.length; y++) {
                var tile = null;
                if (parseInt(levelText[y].charAt(x)) == 2) {
                    tile = new GrayTileEntity(this.game, x * Global.TILE_SIZE, y * Global.TILE_SIZE);
                }
                else {
                    tile = new ColorTileEntity(this.game, x * Global.TILE_SIZE, y * Global.TILE_SIZE, Global.currentColor);
                    if (parseInt(levelText[y].charAt(x)) == 1) {
                        tile.flipColor();
                    }
                }
                this.colorMap[x].push(tile);
                this.game.add.existing(this.colorMap[x][y]);
            }
        }
    };
    GameplayState.prototype.generateLevel = function () {
        var lowWidth = 0;
        for (var i = Global.MIN_WIDTH[Global.selectedDifficulty]; i < Global.MAX_WIDTH[Global.selectedDifficulty]; i++) {
            if (this.game.rnd.realInRange(0, 1) < Global.getSizeDifficulty()) {
                lowWidth += 1;
            }
        }
        var lowHeight = 0;
        for (var i = Global.MIN_HEIGHT[Global.selectedDifficulty]; i < Global.MAX_HEIGHT[Global.selectedDifficulty]; i++) {
            if (this.game.rnd.realInRange(0, 1) < Global.getSizeDifficulty()) {
                lowHeight += 1;
            }
        }
        var mapWidth = Global.MIN_WIDTH[Global.selectedDifficulty] +
            this.game.rnd.integerInRange(0, lowWidth);
        var mapHeight = Global.MIN_HEIGHT[Global.selectedDifficulty] +
            this.game.rnd.integerInRange(0, lowHeight);
        this.colorMap = [];
        Global.currentColor = 1;
        if (Global.changeColor) {
            Global.currentColor = this.game.rnd.integerInRange(0, 1);
        }
        if (Global.firstTime[Global.selectedDifficulty] > 0) {
            mapWidth = 5;
            mapHeight = 5;
            Global.currentColor = 1;
        }
        var whiteProbability = 0.25 * Global.getWhiteDifficulty();
        for (var x = 0; x < mapWidth; x++) {
            this.colorMap.push([]);
            for (var y = 0; y < mapHeight; y++) {
                var tile = null;
                if (Global.whiteEnable && this.game.rnd.realInRange(0, 1) < whiteProbability) {
                    tile = new GrayTileEntity(this.game, x * Global.TILE_SIZE, y * Global.TILE_SIZE);
                    whiteProbability = 0;
                }
                else {
                    tile = new ColorTileEntity(this.game, x * Global.TILE_SIZE, y * Global.TILE_SIZE, Global.currentColor);
                    whiteProbability += 0.25 * Global.getWhiteDifficulty();
                }
                this.colorMap[x].push(tile);
                this.game.add.existing(this.colorMap[x][y]);
            }
        }
    };
    GameplayState.prototype.update = function () {
        _super.prototype.update.call(this);
        Global.playMusic(this.game);
        for (var x = 0; x < this.colorMap.length; x++) {
            for (var y = 0; y < this.colorMap[x].length; y++) {
                this.colorMap[x][y].highligh(false);
            }
        }
    };
    GameplayState.prototype.checkWin = function () {
        var firstColor = -1;
        for (var x = 0; x < this.colorMap.length; x++) {
            for (var y = 0; y < this.colorMap[x].length; y++) {
                if (this.colorMap[x][y].color == -1) {
                    continue;
                }
                if (firstColor == -1) {
                    firstColor = this.colorMap[x][y].color;
                }
                else if (firstColor != this.colorMap[x][y].color) {
                    return false;
                }
            }
        }
        return true;
    };
    return GameplayState;
}(Phaser.State));
var LoadingState = (function (_super) {
    __extends(LoadingState, _super);
    function LoadingState() {
        _super.call(this);
        this.notDone = true;
        this.difficulty = ["easy", "medium", "hard"];
    }
    LoadingState.prototype.preload = function () {
        var minDimension = Math.min(this.game.width, this.game.height);
        Global.TILE_SIZE = Math.floor(minDimension / (Global.MAX_WIDTH[2] + 2));
        Global.SMALL_TILE = Math.floor(0.25 * Global.TILE_SIZE);
        Global.SMALL_GAP_SIZE = Math.max(Math.floor(Global.TILE_SIZE / 48), 1);
        Global.GAP_SIZE = 2 * Global.SMALL_GAP_SIZE;
        Global.SMALL_FONT = Math.round(Math.max(Math.floor(Global.TILE_SIZE / 4), 20) / 10) * 10;
        Global.MEDIUM_FONT = 2 * Global.SMALL_FONT;
        Global.BIG_FONT = Global.MEDIUM_FONT + 10;
        GameTextures.generateLogo(new Phaser.Graphics(this.game, 0, 0));
        if (Global.browserTesting) {
            this.game.add.existing(new LoadingEntity(this.game, this.game.width / 2, this.game.height / 2));
        }
        GameTextures.generateTextures(new Phaser.Graphics(this.game, 0, 0));
        var index = this.game.rnd.integerInRange(0, 3);
        this.game.load.audio("Pickup", ["assets/SFX_PickUp.mp3"]);
        this.game.load.audio("Place", ["assets/SFX_Place.mp3"]);
        this.game.load.audio("Undo", ["assets/SFX_Undo.mp3"]);
        this.game.load.audio("Music" + ((index) % 4 + 1), ["assets/CSquare Mobile - Track " + ((index) % 4 + 1) + ".mp3"]);
        this.game.load.audio("Music" + ((index + 1) % 4 + 1), ["assets/CSquare Mobile - Track " + ((index + 1) % 4 + 1) + ".mp3"]);
        this.game.load.audio("Music" + ((index + 2) % 4 + 1), ["assets/CSquare Mobile - Track " + ((index + 2) % 4 + 1) + ".mp3"]);
        this.game.load.audio("Music" + ((index + 3) % 4 + 1), ["assets/CSquare Mobile - Track " + ((index + 3) % 4 + 1) + ".mp3"]);
        this.game.load.bitmapFont('visitor', 'assets/fonts/visitor.png', 'assets/fonts/visitor.fnt');
        for (var i = 0; i < this.difficulty.length; i++) {
            for (var j = 1; j <= 3; j++) {
                this.game.load.text(this.difficulty[i] + j, "assets/" + this.difficulty[i] + j + ".txt");
            }
        }
        this.notDone = false;
        Global.soundIndex = index;
        Global.soundManager = this.game.sound;
        Global.loadCookie(this.game);
    };
    LoadingState.prototype.checkSfxDecoded = function () {
        var allSound = true;
        if (!this.cache.isSoundDecoded("Pickup")) {
            allSound = false;
        }
        if (!this.cache.isSoundDecoded("Place")) {
            allSound = false;
        }
        if (!this.cache.isSoundDecoded("Undo")) {
            allSound = false;
        }
        if (!this.cache.isSoundDecoded("Music" + ((Global.soundIndex) % 4 + 1))) {
            allSound = false;
        }
        return allSound;
    };
    LoadingState.prototype.update = function () {
        _super.prototype.update.call(this);
        if (this.checkSfxDecoded() && !this.notDone) {
            if (!Global.browserTesting) {
                navigator.splashscreen.hide();
            }
            this.game.cache.getBitmapFont("visitor").base.scaleMode = PIXI.scaleModes.NEAREST;
            this.game.state.start("GameMenu", true, false);
        }
    };
    return LoadingState;
}(Phaser.State));
var SureState = (function (_super) {
    __extends(SureState, _super);
    function SureState() {
        _super.call(this);
    }
    SureState.prototype.create = function () {
        _super.prototype.create.call(this);
        this.add.existing(new SureEntity(this.game, this.game.width / 2, this.game.height / 2));
        var overlayer = new OverlayEntity(this.game, this.game.width / 2, this.game.width / 2, this.game.rnd.integerInRange(0, 1));
        this.add.existing(overlayer);
    };
    SureState.prototype.update = function () {
        _super.prototype.update.call(this);
        Global.playMusic(this.game);
    };
    return SureState;
}(Phaser.State));
var Global = (function () {
    function Global() {
    }
    Global.getWhiteDifficulty = function () {
        var difficulty = Math.min((Global.currentLevels[Global.selectedDifficulty] + 1) / 100, 0.5);
        return difficulty;
    };
    Global.getSizeDifficulty = function () {
        var difficulty = Math.min(Math.max(0, Math.floor((Global.currentLevels[Global.selectedDifficulty] -
            Global.skippedLevels[Global.selectedDifficulty]) / 2)) / 20, 0.75);
        return difficulty;
    };
    Global.getFlippingDifficulty = function () {
        var difficulty = Math.min(Math.max(0, Math.floor((Global.currentLevels[Global.selectedDifficulty] -
            Global.skippedLevels[Global.selectedDifficulty]) / 2)) / 30, 0.75);
        return difficulty;
    };
    Global.getDifferentDifficulty = function () {
        var difficulty = Math.min(Math.max(0, Math.floor((Global.currentLevels[Global.selectedDifficulty] -
            Global.skippedLevels[Global.selectedDifficulty]) / 2)) / 40, 0.75);
        return difficulty;
    };
    Global.interpretDifficulty = function () {
        switch (Global.selectedDifficulty) {
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
    };
    Global.playMusic = function (game) {
        if (!Global.musicEnabled) {
            return;
        }
        if (Global.soundPlayed == null || (!Global.soundPlayed.isPlaying && !Global.pause)) {
            if (!Global.gameOpening) {
                Global.soundIndex = (Global.soundIndex + game.rnd.integerInRange(1, 3)) % 4;
            }
            else {
                Global.gameOpening = false;
            }
            Global.soundPlayed = game.add.sound("Music" + (Global.soundIndex + 1), 0.75, false);
            Global.soundPlayed.play();
            Global.soundPlayed.isPlaying = true;
            Global.soundPlayed.volume = 0.75;
        }
    };
    Global.deleteCookie = function (game) {
        window.localStorage.setItem("levelSize", "0");
        window.localStorage.setItem("rotateEnable", "false");
        window.localStorage.setItem("whiteEnable", "false");
        window.localStorage.setItem("changeColor", "false");
        window.localStorage.setItem("selectedDifficulty", "0");
        window.localStorage.setItem("musicEnabled", "true");
        window.localStorage.setItem("sfxEnabled", "true");
        for (var i = 0; i < this.randomSeed.length; i++) {
            window.localStorage.setItem("randomSeed_" + i, "" + game.rnd.integer());
        }
        for (var i = 0; i < this.firstTime.length; i++) {
            window.localStorage.setItem("firstTime_" + i, "3");
        }
        for (var i = 0; i < this.currentLevels.length; i++) {
            window.localStorage.setItem("currentLevels_" + i, "0");
        }
        for (var i = 0; i < this.skippedLevels.length; i++) {
            window.localStorage.setItem("skippedLevels_" + i, "0");
        }
        Global.loadCookie(game);
    };
    Global.saveCookie = function (game) {
        window.localStorage.setItem("runBefore", "true");
        window.localStorage.setItem("levelSize", "" + Global.levelSize);
        window.localStorage.setItem("rotateEnable", "" + Global.rotateEnable);
        window.localStorage.setItem("whiteEnable", "" + Global.whiteEnable);
        window.localStorage.setItem("changeColor", "" + Global.changeColor);
        window.localStorage.setItem("selectedDifficulty", "" + Global.selectedDifficulty);
        window.localStorage.setItem("musicEnabled", "" + Global.musicEnabled);
        window.localStorage.setItem("sfxEnabled", "" + Global.sfxEnabled);
        for (var i = 0; i < this.randomSeed.length; i++) {
            window.localStorage.setItem("randomSeed_" + i, "" + Global.randomSeed[i]);
        }
        for (var i = 0; i < this.firstTime.length; i++) {
            window.localStorage.setItem("firstTime_" + i, "" + Global.firstTime[i]);
        }
        for (var i = 0; i < this.currentLevels.length; i++) {
            window.localStorage.setItem("currentLevels_" + i, "" + Global.currentLevels[i]);
        }
        for (var i = 0; i < this.skippedLevels.length; i++) {
            window.localStorage.setItem("skippedLevels_" + i, "" + Global.skippedLevels[i]);
        }
    };
    Global.loadCookie = function (game) {
        if (window.localStorage.getItem("runBefore") != "true") {
            return;
        }
        Global.levelSize = Number(window.localStorage.getItem("levelSize"));
        Global.rotateEnable = window.localStorage.getItem("rotateEnable") == "true";
        Global.whiteEnable = window.localStorage.getItem("whiteEnable") == "true";
        Global.changeColor = window.localStorage.getItem("changeColor") == "true";
        Global.selectedDifficulty = Number(window.localStorage.getItem("selectedDifficulty"));
        Global.musicEnabled = window.localStorage.getItem("musicEnabled") == "true";
        Global.sfxEnabled = window.localStorage.getItem("sfxEnabled") == "true";
        for (var i = 0; i < this.randomSeed.length; i++) {
            Global.randomSeed[i] = Number(window.localStorage.getItem("randomSeed_" + i));
        }
        for (var i = 0; i < this.firstTime.length; i++) {
            Global.firstTime[i] = Number(window.localStorage.getItem("firstTime_" + i));
        }
        for (var i = 0; i < this.currentLevels.length; i++) {
            Global.currentLevels[i] = Number(window.localStorage.getItem("currentLevels_" + i));
        }
        for (var i = 0; i < this.skippedLevels.length; i++) {
            Global.skippedLevels[i] = Number(window.localStorage.getItem("skippedLevels_" + i));
        }
    };
    Global.TILE_SIZE = 48;
    Global.SMALL_TILE = 12;
    Global.GAP_SIZE = 2;
    Global.SMALL_GAP_SIZE = 1;
    Global.BIG_FONT = 48;
    Global.MEDIUM_FONT = 24;
    Global.SMALL_FONT = 12;
    Global.COLORS = [0xff6666, 0x6666ff];
    Global.GREY = 0xcccccc;
    Global.MAX_WIDTH = [5, 7, 8];
    Global.MAX_HEIGHT = [5, 7, 8];
    Global.MIN_WIDTH = [4, 5, 5];
    Global.MIN_HEIGHT = [4, 5, 5];
    Global.MIN_PEICES = [3, 3, 3];
    Global.MAX_PEICES = [5, 7, 10];
    Global.MIN_DIFFERENT = [2, 3, 3];
    Global.MAX_DIFFERENT = [3, 4, 5];
    Global.firstTime = [3, 3, 3];
    Global.currentLevels = [0, 0, 0];
    Global.skippedLevels = [0, 0, 0];
    Global.gameOpening = true;
    Global.selectedDifficulty = 0;
    Global.levelSize = 0;
    Global.randomSeed = [0, 0, 0];
    Global.currentColor = 1;
    Global.whiteEnable = false;
    Global.rotateEnable = false;
    Global.changeColor = false;
    Global.musicEnabled = true;
    Global.sfxEnabled = true;
    Global.soundIndex = -1;
    Global.soundPlayed = null;
    Global.soundManager = null;
    Global.pause = false;
    Global.browserTesting = false;
    return Global;
}());
/// <reference path="Global.ts"/>
var GameTextures = (function () {
    function GameTextures() {
    }
    GameTextures.generateLogo = function (g) {
        g.beginFill(Global.COLORS[0], 1);
        g.drawRoundedRect(-Global.TILE_SIZE + Global.GAP_SIZE, -Global.TILE_SIZE + Global.GAP_SIZE, Global.TILE_SIZE - 2 * Global.GAP_SIZE, Global.TILE_SIZE - 2 * Global.GAP_SIZE, 2 * Global.GAP_SIZE);
        g.drawRoundedRect(Global.GAP_SIZE, Global.GAP_SIZE, Global.TILE_SIZE - 2 * Global.GAP_SIZE, Global.TILE_SIZE - 2 * Global.GAP_SIZE, 2 * Global.GAP_SIZE);
        g.endFill();
        g.beginFill(Global.COLORS[1], 1);
        g.drawRoundedRect(Global.GAP_SIZE, -Global.TILE_SIZE + Global.GAP_SIZE, Global.TILE_SIZE - 2 * Global.GAP_SIZE, Global.TILE_SIZE - 2 * Global.GAP_SIZE, 2 * Global.GAP_SIZE);
        g.drawRoundedRect(-Global.TILE_SIZE + Global.GAP_SIZE, Global.GAP_SIZE, Global.TILE_SIZE - 2 * Global.GAP_SIZE, Global.TILE_SIZE - 2 * Global.GAP_SIZE, 2 * Global.GAP_SIZE);
        g.endFill();
        GameTextures.logo = g.generateTexture();
        g.destroy();
    };
    GameTextures.generateSquaredButtons = function (g) {
        var percentage = 0.25;
        var shift = Global.GAP_SIZE;
        g.clear();
        g.lineStyle(Global.GAP_SIZE, Global.GREY, 1);
        g.drawRoundedRect(-Global.TILE_SIZE / 2 + Global.GAP_SIZE, -Global.TILE_SIZE / 2 + Global.GAP_SIZE, Global.TILE_SIZE - 2 * Global.GAP_SIZE, Global.TILE_SIZE - 2 * Global.GAP_SIZE, 2 * Global.GAP_SIZE);
        g.lineStyle(0);
        g.beginFill(Global.GREY);
        g.drawTriangle([new Phaser.Point(-Global.TILE_SIZE * percentage + shift, -Global.TILE_SIZE * percentage),
            new Phaser.Point(Global.TILE_SIZE * percentage + shift, 0),
            new Phaser.Point(-Global.TILE_SIZE * percentage + shift, Global.TILE_SIZE * percentage)], false);
        g.endFill();
        GameTextures.startButton = g.generateTexture();
        g.clear();
        g.clear();
        g.lineStyle(Global.GAP_SIZE, Global.GREY, 1);
        g.drawRoundedRect(-Global.TILE_SIZE / 2 + Global.GAP_SIZE, -Global.TILE_SIZE / 2 + Global.GAP_SIZE, Global.TILE_SIZE - 2 * Global.GAP_SIZE, Global.TILE_SIZE - 2 * Global.GAP_SIZE, 2 * Global.GAP_SIZE);
        g.lineStyle(Global.GAP_SIZE, Global.GREY, 1);
        g.moveTo(-Global.TILE_SIZE * percentage, -Global.TILE_SIZE * percentage);
        g.lineTo(Global.TILE_SIZE * percentage, Global.TILE_SIZE * percentage);
        g.moveTo(Global.TILE_SIZE * percentage, -Global.TILE_SIZE * percentage);
        g.lineTo(-Global.TILE_SIZE * percentage, Global.TILE_SIZE * percentage);
        GameTextures.deleteButton = g.generateTexture();
        g.clear();
    };
    GameTextures.generateArrows = function (g) {
        var percentage = 0.25;
        var shift = Global.GAP_SIZE;
        g.clear();
        g.lineStyle(Global.GAP_SIZE, Global.GREY, 1);
        g.drawTriangle([new Phaser.Point(-Global.TILE_SIZE * percentage + shift, -Global.TILE_SIZE * percentage),
            new Phaser.Point(Global.TILE_SIZE * percentage + shift, 0),
            new Phaser.Point(-Global.TILE_SIZE * percentage + shift, Global.TILE_SIZE * percentage)], false);
        GameTextures.arrows = [g.generateTexture()];
        g.clear();
        percentage = -0.25;
        shift = -Global.GAP_SIZE;
        g.clear();
        g.lineStyle(Global.GAP_SIZE, Global.GREY, 1);
        g.drawTriangle([new Phaser.Point(-Global.TILE_SIZE * percentage + shift, -Global.TILE_SIZE * percentage),
            new Phaser.Point(Global.TILE_SIZE * percentage + shift, 0),
            new Phaser.Point(-Global.TILE_SIZE * percentage + shift, Global.TILE_SIZE * percentage)], false);
        GameTextures.arrows.push(g.generateTexture());
        g.clear();
    };
    GameTextures.generateCredits = function (g) {
        g.clear();
        g.lineStyle(Global.GAP_SIZE, Global.GREY, 1);
        g.moveTo(-Global.TILE_SIZE / 4, -Global.TILE_SIZE / 4);
        g.lineTo(Global.TILE_SIZE / 4, -Global.TILE_SIZE / 4);
        g.moveTo(-Global.TILE_SIZE / 8, -Global.TILE_SIZE / 8);
        g.lineTo(Global.TILE_SIZE / 8, -Global.TILE_SIZE / 8);
        g.moveTo(-Global.TILE_SIZE / 4, 0);
        g.lineTo(Global.TILE_SIZE / 4, 0);
        g.moveTo(-Global.TILE_SIZE / 8, Global.TILE_SIZE / 8);
        g.lineTo(Global.TILE_SIZE / 8, Global.TILE_SIZE / 8);
        g.moveTo(-Global.TILE_SIZE / 4, Global.TILE_SIZE / 4);
        g.lineTo(Global.TILE_SIZE / 4, Global.TILE_SIZE / 4);
        GameTextures.credits = g.generateTexture();
        g.clear();
    };
    GameTextures.generateOverlayer = function (g) {
        g.clear();
        g.beginFill(Global.COLORS[0], 1);
        g.drawRect(-Global.TILE_SIZE / 2, -Global.TILE_SIZE / 2, Global.TILE_SIZE, Global.TILE_SIZE);
        g.endFill();
        GameTextures.overlayer = [g.generateTexture()];
        g.clear();
        g.beginFill(Global.COLORS[1], 1);
        g.drawRect(-Global.TILE_SIZE / 2, -Global.TILE_SIZE / 2, Global.TILE_SIZE, Global.TILE_SIZE);
        g.endFill();
        GameTextures.overlayer.push(g.generateTexture());
        g.clear();
    };
    GameTextures.generateXO = function (g) {
        var percentage = 0.25;
        g.clear();
        g.lineStyle(Global.GAP_SIZE, Global.GREY, 1);
        g.moveTo(-Global.TILE_SIZE * percentage, -Global.TILE_SIZE * percentage);
        g.lineTo(Global.TILE_SIZE * percentage, Global.TILE_SIZE * percentage);
        g.moveTo(Global.TILE_SIZE * percentage, -Global.TILE_SIZE * percentage);
        g.lineTo(-Global.TILE_SIZE * percentage, Global.TILE_SIZE * percentage);
        GameTextures.x = g.generateTexture();
        g.clear();
        g.lineStyle(Global.GAP_SIZE, Global.GREY, 1);
        g.moveTo(Global.TILE_SIZE * percentage, -Global.TILE_SIZE * percentage);
        g.lineTo(0, Global.TILE_SIZE * percentage);
        g.moveTo(0, Global.TILE_SIZE * percentage);
        g.lineTo(-Global.TILE_SIZE * percentage, 0);
        GameTextures.o = g.generateTexture();
        g.clear();
    };
    GameTextures.generateRotate = function (g) {
        var percentage = 0.3;
        g.clear();
        g.lineStyle(Global.GAP_SIZE, Global.GREY, 1);
        g.drawCircle(0, 0, 2 * Global.TILE_SIZE * percentage);
        var x = -Global.TILE_SIZE * percentage;
        var y = -Global.TILE_SIZE * percentage / 4;
        g.moveTo(x, y);
        g.lineTo(x - Global.TILE_SIZE * percentage / 3, y + Global.TILE_SIZE * percentage / 3);
        g.moveTo(x, y);
        g.lineTo(x + Global.TILE_SIZE * percentage / 3, y + Global.TILE_SIZE * percentage / 3);
        x = Global.TILE_SIZE * percentage;
        y = Global.TILE_SIZE * percentage / 4;
        g.moveTo(x, y);
        g.lineTo(x + Global.TILE_SIZE * percentage / 3, y - Global.TILE_SIZE * percentage / 3);
        g.moveTo(x, y);
        g.lineTo(x - Global.TILE_SIZE * percentage / 3, y - Global.TILE_SIZE * percentage / 3);
        GameTextures.rotate = g.generateTexture();
        g.clear();
    };
    GameTextures.generateSquares = function (g) {
        g.clear();
        g.beginFill(0xffffff, 1);
        g.drawRoundedRect(-Global.TILE_SIZE / 2 + Global.GAP_SIZE, -Global.TILE_SIZE / 2 + Global.GAP_SIZE, Global.TILE_SIZE - 2 * Global.GAP_SIZE, Global.TILE_SIZE - 2 * Global.GAP_SIZE, 2 * Global.GAP_SIZE);
        g.endFill();
        GameTextures.square = g.generateTexture();
        g.clear();
        g.lineStyle(Global.GAP_SIZE, 0xffffff, 1);
        g.drawRoundedRect(-Global.TILE_SIZE / 2 + Global.GAP_SIZE, -Global.TILE_SIZE / 2 + Global.GAP_SIZE, Global.TILE_SIZE - 2 * Global.GAP_SIZE, Global.TILE_SIZE - 2 * Global.GAP_SIZE, 2 * Global.GAP_SIZE);
        GameTextures.highlight = g.generateTexture();
        g.clear();
        g.beginFill(Global.GREY, 1);
        g.drawRoundedRect(-Global.SMALL_TILE / 2 + Global.SMALL_GAP_SIZE, -Global.SMALL_TILE / 2 + Global.SMALL_GAP_SIZE, Global.SMALL_TILE - 2 * Global.SMALL_GAP_SIZE, Global.SMALL_TILE - 2 * Global.SMALL_GAP_SIZE, 2 * Global.SMALL_GAP_SIZE);
        g.endFill();
        GameTextures.smallTile = g.generateTexture();
        g.clear();
    };
    GameTextures.generateScoring = function (g) {
        g.clear();
        g.lineStyle(Global.GAP_SIZE, Global.GREY, 1);
        var radius = Global.TILE_SIZE / 4;
        var x = -Global.TILE_SIZE / 8;
        var y = -Global.TILE_SIZE / 8;
        g.drawCircle(x, y, 2 * radius);
        g.drawCircle(-x, y - 0.25 * radius, 2 * 0.75 * radius);
        g.drawCircle(-x, y + 0.875 * radius, 2 * 0.75 * radius);
        g.drawCircle(x, y + 1.0625 * radius, 2 * 0.75 * radius / 2);
        GameTextures.gameCenter = g.generateTexture();
        g.clear();
        var percentage = 0.3;
        var shift = Global.GAP_SIZE;
        g.lineStyle(Global.GAP_SIZE, Global.GREY, 1);
        g.drawTriangle([new Phaser.Point(-Global.TILE_SIZE * percentage + shift, -Global.TILE_SIZE * percentage),
            new Phaser.Point(Global.TILE_SIZE * percentage + shift, 0),
            new Phaser.Point(-Global.TILE_SIZE * percentage + shift, Global.TILE_SIZE * percentage),
            new Phaser.Point(-Global.TILE_SIZE * percentage + shift, -Global.TILE_SIZE * percentage)], false);
        g.moveTo(-Global.TILE_SIZE * percentage + shift, -Global.TILE_SIZE * percentage);
        g.lineTo(Global.TILE_SIZE * percentage / 2, Global.TILE_SIZE * percentage / 4);
        g.moveTo(-Global.TILE_SIZE * percentage + shift, Global.TILE_SIZE * percentage);
        g.lineTo(Global.TILE_SIZE * percentage / 2, -Global.TILE_SIZE * percentage / 4);
        GameTextures.googlePlay = g.generateTexture();
        g.clear();
    };
    GameTextures.generateTextures = function (g) {
        GameTextures.generateSquaredButtons(g);
        GameTextures.generateArrows(g);
        GameTextures.generateOverlayer(g);
        GameTextures.generateXO(g);
        GameTextures.generateRotate(g);
        GameTextures.generateSquares(g);
        GameTextures.generateCredits(g);
        GameTextures.generateScoring(g);
        g.destroy();
    };
    return GameTextures;
}());
