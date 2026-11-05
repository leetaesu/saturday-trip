import { PACK_CATEGORIES, WHEN_LABEL } from '../data/packing';
import { TRIP } from '../data/trip';
import type { Checks, Mode, PackItem, ScheduleBlock } from '../types';
import type { BudgetResult } from './budget';
import { fmtDate, fmtRange, fmtTime, won } from './format';

const dateLine = (tripDate: string) => (tripDate ? fmtDate(tripDate) : '날짜 미정');

export function buildScheduleText(opts: {
  tripDate: string;
  mode: Mode;
  departure: string;
  sections: { title: string; blocks: ScheduleBlock[] }[];
  checks: Checks;
}) {
  const out: string[] = [`[${TRIP.name} 일정]`, `📅 ${dateLine(opts.tripDate)}`, `🚗 ${TRIP.from} → ${TRIP.to} (자가용, 당일치기)`];
  out.push(`🍚 점심 계획: ${opts.mode === 'A' ? 'A안 (점심 후 물놀이 재개)' : 'B안 (물놀이 후 늦은 점심)'}`);
  if (opts.departure) out.push(`⏱️ 실제 출발: ${fmtTime(opts.departure)}`);
  for (const s of opts.sections) {
    out.push('', `■ ${s.title}`);
    for (const b of s.blocks) {
      const done = opts.checks[`block:${b.id}`] ? ' ✅' : '';
      out.push(`${fmtRange(b.start, b.end)}  ${b.title}${done}`);
      if (b.memo) out.push(`   📝 ${b.memo}`);
    }
  }
  return out.join('\n');
}

export function buildPackingText(items: PackItem[], checks: Checks) {
  const out: string[] = [`[${TRIP.name} 준비물]`];
  for (const cat of PACK_CATEGORIES) {
    const list = items.filter((i) => i.cat === cat.id);
    if (!list.length) continue;
    const done = list.filter((i) => checks[i.id]).length;
    out.push('', `■ ${cat.title} (${done}/${list.length})`);
    for (const i of list) {
      out.push(`${checks[i.id] ? '✅' : '⬜'} ${i.text}${i.qty ? ` (${i.qty})` : ''} · ${WHEN_LABEL[i.when]}`);
    }
  }
  return out.join('\n');
}

export function buildBudgetText(tripDate: string, r: BudgetResult) {
  const out: string[] = [
    `[${TRIP.name} 예상 비용]`,
    `📅 ${dateLine(tripDate)} · ${r.dayLabel} 요금 기준`,
    '',
    ...r.lines.map((l) => `· ${l.label}: ${won(l.amount)}`),
  ];
  if (r.discount) out.push(`· 할인: -${won(r.discount)}`);
  out.push('', `합계: ${won(r.total)} (1인당 약 ${won(r.perPerson)})`);
  if (r.hasActual) out.push(`실제 지출: ${won(r.actualTotal)}`);
  out.push('', '※ 과거 안내요금과 계획용 예산이에요. 실제 요금은 방문일·판매처에서 확인하세요.');
  return out.join('\n');
}
