import { ChevronDown, Copy, Plus, RotateCcw, Share2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { CHARACTERS } from '../components/FamilyTalk';
import { Badge, Button, Card, CheckRow, cx, Field, inputClass, Progress, Segmented } from '../components/ui';
import { PACK_CATEGORIES, WHEN_LABEL } from '../data/packing';
import { TRIP } from '../data/trip';
import { pct } from '../lib/format';
import { copyText, shareOrCopy } from '../lib/share';
import { buildPackingText } from '../lib/text';
import { useTrip } from '../state/TripContext';
import type { When } from '../types';

type Filter = 'all' | 'todo' | 'done';
type WhenFilter = 'all' | When;

export function Packing() {
  const { packItems, packChecks, togglePack, addPackItem, removePackItem, hiddenCount, restoreHidden, resetPacking, notify } = useTrip();
  const [filter, setFilter] = useState<Filter>('all');
  const [whenFilter, setWhenFilter] = useState<WhenFilter>('all');
  const [foldDone, setFoldDone] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ cat: PACK_CATEGORIES[0].id, text: '', qty: '', when: 'eve' as When });

  const done = packItems.filter((i) => packChecks[i.id]).length;
  const total = packItems.length;

  const visible = (id: string, when: When) => {
    const c = !!packChecks[id];
    if (filter === 'todo' && c) return false;
    if (filter === 'done' && !c) return false;
    if (whenFilter !== 'all' && whenFilter !== when) return false;
    return true;
  };

  const submit = () => {
    if (!form.text.trim()) return;
    addPackItem({ cat: form.cat, text: form.text.trim(), qty: form.qty.trim(), when: form.when });
    setForm({ ...form, text: '', qty: '' });
    notify('준비물을 추가했어요.');
  };

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-[22px] font-extrabold text-ink-strong">빠뜨린 건 없을까?</h1>
            <p className="mt-0.5 text-[14px] text-taupe">하나씩 체크하면 온천 준비 끝!</p>
          </div>
          <span className="text-[26px] font-extrabold text-teal-deep">{pct(done, total)}%</span>
        </div>
        <div className="mt-3 rounded-2xl bg-butter/50 px-4 py-3 text-[13px] leading-relaxed text-butter-deep">
          <b>💡 이렇게 쓰세요</b>
          <br />
          우리 집엔 필요 없다 싶은 건 고민 말고 <b>그냥 체크해서 완료</b>로 넘기세요.
          <br />
          <b>선택</b> 표시가 붙은 건 있으면 편한 것들이에요. 목록에서 아예 빼고 싶으면 아래 ‘항목 삭제하기’를 누르세요.
        </div>
        <Progress className="mt-3" value={pct(done, total)} />
        <p className="mt-2 text-[13px] text-taupe">
          {done}/{total}개 챙김 · {total - done ? `남은 준비물 ${total - done}개` : '모두 챙겼어요 🎉'}
        </p>

        <div className="mt-4 space-y-2">
          <Segmented<Filter>
            label="체크 상태로 보기"
            value={filter}
            onChange={setFilter}
            options={[
              { value: 'all', label: `전체 ${total}` },
              { value: 'todo', label: `미완료 ${total - done}` },
              { value: 'done', label: `완료 ${done}` },
            ]}
          />
          <Segmented<WhenFilter>
            label="챙길 시점으로 보기"
            value={whenFilter}
            onChange={setWhenFilter}
            options={[
              { value: 'all', label: '언제든' },
              { value: 'eve', label: '🌙 전날' },
              { value: 'day', label: '☀️ 당일' },
            ]}
          />
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              aria-pressed={foldDone}
              onClick={() => setFoldDone(!foldDone)}
              className={cx('min-h-10 rounded-full px-3.5 text-[13px] font-bold', foldDone ? 'bg-teal-deep text-white' : 'bg-well text-ink')}
            >
              완료 항목 접기 {foldDone ? 'ON' : 'OFF'}
            </button>
            <button
              type="button"
              aria-pressed={editMode}
              onClick={() => setEditMode(!editMode)}
              className={cx('min-h-10 rounded-full px-3.5 text-[13px] font-bold', editMode ? 'bg-peach text-peach-deep' : 'bg-well text-ink')}
            >
              {editMode ? '삭제 모드 끄기' : '항목 삭제하기'}
            </button>
          </div>
        </div>
      </Card>

      {PACK_CATEGORIES.map((cat) => {
        const all = packItems.filter((i) => i.cat === cat.id);
        const catDone = all.filter((i) => packChecks[i.id]).length;
        const list = all.filter((i) => visible(i.id, i.when));
        const shown = foldDone ? list.filter((i) => !packChecks[i.id]) : list;
        const folded = list.length - shown.length;
        if (!all.length) return null;
        return (
          <Card key={cat.id}>
            <div className="mb-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-full bg-well text-xl shadow-inset" aria-hidden>
                  {cat.emoji}
                </span>
                <div>
                  <h2 className="text-[17px] font-extrabold text-ink-strong">{cat.title}</h2>
                  <p className="text-[12.5px] text-taupe">{cat.subtitle}</p>
                </div>
              </div>
              <Badge tone={catDone === all.length ? 'mint' : 'peach'}>
                {catDone}/{all.length}
              </Badge>
            </div>
            <Progress value={pct(catDone, all.length)} className="mb-3 h-1.5" />
            {cat.note && <p className="mb-2 rounded-2xl bg-butter/50 px-3 py-2 text-[12.5px] text-butter-deep">💡 {cat.note}</p>}
            <div className="space-y-1.5">
              {shown.map((i) => (
                <CheckRow
                  key={i.id}
                  checked={!!packChecks[i.id]}
                  onChange={() => togglePack(i.id)}
                  sub={
                    <>
                      {i.qty && <b className="font-bold text-teal">{i.qty}</b>}
                      {i.qty && ' · '}
                      {WHEN_LABEL[i.when]}
                      {i.optional && <b className="ml-1 rounded-full bg-lav px-1.5 py-px text-[11px] text-lav-deep">선택</b>}
                      {i.custom && ' · 직접 추가'}
                    </>
                  }
                  right={
                    editMode ? (
                      <button
                        type="button"
                        aria-label={`${i.text} 삭제`}
                        onClick={(e) => {
                          e.preventDefault();
                          if (window.confirm(`‘${i.text}’ 항목을 삭제할까요?`)) removePackItem(i);
                        }}
                        className="flex size-10 items-center justify-center rounded-full text-danger active:bg-peach-soft"
                      >
                        <Trash2 className="size-4" aria-hidden />
                      </button>
                    ) : undefined
                  }
                >
                  {i.text}
                </CheckRow>
              ))}
              {!shown.length && <p className="py-2 text-center text-[13px] text-taupe">조건에 맞는 항목이 없어요.</p>}
              {folded > 0 && (
                <p className="flex items-center justify-center gap-1 pt-1 text-[12.5px] text-taupe">
                  <ChevronDown className="size-3.5" aria-hidden /> 완료 {folded}개 접힘
                </p>
              )}
            </div>
          </Card>
        );
      })}

      <Card className="no-print">
        {adding ? (
          <div className="space-y-3">
            <h2 className="text-[17px] font-extrabold text-ink-strong">새 준비물 추가</h2>
            <Field label="카테고리">
              <select className={inputClass} value={form.cat} onChange={(e) => setForm({ ...form, cat: e.target.value })}>
                {PACK_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.emoji} {c.title}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="준비물 이름">
              <input
                className={inputClass}
                value={form.text}
                placeholder="예: 아이 튜브"
                onChange={(e) => setForm({ ...form, text: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && submit()}
              />
            </Field>
            <div className="grid grid-cols-2 gap-2">
              <Field label="수량 (선택)">
                <input className={inputClass} value={form.qty} placeholder="예: 2개" onChange={(e) => setForm({ ...form, qty: e.target.value })} />
              </Field>
              <Field label="챙길 때">
                <select className={inputClass} value={form.when} onChange={(e) => setForm({ ...form, when: e.target.value as When })}>
                  <option value="eve">전날</option>
                  <option value="day">당일</option>
                </select>
              </Field>
            </div>
            <div className="flex gap-2">
              <Button variant="primary" className="flex-1" onClick={submit} disabled={!form.text.trim()}>
                추가하기
              </Button>
              <Button variant="ghost" onClick={() => setAdding(false)}>
                닫기
              </Button>
            </div>
          </div>
        ) : (
          <Button variant="secondary" className="w-full" onClick={() => setAdding(true)}>
            <Plus className="size-5" aria-hidden /> 새 준비물 추가하기
          </Button>
        )}
      </Card>

      <div className="no-print grid grid-cols-2 gap-2">
        <Button
          variant="secondary"
          onClick={async () => {
            const r = await shareOrCopy(`${TRIP.name} 준비물`, buildPackingText(packItems, packChecks));
            if (r === 'copied') notify('준비물 목록을 복사했어요.');
            if (r === 'failed') notify('복사에 실패했어요.');
          }}
        >
          <Share2 className="size-4" aria-hidden /> 공유하기
        </Button>
        <Button
          variant="ghost"
          onClick={async () =>
            notify((await copyText(buildPackingText(packItems, packChecks))) ? '준비물 목록을 복사했어요.' : '복사에 실패했어요.')
          }
        >
          <Copy className="size-4" aria-hidden /> 목록 복사
        </Button>
        {hiddenCount > 0 && (
          <Button
            variant="ghost"
            className="col-span-2"
            onClick={() => {
              restoreHidden();
              notify(`삭제한 기본 항목 ${hiddenCount}개를 되돌렸어요.`);
            }}
          >
            삭제한 기본 항목 {hiddenCount}개 되돌리기
          </Button>
        )}
        <Button
          variant="danger"
          className="col-span-2"
          onClick={() => {
            if (window.confirm('준비물 체크를 모두 해제할까요?\n(직접 추가한 항목은 남아요)')) {
              resetPacking();
              notify('준비물 체크를 초기화했어요.');
            }
          }}
        >
          <RotateCcw className="size-4" aria-hidden /> 준비물 체크 초기화
        </Button>
      </div>

      <section className="flex gap-3 rounded-3xl bg-peach/50 p-4">
        <img src={CHARACTERS.mom.img} alt="" className="h-16 w-auto shrink-0" />
        <p className="text-[13.5px] leading-relaxed text-ink">
          <b className="text-peach-deep">해영엄마의 팁</b>
          <br />
          아이들 물놀이 기저귀·외부 음식 반입은 현장 규정에 따라 달라요. 매표소나 전화로 한 번 더 확인해 주세요.
        </p>
      </section>
    </div>
  );
}
