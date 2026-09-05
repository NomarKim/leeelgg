// LeeeL's Award - 챔피언별 장인 랭킹 (명예의 전당)
const AwardPage = ({ data = { matches: [], players: [] }, onGoHome, onSearchPlayer }) => {
  const { useState, useMemo } = React;
  const { TrophyIcon, FlameIcon, ShieldIcon, SparklesIcon, SearchIcon, ArrowLeftIcon, ArrowRightIcon, UserIcon, CheckIcon } = window.Icons;

  const matches = data.matches || [];
  const players = data.players || [];

  // Filter Input States
  const [selectedChampion, setSelectedChampion] = useState("전체");
  const [champSearchQuery, setChampSearchQuery] = useState("");
  const [selectedTier, setSelectedTier] = useState("all");
  const [minGames, setMinGames] = useState(5); // 기본값: 5판
  const [sortBy, setSortBy] = useState("winRate"); // "winRate" | "total"
  const [showChampDropdown, setShowChampDropdown] = useState(false);

  // Search Submission State (초기에는 false -> 조회 버튼을 눌러야 결과 출력)
  const [hasSearched, setHasSearched] = useState(false);

  // Applied Filter States (Snapshot when user clicks Search)
  const [appliedFilter, setAppliedFilter] = useState({
    champion: "전체",
    tier: "all",
    minGames: 5,
    sortBy: "winRate"
  });

  // Extract all unique champions from match history
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

  // Filtered champion suggestions based on search query
  const filteredChampions = useMemo(() => {
    const q = champSearchQuery.trim().toLowerCase();
    if (!q) return allChampions;
    return allChampions.filter(c => c.toLowerCase().includes(q));
  }, [champSearchQuery, allChampions]);

  // Create player tier lookup map
  const playerTierMap = useMemo(() => {
    const map = {};
    players.forEach(p => {
      const nameKey = (p.gameId || p.afreecaId || "").trim().toLowerCase();
      if (!nameKey) return;
      
      const primaryPos = (p.positions && p.positions[0]) ? p.positions[0] : { line: "미상", tier: "미상" };
      map[nameKey] = {
        primaryLine: primaryPos.line || "미상",
        primaryTier: primaryPos.tier || "미상",
        positions: p.positions || []
      };
    });
    return map;
  }, [players]);

  // Tier classification helper
  const checkTierMatch = (playerTier, filter) => {
    if (filter === "all") return true;
    const t = String(playerTier || "").toLowerCase();
    if (filter === "master_plus") {
      return t.includes("챌") || t.includes("그마") || t.includes("마스터") || t.includes("750") || t.includes("800") || t.includes("900") || t.includes("1000");
    }
    if (filter === "diamond") {
      return t.includes("다이아") || t.includes("dia") || t.startsWith("d") || t.includes("600");
    }
    if (filter === "emerald") {
      return t.includes("에메") || t.includes("eme") || t.startsWith("e") || t.includes("450");
    }
    if (filter === "platinum") {
      return t.includes("플레") || t.includes("plat") || t.startsWith("p") || t.includes("300");
    }
    if (filter === "gold_below") {
      return t.includes("골드") || t.includes("실버") || t.includes("브론즈") || t.includes("아이언") || t.startsWith("g") || t.startsWith("s") || t.startsWith("b") || t.startsWith("i") || t.includes("0-") || t.includes("150");
    }
    return true;
  };

  // Handle Search Click
  const handleInquire = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setAppliedFilter({
      champion: selectedChampion,
      tier: selectedTier,
      minGames: minGames,
      sortBy: sortBy
    });
    setHasSearched(true);
    setShowChampDropdown(false);
  };

  // Aggregate stats per player based on APPLIED filters
  const specialistRankings = useMemo(() => {
    if (!hasSearched) return [];

    const stats = {};
    const { champion, tier, minGames: appliedMin, sortBy: appliedSort } = appliedFilter;

    matches.forEach(row => {
      const winner = row[0]; // "B" or "R"

      // Blue side (cols 1..5 players, cols 11..15 champs)
      for (let i = 0; i < 5; i++) {
        const pName = row[1 + i] ? String(row[1 + i]).trim() : "";
        const cName = row[11 + i] ? String(row[11 + i]).trim() : "";
        if (!pName || !cName || cName === "-") continue;

        // Filter by selected champion
        if (champion !== "전체" && cName !== champion) continue;

        const key = champion === "전체" ? `${pName}__${cName}` : pName;
        if (!stats[key]) {
          const info = playerTierMap[pName.toLowerCase()] || { primaryLine: "내전", primaryTier: "일반" };
          stats[key] = {
            playerName: pName,
            champion: cName,
            line: info.primaryLine,
            tier: info.primaryTier,
            wins: 0,
            losses: 0,
            total: 0
          };
        }

        stats[key].total++;
        if (winner === "B") stats[key].wins++;
        else stats[key].losses++;
      }

      // Red side (cols 6..10 players, cols 16..20 champs)
      for (let i = 0; i < 5; i++) {
        const pName = row[6 + i] ? String(row[6 + i]).trim() : "";
        const cName = row[16 + i] ? String(row[16 + i]).trim() : "";
        if (!pName || !cName || cName === "-") continue;

        // Filter by selected champion
        if (champion !== "전체" && cName !== champion) continue;

        const key = champion === "전체" ? `${pName}__${cName}` : pName;
        if (!stats[key]) {
          const info = playerTierMap[pName.toLowerCase()] || { primaryLine: "내전", primaryTier: "일반" };
          stats[key] = {
            playerName: pName,
            champion: cName,
            line: info.primaryLine,
            tier: info.primaryTier,
            wins: 0,
            losses: 0,
            total: 0
          };
        }

        stats[key].total++;
        if (winner === "R") stats[key].wins++;
        else stats[key].losses++;
      }
    });

    // Apply Tier Filter & Min Games Condition
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
  }, [matches, hasSearched, appliedFilter, playerTierMap]);

  // Top 3 Podium Rankers
  const top1 = specialistRankings[0];
  const top2 = specialistRankings[1];
  const top3 = specialistRankings[2];

  // Quick popular champions pills
  const popularPills = useMemo(() => {
    return allChampions.slice(0, 8);
  }, [allChampions]);

  const getRankBadgeTitle = (winRate, total) => {
    if (winRate === 100 && total >= 5) return "🔥 무패 장인";
    if (winRate >= 80) return "👑 신급 장인";
    if (winRate >= 65) return "⚔️ 특급 장인";
    if (winRate >= 50) return "🛡️ 숙련 장인";
    return "🌱 수련 중";
  };

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-400 text-xs font-bold">
            <TrophyIcon size={14} />
            <span>☆ 명예의 전당 ☆</span>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight flex items-center space-x-3">
            <span>LeeeL's Award</span>
            <span className="text-lg font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-0.5 rounded-xl">
              챔피언별 장인 랭킹
            </span>
          </h2>
          <p className="text-sm text-slate-400">
            원하는 챔피언과 티어, 최소 판수를 선택한 후 조회 버튼을 눌러 장인 랭킹을 확인하세요!
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

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 3대 인터랙티브 필터 컨트롤러 바 + 조회 버튼 */}
      {/* ─────────────────────────────────────────────────────────── */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl shadow-black/40 space-y-5">
        
        <form onSubmit={handleInquire} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            
            {/* 1. 챔피언 검색 및 선택 (5 cols) */}
            <div className="sm:col-span-12 md:col-span-4 relative">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  <span>🎯 챔피언 선택</span>
                </span>
                <span className="text-[11px] text-amber-400 font-bold">
                  {selectedChampion}
                </span>
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
                  className="w-full bg-slate-950 border-2 border-slate-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-2xl pl-11 pr-20 py-3 text-sm text-slate-100 font-semibold placeholder-slate-500 outline-none transition"
                />
                <div className="absolute left-3.5 top-3.5 text-slate-400">
                  <SearchIcon size={18} className="text-amber-400" />
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

              {/* Champion Autocomplete Dropdown */}
              {showChampDropdown && (
                <>
                  <div 
                    className="fixed inset-0 z-40 bg-transparent"
                    onClick={() => setShowChampDropdown(false)} 
                  />
                  <div className="absolute left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-h-64 overflow-y-auto z-50 p-2 divide-y divide-slate-800/80 animate-in fade-in zoom-in-95 duration-150">
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
                        전체 챔피언 선택
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
                            selectedChampion === champ
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                              : "text-slate-300 hover:bg-slate-800 hover:text-white"
                          }`}
                        >
                          <span className="truncate">{champ}</span>
                          {selectedChampion === champ && <CheckIcon size={12} className="text-amber-400 shrink-0" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* 2. 티어 필터 (3 cols) */}
            <div className="sm:col-span-6 md:col-span-3">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                <span>🏅 티어 범위</span>
              </label>
              <select
                value={selectedTier}
                onChange={(e) => setSelectedTier(e.target.value)}
                className="w-full bg-slate-950 border-2 border-slate-800 hover:border-slate-700 focus:border-cyan-500 rounded-2xl px-3.5 py-3 text-sm text-slate-100 font-semibold outline-none transition cursor-pointer"
              >
                <option value="all">전체 티어</option>
                <option value="master_plus">마스터 이상 (마/그/챌 & 750+ TP)</option>
                <option value="diamond">다이아몬드 (D1~D4 & 600~749 TP)</option>
                <option value="emerald">에메랄드 (E1~E4 & 450~599 TP)</option>
                <option value="platinum">플래티넘 (P1~P4 & 300~449 TP)</option>
                <option value="gold_below">골드 이하 (0~299 TP)</option>
              </select>
            </div>

            {/* 3. 최소 판수 조건: 5판+, 10판+, 30판+, 50판+ (3 cols) */}
            <div className="sm:col-span-6 md:col-span-3">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                <span>📊 최소 판수 조건</span>
              </label>
              <div className="grid grid-cols-4 gap-1 bg-slate-950 p-1 rounded-2xl border-2 border-slate-800">
                {[5, 10, 30, 50].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setMinGames(num)}
                    className={`py-2 rounded-xl text-xs font-bold transition ${
                      minGames === num
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-950"
                        : "text-slate-400 hover:text-white"
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
                className="w-full bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 hover:from-amber-400 hover:to-orange-400 active:scale-[0.98] text-slate-950 font-black py-3 px-4 rounded-2xl shadow-lg shadow-amber-950/50 transition-all duration-200 flex items-center justify-center space-x-1.5 text-sm"
              >
                <SearchIcon size={16} className="text-slate-950" />
                <span>장인 조회</span>
              </button>
            </div>

          </div>

          {/* Quick Pick Pills & Sort Option */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-slate-400 font-bold mr-1">🔥 빠른 선택:</span>
              <button
                type="button"
                onClick={() => setSelectedChampion("전체")}
                className={`px-2.5 py-1 rounded-lg font-bold transition ${
                  selectedChampion === "전체"
                    ? "bg-amber-500 text-slate-950"
                    : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                }`}
              >
                전체
              </button>
              {popularPills.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedChampion(c)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition ${
                    selectedChampion === c
                      ? "bg-amber-500 text-slate-950"
                      : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-slate-400 font-medium">정렬:</span>
              <button
                type="button"
                onClick={() => setSortBy("winRate")}
                className={`px-2.5 py-1 rounded-lg font-bold transition ${
                  sortBy === "winRate" ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40" : "text-slate-400 hover:text-white"
                }`}
              >
                승률 높은 순
              </button>
              <button
                type="button"
                onClick={() => setSortBy("total")}
                className={`px-2.5 py-1 rounded-lg font-bold transition ${
                  sortBy === "total" ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40" : "text-slate-400 hover:text-white"
                }`}
              >
                판수 많은 순
              </button>
            </div>
          </div>
        </form>

      </section>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 1) 조회 전: 깔끔한 대기 화면 (빈칸/안내 카드) */}
      {/* ─────────────────────────────────────────────────────────── */}
      {!hasSearched && (
        <section className="bg-slate-900/40 border border-slate-800/60 rounded-3xl p-12 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
            <TrophyIcon size={32} />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="text-lg font-bold text-slate-200">
              조회할 조건을 설정하고 [장인 조회] 버튼을 눌러주세요!
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              원하는 챔피언, 티어 범위, 최소 판수(5판+/10판+/30판+/50판+)를 선택한 뒤 조회하시면 상위 장인 랭커와 통계가 표시됩니다.
            </p>
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 2) 조회 후: 👑 TOP 3 포디움 하이라이트 */}
      {/* ─────────────────────────────────────────────────────────── */}
      {hasSearched && specialistRankings.length > 0 && (
        <section className="space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-white flex items-center space-x-2">
              <SparklesIcon size={20} className="text-amber-400" />
              <span>
                {appliedFilter.champion === "전체" ? "전체 챔피언 최고 장인" : `[${appliedFilter.champion}] 장인왕 랭킹 TOP 3`}
              </span>
            </h3>
            <span className="text-xs text-slate-400 font-semibold">
              총 <strong className="text-amber-400">{specialistRankings.length}명</strong>의 장인 집계됨
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
            
            {/* 🥈 2위 포디움 */}
            {top2 ? (
              <div 
                onClick={() => onSearchPlayer(top2.playerName)}
                className="order-2 md:order-1 bg-slate-900/90 border border-slate-700/80 hover:border-slate-500 rounded-3xl p-6 shadow-xl relative overflow-hidden group cursor-pointer transition hover:scale-[1.02]"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-slate-400/5 blur-2xl rounded-full pointer-events-none" />
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-black text-slate-300">🥈 2위</span>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {getRankBadgeTitle(top2.winRate, top2.total)}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="text-lg font-black text-white group-hover:text-cyan-400 transition truncate">
                    {top2.playerName}
                  </div>
                  <div className="text-xs text-slate-400 flex items-center space-x-2">
                    <span className="font-bold text-amber-400">{top2.champion}</span>
                    <span>•</span>
                    <span>{top2.tier}</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
                  <div className="text-xs text-slate-400">
                    {top2.total}전 {top2.wins}승 {top2.losses}패
                  </div>
                  <div className="text-xl font-black text-slate-200">
                    {top2.winRate}%
                  </div>
                </div>
              </div>
            ) : <div className="hidden md:block order-1" />}

            {/* 🥇 1위 장인왕 포디움 (가장 돋보임) */}
            {top1 && (
              <div 
                onClick={() => onSearchPlayer(top1.playerName)}
                className="order-1 md:order-2 bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-900 border-2 border-amber-500/60 hover:border-amber-400 rounded-3xl p-7 shadow-2xl shadow-amber-950/40 relative overflow-hidden group cursor-pointer transition hover:scale-[1.03] md:-translate-y-2"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-amber-500/10 blur-3xl rounded-full pointer-events-none" />
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-black text-amber-400">🥇 1위 (장인왕)</span>
                  <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-amber-500 text-slate-950 shadow-md">
                    {getRankBadgeTitle(top1.winRate, top1.total)}
                  </span>
                </div>
                <div className="space-y-1.5">
                  <div className="text-2xl font-black text-white group-hover:text-amber-300 transition truncate">
                    {top1.playerName}
                  </div>
                  <div className="text-sm text-slate-300 flex items-center space-x-2">
                    <span className="font-extrabold text-amber-400">{top1.champion}</span>
                    <span>•</span>
                    <span className="text-cyan-400 font-bold">{top1.line}</span>
                    <span>•</span>
                    <span>{top1.tier}</span>
                  </div>
                </div>
                <div className="mt-5 pt-4 border-t border-amber-500/20 flex items-center justify-between">
                  <div className="text-sm text-slate-300 font-semibold">
                    총 <strong className="text-white">{top1.total}전</strong> ({top1.wins}승 {top1.losses}패)
                  </div>
                  <div className="text-3xl font-black text-amber-400">
                    {top1.winRate}%
                  </div>
                </div>
              </div>
            )}

            {/* 🥉 3위 포디움 */}
            {top3 ? (
              <div 
                onClick={() => onSearchPlayer(top3.playerName)}
                className="order-3 bg-slate-900/90 border border-amber-900/40 hover:border-amber-700/60 rounded-3xl p-6 shadow-xl relative overflow-hidden group cursor-pointer transition hover:scale-[1.02]"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-700/5 blur-2xl rounded-full pointer-events-none" />
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-black text-amber-600">🥉 3위</span>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-400 border border-amber-800">
                    {getRankBadgeTitle(top3.winRate, top3.total)}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="text-lg font-black text-white group-hover:text-cyan-400 transition truncate">
                    {top3.playerName}
                  </div>
                  <div className="text-xs text-slate-400 flex items-center space-x-2">
                    <span className="font-bold text-amber-400">{top3.champion}</span>
                    <span>•</span>
                    <span>{top3.tier}</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
                  <div className="text-xs text-slate-400">
                    {top3.total}전 {top3.wins}승 {top3.losses}패
                  </div>
                  <div className="text-xl font-black text-amber-500">
                    {top3.winRate}%
                  </div>
                </div>
              </div>
            ) : <div className="hidden md:block order-3" />}

          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 3) 조회 후: 📋 전체 장인 랭킹 테이블 */}
      {/* ─────────────────────────────────────────────────────────── */}
      {hasSearched && (
        <section className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl space-y-4 animate-in fade-in duration-300">
          <div className="px-6 py-5 bg-slate-900/90 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <span>📋 전체 장인 랭킹 목록</span>
                <span className="text-xs font-normal text-slate-400">
                  (소환사명을 클릭하면 개인 전적을 조회합니다)
                </span>
              </h3>
            </div>
            <div className="text-xs text-slate-400">
              조건: <strong className="text-amber-400">{appliedFilter.champion}</strong> / <strong className="text-cyan-400">{appliedFilter.tier === "all" ? "전체티어" : appliedFilter.tier}</strong> / 최소 <strong className="text-indigo-400">{appliedFilter.minGames}판</strong>
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
                    <th className="py-3 px-6">주라인 / 티어</th>
                    <th className="py-3 px-6 text-center">총 판수</th>
                    <th className="py-3 px-6 text-center">승 / 패</th>
                    <th className="py-3 px-6 text-right">승률</th>
                    <th className="py-3 px-6 text-center">장인 등급</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {specialistRankings.map((item, idx) => {
                    const isTop1 = idx === 0;
                    const isTop2 = idx === 1;
                    const isTop3 = idx === 2;

                    return (
                      <tr 
                        key={`${item.playerName}_${item.champion}_${idx}`}
                        className={`hover:bg-amber-950/15 transition group ${
                          isTop1 ? "bg-amber-950/10" : ""
                        }`}
                      >
                        {/* 순위 */}
                        <td className="py-4 px-6 font-extrabold text-slate-300">
                          {isTop1 ? "🥇 1위" : isTop2 ? "🥈 2위" : isTop3 ? "🥉 3위" : `${idx + 1}위`}
                        </td>

                        {/* 소환사명 (Clickable) */}
                        <td className="py-4 px-6">
                          <button
                            type="button"
                            onClick={() => onSearchPlayer(item.playerName)}
                            className="font-bold text-slate-100 group-hover:text-amber-400 group-hover:underline transition flex items-center space-x-1.5 text-left"
                            title={`${item.playerName} 개인 전적 조회`}
                          >
                            <span>{item.playerName}</span>
                            <span className="text-xs text-slate-500 group-hover:text-amber-400/80">↗</span>
                          </button>
                        </td>

                        {/* 챔피언 */}
                        <td className="py-4 px-6">
                          <span className="font-extrabold text-amber-400 bg-amber-950/40 border border-amber-500/20 px-2.5 py-1 rounded-lg text-xs">
                            {item.champion}
                          </span>
                        </td>

                        {/* 주라인 / 티어 */}
                        <td className="py-4 px-6 text-xs text-slate-300">
                          <span className="text-cyan-400 font-semibold mr-1.5">{item.line}</span>
                          <span className="text-slate-400">({item.tier})</span>
                        </td>

                        {/* 판수 */}
                        <td className="py-4 px-6 text-center font-bold text-slate-300">
                          {item.total}전
                        </td>

                        {/* 승/패 */}
                        <td className="py-4 px-6 text-center text-xs text-slate-400 font-medium">
                          <span className="text-emerald-400 font-bold">{item.wins}승</span>
                          <span className="mx-1">/</span>
                          <span className="text-rose-400 font-bold">{item.losses}패</span>
                        </td>

                        {/* 승률 */}
                        <td className="py-4 px-6 text-right">
                          <div className="font-black text-base text-amber-400">
                            {item.winRate}%
                          </div>
                          <div className="w-20 ml-auto bg-slate-800 rounded-full h-1.5 mt-1 overflow-hidden">
                            <div 
                              className="bg-gradient-to-r from-amber-500 to-emerald-400 h-1.5 rounded-full"
                              style={{ width: `${item.winRate}%` }}
                            />
                          </div>
                        </td>

                        {/* 칭호 */}
                        <td className="py-4 px-6 text-center">
                          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                            item.winRate >= 80 
                              ? "bg-amber-950 text-amber-300 border-amber-500/40" 
                              : item.winRate >= 60 
                              ? "bg-cyan-950 text-cyan-300 border-cyan-500/30"
                              : "bg-slate-800 text-slate-400 border-slate-700"
                          }`}>
                            {getRankBadgeTitle(item.winRate, item.total)}
                          </span>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-16 text-center space-y-3">
              <div className="text-3xl">🔍</div>
              <p className="text-sm font-bold text-slate-300">
                선택한 조건에 해당하는 장인 랭커가 없습니다.
              </p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                현재 조건({appliedFilter.champion} / 최소 {appliedFilter.minGames}판)에 맞는 플레이어가 아직 없습니다. 최소 판수를 5판 또는 10판으로 변경해 보세요!
              </p>
            </div>
          )}

        </section>
      )}

    </main>
  );
};

window.AwardPage = AwardPage;
