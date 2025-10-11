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
let currentStage = 1;
const TOTAL_STAGES = 5;

// ステージ設定（後で詳細を追加可能）
const STAGE_CONFIG = {
  1: { 
    name: 'ステージ1',
    rows: 10,
    cols: 5,
    skipRows: [0, 8, 9],
    ballSpeed: 4,
    message: '基本ステージ'
  },
  2: {
    name: 'ステージ2',
    rows: 10,
    cols: 5,
    skipRows: [0, 8, 9],
    ballSpeed: 5,
    message: '難易度アップ！'
  },
  3: {
    name: 'ステージ3',
    rows: 10,
    cols: 5,
    skipRows: [0, 8, 9],
    ballSpeed: 6,
    message: '中級ステージ'
  },
  4: {
    name: 'ステージ4',
    rows: 10,
    cols: 5,
    skipRows: [0, 8, 9],
    ballSpeed: 7,
    message: '上級ステージ'
  },
  5: {
    name: 'ステージ5',
    rows: 10,
    cols: 5,
    skipRows: [0, 8, 9],
    ballSpeed: 8,
    message: '最終ステージ！'
  }
};

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
const BLOCK_WIDTH = 20; // 縦長ブロック：幅を狭く
const BLOCK_HEIGHT = 60; // 縦長ブロック：高さを長く
const MAX_BLOCKS = 32; // 最大ブロック数（8×4=32）
let blockSpawnTimer = 0;

// アイテムの設定
let items = [];
const ITEM_SIZE = 20;
const ITEM_SPEED = 2;

// UI要素
const scoreElement = document.getElementById("score");
const levelElement = document.getElementById("level");
const gameStatusElement = document.getElementById("gameStatus");
const stageDisplayElement = document.getElementById("stageDisplay");
const ballCountElement = document.getElementById("ballCount");
const highScoreDisplayElement = document.getElementById("highScoreDisplay");
const gameOverScreen = document.getElementById("gameOverScreen");
const finalScoreElement = document.getElementById("finalScore");
const pauseScreen = document.getElementById("pauseScreen");
const stageClearScreen = document.getElementById("stageClearScreen");
const clearedStageElement = document.getElementById("clearedStage");
const stageScoreElement = document.getElementById("stageScore");
const gameCompleteScreen = document.getElementById("gameCompleteScreen");
const completeScoreElement = document.getElementById("completeScore");

// ブロックを初期化（右側に規則的配置）
function initBlocks() {
  blocks = [];
  spawnRegularBlocks();
}

// 規則的な位置にブロックを生成（縦8列×横4行）
function spawnRegularBlocks() {
  const rows = 8; // 縦8列
  const cols = 4; // 横4行
  const blockSpacing = BLOCK_WIDTH * 1.5; // ブロック1.5個分の間隔
  const startX = canvas.width - blockSpacing - (cols * (BLOCK_WIDTH + 8)); // 右端から余裕を持たせる
  const startY = 20; // 一番上から開始
  const spacingY = 5; // 縦間隔
  const spacingX = 8; // 横間隔
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = startX + col * (BLOCK_WIDTH + spacingX);
      const y = startY + row * (BLOCK_HEIGHT + spacingY);
      
      // canvas内に収まるか確認
      if (y + BLOCK_HEIGHT > canvas.height) {
        continue; // はみ出る場合はスキップ
      }
      
      // 既存のブロックを確認
      const exists = blocks.some(block => 
        block.alive &&
        Math.abs(block.x - x) < BLOCK_WIDTH + 3 &&
        Math.abs(block.y - y) < BLOCK_HEIGHT + 3
      );
      
      if (!exists && blocks.filter(b => b.alive).length < MAX_BLOCKS) {
        blocks.push({
          x: x,
          y: y,
          width: BLOCK_WIDTH,
          height: BLOCK_HEIGHT,
          alive: true,
          color: 'white'
        });
      }
    }
  }
}

// アイテムタイプ
const ITEM_TYPES = {
  PADDLE_LARGE: { color: '#00ff00', emoji: '⬆️', effect: 'paddleLarge', name: 'パドル拡大' },
  MULTI_BALL: { color: '#ff00ff', emoji: '⚽', effect: 'multiBall', name: 'ボール増加' },
  PADDLE_SLOW: { color: '#00ffff', emoji: '🐢', effect: 'paddleSlow', name: 'パドルスロー' },
  PADDLE_SMALL: { color: '#ff0000', emoji: '⬇️', effect: 'paddleSmall', name: 'パドル縮小' },
  PADDLE_FAST: { color: '#ff6600', emoji: '⚡', effect: 'paddleFast', name: 'パドル高速' },
  REMOVE_BALL: { color: '#990000', emoji: '💀', effect: 'removeBall', name: 'ボール減少' }
};

// アイテム名を取得
function getItemName(effect) {
  for (let key in ITEM_TYPES) {
    if (ITEM_TYPES[key].effect === effect) {
      return ITEM_TYPES[key].name;
    }
  }
  return '';
}

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
  
  // アイテム（より見やすい表示）
  items.forEach(item => {
    // 外枠（白い枠線）
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(item.x - ITEM_SIZE/2, item.y - ITEM_SIZE/2, ITEM_SIZE, ITEM_SIZE);
    
    // 背景色
    ctx.fillStyle = item.color;
    ctx.fillRect(item.x - ITEM_SIZE/2, item.y - ITEM_SIZE/2, ITEM_SIZE, ITEM_SIZE);
    
    // 絵文字（大きく表示）
    ctx.font = "bold 20px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "white";
    ctx.fillText(item.emoji, item.x, item.y);
    
    // アイテム効果のテキスト
    ctx.font = "12px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(getItemName(item.effect), item.x, item.y + ITEM_SIZE);
  });
  
  // canvas内のスコア表示は削除（HTML側で表示）
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
    
    // ブロックとの衝突（より正確な反射）
    blocks.forEach(block => {
      if (block.alive) {
        if (ball.x + BALL_RADIUS > block.x &&
            ball.x - BALL_RADIUS < block.x + block.width &&
            ball.y + BALL_RADIUS > block.y &&
            ball.y - BALL_RADIUS < block.y + block.height) {
          
          // ブロック破壊
          block.alive = false;
          
          // より正確な反射判定
          const ballCenterX = ball.x;
          const ballCenterY = ball.y;
          const blockCenterX = block.x + block.width / 2;
          const blockCenterY = block.y + block.height / 2;
          
          const dx = ballCenterX - blockCenterX;
          const dy = ballCenterY - blockCenterY;
          
          // 横から当たったか縦から当たったかを判定
          if (Math.abs(dx / block.width) > Math.abs(dy / block.height)) {
            // 横から当たった
            ball.speedX = -ball.speedX;
          } else {
            // 縦から当たった
            ball.speedY = -ball.speedY;
          }
          
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
    item.x -= ITEM_SPEED; // 左に移動（パドルに向かって）
    
    // パドルとの衝突判定（より正確に）
    if (item.x - ITEM_SIZE/2 < paddleWidth &&
        item.x + ITEM_SIZE/2 > 0 &&
        item.y + ITEM_SIZE/2 > paddleY &&
        item.y - ITEM_SIZE/2 < paddleY + paddleHeight) {
      applyItemEffect(item.effect);
      items.splice(index, 1);
    }
    
    // 画面外に出たら削除（左側）
    if (item.x < -ITEM_SIZE) {
      items.splice(index, 1);
    }
  });
  
  // ブロックの再出現は無効化（ステージ制のため）
  
  // 全ブロック破壊でステージクリア
  if (blocks.length > 0 && blocks.every(block => !block.alive)) {
    stageClear();
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
      
    case 'paddleSlow':
      // パドルの移動速度を遅くする（マウス感度を下げる）
      canvas.style.cursor = 'not-allowed';
      const originalMouseMove = canvas.onmousemove;
      let slowFactor = 0.5;
      canvas.addEventListener('mousemove', function slowMove(e) {
        if (gamePaused || !gameRunning) return;
        const rect = canvas.getBoundingClientRect();
        const targetY = e.clientY - rect.top - paddleHeight / 2;
        paddleY += (targetY - paddleY) * slowFactor;
        
        if (paddleY < 0) paddleY = 0;
        if (paddleY > canvas.height - paddleHeight) {
          paddleY = canvas.height - paddleHeight;
        }
      });
      setTimeout(() => {
        canvas.style.cursor = 'default';
        canvas.removeEventListener('mousemove', slowMove);
      }, 8000);
      break;
      
    case 'paddleSmall':
      paddleHeight = Math.max(paddleHeight * 0.5, 50);
      setTimeout(() => {
        paddleHeight = PADDLE_BASE_HEIGHT;
      }, 8000);
      break;
      
    case 'paddleFast':
      // パドルの移動速度を速くする（マウス感度を上げる）
      canvas.style.cursor = 'move';
      setTimeout(() => {
        canvas.style.cursor = 'default';
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
  
  // 45回ごとにレベルアップ（15回の3倍に延長）
  if (hitCount % 45 === 0) {
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
  stageDisplayElement.textContent = `${currentStage}/${TOTAL_STAGES}`;
  ballCountElement.textContent = balls.length;
  highScoreDisplayElement.textContent = highScore;
  
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

// ゲーム再開（最初からやり直し）
function restartGame() {
  gameRunning = true;
  gamePaused = false;
  score = 0;
  level = 1;
  hitCount = 0;
  currentStage = 1; // ステージを1に戻す
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
  blocks = [];
  initBlocks();
  blockSpawnTimer = 0;
  
  gameOverScreen.style.display = "none";
  pauseScreen.style.display = "none";
  stageClearScreen.style.display = "none";
  gameCompleteScreen.style.display = "none";
  updateUI();
}

// ステージクリア
function stageClear() {
  gamePaused = true;
  clearedStageElement.textContent = currentStage;
  stageScoreElement.textContent = score;
  stageClearScreen.style.display = "block";
}

// 次のステージへ
function nextStage() {
  currentStage++;
  
  if (currentStage > TOTAL_STAGES) {
    gameComplete();
    return;
  }
  
  // ステージクリア画面を閉じる
  stageClearScreen.style.display = "none";
  gamePaused = false;
  
  // ステージの設定を適用
  const stageConfig = STAGE_CONFIG[currentStage];
  balls.forEach(ball => {
    ball.speedX = stageConfig.ballSpeed * (ball.speedX > 0 ? 1 : -1);
  });
  
  // ブロックをリセット
  blocks = [];
  items = [];
  spawnRegularBlocks();
  blockSpawnTimer = 0;
  
  console.log(`${stageConfig.name}: ${stageConfig.message}`);
}

// ゲーム完了
function gameComplete() {
  gameRunning = false;
  stageClearScreen.style.display = "none";
  completeScoreElement.textContent = score;
  gameCompleteScreen.style.display = "block";
  
  // 最高スコア更新
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('tennisHighScore', highScore);
    completeScoreElement.textContent += " 🎉 新記録！";
  }
}

// グローバル関数
window.restartGame = restartGame;
window.togglePause = togglePause;
window.nextStage = nextStage;

// ゲームループ
function gameLoop() {
  moveEverything();
  drawEverything();
}

// 初期化
initBlocks();
updateUI();
setInterval(gameLoop, 1000 / 60);
