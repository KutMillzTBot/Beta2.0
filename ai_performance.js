
/* ===============================
   KUT MILZ AI BRAIN — SESSION LEARNING CORE (FIXED v2)
   - Removes small top-right notification popups (non-destructive hide)
   - Ensures the transaction popup reads "MilzAi Alert 🔥"
   - Shows stake + payout + Win/Lose and uses dark-blue / light-gold styling
   - Minimal, defensive changes to avoid breaking other scripts
   =============================== */

const STORAGE_KEY = "KUTMILZ_AI_BRAIN_PERSISTENT_V1";
const DEFAULT_BRAIN = { meta: { version: "8.0", created: Date.now(), autosaveMs: 10000 }, session: { trades: 0, wins: 0, losses: 0 }, symbols: {}, history: [] };

function deepClone(obj){ return JSON.parse(JSON.stringify(obj)); }
function loadBrain(){ try{ const raw = localStorage.getItem(STORAGE_KEY); if(raw) return JSON.parse(raw); }catch(e){} return deepClone(DEFAULT_BRAIN); }
function saveBrain(){ try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(window.AI_BRAIN)); }catch(e){ console.warn("saveBrain failed", e); } }

window.AI_BRAIN = loadBrain();
setInterval(()=>{ try{ saveBrain(); }catch(e){} }, window.AI_BRAIN.meta.autosaveMs || 10000);

function recordTrade(symbol, result, stake = null, payout = null) {
  const resolvedSymbol = symbol || window.currentSymbol || window.activeSymbol || window.marketSymbol || window.lastSymbol || 'UNKNOWN';
  const resolvedStake = (typeof stake === 'number' && stake > 0) ? stake : (typeof window.lastStake === 'number' && window.lastStake > 0) ? window.lastStake : null;
  const resolvedPayout = (typeof payout === 'number' && payout > 0) ? payout : (typeof window.lastPayout === 'number' && window.lastPayout > 0) ? window.lastPayout : null;

  window.__LAST_TRADE__ = { symbol: resolvedSymbol, stake: resolvedStake, payout: resolvedPayout, status: result === 'win' ? 'WON' : 'LOST', closedTime: Date.now() };

  try{ window.dispatchEvent(new CustomEvent('kut:transaction', { detail: window.__LAST_TRADE__ })); }catch(e){ console.warn("dispatch kut:transaction failed", e); }

  const brain = window.AI_BRAIN || {};
  brain.session = brain.session || { trades:0, wins:0, losses:0 };
  brain.session.trades = (brain.session.trades||0) + 1;
  if (result === 'win') brain.session.wins = (brain.session.wins||0) + 1;
  else brain.session.losses = (brain.session.losses||0) + 1;
  saveBrain();
}

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
      try{ window.AI_BRAIN = JSON.parse(e.target.result); saveBrain(); try{ location.reload(); }catch(e){} }catch(inner){ console.warn("import parse failed", inner); }
    };
    r.readAsText(file);
  }catch(e){ console.warn("importBrain failed", e); }
}

function resetSession(){
  try{ window.AI_BRAIN = window.AI_BRAIN || deepClone(DEFAULT_BRAIN); window.AI_BRAIN.session = { trades:0, wins:0, losses:0 }; saveBrain(); }catch(e){ console.warn("resetSession failed", e); }
}

window.recordTrade = recordTrade;
window.exportBrain = exportBrain;
window.importBrain = importBrain;
window.resetSession = resetSession;

/* -----------------------------
   Remove small top-right notification(s) (non-destructive hide)
   This will hide small fixed elements in the top-right corner that look like badges/notifications.
   It is intentionally conservative to avoid removing legitimate UI elements.
   ----------------------------- */
(function removeTopRightBadges(){
  try{
    // helper: test if element looks like a tiny top-right badge
    function isTopRightBadge(el){
      if(!el || !(el instanceof Element)) return false;
      const style = window.getComputedStyle(el);
      if(style.position !== 'fixed') return false;
      // ensure it's near the top-right
      const top = parseFloat(style.top || style.marginTop || 0);
      const right = parseFloat(style.right || style.marginRight || 0);
      if(isNaN(top) || isNaN(right)) return false;
      if(top > 120 || right > 120) return false;
      // small size
      if(el.clientWidth > 140 || el.clientHeight > 140) return false;
      // ignore elements that look like our own bottom popup or main content
      if(el.id && (el.id.indexOf('kut-tx-popup') !== -1)) return false;
      // content heuristic: mostly short content (a badge number or small icon)
      const text = (el.textContent||'').trim();
      if(text.length === 0) return true; // icon-only -> hide
      if(text.length <= 6 && /^[0-9★☆\u2764\u2665\w\.\s]*$/.test(text)) return true;
      return false;
    }

    const candidates = Array.from(document.querySelectorAll('body *')).filter(isTopRightBadge);
    // hide them and record for potential restore
    window.__KUT_REMOVED_TOP_BADGES__ = window.__KUT_REMOVED_TOP_BADGES__ || [];
    candidates.forEach(el => {
      try{
        window.__KUT_REMOVED_TOP_BADGES__.push({ html: el.outerHTML, style: el.getAttribute('style') || null, id: el.id || null });
        el.style.display = 'none';
      }catch(e){}
    });
  }catch(e){ console.warn("removeTopRightBadges failed", e); }
})();


/* addTransactionEntry - normalized transaction entry -> dispatch event */
(function(){
  function addTransactionEntry(tx) {
    try {
      if (!tx || typeof tx !== "object") return;
      const data = {
        symbol: tx.symbol || tx.symbolName || tx.market || tx.instrument || tx.underlying || (tx.contract && tx.contract.symbol) || 'UNKNOWN',
        stake: tx.stake ?? tx.amount ?? tx.buy_price ?? tx.entry_price ?? null,
        payout: tx.payout ?? tx.profit ?? tx.payoutAmount ?? null,
        status: tx.status || (typeof (tx.payout ?? tx.profit) === "number" ? ((tx.payout ?? tx.profit) > 0 ? "WON" : "LOST") : "CLOSED"),
        note: tx.note || tx.message || '',
        closedTime: tx.closedTime || Date.now()
      };
      window.dispatchEvent(new CustomEvent("kut:transaction", { detail: data }));
    } catch (e) { console.warn("addTransactionEntry error", e); }
  }
  try{
    Object.defineProperty(window, "addTransactionEntry", { value: addTransactionEntry, writable: false, configurable: false });
  }catch(e){ window.addTransactionEntry = addTransactionEntry; }
})();




/* listener to write to tx-log (if present) and show the styled popup */

    // append to #tx-log if available (keeps existing transaction log behavior)
    try{
      const txLog = document.getElementById('tx-log');
      if(txLog){
        const time = new Date().toLocaleTimeString();
        const line = `${time} | ${e.detail.symbol || 'UNKNOWN'} | ${e.detail.status || 'CLOSED'} | ${typeof e.detail.payout === 'number' ? e.detail.payout : (e.detail.payout || '')} ${e.detail.note ? (' | ' + e.detail.note) : ''}`;
        txLog.textContent = (txLog.textContent ? txLog.textContent + "\\n" : "") + line;
        txLog.scrollTop = txLog.scrollHeight;
      }
    }catch(e){}
  }catch(err){ console.warn("kut:transaction handler error", err); }
});



// ===============================
// SINGLE TRANSACTION POPUP HANDLER (FIXED)
// ===============================
let __MILZ_POPUP_LOCK__ = false;

window.addEventListener("kut:transaction", (e) => {
  try {
    if (!e.detail || __MILZ_POPUP_LOCK__) return;
    __MILZ_POPUP_LOCK__ = true;
    renderMilzPopup(e.detail);
    setTimeout(() => { __MILZ_POPUP_LOCK__ = false; }, 300);
  } catch (err) {
    console.warn("MilzAi single popup error", err);
  }
});
