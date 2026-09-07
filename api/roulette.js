// Vercel Serverless Function: Fetch and Parse Live Weflab Roulette Odds
// Target: https://weflab.com/user/lOPU2suSkmBsZg (리엘*)

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const WEFLAB_URL = "https://weflab.com/user/lOPU2suSkmBsZg";

  const NAME_MAP = {
    "33": "킬 룰렛",
    "333": "킬 룰렛",
    "34": "실드 룰렛",
    "334": "실드 룰렛",
    "50": "기본 내전 룰렛",
    "121": "고급 내전 룰렛",
    "1421": "초고급 내전 룰렛",
    "221": "한판더 룰렛",
    "421": "팬서비스룰렛",
    "200": "듀오 룰렛",
    "55": "롤체 룰렛",
    "21": "잡다 룰렛",
    "135": "개인 시그니처 룰렛(그것)",
    "187": "개인 시그니처 룰렛(회장)",
    "321": "개인 시그니처 룰렛(장카)",
    "14121": "스페셜 룰렛",
    "10000": "우잼 식데 룰렛"
  };

  const CATEGORY_GROUP_MAP = {
    "33": "kill",
    "333": "kill",
    "34": "shield",
    "334": "shield",
    "50": "ingame",
    "121": "ingame",
    "1421": "ingame",
    "200": "ingame",
    "221": "ingame",
    "421": "fan",
    "21": "fan",
    "55": "fan",
    "135": "sig",
    "187": "sig",
    "321": "sig",
    "14121": "special",
    "10000": "special"
  };

  try {
    const response = await fetch(WEFLAB_URL, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });

    if (!response.ok) {
      throw new Error(`Weflab HTTP ${response.status}`);
    }

    const html = await response.text();

    // 1. Last modified
    const lastModMatch = html.match(/룰렛의 마지막 수정시간은 <b[^>]*>(.*?)<\/b>/);
    const lastModified = lastModMatch ? lastModMatch[1].trim() : "2026년 05월 05일 16시 14분 21초";

    // 2. Streamer Name
    const nameMatch = html.match(/<span class="name">([^<]+)<\/span>/);
    const streamer = nameMatch ? nameMatch[1].trim() : "리엘*";

    // 3. Roulette boxes
    const boxes = html.split('<div class="alert_box sub_content_box active">');
    const categories = [];

    for (let idx = 1; idx < boxes.length; idx++) {
      const b = boxes[idx];
      const countMatch = b.match(/<span class=['"]value[^\'"]*['"]>([0-9,]+)<\/span>/);
      let count = countMatch ? countMatch[1].replace(/,/g, "").trim() : null;

      // Extract items
      const itemRegex = /value="([^"]*)" class="input_text select_roulette_type"[\s\S]*?value="([^"]*)" class="input_text input_roulette_name"[\s\S]*?value="([^"]*)" class="input_text decimal right input_roulette_percent"/g;
      
      const items = [];
      let match;
      while ((match = itemRegex.exec(b)) !== null) {
        const rType = match[1].trim();
        const rName = match[2].trim();
        const rPct = match[3].trim();
        const pctNum = parseFloat(rPct) || 0;
        items.push({
          name: rName,
          percent: pctNum,
          percentStr: `${rPct}%`,
          type: rType
        });
      }

      if (items.length === 0) continue;

      let title = "";
      let group = "special";

      if (count && NAME_MAP[count]) {
        title = NAME_MAP[count];
        group = CATEGORY_GROUP_MAP[count] || "other";
      } else if (!count) {
        if (items.some(it => it.name.includes("식데") && it.name.includes("우잼"))) {
          title = "우잼 식데 룰렛";
          count = "식데";
          group = "special";
        } else if (items.some(it => it.name.includes("종참100") || it.name.includes("선참15개"))) {
          title = "고액 대박 룰렛";
          count = "대박";
          group = "special";
        } else if (items.some(it => it.name.includes("선참50"))) {
          title = "스페셜 올인 룰렛";
          count = "올인";
          group = "special";
        } else {
          title = `특수 룰렛 ${idx}`;
          count = "특수";
          group = "special";
        }
      } else {
        title = `룰렛 (${count}개)`;
        group = "other";
      }

      categories.push({
        id: `roulette_${count}_${idx}`,
        count: count,
        title: title,
        group: group,
        itemCount: items.length,
        items: items
      });
    }

    return res.status(200).json({
      success: true,
      streamer,
      lastModified,
      updatedAt: new Date().toISOString(),
      categories
    });
  } catch (error) {
    console.error("Weflab Live Fetch Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
