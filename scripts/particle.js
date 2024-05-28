export default class Explosion {
  constructor(game) {
    this.image = document.getElementById("explosions");
    this.game = game;
    this.spriteWidth = 89.476;
    this.spriteHeight = 90;
    this.frameX = 0;
    this.frameY = 0;
    this.maxFrames = 20;
    this.free = true;
    this.x;
    this.y;
    this.width;
    this.height;
    this.resize();
  }
  update() {
    if (!this.free) {
      if (this.frameX < this.maxFrames) this.frameX++;
      else this.reset();
    }
  }
  draw(context) {
    if (!this.free) {
      context.drawImage(
        this.image,
        this.frameX * this.spriteWidth,
        this.frameY * this.spriteHeight,
        this.spriteWidth,
        this.spriteHeight,
        this.x,
        this.y,
        this.width,
        this.height
      );
    }
  }
  start(x, y) {
    this.x = x;
    this.y = y;
    this.frameX = 0;
    this.free = false;
  }
  reset() {
    this.free = true;
  }
  resize() {
    this.width = this.spriteWidth * this.game.ratio;
    this.height = this.spriteHeight * this.game.ratio;
  }
}
