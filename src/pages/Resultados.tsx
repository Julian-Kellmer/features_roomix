import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Polyline, Tooltip, useMap } from 'react-leaflet'
import L from 'leaflet'
import { MagicSearchIcon } from '../components/SmartSearchModal'
import s from './Resultados.module.css'

// ---- Punto B: ubicación del trabajo (simulado) ----
const PUNTO_B = { lat: -34.600, lng: -58.375 }

// ---- Mock data ----
const properties = [
  {
    id: 1,
    address: 'Soldado de la Independencia al 1300',
    neighborhood: 'Belgrano',
    price: 1650000,
    priceOld: null,
    ambientes: 4,
    banos: 2,
    m2: 109,
    lat: -34.556,
    lng: -58.455,
    color: '#7c3aed',
    tag: null,
    commute: 22,
    route: [
      [-34.556, -58.455] as [number, number],
      [-34.568, -58.440] as [number, number],
      [-34.583, -58.415] as [number, number],
      [-34.600, -58.375] as [number, number],
    ],
    reasons: [
      { icon: '💰', text: 'Dentro de tu presupuesto máximo de USD 1.800/mes' },
      { icon: '🚌', text: '22 min al trabajo en transporte público' },
      { icon: '📍', text: 'Zona preferida: Belgrano' },
      { icon: '👥', text: 'Espacio ideal para hasta 4 personas' },
      { icon: '☀️', text: 'Orientación norte, muy luminoso' },
    ],
  },
  {
    id: 2,
    address: 'García 1740, entre Migueleño y Sa...',
    neighborhood: 'Chacarita',
    price: 990000,
    priceOld: 1170000,
    ambientes: 2,
    banos: 1,
    m2: 51,
    lat: -34.580,
    lng: -58.461,
    color: '#0ea5e9',
    tag: 'Baja de precio',
    commute: 28,
    route: [
      [-34.580, -58.461] as [number, number],
      [-34.586, -58.440] as [number, number],
      [-34.595, -58.410] as [number, number],
      [-34.600, -58.375] as [number, number],
    ],
    reasons: [
      { icon: '📉', text: 'Precio bajó un 15% en los últimos 30 días' },
      { icon: '🚌', text: '28 min al trabajo en transporte público' },
      { icon: '💰', text: 'El mejor precio/m² del listado' },
      { icon: '🍻', text: 'Chacarita: zona con gran oferta gastronómica' },
    ],
  },
  {
    id: 3,
    address: 'Av. Cabildo 2156, Piso 4 B',
    neighborhood: 'Belgrano',
    price: 735000,
    priceOld: null,
    ambientes: 3,
    banos: 1,
    m2: 75,
    lat: -34.562,
    lng: -58.448,
    color: '#10b981',
    tag: 'Nuevo',
    commute: 20,
    route: [
      [-34.562, -58.448] as [number, number],
      [-34.574, -58.430] as [number, number],
      [-34.588, -58.405] as [number, number],
      [-34.600, -58.375] as [number, number],
    ],
    reasons: [
      { icon: '🆕', text: 'Recién publicado, pocas visitas aún' },
      { icon: '🚌', text: '20 min al trabajo, el segundo más cercano' },
      { icon: '📍', text: 'Zona preferida: Belgrano' },
      { icon: '📐', text: 'Mayor superficie en tu rango de precio' },
    ],
  },
  {
    id: 4,
    address: 'Juramento 2890, Piso 2 A',
    neighborhood: 'Colegiales',
    price: 620000,
    priceOld: null,
    ambientes: 2,
    banos: 1,
    m2: 48,
    lat: -34.571,
    lng: -58.444,
    color: '#f59e0b',
    tag: null,
    commute: 15,
    route: [
      [-34.571, -58.444] as [number, number],
      [-34.580, -58.425] as [number, number],
      [-34.592, -58.400] as [number, number],
      [-34.600, -58.375] as [number, number],
    ],
    reasons: [
      { icon: '⚡', text: '15 min al trabajo — el más cercano del listado' },
      { icon: '💰', text: 'El más accesible dentro de tu búsqueda' },
      { icon: '📍', text: 'Zona preferida: Colegiales' },
      { icon: '🏘️', text: 'Barrio tranquilo, ideal para trabajar desde casa' },
    ],
  },
]

const filters = ['Alquilar', 'Departamentos', 'Ambientes mín', 'Colegiales', 'Belgrano', 'Chacarita', 'Palermo']

function formatPrice(n: number) {
  return '$ ' + n.toLocaleString('es-AR')
}

function priceMarker(price: number, selected: boolean) {
  const label = '$ ' + Math.round(price / 1000) + 'k'
  return L.divIcon({
    className: '',
    html: `<div class="${selected ? 'map-pin map-pin--selected' : 'map-pin'}">${label}</div>`,
    iconAnchor: [28, 36],
  })
}

const puntoBIcon = L.divIcon({
  className: '',
  html: `<div class="map-pin-b">
    <span class="map-pin-b__label">Trabajo</span>
    <span class="map-pin-b__dot"></span>
  </div>`,
  iconAnchor: [36, 48],
})

// ---- SVG Icons ----
function RoomixIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
      <path d="M11 2L2 9V20H8.5V14H13.5V20H20V9L11 2Z" fill="#a855f7" />
    </svg>
  )
}
function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 17 17" fill="none">
      <circle cx="7.5" cy="7.5" r="5" stroke="rgba(255,255,255,0.4)" strokeWidth="1.6" />
      <path d="M11.5 11.5L15 15" stroke="rgba(255,255,255,0.4)" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}
function ChevronDown() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
      <path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function BellIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
      <path d="M8 1.5A5 5 0 0 0 3 6.5V10L1.5 12H14.5L13 10V6.5A5 5 0 0 0 8 1.5Z" stroke="currentColor" strokeWidth="1.4" />
      <path d="M6.5 12.5A1.5 1.5 0 0 0 9.5 12.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}
function BookmarkIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
      <path d="M3 2H13V14L8 10.5L3 14V2Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  )
}
function SortIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
      <path d="M4 4L7 1L10 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 10L7 13L4 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function HeartIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path d="M8 13.5C8 13.5 1.5 9.5 1.5 5.5C1.5 3.5 3 2 5 2C6.5 2 7.5 3 8 3.5C8.5 3 9.5 2 11 2C13 2 14.5 3.5 14.5 5.5C14.5 9.5 8 13.5 8 13.5Z" stroke="rgba(255,255,255,0.5)" strokeWidth="1.3" />
    </svg>
  )
}
function ListViewIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <line x1="2" y1="4" x2="14" y2="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="2" y1="8" x2="14" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="2" y1="12" x2="14" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
function WalkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="3" r="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M8 5L6 10L8 9L10 11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 10L5 13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M8 9L9 13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}
function BusIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="2" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.3" />
      <line x1="2" y1="7" x2="14" y2="7" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="5" cy="14" r="1.5" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="11" cy="14" r="1.5" stroke="currentColor" strokeWidth="1.2" />
      <line x1="5" y1="12" x2="5" y2="12.5" stroke="currentColor" strokeWidth="1.2" />
      <line x1="11" y1="12" x2="11" y2="12.5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  )
}
function ChevronUp() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
      <path d="M3 9L7 5L11 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function MapCenter() {
  const map = useMap()
  map.setView([-34.575, -58.420], 13)
  return null
}

// ---- POI data (mock) ----
const POI_DATA: Record<string, { id: string; lat: number; lng: number; name: string }[]> = {
  parques:     [{ id:'pa1', lat:-34.568, lng:-58.441, name:'Bosques de Palermo' }, { id:'pa2', lat:-34.574, lng:-58.424, name:'Parque Las Heras' }, { id:'pa3', lat:-34.560, lng:-58.455, name:'Plaza Belgrano' }],
  subte:       [{ id:'su1', lat:-34.571, lng:-58.432, name:'Palermo (Línea D)' }, { id:'su2', lat:-34.563, lng:-58.449, name:'Ministro Carranza (D)' }, { id:'su3', lat:-34.578, lng:-58.415, name:'Pueyrredón (D)' }],
  gastronomia: [{ id:'ga1', lat:-34.577, lng:-58.427, name:'Honduras & Armenia' }, { id:'ga2', lat:-34.570, lng:-58.418, name:'Plaza Serrano' }, { id:'ga3', lat:-34.564, lng:-58.440, name:'Las Cañitas' }],
  gym:         [{ id:'gy1', lat:-34.572, lng:-58.430, name:'Megatlon Palermo' }, { id:'gy2', lat:-34.566, lng:-58.444, name:'Arenas Club' }],
  super:       [{ id:'sp1', lat:-34.575, lng:-58.428, name:'Coto Palermo' }, { id:'sp2', lat:-34.562, lng:-58.452, name:'Día Belgrano' }, { id:'sp3', lat:-34.580, lng:-58.412, name:'Disco Recoleta' }],
  colegios:    [{ id:'co1', lat:-34.569, lng:-58.437, name:'Colegio Sagrado Corazón' }, { id:'co2', lat:-34.576, lng:-58.421, name:'Instituto San Martín' }],
  salud:       [{ id:'sa1', lat:-34.573, lng:-58.434, name:'CEMIC Palermo' }, { id:'sa2', lat:-34.581, lng:-58.417, name:'Clínica Recoleta' }],
  cultura:     [{ id:'cu1', lat:-34.575, lng:-58.429, name:'El Ateneo Grand Splendid' }, { id:'cu2', lat:-34.567, lng:-58.443, name:'Cine Hoyts Belgrano' }],
}

const POI_META: Record<string, { emoji: string; label: string }> = {
  parques:     { emoji: '🌳', label: 'Parques' },
  subte:       { emoji: '🚇', label: 'Subte' },
  gastronomia: { emoji: '🍽️', label: 'Bares y restós' },
  gym:         { emoji: '💪', label: 'Gimnasios' },
  super:       { emoji: '🛒', label: 'Súpers' },
  colegios:    { emoji: '🏫', label: 'Colegios' },
  salud:       { emoji: '🏥', label: 'Salud' },
  cultura:     { emoji: '🎭', label: 'Cultura' },
}

function poiIcon(emoji: string) {
  return L.divIcon({
    className: '',
    html: `<div class="poi-pin">${emoji}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  })
}

export default function Resultados() {
  const navigate = useNavigate()
  const location = useLocation()
  const entorno: string[] = (location.state as { entorno?: string[] })?.entorno ?? []
  const [selected, setSelected] = useState<number | null>(null)
  const [activePOIs, setActivePOIs] = useState<string[]>(entorno)

  function togglePOI(key: string) {
    setActivePOIs(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])
  }

  const selectedProp = properties.find((p) => p.id === selected) ?? null

  function handleCardClick(id: number) {
    setSelected((prev) => (prev === id ? null : id))
  }

  return (
    <div className={s.page}>
      <style>{`
        .map-pin {
          background: #fff;
          color: #111;
          font-size: 11px;
          font-weight: 700;
          font-family: -apple-system, sans-serif;
          padding: 4px 9px;
          border-radius: 7px;
          white-space: nowrap;
          box-shadow: 0 2px 8px rgba(0,0,0,0.25);
          position: relative;
        }
        .map-pin::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 50%;
          transform: translateX(-50%);
          border: 5px solid transparent;
          border-top-color: #fff;
          border-bottom: none;
        }
        .map-pin--selected {
          background: #7c3aed;
          color: #fff;
          box-shadow: 0 2px 12px rgba(124,58,237,0.5);
        }
        .map-pin--selected::after { border-top-color: #7c3aed; }

        .map-pin-b {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
        }
        .map-pin-b__label {
          background: #f97316;
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          font-family: -apple-system, sans-serif;
          padding: 3px 8px;
          border-radius: 6px;
          box-shadow: 0 2px 8px rgba(249,115,22,0.4);
          white-space: nowrap;
        }
        .map-pin-b__dot {
          width: 10px;
          height: 10px;
          background: #f97316;
          border: 2px solid #fff;
          border-radius: 50%;
          box-shadow: 0 2px 6px rgba(249,115,22,0.5);
        }
        .leaflet-container { background: #1a1728; }
        .poi-pin {
          width: 30px; height: 30px;
          background: #fff;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          border: 1.5px solid rgba(0,0,0,0.08);
        }
      `}</style>

      {/* Header */}
      <header className={s.header}>
        <Link to="/" className={s.logo}>
          <RoomixIcon />
          <span>roomix</span>
        </Link>
        <nav className={s.headerNav}>
          <button className={s.navBtn}>Herramientas <ChevronDown /></button>
          <button className={s.navBtn}>MR panel</button>
          <button className={s.navBtn}>Soy inmobiliario</button>
          <button className={s.assistedBtn} onClick={() => navigate('/busqueda-asistida')}>
            <MagicSearchIcon />
            Búsqueda asistida
          </button>
          <div className={s.avatar} />
        </nav>
      </header>

      {/* Search + filtros */}
      <div className={s.searchSection}>
        <div className={s.searchBar}>
          <SearchIcon />
          <span className={s.searchText}>
            un departamento en colegiales, belgrano + chacarita palermo, 2 ambientes luminosos
          </span>
        </div>
        <div className={s.filtersRow}>
          {filters.map((f) => (
            <span key={f} className={s.filterChip}>
              {f} <button className={s.chipX}>×</button>
            </span>
          ))}
        </div>
        <div className={s.toolbar}>
          <div className={s.toolbarLeft}>
            <button className={s.toolBtn}><BellIcon /> Crear alerta</button>
            <button className={s.toolBtn}><BookmarkIcon /> Guardar búsqueda</button>
          </div>
          <button className={s.sortBtn}><SortIcon /> Más recientes <ChevronDown /></button>
        </div>
      </div>

      {/* Split layout */}
      <div className={s.body}>

        {/* Panel izquierdo */}
        <div className={s.listPanel}>
          <p className={s.resultCount}>4 propiedades encontradas</p>
          <div className={s.cardsList}>
            {properties.map((prop) => {
              const isSelected = selected === prop.id
              return (
                <div
                  key={prop.id}
                  className={`${s.card} ${isSelected ? s.cardSelected : ''}`}
                  onClick={() => handleCardClick(prop.id)}
                >
                  {/* Fila principal: foto + info */}
                  <div className={s.cardMain}>
                    <div className={s.cardPhoto} style={{ background: `linear-gradient(135deg, ${prop.color}44, ${prop.color}88)` }}>
                      {prop.tag && <span className={s.cardTag}>{prop.tag}</span>}
                      <button className={s.cardHeart} onClick={(e) => e.stopPropagation()}>
                        <HeartIcon />
                      </button>
                      <div className={s.cardPhotoDot} style={{ background: prop.color }} />
                    </div>

                    <div className={s.cardInfo}>
                      <div className={s.cardTop}>
                        <p className={s.cardAddress}>{prop.address}</p>
                        <p className={s.cardNeighborhood}>{prop.neighborhood}</p>
                      </div>
                      <div className={s.cardPriceRow}>
                        <span className={s.cardPrice}>{formatPrice(prop.price)}</span>
                        {prop.priceOld && (
                          <span className={s.cardPriceOld}>{formatPrice(prop.priceOld)}</span>
                        )}
                      </div>
                      <div className={s.cardBottom}>
                        <div className={s.cardDetails}>
                          <span>{prop.ambientes} amb</span>
                          <span className={s.detailDot}>·</span>
                          <span>{prop.banos} baño{prop.banos > 1 ? 's' : ''}</span>
                          <span className={s.detailDot}>·</span>
                          <span>{prop.m2} m²</span>
                        </div>
                        <span className={s.commuteTag}>
                          <BusIcon />
                          {prop.commute} min
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Panel expandible: razones */}
                  {isSelected && (
                    <div className={s.reasonsPanel} onClick={(e) => e.stopPropagation()}>
                      <div className={s.reasonsHeader}>
                        <span className={s.reasonsTitle}>¿Por qué esta opción?</span>
                        <button className={s.reasonsClose} onClick={() => setSelected(null)}>
                          <ChevronUp />
                        </button>
                      </div>
                      <div className={s.reasonsList}>
                        {prop.reasons.map((r, i) => (
                          <div key={i} className={s.reasonItem}>
                            <span className={s.reasonIcon}>{r.icon}</span>
                            <span className={s.reasonText}>{r.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Panel derecho: mapa */}
        <div className={s.mapPanel}>
          <MapContainer
            center={[-34.575, -58.420]}
            zoom={13}
            className={s.map}
            zoomControl={false}
          >
            <MapCenter />
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="" />

            {/* Punto B: trabajo */}
            <Marker position={[PUNTO_B.lat, PUNTO_B.lng]} icon={puntoBIcon} />

            {/* Propiedades */}
            {properties.map((prop) => (
              <Marker
                key={prop.id}
                position={[prop.lat, prop.lng]}
                icon={priceMarker(prop.price, selected === prop.id)}
                eventHandlers={{ click: () => handleCardClick(prop.id) }}
              />
            ))}

            {/* POIs según preferencias del usuario */}
            {activePOIs.flatMap(cat =>
              (POI_DATA[cat] ?? []).map(poi => (
                <Marker key={poi.id} position={[poi.lat, poi.lng]} icon={poiIcon(POI_META[cat]?.emoji ?? '📍')}>
                  <Tooltip direction="top" offset={[0, -14]}>{poi.name}</Tooltip>
                </Marker>
              ))
            )}

            {/* Ruta simulada al trabajo */}
            {selectedProp && (
              <Polyline
                positions={selectedProp.route}
                pathOptions={{
                  color: '#a855f7',
                  weight: 3,
                  opacity: 0.85,
                  dashArray: '8 6',
                }}
              />
            )}
          </MapContainer>

          {/* Badge de commute flotante */}
          {selectedProp && (
            <div className={s.commuteBadge}>
              <BusIcon />
              <span>~{selectedProp.commute} min al trabajo</span>
            </div>
          )}

          {/* Filtros de POI flotantes */}
          {entorno.length > 0 && (
            <div className={s.poiBar}>
              {entorno.map(cat => {
                const meta = POI_META[cat]
                if (!meta) return null
                const active = activePOIs.includes(cat)
                return (
                  <button
                    key={cat}
                    className={`${s.poiChip} ${active ? s.poiChipActive : ''}`}
                    onClick={() => togglePOI(cat)}
                  >
                    <span>{meta.emoji}</span>
                    <span>{meta.label}</span>
                  </button>
                )
              })}
            </div>
          )}

          {/* Acciones sobre el mapa */}
          <div className={s.mapActions}>
            <button className={`${s.mapActionBtn} ${s.mapActionActive}`}>
              <ListViewIcon /> Lista
            </button>
            <button className={s.mapActionBtn}>
              <WalkIcon /> Recorrer zona
            </button>
            <button className={s.mapActionBtn}>
              <BookmarkIcon /> Guardar zona
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}
