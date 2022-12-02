class Platform extends PIXI.Graphics {
    constructor(width, height, color = 0xa0a0a0, x = 0, y = 0) {
      super();
      this.beginFill(color);
      this.drawRect(0, 0, width, height);
      this.endFill();
      this.x = x;
      this.y = y;
    }
}   

class Coin extends PIXI.Graphics {
  constructor(radius, color = 0xFFBF00, x = 0, y = 0) {
    super();
    this.beginFill(color);
    this.drawCircle(0, 0, radius);
    this.endFill();
    this.x = x;
    this.y = y;
    this.radius = radius;
    
    this.isCollected = false;
  }
}