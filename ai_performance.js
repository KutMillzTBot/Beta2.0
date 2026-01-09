
/* ===============================
   KUT MILZ AI BRAIN — SESSION LEARNING CORE
   localStorage Persistent | Browser-Safe
   =============================== */


// === Added Crash/Boom symbols (you may need to adjust these to match your broker's exact symbol strings) ===
const CUSTOM_ADDED_MARKETS = ['BOOM300', 'BOOM500', 'BOOM600', 'BOOM900', 'BOOM1000', 'CRASH300', 'CRASH500', 'CRASH600', 'CRASH900', 'CRASH1000'];
const STORAGE_KEY = "KUTMILZ_AI_BRAIN_PERSISTENT_V1";

const DEFAULT_BRAIN = {
  meta: {
    version: "8.0",
    created: Date.now(),
    autosaveMs: 10000
  },
  session: {
    trades: 0,
    wins: 0,
    losses: 0
  },
  symbols: {},
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
  recordTrade(symbol, result, stake = 0, payout = 0) {

 // expose last trade globally for popup
window.__LAST_TRADE__ = {
  symbol:
    symbol ||
    window.currentSymbol ||
    window.activeSymbol ||
    window.marketSymbol ||
    'UNKNOWN',

  stake:
    stake ||
    window.lastStake ||
    window.tradeAmount ||
    window.orderAmount ||
    0,

  payout: payout || 0,
  status: result === 'win' ? 'WON' : 'LOST',
  closedTime: Date.now()
};


// notify popup listener
window.dispatchEvent(
  new CustomEvent('kut:transaction', {
    detail: window.__LAST_TRADE__
  })
);
    
    const brain = window.AI_BRAIN;
    brain.session.trades++;

    if(result === "win") brain.session.wins++;
    if(result === "loss") brain.session.losses++;

    brain.symbols[symbol] ??= { trades:0, wins:0, losses:0 };
    brain.symbols[symbol].trades++;
    if(result==="win") brain.symbols[symbol].wins++;
    if(result==="loss") brain.symbols[symbol].losses++;

    brain.history.push({
      symbol, result, stake, payout, time: Date.now()
    });

    if(brain.history.length > 200) brain.history.shift();
    saveBrain();
  },

  exportBrain(){
    const blob = new Blob([JSON.stringify(window.AI_BRAIN,null,2)], {type:"application/json"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "kutmilz_ai_brain.json";
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
    window.AI_BRAIN.session = { trades:0, wins:0, losses:0 };
    saveBrain();
  }
};

console.log("[AI] Session-learning brain loaded");



/* AUTO-FIXED: GLOBAL TRANSACTION POPUP BRIDGE */
(function () {

  function addTransactionEntry(tx) {
    try {
      if (!tx || typeof tx !== "object") return;

      const data = {
      symbol: (() => {
  if (tx.symbol) return tx.symbol;
  if (tx.symbolName) return tx.symbolName;
  if (tx.market) return tx.market;
  if (tx.instrument) return tx.instrument;
  if (tx.underlying) return tx.underlying;

  // fallback: parse from tx.log
  if (typeof tx.log === "string") {
    const parts = tx.log.split("|").map(p => p.trim());
    if (parts.length >= 2) return parts[1];
  }

  return "UNKNOWN";
})(),
        system: tx.system || "AI",
        ticks: tx.ticks ?? tx.tickCount ?? null,
       stake: tx.stake ?? tx.amount ?? tx.buy_price ?? tx.entry_price ?? null,
        payout: tx.payout ?? tx.profit ?? tx.payoutAmount ?? "",
        status: tx.status || (
          typeof tx.payout === "number"
            ? (tx.payout > 0 ? "WON" : "LOST")
            : "CLOSED"
        ),
        durationSecs: tx.durationSecs || tx.duration || null,
        note: tx.note || ""
      };

      // fire event for UI / popup
      window.dispatchEvent(
        new CustomEvent("kut:transaction", { detail: data })
      );

    } catch (e) {
      console.warn("addTransactionEntry error", e);
    }
  }

  // 🔒 HARD LOCK IT
  Object.defineProperty(window, "addTransactionEntry", {
    value: addTransactionEntry,
    writable: false,
    configurable: false
  });

})();
// GLOBAL transaction popup listener (runs once)
function resolveSymbol(tx) {
  if (!tx || typeof tx !== 'object') return 'UNKNOWN';

  // direct fields
  if (tx.symbol) return tx.symbol;
  if (tx.symbolName) return tx.symbolName;
  if (tx.market) return tx.market;
  if (tx.instrument) return tx.instrument;

  // nested objects (VERY COMMON)
  if (tx.contract?.symbol) return tx.contract.symbol;
  if (tx.asset?.symbol) return tx.asset.symbol;
  if (tx.trade?.symbol) return tx.trade.symbol;

  // parse from log / message text
  const text =
    tx.log ||
    tx.message ||
    tx.description ||
    tx.info ||
    '';

  if (typeof text === 'string') {
    // Examples it catches:
    // "CLOSED | Crash900 | WON"
    // "Symbol: Boom500"
    const match = text.match(/(Crash\d+|Boom\d+|R_\d+|Volatility\s?\d+)/i);
    if (match) return match[1];
  }

  return 'UNKNOWN';
}

window.addEventListener("kut:transaction", (e) => {
  if (!e.detail) return;

  // safety check
  if (typeof showTransactionPopup === "function") {
    showTransactionPopup(e.detail);
  } else {
    console.warn("showTransactionPopup not defined", e.detail);
  }
});
