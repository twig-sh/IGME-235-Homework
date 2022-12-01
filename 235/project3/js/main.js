"use strict";
const app = new PIXI.Application({
  width: 600,
  height: 600,
});
document.body.appendChild(app.view);

let horiSpeed = 0;
let vertSpeed = 0;

let keysArray = {};

let playerBox = new PIXI.Graphics();

playerBox.beginFill(0x3498db); // Blue color
playerBox.drawRect(300, 550, 50, 50);
playerBox.endFill();

app.stage.addChild(playerBox);

let platform = new Platform(100, 50, 0xa0a0a0, 300, 490);

app.stage.addChild(platform);

// set a key's value to true in the keysArray when pressed down
let onKeyDown = (e) => {

    keysArray[e.keyCode] = true;
}

// set a key's value to false in the keysArray when pressed up
let onKeyUp = (e) => {
    keysArray[e.keyCode] = false;
}

// the game's main functionality
let gameLoop = () => {
    // W Key is 87
    // Up arrow is 38
    if (keysArray["87"] || keysArray["38"]) {
        // If the W key or the Up arrow is pressed while the player isn't moving vertically, move the player up.
        if (vertSpeed === 0) {
            vertSpeed = -5;
        }
    }

    // A Key is 65
    // Left arrow is 37
    if (keysArray["65"] || keysArray["37"]) {
        // If the A key or the Left arrow is pressed, move the player to the left.
        horiSpeed = -5;
    }

    // D Key is 68
    // Right arrow is 39
    if (keysArray["68"] || keysArray["39"]) {
        // If the D key or the Right arrow is pressed, move the player to the right.
        horiSpeed = 5;
    }

    
    playerBox.y += vertSpeed;

    if (playerBox.position.y >= 0) {
        // Don't move down if the player is at the bottom of the stage
        vertSpeed = 0;
        //playerBox.position.y = 0;
    }
    else if (rectsIntersect(playerBox, platform)) {
        if (playerBox.y < platform.y - app.view.height + 10 && playerBox.y >= platform.y - app.view.height) {
            playerBox.y = platform.y - app.view.height
        }
        else {
            horiSpeed = 0;
        }
        vertSpeed = 0;
    }
    else {
        // If the player is in the air, gradually increase vertical speed to simualte gravity
        vertSpeed += .1;
    }

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

    console.log(playerBox.position.x)
}

app.ticker.add(gameLoop);

document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);