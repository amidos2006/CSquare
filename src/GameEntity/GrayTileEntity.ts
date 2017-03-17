class GrayTileEntity extends ColorTileEntity{
    constructor(game:Phaser.Game, x:number, y:number){
        super(game,x,y,-1);
    }
    update(){
        this.mainTile.tint = 0xcccccc;
        this.highlightTile.tint = 0xcccccc;
    }
    flipColor(){
        
    }
}