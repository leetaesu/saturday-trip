import { PACK_CATEGORIES } from '../data/packing';
import { TRIP } from '../data/trip';
import { fmtDate, fmtRange, fmtTime, won } from '../lib/format';
import { useTrip } from '../state/TripContext';
import type { ScheduleBlock } from '../types';

function Rows({ blocks }: { blocks: ScheduleBlock[] }) {
  return (
    <table className="w-full border-collapse text-[9.5pt]">
      <tbody>
        {blocks.map((b) => (
          <tr key={b.id} className="border-b border-gray-300 align-top">
            <td className="w-[34mm] py-1 pr-2 font-bold">{fmtRange(b.start, b.end)}</td>
            <td className="py-1">
              <b>{b.title}</b>
              {b.tasks && <span className="text-gray-600"> — {b.tasks.map((t) => t.text).join(', ')}</span>}
              {b.memo && <span className="text-gray-600"> (메모: {b.memo})</span>}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** 화면에서는 숨기고 인쇄할 때만 나오는 A4용 요약 */
export function PrintSheet() {
  const { tripDate, mode, blocksOf, packItems, packChecks, budgetResult: r, departure } = useTrip();

  return (
    <div className="print-only print-sheet text-black">
      <h1 className="text-[18pt] font-extrabold">{TRIP.name}</h1>
      <p className="mb-3 text-[10pt]">
        {tripDate ? fmtDate(tripDate) : '날짜 미정'} · {TRIP.from} → {TRIP.to} · 자가용 당일치기 · 엄마·아빠 + 5살 남아 2명 (4명)
        <br />
        출발 {fmtTime(TRIP.departFirst)} (늦어도 {fmtTime(TRIP.departFinal)}) · 도착 목표 {fmtTime(TRIP.arrive)} · 귀가 출발 {fmtTime(TRIP.goHome)} · 문의 {TRIP.phone}
        {departure && ` · 실제 출발 ${fmtTime(departure)}`}
      </p>

      <section className="mb-3">
        <h2 className="mb-1 border-b-2 border-black text-[12pt] font-bold">전날 준비 · 당일 아침</h2>
        <Rows blocks={[...blocksOf('eve'), ...blocksOf('morning'), ...blocksOf('drive')]} />
      </section>

      <section className="mb-3">
        <h2 className="mb-1 border-b-2 border-black text-[12pt] font-bold">
          온천랜드 일정 ({mode === 'A' ? 'A안: 점심 후 물놀이 재개' : 'B안: 물놀이 후 늦은 점심'}) — 식사 후 재이용 규정 방문 전 확인
        </h2>
        <Rows blocks={[...blocksOf(mode === 'A' ? 'landA' : 'landB'), ...blocksOf('return')]} />
      </section>

      <section className="mb-3">
        <h2 className="mb-1 border-b-2 border-black text-[12pt] font-bold">준비물 체크리스트</h2>
        <div className="columns-2 gap-6 text-[9pt]">
          {PACK_CATEGORIES.map((c) => {
            const list = packItems.filter((i) => i.cat === c.id);
            if (!list.length) return null;
            return (
              <div key={c.id} className="mb-2 break-inside-avoid">
                <p className="font-bold">{c.title}</p>
                {list.map((i) => (
                  <p key={i.id}>
                    {packChecks[i.id] ? '☑' : '☐'} {i.text}
                    {i.qty && ` (${i.qty})`}
                  </p>
                ))}
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-1 border-b-2 border-black text-[12pt] font-bold">예상 비용 ({r.dayLabel} 기준)</h2>
        <p className="text-[9.5pt]">
          {r.lines.map((l) => `${l.label} ${won(l.amount)}`).join(' · ')}
          {r.discount > 0 && ` · 할인 -${won(r.discount)}`}
        </p>
        <p className="mt-1 text-[11pt] font-bold">
          합계 {won(r.total)} (1인당 약 {won(r.perPerson)})
        </p>
        <p className="mt-1 text-[8.5pt] text-gray-600">※ 과거 안내요금·계획용 예산이며 실제 요금과 운영 규정은 방문 전 확인이 필요합니다.</p>
      </section>
    </div>
  );
}
