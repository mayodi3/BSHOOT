export default class InputHandler {
  constructor(game) {
    this.game = game;
    this.keys = [];
    this.connectionMessage = "";
    this.controllerIndex = null;
    this.shot = false;

    // laser controls
    smallaserBtn.addEventListener("touchstart", () => {
      if (this.keys.indexOf("2") === -1) {
        this.keys.push("2");
      }
    });
    smallaserBtn.addEventListener("touchend", () => {
      this.keys.splice(this.keys.indexOf("2"), 1);
    });
    biglaserBtn.addEventListener("touchstart", () => {
      if (this.keys.indexOf("3") === -1) {
        this.keys.push("3");
      }
    });
    biglaserBtn.addEventListener("touchend", () => {
      this.keys.splice(this.keys.indexOf("3"), 1);
    });

    // Player shooting touch controls
    window.addEventListener("touchstart", (e) => {
      if (!this.game.fired) {
        this.game.player.frameX = 1;
        this.game.gameStarted && this.game.audioHandler.playSound("shoot", 3);
        this.game.fired = true;
        this.game.gameStarted && this.game.player.shoot();
      }
      if (e.targetTouches[0].clientX > this.game.width * 0.8)
        this.keys.push("ArrowRight");
      else if (e.targetTouches[0].clientX < this.game.width * 0.2)
        this.keys.push("ArrowLeft");
    });
    window.addEventListener("touchend", () => {
      this.game.fired = false;
      this.game.player.frameX = 0;
      if (this.keys.indexOf("ArrowRight") > -1)
        this.keys.splice(this.keys.indexOf("ArrowRight"), 1);
      if (this.keys.indexOf("ArrowLeft") > -1)
        this.keys.splice(this.keys.indexOf("ArrowLeft"), 1);
    });

    // Keyboard controls
    window.addEventListener("keydown", (e) => {
      const index = this.keys.indexOf(e.key);
      if (index === -1) this.keys.push(e.key);
      if (this.keys.includes("1") && !this.game.fired) {
        this.game.player.frameX = 1;
        this.game.fired = true;
        this.game.audioHandler.playSound("shoot", 3);
        this.game.player.shoot();
      } else this.game.player.frameX = 0;
      if (this.keys.includes("r") && this.game.gameOver) this.game.restart();
      if (this.keys.includes("f")) this.game.toggleFullScreen();
    });
    window.addEventListener("keyup", (e) => {
      const index = this.keys.indexOf(e.key);

      this.keys.splice(index, 1);
      this.game.fired = false;
    });
    window.addEventListener("gamepadconnected", (e) => {
      this.connectionMessage = "CONTROLLER CONNECTED";
      this.controllerIndex = e.gamepad.index;
      console.log(this.connectionMessage);
    });
    window.addEventListener("gamepaddisconnected", (e) => {
      this.connectionMessage = "CONTROLLER DISCONNECTED";
      this.controllerIndex = null;
      console.log(this.connectionMessage);
    });
  }

  updateGamePad() {
    let gamePad = navigator.getGamepads()[this.controllerIndex];

    if (gamePad) {
      const buttons = gamePad.buttons;
      const leftPressed = buttons[14].pressed;
      const rightPressed = buttons[15].pressed;
      const shootPressed = buttons[0].pressed;
      const smallLaserPressed = buttons[5].pressed;
      const bigLaserPressed = buttons[4].pressed;
      // Joystick control
      const axes = gamePad.axes;
      const leftJoystickX = axes[0];
      this.game.player.handleJoystickInput(leftJoystickX);

      for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].pressed) console.log(i);
      }

      // Handle left movement
      if (leftPressed) {
        if (this.keys.indexOf("ArrowLeft") === -1) this.keys.push("ArrowLeft");
      } else {
        const leftIndex = this.keys.indexOf("ArrowLeft");
        if (leftIndex > -1) this.keys.splice(leftIndex, 1);
      }

      // Handle right movement
      if (rightPressed) {
        if (this.keys.indexOf("ArrowRight") === -1)
          this.keys.push("ArrowRight");
      } else {
        const rightIndex = this.keys.indexOf("ArrowRight");
        if (rightIndex > -1) this.keys.splice(rightIndex, 1);
      }

      // Handle shooting
      if (shootPressed && !this.game.fired) {
        this.game.audioHandler.playSound("shoot", 3);
        this.game.player.shoot();
        this.game.fired = true;
      } else if (!shootPressed) {
        this.game.fired = false;
      }

      if (smallLaserPressed) this.game.player.smallLaserButtonPressed = true;
      else this.game.player.smallLaserButtonPressed = false;

      if (bigLaserPressed) this.game.player.bigLaserButtonPressed = true;
      else this.game.player.bigLaserButtonPressed = false;
    }
  }
}
