import { Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/Home/HomePage';
import './App.css'

function App() {
  return (
    <>

      <Routes>
        <Route index element={<HomePage />} />
      </Routes>

    </>
  )
}

export default App
