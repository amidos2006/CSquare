class OverlayEntity extends Phaser.Image{
    constructor(game:Phaser.Game, x:number, y:number, index:number){
        super(game, 0, 0, GameTextures.overlayer[index]);
        this.scale.set(2 * this.game.width / Global.TILE_SIZE, 2 * this.game.height / Global.TILE_SIZE + 1);
        this.alpha = 1;
        this.fixedToCamera = true;
    }
    
    update(){
        super.update();

        this.alpha -= 0.04;
        if(this.alpha <= 0){
            this.kill();
        }
    }
}