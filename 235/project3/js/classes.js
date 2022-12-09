class Player extends PIXI.Sprite {
  constructor(x = 0, y = 0) {
    super(app.loader.resources["imgs/PlayerBox.png"].texture);
    this.scale.set(2);
    this.x = x;
    this.y = y;
  }
}

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

class Coin extends PIXI.Sprite {
  constructor(x = 0, y = 0) {
    super(app.loader.resources["imgs/coin.png"].texture);
    this.x = x;
    this.y = y;
    this.scale.set(1.5);

    this.isCollected = false;
  }
}

class Timer extends PIXI.Graphics {
  constructor(width, height, color = 0xa0a0a0, x = 0, y = 0) {
    super();
    this.beginFill(color);
    this.drawRect(0, 0, width, height);
    this.endFill();
    this.x = x;
    this.y = y;
    this.color = color;
  }
}
