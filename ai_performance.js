
/* ===============================
   AI PERFORMANCE – FIXED VERSION
   =============================== */

/* ---------- SAFETY HELPERS ---------- */
function safeNumber(v) {
  return (typeof v === 'number' && !isNaN(v)) ? v : null;
}

/* ---------- TRANSACTION POPUP (RESTORED) ---------- */
function showTransactionPopup(tx) {
  try {
    const msg =
      `TRADE CLOSED\n` +
      `Symbol: ${tx.symbol}\n` +
      `Stake: ${tx.stake ?? 'N/A'}\n` +
      `Payout: ${tx.payout ?? 'N/A'}\n` +
      `Result: ${tx.result}`;

    alert(msg);
  } catch (e) {
    console.warn('Popup failed:', e);
  }
}

/* ---------- TRANSACTION LOG FALLBACK ---------- */
/* This fixes: Uncaught ReferenceError: addTransactionEntry is not defined */
if (typeof window.addTransactionEntry !== 'function') {
  window.addTransactionEntry = function (tx) {
    console.log('[TX LOG]', tx);
  };
}

/* ---------- BRAIN STORAGE ---------- */
const STORAGE_KEY = 'AI_BRAIN_V2';

function loadBrain() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return {
    meta: { autosaveMs: 5000 },
    trades: []
  };
}

function saveBrain() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(window.AI_BRAIN));
}

window.AI_BRAIN = loadBrain();
setInterval(saveBrain, window.AI_BRAIN.meta.autosaveMs);

/* ---------- CORE TRADE RECORDER ---------- */
function recordTrade(symbol, result, stake = null, payout = null) {
  const resolvedSymbol =
    symbol ||
    window.currentSymbol ||
    window.activeSymbol ||
    window.marketSymbol ||
    window.lastSymbol ||
    'UNKNOWN';

  const resolvedStake =
    safeNumber(stake) ??
    safeNumber(window.lastStake) ??
    safeNumber(window.tradeAmount) ??
    safeNumber(window.orderAmount);

  const resolvedPayout =
    safeNumber(payout) ??
    safeNumber(window.lastPayout) ??
    safeNumber(window.profit);

  const tx = {
    time: Date.now(),
    symbol: resolvedSymbol,
    stake: resolvedStake,
    payout: resolvedPayout,
    result
  };

  window.AI_BRAIN.trades.push(tx);

  /* Log entry (now guaranteed not to crash) */
  window.addTransactionEntry(tx);

  /* Popup (restored) */
  showTransactionPopup(tx);
}

/* ---------- EVENT BRIDGE ---------- */
window.addEventListener('kut:transaction', (e) => {
  if (!e.detail) return;
  recordTrade(
    e.detail.symbol,
    e.detail.result,
    e.detail.stake,
    e.detail.payout
  );
});

/* ---------- EXPORTS ---------- */
window.recordTrade = recordTrade;
