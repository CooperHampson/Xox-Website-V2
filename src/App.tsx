import { Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/Home/HomePage';
import { MerchStore } from './pages/Merch/MerchStore';
import './App.css'

function App() {
  return (
    <>

      <Routes>
        <Route index element={<HomePage />} />
        <Route path="store" element={<MerchStore />} />
      </Routes>

    </>
  )
}

export default App
