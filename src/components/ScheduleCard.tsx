import { Pencil, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { MAP_LINKS } from '../data/trip';
import { fmtRange, fmtTime } from '../lib/format';
import { useTrip } from '../state/TripContext';
import type { ScheduleBlock } from '../types';
import { BLOCK_ICONS } from './icons';
import { Badge, Button, CheckRow, cx, Field, inputClass } from './ui';

const TONE_STYLE = {
  normal: 'bg-card',
  go: 'bg-mint',
  buffer: 'bg-peach/60',
  final: 'bg-butter/70',
} as const;

export function ScheduleCard({ block, state }: { block: ScheduleBlock; state?: 'now' | 'past' }) {
  const { checks, toggleCheck, edits, saveEdit, departure, setDeparture, notify } = useTrip();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ start: '', end: '', title: '', memo: '' });

  const Icon = BLOCK_ICONS[block.icon];
  const doneKey = `block:${block.id}`;
  const done = !!checks[doneKey];
  const tone = block.tone ?? 'normal';
  const tasks = block.tasks ?? [];
  const tasksDone = tasks.filter((t) => checks[`task:${t.id}`]).length;
  const edited = !!edits[block.id];

  const startEdit = () => {
    setDraft({ start: block.start, end: block.end ?? '', title: block.title, memo: block.memo ?? '' });
    setEditing(true);
  };
  const save = () => {
    saveEdit(block.id, { start: draft.start, end: draft.end, title: draft.title.trim(), memo: draft.memo.trim() || undefined });
    setEditing(false);
    notify('일정을 저장했어요.');
  };
  const restore = () => {
    if (window.confirm('이 일정을 원래 시간과 이름으로 되돌릴까요? 메모도 지워져요.')) {
      saveEdit(block.id, null);
      setEditing(false);
    }
  };

  return (
    <div className="relative flex gap-3">
      {/* 타임라인 점 */}
      <div className="relative z-10 flex w-9 shrink-0 justify-center pt-5">
        <span
          className={cx(
            'flex size-9 items-center justify-center rounded-full ring-4 ring-cream',
            done ? 'bg-teal text-white' : state === 'now' ? 'bg-coral text-white' : 'bg-card text-teal shadow-soft',
          )}
        >
          <Icon className="size-4" aria-hidden />
        </span>
      </div>

      <article
        className={cx(
          'mb-3 min-w-0 flex-1 rounded-3xl p-4 shadow-soft transition',
          TONE_STYLE[tone],
          state === 'now' && 'ring-2 ring-coral',
          state === 'past' && !done && 'opacity-70',
        )}
      >
        <div className="flex items-start gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[14px] font-extrabold text-teal-deep">{fmtRange(block.start, block.end)}</span>
              {state === 'now' && <Badge tone="peach">진행 중</Badge>}
              {edited && <Badge tone="lav">수정됨</Badge>}
            </div>
            <h3 className={cx('mt-0.5 text-[17px] font-extrabold leading-snug', done ? 'text-taupe line-through' : 'text-ink-strong')}>
              {block.title}
            </h3>
          </div>
          <button
            type="button"
            aria-label={`${block.title} 수정`}
            onClick={editing ? () => setEditing(false) : startEdit}
            className="no-print flex size-11 shrink-0 items-center justify-center rounded-full text-taupe active:bg-well"
          >
            <Pencil className="size-4" aria-hidden />
          </button>
        </div>

        {editing && (
          <div className="mt-3 space-y-3 rounded-2xl bg-card p-3 ring-1 ring-line">
            <div className="grid grid-cols-2 gap-2">
              <Field label="시작 시간">
                <input type="time" className={inputClass} value={draft.start} onChange={(e) => setDraft({ ...draft, start: e.target.value })} />
              </Field>
              <Field label="끝 시간 (선택)">
                <input type="time" className={inputClass} value={draft.end} onChange={(e) => setDraft({ ...draft, end: e.target.value })} />
              </Field>
            </div>
            <Field label="활동 이름">
              <input className={inputClass} value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
            </Field>
            <Field label="메모">
              <textarea
                rows={2}
                className={cx(inputClass, 'py-2')}
                value={draft.memo}
                placeholder="예: 주차장은 지하 2층"
                onChange={(e) => setDraft({ ...draft, memo: e.target.value })}
              />
            </Field>
            <div className="flex gap-2">
              <Button variant="primary" className="flex-1" onClick={save} disabled={!draft.start}>
                저장
              </Button>
              <Button variant="ghost" onClick={() => setEditing(false)}>
                취소
              </Button>
            </div>
            {edited && (
              <button type="button" onClick={restore} className="inline-flex min-h-10 items-center gap-1 text-[13px] font-bold text-taupe">
                <RotateCcw className="size-3.5" aria-hidden /> 원래대로 되돌리기
              </button>
            )}
          </div>
        )}

        {block.desc && <p className="mt-1.5 text-[14px] leading-relaxed text-ink">{block.desc}</p>}

        {block.callout && (
          <p className="mt-3 rounded-2xl bg-card/80 px-4 py-3 text-center text-[17px] font-extrabold text-teal-deep">{block.callout}</p>
        )}

        {block.menu && (
          <div className="mt-3 grid grid-cols-2 gap-2">
            {block.menu.map((m) => (
              <div key={m.label} className="rounded-2xl bg-butter/50 p-3">
                <p className="text-[13px] font-bold text-butter-deep">{m.label}</p>
                <ul className="mt-1 space-y-0.5 text-[13.5px]">
                  {m.items.map((i) => (
                    <li key={i}>· {i}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {block.notes && (
          <div className="mt-3 rounded-2xl bg-card/70 p-3">
            {block.notesTitle && <p className="text-[13px] font-bold text-taupe">{block.notesTitle}</p>}
            <ul className="mt-1 flex flex-wrap gap-1.5">
              {block.notes.map((n) => (
                <li key={n} className="rounded-full bg-well px-2.5 py-1 text-[13px]">
                  {n}
                </li>
              ))}
            </ul>
          </div>
        )}

        {block.showNav && (
          <div className="no-print mt-3 grid grid-cols-2 gap-2">
            <a href={MAP_LINKS.naverTo} target="_blank" rel="noopener noreferrer" className="flex min-h-12 items-center justify-center rounded-pill-lg bg-[#03c75a] text-[14px] font-bold text-white">
              네이버지도 길찾기
            </a>
            <a href={MAP_LINKS.kakaoTo} target="_blank" rel="noopener noreferrer" className="flex min-h-12 items-center justify-center rounded-pill-lg bg-[#fee500] text-[14px] font-bold text-[#191919]">
              카카오맵 길찾기
            </a>
            <p className="col-span-2 text-[12px] text-taupe">지도에서 ‘온양온천랜드’를 고른 뒤 길찾기를 누르면 현재 위치에서 안내돼요.</p>
          </div>
        )}

        {block.recordDeparture && (
          <div className="mt-3 rounded-2xl bg-card p-3">
            <p className="text-[13px] font-bold text-taupe">실제 출발 시간 기록</p>
            <div className="mt-1.5 flex gap-2">
              <input type="time" aria-label="실제 출발 시간" className={inputClass} value={departure} onChange={(e) => setDeparture(e.target.value)} />
              <Button
                variant="primary"
                className="shrink-0"
                onClick={() => {
                  const n = new Date();
                  setDeparture(`${String(n.getHours()).padStart(2, '0')}:${String(n.getMinutes()).padStart(2, '0')}`);
                }}
              >
                지금 출발!
              </Button>
            </div>
            {departure && <p className="mt-2 text-[14px] font-bold text-teal-deep">🚗 {fmtTime(departure)} 출발 완료</p>}
          </div>
        )}

        {tasks.length > 0 && (
          <div className="mt-3 space-y-1.5">
            <p className="text-[12.5px] font-bold text-taupe">
              할 일 {tasksDone}/{tasks.length}
            </p>
            {tasks.map((t) => (
              <CheckRow key={t.id} checked={!!checks[`task:${t.id}`]} onChange={() => toggleCheck(`task:${t.id}`)}>
                {t.text}
              </CheckRow>
            ))}
          </div>
        )}

        {block.memo && !editing && <p className="mt-3 rounded-2xl bg-lav/60 px-3 py-2 text-[14px] text-lav-deep">📝 {block.memo}</p>}

        <CheckRow className="mt-3 bg-card/80" checked={done} onChange={() => toggleCheck(doneKey)}>
          이 일정 완료
        </CheckRow>
      </article>
    </div>
  );
}
