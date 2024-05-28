import Game from "./scripts/game.js";

window.addEventListener("load", () => {
  // Constants
  const BLOCK = "block";
  const NONE = "none";
  const GRID = "grid";
  // Loading screen ended
  loading.style.display = NONE;
  // Canvas setup
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "white";
  ctx.strokeStyle = "white";
  ctx.font = "30px Impact";
  resizeCanvas();
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resizeCanvas);
  // Other declarations
  const game = new Game(ctx, canvas);
  let gamePaused = false;

  function handlePage1() {
    firstPage.addEventListener("click", (event) => {
      if (event.target.id === "play") {
        click.play();
        firstPage.style.display = NONE;
        largeContainer.style.display = BLOCK;
      }
    });
  }

  function handlePage2() {
    levelButton.addEventListener("click", () => {
      click.play();
      document.querySelector(".level-buttons").style.display = GRID;
      largeContainer.style.display = NONE;
      gameLogo.style.display = NONE;
    });
  }
  function handlePage3() {
    document.querySelectorAll(".level-buttons img").forEach((img, index) => {
      img.addEventListener("click", () => startGame(index + 1));
    });

    const audio = new Audio("assets/sounds/background.mp3");
    // window.addEventListener("click", () => audio.play());
    audio.play();
    audio.loop = true;
    function startGame(level) {
      click.play();
      document.querySelector(".level-buttons").style.display = NONE;
      canvas.style.display = NONE;
      document.querySelector(".controls").style.display = NONE;
      counter.style.display = BLOCK;
      audio.pause();
      audioCounter.play();
      setTimeout(() => {
        // PAGE 4
        game.gameStarted = true;
        game.newGame.play();
        counter.style.display = NONE;
        canvas.style.display = BLOCK;
        document.querySelector(".controls").style.display = BLOCK;
        audioCounter.pause();
        game.level = level;
        game.restart();
        animate(0);
      }, 5000);
      window.addEventListener("keydown", (e) => {
        if (e.key === "p") {
          click.play();
          gamePaused = !gamePaused;
          if (!gamePaused) requestAnimationFrame(animate);
        }
      });
    }
  }

  pause.addEventListener("click", () => {
    click.play();
    pause.style.display = NONE;
    menubuttons.style.display = BLOCK;
    exitMain.style.display = BLOCK;
    playbutton.style.display = BLOCK;
    gamePaused = true;
    if (!gamePaused) requestAnimationFrame(animate);
  });
  playbutton.addEventListener("click", () => {
    click.play();
    playbutton.style.display = NONE;
    menubuttons.style.display = NONE;
    exitMain.style.display = NONE;
    pause.style.display = BLOCK;
    gamePaused = false;
    if (!gamePaused) requestAnimationFrame(animate);
  });

  // PAGE 1
  handlePage1();
  // PAGE 2
  handlePage2();
  // PAGE 3
  handlePage3();

  menubuttons.addEventListener("click", () => window.location.reload());
  exitMain.addEventListener("click", () => {
    window.location.href = "notification.html";
    window.open("", "_self", "");
    window.close();
  });
  exitLevel.addEventListener("click", () => {
    window.location.href = "notification.html";
    window.open("", "_self", "");
    window.close();
  });

  // Animation Loop
  let lastTime = 0;
  function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.render(ctx, deltaTime);
    !gamePaused && requestAnimationFrame(animate);
  }
});
