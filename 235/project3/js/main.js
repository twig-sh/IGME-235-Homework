"use strict";
const app = new PIXI.Application({
  width: 600,
  height: 600,
});
document.body.appendChild(app.view);

let score = 0;
let time = 10;
let paused = false;

let horiSpeed = 0;
let vertSpeed = 0;

const vertSpeedIncrement = 5;
const horiSpeedIncrement = 3;
const gravity = .1;

const width = app.view.width;
const height = app.view.height;

let keysArray = {};
let coins = [];

let textStyle = new PIXI.TextStyle({
    fill: 0xffffff,
    fontSize: 18,
    fontFamily: "Verdana",
    stroke: 0x0000ff,
    strokeThickness: 4,
  });

let playerBox = new PIXI.Graphics();

playerBox.beginFill(0x3498db); // Blue color
playerBox.drawRect(300, 550, 50, 50);
playerBox.endFill();

app.stage.addChild(playerBox);

let platform = new Platform(100, 50, 0xa0a0a0, 300, 490);

app.stage.addChild(platform);

for (let i = 0; i < 5; i++) {
    let coin = new Coin (5, 0xFFBF00, 50 * i, 575);
    coins.push(coin);
    app.stage.addChild(coin);
}

let coin = new Coin (5, 0xFFBF00, 350, 400);
coins.push(coin);
app.stage.addChild(coin);

let scoreText = new PIXI.Text()
scoreText.style = textStyle;
scoreText.x = 5;
scoreText.y = 20;
app.stage.addChild(scoreText);

let timer = new PIXI.Graphics()
timer.beginFill(0xffffff);
timer.drawRect(0, 0, 500, 10);
timer.endFill();
timer.x = 5;
timer.y = 5;

app.stage.addChild(timer);

// set a key's value to true in the keysArray when pressed down
let onKeyDown = (e) => {

    keysArray[e.keyCode] = true;
}

// set a key's value to false in the keysArray when pressed up
let onKeyUp = (e) => {
    keysArray[e.keyCode] = false;
}

// handles the player's keyboard inputs and their actions
let input = () => {
    // W Key is 87
    // Up arrow is 38
    if (keysArray["87"] || keysArray["38"]) {
        // If the W key or the Up arrow is pressed while the player isn't moving vertically, move the player up.
        if (vertSpeed === 0) {
            vertSpeed = -vertSpeedIncrement;
        }
    }

    // A Key is 65
    // Left arrow is 37
    if (keysArray["65"] || keysArray["37"]) {
        // If the A key or the Left arrow is pressed, move the player to the left.
        horiSpeed = -horiSpeedIncrement;
    }

    // D Key is 68
    // Right arrow is 39
    if (keysArray["68"] || keysArray["39"]) {
        // If the D key or the Right arrow is pressed, move the player to the right.
        horiSpeed = horiSpeedIncrement;
    }
}

// handles interactions with the ground
let physics = () => {
    // player on ground
    if (playerBox.position.y >= 0) {
        // Don't move down if the player is at the bottom of the stage
        vertSpeed = 0;
        playerBox.position.y = 0;
    }
    // interaction with platforms
    else if (rectsIntersect(playerBox, platform)) {
        // having the player stop vertical motion on the top of a platform
        if (playerBox.y < platform.y - height + 10 && 
            playerBox.y >= platform.y - height) {
            playerBox.y = platform.y - height
            vertSpeed = 0;
        }
        // having the player bonk on the bottom of the platform
        else if (playerBox.y <= platform.y + platform.height - height && 
                 playerBox.y >= platform.y + platform.height - height - 10){
            playerBox.y = platform.y + platform.height + playerBox.height - height;
            vertSpeed = 0;
        }
        // having the player be unable to enter the left side of the platform
        else if (playerBox.x >= platform.x - width / 2 - playerBox.width && 
                 playerBox.x < platform.x - width / 2){
            playerBox.x = platform.x - app.view.width / 2 - playerBox.width;
            horiSpeed = 0;
        }
        // having the player be unable to enter the right side of the platform
        else if (playerBox.x <= platform.x + platform.width - width / 2 && 
                 playerBox.x > platform.x + platform.width - width / 2 - playerBox.width){
            playerBox.x = platform.x + platform.width - app.view.width / 2;
            horiSpeed = 0;
        }
    }
    // player in air
    else {
        // If the player is in the air, gradually increase vertical speed to simualte gravity
        vertSpeed += gravity;
    }
}

// handles collection of collectibles
let collect = () => {
    for (let coin of coins) {
        if (rectsIntersect(coin, playerBox)) {
            score += 10;
            time += 1;
            app.stage.removeChild(coin);
            coin.isCollected = true;
        }
    }
    coins = coins.filter((coin) => !coin.isCollected);
    scoreText.text = `Score:  ${score}`;
}

// the game's main functionality
let gameLoop = () => {
    if(paused) return;

    input();
    
    playerBox.y += vertSpeed;

    physics();

    playerBox.x += horiSpeed;

    // reset horizontal speed if keys aren't being pressed
    if(!document.keydown) {
        horiSpeed = 0;
    }

    // screen wrapping on right and left
    if (playerBox.position.x > app.view.width / 2 + playerBox.width) {
        playerBox.position.x = -app.view.width / 2 - playerBox.width;
    }
    else if (playerBox.position.x < -app.view.width / 2 - playerBox.width) {
        playerBox.position.x = app.view.width / 2 + playerBox.width;
    }

    collect();

    if (time > 0) {
    time -= .01;
    }
    else {
        paused = true;
    }

    timer.scale.x = time / 10;
}
app.ticker.add(gameLoop);

document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);