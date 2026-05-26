import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import s from './NoResultados.module.css'
import { MagicSearchIcon } from '../components/SmartSearchModal'
import { OnboardingTutorial, type TutorialStep } from '../components/OnboardingTutorial'

const filters = [
  'Alquilar',
  'Departamentos',
  'Ambientes mín',
  'Interior luminoso',
  'Colegiales',
  'Belgrano',
  'Chacarita',
  'Palermo',
]

const popularSearches = [
  { title: 'Departamentos en venta', subtitle: 'Departamentos de todo tipo' },
  { title: 'Casas en alquiler', subtitle: 'Casa con pileta' },
  { title: 'Con pileta', subtitle: 'Propiedades con pileta' },
  { title: 'Propiedades nuevas', subtitle: 'A estrenar y en construcción' },
]


function RoomixIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
      <path d="M11 2L2 9V20H8.5V14H13.5V20H20V9L11 2Z" fill="#a855f7" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 17 17" fill="none">
      <circle cx="7.5" cy="7.5" r="5" stroke="rgba(255,255,255,0.4)" strokeWidth="1.6" />
      <path d="M11.5 11.5L15 15" stroke="rgba(255,255,255,0.4)" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function ChevronDown({ rotated }: { rotated?: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      style={{ transform: rotated ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
    >
      <path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M5 3L9 7L5 11" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function BellIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M8 1.5A5 5 0 0 0 3 6.5V10L1.5 12H14.5L13 10V6.5A5 5 0 0 0 8 1.5Z" stroke="currentColor" strokeWidth="1.4" />
      <path d="M6.5 12.5A1.5 1.5 0 0 0 9.5 12.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function BookmarkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M3 2H13V14L8 10.5L3 14V2Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  )
}

function SortIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M4 4L7 1L10 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 10L7 13L4 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ListViewIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <line x1="2" y1="4" x2="14" y2="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="2" y1="8" x2="14" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="2" y1="12" x2="14" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function GridViewIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4" />
      <rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4" />
      <rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4" />
      <rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
}

function LightbulbIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 1.5A4.5 4.5 0 0 0 3.5 6C3.5 8 4.5 9.5 6 10.5V12H10V10.5C11.5 9.5 12.5 8 12.5 6A4.5 4.5 0 0 0 8 1.5Z" stroke="#a855f7" strokeWidth="1.4" />
      <line x1="6" y1="13.5" x2="10" y2="13.5" stroke="#a855f7" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

const filterOptions = [
  'Alquilar',
  'Departamentos',
  'Ambientes mín',
  'Interior luminoso',
  'Colegiales',
  'Belgrano',
  'Chacarita',
  'Palermo',
]

export default function NoResultados() {
  const navigate = useNavigate()
  const [excluyentes, setExcluyentes] = useState<string[]>([])
  const [showTutorial, setShowTutorial] = useState(false)
  const alternativesRef = useRef<HTMLDivElement>(null)
  const excluyentesRef = useRef<HTMLDivElement>(null)
  const assistedBtnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => { setShowTutorial(true) }, [])

  const tutorialSteps: TutorialStep[] = [
    {
      target: alternativesRef,
      title: 'Recomendación inteligente',
      desc: 'La app detecta qué filtros están bloqueando los resultados y sugiere la combinación que libera más opciones sin perder lo que importa.',
      side: 'below',
    },
    {
      target: excluyentesRef,
      title: 'Seleccioná tus prioridades',
      desc: 'El usuario marca qué filtros son innegociables. La búsqueda se adapta sin resignar lo más importante.',
      side: 'above',
    },
    {
      target: assistedBtnRef,
      title: 'Feature 2 — Búsqueda asistida',
      desc: 'Para usuarios que no saben bien qué quieren. Tocá este botón para continuar con el siguiente feature.',
      side: 'below',
    },
  ]

  function toggleExcluyente(f: string) {
    setExcluyentes((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]
    )
  }

  return (
    <div className={s.page}>
      {/* Header */}
      <header className={s.header}>
        <Link to="/" className={s.logo}>
          <RoomixIcon />
          <span>roomix</span>
        </Link>
        <nav className={s.headerNav}>
          <button className={s.navBtn}>
            Herramientas <ChevronDown />
          </button>
          <button className={s.navBtn}>MR panel</button>
          <button className={s.navBtn}>Soy inmobiliario</button>
          <button ref={assistedBtnRef} className={s.assistedBtn} onClick={() => navigate('/busqueda-asistida')}>
            <MagicSearchIcon />
            Búsqueda asistida
          </button>
          <div className={s.avatar} />
        </nav>
      </header>

      {/* Sección de búsqueda y filtros */}
      <div className={s.searchSection}>
        <div className={s.searchBar}>
          <SearchIcon />
          <span className={s.searchText}>
            un departamento en colegiales, belgrano + chacarita palermo, 2 ambientes luminosos
          </span>
        </div>

        <div className={s.filtersRow}>
          {filters.map((f) => (
            <span key={f} className={`${s.filterChip} ${f === 'Interior luminoso' ? s.filterChipHighlight : ''}`}>
              {f}
              <button className={s.chipX}>×</button>
            </span>
          ))}
        </div>

        <div className={s.toolbar}>
          <div className={s.toolbarLeft}>
            <button className={s.toolBtn}><BellIcon /> Alertas</button>
            <button className={s.toolBtn}><BookmarkIcon /> Guardar búsqueda</button>
          </div>
          <button className={s.sortBtn}>
            <SortIcon /> Más recientes <ChevronDown />
          </button>
        </div>
      </div>

      {/* Contenido */}
      <main className={s.main}>
        <div className={s.emptyState}>
          <h2 className={s.emptyTitle}>No se encontraron propiedades</h2>
          <p className={s.emptySubtitle}>
            No hay resultados que coincidan con los criterios de búsqueda.
          </p>
        </div>

        {/* Sugerencia: adaptar filtros */}
        <div ref={alternativesRef} className={s.alternativesCard}>
          <div className={s.alternativesHeader}>
            <div className={s.alternativesLeft}>
              <LightbulbIcon />
              <div>
                <p className={s.alternativesTitle}>
                  Sin el filtro <span className={s.filterName}>"Interior luminoso"</span> hay{' '}
                  <strong>4 propiedades disponibles</strong>
                </p>
                <p className={s.alternativesSubtitle}>
                  Seguís buscando en Colegiales · Belgrano · Chacarita · Palermo
                </p>
              </div>
            </div>
            <button className={s.adaptBtn}>Adaptar filtros</button>
          </div>
        </div>

        {/* Pregunta: filtros excluyentes */}
        <div ref={excluyentesRef} className={s.excluyentesCard}>
          <p className={s.excluyentesTitle}>
            ¿Hay algún filtro excluyente o menos dispensable?
          </p>
          <p className={s.excluyentesSubtitle}>
            Marcá los que no querés perder para que te recomendemos sin resignar tus preferencias.
          </p>
          <div className={s.excluyentesChips}>
            {filterOptions.map((f) => (
              <button
                key={f}
                className={`${s.excluyenteChip} ${excluyentes.includes(f) ? s.excluyenteChipActive : ''}`}
                onClick={() => toggleExcluyente(f)}
              >
                {f}
                {excluyentes.includes(f) && <span className={s.checkmark}>✓</span>}
              </button>
            ))}
          </div>
          {excluyentes.length > 0 && (
            <button className={s.recomendarBtn}>
              Ver recomendaciones con estos filtros fijos
            </button>
          )}
        </div>

        {/* Búsquedas populares */}
        <div className={s.popular}>
          <p className={s.popularLabel}>Probá estas búsquedas populares:</p>
          <div className={s.popularGrid}>
            {popularSearches.map((item) => (
              <button key={item.title} className={s.popularCard}>
                <div className={s.cardText}>
                  <p className={s.cardTitle}>{item.title}</p>
                  <p className={s.cardSubtitle}>{item.subtitle}</p>
                </div>
                <ChevronRight />
              </button>
            ))}
          </div>
        </div>
      </main>

      {showTutorial && (
        <OnboardingTutorial
          steps={tutorialSteps}
          onDone={() => setShowTutorial(false)}
          onFinish={() => { setShowTutorial(false); navigate('/busqueda-asistida') }}
          finishLabel="Ver Feature 2 →"
        />
      )}

      {/* Bottom bar */}
      <footer className={s.bottomBar}>
        <button className={`${s.viewBtn} ${s.active}`}>
          <ListViewIcon /> Lista
        </button>
        <button className={s.viewBtn}>
          <GridViewIcon />
        </button>
      </footer>
    </div>
  )
}
