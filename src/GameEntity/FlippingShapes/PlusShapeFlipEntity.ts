class PlusShapeFlipEntity extends FlippingEntity{
    constructor(game:Phaser.Game){
        super(game, [new Phaser.Point(0,-1),
            new Phaser.Point(-1,0), new Phaser.Point(0, 0), new Phaser.Point(1, 0),
            new Phaser.Point(0, 1)]);
        this.compareType = 1;
    }
}