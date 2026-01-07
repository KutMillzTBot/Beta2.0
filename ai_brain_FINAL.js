/* ===============================
   KUT MILZ AI BRAIN – FINAL
   =============================== */

/* ---------- STORAGE HELPERS ---------- */
const AI_STORAGE_KEY = "KUT_MILZ_AI_BRAIN";

function loadBrain() {
  try {
    const raw = localStorage.getItem(AI_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.warn("AI brain load failed, resetting.");
    return null;
  }
}

function saveBrain() {
  localStorage.setItem(AI_STORAGE_KEY, JSON.stringify(AI_BRAIN));
}

/* ---------- DEFAULT BRAIN ---------- */
const DEFAULT_BRAIN = {
  stats: {
    wins: 0,
    losses: 0,
    trades: 0
  },
  symbols: {},
  rr: {
    enabled: false,
    index: 0,
    list: []
  },
  confidence: 0,
  lastUpdate: Date.now()
};

/* ---------- INIT ---------- */
const AI_BRAIN = loadBrain() || structuredClone(DEFAULT_BRAIN);
saveBrain();

console.log("AI BRAIN LOADED", AI_BRAIN);

/* ---------- CORE LOGIC ---------- */
function recalcConfidence() {
  if (AI_BRAIN.stats.trades === 0) {
    AI_BRAIN.confidence = 0;
  } else {
    AI_BRAIN.confidence = Math.round(
      (AI_BRAIN.stats.wins / AI_BRAIN.stats.trades) * 100
    );
  }
}

function ensureSymbol(symbol) {
  if (!AI_BRAIN.symbols[symbol]) {
    AI_BRAIN.symbols[symbol] = {
      wins: 0,
      losses: 0,
      trades: 0,
      confidence: 0
    };
  }
}

/* ---------- PUBLIC API ---------- */
window.AI = {
  recordTrade(win, symbol = "UNKNOWN") {
    ensureSymbol(symbol);

    AI_BRAIN.stats.trades++;
    AI_BRAIN.symbols[symbol].trades++;

    if (win) {
      AI_BRAIN.stats.wins++;
      AI_BRAIN.symbols[symbol].wins++;
    } else {
      AI_BRAIN.stats.losses++;
      AI_BRAIN.symbols[symbol].losses++;
    }

    const s = AI_BRAIN.symbols[symbol];
    s.confidence = Math.round((s.wins / s.trades) * 100);

    recalcConfidence();
    AI_BRAIN.lastUpdate = Date.now();
    saveBrain();

    console.log("AI LEARNED:", { win, symbol, confidence: s.confidence });
  },

  exportBrain() {
    const blob = new Blob(
      [JSON.stringify(AI_BRAIN, null, 2)],
      { type: "application/json" }
    );
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "kut_milz_ai_brain.json";
    a.click();
    URL.revokeObjectURL(a.href);
  },

  importBrain(json) {
    try {
      Object.assign(AI_BRAIN, json);
      saveBrain();
      console.log("AI BRAIN IMPORTED");
    } catch (e) {
      console.error("Invalid AI brain file");
    }
  },

  resetBrain() {
    Object.assign(AI_BRAIN, structuredClone(DEFAULT_BRAIN));
    saveBrain();
    console.warn("AI BRAIN RESET");
  }
};

/* ---------- AUTO SAVE SAFETY ---------- */
setInterval(saveBrain, 15000);

/* ---------- READY ---------- */
console.log("KUT MILZ AI BRAIN ACTIVE");
