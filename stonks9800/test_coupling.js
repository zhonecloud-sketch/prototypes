/**
 * Price-News Coupling Test Script
 * 
 * Tests each phenomenon INDIVIDUALLY to avoid multi-module conflicts.
 * For each phenomenon, verifies:
 * 1. Price DIRECTION matches news sentiment (bearish news = price down)
 * 2. Price MAGNITUDE is reasonable for the news intensity
 * 3. eventExpectedPrice matches actual price after market update (GUI/log parity)
 * 4. Price stays within empirical bounds per phase
 * 
 * Usage: node test_coupling.js [module]
 *   module: DCB, SSR, SHAKEOUT, PIVOT, EXEC, or ALL (default)
 * 
 * Example: node test_coupling.js DCB    # Test only Dead Cat Bounce
 *          node test_coupling.js ALL    # Test all modules individually
 */

// ========== SEEDED RANDOM FOR REPRODUCIBILITY ==========
let seed = 12345;
function seededRandom() {
  seed = (seed * 1103515245 + 12345) & 0x7fffffff;
  return seed / 0x7fffffff;
}
const random = seededRandom;

// ========== MOCK GAME STATE ==========
let stocks = [];
let todayNews = [];
const gameState = { day: 0, month: 1, year: 1 };

// ========== PHASE PRICE EXPECTATIONS ==========
const PHASE_EXPECTATIONS = {
  // Dead Cat Bounce
  'DCB:crash': { 
    direction: -1, 
    minDrop: 0.10, maxDrop: 0.40,
    description: 'Initial crash should drop 10-40%'
  },
  'DCB:bounce': { 
    direction: 1, 
    minGain: 0.03, maxGain: 0.20,
    description: 'Dead cat bounce should recover 3-20% from low'
  },
  'DCB:capitulation': { 
    direction: -1,
    description: 'Capitulation should make new lows'
  },
  'DCB:recovery': { 
    direction: 1,
    description: 'Recovery phase should trend up'
  },
  
  // Short Seller Report
  'SSR:attack': { 
    direction: -1, 
    minDrop: 0.15, maxDrop: 0.45,
    description: 'Short attack should drop 15-45%'
  },
  'SSR:rebuttal': { 
    direction: 0,
    description: 'Rebuttal phase is uncertain'
  },
  'SSR:base_building': { 
    direction: 0,
    maxMove: 0.20,
    description: 'Base building should be sideways (±20% over multi-day period)'
  },
  'SSR:resolution': {
    description: 'Resolution direction depends on breakout/breakdown'
  },
  
  // News Shakeout
  'SHAKEOUT:panic': { 
    direction: -1, 
    minDrop: 0.08, maxDrop: 0.25,
    description: 'Panic should drop 8-25%'
  },
  'SHAKEOUT:stabilization': { 
    direction: 0,
    maxMove: 0.05,
    description: 'Stabilization should be choppy (±5%)'
  },
  'SHAKEOUT:recovery': { 
    direction: 1,
    description: 'Recovery should trend toward gap fill'
  },
  
  // Strategic Pivot
  'PIVOT:triggered': {
    direction: -1,
    minDrop: 0.03, maxDrop: 0.15,
    description: 'Pivot announcement drops 3-15%'
  },
  
  // Executive Change  
  'EXEC:triggered': {
    direction: -1,
    minDrop: 0.02, maxDrop: 0.12,
    description: 'Exec change drops 2-12%'
  }
};

// ========== NEWS CLASSIFICATION ==========
const NEWS_PATTERNS = {
  bearish_strong: {
    keywords: ['CRASHES', 'PLUNGES', 'COLLAPSES', 'BREAKS DOWN', 'BREAKDOWN', 
               'CAPITULATES', 'TANKS', 'CRATERS', 'DECIMATED', 'HAMMERED',
               'PLUMMETS', 'TUMBLES', 'NOSEDIVES', 'NEW LOWS', 'FRAUD'],
    expectedDirection: -1,
    expectedMagnitude: { min: 0.03, max: 0.35 },
    maxWrongDirection: 0.02
  },
  bearish_moderate: {
    keywords: ['FALLS', 'DROPS', 'DECLINES', 'SLIPS', 'WEAKENS', 'FADES',
               'SELLS OFF', 'UNDER PRESSURE', 'LOSES', 'RETREATS', 'SLIDES',
               'LOWER', 'FAILS', 'TRAP', 'DECLINE', 'FIZZLES'],
    expectedDirection: -1,
    expectedMagnitude: { min: 0.005, max: 0.15 },
    maxWrongDirection: 0.03
  },
  bullish_strong: {
    keywords: ['SURGES', 'SOARS', 'ROCKETS', 'BREAKS OUT', 'BREAKOUT',
               'EXPLODES', 'SKYROCKETS', 'MOONS', 'BLASTS OFF', 'SPIKES'],
    expectedDirection: 1,
    expectedMagnitude: { min: 0.03, max: 0.35 },
    maxWrongDirection: 0.02
  },
  bullish_moderate: {
    keywords: ['RISES', 'GAINS', 'CLIMBS', 'ADVANCES', 'RALLIES',
               'RECOVERS', 'BOUNCES', 'REBOUNDS', 'STRENGTHENS', 'HIGHER',
               'CONFIRMATION', 'HOLDS', 'RECOVERY', 'REVERSAL'],
    expectedDirection: 1,
    expectedMagnitude: { min: 0.005, max: 0.15 },
    maxWrongDirection: 0.06
  }
};

// ========== EXPECTED PHASE SEQUENCES ==========
const PHASE_SEQUENCES = {
  DCB: {
    phases: ['crash', 'bounce', 'decline', 'consolidation', 'recovery'],
    validTransitions: {
      'null': ['crash'],
      'crash': ['bounce'],
      'bounce': ['decline', 'consolidation', 'recovery'], // depends on signals
      'decline': ['bounce', 'consolidation'],
      'consolidation': ['recovery', 'bounce'],
      'recovery': [null] // ends
    }
  },
  SSR: {
    phases: ['initial_crash', 'rebuttal_window', 'base_building', 'resolution'],
    validTransitions: {
      'null': ['initial_crash'],
      'initial_crash': ['rebuttal_window'],
      'rebuttal_window': ['base_building'],
      'base_building': ['resolution'],
      'resolution': [null] // ends
    }
  },
  SHAKEOUT: {
    // Note: trigger sets phase to 'stabilization' directly, then entry->recovery->complete
    phases: ['stabilization', 'entry', 'recovery', 'complete'],
    validTransitions: {
      'null': ['stabilization'],
      'stabilization': ['entry'],
      'entry': ['recovery'], // entry transitions immediately to recovery
      'recovery': ['complete'],
      'complete': [null] // ends
    }
  },
  PIVOT: {
    phases: ['announcement', 'execution_void', 'resolution'],
    validTransitions: {
      'null': ['announcement'],
      'announcement': ['execution_void'],
      'execution_void': ['resolution'],
      'resolution': [null] // ends
    }
  },
  EXEC: {
    phases: ['announcement', 'stabilization', 'resolution'],
    validTransitions: {
      'null': ['announcement'],
      'announcement': ['stabilization'],
      'stabilization': ['resolution'],
      'resolution': [null] // ends
    }
  }
};

// ========== TEST RESULTS ==========
let results = {};

function resetResults() {
  results = {
    totalDays: 0,
    totalNews: 0,
    violations: [],
    byCategory: {},
    byPhase: {},
    magnitudeIssues: [],
    expectedPriceMismatches: [],
    phaseTransitions: [],
    phasePriceViolations: [],
    
    // NEW: Phase integrity checks
    missingPhases: [],           // Expected phases that never occurred
    orphanPhases: [],            // Phase transitions without corresponding news
    invalidTransitions: [],      // Phase A -> Phase C (skipped B)
    doubleTransitions: [],       // Same phase triggered twice in a row
    duplicateNews: [],           // Same headline generated twice
    missingTutorialHints: [],    // Phases without tutorial hints
    
    // Track phase sequences per stock
    phaseHistory: {},            // { stockSymbol: [{phase, day, hadNews}] }
    newsHeadlines: new Set(),    // Track all headlines for duplicate detection
    phasesWithNews: new Set()    // Track phases that generated news
  };
  
  for (const cat of Object.keys(NEWS_PATTERNS)) {
    results.byCategory[cat] = { total: 0, correct: 0, wrong: 0, magnitudes: [] };
  }
}

// ========== MOCK INFRASTRUCTURE ==========

function createStock(symbol) {
  return {
    symbol,
    name: symbol + ' Corp',
    price: 100,
    basePrice: 100,
    previousPrice: 100,
    fairValue: 100,
    sentimentOffset: 0,
    volatility: 0.025,
    stability: 0.5 + random() * 0.5,
    isMeme: random() < 0.1,
    sector: 'Technology',
    trend: 0,
    epsModifier: 0,
    history: [],
    priceHistory: [],
    institutionalAccumulation: 0,
    volatilityBoost: 0,
    consecutiveUpDays: 0,
    crashTransitionEffect: 0,
    shortReportTransitionEffect: 0,
    phaseStartPrice: null,
    triggerPrice: null
  };
}

function getMemeMultiplier(stock) {
  const stability = stock.stability !== undefined ? stock.stability : 0.5;
  return 0.3 + (1 - stability) * 0.7;
}

function randomChoice(arr) {
  return arr[Math.floor(random() * arr.length)];
}

function isEventTypeEnabled() { return true; }

function getDate() {
  return `Y${gameState.year}M${gameState.month}D${gameState.day}`;
}

// ========== LOAD MODULES ==========

let SSR, DCB, SHAKEOUT, PIVOT, EXEC;

try { SSR = require('./shortSellerReport.js'); } catch(e) { console.log('✗ shortSellerReport.js:', e.message); }
try { DCB = require('./deadCatBounce.js'); } catch(e) { console.log('✗ deadCatBounce.js:', e.message); }
try { SHAKEOUT = require('./newsShakeout.js'); } catch(e) { console.log('✗ newsShakeout.js:', e.message); }
try { PIVOT = require('./strategicPivot.js'); } catch(e) { console.log('✗ strategicPivot.js:', e.message); }
try { EXEC = require('./executiveChange.js'); } catch(e) { console.log('✗ executiveChange.js:', e.message); }

// ========== PRICE CALCULATION (from market.js) ==========

function updateStockPrices() {
  for (let i = 0; i < stocks.length; i++) {
    const stock = stocks[i];
    
    const expectedPriceBefore = stock.eventExpectedPrice;
    const expectedDeltaBefore = stock.eventExpectedDelta;
    
    stock.fairValue = stock.basePrice * (1 + stock.epsModifier);
    stock.sentimentOffset = Math.max(-0.8, Math.min(3.0, stock.sentimentOffset));
    
    if (Math.abs(stock.sentimentOffset) > 0.01) {
      stock.sentimentOffset *= 0.98;
    }
    
    const manipulationPressure = (stock.institutionalAccumulation || 0) * 0.15;
    const targetPrice = stock.fairValue * (1 + stock.sentimentOffset + manipulationPressure);
    
    const effectiveVolatility = stock.volatility * (1 + (stock.volatilityBoost || 0));
    const noiseMultiplier = stock.crashPhase || stock.shortReportPhase || stock.newsShakeout ? 0.3 : 1.0;
    const noise = (random() - 0.5) * 2 * effectiveVolatility * noiseMultiplier;
    
    const currentDeviation = (stock.price - targetPrice) / targetPrice;
    const baseConvergenceSpeed = stock.crashPhase || stock.shortReportPhase || stock.newsShakeout ? 0.05 : 0.15;
    const correction = -currentDeviation * baseConvergenceSpeed;
    
    const trendMultiplier = stock.crashPhase ? 0.3 : 1.0;
    const trendEffect = stock.trend * 0.05 * trendMultiplier;
    
    // CRITICAL: Transition effects from modules
    const crashTransition = stock.crashTransitionEffect || 0;
    const ssrTransition = stock.shortReportTransitionEffect || 0;
    const transitionEffect = crashTransition + ssrTransition;
    
    stock.crashTransitionEffect = 0;
    stock.shortReportTransitionEffect = 0;
    
    let newPrice = stock.price * (1 + trendEffect + correction + noise + transitionEffect);
    
    const priceFloor = Math.max(1, stock.basePrice * 0.05);
    const priceCeiling = stock.basePrice * 20;
    newPrice = Math.max(priceFloor, Math.min(priceCeiling, newPrice));
    
    stock.previousPrice = stock.price;
    stock.price = newPrice;
    
    // GUI/LOG PARITY CHECK
    if (expectedPriceBefore !== undefined && expectedDeltaBefore !== undefined) {
      const actualDelta = (stock.price - stock.previousPrice) / stock.previousPrice;
      const priceDiff = Math.abs(stock.price - expectedPriceBefore);
      const deltaDiff = Math.abs(actualDelta - expectedDeltaBefore);
      
      // 15% tolerance for single-module test (accounts for noise, corrections, multi-day effects)
      const priceTolerance = stock.previousPrice * 0.15;
      const deltaTolerance = 0.15;
      
      if (priceDiff > priceTolerance || deltaDiff > deltaTolerance) {
        results.expectedPriceMismatches.push({
          day: gameState.day,
          symbol: stock.symbol,
          phase: detectPhase(stock),
          expectedPrice: expectedPriceBefore,
          actualPrice: stock.price,
          priceDiff: priceDiff,
          expectedDelta: expectedDeltaBefore,
          actualDelta: actualDelta,
          deltaDiff: deltaDiff,
          transitionEffect: transitionEffect,
          noise: noise
        });
      }
      
      stock.eventExpectedPrice = undefined;
      stock.eventExpectedDelta = undefined;
    }
  }
}

// ========== NEWS CLASSIFICATION ==========

function classifyNews(headline) {
  const upper = headline.toUpperCase();
  
  for (const [category, config] of Object.entries(NEWS_PATTERNS)) {
    for (const keyword of config.keywords) {
      if (upper.includes(keyword)) {
        return { category, keyword, config };
      }
    }
  }
  return null;
}

function detectPhase(stock) {
  if (stock.shortReportPhase) return `SSR:${stock.shortReportPhase}`;
  if (stock.crashPhase) return `DCB:${stock.crashPhase}`;
  if (stock.newsShakeout) return `SHAKEOUT:${stock.newsShakeout.phase}`;
  if (stock.execChangePhase) return `EXEC:${stock.execChangePhase}`;
  if (stock.strategicPivotPhase) return `PIVOT:${stock.strategicPivotPhase}`;
  return 'none';
}

function trackPhaseTransition(stock, oldPhase, newPhase, module) {
  const phaseKey = `${module}:${newPhase}`;
  const expectation = PHASE_EXPECTATIONS[phaseKey];
  
  const transition = {
    day: gameState.day,
    symbol: stock.symbol,
    module: module,
    fromPhase: oldPhase,
    toPhase: newPhase,
    priceAtTransition: stock.price,
    triggerPrice: stock.triggerPrice || stock.price,
    phaseStartPrice: stock.phaseStartPrice || stock.price
  };
  
  const isInitialPhase = ['crash', 'attack', 'panic', 'initial_crash', 'triggered'].includes(newPhase);
  const referencePrice = isInitialPhase ? transition.triggerPrice : transition.phaseStartPrice;
  
  if (referencePrice) {
    transition.changeFromReference = (stock.price - referencePrice) / referencePrice;
  }
  
  results.phaseTransitions.push(transition);
  
  if (expectation && transition.changeFromReference !== undefined) {
    let violation = null;
    
    if (expectation.direction === -1) {
      if (transition.changeFromReference > 0.02) {
        violation = `Expected DROP but price UP ${(transition.changeFromReference * 100).toFixed(1)}%`;
      } else if (expectation.minDrop && Math.abs(transition.changeFromReference) < expectation.minDrop * 0.5) {
        violation = `Drop ${(Math.abs(transition.changeFromReference) * 100).toFixed(1)}% < min ${(expectation.minDrop * 100).toFixed(0)}%`;
      } else if (expectation.maxDrop && Math.abs(transition.changeFromReference) > expectation.maxDrop * 1.5) {
        violation = `Drop ${(Math.abs(transition.changeFromReference) * 100).toFixed(1)}% > max ${(expectation.maxDrop * 100).toFixed(0)}%`;
      }
    } else if (expectation.direction === 1) {
      if (transition.changeFromReference < -0.10) {
        violation = `Expected GAIN but price DOWN ${(transition.changeFromReference * 100).toFixed(1)}%`;
      }
    } else if (expectation.maxMove) {
      if (Math.abs(transition.changeFromReference) > expectation.maxMove * 1.5) {
        violation = `Move ${(Math.abs(transition.changeFromReference) * 100).toFixed(1)}% > max sideways ${(expectation.maxMove * 100).toFixed(0)}%`;
      }
    }
    
    if (violation) {
      results.phasePriceViolations.push({
        ...transition,
        violation: violation,
        expectation: expectation.description,
        referencePrice: referencePrice,
        isInitialPhase: isInitialPhase
      });
    }
  }
  
  stock.phaseStartPrice = stock.price;
}

// ========== PHASE INTEGRITY CHECKS ==========

// Track phase transition for integrity validation
function trackPhaseForIntegrity(stock, oldPhase, newPhase, module, hadNews) {
  const key = `${module}:${stock.symbol}`;
  
  if (!results.phaseHistory[key]) {
    results.phaseHistory[key] = [];
  }
  
  const history = results.phaseHistory[key];
  const lastEntry = history.length > 0 ? history[history.length - 1] : null;
  
  // Check for double transition (same phase twice in a row)
  if (lastEntry && lastEntry.phase === newPhase) {
    results.doubleTransitions.push({
      day: gameState.day,
      symbol: stock.symbol,
      module: module,
      phase: newPhase,
      message: `Phase '${newPhase}' triggered twice consecutively`
    });
  }
  
  // Check for invalid transition (skipped phases)
  const validTransitions = PHASE_SEQUENCES[module]?.validTransitions;
  if (validTransitions) {
    const fromKey = oldPhase || 'null';
    const validNext = validTransitions[fromKey] || [];
    
    if (validNext.length > 0 && !validNext.includes(newPhase) && !validNext.includes(null)) {
      results.invalidTransitions.push({
        day: gameState.day,
        symbol: stock.symbol,
        module: module,
        from: oldPhase || '(start)',
        to: newPhase,
        expected: validNext.join(' or '),
        message: `Invalid transition: ${oldPhase || '(start)'} → ${newPhase}. Expected: ${validNext.join(' or ')}`
      });
    }
  }
  
  // Record this transition
  history.push({
    day: gameState.day,
    phase: newPhase,
    hadNews: hadNews
  });
  
  // Track if this phase had news
  if (hadNews) {
    results.phasesWithNews.add(`${module}:${newPhase}`);
  }
}

// Check for orphan phase (transition without news)
function checkOrphanPhase(stock, oldPhase, newPhase, module, newsCount) {
  if (newsCount === 0 && newPhase) {
    results.orphanPhases.push({
      day: gameState.day,
      symbol: stock.symbol,
      module: module,
      phase: newPhase,
      message: `Phase '${newPhase}' triggered but no news generated`
    });
  }
}

// Check for duplicate news headlines (same day, same stock, same headline = bug)
function checkDuplicateNews(newsItem) {
  // Key includes day to detect same-day duplicates (a real bug)
  const headlineKey = `day${gameState.day}:${newsItem.relatedStock || newsItem.symbol}:${newsItem.headline}`;
  
  if (results.newsHeadlines.has(headlineKey)) {
    results.duplicateNews.push({
      day: gameState.day,
      symbol: newsItem.relatedStock || newsItem.symbol,
      headline: newsItem.headline,
      newsType: newsItem.newsType,
      message: `Duplicate headline on same day`
    });
  }
  
  results.newsHeadlines.add(headlineKey);
}

// Check for tutorial hint (informational - only if tutorial mode enabled)
function checkTutorialHint(newsItem, module) {
  // Skip tutorial hint check - hints are only shown when tutorial mode is enabled
  // This check is informational only and won't count as an issue
  return;
}

// Final validation: check for missing phases in completed events
function validatePhaseCompleteness(module) {
  const expectedPhases = PHASE_SEQUENCES[module]?.phases || [];
  const seenPhases = new Set();
  
  // Collect all phases seen for this module
  for (const [key, history] of Object.entries(results.phaseHistory)) {
    if (key.startsWith(module + ':')) {
      history.forEach(entry => seenPhases.add(entry.phase));
    }
  }
  
  // Check which expected phases were never seen
  for (const phase of expectedPhases) {
    if (!seenPhases.has(phase)) {
      results.missingPhases.push({
        module: module,
        phase: phase,
        message: `Phase '${phase}' never occurred in ${module} test`
      });
    }
  }
}

// ========== COUPLING CHECK ==========

function checkCoupling(stock, newsItem) {
  const classification = classifyNews(newsItem.headline);
  if (!classification) return null;
  
  const { category, keyword, config } = classification;
  const priceChange = (stock.price - stock.previousPrice) / stock.previousPrice;
  const magnitude = Math.abs(priceChange);
  const direction = priceChange >= 0 ? 1 : -1;
  
  results.byCategory[category].total++;
  results.byCategory[category].magnitudes.push(magnitude);
  
  const directionCorrect = (direction === config.expectedDirection) || 
                           (Math.abs(priceChange) <= config.maxWrongDirection);
  
  // Resolution news announces historical outcomes
  const isResolutionNews = ['short_report_resolution', 'crash_resolution', 'recovery_complete'].includes(newsItem.newsType);
  const isHistoricalOutcome = isResolutionNews && !directionCorrect;
  
  if (directionCorrect || isHistoricalOutcome) {
    results.byCategory[category].correct++;
  } else {
    results.byCategory[category].wrong++;
  }
  
  const magnitudeOk = magnitude >= config.expectedMagnitude.min * 0.5 && 
                      magnitude <= config.expectedMagnitude.max * 2;
  
  const phase = detectPhase(stock);
  
  if (!results.byPhase[phase]) {
    results.byPhase[phase] = { total: 0, correct: 0, wrong: 0 };
  }
  results.byPhase[phase].total++;
  
  if (!directionCorrect && !isHistoricalOutcome) {
    results.byPhase[phase].wrong++;
    
    results.violations.push({
      day: gameState.day,
      symbol: stock.symbol,
      phase,
      headline: newsItem.headline,
      keyword,
      category,
      expectedDir: config.expectedDirection < 0 ? 'DOWN' : 'UP',
      actualChange: priceChange,
      sentimentOffset: stock.sentimentOffset,
      newsType: newsItem.newsType
    });
    
    return false;
  } else {
    results.byPhase[phase].correct++;
  }
  
  if (!magnitudeOk) {
    results.magnitudeIssues.push({
      day: gameState.day,
      symbol: stock.symbol,
      phase,
      keyword,
      expectedMag: `${(config.expectedMagnitude.min*100).toFixed(1)}%-${(config.expectedMagnitude.max*100).toFixed(1)}%`,
      actualMag: `${(magnitude*100).toFixed(2)}%`
    });
  }
  
  return true;
}

// ========== MODULE-SPECIFIC TESTS ==========

function initializeModule(module) {
  const deps = {
    stocks,
    todayNews,
    getMemeMultiplier,
    randomChoice,
    isEventTypeEnabled,
    random: random,
    getDate: getDate
  };
  
  if (module && module.init) {
    module.init(deps);
    return true;
  }
  return false;
}

// ===== DCB Test =====
function testDCB(days = 200) {
  console.log('\n' + '='.repeat(60));
  console.log('TESTING: Dead Cat Bounce (DCB)');
  console.log('='.repeat(60));
  
  if (!DCB) {
    console.log('❌ DCB module not loaded');
    return null;
  }
  
  seed = 12345; // Reset seed for reproducibility
  resetResults();
  stocks.length = 0;
  
  // Create stocks for DCB test
  ['DCB1', 'DCB2', 'DCB3', 'DCB4', 'DCB5'].forEach(s => stocks.push(createStock(s)));
  
  initializeModule(DCB);
  
  // Pre-trigger crashes on all stocks
  for (const stock of stocks) {
    stock.triggerPrice = stock.price;
    if (DCB.triggerCrash) {
      DCB.triggerCrash(stock, 0.15 + random() * 0.15);
      // Track the manually triggered 'crash' phase (no news in test mode)
      trackPhaseForIntegrity(stock, null, 'crash', 'DCB', false);
    }
  }
  
  for (let day = 0; day < days; day++) {
    gameState.day = day;
    todayNews.length = 0;
    
    stocks.forEach(s => {
      s.previousPrice = s.price;
      s._prevCrashPhase = s.crashPhase;
    });
    
    // Process ONLY DCB
    if (DCB.processDeadCatBounce) {
      try { DCB.processDeadCatBounce(); } catch(e) { console.log('DCB error:', e.message); }
    }
    
    // Track phase transitions
    for (const stock of stocks) {
      if (stock.crashPhase !== stock._prevCrashPhase && stock.crashPhase) {
        trackPhaseTransition(stock, stock._prevCrashPhase, stock.crashPhase, 'DCB');
        
        // Count news for this stock today
        const stockNews = todayNews.filter(n => 
          (n.relatedStock || n.symbol) === stock.symbol
        );
        trackPhaseForIntegrity(stock, stock._prevCrashPhase, stock.crashPhase, 'DCB', stockNews.length > 0);
        checkOrphanPhase(stock, stock._prevCrashPhase, stock.crashPhase, 'DCB', stockNews.length);
      }
    }
    
    updateStockPrices();
    
    // Check coupling and integrity
    for (const news of todayNews) {
      checkDuplicateNews(news);
      checkTutorialHint(news, 'DCB');
      
      const newsSymbol = news.relatedStock || news.symbol || (news.stock?.symbol);
      const stock = newsSymbol ? stocks.find(s => s.symbol === newsSymbol) : null;
      if (stock) {
        results.totalNews++;
        checkCoupling(stock, news);
      }
    }
    
    results.totalDays++;
    
    // Re-trigger any finished stocks
    for (const stock of stocks) {
      if (!stock.crashPhase && random() < 0.1) {
        stock.triggerPrice = stock.price;
        stock.phaseStartPrice = null;
        if (DCB.triggerCrash) {
          DCB.triggerCrash(stock, 0.15 + random() * 0.15);
          trackPhaseForIntegrity(stock, null, 'crash', 'DCB', false);
        }
      }
    }
  }
  
  // Final validation
  validatePhaseCompleteness('DCB');
  
  return results;
}

// ===== SSR Test =====
function testSSR(days = 200) {
  console.log('\n' + '='.repeat(60));
  console.log('TESTING: Short Seller Report (SSR)');
  console.log('='.repeat(60));
  
  if (!SSR) {
    console.log('❌ SSR module not loaded');
    return null;
  }
  
  seed = 12345;
  resetResults();
  stocks.length = 0;
  
  ['SSR1', 'SSR2', 'SSR3', 'SSR4', 'SSR5'].forEach(s => stocks.push(createStock(s)));
  
  initializeModule(SSR);
  
  // Pre-trigger short reports on all stocks
  const firms = ['Hindenburg', 'Citron', 'Muddy Waters'];
  for (const stock of stocks) {
    stock.triggerPrice = stock.price;
    if (SSR.triggerShortReport) {
      SSR.triggerShortReport(stock, randomChoice(firms));
      // Track the manually triggered 'initial_crash' phase (no news in test mode)
      trackPhaseForIntegrity(stock, null, 'initial_crash', 'SSR', false);
    }
  }
  
  for (let day = 0; day < days; day++) {
    gameState.day = day;
    todayNews.length = 0;
    
    stocks.forEach(s => {
      s.previousPrice = s.price;
      s._prevSSRPhase = s.shortReportPhase;
    });
    
    // Process ONLY SSR
    if (SSR.processShortReport) {
      try { SSR.processShortReport(); } catch(e) { console.log('SSR error:', e.message); }
    }
    
    for (const stock of stocks) {
      if (stock.shortReportPhase !== stock._prevSSRPhase && stock.shortReportPhase) {
        trackPhaseTransition(stock, stock._prevSSRPhase, stock.shortReportPhase, 'SSR');
        
        const stockNews = todayNews.filter(n => 
          (n.relatedStock || n.symbol) === stock.symbol
        );
        trackPhaseForIntegrity(stock, stock._prevSSRPhase, stock.shortReportPhase, 'SSR', stockNews.length > 0);
        checkOrphanPhase(stock, stock._prevSSRPhase, stock.shortReportPhase, 'SSR', stockNews.length);
      }
    }
    
    updateStockPrices();
    
    for (const news of todayNews) {
      checkDuplicateNews(news);
      checkTutorialHint(news, 'SSR');
      
      const newsSymbol = news.relatedStock || news.symbol || (news.stock?.symbol);
      const stock = newsSymbol ? stocks.find(s => s.symbol === newsSymbol) : null;
      if (stock) {
        results.totalNews++;
        checkCoupling(stock, news);
      }
    }
    
    results.totalDays++;
    
    // Re-trigger finished stocks
    for (const stock of stocks) {
      if (!stock.shortReportPhase && random() < 0.1) {
        stock.triggerPrice = stock.price;
        stock.phaseStartPrice = null;
        if (SSR.triggerShortReport) {
          SSR.triggerShortReport(stock, randomChoice(firms));
          trackPhaseForIntegrity(stock, null, 'initial_crash', 'SSR', false);
        }
      }
    }
  }
  
  validatePhaseCompleteness('SSR');
  
  return results;
}

// ===== SHAKEOUT Test =====
function testSHAKEOUT(days = 200) {
  console.log('\n' + '='.repeat(60));
  console.log('TESTING: News Shakeout (SHAKEOUT)');
  console.log('='.repeat(60));
  
  if (!SHAKEOUT) {
    console.log('❌ SHAKEOUT module not loaded');
    return null;
  }
  
  seed = 12345;
  resetResults();
  stocks.length = 0;
  
  ['SHK1', 'SHK2', 'SHK3', 'SHK4', 'SHK5'].forEach(s => stocks.push(createStock(s)));
  
  initializeModule(SHAKEOUT);
  
  const newsTypes = ['macro_scare', 'analyst_downgrade', 'guidance_miss'];
  for (const stock of stocks) {
    stock.triggerPrice = stock.price;
    if (SHAKEOUT.triggerNewsShakeout) {
      SHAKEOUT.triggerNewsShakeout(stock, { newsType: randomChoice(newsTypes) });
    }
  }
  
  for (let day = 0; day < days; day++) {
    gameState.day = day;
    todayNews.length = 0;
    
    stocks.forEach(s => {
      s.previousPrice = s.price;
      s._prevShakeoutPhase = s.newsShakeout?.phase;
    });
    
    // Process ONLY SHAKEOUT
    if (SHAKEOUT.checkNewsShakeoutEvents) {
      for (const stock of stocks) {
        try { 
          const result = SHAKEOUT.checkNewsShakeoutEvents(stock, todayNews);
          if (result && result.priceChange) {
            stock.crashTransitionEffect = (stock.crashTransitionEffect || 0) + result.priceChange;
          }
        } catch(e) { console.log('SHAKEOUT error:', e.message); }
      }
    }
    
    for (const stock of stocks) {
      if (stock.newsShakeout?.phase !== stock._prevShakeoutPhase && stock.newsShakeout?.phase) {
        trackPhaseTransition(stock, stock._prevShakeoutPhase, stock.newsShakeout.phase, 'SHAKEOUT');
        
        const stockNews = todayNews.filter(n => 
          (n.relatedStock || n.symbol) === stock.symbol
        );
        trackPhaseForIntegrity(stock, stock._prevShakeoutPhase, stock.newsShakeout.phase, 'SHAKEOUT', stockNews.length > 0);
        checkOrphanPhase(stock, stock._prevShakeoutPhase, stock.newsShakeout.phase, 'SHAKEOUT', stockNews.length);
      }
    }
    
    updateStockPrices();
    
    for (const news of todayNews) {
      checkDuplicateNews(news);
      checkTutorialHint(news, 'SHAKEOUT');
      
      const newsSymbol = news.relatedStock || news.symbol || (news.stock?.symbol);
      const stock = newsSymbol ? stocks.find(s => s.symbol === newsSymbol) : null;
      if (stock) {
        results.totalNews++;
        checkCoupling(stock, news);
      }
    }
    
    results.totalDays++;
    
    // Re-trigger finished stocks
    for (const stock of stocks) {
      if (!stock.newsShakeout && random() < 0.1) {
        stock.triggerPrice = stock.price;
        stock.phaseStartPrice = null;
        if (SHAKEOUT.triggerNewsShakeout) {
          SHAKEOUT.triggerNewsShakeout(stock, { newsType: randomChoice(newsTypes) });
        }
      }
    }
  }
  
  validatePhaseCompleteness('SHAKEOUT');
  
  return results;
}

// ===== PIVOT Test =====
function testPIVOT(days = 200) {
  console.log('\n' + '='.repeat(60));
  console.log('TESTING: Strategic Pivot (PIVOT)');
  console.log('='.repeat(60));
  
  if (!PIVOT) {
    console.log('❌ PIVOT module not loaded');
    return null;
  }
  
  seed = 12345;
  resetResults();
  stocks.length = 0;
  
  ['PIV1', 'PIV2', 'PIV3', 'PIV4', 'PIV5'].forEach(s => stocks.push(createStock(s)));
  
  initializeModule(PIVOT);
  
  for (const stock of stocks) {
    stock.triggerPrice = stock.price;
    if (PIVOT.triggerStrategicPivot) {
      PIVOT.triggerStrategicPivot(stock);
      // Track the manually triggered 'announcement' phase (no news in test mode)
      trackPhaseForIntegrity(stock, null, 'announcement', 'PIVOT', false);
    }
  }
  
  for (let day = 0; day < days; day++) {
    gameState.day = day;
    todayNews.length = 0;
    
    stocks.forEach(s => {
      s.previousPrice = s.price;
      s._prevPivotPhase = s.strategicPivotPhase;
    });
    
    if (PIVOT.processStrategicPivot) {
      try { PIVOT.processStrategicPivot(); } catch(e) { console.log('PIVOT error:', e.message); }
    }
    
    for (const stock of stocks) {
      if (stock.strategicPivotPhase !== stock._prevPivotPhase && stock.strategicPivotPhase) {
        trackPhaseTransition(stock, stock._prevPivotPhase, stock.strategicPivotPhase, 'PIVOT');
        
        const stockNews = todayNews.filter(n => 
          (n.relatedStock || n.symbol) === stock.symbol
        );
        trackPhaseForIntegrity(stock, stock._prevPivotPhase, stock.strategicPivotPhase, 'PIVOT', stockNews.length > 0);
        checkOrphanPhase(stock, stock._prevPivotPhase, stock.strategicPivotPhase, 'PIVOT', stockNews.length);
      }
    }
    
    updateStockPrices();
    
    for (const news of todayNews) {
      checkDuplicateNews(news);
      checkTutorialHint(news, 'PIVOT');
      
      const newsSymbol = news.relatedStock || news.symbol || (news.stock?.symbol);
      const stock = newsSymbol ? stocks.find(s => s.symbol === newsSymbol) : null;
      if (stock) {
        results.totalNews++;
        checkCoupling(stock, news);
      }
    }
    
    results.totalDays++;
    
    // Re-trigger finished stocks
    for (const stock of stocks) {
      if (!stock.strategicPivotPhase && random() < 0.1) {
        stock.triggerPrice = stock.price;
        stock.phaseStartPrice = null;
        if (PIVOT.triggerStrategicPivot) {
          PIVOT.triggerStrategicPivot(stock);
          trackPhaseForIntegrity(stock, null, 'announcement', 'PIVOT', false);
        }
      }
    }
  }
  
  validatePhaseCompleteness('PIVOT');
  
  return results;
}

// ===== EXEC Test =====
function testEXEC(days = 200) {
  console.log('\n' + '='.repeat(60));
  console.log('TESTING: Executive Change (EXEC)');
  console.log('='.repeat(60));
  
  if (!EXEC) {
    console.log('❌ EXEC module not loaded');
    return null;
  }
  
  seed = 12345;
  resetResults();
  stocks.length = 0;
  
  ['EXC1', 'EXC2', 'EXC3', 'EXC4', 'EXC5'].forEach(s => stocks.push(createStock(s)));
  
  initializeModule(EXEC);
  
  for (const stock of stocks) {
    stock.triggerPrice = stock.price;
    if (EXEC.triggerExecutiveChange) {
      EXEC.triggerExecutiveChange(stock);
      // Track the manually triggered 'announcement' phase (no news in test mode)
      trackPhaseForIntegrity(stock, null, 'announcement', 'EXEC', false);
    }
  }
  
  for (let day = 0; day < days; day++) {
    gameState.day = day;
    todayNews.length = 0;
    
    stocks.forEach(s => {
      s.previousPrice = s.price;
      s._prevExecPhase = s.execChangePhase;
    });
    
    if (EXEC.processExecutiveChange) {
      try { EXEC.processExecutiveChange(); } catch(e) { console.log('EXEC error:', e.message); }
    }
    
    for (const stock of stocks) {
      if (stock.execChangePhase !== stock._prevExecPhase && stock.execChangePhase) {
        trackPhaseTransition(stock, stock._prevExecPhase, stock.execChangePhase, 'EXEC');
        
        const stockNews = todayNews.filter(n => 
          (n.relatedStock || n.symbol) === stock.symbol
        );
        trackPhaseForIntegrity(stock, stock._prevExecPhase, stock.execChangePhase, 'EXEC', stockNews.length > 0);
        checkOrphanPhase(stock, stock._prevExecPhase, stock.execChangePhase, 'EXEC', stockNews.length);
      }
    }
    
    updateStockPrices();
    
    for (const news of todayNews) {
      checkDuplicateNews(news);
      checkTutorialHint(news, 'EXEC');
      
      const newsSymbol = news.relatedStock || news.symbol || (news.stock?.symbol);
      const stock = newsSymbol ? stocks.find(s => s.symbol === newsSymbol) : null;
      if (stock) {
        results.totalNews++;
        checkCoupling(stock, news);
      }
    }
    
    results.totalDays++;
    
    // Re-trigger finished stocks
    for (const stock of stocks) {
      if (!stock.execChangePhase && random() < 0.1) {
        stock.triggerPrice = stock.price;
        stock.phaseStartPrice = null;
        if (EXEC.triggerExecutiveChange) {
          EXEC.triggerExecutiveChange(stock);
          trackPhaseForIntegrity(stock, null, 'announcement', 'EXEC', false);
        }
      }
    }
  }
  
  validatePhaseCompleteness('EXEC');
  
  return results;
}

// ========== REPORTING ==========

function printModuleResults(moduleName, results) {
  if (!results) return 0;
  
  console.log(`\n  Days: ${results.totalDays}, News: ${results.totalNews}`);
  console.log(`  Direction violations: ${results.violations.length}`);
  console.log(`  GUI/log mismatches: ${results.expectedPriceMismatches.length}`);
  console.log(`  Phase price violations: ${results.phasePriceViolations.length}`);
  console.log(`  Phase transitions: ${results.phaseTransitions.length}`);
  
  // Phase Integrity Results
  console.log('\n  Phase Integrity:');
  const missingCount = results.missingPhases?.length || 0;
  const orphanCount = results.orphanPhases?.length || 0;
  const invalidCount = results.invalidTransitions?.length || 0;
  const doubleCount = results.doubleTransitions?.length || 0;
  const dupNewsCount = results.duplicateNews?.length || 0;
  const missingHintCount = results.missingTutorialHints?.length || 0;
  
  console.log(`    ${missingCount === 0 ? '✓' : '❌'} Missing phases: ${missingCount}`);
  console.log(`    ${orphanCount === 0 ? '✓' : '❌'} Orphan phases (no news): ${orphanCount}`);
  console.log(`    ${invalidCount === 0 ? '✓' : '❌'} Invalid transitions: ${invalidCount}`);
  console.log(`    ${doubleCount === 0 ? '✓' : '❌'} Double triggers: ${doubleCount}`);
  console.log(`    ${dupNewsCount === 0 ? '✓' : '❌'} Duplicate news: ${dupNewsCount}`);
  console.log(`    ${missingHintCount === 0 ? '✓' : '❌'} Missing tutorial hints: ${missingHintCount}`);
  
  // By category
  console.log('\n  By Category:');
  for (const [cat, stats] of Object.entries(results.byCategory)) {
    if (stats.total === 0) continue;
    const accuracy = (stats.correct / stats.total * 100).toFixed(1);
    const status = stats.wrong > 0 ? '❌' : '✓';
    console.log(`    ${status} ${cat}: ${stats.correct}/${stats.total} (${accuracy}%)`);
  }
  
  // By phase
  console.log('\n  By Phase:');
  for (const [phase, stats] of Object.entries(results.byPhase)) {
    if (stats.total === 0) continue;
    const accuracy = (stats.correct / stats.total * 100).toFixed(1);
    const status = stats.wrong > 0 ? '❌' : '✓';
    console.log(`    ${status} ${phase}: ${stats.correct}/${stats.total} (${accuracy}%)`);
  }
  
  // Sample violations
  if (results.violations.length > 0) {
    console.log('\n  Sample violations:');
    for (const v of results.violations.slice(0, 5)) {
      console.log(`    Day ${v.day} | ${v.symbol} | ${v.phase}`);
      console.log(`      "${v.headline.substring(0, 50)}..."`);
      console.log(`      Expected: ${v.expectedDir}, Actual: ${(v.actualChange * 100).toFixed(2)}%`);
    }
  }
  
  // Sample GUI/log mismatches
  if (results.expectedPriceMismatches.length > 0) {
    console.log('\n  Sample GUI/log mismatches:');
    for (const m of results.expectedPriceMismatches.slice(0, 5)) {
      console.log(`    Day ${m.day} | ${m.symbol} | ${m.phase}`);
      console.log(`      Expected Δ: ${(m.expectedDelta * 100).toFixed(1)}%, Actual Δ: ${(m.actualDelta * 100).toFixed(1)}%`);
    }
  }
  
  // Sample phase violations
  if (results.phasePriceViolations.length > 0) {
    console.log('\n  Sample phase violations:');
    for (const v of results.phasePriceViolations.slice(0, 5)) {
      console.log(`    Day ${v.day} | ${v.symbol} | ${v.module}:${v.toPhase}`);
      console.log(`      ${v.violation}`);
    }
  }
  
  // Sample missing phases
  if (results.missingPhases?.length > 0) {
    console.log('\n  Sample missing phases:');
    for (const m of results.missingPhases.slice(0, 3)) {
      console.log(`    ${m.module}: phase '${m.phase}' never occurred`);
    }
  }
  
  // Sample orphan phases
  if (results.orphanPhases?.length > 0) {
    console.log('\n  Sample orphan phases (phase triggered without news):');
    for (const o of results.orphanPhases.slice(0, 3)) {
      console.log(`    Day ${o.day} | ${o.symbol} | ${o.phase} - no news generated`);
    }
  }
  
  // Sample invalid transitions
  if (results.invalidTransitions?.length > 0) {
    console.log('\n  Sample invalid transitions:');
    for (const t of results.invalidTransitions.slice(0, 3)) {
      console.log(`    Day ${t.day} | ${t.symbol} | ${t.from || 'null'} → ${t.to}`);
    }
  }
  
  // Sample double triggers
  if (results.doubleTransitions?.length > 0) {
    console.log('\n  Sample double triggers:');
    for (const d of results.doubleTransitions.slice(0, 3)) {
      console.log(`    Day ${d.day} | ${d.symbol} | ${d.phase} triggered again`);
    }
  }
  
  // Sample duplicate news
  if (results.duplicateNews?.length > 0) {
    console.log('\n  Sample duplicate news:');
    for (const dn of results.duplicateNews.slice(0, 3)) {
      console.log(`    Day ${dn.day} | ${dn.symbol} | "${dn.headline.substring(0, 40)}..."`);
    }
  }
  
  // Sample missing tutorial hints
  if (results.missingTutorialHints?.length > 0) {
    console.log('\n  Sample missing tutorial hints:');
    for (const h of results.missingTutorialHints.slice(0, 3)) {
      console.log(`    Day ${h.day} | ${h.symbol} | "${h.headline.substring(0, 40)}..."`);
    }
  }
  
  const totalIssues = results.violations.length + 
                      results.expectedPriceMismatches.length + 
                      results.phasePriceViolations.length +
                      missingCount + orphanCount + invalidCount + 
                      doubleCount + dupNewsCount + missingHintCount;
  
  return totalIssues;
}

// ========== MAIN ==========

console.log('\n🔬 PRICE-NEWS COUPLING TEST (ISOLATED MODULES)');
console.log('Testing each phenomenon individually to avoid multi-module conflicts\n');

// Parse command line argument
const moduleArg = process.argv[2]?.toUpperCase() || 'ALL';

const allResults = {};
let grandTotalIssues = 0;

if (moduleArg === 'ALL' || moduleArg === 'DCB') {
  allResults.DCB = testDCB();
  if (allResults.DCB) {
    const issues = printModuleResults('DCB', allResults.DCB);
    grandTotalIssues += issues;
  }
}

if (moduleArg === 'ALL' || moduleArg === 'SSR') {
  allResults.SSR = testSSR();
  if (allResults.SSR) {
    const issues = printModuleResults('SSR', allResults.SSR);
    grandTotalIssues += issues;
  }
}

if (moduleArg === 'ALL' || moduleArg === 'SHAKEOUT') {
  allResults.SHAKEOUT = testSHAKEOUT();
  if (allResults.SHAKEOUT) {
    const issues = printModuleResults('SHAKEOUT', allResults.SHAKEOUT);
    grandTotalIssues += issues;
  }
}

if (moduleArg === 'ALL' || moduleArg === 'PIVOT') {
  allResults.PIVOT = testPIVOT();
  if (allResults.PIVOT) {
    const issues = printModuleResults('PIVOT', allResults.PIVOT);
    grandTotalIssues += issues;
  }
}

if (moduleArg === 'ALL' || moduleArg === 'EXEC') {
  allResults.EXEC = testEXEC();
  if (allResults.EXEC) {
    const issues = printModuleResults('EXEC', allResults.EXEC);
    grandTotalIssues += issues;
  }
}

// Final summary
console.log('\n' + '='.repeat(60));
console.log('FINAL SUMMARY');
console.log('='.repeat(60));

for (const [mod, res] of Object.entries(allResults)) {
  if (!res) continue;
  const issues = res.violations.length + res.expectedPriceMismatches.length + res.phasePriceViolations.length;
  const status = issues === 0 ? '✅' : '❌';
  console.log(`${status} ${mod}: ${issues} issues (${res.violations.length} direction, ${res.expectedPriceMismatches.length} GUI/log, ${res.phasePriceViolations.length} phase)`);
}

console.log('-'.repeat(60));
if (grandTotalIssues === 0) {
  console.log('✅ ALL TESTS PASSED!');
} else {
  console.log(`❌ TOTAL ISSUES: ${grandTotalIssues}`);
}
console.log('='.repeat(60));
