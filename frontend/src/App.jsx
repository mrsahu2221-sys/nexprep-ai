import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Paywall from './components/Paywall';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import MockTestPage from './pages/MockTestPage';
import ChapterPracticePage from './pages/ChapterPracticePage';
import PdfUploadPage from './pages/PdfUploadPage';
import TopicTypePage from './pages/TopicTypePage';
import ResultsPage from './pages/ResultsPage';
import DashboardPage from './pages/DashboardPage';
import PaymentPage from './pages/PaymentPage';

function AppRoutes() {
  const { lang } = useLanguage();

  if (!lang) {
    return <LandingPage />;
  }

  return (
    <>
      <Navbar />
      <Paywall />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/mock-test" element={<ProtectedRoute><MockTestPage /></ProtectedRoute>} />
        <Route path="/chapter-practice" element={<ProtectedRoute><ChapterPracticePage /></ProtectedRoute>} />
        <Route path="/pdf-upload" element={<ProtectedRoute><PdfUploadPage /></ProtectedRoute>} />
        <Route path="/topic-type" element={<ProtectedRoute><TopicTypePage /></ProtectedRoute>} />
        <Route path="/results" element={<ProtectedRoute><ResultsPage /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <div className="mesh-bg" />
          <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>
            <AppRoutes />
          </div>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}
