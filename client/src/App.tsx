import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/routing/ProtectedRoute';

// Import Auth Pages
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

// Placeholder for other pages like Dashboard
const DashboardPage = () => {
  return (
    <div>
      <h1>Dashboard Page (Protected)</h1>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <Routes>
            {/* Authentication Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* Protected Application Routes */}
            <Route path="/dashboard" element={<ProtectedRoute />}>
              <Route index element={<DashboardPage />} />
            </Route>
            
            {/* Default route - consider if / should be login or a landing page */}
            {/* If user is auth, maybe redirect from / to /dashboard */}
            {/* For now, keep / as login for simplicity if not authenticated */}
            <Route path="/" element={<LoginPage />} /> 

            {/* Fallback for non-matched routes (optional) */}
            {/* <Route path="*" element={<div>404 Not Found</div>} /> */}
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
