// Player Profile and Position Tier Card Grid
const PlayerProfile = ({ profile }) => {
  if (!profile) return null;
  const { AwardIcon, CheckIcon } = window.Icons;

  return (
    <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
      <div className="flex flex-col space-y-6">
        {/* Header Profile Info */}
        <div className="flex items-center space-x-4">
          <div className="h-14 w-14 rounded-full bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 flex items-center justify-center shadow-lg shadow-cyan-950/30">
            <AwardIcon />
          </div>
          <div>
            <div className="flex items-center space-x-3">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-100">{profile.gameId}</h2>
              {profile.afreecaId && profile.afreecaId !== "확인" && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                  방송: {profile.afreecaId}
                </span>
              )}
            </div>
            <p className="text-sm text-slate-400 mt-1">
              {profile.notes && profile.notes !== "확인" && profile.notes !== "DB(user)2 미등록 유저" 
                ? `비고: ${profile.notes}` 
                : "등록된 비고 사항이 없습니다."}
            </p>
          </div>
        </div>

        {/* 5-Position Grid Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
          {profile.positions.map((pos, idx) => (
            <div 
              key={idx} 
              className={`border rounded-xl p-4 flex flex-col justify-between h-[120px] transition ${
                pos.isRegistered 
                  ? "bg-slate-950/60 border-slate-800 hover:border-cyan-500/40 shadow-md" 
                  : "bg-slate-950/20 border-slate-900/50 opacity-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-bold uppercase tracking-wider ${pos.isRegistered ? "text-cyan-400" : "text-slate-500"}`}>
                  {pos.line}
                </span>
                {pos.isRegistered && (
                  <CheckIcon />
                )}
              </div>
              
              <div className="mt-2">
                <span className={`text-base sm:text-lg font-bold block truncate ${pos.isRegistered ? "text-slate-100" : "text-slate-600"}`}>
                  {pos.tier}
                </span>
              </div>

              <div className="mt-2">
                {pos.isRegistered ? (
                  <div className="inline-flex items-center justify-center bg-cyan-950/40 text-cyan-400 border border-cyan-500/20 rounded-md px-2.5 py-0.5 text-xs font-extrabold shadow-sm">
                    {pos.points} TP
                  </div>
                ) : (
                  <span className="text-[10px] text-slate-700 font-medium">점수 미보유</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

window.PlayerProfile = PlayerProfile;
