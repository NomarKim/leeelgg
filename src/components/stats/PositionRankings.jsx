// Line-by-line Winrate Rankings Component (All 5 positions at once, Top 10 & Worst 10)
const PositionRankings = ({ matches = [], onSelectPlayer, positionsList = ["탑", "정글", "미드", "원딜", "서폿"], onGoHome }) => {
  const { useState, useMemo } = React;
  const { TrophyIcon, FlameIcon, ShieldIcon, CalendarIcon, UserIcon, ArrowRightIcon, ArrowLeftIcon } = window.Icons;
  const { parseGameDate } = window.DateUtils;

  // Selected period: "1week" (min 5 games) | "2weeks" (min 10 games)
  const [period, setPeriod] = useState("1week");

  // Determine latest match date to anchor the 1-week / 2-week calculation
  const latestMatchDate = useMemo(() => {
    if (!matches || matches.length === 0) return new Date();
    let maxTime = 0;
    matches.forEach(row => {
      const d = parseGameDate(row[21]);
      if (d && d.getTime() > maxTime) maxTime = d.getTime();
    });
    return maxTime > 0 ? new Date(maxTime) : new Date();
  }, [matches]);

  // Compute rankings for each position
  const rankingsByPosition = useMemo(() => {
    const minGames = period === "1week" ? 5 : 10;
    const daysAgo = period === "1week" ? 7 : 14;
    
    // Calculate cutoff date (latestMatchDate minus N days)
    const cutoffDate = new Date(latestMatchDate.getTime() - daysAgo * 24 * 60 * 60 * 1000);

    // Filter matches within period
    const validMatches = matches.filter(row => {
      const d = parseGameDate(row[21]);
      return d && d >= cutoffDate;
    });

    const result = {};

    positionsList.forEach((posName, posIdx) => {
      const statsMap = {};

      validMatches.forEach(row => {
        const winner = row[0];
        // Blue player for this line
        const bluePlayer = row[1 + posIdx] ? String(row[1 + posIdx]).trim() : "";
        // Red player for this line
        const redPlayer = row[6 + posIdx] ? String(row[6 + posIdx]).trim() : "";

        if (bluePlayer) {
          if (!statsMap[bluePlayer]) statsMap[bluePlayer] = { name: bluePlayer, wins: 0, losses: 0, total: 0 };
          statsMap[bluePlayer].total++;
          if (winner === "B") statsMap[bluePlayer].wins++;
          else statsMap[bluePlayer].losses++;
        }

        if (redPlayer) {
          if (!statsMap[redPlayer]) statsMap[redPlayer] = { name: redPlayer, wins: 0, losses: 0, total: 0 };
          statsMap[redPlayer].total++;
          if (winner === "R") statsMap[redPlayer].wins++;
          else statsMap[redPlayer].losses++;
        }
      });

      // Filter by minimum games and calculate winrate
      const qualified = Object.values(statsMap)
        .filter(p => p.total >= minGames)
        .map(p => ({
          ...p,
          winRate: p.total > 0 ? Math.round((p.wins / p.total) * 100) : 0
        }));

      // Top 10 (highest winrate first)
      const top10 = [...qualified].sort((a, b) => {
        if (b.winRate !== a.winRate) return b.winRate - a.winRate;
        if (b.total !== a.total) return b.total - a.total;
        return b.wins - a.wins;
      }).slice(0, 10);

      // Worst 10 (lowest winrate first)
      const worst10 = [...qualified].sort((a, b) => {
        if (a.winRate !== b.winRate) return a.winRate - b.winRate;
        if (b.total !== a.total) return b.total - a.total;
        return a.wins - b.wins;
      }).slice(0, 10);

      result[posName] = { top10, worst10, totalQualified: qualified.length, minGames };
    });

    return result;
  }, [matches, period, latestMatchDate, positionsList]);

  const medals = ["🥇 1위", "🥈 2위", "🥉 3위", "4위", "5위", "6위", "7위", "8위", "9위", "10위"];

  return (
    <section className="space-y-6">
      
      {/* Section Header & Period Toggle */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <TrophyIcon size={16} />
            <span>포지션별 랭킹 보드</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            라인별 승률 랭킹 (TOP 10 & WORST 10)
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            탑 / 정글 / 미드 / 원딜 / 서폿 5개 라인별 최고 승률 및 최하위 승률 유저 목록
          </p>
        </div>

        {/* Period Selector Tabs & Action */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="flex items-center bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setPeriod("1week")}
              className={`px-4 py-2 rounded-lg text-xs font-extrabold transition-all duration-200 ${
                period === "1week"
                  ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-950/40"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              최근 1주일 (최소 5판)
            </button>
            <button
              onClick={() => setPeriod("2weeks")}
              className={`px-4 py-2 rounded-lg text-xs font-extrabold transition-all duration-200 ${
                period === "2weeks"
                  ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-950/40"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              최근 2주일 (최소 10판)
            </button>
          </div>

          {onGoHome && (
            <button
              onClick={onGoHome}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 transition shadow"
            >
              <ArrowLeftIcon size={14} />
              <span>메인으로</span>
            </button>
          )}
        </div>
      </div>

      {/* 5 Position Cards Displayed All at Once */}
      <div className="space-y-6">
        {positionsList.map((posName) => {
          const data = rankingsByPosition[posName] || { top10: [], worst10: [], totalQualified: 0, minGames: 5 };
          const { top10, worst10, totalQualified, minGames } = data;

          return (
            <div key={posName} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              
              {/* Position Header Banner */}
              <div className="px-6 py-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-extrabold rounded-lg uppercase tracking-wider">
                    {posName} 라인
                  </span>
                  <span className="text-base font-bold text-slate-100">
                    {posName} 포지션 승률 랭킹
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  집계 조건: 최소 <strong className="text-cyan-400">{minGames}판</strong> 이상 ({totalQualified}명 충족)
                </span>
              </div>

              {/* 2-Column Table Grid: Top 10 & Worst 10 */}
              <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* 1. TOP 10 Table */}
                <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
                      <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center space-x-1.5">
                        <FlameIcon size={14} />
                        <span>🔥 {posName} 승률 TOP 10 (상위 10명)</span>
                      </h4>
                      <span className="text-[10px] text-cyan-400/80 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/20 font-bold">
                        승률 높은 순
                      </span>
                    </div>

                    {top10.length > 0 ? (
                      <table className="w-full text-xs text-left">
                        <thead>
                          <tr className="text-[11px] font-semibold text-slate-500 border-b border-slate-800/60">
                            <th className="pb-2 w-16">순위</th>
                            <th className="pb-2">소환사명</th>
                            <th className="pb-2 text-center">판수</th>
                            <th className="pb-2 text-center">승/패</th>
                            <th className="pb-2 text-right text-cyan-400">승률</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/40">
                          {top10.map((player, idx) => (
                            <tr key={player.name} className="hover:bg-cyan-950/20 transition">
                              <td className="py-2.5 font-bold text-slate-300">{medals[idx] || `${idx + 1}위`}</td>
                              <td className="py-2.5">
                                <button
                                  type="button"
                                  onClick={() => onSelectPlayer(player.name)}
                                  className="font-bold text-slate-200 hover:text-cyan-400 hover:underline transition truncate max-w-[120px] sm:max-w-none text-left"
                                  title={`${player.name} 전적 조회하기`}
                                >
                                  {player.name}
                                </button>
                              </td>
                              <td className="py-2.5 text-center text-slate-400">{player.total}전</td>
                              <td className="py-2.5 text-center text-slate-400">{player.wins}승 {player.losses}패</td>
                              <td className="py-2.5 text-right font-extrabold text-cyan-400">{player.winRate}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="py-8 text-center text-slate-500 text-xs">
                        최소 {minGames}판 이상 플레이한 {posName} 유저가 아직 없습니다.
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. WORST 10 Table */}
                <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
                      <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center space-x-1.5">
                        <span>🧊 {posName} 승률 WORST 10 (하위 10명)</span>
                      </h4>
                      <span className="text-[10px] text-rose-400/80 bg-rose-950 px-2 py-0.5 rounded border border-rose-500/20 font-bold">
                        승률 낮은 순
                      </span>
                    </div>

                    {worst10.length > 0 ? (
                      <table className="w-full text-xs text-left">
                        <thead>
                          <tr className="text-[11px] font-semibold text-slate-500 border-b border-slate-800/60">
                            <th className="pb-2 w-16">순위</th>
                            <th className="pb-2">소환사명</th>
                            <th className="pb-2 text-center">판수</th>
                            <th className="pb-2 text-center">승/패</th>
                            <th className="pb-2 text-right text-rose-400">승률</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/40">
                          {worst10.map((player, idx) => (
                            <tr key={player.name} className="hover:bg-rose-950/20 transition">
                              <td className="py-2.5 font-bold text-slate-400">{idx + 1}위</td>
                              <td className="py-2.5">
                                <button
                                  type="button"
                                  onClick={() => onSelectPlayer(player.name)}
                                  className="font-bold text-slate-200 hover:text-rose-400 hover:underline transition truncate max-w-[120px] sm:max-w-none text-left"
                                  title={`${player.name} 전적 조회하기`}
                                >
                                  {player.name}
                                </button>
                              </td>
                              <td className="py-2.5 text-center text-slate-400">{player.total}전</td>
                              <td className="py-2.5 text-center text-slate-400">{player.wins}승 {player.losses}패</td>
                              <td className="py-2.5 text-right font-extrabold text-rose-400">{player.winRate}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="py-8 text-center text-slate-500 text-xs">
                        최소 {minGames}판 이상 플레이한 {posName} 유저가 아직 없습니다.
                      </div>
                    )}
                  </div>
                </div>

              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
};

window.PositionRankings = PositionRankings;
