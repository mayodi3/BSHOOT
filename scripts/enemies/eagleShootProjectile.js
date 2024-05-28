export default class EagleShootProjectile {
  constructor(game) {
    this.game = game;
    this.spriteWidth = 50;
    this.spriteHeight = 35;
    this.width;
    this.height;
    this.x = 0;
    this.y = 0;
    this.speed;
    this.free = true;
    this.image = document.getElementById("eagleshootprojectile");
    this.frameX = Math.floor(Math.random() * 4);
    this.frameY = Math.floor(Math.random() * 2);
    this.lives = 5;
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
  update() {
    if (!this.free) {
      this.y += this.speed;
      if (this.y > this.game.height) this.reset();
      // check collision enemy projectile / player
      if (this.game.checkCollision(this, this.game.player)) {
        this.reset();
        this.game.player.lives--;
        if (this.game.player.lives < 1) {
          this.game.gameOver;
        }
      }
      // check collision enemy projectile / player projectile
      this.game.projectilesPool.forEach((projectile) => {
        if (this.game.checkCollision(this, projectile) && !projectile.free) {
          projectile.reset();
          this.hit(1);
          if (this.lives < 1) this.reset();
        }
      });
    }
  }
  start(x, y) {
    this.x = x - this.width * 0.5;
    this.y = y;
    this.free = false;
    this.frameX = Math.floor(Math.random() * 4);
    this.frameY = Math.floor(Math.random() * 2);
    this.lives = 5;
    this.speed = Math.random() * 3 + 2;
  }
  reset() {
    this.free = true;
  }
  hit(damage) {
    this.lives -= damage;
    this.speed *= 0.6;
  }
  resize() {
    this.width = this.spriteWidth * this.game.ratio;
    this.height = this.spriteHeight * this.game.ratio;
    this.speed = (Math.random() * 3 + 2) * this.game.ratio;
  }
}
