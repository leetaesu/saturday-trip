import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { DEFAULT_BUDGET } from '../data/budget';
import { DEFAULT_PACK_ITEMS } from '../data/packing';
import { TRIP } from '../data/trip';
import { BLOCKS } from '../data/schedule';
import { computeBudget, type BudgetResult } from '../lib/budget';
import { toMin } from '../lib/format';
import { clearAllStore, usePersistentState } from '../lib/storage';
import type {
  BlockEdit,
  BudgetState,
  Checks,
  Mode,
  PackItem,
  PackingState,
  ScheduleBlock,
  ScheduleGroupId,
  TabId,
} from '../types';

export type TimedBlock = ScheduleBlock & { startMin: number; endMin: number };

type TripContextValue = {
  tab: TabId;
  go: (tab: TabId, anchor?: string) => void;
  now: Date;

  tripDate: string;
  setTripDate: (v: string) => void;
  mode: Mode;
  setMode: (v: Mode) => void;
  departure: string;
  setDeparture: (v: string) => void;

  checks: Checks;
  toggleCheck: (id: string) => void;
  edits: Record<string, BlockEdit>;
  saveEdit: (id: string, edit: BlockEdit | null) => void;
  blocksOf: (group: ScheduleGroupId) => ScheduleBlock[];
  dayTimeline: TimedBlock[];

  packItems: PackItem[];
  packChecks: Checks;
  togglePack: (id: string) => void;
  addPackItem: (item: Omit<PackItem, 'id' | 'custom'>) => void;
  removePackItem: (item: PackItem) => void;
  hiddenCount: number;
  restoreHidden: () => void;

  confirmChecks: Checks;
  toggleConfirm: (id: string) => void;

  budget: BudgetState;
  setBudget: (updater: (b: BudgetState) => BudgetState) => void;
  budgetResult: BudgetResult;

  resetPacking: () => void;
  resetSchedule: () => void;
  resetBudget: () => void;
  resetAll: () => void;

  toast: string;
  notify: (msg: string) => void;
};

const TripContext = createContext<TripContextValue | null>(null);

const TABS: TabId[] = ['home', 'plan', 'packing', 'budget', 'info'];

function readHash(): { tab: TabId; anchor?: string } {
  const [tab, anchor] = window.location.hash.replace(/^#\/?/, '').split('/');
  return { tab: (TABS as string[]).includes(tab) ? (tab as TabId) : 'home', anchor };
}

function mergeEdit(block: ScheduleBlock, edit?: BlockEdit): ScheduleBlock {
  if (!edit) return block;
  return {
    ...block,
    start: edit.start || block.start,
    end: edit.end === undefined ? block.end : edit.end || undefined,
    title: edit.title || block.title,
    memo: edit.memo,
  };
}

export function TripProvider({ children }: { children: ReactNode }) {
  // ---- 화면 이동 (해시 방식이라 GitHub Pages에서 새로고침해도 안 깨짐)
  const [tab, setTab] = useState<TabId>(() => readHash().tab);
  useEffect(() => {
    const onHash = () => setTab(readHash().tab);
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  const go = useCallback((next: TabId, anchor?: string) => {
    window.location.hash = anchor ? `/${next}/${anchor}` : `/${next}`;
    setTab(next);
    requestAnimationFrame(() => {
      if (anchor) document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      else window.scrollTo({ top: 0 });
    });
  }, []);

  // ---- 현재 시각 (30초마다 갱신)
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  // ---- 저장되는 값들
  const [storedDate, setTripDate] = usePersistentState<string>('tripDate', TRIP.date);
  // 날짜를 지워도 기본 출발일(11월 7일 토요일)로 돌아간다.
  const tripDate = storedDate || TRIP.date;
  const [mode, setMode] = usePersistentState<Mode>('mode', 'A');
  const [departure, setDeparture] = usePersistentState<string>('departure', '');
  const [checks, setChecks] = usePersistentState<Checks>('scheduleChecks', {});
  const [edits, setEdits] = usePersistentState<Record<string, BlockEdit>>('scheduleEdits', {});
  const [packing, setPacking] = usePersistentState<PackingState>('packing', { custom: [], hidden: [] });
  const [packChecks, setPackChecks] = usePersistentState<Checks>('packChecks', {});
  const [confirmChecks, setConfirmChecks] = usePersistentState<Checks>('confirmChecks', {});
  const [budget, setBudgetState] = usePersistentState<BudgetState>('budget', DEFAULT_BUDGET);

  const toggleCheck = useCallback((id: string) => setChecks((c) => ({ ...c, [id]: !c[id] })), [setChecks]);
  const togglePack = useCallback((id: string) => setPackChecks((c) => ({ ...c, [id]: !c[id] })), [setPackChecks]);
  const toggleConfirm = useCallback((id: string) => setConfirmChecks((c) => ({ ...c, [id]: !c[id] })), [setConfirmChecks]);

  const saveEdit = useCallback(
    (id: string, edit: BlockEdit | null) =>
      setEdits((e) => {
        const next = { ...e };
        if (edit) next[id] = edit;
        else delete next[id];
        return next;
      }),
    [setEdits],
  );

  const blocksOf = useCallback(
    (group: ScheduleGroupId) => BLOCKS[group].map((b) => mergeEdit(b, edits[b.id])),
    [edits],
  );

  const dayTimeline = useMemo<TimedBlock[]>(() => {
    const list = [
      ...blocksOf('morning'),
      ...blocksOf('drive'),
      ...blocksOf(mode === 'A' ? 'landA' : 'landB'),
      ...blocksOf('return'),
    ];
    return list.map((b, i) => {
      const startMin = toMin(b.start);
      const next = list.slice(i + 1).find((n) => toMin(n.start) > startMin);
      const endMin = b.end ? toMin(b.end) : next ? toMin(next.start) : startMin + 30;
      return { ...b, startMin, endMin: Math.max(endMin, startMin + 1) };
    });
  }, [blocksOf, mode]);

  const packItems = useMemo(
    () => [...DEFAULT_PACK_ITEMS.filter((i) => !packing.hidden.includes(i.id)), ...packing.custom],
    [packing],
  );

  const addPackItem = useCallback(
    (item: Omit<PackItem, 'id' | 'custom'>) =>
      setPacking((p) => ({ ...p, custom: [...p.custom, { ...item, id: `custom-${Date.now()}`, custom: true }] })),
    [setPacking],
  );
  const removePackItem = useCallback(
    (item: PackItem) =>
      setPacking((p) =>
        item.custom
          ? { ...p, custom: p.custom.filter((c) => c.id !== item.id) }
          : { ...p, hidden: [...p.hidden, item.id] },
      ),
    [setPacking],
  );
  const restoreHidden = useCallback(() => setPacking((p) => ({ ...p, hidden: [] })), [setPacking]);

  const setBudget = useCallback((updater: (b: BudgetState) => BudgetState) => setBudgetState(updater), [setBudgetState]);
  const budgetResult = useMemo(() => computeBudget(budget, tripDate), [budget, tripDate]);

  // ---- 토스트
  const [toast, setToast] = useState('');
  const toastTimer = useRef<number | undefined>(undefined);
  const notify = useCallback((msg: string) => {
    setToast(msg);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(''), 2200);
  }, []);

  // ---- 초기화
  const resetPacking = useCallback(() => setPackChecks({}), [setPackChecks]);
  const resetSchedule = useCallback(() => {
    setChecks({});
    setDeparture('');
  }, [setChecks, setDeparture]);
  const resetBudget = useCallback(() => setBudgetState(DEFAULT_BUDGET), [setBudgetState]);
  const resetAll = useCallback(() => {
    clearAllStore();
    setTripDate(TRIP.date);
    setMode('A');
    setDeparture('');
    setChecks({});
    setEdits({});
    setPacking({ custom: [], hidden: [] });
    setPackChecks({});
    setConfirmChecks({});
    setBudgetState(DEFAULT_BUDGET);
  }, [setTripDate, setMode, setDeparture, setChecks, setEdits, setPacking, setPackChecks, setConfirmChecks, setBudgetState]);

  const value: TripContextValue = {
    tab,
    go,
    now,
    tripDate,
    setTripDate,
    mode,
    setMode,
    departure,
    setDeparture,
    checks,
    toggleCheck,
    edits,
    saveEdit,
    blocksOf,
    dayTimeline,
    packItems,
    packChecks,
    togglePack,
    addPackItem,
    removePackItem,
    hiddenCount: packing.hidden.length,
    restoreHidden,
    confirmChecks,
    toggleConfirm,
    budget,
    setBudget,
    budgetResult,
    resetPacking,
    resetSchedule,
    resetBudget,
    resetAll,
    toast,
    notify,
  };

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
}

export function useTrip() {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error('TripProvider 안에서만 사용할 수 있어요.');
  return ctx;
}
