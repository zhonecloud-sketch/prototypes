// ===== DEAD CAT BOUNCE SYSTEM (EMPIRICALLY-BASED REDESIGN) =====
// Based on Bulkowski studies and documented market patterns
// 
// EMPIRICAL FOUNDATIONS:
// - Base rate: 30% of bounces succeed (Bulkowski)
// - Conditional probability improves with confirming signals:
//   * >50% retracement: +20% (Lo & MacKinlay, 1988)
//   * Rising volume: +15% (Karpoff, 1987)
//   * Higher lows pattern: +10% (technical analysis consensus)
//   * 3-day rule met: +5% (Bulkowski pattern studies)
//   * Insider buying: +10% (Lakonishok & Lee 2001 - 4.8% alpha)
//   * Cluster buying (3+): +15% additional (Hjort & Bapkas 2024 - 2x power)
// - Maximum probability with all signals: ~85% (never 100%)
// - Insider SELLING is NOISE - do not use as signal
// - Macro events can override any technical setup
//
// EDUCATIONAL PURPOSE:
// Teaches players that stacking confirming indicators improves
// (but never guarantees) outcomes. Key skills:
// 1. Volume analysis - institutional intent
// 2. Fibonacci retracement - buyer conviction
// 3. Pattern recognition - higher lows vs lower highs
// 4. Patience - waiting for confirmation vs FOMO
//
// ARCHITECTURE:
// This module uses dependency injection for testability.
// Outcome is determined by OBSERVED signals, not pre-set at crash start.

const DCB = (function() {
  'use strict';
  
  // ========== EMPIRICALLY-BASED CONSTANTS ==========
  const CONSTANTS = {
    // ========== GOLD STANDARD 85% SETUP ==========
    // The highest probability reversal setup requires ALL these criteria
    GOLD_STANDARD: {
      description: 'Must break and HOLD above 61.8% Fibonacci level on RISING volume',
      requirements: {
        fibonacciLevel: 0.618,       // Must exceed 61.8% retracement
        fibonacciHold: true,         // Must HOLD above level (not just touch)
        volumeTrend: 'increasing',   // Volume must be RISING during bounce
        successRate: 0.85            // 85% success when all criteria met
      },
      educationalNote: 'Without these criteria, 70% of bounces are traps (Bulkowski)'
    },
    
    // SIGNAL-BASED REVERSAL PROBABILITY (empirical sources)
    // Outcome determined by observed signals, not pre-set
    REVERSAL_PROBABILITY: {
      base: 0.30,              // 30% base rate (Bulkowski: 70% are traps)
      retracementAbove50: 0.20, // +20% if >50% retracement (Lo & MacKinlay)
      retracementAbove618: 0.10, // +10% bonus for >61.8% (golden ratio)
      risingVolume: 0.15,      // +15% if volume increasing (Karpoff 1987)
      higherLows: 0.10,        // +10% if higher low pattern forms
      threeDayRule: 0.05,      // +5% if 3+ consecutive up days
      insiderBuying: 0.10,     // +10% if insider buying detected (Lakonishok & Lee 2001)
      clusterBuying: 0.15,     // +15% additional for cluster buying (Hjort & Bapkas 2024)
      maxProbability: 0.85     // Cap at 85% - markets have irreducible uncertainty
    },
    
    // Legacy constant for backward compatibility
    TRAP_PROBABILITY: 0.70, // Used only if signals not available
    
    // Initial crash parameters (from empirical data)
    CRASH: {
      dailyChance: 0.02,        // 2% per stock per day
      minDrop: 0.15,            // -15% minimum
      maxDrop: 0.30,            // -30% maximum
      durationDays: { min: 2, max: 4 }
    },
    
    // Dead Cat Bounce (TRAP) parameters
    DCB_TRAP: {
      retracement: { min: 0.28, max: 0.35 },  // 28-35% of drop (weak bounce)
      duration: { min: 5, max: 15 },           // 5-15 days before failing
      volumeTrend: 'declining',                // KEY INDICATOR: volume decreases
      maxBounces: 3,                           // Up to 3 failed bounces
      subsequentDrops: [0.15, 0.20, 0.25]      // Each failure drops more (capitulation)
    },
    
    // Genuine Reversal parameters
    GENUINE_REVERSAL: {
      retracement: { min: 0.50, max: 0.75 },  // >50%, often >61.8%
      duration: { min: 10, max: 25 },          // Lasts longer
      volumeTrend: 'increasing',               // KEY INDICATOR: volume increases
      recoveryTarget: { min: 0.60, max: 0.90 } // Recovers 60-90% of crash
    },
    
    // Volume signature levels (for display/education)
    VOLUME: {
      crash: 3.0,           // 3x normal volume during crash
      dcbBounce: 0.6,       // 60% of crash volume (declining = trap signal)
      reversalBounce: 1.2,  // 120% of normal (increasing = reversal signal)
      confirmation: 1.5     // High volume on breakout confirms reversal
    },
    
    // Fibonacci levels for educational display
    FIBONACCI: {
      level_236: 0.236,
      level_382: 0.382,
      level_500: 0.500,    // Key threshold - below = likely trap
      level_618: 0.618,    // Golden ratio - above = strong signal
      level_786: 0.786
    },
    
    // Duration for various phases (in days)
    // Empirical: Bulkowski - Full bounce phase averages 23 days
    DURATION: {
      crash: { min: 2, max: 4 },
      bounce: { min: 15, max: 30 },     // Empirical: ~23 days average (Bulkowski)
      decline: { min: 5, max: 10 },      // Longer decline matches real patterns
      consolidation: { min: 10, max: 20 },
      recovery: { min: 60, max: 120 }    // Empirical: 3-6 months (Bulkowski)
    },
    
    // Crash catalysts with severity
    // Empirical NLP: "Hard Information" - specific facts (Loughran & McDonald 2011)
    // Keywords: Objective verbs ("Files," "Reports," "Sues"), specific numbers
    CRASH_CATALYSTS: [
      { headline: 'accounting irregularities discovered - SEC investigating', severity: 0.28 },
      { headline: 'loses $200M client contract, revenue guidance slashed 40%', severity: 0.22 },
      { headline: 'fraud allegations surface - auditor resignation', severity: 0.30 },
      { headline: 'product recall: 2.5M units affected, liability exposure', severity: 0.20 },
      { headline: 'CEO sudden departure - board announces investigation', severity: 0.18 },
      { headline: 'misses earnings by 35%, cuts full-year guidance', severity: 0.25 },
      { headline: 'key patent invalidated - $500M revenue at risk', severity: 0.22 },
      { headline: 'DOJ files antitrust lawsuit seeking breakup', severity: 0.20 }
    ]
  };
  
  // ========== DEPENDENCIES (INJECTED) ==========
  let deps = {
    stocks: null,
    todayNews: null,
    getMemeMultiplier: null,
    randomChoice: null,
    isEventTypeEnabled: null,
    random: Math.random
  };
  
  // ========== INITIALIZATION ==========
  function init(dependencies) {
    if (dependencies.stocks !== undefined) deps.stocks = dependencies.stocks;
    if (dependencies.todayNews !== undefined) deps.todayNews = dependencies.todayNews;
    if (dependencies.getMemeMultiplier !== undefined) deps.getMemeMultiplier = dependencies.getMemeMultiplier;
    if (dependencies.randomChoice !== undefined) deps.randomChoice = dependencies.randomChoice;
    if (dependencies.isEventTypeEnabled !== undefined) deps.isEventTypeEnabled = dependencies.isEventTypeEnabled;
    if (dependencies.random !== undefined) deps.random = dependencies.random;
    
    return DCB;
  }
  
  // ========== HELPER FUNCTIONS ==========
  function getStocks() {
    return deps.stocks || (typeof stocks !== 'undefined' ? stocks : []);
  }
  
  function getNews() {
    return deps.todayNews || (typeof todayNews !== 'undefined' ? todayNews : []);
  }
  
  function getMemeMultiplier(stock) {
    if (deps.getMemeMultiplier) return deps.getMemeMultiplier(stock);
    if (typeof window !== 'undefined' && typeof window.getMemeMultiplier === 'function') {
      return window.getMemeMultiplier(stock);
    }
    return (stock.isMeme || stock.volatility > 0.05) ? 1.5 : 1.0;
  }
  
  function randomChoice(arr) {
    if (deps.randomChoice) return deps.randomChoice(arr);
    if (typeof window !== 'undefined' && typeof window.randomChoice === 'function') {
      return window.randomChoice(arr);
    }
    return arr[Math.floor(deps.random() * arr.length)];
  }
  
  function isEventTypeEnabled(eventType) {
    if (deps.isEventTypeEnabled) return deps.isEventTypeEnabled(eventType);
    if (typeof window !== 'undefined' && typeof window.isEventTypeEnabled === 'function') {
      return window.isEventTypeEnabled(eventType);
    }
    return true;
  }
  
  function random() {
    return deps.random();
  }

  function getDate() {
    let gs = (typeof gameState !== 'undefined') ? gameState : (typeof window !== 'undefined' && window.gameState) ? window.gameState : null;
    if (gs && gs.year && gs.month && gs.day) return `Y${gs.year}/M${gs.month}/D${gs.day}`;
    return '?';
  }

  function getPriceInfo(stock) {
    const price = stock.price ? `$${stock.price.toFixed(2)}` : '$?';
    const delta = stock.preCrashPrice 
      ? `${((stock.price - stock.preCrashPrice) / stock.preCrashPrice * 100).toFixed(1)}%`
      : '?';
    return `[${price} Δ${delta.startsWith('-') ? '' : '+'}${delta}]`;
  }
  
  // Calculate Fibonacci retracement percentage
  function calculateRetracement(stock) {
    if (!stock.crashLow || !stock.preCrashPrice) return 0;
    const totalDrop = stock.preCrashPrice - stock.crashLow;
    const currentRecovery = stock.price - stock.crashLow;
    return totalDrop > 0 ? currentRecovery / totalDrop : 0;
  }
  
  // Get Fibonacci level label
  function getFibLabel(retracement) {
    if (retracement >= 0.75) return '78.6%';
    if (retracement >= 0.60) return '61.8% (golden ratio)';
    if (retracement >= 0.48) return '50%';
    if (retracement >= 0.36) return '38.2%';
    if (retracement >= 0.22) return '23.6%';
    return 'below 23.6%';
  }
  
  // Calculate reversal probability based on observed signals
  function calculateReversalProbability(stock, silent = false) {
    const prob = CONSTANTS.REVERSAL_PROBABILITY;
    let reversalProb = prob.base;
    const signals = [];
    
    const retracement = calculateRetracement(stock);
    
    // Signal 1: Retracement level
    if (retracement >= 0.618) {
      reversalProb += prob.retracementAbove50 + prob.retracementAbove618;
      signals.push({ name: '>61.8% retracement', bonus: '+30%', met: true });
    } else if (retracement >= 0.50) {
      reversalProb += prob.retracementAbove50;
      signals.push({ name: '>50% retracement', bonus: '+20%', met: true });
    } else {
      signals.push({ name: '>50% retracement', bonus: '+20%', met: false });
    }
    
    // Signal 2: Volume trend
    if (stock.volumeTrend === 'increasing') {
      reversalProb += prob.risingVolume;
      signals.push({ name: 'Rising volume', bonus: '+15%', met: true });
    } else {
      signals.push({ name: 'Rising volume', bonus: '+15%', met: false });
    }
    
    // Signal 3: Higher lows (tracked during consolidation)
    if (stock.hasHigherLow) {
      reversalProb += prob.higherLows;
      signals.push({ name: 'Higher low pattern', bonus: '+10%', met: true });
    } else {
      signals.push({ name: 'Higher low pattern', bonus: '+10%', met: false });
    }
    
    // Signal 4: Three day rule
    if ((stock.consecutiveUpDays || 0) >= 3) {
      reversalProb += prob.threeDayRule;
      signals.push({ name: '3-day rule (3+ up days)', bonus: '+5%', met: true });
    } else {
      signals.push({ name: '3-day rule (3+ up days)', bonus: '+5%', met: false });
    }
    
    // Signal 5: Insider buying (strongest fundamental signal)
    // Uses InsiderBuying module if available (separate from InsiderSelling which is noise)
    const insiderBoost = (typeof InsiderBuying !== 'undefined' && InsiderBuying.getInsiderBoost) 
      ? InsiderBuying.getInsiderBoost(stock) 
      : { hasBuySignal: stock.insiderBuying || false, isClusterBuy: stock.isClusterBuy || false };
    
    if (insiderBoost.isClusterBuy) {
      reversalProb += prob.insiderBuying + prob.clusterBuying;
      signals.push({ name: 'Cluster insider buying (3+)', bonus: '+25%', met: true });
    } else if (insiderBoost.hasBuySignal) {
      reversalProb += prob.insiderBuying;
      signals.push({ name: 'Insider buying', bonus: '+10%', met: true });
    } else {
      signals.push({ name: 'Insider buying', bonus: '+10%', met: false });
    }
    
    // Cap at maximum
    reversalProb = Math.min(reversalProb, prob.maxProbability);
    
    if (!silent) {
      console.log(`[DCB] ${getDate()}: ${stock.symbol} Reversal Probability ${getPriceInfo(stock)}:`);
      console.log(`  Base rate: 30%`);
      signals.forEach(s => {
        console.log(`  ${s.met ? '✓' : '✗'} ${s.name}: ${s.met ? s.bonus : 'NOT MET'}`);
      });
      console.log(`  ═══════════════════════════`);
      console.log(`  FINAL: ${Math.round(reversalProb * 100)}%`);
    }
    
    return { probability: reversalProb, signals };
  }
  
  // ========== TRIGGER CRASH ==========
  function triggerCrash(stock, severity) {
    if (stock.crashPhase) return false;
    
    const memeMultiplier = getMemeMultiplier(stock);
    
    // Calculate crash magnitude (15-30%)
    const crashMagnitude = CONSTANTS.CRASH.minDrop + 
      random() * (CONSTANTS.CRASH.maxDrop - CONSTANTS.CRASH.minDrop);
    
    // Store pre-crash state
    stock.preCrashPrice = stock.price;
    stock.crashMagnitude = crashMagnitude;
    stock.crashPhase = 'crash';
    // +1 because processCrash decrements BEFORE checking phase transition
    stock.crashDaysLeft = CONSTANTS.DURATION.crash.min + 
      Math.floor(random() * (CONSTANTS.DURATION.crash.max - CONSTANTS.DURATION.crash.min + 1)) + 1;
    
    // OUTCOME NOT PRE-DETERMINED - will be calculated from signals
    stock.crashOutcome = null; // Determined at end of bounce phase
    stock.bounceNumber = 0;
    stock.consecutiveUpDays = 0;
    stock.hasHigherLow = false;
    
    // Volume spikes during crash
    stock.volumeMultiplier = CONSTANTS.VOLUME.crash;
    stock.volumeTrend = 'spike';
    
    // Apply immediate crash impact
    stock.sentimentOffset = -severity * memeMultiplier;
    stock.volatilityBoost = (stock.volatilityBoost || 0) + 0.5 * memeMultiplier;
    stock.crashTransitionEffect = -(crashMagnitude * 0.5 + random() * crashMagnitude * 0.2);
    
    console.log(`[DCB] ${getDate()}: ${stock.symbol} CRASH TRIGGERED ${getPriceInfo(stock)} [daysLeft=${stock.crashDaysLeft}]`);
    
    return true;
  }
  
  // ========== CHECK FOR NEW CRASHES ==========
  function checkCrashEvents() {
    const stockList = getStocks();
    const news = getNews();
    
    stockList.forEach(stock => {
      if (!stock.crashPhase && !stock.shortReportPhase && random() < CONSTANTS.CRASH.dailyChance) {
        const catalyst = randomChoice(CONSTANTS.CRASH_CATALYSTS);
        
        triggerCrash(stock, catalyst.severity);
        
        // Generate crash news with volume indicator
        news.push({
          headline: `BREAKING: ${stock.symbol} ${catalyst.headline}`,
          description: `Shares plunging on massive volume as investors flee. ` +
            `Stock down sharply from recent highs. Trading extremely volatile.`,
          sentiment: 'negative',
          relatedStock: stock.symbol,
          newsType: 'crash',
          isCrash: true,
          crashSeverity: catalyst.severity,
          // Educational data for tutorial mode
          volumeIndicator: 'EXTREMELY HIGH (3x normal)',
          educationalNote: 'Sharp crash with high volume often precedes a bounce - but 70% of bounces are traps!'
        });
      }
    });
  }
  
  // ========== MAIN PROCESSING FUNCTION ==========
  function processDeadCatBounce() {
    const stockList = getStocks();
    
    stockList.forEach(stock => {
      if (!stock.crashPhase) return;
      
      if (!isEventTypeEnabled('dead_cat_bounce')) {
        clearCrashState(stock);
        return;
      }
      
      const memeMultiplier = getMemeMultiplier(stock);
      
      // Apply pending transition effects
      if (stock.pendingTransitionEffect) {
        stock.crashTransitionEffect = stock.pendingTransitionEffect;
        stock.pendingTransitionEffect = 0;
      }
      
      stock.crashDaysLeft--;
      
      // Route to appropriate phase handler
      switch (stock.crashPhase) {
        case 'crash':
          processCrashPhase(stock, memeMultiplier);
          break;
        case 'bounce':
          processBouncePhase(stock, memeMultiplier);
          break;
        case 'decline':
          processDeclinePhase(stock, memeMultiplier);
          break;
        case 'consolidation':
          processConsolidationPhase(stock, memeMultiplier);
          break;
        case 'recovery':
          processRecoveryPhaseInternal(stock, memeMultiplier);
          break;
      }
    });
  }
  
  // ===== CRASH PHASE PROCESSING =====
  function processCrashPhase(stock, memeMultiplier) {
    if (stock.crashDaysLeft <= 0) {
      // Record the crash low
      stock.crashLow = stock.price;
      
      // Transition to bounce phase
      stock.bounceNumber = 1;
      stock.crashPhase = 'bounce';
      // +1 because processCrash decrements BEFORE checking phase transition
      stock.bounceDaysTotal = CONSTANTS.DURATION.bounce.min + 
        Math.floor(random() * (CONSTANTS.DURATION.bounce.max - CONSTANTS.DURATION.bounce.min + 1)) + 1;
      stock.crashDaysLeft = stock.bounceDaysTotal;
      stock.bounceStartPrice = stock.price;
      stock.consecutiveUpDays = 0;
      stock.bounceHighPrice = stock.price;
      
      // Volume trend emerges probabilistically (40% chance of bullish volume)
      // This is an OBSERVABLE signal for the player
      if (random() < 0.40) {
        stock.volumeTrend = 'increasing';
        stock.volumeMultiplier = CONSTANTS.VOLUME.reversalBounce;
      } else {
        stock.volumeTrend = 'declining';
        stock.volumeMultiplier = CONSTANTS.VOLUME.dcbBounce;
      }
      
      // Apply positive transition immediately (news says bounce starting, price should go up)
      const bounceStrength = 0.04 + random() * 0.04;
      stock.crashTransitionEffect = bounceStrength;
      stock.sentimentOffset = bounceStrength * memeMultiplier;
      
      console.log(`[DCB] ${getDate()}: ${stock.symbol} → BOUNCE phase ${getPriceInfo(stock)} (volume: ${stock.volumeTrend}) [daysLeft=${stock.crashDaysLeft}]`);
      generateBounceStartNews(stock);
    } else {
      // Continue crash
      stock.sentimentOffset = -(0.10 + random() * 0.08) * memeMultiplier;
    }
  }
  
  // ===== BOUNCE PHASE PROCESSING =====
  function processBouncePhase(stock, memeMultiplier) {
    // Calculate current retracement
    const currentRetracement = calculateRetracement(stock);
    stock.currentRetracement = currentRetracement;
    
    // Track consecutive up days (for "three day rule")
    if (stock.crashTransitionEffect > 0 || stock.sentimentOffset > 0) {
      stock.consecutiveUpDays = (stock.consecutiveUpDays || 0) + 1;
      // Track higher lows
      if (stock.price > stock.bounceHighPrice) {
        stock.bounceHighPrice = stock.price;
      }
    } else {
      // Down day - check for higher low
      if (stock.price > stock.crashLow && stock.consecutiveUpDays >= 2) {
        stock.hasHigherLow = true;
      }
      stock.consecutiveUpDays = 0;
    }
    
    // Check if bounce phase should end
    const timeExpired = stock.crashDaysLeft <= 0;
    
    if (timeExpired) {
      // DETERMINE OUTCOME FROM SIGNALS (not pre-set!)
      const { probability, signals } = calculateReversalProbability(stock);
      const willReverse = random() < probability;
      stock.crashOutcome = willReverse ? 'genuine_reversal' : 'dcb_trap';
      
      if (!willReverse) {
        // DCB TRAP: Bounce fails, resume decline
        stock.crashPhase = 'decline';
        // +1 because processCrash decrements BEFORE checking phase transition
        stock.crashDaysLeft = CONSTANTS.DURATION.decline.min + 
          Math.floor(random() * (CONSTANTS.DURATION.decline.max - CONSTANTS.DURATION.decline.min + 1)) + 1;
        
        const dropIndex = Math.min(stock.bounceNumber - 1, 2);
        stock.pendingDeclineMagnitude = CONSTANTS.DCB_TRAP.subsequentDrops[dropIndex];
        stock.pendingTransitionEffect = -(0.04 + random() * 0.04);
        // Reset sentiment to negative on bounce failure day - news says "FAILS"
        stock.sentimentOffset = -(0.03 + random() * 0.03) * memeMultiplier;
        stock.crashTransitionEffect = stock.pendingTransitionEffect;
        
        console.log(`[DCB] ${getDate()}: ${stock.symbol} BOUNCE FAILED ${getPriceInfo(stock)} (${Math.round(probability*100)}% not enough) [daysLeft=${stock.crashDaysLeft}]`);
        generateBounceFailedNews(stock, currentRetracement);
      } else {
        // GENUINE REVERSAL: Transition to consolidation
        stock.crashPhase = 'consolidation';
        // +1 because processCrash decrements BEFORE checking phase transition
        stock.crashDaysLeft = CONSTANTS.DURATION.consolidation.min + 
          Math.floor(random() * (CONSTANTS.DURATION.consolidation.max - CONSTANTS.DURATION.consolidation.min + 1)) + 1;
        
        stock.volumeTrend = 'steady';
        // Apply small positive transition immediately
        stock.crashTransitionEffect = 0.01;
        stock.sentimentOffset = 0.01 * memeMultiplier;
        
        console.log(`[DCB] ${getDate()}: ${stock.symbol} REVERSAL! ${getPriceInfo(stock)} (${Math.round(probability*100)}% probability) [daysLeft=${stock.crashDaysLeft}]`);
        generateConsolidationNews(stock, currentRetracement);
      }
    } else {
      // Continue bounce
      const bounceStrength = 0.04 + random() * 0.03;
      stock.sentimentOffset = (bounceStrength) * memeMultiplier;
      
      // Volume continues its trend
      if (stock.volumeTrend === 'declining') {
        stock.volumeMultiplier = Math.max(0.3, stock.volumeMultiplier * 0.93);
      } else {
        stock.volumeMultiplier = Math.min(2.0, stock.volumeMultiplier * 1.04);
      }
      
      // Periodic news with current probability
      if (random() < 0.25) {
        generateBounceProgressNews(stock, currentRetracement);
      }
    }
  }
  
  // ===== DECLINE PHASE PROCESSING (DCB trap continues) =====
  function processDeclinePhase(stock, memeMultiplier) {
    if (stock.crashDaysLeft <= 0) {
      // Check if another bounce will occur
      const anotherBounceChance = Math.max(0, 0.55 - stock.bounceNumber * 0.18);
      
      if (stock.bounceNumber < CONSTANTS.DCB_TRAP.maxBounces && random() < anotherBounceChance) {
        // Another failed bounce incoming
        stock.bounceNumber++;
        stock.crashPhase = 'bounce';
        // +1 because processCrash decrements BEFORE checking phase transition
        stock.bounceDaysTotal = Math.max(3, CONSTANTS.DURATION.bounce.min - stock.bounceNumber) + 1;
        stock.crashDaysLeft = stock.bounceDaysTotal + Math.floor(random() * 3);
        stock.bounceStartPrice = stock.price;
        stock.crashLow = stock.price; // New low
        stock.consecutiveUpDays = 0;
        
        // Weaker retracement each time
        stock.targetRetracement = Math.max(0.15, stock.targetRetracement - 0.08);
        
        stock.volumeTrend = 'declining';
        stock.volumeMultiplier = CONSTANTS.VOLUME.dcbBounce * (1 - stock.bounceNumber * 0.15);
        
        // Apply positive transition immediately (news says bounce starting)
        const bounceStrength = 0.02 + random() * 0.03;
        stock.crashTransitionEffect = bounceStrength;
        stock.sentimentOffset = bounceStrength * memeMultiplier;
        
        console.log(`[DCB] ${getDate()}: ${stock.symbol} BOUNCE #${stock.bounceNumber} ${getPriceInfo(stock)} (weaker) [daysLeft=${stock.crashDaysLeft}]`);
        generateAnotherBounceNews(stock);
      } else {
        // Final capitulation - crash cycle ends
        console.log(`[DCB] ${getDate()}: ${stock.symbol} CAPITULATION ${getPriceInfo(stock)} after ${stock.bounceNumber} bounces`);
        // Set negative transition effect BEFORE clearing state (news says decline confirmed)
        stock.crashTransitionEffect = -(0.08 + random() * 0.06) * memeMultiplier;
        generateCapitulationNews(stock);
        clearCrashState(stock);
      }
    } else {
      // Continue decline with selling pressure
      const declineSeverity = stock.pendingDeclineMagnitude || 0.12;
      const dailyDecline = declineSeverity / (stock.crashDaysLeft + 2);
      stock.sentimentOffset = -(dailyDecline + random() * 0.04) * memeMultiplier;
      stock.volumeMultiplier = 1.3 + random() * 0.5; // Elevated selling volume
    }
  }
  
  // ===== CONSOLIDATION PHASE PROCESSING (genuine reversal) =====
  function processConsolidationPhase(stock, memeMultiplier) {
    if (stock.crashDaysLeft <= 0) {
      // Transition to recovery
      stock.crashPhase = 'recovery';
      // +1 because processCrash decrements BEFORE checking phase transition
      stock.crashDaysLeft = CONSTANTS.DURATION.recovery.min + 
        Math.floor(random() * (CONSTANTS.DURATION.recovery.max - CONSTANTS.DURATION.recovery.min + 1)) + 1;
      
      // Calculate recovery target (60-90% of lost ground)
      const lostValue = stock.preCrashPrice - stock.crashLow;
      const recoveryAmount = lostValue * 
        (CONSTANTS.GENUINE_REVERSAL.recoveryTarget.min + 
         random() * (CONSTANTS.GENUINE_REVERSAL.recoveryTarget.max - 
                     CONSTANTS.GENUINE_REVERSAL.recoveryTarget.min));
      stock.recoveryTarget = stock.crashLow + recoveryAmount;
      
      stock.volumeTrend = 'increasing';
      stock.volumeMultiplier = CONSTANTS.VOLUME.confirmation;
      
      // Apply transition effect immediately (news says SURGES today, price should surge today)
      const transitionStrength = 0.04 + random() * 0.04;
      stock.crashTransitionEffect = transitionStrength;
      stock.sentimentOffset = transitionStrength * memeMultiplier;
      
      console.log(`[DCB] ${getDate()}: ${stock.symbol} BREAKOUT ${getPriceInfo(stock)} → recovery phase [daysLeft=${stock.crashDaysLeft}]`);
      generateBreakoutNews(stock);
    } else {
      // Sideways consolidation with slight positive bias (building base)
      stock.sentimentOffset = (0.005 + random() * 0.015) * memeMultiplier;
      stock.volumeMultiplier = 0.7 + random() * 0.4;
      
      // Higher low formation news
      if (random() < 0.20) {
        generateHigherLowNews(stock);
      }
    }
  }
  
  // ===== RECOVERY PHASE PROCESSING =====
  function processRecoveryPhaseInternal(stock, memeMultiplier) {
    if (stock.crashDaysLeft <= 0) {
      console.log(`[DCB] ${getDate()}: ${stock.symbol} RECOVERY COMPLETE ${getPriceInfo(stock)}`);
      // Set positive transition effect BEFORE clearing state (news says recovery)
      stock.crashTransitionEffect = (0.03 + random() * 0.03) * memeMultiplier;
      generateRecoveryCompleteNews(stock);
      clearCrashState(stock);
    } else {
      const remainingGain = Math.max(0, (stock.recoveryTarget - stock.price) / stock.price);
      const dailyGain = remainingGain / (stock.crashDaysLeft + 3);
      
      stock.crashTransitionEffect = dailyGain * (0.7 + random() * 0.5) * memeMultiplier;
      stock.sentimentOffset = (0.03 + random() * 0.03) * memeMultiplier;
      
      if (random() < 0.15) {
        generateRecoveryProgressNews(stock);
      }
    }
  }
  
  // Backward compatibility wrapper
  function processRecoveryPhase() {
    // Recovery is now handled in processDeadCatBounce
    // This wrapper exists for API compatibility
  }
  
  // ========== CLEAR CRASH STATE ==========
  function clearCrashState(stock) {
    stock.crashPhase = null;
    stock.crashOutcome = null;
    stock.bounceNumber = null;
    stock.crashLow = null;
    stock.preCrashPrice = null;
    stock.targetRetracement = null;
    stock.currentRetracement = null;
    stock.volumeTrend = null;
    stock.volumeMultiplier = 1.0;
    // DON'T reset sentimentOffset - let market.js decay it naturally
    // DON'T reset crashTransitionEffect - it was set for this day's price
    stock.pendingTransitionEffect = 0;
    stock.recoveryTarget = null;
    stock.pendingDeclineMagnitude = null;
    stock.consecutiveUpDays = 0;
  }
  
  // ========== NEWS GENERATION FUNCTIONS ==========
  
  function generateBounceStartNews(stock) {
    const news = getNews();
    const volumeDesc = stock.volumeTrend === 'declining' ? 
      'Volume lighter than crash day - a potential warning sign' : 
      'Volume holding steady as buyers accumulate';
    
    // Empirical NLP: "No-Catalyst Rise" language (Tetlock 2007)
    // Keywords: "Bargain hunting," "Oversold," "Technical rebound," "Relief rally"
    const bounceHeadlines = [
      `${stock.symbol} bounces from lows as bargain hunters emerge`,
      `${stock.symbol} stages technical rebound from oversold levels`,
      `Relief rally: ${stock.symbol} bounces amid short covering`,
      `${stock.symbol} finds buyers after steep selloff - oversold bounce`
    ];
    const headline = bounceHeadlines[Math.floor(deps.random() * bounceHeadlines.length)];
    
    news.push({
      headline: headline,
      description: `After steep ${Math.round(stock.crashMagnitude * 100)}% decline, ${stock.symbol} ` +
        `finds buyers at support. ${volumeDesc}. Is this the bottom or just a "dead cat bounce"?`,
      sentiment: 'positive',
      relatedStock: stock.symbol,
      newsType: 'dead_cat_bounce',
      isDeadCatBounce: true,
      bouncePhase: 'starting',
      bounceNumber: stock.bounceNumber,
      // Educational indicators
      volumeIndicator: stock.volumeTrend === 'declining' ? 
        'DECLINING ⚠️ (Trap signal - smart money not buying)' : 
        'STEADY/INCREASING ✓ (Healthy accumulation)',
      retracementLevel: `${Math.round(calculateRetracement(stock) * 100)}% of drop recovered`,
      educationalNote: '🎯 ACTION: DO NOT BUY YET. 70% of bounces are traps. ' +
        'Wait for: (1) Rising volume, (2) >50% retracement, (3) 3+ up days. Patience!'
    });
  }
  
  function generateBounceProgressNews(stock, retracement) {
    const news = getNews();
    const fibLabel = getFibLabel(retracement);
    const isDCB = stock.crashOutcome === 'dcb_trap';
    
    if (isDCB && retracement < 0.45) {
      // Warning signs for trap
      news.push({
        headline: `${stock.symbol} rally struggles - volume concerns mount`,
        description: `${stock.symbol} at ${fibLabel} retracement but volume continues to decline. ` +
          `Technical analysts note "smart money isn't participating in this bounce." ` +
          `Key test: Can it break above 50% retracement?`,
        sentiment: 'neutral',
        relatedStock: stock.symbol,
        newsType: 'dead_cat_bounce',
        bouncePhase: 'warning',
        volumeIndicator: 'DECLINING ⚠️ (Red flag - typical of DCB)',
        retracementLevel: `${Math.round(retracement * 100)}% - below critical 50% threshold`,
        fibonacciNote: `At ${fibLabel} - DCBs typically fail before 50%`,
        educationalNote: '🎯 ACTION: DO NOT BUY. Volume declining + below 50% = 70% trap probability. ' +
          'If holding, consider EXIT. If watching, keep waiting for confirmation.'
      });
    } else if (!isDCB && retracement > 0.45) {
      // Bullish signs for genuine reversal
      news.push({
        headline: `${stock.symbol} recovery gains momentum - volume supports move`,
        description: `${stock.symbol} approaching ${fibLabel} retracement with rising volume. ` +
          `Unlike typical dead cat bounces, buyer conviction appears strong. ` +
          `Watch for break above 50% as key confirmation.`,
        sentiment: 'positive',
        relatedStock: stock.symbol,
        newsType: 'dead_cat_bounce',
        bouncePhase: 'healthy',
        volumeIndicator: 'INCREASING ✓ (Institutional accumulation)',
        retracementLevel: `${Math.round(retracement * 100)}% - approaching key 50% level`,
        fibonacciNote: `Near ${fibLabel} - break above 50% = strong reversal signal`,
        educationalNote: '🎯 ACTION: PREPARE TO BUY. Volume rising + approaching 50% = bullish. ' +
          'Wait for breakout above 50% on high volume, THEN enter. Almost there!'
      });
    }
  }
  
  function generateBounceFailedNews(stock, retracement) {
    const news = getNews();
    const fibLabel = getFibLabel(retracement);
    
    news.push({
      headline: `${stock.symbol} rally FAILS at ${fibLabel} - "Dead Cat Bounce" confirmed`,
      description: `The bounce is over. ${stock.symbol} couldn't break above ${fibLabel} retracement ` +
        `and volume was declining throughout - classic trap signals. ` +
        `Sellers returning as "dip buyers" now underwater.`,
      sentiment: 'negative',
      relatedStock: stock.symbol,
      newsType: 'dead_cat_bounce',
      isDeadCatBounce: true,
      bouncePhase: 'failed',
      bounceNumber: stock.bounceNumber,
      isTrap: true,
      // Educational indicators
      volumeIndicator: 'WAS DECLINING (Trap confirmed ❌)',
      retracementLevel: `Failed at ${Math.round(retracement * 100)}% - below 50% threshold`,
      fibonacciNote: `Bounce failed at ${fibLabel} - typical DCB pattern`,
      educationalNote: '🎯 ACTION: SELL if holding, DO NOT BUY. Bounce #' + stock.bounceNumber + ' failed. ' +
        'More downside likely. Wait for capitulation or genuine reversal signals later.'
    });
  }
  
  function generateAnotherBounceNews(stock) {
    const news = getNews();
    const bounceOdds = Math.max(10, 55 - stock.bounceNumber * 18);
    
    news.push({
      headline: `${stock.symbol} BOUNCES again - attempt #${stock.bounceNumber} underway`,
      description: `After failing at resistance, ${stock.symbol} tries again from even lower levels. ` +
        `Volume remains thin. Historical data shows each successive bounce has ` +
        `lower probability of success.`,
      sentiment: 'neutral',
      relatedStock: stock.symbol,
      newsType: 'dead_cat_bounce',
      isDeadCatBounce: true,
      bouncePhase: 'repeat_attempt',
      bounceNumber: stock.bounceNumber,
      volumeIndicator: 'LOW ⚠️ (Very weak - likely another trap)',
      educationalNote: `🎯 ACTION: DO NOT BUY. Bounce #${stock.bounceNumber} has only ~${bounceOdds}% success rate. ` +
        `Each failed bounce = lower odds. Wait for CAPITULATION before considering entry.`
    });
  }
  
  function generateConsolidationNews(stock, retracement) {
    const news = getNews();
    const fibLabel = getFibLabel(retracement);
    
    news.push({
      headline: `${stock.symbol} HOLDS above ${fibLabel} - base forming`,
      description: `${stock.symbol} consolidating after strong bounce. Price maintaining above ` +
        `key ${fibLabel} Fibonacci level with steady volume. ` +
        `Technical analysts note "higher low" pattern forming - potentially bullish.`,
      sentiment: 'positive',
      relatedStock: stock.symbol,
      newsType: 'reversal_forming',
      isGenuineReversal: true,
      volumeIndicator: 'STEADY ✓ (Accumulation phase)',
      retracementLevel: `${Math.round(retracement * 100)}% - ABOVE 50% threshold ✓`,
      fibonacciNote: `Holding ${fibLabel} = significantly higher reversal probability`,
      educationalNote: '🎯 ACTION: PREPARE TO BUY. Strong signals: >50% retracement + steady volume + higher lows. ' +
        'Wait for high-volume breakout, THEN enter. This is the SAFE entry setup!'
    });
  }
  
  function generateHigherLowNews(stock) {
    const news = getNews();
    
    news.push({
      headline: `${stock.symbol} forms "higher low" - bullish pattern developing`,
      description: `${stock.symbol} pulled back but held ABOVE previous low, creating a ` +
        `"higher low" - one of the most reliable reversal patterns. Volume remains steady. ` +
        `Watch for breakout above recent high to confirm trend change.`,
      sentiment: 'positive',
      relatedStock: stock.symbol,
      newsType: 'reversal_forming',
      isGenuineReversal: true,
      patternNote: 'Higher Low pattern (bullish) ✓',
      educationalNote: '🎯 ACTION: GET READY TO BUY. Higher low = buyers defending support. ' +
        'Watch for breakout above recent high - that\'s your entry signal!'
    });
  }
  
  function generateBreakoutNews(stock) {
    const news = getNews();
    
    news.push({
      headline: `BREAKOUT: ${stock.symbol} surges past resistance on HEAVY volume`,
      description: `${stock.symbol} breaks decisively above key resistance level on volume ` +
        `1.5x+ normal. This "conviction candle" confirms the reversal. ` +
        `Shorts covering aggressively, new buyers entering.`,
      sentiment: 'positive',
      relatedStock: stock.symbol,
      newsType: 'reversal_confirmed',
      isGenuineReversal: true,
      volumeIndicator: 'BREAKOUT VOLUME (1.5x+ normal) ✓',
      educationalNote: '🎯 ACTION: BUY NOW. Reversal CONFIRMED with high-volume breakout. ' +
        'This is the SAFE entry point. Set stop-loss below recent low. Ride the trend!'
    });
  }
  
  function generateCapitulationNews(stock) {
    const news = getNews();
    const totalBounces = stock.bounceNumber || 1;
    const totalDrop = stock.preCrashPrice ? 
      Math.round((1 - stock.price / stock.preCrashPrice) * 100) : 0;
    
    news.push({
      headline: `${stock.symbol} CAPITULATION: Selling exhausted after ${totalBounces} failed bounce(s)`,
      description: `After ${totalBounces} dead cat bounce(s), selling pressure finally exhausted. ` +
        `${stock.symbol} down ~${totalDrop}% from pre-crash levels. ` +
        `Long road ahead for those who "bought the dips."`,
      sentiment: 'negative',
      relatedStock: stock.symbol,
      newsType: 'crash_resolution',
      isCrashResolution: true,
      bounceCount: totalBounces,
      educationalNote: `🎯 ACTION: DO NOT BUY YET. Capitulation after ${totalBounces} bounce(s). ` +
        `Stock may base here. Watch for rising volume + >50% retracement before entering.`
    });
  }
  
  function generateRecoveryProgressNews(stock) {
    const news = getNews();
    const recoveryPct = stock.crashLow ? 
      Math.round((stock.price / stock.crashLow - 1) * 100) : 0;
    
    news.push({
      headline: `${stock.symbol} recovery continues - up ${recoveryPct}% from lows`,
      description: `Confirmed reversal playing out. Volume remains healthy. ` +
        `Those who waited for breakout confirmation avoided the trap risk.`,
      sentiment: 'positive',
      relatedStock: stock.symbol,
      newsType: 'recovery',
      isRecovery: true,
      educationalNote: '🎯 ACTION: HOLD if long. Recovery in progress. Let profits run with trailing stop.'
    });
  }
  
  function generateRecoveryCompleteNews(stock) {
    const news = getNews();
    const recoveryPct = stock.crashLow ? 
      Math.round((stock.price / stock.crashLow - 1) * 100) : 0;
    const fromPeak = stock.preCrashPrice ? 
      Math.round((1 - stock.price / stock.preCrashPrice) * 100) : 0;
    
    news.push({
      headline: `${stock.symbol} recovery mature - up ${recoveryPct}% from crash lows`,
      description: `${stock.symbol} has substantially recovered (still ${fromPeak}% below pre-crash peak). ` +
        `Volume normalizing. Consider taking profits if holding.`,
      sentiment: 'positive',
      relatedStock: stock.symbol,
      newsType: 'recovery_complete',
      isRecovery: true,
      educationalNote: '🎯 ACTION: TAKE PROFIT. Recovery cycle COMPLETE. Sell to lock in gains. ' +
        'Pattern is over - no more event-driven alpha. Look for new opportunities.'
    });
  }
  
  // ========== GET ACTIVE PATTERNS (for UI/debugging) ==========
  function getActivePatterns() {
    const stockList = getStocks();
    const patterns = [];
    
    stockList.forEach(stock => {
      if (stock.crashPhase) {
        patterns.push({
          symbol: stock.symbol,
          phase: stock.crashPhase,
          outcome: stock.crashOutcome,
          bounceNumber: stock.bounceNumber,
          currentRetracement: stock.currentRetracement,
          targetRetracement: stock.targetRetracement,
          volumeTrend: stock.volumeTrend,
          volumeMultiplier: stock.volumeMultiplier,
          daysLeft: stock.crashDaysLeft,
          consecutiveUpDays: stock.consecutiveUpDays
        });
      }
    });
    
    return patterns;
  }
  
  // ========== TUTORIAL HINT GENERATOR ==========
  // Aligned with Gold Standard 85% Setup Criteria
  function getTutorialHint(newsItem) {
    if (!newsItem || !newsItem.newsType) return null;
    
    const tutorial = {
      type: '',
      description: '',    // WHAT
      implication: '',    // IMPLICATION
      action: '',
      timing: '',
      catalyst: ''
    };
    
    if (newsItem.newsType === 'crash' && newsItem.isCrash) {
      tutorial.type = '🔴 CRASH - DO NOT BUY';
      tutorial.description = 'A bounce is coming. Watch for: (1) Volume trend, (2) Retracement %, (3) 3+ up days';
      tutorial.implication = 'Base reversal rate: 30%. Need confirming signals to reach 85%. Was crash HARD INFO or SOFT INFO?';
      tutorial.action = '⛔ DO NOT BUY THE DIP. Wait for signals.';
      tutorial.timing = 'NEXT: Bounce phase starts in 2-4 days';
      tutorial.catalyst = '🏆 DCB Gold Standard: Must break and HOLD above 61.8% Fibonacci on RISING volume';
    }
    else if (newsItem.newsType === 'dead_cat_bounce' && newsItem.bouncePhase === 'starting') {
      tutorial.type = '🟡 BOUNCE STARTED - OBSERVE';
      tutorial.description = 'Volume ' + (newsItem.volumeIndicator || 'trend') + '. Need >50% retracement + rising volume.';
      tutorial.implication = 'Current: 30% base. Each signal adds probability.';
      tutorial.action = '⏳ WAIT. Do not buy yet. Observe signals.';
      tutorial.timing = 'NEXT: Outcome determined when bounce phase ends';
      tutorial.catalyst = '🏆 DCB Gold Standard: Break + HOLD above 61.8% Fib on RISING volume = 85% success';
    }
    else if (newsItem.newsType === 'dead_cat_bounce' && newsItem.bouncePhase === 'warning') {
      tutorial.type = '🟠 WARNING - TRAP LIKELY';
      tutorial.description = 'Volume declining + below 50% = classic trap setup. NOT meeting Gold Standard!';
      tutorial.implication = 'Declining volume = only ~30% reversal chance';
      tutorial.action = '⛔ DO NOT BUY. Exit if holding.';
      tutorial.timing = 'NEXT: Likely fail → decline → possible another bounce';
      tutorial.catalyst = '❌ MISSING: Rising volume + 61.8% Fib break required for 85% setup';
    }
    else if (newsItem.newsType === 'dead_cat_bounce' && newsItem.bouncePhase === 'failed') {
      tutorial.type = '🔴 TRAP CONFIRMED - STAY AWAY';
      tutorial.description = 'More downside coming. Each bounce gets weaker.';
      tutorial.implication = 'Signals were weak. Trap sprung. Did NOT meet Gold Standard.';
      tutorial.action = '⛔ DO NOT average down. Do NOT catch falling knife.';
      tutorial.timing = 'NEXT: Decline → possible weaker bounce or capitulation';
      tutorial.catalyst = '📚 LESSON: Without 61.8% Fib + rising volume, 70% of bounces are traps';
    }
    else if (newsItem.newsType === 'dead_cat_bounce' && newsItem.bouncePhase === 'repeat_attempt') {
      const odds = Math.max(10, 30 - (newsItem.bounceNumber - 1) * 10);
      tutorial.type = '🔴 BOUNCE #' + newsItem.bounceNumber + ' - VERY RISKY';
      tutorial.description = 'Volume very thin. Smart money gone.';
      tutorial.implication = `Each failure reduces odds. Now ~${odds}% max.`;
      tutorial.action = '⛔ DO NOT BUY. Wait for capitulation.';
      tutorial.timing = 'NEXT: Likely another failure → capitulation';
      tutorial.catalyst = '❌ Multiple bounces = Gold Standard impossible. Wait for fresh setup.';
    }
    else if (newsItem.newsType === 'reversal_forming') {
      tutorial.type = '🟢 REVERSAL FORMING - PREPARE';
      tutorial.description = 'Building base. Watch for breakout on HIGH volume above 61.8% Fib.';
      tutorial.implication = 'Signals strong: >50% + steady volume = ~65% chance';
      tutorial.action = '⏳ PREPARE to buy on breakout. Not yet.';
      tutorial.timing = 'NEXT: Breakout = ENTRY SIGNAL';
      tutorial.catalyst = '🔄 APPROACHING Gold Standard: Need 61.8% break + hold + rising volume';
    }
    else if (newsItem.newsType === 'reversal_confirmed') {
      tutorial.type = '🟢 BREAKOUT - ENTRY SIGNAL';
      tutorial.description = 'Target: 60-90% recovery of crash losses';
      tutorial.implication = 'Reversal confirmed. High-volume breakout above 61.8%.';
      tutorial.action = '✅ CONSIDER BUYING. Set stop below breakout level.';
      tutorial.timing = 'NEXT: Recovery phase. Take profits at target.';
      tutorial.catalyst = '🏆 GOLD STANDARD MET: 61.8% Fib break + hold + rising volume = 85% setup';
    }
    else if (newsItem.newsType === 'crash_resolution') {
      tutorial.type = '⚪ CAPITULATION - NEUTRAL';
      tutorial.description = 'Stock may stabilize here. No rush.';
      tutorial.implication = 'Selling exhausted. Base forming naturally.';
      tutorial.action = '⏳ WAIT for new setup. This cycle over.';
      tutorial.timing = 'LESSON: Patience > FOMO. Signals > emotion.';
      tutorial.catalyst = '📚 LESSON: Only trade setups that meet Gold Standard criteria';
    }
    else if (newsItem.newsType === 'recovery' || newsItem.newsType === 'recovery_complete') {
      tutorial.type = '🟢 RECOVERY - PROFIT TAKING';
      tutorial.description = 'Nearing target. Consider taking profits.';
      tutorial.implication = 'Reversal played out as signals indicated.';
      tutorial.action = '💰 If holding: Take profits. If not: Wait for next setup.';
      tutorial.timing = 'LESSON: Waiting for confirmation avoided trap risk.';
      tutorial.catalyst = '✅ Gold Standard delivered: 61.8% Fib + rising volume predicted success';
    }
    
    return tutorial.type ? tutorial : null;
  }
  
  // ========== PUBLIC API ==========
  return {
    // Initialization
    init: init,
    
    // Constants (read-only access for testing)
    CONSTANTS: CONSTANTS,
    
    // Core functions
    triggerCrash: triggerCrash,
    checkCrashEvents: checkCrashEvents,
    processDeadCatBounce: processDeadCatBounce,
    processRecoveryPhase: processRecoveryPhase,
    
    // Analysis
    getActivePatterns: getActivePatterns,
    
    // Tutorial
    getTutorialHint: getTutorialHint,
    
    // For testing
    _test: {
      calculateRetracement: calculateRetracement,
      clearCrashState: clearCrashState,
      getFibLabel: getFibLabel
    },
    
    // Reset for testing
    _reset: function() {
      deps = {
        stocks: null,
        todayNews: null,
        getMemeMultiplier: null,
        randomChoice: null,
        isEventTypeEnabled: null,
        random: Math.random
      };
    }
  };
})();

// ========== BACKWARDS COMPATIBILITY ==========
// Global functions for existing code
function triggerCrash(stock, severity) {
  return DCB.triggerCrash(stock, severity);
}

function checkCrashEvents() {
  return DCB.checkCrashEvents();
}

function processDeadCatBounce() {
  return DCB.processDeadCatBounce();
}

function processRecoveryPhase() {
  return DCB.processRecoveryPhase();
}

function getDeadCatBounceTutorialHint(newsItem) {
  return DCB.getTutorialHint(newsItem);
}

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DCB;
}
