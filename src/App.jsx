// Main Application Component
const { useState, useEffect, useMemo } = React;

function App() {
  const { getDefaultDateRange, parseGameDate } = window.DateUtils;
  const { loadAllDataLive } = window.SheetsApi;

  const defaultDates = useMemo(() => getDefaultDateRange(7), []);

  // Application View: "home" | "analytics" (LeeeL's Record) | "guide" (LeeeL's Guide) | "award" (LeeeL's Award)
  const [view, setView] = useState("home");
  const [data, setData] = useState(window.MOCK_DATA || { players: [], tpRules: {}, matches: [] });
  const [loading, setLoading] = useState(false);

  // Search & Filter State
  const [searchName, setSearchName] = useState(window.CONFIG.DEFAULT_PLAYER || "리엘");
  const [startDate, setStartDate] = useState(defaultDates.startDate);
  const [endDate, setEndDate] = useState(defaultDates.endDate);

  // Applied Query in Analytics View
  const [appliedPlayer, setAppliedPlayer] = useState(window.CONFIG.DEFAULT_PLAYER || "리엘");
  const [appliedStartDate, setAppliedStartDate] = useState(defaultDates.startDate);
  const [appliedEndDate, setAppliedEndDate] = useState(defaultDates.endDate);

  // Initial Live Data Load
  useEffect(() => {
    fetchLiveData(true);
  }, []);

  const fetchLiveData = async (isInitial = false) => {
    setLoading(true);
    try {
      const liveData = await loadAllDataLive();
      if (liveData.players.length > 0 && liveData.matches.length > 0) {
        setData(liveData);
      }
    } catch (err) {
      console.warn("Live Google Sheets sync fallback:", err);
      if (!isInitial) {
        alert("구글 스프레드시트 실시간 동기화에 실패하여 내장된 최신 샘플 데이터로 작동합니다.\n시트 공유 권한이 \x27링크가 있는 모든 사용자(뷰어)\x27인지 확인해 주세요.");
      }
    } finally {
      setLoading(false);
    }
  };

  // All registered player names (DB users + unique participants in matches)
  const allPlayerNames = useMemo(() => {
    const names = new Set(data.players.map(p => p.gameId));
    data.matches.forEach(row => {
      for (let i = 1; i <= 10; i++) {
        if (row[i]) names.add(row[i]);
      }
    });
    return Array.from(names).filter(Boolean).sort();
  }, [data]);

  // Navigate from Home Landing Page to Analytics Dashboard
  const handleSearchFromHome = (playerName, start, end) => {
    const target = playerName || window.CONFIG.DEFAULT_PLAYER || "리엘";
    setAppliedPlayer(target);
    setSearchName(target);
    if (start) {
      setStartDate(start);
      setAppliedStartDate(start);
    }
    if (end) {
      setEndDate(end);
      setAppliedEndDate(end);
    }
    setView("analytics");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Re-inquire inside Analytics Dashboard
  const handleInquireFromAnalytics = () => {
    const target = searchName.trim();
    if (!target) {
      alert("조회할 유저명을 입력해 주세요.");
      return;
    }
    setAppliedPlayer(target);
    setAppliedStartDate(startDate);
    setAppliedEndDate(endDate);
  };

  const handleGoHome = () => {
    setView("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // User Profile Mapping (DB user + TP points)
  const playerProfile = useMemo(() => {
    if (!appliedPlayer) return null;
    const user = data.players.find(p => (p.gameId || "").toLowerCase() === appliedPlayer.toLowerCase());
    const positionsList = window.CONFIG.POSITIONS || ["탑", "정글", "미드", "원딜", "서폿"];

    const positionEntries = positionsList.map(line => {
      if (!user) return { line, tier: "미등록", points: 0, isRegistered: false };
      
      const pos = user.positions.find(p => p.line === line);
      if (!pos) return { line, tier: "미등록", points: 0, isRegistered: false };
      
      const tierRule = data.tpRules[pos.tier];
      const points = tierRule ? Math.round(tierRule[line] || 0) : 0;
      
      return {
        line,
        tier: pos.tier,
        points: points,
        isRegistered: true
      };
    });

    return {
      gameId: user ? user.gameId : appliedPlayer,
      afreecaId: user ? user.afreecaId : "미등록",
      notes: user ? user.notes : "DB(user)2 미등록 유저",
      positions: positionEntries
    };
  }, [appliedPlayer, data]);

  // Match filtering by date period
  const isMatchInPeriod = (matchDateStr) => {
    const mDate = parseGameDate(matchDateStr);
    const start = new Date(appliedStartDate + "T00:00:00");
    const end = new Date(appliedEndDate + "T23:59:59");
    return mDate >= start && mDate <= end;
  };

  const parsedMatches = useMemo(() => {
    return data.matches.map(row => {
      const winner = row[0];
      const dateStr = row[21];
      const bluePlayers = [row[1], row[2], row[3], row[4], row[5]];
      const redPlayers = [row[6], row[7], row[8], row[9], row[10]];
      const blueChamps = [row[11], row[12], row[13], row[14], row[15]];
      const redChamps = [row[16], row[17], row[18], row[19], row[20]];
      
      return {
        winner,
        blue: { players: bluePlayers, champs: blueChamps },
        red: { players: redPlayers, champs: redChamps },
        dateStr,
        dateObj: parseGameDate(dateStr)
      };
    }).filter(m => isMatchInPeriod(m.dateStr));
  }, [data, appliedStartDate, appliedEndDate]);

  const positionsList = window.CONFIG.POSITIONS || ["탑", "정글", "미드", "원딜", "서폿"];

  // Side and Line Stats
  const stats = useMemo(() => {
    const initSideStats = () => positionsList.map(pos => ({ pos, win: 0, loss: 0 }));
    const res = {
      all: initSideStats(),
      blue: initSideStats(),
      red: initSideStats()
    };

    if (!appliedPlayer) return res;

    parsedMatches.forEach(m => {
      const bIdx = m.blue.players.findIndex(p => p && p.toLowerCase() === appliedPlayer.toLowerCase());
      if (bIdx !== -1) {
        const isWin = m.winner === "B";
        if (isWin) res.all[bIdx].win++;
        else res.all[bIdx].loss++;
        if (isWin) res.blue[bIdx].win++;
        else res.blue[bIdx].loss++;
      }

      const rIdx = m.red.players.findIndex(p => p && p.toLowerCase() === appliedPlayer.toLowerCase());
      if (rIdx !== -1) {
        const isWin = m.winner === "R";
        if (isWin) res.all[rIdx].win++;
        else res.all[rIdx].loss++;
        if (isWin) res.red[rIdx].win++;
        else res.red[rIdx].loss++;
      }
    });

    return res;
  }, [parsedMatches, appliedPlayer]);

  const sumStats = useMemo(() => {
    const calcSum = (sideStats) => {
      return sideStats.reduce((acc, curr) => {
        acc.win += curr.win;
        acc.loss += curr.loss;
        return acc;
      }, { win: 0, loss: 0 });
    };
    return {
      all: calcSum(stats.all),
      blue: calcSum(stats.blue),
      red: calcSum(stats.red)
    };
  }, [stats]);

  // Head-to-Head Rival 10-match logs
  const recentHeadToHead = useMemo(() => {
    const h2h = { "탑": [], "정글": [], "미드": [], "원딜": [], "서폿": [] };
    if (!appliedPlayer) return h2h;

    const sorted = [...parsedMatches].sort((a, b) => b.dateObj - a.dateObj);

    sorted.forEach(m => {
      const bIdx = m.blue.players.findIndex(p => p && p.toLowerCase() === appliedPlayer.toLowerCase());
      if (bIdx !== -1) {
        const pos = positionsList[bIdx];
        if (h2h[pos] && h2h[pos].length < 10) {
          h2h[pos].push({
            date: m.dateStr,
            myChamp: m.blue.champs[bIdx],
            opponentName: m.red.players[bIdx],
            opponentChamp: m.red.champs[bIdx],
            result: m.winner === "B" ? "승" : "패"
          });
        }
      }

      const rIdx = m.red.players.findIndex(p => p && p.toLowerCase() === appliedPlayer.toLowerCase());
      if (rIdx !== -1) {
        const pos = positionsList[rIdx];
        if (h2h[pos] && h2h[pos].length < 10) {
          h2h[pos].push({
            date: m.dateStr,
            myChamp: m.red.champs[rIdx],
            opponentName: m.blue.players[rIdx],
            opponentChamp: m.blue.champs[rIdx],
            result: m.winner === "R" ? "승" : "패"
          });
        }
      }
    });

    return h2h;
  }, [parsedMatches, appliedPlayer]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      {/* Global Header */}
      <window.Header
        onGoHome={handleGoHome}
        onSync={() => fetchLiveData(false)}
        loading={loading}
        isHome={view === "home"}
        appliedPlayer={appliedPlayer}
      />

      {/* Screen Views */}
      {view === "home" && (
        <window.LandingSearch
          allPlayerNames={allPlayerNames}
          onSearch={handleSearchFromHome}
          onNavigate={(targetView) => {
            if (targetView === "analytics") {
              handleSearchFromHome(searchName, startDate, endDate);
            } else {
              setView(targetView);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          initialStartDate={startDate}
          initialEndDate={endDate}
        />
      )}

      {view === "guide" && (
        <window.GuidePage
          onGoHome={handleGoHome}
          onNavigateToRecord={() => handleSearchFromHome(searchName, startDate, endDate)}
        />
      )}

      {view === "award" && (
        <window.AwardPage
          onGoHome={handleGoHome}
          data={data}
          onSearchPlayer={(playerName) => handleSearchFromHome(playerName, startDate, endDate)}
        />
      )}

      {view === "analytics" && (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
          {/* Top Filter Bar */}
          <window.SearchFilter
            searchName={searchName}
            setSearchName={setSearchName}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            appliedPlayer={appliedPlayer}
            onInquire={handleInquireFromAnalytics}
            allPlayerNames={allPlayerNames}
          />

          {/* Player Profile & Tiers */}
          <window.PlayerProfile profile={playerProfile} />

          {/* Side & Line Stats */}
          <window.StatsSummary stats={stats} sumStats={sumStats} />

          {/* Head-to-Head 10-match logs */}
          <window.HeadToHead recentHeadToHead={recentHeadToHead} positionsList={positionsList} />
        </main>
      )}

      {/* Global Footer */}
      <window.Footer />
    </div>
  );
}

// Mount to DOM
const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);
root.render(<App />);
