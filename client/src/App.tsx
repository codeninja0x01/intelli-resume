import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/routing/ProtectedRoute';
import GuestRoute from './components/routing/GuestRoute';

// Import Pages
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import DashboardPage from './pages/DashboardPage'; // <-- IMPORT THE NEW DASHBOARD PAGE

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <Routes>
            {/* --- GUEST ROUTES --- */}
            <Route element={<GuestRoute />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            </Route>

            {/* --- PROTECTED ROUTES --- */}
            <Route element={<ProtectedRoute />}>
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/dashboard" element={<DashboardPage />} /> {/* <-- THIS NOW WORKS */}
            </Route>
            
            {/* --- DEFAULT ROUTE --- */}
            <Route
              path="/"
              element={<Navigate to="/dashboard" replace />}
            />

          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;