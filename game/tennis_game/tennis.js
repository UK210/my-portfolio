const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// サウンド設定
let soundEnabled = true;
let audioContext = null;

// AudioContextの初期化
function initAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
}

// 効果音を生成する関数（大幅拡張版）
function playSound(type) {
  if (!soundEnabled) return;
  
  try {
    const ctx = initAudioContext();
    const now = ctx.currentTime;
    
    switch(type) {
      case 'paddleHit': // パドルヒット音（高音でクリアな音）
        {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.value = 800;
          osc.type = 'sine';
          gain.gain.setValueAtTime(0.3, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
          osc.start(now);
          osc.stop(now + 0.08);
        }
        break;
        
      case 'blockBreak': // ブロック破壊音（クラッシュ音）
        {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.value = 200;
          osc.type = 'sawtooth';
          gain.gain.setValueAtTime(0.4, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
          osc.start(now);
          osc.stop(now + 0.2);
        }
        break;
        
      case 'itemPositive': // ポジティブアイテム（高音で明るい）
        {
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();
          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(ctx.destination);
          osc1.frequency.value = 1000;
          osc2.frequency.value = 1200;
          osc1.type = 'sine';
          osc2.type = 'sine';
          gain.gain.setValueAtTime(0.3, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
          osc1.start(now);
          osc2.start(now);
          osc1.stop(now + 0.3);
          osc2.stop(now + 0.3);
        }
        break;
        
      case 'itemNegative': // ネガティブアイテム（低音で暗い）
        {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.value = 100;
          osc.type = 'sawtooth';
          gain.gain.setValueAtTime(0.4, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
          osc.start(now);
          osc.stop(now + 0.4);
        }
        break;
        
      case 'paddleGrow': // パドル拡大音（マリオのキノコ風）
        {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = 'square';
          gain.gain.setValueAtTime(0.3, now);
          
          // 音程を上昇させる
          osc.frequency.setValueAtTime(400, now);
          osc.frequency.exponentialRampToValueAtTime(800, now + 0.3);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
          osc.start(now);
          osc.stop(now + 0.3);
        }
        break;
        
      case 'paddleShrink': // パドル縮小音（ダメージ音風）
        {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = 'sawtooth';
          gain.gain.setValueAtTime(0.4, now);
          
          // 音程を下降させる
          osc.frequency.setValueAtTime(500, now);
          osc.frequency.exponentialRampToValueAtTime(100, now + 0.4);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
          osc.start(now);
          osc.stop(now + 0.4);
        }
        break;
        
      case 'stageClear': // ステージクリア音（3秒の派手なファンファーレ）
        {
          // メロディライン
          const notes = [523, 659, 784, 1047]; // C, E, G, C (高)
          notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = freq;
            osc.type = 'sine';
            const startTime = now + i * 0.4;
            gain.gain.setValueAtTime(0.4, startTime);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);
            osc.start(startTime);
            osc.stop(startTime + 0.4);
          });
          
          // ベース音
          const bass = ctx.createOscillator();
          const bassGain = ctx.createGain();
          bass.connect(bassGain);
          bassGain.connect(ctx.destination);
          bass.frequency.value = 130;
          bass.type = 'square';
          bassGain.gain.setValueAtTime(0.2, now);
          bassGain.gain.exponentialRampToValueAtTime(0.01, now + 2);
          bass.start(now);
          bass.stop(now + 2);
        }
        break;
        
      case 'gameOver': // ゲームオーバー音
        {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.value = 150;
          osc.type = 'sawtooth';
          gain.gain.setValueAtTime(0.3, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
          osc.start(now);
          osc.stop(now + 0.8);
        }
        break;
    }
  } catch (e) {
    console.error('サウンド再生エラー:', e);
  }
}

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
let paddleSpeed = 0.75; // デフォルト速度（0.75倍に設定）
const PADDLE_BASE_SPEED = 0.75;
let paddleEffectTimer = null; // タイマー管理

// 描画の最適化：色を事前定義
const COLORS = {
  paddleNormal: '#00d4ff',
  paddleFast: '#FFD700',
  paddleSlow: '#555555',
  blockMain: '#00d4ff',
  blockBorder: '#00ffff',
  ballColor: 'white'
};

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

// 規則的な位置にブロックを生成（縦8列×横4行、上下均等配置）
function spawnRegularBlocks() {
  const rows = 8; // 縦8列
  const cols = 4; // 横4行
  const blockSpacing = BLOCK_WIDTH * 1.5; // ブロック1.5個分の間隔
  const startX = canvas.width - blockSpacing - (cols * (BLOCK_WIDTH + 8)); // 右端から余裕を持たせる
  
  const spacingY = 5; // 縦間隔
  const spacingX = 8; // 横間隔
  
  // 8列のブロックの総高さを計算
  const totalHeight = rows * BLOCK_HEIGHT + (rows - 1) * spacingY;
  
  // 上下の余白が均等になるように開始位置を計算
  const startY = (canvas.height - totalHeight) / 2;
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = startX + col * (BLOCK_WIDTH + spacingX);
      const y = startY + row * (BLOCK_HEIGHT + spacingY);
      
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

// マウスイベント（速度調整機能付き）
canvas.addEventListener("mousemove", e => {
  if (gamePaused || !gameRunning) return;
  
  const rect = canvas.getBoundingClientRect();
  const targetY = e.clientY - rect.top - paddleHeight / 2;
  
  // パドル速度に応じて移動（スムーズな追従）
  paddleY += (targetY - paddleY) * paddleSpeed;
  
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

  // パドルの描画（状態に応じて装飾）
  if (paddleSpeed > 1) {
    // 高速化状態：スター状態風（金色で輝く）
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(0, paddleY, paddleWidth, paddleHeight);
    ctx.strokeStyle = '#FFFF00';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, paddleY, paddleWidth, paddleHeight);
  } else if (paddleSpeed < 0.5) {
    // スロー状態：石化・劣化風（グレーで暗い）
    ctx.fillStyle = '#555555';
    ctx.fillRect(0, paddleY, paddleWidth, paddleHeight);
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, paddleY, paddleWidth, paddleHeight);
  } else {
    // 通常状態：SF風サイバーデザイン
    ctx.fillStyle = '#00d4ff';
    ctx.fillRect(0, paddleY, paddleWidth, paddleHeight);
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, paddleY, paddleWidth, paddleHeight);
  }
  
  // ブロックの描画（ポリゴン風の煌びやかなデザイン）
  blocks.forEach(block => {
    if (block.alive) {
      // グラデーション背景
      const gradient = ctx.createLinearGradient(block.x, block.y, block.x + block.width, block.y + block.height);
      gradient.addColorStop(0, '#00f7ff');
      gradient.addColorStop(0.3, '#00d4ff');
      gradient.addColorStop(0.7, '#0088ff');
      gradient.addColorStop(1, '#004488');
      ctx.fillStyle = gradient;
      ctx.fillRect(block.x, block.y, block.width, block.height);
      
      // 光る外枠
      ctx.strokeStyle = '#00ffff';
      ctx.lineWidth = 2;
      ctx.strokeRect(block.x, block.y, block.width, block.height);
      
      // 内側のハイライト（ポリゴン感）
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 1;
      ctx.strokeRect(block.x + 2, block.y + 2, block.width - 4, block.height - 4);
      
      // 対角線（ポリゴン風）
      ctx.strokeStyle = 'rgba(0, 247, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(block.x, block.y);
      ctx.lineTo(block.x + block.width, block.y + block.height);
      ctx.stroke();
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
        playSound('paddleHit'); // パドル専用の効果音
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
    
    // ブロックとの衝突（最適化版）
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      if (!block.alive) continue;
      
      if (ball.x + BALL_RADIUS > block.x &&
          ball.x - BALL_RADIUS < block.x + block.width &&
          ball.y + BALL_RADIUS > block.y &&
          ball.y - BALL_RADIUS < block.y + block.height) {
          
          // ブロック破壊
          block.alive = false;
          playSound('blockBreak'); // 効果音
          
          // より確実な反射判定
          const ballCenterX = ball.x;
          const ballCenterY = ball.y;
          const blockCenterX = block.x + block.width / 2;
          const blockCenterY = block.y + block.height / 2;
          
          const dx = Math.abs(ballCenterX - blockCenterX);
          const dy = Math.abs(ballCenterY - blockCenterY);
          
          const overlapX = (BALL_RADIUS + block.width / 2) - dx;
          const overlapY = (BALL_RADIUS + block.height / 2) - dy;
          
          // どちらの軸でより深く侵入しているかで判定
          if (overlapX < overlapY) {
            // 横から当たった
            ball.speedX = -ball.speedX;
            // ボールを押し出す
            if (ballCenterX < blockCenterX) {
              ball.x -= overlapX;
            } else {
              ball.x += overlapX;
            }
          } else {
            // 縦から当たった
            ball.speedY = -ball.speedY;
            // ボールを押し出す
            if (ballCenterY < blockCenterY) {
              ball.y -= overlapY;
            } else {
              ball.y += overlapY;
            }
          }
          
          addPoint(5);
          
          // アイテムをランダムに生成（30%の確率）
          if (Math.random() < 0.3) {
            spawnItem(block.x + block.width / 2, block.y + block.height / 2);
          }
          
          break; // 1つのブロックに当たったらループ終了（最適化）
        }
    }
  });
  
  // アイテムの移動
  items.forEach((item, index) => {
    item.x -= ITEM_SPEED; // 左に移動（パドルに向かって）
    
    // パドルとの衝突判定（より正確に）
    if (item.x - ITEM_SIZE/2 < paddleWidth &&
        item.x + ITEM_SIZE/2 > 0 &&
        item.y + ITEM_SIZE/2 > paddleY &&
        item.y - ITEM_SIZE/2 < paddleY + paddleHeight) {
      // アイテムの種類に応じて効果音を分ける
      const positiveItems = ['paddleLarge', 'multiBall', 'paddleFast'];
      const negativeItems = ['paddleSmall', 'removeBall', 'paddleSlow'];
      
      if (positiveItems.includes(item.effect)) {
        playSound('itemPositive');
      } else if (negativeItems.includes(item.effect)) {
        playSound('itemNegative');
      }
      
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
      playSound('paddleGrow'); // パドル拡大音
      if (paddleEffectTimer) clearTimeout(paddleEffectTimer);
      paddleEffectTimer = setTimeout(() => {
        paddleHeight = PADDLE_BASE_HEIGHT;
        playSound('paddleShrink'); // 元に戻る音
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
      // パドルの移動速度を遅くする
      paddleSpeed = 0.3; // デフォルト0.75の約40%
      canvas.style.cursor = 'not-allowed';
      if (paddleEffectTimer) clearTimeout(paddleEffectTimer);
      paddleEffectTimer = setTimeout(() => {
        paddleSpeed = PADDLE_BASE_SPEED;
        canvas.style.cursor = 'default';
      }, 8000);
      break;
      
    case 'paddleSmall':
      paddleHeight = Math.max(paddleHeight * 0.5, 50);
      playSound('paddleShrink'); // パドル縮小音
      if (paddleEffectTimer) clearTimeout(paddleEffectTimer);
      paddleEffectTimer = setTimeout(() => {
        paddleHeight = PADDLE_BASE_HEIGHT;
        playSound('paddleGrow'); // 元に戻る音
      }, 8000);
      break;
      
    case 'paddleFast':
      // パドルの移動速度を速くする
      paddleSpeed = 1.5; // デフォルト0.75の2倍
      canvas.style.cursor = 'move';
      if (paddleEffectTimer) clearTimeout(paddleEffectTimer);
      paddleEffectTimer = setTimeout(() => {
        paddleSpeed = PADDLE_BASE_SPEED;
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
  playSound('gameOver'); // 効果音
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
  paddleSpeed = PADDLE_BASE_SPEED; // パドル速度をリセット
  canvas.style.cursor = 'default';
  
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
  playSound('stageClear'); // 3秒の派手なファンファーレ
  
  // エフェクト演出（画面フラッシュ）
  let flashCount = 0;
  const flashInterval = setInterval(() => {
    canvas.style.filter = flashCount % 2 === 0 ? 'brightness(2)' : 'brightness(1)';
    flashCount++;
    if (flashCount > 6) {
      clearInterval(flashInterval);
      canvas.style.filter = 'brightness(1)';
    }
  }, 200);
  
  clearedStageElement.textContent = currentStage;
  stageScoreElement.textContent = score;
  
  // 少し遅延してからクリア画面を表示（演出のため）
  setTimeout(() => {
    stageClearScreen.style.display = "block";
  }, 1000);
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

// サウンドトグルボタン（DOMContentLoaded後に実行）
document.addEventListener('DOMContentLoaded', function() {
  const soundToggleBtn = document.getElementById('soundToggle');
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', function() {
      soundEnabled = !soundEnabled;
      
      // AudioContextを初期化（ユーザー操作が必要）
      if (soundEnabled) {
        initAudioContext();
        soundToggleBtn.textContent = '🔊 サウンドON';
        soundToggleBtn.classList.remove('muted');
        playSound('itemGet'); // テストサウンド
      } else {
        soundToggleBtn.textContent = '🔇 サウンドOFF';
        soundToggleBtn.classList.add('muted');
      }
    });
  }
});

// 初期化
initBlocks();
updateUI();
setInterval(gameLoop, 1000 / 60);
