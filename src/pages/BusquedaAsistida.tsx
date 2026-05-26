import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import s from './BusquedaAsistida.module.css'
import { OnboardingTutorial, type TutorialStep } from '../components/OnboardingTutorial'

function RoomixIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
      <path d="M11 2L2 9V20H8.5V14H13.5V20H20V9L11 2Z" fill="#a855f7" />
    </svg>
  )
}

interface Option {
  value: string
  emoji: string
  label: string
  desc?: string
}

interface Step {
  id: string
  question: string
  hint?: string
  type: 'single' | 'multi'
  max?: number
  options: Option[]
}

interface Answers {
  trabajo: string
  ubicacionTrabajo: string
  lifestyle: string
  entorno: string[]
  prioridades: string[]
}

const STEPS: Step[] = [
  {
    id: 'trabajo',
    question: '¿Cómo es tu día a día laboral?',
    hint: 'Nos ayuda a entender qué tan importante es la ubicación respecto a tu trabajo.',
    type: 'single',
    options: [
      { value: 'desde-casa', emoji: '🏠', label: 'Trabajo desde casa', desc: 'El espacio y la conexión importan' },
      { value: 'oficina', emoji: '🏢', label: 'Voy a la oficina', desc: 'La cercanía al trabajo es clave' },
      { value: 'hibrido', emoji: '🔄', label: 'Híbrido', desc: 'Necesito flexibilidad en la ubicación' },
      { value: 'remoto', emoji: '🌍', label: 'Freelance / remoto', desc: 'Total libertad para elegir dónde vivir' },
    ],
  },
  {
    id: 'lifestyle',
    question: '¿Cómo sos en tu tiempo libre?',
    hint: 'Entendemos qué tipo de barrio y entorno te va a hacer sentir bien.',
    type: 'single',
    options: [
      { value: 'hogareno', emoji: '🛋️', label: 'Hogareño/a', desc: 'Disfruto y me quedo en casa' },
      { value: 'social', emoji: '🍻', label: 'Social', desc: 'Salgo seguido, quiero bares y restós cerca' },
      { value: 'activo', emoji: '🏃', label: 'Activo/a', desc: 'Deporte, parques y aire libre' },
      { value: 'mix', emoji: '🌆', label: 'Un poco de todo', desc: 'Depende del humor del día' },
    ],
  },
  {
    id: 'entorno',
    question: '¿Qué querés tener cerca?',
    hint: 'Elegí todo lo que sea importante. Podés saltear si no tenés preferencia.',
    type: 'multi',
    options: [
      { value: 'subte', emoji: '🚇', label: 'Subte / transporte' },
      { value: 'parques', emoji: '🌳', label: 'Plazas y parques' },
      { value: 'gastronomia', emoji: '🍽️', label: 'Bares y restós' },
      { value: 'colegios', emoji: '🏫', label: 'Colegios' },
      { value: 'gym', emoji: '💪', label: 'Gimnasio' },
      { value: 'super', emoji: '🛒', label: 'Supermercados' },
      { value: 'salud', emoji: '🏥', label: 'Centro médico' },
      { value: 'cultura', emoji: '🎭', label: 'Cultura / entretenimiento' },
    ],
  },
  {
    id: 'prioridades',
    question: '¿Qué es lo más importante para vos?',
    hint: 'Elegí hasta 3. Las usamos para ordenar los resultados según tu perfil.',
    type: 'multi',
    max: 3,
    options: [
      { value: 'ubicacion', emoji: '📍', label: 'Ubicación', desc: 'Estar en la zona correcta' },
      { value: 'precio', emoji: '💰', label: 'Precio', desc: 'Que entre en mi presupuesto' },
      { value: 'espacio', emoji: '📐', label: 'Espacio', desc: 'Metros y ambientes suficientes' },
      { value: 'calidad', emoji: '✨', label: 'Calidad', desc: 'Terminaciones y luminosidad' },
      { value: 'transporte', emoji: '🚇', label: 'Transporte', desc: 'Bien conectado a la ciudad' },
      { value: 'tranquilidad', emoji: '🌿', label: 'Tranquilidad', desc: 'Barrio seguro y sin ruido' },
    ],
  },
]

const TOTAL = STEPS.length + 1

const perfilLabels: Record<string, string> = {
  'desde-casa': 'trabajás desde casa',
  'oficina': 'vas diariamente a la oficina',
  'hibrido': 'tenés modalidad híbrida',
  'remoto': 'sos remoto/freelance',
  'hogareno': 'valorás mucho el espacio de casa',
  'social': 'tenés vida social activa',
  'activo': 'buscás contacto con el aire libre',
  'mix': 'tenés un estilo de vida variado',
}

const prioridadLabels: Record<string, string> = {
  ubicacion: 'ubicación', precio: 'precio', espacio: 'espacio',
  calidad: 'calidad', transporte: 'transporte', tranquilidad: 'tranquilidad',
}

function buildInsight(answers: Answers): string {
  const t = perfilLabels[answers.trabajo] ?? ''
  const l = perfilLabels[answers.lifestyle] ?? ''
  const prios = answers.prioridades.slice(0, 2).map(p => prioridadLabels[p]).filter(Boolean)

  const base = [t, l].filter(Boolean).join(', y ')
  const prio = prios.length ? `Priorizamos ${prios.join(' y ')}.` : ''

  return `Basado en tu perfil, ${base}. ${prio}`.trim()
}

export default function BusquedaAsistida() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>({
    trabajo: 'oficina', ubicacionTrabajo: '', lifestyle: '', entorno: [], prioridades: [],
  })
  const [showTutorial, setShowTutorial] = useState(false)
  const cardGridRef = useRef<HTMLDivElement>(null)
  const oficinaBtnRef = useRef<HTMLButtonElement>(null)
  const locationWrapRef = useRef<HTMLDivElement>(null)
  const bottomBarRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setShowTutorial(true) }, [])

  const tutorialSteps: TutorialStep[] = [
    {
      title: 'Feature 2 — Búsqueda asistida',
      desc: 'Para usuarios que no saben qué quieren. Los guiamos con preguntas simples sobre su estilo de vida — sin filtros técnicos ni jerga inmobiliaria.',
    },
    {
      target: cardGridRef,
      title: 'Sin tecnicismos, solo opciones simples',
      desc: 'El usuario no elige filtros — elige cómo vive. Cada opción tiene emoji y descripción corta. Cualquiera puede responder sin saber de inmobiliaria.',
      side: 'below',
    },
    {
      target: oficinaBtnRef,
      title: 'Elegí "Voy a la oficina"',
      desc: 'Cuando el usuario va presencialmente a trabajar, le pedimos la dirección de su oficina. Eso nos da el destino real de commute para hacer recomendaciones precisas.',
      side: 'below',
    },
    {
      target: locationWrapRef,
      title: 'Esta dirección es el Punto B',
      desc: 'Lo que ingresá acá se convierte en el destino de commute en el mapa de resultados. Desde ahí calculamos qué tan cerca está cada propiedad.',
      side: 'below',
    },
    {
      target: locationWrapRef,
      title: 'Plan: Google Travel API',
      desc: 'En producción, con esta dirección se consulta la API de Google Travel para obtener opciones reales de transporte público — subte, colectivo y tiempo estimado en hora pico.',
      side: 'below',
    },
    {
      target: bottomBarRef,
      title: 'Perfil personalizado al final',
      desc: 'Con todas las respuestas armamos un perfil del usuario y lo llevamos directo a las propiedades que mejor le encajan.',
      side: 'above',
    },
  ]

  const isProfile = step === STEPS.length
  const current = isProfile ? null : STEPS[step]

  function canAdvance(): boolean {
    if (isProfile) return true
    if (!current) return false
    if (current.type === 'single') return !!(answers as unknown as Record<string, unknown>)[current.id]
    if (current.id === 'prioridades') return answers.prioridades.length > 0
    return true
  }

  function toggleMulti(id: 'entorno' | 'prioridades', value: string) {
    const max = STEPS.find(s => s.id === id)?.max
    setAnswers(a => {
      const arr = a[id]
      if (arr.includes(value)) return { ...a, [id]: arr.filter(v => v !== value) }
      if (max && arr.length >= max) return a
      return { ...a, [id]: [...arr, value] }
    })
  }

  function next() {
    if (isProfile) { navigate('/resultados', { state: { entorno: answers.entorno } }); return }
    setStep(n => n + 1)
  }

  const progressPct = ((step + 1) / TOTAL) * 100

  const allTags = [
    ...STEPS[0].options.filter(o => o.value === answers.trabajo),
    ...STEPS[1].options.filter(o => o.value === answers.lifestyle),
    ...STEPS[2].options.filter(o => answers.entorno.includes(o.value)),
    ...STEPS[3].options.filter(o => answers.prioridades.includes(o.value)),
  ]

  return (
    <div className={s.page}>

      {/* Top bar */}
      <div className={s.topBar}>
        <button
          className={s.backBtn}
          onClick={() => step > 0 ? setStep(n => n - 1) : navigate('/')}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M11 4L6 9L11 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className={s.logoCenter}>
          <RoomixIcon />
          <span>roomix</span>
        </div>

        <button className={s.closeBtn} onClick={() => navigate('/')}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M4 4L14 14M14 4L4 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Progress bar */}
      <div className={s.progressTrack}>
        <div className={s.progressFill} style={{ width: `${progressPct}%` }} />
      </div>

      {/* Body */}
      <div className={s.body}>
        <div key={step} className={s.stepWrap}>

          {/* Question steps */}
          {current && (
            <>
              <div className={s.stepMeta}>
                <span className={s.stepCount}>{step + 1} de {STEPS.length}</span>
              </div>
              <h2 className={s.question}>{current.question}</h2>
              {current.hint && <p className={s.hint}>{current.hint}</p>}

              {/* Single select: grid 2×2 con cards grandes */}
              {current.type === 'single' && (
                <div ref={step === 0 ? cardGridRef : undefined} className={s.cardGrid}>
                  {current.options.map(opt => {
                    const selected = (answers as unknown as Record<string, unknown>)[current.id] === opt.value
                    return (
                      <button
                        key={opt.value}
                        ref={current.id === 'trabajo' && opt.value === 'oficina' ? oficinaBtnRef : undefined}
                        className={`${s.optCard} ${selected ? s.optSelected : ''}`}
                        onClick={() => setAnswers(a => ({ ...a, [current.id]: opt.value }))}
                      >
                        <span className={s.optEmoji}>{opt.emoji}</span>
                        <span className={s.optLabel}>{opt.label}</span>
                        {opt.desc && <span className={s.optDesc}>{opt.desc}</span>}
                      </button>
                    )
                  })}
                </div>
              )}

              {/* Dirección del trabajo (híbrido u oficina) */}
              {current.id === 'trabajo' && (answers.trabajo === 'oficina' || answers.trabajo === 'hibrido') && (
                <div ref={locationWrapRef} className={s.locationWrap}>
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="6.5" r="2.5" stroke="rgba(168,85,247,0.7)" strokeWidth="1.4" />
                    <path d="M8 2C5.24 2 3 4.24 3 7C3 10.5 8 14 8 14C8 14 13 10.5 13 7C13 4.24 10.76 2 8 2Z" stroke="rgba(168,85,247,0.7)" strokeWidth="1.4" />
                  </svg>
                  <input
                    className={s.locationInput}
                    placeholder="Dirección del trabajo (ej: Av. Corrientes 1234)"
                    value={answers.ubicacionTrabajo}
                    onChange={e => setAnswers(a => ({ ...a, ubicacionTrabajo: e.target.value }))}
                    autoFocus
                  />
                </div>
              )}

              {/* Multi select entorno: chips */}
              {current.type === 'multi' && current.id === 'entorno' && (
                <div className={s.chipGrid}>
                  {current.options.map(opt => {
                    const selected = answers.entorno.includes(opt.value)
                    return (
                      <button
                        key={opt.value}
                        className={`${s.chip} ${selected ? s.optSelected : ''}`}
                        onClick={() => toggleMulti('entorno', opt.value)}
                      >
                        <span>{opt.emoji}</span>
                        <span>{opt.label}</span>
                      </button>
                    )
                  })}
                </div>
              )}

              {/* Multi select prioridades: cards medianas 2×3 */}
              {current.type === 'multi' && current.id === 'prioridades' && (
                <>
                  {current.max && (
                    <p className={s.maxHint}>
                      {answers.prioridades.length} / {current.max} elegidas
                    </p>
                  )}
                  <div className={s.cardGridSm}>
                    {current.options.map(opt => {
                      const selected = answers.prioridades.includes(opt.value)
                      const maxReached = !!(current.max && answers.prioridades.length >= current.max && !selected)
                      return (
                        <button
                          key={opt.value}
                          className={`${s.optCardSm} ${selected ? s.optSelected : ''} ${maxReached ? s.optDisabled : ''}`}
                          onClick={() => !maxReached && toggleMulti('prioridades', opt.value)}
                        >
                          <span className={s.optEmoji}>{opt.emoji}</span>
                          <span className={s.optLabel}>{opt.label}</span>
                          {opt.desc && <span className={s.optDesc}>{opt.desc}</span>}
                        </button>
                      )
                    })}
                  </div>
                </>
              )}
            </>
          )}

          {/* Perfil result */}
          {isProfile && (
            <div className={s.profile}>
              <div className={s.profileIcon}>✨</div>
              <h2 className={s.profileTitle}>Tu perfil buscador</h2>
              <p className={s.profileSubtitle}>Entendimos lo que necesitás</p>

              <div className={s.profileTags}>
                {allTags.map(tag => (
                  <span key={tag.value} className={s.profileTag}>
                    {tag.emoji} {tag.label}
                  </span>
                ))}
              </div>

              <div className={s.profileInsightCard}>
                <p className={s.profileInsight}>{buildInsight(answers)}</p>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Bottom bar */}
      <div ref={bottomBarRef} className={s.bottomBar}>
        {!isProfile && current?.type === 'multi' && current.id === 'entorno' && (
          <button className={s.skipBtn} onClick={next}>Saltear</button>
        )}
        <button
          className={s.nextBtn}
          onClick={next}
          disabled={!canAdvance()}
        >
          {isProfile ? 'Ver mis recomendaciones →' : 'Siguiente →'}
        </button>
      </div>

      {showTutorial && (
        <OnboardingTutorial
          steps={tutorialSteps}
          onDone={() => setShowTutorial(false)}
          onFinish={() => setShowTutorial(false)}
        />
      )}

    </div>
  )
}
