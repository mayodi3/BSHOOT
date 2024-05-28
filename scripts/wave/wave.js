import {
  Beetle,
  RhinoCrack,
  LobsterBurst,
  Locust,
  SquidWard,
  Phantom,
  EagleShoot,
} from "../enemies/enemyTypes.js";

export default class Wave {
  constructor(game, level) {
    this.game = game;
    this.speedX = Math.random() < 0.5 ? -1 : 1;
    this.speedY = 0;
    this.enemies = [];
    this.nextWaveTrigger = false;
    this.markedForDeletion = false;
    this.angle = 0;

    this.resize();
    // this.create(level);
    this.create(level);

    this.width;
    this.height;
    this.x;
    this.y;
    this.hasMovedDown = false;
  }
  isTouchingSide() {
    return this.x < 0 || this.x > this.game.width - this.width;
  }
  render(context, deltaTime) {
    if (this.y < 0) this.y += 5;
    this.speedY = 0;
    this.angle += 0.2;
    this.speedY += Math.cos(this.angle);

    if (this.game.level === 3) {
      if (this.game.sound.isDetected) {
        this.x += this.speedX * Math.sin(this.game.sound.data);
      } else {
        // this.speedX = 0;
      }
    }

    if (this.isTouchingSide()) {
      this.speedX *= -1;
      this.speedY = this.game.enemySize;
    }

    this.x += this.speedX;
    this.y += this.speedY;
    this.enemies.forEach((enemy) => {
      enemy.update(this.x, this.y, deltaTime);
      enemy.draw(context);
    });
    this.enemies = this.enemies.filter((object) => !object.markedForDeletion);
    if (this.enemies.length <= 0) this.markedForDeletion = true;
  }
  create(level) {
    for (let y = 0; y < this.game.rows; y++) {
      for (let x = 0; x < this.game.columns; x++) {
        let enemyX = x * this.game.enemySize * this.game.ratio;
        let enemyY = y * this.game.enemySize * this.game.ratio;

        switch (level) {
          case 1:
            this.enemies.push(new Beetle(this.game, enemyX, enemyY));
            break;
          case 2:
            this.enemies.push(new RhinoCrack(this.game, enemyX, enemyY));
            break;
          case 3:
            this.enemies.push(new LobsterBurst(this.game, enemyX, enemyY));
            break;
          case 4:
            this.enemies.push(new Phantom(this.game, enemyX, enemyY));
            break;
          case 5:
            this.enemies.push(new Locust(this.game, enemyX, enemyY));
            break;
          case 6:
            this.enemies.push(new SquidWard(this.game, enemyX, enemyY));
            break;
          case 7:
            this.enemies.push(new EagleShoot(this.game, enemyX, enemyY));
            break;
        }
      }
    }
  }
  resize() {
    this.enemies.forEach((enemy) => {
      enemy.resize();
    });
    this.width = this.game.columns * this.game.enemySize;
    this.height = this.game.rows * this.game.enemySize;
    this.x = this.game.width * 0.5 - this.width * 0.5;
    this.y = -this.height;
  }
}
