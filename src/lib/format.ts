const DAYS = ['일', '월', '화', '수', '목', '금', '토'];

export function won(n: number) {
  return `${Math.round(n).toLocaleString('ko-KR')}원`;
}

/** 204000 → "20.4만원" */
export function manwon(n: number) {
  const v = Math.round(n / 1000) / 10;
  return `${v.toLocaleString('ko-KR')}만원`;
}

export function toMin(t: string) {
  const [h, m] = t.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

/** "16:00" → "오후 4:00" */
export function fmtTime(t: string) {
  if (!t) return '';
  const total = toMin(t);
  const h = Math.floor(total / 60);
  const m = total % 60;
  const ampm = h < 12 ? '오전' : '오후';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${ampm} ${h12}:${String(m).padStart(2, '0')}`;
}

export function fmtRange(start: string, end?: string) {
  if (!end) return fmtTime(start);
  const s = fmtTime(start);
  const e = fmtTime(end);
  // 같은 오전/오후면 뒤쪽 표기는 생략
  if (s.slice(0, 2) === e.slice(0, 2)) return `${s}~${e.slice(3)}`;
  return `${s}~${e}`;
}

/** "2026-11-07" → 로컬 자정 Date */
export function parseDate(s: string) {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

export function toDateStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** "2026년 11월 7일 (토)" */
export function fmtDate(s: string) {
  const d = parseDate(s);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 (${DAYS[d.getDay()]})`;
}

/** "11월 7일 (토)" */
export function fmtDateShort(s: string) {
  const d = parseDate(s);
  return `${d.getMonth() + 1}월 ${d.getDate()}일 (${DAYS[d.getDay()]})`;
}

/** 여행일까지 남은 날짜 (오늘이면 0, 지났으면 음수) */
export function daysUntil(dateStr: string, now: Date) {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((parseDate(dateStr).getTime() - today.getTime()) / 86_400_000);
}

export function ddayLabel(diff: number) {
  if (diff > 0) return `D-${diff}`;
  if (diff === 0) return 'D-DAY';
  return `D+${-diff}`;
}

export function isWeekendDate(s: string) {
  const day = parseDate(s).getDay();
  return day === 0 || day === 6;
}

/** 숫자만 남겨 정수로 */
export function parseMoney(s: string) {
  const n = Number(s.replace(/[^0-9]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

export function pct(done: number, total: number) {
  return total === 0 ? 0 : Math.round((done / total) * 100);
}
