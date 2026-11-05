export type TabId = 'home' | 'plan' | 'packing' | 'budget' | 'gallery' | 'info';

/** A안: 점심 후 어린이온천 재이용 가능 / B안: 재이용 불가 */
export type Mode = 'A' | 'B';

export type Task = { id: string; text: string };

export type BlockTone = 'normal' | 'go' | 'buffer' | 'final';

export type BlockIcon =
  | 'moon'
  | 'sun'
  | 'bag'
  | 'baby'
  | 'meal'
  | 'shower'
  | 'door'
  | 'car'
  | 'hourglass'
  | 'flag'
  | 'waves'
  | 'bath'
  | 'snack'
  | 'home';

export type ScheduleBlock = {
  id: string;
  /** "HH:MM" */
  start: string;
  /** "HH:MM" — 없으면 다음 일정 시작까지 */
  end?: string;
  title: string;
  icon: BlockIcon;
  desc?: string;
  tasks?: Task[];
  notesTitle?: string;
  notes?: string[];
  menu?: { label: string; items: string[] }[];
  tone?: BlockTone;
  callout?: string;
  needsCheck?: boolean;
  recordDeparture?: boolean;
  showNav?: boolean;
  /** 사용자가 적은 메모 (편집값에서 합쳐짐) */
  memo?: string;
  /** 일정 사이에 들어가는 가족 대화 */
  talk?: TalkLine[];
};

export type Speaker = 'dad' | 'mom' | 'rowoon' | 'roy' | 'twins';

export type TalkLine = { who: Speaker; text: string };

export type ScheduleGroupId = 'eve' | 'morning' | 'drive' | 'landA' | 'landB' | 'return';

export type BlockEdit = { start?: string; end?: string; title?: string; memo?: string };

export type When = 'eve' | 'day';

export type PackItem = {
  id: string;
  cat: string;
  text: string;
  qty: string;
  when: When;
  custom?: boolean;
  /** 있으면 좋은 선택 준비물 */
  optional?: boolean;
};

export type PackCategory = {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  note?: string;
};

export type PackingState = { custom: PackItem[]; hidden: string[] };

export type DayType = 'auto' | 'weekday' | 'weekend';

export type ExtraKey = 'lunch' | 'snack' | 'fuel' | 'toll' | 'etc';

export type ActualKey = 'admission' | 'sauna' | ExtraKey;

export type PricePair = { adult: number; child: number };

export type BudgetState = {
  dayType: DayType;
  holiday: boolean;
  price: { weekday: PricePair; weekend: PricePair };
  sauna: boolean;
  saunaPrice: { weekday: number; weekend: number };
  discount: number;
  extra: Record<ExtraKey, number>;
  actual: Partial<Record<ActualKey, number>>;
};

export type Checks = Record<string, boolean>;
