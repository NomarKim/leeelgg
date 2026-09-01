// LeeeL's Award Page Component (Coming Soon / Under Development)
const AwardPage = ({ onGoHome }) => {
  const { TrophyIcon, ArrowLeftIcon } = window.Icons;

  return (
    <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in duration-200">
      
      {/* Icon */}
      <div className="h-24 w-24 rounded-3xl bg-amber-500/10 border-2 border-amber-500/30 text-amber-400 flex items-center justify-center shadow-2xl shadow-amber-950/40 animate-pulse">
        <TrophyIcon size={44} />
      </div>

      {/* Titles */}
      <div className="space-y-2 max-w-lg">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-400 text-xs font-bold">
          <span>COMING SOON</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          LeeeL's Award
        </h2>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed pt-1">
          현재 개발 중인 기능입니다.<br />
          새로운 시즌 명예의 전당과 특별 어워드가 곧 공개됩니다!
        </p>
      </div>

      {/* Action */}
      <div className="pt-4">
        <button
          onClick={onGoHome}
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sm font-bold text-slate-200 transition"
        >
          <ArrowLeftIcon size={16} />
          <span>메인으로 돌아가기</span>
        </button>
      </div>

    </main>
  );
};

window.AwardPage = AwardPage;
