import { EXTRA_META } from '../data/budget';
import { PEOPLE, TRIP } from '../data/trip';
import type { ActualKey, BudgetState } from '../types';
import { isWeekendDate } from './format';

export type BudgetLine = { key: ActualKey; label: string; amount: number; note?: string };

export type BudgetResult = {
  isWeekend: boolean;
  dayLabel: string;
  dayReason: string;
  lines: BudgetLine[];
  subtotal: number;
  discount: number;
  total: number;
  perPerson: number;
  actualTotal: number;
  hasActual: boolean;
};

export function computeBudget(b: BudgetState, tripDate: string): BudgetResult {
  let isWeekend: boolean;
  let dayReason: string;
  if (b.dayType === 'weekday') {
    isWeekend = false;
    dayReason = '직접 선택';
  } else if (b.dayType === 'weekend') {
    isWeekend = true;
    dayReason = '직접 선택';
  } else if (!tripDate) {
    isWeekend = true;
    dayReason = '날짜 미정이라 주말 기준';
  } else if (b.holiday) {
    isWeekend = true;
    dayReason = '공휴일로 표시됨';
  } else {
    isWeekend = isWeekendDate(tripDate);
    dayReason = '여행 날짜 기준 자동';
  }

  const price = isWeekend ? b.price.weekend : b.price.weekday;
  const admission = price.adult * TRIP.adults + price.child * TRIP.kids;
  const saunaUnit = isWeekend ? b.saunaPrice.weekend : b.saunaPrice.weekday;
  const sauna = b.sauna ? saunaUnit * PEOPLE : 0;

  const lines: BudgetLine[] = [
    {
      key: 'admission',
      label: '입장료',
      amount: admission,
      note: `성인 ${price.adult.toLocaleString('ko-KR')}원×${TRIP.adults} + 아이 ${price.child.toLocaleString('ko-KR')}원×${TRIP.kids}`,
    },
    ...(b.sauna
      ? [{ key: 'sauna' as const, label: '찜질방 추가요금', amount: sauna, note: `${saunaUnit.toLocaleString('ko-KR')}원×${PEOPLE}명` }]
      : []),
    ...EXTRA_META.map((m) => ({ key: m.key, label: m.label, amount: b.extra[m.key] })),
  ];

  const subtotal = lines.reduce((s, l) => s + l.amount, 0);
  const discount = Math.min(b.discount, subtotal);
  const total = subtotal - discount;
  const actualValues = Object.values(b.actual).filter((v): v is number => typeof v === 'number');

  return {
    isWeekend,
    dayLabel: isWeekend ? '주말·공휴일' : '평일',
    dayReason,
    lines,
    subtotal,
    discount,
    total,
    perPerson: Math.round(total / PEOPLE),
    actualTotal: actualValues.reduce((s, v) => s + v, 0),
    hasActual: actualValues.length > 0,
  };
}
