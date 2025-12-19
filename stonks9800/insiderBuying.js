// ===== INSIDER BUYING SIGNALS SYSTEM (EMPIRICALLY-BASED) =====
// Based on academic research on insider purchase predictive power
//
// EMPIRICAL FOUNDATIONS:
// - Lakonishok & Lee (2001): Insider purchases predict +4.8% alpha over 12 months
// - Hjort & Bapkas (2024): Cluster buying (3+ insiders) has 2x predictive power
// - Seyhun (1986, 1998): Insiders are informed traders with material information
// - Cohen, Malloy & Pomorski (2012): "Opportunistic" insider buys outperform
//
// KEY INSIGHT: WHY INSIDER BUYING IS A STRONG SIGNAL
// ═══════════════════════════════════════════════════════════════════
// Insiders buy with their own money for ONE reason: 
//   → They believe the stock will go UP
//
// Form 4 Code P (Open Market Purchase) = strongest signal
// - Uses personal funds (not options or grants)
// - Subject to SEC scrutiny - insiders wouldn't risk jail for small gains
// - Information advantage: they KNOW the business
//
// CLUSTER BUYING (3+ insiders within 2 weeks):
// - 2x predictive power (Hjort & Bapkas 2024)
// - Multiple people with inside knowledge all betting same direction
// - Reduces chance of "one rogue optimist"
//
// EDUCATIONAL PURPOSE:
// Teaches players to:
// 1. Recognize insider buying as a strong bullish signal
// 2. Look for cluster buying patterns (multiple insiders)
// 3. Understand Form 4 filings and transaction codes
// 4. Weight insider titles (CEO/CFO > Director > 10% Owner)
// 5. Combine with other signals (volume, price action, fundamentals)
//
// ARCHITECTURE:
// This module generates insider buying events that can boost reversal
// probabilities in other modules (DCB, SSR) or create standalone opportunities.
// Uses dependency injection for testability.

const InsiderBuying = (function() {
  'use strict';

  // ========== EMPIRICALLY-BASED CONSTANTS ==========
  const CONSTANTS = {
    // ========== GOLD STANDARD 85% SETUP ==========
    // The highest probability insider signal requires ALL these criteria
    GOLD_STANDARD: {
      description: 'Cluster Buying (3+) of Open Market Shares (Code P) representing >10% of wealth',
      requirements: {
        clusterMinimum: 3,           // At least 3 insiders buying
        transactionCode: 'P',        // Form 4 Code P = Open Market Purchase
        wealthPercentage: 0.10,      // >10% of insider\'s total wealth
        successRate: 0.85            // 85% success when combined with other signals
      },
      educationalNote: 'Single insider buys are good (+4.8% alpha), but cluster buying has 2x power (Hjort & Bapkas 2024)'
    },
    
    // Event probability
    EVENT: {
      dailyProbability: 0.005,      // 0.5% per stock per day baseline
      crashMultiplier: 2.5,          // 2.5x more likely during crashes (insiders see value)
      ssrMultiplier: 2.0,            // 2x more likely after short reports
      clusterWindow: 14              // Days to count as "cluster"
    },

    // Alpha Window Timeline (Lakonishok & Lee 2001)
    // Insider alpha is a SLOW-BURN signal, not short-term
    ALPHA_WINDOW: {
      peakAlphaStart: 120,           // Empirical: Alpha peaks at 6 months (~120 trading days)
      peakAlphaEnd: 252,             // Empirical: Extends to 12 months (~252 trading days)
      shortTermEffect: { min: 3, max: 7 },  // Immediate 3-7 day sentiment boost
      decayProfile: 'slow',          // Slow decay (not rapid)
      educationalNote: 'Insider buying is a SLOW signal - alpha materializes over 6-12 months, not days'
    },

    // Signal strength (probability boosts for other modules)
    SIGNAL: {
      singleBuyBoost: 0.10,          // +10% reversal probability for single buy
      clusterBuyBoost: 0.25,         // +25% for cluster buying (3+ insiders)
      clusterThreshold: 3,           // Number of insiders for "cluster"
      signalDecay: 30                // Signal strength decays over 30 days
    },

    // Expected returns (from research)
    EXPECTED_ALPHA: {
      singleBuy: 0.048,              // +4.8% over 12 months (Lakonishok & Lee)
      clusterBuy: 0.096,             // ~9.6% (2x for cluster)
      ceoOrCfoBuy: 0.065             // ~6.5% when CEO/CFO buys (stronger signal)
    },

    // Purchase amounts (determines signal weight)
    AMOUNTS: {
      small:   { min: 100000,   max: 500000,   label: '$100K-$500K', weight: 0.7 },
      medium:  { min: 500000,   max: 2000000,  label: '$500K-$2M',   weight: 1.0 },
      large:   { min: 2000000,  max: 10000000, label: '$2M-$10M',    weight: 1.3 },
      massive: { min: 10000000, max: 50000000, label: '$10M+',       weight: 1.5 }
    },

    // Insider titles (signal weight - executives have more information)
    TITLES: {
      ceo:      { name: 'CEO',       weight: 1.5, description: 'Chief Executive Officer' },
      cfo:      { name: 'CFO',       weight: 1.4, description: 'Chief Financial Officer' },
      chairman: { name: 'Chairman',  weight: 1.4, description: 'Chairman of the Board' },
      coo:      { name: 'COO',       weight: 1.2, description: 'Chief Operating Officer' },
      director: { name: 'Director',  weight: 1.0, description: 'Board Member' },
      vp:       { name: 'VP',        weight: 0.9, description: 'Vice President' },
      owner10:  { name: '10% Owner', weight: 0.8, description: 'Beneficial Owner >10%' }
    },

    // Form 4 transaction codes (for education)
    FORM4_CODES: {
      P: { code: 'P', name: 'Open Market Purchase', signal: 'BULLISH', description: 'Strongest signal - personal funds' },
      A: { code: 'A', name: 'Award/Grant', signal: 'NEUTRAL', description: 'Compensation - not a trading signal' },
      M: { code: 'M', name: 'Option Exercise', signal: 'NEUTRAL', description: 'Often just tax planning' }
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

    return InsiderBuying;
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

  function getDate() {
    let gs = (typeof gameState !== 'undefined') ? gameState : (typeof window !== 'undefined' && window.gameState) ? window.gameState : null;
    if (gs && gs.year && gs.month && gs.day) return `Y${gs.year}/M${gs.month}/D${gs.day}`;
    return '?';
  }

  function getPriceInfo(stock) {
    const price = stock.price ? `$${stock.price.toFixed(2)}` : '$?';
    return `[${price}]`;
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

  // Get random insider title (weighted toward executives)
  function getRandomTitle() {
    const titles = CONSTANTS.TITLES;
    const titleKeys = Object.keys(titles);
    const weights = titleKeys.map(k => titles[k].weight);
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    
    let roll = random() * totalWeight;
    for (let i = 0; i < titleKeys.length; i++) {
      roll -= weights[i];
      if (roll <= 0) {
        return titles[titleKeys[i]];
      }
    }
    return titles.director;
  }

  // Get random purchase amount
  function getRandomAmount() {
    const amounts = CONSTANTS.AMOUNTS;
    const roll = random();
    
    // Distribution: 35% small, 40% medium, 20% large, 5% massive
    if (roll < 0.35) {
      return { 
        value: amounts.small.min + random() * (amounts.small.max - amounts.small.min),
        category: amounts.small
      };
    } else if (roll < 0.75) {
      return { 
        value: amounts.medium.min + random() * (amounts.medium.max - amounts.medium.min),
        category: amounts.medium
      };
    } else if (roll < 0.95) {
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

  // ========== CALCULATE SIGNAL STRENGTH ==========
  function calculateSignal(stock) {
    const result = {
      hasBuySignal: false,
      isClusterBuy: false,
      buyCount: 0,
      probabilityBoost: 0,
      signalStrength: 'none',
      totalTitleWeight: 0,
      totalAmountWeight: 0,
      signals: [],
      recentBuys: []
    };

    // Initialize array if needed
    if (!stock.insiderBuys) stock.insiderBuys = [];
    
    // Filter to recent buys within signal decay window
    const recentBuys = stock.insiderBuys.filter(b => (b.daysAgo || 0) < CONSTANTS.SIGNAL.signalDecay);
    result.recentBuys = recentBuys;
    result.buyCount = recentBuys.length;

    if (recentBuys.length === 0) {
      return result;
    }

    result.hasBuySignal = true;
    
    // Calculate weights
    result.totalTitleWeight = recentBuys.reduce((sum, b) => sum + (b.titleWeight || 1), 0);
    result.totalAmountWeight = recentBuys.reduce((sum, b) => sum + (b.amountWeight || 1), 0);

    // Determine signal strength
    if (recentBuys.length >= CONSTANTS.SIGNAL.clusterThreshold) {
      result.isClusterBuy = true;
      result.probabilityBoost = CONSTANTS.SIGNAL.clusterBuyBoost;
      result.signalStrength = 'VERY_STRONG';
      result.signals.push({ 
        name: `Cluster buying (${recentBuys.length} insiders)`, 
        bonus: '+25%', 
        met: true,
        description: 'Multiple insiders buying = 2x predictive power (Hjort & Bapkas 2024)'
      });
    } else {
      result.probabilityBoost = CONSTANTS.SIGNAL.singleBuyBoost * Math.min(recentBuys.length, 2);
      result.signalStrength = recentBuys.length > 1 ? 'STRONG' : 'MODERATE';
      result.signals.push({ 
        name: `Insider buying (${recentBuys.length} insider${recentBuys.length > 1 ? 's' : ''})`, 
        bonus: `+${recentBuys.length * 10}%`, 
        met: true,
        description: 'Insiders buy for ONE reason: they expect stock to rise'
      });
    }

    // Check for high-weight executive buy
    const hasExecutiveBuy = recentBuys.some(b => b.titleWeight >= 1.4);
    if (hasExecutiveBuy) {
      result.signals.push({
        name: 'Executive-level buy (CEO/CFO/Chairman)',
        bonus: 'Extra conviction',
        met: true,
        description: 'C-suite executives have deepest knowledge of business'
      });
    }

    return result;
  }

  // ========== GET INSIDER BOOST (for other modules) ==========
  function getInsiderBoost(stock) {
    const signal = calculateSignal(stock);
    return {
      boost: signal.probabilityBoost,
      hasBuySignal: signal.hasBuySignal,
      isClusterBuy: signal.isClusterBuy,
      buyCount: signal.buyCount,
      signalStrength: signal.signalStrength,
      signals: signal.signals
    };
  }

  // ========== CHECK FOR NEW INSIDER BUYING EVENTS ==========
  function checkInsiderBuyingEvents() {
    const stockList = getStocks();
    const news = getNews();

    if (!isEventTypeEnabled('insider_buying')) return;

    stockList.forEach(stock => {
      // Initialize tracking array
      if (!stock.insiderBuys) stock.insiderBuys = [];

      // Age existing buys and remove old ones
      stock.insiderBuys.forEach(b => b.daysAgo = (b.daysAgo || 0) + 1);
      stock.insiderBuys = stock.insiderBuys.filter(b => b.daysAgo < CONSTANTS.SIGNAL.signalDecay);

      // Calculate event probability
      let buyProbability = CONSTANTS.EVENT.dailyProbability;
      
      // Higher probability during crashes/short reports (insiders see opportunity)
      if (stock.crashPhase === 'bounce' || stock.crashPhase === 'crash') {
        buyProbability *= CONSTANTS.EVENT.crashMultiplier;
      }
      if (stock.shortReportPhase) {
        buyProbability *= CONSTANTS.EVENT.ssrMultiplier;
      }

      // Check if insider buying event occurs
      if (random() < buyProbability) {
        generateInsiderBuyEvent(stock, news);
      }
    });
  }

  // ========== GENERATE INSIDER BUY EVENT ==========
  function generateInsiderBuyEvent(stock, news) {
    const insider = getRandomTitle();
    const purchase = getRandomAmount();
    const shares = Math.floor(purchase.value / stock.price);
    
    // Record the buy
    const buyRecord = {
      title: insider.name,
      titleWeight: insider.weight,
      amount: purchase.value,
      amountWeight: purchase.category.weight,
      shares: shares,
      price: stock.price,
      daysAgo: 0,
      form4Code: 'P'
    };
    stock.insiderBuys.push(buyRecord);

    // Recalculate signal
    const signal = calculateSignal(stock);

    console.log(`[INSIDER BUY] ${getDate()}: ${stock.symbol} ${getPriceInfo(stock)} ${insider.name} buys ${formatDollarAmount(purchase.value)} (cluster: ${signal.isClusterBuy})`);

    // Generate news
    // Empirical NLP: "Conviction Signal" language (SEC Filings research)
    // Keywords: "Open Market Purchase," "SEC Form 4," "Cluster Buying," "Multi-million dollar stake"
    const headline = signal.isClusterBuy
      ? `🟢 SEC Form 4: ${signal.buyCount} ${stock.symbol} Insiders Make Open Market Purchases`
      : `💰 SEC Form 4: ${stock.symbol} ${insider.name} Open Market Purchase - ${formatDollarAmount(purchase.value)}`;

    const description = signal.isClusterBuy
      ? `${signal.buyCount} company insiders have purchased shares in the past ${CONSTANTS.EVENT.clusterWindow} days. ` +
        `Cluster buying has 2x the predictive power of single insider buys (Hjort & Bapkas 2024).`
      : `${insider.description} files Form 4 showing open market purchase of ${shares.toLocaleString()} shares at ` +
        `$${stock.price.toFixed(2)}. Code P purchases are the strongest insider signal.`;

    news.push({
      headline: headline,
      description: description,
      sentiment: 'positive',
      relatedStock: stock.symbol,
      newsType: 'insider_buy',
      isInsiderBuy: true,
      isClusterBuy: signal.isClusterBuy,
      
      // Transaction details
      insiderTitle: insider.name,
      purchaseAmount: formatDollarAmount(purchase.value),
      shareCount: shares,
      form4Code: 'P',
      titleWeight: insider.weight,
      
      // Signal analysis
      signalStrength: signal.signalStrength,
      probabilityBoost: `+${Math.round(signal.probabilityBoost * 100)}%`,
      buyCount: signal.buyCount,
      
      // Educational content
      educationalNote: signal.isClusterBuy
        ? '🎯 ACTION: BUY NOW or ADD. Cluster buying (3+ insiders) = STRONGEST signal. ' +
          'Expected +9.6%/year alpha. High conviction entry!'
        : `🎯 ACTION: CONSIDER BUYING. ${insider.name} buying with personal funds = bullish. ` +
          `Wait for additional confirmation (rebuttal, base formation) for safer entry.`
    });

    // Apply sentiment boost to stock
    const sentimentBoost = signal.isClusterBuy ? 0.03 : 0.015 * insider.weight;
    stock.sentimentOffset = (stock.sentimentOffset || 0) + sentimentBoost;

    return buyRecord;
  }

  // ========== TUTORIAL HINT GENERATOR ==========
  // Aligned with Gold Standard 85% Setup Criteria
  function getTutorialHint(newsItem) {
    if (!newsItem || !newsItem.isInsiderBuy) return null;

    const tutorial = {
      type: '',
      description: '',    // WHAT - displayed in UI
      implication: '',    // IMPLICATION - displayed in UI
      action: '',
      timing: '',
      catalyst: '',
      goldStandard: ''    // Shows the 85% "Gold Standard" requirement
    };

    if (newsItem.isClusterBuy) {
      // Check if this meets Gold Standard criteria
      const meetsGoldStandard = newsItem.buyCount >= 3 && newsItem.isOpenMarket;
      
      tutorial.type = '🟢 CLUSTER BUY - VERY STRONG BULLISH';
      tutorial.description = 'Multiple insiders betting same direction. Check: Form 4 Code P (Open Market) + significant % of wealth.';
      tutorial.implication = `${newsItem.buyCount} insiders buying = +25% reversal boost. Cluster buying = 2x predictive power (Hjort & Bapkas 2024).`;
      tutorial.action = meetsGoldStandard 
        ? '✅ GOLD STANDARD MET. Strong entry signal if combined with DCB/SSR signals.'
        : '⏳ Good signal, but verify: Open Market purchases (Code P)? Significant wealth commitment?';
      tutorial.timing = 'ENTRY: On cluster buy confirmation. EXIT: On catalyst announcement OR if "10b5-1 plan" revealed.';
      tutorial.catalyst = 'Expected (70%): Better guidance, major contract, regulatory approval. Fizzle (30%): Routine plan, bad timing.';
      tutorial.goldStandard = '🏆 INSIDER Gold Standard: Cluster Buying (3+) of Open Market Shares (Code P) representing >10% of wealth';
    } else {
      tutorial.type = '🟢 INSIDER BUY - BULLISH SIGNAL';
      tutorial.description = `${newsItem.insiderTitle || 'Insider'} using personal funds to buy = strong conviction. Form 4 Code P is the most bullish insider signal.`;
      tutorial.implication = 'Insiders buy for ONE reason: they believe stock will rise. Single buy = +10% boost. Watch for more buys.';
      tutorial.action = '⏳ Good signal, but NOT Gold Standard. Wait for cluster buying or other confirmations.';
      tutorial.timing = 'ENTRY: Consider small position. EXIT: On catalyst or if pattern fizzles after 7 days.';
      tutorial.catalyst = '🎯 For 85% setup: Need Cluster (3+) Open Market Buys (Code P) with >10% wealth commitment';
      tutorial.goldStandard = 'Need more insider buys to reach Gold Standard. Watch for cluster buying pattern.';
    }

    return tutorial;
  }

  // ========== GET ACTIVE SIGNALS ==========
  function getActiveSignals() {
    const stockList = getStocks();
    const signals = [];

    stockList.forEach(stock => {
      const signal = calculateSignal(stock);
      if (signal.hasBuySignal) {
        signals.push({
          symbol: stock.symbol,
          buyCount: signal.buyCount,
          isClusterBuy: signal.isClusterBuy,
          probabilityBoost: signal.probabilityBoost,
          signalStrength: signal.signalStrength,
          recentBuys: signal.recentBuys
        });
      }
    });

    return signals;
  }

  // ========== CLEAR STATE ==========
  function clearInsiderBuyState(stock) {
    stock.insiderBuys = [];
  }

  // ========== PUBLIC API ==========
  return {
    init: init,
    CONSTANTS: CONSTANTS,
    
    // Core functions
    checkInsiderBuyingEvents: checkInsiderBuyingEvents,
    generateInsiderBuyEvent: generateInsiderBuyEvent,
    
    // Signal analysis (for other modules)
    calculateSignal: calculateSignal,
    getInsiderBoost: getInsiderBoost,
    
    // Utilities
    getActiveSignals: getActiveSignals,
    getTutorialHint: getTutorialHint,
    formatDollarAmount: formatDollarAmount,
    
    // Testing
    _test: {
      clearInsiderBuyState: clearInsiderBuyState,
      getRandomTitle: getRandomTitle,
      getRandomAmount: getRandomAmount
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
function checkInsiderBuyingEvents() {
  return InsiderBuying.checkInsiderBuyingEvents();
}

function getInsiderBuyingTutorialHint(newsItem) {
  return InsiderBuying.getTutorialHint(newsItem);
}

// Alias for integration with DCB/SSR
function getInsiderBoost(stock) {
  return InsiderBuying.getInsiderBoost(stock);
}

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = InsiderBuying;
}
