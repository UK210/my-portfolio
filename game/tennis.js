const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// ゲーム状態
let gameRunning = true;
let gamePaused = false;
let score = 0;
let level = 1;
let hitCount = 0;
let gameStartTime = Date.now();

// ボールの設定
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 4;
let ballSpeedY = 4;
const BALL_RADIUS = 10;
const BASE_SPEED = 4;

// パドルの設定
let paddleY = canvas.height / 2 - 50;
const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 10;

// UI要素
const scoreElement = document.getElementById("score");
const levelElement = document.getElementById("level");
const gameStatusElement = document.getElementById("gameStatus");
const gameOverScreen = document.getElementById("gameOverScreen");
const finalScoreElement = document.getElementById("finalScore");
const pauseScreen = document.getElementById("pauseScreen");

canvas.addEventListener("mousemove", e => {
  if (gamePaused || !gameRunning) return;
  
  const rect = canvas.getBoundingClientRect();
  paddleY = e.clientY - rect.top - PADDLE_HEIGHT / 2;
  
  // パドルが画面外に出ないように制限
  if (paddleY < 0) {
    paddleY = 0;
  }
  if (paddleY > canvas.height - PADDLE_HEIGHT) {
    paddleY = canvas.height - PADDLE_HEIGHT;
  }
});

// キーボードイベントリスナー
document.addEventListener("keydown", e => {
  if (e.code === "Space") {
    e.preventDefault(); // ページのスクロールを防ぐ
    togglePause();
  }
});

function drawEverything() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // ボール
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(ballX, ballY, BALL_RADIUS, 0, Math.PI * 2, true);
  ctx.fill();

  // パドル
  ctx.fillRect(0, paddleY, PADDLE_WIDTH, PADDLE_HEIGHT);
  
  // スコア表示（キャンバス上）
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText(`スコア: ${score}`, canvas.width - 150, 30);
  ctx.fillText(`レベル: ${level}`, canvas.width - 150, 60);
}

function moveEverything() {
  if (!gameRunning || gamePaused) return;
  
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // 上下の壁に当たった時
  if (ballY - BALL_RADIUS < 0 || ballY + BALL_RADIUS > canvas.height) {
    ballSpeedY = -ballSpeedY;
  }

  // 左側のパドルに当たる
  if (ballX - BALL_RADIUS < PADDLE_WIDTH) {
    if (ballY > paddleY && ballY < paddleY + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;
      // パドルの位置に応じてボールの角度を調整
      let hitPos = (ballY - paddleY) / PADDLE_HEIGHT;
      ballSpeedY = (hitPos - 0.5) * 8;
      
      // ポイントを追加
      addPoint();
    } else {
      // ゲームオーバー
      gameOver();
      return;
    }
  }

  // 右側の壁に当たる
  if (ballX + BALL_RADIUS > canvas.width) {
    ballSpeedX = -ballSpeedX;
  }
}

function ballReset() {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX = BASE_SPEED * level;
  ballSpeedY = (Math.random() - 0.5) * 6;
}

// ポイント追加関数
function addPoint() {
  score += 1;
  hitCount++;
  updateUI();
  
  // 5回打ち返すごとにレベルアップ
  if (hitCount % 5 === 0) {
    levelUp();
  }
}

// レベルアップ関数
function levelUp() {
  level++;
  // ボールのスピードを上げる
  let speedMultiplier = 1 + (level - 1) * 0.3;
  ballSpeedX = BASE_SPEED * speedMultiplier;
  
  // スピードの上限を設定
  if (ballSpeedX > 12) {
    ballSpeedX = 12;
  }
  
  updateUI();
  console.log(`レベルアップ！レベル${level}、スピード: ${ballSpeedX.toFixed(1)}`);
}

// UI更新関数
function updateUI() {
  scoreElement.textContent = score;
  levelElement.textContent = level;
  
  if (gamePaused) {
    gameStatusElement.textContent = "一時中断";
  } else if (!gameRunning) {
    gameStatusElement.textContent = "ゲームオーバー";
  } else {
    gameStatusElement.textContent = "プレイ中";
  }
}

// ゲームオーバー関数
function gameOver() {
  gameRunning = false;
  finalScoreElement.textContent = score;
  gameOverScreen.style.display = "block";
  updateUI();
}

// 一時中断切り替え関数
function togglePause() {
  if (!gameRunning) return; // ゲームオーバー時は一時中断できない
  
  gamePaused = !gamePaused;
  
  if (gamePaused) {
    pauseScreen.style.display = "block";
  } else {
    pauseScreen.style.display = "none";
  }
  
  updateUI();
}

// ゲーム再開関数
function restartGame() {
  gameRunning = true;
  gamePaused = false;
  score = 0;
  level = 1;
  hitCount = 0;
  gameStartTime = Date.now();
  ballSpeedX = BASE_SPEED;
  ballSpeedY = 4;
  gameOverScreen.style.display = "none";
  pauseScreen.style.display = "none";
  ballReset();
  updateUI();
}

// グローバル関数として公開
window.restartGame = restartGame;
window.togglePause = togglePause;

function gameLoop() {
  moveEverything();
  drawEverything();
  
  // 時間経過によるレベルアップ（30秒ごと）- 一時中断中は時間をカウントしない
  if (gameRunning && !gamePaused && Date.now() - gameStartTime > 30000 * level) {
    levelUp();
    gameStartTime = Date.now(); // タイマーリセット
  }
}

// 初期化
updateUI();
setInterval(gameLoop, 1000 / 60);
