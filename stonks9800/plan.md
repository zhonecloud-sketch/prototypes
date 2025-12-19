# STONKS 9800 - Stage 03 Plan

## Completed Features

### Options Trading ✅
- Call/Put contracts with Greeks (Delta, Theta, Vega)
- Strike selection, expiration dates (7-90 DTE)
- IV crush warnings, opportunity alerts
- Strategies: Wheel, earnings straddle, protective puts

### Short Selling Education ✅
- Borrow rate based on short interest (2-100%+ APR)
- Squeeze warnings (SI >25%)
- Hard-to-borrow blocking (SI >35%)
- Daily borrow fee deduction

### Trade Journal ✅
- Auto-logs all trades with market conditions
- Auto-tagging (fomo, crash, squeeze, pump, etc.)
- Pattern analysis, win rate, profit factor stats

### Market Sentiment ✅
- Fear/Greed index (0-100) from 6 factors
- Historical return context by zone
- Contrarian investing education

### Tutorial Mode ✅
- Embedded hints in news items
- Covers 25+ event types
- Reactive learning (recognizes patterns as they happen)

---

## 📚 EMPIRICAL RESEARCH FOUNDATION

### Financial NLP Studies (Headline Classification)

#### Loughran & McDonald (2011) - "When is a Liability not a Liability?"
- Created financial-specific sentiment dictionaries
- Markets systematically **overreact to SOFT info** but **underreact to HARD info**
- Standard sentiment analysis fails in financial context

#### Tetlock (2007) - "Giving Content to Investor Sentiment"
- High media negativity predicts high trading volume and **reversion to fundamentals**
- "Stale" or "emotional" headlines → price drop is **temporary (5-10 days)**
- Linguistic style more predictive than event content itself

### Headline Classification System

| Category | Type | Keywords | Prediction |
|----------|------|----------|------------|
| **SOFT INFO** | Subjective | "Fears," "Concerns," "Worries," "Uncertainty," "Rumors," "Shadows" | **REVERSES** in 5-10 days |
| **HARD INFO** | Objective | "Files," "Reports," "Sues," "SEC Investigation," "Fraud," "Recall" | **PERMANENT** damage |
| **NO-CATALYST** | Technical | "Bargain hunters," "Technical rebound," "Oversold," "Relief rally" | **DCB TRAP** (70%) |
| **EUPHORIA PEAK** | Attention | "Historic," "Moon," "Frenzy," "Skyrockets," "Can't be stopped" | **TOP IS NEAR** |
| **CONVICTION** | SEC Filing | "Open Market Purchase," "Form 4," "Cluster Buying," "Code P" | **BULLISH** (+4.8%/yr) |

### The 85% Gold Standard Headline Pattern
```
HEALTHY COMPANY + SOFT NEWS ("Fears") + 10% DROP + RECORD VOLUME + DAY 3: INSIDER CLUSTER BUYING
= Highest empirically supported reversal signal in financial literature
```

---

## 📊 PHENOMENA & EMPIRICAL SOURCES

### 1. News Shakeout (Overreaction Hypothesis)

**Empirical Sources:**
- **De Bondt & Thaler (1985)**: "Does the Stock Market Overreact?" - Extreme losers outperform extreme winners
- **Tetlock (2007)**: High media negativity predicts reversion within 5-10 days
- **Atkins & Dyl (1990)**: 10%+ drops reverse within 2-5 days if news doesn't impair long-term cash flow
- **Chan (2003)**: "Stock Price Reaction to News and No-news" - Sensationalist news reverses swiftly

**Gold Standard (85%+):**
1. **Transient News**: News does NOT change 12-month earnings outlook
2. **Volume Climax**: Highest volume day (5x+ average) = selling exhaustion
3. **Three-Day Stabilization**: Day 3 close > Day 2, holds above Day 1 low
4. **RSI Rubber Band**: RSI < 25 (oversold) → target gap fill within 10-14 days

**NLP Filter:**
| Verb Type | SOFT (Reverses) | HARD (Permanent) |
|-----------|-----------------|------------------|
| Examples | "Fears," "Worries" | "Files," "Reports," "Sues" |
| Focus | On the PRICE ("Plunges") | On the CAUSE ("Defaulted") |
| Timing | Middle of trading day | Before open / after close |

---

### 2. Dead Cat Bounce (DCB)

**Empirical Sources:**
- **Bulkowski Pattern Studies**: 30% base reversal rate, 70% are TRAPS
- **Lo & MacKinlay (1988)**: >50% retracement adds +20% probability
- **Karpoff (1987)**: Rising volume adds +15% probability

**Gold Standard:**
- Break AND HOLD above 61.8% Fibonacci
- Rising volume during bounce
- = 85% success probability

**NLP Trap Detection:**
Headlines using "NO-CATALYST" language = TRAP SIGNATURE:
- "Bargain hunters stepping in" (no fundamental reason cited)
- "Technical rebound from oversold levels"
- "Relief rally amid short covering"
- "Finding support" (passive, no cause)

**Confirmation Keywords:**
- "SEC Form 4 filing" (insider buying)
- "Cluster purchase by executives"
- "Dividend announced"

---

### 3. Short Seller Report (SSR)

**Empirical Sources:**
- **Ljungqvist & Qin (2021)**: Average -20% over 4 years for targets
- **Wong & Zhao (2017)**: Activist short sellers are informed traders

**Report Type Reversal Rates:**
| Type | Reversal Rate | Explanation |
|------|---------------|-------------|
| Fraud allegations | ~10% | HARD INFO = permanent |
| Valuation-only | ~40% | Subjective = can recover |

**Gold Standard:**
- Point-by-point DATA rebuttal (not generic denial)
  OR
- Big 4 Auditor (Deloitte/PwC/EY/KPMG) reaffirms books
- = 85% success probability

**NLP HARD INFO Keywords (Permanent Damage):**
- "Exposed," "Phantom," "Fabricated" (active/aggressive verbs)
- "Whistleblower," "Investigation," "Audit" (accounting terms)
- Specific % claims ("Fabricated 40% of Revenue")

---

### 4. Insider Buying

**Empirical Sources:**
- **Lakonishok & Lee (2001)**: Insider purchases predict +4.8% annual alpha
- **Hjort & Bapkas (2024)**: Cluster buying (3+) has 2x predictive power (~9.6%)
- **Seyhun (1986, 1998)**: Insiders are informed traders with material information
- **Cohen, Malloy & Pomorski (2012)**: "Routine" vs "Opportunistic" - Only opportunistic trades have predictive power

**Key Insight:**
> Insiders buy for **ONE reason**: They believe the stock will go UP

**Gold Standard (4 Criteria):**
1. ✅ **Cluster Buy**: 3+ insiders within 2 weeks
2. ✅ **Skin in Game**: >$2M or >10% of wealth
3. ✅ **Small Cap**: Market cap <$2B (more alpha)
4. ✅ **Contrarian Floor**: Stock dropped 20%+ recently

**Form 4 Transaction Codes:**
| Code | Type | Signal Value |
|------|------|--------------|
| **P** | Open Market Purchase | ✅ STRONGEST (personal funds) |
| A | Award/Grant | ⚪ Neutral (compensation) |
| M | Option Exercise | ⚪ Neutral (often tax planning) |
| G | Gift | ⚪ Neutral (estate planning) |

**NLP Gold Keywords:**
- "SEC Form 4," "Open Market Purchase," "Cluster Buying," "Multi-million dollar stake"
- "Code P" = personal funds conviction

**NLP Trap Keywords:**
- "Option Exercise" (Code M = meaningless)
- "10b5-1 Plan" (pre-scheduled = ZERO predictive power)
- "Compensation," "Scheduled"

---

### 5. Insider Selling (NOT Gold Standard - NOISE)

**Empirical Sources:**
- **Lakonishok & Lee (2001)**: Insider SALES have minimal predictive power
- **Cohen, Malloy & Pomorski (2012)**: Routine selling has ZERO predictive power
- **Seyhun (1998)**: "Insider selling is not informative about future returns"
- **Cambridge Study (2024)**: >70% disposal = +40% decline probability (rare exception)

**Key Insight: THE ASYMMETRY**
> **Buying = ONE reason (bullish)**  
> **Selling = MANY reasons (93% NOT bearish)**

**Why Insider Selling is NOISE:**
| Reason | Frequency | Bearish? |
|--------|-----------|----------|
| Tax planning / 10b5-1 | 22% | ❌ No |
| Portfolio diversification | 20% | ❌ No |
| Home purchase / Life event | 20% | ❌ No |
| Estate planning | 10% | ❌ No |
| Divorce / Tuition | 10% | ❌ No |
| Exercise + immediate sale | 11% | ❌ No |
| **Believes overvalued** | **7%** | **✅ Yes** |

**"Gold Standard for Shorts" (TOXIC Setup - 4 Filters):**
1. ☠️ **Massive Disposal**: >50% of holdings (Cambridge: +40% decline prob)
2. ☠️ **Cluster Exit**: 4+ insiders, NO 10b5-1 checkboxes
3. ☠️ **FOMO Rally**: Selling during retail euphoria
4. ☠️ **Abandonment**: No insider buying for 12+ months

**Form 4 NOISE Codes:**
| Code | Type | Action |
|------|------|--------|
| 10b5-1 checkbox | Pre-scheduled | **IGNORE** (zero predictive power) |
| F | Tax withholding | **IGNORE** (mandatory, not discretionary) |
| M | Option exercise | **IGNORE** (often compensation) |
| S (no 10b5-1) | Discretionary | ⚠️ Potentially meaningful |

**NLP Headline Trap:**
- Media uses scary words: "DUMPS," "SELLS MASSIVE STAKE"
- These are clickbait - check the Form 4 fine print for 10b5-1 checkbox!

---

### 6. FOMO Rally Exhaustion

**Empirical Sources:**
- **Barber & Odean (2021)**: Attention-driven buying → 30-90 day underperformance
- **Da, Engelberg & Gao (2024)**: Search volume predicts 1-2 week spike, then reversal
- **Baltzer et al. (2023)**: Positive feedback loops exhaust at "marginal buyer"

**Gold Standard (Shorts):**
- Stock trading 3+ SD above 20-day MA
- Put/Call ratio < 0.40 (extreme greed)
- Volume climax + sentiment/price divergence
- = 85% crash probability

**NLP Euphoria Peak Keywords:**
- "HISTORIC," "MOON," "Next Tesla," "SKYROCKETS"
- "Retail Frenzy," "Can't be stopped," "Diamond hands"
- Focus on INVESTOR BEHAVIOR (not company performance) = TOP IS NEAR

**Key Insight:**
> When headlines become **extravagant** and describe the **frenzy** instead of the **company**, smart money is exiting

---

### 7. Institutional Manipulation (Analyst Herd Behavior)

**Empirical Observation:**
- Institutions often release **DOWNGRADES near the BOTTOM** of a shakeout
- Goal: Flush out final retail sellers to buy cheap shares

**The "Liquidity Hunt" Pattern:**
```
Stock drops 20% → Analyst Downgrade appears AFTER drop → 
Retail panic sells → Institutions buy → Stock rises on "Sell" rating
```

**NLP Detection:**
- "Price target cut," "Underperform," "Wait-and-see," "Downgrade"
- **TRAP**: Downgrade headline appearing AFTER stock already dropped 20%
- If stock RISES on a "Sell" rating = **Institutional Reversal (85% setup)**

---

## 🏆 THE GOLD STANDARD: 85% Success Setup

To achieve the highest probability reversal (~85%), players must identify ALL these criteria:

| Signal | Gold Standard Requirement |
|--------|---------------------------|
| **DCB** | Must break and **HOLD** above the 61.8% Fibonacci level on **RISING** volume |
| **SSR** | Company must provide **point-by-point DATA rebuttal** OR have a **Big 4 Auditor** (Deloitte/PwC/EY/KPMG) reaffirm the books |
| **Insider** | **Cluster Buying (3+ insiders)** of **Open Market Shares (Code P)** representing **>10% of their wealth** |
| **Macro** | The VIX (Volatility Index) must be **decreasing**, indicating market calm returning |

---

## Module Architecture

### 1. Dead Cat Bounce (DCB) Module
**File:** `deadCatBounce.js`

**Empirical Foundation:**
- Base rate: 30% of bounces succeed (Bulkowski)
- 70% of bounces are TRAPS
- Conditional probability improves with confirming signals

**Signal-Based Probability:**
| Signal | Boost | Source |
|--------|-------|--------|
| Base rate | 30% | Bulkowski pattern studies |
| >50% retracement | +20% | Lo & MacKinlay 1988 |
| >61.8% retracement | +10% | Fibonacci (golden ratio) |
| Rising volume | +15% | Karpoff 1987 |
| Higher lows pattern | +10% | Technical consensus |
| 3-day rule met | +5% | Bulkowski |
| Insider buying | +10% | Lakonishok & Lee 2001 |
| Cluster buying (3+) | +15% | Hjort & Bapkas 2024 |
| **Maximum** | **85%** | Cap (irreducible uncertainty) |

**Gold Standard Criteria:**
```
✓ Break AND HOLD above 61.8% Fibonacci
✓ Rising volume during bounce
= 85% success probability
```

**Phase Flow:**
```
crash → bounce → [decline → bounce]* → resolution (trap or reversal)
```

---

### 2. Short Seller Report (SSR) Module
**File:** `shortSellerReport.js`

**Empirical Foundation:**
- Ljungqvist & Qin (2021): Average -20% over 4 years for targets
- Wong & Zhao (2017): Activist short sellers are informed traders
- Fraud allegations: ~10% reversal probability
- Valuation-only reports: ~40% reversal probability

**Signal-Based Probability:**
| Signal | Boost | Condition |
|--------|-------|-----------|
| Base (fraud) | 10% | Fraud allegations |
| Base (valuation) | 40% | Overvaluation claims |
| Data rebuttal | +10-20% | Point-by-point with DATA |
| Big 4 Auditor | +15% | Deloitte/PwC/EY/KPMG reaffirms |
| Insider buying | +30% | Single insider buys |
| Cluster buying | +45% | 3+ insiders buy |
| **Maximum** | **85%** | Cap |

**Gold Standard Criteria:**
```
✓ Point-by-point DATA rebuttal (not generic denial)
  OR
✓ Big 4 Auditor (Deloitte/PwC/EY/KPMG) reaffirms books
= 85% success probability
```

**Phase Flow:**
```
initial_report → crash → [denial/rebuttal] → base_forming → resolution
```

---

### 3. Insider Buying Module
**File:** `insiderBuying.js`

**Empirical Foundation:**
- Lakonishok & Lee (2001): Insider purchases predict +4.8% alpha over 12 months
- Hjort & Bapkas (2024): Cluster buying (3+) has 2x predictive power
- Seyhun (1986, 1998): Insiders are informed traders with material information

**Key Insight:**
> Insiders buy for **ONE reason**: They believe the stock will go UP

**Signal Strength:**
| Signal | Boost | Description |
|--------|-------|-------------|
| Single buy | +10% | One insider purchases |
| Two buys | +20% | Two insiders purchase |
| Cluster buy (3+) | +25% | Three or more insiders (Gold Standard) |

**Gold Standard Criteria:**
```
✓ Cluster Buying (3+ insiders)
✓ Open Market Shares (Form 4 Code P)
✓ Representing >10% of insider's wealth
= Part of 85% success probability
```

**Form 4 Codes:**
- **Code P** = Open Market Purchase (STRONGEST signal - personal funds)
- Code A = Award/Grant (neutral - compensation)
- Code M = Option Exercise (neutral - often tax planning)

**Title Weights:**
| Title | Weight | Rationale |
|-------|--------|-----------|
| CEO | 1.5x | Deepest knowledge |
| CFO | 1.4x | Knows the numbers |
| Chairman | 1.4x | Strategic vision |
| COO | 1.2x | Operations insight |
| Director | 1.0x | Board-level view |
| VP | 0.9x | Departmental knowledge |
| 10% Owner | 0.8x | May not be operational |

---

### 4. Insider Selling Module
**File:** `insiderSelling.js`

**Empirical Foundation:**
- Lakonishok & Lee (2001): Insider SALES have minimal predictive power
- Seyhun (1998): "Insider selling is not informative about future returns"
- Jeng, Metrick & Zeckhauser (2003): Sells show no abnormal returns

**Key Insight: THE ASYMMETRY**
> **Buying = ONE reason (bullish)**  
> **Selling = MANY reasons (93% NOT bearish)**

**Why Insider Selling is NOISE:**
| Reason | Frequency | Bearish? |
|--------|-----------|----------|
| Tax planning | 22% | ❌ No |
| Portfolio diversification | 20% | ❌ No |
| Scheduled 10b5-1 plan | 18% | ❌ No |
| Estate planning | 10% | ❌ No |
| Home purchase | 8% | ❌ No |
| Tuition/education | 6% | ❌ No |
| Divorce settlement | 4% | ❌ No |
| Liquidity needs | 5% | ❌ No |
| **Believes overvalued** | **7%** | **✅ Yes** |

**Signal Strength:**
| Signal | Penalty | Description |
|--------|---------|-------------|
| Single sell | **0%** | NOISE - ignore completely |
| Cluster sell (3+) | -10% | Weak warning only |

**NOT in Gold Standard:**
```
❌ Insider selling is EXCLUDED from Gold Standard
❌ 93% of insider sales are NOT bearish
❌ Focus on BUYING signals instead
```

**Educational Purpose:**
Teaches players to:
1. NOT overreact to insider selling (common retail mistake)
2. Understand the buying/selling asymmetry
3. Recognize that "insider sold!" headlines are clickbait
4. Focus on insider BUYING as the actionable signal

---

## Event Mechanics

### Short Seller Reports
```
initial_crash → denial → [waiting → followup_attack → denial]* → resolution
```
- 1-3 waves typical, each follow-up increases vindication probability
- Resolution: vindicated (-15% + EPS damage) or debunked (+15-25%)

### Manipulation (Pump & Dump)
```
accumulation → catalyst → distribution → [re_accumulation → catalyst → distribution]* → crash
```
- 1-3 cycles, each wave diminishes pump effectiveness
- More waves = harder crash (retail trapped)

### Dead Cat Bounce
```
crash → [bounce → continued_decline]* → resolution
```
- 1-4 bounces, each weaker than last
- More bounces = higher chance of real bottom

---

## Event Tiers

| Tier | Examples | Default |
|------|----------|---------|
| **1** | Short seller report, Index rebalance, Insider buying | ON |
| **2** | Dead cat bounce, Stock split, Short squeeze, FOMO | ON |
| **3** | Analyst ratings, Sector rotation, Executive changes | OFF |
| **4** | Dividend traps, Tax harvesting, Window dressing | OFF |

---

## Future Stages

### Stage 04: Margin & Risk Management
**Core Features:**
- **Margin Trading**: 2x leverage, daily interest (8% APR), visible costs
- **Margin Calls**: Triggered at 30% equity, 3 days to add funds or liquidate
- **Forced Liquidation**: Auto-sell at worst prices if margin call unmet
- **Stop-Loss Orders**: Auto-sell if price drops to target
- **Take-Profit Orders**: Auto-sell if price rises to target
- **Trailing Stops**: Auto-sell if price drops X% from peak

**Educational Goals:**
- Leverage amplifies gains AND losses
- Margin calls happen in volatile markets when you least expect
- Risk management prevents catastrophic losses
- "Cut losses short, let winners run"

### Stage 05: Portfolio Analytics
- Performance attribution (which trades made/lost money)
- Risk metrics (Sharpe ratio, max drawdown, volatility)
- Sector allocation visualization
- Diversification scoring

### Stage 06: Achievements & Mastery
- Unlockable badges for milestones
- Strategy mastery tracking
- Historical performance leaderboard

---

## Future Event Ideas (Not Implemented)

- Activist investor campaigns (13D filing → proxy fight → resolution)
- M&A bidding wars (offer → counter-offer → regulatory → close/fail)
- Regulatory investigations (rumor → confirmation → settlement/charges)
- Earnings revision cycles (pre-announce → miss → guidance cut → kitchen sink)
- Bankruptcy process (liquidity concerns → going concern → Chapter 11)
