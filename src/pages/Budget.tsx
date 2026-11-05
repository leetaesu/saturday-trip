import { Copy, RotateCcw, Share2 } from 'lucide-react';
import { Badge, Button, Card, CheckRow, MoneyInput, SectionHeader, Segmented, Switch } from '../components/ui';
import { ACTUAL_LABEL, EXTRA_META } from '../data/budget';
import { PEOPLE, TRIP } from '../data/trip';
import { won } from '../lib/format';
import { copyText, shareOrCopy } from '../lib/share';
import { buildBudgetText } from '../lib/text';
import { useTrip } from '../state/TripContext';
import type { ActualKey, DayType, PricePair } from '../types';

export function Budget() {
  const { budget, setBudget, budgetResult: r, tripDate, notify, resetBudget } = useTrip();
  const priceKey = r.isWeekend ? 'weekend' : 'weekday';
  const price = budget.price[priceKey];

  const setPrice = (k: keyof PricePair, v: number | undefined) =>
    setBudget((b) => ({ ...b, price: { ...b.price, [priceKey]: { ...b.price[priceKey], [k]: v ?? 0 } } }));

  const setActual = (k: ActualKey, v: number | undefined) =>
    setBudget((b) => {
      const actual = { ...b.actual };
      if (v === undefined) delete actual[k];
      else actual[k] = v;
      return { ...b, actual };
    });

  const diff = r.total - r.actualTotal;
  const actualKeys: ActualKey[] = ['admission', ...(budget.sauna ? (['sauna'] as const) : []), ...EXTRA_META.map((m) => m.key)];

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-b from-peach-soft to-card">
        <p className="text-[13px] font-bold text-peach-deep">로둥이네 가계부 플래너</p>
        <h1 className="mt-0.5 text-[22px] font-extrabold text-ink-strong">우리 가족 여행 예산 💰</h1>
        <div className="mt-4 rounded-3xl bg-card p-4 text-center shadow-soft">
          <span className="inline-block rounded-full bg-teal-deep px-3 py-1 text-[12.5px] font-bold text-white">전체 비용</span>
          <p className="mt-2 text-[14px] font-bold text-ink-strong">가족 4명 예상 총비용</p>
          <p className="mt-1 text-[32px] font-extrabold tracking-tight text-teal-deep">{won(r.total)}</p>
          <p className="text-[14px] text-ink">
            가족 {PEOPLE}명 · 1인당 약 <b>{won(r.perPerson)}</b>
          </p>
          <p className="mt-2 rounded-2xl bg-mint/60 px-3 py-2 text-[13px] font-bold text-teal-deep">
            온천 입장료 + 식사 + 간식 + 주유·통행료 + 예비비 포함
          </p>
          <p className="mt-1 text-[12.5px] text-taupe">
            {r.dayLabel} 요금 ({r.dayReason}) · 찜질방 {budget.sauna ? '포함' : '제외'} · 할인 {r.discount ? won(r.discount) : '미반영'}
          </p>
        </div>
        <p className="mt-3 rounded-2xl bg-butter/50 px-3 py-2 text-[12.5px] leading-relaxed text-butter-deep">
          ⚠️ 이전에 확인한 안내요금과 계획용 예산이에요. 실시간 확정가격이 아니니 방문일·판매처에서 꼭 확인하세요.
        </p>
      </Card>

      <Card>
        <SectionHeader emoji="🎟️" title="입장료" subtitle={`성인 ${TRIP.adults}명 + 어린이 ${TRIP.kids}명`} />
        <Segmented<DayType>
          label="요금 기준"
          value={budget.dayType}
          onChange={(v) => setBudget((b) => ({ ...b, dayType: v }))}
          options={[
            { value: 'auto', label: '날짜로 자동' },
            { value: 'weekday', label: '평일' },
            { value: 'weekend', label: '주말·공휴일' },
          ]}
        />
        {budget.dayType === 'auto' && (
          <CheckRow className="mt-2" checked={budget.holiday} onChange={() => setBudget((b) => ({ ...b, holiday: !b.holiday }))}>
            여행 날짜가 공휴일이에요
          </CheckRow>
        )}
        <p className="mt-3 text-[13px] font-bold text-taupe">{r.dayLabel} 1인 단가 (수정 가능)</p>
        <div className="mt-1.5 grid grid-cols-2 gap-2">
          <div>
            <p className="mb-1 text-[12.5px] text-taupe">성인 1인</p>
            <MoneyInput label="성인 1인 입장료" value={price.adult} onChange={(v) => setPrice('adult', v)} />
          </div>
          <div>
            <p className="mb-1 text-[12.5px] text-taupe">어린이 1인</p>
            <MoneyInput label="어린이 1인 입장료" value={price.child} onChange={(v) => setPrice('child', v)} />
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between rounded-2xl bg-mint/60 px-4 py-3">
          <span className="text-[14px] font-bold text-teal-deep">입장료 합계</span>
          <span className="text-[17px] font-extrabold text-teal-deep">{won(r.lines[0].amount)}</span>
        </div>
        <p className="mt-2 text-[12px] text-taupe">아이 연령별 요금·할인 여부는 방문 전 확인이 필요해요.</p>
      </Card>

      <Card>
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 text-[17px] font-extrabold text-ink-strong">♨️ 찜질방 추가</h2>
            <p className="text-[12.5px] text-taupe">
              {r.isWeekend ? '주말' : '평일'} 1인 {won(r.isWeekend ? budget.saunaPrice.weekend : budget.saunaPrice.weekday)} × {PEOPLE}명
            </p>
          </div>
          <Switch checked={budget.sauna} onChange={(v) => setBudget((b) => ({ ...b, sauna: v }))} label="찜질방 추가요금 포함" />
        </div>
        {budget.sauna && (
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div>
              <p className="mb-1 text-[12.5px] text-taupe">평일 1인</p>
              <MoneyInput
                label="찜질방 평일 1인"
                value={budget.saunaPrice.weekday}
                onChange={(v) => setBudget((b) => ({ ...b, saunaPrice: { ...b.saunaPrice, weekday: v ?? 0 } }))}
              />
            </div>
            <div>
              <p className="mb-1 text-[12.5px] text-taupe">주말 1인</p>
              <MoneyInput
                label="찜질방 주말 1인"
                value={budget.saunaPrice.weekend}
                onChange={(v) => setBudget((b) => ({ ...b, saunaPrice: { ...b.saunaPrice, weekend: v ?? 0 } }))}
              />
            </div>
          </div>
        )}
        <p className="mt-2 text-[12px] text-taupe">추가요금은 실제 이용권 적용 조건 확인이 필요해요.</p>
      </Card>

      <Card>
        <SectionHeader emoji="📋" title="식비·교통비·기타" subtitle="모두 수정할 수 있는 예산이에요" />
        <div className="space-y-3">
          {EXTRA_META.map((m) => (
            <div key={m.key} className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-well text-lg" aria-hidden>
                {m.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[14.5px] font-bold text-ink-strong">{m.label}</p>
                <p className="truncate text-[12px] text-taupe">{m.hint}</p>
              </div>
              <div className="w-36 shrink-0">
                <MoneyInput
                  label={m.label}
                  value={budget.extra[m.key]}
                  onChange={(v) => setBudget((b) => ({ ...b, extra: { ...b.extra, [m.key]: v ?? 0 } }))}
                />
              </div>
            </div>
          ))}
          <div className="flex items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-well text-lg" aria-hidden>
              🏷️
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[14.5px] font-bold text-ink-strong">할인금액</p>
              <p className="truncate text-[12px] text-taupe">온라인 할인·쿠폰 등</p>
            </div>
            <div className="w-36 shrink-0">
              <MoneyInput label="할인금액" value={budget.discount} onChange={(v) => setBudget((b) => ({ ...b, discount: v ?? 0 }))} />
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <SectionHeader emoji="🧾" title="항목별 합계" />
        <ul className="space-y-2">
          {r.lines.map((l) => (
            <li key={l.key} className="flex items-start justify-between gap-3 text-[14.5px]">
              <span>
                {l.label}
                {l.note && <span className="block text-[12px] text-taupe">{l.note}</span>}
              </span>
              <span className="shrink-0 font-bold">{won(l.amount)}</span>
            </li>
          ))}
          {r.discount > 0 && (
            <li className="flex justify-between text-[14.5px] text-coral">
              <span>할인</span>
              <span className="font-bold">-{won(r.discount)}</span>
            </li>
          )}
        </ul>
        <div className="mt-3 border-t-2 border-dashed border-line pt-3">
          <div className="flex justify-between text-[17px] font-extrabold text-ink-strong">
            <span>가족 전체</span>
            <span>{won(r.total)}</span>
          </div>
          <div className="mt-1 flex justify-between text-[14px] text-taupe">
            <span>1인당 ({PEOPLE}명)</span>
            <span>{won(r.perPerson)}</span>
          </div>
        </div>
      </Card>

      <Card>
        <SectionHeader emoji="✍️" title="계획 vs 실제 지출" subtitle="여행 당일 쓴 금액을 적어 보세요" />
        <div className="mb-4 grid grid-cols-2 gap-2">
          <div className="rounded-2xl bg-well p-3">
            <p className="text-[12px] text-taupe">계획 예산</p>
            <p className="text-[17px] font-extrabold">{won(r.total)}</p>
          </div>
          <div className="rounded-2xl bg-peach-soft p-3">
            <p className="text-[12px] text-taupe">실제 지출</p>
            <p className="text-[17px] font-extrabold">{won(r.actualTotal)}</p>
          </div>
        </div>
        {r.hasActual && (
          <p className="mb-4 text-center text-[14px] font-bold">
            {diff >= 0 ? (
              <span className="text-teal-deep">예산보다 {won(diff)} 아꼈어요 👏</span>
            ) : (
              <span className="text-coral">예산보다 {won(-diff)} 더 썼어요</span>
            )}
          </p>
        )}
        <div className="space-y-2">
          {actualKeys.map((k) => {
            const planned = r.lines.find((l) => l.key === k)?.amount ?? 0;
            return (
              <div key={k} className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-bold">{ACTUAL_LABEL[k]}</p>
                  <p className="text-[12px] text-taupe">예산 {won(planned)}</p>
                </div>
                <div className="w-36 shrink-0">
                  <MoneyInput label={`${ACTUAL_LABEL[k]} 실제 지출`} placeholder="미입력" value={budget.actual[k]} onChange={(v) => setActual(k, v)} />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="no-print grid grid-cols-2 gap-2">
        <Button
          variant="secondary"
          onClick={async () => {
            const res = await shareOrCopy(`${TRIP.name} 예산`, buildBudgetText(tripDate, r));
            if (res === 'copied') notify('비용 내역을 복사했어요.');
            if (res === 'failed') notify('복사에 실패했어요.');
          }}
        >
          <Share2 className="size-4" aria-hidden /> 공유하기
        </Button>
        <Button variant="ghost" onClick={async () => notify((await copyText(buildBudgetText(tripDate, r))) ? '비용 내역을 복사했어요.' : '복사에 실패했어요.')}>
          <Copy className="size-4" aria-hidden /> 내역 복사
        </Button>
        <Button
          variant="danger"
          className="col-span-2"
          onClick={() => {
            if (window.confirm('단가·예산·할인·실제 지출을 모두 처음 값으로 되돌릴까요?')) {
              resetBudget();
              notify('비용을 초기화했어요.');
            }
          }}
        >
          <RotateCcw className="size-4" aria-hidden /> 비용 초기화
        </Button>
      </div>
      <p className="text-center">
        <Badge tone="plain">모든 입력값은 자동 저장돼요</Badge>
      </p>
    </div>
  );
}
