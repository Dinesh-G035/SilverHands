import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import AIAssistant from './components/AIAssistant';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import VoiceOnboardingPage from './pages/VoiceOnboardingPage';
import SkillIdentificationPage from './pages/SkillIdentificationPage';
import OpportunityRecommendationsPage from './pages/OpportunityRecommendationsPage';
import ServicesMarketplacePage from './pages/ServicesMarketplacePage';
import ProductsMarketplacePage from './pages/ProductsMarketplacePage';
import AISearchPage from './pages/AISearchPage';
import PricingAssistantPage from './pages/PricingAssistantPage';
import DashboardPage from './pages/DashboardPage';
import ProviderProfilePage from './pages/ProviderProfilePage';
import AddChoicePage from './pages/AddChoicePage';
import MessagesPage from './pages/MessagesPage';
import AdminPage from './pages/AdminPage';

export default function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-lavender-50 text-gray-800 flex flex-col font-sans">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/onboarding" element={<VoiceOnboardingPage />} />
              <Route path="/skill-id" element={<SkillIdentificationPage />} />
              <Route path="/opportunities" element={<OpportunityRecommendationsPage />} />
              <Route path="/services" element={<ServicesMarketplacePage />} />
              <Route path="/products" element={<ProductsMarketplacePage />} />
              <Route path="/ai-search" element={<AISearchPage />} />
              <Route path="/pricing-assistant" element={<PricingAssistantPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/provider/:id" element={<ProviderProfilePage />} />
              <Route path="/add" element={<AddChoicePage />} />
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </main>
          <AIAssistant />
          <BottomNav />
        </div>
      </Router>
    </AppProvider>
  );
}
