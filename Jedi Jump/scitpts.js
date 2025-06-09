//board
let board;
let boardWidth = 750;
let boardHeight = 250;
let context;

//LukeSkywalker
let LukeSkywalkerWidth = 90;
let LukeSkywalkerHeight = 125;
let LukeSkywalkerX = 50;
let LukeSkywalkerY = boardHeight - LukeSkywalkerHeight;
let LukeSkywalkerImg;

let LukeSkywalker = {
    x: LukeSkywalkerX,
    y: LukeSkywalkerY,
    width: LukeSkywalkerWidth,
    height: LukeSkywalkerHeight
};

//Stormtrooper
let StormtrooperArray = [];

let Stormtrooper1Width = 42;
let Stormtrooper2Width = 82;
let Stormtrooper3Width = 123;

let StormtrooperHeight = 70;
let StormtrooperX = 700;
let StormtrooperY = boardHeight - StormtrooperHeight;

let Stormtrooper1Img;
let Stormtrooper2Img;
let Stormtrooper3Img;

//physics
let velocityX = -8; //Stormtrooper moving left speed 
let velocityY = 0;
let gravity = 0.4;

let gameOver = false;
let score = 0;
// Load highScore from localStorage or initialize 0
let highScore = Number(localStorage.getItem('jediJumpHighScore')) || 0;
let paused = false;

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d");

    LukeSkywalkerImg = new Image();
    LukeSkywalkerImg.src = "./img/Luke Skywalker.png";
    LukeSkywalkerImg.onload = function() {
        context.drawImage(LukeSkywalkerImg, LukeSkywalker.x, LukeSkywalker.y, LukeSkywalker.width, LukeSkywalker.height);
    };

    Stormtrooper1Img = new Image();
    Stormtrooper1Img.src = "./img/Stormtrooper1.png";

    Stormtrooper2Img = new Image();
    Stormtrooper2Img.src = "./img/Stormtrooper2.png";

    Stormtrooper3Img = new Image();
    Stormtrooper3Img.src = "./img/Stormtrooper3.png";

    requestAnimationFrame(update);
    setInterval(placeStormtrooper, 1000);
    document.addEventListener("keydown", handleKeyDown);
}

function update() {
    requestAnimationFrame(update);

    if (gameOver || paused) {
        return;
    }

    context.clearRect(0, 0, board.width, board.height);

    // LukeSkywalker physics & drawing
    velocityY += gravity;
    LukeSkywalker.y = Math.min(LukeSkywalker.y + velocityY, LukeSkywalkerY);
    context.drawImage(LukeSkywalkerImg, LukeSkywalker.x, LukeSkywalker.y, LukeSkywalker.width, LukeSkywalker.height);

    // Stormtroopers update & drawing
    for (let i = 0; i < StormtrooperArray.length; i++) {
        let Stormtrooper = StormtrooperArray[i];
        Stormtrooper.x += velocityX;
        context.drawImage(Stormtrooper.img, Stormtrooper.x, Stormtrooper.y, Stormtrooper.width, Stormtrooper.height);

        if (detectCollision(LukeSkywalker, Stormtrooper)) {
            gameOver = true;
            if (score > highScore) {
                highScore = score;
                // Save high score persistently
                localStorage.setItem('jediJumpHighScore', highScore);
            }
            LukeSkywalkerImg.src = "./img/dead-luke.png";
            LukeSkywalkerImg.onload = function() {
                context.drawImage(LukeSkywalkerImg, LukeSkywalker.x, LukeSkywalker.y, LukeSkywalker.width, LukeSkywalker.height);
                drawGameOver();
            };
        }
    }

    StormtrooperArray = StormtrooperArray.filter(s => s.x + s.width > 0);

    // Increase score regularly
    score++;

    // Draw Score and High Score aligned to right side
    context.fillStyle = "black";
    context.font = "25px courier";

    const scoreText = "Score: " + Math.floor(score / 5);
    const highScoreText = "High Score: " + Math.floor(highScore / 5);

    const paddingRight = 10;

    // Measure text width for right alignment
    const scoreWidth = context.measureText(scoreText).width;
    const highScoreWidth = context.measureText(highScoreText).width;

    context.fillText(scoreText, board.width - scoreWidth - paddingRight, 30);
    context.fillText(highScoreText, board.width - highScoreWidth - paddingRight, 60);
}

function drawGameOver() {
    context.fillStyle = "red";
    context.font = "40px courier";
    context.fillText("GAME OVER", 250, 100);
    context.font = "20px courier";
    context.fillText('Press "S" or Space to Restart', 230, 140);
}

function handleKeyDown(e) {
    if (gameOver && (e.code === "KeyS" || e.code === "Space")) {
        resetGame();
    } else if (!gameOver && !paused) {
        if ((e.code === "Space" || e.code === "ArrowUp") && LukeSkywalker.y === LukeSkywalkerY) {
            velocityY = -11;
        } else if (e.code === "KeyP") {
            paused = true;
            context.fillStyle = "blue";
            context.font = "25px verdana";
            context.fillText("Paused - Press 'C' to Continue", 180, 130);
        }
    } else if (paused && e.code === "KeyC") {
        paused = false;
    }
}

function resetGame() {
    StormtrooperArray = [];
    score = 0;
    velocityY = 0;
    gameOver = false;
    LukeSkywalker.y = LukeSkywalkerY;
    LukeSkywalkerImg.src = "./img/Luke Skywalker.png";
}

function placeStormtrooper() {
    if (gameOver || paused) {
        return;
    }

    let Stormtrooper = {
        img: null,
        x: StormtrooperX,
        y: StormtrooperY,
        width: null,
        height: StormtrooperHeight
    };

    let placeStormtrooperChance = Math.random();

    if (placeStormtrooperChance > 0.90) {
        Stormtrooper.img = Stormtrooper3Img;
        Stormtrooper.width = Stormtrooper3Width;
    } else if (placeStormtrooperChance > 0.70) {
        Stormtrooper.img = Stormtrooper2Img;
        Stormtrooper.width = Stormtrooper2Width;
    } else if (placeStormtrooperChance > 0.50) {
        Stormtrooper.img = Stormtrooper1Img;
        Stormtrooper.width = Stormtrooper1Width;
    }

    if (Stormtrooper.img !== null) {
        StormtrooperArray.push(Stormtrooper);
    }

    if (StormtrooperArray.length > 5) {
        StormtrooperArray.shift();
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}