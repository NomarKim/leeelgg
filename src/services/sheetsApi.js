// Google Sheets GViz Service with Smart Hybrid Proxy
window.SheetsApi = {
  loadJSONP: (ssId, gid, callbackName) => {
    return new Promise((resolve, reject) => {
      window[callbackName] = (jsonData) => {
        resolve(jsonData);
        delete window[callbackName];
        document.getElementById(callbackName)?.remove();
      };
      
      const script = document.createElement("script");
      script.id = callbackName;
      script.src = `https://docs.google.com/spreadsheets/d/${ssId}/gviz/tq?tqx=responseHandler:${callbackName}&gid=${gid}`;
      script.onerror = (err) => {
        reject(err);
      };
      document.head.appendChild(script);
    });
  },

  parseGvizUsers: (gvizData) => {
    if (!gvizData || !gvizData.table || !gvizData.table.rows) return [];
    const rows = gvizData.table.rows;
    const players = [];
    rows.forEach(row => {
      const c = row.c;
      if (!c || c.length < 2) return;
      const gameId = c[1] ? String(c[1].v || "").trim() : "";
      if (!gameId) return;
      
      const afreecaId = c[0] ? String(c[0].v || "").trim() : "";
      const notes = c[12] ? String(c[12].v || "").trim() : "";
      
      const positions = [];
      for (let p = 0; p < 5; p++) {
        const lineIdx = 2 + (p * 2);
        const tierIdx = 3 + (p * 2);
        const lineVal = c[lineIdx] ? String(c[lineIdx].v || "").trim() : "";
        const tierVal = c[tierIdx] ? String(c[tierIdx].v || "").trim() : "";
        if (lineVal && tierVal) {
          positions.push({ line: lineVal, tier: tierVal });
        }
      }
      
      players.push({
        afreecaId,
        gameId,
        positions,
        notes
      });
    });
    return players;
  },

  parseGvizTp: (gvizData) => {
    if (!gvizData || !gvizData.table || !gvizData.table.rows) return {};
    const rows = gvizData.table.rows;
    const tpRules = {};
    rows.forEach(row => {
      const c = row.c;
      if (!c || c.length < 6) return;
      const tierKey = c[0] ? String(c[0].v || "").trim() : "";
      if (!tierKey) return;
      
      tpRules[tierKey] = {
        "탑": c[1] ? Number(c[1].v || 0) : 0,
        "정글": c[2] ? Number(c[2].v || 0) : 0,
        "미드": c[3] ? Number(c[3].v || 0) : 0,
        "원딜": c[4] ? Number(c[4].v || 0) : 0,
        "서폿": c[5] ? Number(c[5].v || 0) : 0
      };
    });
    return tpRules;
  },

  parseGvizGames: (gvizData) => {
    if (!gvizData || !gvizData.table || !gvizData.table.rows) return [];
    const rows = gvizData.table.rows;
    const matches = [];
    for (let i = 2; i < rows.length; i++) {
      const c = rows[i].c;
      if (!c) continue;
      const winner = c[0] ? String(c[0].v || "").trim() : "";
      if (!winner) continue;
      
      const matchRow = [];
      for (let col = 0; col < 22; col++) {
        const val = (c[col] && c[col].v !== null) ? String(c[col].v).trim() : "";
        matchRow.push(val);
      }
      matches.push(matchRow);
    }
    return matches;
  },

  // Smart Hybrid Live Data Loader:
  // - On Production (Vercel): Uses /api/data (100% Sheet URL Hidden + Fast Edge Cache)
  // - On Localhost / file:// / Fallback: Uses client-side JSONP for seamless local testing
  loadAllDataLive: async () => {
    const isLocal = window.location.hostname === "localhost" || 
                    window.location.hostname === "127.0.0.1" || 
                    window.location.protocol === "file:";

    // 1. Production Mode: Fetch via secure Vercel API proxy
    if (!isLocal) {
      try {
        const res = await fetch("/api/data");
        if (res.ok) {
          const liveData = await res.json();
          if (liveData && liveData.players && liveData.matches) {
            console.log("⚡ Loaded data via secure /api/data proxy with edge cache");
            return liveData;
          }
        }
      } catch (err) {
        console.warn("Production /api/data proxy failed, falling back to direct JSONP:", err);
      }
    }

    // 2. Local Dev Mode & Fallback: Direct JSONP
    const ssId = atob(window.CONFIG.OBFUSCATED_SS_ID);
    const [userData, tpData, gameData] = await Promise.all([
      window.SheetsApi.loadJSONP(ssId, window.CONFIG.GID.USER, "handleUserData"),
      window.SheetsApi.loadJSONP(ssId, window.CONFIG.GID.TP, "handleTpData"),
      window.SheetsApi.loadJSONP(ssId, window.CONFIG.GID.GAME, "handleGameData")
    ]);

    const players = window.SheetsApi.parseGvizUsers(userData);
    const tpRules = window.SheetsApi.parseGvizTp(tpData);
    const matches = window.SheetsApi.parseGvizGames(gameData);

    return { players, tpRules, matches };
  }
};
