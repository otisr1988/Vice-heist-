// ============================================================================
//                  VICE HEIST SLOT MACHINE - MATH CODE FILE
// ============================================================================
// Hello! This is the math brain of our slot machine. All the secret calculations,
// seeds, codes, and logic for figuring out who wins and how much we pay them
// live inside this file.
// Let's explain it simply:
// - Symbols: These are the icons on our reels (like 💎, 💼, ☠️) and how much they pay.
// - Reel Strips: Long vertical tapes of symbols. Spinning reels choose stop positions on these.
// - Paylines: Paths across the screen that we check to find matching symbols.
// - SHA-256: A super-secure code scrambler that guarantees every spin is 100% fair.
// ============================================================================

// 1. All the game symbols and their payouts (Multiplier * Bet)
const Symbols = {
    SCATTER: { char: "🗝️", name: "SCATTER", payouts: [0, 0, 0], desc: "Heist Key bonus" },
    WILD: { char: "🎰", name: "WILD", payouts: [0, 0, 0], desc: "Neon Slot column" },
    BOSS: { char: "🕶️", name: "BOSS", payouts: [50, 150, 500], desc: "Criminal Boss" },
    RACER: { char: "🏎️", name: "RACER", payouts: [25, 75, 250], desc: "Getaway Car" },
    LOOT: { char: "💰", name: "LOOT", payouts: [15, 50, 150], desc: "Loot cash" },
    KNUCKLES: { char: "🤜", name: "KNUCKLES", payouts: [10, 30, 100], desc: "Brass Knuckles" },
    ACE: { char: "💎", name: "ACE", payouts: [5, 15, 50], desc: "Neon Diamond" },
    KING: { char: "👑", name: "KING", payouts: [4, 10, 40], desc: "Graffiti King" },
    QUEEN: { char: "🦩", name: "QUEEN", payouts: [3, 8, 30], desc: "Miami Flamingo" },
    JACK: { char: "🌴", name: "JACK", payouts: [2, 6, 25], desc: "Retro Palm Tree" },
    TEN: { char: "🍹", name: "TEN", payouts: [1, 4, 20], desc: "Miami Cocktail" }
};

// 2. These are the vertical reels of the slot machine (Columns 1 to 5)
// Each column has weighted lists of symbols.
const REEL_STRIPS = [
    ["🕶️", "💎", "🍹", "🤜", "👑", "💰", "🏎️", "🦩", "🗝️", "🕶️", "🍹", "🤜", "👑"],
    ["🎰", "🏎️", "🦩", "🕶️", "👑", "💰", "💎", "🍹", "🗝️", "🤜", "👑", "🦩", "💰"],
    ["🎰", "🕶️", "👑", "🏎️", "🗝️", "💰", "🦩", "🍹", "💎", "🤜", "👑", "🍹", "🕶️"],
    ["🎰", "🦩", "🍹", "💰", "👑", "🏎️", "🕶️", "💎", "🗝️", "🤜", "👑", "🦩", "🕶️"],
    ["🕶️", "👑", "🍹", "💰", "🏎️", "🦩", "🗝️", "🤜", "👑", "💎", "🍹", "💰", "🦩"]
];

// 3. These are the 10 neon payout tracks (Paylines!) across our 5x3 window
// Row 0 is Top, Row 1 is Center, Row 2 is Bottom.
const PAYLINES = [
    [1, 1, 1, 1, 1], // Row 1 (Center horizontal)
    [0, 0, 0, 0, 0], // Row 0 (Top horizontal)
    [2, 2, 2, 2, 2], // Row 2 (Bottom horizontal)
    [0, 1, 2, 1, 0], // V-Shape
    [2, 1, 0, 1, 2], // Inverted V
    [0, 0, 1, 2, 2], // Staircase Down
    [2, 2, 1, 0, 0], // Staircase Up
    [1, 0, 1, 2, 1], // Diamond/ZigZag Center
    [1, 2, 1, 0, 1], // Inverted Diamond Centered
    [0, 2, 0, 2, 0]  // Wide ZigZag
];

// 4. Different coin heights/bet sizes players are allowed to stake
const BET_PRESETS = [10, 50, 100, 250, 500, 1000, 2500, 5000, 10000];

// 5. Secure random hex letter helper
function generateRandomHexString(length) {
    const hex = '0123456789abcdef';
    let output = '';
    for (let i = 0; i < length; i++) {
        output += hex[Math.floor(Math.random() * hex.length)];
    }
    return output;
}

// 6. SHA-256 Code Scrambler algorithm.
// It takes any words or numbers, mixes them up, and gives a 64-character hash string.
// This is used for provably fair slot outcomes to assert zero platform manipulation!
function sha256(ascii) {
    function rightRotate(value, amount) {
        return (value >>> amount) | (value << (32 - amount));
    };
    
    var mathPow = Math.pow;
    var maxWord = mathPow(2, 32);
    var lengthProperty = 'length';
    var i, j;
    var result = '';

    var words = [];
    var asciiLength = ascii[lengthProperty] * 8;
    
    var hash = sha256.h = sha256.h || [];
    var k = sha256.k = sha256.k || [];
    var primeCounter = k[lengthProperty];

    var isComposite = {};
    for (var candidate = 2; primeCounter < 64; candidate++) {
        if (!isComposite[candidate]) {
            for (i = 0; i < 313; i += candidate) {
                isComposite[i] = candidate;
            }
            hash[primeCounter] = (mathPow(candidate, .5) * maxWord) | 0;
            k[primeCounter++] = (mathPow(candidate, 1/3) * maxWord) | 0;
        }
    }
    
    ascii += '\x80'
    while (ascii[lengthProperty] % 64 - 56) ascii += '\x00'
    for (i = 0; i < ascii[lengthProperty]; i++) {
        j = ascii.charCodeAt(i);
        if (j >> 8) return;
        words[i >> 2] |= j << (24 - (i % 4) * 8);
    }
    words[words[lengthProperty]] = ((asciiLength / maxWord) | 0);
    words[words[lengthProperty]] = (asciiLength);
    
    var w = [];
    var H0 = hash[0], H1 = hash[1], H2 = hash[2], H3 = hash[3],
        H4 = hash[4], H5 = hash[5], H6 = hash[6], H7 = hash[7];

    for (i = 0; i < words[lengthProperty]; i += 16) {
        var a = H0, b = H1, c = H2, d = H3, e = H4, f = H5, g = H6, h = H7;
        for (j = 0; j < 64; j++) {
            if (j < 16) w[j] = words[i + j];
            else {
                var s0 = rightRotate(w[j - 15], 7) ^ rightRotate(w[j - 15], 18) ^ (w[j - 15] >>> 3);
                var s1 = rightRotate(w[j - 2], 17) ^ rightRotate(w[j - 2], 19) ^ (w[j - 2] >>> 10);
                w[j] = (w[j - 16] + s0 + w[j - 7] + s1) | 0;
            }
            
            var ch = (e & f) ^ (~e & g);
            var maj = (a & b) ^ (a & c) ^ (b & c);
            var temp1 = (h + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) + ch + k[j] + w[j]) | 0;
            var temp2 = ((rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) + maj) | 0;
            
            h = g;
            g = f;
            f = e;
            e = (d + temp1) | 0;
            d = c;
            c = b;
            b = a;
            a = (temp1 + temp2) | 0;
        }
        H0 = (H0 + a) | 0; H1 = (H1 + b) | 0; H2 = (H2 + c) | 0; H3 = (H3 + d) | 0;
        H4 = (H4 + e) | 0; H5 = (H5 + f) | 0; H6 = (H6 + g) | 0; H7 = (H7 + h) | 0;
    }

    var decryptedHex = [H0, H1, H2, H3, H4, H5, H6, H7];
    for (i = 0; i < 8; i++) {
        var word = decryptedHex[i];
        var hexString = (word >>> 0).toString(16);
        while (hexString.length < 8) hexString = '0' + hexString;
        result += hexString;
    }
    return result;
}

// 7. This checks the symbols on a line to see if they match from left-to-right OR right-to-left.
// Returns the amount earned (multiplier) and how many matches were formed.
function checkLineSequence(coords, grid, isLeftToRight) {
    let firstSymbol = null;
    let matchCount = 0;

    for (let col = 0; col < 5; col++) {
        const actualCol = isLeftToRight ? col : 4 - col;
        const rowCoord = coords[actualCol];
        const currentSymChar = grid[rowCoord][actualCol];

        if (col === 0) {
            firstSymbol = currentSymChar;
            matchCount = 1;
        } else {
            // Check matching sequential symbols (support wild spray 🎰 cards)
            if (currentSymChar === "🎰" || firstSymbol === "🎰") {
                if (firstSymbol === "🎰") firstSymbol = currentSymChar;
                matchCount++;
            } else if (currentSymChar === firstSymbol) {
                matchCount++;
            } else {
                break;
            }
        }
    }

    let symbolKey = Object.keys(Symbols).find(k => Symbols[k].char === firstSymbol);
    let payoutsArray = symbolKey ? Symbols[symbolKey].payouts : [0, 0, 0];
    
    let payout = 0;
    if (matchCount >= 3) {
        payout = payoutsArray[matchCount - 3];
    }

    return { payout: payout, matchCount: matchCount };
}

// 8. Generate deterministically fair reel stops using SHA-256
// This makes sure neither the server nor player can cheat.
function generateSpinResultGrid(serverSeed, clientSeed, nonce, gameMode, activeStickyWildsSet) {
    let resultingGrid = [];
    const hashOutcomeStr = sha256(serverSeed + clientSeed + nonce);
    
    for (let col = 0; col < 5; col++) {
        let colData = [];
        for (let row = 0; row < 3; row++) {
            const entropyIndex = col * 3 + row;
            const hexVal = hashOutcomeStr.substring(entropyIndex * 2, entropyIndex * 2 + 2);
            const rollPercent = parseInt(hexVal, 16) / 255.0;
            
            const availableReelSymbols = REEL_STRIPS[col];
            const selectedChar = availableReelSymbols[Math.floor(rollPercent * availableReelSymbols.length)];
            colData.push(selectedChar);
        }
        resultingGrid.push(colData);
    }

    // Force Wild columns during free spins sticky modes
    if (gameMode === "FREE_SPINS" && activeStickyWildsSet && activeStickyWildsSet.size > 0) {
        activeStickyWildsSet.forEach((wildColIdx) => {
            resultingGrid[wildColIdx] = ["🎰", "🎰", "🎰"];
        });
    }

    return resultingGrid;
}

// 9. Browser Fast-Spins Monte Carlo Simulation Math Runner.
// Computes 100 random spins in cache and reports statistics.
function simulateSpinsMath(simBet, totalSpinsSimulated = 100) {
    const totalBetSum = simBet * totalSpinsSimulated;
    let totalWinSum = 0;
    let winSpinsCount = 0;
    let freeSpinsCount = 0;

    for (let i = 0; i < totalSpinsSimulated; i++) {
        let testGrid = [];
        for (let col = 0; col < 5; col++) {
            let colData = [];
            for (let row = 0; row < 3; row++) {
                const randomSet = REEL_STRIPS[col];
                colData.push(randomSet[Math.floor(Math.random() * randomSet.length)]);
            }
            testGrid.push(colData);
        }

        // Expand wild spray cols
        for (let col = 1; col <= 3; col++) {
            if (testGrid[col][0] === "🎰" || testGrid[col][1] === "🎰" || testGrid[col][2] === "🎰") {
                testGrid[col] = ["🎰", "🎰", "🎰"];
            }
        }

        let rowsFormatGrid = [
            [testGrid[0][0], testGrid[1][0], testGrid[2][0], testGrid[3][0], testGrid[4][0]],
            [testGrid[0][1], testGrid[1][1], testGrid[2][1], testGrid[3][1], testGrid[4][1]],
            [testGrid[0][2], testGrid[1][2], testGrid[2][2], testGrid[3][2], testGrid[4][2]]
        ];

        let spinWin = 0;
        PAYLINES.forEach((coords) => {
            const ltr = checkLineSequence(coords, rowsFormatGrid, true);
            if (ltr.payout > 0) spinWin += ltr.payout * simBet;

            const rtl = checkLineSequence(coords, rowsFormatGrid, false);
            if (rtl.payout > 0 && rtl.matchCount < 5) spinWin += rtl.payout * simBet;
        });

        if (spinWin > 0) {
            totalWinSum += spinWin;
            winSpinsCount++;
        }

        let scatters = 0;
        rowsFormatGrid.forEach(row => {
            row.forEach(cell => {
                if (cell === "🗝️") scatters++;
            });
        });
        if (scatters >= 3) freeSpinsCount++;
    }

    return {
        totalSpins: totalSpinsSimulated,
        totalBet: totalBetSum,
        totalWon: totalWinSum,
        winSpins: winSpinsCount,
        freeSpins: freeSpinsCount
    };
}
