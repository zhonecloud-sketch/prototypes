/**
 * Contract Verification Module for Stock Phenomena
 * 
 * This module provides runtime verification that price movements match
 * expected sentiment. It catches bugs like "BREAKS DOWN" news with +6% price.
 * 
 * Usage:
 *   1. Include this file after market.js
 *   2. Call ContractVerifier.verify(stock, news) after each day's processing
 *   3. Check ContractVerifier.getViolations() for any detected issues
 * 
 * The verifier checks two key contracts:
 *   1. NEWS-SENTIMENT CONTRACT: If news is bearish, sentimentOffset should be negative
 *   2. PHASE-SENTIMENT CONTRACT: Each phase should have sentiment in expected range
 */

const ContractVerifier = (function() {
  'use strict';
  
  // Store detected violations
  const violations = [];
  let enabled = true;
  let verboseMode = false;
  
  // ========== NEWS-SENTIMENT CONTRACTS ==========
  // Map news keywords to expected sentiment direction
  const NEWS_SENTIMENT_MAP = {
    // Strongly bearish news (sentiment should be < -0.02)
    bearish_strong: {
      keywords: ['CRASHES', 'PLUNGES', 'COLLAPSES', 'BREAKS DOWN', 'BREAKDOWN', 
                 'CAPITULATES', 'TANKS', 'CRATERS', 'DECIMATED', 'HAMMERED'],
      maxSentiment: -0.02,
      description: 'Strong bearish news should have negative sentiment'
    },
    
    // Moderately bearish news (sentiment should be < 0)
    bearish_moderate: {
      keywords: ['FALLS', 'DROPS', 'DECLINES', 'SLIPS', 'WEAKENS', 'FADES',
                 'SELLS OFF', 'UNDER PRESSURE', 'LOSES', 'RETREATS'],
      maxSentiment: 0.01,
      description: 'Bearish news should not have strong positive sentiment'
    },
    
    // Strongly bullish news (sentiment should be > 0.02)
    bullish_strong: {
      keywords: ['SURGES', 'SOARS', 'ROCKETS', 'BREAKS OUT', 'BREAKOUT',
                 'EXPLODES', 'SKYROCKETS', 'MOONS', 'BLASTS OFF'],
      minSentiment: 0.02,
      description: 'Strong bullish news should have positive sentiment'
    },
    
    // Moderately bullish news (sentiment should be > 0)
    bullish_moderate: {
      keywords: ['RISES', 'GAINS', 'CLIMBS', 'ADVANCES', 'RALLIES',
                 'RECOVERS', 'BOUNCES', 'REBOUNDS', 'STRENGTHENS'],
      minSentiment: -0.01,
      description: 'Bullish news should not have strong negative sentiment'
    }
  };
  
  // ========== PHASE-SENTIMENT CONTRACTS ==========
  // Expected sentiment ranges for each module phase
  const PHASE_CONTRACTS = {
    // Short Seller Report phases
    shortReportPhase: {
      'initial_crash':    { min: -0.25, max: -0.05, desc: 'Initial crash should be bearish' },
      'rebuttal_window':  { min: -0.15, max: 0.03,  desc: 'Rebuttal allows some recovery' },
      'base_building':    { min: -0.04, max: 0.04,  desc: 'Base building should be tight' },
      'resolution':       null // Depends on direction, handled specially
    },
    
    // Dead Cat Bounce phases
    crashPhase: {
      'crash':         { min: -0.25, max: -0.05, desc: 'Crash phase should be bearish' },
      'bounce':        { min: 0.02,  max: 0.12,  desc: 'Bounce phase should be bullish' },
      'decline':       { min: -0.15, max: -0.01, desc: 'Decline phase should be bearish' },
      'consolidation': { min: 0.00,  max: 0.04,  desc: 'Consolidation should be neutral-positive' },
      'recovery':      { min: 0.02,  max: 0.12,  desc: 'Recovery should be bullish' }
    },
    
    // Executive Change phases
    execChangePhase: {
      'announcement':  { min: -0.25, max: -0.02, desc: 'Announcement should be bearish' },
      'stabilization': { min: -0.05, max: 0.03,  desc: 'Stabilization should be neutral' },
      'honeymoon':     { min: 0.01,  max: 0.08,  desc: 'Honeymoon should be bullish' },
      'judgment':      { min: -0.05, max: 0.05,  desc: 'Judgment period is uncertain' }
    },
    
    // Strategic Pivot phases
    pivotPhase: {
      'announced':   { min: -0.25, max: -0.02, desc: 'Announcement typically bearish' },
      'skepticism':  { min: -0.10, max: 0.02,  desc: 'Skepticism phase is negative' },
      'execution':   { min: -0.05, max: 0.05,  desc: 'Execution phase varies' },
      'vindication': { min: 0.02,  max: 0.12,  desc: 'Vindication should be bullish' }
    }
  };
  
  // ========== VERIFICATION FUNCTIONS ==========
  
  /**
   * Verify news-sentiment consistency
   */
  function verifyNewsSentiment(stock, newsHeadline) {
    if (!enabled || !newsHeadline) return true;
    
    const headline = newsHeadline.toUpperCase();
    
    for (const [category, config] of Object.entries(NEWS_SENTIMENT_MAP)) {
      for (const keyword of config.keywords) {
        if (headline.includes(keyword)) {
          // Found a keyword - check sentiment
          const sentiment = stock.sentimentOffset || 0;
          
          if (config.maxSentiment !== undefined && sentiment > config.maxSentiment) {
            recordViolation({
              type: 'NEWS_SENTIMENT',
              stock: stock.symbol,
              category: category,
              keyword: keyword,
              headline: newsHeadline,
              expected: `sentiment <= ${(config.maxSentiment * 100).toFixed(1)}%`,
              actual: `sentiment = ${(sentiment * 100).toFixed(2)}%`,
              description: config.description,
              phase: detectPhase(stock)
            });
            return false;
          }
          
          if (config.minSentiment !== undefined && sentiment < config.minSentiment) {
            recordViolation({
              type: 'NEWS_SENTIMENT',
              stock: stock.symbol,
              category: category,
              keyword: keyword,
              headline: newsHeadline,
              expected: `sentiment >= ${(config.minSentiment * 100).toFixed(1)}%`,
              actual: `sentiment = ${(sentiment * 100).toFixed(2)}%`,
              description: config.description,
              phase: detectPhase(stock)
            });
            return false;
          }
        }
      }
    }
    
    return true;
  }
  
  /**
   * Verify phase-sentiment consistency
   */
  function verifyPhaseSentiment(stock) {
    if (!enabled) return true;
    
    const sentiment = stock.sentimentOffset || 0;
    
    for (const [phaseProperty, phaseMap] of Object.entries(PHASE_CONTRACTS)) {
      const currentPhase = stock[phaseProperty];
      if (!currentPhase) continue;
      
      const contract = phaseMap[currentPhase];
      if (!contract) continue; // No contract for this phase
      
      if (sentiment < contract.min || sentiment > contract.max) {
        recordViolation({
          type: 'PHASE_SENTIMENT',
          stock: stock.symbol,
          phase: currentPhase,
          phaseProperty: phaseProperty,
          expected: `${(contract.min * 100).toFixed(1)}% to ${(contract.max * 100).toFixed(1)}%`,
          actual: `${(sentiment * 100).toFixed(2)}%`,
          description: contract.desc
        });
        return false;
      }
    }
    
    return true;
  }
  
  /**
   * Full verification of stock state
   */
  function verify(stock, newsHeadline = null) {
    const newsSentimentOk = verifyNewsSentiment(stock, newsHeadline);
    const phaseSentimentOk = verifyPhaseSentiment(stock);
    
    const passed = newsSentimentOk && phaseSentimentOk;
    
    if (verboseMode && !passed) {
      console.warn(`[ContractVerifier] Violation detected for ${stock.symbol}`);
    }
    
    return passed;
  }
  
  /**
   * Verify all stocks in array
   */
  function verifyAll(stocks, todayNews = []) {
    let allPassed = true;
    
    for (const stock of stocks) {
      // Find any news for this stock
      const stockNews = todayNews.filter(n => n.stock?.symbol === stock.symbol || n.symbol === stock.symbol);
      const headline = stockNews.length > 0 ? stockNews[0].headline : null;
      
      if (!verify(stock, headline)) {
        allPassed = false;
      }
    }
    
    return allPassed;
  }
  
  // ========== HELPERS ==========
  
  function detectPhase(stock) {
    if (stock.shortReportPhase) return `SSR: ${stock.shortReportPhase}`;
    if (stock.crashPhase) return `DCB: ${stock.crashPhase}`;
    if (stock.execChangePhase) return `ExecChange: ${stock.execChangePhase}`;
    if (stock.pivotPhase) return `Pivot: ${stock.pivotPhase}`;
    return 'none';
  }
  
  function recordViolation(violation) {
    violation.timestamp = new Date().toISOString();
    violations.push(violation);
    
    if (verboseMode) {
      console.error('[ContractVerifier] VIOLATION:', violation);
    }
    
    // Optionally trigger a callback for real-time alerting
    if (typeof onViolation === 'function') {
      onViolation(violation);
    }
  }
  
  // ========== PUBLIC API ==========
  
  return {
    /**
     * Verify a single stock's contracts
     * @param {Object} stock - Stock object with sentimentOffset and phase properties
     * @param {string} [newsHeadline] - Optional news headline to check against
     * @returns {boolean} True if all contracts pass
     */
    verify: verify,
    
    /**
     * Verify all stocks
     * @param {Array} stocks - Array of stock objects
     * @param {Array} [todayNews] - Array of news items
     * @returns {boolean} True if all contracts pass
     */
    verifyAll: verifyAll,
    
    /**
     * Get all recorded violations
     * @returns {Array} Array of violation objects
     */
    getViolations: () => [...violations],
    
    /**
     * Get violations for a specific stock
     * @param {string} symbol - Stock symbol
     * @returns {Array} Array of violation objects
     */
    getViolationsFor: (symbol) => violations.filter(v => v.stock === symbol),
    
    /**
     * Clear all recorded violations
     */
    clearViolations: () => violations.length = 0,
    
    /**
     * Enable/disable verification
     * @param {boolean} state - True to enable, false to disable
     */
    setEnabled: (state) => enabled = state,
    
    /**
     * Enable/disable verbose console logging
     * @param {boolean} state - True to enable verbose mode
     */
    setVerbose: (state) => verboseMode = state,
    
    /**
     * Check if verification is enabled
     * @returns {boolean}
     */
    isEnabled: () => enabled,
    
    /**
     * Get contract definitions (read-only)
     */
    CONTRACTS: {
      NEWS_SENTIMENT: NEWS_SENTIMENT_MAP,
      PHASE_SENTIMENT: PHASE_CONTRACTS
    },
    
    /**
     * Add a custom violation callback
     * @param {Function} callback - Called with violation object when detected
     */
    onViolation: null
  };
})();

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ContractVerifier;
}
