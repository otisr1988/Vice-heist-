// Vice Heist - Game Logic
// StakeEngine Math SDK Integration

class ViceHeist {
    constructor() {
        this.balance = 1000.00;
        this.currentBet = 0;
        this.multiplier = 1.0;
        this.isPlaying = false;
        this.gameHistory = [];
        this.initStakeEngine();
        this.setupEventListeners();
        this.updateDisplay();
    }
    
    async initStakeEngine() {
        try {
            if (typeof StakeEngine !== 'undefined') {
                this.mathSDK = new StakeEngine.MathSDK({
                    gameId: 'vice-heist-v1',
                    provider: 'otisr1988'
                });
                console.log('StakeEngine Math SDK initialized');
            } else {
                console.warn('StakeEngine SDK not loaded - using fallback RNG');
                this.mathSDK = null;
            }
        } catch (error) {
            console.error('Failed to initialize StakeEngine:', error);
            this.mathSDK = null;
        }
    }
    
    setupEventListeners() {
        document.getElementById('place-bet').addEventListener('click', () => this.placeBet());
        document.getElementById('start-heist').addEventListener('click', () => this.startHeist());
        document.getElementById('cash-out').addEventListener('click', () => this.cashOut());
        document.getElementById('auto-play').addEventListener('click', () => this.autoPlay());
        document.getElementById('verify-fairness').addEventListener('click', () => this.verifyFairness());
    }
    
    placeBet() {
        const betAmount = parseFloat(document.getElementById('bet-amount').value);
        if (betAmount <= 0 || betAmount > this.balance) {
            this.log('Invalid bet amount or insufficient balance!');
            return;
        }
        this.currentBet = betAmount;
        this.balance -= betAmount;
        this.multiplier = 1.0;
        this.isPlaying = true;
        document.getElementById('start-heist').disabled = false;
        document.getElementById('cash-out').disabled = false;
        this.log(`Bet placed: $${betAmount.toFixed(2)}`);
        this.updateDisplay();
    }
    
    async startHeist() {
        if (!this.isPlaying) return;
        this.log('Heist in progress...');
        const result = await this.generateFairResult();
        const interval = setInterval(() => {
            this.multiplier += 0.1;
            document.getElementById('loot').textContent = (this.currentBet * this.multiplier).toFixed(2);
            if (this.multiplier >= result.crashPoint) {
                clearInterval(interval);
                this.crashHeist();
            }
        }, 100);
    }
    
    async generateFairResult() {
        if (this.mathSDK) {
            const seed = await this.mathSDK.generateSeed();
            const hash = await this.mathSDK.hashSeed(seed);
            const crashPoint = this.mathSDK.calculateCrashPoint(hash);
            document.getElementById('server-seed').textContent = seed.substring(0, 16) + '...';
            document.getElementById('hash').textContent = hash.substring(0, 16) + '...';
            return { seed, hash, crashPoint };
        } else {
            const crashPoint = Math.random() * 5 + 1;
            return { crashPoint };
        }
    }
    
    cashOut() {
        if (!this.isPlaying) return;
        const winnings = this.currentBet * this.multiplier;
        this.balance += winnings;
        this.gameHistory.push({ bet: this.currentBet, multiplier: this.multiplier, result: 'win', winnings: winnings });
        this.log(`Cashed out at ${this.multiplier.toFixed(2)}x! Won $${winnings.toFixed(2)}`);
        this.resetGame();
    }
    
    crashHeist() {
        this.gameHistory.push({ bet: this.currentBet, multiplier: this.multiplier, result: 'crash', winnings: 0 });
        this.log(`Heist crashed at ${this.multiplier.toFixed(2)}x! Lost $${this.currentBet.toFixed(2)}`);
        this.resetGame();
    }
    
    resetGame() {
        this.isPlaying = false;
        this.currentBet = 0;
        this.multiplier = 1.0;
        document.getElementById('start-heist').disabled = true;
        document.getElementById('cash-out').disabled = true;
        document.getElementById('loot').textContent = '0';
        this.updateDisplay();
    }
    
    autoPlay() {
        this.log('Auto-play mode activated (10 rounds)');
        let rounds = 0;
        const autoInterval = setInterval(() => {
            if (rounds >= 10 || this.balance < 10) {
                clearInterval(autoInterval);
                this.log('Auto-play completed');
                return;
            }
            document.getElementById('bet-amount').value = 10;
            this.placeBet();
            this.startHeist();
            setTimeout(() => {
                if (this.isPlaying && this.multiplier >= 2.0) {
                    this.cashOut();
                }
            }, 1500);
            rounds++;
        }, 3000);
    }
    
    verifyFairness() {
        if (!this.mathSDK) {
            this.log('Provably fair verification not available in fallback mode');
            return;
        }
        this.log('Verifying game fairness...');
        this.mathSDK.verifyLastGame().then(result => {
            if (result.valid) {
                this.log('Game verified as fair!');
            } else {
                this.log('Verification failed!');
            }
        });
    }
    
    updateDisplay() {
        document.getElementById('balance').textContent = this.balance.toFixed(2);
    }
    
    log(message) {
        const logDiv = document.getElementById('game-log');
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        logDiv.insertBefore(entry, logDiv.firstChild);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.game = new ViceHeist();
    console.log('Vice Heist loaded successfully!');
});
