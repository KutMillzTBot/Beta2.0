
/* ===============================
   KUT MILZ — ULTIMATE AI ENGINE (SINGLE BRAIN)
================================ */

const STORAGE_KEY = "KUTMILZ_AI_BRAIN_V1";

const DEFAULT_BRAIN = {
  meta: { version: "ULTIMATE-1.0", created: Date.now() },
  session: { trades: 0, wins: 0, losses: 0 },
  symbols: {},
  history: []
};

function clone(o){ return JSON.parse(JSON.stringify(o)); }

function loadBrain(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(raw) return JSON.parse(raw);
  }catch(e){}
  return clone(DEFAULT_BRAIN);
}

function saveBrain(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(window.AI_BRAIN));
}

window.AI_BRAIN = loadBrain();
// 🔁 Apply imported AI brain safely
window.applyImportedBrain = function (data) {
  if (!data || typeof data !== "object") {
    console.warn("Invalid AI import data");
    return;
  }

  window.AI_BRAIN = data;
  saveBrain();

  console.log("AI brain imported and applied", window.AI_BRAIN);
};

// 📥 Import handler (supports .json AND .js exports)
window.importAIFile = function (file) {
  const reader = new FileReader();

  reader.onload = () => {
    try {
      let content = reader.result;

      // Handle JS exports (ai_performance.js)
      if (file.name.endsWith(".js")) {
        const match = content.match(/=\s*(\{[\s\S]*\});?/);
        if (!match) throw new Error("Invalid JS AI export format");
        content = match[1];
      }

      const data = JSON.parse(content);
      window.applyImportedBrain(data);

    } catch (e) {
      console.error("AI import failed:", e);
    }
  };

  reader.readAsText(file);
};


window.ULTIMATE_AI_ENGINE = {
  recordTrade({ symbol="UNKNOWN", result }){
    const b = window.AI_BRAIN;
    b.session.trades++;
    if(result === "win") b.session.wins++;
    if(result === "loss") b.session.losses++;

    b.symbols[symbol] ??= { trades:0, wins:0, losses:0 };
    b.symbols[symbol].trades++;
    if(result === "win") b.symbols[symbol].wins++;
    if(result === "loss") b.symbols[symbol].losses++;

    b.history.push({ symbol, result, time: Date.now() });
    if(b.history.length > 300) b.history.shift();

    saveBrain();
    renderAIDashboard();
  },

  importPerformance(file){
    const r = new FileReader();
    r.onload = e => {
      window.AI_BRAIN = JSON.parse(e.target.result);
      saveBrain();
      renderAIDashboard();
    };
    r.readAsText(file);
  },

  exportBrain(){
    const blob = new Blob([JSON.stringify(window.AI_BRAIN,null,2)],{type:"application/json"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "kutmilz_ai_brain.json";
    a.click();
  }
};

function renderAIDashboard(){
  const b = window.AI_BRAIN;
  if(!b) return;
  const t=b.session.trades, w=b.session.wins, l=b.session.losses;
  const rate = t?((w/t)*100).toFixed(1):"0.0";

  const set=(id,val)=>{
    const el=document.getElementById(id);
    if(el) el.textContent=val;
  };

  set("ai-trades",t);
  set("ai-wins",w);
  set("ai-losses",l);
  set("ai-winrate",rate+"%");

  let top="-", best=0;
  for(const s in b.symbols){
    if(b.symbols[s].wins>best){ best=b.symbols[s].wins; top=s; }
  }
  set("ai-top-symbol",top);
}

setInterval(renderAIDashboard,1000);
document.addEventListener("DOMContentLoaded",renderAIDashboard);

console.log("[ULTIMATE AI ENGINE] Active — one brain only");
