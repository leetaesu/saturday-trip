import { ArrowRight, Backpack, CalendarDays, Car, Clock, Flag, Printer, RotateCcw, Share2, Wallet } from 'lucide-react';
import { CHARACTERS } from '../components/FamilyTalk';
import { Badge, Button, Card, cx, inputClass, Progress, SectionHeader } from '../components/ui';
import { MAP_LINKS, PEOPLE, TRIP, WEATHER_LINK } from '../data/trip';
import { ddayLabel, fmtDateShort, fmtRange, fmtTime, manwon, parseDate, won } from '../lib/format';
import { shareOrCopy } from '../lib/share';
import { buildScheduleText } from '../lib/text';
import { useTrip } from '../state/TripContext';
import { useProgress } from '../state/useProgress';

function Countdown() {
  const { tripDate, now, departure } = useTrip();
  if (!tripDate) return null;
  const target = parseDate(tripDate);
  target.setHours(8, 0, 0, 0);
  const ms = target.getTime() - now.getTime();
  let text: string;
  if (departure) text = `${fmtTime(departure)}에 출발했어요 🚗`;
  else if (ms > 0) {
    const mins = Math.floor(ms / 60_000);
    const d = Math.floor(mins / 1440);
    const h = Math.floor((mins % 1440) / 60);
    const m = mins % 60;
    text = `1차 출발까지 ${d ? `${d}일 ` : ''}${h ? `${h}시간 ` : ''}${m}분`;
  } else if (ms > -20 * 60_000) text = '지금 출발 시간이에요! 늦어도 8:20엔 출발해요';
  else return null;
  return (
    <p className="mt-3 flex items-center gap-1.5 text-[14px] font-bold text-teal-deep">
      <Clock className="size-4" aria-hidden /> {text}
    </p>
  );
}

export function Home() {
  const trip = useTrip();
  const { tripDate, setTripDate, go, budgetResult, notify, resetAll, mode, departure, blocksOf, checks } = trip;
  const p = useProgress();

  const shareAll = async () => {
    const text = buildScheduleText({
      tripDate,
      mode,
      departure,
      checks,
      sections: [
        { title: '당일 아침', blocks: blocksOf('morning') },
        { title: '이동', blocks: blocksOf('drive') },
        { title: '온천랜드', blocks: blocksOf(mode === 'A' ? 'landA' : 'landB') },
        { title: '귀가', blocks: blocksOf('return') },
      ],
    });
    const r = await shareOrCopy(TRIP.name, text);
    if (r === 'copied') notify('일정을 복사했어요. 가족 단톡방에 붙여 넣어 주세요!');
    if (r === 'failed') notify('복사에 실패했어요. 다시 시도해 주세요.');
  };

  const onResetAll = () => {
    if (window.confirm('여행 날짜, 체크 상태, 수정한 일정, 추가한 준비물, 비용까지 모두 지울까요?\n되돌릴 수 없어요.')) {
      resetAll();
      notify('모든 데이터를 처음 상태로 되돌렸어요.');
    }
  };

  let nowCard: { label: string; title: string; time: string } | null = null;
  if (p.isTripDay) {
    if (p.current) nowCard = { label: '지금 하는 일정', title: p.current.title, time: fmtRange(p.current.start, p.current.end) };
    else if (p.next) nowCard = { label: '다음 일정', title: p.next.title, time: fmtTime(p.next.start) };
    else nowCard = { label: '오늘 일정 끝', title: '즐거운 하루였어요! 푹 쉬어요 💛', time: '' };
  } else if (p.diff === 1) {
    nowCard = { label: '오늘 저녁 할 일', title: '전날 준비 (짐 90% 싸기)', time: '오후 7:00~9:00' };
  }

  const routeRows = [
    { icon: Car, label: '출발', value: `${fmtTime(TRIP.departFirst)}~${fmtTime(TRIP.departFinal).slice(3)}`, sub: TRIP.from },
    { icon: Flag, label: '도착 목표', value: fmtTime(TRIP.arrive), sub: TRIP.to },
    { icon: Clock, label: '귀가 출발', value: fmtTime(TRIP.goHome), sub: `${TRIP.from} 방향` },
  ];

  return (
    <div className="space-y-4">
      {/* 히어로 */}
      <section className="relative overflow-hidden rounded-card bg-gradient-to-b from-mint-strong/60 via-card to-well p-5 shadow-soft">
        <div className="pointer-events-none absolute -right-6 -top-6 size-32 rounded-full bg-peach/50 blur-2xl" />
        <div className="pointer-events-none absolute left-2 top-16 size-16 rounded-full bg-mint-strong/50 blur-xl" />
        <div className="relative">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="peach">
              <CalendarDays className="size-3.5" aria-hidden />
              {tripDate ? fmtDateShort(tripDate) : '날짜 미정'}
            </Badge>
            {p.diff !== null && <Badge tone="mint">♨️ {ddayLabel(p.diff)}</Badge>}
          </div>
          <p className="mt-4 text-[13px] font-bold text-teal">우리 가족의 겨울 나들이 ❄️</p>
          <h1 className="mt-1 text-[26px] font-extrabold leading-tight tracking-tight text-ink-strong">{TRIP.name}</h1>
          <p className="mt-1 text-[14px] text-ink">{TRIP.subtitle}</p>
          <div className="relative mx-auto mt-3 flex h-44 max-w-[320px] items-end justify-center gap-1">
            <div className="absolute inset-x-0 bottom-0 h-12 rounded-[50%] bg-mint-strong/70" aria-hidden />
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-6 text-white" aria-hidden>
              <span className="steam text-2xl">♨</span>
              <span className="steam steam-2 text-2xl">♨</span>
            </div>
            <img src={CHARACTERS.dad.img} alt="태수아빠" className="relative h-[140px] w-auto -scale-x-100 drop-shadow" />
            <img src={CHARACTERS.rowoon.img} alt="로운" className="relative h-[100px] w-auto drop-shadow" />
            <img src={CHARACTERS.roy.img} alt="로이" className="relative h-[112px] w-auto drop-shadow" />
            <img src={CHARACTERS.mom.img} alt="해영엄마" className="relative h-[136px] w-auto drop-shadow" />
          </div>
          <p className="text-center text-[15px] font-bold text-teal-deep">“{TRIP.slogan}”</p>

          <div className="mt-4 rounded-2xl bg-card/90 p-3">
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-bold text-taupe">출발 날짜 (바꿀 수 있어요)</span>
              <input
                type="date"
                className={inputClass}
                value={tripDate}
                onChange={(e) => setTripDate(e.target.value)}
              />
            </label>
            <Countdown />
            <a
              href={WEATHER_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex min-h-11 items-center justify-center gap-1.5 rounded-pill-lg bg-lav text-[14px] font-bold text-lav-deep"
            >
              ⛅ 아산 날씨 보기
            </a>
          </div>
        </div>
      </section>

      {nowCard && (
        <section className="rounded-card bg-teal-deep p-5 text-white shadow-teal">
          <p className="text-[13px] font-bold text-mint-strong">{nowCard.label}</p>
          <p className="mt-1 text-[20px] font-extrabold">{nowCard.title}</p>
          {nowCard.time && <p className="mt-0.5 text-[14px] text-mint">{nowCard.time}</p>}
          {p.isTripDay && p.current && p.next && (
            <p className="mt-2 text-[13px] text-mint">
              다음: {fmtTime(p.next.start)} {p.next.title}
            </p>
          )}
          <button
            type="button"
            onClick={() => go('plan', p.isTripDay ? 'sec-morning' : 'sec-eve')}
            className="mt-3 inline-flex min-h-11 items-center gap-1 rounded-full bg-white/15 px-4 text-[14px] font-bold"
          >
            일정에서 체크하기 <ArrowRight className="size-4" aria-hidden />
          </button>
        </section>
      )}

      {/* 경로 요약 */}
      <Card>
        <SectionHeader emoji="🚗" title="가족 드라이브" subtitle={`엄마·아빠 + 5살 남아 둘 (총 ${PEOPLE}명) · 자가용 당일치기`} />
        <div className="flex items-center gap-2 rounded-2xl bg-well p-3 text-[15px] font-extrabold">
          <span className="size-3 shrink-0 rounded-full bg-peach ring-4 ring-peach/40" />
          <span>{TRIP.from}</span>
          <span className="mx-1 h-0 flex-1 border-t-2 border-dashed border-taupe/40" />
          <span className="size-3 shrink-0 rounded-full bg-teal ring-4 ring-mint-strong/60" />
          <span className="text-teal-deep">{TRIP.to}</span>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {routeRows.map((r) => (
            <div key={r.label} className="rounded-2xl bg-cream p-3 text-center">
              <r.icon className="mx-auto size-5 text-teal" aria-hidden />
              <p className="mt-1 text-[12px] text-taupe">{r.label}</p>
              <p className="text-[14px] font-extrabold leading-tight text-ink-strong">{r.value}</p>
              <p className="mt-0.5 truncate text-[11.5px] text-taupe">{r.sub}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <a href={MAP_LINKS.naverTo} target="_blank" rel="noopener noreferrer" className="flex min-h-12 items-center justify-center rounded-pill-lg bg-[#03c75a] text-[14px] font-bold text-white">
            네이버지도 길찾기
          </a>
          <a href={MAP_LINKS.kakaoTo} target="_blank" rel="noopener noreferrer" className="flex min-h-12 items-center justify-center rounded-pill-lg bg-[#fee500] text-[14px] font-bold text-[#191919]">
            카카오맵 길찾기
          </a>
        </div>
      </Card>

      {/* 요약 카드 */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: '총인원', value: `${PEOPLE}명`, sub: `부모 ${TRIP.adults} · 어린이 ${TRIP.kids}` },
          { label: '출발 장소', value: TRIP.from, sub: '경기도 안양시' },
          { label: '출발 시간', value: '오전 8:00~8:20', sub: '늦어도 8:20' },
          { label: '목적지', value: TRIP.to, sub: '충청남도 아산시' },
        ].map((s) => (
          <div key={s.label} className="rounded-3xl bg-card p-4 shadow-soft">
            <p className="text-[12.5px] text-taupe">{s.label}</p>
            <p className="mt-0.5 text-[16px] font-extrabold text-ink-strong">{s.value}</p>
            <p className="text-[12px] text-taupe">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* 준비율 */}
      <Card>
        <SectionHeader
          emoji="🎒"
          title="여행 준비 완료율"
          subtitle="전날 준비 + 준비물 + 방문 전 확인"
          right={<span className="text-[26px] font-extrabold text-teal-deep">{p.prep.pct}%</span>}
        />
        <Progress value={p.prep.pct} />
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <button type="button" onClick={() => go('plan', 'sec-eve')} className="rounded-2xl bg-well p-3">
            <p className="text-[12px] text-taupe">전날 준비</p>
            <p className="text-[16px] font-extrabold">
              {p.eve.done}/{p.eve.total}
            </p>
          </button>
          <button type="button" onClick={() => go('packing')} className="rounded-2xl bg-well p-3">
            <p className="text-[12px] text-taupe">준비물</p>
            <p className="text-[16px] font-extrabold">
              {p.pack.done}/{p.pack.total}
            </p>
          </button>
          <button type="button" onClick={() => go('info', 'confirm')} className="rounded-2xl bg-well p-3">
            <p className="text-[12px] text-taupe">방문 전 확인</p>
            <p className="text-[16px] font-extrabold">
              {p.confirm.done}/{p.confirm.total}
            </p>
          </button>
        </div>
        <div className="mt-4 flex items-center justify-between rounded-2xl bg-mint/60 px-4 py-3">
          <span className="flex items-center gap-2 text-[14px] font-bold text-teal-deep">
            <Backpack className="size-4" aria-hidden /> 준비물 진행률 {p.pack.pct}%
          </span>
          <span className={cx('text-[14px] font-bold', p.pack.left ? 'text-peach-deep' : 'text-teal-deep')}>
            {p.pack.left ? `남은 준비물 ${p.pack.left}개` : '모두 챙겼어요 🎉'}
          </span>
        </div>
      </Card>

      {/* 비용 */}
      <Card>
        <button type="button" onClick={() => go('budget')} className="flex w-full items-center gap-3 text-left">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-butter text-butter-deep">
            <Wallet className="size-5" aria-hidden />
          </span>
          <span className="flex-1">
            <span className="flex flex-wrap items-center gap-1.5">
              <span className="rounded-full bg-teal-deep px-2 py-0.5 text-[11.5px] font-bold text-white">전체 비용</span>
              <span className="text-[13px] font-bold text-ink-strong">가족 4명 예상 총비용</span>
            </span>
            <span className="mt-0.5 block text-[22px] font-extrabold text-ink-strong">{won(budgetResult.total)}</span>
            <span className="block text-[12.5px] font-bold text-teal">온천 입장료 + 식사 + 간식 + 주유·통행료 포함</span>
            <span className="block text-[12.5px] text-taupe">
              약 {manwon(budgetResult.total)} · 1인당 {won(budgetResult.perPerson)} · {budgetResult.dayLabel} 요금
            </span>
          </span>
          <ArrowRight className="size-5 text-taupe" aria-hidden />
        </button>
      </Card>

      <section className="flex items-start gap-3 rounded-3xl bg-peach/50 p-4">
        <img src={CHARACTERS.mom.img} alt="" className="h-16 w-auto shrink-0" />
        <div>
          <p className="text-[13px] font-bold text-peach-deep">따뜻한 부모마음 메모</p>
          <p className="mt-1 text-[14px] font-semibold leading-relaxed text-ink">
            “아이들과 함께라면 조금 늦어도 괜찮아.
            <br />
            서두르지 말고 우리 가족만의 따뜻한 하루를 즐겨요 ♡”
          </p>
        </div>
      </section>

      <Button variant="primary" className="w-full" onClick={() => go('plan')}>
        전체 일정 보러가기 <ArrowRight className="size-5" aria-hidden />
      </Button>
      <div className="grid grid-cols-2 gap-2">
        <Button variant="secondary" onClick={shareAll}>
          <Share2 className="size-4" aria-hidden /> 일정 공유
        </Button>
        <Button variant="ghost" onClick={() => window.print()}>
          <Printer className="size-4" aria-hidden /> 인쇄하기
        </Button>
      </div>

      <p className="pt-2 text-center text-[12px] leading-relaxed text-taupe">
        체크·입력한 내용은 이 기기(브라우저)에만 저장돼요.
        <br />
        가족끼리는 ‘일정 공유’로 내용을 보내 주세요.
      </p>
      <div className="flex justify-center">
        <button type="button" onClick={onResetAll} className="inline-flex min-h-11 items-center gap-1.5 px-3 text-[13px] font-bold text-danger">
          <RotateCcw className="size-4" aria-hidden /> 전체 데이터 초기화
        </button>
      </div>
    </div>
  );
}
