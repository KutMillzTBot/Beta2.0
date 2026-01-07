
/* ===============================
   KUTMILAI AI BRAIN — FINAL STABLE
   Persistent + Import/Export
   GitHub Pages SAFE
   =============================== */

const STORAGE_KEY = "KUTMILAI_AI_BRAIN_V1";

const DEFAULT_BRAIN = {
  "version": "5.1",
  "engine": "ULTIMATE_AI_ENGINE",
  "createdAt": "2026-01-05",
  "global": {
    "confidenceFloor": 45,
    "globalKill": false,
    "exploration": {
      "enabled": true,
      "rate": 0.05,
      "decay": 0.995,
      "minRate": 0.01
    },
    "wins": 85,
    "losses": 9
  },
  "runtimeLogic": {
    "directionAware": {
      "brainSelection": [
        "symbol",
        "direction",
        "regime"
      ],
      "fallbackDirection": "UP",
      "preTradeChecks": [
        "globalKill",
        "directionCooldown",
        "confidenceGate",
        "lossMemoryGate"
      ],
      "postTradeUpdates": [
        "updateStats",
        "updateConfidence",
        "updateLossMemory",
        "updateHealth"
      ]
    }
  },
  "regimes": {
    "enabled": true,
    "current": "neutral"
  },
  "symbols": {
    "VOL75_1S": {
      "meta": {
        "totalSessions": 1
      },
      "directions": {
        "UP": {
          "stats": {
            "wins": 23,
            "losses": 1,
            "trades": 24
          },
          "confidence": {
            "current": 55,
            "min": 45,
            "max": 80
          },
          "rr": {
            "1:1": {
              "wins": 0,
              "losses": 0
            },
            "1:2": {
              "wins": 0,
              "losses": 0
            },
            "1:3": {
              "wins": 0,
              "losses": 0
            }
          },
          "streaks": {
            "maxWin": 0,
            "maxLoss": 0,
            "current": 0
          },
          "context": {
            "afterLoss": {
              "wins": 0,
              "losses": 0
            },
            "afterWin": {
              "wins": 0,
              "losses": 0
            }
          },
          "preferredRR": "1:1",
          "rrConfidenceMap": {
            "1:1": 50,
            "1:2": 50,
            "1:3": 50
          }
        },
        "DOWN": {
          "stats": {
            "wins": 0,
            "losses": 0,
            "trades": 0
          },
          "confidence": {
            "current": 45,
            "min": 45,
            "max": 90
          },
          "lossMemory": {
            "recentLosses": 0,
            "blockedUntil": 0
          },
          "rr": {
            "1:1": {
              "wins": 0,
              "losses": 0
            },
            "1:2": {
              "wins": 0,
              "losses": 0
            },
            "1:3": {
              "wins": 0,
              "losses": 0
            }
          },
          "streaks": {
            "maxWin": 0,
            "maxLoss": 0,
            "current": 0
          },
          "context": {
            "afterLoss": {
              "wins": 0,
              "losses": 0
            },
            "afterWin": {
              "wins": 0,
              "losses": 0
            }
          },
          "preferredRR": "1:1",
          "rrConfidenceMap": {
            "1:1": 50,
            "1:2": 50,
            "1:3": 50
          }
        }
      },
      "cooldown": {
        "active": false,
        "until": 0
      },
      "patterns": {
        "spike": {
          "wins": 0,
          "losses": 0
        },
        "range": {
          "wins": 0,
          "losses": 0
        },
        "trend": {
          "wins": 0,
          "losses": 0
        }
      },
      "rrPerformance": {},
      "timing": {
        "bestSecond": {},
        "worstSecond": {}
      },
      "volatilityMemory": {
        "high": {
          "wins": 0,
          "losses": 0
        },
        "low": {
          "wins": 0,
          "losses": 0
        }
      },
      "personality": {
        "aggression": 0.5,
        "stability": 0.5,
        "confidenceWeight": 1
      },
      "patternDirectionBias": {
        "spike": {
          "UP": 0,
          "DOWN": 0
        },
        "range": {
          "UP": 0,
          "DOWN": 0
        },
        "trend": {
          "UP": 0,
          "DOWN": 0
        }
      }
    },
    "VOL25_1S": {
      "stats": {
        "wins": 5,
        "losses": 2
      },
      "directions": {
        "UP": {
          "stats": {
            "wins": 0,
            "losses": 0,
            "trades": 0
          },
          "confidence": {
            "current": 45,
            "min": 45,
            "max": 90
          },
          "lossMemory": {
            "recentLosses": 0,
            "blockedUntil": 0
          },
          "rr": {
            "1:1": {
              "wins": 0,
              "losses": 0
            },
            "1:2": {
              "wins": 0,
              "losses": 0
            },
            "1:3": {
              "wins": 0,
              "losses": 0
            }
          },
          "streaks": {
            "maxWin": 0,
            "maxLoss": 0,
            "current": 0
          },
          "context": {
            "afterLoss": {
              "wins": 0,
              "losses": 0
            },
            "afterWin": {
              "wins": 0,
              "losses": 0
            }
          },
          "preferredRR": "1:1",
          "rrConfidenceMap": {
            "1:1": 50,
            "1:2": 50,
            "1:3": 50
          }
        },
        "DOWN": {
          "stats": {
            "wins": 0,
            "losses": 0,
            "trades": 0
          },
          "confidence": {
            "current": 45,
            "min": 45,
            "max": 90
          },
          "lossMemory": {
            "recentLosses": 0,
            "blockedUntil": 0
          },
          "rr": {
            "1:1": {
              "wins": 0,
              "losses": 0
            },
            "1:2": {
              "wins": 0,
              "losses": 0
            },
            "1:3": {
              "wins": 0,
              "losses": 0
            }
          },
          "streaks": {
            "maxWin": 0,
            "maxLoss": 0,
            "current": 0
          },
          "context": {
            "afterLoss": {
              "wins": 0,
              "losses": 0
            },
            "afterWin": {
              "wins": 0,
              "losses": 0
            }
          },
          "preferredRR": "1:1",
          "rrConfidenceMap": {
            "1:1": 50,
            "1:2": 50,
            "1:3": 50
          }
        }
      },
      "cooldown": {
        "active": false,
        "until": 0
      },
      "patterns": {
        "spike": {
          "wins": 0,
          "losses": 0
        },
        "range": {
          "wins": 0,
          "losses": 0
        },
        "trend": {
          "wins": 0,
          "losses": 0
        }
      },
      "rrPerformance": {},
      "timing": {
        "bestSecond": {},
        "worstSecond": {}
      },
      "volatilityMemory": {
        "high": {
          "wins": 0,
          "losses": 0
        },
        "low": {
          "wins": 0,
          "losses": 0
        }
      },
      "personality": {
        "aggression": 0.5,
        "stability": 0.5,
        "confidenceWeight": 1
      },
      "patternDirectionBias": {
        "spike": {
          "UP": 0,
          "DOWN": 0
        },
        "range": {
          "UP": 0,
          "DOWN": 0
        },
        "trend": {
          "UP": 0,
          "DOWN": 0
        }
      }
    },
    "R_100": {
      "patterns": {},
      "zones": {},
      "stats": {
        "w": 0,
        "l": 0
      },
      "confFloor": 55,
      "stakeBias": 1,
      "hourly": {},
      "lastDecay": 1767723330642,
      "directions": {
        "UP": {
          "stats": {
            "wins": 0,
            "losses": 0,
            "trades": 0
          },
          "confidence": {
            "current": 45,
            "min": 45,
            "max": 90
          },
          "lossMemory": {
            "recentLosses": 0,
            "blockedUntil": 0
          },
          "rr": {
            "1:1": {
              "wins": 0,
              "losses": 0
            },
            "1:2": {
              "wins": 0,
              "losses": 0
            },
            "1:3": {
              "wins": 0,
              "losses": 0
            }
          },
          "streaks": {
            "maxWin": 0,
            "maxLoss": 0,
            "current": 0
          },
          "context": {
            "afterLoss": {
              "wins": 0,
              "losses": 0
            },
            "afterWin": {
              "wins": 0,
              "losses": 0
            }
          },
          "preferredRR": "1:1",
          "rrConfidenceMap": {
            "1:1": 50,
            "1:2": 50,
            "1:3": 50
          }
        },
        "DOWN": {
          "stats": {
            "wins": 0,
            "losses": 0,
            "trades": 0
          },
          "confidence": {
            "current": 45,
            "min": 45,
            "max": 90
          },
          "lossMemory": {
            "recentLosses": 0,
            "blockedUntil": 0
          },
          "rr": {
            "1:1": {
              "wins": 0,
              "losses": 0
            },
            "1:2": {
              "wins": 0,
              "losses": 0
            },
            "1:3": {
              "wins": 0,
              "losses": 0
            }
          },
          "streaks": {
            "maxWin": 0,
            "maxLoss": 0,
            "current": 0
          },
          "context": {
            "afterLoss": {
              "wins": 0,
              "losses": 0
            },
            "afterWin": {
              "wins": 0,
              "losses": 0
            }
          },
          "preferredRR": "1:1",
          "rrConfidenceMap": {
            "1:1": 50,
            "1:2": 50,
            "1:3": 50
          }
        }
      },
      "cooldown": {
        "active": false,
        "until": 0
      },
      "rrPerformance": {},
      "timing": {
        "bestSecond": {},
        "worstSecond": {}
      },
      "volatilityMemory": {
        "high": {
          "wins": 0,
          "losses": 0
        },
        "low": {
          "wins": 0,
          "losses": 0
        }
      },
      "personality": {
        "aggression": 0.5,
        "stability": 0.5,
        "confidenceWeight": 1
      },
      "patternDirectionBias": {
        "spike": {
          "UP": 0,
          "DOWN": 0
        },
        "range": {
          "UP": 0,
          "DOWN": 0
        },
        "trend": {
          "UP": 0,
          "DOWN": 0
        }
      }
    },
    "1HZ75V": {
      "patterns": {
        "NONE": {
          "w": 45,
          "l": 5
        }
      },
      "zones": {
        "0": 5
      },
      "stats": {
        "w": 45,
        "l": 5
      },
      "confFloor": 45,
      "stakeBias": 1,
      "hourly": {
        "22": {
          "w": 18,
          "l": 3
        },
        "23": {
          "w": 27,
          "l": 2
        }
      },
      "lastDecay": 1767757256920
    }
  },
  "executionRouting": {
    "enabled": true,
    "respectSessionLimit": true,
    "roundRobin": {
      "enabled": true,
      "mode": "session",
      "advanceOn": "bot_start",
      "persist": true,
      "rotationOrder": [
        "VOL75_1S",
        "VOL25_1S",
        "VOL10_1S"
      ],
      "currentIndex": 0,
      "stats": {
        "VOL75_1S": {
          "routedTrades": 0,
          "wins": 0,
          "losses": 0
        },
        "VOL25_1S": {
          "routedTrades": 0,
          "wins": 0,
          "losses": 0
        },
        "VOL10_1S": {
          "routedTrades": 0,
          "wins": 0,
          "losses": 0
        }
      }
    }
  },
  "legacySymbols": {
    "1HZ75V": {
      "patterns": {
        "NONE": {
          "w": 16,
          "l": 3
        }
      },
      "zones": {
        "0": 3
      },
      "stats": {
        "w": 16,
        "l": 3
      },
      "confFloor": 50,
      "stakeBias": 1,
      "hourly": {
        "7": {
          "w": 16,
          "l": 3
        }
      },
      "lastDecay": 1767701147291
    }
  },
  "uiModes": {
    "aggressive": {
      "confidenceFloor": "ui-only",
      "note": "Does not override AI JSON unless user applies preset"
    },
    "conservative": {
      "confidenceFloor": "ui-only",
      "note": "Does not override AI JSON unless user applies preset"
    }
  },
  "meta": {
    "directionAwareActive": true,
    "jsonAuthority": true,
    "autosave": {
      "enabled": true,
      "intervalMs": 15000
    },
    "rrDirectionAware": true,
    "aiGuardNonBlocking": true,
    "version": "7.0_FINAL_BRAIN",
    "htmlIsExecutor": true,
    "learningScope": "full-system",
    "notes": "JSON learns everything HTML executes; HTML only visualizes & routes.",
    "verified": true
  },
  "globalBrain": {
    "marketRegime": {
      "current": "unknown",
      "confidence": 0,
      "memory": []
    },
    "drawdownLearning": {
      "active": true,
      "softBlock": true,
      "hardFreeze": false,
      "recoveryBias": 0.6
    },
    "session": {
      "tradesThisSession": 0,
      "winsThisSession": 0,
      "lossesThisSession": 0
    },
    "autoRR": true,
    "patternDirectionBias": true,
    "symbolPersonality": true
  },
  "decisionMemory": {
    "lastTrades": [],
    "maxLength": 100,
    "learnSequences": true
  },
  "exploration": {
    "adaptive": true,
    "boostAfterLoss": true,
    "reduceAfterWin": true
  }
};

function loadBrain() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      console.log("[AI] Brain restored from localStorage");
      return JSON.parse(saved);
    }
  } catch(e){}
  console.log("[AI] Brain loaded from default");
  return JSON.parse(JSON.stringify(DEFAULT_BRAIN));
}

function saveBrain() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(window.AI_BRAIN));
}

window.AI_BRAIN = loadBrain();

window.AI = {
  getCurrentSymbol() {
    const rr = AI_BRAIN.executionRouting?.roundRobin;
    if (rr?.enabled) return rr.rotationOrder[rr.currentIndex];
    return "R_100";
  },

  getRRConfidence() {
    const rr = AI_BRAIN.executionRouting?.roundRobin;
    if (!rr) return 0;
    return Math.round(((rr.currentIndex + 1) / rr.rotationOrder.length) * 100);
  },

  getConfidencePreview() {
    const sym = this.getCurrentSymbol();
    const s = AI_BRAIN.symbols?.[sym];
    if (!s) return 0;
    const d = s.directions?.UP || s.directions?.DOWN;
    return d?.confidence?.current || 0;
  },

  recordTrade(win=true) {
    const sym = this.getCurrentSymbol();
    const s = AI_BRAIN.symbols?.[sym];
    if (!s) return;

    s.stats = s.stats || { trades:0, wins:0, losses:0 };
    s.stats.trades++;
    win ? s.stats.wins++ : s.stats.losses++;

    AI_BRAIN.global = AI_BRAIN.global || { wins:0, losses:0 };
    win ? AI_BRAIN.global.wins++ : AI_BRAIN.global.losses++;

    saveBrain();
  },

  exportBrain() {
    const data = JSON.stringify(AI_BRAIN, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "kutmilai_ai_brain_export.json";
    a.click();
    URL.revokeObjectURL(url);
  },

  importBrain(file) {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        AI_BRAIN = JSON.parse(e.target.result);
        saveBrain();
        alert("AI Brain imported successfully");
        location.reload();
      } catch {
        alert("Invalid AI brain file");
      }
    };
    reader.readAsText(file);
  }
};

console.log("[AI] FINAL brain ready");


/* ===== RR ENHANCEMENTS ===== */
if(!AI.rrConfig){
  AI.rrConfig = {
    markets: {
      VOL75_1S:{enabled:true,tp:true,eligible:true},
      VOL25_1S:{enabled:true,tp:true,eligible:true},
      VOL10_1S:{enabled:true,tp:true,eligible:true}
    }
  };
  saveAI();
}

AI.emitTrade = function(symbol, stake, payout, win){
  const detail = {symbol, stake, payout, win, time: new Date().toLocaleTimeString()};
  document.dispatchEvent(new CustomEvent("AI_TRADE", {detail}));
};

/* Hook recordTrade to emit */
const _recordTrade = recordTrade;
recordTrade = function(symbol, profit){
  _recordTrade(symbol, profit);
  AI.emitTrade(symbol, Math.abs(profit), profit>0?profit:0, profit>0);
};
