// Vercel Serverless Function: Secure Google Sheet Data Proxy
// This runs on Vercel Cloud Server. Client never sees the Google Sheet URL.

const ENC_KEY = "LeeeLGG_2026_Secure_Key_#%&!";
function decryptId(encB64) {
  try {
    const raw = Buffer.from(encB64, "base64").toString("latin1");
    const chars = [];
    for (let i = 0; i < raw.length; i++) {
      chars.push(String.fromCharCode(raw.charCodeAt(i) ^ ENC_KEY.charCodeAt(i % ENC_KEY.length)));
    }
    return chars.join("");
  } catch (e) {
    return "";
  }
}

const SS_ID = process.env.SPREADSHEET_ID || decryptId("fRY/OnUlH29gf3R7NGY2Lh8UDgYaJjgxSk0SfnUtFyYBAGoLYlYfGwgwOio=");
const INV_SS_ID = process.env.INVENTORY_SPREADSHEET_ID || decryptId("fQIUAzwfJg9aY39fZhAWPDQDPzw/Oj8IR0cQYjhWJyMhcj8mBnVgBgwDCRA=");

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

// Fetch raw spreadsheet data preserving 100% of mixed text/number strings (e.g. 팀금 "9.7(두달추가)")
async function fetchSheetData(ssId, gid) {
  // 1. Try Google Sheets HTML table parser first (Preserves 100% raw cell text)
  try {
    const htmlUrl = `https://docs.google.com/spreadsheets/d/${ssId}/edit?gid=${gid}#gid=${gid}`;
    const res = await fetch(htmlUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });
    if (res.ok) {
      const html = await res.text();
      const tableMatch = html.match(/<tbody[^>]*>([\s\S]*?)<\/tbody>/);
      if (tableMatch) {
        const rowMatches = tableMatch[1].match(/<tr[^>]*>([\s\S]*?)<\/tr>/g);
        if (rowMatches && rowMatches.length > 0) {
          const rows = rowMatches.map(r => {
            const cells = r.match(/<td[^>]*>([\s\S]*?)<\/td>/g) || [];
            return cells.map(c => c.replace(/<[^>]+>/g, "").trim());
          });
          if (rows.length > 0) return rows;
        }
      }
    }
  } catch (e) {
    console.warn(`HTML fetch failed for gid ${gid}, falling back to CSV:`, e);
  }

  // 2. Fallback to export CSV
  try {
    const url = `https://docs.google.com/spreadsheets/d/${ssId}/export?format=csv&gid=${gid}`;
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (res.ok) {
      const text = await res.text();
      return parseCSV(text);
    }
  } catch (e) {
    console.warn(`CSV export failed for gid ${gid}:`, e);
  }

  return [];
}

function parseUsers(csvRows) {
  if (!csvRows || csvRows.length < 2) return [];
  const players = [];
  for (let i = 1; i < csvRows.length; i++) {
    const r = csvRows[i];
    if (!r || r.length < 2 || !r[1].trim()) continue;
    const afreecaId = r[0].trim();
    const gameId = r[1].trim();
    const notes = r[12] ? r[12].trim() : "";
    const positions = [];
    for (let p = 0; p < 5; p++) {
      const lineIdx = 2 + (p * 2);
      const tierIdx = 3 + (p * 2);
      if (lineIdx < r.length && tierIdx < r.length) {
        const l = r[lineIdx].trim();
        const t = r[tierIdx].trim();
        if (l && t) {
          positions.push({ line: l, tier: t });
        }
      }
    }
    players.push({ afreecaId, gameId, positions, notes });
  }
  return players;
}

function parseTp(csvRows) {
  if (!csvRows || csvRows.length < 2) return {};
  const tpRules = {};
  for (let i = 1; i < csvRows.length; i++) {
    const r = csvRows[i];
    if (!r || r.length < 6 || !r[0].trim()) continue;
    const tierKey = r[0].trim();
    const toNum = (val) => {
      const n = Number(val);
      return isNaN(n) ? 0 : n;
    };
    tpRules[tierKey] = {
      "탑": toNum(r[1]),
      "정글": toNum(r[2]),
      "미드": toNum(r[3]),
      "원딜": toNum(r[4]),
      "서폿": toNum(r[5])
    };
  }
  return tpRules;
}

function parseGames(csvRows) {
  if (!csvRows || csvRows.length < 3) return [];
  const matches = [];
  for (let i = 2; i < csvRows.length; i++) {
    const r = csvRows[i];
    if (!r || r.length < 22 || !r[0].trim()) continue;
    matches.push(r.slice(0, 22).map(c => c.trim()));
  }
  return matches;
}

function parseGenericItemSheet(csvRows) {
  if (!csvRows || csvRows.length < 2) return { headers: [], rows: [] };
  const headers = csvRows[0].map(h => h.trim());
  const parsedList = [];

  for (let i = 1; i < csvRows.length; i++) {
    const r = csvRows[i];
    if (!r || !r[0].trim() || r[0].trim() === "시청자 아이디" || r[0].trim() === "닉네임") continue;
    const name = r[0].trim();
    const items = {};
    let totalCount = 0;

    for (let col = 1; col < r.length; col++) {
      if (col < headers.length) {
        const h = headers[col];
        const val = r[col].trim();
        if (val) {
          const num = Number(val);
          if (!isNaN(num)) {
            if (num !== 0) {
              items[h] = num;
              totalCount += num;
            }
          } else {
            items[h] = val;
          }
        }
      }
    }
    parsedList.push({ name, items, totalCount });
  }

  return { headers: headers.slice(1).filter(Boolean), rows: parsedList };
}

function parsePoints(csvRows) {
  if (!csvRows || csvRows.length < 2) return [];
  const pointsList = [];

  for (let i = 1; i < csvRows.length; i++) {
    const r = csvRows[i];
    if (!r || !r[0].trim() || r[0].trim() === "닉네임" || r[0].trim() === "시청자 아이디") continue;
    const name = r[0].trim();
    const getNum = (idx) => {
      if (idx < r.length && r[idx].trim()) {
        const n = Number(r[idx].trim());
        return isNaN(n) ? 0 : n;
      }
      return 0;
    };

    const wins = getNum(1);
    const losses = getNum(2);
    const roulette = getNum(3);
    const mannerPenalty = getNum(4);
    const leaverPenalty = getNum(5);
    const leaverVictim = getNum(6);
    const chicken = r[7] ? r[7].trim() : "0";
    const totalPoints = (r.length > 8 && r[8].trim()) ? getNum(8) : (wins * 10 - losses * 10 + roulette * 10 - mannerPenalty * 10 - leaverPenalty * 10);
    const notes = r.slice(9).map(s => s.trim()).filter(Boolean).join(", ");

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
      notes
    });
  }

  return pointsList;
}

function parseTextList(csvRows) {
  if (!csvRows || csvRows.length < 2) return [];
  const list = [];

  for (let i = 1; i < csvRows.length; i++) {
    const r = csvRows[i];
    if (!r || !r[0].trim() || r[0].trim() === "닉네임" || r[0].trim() === "시청자 아이디") continue;
    const name = r[0].trim();
    const entries = r.slice(1).map(s => s.trim()).filter(Boolean);
    if (entries.length > 0) {
      list.push({ name, entries });
    }
  }

  return list;
}

function parseDeathnoteTable(csvRows) {
  if (!csvRows || csvRows.length < 2) return [];
  const list = [];

  for (let i = 1; i < csvRows.length; i++) {
    const r = csvRows[i];
    if (!r || !r[0].trim() || r[0].trim() === "닉네임" || r[0].trim() === "시청자 아이디") continue;
    const name = r[0].trim();
    const deathnotes = [];
    for (let col = 1; col <= 4; col++) {
      if (col < r.length && r[col].trim()) {
        deathnotes.push({ round: col, reason: r[col].trim() });
      }
    }
    let teamBan = (r.length > 7 && r[7].trim() && r[7].trim() !== "팀금") ? r[7].trim() : null;

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

// Build aggregated user map (Strict 1:1 matching without alias linkage)
function buildInventoryUserMap(roulette1Rows, roulette2Rows, pointsRows, roulette44Rows, tftRows, praiseRows, deathnoteRows) {
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
      r1Data, r2Data, pointsData, r44Data, tftData, praiseData, dnData
    ] = await Promise.all([
      fetchSheetData(SS_ID, GIDS.USER),
      fetchSheetData(SS_ID, GIDS.TP),
      fetchSheetData(SS_ID, GIDS.GAME),
      fetchSheetData(INV_SS_ID, INV_GIDS.ROULETTE1).catch(() => null),
      fetchSheetData(INV_SS_ID, INV_GIDS.ROULETTE2).catch(() => null),
      fetchSheetData(INV_SS_ID, INV_GIDS.POINTS).catch(() => null),
      fetchSheetData(INV_SS_ID, INV_GIDS.ROULETTE44).catch(() => null),
      fetchSheetData(INV_SS_ID, INV_GIDS.TFT).catch(() => null),
      fetchSheetData(INV_SS_ID, INV_GIDS.PRAISE).catch(() => null),
      fetchSheetData(INV_SS_ID, INV_GIDS.DEATHNOTE).catch(() => null)
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
    const deathnote = parseDeathnoteTable(dnData);

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
