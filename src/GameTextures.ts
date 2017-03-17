/// <reference path="Global.ts"/>

class GameTextures {
    static square: PIXI.Texture;
    static highlight: PIXI.Texture;
    static overlayer: PIXI.Texture[];
    static smallTile: PIXI.Texture;

    static logo:PIXI.Texture;
    static startButton:PIXI.Texture;
    static deleteButton:PIXI.Texture;
    static arrows: PIXI.Texture[];
    static x:PIXI.Texture;
    static o:PIXI.Texture;
    static rotate: PIXI.Texture;
    static credits:PIXI.Texture;
    static gameCenter:PIXI.Texture;
    static googlePlay:PIXI.Texture;

    static generateLogo(g: Phaser.Graphics): void {
        g.beginFill(Global.COLORS[0], 1);
        g.drawRoundedRect(-Global.TILE_SIZE + Global.GAP_SIZE, -Global.TILE_SIZE + Global.GAP_SIZE,
            Global.TILE_SIZE - 2 * Global.GAP_SIZE, Global.TILE_SIZE - 2 * Global.GAP_SIZE, 2 * Global.GAP_SIZE);
        g.drawRoundedRect(Global.GAP_SIZE, Global.GAP_SIZE,
            Global.TILE_SIZE - 2 * Global.GAP_SIZE, Global.TILE_SIZE - 2 * Global.GAP_SIZE, 2 * Global.GAP_SIZE);
        g.endFill();
        g.beginFill(Global.COLORS[1], 1);
        g.drawRoundedRect(Global.GAP_SIZE, -Global.TILE_SIZE + Global.GAP_SIZE,
            Global.TILE_SIZE - 2 * Global.GAP_SIZE, Global.TILE_SIZE - 2 * Global.GAP_SIZE, 2 * Global.GAP_SIZE);
        g.drawRoundedRect(-Global.TILE_SIZE + Global.GAP_SIZE, Global.GAP_SIZE,
            Global.TILE_SIZE - 2 * Global.GAP_SIZE, Global.TILE_SIZE - 2 * Global.GAP_SIZE, 2 * Global.GAP_SIZE);
        g.endFill();
        GameTextures.logo = g.generateTexture();

        g.destroy();
    }

    private static generateSquaredButtons(g: Phaser.Graphics): void {
        let percentage: number = 0.25;
        let shift: number = Global.GAP_SIZE;

        g.clear();

        g.lineStyle(Global.GAP_SIZE, Global.GREY, 1);
        g.drawRoundedRect(-Global.TILE_SIZE / 2 + Global.GAP_SIZE,
            -Global.TILE_SIZE / 2 + Global.GAP_SIZE, Global.TILE_SIZE - 2 * Global.GAP_SIZE,
            Global.TILE_SIZE - 2 * Global.GAP_SIZE, 2 * Global.GAP_SIZE);
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
        g.drawRoundedRect(-Global.TILE_SIZE / 2 + Global.GAP_SIZE,
            -Global.TILE_SIZE / 2 + Global.GAP_SIZE, Global.TILE_SIZE - 2 * Global.GAP_SIZE,
            Global.TILE_SIZE - 2 * Global.GAP_SIZE, 2 * Global.GAP_SIZE);
        g.lineStyle(Global.GAP_SIZE, Global.GREY, 1);
        g.moveTo(-Global.TILE_SIZE * percentage, -Global.TILE_SIZE * percentage);
        g.lineTo(Global.TILE_SIZE * percentage, Global.TILE_SIZE * percentage);

        g.moveTo(Global.TILE_SIZE * percentage, -Global.TILE_SIZE * percentage);
        g.lineTo(-Global.TILE_SIZE * percentage, Global.TILE_SIZE * percentage);
        GameTextures.deleteButton = g.generateTexture();

        g.clear();
    }

    private static generateArrows(g: Phaser.Graphics): void {
        let percentage: number = 0.25;
        let shift: number = Global.GAP_SIZE;

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
    }

    private static generateCredits(g: Phaser.Graphics): void {
        g.clear();

        g.lineStyle(Global.GAP_SIZE, Global.GREY, 1);
        
        g.moveTo(-Global.TILE_SIZE/4, -Global.TILE_SIZE/4);
        g.lineTo(Global.TILE_SIZE/4, -Global.TILE_SIZE/4);

        g.moveTo(-Global.TILE_SIZE/8, -Global.TILE_SIZE/8);
        g.lineTo(Global.TILE_SIZE/8, -Global.TILE_SIZE/8);

        g.moveTo(-Global.TILE_SIZE/4, 0);
        g.lineTo(Global.TILE_SIZE/4, 0);

        g.moveTo(-Global.TILE_SIZE/8, Global.TILE_SIZE/8);
        g.lineTo(Global.TILE_SIZE/8, Global.TILE_SIZE/8);

        g.moveTo(-Global.TILE_SIZE/4, Global.TILE_SIZE/4);
        g.lineTo(Global.TILE_SIZE/4, Global.TILE_SIZE/4);

        GameTextures.credits = g.generateTexture();

        g.clear();
    }

    private static generateOverlayer(g: Phaser.Graphics): void {
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
    }

    private static generateXO(g: Phaser.Graphics): void {
        let percentage: number = 0.25;

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
    }

    private static generateRotate(g: Phaser.Graphics): void {
        let percentage: number = 0.3;

        g.clear();

        g.lineStyle(Global.GAP_SIZE, Global.GREY, 1);
        g.drawCircle(0, 0, 2 * Global.TILE_SIZE * percentage);
        
        let x:number = -Global.TILE_SIZE * percentage;
        let y:number = -Global.TILE_SIZE * percentage/4;

        g.moveTo(x, y);
        g.lineTo(x - Global.TILE_SIZE * percentage / 3, y + Global.TILE_SIZE * percentage / 3);

        g.moveTo(x, y);
        g.lineTo(x + Global.TILE_SIZE * percentage / 3, y + Global.TILE_SIZE * percentage / 3);

        x = Global.TILE_SIZE * percentage;
        y = Global.TILE_SIZE * percentage/4;

        g.moveTo(x, y);
        g.lineTo(x + Global.TILE_SIZE * percentage / 3, y - Global.TILE_SIZE * percentage / 3);

        g.moveTo(x, y);
        g.lineTo(x - Global.TILE_SIZE * percentage / 3, y - Global.TILE_SIZE * percentage / 3);

        GameTextures.rotate = g.generateTexture();

        g.clear();
    }

    private static generateSquares(g: Phaser.Graphics): void {
        g.clear();

        g.beginFill(0xffffff, 1);
        g.drawRoundedRect(-Global.TILE_SIZE / 2 + Global.GAP_SIZE, -Global.TILE_SIZE / 2 + Global.GAP_SIZE,
            Global.TILE_SIZE - 2 * Global.GAP_SIZE, Global.TILE_SIZE - 2 * Global.GAP_SIZE, 2 * Global.GAP_SIZE);
        g.endFill();
        GameTextures.square = g.generateTexture();
        
        g.clear();

        g.lineStyle(Global.GAP_SIZE, 0xffffff, 1);
        g.drawRoundedRect(-Global.TILE_SIZE / 2 + Global.GAP_SIZE, -Global.TILE_SIZE / 2 + Global.GAP_SIZE,
            Global.TILE_SIZE - 2 * Global.GAP_SIZE, Global.TILE_SIZE - 2 * Global.GAP_SIZE, 2 * Global.GAP_SIZE);
        GameTextures.highlight = g.generateTexture();

        g.clear();

        g.beginFill(Global.GREY, 1);
        g.drawRoundedRect(-Global.SMALL_TILE / 2 + Global.SMALL_GAP_SIZE, -Global.SMALL_TILE / 2 + Global.SMALL_GAP_SIZE,
            Global.SMALL_TILE - 2 * Global.SMALL_GAP_SIZE, Global.SMALL_TILE - 2 * Global.SMALL_GAP_SIZE, 
            2 * Global.SMALL_GAP_SIZE);
        g.endFill();
        GameTextures.smallTile = g.generateTexture();

        g.clear();
    }

    static generateScoring(g:Phaser.Graphics):void{
        g.clear();

        g.lineStyle(Global.GAP_SIZE, Global.GREY, 1);
        let radius:number = Global.TILE_SIZE/4;
        let x:number = -Global.TILE_SIZE/8;
        let y:number = -Global.TILE_SIZE/8;
        g.drawCircle(x, y, 2 * radius);
        g.drawCircle(-x, y - 0.25 * radius, 2 * 0.75 * radius);
        g.drawCircle(-x, y + 0.875 * radius, 2 *  0.75 * radius);
        g.drawCircle(x, y + 1.0625 * radius, 2 *  0.75 * radius/2);
        GameTextures.gameCenter = g.generateTexture();

        g.clear();

        let percentage: number = 0.3;
        let shift: number = Global.GAP_SIZE;

        g.lineStyle(Global.GAP_SIZE, Global.GREY, 1);
        g.drawTriangle([new Phaser.Point(-Global.TILE_SIZE * percentage + shift, -Global.TILE_SIZE * percentage),
            new Phaser.Point(Global.TILE_SIZE * percentage + shift, 0),
            new Phaser.Point(-Global.TILE_SIZE * percentage + shift, Global.TILE_SIZE * percentage),
            new Phaser.Point(-Global.TILE_SIZE * percentage + shift, -Global.TILE_SIZE * percentage)], false);

        g.moveTo(-Global.TILE_SIZE * percentage + shift, -Global.TILE_SIZE * percentage);
        g.lineTo(Global.TILE_SIZE * percentage/2, Global.TILE_SIZE * percentage/4);
        g.moveTo(-Global.TILE_SIZE * percentage + shift, Global.TILE_SIZE * percentage);
        g.lineTo(Global.TILE_SIZE * percentage/2, -Global.TILE_SIZE * percentage/4);
        GameTextures.googlePlay = g.generateTexture();

        g.clear();
    }

    static generateTextures(g:Phaser.Graphics): void {
        GameTextures.generateSquaredButtons(g);
        GameTextures.generateArrows(g);
        GameTextures.generateOverlayer(g);
        GameTextures.generateXO(g);
        GameTextures.generateRotate(g);
        GameTextures.generateSquares(g);
        GameTextures.generateCredits(g);
        GameTextures.generateScoring(g);

        g.destroy();
    }
}