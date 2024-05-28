import Enemy from "./enemy.js";

// Level 1
export class Beetle extends Enemy {
  constructor(game, positionX, positionY) {
    super(game, positionX, positionY);
    this.image = document.getElementById("beetle");
    this.frameX = 0;
    this.maxFrame = 2;
    this.frameY = Math.floor(Math.random() * 4);
    this.lives = 1;
    this.maxLives = this.lives;
  }
  update(x, y) {
    super.update(x, y);
    if (this.markedForDeletion) this.game.audioHandler.playSound("beetle");
    this.game.waves.forEach((wave) => {
      wave.speedY += Math.cos((wave.angle += 0.01));
    });
  }
}

// Level 2
export class RhinoCrack extends Enemy {
  constructor(game, positionX, positionY) {
    super(game, positionX, positionY);
    this.image = document.getElementById("rhinocrack");
    this.frameX = 0;
    this.maxFrame = 5;
    this.frameY = Math.floor(Math.random() * 4);
    this.lives = 1;
    this.maxLives = this.lives;
  }
  hit(damage) {
    this.lives -= damage;
    this.frameX = this.maxLives - Math.floor(this.lives);
  }
  update(x, y) {
    super.update(x, y);
    if (this.markedForDeletion) this.game.audioHandler.playSound("rhinocrack");
    this.game.waves.forEach((wave) => {
      wave.speedX += Math.sin(0.01);
    });
  }
}

// Level 3
export class LobsterBurst extends Enemy {
  constructor(game, positionX, positionY) {
    super(game, positionX, positionY);
    this.image = document.getElementById("lobsterburst");
    this.frameX = 0;
    this.maxFrame = 14;
    this.frameY = Math.floor(Math.random() * 4);
    this.lives = 1;
    this.maxLives = this.lives;
  }
  hit(damage) {
    this.lives -= damage;
    this.frameX = this.maxLives - Math.floor(this.lives);
  }
  update(x, y) {
    super.update(x, y);
    if (this.markedForDeletion) this.game.audioHandler.playSound("beetle");
    this.game.waves.forEach((wave) => {
      wave.speedY += Math.cos((wave.angle += 0.01));
    });
  }
}

// Level 4
export class Phantom extends Enemy {
  constructor(game, positionX, positionY) {
    super(game, positionX, positionY);
    this.image = document.getElementById("phantom");
    this.frameX = 0;
    this.maxFrame = 12;
    this.frameY = Math.floor(Math.random() * 4);
    this.lives = 5;
    this.maxLives = this.lives;
    this.maxFlyingFrame;
    this.maxPhasingFrame;
    this.states = [
      new StaticState(this),
      new FlyingState(this),
      new ExplosionState(this),
    ];
    this.currentState = this.states[1];

    this.switchTimer = 0;
    this.switchInterval = Math.random() * 2000 + 1000;
  }
  update(x, y, deltaTime) {
    super.update(x, y, deltaTime);
    if (this.markedForDeletion) this.game.audioHandler.playSound("phantom");
    this.currentState.updateState(deltaTime);
  }
  setState(state) {
    this.currentState = this.states[state];
    this.currentState.startState();
  }
  hit(damage) {
    this.lives -= damage;
  }
}
class StaticState {
  constructor(phantom) {
    this.phantom = phantom;
    this.speedAttack = false;
  }
  startState() {
    this.phantom.frameX = 3;
    this.phantom.maxPhasingFrame = 5;
  }
  updateState(deltaTime) {
    // Frames handled
    if (this.phantom.game.spriteUpdate) {
      if (this.phantom.frameX < this.phantom.maxPhasingFrame)
        this.phantom.frameX++;
      else this.phantom.frameX = 3;
    }
    this.phantom.toggleSwitch(1, deltaTime);
  }
}
class FlyingState {
  constructor(phantom) {
    this.phantom = phantom;
  }
  startState() {
    this.phantom.frameX = 0;
    this.phantom.maxFlyingFrame = 2;
  }
  updateState(deltaTime) {
    // const data = Math.floor(this.game.data.getData()) * 0.01; // For switching enemies
    if (this.phantom.game.spriteUpdate) {
      if (this.phantom.frameX < this.phantom.maxFlyingFrame)
        this.phantom.frameX++;
      else this.phantom.frameX = 0;
    }
    if (this.phantom.lives < 1) this.phantom.setState(2);
    this.phantom.toggleSwitch(0, deltaTime);
  }
}
class ExplosionState {
  constructor(phantom) {
    this.phantom = phantom;
  }
  startState() {
    this.phantom.frameX = 6;
  }
  updateState() {
    if (this.phantom.game.spriteUpdate) this.phantom.frameX++;
    if (this.phantom.frameX > this.phantom.maxFrame) {
      this.phantom.markedForDeletion = true;
      if (!this.phantom.game.gameOver)
        this.phantom.game.score += this.phantom.maxLives;
    }
  }
}

// Level 5
export class Locust extends Enemy {
  constructor(game, positionX, positionY) {
    super(game, positionX, positionY);
    this.image = document.getElementById("locust");
    this.frameX = 0;
    this.maxFrame = 38;
    this.frameY = 0;
    this.lives = 5;
    this.maxLives = this.lives;
    this.game.enemySize = 90;
    this.states = [new LocustStaticState(this), new LocustSpeedState(this)];
    this.currentState = this.states[0];
    this.currentState.startState();

    this.switchTimer = 0;
    this.switchInterval = 3000;
  }
  hit(damage) {
    this.lives -= damage;
    this.frameX = this.maxLives - Math.floor(this.lives);
  }
  setState(state) {
    this.currentState = this.states[state];
    this.currentState.startState();
  }
  update(x, y, deltaTime) {
    super.update(x, y, deltaTime);
    this.currentState.updateState(deltaTime);
    if (this.frameX < this.maxFrame) this.frameX++;
    else this.frameX = 0;
    if (this.lives < 1) {
      this.markedForDeletion = true;
      if (!this.game.gameOver) this.game.score += this.maxLives;
    }
    if (this.markedForDeletion) {
      this.game.audioHandler.playSound("locust");
      const explosion = this.game.getFreeExplosion();
      if (explosion)
        explosion.start(x + this.width * 0.5, y + this.height * 0.5);
    }
  }
}
class LocustStaticState {
  constructor(locust) {
    this.locust = locust;
  }
  startState() {
    this.locust.frameY = 0;
  }
  updateState(deltaTime) {
    this.locust.toggleSwitch(1, deltaTime);
  }
}
class LocustSpeedState {
  constructor(locust) {
    this.locust = locust;
  }
  startState() {
    this.locust.frameY = 1;
    this.locust.game.audioHandler.playSound("locustslide");
    this.locust.game.waves.forEach((wave) => {
      wave.speedX *= 1.2;
    });
  }
  updateState(deltaTime) {
    this.locust.toggleSwitch(0, deltaTime);
  }
}

// Level 6
export class SquidWard extends Enemy {
  constructor(game, positionX, positionY) {
    super(game, positionX, positionY);
    this.image = document.getElementById("squidward");
    this.frameX = 0;
    this.maxFrame = 17;
    this.frameY = Math.floor(Math.random() * 4);
    this.lives = 3;
    this.maxLives = this.lives;
    this.states = [new TentacleState(this), new SquidExplodeState(this)];
    this.currentState = this.states[0];
    this.currentState.startState();
  }
  setState(state) {
    this.currentState = this.states[state];
    this.currentState.startState();
  }
  hit(damage) {
    this.lives -= damage;
    this.frameX = this.maxLives - Math.floor(this.lives);
  }
  update(x, y, deltaTime) {
    super.update(x, y, deltaTime);
    this.currentState.updateState();
    this.game.waves.forEach((wave) => {
      wave.speedY += Math.sin(wave.angle * 20);
      wave.speedX += Math.sin(wave.angle * 20);
    });
    if (this.markedForDeletion) this.game.audioHandler.playSound("tentacles");
  }
}
class TentacleState {
  constructor(squid) {
    this.squid = squid;
  }
  startState() {
    this.squid.frameX = 0;
    this.squid.maxFrame = 4;
  }
  updateState() {
    if (this.squid.game.spriteUpdate) {
      if (this.squid.frameX < this.squid.maxFrame) this.squid.frameX++;
      else this.squid.frameX = 0;
    }
    if (this.squid.lives < 1) this.squid.setState(1);
  }
}
class SquidExplodeState {
  constructor(squid) {
    this.squid = squid;
  }
  startState() {
    this.squid.frameX = 9;
    this.squid.maxFrame = 17;
  }
  updateState() {
    if (this.squid.game.spriteUpdate) this.squid.frameX++;
    if (this.squid.frameX > this.squid.maxFrame) {
      this.squid.markedForDeletion = true;
      if (!this.squid.game.gameOver)
        this.squid.game.score += this.squid.maxLives;
    }
  }
}

// Level 7
export class EagleShoot extends Enemy {
  constructor(game, positionX, positionY) {
    super(game, positionX, positionY);
    this.image = document.getElementById("eagleshoot");
    this.frameX = 0;
    this.maxFrame = 8;
    this.frameY = Math.floor(Math.random() * 4);
    this.lives = 4;
    this.maxLives = this.lives;
    this.shots = 0;
  }
  hit(damage) {
    if (this.shots < 4) this.shoot();
    this.lives -= damage;
    this.frameX = this.maxLives - Math.floor(this.lives);
    this.y += 3;
  }
  shoot() {
    const projectile = this.game.getEnemyProjectile();
    if (projectile) {
      projectile.start(this.x + this.width * 0.5, this.y + this.height * 0.5);
      this.game.audioHandler.playSound("eagleScream");
      this.shots++;
    }
  }
  update(x, y, deltaTime) {
    super.update(x, y, deltaTime);
    if (this.markedForDeletion) this.game.audioHandler.playSound("eagle");
  }
}
