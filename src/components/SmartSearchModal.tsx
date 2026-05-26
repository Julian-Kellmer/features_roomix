import { useState } from 'react'
import s from './SmartSearchModal.module.css'

export function MagicSearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <circle cx="8.5" cy="8.5" r="5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12.5 12.5L16 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M16 3L16.5 1.5L17 3L18.5 3.5L17 4L16.5 5.5L16 4L14.5 3.5L16 3Z" fill="currentColor" />
      <path d="M13.5 6.5L13.8 5.7L14.1 6.5L14.9 6.8L14.1 7.1L13.8 7.9L13.5 7.1L12.7 6.8L13.5 6.5Z" fill="currentColor" />
    </svg>
  )
}

const TOTAL_STEPS = 5

type Answers = {
  personas: string
  presupuesto: string
  presupuestoMax: string
  atadoATrabajo: string
  ubicacionTrabajo: string
  tiempoViaje: string
  zonas: string[]
}

const personasOpts = ['1', '2', '3', '4+']

const presupuestoOpts = [
  { value: 'fijo', label: 'Tengo un tope fijo', desc: 'No me puedo pasar de un monto máximo' },
  { value: 'flexible', label: 'Puedo moverme si vale la pena', desc: 'Si la propiedad lo justifica, ajusto' },
]

const trabajoOpts = [
  { value: 'si', label: 'Sí, tengo un punto de referencia' },
  { value: 'no', label: 'No, soy flexible con la zona' },
]

const tiempoOpts = [
  { value: '15', label: '15 min', desc: 'Muy cerca' },
  { value: '30', label: '30 min', desc: 'Razonable' },
  { value: '45', label: '45 min', desc: 'Acepto algo más' },
  { value: '60+', label: '1h+', desc: 'Me da igual' },
]

const zonasOpts = [
  'Palermo', 'Belgrano', 'Colegiales', 'Chacarita',
  'Almagro', 'Villa Crespo', 'Caballito', 'Recoleta',
  'San Telmo', 'Flores', 'Núñez', 'Saavedra',
]

export function SmartSearchModal({ onClose, onComplete }: { onClose: () => void; onComplete?: () => void }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>({
    personas: '',
    presupuesto: '',
    presupuestoMax: '',
    atadoATrabajo: '',
    ubicacionTrabajo: '',
    tiempoViaje: '',
    zonas: [],
  })

  function toggleZona(zona: string) {
    setAnswers((a) => ({
      ...a,
      zonas: a.zonas.includes(zona) ? a.zonas.filter((z) => z !== zona) : [...a.zonas, zona],
    }))
  }

  function canAdvance() {
    if (step === 0) return !!answers.personas
    if (step === 1) return !!answers.presupuesto && (answers.presupuesto === 'flexible' || !!answers.presupuestoMax.trim())
    if (step === 2) return !!answers.atadoATrabajo && (answers.atadoATrabajo === 'no' || !!answers.ubicacionTrabajo.trim())
    if (step === 3) return !!answers.tiempoViaje
    if (step === 4) return true // zonas es opcional
    return false
  }

  return (
    <div className={s.overlay} onClick={onClose}>
      <div className={s.modal} onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className={s.header}>
          <div className={s.titleRow}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L9 5.5L13.5 6.5L9 7.5L8 12L7 7.5L2.5 6.5L7 5.5L8 1Z" fill="#a855f7" />
            </svg>
            <span className={s.title}>Búsqueda asistida</span>
          </div>
          <button className={s.closeBtn} onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M4 4L14 14M14 4L4 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Progress */}
        <div className={s.progress}>
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={`${s.progressDot} ${i < step ? s.progressDone : ''} ${i === step ? s.progressActive : ''}`}
            />
          ))}
          <span className={s.progressLabel}>{step + 1} de {TOTAL_STEPS}</span>
        </div>

        {/* Steps */}
        <div className={s.stepContent}>

          {/* Paso 1: personas */}
          {step === 0 && (
            <div className={s.step}>
              <p className={s.question}>¿Para cuántas personas es la vivienda?</p>
              <div className={s.personasGrid}>
                {personasOpts.map((opt) => (
                  <button
                    key={opt}
                    className={`${s.personaBtn} ${answers.personas === opt ? s.optSelected : ''}`}
                    onClick={() => setAnswers((a) => ({ ...a, personas: opt }))}
                  >
                    <span className={s.personaNum}>{opt}</span>
                    <span className={s.personaLabel}>
                      {opt === '1' ? 'persona' : opt === '4+' ? 'o más' : 'personas'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Paso 2: presupuesto */}
          {step === 1 && (
            <div className={s.step}>
              <p className={s.question}>¿Qué tanto juego te da tu presupuesto?</p>
              <div className={s.optCards}>
                {presupuestoOpts.map((opt) => (
                  <button
                    key={opt.value}
                    className={`${s.optCard} ${answers.presupuesto === opt.value ? s.optSelected : ''}`}
                    onClick={() => setAnswers((a) => ({ ...a, presupuesto: opt.value, presupuestoMax: '' }))}
                  >
                    <span className={s.optCardLabel}>{opt.label}</span>
                    <span className={s.optCardDesc}>{opt.desc}</span>
                  </button>
                ))}
                {answers.presupuesto === 'fijo' && (
                  <div className={s.locationInputWrapper}>
                    <span className={s.currencySymbol}>USD</span>
                    <input
                      className={s.locationInput}
                      type="number"
                      placeholder="Ej: 1500"
                      value={answers.presupuestoMax}
                      onChange={(e) => setAnswers((a) => ({ ...a, presupuestoMax: e.target.value }))}
                      autoFocus
                    />
                    <span className={s.currencyLabel}>/mes</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Paso 3: trabajo */}
          {step === 2 && (
            <div className={s.step}>
              <p className={s.question}>¿La ubicación está atada a un trabajo?</p>
              <p className={s.questionHint}>
                Si es así, buscamos opciones con tiempos de traslado cortos.
              </p>
              <div className={s.optCards}>
                {trabajoOpts.map((opt) => (
                  <button
                    key={opt.value}
                    className={`${s.optCard} ${answers.atadoATrabajo === opt.value ? s.optSelected : ''}`}
                    onClick={() => setAnswers((a) => ({ ...a, atadoATrabajo: opt.value, ubicacionTrabajo: opt.value === 'no' ? '' : a.ubicacionTrabajo }))}
                  >
                    <span className={s.optCardLabel}>{opt.label}</span>
                  </button>
                ))}
              </div>
              {answers.atadoATrabajo === 'si' && (
                <div className={s.locationInputWrapper}>
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="6.5" r="2.5" stroke="rgba(168,85,247,0.7)" strokeWidth="1.4" />
                    <path d="M8 2C5.24 2 3 4.24 3 7C3 10.5 8 14 8 14C8 14 13 10.5 13 7C13 4.24 10.76 2 8 2Z" stroke="rgba(168,85,247,0.7)" strokeWidth="1.4" />
                  </svg>
                  <input
                    className={s.locationInput}
                    placeholder="Ej: Av. Corrientes 1234, CABA"
                    value={answers.ubicacionTrabajo}
                    onChange={(e) => setAnswers((a) => ({ ...a, ubicacionTrabajo: e.target.value }))}
                    autoFocus
                  />
                </div>
              )}
            </div>
          )}

          {/* Paso 4: tiempo de viaje */}
          {step === 3 && (
            <div className={s.step}>
              <p className={s.question}>¿Hasta cuánto estarías dispuesto a viajar?</p>
              <p className={s.questionHint}>Tiempo estimado desde tu vivienda al trabajo o al centro.</p>
              <div className={s.personasGrid}>
                {tiempoOpts.map((opt) => (
                  <button
                    key={opt.value}
                    className={`${s.personaBtn} ${answers.tiempoViaje === opt.value ? s.optSelected : ''}`}
                    onClick={() => setAnswers((a) => ({ ...a, tiempoViaje: opt.value }))}
                  >
                    <span className={s.personaNum}>{opt.label}</span>
                    <span className={s.personaLabel}>{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Paso 5: zonas preferenciales */}
          {step === 4 && (
            <div className={s.step}>
              <p className={s.question}>¿Hay zonas que preferís?</p>
              <p className={s.questionHint}>
                Opcional — podés saltear este paso si no tenés preferencia.
              </p>
              <div className={s.zonasGrid}>
                {zonasOpts.map((zona) => (
                  <button
                    key={zona}
                    className={`${s.zonaChip} ${answers.zonas.includes(zona) ? s.optSelected : ''}`}
                    onClick={() => toggleZona(zona)}
                  >
                    {zona}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Nav */}
        <div className={s.nav}>
          {step > 0 ? (
            <button className={s.backBtn} onClick={() => setStep((s) => s - 1)}>
              ← Volver
            </button>
          ) : (
            <div />
          )}
          {step < TOTAL_STEPS - 1 ? (
            <button
              className={s.nextBtn}
              disabled={!canAdvance()}
              onClick={() => setStep((s) => s + 1)}
            >
              Siguiente →
            </button>
          ) : (
            <button className={s.nextBtn} onClick={() => { onClose(); onComplete?.() }}>
              Buscar propiedades
            </button>
          )}
        </div>

      </div>
    </div>
  )
}
