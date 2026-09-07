// LeeeL's Guide - 3. 룰렛 확률 (위플랩 WEFLAB 실시간 룰렛 후원 확률표)
const RouletteOddsPage = ({ onGoHome, onGoGuide, onGoInventory }) => {
  const { useState, useEffect, useMemo } = React;
  const { 
    SparklesIcon, ArrowLeftIcon, ArrowRightIcon, BookOpenIcon, GiftIcon, 
    SearchIcon, RefreshIcon, TrophyIcon, ShieldIcon, FlameIcon, InfoIcon, CheckIcon 
  } = window.Icons;

  const [rouletteData, setRouletteData] = useState(() => window.RouletteApi ? window.RouletteApi.DEFAULT_DATA : { categories: [] });
  const [loading, setLoading] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("all");
  
  // Interactive Simulation State per Roulette Card
  const [simResults, setSimResults] = useState({});
  const [isSpinning, setIsSpinning] = useState({});

  // Initial and on-demand live fetch
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (window.RouletteApi && window.RouletteApi.fetchLiveOdds) {
        const live = await window.RouletteApi.fetchLiveOdds();
        if (live && live.categories) {
          setRouletteData(live);
          setLastSyncTime(new Date().toLocaleTimeString("ko-KR"));
        }
      }
    } catch (err) {
      console.warn("Roulette live sync error:", err);
    } finally {
      setLoading(false);
    }
  };

  const categories = rouletteData.categories || [];

  // Filter categories by group and search query
  const filteredCategories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return categories.filter((cat) => {
      // Group filter
      if (selectedGroup !== "all") {
        if (selectedGroup === "kill_shield") {
          if (cat.group !== "kill" && cat.group !== "shield") return false;
        } else if (selectedGroup === "ingame") {
          if (cat.group !== "ingame") return false;
        } else if (selectedGroup === "fan") {
          if (cat.group !== "fan") return false;
        } else if (selectedGroup === "sig") {
          if (cat.group !== "sig") return false;
        } else if (selectedGroup === "special") {
          if (cat.group !== "special") return false;
        }
      }

      // Search query filter
      if (q) {
        const titleMatch = cat.title.toLowerCase().includes(q);
        const countMatch = String(cat.count || "").toLowerCase().includes(q);
        const itemMatch = cat.items.some(it => it.name.toLowerCase().includes(q));
        return titleMatch || countMatch || itemMatch;
      }

      return true;
    });
  }, [categories, selectedGroup, searchQuery]);

  // Simulate 1 random spin based on real probabilities
  const handleSimulateSpin = (catId, items) => {
    if (isSpinning[catId]) return;
    
    setIsSpinning(prev => ({ ...prev, [catId]: true }));
    
    setTimeout(() => {
      const totalPct = items.reduce((sum, it) => sum + it.percent, 0);
      const rand = Math.random() * (totalPct > 0 ? totalPct : 100);
      
      let acc = 0;
      let wonItem = items[0];
      for (const it of items) {
        acc += it.percent;
        if (rand <= acc) {
          wonItem = it;
          break;
        }
      }
      
      setSimResults(prev => ({ ...prev, [catId]: wonItem }));
      setIsSpinning(prev => ({ ...prev, [catId]: false }));
    }, 450);
  };

  // Group tab definition
  const groupTabs = [
    { id: "all", label: "전체 룰렛", count: categories.length },
    { id: "ingame", label: "🎮 내전 룰렛 (50/121/200/221/1421)", count: categories.filter(c => c.group === "ingame").length },
    { id: "kill_shield", label: "⚔️ 킬/실드 룰렛 (33/34/333/334)", count: categories.filter(c => c.group === "kill" || c.group === "shield").length },
    { id: "fan", label: "✨ 팬서비스/잡다 (21/55/421)", count: categories.filter(c => c.group === "fan").length },
    { id: "sig", label: "💎 개인 시그니처 (135/187/321)", count: categories.filter(c => c.group === "sig").length },
    { id: "special", label: "🎁 스페셜 룰렛 (10000/14121)", count: categories.filter(c => c.group === "special").length }
  ];

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-200">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            <SparklesIcon size={14} />
            <span>LeeeL's Guide - 3. 룰렛 확률</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center space-x-3">
            <span>룰렛 후원 확률표</span>
          </h2>
          <p className="text-sm text-slate-400">
            SOOP 스트리머 <strong className="text-white">리엘*</strong>님의 공식 위플랩(WEFLAB) 룰렛 설정값과 항목별 당첨 확률입니다.
          </p>
        </div>

        {/* Action Button Navigation */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={fetchData}
            disabled={loading}
            className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs sm:text-sm font-bold text-emerald-400 transition cursor-pointer disabled:opacity-50"
            title="위플랩 페이지에서 최신 룰렛 확률 다시 불러오기"
          >
            <RefreshIcon size={15} className={loading ? "animate-spin text-emerald-400" : ""} />
            <span>{loading ? "동기화 중..." : "실시간 동기화"}</span>
          </button>

          <a
            href="https://weflab.com/user/lOPU2suSkmBsZg"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-300 transition"
          >
            <span>위플랩 원본 ↗</span>
          </a>

          {onGoInventory && (
            <button
              onClick={onGoInventory}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-amber-400 transition cursor-pointer"
            >
              <GiftIcon size={15} />
              <span>아이템 현황</span>
            </button>
          )}

          {onGoGuide && (
            <button
              onClick={onGoGuide}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-sky-400 transition cursor-pointer"
            >
              <BookOpenIcon size={15} />
              <span>시참 룰북</span>
            </button>
          )}

          <button
            onClick={onGoHome}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sm font-semibold text-slate-200 transition cursor-pointer"
          >
            <ArrowLeftIcon size={16} />
            <span>메인으로</span>
          </button>
        </div>
      </div>

      {/* Info Status Banner */}
      <section className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/20 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
            <InfoIcon size={20} />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-bold text-white">리엘* 위플랩 실시간 연동 완료</span>
              <span className="text-[11px] font-semibold text-slate-400 bg-slate-950 px-2.5 py-0.5 rounded-md border border-slate-800">
                마지막 수정: {rouletteData.lastModified || "2026년 05월 05일"}
              </span>
              {lastSyncTime && (
                <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-500/30">
                  ⚡ {lastSyncTime} 동기화됨
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              * 스트리머가 후원 알림 및 룰렛 후원을 사용하지 않을 경우 룰렛은 돌아가지 않습니다.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <span className="text-xs font-bold text-slate-400">총 룰렛 종류:</span>
          <span className="px-3 py-1 rounded-xl bg-emerald-950 text-emerald-300 font-black text-sm border border-emerald-500/40">
            {categories.length}개 세팅됨
          </span>
        </div>
      </section>

      {/* Search and Category Filter Bar */}
      <div className="space-y-4">
        
        {/* Search Input Bar */}
        <div className="relative">
          <div className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="룰렛 이름 또는 당첨 아이템명 검색 (예: 킬, 한판더, 선참권, 듀오권, 식데, 121)..."
              className="w-full bg-slate-900 border-2 border-slate-800 focus:border-emerald-500 rounded-2xl pl-11 pr-24 py-3.5 text-sm sm:text-base text-slate-100 font-bold placeholder-slate-500 outline-none transition shadow-inner"
            />
            <div className="absolute left-3.5 text-slate-400">
              <SearchIcon size={20} className="text-emerald-400" />
            </div>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg transition font-semibold cursor-pointer"
              >
                지우기
              </button>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs sm:text-sm font-bold scrollbar-none">
          {groupTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedGroup(tab.id)}
              className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition cursor-pointer flex items-center space-x-1.5 ${
                selectedGroup === tab.id
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-950/50"
                  : "bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800"
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                selectedGroup === tab.id ? "bg-emerald-700 text-white" : "bg-slate-800 text-slate-400"
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Roulette Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCategories.map((cat) => {
          const simWon = simResults[cat.id];
          const spinning = isSpinning[cat.id];

          return (
            <div 
              key={cat.id} 
              className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-3xl p-5 shadow-xl flex flex-col justify-between space-y-4 backdrop-blur-sm transition-all duration-200"
            >
              
              {/* Card Header */}
              <div className="space-y-2 border-b border-slate-800 pb-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base sm:text-lg font-black text-white leading-snug">
                    {cat.title}
                  </h3>
                  <span className="px-2.5 py-1 rounded-xl bg-emerald-950/90 text-emerald-300 font-extrabold text-xs border border-emerald-500/40 shrink-0">
                    🎈 {cat.count ? (isNaN(Number(cat.count)) ? `${cat.count}개` : `${Number(cat.count).toLocaleString()}개`) : "특수"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>항목 수: <strong className="text-slate-200">{cat.itemCount}종류</strong></span>
                  <span className="text-slate-500">위플랩 공식 확률</span>
                </div>
              </div>

              {/* Items & Probability Bars List */}
              <div className="flex-1 space-y-2 max-h-[360px] overflow-y-auto pr-1">
                {cat.items.map((item, idx) => {
                  const pct = item.percent;
                  const isUltraRare = pct <= 1.0;
                  const isHigh = pct >= 30.0;
                  const isMatch = searchQuery && item.name.toLowerCase().includes(searchQuery.toLowerCase());

                  let barColor = "from-cyan-500 to-sky-500";
                  if (isUltraRare) barColor = "from-amber-400 to-rose-500";
                  else if (isHigh) barColor = "from-emerald-500 to-teal-500";

                  return (
                    <div 
                      key={idx}
                      className={`p-2.5 rounded-xl border transition-all ${
                        isMatch 
                          ? "bg-amber-950/40 border-amber-500/50" 
                          : "bg-slate-950/70 border-slate-800/80 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 text-xs mb-1.5">
                        <div className="flex items-center space-x-1.5 truncate">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            item.type === "계산" 
                              ? "bg-indigo-950 text-indigo-300 border border-indigo-500/30" 
                              : "bg-slate-800 text-slate-300"
                          }`}>
                            {item.type || "텍스트"}
                          </span>
                          <span className={`font-bold truncate ${isMatch ? "text-amber-300 font-black" : "text-slate-200"}`}>
                            {item.name}
                          </span>
                        </div>
                        <span className={`font-black text-xs shrink-0 ${
                          isUltraRare ? "text-rose-400" : isHigh ? "text-emerald-400" : "text-cyan-300"
                        }`}>
                          {item.percentStr}
                        </span>
                      </div>

                      {/* Visual Probability Bar */}
                      <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-500`}
                          style={{ width: `${Math.min(Math.max(pct, 2), 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Simulation Quick Footer */}
              <div className="pt-2 border-t border-slate-800/80">
                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleSimulateSpin(cat.id, cat.items)}
                    disabled={spinning}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 active:scale-[0.98] border border-slate-700 text-xs font-bold text-slate-200 transition flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <SparklesIcon size={14} className={spinning ? "animate-spin text-amber-400" : "text-emerald-400"} />
                    <span>{spinning ? "룰렛 추첨 중..." : "🎲 1회 모의 추첨"}</span>
                  </button>
                </div>

                {/* Simulation Result Toast */}
                {simWon && (
                  <div className="mt-2 p-2 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-between text-xs animate-in fade-in zoom-in duration-200">
                    <span className="text-[11px] text-slate-400 font-semibold">당첨 결과:</span>
                    <span className="font-black text-amber-300 flex items-center space-x-1">
                      <span>🎉</span>
                      <span>{simWon.name}</span>
                      <span className="text-[10px] text-slate-400 font-normal">({simWon.percentStr})</span>
                    </span>
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {filteredCategories.length === 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
          <div className="text-3xl">🔍</div>
          <h3 className="text-lg font-bold text-white">일치하는 룰렛이 없습니다</h3>
          <p className="text-xs text-slate-400">검색어를 변경하시거나 다른 카테고리 탭을 선택해 보세요.</p>
        </div>
      )}

    </main>
  );
};

window.RouletteOddsPage = RouletteOddsPage;
