let platforms = [];

let addPlatform = (length, width, x, y) => {
  let platform = new Platform(length, width, 0xa0a0a0, x, y);
  platforms.push(platform);
};

addPlatform(150, 50, -25, 490);
addPlatform(150, 50, 475, 490);
addPlatform(150, 50, 225, 430);
addPlatform(100, 50, 100, 330);
addPlatform(225, 50, 375, 250);
addPlatform(200, 50, -50, 180);
addPlatform(125, 50, -25, 75);
addPlatform(100, 50, 250, 75);
addPlatform(125, 50, 500, 75);
