class ColorTileEntity extends Phaser.Group{
    color:number;
    mainTile:Phaser.Image;
    highlightTile:Phaser.Image;
    
    constructor(game:Phaser.Game, x:number, y:number, color:number){
        super(game);
        this.color = color;
        
        this.mainTile = new Phaser.Image(this.game, x, y, GameTextures.square);
        this.mainTile.anchor.set(0.5, 0.5);
        this.add(this.mainTile);

        this.highlightTile = new Phaser.Image(this.game, x, y, GameTextures.highlight);
        this.highlightTile.anchor.set(0.5, 0.5);
        this.add(this.highlightTile);
        this.highlightTile.alpha = 0;
    }
    
    update(){
        super.update();

        this.mainTile.tint = Global.COLORS[this.color];
        this.highlightTile.tint = 0xcccccc;
    }
    
    flipColor(){
        this.color = Global.COLORS.length - this.color - 1;
    }
    
    highligh(enable:boolean){
        if(enable){
            this.highlightTile.alpha = 1;
        }
        else{
            this.highlightTile.alpha = 0;
        }
    }
}