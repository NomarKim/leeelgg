// Application Footer
const Footer = () => {
  return (
    <footer className="border-t border-slate-900 bg-slate-950 py-8 mt-auto text-center text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 space-y-1">
        <p className="font-semibold text-slate-400">
          LeeeL.GG &copy; {new Date().getFullYear()}
        </p>
        <p className="text-[11px] text-slate-600">
          구글 스프레드시트 실시간 연동 기반 전적 & 맞라인 전적 분석
        </p>
      </div>
    </footer>
  );
};

window.Footer = Footer;
