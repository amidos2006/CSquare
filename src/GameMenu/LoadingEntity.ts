class LoadingEntity extends Phaser.Group{
    rotationSpeed:number;
    logo:Phaser.Image;
    text:Phaser.Text;
    
    constructor(game:Phaser.Game, x:number, y:number){
        super(game);
        
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
    
    update(){
        // this.logo.angle -= this.rotationSpeed;
        // if(this.logo.angle < 0){
        //     this.logo.angle += 360;
        // }
    }
}