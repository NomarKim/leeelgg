// Top Search Filter inside Analytics Dashboard
const SearchFilter = ({
  searchName,
  setSearchName,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  appliedPlayer,
  onInquire,
  allPlayerNames = []
}) => {
  const { useState, useMemo } = React;
  const { SearchIcon, CalendarIcon, UserIcon } = window.Icons;
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = useMemo(() => {
    if (!searchName) return [];
    return allPlayerNames.filter(name => 
      name.toLowerCase().includes(searchName.toLowerCase()) && name !== appliedPlayer
    ).slice(0, 10);
  }, [searchName, allPlayerNames, appliedPlayer]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onInquire();
    }
  };

  return (
    <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl relative z-30">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
        {/* Player Name Search Input */}
        <div className="lg:col-span-4 relative">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
            <UserIcon />
            <span>시참 유저명 선택</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchName}
              onChange={(e) => {
                setSearchName(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={handleKeyDown}
              placeholder="닉네임 또는 게임 아이디 입력"
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl pl-11 pr-28 py-3 text-slate-100 placeholder-slate-500 transition duration-200 outline-none"
            />
            <div className="absolute left-4 top-3.5"><SearchIcon /></div>
            
            {appliedPlayer && (
              <div className="absolute right-3 top-2.5 bg-slate-800 text-[11px] px-2.5 py-1 rounded-md text-slate-400 border border-slate-700 pointer-events-none">
                현재: <span className="text-cyan-400 font-bold">{appliedPlayer}</span>
              </div>
            )}
          </div>

          {showSuggestions && filteredSuggestions.length > 0 && (
            <>
              <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setShowSuggestions(false)} />
              <ul className="absolute left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl max-h-60 overflow-y-auto z-50 divide-y divide-slate-800">
                {filteredSuggestions.map((name) => (
                  <li key={name}>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchName(name);
                        setShowSuggestions(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-slate-800 transition duration-150 flex items-center justify-between text-sm"
                    >
                      <span className="font-semibold text-slate-200">{name}</span>
                      <span className="text-xs text-slate-500">선택</span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {/* Date Inputs */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <CalendarIcon />
              <span>조회 시작일</span>
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-slate-900 border-2 border-slate-700 hover:border-cyan-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-950 rounded-xl px-4 py-2.5 text-slate-100 font-bold transition duration-200 outline-none cursor-pointer shadow-lg shadow-black/30 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <CalendarIcon />
              <span>조회 종료일</span>
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-slate-900 border-2 border-slate-700 hover:border-cyan-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-950 rounded-xl px-4 py-2.5 text-slate-100 font-bold transition duration-200 outline-none cursor-pointer shadow-lg shadow-black/30 text-sm"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="lg:col-span-3">
          <button
            type="button"
            onClick={onInquire}
            className="w-full bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold py-3 px-5 rounded-xl shadow-lg shadow-cyan-950/20 transition-all duration-200 flex items-center justify-center space-x-2 text-sm"
          >
            <SearchIcon size={16} />
            <span>조회하기 (업데이트)</span>
          </button>
        </div>
      </div>
    </section>
  );
};

window.SearchFilter = SearchFilter;
