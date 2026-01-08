
/* ===============================
   KUT MILZ AI BRAIN — SESSION LEARNING CORE
   localStorage Persistent | Browser-Safe
   =============================== */

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
  recordTrade({symbol, result, stake=0, payout=0}){
    if(!symbol) return;

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



// === AI DASHBOARD RENDERER ===
function renderAIDashboard(){
  if(!window.AI_BRAIN) return;

  const b = window.AI_BRAIN;
  const t = b.session.trades || 0;
  const w = b.session.wins || 0;
  const l = b.session.losses || 0;
  const rate = t ? ((w/t)*100).toFixed(1) : 0;

  document.getElementById("ai-trades").textContent = t;
  document.getElementById("ai-wins").textContent = w;
  document.getElementById("ai-losses").textContent = l;
  document.getElementById("ai-winrate").textContent = rate + "%";

  let top = "-";
  let best = 0;
  for(const s in b.symbols){
    const sym = b.symbols[s];
    if(sym.wins > best){
      best = sym.wins;
      top = s;
    }
  }
  document.getElementById("ai-top-symbol").textContent = top;
}

setInterval(renderAIDashboard, 1000);
document.addEventListener("DOMContentLoaded", renderAIDashboard);



/* =========================================
   ADVANCED AI EXTENSIONS (SAFE ADDITIVE)
   - Stake scaling helper
   - Time-of-day performance tracking
   - Confidence alerts
========================================= */

// --- TIME BUCKET HELPERS ---
function getHourBucket(){
  return new Date().getHours(); // 0–23
}

// Extend recordTrade safely
const _origRecord = window.AI.recordTrade;
window.AI.recordTrade = function(data){
  const hour = getHourBucket();
  window.AI_BRAIN.timeStats ??= {};
  window.AI_BRAIN.timeStats[hour] ??= { trades:0, wins:0, losses:0 };

  window.AI_BRAIN.timeStats[hour].trades++;
  if(data.result === "win") window.AI_BRAIN.timeStats[hour].wins++;
  if(data.result === "loss") window.AI_BRAIN.timeStats[hour].losses++;

  _origRecord.call(this, data);

// 🔥 Notify dashboard + alerts
document.dispatchEvent(new CustomEvent("AI_TRADE", { detail: data }));
if (typeof renderAIDashboard === "function") {
  renderAIDashboard();
}

};

// --- STAKE SCALING (READ-ONLY RECOMMENDATION) ---
window.AI.getStakeMultiplier = function(){
  const b = window.AI_BRAIN.session;
  if(!b.trades) return 1;

  const winRate = b.wins / b.trades;

  if(winRate >= 0.65) return 1.5;
  if(winRate >= 0.55) return 1.2;
  if(winRate >= 0.45) return 1.0;
  if(winRate >= 0.35) return 0.7;
  return 0.5;
};

// --- CONFIDENCE ALERTS ---
let lastAlert = "";
function fireAlert(msg){
  if(lastAlert === msg) return;
  lastAlert = msg;

  const note = document.createElement("div");
  note.textContent = msg;
  note.style.cssText = `
    position:fixed;
    top:20px;
    right:20px;
    background:#222;
    color:#fff;
    padding:10px 14px;
    border-radius:8px;
    box-shadow:0 8px 20px rgba(0,0,0,.5);
    z-index:10000;
    font-size:13px;
  `;
  document.body.appendChild(note);
  setTimeout(()=>note.remove(), 4000);
}

// Check confidence every trade
document.addEventListener("AI_TRADE", ()=>{
  const s = window.AI_BRAIN.session;
  if(s.trades < 5) return;

  const rate = s.wins / s.trades;

  if(rate >= 0.7) fireAlert("🔥 AI Confidence HIGH — favorable conditions");
  if(rate <= 0.3) fireAlert("⚠️ AI Confidence LOW — consider pausing");
});
