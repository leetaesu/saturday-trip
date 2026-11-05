import type { ActualKey, BudgetState, ExtraKey } from '../types';

/** 과거 안내요금·계획용 예산. 실시간 확정가격이 아니다. */
export const DEFAULT_BUDGET: BudgetState = {
  dayType: 'auto',
  holiday: false,
  price: {
    weekday: { adult: 21000, child: 21000 },
    weekend: { adult: 26000, child: 26000 },
  },
  sauna: false,
  saunaPrice: { weekday: 3000, weekend: 5000 },
  discount: 0,
  extra: { lunch: 45000, snack: 15000, fuel: 20000, toll: 10000, etc: 10000 },
  actual: {},
};

export const EXTRA_META: { key: ExtraKey; label: string; hint: string; emoji: string }[] = [
  { key: 'lunch', label: '점심식사 (4명)', hint: '내부 식당 기준 예산', emoji: '🍚' },
  { key: 'snack', label: '매점·간식', hint: '물놀이 후 간식', emoji: '🍙' },
  { key: 'fuel', label: '왕복 주유비', hint: '연비·주유 가격에 따라 달라요', emoji: '⛽' },
  { key: 'toll', label: '왕복 통행료', hint: '경로에 따라 달라요', emoji: '🛣️' },
  { key: 'etc', label: '기타 예비비', hint: '혹시 모를 지출', emoji: '🧷' },
];

export const ACTUAL_LABEL: Record<ActualKey, string> = {
  admission: '입장료',
  sauna: '찜질방 추가요금',
  lunch: '점심식사',
  snack: '매점·간식',
  fuel: '주유비',
  toll: '통행료',
  etc: '기타',
};
