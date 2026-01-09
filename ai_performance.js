
/* ===============================
   KUT MILZ AI BRAIN — SESSION LEARNING CORE (FIXED)
   - Syntax errors removed
   - Safe showTransactionPopup fallback added (writes to tx-log + temporary popup)
   - Exposes exportBrain/importBrain/resetSession on window
   =============================== */

const CUSTOM_ADDED_MARKETS = ['BOOM300','BOOM500','BOOM600','BOOM900','BOOM1000','CRASH300','CRASH500','CRASH600','CRASH900','CRASH1000'];
const STORAGE_KEY = "KUTMILZ_AI_BRAIN_PERSISTENT_V1";

const DEFAULT_BRAIN = {
  meta: { version: "8.0", created: Date.now(), autosaveMs: 10000 },
  session: { trades: 0, wins: 0, losses: 0 },
  symbols: {},
  history: []
};

function deepClone(obj){ return JSON.parse(JSON.stringify(obj)); }

function loadBrain(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(raw) return JSON.parse(raw);
  }catch(e){}
  return deepClone(DEFAULT_BRAIN);
}

function saveBrain(){
  try{
    localStorage.setItem(STORAGE_KEY, JSON.stringify(window.AI_BRAIN));
  }catch(e){ console.warn("saveBrain failed", e); }
}

window.AI_BRAIN = loadBrain();

setInterval(() => {
  try{ saveBrain(); }catch(e){}
}, window.AI_BRAIN.meta.autosaveMs || 10000);

/* recordTrade helper (keeps session counts) */
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
    (typeof window.lastPayout === 'number' && window.lastPayout > 0) ? window.lastPayout :
    (typeof window.profit === 'number' && window.profit > 0) ? window.profit :
    null;

  window.__LAST_TRADE__ = {
    symbol: resolvedSymbol,
    stake: resolvedStake,
    payout: resolvedPayout,
    status: result === 'win' ? 'WON' : 'LOST',
    closedTime: Date.now()
  };

  // Dispatch a standard event so UI/popups can react
  try{
    window.dispatchEvent(new CustomEvent('kut:transaction', { detail: window.__LAST_TRADE__ }));
  }catch(e){ console.warn("dispatch kut:transaction failed", e); }

  const brain = window.AI_BRAIN || {};
  brain.session = brain.session || { trades:0, wins:0, losses:0 };
  brain.session.trades = (brain.session.trades||0) + 1;
  if (result === 'win') brain.session.wins = (brain.session.wins||0) + 1;
  else brain.session.losses = (brain.session.losses||0) + 1;

  // Persist
  saveBrain();
}

/* Export / Import / Reset helpers */
function exportBrain() {
  try{
    const blob = new Blob([JSON.stringify(window.AI_BRAIN, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "kutmilz_ai_brain.json";
    a.click();
    URL.revokeObjectURL(a.href);
  }catch(e){ console.warn("exportBrain failed", e); }
}

function importBrain(file){
  try{
    const r = new FileReader();
    r.onload = e => {
      try{
        window.AI_BRAIN = JSON.parse(e.target.result);
        saveBrain();
        // Do not force reload if page logic prefers not to; reload safely if possible
        try{ location.reload(); }catch(e){}
      }catch(inner){ console.warn("import parse failed", inner); }
    };
    r.readAsText(file);
  }catch(e){ console.warn("importBrain failed", e); }
}

function resetSession(){
  try{
    window.AI_BRAIN = window.AI_BRAIN || deepClone(DEFAULT_BRAIN);
    window.AI_BRAIN.session = { trades:0, wins:0, losses:0 };
    saveBrain();
  }catch(e){ console.warn("resetSession failed", e); }
}

/* expose to window for other scripts */
window.recordTrade = recordTrade;
window.exportBrain = exportBrain;
window.importBrain = importBrain;
window.resetSession = resetSession;

console.log("[AI] Session-learning brain loaded (fixed)");

/* AUTO-FIXED: GLOBAL TRANSACTION POPUP BRIDGE */
(function () {

  function addTransactionEntry(tx) {
    try {
      if (!tx || typeof tx !== "object") return;

      const data = {
        symbol: (function(){
          if (tx.symbol) return tx.symbol;
          if (tx.symbolName) return tx.symbolName;
          if (tx.market) return tx.market;
          if (tx.instrument) return tx.instrument;
          if (tx.underlying) return tx.underlying;
          if (tx.contract && tx.contract.symbol) return tx.contract.symbol;
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
        payout: tx.payout ?? tx.profit ?? tx.payoutAmount ?? null,
        status: tx.status || (typeof (tx.payout ?? tx.profit) === "number" ? ((tx.payout ?? tx.profit) > 0 ? "WON" : "LOST") : "CLOSED"),
        durationSecs: tx.durationSecs || tx.duration || null,
        note: tx.note || tx.message || ""
      };

      // fire event for UI / popup
      window.dispatchEvent(new CustomEvent("kut:transaction", { detail: data }));

    } catch (e) {
      console.warn("addTransactionEntry error", e);
    }
  }

  // 🔒 Hard lock the function name so other scripts can safely call it
  try{
    Object.defineProperty(window, "addTransactionEntry", {
      value: addTransactionEntry,
      writable: false,
      configurable: false
    });
  }catch(e){
    // If defineProperty fails, still attach it
    window.addTransactionEntry = addTransactionEntry;
  }

})();

/* Resolve symbol helper (used by other parts) */
function resolveSymbol(tx) {
  if (!tx || typeof tx !== 'object') return 'UNKNOWN';
  if (tx.symbol) return tx.symbol;
  if (tx.symbolName) return tx.symbolName;
  if (tx.market) return tx.market;
  if (tx.instrument) return tx.instrument;
  if (tx.contract?.symbol) return tx.contract.symbol;
  if (tx.asset?.symbol) return tx.asset.symbol;
  if (tx.trade?.symbol) return tx.trade.symbol;

  const text = tx.log || tx.message || tx.description || tx.info || '';
  if (typeof text === 'string') {
    const match = text.match(/(Crash\d+|Boom\d+|R_\\d+|Volatility\\s?\\d+)/i);
    if (match) return match[1];
  }
  return 'UNKNOWN';
}

/* SHOW TRANSACTION POPUP (fallback implementation)
   - If the page already defines showTransactionPopup, we won't overwrite it.
   - Otherwise this creates a small toast-style popup and writes to #tx-log (if present).
*/
(function(){
  if (typeof window.showTransactionPopup === "function") return;

  window.showTransactionPopup = function(detail){
    try{
      const d = detail || {};
      // Append to tx-log if available
      try{
        const txLog = document.getElementById('tx-log');
        if(txLog){
          const time = new Date().toLocaleTimeString();
          const line = `${time} | ${d.symbol||d.symbolText||'UNKNOWN'} | ${d.status||'CLOSED'} | ${(typeof d.payout==='number'?d.payout:(d.payout||''))} ${d.note?(' | '+d.note):''}`;
          txLog.textContent = (txLog.textContent?txLog.textContent+"\\n":"") + line;
          // keep scroll at bottom
          txLog.scrollTop = txLog.scrollHeight;
        }
      }catch(e){}

      // Create temporary popup element
      const id = 'kut-tx-popup';
      let popup = document.getElementById(id);
      if(!popup){
        popup = document.createElement('div');
        popup.id = id;
        popup.style.position = 'fixed';
        popup.style.right = '16px';
        popup.style.bottom = '18px';
        popup.style.zIndex = 999999;
        popup.style.minWidth = '260px';
        popup.style.maxWidth = '420px';
        popup.style.background = 'linear-gradient(180deg,#081322,#0b1c2d)';
        popup.style.color = '#f5e7b2';
        popup.style.border = '1px solid rgba(245,217,140,0.18)';
        popup.style.borderRadius = '10px';
        popup.style.padding = '12px 14px';
        popup.style.boxShadow = '0 10px 30px rgba(0,0,0,0.6)';
        popup.style.fontFamily = 'Inter, system-ui, sans-serif';
        popup.style.fontSize = '13px';
        document.body.appendChild(popup);
      }

      popup.innerHTML = '<div style=\"font-weight:800;margin-bottom:6px\">Transaction</div>'
                      + '<div style=\"font-size:13px\">'
                      + '<div><b>Symbol:</b> ' + (d.symbol || 'UNKNOWN') + '</div>'
                      + '<div><b>Status:</b> ' + (d.status || 'CLOSED') + '</div>'
                      + (d.stake ? ('<div><b>Stake:</b> ' + d.stake + '</div>') : '')
                      + (d.payout ? ('<div><b>Payout:</b> ' + d.payout + '</div>') : '')
                      + (d.note ? ('<div style=\"opacity:0.9;margin-top:6px\">' + (d.note) + '</div>') : '')
                      + '</div>';

      popup.style.opacity = '1';
      popup.style.transform = 'translateY(0)';
      // Auto-hide after 6s (refresh content if new event arrives)
      if (popup._hideTimeout) clearTimeout(popup._hideTimeout);
      popup._hideTimeout = setTimeout(()=>{ try{ popup.style.opacity='0'; popup.style.transform='translateY(12px)'; }catch(e){} }, 6000);

    }catch(e){ console.warn("showTransactionPopup fallback failed", e); }
  };
})();

/* Global listener that triggers the popup (and won't error if showTransactionPopup isn't present) */
window.addEventListener("kut:transaction", (e) => {
  try{
    if (!e.detail) return;
    if (typeof window.showTransactionPopup === "function") {
      window.showTransactionPopup(e.detail);
    } else {
      console.warn("showTransactionPopup not defined (no-op)", e.detail);
    }
  }catch(err){ console.warn("kut:transaction handler error", err); }
});
