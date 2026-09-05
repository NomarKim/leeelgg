// LeeeL's Award - 이 주의 유저 전용 페이지 (연도/월/주차 선택)
const WeeklyAwardPage = ({ data = { matches: [], players: [] }, onGoHome, onGoAwardHub, onSearchPlayer }) => {
  const { useState, useMemo } = React;
  const { TrophyIcon, FlameIcon, SparklesIcon, CalendarIcon, ArrowLeftIcon, UserIcon, ArrowRightIcon } = window.Icons;
  const { parseGameDate } = window.DateUtils;

  const matches = data.matches || [];

  // Helper: Get week of month (1~5)
  const getWeekOfMonth = (date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return Math.ceil((date.getDate() + firstDay) / 7);
  };

  // Extract available Year-Month-Week options
  const availableWeeks = useMemo(() => {
    const wMap = new Map();
    matches.forEach(row => {
      const d = parseGameDate(row[21]);
      if (d) {
        const y = d.getFullYear();
        const m = d.getMonth() + 1;
        const w = getWeekOfMonth(d);
        const key = `${y}-${String(m).padStart(2, "0")}-w${w}`;
        const label = `${y}년 ${m}월 ${w}주차`;
        wMap.set(key, { key, year: y, month: m, week: w, label });
      }
    });
    const sorted = Array.from(wMap.values()).sort((a, b) => b.key.localeCompare(a.key));
    if (sorted.length > 0) return sorted;
    const now = new Date();
    const nowW = getWeekOfMonth(now);
    return [{ key: `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2, "0")}-w${nowW}`, year: now.getFullYear(), month: now.getMonth()+1, week: nowW, label: `${now.getFullYear()}년 ${now.getMonth()+1}월 ${nowW}주차` }];
  }, [matches]);

  const [selectedWeekKey, setSelectedWeekKey] = useState(availableWeeks[0].key);

  // Aggregate weekly stats
  const { participationTop10, winrateTop10, totalMatchesInWeek, currentLabel } = useMemo(() => {
    const statsMap = {};
    let count = 0;
    const targetObj = availableWeeks.find(item => item.key === selectedWeekKey) || availableWeeks[0];

    matches.forEach(row => {
      const d = parseGameDate(row[21]);
      if (!d) return;
      if (d.getFullYear() !== targetObj.year || (d.getMonth() + 1) !== targetObj.month || getWeekOfMonth(d) !== targetObj.week) return;

      count++;
      const winner = row[0];

      // Blue side (1..5)
      for (let i = 0; i < 5; i++) {
        const p = row[1 + i] ? String(row[1 + i]).trim() : "";
        if (!p) continue;
        if (!statsMap[p]) statsMap[p] = { name: p, total: 0, wins: 0, losses: 0 };
        statsMap[p].total++;
        if (winner === "B") statsMap[p].wins++;
        else statsMap[p].losses++;
      }

      // Red side (6..10)
      for (let i = 0; i < 5; i++) {
        const p = row[6 + i] ? String(row[6 + i]).trim() : "";
        if (!p) continue;
        if (!statsMap[p]) statsMap[p] = { name: p, total: 0, wins: 0, losses: 0 };
        statsMap[p].total++;
        if (winner === "R") statsMap[p].wins++;
        else statsMap[p].losses++;
      }
    });

    const playerList = Object.values(statsMap).map(p => ({
      ...p,
      winRate: p.total > 0 ? Math.round((p.wins / p.total) * 100) : 0
    }));

    // 시참왕 TOP 10 (판수 순)
    const partTop10 = [...playerList].sort((a, b) => {
      if (b.total !== a.total) return b.total - a.total;
      if (b.wins !== a.wins) return b.wins - a.wins;
      return b.winRate - a.winRate;
    }).slice(0, 10);

    // 승률왕 TOP 10 (최소 3판 이상, 승률 순)
    const minGamesForWinRate = 3;
    const wrTop10 = [...playerList]
      .filter(p => p.total >= minGamesForWinRate)
      .sort((a, b) => {
        if (b.winRate !== a.winRate) return b.winRate - a.winRate;
        if (b.total !== a.total) return b.total - a.total;
        return b.wins - a.wins;
      }).slice(0, 10);

    return {
      participationTop10: partTop10,
      winrateTop10: wrTop10,
      totalMatchesInWeek: count,
      currentLabel: targetObj.label
    };
  }, [matches, selectedWeekKey, availableWeeks]);

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-200">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-500/30 text-rose-400 text-xs font-bold">
            <TrophyIcon size={14} />
            <span>LeeeL's Award</span>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight flex items-center space-x-3">
            <span>🔥 이 주의 유저</span>
            <span className="text-lg font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-0.5 rounded-xl">
              {currentLabel} 명예의 전당
            </span>
          </h2>
          <p className="text-sm text-slate-400">
            {currentLabel} 한 주 동안 가장 뜨거운 활약을 펼친 시참왕과 승률왕입니다.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onGoAwardHub}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sm font-semibold text-rose-300 transition"
          >
            <span>어워드 목록</span>
          </button>
          <button
            onClick={onGoHome}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sm font-semibold text-slate-200 transition"
          >
            <ArrowLeftIcon size={16} />
            <span>메인으로</span>
          </button>
        </div>
      </div>

      {/* Week Selector Tabs */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2 text-sm font-bold text-slate-200">
          <CalendarIcon size={18} className="text-rose-400" />
          <span>조회 주차 선택:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {availableWeeks.map(item => (
            <button
              key={item.key}
              onClick={() => setSelectedWeekKey(item.key)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                selectedWeekKey === item.key
                  ? "bg-gradient-to-r from-rose-500 to-amber-600 text-white shadow-lg shadow-rose-950/50 scale-105"
                  : "bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-400 font-medium">
          총 <strong className="text-rose-400">{totalMatchesInWeek}경기</strong> 분석됨
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 1. 이번 주 시참왕 (1~3위 포디움 + 4~10위 리스트) */}
      {/* ─────────────────────────────────────────────────────────── */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <FlameIcon size={22} />
            </div>
            <div>
              <h3 className="text-xl font-black text-white flex items-center space-x-2">
                <span>⚡ {currentLabel} 주간 시참왕</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">이번 주에 가장 많은 경기를 함께한 열정 랭커 TOP 10</p>
            </div>
          </div>
          <span className="text-xs font-bold text-amber-400 bg-amber-950/80 px-3 py-1 rounded-full border border-amber-500/30">
            최다 판수 순
          </span>
        </div>

        {participationTop10.length > 0 ? (
          <div className="space-y-6">
            {/* 1~3위 포디움 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end pt-2">
              
              {/* 🥈 2위 */}
              {participationTop10[1] && (
                <div 
                  onClick={() => onSearchPlayer(participationTop10[1].name)}
                  className="order-2 md:order-1 bg-slate-950/80 border border-slate-700/80 hover:border-slate-500 rounded-3xl p-6 shadow-xl relative overflow-hidden group cursor-pointer transition hover:scale-[1.02]"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-black text-slate-300">🥈 2위</span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      열정 은메달
                    </span>
                  </div>
                  <div className="text-xl font-black text-white group-hover:text-cyan-400 transition truncate mb-1">
                    {participationTop10[1].name}
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
                    <div className="text-xs text-slate-400">{participationTop10[1].wins}승 {participationTop10[1].losses}패 ({participationTop10[1].winRate}%)</div>
                    <div className="text-2xl font-black text-slate-200">{participationTop10[1].total}전</div>
                  </div>
                </div>
              )}

              {/* 🥇 1위 (시참 대왕) */}
              {participationTop10[0] && (
                <div 
                  onClick={() => onSearchPlayer(participationTop10[0].name)}
                  className="order-1 md:order-2 bg-gradient-to-b from-amber-950/40 via-slate-950 to-slate-950 border-2 border-amber-500/60 hover:border-amber-400 rounded-3xl p-7 shadow-2xl shadow-amber-950/40 relative overflow-hidden group cursor-pointer transition hover:scale-[1.03] md:-translate-y-2"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl font-black text-amber-400">🥇 1위 (시참왕)</span>
                    <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-amber-500 text-slate-950 shadow-md">
                      주간 최다 참여
                    </span>
                  </div>
                  <div className="text-2xl font-black text-white group-hover:text-amber-300 transition truncate mb-1">
                    {participationTop10[0].name}
                  </div>
                  <div className="mt-5 pt-4 border-t border-amber-500/20 flex items-center justify-between">
                    <div className="text-sm text-slate-300 font-semibold">{participationTop10[0].wins}승 {participationTop10[0].losses}패 (승률 {participationTop10[0].winRate}%)</div>
                    <div className="text-3xl font-black text-amber-400">{participationTop10[0].total}전</div>
                  </div>
                </div>
              )}

              {/* 🥉 3위 */}
              {participationTop10[2] && (
                <div 
                  onClick={() => onSearchPlayer(participationTop10[2].name)}
                  className="order-3 bg-slate-950/80 border border-amber-900/40 hover:border-amber-700/60 rounded-3xl p-6 shadow-xl relative overflow-hidden group cursor-pointer transition hover:scale-[1.02]"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-black text-amber-600">🥉 3위</span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-400 border border-amber-800">
                      열정 동메달
                    </span>
                  </div>
                  <div className="text-xl font-black text-white group-hover:text-cyan-400 transition truncate mb-1">
                    {participationTop10[2].name}
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
                    <div className="text-xs text-slate-400">{participationTop10[2].wins}승 {participationTop10[2].losses}패 ({participationTop10[2].winRate}%)</div>
                    <div className="text-2xl font-black text-amber-500">{participationTop10[2].total}전</div>
                  </div>
                </div>
              )}

            </div>

            {/* 4~10위 리스트 테이블 */}
            {participationTop10.length > 3 && (
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl overflow-hidden mt-6">
                <div className="px-5 py-3 bg-slate-950/90 border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  📋 4위 ~ 10위 랭커 리스트
                </div>
                <div className="divide-y divide-slate-800/50">
                  {participationTop10.slice(3).map((player, idx) => (
                    <div 
                      key={player.name}
                      onClick={() => onSearchPlayer(player.name)}
                      className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-800/50 cursor-pointer transition group text-sm"
                    >
                      <div className="flex items-center space-x-4">
                        <span className="w-8 font-bold text-slate-400 text-center">{idx + 4}위</span>
                        <span className="font-bold text-slate-200 group-hover:text-cyan-400 group-hover:underline transition">{player.name}</span>
                      </div>
                      <div className="flex items-center space-x-6 text-xs">
                        <span className="text-slate-400">{player.wins}승 {player.losses}패 ({player.winRate}%)</span>
                        <span className="font-black text-amber-400 text-sm">{player.total}전</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="py-12 text-center text-slate-500 text-sm">해당 주차의 경기 데이터가 없습니다.</div>
        )}
      </section>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 2. 이번 주 승률왕 (1~3위 포디움 + 4~10위 리스트) */}
      {/* ─────────────────────────────────────────────────────────── */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <SparklesIcon size={22} />
            </div>
            <div>
              <h3 className="text-xl font-black text-white flex items-center space-x-2">
                <span>🎯 {currentLabel} 주간 승률왕</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">최소 3판 이상 플레이한 유저 중 최고 승률 랭커 TOP 10</p>
            </div>
          </div>
          <span className="text-xs font-bold text-cyan-400 bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-500/30">
            승률 높은 순 (최소 3판)
          </span>
        </div>

        {winrateTop10.length > 0 ? (
          <div className="space-y-6">
            {/* 1~3위 포디움 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end pt-2">
              
              {/* 🥈 2위 */}
              {winrateTop10[1] && (
                <div 
                  onClick={() => onSearchPlayer(winrateTop10[1].name)}
                  className="order-2 md:order-1 bg-slate-950/80 border border-slate-700/80 hover:border-slate-500 rounded-3xl p-6 shadow-xl relative overflow-hidden group cursor-pointer transition hover:scale-[1.02]"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-black text-slate-300">🥈 2위</span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      승률 은메달
                    </span>
                  </div>
                  <div className="text-xl font-black text-white group-hover:text-cyan-400 transition truncate mb-1">
                    {winrateTop10[1].name}
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
                    <div className="text-xs text-slate-400">{winrateTop10[1].total}전 {winrateTop10[1].wins}승 {winrateTop10[1].losses}패</div>
                    <div className="text-2xl font-black text-cyan-400">{winrateTop10[1].winRate}%</div>
                  </div>
                </div>
              )}

              {/* 🥇 1위 (승률 대왕) */}
              {winrateTop10[0] && (
                <div 
                  onClick={() => onSearchPlayer(winrateTop10[0].name)}
                  className="order-1 md:order-2 bg-gradient-to-b from-cyan-950/40 via-slate-950 to-slate-950 border-2 border-cyan-500/60 hover:border-cyan-400 rounded-3xl p-7 shadow-2xl shadow-cyan-950/40 relative overflow-hidden group cursor-pointer transition hover:scale-[1.03] md:-translate-y-2"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl font-black text-cyan-400">🥇 1위 (승률왕)</span>
                    <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-cyan-500 text-slate-950 shadow-md">
                      주간 최고 승률
                    </span>
                  </div>
                  <div className="text-2xl font-black text-white group-hover:text-cyan-300 transition truncate mb-1">
                    {winrateTop10[0].name}
                  </div>
                  <div className="mt-5 pt-4 border-t border-cyan-500/20 flex items-center justify-between">
                    <div className="text-sm text-slate-300 font-semibold">{winrateTop10[0].total}전 ({winrateTop10[0].wins}승 {winrateTop10[0].losses}패)</div>
                    <div className="text-3xl font-black text-cyan-400">{winrateTop10[0].winRate}%</div>
                  </div>
                </div>
              )}

              {/* 🥉 3위 */}
              {winrateTop10[2] && (
                <div 
                  onClick={() => onSearchPlayer(winrateTop10[2].name)}
                  className="order-3 bg-slate-950/80 border border-amber-900/40 hover:border-amber-700/60 rounded-3xl p-6 shadow-xl relative overflow-hidden group cursor-pointer transition hover:scale-[1.02]"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-black text-amber-600">🥉 3위</span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-400 border border-amber-800">
                      승률 동메달
                    </span>
                  </div>
                  <div className="text-xl font-black text-white group-hover:text-cyan-400 transition truncate mb-1">
                    {winrateTop10[2].name}
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
                    <div className="text-xs text-slate-400">{winrateTop10[2].total}전 {winrateTop10[2].wins}승 {winrateTop10[2].losses}패</div>
                    <div className="text-2xl font-black text-cyan-500">{winrateTop10[2].winRate}%</div>
                  </div>
                </div>
              )}

            </div>

            {/* 4~10위 리스트 테이블 */}
            {winrateTop10.length > 3 && (
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl overflow-hidden mt-6">
                <div className="px-5 py-3 bg-slate-950/90 border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  📋 4위 ~ 10위 랭커 리스트
                </div>
                <div className="divide-y divide-slate-800/50">
                  {winrateTop10.slice(3).map((player, idx) => (
                    <div 
                      key={player.name}
                      onClick={() => onSearchPlayer(player.name)}
                      className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-800/50 cursor-pointer transition group text-sm"
                    >
                      <div className="flex items-center space-x-4">
                        <span className="w-8 font-bold text-slate-400 text-center">{idx + 4}위</span>
                        <span className="font-bold text-slate-200 group-hover:text-cyan-400 group-hover:underline transition">{player.name}</span>
                      </div>
                      <div className="flex items-center space-x-6 text-xs">
                        <span className="text-slate-400">{player.total}전 ({player.wins}승 {player.losses}패)</span>
                        <span className="font-black text-cyan-400 text-sm">{player.winRate}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="py-12 text-center text-slate-500 text-sm">해당 주차에 최소 3판 이상 플레이한 유저가 없습니다.</div>
        )}
      </section>

    </main>
  );
};

window.WeeklyAwardPage = WeeklyAwardPage;
