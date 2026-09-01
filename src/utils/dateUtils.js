// Date Utilities for LeeeL.GG
window.DateUtils = {
  // "24년05월08일23시05분" -> Date 객체 변환
  parseGameDate: (dateStr) => {
    if (!dateStr) return new Date(0);
    const match = dateStr.match(/(\d+)년\s*(\d+)월\s*(\d+)일\s*(\d+)시\s*(\d+)분/);
    if (match) {
      const yy = parseInt(match[1]);
      const mm = parseInt(match[2]) - 1;
      const dd = parseInt(match[3]);
      const hh = parseInt(match[4]);
      const min = parseInt(match[5]);
      return new Date(2000 + yy, mm, dd, hh, min);
    }
    return new Date(0);
  },

  // "24년05월08일23시05분" -> "2024-05-08 23:05" 가독성 포맷
  formatDateString: (dateStr) => {
    if (!dateStr) return "";
    const match = dateStr.match(/(\d+)년\s*(\d+)월\s*(\d+)일\s*(\d+)시\s*(\d+)분/);
    if (match) {
      return `20${match[1]}-${match[2].padStart(2, "0")}-${match[3].padStart(2, "0")} ${match[4].padStart(2, "0")}:${match[5].padStart(2, "0")}`;
    }
    return dateStr;
  },

  // Date 객체 -> "YYYY-MM-DD"
  getFormattedDate: (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  },

  // 오늘 날짜 및 N일 전 날짜 기본값 생성
  getDefaultDateRange: (daysAgo = 7) => {
    const today = new Date();
    const past = new Date();
    past.setDate(today.getDate() - daysAgo);
    return {
      startDate: window.DateUtils.getFormattedDate(past),
      endDate: window.DateUtils.getFormattedDate(today)
    };
  }
};
