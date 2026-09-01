// LeeeL's Award Page Component (Strictly Minimal - Under Development)
const AwardPage = ({ onGoHome }) => {
  const { TrophyIcon, ArrowLeftIcon } = window.Icons;

  return (
    <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-28 flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in duration-200">
      
      {/* Minimal Icon */}
      <div className="h-20 w-20 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 flex items-center justify-center shadow-2xl">
        <TrophyIcon size={36} />
      </div>

      {/* Strict Minimal Title */}
      <div className="space-y-1">
        <h2 className="text-3xl font-black text-white tracking-tight">
          LeeeL's Award
        </h2>
        <p className="text-slate-500 text-sm font-semibold">
          개발 예정
        </p>
      </div>

      {/* Back Button */}
      <div className="pt-2">
        <button
          onClick={onGoHome}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-300 transition"
        >
          <ArrowLeftIcon size={14} />
          <span>메인으로 돌아가기</span>
        </button>
      </div>

    </main>
  );
};

window.AwardPage = AwardPage;
