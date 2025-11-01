import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./AdminSidebar.css";

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const isActive = (path) => {
    if (path === "/admin") {
      return location.pathname === "/admin" || location.pathname === "/admin/new" || location.pathname.startsWith("/admin/edit");
    }
    // transcription-history uchun maxsus tekshirish
    if (path === "/admin/transcription") {
      return location.pathname === "/admin/transcription";
    }
    return location.pathname.startsWith(path);
  };

  const BlogsIcon = () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );

  const AboutIcon = () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );

  const SettingsIcon = () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24" />
    </svg>
  );

  const NavigationIcon = () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );

  const TranscriptionIcon = () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  );

  const HistoryIcon = () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );

  const LogoutIcon = () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );

  const handleLogout = async () => {
    if (window.confirm("Chiqishni xohlaysizmi?")) {
      await signOut();
      navigate("/");
    }
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__header">
        <h2 className="admin-sidebar__title">Admin Panel</h2>
      </div>
      <nav className="admin-sidebar__nav">
        <Link
          to="/admin"
          className={`admin-sidebar__link ${isActive("/admin") ? "admin-sidebar__link--active" : ""}`}
        >
          <BlogsIcon />
          <span>Blogs</span>
        </Link>
        <Link
          to="/admin/about"
          className={`admin-sidebar__link ${isActive("/admin/about") ? "admin-sidebar__link--active" : ""}`}
        >
          <AboutIcon />
          <span>Men Haqimda</span>
        </Link>
        <Link
          to="/admin/navigation"
          className={`admin-sidebar__link ${isActive("/admin/navigation") ? "admin-sidebar__link--active" : ""}`}
        >
          <NavigationIcon />
          <span>Navigation</span>
        </Link>
        <Link
          to="/admin/transcription"
          className={`admin-sidebar__link ${isActive("/admin/transcription") ? "admin-sidebar__link--active" : ""}`}
        >
          <TranscriptionIcon />
          <span>Transkriptiya</span>
        </Link>
        <Link
          to="/admin/transcription-history"
          className={`admin-sidebar__link ${isActive("/admin/transcription-history") ? "admin-sidebar__link--active" : ""}`}
        >
          <HistoryIcon />
          <span>Transkriptiya Tarixi</span>
        </Link>
        <Link
          to="/admin/settings"
          className={`admin-sidebar__link ${isActive("/admin/settings") ? "admin-sidebar__link--active" : ""}`}
        >
          <SettingsIcon />
          <span>Settings</span>
        </Link>
      </nav>
      <div className="admin-sidebar__footer">
        <button
          onClick={handleLogout}
          className="admin-sidebar__logout-btn"
        >
          <LogoutIcon />
          <span>Chiqish</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;

