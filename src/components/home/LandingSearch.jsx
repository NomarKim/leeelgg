// OP.GG Style Home Landing Page Component with 3 Category Cards
const LandingSearch = ({ 
  allPlayerNames = [],
  onSearch,
  onNavigate,
  initialStartDate,
  initialEndDate
}) => {
  const { useState, useMemo } = React;
  const { SearchIcon, CalendarIcon, BookOpenIcon, BarChartIcon, TrophyIcon, ArrowRightIcon, GiftIcon, SparklesIcon, FlameIcon } = window.Icons;

  const [inputName, setInputName] = useState("");
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [showDropdown, setShowDropdown] = useState(false);

  // Suggestions filtered by user input
  const suggestions = useMemo(() => {
    const query = inputName.trim().toLowerCase();
    if (!query) return allPlayerNames.slice(0, 8);
    return allPlayerNames
      .filter((name) => name.toLowerCase().includes(query))
      .slice(0, 8);
  }, [inputName, allPlayerNames]);

  const handleSelectSuggestion = (name) => {
    setInputName(name);
    setShowDropdown(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(inputName, startDate, endDate);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-10 sm:py-16 max-w-5xl mx-auto w-full animate-in fade-in duration-200">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-600/15 via-indigo-600/15 to-purple-600/10 blur-[120px] pointer-events-none -z-10 rounded-full" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-cyan-500/5 blur-[90px] pointer-events-none -z-10 rounded-full" />
      
      {/* Brand Hero Banner */}
      <div className="text-center space-y-4 mb-8 sm:mb-12">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 text-xs font-bold tracking-wide shadow-inner">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span>SOOP 방송국 공식 실시간 전적 데이터</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-none">
          LeeeL<span className="text-cyan-400">.GG</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-lg mx-auto font-medium">
          소환사명을 입력하고 내전 전적, 맞대결 승률, 포지션 랭킹을 한눈에 조회하세요.
        </p>
      </div>

      {/* Main Search Panel (OP.GG / LOL.PS style) */}
      <div className="w-full max-w-2xl bg-slate-900/90 border border-slate-800 shadow-2xl rounded-3xl p-4 sm:p-6 backdrop-blur-md relative">
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Summoner Name Input with Autocomplete */}
          <div className="relative">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <SearchIcon size={14} className="text-cyan-400" />
              <span>소환사명 검색</span>
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                value={inputName}
                onChange={(e) => {
                  setInputName(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                placeholder="소환사명을 입력하세요 (예: 리엘, 도비, 독사, 낑콩)"
                className="w-full bg-slate-950 border-2 border-slate-800 hover:border-cyan-500/50 focus:border-cyan-500 rounded-2xl pl-12 pr-28 py-3.5 sm:py-4 text-base sm:text-lg text-slate-100 font-bold placeholder-slate-500 outline-none transition duration-200 shadow-inner"
              />
              <div className="absolute left-4 text-slate-500">
                <SearchIcon size={20} className="text-cyan-400" />
              </div>

              {/* Quick default user button */}
              <button
                type="button"
                onClick={() => setInputName("리엘")}
                className="absolute right-3 px-3 py-1.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-xs font-bold transition"
              >
                방장 (리엘)
              </button>
            </div>

            {/* Autocomplete Dropdown */}
            {showDropdown && suggestions.length > 0 && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowDropdown(false)}
                />
                <div className="absolute left-0 right-0 top-full mt-2 bg-slate-900 border border-slate-750 rounded-2xl shadow-2xl overflow-hidden z-20 divide-y divide-slate-800/80 animate-in fade-in duration-150">
                  <div className="px-4 py-2 bg-slate-950/60 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    등록된 소환사 목록
                  </div>
                  {suggestions.map((name) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => handleSelectSuggestion(name)}
                      className="w-full text-left px-4 py-3 text-sm font-semibold text-slate-200 hover:bg-cyan-950/30 hover:text-cyan-300 transition flex items-center justify-between group"
                    >
                      <span>{name}</span>
                      <span className="text-xs text-slate-500 group-hover:text-cyan-400 transition">선택 ↵</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Date Filter & Action Button */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
            {/* Start Date */}
            <div className="sm:col-span-4">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
                <CalendarIcon size={14} />
                <span>조회 시작일</span>
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-950 border-2 border-slate-800 hover:border-cyan-500/50 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 font-semibold transition outline-none cursor-pointer"
              />
            </div>

            {/* End Date */}
            <div className="sm:col-span-4">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
                <CalendarIcon size={14} />
                <span>조회 종료일</span>
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-slate-950 border-2 border-slate-800 hover:border-cyan-500/50 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 font-semibold transition outline-none cursor-pointer"
              />
            </div>

            {/* Big Action Button */}
            <div className="sm:col-span-4 flex items-end">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 active:scale-[0.98] text-white font-extrabold py-3 px-5 rounded-xl shadow-lg shadow-cyan-950/50 transition-all duration-200 flex items-center justify-center space-x-2 text-base"
              >
                <span>조회</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* 3 Main Category Shortcut Cards */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-12 sm:mt-16">
        
        {/* Card 1: LeeeL's Guide (시참 룰북 & 아이템 보유 현황 하위 2개 메뉴 리스트) */}
        <div 
          className="group/card bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-sky-500/50 rounded-2xl p-6 flex flex-col justify-between shadow-xl backdrop-blur-sm transition-all duration-300"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 group-hover/card:scale-110 transition duration-300">
                <BookOpenIcon size={24} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-sky-950 text-sky-400 border border-sky-500/30">
                GUIDE
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white group-hover/card:text-sky-300 transition">
                LeeeL's Guide
              </h3>
              <p className="text-xs text-sky-400 font-semibold mt-0.5">내전 규칙 & 아이템 현황</p>
            </div>

            {/* 하위 2개 메뉴 리스트 */}
            <div className="space-y-2.5 pt-2">
              {/* Menu 1: 내전 시참 공식 룰북 */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate("guide");
                }}
                className="w-full text-left p-3 rounded-xl bg-slate-950/80 hover:bg-slate-800/90 border border-slate-800 hover:border-sky-500/60 active:scale-[0.98] transition-all duration-200 group/btn flex items-center justify-between cursor-pointer shadow-sm hover:shadow-sky-950/30"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 group-hover/btn:scale-110 group-hover/btn:bg-sky-500/20 transition duration-200">
                    <BookOpenIcon size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-200 group-hover/btn:text-sky-300 transition">
                      1. 내전 시참 공식 룰북
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      기본/세부 룰 & 방장 당부 말씀
                    </div>
                  </div>
                </div>
                <div className="p-1 rounded-md text-slate-500 group-hover/btn:text-sky-400 group-hover/btn:translate-x-0.5 transition shrink-0">
                  <ArrowRightIcon size={15} />
                </div>
              </button>

              {/* Menu 2: 아이템 보유 현황 */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate("inventory");
                }}
                className="w-full text-left p-3 rounded-xl bg-slate-950/80 hover:bg-slate-800/90 border border-slate-800 hover:border-amber-500/60 active:scale-[0.98] transition-all duration-200 group/btn flex items-center justify-between cursor-pointer shadow-sm hover:shadow-amber-950/30"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 group-hover/btn:scale-110 group-hover/btn:bg-amber-500/20 transition duration-200">
                    <GiftIcon size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-200 group-hover/btn:text-amber-300 transition">
                      2. 아이템 보유 현황
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      룰렛 아이템, L포인트, 칭찬/데스노트
                    </div>
                  </div>
                </div>
                <div className="p-1 rounded-md text-slate-500 group-hover/btn:text-amber-400 group-hover/btn:translate-x-0.5 transition shrink-0">
                  <ArrowRightIcon size={15} />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Card 2: LeeeL's Record (하위 2개 메뉴 리스트) */}
        <div 
          onClick={() => onNavigate("analytics", inputName, startDate, endDate)}
          className="group/card bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-6 flex flex-col justify-between shadow-xl backdrop-blur-sm transition-all duration-300 cursor-pointer"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 group-hover/card:scale-110 transition duration-300">
                <BarChartIcon size={24} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                RECORD
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white group-hover/card:text-cyan-300 transition">
                LeeeL's Record
              </h3>
              <p className="text-xs text-cyan-400 font-semibold mt-0.5">실시간 내전 데이터 & 랭킹</p>
            </div>

            {/* 하위 2개 클릭 메뉴 버튼 리스트 */}
            <div className="space-y-2.5 pt-2">
              {/* Menu 1: 소환사 전적 & 티어 조회 */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate("analytics", inputName, startDate, endDate);
                }}
                className="w-full text-left p-3 rounded-xl bg-slate-950/80 hover:bg-slate-800/90 border border-slate-800 hover:border-cyan-500/60 active:scale-[0.98] transition-all duration-200 group/btn flex items-center justify-between cursor-pointer shadow-sm hover:shadow-cyan-950/30"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 group-hover/btn:scale-110 group-hover/btn:bg-cyan-500/20 transition duration-200">
                    <BarChartIcon size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-200 group-hover/btn:text-cyan-300 transition">
                      소환사 전적 & 티어 조회
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      개인 승률 및 맞라인 10경기 분석
                    </div>
                  </div>
                </div>
                <div className="p-1 rounded-md text-slate-500 group-hover/btn:text-cyan-400 group-hover/btn:translate-x-0.5 transition shrink-0">
                  <ArrowRightIcon size={15} />
                </div>
              </button>

              {/* Menu 2: 티조위 검거 시트 */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate("ranking");
                }}
                className="w-full text-left p-3 rounded-xl bg-slate-950/80 hover:bg-slate-800/90 border border-slate-800 hover:border-amber-500/60 active:scale-[0.98] transition-all duration-200 group/btn flex items-center justify-between cursor-pointer shadow-sm hover:shadow-amber-950/30"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 group-hover/btn:scale-110 group-hover/btn:bg-amber-500/20 transition duration-200">
                    <TrophyIcon size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-200 group-hover/btn:text-amber-300 transition">
                      티조위 검거 시트
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      최근 2주간 라인별 전적 순위 통한 미리 검거
                    </div>
                  </div>
                </div>
                <div className="p-1 rounded-md text-slate-500 group-hover/btn:text-amber-400 group-hover/btn:translate-x-0.5 transition shrink-0">
                  <ArrowRightIcon size={15} />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Card 3: LeeeL's Award (올해의 유저, 이 달의 유저, 이 주의 유저 하위 메뉴 리스트) */}
        <div 
          className="group/card bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-6 flex flex-col justify-between shadow-xl backdrop-blur-sm transition-all duration-300"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 group-hover/card:scale-110 transition duration-300">
                <TrophyIcon size={24} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-400 border border-amber-500/30">
                AWARD
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white group-hover/card:text-amber-300 transition">
                LeeeL's Award
              </h3>
              <p className="text-xs text-amber-400 font-semibold mt-0.5">명예의 전당 & 어워드</p>
            </div>

            {/* 하위 3개 어워드 메뉴 버튼 리스트 */}
            <div className="space-y-2 pt-1">
              
              {/* Menu 1: 올해의 유저 */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate("yearly-award");
                }}
                className="w-full text-left p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800/90 border border-slate-800 hover:border-amber-500/60 active:scale-[0.98] transition-all duration-200 group/btn flex items-center justify-between cursor-pointer shadow-sm hover:shadow-amber-950/30"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 group-hover/btn:scale-110 group-hover/btn:bg-amber-500/20 transition duration-200">
                    <TrophyIcon size={14} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-200 group-hover/btn:text-amber-300 transition">
                      올해의 유저
                    </div>
                    <div className="text-[10px] text-slate-400">
                      연도별 시참왕 & 승률왕
                    </div>
                  </div>
                </div>
                <div className="p-1 rounded-md text-slate-500 group-hover/btn:text-amber-400 group-hover/btn:translate-x-0.5 transition shrink-0">
                  <ArrowRightIcon size={14} />
                </div>
              </button>

              {/* Menu 2: 이 달의 유저 */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate("monthly-award");
                }}
                className="w-full text-left p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800/90 border border-slate-800 hover:border-indigo-500/60 active:scale-[0.98] transition-all duration-200 group/btn flex items-center justify-between cursor-pointer shadow-sm hover:shadow-indigo-950/30"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 group-hover/btn:scale-110 group-hover/btn:bg-indigo-500/20 transition duration-200">
                    <SparklesIcon size={14} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-200 group-hover/btn:text-indigo-300 transition">
                      이 달의 유저
                    </div>
                    <div className="text-[10px] text-slate-400">
                      월별 시참왕 & 승률왕
                    </div>
                  </div>
                </div>
                <div className="p-1 rounded-md text-slate-500 group-hover/btn:text-indigo-400 group-hover/btn:translate-x-0.5 transition shrink-0">
                  <ArrowRightIcon size={14} />
                </div>
              </button>

              {/* Menu 3: 이 주의 유저 */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate("weekly-award");
                }}
                className="w-full text-left p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800/90 border border-slate-800 hover:border-rose-500/60 active:scale-[0.98] transition-all duration-200 group/btn flex items-center justify-between cursor-pointer shadow-sm hover:shadow-rose-950/30"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 group-hover/btn:scale-110 group-hover/btn:bg-rose-500/20 transition duration-200">
                    <FlameIcon size={14} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-200 group-hover/btn:text-rose-300 transition">
                      이 주의 유저
                    </div>
                    <div className="text-[10px] text-slate-400">
                      주차별 시참왕 & 승률왕
                    </div>
                  </div>
                </div>
                <div className="p-1 rounded-md text-slate-500 group-hover/btn:text-rose-400 group-hover/btn:translate-x-0.5 transition shrink-0">
                  <ArrowRightIcon size={14} />
                </div>
              </button>

              {/* Menu 4: 챔피언별 장인 랭킹 */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate("champion-award");
                }}
                className="w-full text-left p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800/90 border border-slate-800 hover:border-cyan-500/60 active:scale-[0.98] transition-all duration-200 group/btn flex items-center justify-between cursor-pointer shadow-sm hover:shadow-cyan-950/30"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 group-hover/btn:scale-110 transition duration-200">
                    <ShieldIcon size={14} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-200 group-hover/btn:text-cyan-300 transition">
                      챔피언별 장인 랭킹
                    </div>
                    <div className="text-[10px] text-slate-400">
                      티어·챔프·판수 필터 장인 조회
                    </div>
                  </div>
                </div>
                <div className="p-1 rounded-md text-slate-500 group-hover/btn:text-cyan-400 group-hover/btn:translate-x-0.5 transition shrink-0">
                  <ArrowRightIcon size={14} />
                </div>
              </button>

            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

window.LandingSearch = LandingSearch;
