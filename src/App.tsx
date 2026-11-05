import { Backpack, CalendarClock, House, PiggyBank, Waves, type LucideIcon } from 'lucide-react';
import { CHARACTERS } from './components/FamilyTalk';
import { Intro } from './components/Intro';
import { PrintSheet } from './components/PrintSheet';
import { cx } from './components/ui';
import { Budget } from './pages/Budget';
import { Home } from './pages/Home';
import { Info } from './pages/Info';
import { Packing } from './pages/Packing';
import { Plan } from './pages/Plan';
import { TripProvider, useTrip } from './state/TripContext';
import type { TabId } from './types';

const NAV: { id: TabId; label: string; title: string; icon: LucideIcon }[] = [
  { id: 'home', label: '홈', title: '홈', icon: House },
  { id: 'plan', label: '전체 일정', title: '전체 일정', icon: CalendarClock },
  { id: 'packing', label: '준비물', title: '준비물', icon: Backpack },
  { id: 'budget', label: '비용', title: '비용', icon: PiggyBank },
  { id: 'info', label: '여행 정보', title: '여행 정보', icon: Waves },
];

function Shell() {
  const { tab, go, toast } = useTrip();
  const current = NAV.find((n) => n.id === tab) ?? NAV[0];

  return (
    <>
      <Intro />
      <div className="no-print min-h-dvh">
        <header className="pt-safe sticky top-0 z-40 bg-cream/85 shadow-[0_4px_20px_rgb(182_163_145/0.08)] backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-xl items-center gap-3 px-5">
            <span className="flex size-10 items-center justify-center overflow-hidden rounded-full bg-peach/70">
              <img src={CHARACTERS.roy.img} alt="" className="mt-4 h-14 w-auto" />
            </span>
            <div className="leading-tight">
              <p className="text-[12px] font-bold text-teal">로둥이네의 온천여행 ♨️</p>
              <p className="text-[18px] font-extrabold text-ink-strong">{current.title}</p>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-xl px-4 pb-32 pt-4">
          {tab === 'home' && <Home />}
          {tab === 'plan' && <Plan />}
          {tab === 'packing' && <Packing />}
          {tab === 'budget' && <Budget />}
          {tab === 'info' && <Info />}
        </main>

        <nav aria-label="주요 메뉴" className="pb-safe fixed inset-x-0 bottom-0 z-50 px-3">
          <div className="mx-auto mb-3 flex max-w-xl items-stretch gap-1 rounded-[2rem] bg-card/95 p-1.5 shadow-lift backdrop-blur-2xl">
            {NAV.map((n) => {
              const active = n.id === tab;
              return (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => go(n.id)}
                  aria-current={active ? 'page' : undefined}
                  className={cx(
                    'flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 rounded-3xl px-1 text-[11.5px] font-bold transition',
                    active ? 'bg-mint-strong text-teal-deep shadow-[0_4px_14px_rgb(45_100_92/0.18)]' : 'text-taupe',
                  )}
                >
                  <n.icon className="size-[22px]" aria-hidden />
                  <span className="whitespace-nowrap">{n.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {toast && (
          <div
            role="status"
            className="toast-in fixed bottom-28 left-1/2 z-[60] w-max max-w-[90vw] -translate-x-1/2 rounded-full bg-ink-strong/90 px-5 py-3 text-[14px] font-bold text-white shadow-lift"
          >
            {toast}
          </div>
        )}
      </div>
      <PrintSheet />
    </>
  );
}

export default function App() {
  return (
    <TripProvider>
      <Shell />
    </TripProvider>
  );
}
