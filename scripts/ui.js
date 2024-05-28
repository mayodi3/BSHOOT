export default class UI {
  constructor(game) {
    this.game = game;
    this.lostplay = false;
    this.font;
    this.lifeWidth;
    this.lifeHeight;
    this.resize();
    this.image = document.getElementById("gameOver");
    this.width;
    this.height;
    this.played = false;
  }
  drawStatusText(context) {
    context.save();
    context.shadowOffsetX = 2;
    context.shadowOffsetY = 2;
    context.shadowColor = "black";
    context.fillStyle = "white";
    context.font = this.font + "px Bangers";
    context.fillText("Score: " + this.game.score, 20, 45);
    context.fillText(
      "Wave: " + this.game.waveCount,
      this.game.width * 0.45,
      45
    );
    for (let i = 0; i < this.game.player.maxLives; i++) {
      context.strokeRect(
        this.game.width * 0.42 + this.lifeWidth * 2 * i,
        70,
        this.lifeWidth,
        this.lifeHeight
      );
    }
    for (let i = 0; i < this.game.player.lives; i++) {
      context.fillRect(
        this.game.width * 0.42 + this.lifeWidth * 2 * i,
        70,
        this.lifeWidth,
        this.lifeHeight
      );
    }
    if (this.game.gameOver) {
      context.textAlign = "center";
      context.font = 80 + "px Bangers";
      if (this.game.score > 100 && this.game.gameOver) {
        if (!this.played) {
          this.played = true;
          this.game.win.play();
        }
      } else if (this.game.gameOver) {
        if (!this.played) {
          this.played = true;
          this.game.loseSound.play();
        }
      }
      context.drawImage(
        this.image,
        this.game.width * 0.5 - this.width * 0.5,
        this.game.height * 0.5 - this.height * 0.5,
        this.width,
        this.height
      );
    }
    context.restore();
  }
  resize() {
    this.font = 50 * this.game.ratio;
    this.game.context.font = 20 + "px Bangers";
    this.game.context.fillStyle = "white";
    this.lifeWidth = 10 * this.game.ratio;
    this.lifeHeight = 15 * this.game.ratio;
    this.width = 441 * this.game.ratio;
    this.height = 294 * this.game.ratio;
  }
}
