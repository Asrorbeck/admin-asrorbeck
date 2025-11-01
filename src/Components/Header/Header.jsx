import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { settingsService } from "../../services/settingsService";
import { navigationService } from "../../services/navigationService";
import "./Header.css";

const Header = () => {
  const [siteName, setSiteName] = useState("Asrorbek's Blog");
  const [navigationItems, setNavigationItems] = useState([]);
  const [menuActive, setMenuActive] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await settingsService.get();
      if (data?.site_name) {
        setSiteName(data.site_name);
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    const fetchNavigation = async () => {
      const { data } = await navigationService.getAll();
      if (data) {
        setNavigationItems(data || []);
      }
    };
    fetchNavigation();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  return (
    <div className={`header ${isScrolled ? "header--scrolled" : ""}`}>
      <div className="container">
        <div className="header__container">
          <Link to="/" className="header__logo">
            {siteName}
          </Link>
          <div className="header__right">
            <button
              className="header__theme-toggle"
              onClick={toggleTheme}
              title={isDarkMode ? "Light mode" : "Dark mode"}
              aria-label={isDarkMode ? "Light mode" : "Dark mode"}
            >
              <svg
                className="theme-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {isDarkMode ? (
                  <path d="M12 3v1m0 16v1m9-9h1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                ) : (
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                )}
              </svg>
            </button>
            <ul
              className={`header__list ${
                menuActive ? "header__list--active" : ""
              }`}
            >
              {navigationItems.map((item) => (
                <li key={item.id} className="header__item">
                  {item.is_external ? (
                    <a
                      href={item.url}
                      target={item.target_blank ? "_blank" : "_self"}
                      rel={item.target_blank ? "noopener noreferrer" : ""}
                      className="header__link"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link to={item.url} className="header__link">
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>

            <div
              className={`header__burger ${menuActive ? "active" : ""}`}
              onClick={toggleMenu}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
