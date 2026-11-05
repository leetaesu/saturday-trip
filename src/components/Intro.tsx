import { useEffect, useState } from 'react';

/** 페이지를 열거나 새로고침할 때마다 잠깐 보여 주는 가족 그림 인트로 */
export function Intro() {
  const [phase, setPhase] = useState<'show' | 'leaving' | 'done'>('show');

  const close = () => {
    setPhase('leaving');
    window.setTimeout(() => setPhase('done'), 450);
  };

  useEffect(() => {
    if (phase !== 'show') return;
    const id = window.setTimeout(close, 3500);
    return () => window.clearTimeout(id);
  }, [phase]);

  if (phase === 'done') return null;

  return (
    <div
      role="dialog"
      aria-label="로둥이네의 온천여행 인트로"
      onClick={close}
      className={`no-print fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-b from-mint via-cream to-peach-soft px-6 transition-opacity duration-500 ${
        phase === 'leaving' ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="intro-pop w-full max-w-md">
        <div className="overflow-hidden rounded-[32px] bg-white p-2 shadow-lift">
          <img
            src={`${import.meta.env.BASE_URL}family.jpg`}
            alt="웃고 있는 로둥이네 가족 그림"
            className="w-full rounded-[26px]"
            width={1100}
            height={825}
          />
        </div>
        <p className="mt-8 text-center text-[15px] font-bold text-teal">♨️ 따끈따끈 겨울 나들이</p>
        <h1 className="mt-1 text-center text-[32px] font-extrabold tracking-tight text-ink-strong">로둥이네의 온천여행</h1>
        <p className="mt-2 text-center text-[14px] text-taupe">5살 둥이 형제와 엄마·아빠의 온양온천랜드 여행</p>
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          close();
        }}
        className="mt-10 min-h-12 rounded-full bg-teal-deep px-8 text-[16px] font-bold text-white shadow-teal"
      >
        여행 시작하기
      </button>
    </div>
  );
}
