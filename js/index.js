//Game Constants and Variables
let inputDir = { x: 0, y: 0 };
const foodSound = new Audio("music/food.mp3");
const gameOverSound = new Audio("music/gameover.mp3");
const moveSound = new Audio("music/move.mp3");
const musicSound = new Audio("music/music.mp3");
let speed = 5;
let score = 0;
let lastPainTime = 0;
let snakeArr = [
  {
    x: 13,
    y: 15,
  },
];

food = {
  x: 6,
  y: 7,
};
let hiscoreval = localStorage.getItem("hiscore") || 0;

//Game Functions
function main(ctime) {
  window.requestAnimationFrame(main);
  // it repaints the screen  after ever 0.5s
  if ((ctime - lastPainTime) / 1000 < 1 / speed) {
    return;
  }
  lastPainTime = ctime;
  gameEngine();
}

function isCollide() {
  // if you bump into yourself or wall
  const head = snakeArr[0];
  return (
    snakeArr
      .slice(1)
      .some((segment) => segment.x === head.x && segment.y === head.y) ||
    head.x >= 18 ||
    head.x <= 0 ||
    head.y >= 18 ||
    head.y <= 0
  );
}



function gameEngine() {
  if (isCollide(snakeArr)) {
    gameOver();
    return;
  }

  // if you have eaten the food , increment the score and regenerate the food
  if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
    foodSound.play();
    const [head] = snakeArr;
    updateScore(++score);
    snakeArr.unshift({
      ...head,
      x: head.x + inputDir.x,
      y: head.y + inputDir.y,
    });
    regenerateFood();
  }
  moveSnake();
  displaySnake();
  displayFood();
}

function gameOver() {
  gameOverSound.play();
  musicSound.pause();
  inputDir = { x: 0, y: 0 };
  alert("Game Over.Press any key to play again!");
  snakeArr = [{ x: 13, y: 15 }];
  musicSound.play();
  score = 0;
  updateScore();
}

function regenerateFood() {
  const randomInRange = (min, max) =>
    Math.round(min + (max - min) * Math.random());

  food = {
    x: randomInRange(2, 16),
    y: randomInRange(2, 16),
  };
}

// Moving the Snake
function moveSnake() {
  for (let i = snakeArr.length - 2; i >= 0; i--) {
    snakeArr[i + 1] = { ...snakeArr[i] };
  }
  snakeArr[0].x += inputDir.x;
  snakeArr[0].y += inputDir.y;
}

//part 2 : Display the  snake and food
// Display the snake
function displaySnake() {
  board.innerHTML = "";
  snakeArr.forEach((e, index) => {
    snakeElement = document.createElement("div");
    snakeElement.style.gridRowStart = e.y;
    snakeElement.style.gridColumnStart = e.x;

    if (index === 0) {
      snakeElement.classList.add("head");
    } else {
      snakeElement.classList.add("snake");
    }
    board.appendChild(snakeElement);
  });
}

// Display the food
function displayFood() {
  foodElement = document.createElement("div");
  foodElement.style.gridRowStart = food.y;
  foodElement.style.gridColumnStart = food.x;
  foodElement.classList.add("food");
  board.appendChild(foodElement);
}

//UpdateScore
function updateScore() {
  if (score > hiscoreval) {
    hiscoreval = score;
    localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
    document.getElementById("hiscoreBox").innerHTML = "HiScore:" + hiscoreval;
  }
  document.getElementById("scoreBox").innerHTML = "Score:" + score;
}

//Main logic starts here
musicSound.play();
let hiscore = localStorage.getItem("hiscore");
if (hiscore === null) {
  hiscoreval = 0;
  localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
} else {
  hiscoreval = JSON.parse(hiscore);
  hiscoreBox.innerHTML = "HiScore:" + hiscore;
}
window.requestAnimationFrame(main);
window.addEventListener("keydown", (e) => {
  moveSound.play();
  const directions = {
    ArrowUp: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 },
    ArrowLeft: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 },
  };
  inputDir = directions[e.key] || inputDir;
});
