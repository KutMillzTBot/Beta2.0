
/* ================================
   AI PERFORMANCE – FIXED & READY
   ================================ */

/* SAFETY: ensure transaction logger exists */
if (typeof window.addTransactionEntry !== 'function') {
  window.addTransactionEntry = function(entry) {
    try {
      if (!window.AI_BRAIN) return;
      if (!window.AI_BRAIN.transactions) {
        window.AI_BRAIN.transactions = [];
      }
      window.AI_BRAIN.transactions.push({
        ...entry,
        timestamp: entry.timestamp || Date.now()
      });
    } catch (e) {
      console.warn('Transaction log fallback used:', e);
    }
  };
}

/* STORAGE */
const STORAGE_KEY = 'AI_BRAIN_V2';

/* DEFAULT BRAIN */
const DEFAULT_BRAIN = {
  meta: {
    autosaveMs: 5000
  },
  transactions: []
};

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function loadBrain() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return deepClone(DEFAULT_BRAIN);
}

function saveBrain() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(window.AI_BRAIN));
}

/* INIT */
window.AI_BRAIN = loadBrain();
setInterval(saveBrain, window.AI_BRAIN.meta.autosaveMs);

/* ================================
   TRADE RECORDER (SAFE)
   ================================ */
function recordTrade(symbol, result, stake = null, payout = null) {

  const resolvedSymbol =
    symbol ||
    window.currentSymbol ||
    window.activeSymbol ||
    window.marketSymbol ||
    window.lastSymbol ||
    'UNKNOWN';

  const resolvedStake =
    (typeof stake === 'number' && stake > 0) ? stake :
    (typeof window.lastStake === 'number' && window.lastStake > 0) ? window.lastStake :
    (typeof window.tradeAmount === 'number' && window.tradeAmount > 0) ? window.tradeAmount :
    (typeof window.orderAmount === 'number' && window.orderAmount > 0) ? window.orderAmount :
    null;

  const resolvedPayout =
    (typeof payout === 'number' && payout > 0) ? payout :
    window.lastPayout ||
    window.profit ||
    null;

  const entry = {
    symbol: resolvedSymbol,
    result,
    stake: resolvedStake,
    payout: resolvedPayout,
    time: new Date().toISOString()
  };

  addTransactionEntry(entry);
}

/* EXPOSE */
window.recordTrade = recordTrade;

console.log('AI Performance module loaded (FIXED).');
