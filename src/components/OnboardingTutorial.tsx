import { useEffect, useState, type RefObject } from 'react'
import s from './OnboardingTutorial.module.css'

export interface TutorialStep {
  target?: RefObject<Element | null>
  title: string
  desc: string
  side?: 'below' | 'above' | 'left' | 'right'
}

const PAD = 10

export function OnboardingTutorial({ steps, onDone, onFinish, finishLabel }: { steps: TutorialStep[]; onDone: () => void; onFinish?: () => void; finishLabel?: string }) {
  const [step, setStep] = useState(0)
  const [rect, setRect] = useState<DOMRect | null>(null)

  const current = steps[step]
  const isLast = step === steps.length - 1

  useEffect(() => {
    const el = current.target?.current
    if (!el) { setRect(null); return }
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    const update = () => setRect((el as HTMLElement).getBoundingClientRect())
    const timer = setTimeout(update, 350) // espera que termine el scroll
    window.addEventListener('resize', update)
    return () => { clearTimeout(timer); window.removeEventListener('resize', update) }
  }, [step, current])

  function next() {
    if (isLast) onFinish ? onFinish() : onDone()
    else setStep(n => n + 1)
  }

  const spotlightStyle = rect ? {
    top: rect.top - PAD,
    left: rect.left - PAD,
    width: rect.width + PAD * 2,
    height: rect.height + PAD * 2,
  } : undefined

  function tooltipStyle(): React.CSSProperties {
    if (!rect) return {}
    const W = 280
    const side = current.side ?? 'below'

    if (side === 'below') {
      const left = Math.min(
        Math.max(16, rect.left + rect.width / 2 - W / 2),
        window.innerWidth - W - 16
      )
      return { top: rect.bottom + PAD + 12, left, width: W }
    }
    if (side === 'above') {
      const left = Math.min(
        Math.max(16, rect.left + rect.width / 2 - W / 2),
        window.innerWidth - W - 16
      )
      return { bottom: window.innerHeight - rect.top + PAD + 12, left, width: W }
    }
    if (side === 'left') {
      return {
        top: Math.max(16, rect.top + rect.height / 2 - 70),
        right: window.innerWidth - rect.left + PAD + 12,
        width: W,
      }
    }
    return {
      top: Math.max(16, rect.top + rect.height / 2 - 70),
      left: rect.right + PAD + 12,
      width: W,
    }
  }

  const isSpotlight = !!current.target && !!rect

  return (
    <>
      <div className={s.overlay} />

      {!isSpotlight && (
        <div className={s.welcomeWrap}>
          <div className={s.card}>
            <div className={s.welcomeEmoji}>✨</div>
            <h2 className={s.cardTitle}>{current.title}</h2>
            <p className={s.cardDesc}>{current.desc}</p>
            <div className={s.footer}>
              <button className={s.skipBtn} onClick={onDone}>Omitir</button>
              <button className={s.nextBtn} onClick={next}>Empezar →</button>
            </div>
          </div>
        </div>
      )}

      {isSpotlight && (
        <>
          <div className={s.spotlight} style={spotlightStyle} />
          <div className={s.tooltip} style={tooltipStyle()}>
            <span className={s.stepLabel}>Paso {step} de {steps.length - 1}</span>
            <h3 className={s.cardTitle}>{current.title}</h3>
            <p className={s.cardDesc}>{current.desc}</p>
            <div className={s.footer}>
              <button className={s.skipBtn} onClick={onDone}>Omitir</button>
              <button className={s.nextBtn} onClick={next}>
                {isLast ? (finishLabel ?? 'Entendido ✓') : 'Siguiente →'}
              </button>
            </div>
          </div>
        </>
      )}

      <div className={s.dots}>
        {steps.map((_, i) => (
          <div
            key={i}
            className={`${s.dot} ${i === step ? s.dotActive : ''} ${i < step ? s.dotDone : ''}`}
          />
        ))}
      </div>
    </>
  )
}
