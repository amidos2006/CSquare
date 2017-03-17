class XButtonEntity extends Phaser.Group{
    action:Function;
    
    constructor(game:Phaser.Game, x:number, y:number, action:Function, closed:boolean = false){
        super(game);

        this.x = x;
        this.y = y;
        this.action = action;

        let image:Phaser.Image = null;
        if(closed){
            image = new Phaser.Image(game, 0, 0, GameTextures.deleteButton);
        }
        else{
            image = new Phaser.Image(game, 0, 0, GameTextures.x);
        }
        image.anchor.set(0.5, 0.5);
        this.add(image);
    }

    update(){
        super.update();
        
        if(this.game.input.activePointer.x > this.worldPosition.x - Global.TILE_SIZE/2 && 
            this.game.input.activePointer.y > this.worldPosition.y - Global.TILE_SIZE/2 &&
            this.game.input.activePointer.x < this.worldPosition.x + Global.TILE_SIZE/2 &&
            this.game.input.activePointer.y < this.worldPosition.y + Global.TILE_SIZE/2 &&
            this.game.input.activePointer.isDown){
            this.action();
            this.game.input.activePointer.reset();
        }
        
    }
}