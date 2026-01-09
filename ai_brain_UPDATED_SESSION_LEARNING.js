


/* ===== GLOBAL TRANSACTION POPUP (FINAL FIX) ===== */
(function(){
  // expose immediately
  window.addTransactionEntry = function(tx){
    try {
      if (!tx) return;

      var card = document.createElement("div");
      card.style.cssText = [
        "position:fixed",
        "right:20px",
        "bottom:20px",
        "background:linear-gradient(135deg,#0f3d2e,#1f7a4d)",
        "color:#f5e6b3",
        "padding:16px 18px",
        "border-radius:14px",
        "min-width:260px",
        "box-shadow:0 20px 40px rgba(0,0,0,.45)",
        "font-family:system-ui,sans-serif",
        "z-index:99999",
        "animation:txSlideIn .35s ease-out"
      ].join(";");

      card.innerHTML = `
        <div style="font-weight:700;margin-bottom:6px">
          ${tx.symbol || "SYMBOL"} — ${tx.system || "SYSTEM"}
        </div>
        <div>Status: ${tx.status || "-"}</div>
        <div>Ticks: ${tx.ticks ?? "-"}</div>
        <div>Stake: ${tx.stake ?? "-"}</div>
        <div>Payout: ${tx.payout ?? "-"}</div>
        <div>Duration: ${tx.durationSecs ?? "-"}s</div>
      `;

      document.body.appendChild(card);
      setTimeout(()=>card.remove(),8000);
    } catch(e){
      console.error("TX popup error", e);
    }
  };

  // inject keyframes once
  if (!document.getElementById("tx-popup-style")) {
    var st = document.createElement("style");
    st.id = "tx-popup-style";
    st.textContent = "@keyframes txSlideIn{from{transform:translateX(120%);opacity:0}to{transform:translateX(0);opacity:1}}";
    document.head.appendChild(st);
  }

  // AUTO-WIRE FROM CONSOLE (your real TX logs)
  ['log','info','warn','error'].forEach(function(m){
    var orig = console[m];
    console[m] = function(){
      try {
        for (var i=0;i<arguments.length;i++){
          var s = String(arguments[i] || "");
          var m1 = s.match(/TX:\s*\[[^\]]+\]\s*CLOSED\s*\|\s*([^\|]+).*?\|\s*([+\-]?[0-9.]+)/i);
          if (m1) {
            var profit = parseFloat(m1[2]);
            window.addTransactionEntry({
              symbol: m1[1].trim(),
              system: "TradeX",
              time: Date.now(),
              status: profit>0 ? "WON" : profit<0 ? "LOST" : "NEUTRAL",
              payout: profit,
              colorHint: profit>0 ? "won" : "lost"
            });
          }
        }
      } catch(e){}
      return orig.apply(console, arguments);
    };
  });
})();
/* ===== END FINAL FIX ===== */
