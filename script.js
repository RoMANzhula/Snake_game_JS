const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const SIZE = 336;
const IMAGE_SIZE = 16;
const ALL_CELLS = 400;

const snakeCell = new Image();
snakeCell.src = "images/ball.png";
const apple = new Image();
apple.src = "images/apple.png";

let appleX, appleY;
const x = new Array(ALL_CELLS);
const y = new Array(ALL_CELLS);

let snakeCells;
let left = false;
let right = true;
let up = false;
let down = false;
let inGame = true;

let gameInterval; // глобальна(загальна) змінна для таймера гри

function initializationGame() {
    //видаляємо попередній таймер, якщо він існує
    if (gameInterval) {
        clearInterval(gameInterval);
    }

    snakeCells = 3;
    for (let i = 0; i < snakeCells; i++) {
        x[i] = 48 - (i * IMAGE_SIZE);
        y[i] = 48;
    }

    createApple();

    //створюємо новий таймер гри
    gameInterval = setInterval(gameLoop, 300);
}

function createApple() {
    appleX = Math.floor(Math.random() * 20) * IMAGE_SIZE;
    appleY = Math.floor(Math.random() * 20) * IMAGE_SIZE;
}

function move() {
    for (let i = snakeCells; i > 0; i--) {
        x[i] = x[i - 1];
        y[i] = y[i - 1];
    }
    if (left) {
        x[0] -= IMAGE_SIZE;
    }
    if (right) {
        x[0] += IMAGE_SIZE;
    }
    if (up) {
        y[0] -= IMAGE_SIZE;
    }
    if (down) {
        y[0] += IMAGE_SIZE;
    }
}

function checkAppleOnTheWay() {
    if (x[0] === appleX && y[0] === appleY) {
        snakeCells++;
        createApple();
    }
}

function checkCollisionWithUs() {
    for (let i = snakeCells; i > 0; i--) {
        if (i > 4 && x[0] === x[i] && y[0] === y[i]) {
            inGame = false;
        }
    }
}

function checkCollisionWithFields() {
    if (x[0] >= SIZE || x[0] < 0 || y[0] >= SIZE || y[0] < 0) {
        inGame = false;
    }
}

function paintComponent() {
    ctx.clearRect(0, 0, SIZE, SIZE);

    //малюємо контур ігрового поля
    ctx.strokeStyle = "white"; //колір контуру
    ctx.lineWidth = 2; //товщина ліній контуру
    ctx.strokeRect(0, 0, SIZE, SIZE); //малюємо прямокутник навколо ігрового поля

    if (inGame) {
        ctx.drawImage(apple, appleX, appleY, IMAGE_SIZE, IMAGE_SIZE);
        for (let i = 0; i < snakeCells; i++) {
            ctx.drawImage(snakeCell, x[i], y[i], IMAGE_SIZE, IMAGE_SIZE);
        }
    } else {
        if (document.getElementById("game-over-message").classList.contains("hidden")) {
          document.getElementById("end-button").click(); //логіка кнопки "game over"
      }
    }

    function gameLoop() {
      if (inGame) {
          checkAppleOnTheWay();
          checkCollisionWithUs();
          checkCollisionWithFields();
          move();
      }
      paintComponent(); //викликаємо функцію малювання після оновлення гри
  }
}

function gameLoop() {
    if (inGame) {
        checkAppleOnTheWay();
        checkCollisionWithUs();
        checkCollisionWithFields();
        move();
    }
    paintComponent();
}

window.addEventListener("keydown", function (e) {
    const key = e.keyCode;
    if (key === 37 && !right) {
        left = true;
        up = false;
        down = false;
    }
    if (key === 39 && !left) {
        right = true;
        up = false;
        down = false;
    }
    if (key === 38 && !down) {
        right = false;
        up = true;
        left = false;
    }
    if (key === 40 && !up) {
        right = false;
        down = true;
        left = false;
    }
});

//ініціалізація гри при завантаженні сторінки
initializationGame();


//флаг isPaused в глобальному контексті
let isPaused = false;

function startGame() {
    //перевірка, чи існує попередній таймер і видалення його
    if (gameInterval) {
        clearInterval(gameInterval);
    }

    //створення нового таймера гри
    gameInterval = setInterval(updateGameArea, 300); //300 мілісекунд для оновлення гри
}

function stopGame() {
    //видалення таймера гри при завершенні гри
    clearInterval(gameInterval);
    gameInterval = null;
}

//обробка кнопки "Pause"
document.getElementById("pause-button").addEventListener("click", function () {
  if (inGame) {
    if (!isPaused) {
      isPaused = true;
      document.getElementById("pause-message").classList.remove("hidden"); //показуємо повідомлення "Pause"
      clearInterval(gameInterval); //зупиняємо таймер гри
    } else {
      isPaused = false;
      document.getElementById("pause-message").classList.add("hidden"); //ховаємо повідомлення "Pause"
      gameInterval = setInterval(gameLoop, 300); //відновлюємо таймер гри
    }
  }
});

document.getElementById("end-button").addEventListener("click", function () {
  inGame = false;
  document.getElementById("game-over-message").classList.remove("hidden");
  document.getElementById("pause-message").classList.add("hidden"); //ховаємо повідомлення "Pause"
});

//додатковий код для кнопки "reload"
document.getElementById("restart-button").addEventListener("click", function () {
  initializationGame();
  inGame = true;
  document.getElementById("pause-message").classList.add("hidden");
  document.getElementById("game-over-message").classList.add("hidden");
});