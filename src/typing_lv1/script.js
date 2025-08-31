// --- 1. DOM要素の取得 ---
const timerElem = document.getElementById('timer');
const scoreElem = document.getElementById('score');
const quitButton = document.getElementById('quit-button');
const feedbackElem = document.getElementById('feedback');
const wordDisplayElem = document.getElementById('word-display');
const translationDisplayElem = document.getElementById('translation-display'); // ★ 追加
const wordInputElem = document.getElementById('word-input');
const startButton = document.getElementById('start-button');
const resultScreen = document.getElementById('result-screen');
const finalScoreElem = document.getElementById('final-score');
const restartButton = document.getElementById('restart-button');

// --- 2. ゲームの状態管理 ---
let words = [];
let score = 0;
let time = 60;
let isPlaying = false;
let timerInterval;

// --- 3. 初期化処理 ---
async function initializeGame() {
    try {
        const response = await fetch('words.json');
        words = await response.json();
        startButton.disabled = false;
        startButton.textContent = '開始';
    } catch (error) {
        console.error('単語ファイルの読み込みに失敗しました:', error);
        wordDisplayElem.textContent = 'エラーが発生しました';
    }
}

// --- 4. イベントリスナー ---
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);
quitButton.addEventListener('click', () => { if (isPlaying) endGame(); });
wordInputElem.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        checkInputOnEnter();
    }
});

// --- 5. ゲームロジック ---

function startGame() {
    score = 0;
    time = 60;
    isPlaying = true;
    scoreElem.textContent = 'Score: 0';
    timerElem.textContent = time;

    wordInputElem.disabled = false;
    wordInputElem.value = '';
    wordInputElem.focus();

    resultScreen.classList.add('hidden');
    startButton.classList.add('hidden');
    quitButton.classList.remove('hidden');

    showNewWord();
    timerInterval = setInterval(countdown, 1000);
}

function checkInputOnEnter() {
    if (!isPlaying) return;

    // 入力値と問題文を両方とも小文字に変換し、前後の空白を削除して比較
    const typedValue = wordInputElem.value.toLowerCase().trim();
    const currentSentence = wordDisplayElem.textContent.toLowerCase();

    if (typedValue === currentSentence) {
        // 正解の場合
        score++;
        scoreElem.textContent = `Score: ${score}`;
        showFeedback(true);
        showNewWord();
    } else {
        // 不正解の場合
        showFeedback(false);
    }
    // 入力欄は常にクリア
    wordInputElem.value = '';
}

function showFeedback(isCorrect) {
    if (isCorrect) {
        feedbackElem.textContent = '○';
        feedbackElem.className = 'correct';
    } else {
        feedbackElem.textContent = '❌';
        feedbackElem.className = 'incorrect';
    }
    // フェードイン
    feedbackElem.style.opacity = 1;
    // 0.5秒後にフェードアウト
    setTimeout(() => {
        feedbackElem.style.opacity = 0;
    }, 500);
}

function showNewWord() {
    const randomIndex = Math.floor(Math.random() * words.length);
    const wordObject = words[randomIndex];
    wordDisplayElem.textContent = wordObject.en;
    translationDisplayElem.textContent = wordObject.ja;
}

function countdown() {
    if (time > 0) {
        time--;
        timerElem.textContent = time;
    } else {
        endGame();
    }
}

function endGame() {
    isPlaying = false;
    clearInterval(timerInterval);

    finalScoreElem.textContent = score;
    resultScreen.classList.remove('hidden');
    wordInputElem.disabled = true;
    quitButton.classList.add('hidden');
}

// --- 6. 初期状態の設定 ---
wordInputElem.disabled = true;
startButton.disabled = true;
startButton.textContent = '読込中...';
initializeGame();
