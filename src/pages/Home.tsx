import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import s from './Home.module.css'
import { MagicSearchIcon } from '../components/SmartSearchModal'
import { OnboardingTutorial, type TutorialStep } from '../components/OnboardingTutorial'

const recentSearches = [
  'un departamento en colegiales, belg...',
  'Casa con pileta',
  'PH en Recoleta',
]

function RoomixIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M11 2L2 9V20H8.5V14H13.5V20H20V9L11 2Z" fill="#a855f7" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
      <circle cx="7.5" cy="7.5" r="5" stroke="white" strokeWidth="1.6" />
      <path d="M11.5 11.5L15 15" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function MicIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
      <rect x="6" y="1.5" width="5" height="8" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 8.5C3 11.5 5.5 13.5 8.5 13.5C11.5 13.5 14 11.5 14 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="8.5" y1="13.5" x2="8.5" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
      <rect x="1.5" y="2.5" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <line x1="1.5" y1="6.5" x2="15.5" y2="6.5" stroke="currentColor" strokeWidth="1.4" />
      <line x1="5.5" y1="1" x2="5.5" y2="4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="11.5" y1="1" x2="11.5" y2="4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const [showTutorial, setShowTutorial] = useState(false)
  const searchBarRef = useRef<HTMLDivElement>(null)
  const assistedBtnRef = useRef<HTMLButtonElement>(null)
  const searchBtnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setShowTutorial(true)
  }, [])

  const tutorialSteps: TutorialStep[] = [
    {
      title: 'Bienvenido a Roomix',
      desc: 'Vamos a recorrer dos features. Arranquemos con la primera.',
    },
    {
      target: searchBarRef,
      title: 'Búsqueda sin resultados',
      desc: 'Simulamos una búsqueda que no tenga resultados para mostrar cómo la app ayuda al usuario a no quedarse sin opciones.',
      side: 'below',
    },
    {
      target: searchBtnRef,
      title: 'Apretá buscar',
      desc: 'Hacé clic para ver la página de sin resultados con todas las recomendaciones.',
      side: 'below',
    },
  ]

  function doneTutorial() {
    setShowTutorial(false)
  }

  return (
    <div className={s.page}>
      <div className={s.orb} />
      <div className={s.dot1} />
      <div className={s.dot2} />
      <div className={s.dot3} />

      <nav className={s.nav}>
        <div className={s.logo}>
          <RoomixIcon />
          <span>roomix</span>
        </div>
        <div className={s.navRight}>
          <button ref={assistedBtnRef} className={s.assistedBtn} onClick={() => navigate('/busqueda-asistida')}>
            <MagicSearchIcon />
            Búsqueda asistida
          </button>
          <span className={s.navLink}>Soy inmobiliario</span>
          <button className={s.iconBtn}>
            <CalendarIcon />
          </button>
          <div className={s.avatar}>JK</div>
        </div>
      </nav>

      <main className={s.main}>
        <div className={s.leftTag}>estilo moderno</div>

        <div className={s.content}>
          <h1 className={s.heroTitle}>
            Buscá <em>propiedades</em>
            <br />
            como te las imaginas
          </h1>

          <div ref={searchBarRef} className={s.searchBar}>
            <input
              className={s.searchInput}
              defaultValue="un departamento en colegiales, belgrano + chacarita palermo, 2 ambientes luminosos"
              readOnly
            />
            <button className={s.micBtn}>
              <MicIcon />
            </button>
            <button ref={searchBtnRef} className={s.searchBtn} onClick={() => navigate('/sin-resultados')}>
              <SearchIcon />
            </button>
          </div>

          <div className={s.recentRow}>
            <span className={s.recentLabel}>Recientes:</span>
            {recentSearches.map((item) => (
              <span key={item} className={s.chip}>
                {item}
                <button className={s.chipX}>×</button>
              </span>
            ))}
          </div>
        </div>
      </main>

      {showTutorial && (
        <OnboardingTutorial
          steps={tutorialSteps}
          onDone={doneTutorial}
          onFinish={() => { doneTutorial(); navigate('/sin-resultados') }}
        />
      )}
    </div>
  )
}
