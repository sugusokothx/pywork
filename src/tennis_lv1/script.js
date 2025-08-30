// --- 1. 初期設定 --- 

// キャンバス要素と2Dコンテキストの取得
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// スコア要素の取得
const player1ScoreElem = document.getElementById('player1-score');
const player2ScoreElem = document.getElementById('player2-score');

// ゲームの定数
const PADDLE_WIDTH = 15;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 15;
const PADDLE_SPEED = 8;

// --- 2. ゲームオブジェクトの定義 ---

// プレイヤー1のパドル
const player1 = {
    x: 10,
    y: canvas.height / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dy: 0 // y方向の移動量
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
    dx: 5, // x方向の速度
    dy: 5  // y方向の速度
};

// スコア
let player1Score = 0;
let player2Score = 0;

// --- 3. 描画関数 ---

// 長方形を描画するヘルパー関数
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

// ネットを描画する関数
function drawNet() {
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 4;
    ctx.setLineDash([10, 10]); // 点線の設定
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]); // 点線設定をリセット
}

// --- 4. ゲームロジックの更新 ---

// ボールを初期位置に戻す関数
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    // ランダムな方向へボールを打ち出す
    ball.dx = -ball.dx; // 方向を反転
    ball.dy = (Math.random() > 0.5 ? 1 : -1) * 5;
}

// ゲームの状態を更新するメイン関数
function update() {
    // プレイヤー1のパドル移動
    player1.y += player1.dy;
    // パドルが画面外に出ないように制限
    if (player1.y < 0) player1.y = 0;
    if (player1.y + PADDLE_HEIGHT > canvas.height) player1.y = canvas.height - PADDLE_HEIGHT;

    // AI (プレイヤー2) のパドル移動 (ボールのy座標を追いかける)
    // 0.1を掛けることで、少し遅れて追いかけるようになり、AIが強すぎなくなる
    player2.y += (ball.y - (player2.y + PADDLE_HEIGHT / 2)) * 0.1;

    // ボールの移動
    ball.x += ball.dx;
    ball.y += ball.dy;

    // ボールと上下の壁の衝突判定
    if (ball.y < 0 || ball.y + BALL_SIZE > canvas.height) {
        ball.dy = -ball.dy; // y方向の速度を反転
    }

    // ボールとパドルの衝突判定
    if (
        (ball.dx < 0 && ball.x < player1.x + PADDLE_WIDTH && ball.y + BALL_SIZE > player1.y && ball.y < player1.y + PADDLE_HEIGHT) ||
        (ball.dx > 0 && ball.x + BALL_SIZE > player2.x && ball.y + BALL_SIZE > player2.y && ball.y < player2.y + PADDLE_HEIGHT)
    ) {
        ball.dx = -ball.dx; // x方向の速度を反転
    }

    // 得点判定
    if (ball.x < 0) { // プレイヤー2が得点
        player2Score++;
        player2ScoreElem.textContent = player2Score;
        resetBall();
    } else if (ball.x + BALL_SIZE > canvas.width) { // プレイヤー1が得点
        player1Score++;
        player1ScoreElem.textContent = player1Score;
        resetBall();
    }
}

// --- 5. 画面の描画 ---

function render() {
    // 画面をクリア
    drawRect(0, 0, canvas.width, canvas.height, 'black');

    // ネットを描画
    drawNet();

    // パドルを描画
    drawRect(player1.x, player1.y, player1.width, player1.height, 'white');
    drawRect(player2.x, player2.y, player2.width, player2.height, 'white');

    // ボールを描画
    drawRect(ball.x, ball.y, ball.width, ball.height, 'white');
}

// --- 6. ゲームループ ---

function gameLoop() {
    update(); // ゲーム状態の更新
    render(); // 画面の描画
    requestAnimationFrame(gameLoop); // 次のフレームを要求
}

// --- 7. イベントリスナー ---

// キーボード操作
document.addEventListener('keydown', (e) => {
    if (e.key === 'w') {
        player1.dy = -PADDLE_SPEED;
    } else if (e.key === 's') {
        player1.dy = PADDLE_SPEED;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'w' || e.key === 's') {
        player1.dy = 0;
    }
});

// タッチ操作
const touchUp = document.getElementById('touch-up');
const touchDown = document.getElementById('touch-down');

touchUp.addEventListener('touchstart', (e) => {
    e.preventDefault(); // 画面のスクロールを防ぐ
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


// ゲーム開始
requestAnimationFrame(gameLoop);
