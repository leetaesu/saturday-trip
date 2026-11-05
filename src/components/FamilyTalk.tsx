import type { Speaker, TalkLine } from '../types';
import { cx } from './ui';

const base = import.meta.env.BASE_URL;

export const CHARACTERS = {
  mom: { name: '해영엄마', img: `${base}mom.png` },
  rowoon: { name: '로운', img: `${base}rowoon.png` },
  roy: { name: '로이', img: `${base}roy.png` },
} as const;

function Avatar({ who }: { who: Speaker }) {
  if (who === 'twins') {
    return (
      <span className="flex shrink-0 items-end">
        <img src={CHARACTERS.rowoon.img} alt="" className="h-14 w-auto" />
        <img src={CHARACTERS.roy.img} alt="" className="-ml-3 h-14 w-auto" />
      </span>
    );
  }
  return <img src={CHARACTERS[who].img} alt="" className="h-14 w-auto shrink-0" />;
}

const nameOf = (who: Speaker) => (who === 'twins' ? '로운·로이' : CHARACTERS[who].name);

/** 엄마는 왼쪽, 아이들은 오른쪽에서 말하는 말풍선 대화 */
export function FamilyTalk({ lines, className }: { lines: TalkLine[]; className?: string }) {
  return (
    <div className={cx('no-print my-2 space-y-2 pl-12', className)} aria-label="가족 대화">
      {lines.map((l, i) => {
        const right = l.who !== 'mom';
        return (
          <div key={i} className={cx('flex items-end gap-2', right && 'flex-row-reverse')}>
            <Avatar who={l.who} />
            <div className={cx('max-w-[75%]', right && 'text-right')}>
              <p className="mb-0.5 px-1 text-[11.5px] font-bold text-taupe">{nameOf(l.who)}</p>
              <p
                className={cx(
                  'inline-block rounded-3xl px-4 py-2.5 text-left text-[14.5px] font-bold leading-snug shadow-soft',
                  right ? 'rounded-br-md bg-mint text-teal-deep' : 'rounded-bl-md bg-card text-ink-strong',
                )}
              >
                {l.text}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
