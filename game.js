// Vice Heist - Frontend Game Logic
// Connects to StakeEngine Web SDK for provably fair outcomes

const SYMBOLS = {
    diamond: '💎',
    gold_bar: '🟨',
    cash_stack: '💵',
    heist_bag: '💼',
    vault: '🏦',
    A: 'A',
    K: 'K',
    Q: 'Q',
    J: 'J',
    wild: '🃏',
    scatter: '⭐',
    bonus_vault: '🗝️'
};

const REEL_HEIGHT = 3;
const NUM_REELS = 5;

let balance = 1000.00;
let isSpinning = false;

// Initialize reels
function initReels() {
    for (let i = 0; i < NUM_REELS; i++) {
        const reel = document.getElementById(`reel${i}`);
        reel.innerHTML = '';
        for (let j = 0; j < REEL_HEIGHT; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.textContent = SYMBOLS.A;
            reel.appendChild(cell);
        }
    }
}

// Spin the reels
async function spin() {
    if (isSpinning) return;
    
    const bet = parseFloat(document.getElementById('betAmount').value);
    if (bet > balance) {
        showMessage('Insufficient balance!');
        return;
    }
    
    isSpinning = true;
    document.getElementById('spinBtn').disabled = true;
    document.getElementById('bonusBtn').disabled = true;
    
    balance -= bet;
    updateBalance();
    showMessage('Spinning...');
    
    // Animate reels
    animateReels();
    
    // In production, this calls the StakeEngine Web SDK
    // For now, simulate a result
    setTimeout(() => {
        const result = generateRandomResult();
        displayResult(result);
        
        const win = calculateWin(result, bet);
        if (win > 0) {
            balance += win;
            updateBalance();
            showMessage(`WIN! $${win.toFixed(2)}`);
            highlightWinningLines(result);
        } else {
            showMessage('No win. Try again!');
        }
        
        isSpinning = false;
        document.getElementById('spinBtn').disabled = false;
        document.getElementById('bonusBtn').disabled = false;
    }, 2000);
}

// Buy bonus feature
async function buyBonus() {
    if (isSpinning) return;
    
    const bet = parseFloat(document.getElementById('betAmount').value);
    const bonusCost = bet * 100;
    
    if (bonusCost > balance) {
        showMessage('Insufficient balance for bonus buy!');
        return;
    }
    
    isSpinning = true;
    balance -= bonusCost;
    updateBalance();
    showMessage('Bonus round activated! Free spins incoming...');
    
    // Trigger free games
    setTimeout(() => {
        showMessage('10 Free Spins awarded!');
        isSpinning = false;
        document.getElementById('spinBtn').disabled = false;
        document.getElementById('bonusBtn').disabled = false;
    }, 1500);
}

// Animate reels spinning
function animateReels() {
    for (let i = 0; i < NUM_REELS; i++) {
        const reel = document.getElementById(`reel${i}`);
        reel.classList.add('spinning');
        setTimeout(() => {
            reel.classList.remove('spinning');
        }, 1500 + (i * 200));
    }
}

// Generate random result (placeholder - SDK will provide real result)
function generateRandomResult() {
    const symbolKeys = Object.keys(SYMBOLS);
    const result = [];
    for (let i = 0; i < NUM_REELS; i++) {
        const reel = [];
        for (let j = 0; j < REEL_HEIGHT; j++) {
            const randomSymbol = symbolKeys[Math.floor(Math.random() * symbolKeys.length)];
            reel.push(randomSymbol);
        }
        result.push(reel);
    }
    return result;
}

// Display result on reels
function displayResult(result) {
    for (let i = 0; i < NUM_REELS; i++) {
        const reel = document.getElementById(`reel${i}`);
        const cells = reel.querySelectorAll('.cell');
        for (let j = 0; j < REEL_HEIGHT; j++) {
            cells[j].textContent = SYMBOLS[result[i][j]];
            cells[j].className = 'cell';
        }
    }
}

// Calculate win (placeholder logic)
function calculateWin(result, bet) {
    // Simple placeholder - checks for 3+ matching symbols on middle row
    const middleRow = result.map(reel => reel[1]);
    let win = 0;
    
    // Check for scatters
    const scatterCount = middleRow.filter(s => s === 'scatter').length;
    if (scatterCount >= 3) {
        win += bet * 10;
    }
    
    // Check for 3+ of same symbol
    const counts = {};
    middleRow.forEach(s => counts[s] = (counts[s] || 0) + 1);
    for (const [symbol, count] of Object.entries(counts)) {
        if (count >= 3 && symbol !== 'scatter') {
            const multipliers = {diamond: 50, gold_bar: 30, cash_stack: 20, heist_bag: 15, vault: 10, A: 5, K: 4, Q: 3, J: 2, wild: 50};
            win += bet * (multipliers[symbol] || 1) * (count - 2);
        }
    }
    
    return win;
}

// Highlight winning lines
function highlightWinningLines(result) {
    // Placeholder - would highlight actual winning paylines
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => cell.style.background = '#333');
    setTimeout(() => {
        cells.forEach(cell => cell.style.background = '');
    }, 1000);
}

// Update balance display
function updateBalance() {
    document.getElementById('balance').textContent = balance.toFixed(2);
}

// Show message
function showMessage(msg) {
    document.getElementById('message').textContent = msg;
}

// Event listeners
document.getElementById('spinBtn').addEventListener('click', spin);
document.getElementById('bonusBtn').addEventListener('click', buyBonus);

// Initialize
initReels();
