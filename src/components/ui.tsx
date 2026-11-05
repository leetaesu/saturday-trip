import { Check } from 'lucide-react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { parseMoney } from '../lib/format';

export function cx(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(' ');
}

export function Card({ className, children, id }: { className?: string; children: ReactNode; id?: string }) {
  return (
    <section id={id} className={cx('scroll-mt-20 rounded-card bg-card p-5 shadow-soft', className)}>
      {children}
    </section>
  );
}

export type Tone = 'mint' | 'peach' | 'lav' | 'butter' | 'warn' | 'plain';

const TONE: Record<Tone, string> = {
  mint: 'bg-mint text-teal-deep',
  peach: 'bg-peach text-peach-deep',
  lav: 'bg-lav text-lav-deep',
  butter: 'bg-butter text-butter-deep',
  warn: 'bg-peach-soft text-peach-deep ring-1 ring-peach',
  plain: 'bg-well text-ink',
};

export function Badge({ tone = 'mint', children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return (
    <span
      className={cx(
        'inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 text-[12px] font-bold leading-5',
        TONE[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function SectionHeader({
  emoji,
  title,
  subtitle,
  right,
}: {
  emoji?: string;
  title: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        {emoji && (
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-well text-xl shadow-inset" aria-hidden>
            {emoji}
          </span>
        )}
        <div className="min-w-0">
          <h2 className="text-[18px] font-extrabold leading-tight text-ink-strong">{title}</h2>
          {subtitle && <p className="mt-0.5 text-[13px] text-taupe">{subtitle}</p>}
        </div>
      </div>
      {right}
    </div>
  );
}

export function Progress({ value, className, tone = 'teal' }: { value: number; className?: string; tone?: 'teal' | 'coral' }) {
  return (
    <div
      className={cx('h-2.5 w-full overflow-hidden rounded-full bg-line', className)}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cx('h-full rounded-full transition-[width] duration-500', tone === 'teal' ? 'bg-teal' : 'bg-coral')}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

/** 터치하기 쉬운 큰 체크 행 */
export function CheckRow({
  checked,
  onChange,
  children,
  sub,
  right,
  className,
}: {
  checked: boolean;
  onChange: () => void;
  children: ReactNode;
  sub?: ReactNode;
  right?: ReactNode;
  className?: string;
}) {
  return (
    <label
      className={cx(
        'flex min-h-12 items-center gap-3 rounded-2xl px-3 py-2.5 transition-colors',
        checked ? 'bg-mint/50' : 'bg-well/70 active:bg-well',
        className,
      )}
    >
      <span className="relative flex size-6 shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="peer size-6 appearance-none rounded-[9px] bg-card shadow-inset ring-1 ring-line transition checked:bg-teal checked:ring-teal"
        />
        <Check
          className="pointer-events-none absolute inset-0 m-auto size-4 text-white opacity-0 peer-checked:opacity-100"
          strokeWidth={3.5}
          aria-hidden
        />
      </span>
      <span className="min-w-0 flex-1">
        <span className={cx('block text-[15px] font-semibold leading-snug', checked ? 'text-taupe line-through' : 'text-ink')}>
          {children}
        </span>
        {sub && <span className="mt-0.5 block text-[12.5px] leading-snug text-taupe">{sub}</span>}
      </span>
      {right}
    </label>
  );
}

type BtnVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'peach';

const BTN: Record<BtnVariant, string> = {
  primary: 'bg-teal-deep text-white shadow-teal active:bg-teal',
  secondary: 'bg-mint text-teal-deep active:bg-mint-strong',
  peach: 'bg-peach text-peach-deep active:bg-peach/80',
  ghost: 'bg-well text-ink active:bg-line',
  danger: 'bg-card text-danger ring-1 ring-danger/30 active:bg-peach-soft',
};

export function Button({
  variant = 'secondary',
  className,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: BtnVariant }) {
  return (
    <button
      type="button"
      className={cx(
        'inline-flex min-h-12 items-center justify-center gap-2 rounded-pill-lg px-5 text-[15px] font-bold transition active:scale-[0.98] disabled:opacity-50',
        BTN[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

export function LinkButton({
  href,
  variant = 'secondary',
  className,
  children,
  external,
}: {
  href: string;
  variant?: BtnVariant;
  className?: string;
  children: ReactNode;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={cx(
        'inline-flex min-h-12 items-center justify-center gap-2 rounded-pill-lg px-5 text-[15px] font-bold transition active:scale-[0.98]',
        BTN[variant],
        className,
      )}
    >
      {children}
    </a>
  );
}

export function Segmented<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T;
  options: { value: T; label: ReactNode }[];
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex gap-1 rounded-full bg-well p-1 shadow-inset">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={cx(
              'min-h-11 flex-1 rounded-full px-3 text-[14px] font-bold transition',
              active ? 'bg-teal-deep text-white shadow-teal' : 'text-taupe',
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cx('relative h-8 w-14 shrink-0 rounded-full shadow-inset transition', checked ? 'bg-teal' : 'bg-line')}
    >
      <span
        className={cx(
          'absolute top-1 size-6 rounded-full bg-white shadow transition-[left]',
          checked ? 'left-7' : 'left-1',
        )}
      />
    </button>
  );
}

export function MoneyInput({
  value,
  onChange,
  label,
  placeholder,
}: {
  value: number | undefined;
  onChange: (v: number | undefined) => void;
  label: string;
  placeholder?: string;
}) {
  return (
    <div className="flex items-center rounded-2xl bg-cream px-3 shadow-inset ring-1 ring-transparent focus-within:ring-mint-strong">
      <input
        aria-label={label}
        inputMode="numeric"
        className="min-h-11 w-full min-w-0 bg-transparent text-right font-bold text-ink-strong outline-none placeholder:font-medium placeholder:text-taupe/70"
        value={value === undefined ? '' : value.toLocaleString('ko-KR')}
        placeholder={placeholder ?? '0'}
        onChange={(e) => {
          const raw = e.target.value.trim();
          onChange(raw === '' ? undefined : parseMoney(raw));
        }}
      />
      <span className="ml-1 shrink-0 text-[14px] text-taupe">원</span>
    </div>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[13px] font-bold text-taupe">{label}</span>
      {children}
    </label>
  );
}

export const inputClass =
  'min-h-11 w-full rounded-2xl bg-cream px-3 text-ink-strong shadow-inset outline-none ring-1 ring-transparent focus:ring-mint-strong';
