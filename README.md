# Vice Heist

A StakeEngine-compatible 5-reel, 3-row video slot game with provably fair math.

## Game Details

- **Type:** 5-Reel, 3-Row Video Slot
- **Paylines:** 20
- **Max Win:** 10,000x bet
- **Target RTP:** 96.0%
- **Features:** Free Games, Wilds, Scatters, Bonus Vault Pick Round

## Files

| File | Description |
|------|-------------|
| `index.html` | Main game frontend |
| `game.js` | Frontend game logic & StakeEngine Web SDK integration |
| `style.css` | Game styling |
| `math/game_config.py` | Math SDK configuration (reels, paytable, RTP) |
| `math/gamestate.py` | Spin simulation logic |
| `math/run.py` | Math simulation runner |
| `math/reels/BR0.csv` | Base game reel strips |
| `math/reels/FR0.csv` | Free game reel strips |
| `package.json` | Project configuration |

## Setup

### Math Generation (requires Python 3.12+ and Rust/Cargo)

```bash
cd math
python3 run.py
