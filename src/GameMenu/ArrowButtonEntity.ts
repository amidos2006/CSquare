class ArrowButtonEntity extends Phaser.Group{
    action:Function;
    
    constructor(game:Phaser.Game, x:number, y:number, direction:number, action:Function, closed:boolean = true){
        super(game);

        this.x = x;
        this.y = y;
        this.action = action;

        if(closed){
            let image:Phaser.Image = new Phaser.Image(this.game, 0, 0, GameTextures.startButton);
            image.anchor.set(0.5, 0.5);
            this.add(image);
        }
        else{
            if(direction == 1){
                let image:Phaser.Image = new Phaser.Image(this.game, 0, 0, GameTextures.arrows[0]);
                image.anchor.set(0.5, 0.5);
                this.add(image);
            }
            else{
                let image:Phaser.Image = new Phaser.Image(this.game, 0, 0, GameTextures.arrows[1]);
                image.anchor.set(0.5, 0.5);
                this.add(image);
            }
        }
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