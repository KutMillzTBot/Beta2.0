/* === Performance helpers added by optimizer (safe, non-breaking) === */
if (!window.__bot_perf_helpers_added) {
  window.__bot_perf_helpers_added = true;
  function el(id) { return el(id); }
  function qs(sel) { return qs(sel); }
  function qsa(sel) { return qsa(sel); }
  function addListenerOnce(target, type, handler, opts) { try { target.removeEventListener(type, handler); } catch(e){}; target.addEventListener(type, handler, opts); }
}


// === Ultimate AI Engine: 3-win popup & auto-stop helpers (injected) ===
(function(){
  if (window.__UAE_injected) return;
  window.__UAE_injected = true;
  window.UAE_state = { winStreak:0, lastResults:[], lastPopupShownAt:0, stopRequested:false };

  function UAE_createPopup(message, opts){
    opts = opts || {};
    var el = document.createElement('div');
    el.className = 'uae-popup';
    el.style.position = 'fixed';
    el.style.right = '20px';
    el.style.top = '80px';
    el.style.zIndex = 2147483647;
    el.style.maxWidth = '360px';
    el.style.padding = '18px 20px';
    el.style.borderRadius = '10px';
    el.style.background = opts.background || '#0b2746';
    el.style.color = opts.color || '#ffffff';
    el.style.boxShadow = '0 8px 24px rgba(3,6,23,0.6)';
    el.style.border = '2px solid ' + (opts.borderColor || '#d4af37');
    el.style.fontFamily = 'Arial, Helvetica, sans-serif';
    el.style.fontSize = '15px';
    el.style.textAlign = 'center';
    el.innerText = message || '';
    document.body.appendChild(el);
    return el;
  }

  function UAE_showTimedPopup(message){
    try {
      var el = UAE_createPopup(message, {background:'#0b2746', borderColor:'#d4af37', color:'#ffffff'});
      setTimeout(function(){ try{ el.remove(); }catch(e){} }, 10000);
      window.UAE_state.lastPopupShownAt = Date.now();
      return el;
    } catch(e){ console.error('UAE_showTimedPopup error', e); }
  }

  function UAE_attemptStopAutoTrading(){
    try {
      window.UAE_state.stopRequested = true;
      if (typeof window.disableAutoTrading === 'function') try{ window.disableAutoTrading(); }catch(e){}
      if (typeof window.stopAutoTrading === 'function') try{ window.stopAutoTrading(); }catch(e){}
      if (typeof window.toggleAutoTrading === 'function') try{ window.toggleAutoTrading(false); }catch(e){}
      if (typeof window.setAutoTrading === 'function') try{ window.setAutoTrading(false); }catch(e){}
      try { localStorage.setItem('UAE_autoStopped', '1'); } catch(e){}
      UAE_showTimedPopup('Auto-trading has been stopped by Ultimate AI Engine.');
    } catch(e){ console.error('UAE_attemptStopAutoTrading error', e); }
  }

  window.UAE_reportTradeResult = function(isWin){
    try {
      var s = window.UAE_state;
      s.lastResults.push(!!isWin);
      if (s.lastResults.length > 10) s.lastResults.shift();
      s.winStreak = !!isWin ? (s.winStreak||0)+1 : 0;
      if (s.winStreak === 3) {
        UAE_showTimedPopup('Hey 👋🏼 remember not to get greedy — you\'re on three clean wins. Lower your stake if you\'re risking more than 50-60% of your balance. Remember risk management comes first. Enjoy 😇');
      }
      if (s.winStreak >= 4 && !s.stopRequested) {
        UAE_attemptStopAutoTrading();
      }
      try { console.info('UAE: winStreak=', s.winStreak); } catch(e){}
    } catch(e){ console.error('UAE_reportTradeResult error', e); }
  };

  window.UAE_tryReportFromScope = function(){
    try {
      var isWin = false;
      var candidates = ['profit','pl','pnl','currentProfit','lastProfit','tradeProfit'];
      for (var i=0;i<candidates.length;i++){
        var n = candidates[i];
        if (typeof window[n] !== 'undefined' && window[n] !== null){
          isWin = Number(window[n]) > 0;
          window.UAE_reportTradeResult(isWin);
          return;
        }
      }
    } catch(e){ console.error('UAE_tryReportFromScope error', e); }
  };

  var style = document.createElement('style');
  style.innerHTML = '.uae-popup { transition: opacity 0.3s ease, transform 0.3s ease; }';
  document.head.appendChild(style);

})();


/* ===============================
   KUT MILZ AI BRAIN — SESSION LEARNING CORE
   localStorage Persistent | Browser-Safe
   =============================== */


// === Added Crash/Boom/Volatility symbols (matches HTML dropdown) ===
const CUSTOM_ADDED_MARKETS = [
  'R_10', 'R_25', 'R_50', 'R_75', 'R_100',
  '1HZ10V', '1HZ25V', '1HZ50V', '1HZ75V', '1HZ100V',
  'BOOM300', 'BOOM500', 'BOOM600', 'BOOM900', 'BOOM1000',
  'CRASH300', 'CRASH500', 'CRASH600', 'CRASH900', 'CRASH1000'
];
const STORAGE_KEY = "KUTMILZ_AI_BRAIN_PERSISTENT_V1";

const DEFAULT_BRAIN = {
  meta: {
    version: "9.0",
    created: Date.now(),
    autosaveMs: 5000,
    totalTrades: 0,
    totalWins: 0,
    totalLosses: 0,
    bestStreak: 0,
    currentStreak: 0,
    lastUpdate: Date.now()
  },
  session: {
    trades: 0,
    wins: 0,
    losses: 0,
    profit: 0,
    startTime: Date.now()
  },
  symbols: {}, // Enhanced symbol tracking
  hourly: {}, // Performance by hour
  daily: {}, // Performance by day
  patterns: {}, // Pattern recognition
  strategies: {}, // Strategy performance
  learning: {
    marketRankings: {}, // Best performing markets
    timePreferences: {}, // Best trading hours
    adaptiveParams: {}, // Learned optimal parameters
    mistakes: [] // Learning from errors
  },
  history: []
};

function deepClone(obj){
  return JSON.parse(JSON.stringify(obj));
}

function loadBrain(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(raw) return JSON.parse(raw);
  }catch(e){}
  return deepClone(DEFAULT_BRAIN);
}

function saveBrain(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(window.AI_BRAIN));
}

window.AI_BRAIN = loadBrain();

setInterval(saveBrain, window.AI_BRAIN.meta.autosaveMs);

window.AI = {
  // Enhanced trade recording with detailed analytics
  recordTrade({symbol, result, stake=0, payout=0, direction='', strategy='', confidence=0}){
    if(!symbol) return;

    const brain = window.AI_BRAIN;
    const now = Date.now();
    const hour = new Date(now).getHours();
    const day = new Date(now).toDateString();

    // Update global stats
    brain.meta.totalTrades++;
    if(result === "win") {
      brain.meta.totalWins++;
      brain.meta.currentStreak++;
      brain.meta.bestStreak = Math.max(brain.meta.bestStreak, brain.meta.currentStreak);
    } else {
      brain.meta.currentStreak = 0;
      brain.meta.totalLosses++;
    }

    // Session stats
    brain.session.trades++;
    if(result === "win") brain.session.wins++;
    else brain.session.losses++;
    brain.session.profit += (payout - stake);

    // Enhanced symbol tracking
    brain.symbols[symbol] ??= {
      trades:0, wins:0, losses:0, profit:0, winRate:0,
      avgStake:0, avgPayout:0, bestWin:0, worstLoss:0,
      lastTrade:0, streak:0, confidence:0
    };

    const sym = brain.symbols[symbol];
    sym.trades++;
    sym.lastTrade = now;

    if(result === "win") {
      sym.wins++;
      sym.profit += (payout - stake);
      sym.bestWin = Math.max(sym.bestWin, payout - stake);
      sym.streak++;
    } else {
      sym.losses++;
      sym.profit += (payout - stake);
      sym.worstLoss = Math.min(sym.worstLoss, payout - stake);
      sym.streak = 0;
    }

    sym.winRate = sym.wins / sym.trades;
    sym.avgStake = ((sym.avgStake * (sym.trades - 1)) + stake) / sym.trades;
    sym.confidence = confidence;

    // Hourly performance
    brain.hourly[hour] ??= {trades:0, wins:0, losses:0, profit:0};
    brain.hourly[hour].trades++;
    if(result === "win") brain.hourly[hour].wins++;
    else brain.hourly[hour].losses++;
    brain.hourly[hour].profit += (payout - stake);

    // Daily performance
    brain.daily[day] ??= {trades:0, wins:0, losses:0, profit:0};
    brain.daily[day].trades++;
    if(result === "win") brain.daily[day].wins++;
    else brain.daily[day].losses++;
    brain.daily[day].profit += (payout - stake);

    // Strategy tracking
    if(strategy) {
      brain.strategies[strategy] ??= {trades:0, wins:0, losses:0, profit:0};
      brain.strategies[strategy].trades++;
      if(result === "win") brain.strategies[strategy].wins++;
      else brain.strategies[strategy].losses++;
      brain.strategies[strategy].profit += (payout - stake);
    }

    // Pattern learning
    const pattern = this.analyzePattern(symbol, direction, result);
    if(pattern) {
      brain.patterns[pattern.key] ??= {count:0, wins:0, losses:0, profit:0};
      brain.patterns[pattern.key].count++;
      if(result === "win") brain.patterns[pattern.key].wins++;
      else brain.patterns[pattern.key].losses++;
      brain.patterns[pattern.key].profit += (payout - stake);
    }

    // Learning from mistakes
    if(result === "loss") {
      brain.learning.mistakes.push({
        symbol, direction, stake, strategy, confidence,
        time: now, reason: this.analyzeMistake(symbol, direction, confidence)
      });
      if(brain.learning.mistakes.length > 50) brain.learning.mistakes.shift();
    }

    // Update rankings
    this.updateMarketRankings();

    brain.history.push({
      symbol, result, stake, payout, direction, strategy, confidence, time: now
    });

    if(brain.history.length > 500) brain.history.shift();

    brain.meta.lastUpdate = now;
    saveBrain();

    console.log(`[AI LEARN] ${symbol}: ${result.toUpperCase()} | WinRate: ${(sym.winRate*100).toFixed(1)}% | Streak: ${sym.streak}`);
  },

  // Analyze trading patterns
  analyzePattern(symbol, direction, result) {
    // Simple pattern recognition based on recent trades
    const recent = window.AI_BRAIN.history.slice(-10);
    const symbolTrades = recent.filter(t => t.symbol === symbol);

    if(symbolTrades.length >= 3) {
      const last3 = symbolTrades.slice(-3).map(t => t.result);
      const pattern = last3.join('-');

      return {
        key: `${symbol}_${direction}_${pattern}`,
        confidence: result === 'win' ? 0.7 : 0.3
      };
    }
    return null;
  },

  // Analyze why a trade was a loss
  analyzeMistake(symbol, direction, confidence) {
    const reasons = [];

    if(confidence < 30) reasons.push('Low Confidence');
    if(window.AI_BRAIN.symbols[symbol]?.winRate < 0.4) reasons.push('Poor Symbol Performance');
    if(window.AI_BRAIN.hourly[new Date().getHours()]?.winRate < 0.4) reasons.push('Bad Trading Hour');

    return reasons.length > 0 ? reasons.join(', ') : 'Unknown';
  },

  // Update market performance rankings
  updateMarketRankings() {
    const rankings = {};
    Object.keys(window.AI_BRAIN.symbols).forEach(symbol => {
      const sym = window.AI_BRAIN.symbols[symbol];
      if(sym.trades >= 5) { // Minimum trades for ranking
        rankings[symbol] = {
          winRate: sym.winRate,
          profit: sym.profit,
          trades: sym.trades,
          score: (sym.winRate * 0.6) + (Math.min(sym.profit / sym.trades, 1) * 0.4)
        };
      }
    });

    // Sort by score
    window.AI_BRAIN.learning.marketRankings = Object.fromEntries(
      Object.entries(rankings).sort(([,a], [,b]) => b.score - a.score)
    );
  },

  // Get best markets for MILZXAI
  getBestMarkets(limit = 5) {
    const rankings = Object.keys(window.AI_BRAIN.learning.marketRankings);
    return rankings.slice(0, limit);
  },

  // Get best trading hours
  getBestHours(limit = 3) {
    const hourStats = Object.entries(window.AI_BRAIN.hourly)
      .filter(([,stats]) => stats.trades >= 3)
      .sort(([,a], [,b]) => (b.wins/b.trades) - (a.wins/a.trades));

    return hourStats.slice(0, limit).map(([hour]) => parseInt(hour));
  },

  // Adaptive parameter suggestions
  getAdaptiveParams(symbol) {
    const sym = window.AI_BRAIN.symbols[symbol];
    if(!sym || sym.trades < 10) return null;

    return {
      suggestedStake: Math.max(0.35, sym.avgStake * (sym.winRate > 0.6 ? 1.2 : 0.8)),
      confidence: sym.winRate,
      recommended: sym.winRate > 0.55
    };
  },

  // Dynamic stake scaling based on performance
  getDynamicStake(baseStake, symbol) {
    const brain = window.AI_BRAIN;
    const recent = brain.history.slice(-10);
    const recentWinRate = recent.filter(t => t.result === 'win').length / recent.length;

    let multiplier = 1.0;

    // Scale down after losses
    if(recentWinRate < 0.4) multiplier *= 0.7;
    else if(recentWinRate > 0.7) multiplier *= 1.3;

    // Symbol-specific adjustment
    const sym = brain.symbols[symbol];
    if(sym && sym.trades > 5) {
      if(sym.winRate < 0.45) multiplier *= 0.8;
      else if(sym.winRate > 0.65) multiplier *= 1.2;
    }

    // Volatility adjustment (simplified)
    const volatility = this.getMarketVolatility(symbol);
    if(volatility > 0.02) multiplier *= 0.9; // Reduce in volatile markets

    return Math.max(0.35, Math.min(baseStake * multiplier, baseStake * 2));
  },

  // Market sentiment analysis
  getMarketSentiment(symbol) {
    // Simplified sentiment based on recent price action
    const candles = window.appState?.chart?.closedCandles || [];
    if(candles.length < 20) return { trend: 'neutral', strength: 0.5 };

    const recent = candles.slice(-20);
    const prices = recent.map(c => c.close);
    const sma20 = prices.reduce((a,b) => a+b, 0) / prices.length;
    const current = prices[prices.length - 1];
    const prev = prices[prices.length - 2];

    let trend = 'neutral';
    if(current > sma20 * 1.005) trend = 'bullish';
    else if(current < sma20 * 0.995) trend = 'bearish';

    const strength = Math.min(1, Math.abs(current - sma20) / sma20);

    return { trend, strength, sma20 };
  },

  // RSI calculation
  calculateRSI(prices, period = 14) {
    if(prices.length < period + 1) return 50;

    let gains = 0, losses = 0;
    for(let i = 1; i <= period; i++) {
      const change = prices[i] - prices[i-1];
      if(change > 0) gains += change;
      else losses -= change;
    }

    let avgGain = gains / period;
    let avgLoss = losses / period;
    let rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  },

  // Get market volatility
  getMarketVolatility(symbol) {
    const candles = window.appState?.chart?.closedCandles || [];
    if(candles.length < 10) return 0.01;

    const prices = candles.slice(-10).map(c => c.close);
    const mean = prices.reduce((a,b) => a+b, 0) / prices.length;
    const variance = prices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / prices.length;
    return Math.sqrt(variance) / mean;
  },

  // Enhanced exit strategies
  getExitStrategy(symbol, entryPrice, direction) {
    const sentiment = this.getMarketSentiment(symbol);
    const volatility = this.getMarketVolatility(symbol);

    return {
      trailingStop: volatility > 0.015 ? 0.5 : 0.3, // percentage
      partialExit: sentiment.strength > 0.7 ? 0.5 : 0, // close 50% at target if strong trend
      timeBasedExit: 300, // seconds
      breakEvenStop: true
    };
  },

  // News/event filter
  shouldPauseForNews() {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();

    // Pause during major news hours (simplified)
    if(hour >= 13 && hour <= 15) return true; // 1-3 PM UTC often has news
    if(day === 0 || day === 6) return true; // Weekends

    return false;
  },

  // Correlation-based trading
  getCorrelatedMarkets(symbol) {
    const correlations = {
      'R_10': ['R_25', 'R_50'],
      'BTCUSD': ['ETHUSD', 'LTCUSD'],
      'BOOM1000': ['CRASH1000', 'R_100']
    };
    return correlations[symbol] || [];
  },

  // Time-based trading windows
  isOptimalTradingTime(symbol) {
    const now = new Date();
    const hour = now.getHours();
    const utcHour = now.getUTCHours();

    // London/NY overlap: 13:00-16:00 UTC
    const isOverlap = utcHour >= 13 && utcHour <= 16;

    // Symbol-specific optimal times
    const symbolTimes = {
      'R_10': [8, 16], // Morning to afternoon
      'BTCUSD': [0, 23], // 24/7 but better at night
      'BOOM1000': [10, 18]
    };

    const optimal = symbolTimes[symbol] || [9, 17];
    const inOptimal = hour >= optimal[0] && hour <= optimal[1];

    return isOverlap && inOptimal;
  },

  // Risk multiplier system
  getRiskMultiplier(symbol) {
    const brain = window.AI_BRAIN;
    const recent = brain.history.slice(-5);
    const recentLosses = recent.filter(t => t.result === 'loss').length;

    let multiplier = 1.0;

    if(recentLosses >= 3) multiplier *= 0.5; // Reduce risk after 3 losses
    else if(recentLosses === 0 && recent.length >= 3) multiplier *= 1.5; // Increase after wins

    // Symbol risk
    const sym = brain.symbols[symbol];
    if(sym && sym.winRate < 0.4) multiplier *= 0.7;

    return Math.max(0.3, Math.min(multiplier, 2.0));
  },

  // Performance analytics
  getAnalytics() {
    const brain = window.AI_BRAIN;
    const totalTrades = brain.meta.totalTrades;
    const winRate = totalTrades > 0 ? (brain.meta.totalWins / totalTrades) * 100 : 0;

    return {
      overall: {
        trades: totalTrades,
        winRate: winRate.toFixed(1) + '%',
        bestStreak: brain.meta.bestStreak,
        totalProfit: Object.values(brain.symbols).reduce((sum, sym) => sum + sym.profit, 0).toFixed(2)
      },
      topMarkets: Object.entries(brain.learning.marketRankings).slice(0, 5),
      bestHours: this.getBestHours(),
      recentMistakes: brain.learning.mistakes.slice(-3)
    };
  },

  // Learning insights
  getInsights() {
    const insights = [];

    // Best performing markets
    const topMarkets = this.getBestMarkets(3);
    if(topMarkets.length > 0) {
      insights.push(`🎯 Top Markets: ${topMarkets.join(', ')}`);
    }

    // Best trading hours
    const bestHours = this.getBestHours(2);
    if(bestHours.length > 0) {
      insights.push(`⏰ Best Hours: ${bestHours.join(':00, ')}:00`);
    }

    // Performance trends
    const recent = window.AI_BRAIN.history.slice(-20);
    const recentWinRate = recent.filter(t => t.result === 'win').length / recent.length;
    if(recentWinRate > 0.6) {
      insights.push('📈 Hot Streak! Performance improving');
    } else if(recentWinRate < 0.4) {
      insights.push('📉 Cool Down: Consider adjusting strategy');
    }

    // Learning from mistakes
    const recentMistakes = window.AI_BRAIN.learning.mistakes.slice(-5);
    if(recentMistakes.length >= 3) {
      const commonReasons = {};
      recentMistakes.forEach(m => {
        if(m.reason) m.reason.split(', ').forEach(r => commonReasons[r] = (commonReasons[r] || 0) + 1);
      });
      const topReason = Object.entries(commonReasons).sort(([,a], [,b]) => b - a)[0];
      if(topReason) {
        insights.push(`💡 Learning: ${topReason[0]} (occured ${topReason[1]} times)`);
      }
    }

    return insights;
  },

  exportBrain(){
    const blob = new Blob([JSON.stringify(window.AI_BRAIN,null,2)], {type:"application/json"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "kutmilz_ai_brain_advanced.json";
    a.click();
  },

  importBrain(file){
    const r = new FileReader();
    r.onload = e => {
      window.AI_BRAIN = JSON.parse(e.target.result);
      saveBrain();
      location.reload();
    };
    r.readAsText(file);
  },

  resetSession(){
    window.AI_BRAIN.session = { trades:0, wins:0, losses:0, profit:0, startTime: Date.now() };
    saveBrain();
  },

  resetAll(){
    window.AI_BRAIN = deepClone(DEFAULT_BRAIN);
    saveBrain();
    location.reload();
  }
};

console.log("[AI] Session-learning brain loaded");
