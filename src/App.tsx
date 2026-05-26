import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import NoResultados from './pages/NoResultados'
import Resultados from './pages/Resultados'
import BusquedaAsistida from './pages/BusquedaAsistida'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sin-resultados" element={<NoResultados />} />
      <Route path="/resultados" element={<Resultados />} />
      <Route path="/busqueda-asistida" element={<BusquedaAsistida />} />
    </Routes>
  )
}

export default App
