/* ===============================
   KUT MILZ AI BRAIN — SESSION LEARNING CORE
   =============================== */

const STORAGE_KEY = "KUTMILZ_AI_BRAIN_PERSISTENT_V1";

const DEFAULT_BRAIN = {
  meta: { version: "8.0", created: Date.now(), autosaveMs: 10000 },
  session: { trades: 0, wins: 0, losses: 0 },
  symbols: {},
  history: []
};

function loadBrain(){
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return JSON.parse(JSON.stringify(DEFAULT_BRAIN));
}

function saveBrain(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(window.AI_BRAIN));
}

window.AI_BRAIN = loadBrain();
setInterval(saveBrain, window.AI_BRAIN.meta.autosaveMs);

function recordTrade(symbol, result, stake = null, payout = null) {

  const resolvedSymbol =
    symbol ||
    window.currentSymbol ||
    window.activeSymbol ||
    window.marketSymbol ||
    window.lastSymbol ||
    "UNKNOWN";

  const resolvedStake =
    (typeof stake === "number" && stake > 0) ? stake :
    (typeof window.lastStake === "number" && window.lastStake > 0) ? window.lastStake :
    (typeof window.tradeAmount === "number" && window.tradeAmount > 0) ? window.tradeAmount :
    (typeof window.orderAmount === "number" && window.orderAmount > 0) ? window.orderAmount :
    null;

  const resolvedPayout =
    (typeof payout === "number" && payout > 0) ? payout :
    window.lastPayout ||
    window.profit ||
    null;

  const trade = {
    symbol: resolvedSymbol,
    stake: resolvedStake,
    payout: resolvedPayout,
    status: result === "win" ? "WON" : "LOST",
    time: Date.now()
  };

  window.__LAST_TRADE__ = trade;

  window.dispatchEvent(new CustomEvent("kut:transaction", { detail: trade }));

  window.AI_BRAIN.session.trades++;
  if (result === "win") window.AI_BRAIN.session.wins++;
  else window.AI_BRAIN.session.losses++;
}

function exportBrain(){
  const blob = new Blob([JSON.stringify(window.AI_BRAIN, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "kutmilz_ai_brain.json";
  a.click();
}

function importBrain(file){
  const r = new FileReader();
  r.onload = e => {
    window.AI_BRAIN = JSON.parse(e.target.result);
    saveBrain();
    location.reload();
  };
  r.readAsText(file);
}

function resetSession(){
  window.AI_BRAIN.session = { trades: 0, wins: 0, losses: 0 };
  saveBrain();
}

window.exportBrain = exportBrain;
window.importBrain = importBrain;
window.resetSession = resetSession;

console.log("[AI] Brain loaded — no syntax errors");
