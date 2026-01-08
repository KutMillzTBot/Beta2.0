
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
window.importAIFile = function (file) {
    return window.importAIFromFile(file);
};

window.applyImportedBrain = function (data) {
  if (!data || typeof data !== "object") {
    alert("Invalid AI brain data");
    return;
  }

  // Overwrite brain safely (single brain rule)
  window.AI_BRAIN = data;
   // 🔥 REBIND LIVE STATE FROM IMPORTED BRAIN
window.AI_STATS  = data.stats  || window.AI_STATS;
window.AI_TRADES = data.trades || window.AI_TRADES;

// Optional but recommended: recalc derived metrics
if (typeof recalcAIStats === "function") {
    recalcAIStats();
}

  // Persist immediately
  localStorage.setItem("KUTMILZ_AI_BRAIN_V1", JSON.stringify(window.AI_BRAIN));

  // Force UI refresh
  if (typeof renderAIDashboard === "function") {
    renderAIDashboard(true);
  }

  console.log("AI brain imported and applied", window.AI_BRAIN);
  alert("✅ AI Brain Imported Successfully");
};


// 📥 Import handler (supports .json AND .js exports)
window.importAIFromFile = function (file) {
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
// ===============================
// AI IMPORT HANDLER (SINGLE BRAIN)
// ===============================
window.importAIFile = function (file) {
  const reader = new FileReader();

  reader.onload = function (e) {
    try {
      let data = e.target.result;

      // If JS export, extract JSON
      if (file.name.endsWith(".js")) {
        const match = data.match(/\{[\s\S]*\}/);
        if (!match) throw new Error("Invalid AI JS export");
        data = match[0];
      }

      const imported = JSON.parse(data);

      // Safety check
      if (!imported.session || !imported.meta) {
        throw new Error("Invalid AI memory format");
      }

      // OVERWRITE brain safely
      window.AI_BRAIN = imported;
      localStorage.setItem(
        "KUTMILZ_AI_BRAIN_V1",
        JSON.stringify(imported)
      );

      console.log("✅ AI BRAIN IMPORTED");
      console.log(window.AI_BRAIN);

    } catch (err) {
      console.error("❌ AI IMPORT FAILED", err);
      alert("Failed to import AI memory");
    }
  };

  reader.readAsText(file);
};
