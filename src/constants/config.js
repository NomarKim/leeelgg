// Google Spreadsheet Configuration & Global Constants
window.CONFIG = {
  // 구글 스프레드시트 ID (Base64 인코딩)
  OBFUSCATED_SS_ID: "MXNaXzliWDBST0ZNazVTTWpma1lRQ0FuaWg0XzlIckNNRy1UUGYtLVdjX0k=",
  OBFUSCATED_INVENTORY_SS_ID: "MWdxZnBYYVBoU01pOUNzX0FxWmN0X0ZXZGI2Q3QzQkZtNXh5NEVSMFNQbHM=",
  
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

