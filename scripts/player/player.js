import { SmallLaser, BigLaser } from "./laserTypes.js";

export default class Player {
  constructor(game) {
    this.game = game;
    this.spriteWidth = 140;
    this.spriteHeight = 120;
    this.width;
    this.height;
    this.speed;
    this.lives = 3;
    this.maxLives = 10;
    this.image = document.getElementById("ship");
    this.jets_image = document.getElementById("shipJets");
    this.frameX = 0;
    this.jetsFrame = 1;
    this.smallLaser = new SmallLaser(this.game);
    this.bigLaser = new BigLaser(this.game);
    this.energy = 50;
    this.maxEnergy = 100;
    this.cooldown = false;
    this.smallLaserButtonPressed = false;
    this.bigLaserButtonPressed = false;
    this.x;
    this.y;
    this.energyWidth;
  }
  draw(context) {
    this.game.fired ? (this.frameX = 1) : (this.frameX = 0);
    // Gamepad pad
    if (this.game.level !== 1) {
      if (this.smallLaserButtonPressed || this.bigLaserButtonPressed) {
        if (this.smallLaserButtonPressed) {
          this.game.audioHandler.startLaser("smallaser");
          this.smallLaser.render(context);
          this.frameX = 2;
        } else if (this.bigLaserButtonPressed) {
          this.game.audioHandler.startLaser("biglaser");
          this.bigLaser.render(context);
          this.frameX = 3;
        } else {
          this.game.audioHandler.stopLaser();
        }
      } else {
        // handle sprite frames by keyboard controls
        // if (this.game.input.keys.indexOf("1") > -1) {
        //   this.frameX = 1;
        // }
        if (this.game.input.keys.indexOf("2") > -1) {
          this.game.audioHandler.startLaser("smallaser");
          this.smallLaser.render(context);
        } else if (this.game.input.keys.indexOf("3") > -1) {
          this.game.audioHandler.startLaser("biglaser");
          this.bigLaser.render(context);
        } else {
          // this.frameX = 0;
          this.game.audioHandler.stopLaser();
        }
      }
    }

    context.drawImage(
      this.jets_image,
      this.jetsFrame * this.spriteWidth,
      0,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
    context.drawImage(
      this.image,
      this.frameX * this.spriteWidth,
      0,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
    // Player energyBar
    this.cooldown ? (context.fillStyle = "red") : (context.fillStyle = "blue");
    for (let i = 0; i < this.energy; i++) {
      context.fillRect(
        this.x + this.width * 0.5 - 2,
        this.y + this.height * 0.5 + this.energyWidth * i,
        5,
        this.energyWidth
      );
    }
  }
  handleJoystickInput(x) {
    this.x += x * this.speed;
  }

  update() {
    // energy
    if (this.energy < this.maxEnergy) this.energy += 0.05;
    if (this.energy < 1) this.cooldown = true;
    else if (this.energy > this.maxEnergy * 0.2) this.cooldown = false;
    // horizontal movement
    if (this.game.input.keys.indexOf("ArrowLeft") > -1) {
      this.x -= this.speed;
      this.jetsFrame = 0;
    } else if (this.game.input.keys.indexOf("ArrowRight") > -1) {
      this.x += this.speed;
      this.jetsFrame = 2;
    } else {
      this.jetsFrame = 1;
    }
    // horizontal boundaries
    if (this.x < -this.width * 0.5) this.x = -this.width * 0.5;
    else if (this.x > this.game.width - this.width * 0.5)
      this.x = this.game.width - this.width * 0.5;
  }
  shoot() {
    const projectile = this.game.getProjectile();
    if (projectile) projectile.start(this.x + this.width * 0.5, this.y);
  }
  restart() {
    this.x = this.game.width * 0.5 - this.width * 0.5;
    this.y = this.game.height - this.height;
    this.lives = 3;
  }
  resize() {
    this.width = this.spriteWidth * this.game.ratio;
    this.height = this.spriteHeight * this.game.ratio;
    this.x = this.game.width * 0.5 - this.width * 0.5;
    this.y = this.game.height - this.height;
    this.speed = 8 * this.game.ratio;
    this.energyWidth = 0.5 * this.game.ratio;
    this.smallLaser.resize();
    this.bigLaser.resize();
  }
}
