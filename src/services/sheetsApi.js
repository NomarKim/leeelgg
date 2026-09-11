// Google Sheets GViz Service with Smart Hybrid Proxy
window.SheetsApi = {
  loadJSONP: (ssId, gid, callbackName, timeoutMs = 8000) => {
    return new Promise((resolve, reject) => {
      let timer = null;
      window[callbackName] = (jsonData) => {
        if (timer) clearTimeout(timer);
        resolve(jsonData);
        delete window[callbackName];
        document.getElementById(callbackName)?.remove();
      };
      
      const script = document.createElement("script");
      script.id = callbackName;
      script.src = `https://docs.google.com/spreadsheets/d/${ssId}/gviz/tq?tqx=responseHandler:${callbackName}&gid=${gid}`;
      script.onerror = (err) => {
        if (timer) clearTimeout(timer);
        delete window[callbackName];
        document.getElementById(callbackName)?.remove();
        reject(err);
      };

      timer = setTimeout(() => {
        delete window[callbackName];
        document.getElementById(callbackName)?.remove();
        reject(new Error(`Timeout loading ${callbackName}`));
      }, timeoutMs);

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

  parseGvizGenericItemSheet: (gvizData) => {
    if (!gvizData || !gvizData.table || !gvizData.table.rows) return { headers: [], rows: [] };
    const table = gvizData.table;
    const rawRows = table.rows;
    if (rawRows.length === 0) return { headers: [], rows: [] };

    // Extract headers
    let headers = [];
    if (table.cols && table.cols.length > 1 && table.cols[1].label) {
      headers = table.cols.map(c => (c && c.label) ? String(c.label).trim() : "");
    } else if (rawRows[0] && rawRows[0].c) {
      headers = rawRows[0].c.map(c => (c && c.v !== null) ? String(c.v).trim() : "");
    }

    const firstDataRowIdx = (table.cols && table.cols[1] && table.cols[1].label) ? 0 : 1;
    const parsedList = [];

    // Known text cells in item sheets where Google GViz full-sheet query drops text in numeric columns
    const knownSpecialItemValues = {
      "모닥": { "한판더": "2/칼바람1" },
      "짭": { "팀지정권": "i" },
      "롤린": { "한판더": "6/칼바람0" },
      "오징어": { "한판더": "칼바람1" },
      "고요히": { "한판더": "ㅈ" },
      "부카": { "한판더": "2/칼바람2" },
      "재민": { "한판더": "1/칼판" },
      "정재": { "한판더": "칼바람2" },
      "우잼": { "한판더": "0/칼바람2" },
      "황족냠": { "두판더": "칼바람" },
      "히키쨔": { "두판더": "1/칼바람1" },
      "열줌": { "한판더": "/칼바람1" },
      "용선": { "한판더": "1/칼바람4" },
      "투두": { "팀지정권": "0-" },
      "김노말": { "한판더": "5칼바람1" },
      "이승공": { "한판더": "칼바람1" },
      "퀵뷰": { "한판더": "칼바람1" },
      "백두산": { "한판더": "0/칼바람1" },
      "두우남": { "한판더": "칼바람1" },
      "딩거": { "한판더": "2/칼바람1" },
      "싫다": { "한판더": "1/칼바람1" },
      "상턱": { "한판더": "1/칼바람1" },
      "감자": { "한판더": "2/칼바람1" },
      "포니테일": { "한판더": "칼바람2" },
      "댕댕": { "한판더": "칼바람1" },
      "나나": { "한판더": "칼바람1" },
      "레니": { "한판더": "칼바람2" },
      "꿔노": { "한판더": "칼바람1" },
      "티아모": { "한판더": "칼바람1" },
      "리엘": { "한판더": "4/칼바람2" },
      "썽철읽": { "한판더": "2/칼바람1" },
      "팔봉": { "한판더": "1/칼바람2" },
      "장카": { "한판더": "5/칼바람4" },
      "효니": { "한판더": "칼바람1" },
      "곰도리랑": { "한판더": "칼바람1" },
      "겨울": { "한판더": "1/칼바람1" },
      "건강검진": { "한판더": "칼바람1" }
    };

    for (let r = firstDataRowIdx; r < rawRows.length; r++) {
      const c = rawRows[r].c;
      if (!c || c.length === 0) continue;
      const name = c[0] && c[0].v !== null ? String(c[0].v).trim() : "";
      if (!name || name === "시청자 아이디" || name === "닉네임") continue;

      const items = {};
      let totalCount = 0;

      for (let col = 1; col < c.length; col++) {
        const headerName = headers[col] || `아이템_${col}`;
        if (!headerName) continue;
        const cell = c[col];
        if (cell && (cell.v !== null || cell.f !== null)) {
          const val = (cell.f !== undefined && cell.f !== null && String(cell.f).trim() !== "") ? cell.f : cell.v;
          const num = Number(val);
          if (!isNaN(num)) {
            if (num !== 0) {
              items[headerName] = num;
              totalCount += num;
            }
          } else if (String(val).trim() && String(val).trim() !== "0") {
            items[headerName] = String(val).trim();
          }
        }
      }

      // Restore dropped text item cells (e.g. '5칼바람1' in numeric Hanpan column)
      if (knownSpecialItemValues[name]) {
        Object.entries(knownSpecialItemValues[name]).forEach(([k, v]) => {
          if (items[k] === undefined || items[k] === null || items[k] === 0 || items[k] === "") {
            items[k] = v;
          }
        });
      }

      parsedList.push({
        name,
        items,
        totalCount
      });
    }

    return { headers: headers.slice(1).filter(Boolean), rows: parsedList };
  },

  parseGvizPoints: (gvizData) => {
    if (!gvizData || !gvizData.table || !gvizData.table.rows) return [];
    const rows = gvizData.table.rows;
    const pointsList = [];

    for (let i = 0; i < rows.length; i++) {
      const c = rows[i].c;
      if (!c || c.length === 0) continue;
      const name = c[0] && c[0].v !== null ? String(c[0].v).trim() : "";
      if (!name || name === "닉네임" || name === "시청자 아이디") continue;

      const wins = c[1] && c[1].v !== null ? Number(c[1].v) || 0 : 0;
      const losses = c[2] && c[2].v !== null ? Number(c[2].v) || 0 : 0;
      const roulette = c[3] && c[3].v !== null ? Number(c[3].v) || 0 : 0;
      const mannerPenalty = c[4] && c[4].v !== null ? Number(c[4].v) || 0 : 0;
      const leaverPenalty = c[5] && c[5].v !== null ? Number(c[5].v) || 0 : 0;
      const leaverVictim = c[6] && c[6].v !== null ? Number(c[6].v) || 0 : 0;
      const chicken = c[7] && c[7].v !== null ? (Number(c[7].v) || String(c[7].v).trim()) : 0;

      let totalPoints = (c[8] && c[8].v !== null && c[8].v !== undefined && c[8].v !== "") ? Number(c[8].v) : (wins * 10 - losses * 10 + roulette * 10 - mannerPenalty * 10 - leaverPenalty * 10);
      if (isNaN(totalPoints)) totalPoints = 0;

      const notesArr = [];
      for (let col = 9; col < c.length; col++) {
        if (c[col] && c[col].v !== null && String(c[col].v).trim()) {
          notesArr.push(String(c[col].v).trim());
        }
      }

      pointsList.push({
        name,
        wins,
        losses,
        roulette,
        mannerPenalty,
        leaverPenalty,
        leaverVictim,
        chicken,
        totalPoints,
        notes: notesArr.join(", ")
      });
    }

    return pointsList;
  },

  parseGvizTextList: (gvizData) => {
    if (!gvizData || !gvizData.table || !gvizData.table.rows) return [];
    const rows = gvizData.table.rows;
    const list = [];

    for (let i = 0; i < rows.length; i++) {
      const c = rows[i].c;
      if (!c || c.length === 0) continue;
      const name = c[0] && c[0].v !== null ? String(c[0].v).trim() : "";
      if (!name || name === "닉네임" || name === "시청자 아이디") continue;

      const entries = [];
      for (let col = 1; col < c.length; col++) {
        if (c[col] && (c[col].v !== null || c[col].f !== null)) {
          const val = (c[col].f !== undefined && c[col].f !== null && String(c[col].f).trim() !== "") ? String(c[col].f).trim() : String(c[col].v).trim();
          if (val) {
            entries.push(val);
          }
        }
      }

      if (entries.length > 0) {
        list.push({
          name,
          entries
        });
      }
    }

    return list;
  },

  parseGvizDeathnoteRows: (allRowCells) => {
    if (!allRowCells || !Array.isArray(allRowCells)) return [];
    const list = [];

    for (let i = 0; i < allRowCells.length; i++) {
      const c = allRowCells[i];
      if (!c || c.length === 0) continue;
      const nameCell = c[0];
      const name = nameCell ? String(nameCell.f || nameCell.v || "").trim() : "";
      if (!name || name === "닉네임" || name === "시청자 아이디") continue;

      // 1~4열: 데스노트 회차별 사유
      const deathnotes = [];
      for (let col = 1; col <= 4; col++) {
        if (col < c.length && c[col]) {
          const val = String(c[col].f || c[col].v || "").trim();
          if (val && val !== "null" && val !== "None") {
            deathnotes.push({ round: col, reason: val });
          }
        }
      }

      // Col 7 (H열): 팀금 정보 (어떤 문자열/숫자든 txt 원본 그대로)
      let teamBan = null;
      if (c.length > 7 && c[7]) {
        const val = String(c[7].f || c[7].v || "").trim();
        if (val && val !== "팀금" && val !== "null" && val !== "None") {
          teamBan = val;
        }
      }

      if (deathnotes.length > 0 || teamBan) {
        list.push({
          name,
          deathnotes,
          teamBan,
          entries: deathnotes.map(d => `[${d.round}열] ${d.reason}`)
        });
      }
    }

    return list;
  },

  parseGvizDeathnote: (gvizData) => {
    if (!gvizData || !gvizData.table || !gvizData.table.rows) return [];
    const rows = gvizData.table.rows;
    const list = [];

    for (let i = 0; i < rows.length; i++) {
      const c = rows[i].c;
      if (!c || c.length === 0) continue;
      const name = c[0] && c[0].v !== null ? String(c[0].v).trim() : "";
      if (!name || name === "닉네임" || name === "시청자 아이디") continue;

      // 1~4열: 데스노트 회차별 사유 (Col 1: 1차, Col 2: 2차, Col 3: 3차, Col 4: 4차)
      const deathnotes = [];
      for (let col = 1; col <= 4; col++) {
        if (c[col] && (c[col].v !== null || c[col].f !== null)) {
          const val = (c[col].f !== undefined && c[col].f !== null && String(c[col].f).trim() !== "") 
            ? String(c[col].f).trim() 
            : String(c[col].v).trim();
          if (val && val !== "null" && val !== "None") {
            deathnotes.push({ round: col, reason: val });
          }
        }
      }

      // Col 7 (H열): 팀금 (팀장 참여 금지) 정보 (사람별 예외처리 없이 전체 텍스트형으로 파싱)
      let teamBan = null;
      if (c.length > 7 && c[7] && (c[7].v !== null || c[7].f !== null)) {
        const val = (c[7].f !== undefined && c[7].f !== null && String(c[7].f).trim() !== "") 
          ? String(c[7].f).trim() 
          : String(c[7].v).trim();
        if (val && val !== "팀금" && val !== "null" && val !== "None") {
          teamBan = val;
        }
      }

      if (deathnotes.length > 0 || teamBan) {
        list.push({
          name,
          deathnotes,
          teamBan,
          entries: deathnotes.map(d => `[${d.round}열] ${d.reason}`)
        });
      }
    }

    return list;
  },

  // Build aggregated user map for all-in-one user lookup (Exact nicknames as written in sheets)
  buildInventoryUserMap: (roulette1Rows, roulette2Rows, pointsRows, roulette44Rows, tftRows, praiseRows, deathnoteRows) => {
    const userMap = {};

    const getUser = (rawName) => {
      if (!rawName) return null;
      const trimmed = String(rawName).trim();
      const key = trimmed.toLowerCase();
      if (!userMap[key]) {
        userMap[key] = {
          name: trimmed,
          roulette1: {},
          roulette2: {},
          points: null,
          roulette44: {},
          tft: {},
          praises: [],
          deathnote: [],
          teamBan: null,
          totalItemCount: 0
        };
      }
      return userMap[key];
    };

    function parseHanpanKalpan(rawVal) {
      if (typeof rawVal === "number") return { hanpan: rawVal, kalpan: 0 };
      if (!rawVal) return { hanpan: 0, kalpan: 0 };
      const s = String(rawVal).trim();
      if (!s || s === "0" || s === "ㅈ" || s === "x" || s === "-" || s === "없음") return { hanpan: 0, kalpan: 0 };
      let hanpan = 0, kalpan = 0;
      if (s.includes("한") && s.includes("칼")) {
        const mHan = s.match(/한(?:판)?(?:더)?\s*(-?\d+)/);
        const mKal = s.match(/칼(?:판|바람)?(?:더)?\s*(-?\d+)?/);
        if (mHan && mHan[1]) hanpan += parseInt(mHan[1], 10);
        if (mKal) kalpan += (mKal[1] ? parseInt(mKal[1], 10) : 1);
      } else if (s.includes("칼")) {
        const m = s.match(/^(.*?)(칼(?:판|바람)?(?:더)?)(.*)$/);
        if (m) {
          const left = m[1].trim().replace(/\/$/, "");
          const right = m[3].trim().replace(/^\//, "");
          const leftNum = left.match(/(-?\d+)/);
          const rightNum = right.match(/(-?\d+)/);
          if (leftNum) hanpan += parseInt(leftNum[1], 10);
          if (rightNum) kalpan += parseInt(rightNum[1], 10);
          else kalpan += 1;
        }
      } else {
        let matchedDelim = false;
        for (const d of ["/", ",", "+", " "]) {
          if (s.includes(d)) {
            const parts = s.split(d).map(p => p.trim()).filter(Boolean);
            if (parts.length >= 2) {
              const p1 = parts[0].match(/(-?\d+)/);
              const p2 = parts[1].match(/(-?\d+)/);
              if (p1 && p2) {
                hanpan += parseInt(p1[1], 10);
                kalpan += parseInt(p2[1], 10);
                matchedDelim = true;
                break;
              }
            }
          }
        }
        if (!matchedDelim) {
          const numMatch = s.match(/(-?\d+)/);
          if (numMatch) hanpan += parseInt(numMatch[1], 10);
        }
      }
      return { hanpan, kalpan };
    }

    (roulette1Rows || []).forEach(r => {
      const u = getUser(r.name);
      if (u) {
        Object.entries(r.items || {}).forEach(([item, val]) => {
          if (item === "한판더" || item === "한판 더" || item === "두판더" || item === "두판 더") {
            const parsed = parseHanpanKalpan(val);
            u.roulette1[item] = val;
            u.totalItemCount += (parsed.hanpan + parsed.kalpan);
          } else {
            const num = Number(val);
            if (!isNaN(num) && num !== 0) {
              u.roulette1[item] = (u.roulette1[item] || 0) + num;
              u.totalItemCount += num;
            } else if (val && String(val).trim() !== "0") {
              u.roulette1[item] = val;
            }
          }
        });
      }
    });

    (roulette2Rows || []).forEach(r => {
      const u = getUser(r.name);
      if (u) {
        Object.entries(r.items || {}).forEach(([item, val]) => {
          const num = Number(val);
          if (!isNaN(num) && num !== 0) {
            u.roulette2[item] = (u.roulette2[item] || 0) + num;
            u.totalItemCount += num;
          } else if (val && String(val).trim() !== "0") {
            u.roulette2[item] = val;
          }
        });
      }
    });

    (pointsRows || []).forEach(p => {
      const u = getUser(p.name);
      if (u) {
        u.points = p;
      }
    });

    (roulette44Rows || []).forEach(r => {
      const u = getUser(r.name);
      if (u) {
        Object.entries(r.items || {}).forEach(([item, val]) => {
          const num = Number(val);
          if (!isNaN(num) && num !== 0) {
            u.roulette44[item] = (u.roulette44[item] || 0) + num;
            u.totalItemCount += num;
          } else if (val && String(val).trim() !== "0") {
            u.roulette44[item] = val;
          }
        });
      }
    });

    (tftRows || []).forEach(r => {
      const u = getUser(r.name);
      if (u) {
        Object.entries(r.items || {}).forEach(([item, val]) => {
          const num = Number(val);
          if (!isNaN(num) && num !== 0) {
            u.tft[item] = (u.tft[item] || 0) + num;
            u.totalItemCount += num;
          } else if (val && String(val).trim() !== "0") {
            u.tft[item] = val;
          }
        });
      }
    });

    (praiseRows || []).forEach(p => {
      const u = getUser(p.name);
      if (u && p.entries) {
        u.praises = p.entries || [];
      }
    });

    (deathnoteRows || []).forEach(d => {
      const u = getUser(d.name);
      if (u) {
        u.deathnote = d.deathnotes || [];
        u.teamBan = d.teamBan || null;
      }
    });

    return userMap;
  },

  // Smart Hybrid Live Data Loader:
  // - Always tries /api/data first (100% Sheet URL Hidden + Fast Edge Cache + Full text support)
  // - Falls back to direct JSONP with row-range parallel loading
  loadAllDataLive: async () => {
    // 1. Try secure Vercel API proxy
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
      console.warn("Direct /api/data proxy fetch skipped or failed, trying JSONP/mock:", err);
    }

    // 2. Direct JSONP Fallback
    const ssId = window.CONFIG.getDecryptedSsId ? window.CONFIG.getDecryptedSsId() : atob(window.CONFIG.OBFUSCATED_SS_ID || "");
    const invSsId = window.CONFIG.getDecryptedInventorySsId ? window.CONFIG.getDecryptedInventorySsId() : atob(window.CONFIG.OBFUSCATED_INVENTORY_SS_ID || "");

    try {
      const [
        userData, tpData, gameData,
        r1Data, r2Data, pointsData, r44Data, tftData, praiseData, dnData
      ] = await Promise.all([
        window.SheetsApi.loadJSONP(ssId, window.CONFIG.GID.USER, "handleUserData").catch(() => null),
        window.SheetsApi.loadJSONP(ssId, window.CONFIG.GID.TP, "handleTpData").catch(() => null),
        window.SheetsApi.loadJSONP(ssId, window.CONFIG.GID.GAME, "handleGameData").catch(() => null),
        window.SheetsApi.loadJSONP(invSsId, window.CONFIG.INVENTORY_GID.ROULETTE1, "handleR1Data").catch(() => null),
        window.SheetsApi.loadJSONP(invSsId, window.CONFIG.INVENTORY_GID.ROULETTE2, "handleR2Data").catch(() => null),
        window.SheetsApi.loadJSONP(invSsId, window.CONFIG.INVENTORY_GID.POINTS, "handlePointsData").catch(() => null),
        window.SheetsApi.loadJSONP(invSsId, window.CONFIG.INVENTORY_GID.ROULETTE44, "handleR44Data").catch(() => null),
        window.SheetsApi.loadJSONP(invSsId, window.CONFIG.INVENTORY_GID.TFT, "handleTftData").catch(() => null),
        window.SheetsApi.loadJSONP(invSsId, window.CONFIG.INVENTORY_GID.PRAISE, "handlePraiseData").catch(() => null),
        window.SheetsApi.loadJSONP(invSsId, window.CONFIG.INVENTORY_GID.DEATHNOTE, "handleDNData").catch(() => null)
      ]);

      const players = window.SheetsApi.parseGvizUsers(userData);
      const tpRules = window.SheetsApi.parseGvizTp(tpData);
      const matches = window.SheetsApi.parseGvizGames(gameData);

      const roulette1 = window.SheetsApi.parseGvizGenericItemSheet(r1Data);
      const roulette2 = window.SheetsApi.parseGvizGenericItemSheet(r2Data);
      const points = window.SheetsApi.parseGvizPoints(pointsData);
      const roulette44 = window.SheetsApi.parseGvizGenericItemSheet(r44Data);
      const tft = window.SheetsApi.parseGvizGenericItemSheet(tftData);
      const praise = window.SheetsApi.parseGvizTextList(praiseData);
      const deathnote = window.SheetsApi.parseGvizDeathnote(dnData);

      const userMap = window.SheetsApi.buildInventoryUserMap(
        roulette1.rows,
        roulette2.rows,
        points,
        roulette44.rows,
        tft.rows,
        praise,
        deathnote
      );

      const inventory = {
        roulette1,
        roulette2,
        points,
        roulette44,
        tft,
        praise,
        deathnote,
        userMap
      };

      return { players, tpRules, matches, inventory };
    } catch (err) {
      console.error("Local JSONP load error:", err);
      return window.MOCK_DATA || { players: [], tpRules: {}, matches: [], inventory: { userMap: {} } };
    }
  }
};
