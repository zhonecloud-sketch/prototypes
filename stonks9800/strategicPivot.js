/**
 * Strategic Pivot Module (Uncertainty Premium / Re-Rating Events)
 * 
 * Empirical Sources:
 * - Kogan, Wei & Zhao (2023): "The Buzzword Effect" - Pivots without R&D history reverse 75% in 22 days
 * - Brauer & Wiersema (2024): "Strategic Refocusing and Execution Gap" - No 8-K CapEx change in 30 days = reversal
 * - Tang & Agrawal (2022): "Risk of Strategic Deviance" - Deviant pivots recover "Uncertainty Gap" in 15-20 days
 * - HBS "Pivot Penalty" (2021): Market charges -4.5% Day 1; Proactive pivots reverse in <3 weeks (68%)
 * 
 * KEY INSIGHT: Four types of pivots with different outcomes:
 * 
 * 1. REACTIVE PIVOT (<10% Reversal)
 *    - Saving a dying firm, desperate measure
 *    - Revenue already declining, this is last resort
 *    → Long drift down, NO reversal
 * 
 * 2. STRUCTURAL PIVOT (30% Reversal, 6 months)
 *    - New debt, new CEO, major restructuring
 *    - Real capital commitment
 *    → May eventually recover, but takes 6+ months
 * 
 * 3. PROACTIVE/SYMBOLIC PIVOT (65% Reversal, 2-3 weeks)
 *    - Hype-based, buzzwords, no real spending
 *    - Company still profitable, "exploring" new direction
 *    → "Uncertainty Premium" refunded when nothing changes
 * 
 * 4. GOLD STANDARD (85%+ Reversal, 10-14 days)
 *    - Symbolic pivot PLUS 4 confirmation signals:
 *      a) Non-Dilutive (no share issuance, no debt increase)
 *      b) Anchor Revenue (old business still stable)
 *      c) Insider Buy (2+ insiders buy within 48 hours)
 *      d) Gap Fill (closes in upper 25% of range on high volume)
 *    → Classic "News Shakeout" - institutions buy the retail panic
 */

const StrategicPivot = (function() {
  'use strict';

  // ========== EMPIRICAL CONSTANTS ==========
  const CONSTANTS = {
    // Pivot Classification (4 Types)
    PIVOT_TYPES: {
      REACTIVE: 'reactive',           // Dying firm, no reversal
      STRUCTURAL: 'structural',       // Real change, slow recovery
      SYMBOLIC: 'symbolic',           // Hype-based, good reversal
      GOLD_STANDARD: 'gold_standard'  // All signals aligned, 85%+
    },

    // Probability of each type when pivot announced
    TYPE_PROBABILITY: {
      reactive: 0.15,       // 15% are desperate last-resort pivots
      structural: 0.30,     // 30% are real structural changes
      symbolic: 0.35,       // 35% are hype-based symbolic pivots
      gold_standard: 0.20   // 20% meet gold standard criteria
    },

    // Reversal Probability by Type (from empirical studies)
    REVERSAL_PROBABILITY: {
      reactive: 0.10,       // <10% reversal (HBS 2021)
      structural: 0.30,     // 30% reversal after 6 months (Brauer 2024)
      symbolic: 0.65,       // 65% reversal in 2-3 weeks (Tang & Agrawal)
      gold_standard: 0.85   // 85%+ reversal in 10-14 days
    },

    // Price Impact
    PRICE_IMPACT: {
      announcement: {
        reactive: { min: -0.15, max: -0.25 },     // -15% to -25%
        structural: { min: -0.10, max: -0.18 },   // -10% to -18%
        symbolic: { min: -0.05, max: -0.10 },     // -5% to -10% (Pivot Penalty)
        gold_standard: { min: -0.05, max: -0.10 } // -5% to -10%
      },
      executionVoid: {
        reactive: { min: -0.03, max: -0.01 },     // Continued drift
        structural: { min: -0.02, max: 0.02 },    // Stabilization
        symbolic: { min: -0.01, max: 0.03 },      // Short covering bounce
        gold_standard: { min: 0.01, max: 0.04 }   // Institutional absorption
      },
      resolution: {
        reactive: { min: -0.05, max: 0.00 },      // More downside
        structural: { min: -0.02, max: 0.05 },    // Slow recovery begins
        symbolic: { min: 0.05, max: 0.12 },       // Good recovery
        gold_standard: { min: 0.08, max: 0.15 }   // Full reversal
      }
    },

    // Timeline (in days)
    TIMELINE: {
      announcement: { min: 1, max: 2 },
      executionVoid: { min: 8, max: 14 },         // 2 weeks of no news
      resolution: {
        reactive: { min: 15, max: 30 },           // Long drift
        structural: { min: 20, max: 40 },         // Slow process
        symbolic: { min: 10, max: 18 },           // 2-3 weeks (Tang & Agrawal)
        gold_standard: { min: 7, max: 14 }        // 10-14 days
      }
    },

    // Gold Standard Signals (must have ALL 4 for 85%+)
    GOLD_STANDARD_SIGNALS: {
      nonDilutive: 0.25,        // No share issuance, no debt increase
      anchorRevenue: 0.25,      // Old business still stable/growing
      insiderBuy: 0.30,         // 2+ insiders buy within 48 hours
      gapFill: 0.20             // Closes in upper 25% on high volume
    },

    // Daily trigger chance
    DAILY_CHANCE: 0.012
  };

  // ========== PIVOT CATALYSTS ==========
  
  // Reactive Pivots (Dying Firm - No Reversal)
  const REACTIVE_CATALYSTS = [
    {
      headline: 'announces "strategic alternatives" amid revenue collapse',
      keywords: ['strategic alternatives', 'review options', 'exploring sale'],
      severity: 0.20,
      context: 'Revenue down 40% YoY'
    },
    {
      headline: 'pivots to new market after core business fails',
      keywords: ['pivot', 'new market', 'turnaround'],
      severity: 0.22,
      context: 'Third consecutive quarterly loss'
    },
    {
      headline: 'CEO announces "reinvention" as company bleeds cash',
      keywords: ['reinvention', 'transformation', 'survival'],
      severity: 0.18,
      context: 'Cash runway under 12 months'
    }
  ];

  // Structural Pivots (Real Change - Slow Recovery)
  const STRUCTURAL_CATALYSTS = [
    {
      headline: 'announces $500M divestiture of legacy business unit',
      metrics: ['divestiture', '$500M', 'legacy exit'],
      severity: 0.15
    },
    {
      headline: 'secures $1B credit facility to fund strategic pivot',
      metrics: ['credit facility', '$1B', 'debt financing'],
      severity: 0.18
    },
    {
      headline: 'cuts 30% of workforce, redirects savings to R&D',
      metrics: ['workforce reduction', 'R&D investment', 'restructuring'],
      severity: 0.16
    },
    {
      headline: 'takes $800M write-down, announces "new chapter"',
      metrics: ['write-down', 'impairment', 'restructuring charge'],
      severity: 0.19
    },
    {
      headline: 'new CEO hired from competitor, signals "fresh direction"',
      metrics: ['new CEO', 'leadership change', 'strategic shift'],
      severity: 0.14
    }
  ];

  // Symbolic Pivots (Hype-Based - 65% Reversal)
  const SYMBOLIC_CATALYSTS = [
    {
      headline: 'announces "AI-First" strategic transformation',
      buzzwords: ['AI-First', 'transformation', 'digital future'],
      severity: 0.08
    },
    {
      headline: 'pivots to blockchain-enabled services',
      buzzwords: ['blockchain', 'Web3', 'decentralized'],
      severity: 0.07
    },
    {
      headline: 'launches strategic review, exploring "synergies"',
      buzzwords: ['synergies', 'strategic review', 'unlock value'],
      severity: 0.06
    },
    {
      headline: 'rebrands as tech company, promises "digital transformation"',
      buzzwords: ['rebrand', 'digital transformation', 'innovation'],
      severity: 0.09
    },
    {
      headline: 'CEO declares company is now "cloud-native"',
      buzzwords: ['cloud-native', 'SaaS', 'recurring revenue'],
      severity: 0.08
    }
  ];

  // Gold Standard Catalysts (Symbolic + All 4 Signals)
  const GOLD_STANDARD_CATALYSTS = [
    {
      headline: 'announces strategic "AI initiative" - insiders buying',
      buzzwords: ['AI initiative', 'strategic', 'opportunity'],
      goldSignals: ['non-dilutive', 'stable revenue', 'insider buying', 'volume absorption'],
      severity: 0.08
    },
    {
      headline: 'explores "platform transformation" - CFO buys shares',
      buzzwords: ['platform', 'transformation', 'ecosystem'],
      goldSignals: ['no debt', 'core business intact', 'CFO purchase', 'gap fill'],
      severity: 0.07
    }
  ];

  // ========== HEADLINE TEMPLATES ==========
  const HEADLINES = {
    reactive: {
      announcement: [
        `${'{symbol}'} ${'{catalyst}'} - analysts see "last resort"`,
        `BREAKING: ${'{symbol}'} ${'{catalyst}'}`,
        `${'{symbol}'} plunges as desperate ${'{catalyst}'}`
      ],
      executionVoid: [
        `${'{symbol}'} continues slide - "no bottom in sight"`,
        `${'{symbol}'} finds no support - short interest soars`,
        `Analysts warn ${'{symbol}'} recovery unlikely`
      ],
      resolution: [
        `${'{symbol}'} establishes new low - turnaround hopes fade`,
        `${'{symbol}'}: "The old company is gone" - analyst`,
        `${'{symbol}'} drift continues - classic value trap pattern`
      ]
    },
    structural: {
      announcement: [
        `${'{symbol}'} ${'{catalyst}'} - market re-rates stock`,
        `BREAKING: ${'{symbol}'} ${'{catalyst}'}`,
        `${'{symbol}'} drops on major restructuring news`
      ],
      executionVoid: [
        `${'{symbol}'} stabilizes - execution begins`,
        `${'{symbol}'} finds support as restructuring details emerge`,
        `${'{symbol}'} technical bounce - analysts cautious`
      ],
      resolution: [
        `${'{symbol}'} begins slow recovery - "6-month thesis" says fund`,
        `${'{symbol}'} finds new base - restructuring on track`,
        `${'{symbol}'}: Long road ahead but worst may be over`
      ]
    },
    symbolic: {
      announcement: [
        `${'{symbol}'} ${'{catalyst}'} - shares slide on uncertainty`,
        `BREAKING: ${'{symbol}'} ${'{catalyst}'}`,
        `${'{symbol}'} stock drops as company ${'{catalyst}'}`
      ],
      executionVoid: [
        `${'{symbol}'} finds support - "pivot concerns overdone"`,
        `${'{symbol}'} stabilizes as short-sellers cover`,
        `Bargain hunters eye ${'{symbol}'} after pivot selloff`
      ],
      resolution: [
        `${'{symbol}'} rallies - pivot fears prove overblown`,
        `${'{symbol}'} recovers as "nothing has changed yet"`,
        `${'{symbol}'} stages comeback - ${'{buzzword}'} concerns fade`
      ]
    },
    gold_standard: {
      announcement: [
        `${'{symbol}'} ${'{catalyst}'} - smart money buying the dip`,
        `${'{symbol}'} drops on pivot news - but insiders are buying`,
        `${'{symbol}'} slides, institutional absorption detected`
      ],
      executionVoid: [
        `${'{symbol}'} holds support - insider buying continues`,
        `${'{symbol}'} gap fill in progress - classic setup`,
        `${'{symbol}'}: Volume absorption suggests smart money accumulation`
      ],
      resolution: [
        `${'{symbol}'} completes reversal - "textbook shakeout"`,
        `${'{symbol}'} back to pre-announcement - insider buyers vindicated`,
        `${'{symbol}'} rally complete - "Uncertainty Premium" refunded`
      ]
    }
  };

  // ========== DEPENDENCIES ==========
  let deps = {
    stocks: null,
    todayNews: null,
    random: Math.random,
    randomChoice: null,
    isEventTypeEnabled: null,
    getMemeMultiplier: null
  };

  // ========== INITIALIZATION ==========
  function init(dependencies) {
    if (dependencies.stocks !== undefined) deps.stocks = dependencies.stocks;
    if (dependencies.todayNews !== undefined) deps.todayNews = dependencies.todayNews;
    if (dependencies.random !== undefined) deps.random = dependencies.random;
    if (dependencies.randomChoice !== undefined) deps.randomChoice = dependencies.randomChoice;
    if (dependencies.isEventTypeEnabled !== undefined) deps.isEventTypeEnabled = dependencies.isEventTypeEnabled;
    if (dependencies.getMemeMultiplier !== undefined) deps.getMemeMultiplier = dependencies.getMemeMultiplier;
    return StrategicPivot;
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
    if (typeof window !== 'undefined' && window.isEventTypeEnabled) {
      return window.isEventTypeEnabled(eventType);
    }
    return true;
  }

  function getMemeMultiplier(stock) {
    if (deps.getMemeMultiplier) return deps.getMemeMultiplier(stock);
    return (stock.isMeme || stock.volatility > 0.05) ? 1.5 : 1.0;
  }

  // ========== PIVOT CLASSIFICATION ==========
  /**
   * Determine pivot type based on probability distribution
   */
  function classifyPivot() {
    const roll = random();
    const probs = CONSTANTS.TYPE_PROBABILITY;
    
    if (roll < probs.reactive) {
      return CONSTANTS.PIVOT_TYPES.REACTIVE;
    } else if (roll < probs.reactive + probs.structural) {
      return CONSTANTS.PIVOT_TYPES.STRUCTURAL;
    } else if (roll < probs.reactive + probs.structural + probs.symbolic) {
      return CONSTANTS.PIVOT_TYPES.SYMBOLIC;
    } else {
      return CONSTANTS.PIVOT_TYPES.GOLD_STANDARD;
    }
  }

  /**
   * Generate signals for player to analyze
   * Gold Standard requires ALL 4 signals present
   */
  function generatePivotSignals(pivotType) {
    const isGoldStandard = pivotType === CONSTANTS.PIVOT_TYPES.GOLD_STANDARD;
    const isSymbolic = pivotType === CONSTANTS.PIVOT_TYPES.SYMBOLIC || isGoldStandard;
    const isReactive = pivotType === CONSTANTS.PIVOT_TYPES.REACTIVE;
    const isStructural = pivotType === CONSTANTS.PIVOT_TYPES.STRUCTURAL;

    const signals = {
      pivotType: pivotType,
      
      // Signal 1: Non-Dilutive Filter (no share issuance, no debt increase)
      nonDilutive: {
        isMet: isGoldStandard || (isSymbolic && random() > 0.3),
        shareIssuance: isGoldStandard ? 'none' : (isStructural ? 'possible' : 'none'),
        debtChange: isGoldStandard ? 'none' : (isStructural ? 'increase' : 'none'),
        description: isGoldStandard 
          ? 'No share issuance or debt increase announced - pivot is symbolic'
          : isStructural 
            ? 'New debt facility or equity raise announced - real capital commitment'
            : 'No financing announced - watching for follow-up 8-K'
      },
      
      // Signal 2: Anchor Revenue Buffer (old business stable)
      anchorRevenue: {
        isMet: isGoldStandard || (isSymbolic && random() > 0.2),
        oldBusinessStatus: isReactive ? 'declining' : (isGoldStandard ? 'stable' : 'mixed'),
        quarterlyTrend: isReactive ? 'negative' : (isGoldStandard ? 'positive' : 'flat'),
        description: isGoldStandard
          ? 'Core business revenue stable/growing - "Cash Cow" still operating'
          : isReactive
            ? 'Core revenue declining 40%+ YoY - desperate pivot'
            : 'Core business status unclear - monitor earnings'
      },
      
      // Signal 3: Insider Buy Verification (2+ insiders buy within 48 hours)
      insiderBuy: {
        isMet: isGoldStandard,
        buyerCount: isGoldStandard ? 2 + Math.floor(random() * 2) : 0,
        buyerRoles: isGoldStandard ? ['CEO', 'CFO'] : [],
        timing: isGoldStandard ? 'within 48 hours' : 'no purchases',
        description: isGoldStandard
          ? `${2 + Math.floor(random() * 2)} insiders (CEO, CFO) purchased shares within 48 hours of announcement`
          : isSymbolic 
            ? 'No insider purchases detected - monitoring Form 4 filings'
            : 'Insiders silent or selling - negative signal'
      },
      
      // Signal 4: Gap Fill Technical (closes in upper 25% on high volume)
      gapFill: {
        isMet: isGoldStandard || (isSymbolic && random() > 0.5),
        closePosition: isGoldStandard ? 'upper 25%' : (isReactive ? 'lower 25%' : 'middle'),
        volumeMultiple: isGoldStandard ? 3 + random() * 2 : 1 + random() * 1.5,
        description: isGoldStandard
          ? 'Stock gapped down but closed in upper 25% of range on 3x+ volume - institutional absorption'
          : isReactive
            ? 'Closed near lows on heavy volume - no absorption'
            : 'Mixed close - watching for follow-through'
      },
      
      // Language Analysis
      language: {
        type: isSymbolic || isGoldStandard ? 'buzzword' : 'technical',
        examples: isSymbolic || isGoldStandard 
          ? ['synergies', 'AI-first', 'transformation', 'platform']
          : ['divestiture', 'write-down', 'restructuring', 'unit economics'],
        description: isSymbolic || isGoldStandard
          ? 'Headline uses buzzwords without financial commitments'
          : 'Headline contains specific dollar amounts or restructuring metrics'
      },
      
      // Gold Standard Check
      isGoldStandard: isGoldStandard,
      goldSignalsMet: isGoldStandard ? 4 : (isSymbolic ? 1 + Math.floor(random() * 2) : 0)
    };

    return signals;
  }

  /**
   * Calculate reversal probability based on signals
   */
  function calculateReversalProbability(stock) {
    if (!stock.pivotType) return 0.5;

    const signals = stock.pivotSignals || {};
    const baseProb = CONSTANTS.REVERSAL_PROBABILITY[stock.pivotType];
    let probability = baseProb;

    // Adjust based on actual signals
    if (signals.nonDilutive?.isMet) probability += 0.05;
    if (signals.anchorRevenue?.isMet) probability += 0.05;
    if (signals.insiderBuy?.isMet) probability += 0.10;  // Most powerful signal
    if (signals.gapFill?.isMet) probability += 0.05;

    // Negative adjustments
    if (signals.anchorRevenue?.oldBusinessStatus === 'declining') probability -= 0.15;
    if (signals.language?.type === 'technical') probability -= 0.10;

    // Cap probability
    probability = Math.max(0.05, Math.min(0.95, probability));

    return probability;
  }

  // ========== TRIGGER PIVOT ==========
  function triggerStrategicPivot(stock, forcedType = null) {
    if (stock.strategicPivotPhase) return false;

    // Classify pivot type
    const pivotType = forcedType || classifyPivot();
    
    // Select catalyst based on type
    let catalyst;
    switch (pivotType) {
      case CONSTANTS.PIVOT_TYPES.REACTIVE:
        catalyst = randomChoice(REACTIVE_CATALYSTS);
        break;
      case CONSTANTS.PIVOT_TYPES.STRUCTURAL:
        catalyst = randomChoice(STRUCTURAL_CATALYSTS);
        break;
      case CONSTANTS.PIVOT_TYPES.SYMBOLIC:
        catalyst = randomChoice(SYMBOLIC_CATALYSTS);
        break;
      case CONSTANTS.PIVOT_TYPES.GOLD_STANDARD:
        catalyst = randomChoice(GOLD_STANDARD_CATALYSTS);
        break;
      default:
        catalyst = randomChoice(SYMBOLIC_CATALYSTS);
    }

    // Store pivot state
    stock.strategicPivotPhase = 'announcement';
    stock.pivotType = pivotType;
    stock.pivotCatalyst = catalyst;
    stock.pivotSignals = generatePivotSignals(pivotType);
    stock.prePivotPrice = stock.price;
    
    // Timeline
    const timeline = CONSTANTS.TIMELINE;
    stock.pivotDaysLeft = timeline.announcement.min + 
      Math.floor(random() * (timeline.announcement.max - timeline.announcement.min + 1));
    stock.pivotDayCounter = 0;

    // Calculate outcome based on signals
    const reversalProb = calculateReversalProbability(stock);
    stock.pivotWillReverse = random() < reversalProb;
    stock.pivotReversalProbability = reversalProb;

    // Initial price impact
    const impact = CONSTANTS.PRICE_IMPACT.announcement[pivotType];
    const memeMultiplier = getMemeMultiplier(stock);
    stock.crashTransitionEffect = (impact.min + random() * (impact.max - impact.min)) * memeMultiplier;
    stock.sentimentOffset = (stock.sentimentOffset || 0) - 0.03 * memeMultiplier;

    console.log(`[PIVOT] ${stock.symbol}: ${pivotType.toUpperCase()} pivot triggered`);
    console.log(`  Catalyst: ${catalyst.headline}`);
    console.log(`  Reversal probability: ${Math.round(reversalProb * 100)}%`);
    console.log(`  Will reverse: ${stock.pivotWillReverse}`);

    return true;
  }

  // ========== PROCESS PIVOT ==========
  function processStrategicPivot() {
    const stockList = getStocks();
    
    stockList.forEach(stock => {
      if (!stock.strategicPivotPhase) return;
      
      // Cancel if disabled
      if (!isEventTypeEnabled('strategic_pivot')) {
        clearPivotState(stock);
        return;
      }

      stock.pivotDaysLeft--;
      stock.pivotDayCounter++;

      const memeMultiplier = getMemeMultiplier(stock);
      const pivotType = stock.pivotType;

      switch (stock.strategicPivotPhase) {
        case 'announcement':
          processAnnouncementPhase(stock, pivotType, memeMultiplier);
          break;
        case 'execution_void':
          processExecutionVoidPhase(stock, pivotType, memeMultiplier);
          break;
        case 'resolution':
          processResolutionPhase(stock, pivotType, memeMultiplier);
          break;
      }
    });
  }

  function processAnnouncementPhase(stock, pivotType, memeMultiplier) {
    // Continued selling pressure
    const impact = CONSTANTS.PRICE_IMPACT.announcement[pivotType];
    stock.crashTransitionEffect = (impact.min * 0.3 + random() * Math.abs(impact.min * 0.3)) * memeMultiplier;

    if (stock.pivotDaysLeft <= 0) {
      // Transition to execution void
      stock.strategicPivotPhase = 'execution_void';
      const timeline = CONSTANTS.TIMELINE.executionVoid;
      stock.pivotDaysLeft = timeline.min + Math.floor(random() * (timeline.max - timeline.min + 1));
      
      // Record the pivot low
      stock.pivotLowPrice = stock.price;
      
      generatePivotNews(stock, 'execution_void');
    }
  }

  function processExecutionVoidPhase(stock, pivotType, memeMultiplier) {
    // The "Void" - no news, short covering / institutional absorption
    const impact = CONSTANTS.PRICE_IMPACT.executionVoid[pivotType];
    
    // Bounce dynamics based on type
    if (pivotType === CONSTANTS.PIVOT_TYPES.GOLD_STANDARD) {
      // Strong absorption
      stock.crashTransitionEffect = 0.01 + random() * 0.03;
    } else if (pivotType === CONSTANTS.PIVOT_TYPES.SYMBOLIC) {
      // Moderate bounce from short covering
      if (stock.pivotDayCounter % 3 === 0) {
        stock.crashTransitionEffect = 0.01 + random() * 0.02;
      } else {
        stock.crashTransitionEffect = impact.min + random() * (impact.max - impact.min);
      }
    } else {
      // Reactive/Structural - minimal bounce
      stock.crashTransitionEffect = impact.min + random() * (impact.max - impact.min);
    }

    // Mid-void news
    if (stock.pivotDaysLeft === Math.floor(CONSTANTS.TIMELINE.executionVoid.max / 2)) {
      generatePivotNews(stock, 'execution_void_mid');
    }

    if (stock.pivotDaysLeft <= 0) {
      // Transition to resolution
      stock.strategicPivotPhase = 'resolution';
      const resTimeline = CONSTANTS.TIMELINE.resolution[pivotType];
      stock.pivotDaysLeft = resTimeline.min + Math.floor(random() * (resTimeline.max - resTimeline.min + 1));
      
      generatePivotNews(stock, 'resolution');
    }
  }

  function processResolutionPhase(stock, pivotType, memeMultiplier) {
    const impact = CONSTANTS.PRICE_IMPACT.resolution[pivotType];
    
    if (stock.pivotWillReverse) {
      // Recovery
      stock.crashTransitionEffect = (impact.max + random() * Math.abs(impact.max - impact.min)) / Math.max(1, stock.pivotDaysLeft);
      stock.sentimentOffset = (stock.sentimentOffset || 0) + 0.015 * memeMultiplier;
    } else {
      // Continued decline or new base
      stock.crashTransitionEffect = impact.min + random() * (impact.max - impact.min) * 0.5;
    }

    if (stock.pivotDaysLeft <= 0) {
      // Calculate final outcome
      const startPrice = stock.prePivotPrice;
      const endPrice = stock.price;
      const totalChange = (endPrice - startPrice) / startPrice;

      console.log(`[PIVOT] ${stock.symbol} RESOLVED:`);
      console.log(`  Type: ${pivotType}`);
      console.log(`  Reversed: ${stock.pivotWillReverse}`);
      console.log(`  Start: $${startPrice.toFixed(2)} → End: $${endPrice.toFixed(2)}`);
      console.log(`  Total change: ${(totalChange * 100).toFixed(1)}%`);

      generatePivotNews(stock, stock.pivotWillReverse ? 'reversal_complete' : 'new_base');
      clearPivotState(stock);
    }
  }

  function clearPivotState(stock) {
    stock.strategicPivotPhase = null;
    stock.pivotType = null;
    stock.pivotCatalyst = null;
    stock.pivotSignals = null;
    stock.prePivotPrice = null;
    stock.pivotLowPrice = null;
    stock.pivotDaysLeft = null;
    stock.pivotDayCounter = null;
    stock.pivotWillReverse = null;
    stock.pivotReversalProbability = null;
  }

  // ========== NEWS GENERATION ==========
  function generatePivotNews(stock, phase) {
    const news = getNews();
    const pivotType = stock.pivotType;
    const catalyst = stock.pivotCatalyst;
    const signals = stock.pivotSignals;
    const isGoldStandard = pivotType === CONSTANTS.PIVOT_TYPES.GOLD_STANDARD;
    const isSymbolic = pivotType === CONSTANTS.PIVOT_TYPES.SYMBOLIC;
    const isReactive = pivotType === CONSTANTS.PIVOT_TYPES.REACTIVE;

    let headline, description, sentiment, educationalNote;
    const templates = HEADLINES[pivotType] || HEADLINES.symbolic;

    switch (phase) {
      case 'execution_void':
        headline = randomChoice(templates.executionVoid).replace('{symbol}', stock.symbol);
        description = isGoldStandard
          ? `The "Uncertainty Premium" evaporation begins. Insider buying + institutional absorption detected. ` +
            `${signals.insiderBuy?.description}. ${signals.gapFill?.description}.`
          : isSymbolic
            ? `The "Execution Void" begins - no follow-up news expected for 2 weeks. Short covering underway.`
            : `Stock stabilizes but fundamentals remain concerning. ${signals.anchorRevenue?.description}.`;
        sentiment = isGoldStandard ? 'positive' : 'neutral';
        educationalNote = isGoldStandard
          ? '🏆 GOLD STANDARD SETUP: Non-dilutive + Anchor revenue + Insider buy + Gap fill = 85%+ reversal in 10-14 days'
          : isSymbolic
            ? '📊 SYMBOLIC PIVOT: No CapEx commitment + Buzzword language = 65% reversal in 2-3 weeks (Tang & Agrawal)'
            : '⚠️ STRUCTURAL/REACTIVE: Real capital commitment or dying business = low reversal probability';
        break;

      case 'execution_void_mid':
        headline = `${stock.symbol} continues ${isGoldStandard || isSymbolic ? 'recovery' : 'drift'} - market awaits follow-through`;
        description = isGoldStandard
          ? `Institutional absorption continues. "Uncertainty Premium" being refunded as old business remains stable.`
          : `No news from company in ${stock.pivotDayCounter} days. ${isSymbolic ? 'Short covering rally continues.' : 'Drift pattern persists.'}`;
        sentiment = 'neutral';
        educationalNote = '📰 EXECUTION VOID: 2 weeks of no news - market processes "Uncertainty Premium" (HBS 2021)';
        break;

      case 'resolution':
        headline = randomChoice(templates.resolution)
          .replace('{symbol}', stock.symbol)
          .replace('{buzzword}', catalyst.buzzwords?.[0] || 'pivot');
        description = stock.pivotWillReverse
          ? `Pattern complete: ${isGoldStandard ? 'Gold Standard reversal' : 'Uncertainty Premium refunded'}. ` +
            `${signals.anchorRevenue?.description}. Nothing has fundamentally changed.`
          : `Stock establishes new base. ${isReactive ? 'Turnaround thesis failed.' : 'Market has re-rated the company.'}`;
        sentiment = stock.pivotWillReverse ? 'positive' : 'neutral';
        educationalNote = stock.pivotWillReverse
          ? '✅ REVERSAL COMPLETE: "Uncertainty Premium" refunded - market realized nothing changed (Kogan 2023)'
          : '❌ NO REVERSAL: Real structural change or dying business = permanent re-rating';
        break;

      case 'reversal_complete':
        headline = `${stock.symbol} fully recovers - pivot concerns prove overblown`;
        description = isGoldStandard
          ? `Gold Standard pattern complete. Insider buying was the key signal - they knew the pivot was additive, not destructive.`
          : `Classic News Shakeout. The "pivot" was symbolic - no real capital commitment. Old business unchanged.`;
        sentiment = 'positive';
        educationalNote = isGoldStandard
          ? '🏆 GOLD STANDARD CONFIRMED: Non-dilutive + Anchor revenue + Insider buy + Gap fill = 85%+ success'
          : '✅ SYMBOLIC PIVOT REVERSAL: Buzzword pivots without CapEx reverse in 2-3 weeks (65%)';
        break;

      case 'new_base':
        headline = `${stock.symbol} finds new equilibrium - "${isReactive ? 'turnaround failed' : 're-rating complete'}"`;
        description = isReactive
          ? `The pivot was a last resort for a dying business. No reversal expected - long drift continues.`
          : `The market has permanently re-priced ${stock.symbol}. Real capital commitment = permanent change.`;
        sentiment = 'negative';
        educationalNote = isReactive
          ? '❌ REACTIVE PIVOT: Dying firm pivots have <10% reversal rate - value trap confirmed'
          : '❌ STRUCTURAL PIVOT: Real capital commitment = permanent re-rating. Only 30% reverse (Brauer 2024)';
        break;
    }

    if (headline) {
      news.push({
        headline: headline,
        description: description,
        sentiment: sentiment,
        relatedStock: stock.symbol,
        newsType: 'strategic_pivot',
        isStrategicPivot: true,
        pivotType: pivotType,
        pivotPhase: phase,
        reversalProbability: stock.pivotReversalProbability,
        educationalNote: educationalNote,
        pivotSignals: signals
      });
    }
  }

  // ========== CHECK FOR NEW PIVOTS ==========
  function checkStrategicPivotEvents(stock, newsArray) {
    // Skip if already in pivot or other major event
    if (stock.strategicPivotPhase || stock.crashPhase || stock.shortReportPhase) return;
    
    // Daily chance
    if (random() < CONSTANTS.DAILY_CHANCE) {
      triggerStrategicPivot(stock);
      
      // Generate announcement news
      const pivotType = stock.pivotType;
      const catalyst = stock.pivotCatalyst;
      const signals = stock.pivotSignals;
      const isGoldStandard = pivotType === CONSTANTS.PIVOT_TYPES.GOLD_STANDARD;

      const templates = HEADLINES[pivotType] || HEADLINES.symbolic;
      const headline = randomChoice(templates.announcement)
        .replace('{symbol}', stock.symbol)
        .replace('{catalyst}', catalyst.headline);

      const news = newsArray || getNews();
      news.push({
        headline: headline,
        description: `Key signals: ${signals.nonDilutive?.description}. ` +
          `${signals.anchorRevenue?.description}. ` +
          `${signals.insiderBuy?.description}.`,
        sentiment: 'negative',
        relatedStock: stock.symbol,
        newsType: 'strategic_pivot',
        isStrategicPivot: true,
        pivotType: pivotType,
        pivotPhase: 'announcement',
        reversalProbability: stock.pivotReversalProbability,
        educationalNote: isGoldStandard
          ? '🏆 GOLD STANDARD DETECTED: Watch for Non-dilutive + Anchor revenue + Insider buy + Gap fill'
          : `🔍 ANALYZE: ${pivotType.toUpperCase()} PIVOT - Check 4 signals to estimate reversal probability`,
        pivotSignals: signals
      });
    }
  }

  // ========== TUTORIAL HINT ==========
  function getTutorialHint(newsItem, stock) {
    if (!newsItem.isStrategicPivot) return null;

    const pivotType = newsItem.pivotType;
    const phase = newsItem.pivotPhase;
    const signals = newsItem.pivotSignals || {};
    const reversalProb = newsItem.reversalProbability || 0.5;

    const typeDescriptions = {
      [CONSTANTS.PIVOT_TYPES.REACTIVE]: '🔴 REACTIVE PIVOT (Dying Firm)',
      [CONSTANTS.PIVOT_TYPES.STRUCTURAL]: '🟠 STRUCTURAL PIVOT (Real Change)',
      [CONSTANTS.PIVOT_TYPES.SYMBOLIC]: '🟡 SYMBOLIC PIVOT (Hype-Based)',
      [CONSTANTS.PIVOT_TYPES.GOLD_STANDARD]: '🏆 GOLD STANDARD (All Signals Aligned)'
    };

    const tutorial = {
      type: typeDescriptions[pivotType] || '🟡 STRATEGIC PIVOT',
      description: pivotType === CONSTANTS.PIVOT_TYPES.GOLD_STANDARD
        ? 'All 4 Gold Standard signals present - highest probability reversal.'
        : pivotType === CONSTANTS.PIVOT_TYPES.SYMBOLIC
          ? 'Symbolic/hype-based pivot with no real capital commitment.'
          : pivotType === CONSTANTS.PIVOT_TYPES.REACTIVE
            ? 'Desperate pivot by dying firm - very low reversal probability.'
            : 'Real structural change with capital commitment - slow recovery if any.',
      implication: `${Math.round(reversalProb * 100)}% reversal probability based on signals.`,
      action: pivotType === CONSTANTS.PIVOT_TYPES.GOLD_STANDARD
        ? '📈 BUY after confirmation (Day 2-3). Target: full recovery in 10-14 days.'
        : pivotType === CONSTANTS.PIVOT_TYPES.SYMBOLIC
          ? '📈 Consider buying after Execution Void begins. 65% reversal in 2-3 weeks.'
          : '⛔ DO NOT BUY - low probability setup.'
    };

    // Signal breakdown
    tutorial.signals = [
      `Non-Dilutive: ${signals.nonDilutive?.isMet ? '✓' : '✗'} ${signals.nonDilutive?.description || 'Unknown'}`,
      `Anchor Revenue: ${signals.anchorRevenue?.isMet ? '✓' : '✗'} ${signals.anchorRevenue?.description || 'Unknown'}`,
      `Insider Buy: ${signals.insiderBuy?.isMet ? '✓' : '✗'} ${signals.insiderBuy?.description || 'Unknown'}`,
      `Gap Fill: ${signals.gapFill?.isMet ? '✓' : '✗'} ${signals.gapFill?.description || 'Unknown'}`
    ];

    // Phase-specific guidance
    if (phase === 'announcement') {
      tutorial.timing = pivotType === CONSTANTS.PIVOT_TYPES.GOLD_STANDARD
        ? '📥 ENTRY ZONE: Insider buying detected. Consider buying now.'
        : '⏳ WAIT: Monitor for more signals before entering.';
    } else if (phase === 'execution_void' || phase === 'execution_void_mid') {
      tutorial.timing = reversalProb >= 0.60
        ? '📥 ENTRY ZONE: Execution Void in progress. Good entry point.'
        : '⚠️ CAUTION: Low probability setup. Consider skipping.';
    } else if (phase === 'resolution' || phase === 'reversal_complete') {
      tutorial.timing = stock?.pivotWillReverse
        ? '📤 EXIT ZONE: Take profits as reversal completes.'
        : '📉 No reversal - stay away.';
    }

    // NLP Hint
    tutorial.nlpHint = '📰 PIVOT LANGUAGE FILTER (Kogan 2023): ' +
      'BUZZWORDS (Symbolic): "AI-First," "Synergies," "Transformation," "Platform" = Higher reversal. ' +
      'TECHNICAL (Structural): "Divestiture," "Write-down," "$XM credit facility" = Lower reversal. ' +
      'The #1 signal is INSIDER BUYING within 48 hours - if they\'re buying, it\'s additive.';

    return tutorial;
  }

  // ========== DETAILED TRADING HINT ==========
  function getDetailedHint(newsItem, stock) {
    if (!newsItem.isStrategicPivot) return null;

    const pivotType = newsItem.pivotType;
    const signals = newsItem.pivotSignals || {};
    const reversalProb = newsItem.reversalProbability || 0.5;
    const isGoldStandard = pivotType === CONSTANTS.PIVOT_TYPES.GOLD_STANDARD;

    return {
      telltales: isGoldStandard ? [
        '📰 Headline uses buzzwords without specific dollar amounts',
        '💰 No share issuance or debt increase announced (Non-Dilutive)',
        '📈 Old business revenue stable or growing (Anchor Revenue)',
        '👔 2+ insiders (CEO/CFO) buying within 48 hours',
        '📊 Gap down but closes in upper 25% on high volume (Absorption)'
      ] : [
        '📰 Analyze headline for buzzwords vs technical metrics',
        '💰 Check for share issuance or debt announcements',
        '📈 Verify old business revenue trend',
        '👔 Monitor Form 4 filings for insider activity',
        '📊 Watch Day 1 close position and volume'
      ],
      timeline: {
        total: isGoldStandard ? '10-14 days' : '14-21 days',
        phases: [
          'Days 1-2: Announcement drop (-5% to -10% "Pivot Penalty")',
          'Days 3-14: Execution Void (no news, short covering)',
          `Days 15+: Resolution (${reversalProb >= 0.6 ? 'reversal' : 'new base'})`
        ],
        optimalEntry: isGoldStandard ? 'Day 1-2 (insider buying confirms)' : 'Days 3-5 (after stabilization)',
        optimalExit: isGoldStandard ? 'Days 10-14 (pre-announcement level)' : 'Days 15-21'
      },
      priceTargets: reversalProb >= 0.6 ? {
        entryZone: [0.90, 0.95],
        exitZone: [0.98, 1.02],
        stopLoss: 0.85
      } : null,
      strategy: isGoldStandard ? [
        '1. Confirm all 4 Gold Standard signals present',
        '2. Enter after insider buying confirmed (Day 1-2)',
        '3. Hold through Execution Void',
        '4. Exit at pre-announcement levels (Days 10-14)',
        '5. Stop loss at 15% below entry'
      ] : [
        '1. Count how many of 4 signals are present',
        '2. More signals = higher probability',
        '3. Insider buying is the most powerful signal',
        '4. Wait for Execution Void to begin before entering',
        '5. Be prepared for longer timeline (2-3 weeks)'
      ],
      stockContext: {
        phase: newsItem.pivotPhase,
        daysRemaining: stock?.pivotDaysLeft || 'Unknown',
        reversalProbability: `${Math.round(reversalProb * 100)}%`,
        signalsMet: signals.goldSignalsMet || 0
      },
      riskLevel: isGoldStandard ? 'MEDIUM' : (reversalProb >= 0.5 ? 'MEDIUM-HIGH' : 'HIGH'),
      goldStandard: {
        title: '🏆 STRATEGIC PIVOT GOLD STANDARD (85%+ Reversal)',
        criteria: [
          '✓ Non-Dilutive: No share issuance, no debt increase',
          '✓ Anchor Revenue: Old business stable/growing',
          '✓ Insider Buy: 2+ insiders buy within 48 hours',
          '✓ Gap Fill: Closes in upper 25% on high volume'
        ],
        successRate: '85%+ reversal in 10-14 days'
      },
      probabilityTable: {
        reactive: '<10% reversal - no recovery expected',
        structural: '30% reversal - 6 month timeline',
        symbolic: '65% reversal - 2-3 weeks',
        gold_standard: '85%+ reversal - 10-14 days'
      }
    };
  }

  // ========== PUBLIC API ==========
  const StrategicPivot = {
    init,
    processStrategicPivot,
    checkStrategicPivotEvents,
    triggerStrategicPivot,
    getTutorialHint,
    getDetailedHint,
    calculateReversalProbability,
    classifyPivot,
    generatePivotSignals,
    clearPivotState,
    CONSTANTS,
    PIVOT_TYPES: CONSTANTS.PIVOT_TYPES
  };

  return StrategicPivot;
})();

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = StrategicPivot;
}
