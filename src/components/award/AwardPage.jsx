// LeeeL's Award - 명예의 전당 허브 (올해의 유저, 이 달의 유저, 이 주의 유저, 챔피언 장인 랭킹)
const AwardPage = ({ data = { matches: [], players: [] }, onGoHome, onSearchPlayer, onNavigateAwardSub }) => {
  const { useState, useMemo } = React;
  const { TrophyIcon, FlameIcon, ShieldIcon, SparklesIcon, SearchIcon, ArrowLeftIcon, ArrowRightIcon, CalendarIcon, CheckIcon } = window.Icons;

  const matches = data.matches || [];
  const players = data.players || [];

  // Sub-view mode inside Award: "hub" | "champion"
  const [awardView, setAwardView] = useState("hub");

  // -------------------------------------------------------------
  // Champion Specialist Filter & Ranking Logic (when view is champion)
  // -------------------------------------------------------------
  const [selectedChampion, setSelectedChampion] = useState("전체");
  const [champSearchQuery, setChampSearchQuery] = useState("");
  const [selectedTier, setSelectedTier] = useState("all");
  const [minGames, setMinGames] = useState(5);
  const [sortBy, setSortBy] = useState("winRate");
  const [showChampDropdown, setShowChampDropdown] = useState(false);
  const [hasSearchedChamp, setHasSearchedChamp] = useState(false);
  const [appliedChampFilter, setAppliedChampFilter] = useState({
    champion: "전체",
    tier: "all",
    minGames: 5,
    sortBy: "winRate"
  });

  const allChampions = useMemo(() => {
    const champSet = new Set();
    matches.forEach(row => {
      for (let i = 11; i <= 20; i++) {
        const champ = row[i] ? String(row[i]).trim() : "";
        if (champ && champ !== "-" && champ !== "null") {
          champSet.add(champ);
        }
      }
    });
    return Array.from(champSet).sort((a, b) => a.localeCompare(b, "ko"));
  }, [matches]);

  const filteredChampions = useMemo(() => {
    const q = champSearchQuery.trim().toLowerCase();
    if (!q) return allChampions;
    return allChampions.filter(c => c.toLowerCase().includes(q));
  }, [champSearchQuery, allChampions]);

  const playerTierMap = useMemo(() => {
    const map = {};
    players.forEach(p => {
      const nameKey = (p.gameId || p.afreecaId || "").trim().toLowerCase();
      if (!nameKey) return;
      const primaryPos = (p.positions && p.positions[0]) ? p.positions[0] : { line: "미상", tier: "미상" };
      map[nameKey] = {
        primaryLine: primaryPos.line || "미상",
        primaryTier: primaryPos.tier || "미상"
      };
    });
    return map;
  }, [players]);

  const checkTierMatch = (playerTier, filter) => {
    if (filter === "all") return true;
    const t = String(playerTier || "").toLowerCase();
    if (filter === "master_plus") return t.includes("챌") || t.includes("그마") || t.includes("마스터") || t.includes("750") || t.includes("800") || t.includes("900") || t.includes("1000");
    if (filter === "diamond") return t.includes("다이아") || t.includes("dia") || t.startsWith("d") || t.includes("600");
    if (filter === "emerald") return t.includes("에메") || t.includes("eme") || t.startsWith("e") || t.includes("450");
    if (filter === "platinum") return t.includes("플레") || t.includes("plat") || t.startsWith("p") || t.includes("300");
    if (filter === "gold_below") return t.includes("골드") || t.includes("실버") || t.includes("브론즈") || t.includes("아이언") || t.startsWith("g") || t.startsWith("s") || t.startsWith("b") || t.startsWith("i") || t.includes("0-") || t.includes("150");
    return true;
  };

  const handleChampSearch = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setAppliedChampFilter({
      champion: selectedChampion,
      tier: selectedTier,
      minGames: minGames,
      sortBy: sortBy
    });
    setHasSearchedChamp(true);
    setShowChampDropdown(false);
  };

  const specialistRankings = useMemo(() => {
    if (!hasSearchedChamp) return [];
    const stats = {};
    const { champion, tier, minGames: appliedMin, sortBy: appliedSort } = appliedChampFilter;

    matches.forEach(row => {
      const winner = row[0];
      for (let i = 0; i < 5; i++) {
        const pName = row[1 + i] ? String(row[1 + i]).trim() : "";
        const cName = row[11 + i] ? String(row[11 + i]).trim() : "";
        if (!pName || !cName || cName === "-") continue;
        if (champion !== "전체" && cName !== champion) continue;

        const key = champion === "전체" ? `${pName}__${cName}` : pName;
        if (!stats[key]) {
          const info = playerTierMap[pName.toLowerCase()] || { primaryLine: "내전", primaryTier: "일반" };
          stats[key] = { playerName: pName, champion: cName, line: info.primaryLine, tier: info.primaryTier, wins: 0, losses: 0, total: 0 };
        }
        stats[key].total++;
        if (winner === "B") stats[key].wins++;
        else stats[key].losses++;
      }

      for (let i = 0; i < 5; i++) {
        const pName = row[6 + i] ? String(row[6 + i]).trim() : "";
        const cName = row[16 + i] ? String(row[16 + i]).trim() : "";
        if (!pName || !cName || cName === "-") continue;
        if (champion !== "전체" && cName !== champion) continue;

        const key = champion === "전체" ? `${pName}__${cName}` : pName;
        if (!stats[key]) {
          const info = playerTierMap[pName.toLowerCase()] || { primaryLine: "내전", primaryTier: "일반" };
          stats[key] = { playerName: pName, champion: cName, line: info.primaryLine, tier: info.primaryTier, wins: 0, losses: 0, total: 0 };
        }
        stats[key].total++;
        if (winner === "R") stats[key].wins++;
        else stats[key].losses++;
      }
    });

    return Object.values(stats)
      .filter(item => item.total >= appliedMin)
      .filter(item => checkTierMatch(item.tier, tier))
      .map(item => ({
        ...item,
        winRate: item.total > 0 ? Math.round((item.wins / item.total) * 100) : 0
      }))
      .sort((a, b) => {
        if (appliedSort === "winRate") {
          if (b.winRate !== a.winRate) return b.winRate - a.winRate;
          if (b.total !== a.total) return b.total - a.total;
          return b.wins - a.wins;
        } else {
          if (b.total !== a.total) return b.total - a.total;
          if (b.winRate !== a.winRate) return b.winRate - a.winRate;
          return b.wins - a.wins;
        }
      });
  }, [matches, hasSearchedChamp, appliedChampFilter, playerTierMap]);

  const top1 = specialistRankings[0];
  const top2 = specialistRankings[1];
  const top3 = specialistRankings[2];

  const getRankBadgeTitle = (winRate, total) => {
    if (winRate === 100 && total >= 5) return "🔥 무패 장인";
    if (winRate >= 80) return "👑 신급 장인";
    if (winRate >= 65) return "⚔️ 특급 장인";
    if (winRate >= 50) return "🛡️ 숙련 장인";
    return "🌱 수련 중";
  };

  // ───────────────────────────────────────────────────────────
  // VIEW 1: Main Award Hub (4 Grand Cards)
  // ───────────────────────────────────────────────────────────
  if (awardView === "hub") {
    return (
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-in fade-in duration-200">
        
        {/* Hub Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-400 text-xs font-bold">
              <TrophyIcon size={14} />
              <span>명예의 전당</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center space-x-3">
              <span>LeeeL's Award</span>
            </h2>
            <p className="text-sm text-slate-400">
              올해 / 이 달 / 이 주의 시참왕·승률왕과 챔피언별 장인 랭킹을 확인하세요.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onGoHome}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sm font-semibold text-slate-200 transition"
            >
              <ArrowLeftIcon size={16} />
              <span>메인으로</span>
            </button>
          </div>
        </div>

        {/* 4 Grand Award Category Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: 올해의 유저 */}
          <div 
            onClick={() => onNavigateAwardSub("yearly-award")}
            className="group bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-950 border border-slate-800 hover:border-amber-500/60 rounded-3xl p-7 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:scale-[1.02] shadow-xl hover:shadow-amber-500/10 backdrop-blur-sm"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 group-hover:scale-110 transition duration-300">
                  <TrophyIcon size={28} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-amber-950 text-amber-400 border border-amber-500/30">
                  YEARLY
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-black text-white group-hover:text-amber-300 transition">
                  올해의 유저
                </h3>
                <p className="text-xs text-amber-400 font-bold mt-1">연도별 시참왕 & 승률왕</p>
                <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                  연도를 선택하여 해당 해 최고의 시참 참여도와 승률을 기록한 영예의 랭커를 확인합니다.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-amber-400 group-hover:translate-x-1 transition">
              <span>연도별 랭킹 보기</span>
              <ArrowRightIcon size={16} />
            </div>
          </div>

          {/* Card 2: 이 달의 유저 */}
          <div 
            onClick={() => onNavigateAwardSub("monthly-award")}
            className="group bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-950 border border-slate-800 hover:border-indigo-500/60 rounded-3xl p-7 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:scale-[1.02] shadow-xl hover:shadow-indigo-500/10 backdrop-blur-sm"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 group-hover:scale-110 transition duration-300">
                  <SparklesIcon size={28} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-950 text-indigo-400 border border-indigo-500/30">
                  MONTHLY
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-black text-white group-hover:text-indigo-300 transition">
                  이 달의 유저
                </h3>
                <p className="text-xs text-indigo-400 font-bold mt-1">월별 시참왕 & 승률왕</p>
                <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                  연도와 월을 선택하여 매달 가장 뜨거운 활약을 펼친 이달의 MVP 랭커를 확인합니다.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-indigo-400 group-hover:translate-x-1 transition">
              <span>월별 랭킹 보기</span>
              <ArrowRightIcon size={16} />
            </div>
          </div>

          {/* Card 3: 이 주의 유저 */}
          <div 
            onClick={() => onNavigateAwardSub("weekly-award")}
            className="group bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-950 border border-slate-800 hover:border-rose-500/60 rounded-3xl p-7 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:scale-[1.02] shadow-xl hover:shadow-rose-500/10 backdrop-blur-sm"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 group-hover:scale-110 transition duration-300">
                  <FlameIcon size={28} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-rose-950 text-rose-400 border border-rose-500/30">
                  WEEKLY
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-black text-white group-hover:text-rose-300 transition">
                  이 주의 유저
                </h3>
                <p className="text-xs text-rose-400 font-bold mt-1">주차별 시참왕 & 승률왕</p>
                <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                  주차를 선택하여 이번 주 가장 많은 승리와 판수를 달성한 주간 랭커를 확인합니다.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-rose-400 group-hover:translate-x-1 transition">
              <span>주간 랭킹 보기</span>
              <ArrowRightIcon size={16} />
            </div>
          </div>

        </div>

        {/* 4th Banner: 챔피언별 장인 랭킹 바로가기 */}
        <div 
          onClick={() => setAwardView("champion")}
          className="group bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 hover:border-cyan-500/50 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 cursor-pointer transition-all duration-300 hover:scale-[1.01] shadow-xl"
        >
          <div className="flex items-center space-x-4">
            <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0 group-hover:scale-110 transition duration-300">
              <ShieldIcon size={32} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                CHAMPION SPECIALIST
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-cyan-300 transition mt-1">
                챔피언별 장인 랭킹 조회
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                특정 챔피언, 티어 범위, 최소 판수(5/10/30/50판+)를 직접 검색하여 최고의 장인을 조회합니다.
              </p>
            </div>
          </div>

          <div className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold text-xs shrink-0 group-hover:translate-x-1 transition">
            <span>장인 랭킹 검색하기</span>
            <ArrowRightIcon size={15} />
          </div>
        </div>

      </main>
    );
  }

  // ───────────────────────────────────────────────────────────
  // VIEW 2: Champion Specialist Search View
  // ───────────────────────────────────────────────────────────
  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-bold">
            <ShieldIcon size={14} />
            <span>LeeeL's Award</span>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight flex items-center space-x-3">
            <span>챔피언별 장인 랭킹</span>
          </h2>
          <p className="text-sm text-slate-400">
            원하는 챔피언과 티어, 최소 판수를 선택한 후 조회 버튼을 눌러 장인 랭킹을 확인하세요!
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setAwardView("hub")}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sm font-semibold text-cyan-300 transition"
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

      {/* Champion Filter Bar */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5">
        <form onSubmit={handleChampSearch} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            
            {/* 1. 챔피언 검색 및 선택 (4 cols) */}
            <div className="sm:col-span-12 md:col-span-4 relative">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>🎯 챔피언 선택</span>
                <span className="text-[11px] text-amber-400 font-bold">{selectedChampion}</span>
              </label>

              <div className="relative">
                <input
                  type="text"
                  value={champSearchQuery}
                  onChange={(e) => {
                    setChampSearchQuery(e.target.value);
                    setShowChampDropdown(true);
                  }}
                  onFocus={() => setShowChampDropdown(true)}
                  placeholder={selectedChampion === "전체" ? "챔피언 검색 (예: 아리, 야스오)" : `${selectedChampion} (다른 챔프 검색)`}
                  className="w-full bg-slate-950 border-2 border-slate-800 focus:border-cyan-500 rounded-2xl pl-11 pr-20 py-3 text-sm text-slate-100 font-semibold placeholder-slate-500 outline-none transition"
                />
                <div className="absolute left-3.5 top-3.5 text-slate-400">
                  <SearchIcon size={18} className="text-cyan-400" />
                </div>

                {selectedChampion !== "전체" && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedChampion("전체");
                      setChampSearchQuery("");
                    }}
                    className="absolute right-3 top-2.5 text-xs bg-slate-800 hover:bg-slate-700 text-amber-300 px-2.5 py-1 rounded-lg transition font-semibold"
                  >
                    전체보기
                  </button>
                )}
              </div>

              {showChampDropdown && (
                <>
                  <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setShowChampDropdown(false)} />
                  <div className="absolute left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-h-64 overflow-y-auto z-50 p-2 divide-y divide-slate-800/80">
                    <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 flex items-center justify-between">
                      <span>챔피언 목록 ({filteredChampions.length}개)</span>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedChampion("전체");
                          setChampSearchQuery("");
                          setShowChampDropdown(false);
                        }}
                        className="text-amber-400 hover:underline"
                      >
                        전체 선택
                      </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 pt-1">
                      {filteredChampions.map((champ) => (
                        <button
                          key={champ}
                          type="button"
                          onClick={() => {
                            setSelectedChampion(champ);
                            setChampSearchQuery("");
                            setShowChampDropdown(false);
                          }}
                          className={`text-left px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center justify-between ${
                            selectedChampion === champ ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40" : "text-slate-300 hover:bg-slate-800 hover:text-white"
                          }`}
                        >
                          <span className="truncate">{champ}</span>
                          {selectedChampion === champ && <CheckIcon size={12} className="text-cyan-400 shrink-0" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* 2. 티어 필터 (3 cols) */}
            <div className="sm:col-span-6 md:col-span-3">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">🏅 티어 범위</label>
              <select
                value={selectedTier}
                onChange={(e) => setSelectedTier(e.target.value)}
                className="w-full bg-slate-950 border-2 border-slate-800 focus:border-cyan-500 rounded-2xl px-3.5 py-3 text-sm text-slate-100 font-semibold outline-none transition cursor-pointer"
              >
                <option value="all">전체 티어</option>
                <option value="master_plus">마스터 이상 (마/그/챌 & 750+ TP)</option>
                <option value="diamond">다이아몬드 (D1~D4 & 600~749 TP)</option>
                <option value="emerald">에메랄드 (E1~E4 & 450~599 TP)</option>
                <option value="platinum">플래티넘 (P1~P4 & 300~449 TP)</option>
                <option value="gold_below">골드 이하 (0~299 TP)</option>
              </select>
            </div>

            {/* 3. 최소 판수 조건 (3 cols) */}
            <div className="sm:col-span-6 md:col-span-3">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">📊 최소 판수</label>
              <div className="grid grid-cols-4 gap-1 bg-slate-950 p-1 rounded-2xl border-2 border-slate-800">
                {[5, 10, 30, 50].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setMinGames(num)}
                    className={`py-2 rounded-xl text-xs font-bold transition ${
                      minGames === num ? "bg-indigo-600 text-white shadow-md" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {num}판+
                  </button>
                ))}
              </div>
            </div>

            {/* 4. 조회 버튼 (2 cols) */}
            <div className="sm:col-span-12 md:col-span-2 flex items-end">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-black py-3 px-4 rounded-2xl shadow-lg transition flex items-center justify-center space-x-1.5 text-sm"
              >
                <SearchIcon size={16} />
                <span>장인 조회</span>
              </button>
            </div>

          </div>
        </form>
      </section>

      {/* Results */}
      {!hasSearchedChamp ? (
        <section className="bg-slate-900/40 border border-slate-800/60 rounded-3xl p-12 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto">
            <ShieldIcon size={32} />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="text-lg font-bold text-slate-200">
              조건을 설정하고 [장인 조회] 버튼을 눌러주세요!
            </h3>
            <p className="text-xs text-slate-400">
              챔피언, 티어 범위, 최소 판수를 선택한 뒤 조회하시면 랭킹이 표시됩니다.
            </p>
          </div>
        </section>
      ) : (
        <section className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl space-y-4">
          <div className="px-6 py-5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">📋 장인 랭킹 목록 ({specialistRankings.length}명)</h3>
            <div className="text-xs text-slate-400">
              조건: <strong className="text-amber-400">{appliedChampFilter.champion}</strong> / 최소 <strong className="text-indigo-400">{appliedChampFilter.minGames}판</strong>
            </div>
          </div>

          {specialistRankings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-950/60 border-b border-slate-800">
                    <th className="py-3 px-6 w-20">순위</th>
                    <th className="py-3 px-6">소환사명</th>
                    <th className="py-3 px-6">챔피언</th>
                    <th className="py-3 px-6">주라인/티어</th>
                    <th className="py-3 px-6 text-center">판수</th>
                    <th className="py-3 px-6 text-center">승/패</th>
                    <th className="py-3 px-6 text-right">승률</th>
                    <th className="py-3 px-6 text-center">장인 칭호</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {specialistRankings.map((item, idx) => (
                    <tr key={`${item.playerName}_${item.champion}_${idx}`} className="hover:bg-cyan-950/20 transition">
                      <td className="py-4 px-6 font-extrabold text-slate-300">{idx === 0 ? "🥇 1위" : idx === 1 ? "🥈 2위" : idx === 2 ? "🥉 3위" : `${idx + 1}위`}</td>
                      <td className="py-4 px-6">
                        <button
                          type="button"
                          onClick={() => onSearchPlayer(item.playerName)}
                          className="font-bold text-slate-100 hover:text-cyan-400 hover:underline transition"
                        >
                          {item.playerName} ↗
                        </button>
                      </td>
                      <td className="py-4 px-6"><span className="font-extrabold text-amber-400 bg-amber-950/40 border border-amber-500/20 px-2.5 py-1 rounded-lg text-xs">{item.champion}</span></td>
                      <td className="py-4 px-6 text-xs text-slate-300">{item.line} ({item.tier})</td>
                      <td className="py-4 px-6 text-center font-bold text-slate-300">{item.total}전</td>
                      <td className="py-4 px-6 text-center text-xs text-slate-400"><span className="text-emerald-400 font-bold">{item.wins}승</span> / <span className="text-rose-400 font-bold">{item.losses}패</span></td>
                      <td className="py-4 px-6 text-right font-black text-base text-cyan-400">{item.winRate}%</td>
                      <td className="py-4 px-6 text-center"><span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">{getRankBadgeTitle(item.winRate, item.total)}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-16 text-center text-slate-500 text-sm">해당 조건에 부합하는 장인 랭커가 없습니다.</div>
          )}
        </section>
      )}

    </main>
  );
};

window.AwardPage = AwardPage;
