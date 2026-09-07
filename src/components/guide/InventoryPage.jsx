// LeeeL's Guide - 아이템 보유 현황 (1~5번 순서 정리 & 안내 사항 반영)
const InventoryPage = ({ inventory = {}, onGoHome, onGoGuide, onSearchPlayer, initialSearchName = "" }) => {
  const { useState, useMemo } = React;
  const { 
    GiftIcon, SearchIcon, SparklesIcon, ShieldIcon, TrophyIcon, 
    FlameIcon, BarChartIcon, ArrowLeftIcon, ArrowRightIcon, BookOpenIcon, CheckIcon, InfoIcon 
  } = window.Icons;

  const userMap = inventory.userMap || {};
  const roulette1 = inventory.roulette1 || { headers: [], rows: [] };
  const roulette2 = inventory.roulette2 || { headers: [], rows: [] };
  const points = inventory.points || [];
  const roulette44 = inventory.roulette44 || { headers: [], rows: [] };
  const tft = inventory.tft || { headers: [], rows: [] };
  const praise = inventory.praise || [];
  const deathnote = inventory.deathnote || [];

  // All unique user names across all sheets
  const allUserNames = useMemo(() => {
    const nameSet = new Set();
    Object.values(userMap).forEach(u => {
      if (u.name) nameSet.add(u.name);
    });
    return Array.from(nameSet).sort((a, b) => a.localeCompare(b, "ko"));
  }, [userMap]);

  // Tab View state: "ingame" (1) | "broadcast" (2) | "points" (3) | "deathnote" (4) | "sheets" (5)
  const [activeCategoryTab, setActiveCategoryTab] = useState("ingame");

  // Search state (Starts empty by default)
  const [searchInput, setSearchInput] = useState(initialSearchName || "");
  const [searchedName, setSearchedName] = useState(initialSearchName || "");
  const [showDropdown, setShowDropdown] = useState(false);

  // Table search & sort filters for sheet table view
  const [tableSearch, setTableSearch] = useState("");
  const [sheetTableTab, setSheetTableTab] = useState("r1");

  // Exact 1:1 user lookup
  const displayedUser = useMemo(() => {
    if (!searchedName) return null;
    const key = searchedName.trim().toLowerCase();
    let user = userMap[key];
    if (!user) {
      const matchName = allUserNames.find(n => n.toLowerCase() === key || n.replace(/\s+/g, "").toLowerCase() === key.replace(/\s+/g, ""));
      if (matchName && userMap[matchName.toLowerCase()]) {
        user = userMap[matchName.toLowerCase()];
      }
    }
    if (!user) {
      return { 
        name: searchedName, 
        notFound: true, 
        totalItemCount: 0, 
        roulette1: {}, 
        roulette2: {}, 
        points: null, 
        roulette44: {}, 
        tft: {}, 
        praises: [], 
        deathnote: [],
        teamBan: null
      };
    }
    return user;
  }, [searchedName, userMap, allUserNames]);

  // Quick select user from autocomplete
  const handleSelectUser = (name) => {
    setSearchInput(name);
    setSearchedName(name);
    setShowDropdown(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const q = searchInput.trim();
    if (!q) {
      setSearchedName("");
      return;
    }

    const exact = userMap[q.toLowerCase()];
    if (exact) {
      setSearchedName(exact.name);
      setSearchInput(exact.name);
    } else {
      const matched = allUserNames.find(n => n.toLowerCase() === q.toLowerCase()) || 
                      allUserNames.find(n => n.toLowerCase().includes(q.toLowerCase()));
      if (matched) {
        setSearchedName(matched);
        setSearchInput(matched);
      } else {
        setSearchedName(q);
      }
    }
    setShowDropdown(false);
  };

  // Autocomplete dropdown list
  const filteredDropdownNames = useMemo(() => {
    const q = searchInput.trim().toLowerCase();
    if (!q) return allUserNames.slice(0, 15);
    return allUserNames.filter(n => n.toLowerCase().includes(q)).slice(0, 20);
  }, [searchInput, allUserNames]);

  // Retrieve item value by multiple aliases / spacing variants (Preserves negative numbers)
  const getItemCount = (itemObj, possibleKeys) => {
    if (!itemObj) return 0;
    for (const key of possibleKeys) {
      if (itemObj[key] !== undefined && itemObj[key] !== null) {
        return itemObj[key];
      }
    }
    for (const key of Object.keys(itemObj)) {
      const normKey = key.replace(/\s+/g, "");
      for (const target of possibleKeys) {
        if (normKey === target.replace(/\s+/g, "")) {
          return itemObj[key];
        }
      }
    }
    return 0;
  };

  // ───────────────────────────────────────────────────────────
  // Special Parser: 한판더 & 칼판더 parsing (슬래시 / 유무 무관 완벽 분리)
  // 1) ㅈ, x, 없음, - 처럼 무의미한 문자는 0으로 처리
  // 2) 슬래시(/), 공백(스페이스), 콤마(,), 덧셈(+), 괄호() 유무와 관계없이 한판더/칼판더 분리
  //    예: "1/1", "1 1", "1 칼1", "1칼1", "1 칼판2", "1칼", "1(칼판1)", "1 + 칼1", "한1칼2"
  // 3) 칼/칼판/칼판더/칼바람만 단독으로 있는 경우: 한판더 = 0, 칼판더 = 해당 숫자 (없으면 1)
  // 4) 순수 숫자만 있는 경우: 한판더 = 숫자, 칼판더 = 0
  // ───────────────────────────────────────────────────────────
  const parsedHanpanData = useMemo(() => {
    const r1 = displayedUser?.roulette1 || {};
    let hanpan = 0;
    let dupan = 0;
    let kalpan = 0;

    // Generic slot parser for numbers and complex mixed notations (e.g. "5칼바람1", "2/칼바람1", "1/칼판", "칼바람2")
    const parseSlot = (rawVal) => {
      let mainCount = 0;
      let extraKalpan = 0;
      if (rawVal === undefined || rawVal === null || rawVal === 0 || rawVal === "0") {
        return { main: 0, kalpan: 0 };
      }
      if (typeof rawVal === "number") {
        return { main: rawVal, kalpan: 0 };
      }
      const s = String(rawVal).trim();
      if (!s || ["0", "0.0", "ㅈ", "x", "-", "없음", "null", "None"].includes(s)) {
        return { main: 0, kalpan: 0 };
      }

      if (s.includes("한") && s.includes("칼")) {
        const mHan = s.match(/한(?:판)?(?:더)?\s*(-?\d+)/);
        const mKal = s.match(/칼(?:판|바람)?(?:더)?\s*(-?\d+)?/);
        if (mHan && mHan[1]) mainCount += parseInt(mHan[1], 10);
        if (mKal) extraKalpan += (mKal[1] ? parseInt(mKal[1], 10) : 1);
        return { main: mainCount, kalpan: extraKalpan };
      }

      if (s.includes("칼")) {
        const m = s.match(/^(.*?)(칼(?:판|바람)?(?:더)?)(.*)$/);
        if (m) {
          const left = m[1].trim().replace(/\/$/, "");
          const right = m[3].trim().replace(/^\//, "");
          const leftNum = left.match(/(-?\d+)/);
          const rightNum = right.match(/(-?\d+)/);
          if (leftNum) mainCount += parseInt(leftNum[1], 10);
          if (rightNum) extraKalpan += parseInt(rightNum[1], 10);
          else extraKalpan += 1;
          return { main: mainCount, kalpan: extraKalpan };
        }
      }

      for (const d of ["/", ",", "+", " "]) {
        if (s.includes(d)) {
          const parts = s.split(d).map(p => p.trim()).filter(Boolean);
          if (parts.length >= 2) {
            const p1 = parts[0].match(/(-?\d+)/);
            const p2 = parts[1].match(/(-?\d+)/);
            if (p1 && p2) {
              return { main: parseInt(p1[1], 10), kalpan: parseInt(p2[1], 10) };
            }
          }
        }
      }

      const numMatch = s.match(/(-?\d+)/);
      if (numMatch) {
        mainCount += parseInt(numMatch[1], 10);
      }
      return { main: mainCount, kalpan: extraKalpan };
    };

    // 1. Separate '칼판더' / '칼바람' columns if any
    Object.keys(r1).forEach(k => {
      if (k !== "한판더" && k !== "두판더" && (k.includes("칼판") || k.includes("칼바람"))) {
        const val = r1[k];
        if (typeof val === "number") kalpan += val;
        else if (typeof val === "string") {
          const numMatch = val.match(/-?\d+/);
          kalpan += numMatch ? parseInt(numMatch[0], 10) : 1;
        }
      }
    });

    // 2. '한판더' column parsing
    const hanpanRaw = getItemCount(r1, ["한판더", "한판 더", "한판"]);
    const parsedH = parseSlot(hanpanRaw);
    hanpan += parsedH.main;
    kalpan += parsedH.kalpan;

    // 3. '두판더' column parsing (supports mixed '1/칼바람1', '칼바람')
    const dupanRaw = getItemCount(r1, ["두판더", "두판 더", "두판"]);
    const parsedD = parseSlot(dupanRaw);
    dupan += parsedD.main;
    kalpan += parsedD.kalpan;

    return { hanpan, dupan, kalpan };
  }, [displayedUser]);

  const r1Obj = displayedUser?.roulette1 || {};
  const r2Obj = displayedUser?.roulette2 || {};
  const r44Obj = displayedUser?.roulette44 || {};

  // 1. 인게임 아이템 그룹 (1번)
  const ingameGroups = useMemo(() => {
    return [
      {
        title: "(1) 참여 관련",
        badgeColor: "border-cyan-500/30 text-cyan-400 bg-cyan-950/60",
        items: [
          { name: "1회연참권", count: getItemCount(r1Obj, ["1회연참권", "1회 연참권"]) },
          { name: "선참권", count: getItemCount(r1Obj, ["선참권"]) },
          { name: "종일연참권", count: getItemCount(r1Obj, ["종일연참권", "종일 연참권"]) },
          { name: "암표", count: getItemCount(r1Obj, ["암표"]) },
          { name: "한판더", count: parsedHanpanData.hanpan },
          { name: "두판더", count: parsedHanpanData.dupan },
          { name: "칼판더", count: parsedHanpanData.kalpan }
        ]
      },
      {
        title: "(2) 팀 관련",
        badgeColor: "border-sky-500/30 text-sky-400 bg-sky-950/60",
        items: [
          { name: "종같팀/종반팀", count: getItemCount(r1Obj, ["종같팀/종반팀", "종같팀", "종반팀", "종같/종반", "종같팀 / 종반팀"]) },
          { name: "같은팀", count: getItemCount(r1Obj, ["같은팀", "같은 팀"]) },
          { name: "반대팀", count: getItemCount(r1Obj, ["반대팀", "반대 팀"]) },
          { name: "팀지정권", count: getItemCount(r1Obj, ["팀지정권", "팀지정"]) },
          { name: "진영지정", count: getItemCount(r1Obj, ["진영지정", "진영 지정"]) },
          { name: "정자같은팀", count: getItemCount(r1Obj, ["정자같은팀", "정자 같은팀", "정자같은 팀"]) }
        ]
      },
      {
        title: "(3) 밴픽 관련",
        badgeColor: "border-amber-500/30 text-amber-400 bg-amber-950/60",
        items: [
          { name: "노밴권", count: getItemCount(r1Obj, ["노밴권", "노벤권", "노밴", "노벤"]) },
          { name: "글밴권", count: getItemCount(r1Obj, ["글밴권", "글벤권", "글밴", "글벤", "글로벌밴권"]) }
        ]
      },
      {
        title: "(4) 듀랭 관련 (룰렛1 + 44룰렛)",
        badgeColor: "border-rose-500/30 text-rose-400 bg-rose-950/60",
        items: [
          { 
            name: "듀오권", 
            count: (Number(getItemCount(r1Obj, ["듀오권"])) || 0) + (Number(getItemCount(r44Obj, ["듀오권"])) || 0) 
          },
          { name: "원하는스펠", count: getItemCount(r44Obj, ["원하는스펠", "스펠"]) || getItemCount(r1Obj, ["원하는스펠"]) },
          { name: "원하는라인", count: getItemCount(r44Obj, ["원하는라인", "라인"]) || getItemCount(r1Obj, ["원하는라인"]) },
          { name: "원하는챔프", count: getItemCount(r44Obj, ["원하는챔프", "챔프"]) || getItemCount(r1Obj, ["원하는챔프"]) }
        ]
      },
      {
        title: "(5) 티어/라인 관련",
        badgeColor: "border-purple-500/30 text-purple-400 bg-purple-950/60",
        items: [
          { name: "티어변경", count: getItemCount(r1Obj, ["티어변경", "티어 변경"]) },
          { name: "포지션변경", count: getItemCount(r1Obj, ["포지션변경", "포지션 변경", "라인변경"]) },
          { name: "부라인등록권", count: getItemCount(r1Obj, ["부라인등록권", "부라인 등록권", "부라인"]) }
        ]
      },
      {
        title: "(6) 기타",
        badgeColor: "border-slate-500/30 text-slate-300 bg-slate-800/60",
        items: [
          { name: "리롤권", count: getItemCount(r1Obj, ["리롤권", "리롤"]) },
          { name: "전챗허용권", count: getItemCount(r1Obj, ["전챗허용권", "전챗", "전챗 허용권"]) },
          { name: "감표권", count: getItemCount(r1Obj, ["감표권", "감표"]) },
          { name: "방송1시간", count: getItemCount(r1Obj, ["방송1시간", "방송 1시간", "방송1시간권"]) }
        ]
      }
    ];
  }, [r1Obj, r44Obj, parsedHanpanData]);

  // Total in-game items count from parsed cards
  const totalIngameItemCount = useMemo(() => {
    return ingameGroups.reduce((acc, group) => {
      return acc + group.items.reduce((gAcc, item) => {
        const num = Number(item.count);
        return !isNaN(num) ? gAcc + num : gAcc;
      }, 0);
    }, 0);
  }, [ingameGroups]);

  // 2. 방송 & 리액션 아이템 그룹 (2번)
  const broadcastGroups = useMemo(() => {
    return [
      {
        title: "(1) 리액션",
        badgeColor: "border-pink-500/30 text-pink-400 bg-pink-950/60",
        items: [
          { name: "원하는리액션", count: getItemCount(r2Obj, ["원하는리액션", "원하는 리액션"]) },
          { name: "얼낙", count: getItemCount(r2Obj, ["얼낙", "얼굴낙서"]) },
          { name: "노래", count: getItemCount(r2Obj, ["노래", "노래부르기"]) },
          { name: "얼낙 실드", count: getItemCount(r2Obj, ["얼낙 실드", "얼낙실드", "얼굴낙서실드"]) }
        ]
      },
      {
        title: "(2) 방송",
        badgeColor: "border-indigo-500/30 text-indigo-400 bg-indigo-950/60",
        items: [
          { name: "캠방", count: getItemCount(r2Obj, ["캠방", "캠방송"]) },
          { name: "강제휴방", count: getItemCount(r2Obj, ["강제휴방", "강제 휴방"]) },
          { name: "방종", count: getItemCount(r2Obj, ["방종", "방송종료"]) },
          { name: "방종 실드", count: getItemCount(r2Obj, ["방종 실드", "방종실드", "방종방어"]) },
          { name: "노방종", count: getItemCount(r2Obj, ["노방종"]) },
          { name: "노방종 실드", count: getItemCount(r2Obj, ["노방종 실드", "노방종실드"]) },
          { name: "노휴방", count: getItemCount(r2Obj, ["노휴방"]) },
          { name: "노휴방실드", count: getItemCount(r2Obj, ["노휴방실드", "노휴방 실드"]) },
          { name: "원하는 게임", count: getItemCount(r2Obj, ["원하는 게임", "원하는게임", "게임"]) }
        ]
      },
      {
        title: "(3) 팬썹",
        badgeColor: "border-emerald-500/30 text-emerald-400 bg-emerald-950/60",
        items: [
          { name: "전데", count: getItemCount(r2Obj, ["전데", "전화데이트"]) },
          { name: "방셀", count: getItemCount(r2Obj, ["방셀", "방송셀카"]) },
          { name: "식데", count: getItemCount(r2Obj, ["식데", "식사데이트"]) },
          { name: "손편지+선물", count: getItemCount(r2Obj, ["손편지+선물", "손편지 + 선물", "손편지", "선물"]) }
        ]
      },
      {
        title: "(4) 아이템",
        badgeColor: "border-amber-500/30 text-amber-400 bg-amber-950/60",
        items: [
          { name: "퀵뷰", count: getItemCount(r2Obj, ["퀵뷰", "퀵뷰플러스"]) },
          { name: "구독권", count: getItemCount(r2Obj, ["구독권", "구독"]) },
          { name: "원하는룰렛", count: getItemCount(r2Obj, ["원하는룰렛", "원하는 룰렛"]) },
          { name: "시그니처사운드", count: getItemCount(r2Obj, ["시그니처사운드", "시그니처 사운드", "시그니처"]) }
        ]
      },
      {
        title: "(5) 기타",
        badgeColor: "border-slate-500/30 text-slate-300 bg-slate-800/60",
        items: [
          { name: "닉변", count: getItemCount(r2Obj, ["닉변", "닉네임변경"]) },
          { name: "정자듀오권", count: getItemCount(r2Obj, ["정자듀오권", "정자 듀오권", "정자듀오"]) }
        ]
      }
    ];
  }, [r2Obj]);

  // 3. L포인트 데이터 (3번)
  const pointsData = displayedUser?.points;

  // 4. 데스노트 (1~4열) & 팀금 (팀장 참여 금지) 데이터 (4번)
  const deathnoteList = useMemo(() => {
    const raw = displayedUser?.deathnote || [];
    return raw.map((item, idx) => {
      if (typeof item === "object" && item !== null) {
        return {
          round: item.round || (idx + 1),
          reason: item.reason || ""
        };
      }
      return {
        round: idx + 1,
        reason: String(item)
      };
    });
  }, [displayedUser]);

  const teamBanInfo = displayedUser?.teamBan || null;
  const praiseList = displayedUser?.praises || [];

  // Reusable Item Slot Card Component (Supports negative '가불' counts)
  const renderItemSlot = (item, theme = "cyan") => {
    const rawVal = item.count;
    const num = Number(rawVal);
    const isNum = !isNaN(num);
    const isNegative = isNum && num < 0;
    const isPositive = isNum && num > 0;
    const hasItem = isNum ? num !== 0 : Boolean(rawVal && String(rawVal).trim() !== "0");

    let countDisplay = "0개";
    if (isNum) {
      countDisplay = `${num}개`;
    } else if (rawVal) {
      countDisplay = String(rawVal);
    }

    let cardStyle = "bg-slate-950/60 border-slate-800/70 opacity-60 hover:opacity-100";
    let textStyle = "text-slate-400";
    let countStyle = "text-slate-600";

    if (isNegative) {
      cardStyle = "border-rose-500/80 bg-rose-950/50 shadow-md shadow-rose-950/40 transform scale-[1.02]";
      textStyle = "text-rose-300";
      countStyle = "text-rose-400";
    } else if (isPositive || hasItem) {
      if (theme === "pink") {
        cardStyle = "border-pink-500/60 bg-pink-950/50 shadow-md shadow-pink-950/30 transform scale-[1.02]";
        textStyle = "text-pink-300";
        countStyle = "text-pink-400";
      } else if (theme === "indigo") {
        cardStyle = "border-indigo-500/60 bg-indigo-950/50 shadow-md shadow-indigo-950/30 transform scale-[1.02]";
        textStyle = "text-indigo-300";
        countStyle = "text-indigo-400";
      } else if (theme === "emerald") {
        cardStyle = "border-emerald-500/60 bg-emerald-950/50 shadow-md shadow-emerald-950/30 transform scale-[1.02]";
        textStyle = "text-emerald-300";
        countStyle = "text-emerald-400";
      } else if (theme === "amber") {
        cardStyle = "border-amber-500/60 bg-amber-950/50 shadow-md shadow-amber-950/30 transform scale-[1.02]";
        textStyle = "text-amber-300";
        countStyle = "text-amber-400";
      } else if (theme === "purple") {
        cardStyle = "border-purple-500/60 bg-purple-950/50 shadow-md shadow-purple-950/30 transform scale-[1.02]";
        textStyle = "text-purple-300";
        countStyle = "text-purple-400";
      } else {
        cardStyle = "border-cyan-500/60 bg-cyan-950/50 shadow-md shadow-cyan-950/30 transform scale-[1.02]";
        textStyle = "text-cyan-300";
        countStyle = "text-cyan-400";
      }
    }

    return (
      <div 
        key={item.name}
        className={`rounded-2xl p-3 flex flex-col justify-between border transition-all ${cardStyle}`}
      >
        <div className="flex items-center justify-between">
          <span className={`text-xs font-bold truncate ${textStyle}`} title={item.name}>
            {item.name}
          </span>
          {isNegative && (
            <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-rose-900/90 text-rose-200 border border-rose-500/40">
              가불
            </span>
          )}
        </div>
        <div className="flex items-baseline justify-between mt-2">
          <span className={`text-sm sm:text-base font-black ${countStyle}`}>
            {countDisplay}
          </span>
          {isPositive && (
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          )}
          {isNegative && (
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
          )}
        </div>
      </div>
    );
  };

  // ───────────────────────────────────────────────────────────
  // 교환의 장 & L포인트 교환/양도 공식 컴포넌트
  // ───────────────────────────────────────────────────────────
  const renderExchangeRulesSection = () => (
    <section className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
      <div className="flex items-center space-x-2 text-amber-400 font-black text-base sm:text-lg border-b border-slate-800 pb-3">
        <SparklesIcon size={20} />
        <span>📜 교환의 장 & 아이템 변환 / 양도 공식</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* 1. 아이템 교환 (종일연참권) */}
        <div className="bg-slate-950 border border-blue-500/30 rounded-2xl overflow-hidden shadow-md flex flex-col">
          <div className="bg-yellow-400 text-slate-950 font-black px-4 py-2.5 text-center text-sm tracking-wide">
            아이템 교환
          </div>
          <div className="p-4 flex-1 space-y-3 bg-blue-950/20 text-xs">
            <div className="flex items-start justify-between py-2 border-b border-slate-800/80">
              <span className="font-black text-slate-200">종일연참권</span>
              <span className="text-blue-400 font-bold mx-2">&gt;</span>
              <span className="font-extrabold text-blue-300">연참 1, 선참 2</span>
            </div>
            <div className="flex items-start justify-between py-2 border-b border-slate-800/80">
              <span className="font-black text-slate-200">종일연참권</span>
              <span className="text-blue-400 font-bold mx-2">&gt;</span>
              <span className="font-extrabold text-blue-300">연참 5</span>
            </div>
            <div className="flex items-start justify-between py-2">
              <span className="font-black text-slate-200">종일연참권</span>
              <span className="text-blue-400 font-bold mx-2">&gt;</span>
              <span className="font-extrabold text-blue-300">연참 3, 선참 1</span>
            </div>
          </div>
        </div>

        {/* 2. 아이템 양도 */}
        <div className="bg-slate-950 border border-purple-500/30 rounded-2xl overflow-hidden shadow-md flex flex-col">
          <div className="bg-yellow-400 text-slate-950 font-black px-4 py-2.5 text-center text-sm tracking-wide">
            아이템 양도
          </div>
          <div className="p-4 flex-1 space-y-3 bg-purple-950/20 text-xs">
            <div className="text-[11px] text-slate-400 mb-1 font-semibold">
              ※ 타인에게 아이템/포인트 양도 시 교환 비율
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-800/80">
              <span className="font-black text-slate-200">연참 3</span>
              <span className="text-purple-400 font-black mx-2">▶</span>
              <span className="font-extrabold text-purple-300">타인연참 1</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="font-black text-slate-200">L포인트 30</span>
              <span className="text-purple-400 font-black mx-2">▶</span>
              <span className="font-extrabold text-purple-300">L포인트 10</span>
            </div>
          </div>
        </div>

        {/* 3. L포인트 교환 */}
        <div className="bg-slate-950 border border-emerald-500/30 rounded-2xl overflow-hidden shadow-md flex flex-col">
          <div className="bg-yellow-400 text-slate-950 font-black px-4 py-2.5 text-center text-sm tracking-wide">
            L포인트 교환
          </div>
          <div className="p-3.5 flex-1 divide-y divide-slate-800/70 bg-emerald-950/20 text-xs">
            <div className="flex items-center justify-between py-1.5">
              <span className="font-black text-emerald-400">50포</span>
              <span className="text-slate-500 font-black">▶</span>
              <span className="font-extrabold text-slate-100">퀵뷰 7일</span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="font-black text-emerald-400">70포</span>
              <span className="text-slate-500 font-black">▶</span>
              <span className="font-extrabold text-slate-100">33개</span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="font-black text-emerald-400">90포</span>
              <span className="text-slate-500 font-black">▶</span>
              <span className="font-extrabold text-slate-100">50개</span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="font-black text-emerald-400">100포</span>
              <span className="text-slate-500 font-black">▶</span>
              <span className="font-extrabold text-amber-300">1회연참권</span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="font-black text-emerald-400">150포</span>
              <span className="text-slate-500 font-black">▶</span>
              <span className="font-extrabold text-slate-100">121개</span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="font-black text-emerald-400">200포</span>
              <span className="text-slate-500 font-black">▶</span>
              <span className="font-black text-rose-400">🍗 치킨</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-200">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-400 text-xs font-bold">
            <GiftIcon size={14} />
            <span>LeeeL's Guide</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center space-x-3">
            <span>아이템 보유 현황</span>
          </h2>
          <p className="text-sm text-slate-400">
            시청자 닉네임을 검색하여 인게임 아이템, 방송&리액션, L포인트, 데스노트를 탭별로 확인하세요.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onGoGuide}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sm font-semibold text-sky-300 transition cursor-pointer"
          >
            <BookOpenIcon size={16} />
            <span>시참 룰북 보기</span>
          </button>
          <button
            onClick={onGoHome}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sm font-semibold text-slate-200 transition cursor-pointer"
          >
            <ArrowLeftIcon size={16} />
            <span>메인으로</span>
          </button>
        </div>
      </div>

      {/* Search Bar & Notice Banner */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-4">
        <form onSubmit={handleSearchSubmit} className="relative">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span className="flex items-center space-x-1.5">
              <SearchIcon size={14} className="text-amber-400" />
              <span>시청자 / 소환사 닉네임 검색</span>
            </span>
            <span className="text-xs text-amber-400 font-bold">
              총 {allUserNames.length}명 등록됨
            </span>
          </label>

          <div className="flex flex-col sm:flex-row gap-2.5 relative">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                placeholder="시청자 / 소환사 닉네임 입력..."
                className="w-full bg-slate-950 border-2 border-slate-800 focus:border-amber-500 rounded-2xl pl-11 pr-24 py-3.5 text-base text-slate-100 font-bold placeholder-slate-500 outline-none transition shadow-inner"
              />
              <div className="absolute left-3.5 top-4 text-slate-400">
                <SearchIcon size={20} className="text-amber-400" />
              </div>

              {searchInput && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput("");
                    setSearchedName("");
                    setShowDropdown(false);
                  }}
                  className="absolute right-3 top-3 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg transition font-semibold cursor-pointer"
                >
                  지우기
                </button>
              )}
            </div>

            <button
              type="submit"
              className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black px-7 py-3.5 rounded-2xl shadow-lg transition flex items-center justify-center space-x-2 shrink-0 text-sm cursor-pointer"
            >
              <SearchIcon size={16} />
              <span>아이템 조회</span>
            </button>
          </div>

          {/* Autocomplete Dropdown */}
          {showDropdown && filteredDropdownNames.length > 0 && (
            <>
              <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setShowDropdown(false)} />
              <div className="absolute left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-h-64 overflow-y-auto z-50 p-2 divide-y divide-slate-800/80 animate-in fade-in duration-150">
                <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 flex items-center justify-between">
                  <span>추천 닉네임 목록</span>
                  <span>클릭 시 즉시 조회</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 pt-1">
                  {filteredDropdownNames.map((name) => {
                    const u = userMap[name.toLowerCase()];
                    return (
                      <button
                        key={name}
                        type="button"
                        onPointerDown={(e) => {
                          e.preventDefault();
                          handleSelectUser(name);
                        }}
                        onClick={() => handleSelectUser(name)}
                        className="text-left px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-between text-slate-200 hover:bg-amber-500/20 hover:text-amber-300 cursor-pointer"
                      >
                        <span className="truncate">{name}</span>
                        {u && u.totalItemCount !== 0 && (
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-extrabold shrink-0 ml-1 ${
                            u.totalItemCount < 0 ? "bg-rose-950 text-rose-400" : "bg-slate-800 text-amber-400"
                          }`}>
                            {u.totalItemCount}개
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </form>

        {/* 💡 요청 안내 사항 배너 */}
        <div className="flex items-start sm:items-center space-x-2.5 pt-1 text-xs text-amber-300/90 font-medium bg-amber-950/30 border border-amber-500/20 rounded-2xl px-4 py-3">
          <InfoIcon size={16} className="text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
          <span className="leading-relaxed">
            * 안내 사항 : 시트별 등록 유저명이 다를 수 있습니다. 정확한 명칭 검색을 부탁드립니다. (예시 : 노말, 김노말)
          </span>
        </div>
      </section>

      {/* Category Navigation Bar (1부터 5까지 순서대로 넘버링) */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none">
        <button
          onClick={() => setActiveCategoryTab("ingame")}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap flex items-center space-x-2 cursor-pointer ${
            activeCategoryTab === "ingame"
              ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-950/50"
              : "bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800"
          }`}
        >
          <ShieldIcon size={16} />
          <span>⚔️ 1. 인게임 아이템</span>
        </button>

        <button
          onClick={() => setActiveCategoryTab("broadcast")}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap flex items-center space-x-2 cursor-pointer ${
            activeCategoryTab === "broadcast"
              ? "bg-pink-500 text-white shadow-lg shadow-pink-950/50"
              : "bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800"
          }`}
        >
          <SparklesIcon size={16} />
          <span>✨ 2. 방송 & 리액션 아이템</span>
        </button>

        <button
          onClick={() => setActiveCategoryTab("points")}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap flex items-center space-x-2 cursor-pointer ${
            activeCategoryTab === "points"
              ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-950/50"
              : "bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800"
          }`}
        >
          <TrophyIcon size={16} />
          <span>💰 3. L포인트</span>
        </button>

        <button
          onClick={() => setActiveCategoryTab("deathnote")}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap flex items-center space-x-2 cursor-pointer ${
            activeCategoryTab === "deathnote"
              ? "bg-rose-500 text-white shadow-lg shadow-rose-950/50"
              : "bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800"
          }`}
        >
          <InfoIcon size={16} />
          <span>🚨 4. 데스노트 & 팀금</span>
        </button>

        <button
          onClick={() => setActiveCategoryTab("sheets")}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap flex items-center space-x-2 cursor-pointer ${
            activeCategoryTab === "sheets"
              ? "bg-purple-600 text-white shadow-lg shadow-purple-950/50"
              : "bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800"
          }`}
        >
          <BookOpenIcon size={16} />
          <span>📑 5. 시트별 원본 테이블 목록</span>
        </button>
      </div>

      {/* Searched User Banner Bar */}
      {searchedName && activeCategoryTab !== "sheets" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center space-x-3">
            <span className="text-xs font-bold text-slate-400">조회 대상 소환사:</span>
            <span className="text-lg sm:text-xl font-black text-amber-400 flex items-center space-x-2">
              <span>{displayedUser ? displayedUser.name : searchedName}</span>
              {displayedUser?.notFound && (
                <span className="text-xs font-normal text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md">
                  (시트 미등록)
                </span>
              )}
            </span>
            {teamBanInfo && (
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-rose-950 text-rose-300 border border-rose-500/50 flex items-center space-x-1">
                <span>🚨 팀장 참여 금지</span>
                <span className="text-rose-400 font-extrabold">({teamBanInfo})</span>
              </span>
            )}
            {deathnoteList.length > 0 && (
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-amber-950 text-amber-300 border border-amber-500/50">
                ⚠️ 데스노트 {deathnoteList.length}회
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => onSearchPlayer(displayedUser ? displayedUser.name : searchedName)}
            className="inline-flex items-center justify-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 font-bold text-xs border border-slate-700 transition cursor-pointer"
          >
            <BarChartIcon size={14} />
            <span>.GG 전적 & 티어 조회 ↗</span>
          </button>
        </div>
      )}

      {/* CASE A: No User Searched - Clean Welcome Screen */}
      {!searchedName && activeCategoryTab !== "sheets" && (
        <div className="space-y-6">
          <section className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-10 text-center space-y-5 shadow-2xl">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
              <GiftIcon size={32} />
            </div>
            <div className="space-y-2 max-w-lg mx-auto">
              <h3 className="text-2xl font-black text-white">시청자 아이템을 조회해보세요</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                상단 검색창에 닉네임을 입력하시면 인게임 아이템, 방송&리액션, L포인트, 데스노트 내역을 탭별로 즉시 확인하실 수 있습니다.
              </p>
            </div>

            <div className="bg-slate-900/80 border border-amber-500/20 rounded-2xl p-4 max-w-xl mx-auto text-xs text-amber-300/90 font-medium leading-relaxed">
              * 안내 사항 : 시트별 등록 유저명이 다를 수 있습니다. 정확한 명칭 검색을 부탁드립니다. (예시 : 노말, 김노말)
            </div>
          </section>

          {/* Display exchange rules even before searching */}
          {renderExchangeRulesSection()}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────── */}
      {/* TAB 1: ⚔️ 1. 인게임 아이템 (참여, 팀, 밴픽, 듀랭, 티어/라인, 기타) */}
      {/* ─────────────────────────────────────────────────────────── */}
      {searchedName && activeCategoryTab === "ingame" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <ShieldIcon size={18} />
                </div>
                <div>
                  <h4 className="font-black text-white text-base sm:text-lg">1. 인게임 아이템</h4>
                  <p className="text-[11px] text-slate-400">내전 참여권, 팀 구성권, 밴픽, 듀랭(44룰렛 포함), 라인/티어 변경권</p>
                </div>
              </div>
              <span className="text-xs font-bold text-cyan-400 bg-cyan-950 px-3 py-1 rounded-full border border-cyan-500/30">
                총 {totalIngameItemCount}개 보유
              </span>
            </div>

            <div className="space-y-6">
              {ingameGroups.map((group) => (
                <div key={group.title} className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs sm:text-sm font-black text-slate-200 flex items-center space-x-2">
                      <span className={`px-2 py-0.5 rounded-lg border text-[11px] font-bold ${group.badgeColor}`}>
                        {group.title}
                      </span>
                    </h5>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
                    {group.items.map((item) => renderItemSlot(item, "cyan"))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 교환의 장 안내 카드 */}
          {renderExchangeRulesSection()}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────── */}
      {/* TAB 2: ✨ 2. 방송 & 리액션 아이템 전체 표 */}
      {/* ─────────────────────────────────────────────────────────── */}
      {searchedName && activeCategoryTab === "broadcast" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20">
                  <SparklesIcon size={18} />
                </div>
                <div>
                  <h4 className="font-black text-white text-base sm:text-lg">2. 방송 & 리액션 아이템 전체 표</h4>
                  <p className="text-[11px] text-slate-400">원하는 리액션, 방송 휴방/방종권, 팬서비스(전데/방셀/식데), 아이템</p>
                </div>
              </div>
              <span className="text-xs font-bold text-pink-400 bg-pink-950 px-3 py-1 rounded-full border border-pink-500/30">
                총 {Object.values(r2Obj).reduce((a, b) => a + (Number(b) || 0), 0)}개 보유
              </span>
            </div>

            <div className="space-y-6">
              {broadcastGroups.map((group) => (
                <div key={group.title} className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs sm:text-sm font-black text-slate-200 flex items-center space-x-2">
                      <span className={`px-2 py-0.5 rounded-lg border text-[11px] font-bold ${group.badgeColor}`}>
                        {group.title}
                      </span>
                    </h5>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
                    {group.items.map((item) => renderItemSlot(item, "pink"))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 교환의 장 안내 카드 */}
          {renderExchangeRulesSection()}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────── */}
      {/* TAB 3: 💰 3. L포인트 (승리, 패배, 룰렛, 합계 점수만) */}
      {/* ─────────────────────────────────────────────────────────── */}
      {searchedName && activeCategoryTab === "points" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <TrophyIcon size={18} />
                </div>
                <div>
                  <h4 className="font-black text-white text-base sm:text-lg">3. L포인트 현황</h4>
                  <p className="text-[11px] text-slate-400">승리, 패배, 룰렛 카운트 및 총 합계 포인트</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-500/30">
                {pointsData ? "데이터 연동 완료" : "포인트 기록 없음"}
              </span>
            </div>

            {/* 4 Core Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-center space-y-1">
                <div className="text-xs font-bold text-slate-400">승리 (Wins)</div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-400">
                  {pointsData ? pointsData.wins : 0} <span className="text-xs font-normal text-slate-500">승</span>
                </div>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-center space-y-1">
                <div className="text-xs font-bold text-slate-400">패배 (Losses)</div>
                <div className="text-2xl sm:text-3xl font-black text-rose-400">
                  {pointsData ? pointsData.losses : 0} <span className="text-xs font-normal text-slate-500">패</span>
                </div>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-center space-y-1">
                <div className="text-xs font-bold text-slate-400">룰렛 (Roulette)</div>
                <div className="text-2xl sm:text-3xl font-black text-amber-400">
                  {pointsData ? pointsData.roulette : 0} <span className="text-xs font-normal text-slate-500">회</span>
                </div>
              </div>

              <div className="bg-slate-950/80 border-2 border-emerald-500/40 rounded-2xl p-4 text-center space-y-1">
                <div className="text-xs font-black text-emerald-300 uppercase">합계 점수 (Total)</div>
                <div className={`text-2xl sm:text-3xl font-black ${
                  (pointsData?.totalPoints || 0) >= 0 ? "text-emerald-400" : "text-rose-400"
                }`}>
                  {pointsData ? `${pointsData.totalPoints > 0 ? "+" : ""}${pointsData.totalPoints}` : 0} <span className="text-xs font-normal text-slate-400">P</span>
                </div>
              </div>
            </div>

            {pointsData && (pointsData.notes || pointsData.chicken) && (
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3 text-xs text-amber-300 flex items-center space-x-2">
                <SparklesIcon size={14} className="text-amber-400 shrink-0" />
                <span><strong>비고 / 치킨 적립:</strong> {pointsData.notes || `${pointsData.chicken}치킨`}</span>
              </div>
            )}
          </section>

          {/* L포인트 교환 & 양도 안내 카드 */}
          {renderExchangeRulesSection()}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────── */}
      {/* ─────────────────────────────────────────────────────────── */}
      {/* TAB 4: 🚨 4. 데스노트 & 팀금 (팀장 참여 금지) */}
      {/* ─────────────────────────────────────────────────────────── */}
      {searchedName && activeCategoryTab === "deathnote" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  <InfoIcon size={18} />
                </div>
                <div>
                  <h4 className="font-black text-white text-base sm:text-lg">4. 데스노트 & 팀금 (팀장 참여 금지) 현황</h4>
                  <p className="text-[11px] text-slate-400">팀장 참여 금지(팀금) 여부 및 데스노트 1, 2, 3, 4열 회차별 사유 내역</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {teamBanInfo && (
                  <span className="text-xs font-black px-3 py-1 rounded-full bg-rose-950 text-rose-300 border border-rose-500/50">
                    🚨 팀금 대상 ({teamBanInfo})
                  </span>
                )}
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                  deathnoteList.length > 0 ? "bg-amber-950 text-amber-300 border-amber-500/40" : "bg-emerald-950 text-emerald-300 border-emerald-500/40"
                }`}>
                  {deathnoteList.length > 0 ? `데스노트 ${deathnoteList.length}건 등록` : "데스노트 기록 없음"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* (1) 팀금 (팀장 참여 금지) 박스 */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <span className="text-xs font-black uppercase text-rose-400 flex items-center space-x-1.5">
                    <ShieldIcon size={14} />
                    <span>(1) 팀금 (팀장 참여 금지)</span>
                  </span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                    teamBanInfo 
                      ? "bg-rose-950 text-rose-300 border-rose-500/40" 
                      : "bg-emerald-950 text-emerald-300 border-emerald-500/40"
                  }`}>
                    {teamBanInfo ? "팀금 적용" : "정상"}
                  </span>
                </div>

                {teamBanInfo ? (
                  <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 text-sm text-slate-100 whitespace-pre-wrap break-all leading-relaxed font-sans">
                    {teamBanInfo}
                  </div>
                ) : (
                  <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 text-center text-xs text-slate-400 space-y-1.5">
                    <CheckIcon size={20} className="mx-auto text-emerald-400" />
                    <div className="font-bold text-slate-200">팀금 내역 없음</div>
                    <p className="text-[11px] text-slate-400">팀금 열에 등록된 내용이 없습니다.</p>
                  </div>
                )}
              </div>

              {/* (2) 데스노트 1, 2, 3, 4열 회차별 사유 박스 */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <span className="text-xs font-black uppercase text-amber-400 flex items-center space-x-1.5">
                    <InfoIcon size={14} />
                    <span>(2) 데스노트 (1, 2, 3, 4열 회차별 사유)</span>
                  </span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                    deathnoteList.length > 0
                      ? "bg-amber-950 text-amber-300 border-amber-500/40"
                      : "bg-slate-900 text-slate-400 border-slate-700"
                  }`}>
                    총 {deathnoteList.length}건
                  </span>
                </div>

                {deathnoteList.length > 0 ? (
                  <div className="space-y-2.5">
                    {deathnoteList.map((item, idx) => (
                      <div key={idx} className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-xl p-3 text-xs text-slate-200 flex items-start space-x-2.5 transition">
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-black text-[11px] shrink-0">
                          {item.round}열 ({item.round}차)
                        </span>
                        <span className="leading-relaxed font-medium text-slate-200">{item.reason}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 text-center text-xs text-slate-400 space-y-2">
                    <CheckIcon size={20} className="mx-auto text-emerald-400" />
                    <div className="font-bold text-slate-200">등록된 데스노트(주의/경고) 기록이 없습니다.</div>
                    <p className="text-[11px] text-slate-400">1, 2, 3, 4열 모두 깨끗한 클린 유저입니다.</p>
                  </div>
                )}
              </div>

              {/* (3) 칭찬스티커 기록 (존재 시 표시) */}
              {praiseList.length > 0 && (
                <div className="col-span-1 md:col-span-2 bg-slate-950/80 border border-cyan-500/30 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <span className="text-xs font-black uppercase text-cyan-400 flex items-center space-x-1.5">
                      <SparklesIcon size={14} />
                      <span>(3) 칭찬스티커 내역</span>
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                      총 {praiseList.length}개
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {praiseList.map((p, idx) => (
                      <div key={idx} className="bg-cyan-950/20 border border-cyan-500/20 rounded-xl p-3 text-xs text-cyan-200">
                        ⭐ {p}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </section>

          {/* 교환의 장 안내 카드 */}
          {renderExchangeRulesSection()}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────── */}
      {/* TAB 5: 📑 5. 시트별 원본 데이터 테이블 (Admin & Raw Data Auditing) */}
      {/* ─────────────────────────────────────────────────────────── */}
      {activeCategoryTab === "sheets" && (
        <section className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl space-y-4">
          <div className="px-6 py-5 bg-slate-900/90 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-white">📑 5. 시트별 원본 데이터 테이블</h3>
              <p className="text-xs text-slate-400 mt-0.5">구글 스프레드시트 7개 시트의 원본 등록 데이터를 직접 조회합니다.</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={sheetTableTab}
                onChange={(e) => setSheetTableTab(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 outline-none"
              >
                <option value="r1">⚔️ 룰렛1 내전 아이템 ({roulette1.rows.length}명)</option>
                <option value="r2">✨ 룰렛2 방송 아이템 ({roulette2.rows.length}명)</option>
                <option value="points">💰 L포인트 & 치킨 ({points.length}명)</option>
                <option value="r44">🎲 44 룰렛 ({roulette44.rows.length}명)</option>
                <option value="tft">♟️ 롤토체스 ({tft.rows.length}명)</option>
                <option value="deathnote">🚨 데스노트 ({deathnote.length}명)</option>
                <option value="praise">🌟 칭찬스티커 ({praise.length}명)</option>
              </select>

              <input
                type="text"
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                placeholder="테이블 검색..."
                className="bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-1.5 text-xs text-slate-200 outline-none w-36 focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Sheet Table: Roulette 1 */}
          {sheetTableTab === "r1" && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-bold uppercase">
                    <th className="py-3 px-4 w-14">순번</th>
                    <th className="py-3 px-4">닉네임</th>
                    <th className="py-3 px-4 text-center">총 보유량</th>
                    {(roulette1.headers || []).map(h => (
                      <th key={h} className="py-3 px-2 text-center whitespace-nowrap">{h}</th>
                    ))}
                    <th className="py-3 px-4 text-center">조회</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {roulette1.rows
                    .filter(r => !tableSearch || r.name.toLowerCase().includes(tableSearch.toLowerCase()))
                    .map((r, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40 transition">
                        <td className="py-3 px-4 text-slate-500 font-bold">{idx + 1}</td>
                        <td className="py-3 px-4 font-black text-slate-200">
                          <button onClick={() => { handleSelectUser(r.name); setActiveCategoryTab("ingame"); }} className="hover:text-cyan-400 cursor-pointer">
                            {r.name}
                          </button>
                        </td>
                        <td className={`py-3 px-4 text-center font-black ${r.totalCount < 0 ? "text-rose-400" : "text-amber-400"}`}>{r.totalCount}개</td>
                        {(roulette1.headers || []).map(h => {
                          const val = r.items[h];
                          const isNeg = typeof val === 'number' && val < 0;
                          return (
                            <td key={h} className="py-3 px-2 text-center font-bold text-slate-300">
                              {val ? <span className={isNeg ? "text-rose-400 font-black" : "text-cyan-300 font-black"}>{val}</span> : <span className="text-slate-600">0</span>}
                            </td>
                          );
                        })}
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => { handleSelectUser(r.name); setActiveCategoryTab("ingame"); }}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-cyan-500/20 text-cyan-300 font-bold text-[11px] cursor-pointer"
                          >
                            조회
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Sheet Table: Roulette 2 */}
          {sheetTableTab === "r2" && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-bold uppercase">
                    <th className="py-3 px-4 w-14">순번</th>
                    <th className="py-3 px-4">닉네임</th>
                    <th className="py-3 px-4 text-center">총 보유량</th>
                    {(roulette2.headers || []).map(h => (
                      <th key={h} className="py-3 px-2 text-center whitespace-nowrap">{h}</th>
                    ))}
                    <th className="py-3 px-4 text-center">조회</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {roulette2.rows
                    .filter(r => !tableSearch || r.name.toLowerCase().includes(tableSearch.toLowerCase()))
                    .map((r, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40 transition">
                        <td className="py-3 px-4 text-slate-500 font-bold">{idx + 1}</td>
                        <td className="py-3 px-4 font-black text-slate-200">
                          <button onClick={() => { handleSelectUser(r.name); setActiveCategoryTab("broadcast"); }} className="hover:text-pink-400 cursor-pointer">
                            {r.name}
                          </button>
                        </td>
                        <td className={`py-3 px-4 text-center font-black ${r.totalCount < 0 ? "text-rose-400" : "text-pink-400"}`}>{r.totalCount}개</td>
                        {(roulette2.headers || []).map(h => (
                          <td key={h} className="py-3 px-2 text-center font-bold text-slate-300">
                            {r.items[h] ? <span className="text-pink-300 font-black">{r.items[h]}</span> : <span className="text-slate-600">0</span>}
                          </td>
                        ))}
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => { handleSelectUser(r.name); setActiveCategoryTab("broadcast"); }}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-pink-500/20 text-pink-300 font-bold text-[11px] cursor-pointer"
                          >
                            조회
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Sheet Table: Points */}
          {sheetTableTab === "points" && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-bold uppercase">
                    <th className="py-3 px-4 w-14">순번</th>
                    <th className="py-3 px-4">닉네임</th>
                    <th className="py-3 px-4 text-right">총 포인트</th>
                    <th className="py-3 px-4 text-center">승 / 패</th>
                    <th className="py-3 px-4 text-center">룰렛</th>
                    <th className="py-3 px-4">비고 메모</th>
                    <th className="py-3 px-4 text-center">조회</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {points
                    .filter(p => !tableSearch || p.name.toLowerCase().includes(tableSearch.toLowerCase()))
                    .map((p, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40 transition">
                        <td className="py-3 px-4 text-slate-500 font-bold">{idx + 1}</td>
                        <td className="py-3 px-4 font-black text-slate-200">
                          <button onClick={() => { handleSelectUser(p.name); setActiveCategoryTab("points"); }} className="hover:text-emerald-400 cursor-pointer">
                            {p.name}
                          </button>
                        </td>
                        <td className={`py-3 px-4 text-right font-black ${p.totalPoints >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                          {p.totalPoints > 0 ? `+${p.totalPoints}` : p.totalPoints} P
                        </td>
                        <td className="py-3 px-4 text-center text-slate-300 font-bold">
                          <span className="text-emerald-400">{p.wins}승</span> / <span className="text-rose-400">{p.losses}패</span>
                        </td>
                        <td className="py-3 px-4 text-center text-amber-400 font-bold">{p.roulette}회</td>
                        <td className="py-3 px-4 text-slate-300">{p.notes || "-"}</td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => { handleSelectUser(p.name); setActiveCategoryTab("points"); }}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-emerald-500/20 text-emerald-300 font-bold text-[11px] cursor-pointer"
                          >
                            조회
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Sheet Table: 44 */}
          {sheetTableTab === "r44" && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-bold uppercase">
                    <th className="py-3 px-4">닉네임</th>
                    {(roulette44.headers || []).map(h => (
                      <th key={h} className="py-3 px-3 text-center">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {roulette44.rows
                    .filter(r => !tableSearch || r.name.toLowerCase().includes(tableSearch.toLowerCase()))
                    .map((r, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40">
                        <td className="py-3 px-4 font-bold text-slate-200">
                          <button onClick={() => { handleSelectUser(r.name); setActiveCategoryTab("ingame"); }} className="hover:text-rose-400 cursor-pointer">
                            {r.name}
                          </button>
                        </td>
                        {(roulette44.headers || []).map(h => (
                          <td key={h} className="py-3 px-3 text-center font-bold text-rose-400">
                            {r.items[h] || 0}
                          </td>
                        ))}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Sheet Table: TFT */}
          {sheetTableTab === "tft" && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-bold uppercase">
                    <th className="py-3 px-4">닉네임</th>
                    {(tft.headers || []).map(h => (
                      <th key={h} className="py-3 px-3 text-center">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {tft.rows
                    .filter(r => !tableSearch || r.name.toLowerCase().includes(tableSearch.toLowerCase()))
                    .map((r, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40">
                        <td className="py-3 px-4 font-bold text-slate-200">
                          <button onClick={() => { handleSelectUser(r.name); setActiveCategoryTab("ingame"); }} className="hover:text-amber-400 cursor-pointer">
                            {r.name}
                          </button>
                        </td>
                        {(tft.headers || []).map(h => (
                          <td key={h} className="py-3 px-3 text-center font-bold text-amber-400">
                            {r.items[h] || 0}
                          </td>
                        ))}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Sheet Table: Deathnote */}
          {sheetTableTab === "deathnote" && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-bold uppercase">
                    <th className="py-3 px-4 w-12">순번</th>
                    <th className="py-3 px-4">닉네임</th>
                    <th className="py-3 px-3 text-center">팀금 (팀장 금지)</th>
                    <th className="py-3 px-3">1차 사유 (1열)</th>
                    <th className="py-3 px-3">2차 사유 (2열)</th>
                    <th className="py-3 px-3">3차 사유 (3열)</th>
                    <th className="py-3 px-3">4차 사유 (4열)</th>
                    <th className="py-3 px-4 text-center">조회</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {deathnote
                    .filter(d => !tableSearch || d.name.toLowerCase().includes(tableSearch.toLowerCase()))
                    .map((d, idx) => {
                      const dnMap = {};
                      (d.deathnotes || []).forEach(item => {
                        if (typeof item === "object") dnMap[item.round] = item.reason;
                      });
                      return (
                        <tr key={idx} className="hover:bg-slate-800/40 transition">
                          <td className="py-3 px-4 text-slate-500 font-bold">{idx + 1}</td>
                          <td className="py-3 px-4 font-black text-slate-200">
                            <button onClick={() => { handleSelectUser(d.name); setActiveCategoryTab("deathnote"); }} className="hover:text-rose-400 cursor-pointer">
                              {d.name}
                            </button>
                          </td>
                          <td className="py-3 px-3 text-center text-rose-300 font-semibold">
                            {d.teamBan || "-"}
                          </td>
                          <td className="py-3 px-3 text-slate-300">{dnMap[1] || "-"}</td>
                          <td className="py-3 px-3 text-slate-300">{dnMap[2] || "-"}</td>
                          <td className="py-3 px-3 text-slate-300">{dnMap[3] || "-"}</td>
                          <td className="py-3 px-3 text-slate-300">{dnMap[4] || "-"}</td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => { handleSelectUser(d.name); setActiveCategoryTab("deathnote"); }}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-rose-300 font-bold text-[11px] cursor-pointer"
                            >
                              조회
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          )}

          {/* Sheet Table: Praise */}
          {sheetTableTab === "praise" && (
            <div className="p-6 space-y-3">
              {praise
                .filter(p => !tableSearch || p.name.toLowerCase().includes(tableSearch.toLowerCase()))
                .map((p, idx) => (
                  <div key={idx} className="bg-slate-950/80 border border-cyan-500/20 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => { handleSelectUser(p.name); setActiveCategoryTab("ingame"); }}
                        className="font-black text-sm text-cyan-300 hover:underline cursor-pointer"
                      >
                        {p.name}
                      </button>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                        칭찬 {p.entries.length}회
                      </span>
                    </div>
                    <div className="space-y-1 text-xs text-slate-300">
                      {p.entries.map((e, eIdx) => (
                        <div key={eIdx}>⭐ {e}</div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </section>
      )}

    </main>
  );
};

window.InventoryPage = InventoryPage;
