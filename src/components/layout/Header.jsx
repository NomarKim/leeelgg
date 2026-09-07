// List of SOOP VOD Links (Exact URLs)
const SOOP_VOD_LINKS = [
  "https://vod.sooplive.com/player/165799269/catch",
  "https://vod.sooplive.com/player/175843151/catch",
  "https://vod.sooplive.com/player/168954645/catch",
  "https://vod.sooplive.com/player/174924429/catch",
  "https://vod.sooplive.com/player/183881179/catch",
  "https://vod.sooplive.com/player/188490169/catch",
  "https://vod.sooplive.com/player/204102809",
  "https://vod.sooplive.com/player/202507153",
  "https://vod.sooplive.com/player/193434681",
  "https://vod.sooplive.com/player/182428189",
  "https://vod.sooplive.com/player/179155543",
  "https://vod.sooplive.com/player/177504187",
  "https://vod.sooplive.com/player/174370773",
  "https://vod.sooplive.com/player/175662185",
  "https://vod.sooplive.com/player/175843145",
  "https://vod.sooplive.com/player/173849937",
  "https://vod.sooplive.com/player/165759719"
];

const getRandomVodUrl = () => {
  const randomIndex = Math.floor(Math.random() * SOOP_VOD_LINKS.length);
  return SOOP_VOD_LINKS[randomIndex];
};

// Application Top Header Bar
const Header = ({ onGoHome, onSync, loading, isHome = false, appliedPlayer = "" }) => {
  const { useState } = React;
  const { RefreshIcon, ArrowLeftIcon } = window.Icons;

  // Random SOOP VOD Link state
  const [vodUrl, setVodUrl] = useState(() => getRandomVodUrl());

  const handleShuffle = (e) => {
    const randomUrl = getRandomVodUrl();
    setVodUrl(randomUrl);
    if (e && e.currentTarget) {
      e.currentTarget.href = randomUrl;
    }
  };

  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Back to Home */}
        <div 
          onClick={onGoHome}
          className="flex items-center space-x-3 cursor-pointer group select-none transition transform hover:scale-[1.01]"
        >
          {!isHome && (
            <div className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 group-hover:text-cyan-400 group-hover:border-cyan-500/50 transition">
              <ArrowLeftIcon size={16} />
            </div>
          )}

          {/* Clickable Circular Avatar with Random SOOP VOD Link */}
          <a
            href={vodUrl}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={handleShuffle}
            onPointerDown={handleShuffle}
            onTouchStart={handleShuffle}
            onClick={(e) => {
              e.stopPropagation();
              handleShuffle(e);
            }}
            className="relative group/avatar inline-flex items-center cursor-pointer"
            title="SOOP 다시보기 보러가기 (클릭할 때마다 17개 영상 중 랜덤 재생)"
          >
            <img
              src="./assets/leeel_profile.png"
              alt="LeeeL"
              className="w-9 h-9 rounded-full object-cover border-2 border-cyan-400 shadow-md shadow-cyan-500/20 group-hover/avatar:border-cyan-300 group-hover/avatar:scale-115 group-hover/avatar:shadow-cyan-400/60 transition-all duration-200"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-900 animate-pulse"></span>
          </a>

          {/* Title */}
          <div>
            <h1 className="text-xl font-black tracking-tight bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
              LeeeL.GG
            </h1>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-3">
          {!isHome && appliedPlayer && (
            <span className="hidden md:inline-flex items-center text-xs text-slate-400 bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-lg">
              현재 조회: <strong className="ml-1.5 text-cyan-400">{appliedPlayer}</strong>
            </span>
          )}
          <button
            onClick={onSync}
            disabled={loading}
            className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 border border-slate-700 transition duration-200 text-xs sm:text-sm font-medium text-slate-200 disabled:opacity-50"
            title="구글 스프레드시트 최신 데이터 실시간 불러오기"
          >
            {loading ? <RefreshIcon size={15} /> : (
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400">
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
              </svg>
            )}
            <span>{loading ? "동기화 중..." : "실시간 동기화"}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

window.Header = Header;
