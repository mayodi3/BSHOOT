export default class Boss {
  constructor(game, bossLives) {
    this.game = game;
    this.width;
    this.height;
    this.spriteSize = 200;
    this.x;
    this.y;
    this.speedX = Math.random() < 0.5 ? -1 : 1;
    this.speedY = 0;
    this.lives = bossLives;
    this.maxLives = this.lives;
    this.markedForDeletion = false;
    this.image = document.getElementById("boss");
    this.frameX = 1;
    this.frameY = Math.floor(Math.random() * 4);
    this.maxFrame = 11;
    this.sound = document.getElementById("bossound");
    this.resize();
    this.font;
  }
  draw(context) {
    context.drawImage(
      this.image,
      this.frameX * this.spriteSize,
      this.frameY * this.spriteSize,
      this.spriteSize,
      this.spriteSize,
      this.x,
      this.y,
      this.width,
      this.height
    );
    if (this.lives >= 1) {
      context.save();
      context.textAlign = "center";
      context.shadowOffsetX = 3;
      context.shadowOffsetY = 3;
      context.shadowColor = "black";
      context.fillStyle = "white";
      context.font = this.font + "px Bangers";
      context.fillText(
        Math.floor(this.lives),
        this.x + this.width * 0.5,
        this.y + 50 * this.game.ratio
      );
      context.restore();
    }
  }
  update() {
    this.speedY = 0;
    if (this.game.spriteUpdate && this.lives >= 1) this.frameX = 0;
    if (this.y < 0) this.y += 4;

    if (this.y < 0) this.sound.play();

    if (
      this.x < 0 ||
      (this.x > this.game.width - this.width && this.lives >= 1)
    ) {
      this.speedX *= -1;
      this.speedY = this.height * 0.5;
    }
    this.x += this.speedX;
    this.y += this.speedY;
    // collision detection boss/projectiles
    this.game.projectilesPool.forEach((projectile) => {
      if (
        this.game.checkCollision(this, projectile) &&
        !projectile.free &&
        this.lives >= 1 &&
        this.y >= 0
      ) {
        this.hit(1);
        projectile.reset();
        if (this.lives % 10 === 0 && this.lives > 1) {
          this.game.audioHandler.playSound("bossScream");
          this.speedX *= 2;
        }
      }
    });

    // collision detection boss/player
    if (this.game.checkCollision(this, this.game.player) && this.lives >= 1) {
      this.game.gameOver = true;
      this.lives = 0;
    }
    // boss destroyed
    if (this.lives < 1 && this.game.spriteUpdate) {
      this.frameX++;
      if (this.frameX > this.maxFrame) {
        this.markedForDeletion = true;
        if (this.markedForDeletion)
          this.game.audioHandler.playSound("bossExplode");
        this.game.score += this.maxLives;
        this.game.bossLives += 5;
        if (!this.game.gameOver) this.game.newWave(this.game.level);
      }
    }
    // lose condition
    if (this.y + this.height > this.game.height) this.game.gameOver = true;
  }
  hit(damage) {
    this.lives -= damage;
    if (this.lives >= 1) this.frameX = 1;
  }
  resize() {
    this.width = this.spriteSize * this.game.ratio;
    this.height = this.spriteSize * this.game.ratio;
    this.x = this.game.width * 0.5 - this.width * 0.5;
    this.y = -this.height;
    this.font = 50 * this.game.ratio;
  }
}
