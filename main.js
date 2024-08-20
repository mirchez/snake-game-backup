//html elements
const gameBoard = document.querySelector("#game-board");
const instructionText = document.querySelector("#instruction-text");
const logo = document.querySelector("#logo");
const score = document.querySelector("#score");
const highScoreText = document.querySelector("#highScore");
//game variables
let snake = [{ x: 10, y: 10 }]; //coordinates of the snake
//generate random position for the food
const gridSize = 20;
const genRandomFoodPosition = () => {
  const x = Math.floor(Math.random() * gridSize + 1);
  const y = Math.floor(Math.random() * gridSize + 1);
  return { x, y };
};
let food = genRandomFoodPosition(); //coordinates of the food
let direction = "right"; //direction of the snake
let gameInterval; //game interval
let gameSpeedDelay = 200; //game speed
let gameStarted = false;
let highscore;
//GAME FUNCTIONS
//function that draws elements into  map
const createGameElement = (tag, className) => {
  const element = document.createElement(tag);
  element.classList.add(className);
  return element;
};
//set position of the snake or food on the map
const setPosition = (element, { x, y }) => {
  element.style.gridRow = y;
  element.style.gridColumn = x;
};
//draw snake
const drawSnake = () => {
  snake.forEach((segment) => {
    const snakeElement = createGameElement("div", "snake");
    setPosition(snakeElement, segment);
    gameBoard.insertAdjacentElement("beforeend", snakeElement);
  });
};
//draw food
const drawFood = () => {
  if (gameStarted) {
    const foodElement = createGameElement("div");
    foodElement.classList.add("food");
    setPosition(foodElement, food);
    gameBoard.insertAdjacentElement("afterbegin", foodElement);
  }
};
//update score
const updateScore = () => {
  const currentScore = snake.length - 1;
  const newScore = currentScore.toString().padStart(3, "0");
  score.textContent = newScore;
};
//Draw game map, snake and food
const drawGameMap = () => {
  gameBoard.innerHTML = "";
  drawSnake();
  drawFood();
  updateScore();
};
//update Highscore
const updateHighScore = () => {
  const highscore = localStorage.getItem("highscore") || 0;
  const currentScore = snake.length - 1;

  if (currentScore > highscore) {
    localStorage.setItem("highscore", currentScore);
    highScoreText.textContent = currentScore.toString().padStart(3, "0");
  }
  highScoreText.style.display = "block";
};
//stop game function
const stopGame = () => {
  clearInterval(gameInterval);
  gameStarted = false;
  instructionText.style.display = "block";
  logo.style.display = "block";
};
//game over function
const resetGame = () => {
  updateHighScore();
  stopGame();
  snake = [{ x: 10, y: 10 }];
  food = genRandomFoodPosition();
  direction = "right";
  gameSpeedDelay = 200;
  updateScore();
};
//check collision
const checkCollision = () => {
  const head = snake[0];

  if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
    resetGame();
  }

  let collisionHappened = null;

  if (snake.length > 1) {
    collisionHappened = snake.find(
      (snakeSegment) => snakeSegment.x === head.x && snakeSegment.y === head.y
    );
  }
  if (collisionHappened != undefined && collisionHappened != null) {
    resetGame();
  }
};
//increase speed
const increaseSpeed = () => {
  console.log(gameSpeedDelay)
  const decrements = [
    { threshold: 150, value: 5 },
    { threshold: 100, value: 3 },
    { threshold: 50, value: 2 },
    { threshold: 25, value: 1 },
  ];
  const decrement =
    decrements.find((d) => gameSpeedDelay > d.threshold)?.value || 1;
  gameSpeedDelay -= decrement;
};
//move snake
const move = () => {
  const head = { ...snake[0] };
  switch (direction) {
    case "up":
      head.y--;
      break;
    case "down":
      head.y++;
      break;
    case "left":
      head.x--;
      break;
    case "right":
      head.x++;
      break;
  }
  snake.unshift(head);
  if (head.x === food.x && head.y === food.y) {
    food = genRandomFoodPosition();
    increaseSpeed();
    clearInterval(gameInterval);
    gameInterval = setInterval(() => {
      move();
      checkCollision();
      drawGameMap();
    }, gameSpeedDelay);
  } else {
    snake.pop();
  }
};
//start gam
const startGame = () => {
  gameStarted = true; //game started tracker
  instructionText.style.display = "none";
  logo.style.display = "none";
  gameInterval = setInterval(() => {
    move();
    checkCollision();
    drawGameMap();
  }, gameSpeedDelay);
};
//keypress listener
const handleKeyPress = (e) => {
  if ((!gameStarted && e.key === " ") || (!gameStarted && e.code === "Space")) {
    startGame();
  } else {
    switch (e.key) {
      case "ArrowUp":
        if (direction !== "down") {
          direction = "up";
        }
        break;
      case "ArrowDown":
        if (direction !== "up") {
          direction = "down";
        }
        break;
      case "ArrowLeft":
        if (direction !== "right") {
          direction = "left";
        }
        break;
      case "ArrowRight":
        if (direction !== "left") {
          direction = "right";
        }
        break;
    }
  }
};

document.addEventListener("keydown", handleKeyPress);