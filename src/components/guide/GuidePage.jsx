// LeeeL's Guide Page Component (☆내전 시참 규칙☆)
const GuidePage = ({ onGoHome, onNavigateToRecord }) => {
  const { BookOpenIcon, SparklesIcon, ArrowLeftIcon, ArrowRightIcon, ShieldIcon, CheckIcon, InfoIcon } = window.Icons;

  return (
    <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-200">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-950/60 border border-sky-500/30 text-sky-400 text-xs font-bold">
            <BookOpenIcon size={14} />
            <span>☆ 내전 시참 규칙 ☆</span>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">
            LeeeL's Guide
          </h2>
          <p className="text-sm text-slate-400">
            리엘* 채널의 공식 내전 시참 수칙과 예약 안내사항입니다.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <a
            href="https://www.sooplive.com/station/msfeather/post/75383508"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-sky-400 transition"
          >
            <span>SOOP 원본 공지 ↗</span>
          </a>
          <button
            onClick={onGoHome}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sm font-semibold text-slate-200 transition"
          >
            <ArrowLeftIcon size={16} />
            <span>메인으로</span>
          </button>
        </div>
      </div>

      {/* 1. Reservation Rules Section */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <SparklesIcon size={18} />
          </div>
          <h3 className="text-lg font-bold text-white">📢 예약 관련 안내사항</h3>
        </div>

        <div className="bg-slate-950/60 rounded-xl p-4 sm:p-5 border border-slate-800/80 space-y-2.5 text-sm text-slate-300">
          <p className="leading-relaxed">
            • 예약은 <strong className="text-amber-400">매판 사설방 10명 초대 완료 후</strong> 게임 시작 전, 매니저 혹은 비제이가 다음판 예약자를 받습니다.
          </p>
          <p className="leading-relaxed">
            • 예약하실 분 손 들어달라고 하면 채팅창에 <strong>손 쳐주시면</strong> 다음판 예약 들어갑니다.
          </p>
          <div className="p-3 bg-rose-950/30 border border-rose-500/30 rounded-lg text-rose-300 text-xs font-bold">
            ⚠️ 주의: 예약자를 받기 전에 미리 손을 드시면 예약으로 인정되지 않습니다!
          </div>
        </div>
      </section>

      {/* 2. Match Rules 11 Rules Grid */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <ShieldIcon size={18} />
          </div>
          <h3 className="text-lg font-bold text-white">⚔️ 내전 관련 안내사항 (11대 수칙)</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-sm">
          
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex items-start space-x-3">
            <span className="w-6 h-6 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</span>
            <div>
              <strong className="text-slate-100 font-bold block mb-1">팬참 필수</strong>
              <p className="text-xs text-slate-400">내전 시참은 팬참으로 진행됩니다.</p>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex items-start space-x-3 border-rose-500/20">
            <span className="w-6 h-6 rounded-full bg-rose-950 text-rose-400 border border-rose-500/30 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</span>
            <div>
              <strong className="text-rose-400 font-bold block mb-1">디코 마이크 필수</strong>
              <p className="text-xs text-slate-400">디스코드 마이크 사용이 필수입니다.</p>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex items-start space-x-3">
            <span className="w-6 h-6 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">3</span>
            <div>
              <strong className="text-slate-100 font-bold block mb-1">인장 / 감정표현 / 전챗 금지</strong>
              <p className="text-xs text-slate-400">
                실수 사용 시 전챗 사과 필수. 미사과/재사용 시 <strong>1달간 참가 금지</strong>
              </p>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex items-start space-x-3">
            <span className="w-6 h-6 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">4</span>
            <div>
              <strong className="text-slate-100 font-bold block mb-1">본캐 및 탑레 공개 필수</strong>
              <p className="text-xs text-slate-400">
                부캐/친구 계정은 본캐·탑레 전달 필수 (위장티어 적발 시 <strong>1달 참가 금지</strong>)
              </p>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex items-start space-x-3">
            <span className="w-6 h-6 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">5</span>
            <div>
              <strong className="text-slate-100 font-bold block mb-1">팀원 비방 및 멘탈 케어</strong>
              <p className="text-xs text-slate-400">게임 도중 팀원 비방이나 감정 상하는 말 자제</p>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex items-start space-x-3">
            <span className="w-6 h-6 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">6</span>
            <div>
              <strong className="text-slate-100 font-bold block mb-1">멸망전 점수표 밸런스</strong>
              <p className="text-xs text-slate-400">방장이 라인과 점수표를 고려하여 최종 팀을 구성합니다.</p>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex items-start space-x-3">
            <span className="w-6 h-6 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">7</span>
            <div>
              <strong className="text-slate-100 font-bold block mb-1">예약자 우선 초대</strong>
              <p className="text-xs text-slate-400">다음 판 진행 시 예약자 우선 초대 후 남는 자리 선착순</p>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex items-start space-x-3">
            <span className="w-6 h-6 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">8</span>
            <div>
              <strong className="text-slate-100 font-bold block mb-1">서렌 전원 동의 필수</strong>
              <p className="text-xs text-slate-400">한 명이라도 반대 시 서렌 금지 (전원 동의 시에만 가능)</p>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex items-start space-x-3">
            <span className="w-6 h-6 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">9</span>
            <div>
              <strong className="text-slate-100 font-bold block mb-1">경고 및 페널티 제도</strong>
              <p className="text-xs text-slate-400">룰 미준수 시 경고 누적 및 페널티 (제보는 방장 쪽지)</p>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex items-start space-x-3">
            <span className="w-6 h-6 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">10</span>
            <div>
              <strong className="text-slate-100 font-bold block mb-1">이벤트 상품 인증샷</strong>
              <p className="text-xs text-slate-400">내전 상품 수령 시 방송국 인증샷 게시판에 등록</p>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex items-start space-x-3 md:col-span-2">
            <span className="w-6 h-6 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">11</span>
            <div>
              <strong className="text-slate-100 font-bold block mb-1">매일 7시 포인트 내전</strong>
              <p className="text-xs text-slate-400">
                포인트 내전은 예약 없이 무조건 선착순 (단, 당일 MVP·종일연참권·선참권 2분 우선 입장)
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Streamer Message */}
      <section className="bg-gradient-to-tr from-cyan-950/30 via-slate-900 to-indigo-950/30 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xl space-y-3 text-sm text-slate-300">
        <h4 className="font-bold text-base text-cyan-300 flex items-center space-x-2">
          <span>💌 방장의 당부 말씀</span>
        </h4>
        <p className="leading-relaxed">
          내전은 이기는 것도 좋지만 <strong>서로 즐겁게 게임하는 것</strong>에 의의를 두고 참여해 주세요!
        </p>
        <p className="leading-relaxed">
          서로 티어도 다르고 생각하는 것도 다르기 때문에, 누구의 잘잘못을 따지려 하지 말고 재밌게 시참해 주셨으면 좋겠습니다.
        </p>
        <p className="leading-relaxed text-slate-400 text-xs pt-1">
          서로 조금씩만 배려하고 존중해 주시면 감사하겠습니다 &gt;&lt;♡ (불만사항이나 건의는 쪽지로 보내주세요!)
        </p>
      </section>

      {/* Bottom CTA */}
      <div className="flex justify-center pt-2">
        <button
          onClick={onNavigateToRecord}
          className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-cyan-950/40 transition"
        >
          <span>LeeeL's Record 전적 검색하러 가기</span>
          <ArrowRightIcon size={16} />
        </button>
      </div>

    </main>
  );
};

window.GuidePage = GuidePage;
