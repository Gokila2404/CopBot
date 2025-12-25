import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import TrackCase from './pages/TrackCase';
import Settings from './components/Settings';
import ChatBot from './components/ChatBot';
import ReportCase from './pages/RegisterComplaint';
import ProtectedRoute from './components/ProtectedRoute';
import { LanguageProvider } from './context/LanguageContext';

// Admin imports
import AdminLogin from './admin/AdminLogin';
import AdminApp from './admin/AdminApp';
import ProtectedAdminRoute from './admin/ProtectedAdminRoute';

const AppRoutes = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {/* Hide Navbar on admin routes */}
      {!isAdminRoute && <Navbar />}

      <Routes>
        {/* ---------------- PUBLIC ROUTES ---------------- */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ---------------- USER PROTECTED ROUTES ---------------- */}
        <Route
          path="/track-case"
          element={
            <ProtectedRoute>
              <TrackCase />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chatbot"
          element={
            <ProtectedRoute>
              <ChatBot />
            </ProtectedRoute>
          }
        />
        <Route
          path="/complaint-register"
          element={
            <ProtectedRoute>
              <ReportCase />
            </ProtectedRoute>
          }
        />

        {/* ---------------- ADMIN ROUTES ---------------- */}
        <Route path="/admin" element={<AdminLogin />} />

        <Route
          path="/admin/*"
          element={
            <ProtectedAdminRoute>
              <AdminApp />
            </ProtectedAdminRoute>
          }
        />
      </Routes>
    </>
  );
};

function App() {
  return (
    <LanguageProvider>
      <Router>
        <AppRoutes />
      </Router>
    </LanguageProvider>
  );
}

export default App;
