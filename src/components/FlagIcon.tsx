import type { ReactElement } from 'react'

export type FlagCountry = 'us' | 'cn' | 'es' | 'fr' | 'de' | 'sa' | 'jp' | 'kr' | 'pt'

const STAR =
  'M0 -1 L0.2245 -0.309 L0.951 -0.309 L0.3631 0.118 L0.5878 0.809 L0 0.382 L-0.5878 0.809 L-0.3631 0.118 L-0.951 -0.309 L-0.2245 -0.309 Z'

const usStarRows = [6, 5, 6, 5, 6, 5, 6, 5, 6]

function UsFlag() {
  return (
    <>
      <rect width="60" height="40" fill="#ffffff" />
      {Array.from({ length: 7 }, (_, index) => (
        <rect
          key={index}
          y={(index * 2 * 40) / 13}
          width="60"
          height={40 / 13}
          fill="#b22234"
        />
      ))}
      <rect width="24" height={(7 * 40) / 13} fill="#3c3b6e" />
      {usStarRows.flatMap((count, row) =>
        Array.from({ length: count }, (_, index) => (
          <circle
            key={`${row}-${index}`}
            cx={count === 6 ? 2.1 + index * 3.95 : 4.05 + index * 3.95}
            cy={2.1 + row * 2.15}
            r="0.5"
            fill="#ffffff"
          />
        )),
      )}
    </>
  )
}

function CnFlag() {
  return (
    <>
      <rect width="60" height="40" fill="#de2910" />
      <path d={STAR} fill="#ffde00" transform="translate(10 10) scale(6) rotate(-10)" />
      <path d={STAR} fill="#ffde00" transform="translate(20 4) scale(2) rotate(25)" />
      <path d={STAR} fill="#ffde00" transform="translate(24 8) scale(2) rotate(10)" />
      <path d={STAR} fill="#ffde00" transform="translate(24 14) scale(2) rotate(-5)" />
      <path d={STAR} fill="#ffde00" transform="translate(20 18) scale(2) rotate(-20)" />
    </>
  )
}

function EsFlag() {
  return (
    <>
      <rect width="60" height="40" fill="#aa151b" />
      <rect y="10" width="60" height="20" fill="#f1bf00" />
    </>
  )
}

function FrFlag() {
  return (
    <>
      <rect width="20" height="40" fill="#002395" />
      <rect x="20" width="20" height="40" fill="#ffffff" />
      <rect x="40" width="20" height="40" fill="#ed2939" />
    </>
  )
}

function DeFlag() {
  return (
    <>
      <rect width="60" height="13.33" fill="#000000" />
      <rect y="13.33" width="60" height="13.34" fill="#dd0000" />
      <rect y="26.67" width="60" height="13.33" fill="#ffce00" />
    </>
  )
}

function SaFlag() {
  return (
    <>
      <rect width="60" height="40" fill="#006c35" />
      <path
        d="M13 13.5c2.8-4.2 5.6-4.2 8.4 0s5.6 4.2 8.4 0 5.6-4.2 8.4 0"
        fill="none"
        stroke="#ffffff"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M16 18.5c2.2-3.2 4.4-3.2 6.6 0s4.4 3.2 6.6 0 4.4-3.2 6.6 0"
        fill="none"
        stroke="#ffffff"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <g fill="#ffffff">
        <rect x="13" y="28" width="30" height="1.6" rx="0.8" />
        <path d="M12 26.2 8.5 28.8 12 31.4Z" />
        <rect x="42.5" y="26.4" width="2.2" height="4.8" rx="0.6" />
        <rect x="44" y="24.8" width="1.4" height="7.8" rx="0.7" />
      </g>
    </>
  )
}

function JpFlag() {
  return (
    <>
      <rect width="60" height="40" fill="#ffffff" />
      <circle cx="30" cy="20" r="12" fill="#bc002d" />
    </>
  )
}

function KrFlag() {
  return (
    <>
      <rect width="60" height="40" fill="#ffffff" />
      <g transform="translate(30 20) scale(0.4166667) rotate(33.6900675)">
        <path d="M12 0a18 18 0 1 1-36 0 24 24 0 1 1 48 0" fill="#cd2e3a" />
        <path d="M-24 0a24 24 0 1 0 48 0 12 12 0 1 0-24 0 12 12 0 1 1-24 0" fill="#0047a0" />
      </g>
      <g fill="#000000">
        <g transform="translate(13 9) rotate(-33.6900675)">
          <rect x="-5" y="-3" width="10" height="1.3" rx="0.4" />
          <rect x="-5" y="-0.65" width="10" height="1.3" rx="0.4" />
          <rect x="-5" y="1.7" width="10" height="1.3" rx="0.4" />
        </g>
        <g transform="translate(47 9) rotate(33.6900675)">
          <rect x="-5" y="-3" width="10" height="1.3" rx="0.4" />
          <rect x="-5" y="-0.65" width="10" height="1.3" rx="0.4" />
          <rect x="-5" y="1.7" width="10" height="1.3" rx="0.4" />
        </g>
        <g transform="translate(13 31) rotate(33.6900675)">
          <rect x="-5" y="-3" width="10" height="1.3" rx="0.4" />
          <rect x="-5" y="-0.65" width="10" height="1.3" rx="0.4" />
          <rect x="-5" y="1.7" width="10" height="1.3" rx="0.4" />
        </g>
        <g transform="translate(47 31) rotate(-33.6900675)">
          <rect x="-5" y="-3" width="10" height="1.3" rx="0.4" />
          <rect x="-5" y="-0.65" width="10" height="1.3" rx="0.4" />
          <rect x="-5" y="1.7" width="10" height="1.3" rx="0.4" />
        </g>
      </g>
    </>
  )
}

function PtFlag() {
  return (
    <>
      <rect width="24" height="40" fill="#046a38" />
      <rect x="24" width="36" height="40" fill="#da291c" />
      <circle cx="24" cy="20" r="7.5" fill="#ffe900" />
      <circle cx="24" cy="20" r="5.2" fill="#da291c" />
      <circle cx="24" cy="20" r="3.2" fill="#ffffff" />
      <circle cx="24" cy="20" r="1.8" fill="#003399" />
    </>
  )
}

const flags: Record<FlagCountry, () => ReactElement> = {
  us: UsFlag,
  cn: CnFlag,
  es: EsFlag,
  fr: FrFlag,
  de: DeFlag,
  sa: SaFlag,
  jp: JpFlag,
  kr: KrFlag,
  pt: PtFlag,
}

export default function FlagIcon({ country }: { country: FlagCountry }) {
  const Flag = flags[country]

  return (
    <span
      className="inline-flex h-3.5 w-[21px] shrink-0 overflow-hidden rounded-[2px] ring-1 ring-white/25"
      aria-hidden="true"
    >
      <svg viewBox="0 0 60 40" className="h-full w-full" focusable="false">
        <Flag />
      </svg>
    </span>
  )
}
