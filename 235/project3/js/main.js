"use strict";

const highscoreDisplay = document.querySelector("#score");

const app = new PIXI.Application({
  width: 600,
  height: 600,
});
document.body.appendChild(app.view);

const prefix = "cks2693-";
const highscoreKey = prefix + "highscore";

let highscore = 0;

const savedScore = localStorage.getItem(highscoreKey);

if (savedScore) {
  highscore = savedScore;
}

app.loader.add(["imgs/PlayerBox.png", "imgs/coin.png"]);

let score;
let time;
let coinsToSpawn;
let paused = true;

let horiSpeed = 0;
let vertSpeed = 0;

const vertSpeedIncrement = 5;
const horiSpeedIncrement = 350;
const gravity = .1;

const width = app.view.width;
const height = app.view.height;

let keysArray = {};
let coins = [];

let startScene;
let gameScene;
let gameOverScoreLabel;
let gameOverScene;
let stage;
let playerBox;

let jumpSound;
let coinSound;

app.loader.onComplete.add(setup);
app.loader.load();

let scoreStyle = new PIXI.TextStyle({
  fill: 0xffffff,
  fontSize: 18,
  fontFamily: "Press Start 2P",
});

let scoreText = new PIXI.Text();
scoreText.style = scoreStyle;
scoreText.x = 5;
scoreText.y = 20;


let timer = new Timer(500, 10, 0xffffff, 5, 5);

highscoreDisplay.innerHTML = `HIGH SCORE: ${highscore}`;

function setup() {
  stage = app.stage;

  startScene = new PIXI.Container();
  stage.addChild(startScene);

  gameScene = new PIXI.Container();
  gameScene.visible = false;
  stage.addChild(gameScene);

  gameOverScene = new PIXI.Container();
  gameOverScene.visible = false;
  stage.addChild(gameOverScene);

  playerBox = new Player();
  gameScene.addChild(playerBox);

  for (let platform of platforms) {
    gameScene.addChild(platform);
  }

  gameScene.addChild(timer);

  gameScene.addChild(scoreText);

  jumpSound = new Howl({
    src: ["sounds/jump.wav"],
  });

  coinSound = new Howl({
    src: ["sounds/coin.wav"], // sounds are from mixkit
  });

  createLabelsAndButtons();

  app.ticker.add(gameLoop);
}

function startGame() {
  startScene.visible = false;
  gameOverScene.visible = false;
  gameScene.visible = true;
  paused = false;
  score = 0;
  time = 10.0;
  playerBox.x = 275;
  playerBox.y = 550;
  coinsToSpawn = 20;
  spawnCoins();
  cleanUpCoins();
}

function end() {
  paused = true;
  // clear out level
  coins.forEach((coin) => gameScene.removeChild(coin));
  coins = [];

  gameOverScene.visible = true;
  gameScene.visible = false;

  gameOverScoreLabel.text = `Your final score: ${score}`;
}

function createLabelsAndButtons() {
  let buttonStyle = new PIXI.TextStyle({
    fill: 0x3498db,
    fontSize: 48,
    fontFamily: "Press Start 2P",
  });

  let textStyle = new PIXI.TextStyle({
    fill: 0xffffff,
    fontSize: 18,
    fontFamily: "Press Start 2P",
    strokeThickness: 4,
  });

  let startLabel = new PIXI.Text("Bonus Level");
  startLabel.style = new PIXI.TextStyle({
    fill: 0xffffff,
    fontSize: 48,
    fontFamily: "Press Start 2P",
    strokeThickness: 6,
  });
  startLabel.x = 40;
  startLabel.y = 250;
  startScene.addChild(startLabel);

  // 1C - make start game button
  let startButton = new PIXI.Text("Collect Those Coins");
  startButton.style = buttonStyle;
  startButton.style.fontSize = 24;
  startButton.x = 75;
  startButton.y = 350;
  startButton.interactive = true;
  startButton.buttonMode = true;
  startButton.on("pointerup", startGame);
  startButton.on("pointerover", (e) => (e.target.alpha = 0.7));
  startButton.on("pointerout", (e) => (e.currentTarget.alpha = 1.0));
  startScene.addChild(startButton);

  let endLabel = new PIXI.Text("Out of Time");
  endLabel.style = new PIXI.TextStyle({
    fill: 0xffffff,
    fontSize: 48,
    fontFamily: "Press Start 2P",
    strokeThickness: 6,
  });
  endLabel.x = 40;
  endLabel.y = 200;
  gameOverScene.addChild(endLabel);

  // 3B - make "play again?" button
  let playAgainButton = new PIXI.Text("Play Again?");
  playAgainButton.style = buttonStyle;
  playAgainButton.x = 160;
  playAgainButton.y = 400;
  playAgainButton.interactive = true;
  playAgainButton.buttonMode = true;
  playAgainButton.on("pointerup", startGame); // startGame is a function reference
  playAgainButton.on("pointerover", (e) => (e.target.alpha = 0.7)); // concise arrow function with no brackets
  playAgainButton.on("pointerout", (e) => (e.currentTarget.alpha = 1.0)); // ditto
  gameOverScene.addChild(playAgainButton);

  gameOverScoreLabel = new PIXI.Text();
  gameOverScoreLabel.style = textStyle;
  gameOverScoreLabel.x = width / 4 - 25;
  gameOverScoreLabel.y = 275;
  gameOverScene.addChild(gameOverScoreLabel);
}

// set a key's value to true in the keysArray when pressed down
let onKeyDown = (e) => {
  keysArray[e.keyCode] = true;
};

// set a key's value to false in the keysArray when pressed up
let onKeyUp = (e) => {
  keysArray[e.keyCode] = false;
};

// handles the player's keyboard inputs and their actions
let input = (dt) => {
  // W Key is 87
  // Up arrow is 38
  if (keysArray["87"] || keysArray["38"]) {
    // If the W key or the Up arrow is pressed while the player isn't moving vertically, move the player up.
    if (vertSpeed === 0) {
      vertSpeed = -vertSpeedIncrement;
      jumpSound.play();
    }
  }

  // A Key is 65
  // Left arrow is 37
  if (keysArray["65"] || keysArray["37"]) {
    // If the A key or the Left arrow is pressed, move the player to the left.
    horiSpeed = -horiSpeedIncrement * dt;
  }

  // D Key is 68
  // Right arrow is 39
  if (keysArray["68"] || keysArray["39"]) {
    // If the D key or the Right arrow is pressed, move the player to the right.
    horiSpeed = horiSpeedIncrement * dt;
  }
};

// handles interactions with the ground
let physics = (dt) => {
  // player on ground
  if (playerBox.position.y >= 550) {
    // Don't move down if the player is at the bottom of the stage
    vertSpeed = 0;
    playerBox.position.y = 550;
  }
  // player in air
  else {
    // If the player is in the air, gradually increase vertical speed to simualte gravity
    vertSpeed += gravity;
  }

  for (let platform of platforms) {
    // interaction with platforms
    if (rectsIntersect(playerBox, platform)) {
      // having the player stop vertical motion on the top of a platform
      if (
        playerBox.y + 50 < platform.y + 10 &&
        playerBox.y + 50 >= platform.y
      ) {
        playerBox.y = platform.y - platform.height;
        vertSpeed = 0;
      }
      // having the player bonk on the bottom of the platform
      else if (
        playerBox.y <= platform.y + 10 &&
        playerBox.y >= platform.y
      ) {
        playerBox.y = platform.y + playerBox.height;
        vertSpeed = 0;
      }
      // having the player be unable to enter the left side of the platform
      else if (
        playerBox.x >= platform.x - playerBox.width &&
        playerBox.x < platform.x
      ) {
        playerBox.x = platform.x - playerBox.width;
        horiSpeed = 0;
      }
      // having the player be unable to enter the right side of the platform
      else if (
        playerBox.x <= platform.x + platform.width&&
        playerBox.x > platform.x + platform.width - playerBox.width
      ) {
        playerBox.x = platform.x + platform.width;
        horiSpeed = 0;
      }
    }
  }
};

// handles collection of collectibles
let collect = () => {
  for (let coin of coins) {
    if (rectsIntersect(coin, playerBox)) {
      score += 10;
      time += 0.5;
      gameScene.removeChild(coin);
      coin.isCollected = true;
      coinSound.play();
    }
  }
  coins = coins.filter((coin) => !coin.isCollected);
  scoreText.text = `Score: ${score}`;
};

// handles the spawning of coins when the screen is clear
let spawnCoins = () => {
  for (let i = 0; i < coinsToSpawn; i++) {
    let coin = new Coin(getRandom(10, 590), getRandom(30, 590));
    coins.push(coin);
    gameScene.addChild(coin);
  }
};

// ensures that coins can't spawn in a platform recursively
let cleanUpCoins = () => {
  for (let coin of coins) {
    for (let platform of platforms) {
      if (rectsIntersect(coin, platform)) {
        coin.x = getRandom(30, 590);
        coin.y = getRandom(30, 590);
        cleanUpCoins();
      }
    }
  }
};

// update the timer by updating the graphic being displayed (being done this way so color can change)
let updateTimer = (color) => {
  gameScene.removeChild(timer);
  timer = new Timer(time * 50, 10, color, 5, 5);
  gameScene.addChild(timer);
};

// the game's main functionality
function gameLoop() {
  // stop the game if the player runs out of time
  if (paused) return;

  let dt = 1 / app.ticker.FPS;
  if (dt > 1 / 12) dt = 1 / 12;

  // read player input and calc speed
  input(dt);

  // apply vertical speed from input
  playerBox.y += vertSpeed;

  // apply any collisions with platforms
  physics(dt);

  // apply horizontal speed from input
  playerBox.x += horiSpeed;

  // reset horizontal speed if keys aren't being pressed
  if (!document.keydown) {
    horiSpeed = 0;
  }

  // screen wrapping on right and left
  if (playerBox.position.x > app.view.width + playerBox.width) {
    playerBox.position.x = 0 - playerBox.width;
  } else if (playerBox.position.x < 0 - playerBox.width) {
    playerBox.position.x = app.view.width + playerBox.width;
  }

  // check for collisions with coins and collect them if found
  collect();

  // ticking the game timer down to zero
  if (time > 0) {
    time -= 1 * dt;
  } else {
    if (score > highscore) {
      localStorage.setItem(highscoreKey, `${score}`);
      highscore = score;
      highscoreDisplay.innerHTML = `HIGH SCORE: ${highscore}`;
    }
    end();
  }

  // once the screen is cleared, spawn new coins to be collected
  if (coins.length === 0 && gameScene.visible) {
    time += 3;
    if (coinsToSpawn > 5) coinsToSpawn--;
    spawnCoins();
    cleanUpCoins();
  }

  // when the timer goes under 3 seconds, display the time bar in red to indicate low time,
  // otherwise just scale the bar so the player can see how much time they have left
  if (time < 3) {
    updateTimer(0xff0000);
  } else {
    updateTimer(0xffffff);
  }
}

document.addEventListener("keydown", onKeyDown);
document.addEventListener("keyup", onKeyUp);
