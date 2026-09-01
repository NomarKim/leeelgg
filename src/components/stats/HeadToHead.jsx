// Position-based Head-to-head Rival 10-match logs
const HeadToHead = ({ recentHeadToHead, positionsList = ["탑", "정글", "미드", "원딜", "서폿"] }) => {
  const { AwardIcon, InfoIcon } = window.Icons;
  const { formatDateString } = window.DateUtils;

  const hasAnyMatches = Object.values(recentHeadToHead).some(list => list.length > 0);

  return (
    <section className="space-y-4">
      <h3 className="text-lg font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
        <AwardIcon />
        <span>포지션별 최근 10경기 맞라인 상대 라이벌 전적</span>
      </h3>

      <div className="space-y-6">
        {positionsList.map((pos) => {
          const matchesList = recentHeadToHead[pos] || [];
          if (matchesList.length === 0) return null;

          return (
            <div key={pos} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="px-6 py-4 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-bold rounded-lg uppercase tracking-wide">
                    {pos}
                  </span>
                  <span className="text-sm font-bold text-slate-200">{pos} 포지션 맞대결 로그</span>
                </div>
                <span className="text-xs text-slate-500">최근 {matchesList.length}경기</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="bg-slate-950/50 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-800">
                      <th className="py-3 px-6">경기 일시</th>
                      <th className="py-3 px-6">맞라인 상대 유저</th>
                      <th className="py-3 px-6">내 플레이 챔프</th>
                      <th className="py-3 px-6">상대 플레이 챔프</th>
                      <th className="py-3 px-6 text-center">결과</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {matchesList.map((match, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/20 transition duration-150">
                        <td className="py-3.5 px-6 font-medium text-slate-400">{formatDateString(match.date)}</td>
                        <td className="py-3.5 px-6">
                          <span className="font-semibold text-slate-200">{match.opponentName}</span>
                        </td>
                        <td className="py-3.5 px-6 text-slate-300">
                          <span className="bg-slate-950 border border-slate-800 px-2.5 py-1 rounded-md text-xs font-semibold text-cyan-300">
                            {match.myChamp}
                          </span>
                        </td>
                        <td className="py-3.5 px-6 text-slate-400">
                          <span className="bg-slate-950 border border-slate-800 px-2.5 py-1 rounded-md text-xs">
                            {match.opponentChamp}
                          </span>
                        </td>
                        <td className="py-3.5 px-6 text-center">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold ${
                            match.result === "승" 
                              ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-sm" 
                              : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          }`}>
                            {match.result === "승" ? "WIN 승리" : "LOSS 패배"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}

        {!hasAnyMatches && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500 flex flex-col items-center justify-center space-y-2 shadow-xl">
            <InfoIcon size={24} />
            <h4 className="text-base font-semibold text-slate-400">조회 범위 내 플레이한 맞라인 전적이 없습니다.</h4>
            <p className="text-xs text-slate-500">다른 기간을 선택하거나 유저명을 확인해 주세요.</p>
          </div>
        )}
      </div>
    </section>
  );
};

window.HeadToHead = HeadToHead;
