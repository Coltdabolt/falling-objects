const gameContainer = document.getElementById("game-container");
const player = document.getElementById("player");
const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("high-score");
const gameOverScreen = document.getElementById("game-over");
const finalScore = document.getElementById("final-score");

let playerX = 175;
let playerSpeed = 25;
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let speed = 3;
let isGameOver = false;
let hasShield = false;
let obstacleIntervalTime = 1000;
let speedIncrease = 0.5;

// Choose difficulty
let difficulty = prompt("Choose difficulty: easy, medium, hard", "easy").toLowerCase();
switch (difficulty) {
  case "hard":
    speed = 5;
    obstacleIntervalTime = 500;
    speedIncrease = 0.7;
    break;
  case "medium":
    speed = 4;
    obstacleIntervalTime = 800;
    speedIncrease = 0.5;
    break;
  default:
    speed = 3;
    obstacleIntervalTime = 1200;
    speedIncrease = 0.3;
    break;
}

highScoreDisplay.innerText = `High Score: ${highScore}`;

// Player movement
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft" && playerX > 0) {
    playerX -= playerSpeed;
  } else if (event.key === "ArrowRight" && playerX < 350) {
    playerX += playerSpeed;
  }
  player.style.left = playerX + "px";
});

// Create obstacles
function createObstacle() {
  if (isGameOver) return;

  const obstacle = document.createElement("div");
  obstacle.classList.add("obstacle");
  obstacle.style.left = Math.random() * 360 + "px";
  obstacle.style.top = "0px";
  gameContainer.appendChild(obstacle);

  let fallInterval = setInterval(() => {
    let obstacleTop = parseInt(obstacle.style.top);
    obstacle.style.top = obstacleTop + speed + "px";

    if (obstacleTop > 460) {
      clearInterval(fallInterval);
      gameContainer.removeChild(obstacle);
      score++;
      scoreDisplay.innerText = `Score: ${score}`;

      // Increase falling speed over time
      speed += speedIncrease;
    }

    if (obstacleTop > 450 && Math.abs(parseInt(obstacle.style.left) - playerX) < 40) {
      if (hasShield) {
        hasShield = false;
        player.classList.remove("shield");
      } else {
        endGame();
      }
    }
  }, 30);
}

// Create power-ups
function createPowerUp() {
  if (isGameOver) return;

  const powerUp = document.createElement("div");
  powerUp.classList.add("power-up");
  powerUp.style.left = Math.random() * 360 + "px";
  powerUp.style.top = "0px";

  const typeRand = Math.random();
  if (typeRand < 0.33) {
    powerUp.style.background = "gold";
    powerUp.dataset.type = "shield";
  } else if (typeRand < 0.66) {
    powerUp.style.background = "blue";
    powerUp.dataset.type = "slow";
  } else {
    powerUp.style.background = "lime";
    powerUp.dataset.type = "speed";
  }

  gameContainer.appendChild(powerUp);

  let fallInterval = setInterval(() => {
    let powerUpTop = parseInt(powerUp.style.top);
    powerUp.style.top = powerUpTop + speed + "px";

    if (powerUpTop > 450 && Math.abs(parseInt(powerUp.style.left) - playerX) < 40) {
      clearInterval(fallInterval);
      gameContainer.removeChild(powerUp);
      activatePowerUp(powerUp.dataset.type);
    }

    if (powerUpTop > 500) {
      clearInterval(fallInterval);
      gameContainer.removeChild(powerUp);
    }
  }, 30);
}

// Activate power-ups
function activatePowerUp(type) {
  if (type === "shield") {
    hasShield = true;
    player.classList.add("shield");
    setTimeout(() => {
      hasShield = false;
      player.classList.remove("shield");
    }, 5000);
  } else if (type === "slow") {
    speed = Math.max(1, speed - 1);
    setTimeout(() => speed += 1, 5000);
  } else if (type === "speed") {
    playerSpeed += 10;
    setTimeout(() => playerSpeed -= 10, 5000);
  }
}

function startGame() {
  setInterval(createObstacle, obstacleIntervalTime);
  setInterval(createPowerUp, 3000);
}

function endGame() {
  isGameOver = true;
  finalScore.innerText = score;

  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
    highScoreDisplay.innerText = `High Score: ${highScore}`;
  }

  gameOverScreen.style.display = "block";
}

function restartGame() {
  location.reload();
}

startGame();
