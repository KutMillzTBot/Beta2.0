
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



/* AUTO-ADDED: GLOBAL TRANSACTION POPUP BRIDGE & CONSOLE-WRAP */
if (!window.addTransactionEntry) {
  window.addTransactionEntry = function(tx) {
    try {
      if (!tx || typeof tx !== 'object') return;
      var data = {
        symbol: tx.symbol || tx.symbolName || tx.market || 'N/A',
        system: tx.system || 'AI',
        ticks: tx.ticks != null ? tx.ticks : (tx.tickCount != null ? tx.tickCount : '-'),
        stake: tx.stake != null ? tx.stake : tx.amount || '-',
        payout: tx.payout != null ? tx.payout : tx.profit || tx.payoutAmount || '-',
        status: tx.status || (typeof tx.payout === 'number' ? (tx.payout>0?'WON':'LOST') : 'UNKNOWN'),
        durationSecs: tx.durationSecs || tx.duration || null,
        note: tx.note || ''
      };
      var ev = new CustomEvent('kut:transaction', { detail: data });
      window.dispatchEvent(ev);
      console.info('TX POPUP DISPATCHED:', data.symbol, data.status, data.payout);
    } catch (e) { console.warn('addTransactionEntry error', e); }
  };
}

(function(){
  if (window.__txConsoleWrapped) return;
  window.__txConsoleWrapped = true;
  ['log','info','warn','error'].forEach(function(m) {
    var orig = console[m] && console[m].bind(console);
    console[m] = function() {
      try {
        for (var i=0;i<arguments.length;i++) {
          try {
            var s = arguments[i];
            if (typeof s !== 'string') s = (s && s.toString) ? s.toString() : JSON.stringify(s);
            if (!s) continue;
            var m1 = s.match(/TX:\s*\[[^\]]+\]\s*CLOSED\s*\|\s*([^\|]+)\s*\|[^\|]*\|\s*([+\-]?[0-9]*\.?[0-9]+)/i);
            if (m1) {
              var symbol = m1[1].trim();
              var profit = parseFloat(m1[2]);
              try { window.addTransactionEntry({ symbol: symbol, system: 'TradeX', payout: profit, status: profit>0? 'WON':'LOST' }); } catch(e){}
            }
            var m2 = s.match(/Trade closed\.\s*P\/L:\s*([+\-]?[0-9]*\.?[0-9]+)/i);
            if (m2) {
              var profit2 = parseFloat(m2[1]);
              try { window.addTransactionEntry({ symbol: null, system: 'TradeX', payout: profit2, status: profit2>0? 'WON':'LOST' }); } catch(e){}
            }
          } catch(e) {}
        }
      } catch(e) {}
      if (orig) try { orig.apply(console, arguments); } catch(e) {}
    };
  });
})();
