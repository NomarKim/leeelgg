// Side and Line Stats Summary Component
const StatsSummary = ({ stats, sumStats }) => {
  const { ShieldIcon } = window.Icons;

  const renderSideTable = (title, badgeText, badgeColorClass, sideStats, sumData, sumColorClass) => (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
      <div>
        <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2 flex items-center justify-between">
          <span>{title}</span>
          <span className={`text-[10px] border rounded-full px-2.5 py-0.5 font-bold ${badgeColorClass}`}>
            {badgeText}
          </span>
        </h4>
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="text-xs font-semibold text-slate-500 border-b border-slate-800/50">
              <th className="pb-2">라인</th>
              <th className="pb-2 text-center">판수</th>
              <th className="pb-2 text-center text-cyan-400">승</th>
              <th className="pb-2 text-center text-rose-400">패</th>
              <th className="pb-2 text-right">승률</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/30">
            {sideStats.map((r, idx) => {
              const total = r.win + r.loss;
              const winRate = total > 0 ? Math.round((r.win / total) * 100) : 0;
              return (
                <tr key={idx} className="hover:bg-slate-800/20 transition">
                  <td className="py-2.5 font-medium text-slate-300">{r.pos}</td>
                  <td className="py-2.5 text-center text-slate-400">{total}</td>
                  <td className="py-2.5 text-center font-bold text-cyan-400/90">{r.win}</td>
                  <td className="py-2.5 text-center font-bold text-rose-400/90">{r.loss}</td>
                  <td className={`py-2.5 text-right font-semibold ${total > 0 ? "text-slate-200" : "text-slate-600"}`}>
                    {total > 0 ? `${winRate}%` : "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800 bg-slate-950/50 rounded-xl px-4 py-2.5 flex items-center justify-between text-sm font-bold">
        <span className="text-slate-400 uppercase tracking-wider text-xs">SUM 합계</span>
        <div className="flex items-center space-x-4 sm:space-x-6 text-slate-300">
          <span>{sumData.win + sumData.loss}전</span>
          <span className="text-cyan-400">{sumData.win}승</span>
          <span className="text-rose-400">{sumData.loss}패</span>
          <span className={sumColorClass}>
            {sumData.win + sumData.loss > 0 
              ? `${Math.round((sumData.win / (sumData.win + sumData.loss)) * 100)}%` 
              : "-"}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
          <ShieldIcon />
          <span>진영별 / 라인별 통계 (합계 포함)</span>
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* All Sides */}
        {renderSideTable(
          "전체 진영 전적",
          "ALL SIDES",
          "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
          stats.all,
          sumStats.all,
          "bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent font-extrabold"
        )}

        {/* Blue Side */}
        {renderSideTable(
          "블루 진영 전적",
          "BLUE SIDE",
          "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
          stats.blue,
          sumStats.blue,
          "text-cyan-400 font-extrabold"
        )}

        {/* Red Side */}
        {renderSideTable(
          "레드 진영 전적",
          "RED SIDE",
          "bg-rose-500/10 text-rose-400 border-rose-500/20",
          stats.red,
          sumStats.red,
          "text-rose-400 font-extrabold"
        )}
      </div>
    </section>
  );
};

window.StatsSummary = StatsSummary;
