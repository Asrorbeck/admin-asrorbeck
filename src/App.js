import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./Components/Admin/ProtectedRoute";
import Header from "./Components/Header/Header";
import Login from "./Components/Admin/Login";
import AdminLayout from "./Components/Admin/AdminLayout";
import AdminDashboard from "./Components/Admin/AdminDashboard";
import AdminNew from "./Components/Admin/AdminNew";
import AdminEdit from "./Components/Admin/AdminEdit";
import AdminAbout from "./Components/Admin/AdminAbout";
import AdminSettings from "./Components/Admin/AdminSettings";
import AdminNavigation from "./Components/Admin/AdminNavigation";
import AdminTranscription from "./Components/Admin/AdminTranscription";
import AdminTranscriptionHistory from "./Components/Admin/AdminTranscriptionHistory";
import "./index.css";
import "./Fonts/Fonts.css";

// Component to handle root route redirect
const RootRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div>Yuklanmoqda...</div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/admin" replace />;
  }

  return <Login />;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Header />
            <Routes>
              <Route path="/" element={<RootRedirect />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="new" element={<AdminNew />} />
                <Route path="edit/:id" element={<AdminEdit />} />
                <Route path="about" element={<AdminAbout />} />
                <Route path="navigation" element={<AdminNavigation />} />
                <Route path="transcription" element={<AdminTranscription />} />
                <Route
                  path="transcription-history"
                  element={<AdminTranscriptionHistory />}
                />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
