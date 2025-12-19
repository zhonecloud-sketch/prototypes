// ===== INSIDER SELLING SIGNALS SYSTEM (EMPIRICALLY-BASED) =====
// Based on academic research on insider sale predictive power (or lack thereof)
//
// EMPIRICAL FOUNDATIONS:
// - Lakonishok & Lee (2001): Insider SALES have minimal predictive power
// - Seyhun (1998): "Insider selling is not informative about future returns"
// - Jeng, Metrick & Zeckhauser (2003): Sells show no abnormal returns
// - Cohen, Malloy & Pomorski (2012): "Routine" insider sales are noise
//
// KEY INSIGHT: WHY INSIDER SELLING IS MOSTLY NOISE
// ═══════════════════════════════════════════════════════════════════
// Insiders sell for MANY reasons that have NOTHING to do with stock outlook:
//
// NON-BEARISH REASONS (93% of insider sales):
//   • Tax planning / tax loss harvesting
//   • Portfolio diversification (don't put all eggs in one basket)
//   • Estate planning / wealth transfer
//   • Home purchase / mortgage down payment
//   • Tuition / college expenses
//   • Divorce settlement
//   • Scheduled 10b5-1 plan (automatic selling)
//   • Liquidity needs (cash for any purpose)
//
// POTENTIALLY BEARISH (only ~7% of insider sales):
//   • Actually believes stock is overvalued
//   • Knows bad news is coming
//
// THE ASYMMETRY:
//   BUYING = One reason (bullish) → STRONG SIGNAL
//   SELLING = Many reasons (mostly not bearish) → NOISE
//
// EXCEPTION: CLUSTER SELLING
// When 3+ insiders sell within 2 weeks, it MAY indicate concern.
// But even then, could be coordinated tax planning or lockup expiry.
//
// EDUCATIONAL PURPOSE:
// Teaches players to:
// 1. NOT overreact to insider selling (common retail mistake)
// 2. Understand the asymmetry between buying and selling signals
// 3. Recognize that "insider sold!" headlines are usually clickbait
// 4. Only pay attention to cluster selling as a weak warning
// 5. Focus on insider BUYING instead as the actionable signal
//
// ARCHITECTURE:
// This module generates insider selling events primarily for EDUCATION.
// The key lesson is that these events should be mostly IGNORED.

const InsiderSelling = (function() {
  'use strict';

  // ========== EMPIRICALLY-BASED CONSTANTS ==========
  const CONSTANTS = {
    // ========== NOT IN GOLD STANDARD ==========
    // Insider SELLING is explicitly EXCLUDED from Gold Standard criteria
    NOT_GOLD_STANDARD: {
      description: 'Insider selling is NOISE - NOT a reliable bearish signal',
      reason: 'Insiders sell for many non-bearish reasons (93% of sales)',
      nonBearishReasons: [
        'Tax planning / tax loss harvesting',
        'Portfolio diversification',
        '10b5-1 pre-scheduled plans',
        'Estate planning / wealth transfer',
        'Home purchase / mortgage',
        'Tuition / education expenses',
        'Divorce settlement',
        'General liquidity needs'
      ],
      bearishPercentage: 0.07,       // Only ~7% of insider sales are bearish
      educationalNote: 'THE ASYMMETRY: Buying = ONE reason (bullish). Selling = MANY reasons (93% NOT bearish).'
    },
    
    // Event probability (selling is more common than buying)
    EVENT: {
      dailyProbability: 0.012,       // 1.2% per stock per day (more common)
      vestingMultiplier: 1.5,        // More selling after vesting periods
      clusterWindow: 14              // Days to count as "cluster"
    },

    // Signal strength (mostly ZERO - key educational point)
    SIGNAL: {
      singleSellPenalty: 0.0,        // NO PENALTY for single sell (it's noise!)
      clusterSellPenalty: 0.10,      // -10% only if 3+ insiders sell
      clusterThreshold: 3,           // Number of insiders for "cluster"
      signalDecay: 30                // Track sells for 30 days
    },

    // Sale amounts
    AMOUNTS: {
      small:   { min: 200000,   max: 1000000,  label: '$200K-$1M',   weight: 0.5 },
      medium:  { min: 1000000,  max: 5000000,  label: '$1M-$5M',     weight: 1.0 },
      large:   { min: 5000000,  max: 20000000, label: '$5M-$20M',    weight: 1.2 },
      massive: { min: 20000000, max: 100000000, label: '$20M+',      weight: 1.5 }
    },

    // Insider titles
    TITLES: {
      ceo:      { name: 'CEO',       weight: 1.0, description: 'Chief Executive Officer' },
      cfo:      { name: 'CFO',       weight: 1.0, description: 'Chief Financial Officer' },
      chairman: { name: 'Chairman',  weight: 1.0, description: 'Chairman of the Board' },
      coo:      { name: 'COO',       weight: 1.0, description: 'Chief Operating Officer' },
      director: { name: 'Director',  weight: 1.0, description: 'Board Member' },
      vp:       { name: 'VP',        weight: 1.0, description: 'Vice President' },
      owner10:  { name: '10% Owner', weight: 1.0, description: 'Beneficial Owner >10%' }
    },

    // REASONS insiders sell (educational - explains why selling is noise)
    // Frequency based on research estimates
    SELL_REASONS: [
      { reason: 'Tax planning',              frequency: 0.22, isBearish: false, 
        explanation: 'Selling to pay taxes or harvest losses - completely normal' },
      { reason: 'Portfolio diversification', frequency: 0.20, isBearish: false,
        explanation: 'Reducing concentration risk - prudent wealth management' },
      { reason: 'Scheduled 10b5-1 plan',     frequency: 0.18, isBearish: false,
        explanation: 'Pre-scheduled automatic sales - set months in advance' },
      { reason: 'Estate planning',           frequency: 0.10, isBearish: false,
        explanation: 'Wealth transfer to family - not related to stock outlook' },
      { reason: 'Home purchase',             frequency: 0.08, isBearish: false,
        explanation: 'Needs cash for real estate - life event, not stock view' },
      { reason: 'Tuition/Education',         frequency: 0.06, isBearish: false,
        explanation: 'Paying for kids\' college - timing driven by need, not stock' },
      { reason: 'Divorce settlement',        frequency: 0.04, isBearish: false,
        explanation: 'Court-ordered asset division - forced sale' },
      { reason: 'Liquidity needs',           frequency: 0.05, isBearish: false,
        explanation: 'General cash needs - could be anything' },
      { reason: 'Believes stock overvalued', frequency: 0.07, isBearish: true,
        explanation: 'Actually thinks stock will decline - RARE' }
    ],

    // Form 4 transaction codes
    FORM4_CODES: {
      S: { code: 'S', name: 'Open Market Sale', signal: 'NOISE', description: 'Usually not predictive' },
      F: { code: 'F', name: 'Tax Withholding', signal: 'NEUTRAL', description: 'Automatic for taxes' },
      G: { code: 'G', name: 'Gift', signal: 'NEUTRAL', description: 'Charitable/family gift' }
    }
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

    return InsiderSelling;
  }

  // ========== HELPER FUNCTIONS ==========
  function getStocks() {
    return deps.stocks || (typeof stocks !== 'undefined' ? stocks : []);
  }

  function getNews() {
    return deps.todayNews || (typeof todayNews !== 'undefined' ? todayNews : []);
  }

  function random() {
    return deps.random();
  }

  function randomChoice(arr) {
    if (deps.randomChoice) return deps.randomChoice(arr);
    return arr[Math.floor(random() * arr.length)];
  }

  function isEventTypeEnabled(eventType) {
    if (deps.isEventTypeEnabled) return deps.isEventTypeEnabled(eventType);
    if (typeof window !== 'undefined' && typeof window.isEventTypeEnabled === 'function') {
      return window.isEventTypeEnabled(eventType);
    }
    return true;
  }

  // Format dollar amounts for display
  function formatDollarAmount(amount) {
    if (amount >= 1000000) {
      return '$' + (amount / 1000000).toFixed(1) + 'M';
    } else if (amount >= 1000) {
      return '$' + (amount / 1000).toFixed(0) + 'K';
    }
    return '$' + amount.toFixed(0);
  }

  // Get random insider title
  function getRandomTitle() {
    const titles = CONSTANTS.TITLES;
    const titleKeys = Object.keys(titles);
    return titles[titleKeys[Math.floor(random() * titleKeys.length)]];
  }

  // Get random sale amount (tends larger than buys)
  function getRandomAmount() {
    const amounts = CONSTANTS.AMOUNTS;
    const roll = random();
    
    // Distribution: 25% small, 40% medium, 25% large, 10% massive
    if (roll < 0.25) {
      return { 
        value: amounts.small.min + random() * (amounts.small.max - amounts.small.min),
        category: amounts.small
      };
    } else if (roll < 0.65) {
      return { 
        value: amounts.medium.min + random() * (amounts.medium.max - amounts.medium.min),
        category: amounts.medium
      };
    } else if (roll < 0.90) {
      return { 
        value: amounts.large.min + random() * (amounts.large.max - amounts.large.min),
        category: amounts.large
      };
    } else {
      return { 
        value: amounts.massive.min + random() * (amounts.massive.max - amounts.massive.min),
        category: amounts.massive
      };
    }
  }

  // Get random sell reason (weighted by frequency)
  function getRandomSellReason() {
    const reasons = CONSTANTS.SELL_REASONS;
    let roll = random();
    let cumulative = 0;
    
    for (const r of reasons) {
      cumulative += r.frequency;
      if (roll <= cumulative) {
        return r;
      }
    }
    return reasons[0]; // Default to tax planning
  }

  // ========== CALCULATE SIGNAL STRENGTH ==========
  function calculateSignal(stock) {
    const result = {
      hasSellSignal: false,
      isClusterSell: false,
      isNoise: true,                 // Key insight: selling is almost always noise
      sellCount: 0,
      probabilityPenalty: 0,        // Note: Usually ZERO
      signalStrength: 'NOISE',      // Key point: selling is noise
      signals: [],
      recentSells: [],
      plannedSalesCount: 0,
      discretionarySalesCount: 0
    };

    // Initialize array if needed
    if (!stock.insiderSells) stock.insiderSells = [];
    
    // Filter to recent sells
    const recentSells = stock.insiderSells.filter(s => (s.daysAgo || 0) < CONSTANTS.SIGNAL.signalDecay);
    result.recentSells = recentSells;
    result.sellCount = recentSells.length;
    
    // Count planned vs discretionary
    result.plannedSalesCount = recentSells.filter(s => s.isPlanned).length;
    result.discretionarySalesCount = recentSells.length - result.plannedSalesCount;

    if (recentSells.length === 0) {
      return result;
    }

    result.hasSellSignal = true;

    // Check for cluster selling (the only case where selling might matter)
    if (recentSells.length >= CONSTANTS.SIGNAL.clusterThreshold) {
      result.isClusterSell = true;
      result.isNoise = false;        // Cluster selling is the one exception
      result.probabilityPenalty = CONSTANTS.SIGNAL.clusterSellPenalty;
      result.signalStrength = 'WEAK_WARNING';
      result.signals.push({ 
        name: `Cluster selling (${recentSells.length} insiders)`, 
        penalty: '-10%', 
        met: true,
        description: '⚠️ Multiple insiders selling MAY indicate concern (but could be coordinated planning)'
      });
    } else {
      // Single/few insider sells = NOISE
      result.probabilityPenalty = CONSTANTS.SIGNAL.singleSellPenalty; // = 0
      result.signalStrength = 'NOISE';
      result.isNoise = true;
      result.signals.push({ 
        name: `Insider selling (${recentSells.length})`, 
        penalty: '+0%', 
        met: false,  // "met" = false because it's not a real signal
        description: 'Selling is NOISE - insiders sell for many non-bearish reasons. IGNORE.'
      });
    }

    return result;
  }

  // ========== CHECK FOR NEW INSIDER SELLING EVENTS ==========
  function checkInsiderSellingEvents() {
    const stockList = getStocks();
    const news = getNews();

    if (!isEventTypeEnabled('insider_selling')) return;

    stockList.forEach(stock => {
      // Initialize tracking array
      if (!stock.insiderSells) stock.insiderSells = [];

      // Age existing sells and remove old ones
      stock.insiderSells.forEach(s => s.daysAgo = (s.daysAgo || 0) + 1);
      stock.insiderSells = stock.insiderSells.filter(s => s.daysAgo < CONSTANTS.SIGNAL.signalDecay);

      // Calculate event probability
      let sellProbability = CONSTANTS.EVENT.dailyProbability;

      // Check if insider selling event occurs
      if (random() < sellProbability) {
        generateInsiderSellEvent(stock, news);
      }
    });
  }

  // ========== GENERATE INSIDER SELL EVENT ==========
  function generateInsiderSellEvent(stock, news) {
    const insider = getRandomTitle();
    const sale = getRandomAmount();
    const shares = Math.floor(sale.value / stock.price);
    const reason = getRandomSellReason();
    
    // Record the sell
    const sellRecord = {
      title: insider.name,
      amount: sale.value,
      shares: shares,
      price: stock.price,
      daysAgo: 0,
      form4Code: 'S',
      reason: reason.reason,
      isBearish: reason.isBearish
    };
    stock.insiderSells.push(sellRecord);

    // Recalculate signal
    const signal = calculateSignal(stock);

    console.log(`[INSIDER SELL] ${stock.symbol}: ${insider.name} sells ${formatDollarAmount(sale.value)} (reason: ${reason.reason}, cluster: ${signal.isClusterSell})`);

    // Generate news - emphasize that this is usually NOISE
    const headline = signal.isClusterSell
      ? `⚠️ ${stock.symbol}: Multiple insiders selling shares`
      : `${stock.symbol} ${insider.name} sells ${formatDollarAmount(sale.value)} in shares`;

    const description = signal.isClusterSell
      ? `${signal.sellCount} insiders have sold shares recently. While usually noise, ` +
        `cluster selling MAY warrant attention. Likely reason: coordinated planning.`
      : `${insider.description} files Form 4 showing sale of ${shares.toLocaleString()} shares. ` +
        `Likely reason: ${reason.reason}. ${reason.isBearish ? '' : 'NOT a bearish signal.'}`;

    news.push({
      headline: headline,
      description: description,
      sentiment: signal.isClusterSell ? 'neutral' : 'neutral', // Never "negative"
      relatedStock: stock.symbol,
      newsType: 'insider_sell',
      isInsiderSell: true,
      isClusterSell: signal.isClusterSell,
      isNoise: !signal.isClusterSell, // Single sells are noise
      
      // Transaction details
      insiderTitle: insider.name,
      saleAmount: formatDollarAmount(sale.value),
      shareCount: shares,
      form4Code: 'S',
      likelyReason: reason.reason,
      reasonIsBearish: reason.isBearish,
      
      // Signal analysis
      signalStrength: signal.signalStrength,
      probabilityPenalty: signal.isClusterSell ? '-10%' : '+0% (NOISE)',
      sellCount: signal.sellCount,
      
      // Educational content - KEY LESSON
      educationalNote: signal.isClusterSell
        ? `⚠️ CLUSTER SELLING: ${signal.sellCount} insiders sold. This MAY warrant attention, ` +
          `but could still be coordinated tax planning or lockup expiry. Verify with fundamentals.`
        : `📚 KEY LESSON: Insider selling is NOISE. Reason: "${reason.reason}" ` +
          `${reason.explanation}. Do NOT treat this as a bearish signal!`
    });

    // NO sentiment penalty for single sells (it's noise!)
    // Only tiny penalty for cluster sells
    if (signal.isClusterSell) {
      stock.sentimentOffset = (stock.sentimentOffset || 0) - 0.01;
    }

    return sellRecord;
  }

  // ========== TUTORIAL HINT GENERATOR ==========
  // KEY EDUCATIONAL POINT: Selling is NOT part of Gold Standard - it's NOISE
  function getTutorialHint(newsItem) {
    if (!newsItem || !newsItem.isInsiderSell) return null;

    const tutorial = {
      type: '',
      probability: '',
      whatToWatch: '',
      action: '',
      keyLesson: '',
      goldStandard: '' // Explains why selling is NOT in Gold Standard
    };

    if (newsItem.isClusterSell) {
      tutorial.type = '🟡 CLUSTER SELL - MINOR CAUTION (still mostly noise)';
      tutorial.probability = 'Cluster selling penalty: -10% (weak signal at best)';
      tutorial.whatToWatch = 'Multiple insiders selling is unusual. BUT: Check for lockup expiry, coordinated tax planning, or 10b5-1 schedules.';
      tutorial.action = '⚠️ Do NOT panic sell. This is NOT a Gold Standard signal. Verify with fundamentals.';
      tutorial.keyLesson = 'Even cluster selling needs verification. Could be coordinated planning, lockup expiry, or routine diversification.';
      tutorial.goldStandard = '❌ NOT IN GOLD STANDARD: Insider selling is excluded because it\'s 93% non-bearish. Focus on BUYING signals instead.';
      tutorial.nlpHint = '📰 NOISE FILTER: Check for these TRAP KEYWORDS in Form 4: "10b5-1" (pre-scheduled = IGNORE), ' +
        '"Code F" (tax withholding = IGNORE), "Code M" (option exercise = IGNORE). ' +
        'Only Code S without 10b5-1 checkbox is potentially meaningful, but still 70%+ noise.';
    } else {
      tutorial.type = '⚪ INSIDER SELL - NOISE (IGNORE THIS)';
      tutorial.probability = 'Signal value: +0% (ZERO predictive power - research proven)';
      tutorial.whatToWatch = `Likely reason: ${newsItem.likelyReason || 'Tax/Diversification/Life Event'}. This is NOT a trading signal.`;
      tutorial.action = '🚫 IGNORE this news completely. Do NOT sell based on insider sales.';
      tutorial.keyLesson = 'THE ASYMMETRY: Buying = ONE reason (bullish). Selling = MANY reasons (93% NOT bearish): ' +
        'taxes, diversification, home purchase, tuition, divorce, 10b5-1 plans...';
      tutorial.goldStandard = '📚 WHY NOT IN GOLD STANDARD: Only ~7% of insider sales are actually bearish. ' +
        'Gold Standard focuses on BUYING signals (3+ cluster, Code P, >10% wealth).';
      tutorial.nlpHint = '📰 HEADLINE TRAP: Media uses scary words ("dumps," "sells massive stake") to get clicks. ' +
        'Cohen et al. (2012): 10b5-1 checkbox = ZERO predictive power. Check the Form 4 fine print!';
    }

    return tutorial;
  }

  // ========== GET ACTIVE SIGNALS ==========
  function getActiveSignals() {
    const stockList = getStocks();
    const signals = [];

    stockList.forEach(stock => {
      const signal = calculateSignal(stock);
      if (signal.isClusterSell) { // Only report cluster sells
        signals.push({
          symbol: stock.symbol,
          sellCount: signal.sellCount,
          isClusterSell: signal.isClusterSell,
          probabilityPenalty: signal.probabilityPenalty,
          signalStrength: signal.signalStrength,
          recentSells: signal.recentSells
        });
      }
    });

    return signals;
  }

  // ========== CLEAR STATE ==========
  function clearInsiderSellState(stock) {
    stock.insiderSells = [];
  }

  // ========== PUBLIC API ==========
  return {
    init: init,
    CONSTANTS: CONSTANTS,
    
    // Core functions
    checkInsiderSellingEvents: checkInsiderSellingEvents,
    generateInsiderSellEvent: generateInsiderSellEvent,
    
    // Signal analysis
    calculateSignal: calculateSignal,
    
    // Utilities
    getActiveSignals: getActiveSignals,
    getTutorialHint: getTutorialHint,
    formatDollarAmount: formatDollarAmount,
    
    // Testing
    _test: {
      clearInsiderSellState: clearInsiderSellState,
      getRandomTitle: getRandomTitle,
      getRandomAmount: getRandomAmount,
      getRandomSellReason: getRandomSellReason
    },
    
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
function checkInsiderSellingEvents() {
  return InsiderSelling.checkInsiderSellingEvents();
}

function getInsiderSellingTutorialHint(newsItem) {
  return InsiderSelling.getTutorialHint(newsItem);
}

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = InsiderSelling;
}
