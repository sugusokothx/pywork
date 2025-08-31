// --- 1. 初期設定 ---

// DOM要素の取得
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const player1ScoreElem = document.getElementById('player1-score');
const player2ScoreElem = document.getElementById('player2-score');
const startButton = document.getElementById('start-button');
const stopButton = document.getElementById('stop-button');

// ゲームの定数
const PADDLE_WIDTH = 15;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 15;
const PADDLE_SPEED = 8;

// --- 2. ゲームの状態とオブジェクト -- -

// ゲームの状態
let gameRunning = false;
let animationId;

// プレイヤー1のパドル
const player1 = {
    x: 10,
    y: canvas.height / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dy: 0
};

// プレイヤー2 (AI) のパドル
const player2 = {
    x: canvas.width - PADDLE_WIDTH - 10,
    y: canvas.height / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT
};

// ボール
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: BALL_SIZE,
    height: BALL_SIZE,
    dx: 2.5,
    dy: 2.5
};

// スコア
let player1Score = 0;
let player2Score = 0;

// --- 3. 描画関数 ---

function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawNet() {
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 4;
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
}

// --- 4. ゲームロジック ---

// ゲームを初期状態にリセットする関数
function resetGame() {
    // スコアをリセット
    player1Score = 0;
    player2Score = 0;
    player1ScoreElem.textContent = player1Score;
    player2ScoreElem.textContent = player2Score;

    // パドルとボールの位置をリセット
    player1.y = canvas.height / 2 - PADDLE_HEIGHT / 2;
    player2.y = canvas.height / 2 - PADDLE_HEIGHT / 2;
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = 2.5;
    ball.dy = 2.5;

    // 画面を再描画
    render();
}

function update() {
    if (!gameRunning) return;

    player1.y += player1.dy;
    if (player1.y < 0) player1.y = 0;
    if (player1.y + PADDLE_HEIGHT > canvas.height) player1.y = canvas.height - PADDLE_HEIGHT;

    player2.y += (ball.y - (player2.y + PADDLE_HEIGHT / 2)) * 0.1;

    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.y < 0 || ball.y + BALL_SIZE > canvas.height) {
        ball.dy = -ball.dy;
    }

    if (
        (ball.dx < 0 && ball.x < player1.x + PADDLE_WIDTH && ball.y + BALL_SIZE > player1.y && ball.y < player1.y + PADDLE_HEIGHT) ||
        (ball.dx > 0 && ball.x + BALL_SIZE > player2.x && ball.y + BALL_SIZE > player2.y && ball.y < player2.y + PADDLE_HEIGHT)
    ) {
        ball.dx = -ball.dx;
    }

    if (ball.x < 0) {
        player2Score++;
        player2ScoreElem.textContent = player2Score;
        resetBallPosition();
    } else if (ball.x + BALL_SIZE > canvas.width) {
        player1Score++;
        player1ScoreElem.textContent = player1Score;
        resetBallPosition();
    }
}

// 得点後のボール位置リセット
function resetBallPosition() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = -ball.dx;
    ball.dy = (Math.random() > 0.5 ? 1 : -1) * 2.5;
}

// --- 5. 描画とゲームループ ---

function render() {
    drawRect(0, 0, canvas.width, canvas.height, 'black');
    drawNet();
    drawRect(player1.x, player1.y, player1.width, player1.height, 'white');
    drawRect(player2.x, player2.y, player2.width, player2.height, 'white');
    drawRect(ball.x, ball.y, ball.width, ball.height, 'white');
}

function gameLoop() {
    update();
    render();
    animationId = requestAnimationFrame(gameLoop);
}

// --- 6. イベントリスナー ---

// 開始ボタン
startButton.addEventListener('click', () => {
    if (!gameRunning) {
        resetGame();
        gameRunning = true;
        gameLoop();
    }
});

// 終了ボタン
stopButton.addEventListener('click', () => {
    if (gameRunning) {
        gameRunning = false;
        cancelAnimationFrame(animationId);
        resetGame();
    }
});

// キーボード操作
document.addEventListener('keydown', (e) => {
    if (e.key === 'w') player1.dy = -PADDLE_SPEED;
    else if (e.key === 's') player1.dy = PADDLE_SPEED;
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'w' || e.key === 's') player1.dy = 0;
});

// タッチ操作
const touchUp = document.getElementById('touch-up');
const touchDown = document.getElementById('touch-down');

touchUp.addEventListener('touchstart', (e) => {
    e.preventDefault();
    player1.dy = -PADDLE_SPEED;
});
touchUp.addEventListener('touchend', (e) => {
    e.preventDefault();
    player1.dy = 0;
});

touchDown.addEventListener('touchstart', (e) => {
    e.preventDefault();
    player1.dy = PADDLE_SPEED;
});
touchDown.addEventListener('touchend', (e) => {
    e.preventDefault();
    player1.dy = 0;
});

// --- 7. 初期描画 ---
// ページ読み込み時に初期画面を描画
render();