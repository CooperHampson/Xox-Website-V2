import { Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/Home/HomePage';
import { MerchStore } from './pages/Merch/MerchStoreHome';
import { AllProducts } from './pages/Merch/CategoryPages/AllProducts';
import { ShirtsPage } from './pages/Merch/CategoryPages/ShirtsPage';
import { PantsPage } from './pages/Merch/CategoryPages/PantsPage';
import { HoodiesPage } from './pages/Merch/CategoryPages/HoodiesPage';
import { FootwearPage } from './pages/Merch/CategoryPages/FootwearPage';
import { DailyLifePage } from './pages/Merch/CategoryPages/DailyLifePage';
import { GamingPeripheralsPage } from './pages/Merch/CategoryPages/GamingPeripheralsPage';
import { ProductPage } from './pages/Merch/components/ProductPage';
import { SearchResultsPage } from './pages/Merch/components/SearchResultsPage';
import { AccountPage } from './pages/Merch/Account/AccountPage';
import ResetPassword from './pages/Merch/ResetPassword/ResetPassword';
import './App.css'

function App() {

  return (
    <>

      <Routes>
        <Route index element={<HomePage />} />
        <Route path="store" element={<MerchStore />} />
        <Route path="store/all-products" element={<AllProducts />} />
        <Route path="store/shirts" element={<ShirtsPage />} />
        <Route path="store/pants" element={<PantsPage />} />
        <Route path="store/hoodies" element={<HoodiesPage />} />
        <Route path="store/footwear" element={<FootwearPage />} />
        <Route path="store/daily-life" element={<DailyLifePage />} />
        <Route path="store/gaming-peripherals" element={<GamingPeripheralsPage />} />
        <Route path="store/product/:productId" element={<ProductPage />} />
        <Route path="store/search" element={<SearchResultsPage />} />
        <Route path="store/account" element={<AccountPage />} />
        <Route path="store/reset-password" element={<ResetPassword />} />
      </Routes>

    </>
  )
}

export default App
