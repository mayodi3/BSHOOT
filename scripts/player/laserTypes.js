import Laser from "./laser.js";

export class SmallLaser extends Laser {
  constructor(game) {
    super(game);
    this.width;
    this.damage = 0.3;
  }
  render(context) {
    if (this.game.player.energy > 1 && !this.game.player.cooldown) {
      super.render(context);
      this.game.player.frameX = 2;
    }
  }
  resize() {
    super.resize();
    this.width = 5 * this.game.ratio;
  }
}

export class BigLaser extends Laser {
  constructor(game) {
    super(game);
    this.width;
    this.damage = 0.7;
  }
  render(context) {
    if (this.game.player.energy > 1 && !this.game.player.cooldown) {
      super.render(context);
      this.game.player.frameX = 3;
    }
  }
  resize() {
    super.resize();
    this.width = 25 * this.game.ratio;
  }
}
