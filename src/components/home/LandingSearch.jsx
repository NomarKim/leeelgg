// OP.GG Style Home Landing Page Component
const LandingSearch = ({ 
  allPlayerNames = [],
  onSearch,
  initialStartDate,
  initialEndDate
}) => {
  const { useState, useMemo } = React;
  const { SearchIcon, CalendarIcon } = window.Icons;

  const [inputName, setInputName] = useState("");
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [showDropdown, setShowDropdown] = useState(false);

  // Suggestions filtered by user input
  const suggestions = useMemo(() => {
    const query = inputName.trim().toLowerCase();
    if (!query) return allPlayerNames.slice(0, 8);
    return allPlayerNames
      .filter(name => name.toLowerCase().includes(query))
      .slice(0, 10);
  }, [inputName, allPlayerNames]);

  const handleSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const target = inputName.trim();
    if (!target) {
      alert("조회할 소환사명(유저명)을 입력해 주세요.");
      return;
    }
    onSearch(target, startDate, endDate);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12 lg:py-24 relative overflow-hidden">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-600/15 via-indigo-600/15 to-purple-600/10 blur-[120px] pointer-events-none -z-10 rounded-full" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-cyan-500/5 blur-[90px] pointer-events-none -z-10 rounded-full" />
      
      {/* Hero Header Section - Clean Centered LeeeL.GG */}
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-8 sm:mb-12">
        <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-white flex items-center justify-center">
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent drop-shadow-sm">
            LeeeL.GG
          </span>
        </h1>
      </div>

      {/* Main OP.GG Search Box Container */}
      <div className="w-full max-w-3xl relative z-30">
        <form 
          onSubmit={handleSubmit}
          className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl shadow-black/60 space-y-4 transition hover:border-slate-700"
        >
          {/* Main User Input Field */}
          <div className="relative">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                <span>소환사명 / 시참 유저 검색</span>
              </span>
              <span className="text-[11px] text-slate-500 font-normal">총 {allPlayerNames.length}명 등록됨</span>
            </label>
            
            <div className="relative">
              <input
                type="text"
                value={inputName}
                onChange={(e) => {
                  setInputName(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                placeholder="조회할 닉네임 또는 게임 아이디 입력 (예: 리엘)"
                className="w-full bg-slate-950/90 border-2 border-slate-800 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 rounded-2xl pl-12 pr-4 py-4 text-base sm:text-lg text-slate-100 font-semibold placeholder-slate-500 transition duration-200 outline-none shadow-inner"
              />
              <div className="absolute left-4 top-4 text-slate-400">
                <SearchIcon size={22} className="text-cyan-400" />
              </div>

              {inputName && (
                <button
                  type="button"
                  onClick={() => setInputName("")}
                  className="absolute right-4 top-4 text-xs bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white px-2 py-1 rounded-md transition"
                >
                  지우기
                </button>
              )}
            </div>

            {/* Suggestions Dropdown */}
            {showDropdown && suggestions.length > 0 && (
              <>
                <div 
                  className="fixed inset-0 z-40 bg-transparent"
                  onClick={() => setShowDropdown(false)} 
                />
                <ul className="absolute left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-h-64 overflow-y-auto z-50 divide-y divide-slate-800/80 animate-in fade-in zoom-in-95 duration-150">
                  <li className="px-4 py-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-950/40">
                    추천 유저 목록
                  </li>
                  {suggestions.map((name) => (
                    <li key={name}>
                      <button
                        type="button"
                        onClick={() => {
                          setInputName(name);
                          setShowDropdown(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-cyan-950/40 hover:text-cyan-300 transition duration-150 flex items-center justify-between text-sm group"
                      >
                        <span className="font-semibold text-slate-200 group-hover:text-cyan-400">{name}</span>
                        <span className="text-xs text-slate-500 group-hover:text-cyan-400/80 font-medium">선택하기 →</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          {/* Date Range & Submit Row */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
            
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

            {/* Big OP.GG Action Button */}
            <div className="sm:col-span-4 flex items-end">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 active:scale-[0.98] text-white font-extrabold py-3 px-5 rounded-xl shadow-lg shadow-cyan-950/50 transition-all duration-200 flex items-center justify-center space-x-2 text-base"
              >
                <span>.GG 전적 조회</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>
        </form>
      </div>

    </div>
  );
};

window.LandingSearch = LandingSearch;
