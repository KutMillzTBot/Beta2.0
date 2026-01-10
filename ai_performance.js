/* === Performance helpers added by optimizer (safe, non-breaking) === */
if (!window.__bot_perf_helpers_added) {
  window.__bot_perf_helpers_added = true;
  function el(id) { return el(id); }
  function qs(sel) { return qs(sel); }
  function qsa(sel) { return qsa(sel); }
  function addListenerOnce(target, type, handler, opts) { try { target.removeEventListener(type, handler); } catch(e){}; target.addEventListener(type, handler, opts); }
}


// === Ultimate AI Engine: 3-win popup & auto-stop helpers (injected) ===
(function(){
  if (window.__UAE_injected) return;
  window.__UAE_injected = true;
  window.UAE_state = { winStreak:0, lastResults:[], lastPopupShownAt:0, stopRequested:false };

  function UAE_createPopup(message, opts){
    opts = opts || {};
    var el = document.createElement('div');
    el.className = 'uae-popup';
    el.style.position = 'fixed';
    el.style.right = '20px';
    el.style.top = '80px';
    el.style.zIndex = 2147483647;
    el.style.maxWidth = '360px';
    el.style.padding = '18px 20px';
    el.style.borderRadius = '10px';
    el.style.background = opts.background || '#0b2746';
    el.style.color = opts.color || '#ffffff';
    el.style.boxShadow = '0 8px 24px rgba(3,6,23,0.6)';
    el.style.border = '2px solid ' + (opts.borderColor || '#d4af37');
    el.style.fontFamily = 'Arial, Helvetica, sans-serif';
    el.style.fontSize = '15px';
    el.style.textAlign = 'center';
    el.innerText = message || '';
    document.body.appendChild(el);
    return el;
  }

  function UAE_showTimedPopup(message){
    try {
      var el = UAE_createPopup(message, {background:'#0b2746', borderColor:'#d4af37', color:'#ffffff'});
      setTimeout(function(){ try{ el.remove(); }catch(e){} }, 10000);
      window.UAE_state.lastPopupShownAt = Date.now();
      return el;
    } catch(e){ console.error('UAE_showTimedPopup error', e); }
  }

  function UAE_attemptStopAutoTrading(){
    try {
      window.UAE_state.stopRequested = true;
      if (typeof window.disableAutoTrading === 'function') try{ window.disableAutoTrading(); }catch(e){}
      if (typeof window.stopAutoTrading === 'function') try{ window.stopAutoTrading(); }catch(e){}
      if (typeof window.toggleAutoTrading === 'function') try{ window.toggleAutoTrading(false); }catch(e){}
      if (typeof window.setAutoTrading === 'function') try{ window.setAutoTrading(false); }catch(e){}
      try { localStorage.setItem('UAE_autoStopped', '1'); } catch(e){}
      UAE_showTimedPopup('Auto-trading has been stopped by Ultimate AI Engine.');
    } catch(e){ console.error('UAE_attemptStopAutoTrading error', e); }
  }

  window.UAE_reportTradeResult = function(isWin){
    try {
      var s = window.UAE_state;
      s.lastResults.push(!!isWin);
      if (s.lastResults.length > 10) s.lastResults.shift();
      s.winStreak = !!isWin ? (s.winStreak||0)+1 : 0;
      if (s.winStreak === 3) {
        UAE_showTimedPopup('Hey 👋🏼 remember not to get greedy — you\'re on three clean wins. Lower your stake if you\'re risking more than 50-60% of your balance. Remember risk management comes first. Enjoy 😇');
      }
      if (s.winStreak >= 4 && !s.stopRequested) {
        UAE_attemptStopAutoTrading();
      }
      try { console.info('UAE: winStreak=', s.winStreak); } catch(e){}
    } catch(e){ console.error('UAE_reportTradeResult error', e); }
  };

  window.UAE_tryReportFromScope = function(){
    try {
      var isWin = false;
      var candidates = ['profit','pl','pnl','currentProfit','lastProfit','tradeProfit'];
      for (var i=0;i<candidates.length;i++){
        var n = candidates[i];
        if (typeof window[n] !== 'undefined' && window[n] !== null){
          isWin = Number(window[n]) > 0;
          window.UAE_reportTradeResult(isWin);
          return;
        }
      }
    } catch(e){ console.error('UAE_tryReportFromScope error', e); }
  };

  var style = document.createElement('style');
  style.innerHTML = '.uae-popup { transition: opacity 0.3s ease, transform 0.3s ease; }';
  document.head.appendChild(style);

})();


/* ===============================
   KUT MILZ AI BRAIN — SESSION LEARNING CORE
   localStorage Persistent | Browser-Safe
   =============================== */


// === Added Crash/Boom/Volatility symbols (matches HTML dropdown) ===
const CUSTOM_ADDED_MARKETS = [
  'R_10', 'R_25', 'R_50', 'R_75', 'R_100',
  '1HZ10V', '1HZ25V', '1HZ50V', '1HZ75V', '1HZ100V',
  'BOOM300', 'BOOM500', 'BOOM600', 'BOOM900', 'BOOM1000',
  'CRASH300', 'CRASH500', 'CRASH600', 'CRASH900', 'CRASH1000'
];
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
