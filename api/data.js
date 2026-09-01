// Vercel Serverless Function: Secure Google Sheet Data Proxy
// This runs on Vercel Cloud Server. Client never sees the Google Sheet URL.

const SS_ID = Buffer.from("MXNaXzliWDBST0ZNazVTTWpma1lRQ0FuaWg0XzlIckNNRy1UUGYtLVdjX0k=", "base64").toString("utf-8");
const GIDS = {
  USER: "1523995930",
  TP: "1826658224",
  GAME: "1717495071"
};

async function fetchGviz(gid) {
  const url = `https://docs.google.com/spreadsheets/d/${SS_ID}/gviz/tq?tqx=out:json&gid=${gid}`;
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

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const [userData, tpData, gameData] = await Promise.all([
      fetchGviz(GIDS.USER),
      fetchGviz(GIDS.TP),
      fetchGviz(GIDS.GAME)
    ]);

    const players = parseUsers(userData);
    const tpRules = parseTp(tpData);
    const matches = parseGames(gameData);

    // 30-second Edge Cache: ultra fast 0.05s response
    res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate=60");
    return res.status(200).json({ players, tpRules, matches });
  } catch (err) {
    console.error("API proxy fetch error:", err);
    return res.status(500).json({ error: "Failed to fetch spreadsheet data", details: err.message });
  }
};
