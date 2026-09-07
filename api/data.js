// Vercel Serverless Function: Secure Google Sheet Data Proxy
// This runs on Vercel Cloud Server. Client never sees the Google Sheet URL.

const SS_ID = Buffer.from("MXNaXzliWDBST0ZNazVTTWpma1lRQ0FuaWg0XzlIckNNRy1UUGYtLVdjX0k=", "base64").toString("utf-8");
const INV_SS_ID = Buffer.from("MWdxZnBYYVBoU01pOUNzX0FxWmN0X0ZXZGI2Q3QzQkZtNXh5NEVSMFNQbHM=", "base64").toString("utf-8");

const GIDS = {
  USER: "1523995930",
  TP: "1826658224",
  GAME: "1717495071"
};

const INV_GIDS = {
  ROULETTE1: "0",
  ROULETTE2: "55970218",
  POINTS: "213986358",
  ROULETTE44: "666963170",
  TFT: "267062505",
  PRAISE: "1475524291",
  DEATHNOTE: "670864805"
};

async function fetchGviz(ssId, gid) {
  const url = `https://docs.google.com/spreadsheets/d/${ssId}/gviz/tq?tqx=out:json&gid=${gid}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP error ${res.status}`);
  const text = await res.text();
  const match = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);?/);
  if (!match || !match[1]) throw new Error("Invalid GViz format");
  return JSON.parse(match[1]);
}

function parseUsers(gvizData) {
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
    players.push({ afreecaId, gameId, positions, notes });
  });
  return players;
}

function parseTp(gvizData) {
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
}

function parseGames(gvizData) {
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
}

function parseGenericItemSheet(gvizData) {
  if (!gvizData || !gvizData.table || !gvizData.table.rows) return { headers: [], rows: [] };
  const table = gvizData.table;
  const rawRows = table.rows;
  if (rawRows.length === 0) return { headers: [], rows: [] };

  let headers = [];
  if (table.cols && table.cols.length > 1 && table.cols[1].label) {
    headers = table.cols.map(c => (c && c.label) ? String(c.label).trim() : "");
  } else if (rawRows[0] && rawRows[0].c) {
    headers = rawRows[0].c.map(c => (c && c.v !== null) ? String(c.v).trim() : "");
  }

  const firstDataRowIdx = (table.cols && table.cols[1] && table.cols[1].label) ? 0 : 1;
  const parsedList = [];

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

    parsedList.push({ name, items, totalCount });
  }

  return { headers: headers.slice(1).filter(Boolean), rows: parsedList };
}

function parsePoints(gvizData) {
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
}

function parseTextList(gvizData) {
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
      list.push({ name, entries });
    }
  }

  return list;
}

function parseCSV(text) {
  const rows = [];
  let row = [];
  let current = "";
  let insideQuote = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (insideQuote && nextChar === '"') {
        current += '"';
        i++;
      } else {
        insideQuote = !insideQuote;
      }
    } else if (char === "," && !insideQuote) {
      row.push(current);
      current = "";
    } else if ((char === "\r" || char === "\n") && !insideQuote) {
      if (char === "\r" && nextChar === "\n") i++;
      row.push(current);
      rows.push(row);
      row = [];
      current = "";
    } else {
      current += char;
    }
  }

  if (current || row.length > 0) {
    row.push(current);
    rows.push(row);
  }

  return rows;
}

async function fetchCsv(ssId, gid) {
  const url = `https://docs.google.com/spreadsheets/d/${ssId}/gviz/tq?tqx=out:csv&gid=${gid}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP error ${res.status}`);
  const text = await res.text();
  return parseCSV(text);
}

async function fetchSingleDeathnoteRow(ssId, gid, r) {
  const url = `https://docs.google.com/spreadsheets/d/${ssId}/gviz/tq?tqx=out:json&gid=${gid}&range=A${r}:H${r}&headers=0`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const text = await res.text();
    const match = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);?/);
    if (!match || !match[1]) return null;
    const data = JSON.parse(match[1]);
    const rows = data.table ? data.table.rows : [];
    const cols = data.table ? data.table.cols : [];
    if (rows && rows[0] && rows[0].c) {
      return rows[0].c;
    } else if (cols && cols.some(c => c && c.label)) {
      return cols.map(c => ({ v: c ? c.label : null, f: c ? c.label : null }));
    }
    return null;
  } catch (e) {
    return null;
  }
}

async function fetchAllDeathnoteRows(ssId, gid, totalRows = 100) {
  const promises = [];
  for (let r = 1; r <= totalRows; r++) {
    promises.push(fetchSingleDeathnoteRow(ssId, gid, r));
  }
  const allRows = await Promise.all(promises);
  const list = [];

  for (let i = 0; i < allRows.length; i++) {
    const c_list = allRows[i];
    if (!c_list || c_list.length === 0) continue;
    const nameCell = c_list[0];
    const name = nameCell ? String(nameCell.f || nameCell.v || "").trim() : "";
    if (!name || name === "닉네임" || name === "시청자 아이디") continue;

    // 1~4열: 데스노트 회차별 사유
    const deathnotes = [];
    for (let col = 1; col <= 4; col++) {
      if (col < c_list.length && c_list[col]) {
        const val = String(c_list[col].f || c_list[col].v || "").trim();
        if (val && val !== "null" && val !== "None") {
          deathnotes.push({ round: col, reason: val });
        }
      }
    }

    // Col 7 (H열): 팀금 정보 (문자열/숫자 혼합 100% 텍스트 수집)
    let teamBan = null;
    if (c_list.length > 7 && c_list[7]) {
      const val = String(c_list[7].f || c_list[7].v || "").trim();
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
}

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const [
      userData, tpData, gameData,
      r1Data, r2Data, pointsData, r44Data, tftData, praiseData, deathnote
    ] = await Promise.all([
      fetchGviz(SS_ID, GIDS.USER),
      fetchGviz(SS_ID, GIDS.TP),
      fetchGviz(SS_ID, GIDS.GAME),
      fetchGviz(INV_SS_ID, INV_GIDS.ROULETTE1).catch(() => null),
      fetchGviz(INV_SS_ID, INV_GIDS.ROULETTE2).catch(() => null),
      fetchGviz(INV_SS_ID, INV_GIDS.POINTS).catch(() => null),
      fetchGviz(INV_SS_ID, INV_GIDS.ROULETTE44).catch(() => null),
      fetchGviz(INV_SS_ID, INV_GIDS.TFT).catch(() => null),
      fetchGviz(INV_SS_ID, INV_GIDS.PRAISE).catch(() => null),
      fetchAllDeathnoteRows(INV_SS_ID, INV_GIDS.DEATHNOTE).catch(() => [])
    ]);

    const players = parseUsers(userData);
    const tpRules = parseTp(tpData);
    const matches = parseGames(gameData);

    const roulette1 = parseGenericItemSheet(r1Data);
    const roulette2 = parseGenericItemSheet(r2Data);
    const points = parsePoints(pointsData);
    const roulette44 = parseGenericItemSheet(r44Data);
    const tft = parseGenericItemSheet(tftData);
    const praise = parseTextList(praiseData);

    const userMap = buildInventoryUserMap(
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

    // 30-second Edge Cache: ultra fast 0.05s response
    res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate=60");
    return res.status(200).json({ players, tpRules, matches, inventory });
  } catch (err) {
    console.error("API proxy fetch error:", err);
    return res.status(500).json({ error: "Failed to fetch spreadsheet data", details: err.message });
  }
};

