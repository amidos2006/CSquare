class FlippingEntity extends Phaser.Group{
    points:Phaser.Point[];
    images:Phaser.Image[];
    text:Phaser.BitmapText;
    times:number;
    baseX:number;
    baseY:number;
    angleIndex:number;
    compareType:number;
    
    constructor(game:Phaser.Game, points:Phaser.Point[]){
        super(game);
        
        this.points = points;
        this.angleIndex = 0;
        this.times = 1;
        this.compareType = -1;
        var style = {font: Global.SMALL_FONT + "px pixelFont", fill: "#cccccc", align: "center" };
        this.text = this.game.add.bitmapText(0, 0, "visitor", this.times.toString(), Global.SMALL_FONT, this);
        this.text.tint = Global.GREY;
        this.text.smoothed = false;
        
        this.images = [];
        for(var i:number=0;i<points.length;i++){
            var temp:Phaser.Image = new Phaser.Image(this.game, points[i].x * Global.SMALL_TILE, 
                points[i].y * Global.SMALL_TILE, GameTextures.smallTile);
            temp.anchor.set(0.5, 0.5);
            this.add(temp);
            this.images.push(temp);
        }
        this.fixedToCamera = true;
    }
    
    update(){
        for(var i:number=0;i<this.points.length;i++){
            var temp:Phaser.Image = this.images[i];
            temp.x = this.baseX + this.points[i].x * Global.SMALL_TILE;
            temp.y = this.baseY + this.points[i].y * Global.SMALL_TILE;
        }
        this.text.text = this.times.toString();
        this.text.x = this.baseX + 2 * Global.SMALL_TILE;
        this.text.y = this.baseY + 2 * Global.SMALL_TILE;
        if(this.times > 0){
            this.alpha = 1;
        }
        else{
            this.alpha = 0.25;
        }
    }

    checkOnMap(point:Phaser.Point, mapSize:Phaser.Point):boolean{
        for(var i:number=0; i<this.points.length; i++){
            if(point.x + this.points[i].x < 0 || point.x + this.points[i].x >= mapSize.x ||
                point.y + this.points[i].y < 0 || point.y + this.points[i].y >= mapSize.y){
                return false;
            }
        }

        return true;
    }
    
    modifyPoint(point:Phaser.Point, tileSize:Phaser.Point){
        var result:Phaser.Point = new Phaser.Point(point.x, point.y);
        
        var minPoint:Phaser.Point = new Phaser.Point();
        var maxPoint:Phaser.Point = new Phaser.Point();
        for(var i:number=0; i<this.points.length; i++){
            if(minPoint.x >= this.points[i].x){
                minPoint.x = this.points[i].x;
            }
            if(minPoint.y >= this.points[i].y){
                minPoint.y = this.points[i].y;
            }
            if(maxPoint.x <= this.points[i].x){
                maxPoint.x = this.points[i].x;
            }
            if(maxPoint.y <= this.points[i].y){
                maxPoint.y = this.points[i].y;
            }
        }
        
        var modifiedPoint:Phaser.Point = new Phaser.Point(point.x, point.y).add(minPoint.x, minPoint.y);
        if(modifiedPoint.x < 0){
            result.x = modifiedPoint.x * -1;
        }
        if(modifiedPoint.y < 0){
            result.y = modifiedPoint.y * -1;
        }
        
        modifiedPoint = new Phaser.Point(point.x, point.y).add(maxPoint.x, maxPoint.y);
        if(modifiedPoint.x >= tileSize.x){
            result.x = tileSize.x - maxPoint.x - 1;
        }
        if(modifiedPoint.y >= tileSize.y){
            result.y = tileSize.y - maxPoint.y - 1;
        }
        
        return result;
    }
    
    rotate(antiClock:boolean){
        var angle:number = 90;
        if(antiClock){
            angle *= -1;
        }
        for(var i:number=0; i<this.points.length; i++){
            this.points[i] = this.points[i].rotate(0,0, angle, true);
            this.points[i].x = Math.round(this.points[i].x);
            this.points[i].y = Math.round(this.points[i].y);
        }
        
        if(antiClock){
            this.angleIndex = (this.angleIndex + 1) % 4;
        }
    }
}