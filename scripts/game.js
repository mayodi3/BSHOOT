import Player from "./player/player.js";
import Projectile from "./player/projectile.js";
import EagleShootProjectile from "./enemies/eagleShootProjectile.js";
import Wave from "./wave/wave.js";
import InputHandler from "./inputHandler.js";
import UI from "./ui.js";
import AudioData from "./audio/audioData.js";
import Boss from "./boss/boss.js";
import AudioHandler from "./audio/audioHandler.js";
import BEAT from "./audio/audioData.js";
import Explosion from "./particle.js";

export default class Game {
  constructor(canvas, context) {
    this.context = context;
    this.canvas = canvas;
    this.width = this.canvas.width;
    this.height = this.canvas.height;

    this.gameStarted = false;

    this.audioHandler = new AudioHandler();
    this.input = new InputHandler(this);
    this.player = new Player(this);
    this.data = new AudioData();
    this.ui = new UI(this);

    this.loadSounds();

    this.projectilesPool = [];
    this.numberOfProjectiles = 15;
    this.createProjectiles();
    this.fired = false;

    this.columns = 1;
    this.rows = 1;
    this.enemySize = 80;

    this.waves = [];
    this.waveCount = 1;
    this.enemyProjectilesPool = [];
    this.numberOfEnemyProjectiles = 15;
    this.createEnemyProjectiles();

    this.spriteUpdate = false;
    this.spriteTimer = 0;
    this.spriteInterval = 150;

    this.score = 0;
    this.gameOver = false;

    this.bossArray = [];
    this.bossLives = 10;
    this.restart();

    this.level = 1;

    this.newGame = document.getElementById("newGame");
    this.loseSound = document.getElementById("lose");
    this.win = document.getElementById("win");

    if (this.width > 504) {
      this.ratio = (this.width / this.height) * 0.5;
    } else this.ratio = this.width / this.height;
    this.resize(window.innerWidth, window.innerHeight);

    window.addEventListener("resize", (e) => {
      this.resize(e.currentTarget.innerWidth, e.currentTarget.innerHeight);
    });
    if (this.width < 600) this.toggleFullScreen();
    this.sound = new BEAT();

    this.explosionsPool = [];
    this.numberOfExplosions = 10;
    this.createExplosions();
  }
  resize(width, height) {
    this.restart();
    this.canvas.width = width;
    this.canvas.height = height;
    this.width = this.canvas.width;
    this.height = this.canvas.height;

    if (this.width > 504) {
      this.ratio = (this.width / this.height) * 0.5;
    } else this.ratio = this.width / this.height;
    this.ui.resize();
    this.player.resize();
    this.waves.forEach((wave) => {
      wave.resize();
    });
    this.bossArray.forEach((boss) => {
      boss.resize();
    });
    this.enemyProjectilesPool.forEach((enemyProjectile) => {
      enemyProjectile.resize();
    });
    this.projectilesPool.forEach((projectile) => {
      projectile.resize();
    });
  }
  loadSounds() {
    this.audioHandler.loadSound("shoot", "assets/sounds/shoot.wav");
    this.audioHandler.loadSound("smallaser", "assets/sounds/smallaser.mp3");
    this.audioHandler.loadSound("biglaser", "assets/sounds/biglaser.wav");
    // Enemies sounds
    this.audioHandler.loadSound("beetle", "assets/sounds/beetle.wav");
    this.audioHandler.loadSound("locust", "assets/sounds/locust.mp3");
    this.audioHandler.loadSound("tentacles", "assets/sounds/tentacles.mp3");
    this.audioHandler.loadSound("rhinocrack", "assets/sounds/rhinocrack.wav");
    this.audioHandler.loadSound("phantom", "assets/sounds/phantom.mp3");
    this.audioHandler.loadSound("locustslide", "assets/sounds/locustslide.mp3");
    this.audioHandler.loadSound(
      "lobsterburst",
      "assets/sounds/lobsterburst.mp3"
    );
    this.audioHandler.loadSound("bossScream", "assets/sounds/bossScream.mp3");
    this.audioHandler.loadSound("bossExplode", "assets/sounds/bossExplode.mp3");
    this.audioHandler.loadSound("eagleScream", "assets/sounds/eagleScream.mp3");
    this.audioHandler.loadSound("eagle", "assets/sounds/eagle.mp3");
  }
  handleSpriteTimer(deltaTime) {
    if (this.spriteTimer < this.spriteInterval) {
      this.spriteTimer += deltaTime;
      this.spriteUpdate = false;
    } else {
      this.spriteTimer = 0;
      this.spriteUpdate = true;
    }
  }
  toggleFullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
  render(context, deltaTime) {
    this.handleSpriteTimer(deltaTime);
    // Using the gamepad API
    this.input.updateGamePad();
    // sprite timing
    if (this.spriteTimer > this.spriteInterval) {
      this.spriteUpdate = true;
      this.spriteTimer = 0;
    } else {
      this.spriteUpdate = false;
      this.spriteTimer += deltaTime;
    }

    this.ui.drawStatusText(context);
    this.projectilesPool.forEach((projectile) => {
      projectile.update();
      projectile.draw(context);
    });
    this.enemyProjectilesPool.forEach((projectile) => {
      projectile.update();
      projectile.draw(context);
    });
    this.player.draw(context);
    this.player.update();
    this.bossArray.forEach((boss) => {
      boss.draw(context);
      boss.update();
    });
    this.bossArray = this.bossArray.filter(
      (object) => !object.markedForDeletion
    );
    this.waves.forEach((wave) => {
      wave.render(context, deltaTime);
      if (wave.enemies.length < 1 && !wave.nextWaveTrigger && !this.gameOver) {
        this.newWave(this.level);
        wave.nextWaveTrigger = true;
      }
    });
    this.explosionsPool.forEach((explosion) => {
      explosion.update();
      explosion.draw(context);
    });
  }
  // create explosion pool
  createExplosions() {
    for (let i = 0; i < this.numberOfExplosions; i++) {
      this.explosionsPool.push(new Explosion(this));
    }
  }
  getFreeExplosion() {
    for (let i = 0; i < this.numberOfExplosions; i++) {
      if (this.explosionsPool[i].free) return this.explosionsPool[i];
    }
  }
  // create projectiles object pool
  createProjectiles() {
    for (let i = 0; i < this.numberOfProjectiles; i++) {
      this.projectilesPool.push(new Projectile(this));
    }
  }
  // get free projectile object from the pool
  getProjectile() {
    for (let i = 0; i < this.projectilesPool.length; i++) {
      if (this.projectilesPool[i].free) return this.projectilesPool[i];
    }
  }
  // create enemy projectiles object pool
  createEnemyProjectiles() {
    for (let i = 0; i < this.numberOfEnemyProjectiles; i++) {
      this.enemyProjectilesPool.push(new EagleShootProjectile(this));
    }
  }
  // get free enemy projectile object from the pool
  getEnemyProjectile() {
    for (let i = 0; i < this.enemyProjectilesPool.length; i++) {
      if (this.enemyProjectilesPool[i].free)
        return this.enemyProjectilesPool[i];
    }
  }
  // collision detection between 2 rectangles
  checkCollision(a, b) {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  newWave(level) {
    this.waveCount++;
    if (this.player.lives < this.player.maxLives) this.player.lives++;
    if (this.waveCount % 3 === 0) {
      this.bossArray.push(new Boss(this, this.bossLives));
    } else {
      if (
        Math.random() < 0.5 &&
        this.columns * this.enemySize < this.width * 0.8
      ) {
        this.columns++;
      } else if (this.rows * this.enemySize < this.height * 0.6) {
        this.rows++;
      }
      this.waves.push(new Wave(this, level));
    }
    this.waves = this.waves.filter((object) => !object.markedForDeletion);
  }
  restart() {
    this.player.restart();
    this.columns = 1;
    this.rows = 1;
    this.waves = [];
    this.bossArray = [];
    this.bossLives = 10;
    this.waves.push(new Wave(this));
    this.waveCount = 1;
    this.score = 0;
    this.gameOver = false;
  }
}
