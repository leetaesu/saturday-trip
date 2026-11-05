import { Copy, Printer, RotateCcw, Share2 } from 'lucide-react';
import { FamilyTalk } from '../components/FamilyTalk';
import { ScheduleCard } from '../components/ScheduleCard';
import { Badge, Button, Card, CheckRow, cx, NeedCheck, Segmented } from '../components/ui';
import { SECTIONS } from '../data/schedule';
import { TRIP } from '../data/trip';
import { fmtDate } from '../lib/format';
import { copyText, shareOrCopy } from '../lib/share';
import { buildScheduleText } from '../lib/text';
import { useTrip } from '../state/TripContext';
import { useProgress } from '../state/useProgress';
import type { Mode, ScheduleBlock } from '../types';

export function Plan() {
  const { mode, setMode, blocksOf, confirmChecks, toggleConfirm, tripDate, departure, checks, notify, resetSchedule } = useTrip();
  const p = useProgress();
  const ruleConfirmed = !!confirmChecks.reentry;

  const sectionBlocks: Record<(typeof SECTIONS)[number]['id'], ScheduleBlock[]> = {
    eve: blocksOf('eve'),
    morning: blocksOf('morning'),
    drive: blocksOf('drive'),
    land: blocksOf(mode === 'A' ? 'landA' : 'landB'),
    return: blocksOf('return'),
  };

  const text = () =>
    buildScheduleText({
      tripDate,
      mode,
      departure,
      checks,
      sections: SECTIONS.map((s) => ({ title: s.title, blocks: sectionBlocks[s.id] })),
    });

  // 여행 당일: 지금 일정은 강조, 이미 지난 일정은 흐리게
  const dayIds = [...sectionBlocks.morning, ...sectionBlocks.drive, ...sectionBlocks.land, ...sectionBlocks.return].map((b) => b.id);
  const stateOf = (b: ScheduleBlock): 'now' | 'past' | undefined => {
    if (!p.isTripDay) return undefined;
    if (p.current?.id === b.id) return 'now';
    const pivot = p.current ?? p.next;
    if (!pivot) return 'past';
    return dayIds.indexOf(b.id) < dayIds.indexOf(pivot.id) ? 'past' : undefined;
  };

  return (
    <div className="space-y-4">
      <Card>
        <h1 className="text-[22px] font-extrabold text-ink-strong">우리 가족 하루 일정</h1>
        <p className="mt-1 text-[14px] text-taupe">
          {tripDate ? fmtDate(tripDate) : '날짜 미정'} · {TRIP.from} ↔ {TRIP.to}
        </p>

        <div className="mt-4">
          <p className="mb-2 flex items-center gap-2 text-[14px] font-bold text-ink-strong">
            온천랜드 점심 계획 {!ruleConfirmed && <NeedCheck label="확인 필요" />}
          </p>
          <Segmented<Mode>
            label="점심 일정 모드"
            value={mode}
            onChange={setMode}
            options={[
              { value: 'A', label: 'A안 · 점심 후 물놀이' },
              { value: 'B', label: 'B안 · 늦은 점심' },
            ]}
          />
          <p className="mt-2 text-[13px] leading-relaxed text-taupe">
            {mode === 'A'
              ? 'A안: 1차 물놀이 → 점심 → 2차 물놀이. 식당 이용 후 어린이온천에 다시 들어갈 수 있을 때.'
              : 'B안: 물놀이를 길게 한 뒤 목욕·환복하고 늦은 점심. 식사 후 재입장이 안 될 때.'}
          </p>
          {!ruleConfirmed && (
            <p className="mt-2 rounded-2xl bg-peach-soft px-3 py-2 text-[13px] leading-relaxed text-peach-deep">
              과거 후기에는 식당 이용 후 물놀이를 이어간 사례가 있지만, 현재 공식 규정은 확인되지 않았어요. 방문 전 전화로 확인해 주세요.
            </p>
          )}
          <CheckRow className="mt-2" checked={ruleConfirmed} onChange={() => toggleConfirm('reentry')}>
            운영 규정 확인 완료 (식사 후 재이용 여부)
          </CheckRow>
        </div>
      </Card>

      {/* 섹션 바로가기 */}
      <nav aria-label="일정 구간 바로가기" className="no-print -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {SECTIONS.map((s) => (
          <a key={s.id} href={`#/plan/sec-${s.id}`} onClick={(e) => { e.preventDefault(); document.getElementById(`sec-${s.id}`)?.scrollIntoView({ behavior: 'smooth' }); }} className="shrink-0 rounded-full bg-card px-4 py-2.5 text-[14px] font-bold text-teal-deep shadow-soft">
            {s.emoji} {s.title}
          </a>
        ))}
      </nav>

      {SECTIONS.map((s) => {
        const blocks = sectionBlocks[s.id];
        return (
          <section key={s.id} id={`sec-${s.id}`} className="scroll-mt-20">
            <div className="mb-3 flex items-center justify-between px-1">
              <div>
                <h2 className="text-[19px] font-extrabold text-ink-strong">
                  {s.emoji} {s.title}
                </h2>
                <p className="text-[13px] text-taupe">{s.subtitle}</p>
              </div>
              {s.id === 'eve' && <Badge tone={p.eve.pct === 100 ? 'mint' : 'peach'}>준비 {p.eve.pct}%</Badge>}
              {s.id === 'land' && <Badge tone="lav">{mode}안</Badge>}
            </div>
            <div className={cx('relative', 'before:absolute before:bottom-4 before:left-[17px] before:top-6 before:w-0.5 before:bg-line')}>
              {blocks.map((b) => (
                <div key={b.id}>
                  {b.talk && <FamilyTalk lines={b.talk} />}
                  <ScheduleCard block={b} state={s.id === 'eve' ? undefined : stateOf(b)} />
                </div>
              ))}
            </div>
          </section>
        );
      })}

      <Card className="no-print">
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="secondary"
            onClick={async () => {
              const r = await shareOrCopy(TRIP.name, text());
              if (r === 'copied') notify('일정을 복사했어요.');
              if (r === 'failed') notify('복사에 실패했어요.');
            }}
          >
            <Share2 className="size-4" aria-hidden /> 공유하기
          </Button>
          <Button variant="ghost" onClick={async () => notify((await copyText(text())) ? '일정을 복사했어요.' : '복사에 실패했어요.')}>
            <Copy className="size-4" aria-hidden /> 복사하기
          </Button>
          <Button variant="ghost" onClick={() => window.print()}>
            <Printer className="size-4" aria-hidden /> 인쇄하기
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              if (window.confirm('일정 완료 체크와 실제 출발 시간을 모두 지울까요?\n(수정한 시간·메모는 그대로 남아요)')) {
                resetSchedule();
                notify('일정 완료 상태를 초기화했어요.');
              }
            }}
          >
            <RotateCcw className="size-4" aria-hidden /> 완료 초기화
          </Button>
        </div>
      </Card>
    </div>
  );
}
