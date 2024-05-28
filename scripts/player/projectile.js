export default class Projectile {
  constructor(game) {
    this.game = game;
    this.x = 0;
    this.y = 0;
    this.speed;
    this.free = true;
    this.width;
    this.height;
  }
  draw(context) {
    if (!this.free) {
      context.save();
      context.fillStyle = "dodgerBlue";
      context.fillRect(this.x, this.y, this.width, this.height);
      context.restore();
    }
  }
  update() {
    if (!this.free) {
      this.y -= this.speed;
      if (this.y < -this.height) this.reset();
    }
  }
  start(x, y) {
    this.x = x - this.width * 0.5;
    this.y = y;
    this.free = false;
  }
  reset() {
    this.free = true;
  }
  resize() {
    this.width = 3 * this.game.ratio;
    this.height = 40 * this.game.ratio;
    this.speed = 20 * this.game.ratio;
  }
}
