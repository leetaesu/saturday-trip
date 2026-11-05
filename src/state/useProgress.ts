import { BLOCKS } from '../data/schedule';
import { CONFIRM_ITEMS } from '../data/info';
import { daysUntil, pct } from '../lib/format';
import { useTrip, type TimedBlock } from './TripContext';

const EVE_TASKS = BLOCKS.eve.flatMap((b) => b.tasks ?? []);

/** 홈·인쇄 화면에서 같이 쓰는 진행률과 현재 일정 계산 */
export function useProgress() {
  const { checks, packItems, packChecks, confirmChecks, tripDate, now, dayTimeline } = useTrip();

  const eveDone = EVE_TASKS.filter((t) => checks[`task:${t.id}`]).length;
  const packDone = packItems.filter((i) => packChecks[i.id]).length;
  const confirmDone = CONFIRM_ITEMS.filter((c) => confirmChecks[c.id]).length;

  const prepDone = eveDone + packDone + confirmDone;
  const prepTotal = EVE_TASKS.length + packItems.length + CONFIRM_ITEMS.length;

  const diff = tripDate ? daysUntil(tripDate, now) : null;
  const isTripDay = diff === 0;
  const nowMin = now.getHours() * 60 + now.getMinutes();

  let current: TimedBlock | undefined;
  let next: TimedBlock | undefined;
  if (isTripDay) {
    current = [...dayTimeline].reverse().find((b) => nowMin >= b.startMin && nowMin < b.endMin);
    next = dayTimeline.find((b) => b.startMin > nowMin);
  }

  return {
    eve: { done: eveDone, total: EVE_TASKS.length, pct: pct(eveDone, EVE_TASKS.length) },
    pack: { done: packDone, total: packItems.length, pct: pct(packDone, packItems.length), left: packItems.length - packDone },
    confirm: { done: confirmDone, total: CONFIRM_ITEMS.length },
    prep: { done: prepDone, total: prepTotal, pct: pct(prepDone, prepTotal) },
    diff,
    isTripDay,
    nowMin,
    current,
    next,
  };
}
