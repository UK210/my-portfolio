const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// ゲーム設定
const BUBBLE_RADIUS = 20;
const ROWS = 8;
const COLS = 11;
const COLORS = ['#ff0066', '#00ff00', '#0088ff', '#ffff00', '#ff6600', '#ff00ff'];

// ゲーム状態
let gameRunning = true;
let gamePaused = false;
let score = 0;
let level = 1;
let highScore = localStorage.getItem('bubbleHighScore') || 0;
let soundEnabled = true;
let audioContext = null;
let shootCount = 0; // 発射カウント
const DEADLINE_Y = canvas.height - 100; // デッドライン位置

// バブル配列
let bubbles = [];
let currentBubble = null;
let nextBubble = null;
let shootingBubble = null; // 発射中のバブル

// 発射設定
let shooterX = canvas.width / 2;
let shooterY = canvas.height - 50;
let aimAngle = -Math.PI / 2;

// UI要素参照は各関数内で取得

// AudioContext初期化
function initAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
}

// 効果音再生
function playSound(type) {
  if (!soundEnabled) return;
  
  try {
    const ctx = initAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    const now = ctx.currentTime;
    
    switch(type) {
      case 'shoot':
        osc.frequency.value = 400;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
        break;
      case 'pop':
        osc.frequency.value = 600;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
        break;
      case 'levelClear':
        const notes = [523, 659, 784, 1047];
        notes.forEach((freq, i) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.connect(g);
          g.connect(ctx.destination);
          o.frequency.value = freq;
          o.type = 'sine';
          const st = now + i * 0.3;
          g.gain.setValueAtTime(0.3, st);
          g.gain.exponentialRampToValueAtTime(0.01, st + 0.3);
          o.start(st);
          o.stop(st + 0.3);
        });
        break;
    }
  } catch (e) {
    console.error('サウンドエラー:', e);
  }
}

// バブル初期化
function initBubbles() {
  bubbles = [];
  for (let row = 0; row < 5; row++) {
    bubbles[row] = [];
    for (let col = 0; col < COLS; col++) {
      if (row % 2 === 1 && col === COLS - 1) {
        bubbles[row][col] = null;
      } else {
        bubbles[row][col] = {
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          x: col * (BUBBLE_RADIUS * 2) + (row % 2 === 1 ? BUBBLE_RADIUS : 0) + BUBBLE_RADIUS,
          y: row * (BUBBLE_RADIUS * 2) + BUBBLE_RADIUS,
          row: row,
          col: col
        };
      }
    }
  }
}

// 新しいバブルを生成
function createNewBubble() {
  return {
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    x: shooterX,
    y: shooterY,
    vx: 0,
    vy: 0
  };
}

// マウス操作
canvas.addEventListener('mousemove', (e) => {
  if (gamePaused || !gameRunning) return;
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;
  aimAngle = Math.atan2(mouseY - shooterY, mouseX - shooterX);
});

canvas.addEventListener('click', () => {
  if (gamePaused || !gameRunning || !currentBubble) return;
  shootBubble();
});

// キーボード操作
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    togglePause();
  }
});

// 上段に一列追加
function addNewRow() {
  // 既存のバブルを下に押し下げる
  for (let row = bubbles.length - 1; row >= 0; row--) {
    if (bubbles[row]) {
      bubbles[row + 1] = bubbles[row].map(bubble => {
        if (bubble) {
          return {
            ...bubble,
            row: bubble.row + 1,
            y: bubble.y + BUBBLE_RADIUS * 2
          };
        }
        return null;
      });
    }
  }
  
  // 新しい一列を上段に追加
  bubbles[0] = [];
  for (let col = 0; col < COLS; col++) {
    bubbles[0][col] = {
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      x: col * (BUBBLE_RADIUS * 2) + BUBBLE_RADIUS,
      y: BUBBLE_RADIUS,
      row: 0,
      col: col
    };
  }
}

// バブル発射
function shootBubble() {
  if (!currentBubble || shootingBubble) return;
  
  const speed = 10;
  shootingBubble = {
    color: currentBubble.color, // 色をコピー
    x: shooterX,
    y: shooterY,
    vx: Math.cos(aimAngle) * speed,
    vy: Math.sin(aimAngle) * speed
  };
  
  playSound('shoot');
  
  // 次のバブルを準備
  currentBubble = nextBubble;
  nextBubble = createNewBubble();
  
  // 発射カウント増加
  shootCount++;
  
  // 5回毎に新しい行を追加
  if (shootCount % 5 === 0) {
    addNewRow();
  }
}

// 描画
function drawEverything() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // デッドライン（点線）
  ctx.strokeStyle = '#ff0066';
  ctx.lineWidth = 2;
  ctx.setLineDash([10, 5]);
  ctx.beginPath();
  ctx.moveTo(0, DEADLINE_Y);
  ctx.lineTo(canvas.width, DEADLINE_Y);
  ctx.stroke();
  ctx.setLineDash([]);
  
  // 配置されたバブル
  for (let row = 0; row < bubbles.length; row++) {
    for (let col = 0; col < bubbles[row].length; col++) {
      const bubble = bubbles[row][col];
      if (bubble) {
        drawBubble(bubble.x, bubble.y, bubble.color);
      }
    }
  }
  
  // デッドライン超過チェック（描画後に1回だけ）
  checkDeadline();
  
  // 発射中のバブル
  if (shootingBubble) {
    drawBubble(shootingBubble.x, shootingBubble.y, shootingBubble.color);
  }
  
  // 現在のバブル（発射台）
  if (currentBubble) {
    drawBubble(shooterX, shooterY, currentBubble.color);
  }
  
  // 次バブルのプレビュー
  if (nextBubble) {
    drawBubble(shooterX + 60, shooterY, nextBubble.color, 0.7);
    ctx.fillStyle = '#00f7ff';
    ctx.font = '12px Rajdhani';
    ctx.textAlign = 'center';
    ctx.fillText('NEXT', shooterX + 60, shooterY + 35);
  }
  
  // シューター
  drawShooter();
  
  // 照準線
  if (!gamePaused && gameRunning) {
    ctx.strokeStyle = 'rgba(0, 247, 255, 0.5)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(shooterX, shooterY);
    ctx.lineTo(shooterX + Math.cos(aimAngle) * 200, shooterY + Math.sin(aimAngle) * 200);
    ctx.stroke();
    ctx.setLineDash([]);
  }
}

// バブル描画
function drawBubble(x, y, color, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  
  // グラデーション
  const gradient = ctx.createRadialGradient(x - 5, y - 5, 5, x, y, BUBBLE_RADIUS);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
  gradient.addColorStop(0.5, color);
  gradient.addColorStop(1, color);
  
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x, y, BUBBLE_RADIUS, 0, Math.PI * 2);
  ctx.fill();
  
  // 光る枠
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.stroke();
  
  ctx.restore();
}

// シューター描画
function drawShooter() {
  ctx.fillStyle = '#00d4ff';
  ctx.beginPath();
  ctx.arc(shooterX, shooterY, 15, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#00f7ff';
  ctx.lineWidth = 3;
  ctx.stroke();
}

// ゲームループ
function moveEverything() {
  if (!gameRunning || gamePaused) return;
  
  if (shootingBubble) {
    // バブルを移動
    shootingBubble.x += shootingBubble.vx;
    shootingBubble.y += shootingBubble.vy;
    
    // 左右の壁で反射
    if (shootingBubble.x - BUBBLE_RADIUS <= 0) {
      shootingBubble.x = BUBBLE_RADIUS;
      shootingBubble.vx *= -1;
    }
    if (shootingBubble.x + BUBBLE_RADIUS >= canvas.width) {
      shootingBubble.x = canvas.width - BUBBLE_RADIUS;
      shootingBubble.vx *= -1;
    }
    
    // 上部到達 - くっつける
    if (shootingBubble.y - BUBBLE_RADIUS <= 0) {
      attachBubble(shootingBubble);
      shootingBubble = null;
      return;
    }
    
    // 他のバブルに接触チェック
    if (checkCollision(shootingBubble)) {
      attachBubble(shootingBubble);
      shootingBubble = null;
      return;
    }
  }
}

// 最も近いバブル位置を見つける
function findNearestSlot(x, y) {
  let minDist = Infinity;
  let bestRow = 0;
  let bestCol = 0;
  
  for (let row = 0; row < ROWS; row++) {
    const colCount = row % 2 === 1 ? COLS - 1 : COLS;
    for (let col = 0; col < colCount; col++) {
      const bx = col * (BUBBLE_RADIUS * 2) + (row % 2 === 1 ? BUBBLE_RADIUS : 0) + BUBBLE_RADIUS;
      const by = row * (BUBBLE_RADIUS * 2) + BUBBLE_RADIUS;
      const dist = Math.sqrt((x - bx) ** 2 + (y - by) ** 2);
      
      if (dist < minDist && (!bubbles[row] || !bubbles[row][col])) {
        minDist = dist;
        bestRow = row;
        bestCol = col;
      }
    }
  }
  
  return { row: bestRow, col: bestCol };
}

// バブル配置
function attachBubble(bubble) {
  const slot = findNearestSlot(bubble.x, bubble.y);
  const row = slot.row;
  const col = slot.col;
  
  if (!bubbles[row]) bubbles[row] = [];
  
  bubbles[row][col] = {
    color: bubble.color,
    x: col * (BUBBLE_RADIUS * 2) + (row % 2 === 1 ? BUBBLE_RADIUS : 0) + BUBBLE_RADIUS,
    y: row * (BUBBLE_RADIUS * 2) + BUBBLE_RADIUS,
    row: row,
    col: col
  };
  
  checkMatches(row, col);
}

// デッドライン超過チェック
function checkDeadline() {
  for (let row = 0; row < bubbles.length; row++) {
    if (bubbles[row]) {
      for (let col = 0; col < bubbles[row].length; col++) {
        const bubble = bubbles[row][col];
        if (bubble && bubble.y + BUBBLE_RADIUS > DEADLINE_Y) {
          if (gameRunning) {
            gameOver();
          }
          return;
        }
      }
    }
  }
}

// 衝突判定（当たったらtrue）
function checkCollision(bubble) {
  for (let row = 0; row < bubbles.length; row++) {
    if (bubbles[row]) {
      for (let col = 0; col < bubbles[row].length; col++) {
        const b = bubbles[row][col];
        if (b) {
          const dist = Math.sqrt((bubble.x - b.x) ** 2 + (bubble.y - b.y) ** 2);
          if (dist < BUBBLE_RADIUS * 2) {
            return true; // 衝突した
          }
        }
      }
    }
  }
  return false; // 衝突していない
}

// マッチング判定
function checkMatches(row, col) {
  const color = bubbles[row][col].color;
  const toCheck = [[row, col]];
  const checked = new Set();
  const matches = [];
  
  while (toCheck.length > 0) {
    const [r, c] = toCheck.pop();
    const key = `${r},${c}`;
    
    if (checked.has(key)) continue;
    checked.add(key);
    
    if (bubbles[r] && bubbles[r][c] && bubbles[r][c].color === color) {
      matches.push([r, c]);
      
      // 隣接バブルをチェック
      const neighbors = getNeighbors(r, c);
      neighbors.forEach(([nr, nc]) => {
        if (!checked.has(`${nr},${nc}`)) {
          toCheck.push([nr, nc]);
        }
      });
    }
  }
  
  if (matches.length >= 3) {
    matches.forEach(([r, c]) => {
      bubbles[r][c] = null;
    });
    score += matches.length * 10;
    playSound('pop');
    updateUI();
    
    // レベルクリア判定
    checkLevelClear();
  }
}

// 隣接バブル取得
function getNeighbors(row, col) {
  const neighbors = [];
  const offsets = row % 2 === 0 
    ? [[-1, -1], [-1, 0], [0, -1], [0, 1], [1, -1], [1, 0]]
    : [[-1, 0], [-1, 1], [0, -1], [0, 1], [1, 0], [1, 1]];
  
  offsets.forEach(([dr, dc]) => {
    const nr = row + dr;
    const nc = col + dc;
    if (nr >= 0 && nr < bubbles.length && nc >= 0 && nc < COLS) {
      neighbors.push([nr, nc]);
    }
  });
  
  return neighbors;
}

// レベルクリア判定
function checkLevelClear() {
  let hasBubbles = false;
  for (let row = 0; row < bubbles.length; row++) {
    for (let col = 0; col < bubbles[row].length; col++) {
      if (bubbles[row][col]) {
        hasBubbles = true;
        break;
      }
    }
    if (hasBubbles) break;
  }
  
  if (!hasBubbles) {
    levelClear();
  }
}

// レベルクリア
function levelClear() {
  gamePaused = true;
  playSound('levelClear');
  document.getElementById('clearedLevel').textContent = level;
  document.getElementById('levelScore').textContent = score;
  document.getElementById('levelClearScreen').style.display = 'block';
}

// 次のレベル
function nextLevel() {
  level++;
  document.getElementById('levelClearScreen').style.display = 'none';
  gamePaused = false;
  shootingBubble = null; // 発射中のバブルをクリア
  initBubbles();
  currentBubble = createNewBubble();
  nextBubble = createNewBubble();
  updateUI();
}

// ゲームオーバー
function gameOver() {
  gameRunning = false;
  const finalScoreElement = document.getElementById('finalScore');
  finalScoreElement.textContent = score;
  
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('bubbleHighScore', highScore);
    finalScoreElement.textContent += ' 🎉 新記録！';
  }
  
  document.getElementById('gameOverScreen').style.display = 'block';
}

// ゲーム再開
function restartGame() {
  gameRunning = true;
  gamePaused = false;
  score = 0;
  level = 1;
  shootCount = 0; // 発射カウントリセット
  shootingBubble = null; // 発射中のバブルをクリア
  
  initBubbles();
  currentBubble = createNewBubble();
  nextBubble = createNewBubble();
  
  document.getElementById('gameOverScreen').style.display = 'none';
  document.getElementById('pauseScreen').style.display = 'none';
  document.getElementById('levelClearScreen').style.display = 'none';
  
  updateUI();
}

// 一時中断
function togglePause() {
  if (!gameRunning) return;
  gamePaused = !gamePaused;
  document.getElementById('pauseScreen').style.display = gamePaused ? 'block' : 'none';
}

// UI更新
function updateUI() {
  document.getElementById('scoreDisplay').textContent = score;
  document.getElementById('highScoreDisplay').textContent = highScore;
  document.getElementById('levelDisplay').textContent = level;
}

// グローバル関数
window.restartGame = restartGame;
window.togglePause = togglePause;
window.nextLevel = nextLevel;

// サウンドトグル
document.addEventListener('DOMContentLoaded', function() {
  const soundToggleBtn = document.getElementById('soundToggle');
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', function() {
      soundEnabled = !soundEnabled;
      if (soundEnabled) {
        initAudioContext();
        soundToggleBtn.textContent = '🔊 サウンドON';
        soundToggleBtn.classList.remove('muted');
        playSound('shoot');
      } else {
        soundToggleBtn.textContent = '🔇 サウンドOFF';
        soundToggleBtn.classList.add('muted');
      }
    });
  }
});

// ゲームループ
function gameLoop() {
  moveEverything();
  drawEverything();
}

// 初期化
initBubbles();
currentBubble = createNewBubble();
nextBubble = createNewBubble();
shootingBubble = null;
updateUI();
setInterval(gameLoop, 1000 / 60);

