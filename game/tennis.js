const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// ゲーム状態
let gameRunning = true;
let gamePaused = false;
let score = 0;
let level = 1;
let hitCount = 0;
let gameStartTime = Date.now();
let highScore = localStorage.getItem('tennisHighScore') || 0;

// ボールの設定（複数ボール対応）
let balls = [{
  x: canvas.width / 2,
  y: canvas.height / 2,
  speedX: 4,
  speedY: 4
}];
const BALL_RADIUS = 10;
const BASE_SPEED = 4;

// パドルの設定
let paddleY = canvas.height / 2 - 50;
let paddleHeight = 100;
let paddleWidth = 10;
const PADDLE_BASE_HEIGHT = 100;
const PADDLE_BASE_WIDTH = 10;

// ブロックの設定
let blocks = [];
const BLOCK_WIDTH = 60;
const BLOCK_HEIGHT = 20;
const BLOCK_ROWS = 3;
const BLOCK_COLS = 8;

// アイテムの設定
let items = [];
const ITEM_SIZE = 20;
const ITEM_SPEED = 2;

// UI要素
const scoreElement = document.getElementById("score");
const levelElement = document.getElementById("level");
const gameStatusElement = document.getElementById("gameStatus");
const gameOverScreen = document.getElementById("gameOverScreen");
const finalScoreElement = document.getElementById("finalScore");
const pauseScreen = document.getElementById("pauseScreen");

// ブロックを初期化
function initBlocks() {
  blocks = [];
  const startY = 80;
  const startX = 150;
  
  for (let row = 0; row < BLOCK_ROWS; row++) {
    for (let col = 0; col < BLOCK_COLS; col++) {
      blocks.push({
        x: startX + col * (BLOCK_WIDTH + 10),
        y: startY + row * (BLOCK_HEIGHT + 10),
        width: BLOCK_WIDTH,
        height: BLOCK_HEIGHT,
        alive: true,
        color: `hsl(${(row * col * 30) % 360}, 70%, 50%)`
      });
    }
  }
}

// アイテムタイプ
const ITEM_TYPES = {
  PADDLE_LARGE: { color: '#00ff00', emoji: '⬆️', effect: 'paddleLarge' },
  MULTI_BALL: { color: '#ff00ff', emoji: '⚽', effect: 'multiBall' },
  SLOW_BALL: { color: '#00ffff', emoji: '🐢', effect: 'slowBall' },
  PADDLE_SMALL: { color: '#ff0000', emoji: '⬇️', effect: 'paddleSmall' },
  FAST_BALL: { color: '#ff6600', emoji: '⚡', effect: 'fastBall' },
  REMOVE_BALL: { color: '#990000', emoji: '💀', effect: 'removeBall' }
};

// ランダムアイテムを生成
function spawnItem(x, y) {
  const types = Object.keys(ITEM_TYPES);
  const randomType = types[Math.floor(Math.random() * types.length)];
  const itemType = ITEM_TYPES[randomType];
  
  items.push({
    x: x,
    y: y,
    type: randomType,
    color: itemType.color,
    emoji: itemType.emoji,
    effect: itemType.effect
  });
}

// マウスイベント
canvas.addEventListener("mousemove", e => {
  if (gamePaused || !gameRunning) return;
  
  const rect = canvas.getBoundingClientRect();
  paddleY = e.clientY - rect.top - paddleHeight / 2;
  
  // パドルが画面外に出ないように制限
  if (paddleY < 0) {
    paddleY = 0;
  }
  if (paddleY > canvas.height - paddleHeight) {
    paddleY = canvas.height - paddleHeight;
  }
});

// キーボードイベント
document.addEventListener("keydown", e => {
  if (e.code === "Space") {
    e.preventDefault();
    togglePause();
  }
});

// 描画関数
function drawEverything() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // ボール（複数）
  ctx.fillStyle = "white";
  balls.forEach(ball => {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2, true);
    ctx.fill();
  });

  // パドル
  ctx.fillStyle = "white";
  ctx.fillRect(0, paddleY, paddleWidth, paddleHeight);
  
  // ブロック
  blocks.forEach(block => {
    if (block.alive) {
      ctx.fillStyle = block.color;
      ctx.fillRect(block.x, block.y, block.width, block.height);
      ctx.strokeStyle = "white";
      ctx.strokeRect(block.x, block.y, block.width, block.height);
    }
  });
  
  // アイテム
  items.forEach(item => {
    ctx.fillStyle = item.color;
    ctx.fillRect(item.x - ITEM_SIZE/2, item.y - ITEM_SIZE/2, ITEM_SIZE, ITEM_SIZE);
    ctx.font = "16px Arial";
    ctx.fillText(item.emoji, item.x - 8, item.y + 5);
  });
  
  // スコア表示
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText(`スコア: ${score}`, canvas.width - 150, 30);
  ctx.fillText(`レベル: ${level}`, canvas.width - 150, 60);
  ctx.fillText(`最高: ${highScore}`, 10, 30);
  ctx.fillText(`ボール: ${balls.length}`, 10, 60);
}

// 移動・衝突判定
function moveEverything() {
  if (!gameRunning || gamePaused) return;
  
  // ボールの移動
  balls.forEach((ball, index) => {
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    // 上下の壁
    if (ball.y - BALL_RADIUS < 0 || ball.y + BALL_RADIUS > canvas.height) {
      ball.speedY = -ball.speedY;
    }

    // パドルとの衝突
    if (ball.x - BALL_RADIUS < paddleWidth) {
      if (ball.y > paddleY && ball.y < paddleY + paddleHeight) {
        ball.speedX = -ball.speedX;
        let hitPos = (ball.y - paddleY) / paddleHeight;
        ball.speedY = (hitPos - 0.5) * 8;
        addPoint(1);
      } else if (ball.x < 0) {
        // ボールがパドルを外れた
        balls.splice(index, 1);
        if (balls.length === 0) {
          gameOver();
          return;
        }
      }
    }

    // 右側の壁
    if (ball.x + BALL_RADIUS > canvas.width) {
      ball.speedX = -ball.speedX;
    }
    
    // ブロックとの衝突
    blocks.forEach(block => {
      if (block.alive) {
        if (ball.x + BALL_RADIUS > block.x &&
            ball.x - BALL_RADIUS < block.x + block.width &&
            ball.y + BALL_RADIUS > block.y &&
            ball.y - BALL_RADIUS < block.y + block.height) {
          
          // ブロック破壊
          block.alive = false;
          ball.speedY = -ball.speedY;
          addPoint(5);
          
          // アイテムをランダムに生成（30%の確率）
          if (Math.random() < 0.3) {
            spawnItem(block.x + block.width / 2, block.y + block.height / 2);
          }
        }
      }
    });
  });
  
  // アイテムの移動
  items.forEach((item, index) => {
    item.y += ITEM_SPEED;
    
    // パドルとの衝突判定
    if (item.x > 0 && item.x < paddleWidth + ITEM_SIZE &&
        item.y > paddleY && item.y < paddleY + paddleHeight) {
      applyItemEffect(item.effect);
      items.splice(index, 1);
    }
    
    // 画面外に出たら削除
    if (item.y > canvas.height) {
      items.splice(index, 1);
    }
  });
  
  // 全ブロック破壊でレベルアップ
  if (blocks.every(block => !block.alive)) {
    levelUp();
    initBlocks();
  }
}

// アイテム効果適用
function applyItemEffect(effect) {
  switch(effect) {
    case 'paddleLarge':
      paddleHeight = Math.min(paddleHeight * 1.5, 200);
      setTimeout(() => {
        paddleHeight = PADDLE_BASE_HEIGHT;
      }, 10000);
      break;
      
    case 'multiBall':
      if (balls.length > 0) {
        const baseBall = balls[0];
        balls.push({
          x: baseBall.x,
          y: baseBall.y,
          speedX: baseBall.speedX + (Math.random() - 0.5) * 2,
          speedY: baseBall.speedY + (Math.random() - 0.5) * 2
        });
        balls.push({
          x: baseBall.x,
          y: baseBall.y,
          speedX: baseBall.speedX - (Math.random() - 0.5) * 2,
          speedY: baseBall.speedY - (Math.random() - 0.5) * 2
        });
      }
      break;
      
    case 'slowBall':
      balls.forEach(ball => {
        ball.speedX *= 0.7;
        ball.speedY *= 0.7;
      });
      setTimeout(() => {
        balls.forEach(ball => {
          ball.speedX /= 0.7;
          ball.speedY /= 0.7;
        });
      }, 8000);
      break;
      
    case 'paddleSmall':
      paddleHeight = Math.max(paddleHeight * 0.5, 50);
      setTimeout(() => {
        paddleHeight = PADDLE_BASE_HEIGHT;
      }, 8000);
      break;
      
    case 'fastBall':
      balls.forEach(ball => {
        ball.speedX *= 1.5;
        ball.speedY *= 1.5;
      });
      setTimeout(() => {
        balls.forEach(ball => {
          ball.speedX /= 1.5;
          ball.speedY /= 1.5;
        });
      }, 6000);
      break;
      
    case 'removeBall':
      if (balls.length > 1) {
        balls.pop();
      }
      break;
  }
}

// ポイント追加
function addPoint(points) {
  score += points;
  hitCount++;
  updateUI();
  
  if (hitCount % 10 === 0) {
    levelUp();
  }
}

// レベルアップ
function levelUp() {
  level++;
  balls.forEach(ball => {
    let speedMultiplier = 1 + (level - 1) * 0.2;
    ball.speedX = BASE_SPEED * speedMultiplier * (ball.speedX > 0 ? 1 : -1);
  });
  updateUI();
  console.log(`レベル${level}にアップ！`);
}

// UI更新
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

// ゲームオーバー
function gameOver() {
  gameRunning = false;
  finalScoreElement.textContent = score;
  
  // 最高スコア更新
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('tennisHighScore', highScore);
    finalScoreElement.textContent += " 🎉 新記録！";
  }
  
  gameOverScreen.style.display = "block";
  updateUI();
}

// 一時中断
function togglePause() {
  if (!gameRunning) return;
  
  gamePaused = !gamePaused;
  
  if (gamePaused) {
    pauseScreen.style.display = "block";
  } else {
    pauseScreen.style.display = "none";
  }
  
  updateUI();
}

// ゲーム再開
function restartGame() {
  gameRunning = true;
  gamePaused = false;
  score = 0;
  level = 1;
  hitCount = 0;
  gameStartTime = Date.now();
  paddleHeight = PADDLE_BASE_HEIGHT;
  paddleWidth = PADDLE_BASE_WIDTH;
  
  balls = [{
    x: canvas.width / 2,
    y: canvas.height / 2,
    speedX: BASE_SPEED,
    speedY: 4
  }];
  
  items = [];
  initBlocks();
  
  gameOverScreen.style.display = "none";
  pauseScreen.style.display = "none";
  updateUI();
}

// グローバル関数
window.restartGame = restartGame;
window.togglePause = togglePause;

// ゲームループ
function gameLoop() {
  moveEverything();
  drawEverything();
}

// 初期化
initBlocks();
updateUI();
setInterval(gameLoop, 1000 / 60);
