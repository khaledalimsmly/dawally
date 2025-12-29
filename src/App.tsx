import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DemoModeProvider } from './contexts/DemoModeContext';
import { ToastProvider } from './contexts/ToastContext';
import { RTLProvider } from './components/RTLProvider';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ToastContainer } from './components/Toast';
import { Home } from './pages/Home';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { Dashboard } from './pages/Dashboard';
import { Admin } from './pages/Admin';
import { PredictionDemo } from './pages/PredictionDemo';
import { Search } from './pages/Search';
import { StockDetail } from './pages/StockDetail';
import { CompareModels } from './pages/CompareModels';
import { ModelsOverview } from './pages/ModelsOverview';
import { MarketScanner } from './pages/MarketScanner';
import { Pricing } from './pages/Pricing';
import { Docs } from './pages/Docs';
import { Investors } from './pages/Investors';

function App() {
  return (
    <Router>
      <AuthProvider>
        <DemoModeProvider>
          <ToastProvider>
            <RTLProvider>
              <ToastContainer />
              <div className="min-h-screen">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/landing" element={<Landing />} />
                <Route path="/docs" element={<Docs />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              } />
              <Route path="/prediction-demo" element={
                <ProtectedRoute>
                  <PredictionDemo />
                </ProtectedRoute>
              } />
              <Route path="/search" element={<Search />} />
              <Route path="/scanner" element={<MarketScanner />} />
              <Route path="/compare-models" element={<ModelsOverview />} />
              <Route path="/stock/:symbol" element={<StockDetail />} />
              <Route path="/stock/:symbol/compare" element={<CompareModels />} />
              <Route path="/investors" element={<Investors />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              </div>
            </RTLProvider>
          </ToastProvider>
        </DemoModeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
