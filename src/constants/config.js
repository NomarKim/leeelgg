// Google Spreadsheet Configuration & Global Constants
(function() {
  const ENC_KEY = "LeeeLGG_2026_Secure_Key_#%&!";
  
  function decryptId(encB64) {
    try {
      const raw = atob(encB64);
      const chars = [];
      for (let i = 0; i < raw.length; i++) {
        chars.push(String.fromCharCode(raw.charCodeAt(i) ^ ENC_KEY.charCodeAt(i % ENC_KEY.length)));
      }
      return chars.join("");
    } catch (e) {
      return "";
    }
  }

  window.CONFIG = {
    // 암호화된 구글 스프레드시트 ID (XOR Cipher + Base64)
    ENC_SS_ID: "fRY/OnUlH29gf3R7NGY2Lh8UDgYaJjgxSk0SfnUtFyYBAGoLYlYfGwgwOio=",
    ENC_INVENTORY_SS_ID: "fQIUAzwfJg9aY39fZhAWPDQDPzw/Oj8IR0cQYjhWJyMhcj8mBnVgBgwDCRA=",
    getDecryptedSsId: () => decryptId(window.CONFIG.ENC_SS_ID),
    getDecryptedInventorySsId: () => decryptId(window.CONFIG.ENC_INVENTORY_SS_ID),
  
  // Google Sheets GIDs (메인 전적 시트)
  GID: {
    USER: "1523995930",  // DB(user)2
    TP: "1826658224",    // DB(tp)
    GAME: "1717495071"   // DB(game)
  },

  // Google Sheets GIDs (아이템 및 포인트 현황 시트)
  INVENTORY_GID: {
    ROULETTE1: "0",           // 룰렛아이템1 (내전 인게임 아이템)
    ROULETTE2: "55970218",    // 룰렛아이템2 (방송/리액션 아이템)
    POINTS: "213986358",      // L포인트 & 치킨 현황
    ROULETTE44: "666963170",  // 44룰렛아이템
    TFT: "267062505",         // 롤체룰렛
    PRAISE: "1475524291",     // 칭찬스티커
    DEATHNOTE: "670864805"    // 데스노트
  },

    // 기본 설정
    DEFAULT_PLAYER: "리엘",
    POSITIONS: ["탑", "정글", "미드", "원딜", "서폿"]
  };
})();

