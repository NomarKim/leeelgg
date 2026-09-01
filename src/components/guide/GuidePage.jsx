// LeeeL's Guide Page Component (공식 내전 기본 룰 + 세부 룰 + 당부 말씀 5줄 원문)
const GuidePage = ({ onGoHome, onNavigateToRecord }) => {
  const { BookOpenIcon, SparklesIcon, ArrowLeftIcon, ArrowRightIcon, ShieldIcon, CheckIcon, InfoIcon } = window.Icons;

  return (
    <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-200">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-950/60 border border-sky-500/30 text-sky-400 text-xs font-bold">
            <BookOpenIcon size={14} />
            <span>☆ 내전 시참 공식 가이드 ☆</span>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">
            LeeeL's Guide
          </h2>
          <p className="text-sm text-slate-400">
            리엘* 채널의 내전 시참 기본 룰과 인게임 세부 룰 및 공지 안내입니다.
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

      {/* ─────────────────────────────────────────────────────────── */}
      {/* SECTION 1: 내전 시참 기본 룰 (본문 11대 수칙 & 예약 안내) */}
      {/* ─────────────────────────────────────────────────────────── */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <BookOpenIcon size={20} />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white">📋 내전 시참 기본 룰 & 예약 안내</h3>
              <p className="text-xs text-slate-400 mt-0.5">공지 본문 기본 수칙 11개 항목</p>
            </div>
          </div>
          <span className="text-xs font-bold text-sky-400 bg-sky-950/80 px-3 py-1 rounded-full border border-sky-500/30">
            기본 룰
          </span>
        </div>

        {/* 예약 관련 안내 박스 */}
        <div className="bg-slate-950/70 rounded-xl p-5 border border-slate-800 space-y-3 text-sm text-slate-300">
          <h4 className="font-bold text-amber-300 flex items-center space-x-2">
            <SparklesIcon size={16} />
            <span>예약 관련 안내사항</span>
          </h4>
          <ul className="space-y-1.5 text-xs sm:text-sm text-slate-300">
            <li>• 예약은 <strong className="text-amber-400">매판 사설방 10명 초대 완료 후</strong> 게임 시작 전, 매니저 혹은 비제이가 다음판 예약자를 받습니다.</li>
            <li>• 예약하실 분 손 들어달라고 하면 손 쳐주시면 다음판 예약 들어갑니다.</li>
            <li className="text-rose-400 font-bold">⚠️ (예약자 받기 전에 손 드시면 예약 안 됩니다!!)</li>
          </ul>
        </div>

        {/* 11대 기본 수칙 리스트 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs sm:text-sm">
          
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex items-start space-x-3">
            <span className="w-6 h-6 rounded-full bg-sky-950 text-sky-400 border border-sky-500/30 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</span>
            <div>
              <strong className="text-slate-100 font-bold block mb-1">팬참 필수</strong>
              <p className="text-slate-400">내전 시참은 팬참입니다.</p>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-rose-500/30 rounded-xl p-4 flex items-start space-x-3 bg-rose-950/10">
            <span className="w-6 h-6 rounded-full bg-rose-950 text-rose-400 border border-rose-500/30 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</span>
            <div>
              <strong className="text-rose-400 font-bold block mb-1">디코 마이크 필수</strong>
              <p className="text-slate-400">디코 마이크 필수입니다.</p>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex items-start space-x-3">
            <span className="w-6 h-6 rounded-full bg-sky-950 text-sky-400 border border-sky-500/30 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">3</span>
            <div>
              <strong className="text-slate-100 font-bold block mb-1">인장 / 감정표현 / 전챗 금지</strong>
              <p className="text-slate-400">모르고 사용했을 경우 전챗 사과 필수. 미사과 또는 재사용 시 <span className="text-purple-400 font-semibold">한 달 동안 내전 참가 금지</span></p>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex items-start space-x-3">
            <span className="w-6 h-6 rounded-full bg-sky-950 text-sky-400 border border-sky-500/30 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">4</span>
            <div>
              <strong className="text-slate-100 font-bold block mb-1">본캐 및 탑레 전달 필수</strong>
              <p className="text-slate-400">부캐나 친구 아이디는 본캐 및 탑레 필히 전달 (위장티어 적발 시 <span className="text-purple-400 font-semibold">한 달 동안 내전 참가 금지</span>)</p>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex items-start space-x-3">
            <span className="w-6 h-6 rounded-full bg-sky-950 text-sky-400 border border-sky-500/30 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">5</span>
            <div>
              <strong className="text-slate-100 font-bold block mb-1">팀원 비방 자제</strong>
              <p className="text-slate-400">게임 도중 같은 팀원을 비방하는 말이나 팀원의 감정을 상하게 하는 말은 자제해주세요.</p>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex items-start space-x-3">
            <span className="w-6 h-6 rounded-full bg-sky-950 text-sky-400 border border-sky-500/30 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">6</span>
            <div>
              <strong className="text-slate-100 font-bold block mb-1">멸망전 점수표 밸런스</strong>
              <p className="text-slate-400">밸런스는 멸망전 점수표로 짜며, 방장이 라인 등을 고려하여 최종 팀을 짭니다.</p>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex items-start space-x-3">
            <span className="w-6 h-6 rounded-full bg-sky-950 text-sky-400 border border-sky-500/30 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">7</span>
            <div>
              <strong className="text-slate-100 font-bold block mb-1">중도 입장자 예약제</strong>
              <p className="text-slate-400">내전 중에 방송 들어오신 분은 다음 판 예약 가능 (예약자 우선 초대 후 남는 자리 선착순)</p>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex items-start space-x-3">
            <span className="w-6 h-6 rounded-full bg-sky-950 text-sky-400 border border-sky-500/30 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">8</span>
            <div>
              <strong className="text-slate-100 font-bold block mb-1">서렌 전원 동의 필수</strong>
              <p className="text-slate-400">팀원들의 동의를 구한 뒤 모두가 동의했을 시에만 서렌 버튼 누르기 (한 명이라도 반대 시 서렌 금지)</p>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex items-start space-x-3">
            <span className="w-6 h-6 rounded-full bg-sky-950 text-sky-400 border border-sky-500/30 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">9</span>
            <div>
              <strong className="text-slate-100 font-bold block mb-1">경고 및 페널티</strong>
              <p className="text-slate-400">시참 룰 미준수 시 경고 부여 및 누적 시 페널티 (제보는 방장에게 쪽지로 전송)</p>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex items-start space-x-3">
            <span className="w-6 h-6 rounded-full bg-sky-950 text-sky-400 border border-sky-500/30 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">10</span>
            <div>
              <strong className="text-slate-100 font-bold block mb-1">이벤트 상품 인증샷</strong>
              <p className="text-slate-400">내전 이벤트로 받은 상품은 방송국 인증샷 게시판에 올려주시면 감사하겠습니다.</p>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex items-start space-x-3 md:col-span-2">
            <span className="w-6 h-6 rounded-full bg-sky-950 text-sky-400 border border-sky-500/30 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">11</span>
            <div>
              <strong className="text-slate-100 font-bold block mb-1">매일 7시 포인트 내전</strong>
              <p className="text-slate-400">
                매일 7시에 진행되는 포인트 내전은 예약을 따로 받지 않고 무조건 선착순으로 받습니다. (단, 그날의 MVP, 종일연참권, 선참권 두 분까지 우선 참여 가능)
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* SECTION 2: 내전 시참 세부 룰 (공지 이미지 하단 6가지 항목) */}
      {/* ─────────────────────────────────────────────────────────── */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <ShieldIcon size={20} />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white">⚔️ 내전 시참 세부 룰</h3>
              <p className="text-xs text-slate-400 mt-0.5">공지 첨부 이미지 내전 인게임 상세 규칙 6개 항목</p>
            </div>
          </div>
          <span className="text-xs font-bold text-indigo-400 bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-500/30">
            세부 룰
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
          
          {/* 1. 스왑 관련 룰 */}
          <div className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-5 space-y-2">
            <div className="flex items-center space-x-2 text-cyan-400 font-bold text-sm">
              <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-xs">1</span>
              <span>1. 스왑 관련 룰</span>
            </div>
            <p className="text-slate-300 leading-relaxed pl-7">
              1차 타워 밀기 전에 스왑 금지<br />
              <span className="text-slate-400 text-xs">(1차 타워 밀기 전에 다른 라인 받으러 갈 시 세 웨이브까지 주거 가능)</span>
            </p>
          </div>

          {/* 2. 패작발언/즐겜 금지 */}
          <div className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-5 space-y-2">
            <div className="flex items-center space-x-2 text-rose-400 font-bold text-sm">
              <span className="w-5 h-5 rounded-full bg-rose-950 border border-rose-500/40 flex items-center justify-center text-xs">2</span>
              <span>2. 패작발언 / 즐겜 금지</span>
            </div>
            <p className="text-slate-300 leading-relaxed pl-7">
              져도 돼, 편하게 할게, 즐겜하자 등등<br />
              <strong>기본적으로 승리지향 빡겜지향 하면서 즐겁게 합시당</strong>
            </p>
          </div>

          {/* 3. 친목 금지 */}
          <div className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-5 space-y-2">
            <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
              <span className="w-5 h-5 rounded-full bg-amber-950 border border-amber-500/40 flex items-center justify-center text-xs">3</span>
              <span>3. 친목 금지</span>
            </div>
            <p className="text-slate-300 leading-relaxed pl-7">
              아는 사람들끼리만 대화, 욕설 자제
            </p>
          </div>

          {/* 4. 챔프 관련 룰 */}
          <div className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-5 space-y-2">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
              <span className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-xs">4</span>
              <span>4. 챔프 관련 룰</span>
            </div>
            <ul className="text-slate-300 space-y-1 pl-7 list-disc list-inside text-xs sm:text-sm">
              <li>챔프는 자유지만 그 라인 챔프 아닐 시 팀원 전원에게 허락받고 하기 (한명이라도 동의 안할 시 픽 금지)</li>
              <li>최대한 픽 조합 맞춰서 픽해주기</li>
              <li>강제픽 금지 (저티어한테 이 챔프 해라 금지)</li>
            </ul>
          </div>

          {/* 5. 인장/감표/도발행위/전챗 금지 */}
          <div className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-5 space-y-2">
            <div className="flex items-center space-x-2 text-purple-400 font-bold text-sm">
              <span className="w-5 h-5 rounded-full bg-purple-950 border border-purple-500/40 flex items-center justify-center text-xs">5</span>
              <span>5. 인장 / 감표 / 도발행위 / 전챗 금지</span>
            </div>
            <p className="text-slate-300 leading-relaxed pl-7">
              모르고 사용하셨을 경우에는 전챗으로 사과해주시고, 사과하지 않거나 또 사용시 내전 참가 금지입니다.
            </p>
          </div>

          {/* 6. 기타 룰 */}
          <div className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-5 space-y-2">
            <div className="flex items-center space-x-2 text-sky-400 font-bold text-sm">
              <span className="w-5 h-5 rounded-full bg-sky-950 border border-sky-500/40 flex items-center justify-center text-xs">6</span>
              <span>6. 기타 룰</span>
            </div>
            <ul className="text-slate-300 space-y-1.5 pl-7 list-disc list-inside text-xs sm:text-sm">
              <li><strong>저티어는 고티어 오더 잘 따르기</strong> (이해 안되더라도 일단 따르고 망하면 탓해도 늦지 않다)</li>
              <li><strong>고티어는 저티어에게 무시발언, 화내기 금지</strong></li>
            </ul>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* SECTION 3: 방장의 당부 말씀 (원문 5줄 온전히 100% 수록) */}
      {/* ─────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-tr from-cyan-950/40 via-slate-900 to-indigo-950/40 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-4 text-sm text-slate-200">
        <div className="flex items-center space-x-2.5 text-cyan-300 font-bold text-base border-b border-slate-800/80 pb-3">
          <SparklesIcon size={18} />
          <span>💌 방장의 당부 말씀 (원문)</span>
        </div>

        <div className="space-y-3 leading-relaxed text-slate-300 text-xs sm:text-sm">
          <p>
            내전은 이기는 것도 좋지만 서로 즐겁게 게임하는 것에 의의를 두고 해주세요.
          </p>
          <p>
            서로 티어도 다르고 생각하는것도 다르기 때문에 누구의 잘잘못을 따지려 하지 말고 재밌게 시참 해주셨으면 좋겠습니다.
          </p>
          <p className="text-rose-300/90 font-medium">
            그리고 제가 방장이라는 이유로 저한테 모든 잘못을 전가하거나 과도한 비방은 멈춰주세요.
          </p>
          <p className="text-rose-300/90 font-medium">
            저도 사람인지라 게임의 패배를 제 탓으로 돌리는 것은 감당하기 힘듭니다 ㅠㅠ
          </p>
          <p className="text-cyan-300 font-semibold pt-1">
            서로 조금씩만 배려하고 존중해 주시면 감사하겠습니다 &gt;&lt;♡
          </p>
          <div className="pt-2 text-xs text-teal-400 border-t border-slate-800/60">
            다른 불만사항이나 추가할 내용이 있으면 저에게 쪽지 보내주세용 !
          </div>
        </div>
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
