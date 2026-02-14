let player;
let platforms = [];
let coins = [];
let enemies = [];
let score = 0;
let cameraX = 0;
let gameState = "PLAY"; // Can be "PLAY" or "GAMEOVER"

function setup() {
  createCanvas(600, 400);
  resetGame();
}

function resetGame() {
  score = 0;
  cameraX = 0;
  gameState = "PLAY";
  player = new Player();
  
  // Create Level Layout
  platforms = [
    new Platform(0, 350, 1500, 50), // Main Floor
    new Platform(300, 250, 150, 20),
    new Platform(550, 180, 150, 20),
    new Platform(850, 250, 200, 20),
    new Platform(1100, 150, 100, 20)
  ];
  
  // Scatter some coins
  for(let i=0; i<10; i++) {
    coins.push(new Coin(400 + i * 100, 100 + random(100)));
  }
  
  // Add an enemy
  enemies = [new Enemy(700, 320)];
}

function draw() {
  background(135, 206, 235); // Sky Blue

  if (gameState === "PLAY") {
    // Scrolling Logic: The "Camera" follows the player
    cameraX = lerp(cameraX, player.x - 100, 0.1);
    translate(-cameraX, 0);

    // Update and Show Objects
    for (let p of platforms) p.show();
    
    for (let i = coins.length - 1; i >= 0; i--) {
      coins[i].show();
      if (player.hits(coins[i])) {
        coins.splice(i, 1);
        score++;
      }
    }

    for (let e of enemies) {
      e.update();
      e.show();
      if (player.hits(e)) gameState = "GAMEOVER";
    }

    player.update();
    player.show();

    // UI (Moves with the camera)
    resetMatrix(); 
    fill(0);
    textSize(20);
    text("Coins: " + score, 20, 30);
    
  } else {
    showGameOver();
  }
}

function keyPressed() {
  if (keyCode === UP_ARROW || key === ' ') player.jump();
  if (gameState === "GAMEOVER" && key === 'r') resetGame();
}

// --- CLASS DEFINITIONS ---

class Player {
  constructor() {
    this.x = 100;
    this.y = 200;
    this.w = 30;
    this.h = 40;
    this.vy = 0;
    this.gravity = 0.8;
    this.speed = 5;
    this.onGround = false;
  }

  update() {
    // Horizontal Movement
    if (keyIsDown(LEFT_ARROW)) this.x -= this.speed;
    if (keyIsDown(RIGHT_ARROW)) this.x += this.speed;

    // Gravity & Velocity
    this.vy += this.gravity;
    this.y += this.vy;

    // Floor/Platform Collision
    this.onGround = false;
    for (let p of platforms) {
      if (this.x + this.w > p.x && this.x < p.x + p.w &&
          this.y + this.h > p.y && this.y + this.h < p.y + p.h + this.vy) {
        this.y = p.y - this.h;
        this.vy = 0;
        this.onGround = true;
      }
    }
  }

  jump() {
    if (this.onGround) this.vy = -15;
  }

  hits(obj) {
    return collideRectRect(this.x, this.y, this.w, this.h, obj.x, obj.y, obj.w, obj.h);
  }

  show() {
    fill(200, 0, 100); // Mario Red/Pink
    rect(this.x, this.y, this.w, this.h, 5);
    fill(0); // Eyes
    rect(this.x + 20, this.y + 10, 5, 5);
  }
}

class Platform {
  constructor(x, y, w, h) {
    this.x = x; this.y = y; this.w = w; this.h = h;
  }
  show() {
    fill(100, 60, 30);
    rect(this.x, this.y, this.w, this.h);
    fill(50, 150, 50);
    rect(this.x, this.y, this.w, 10); // Grass top
  }
}

class Coin {
  constructor(x, y) {
    this.x = x; this.y = y; this.w = 15; this.h = 15;
  }
  show() {
    fill(255, 215, 0);
    ellipse(this.x + 7, this.y + 7, this.w, this.h);
  }
}

class Enemy {
  constructor(x, y) {
    this.x = x; this.y = y; this.w = 30; this.h = 30;
    this.dir = 1;
  }
  update() {
    this.x += this.dir * 2;
    if (this.x > 900 || this.x < 600) this.dir *= -1;
  }
  show() {
    fill(150, 0, 0);
    rect(this.x, this.y, this.w, this.h, 3);
  }
}

// Simple collision helper
function collideRectRect(x, y, w, h, x2, y2, w2, h2) {
  return x + w > x2 && x < x2 + w2 && y + h > y2 && y < y2 + h2;
}

function showGameOver() {
  fill(0, 150);
  rect(0, 0, width, height);
  textAlign(CENTER);
  fill(255);
  textSize(40);
  text("GAME OVER", width/2, height/2);
  textSize(20);
  text("Press 'R' to Restart", width/2, height/2 + 40);
}