import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTitle } from "../hooks/TitleContext";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/Slices/authSlice";
import { toast } from "react-toastify";
import { IoIosArrowDown } from "react-icons/io";
import './Navbar.css';

// Add custom styles to remove hover animations and glow effects
const customStyles = document.createElement('style');
customStyles.innerHTML = `
  .user-btn:hover {
    transform: none !important;
    transition: none !important;
    background-color: transparent !important;
    color: inherit !important;
  }
  .user-btn:focus {
    transform: none !important;
    transition: none !important;
    background-color: transparent !important;
    color: inherit !important;
    box-shadow: none !important;
  }
  .user-btn:active {
    transform: none !important;
    transition: none !important;
    background-color: transparent !important;
    color: inherit !important;
  }
  .dropdown-item:hover {
    transform: none !important;
    transition: none !important;
    background-color: transparent !important;
    color: inherit !important;
  }
  .dropdown-menu {
    transform: none !important;
    transition: none !important;
  }
  .dropdown-toggle:hover {
    transform: none !important;
    transition: none !important;
    background-color: transparent !important;
    color: inherit !important;
  }
  .dropdown-toggle:focus {
    transform: none !important;
    transition: none !important;
    background-color: transparent !important;
    box-shadow: none !important;
    color: white !important;
  }
  .dropdown-toggle:active {
    transform: none !important;
    transition: none !important;
    background-color: transparent !important;
    color: inherit !important;
  }
  .user-btn {
    text-shadow: none !important;
    filter: none !important;
  }
  .user-btn span {
    text-shadow: none !important;
    filter: none !important;
  }
  .user-btn svg {
    filter: none !important;
    text-shadow: none !important;
  }
  .dropdown-toggle {
    text-shadow: none !important;
    filter: none !important;
  }
  .dropdown-toggle * {
    text-shadow: none !important;
    filter: none !important;
  }
  /* Remove hover trigger - dropdown should only show on click */
  /* .dropdown:hover .dropdown-menu {
    display: block !important;
  } */
  .dropdown .dropdown-menu {
    transition: none !important;
    animation: none !important;
  }
  /* Override App.css hover effects */
  .topnav .dropdown-item:hover {
    background-color: transparent !important;
    color: inherit !important;
    box-shadow: none !important;
    text-shadow: none !important;
    filter: none !important;
  }
  .topnav .user-btn:hover {
    background-color: transparent !important;
    color: inherit !important;
    box-shadow: none !important;
    text-shadow: none !important;
    filter: none !important;
    outline: none !important;
    border: none !important;
  }
  .topnav .dropdown-toggle:hover {
    background-color: transparent !important;
    color: inherit !important;
    box-shadow: none !important;
    text-shadow: none !important;
    filter: none !important;
    outline: none !important;
    border: none !important;
  }
  .topnav .dropdown-toggle:hover span {
    color: inherit !important;
    text-shadow: none !important;
    filter: none !important;
  }
  .topnav .dropdown-toggle:hover svg {
    color: inherit !important;
    text-shadow: none !important;
    filter: none !important;
  }
  /* Remove any glow effects */
  .topnav .user-btn,
  .topnav .dropdown-toggle,
  .topnav .dropdown-item {
    box-shadow: none !important;
    text-shadow: none !important;
    filter: none !important;
    outline: none !important;
  }
  .topnav .user-btn *,
  .topnav .dropdown-toggle *,
  .topnav .dropdown-item * {
    box-shadow: none !important;
    text-shadow: none !important;
    filter: none !important;
  }
  /* Override specific App.css rules that cause glow */
  .topnav .user-btn {
    background-color: var(--main-color) !important;
    color: var(--basic-color) !important;
  }
  .topnav .user-btn:hover {
    background-color: var(--main-color) !important;
    color: var(--basic-color) !important;
  }
  .topnav .user-btn:focus {
    background-color: var(--main-color) !important;
    color: var(--basic-color) !important;
  }
  .topnav .user-btn:active {
    background-color: var(--main-color) !important;
    color: var(--basic-color) !important;
  }
  /* Force remove all visual effects */
  .topnav .user-btn,
  .topnav .user-btn:hover,
  .topnav .user-btn:focus,
  .topnav .user-btn:active,
  .topnav .user-btn:visited {
    background-color: var(--main-color) !important;
    color: var(--basic-color) !important;
    box-shadow: none !important;
    text-shadow: none !important;
    filter: none !important;
    outline: none !important;
    border: none !important;
    transform: none !important;
    transition: none !important;
  }
`;
if (!document.querySelector('#navbar-custom-styles')) {
  customStyles.id = 'navbar-custom-styles';
  document.head.appendChild(customStyles);
}

const Navbar = ({ toggleSideNav, isSideNavOpen }) => {
  const { t, i18n } = useTranslation("global");
  const { title } = useTitle();
  const [isMobileScrolled, setIsMobileScrolled] = useState(false);
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const today = new Date();
  const dayNames = [
    t("labels.week.sunday"),
    t("labels.week.monday"),
    t("labels.week.tuesday"),
    t("labels.week.wednesday"),
    t("labels.week.thursday"),
    t("labels.week.friday"),
    t("labels.week.saturday"),
  ];
  const day = dayNames[today.getDay()];
  const dateStr = `${String(today.getDate()).padStart(2, "0")}/${String(
    today.getMonth() + 1
  ).padStart(2, "0")}/${today.getFullYear()}`;
  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      toast.success("تم تسجيل الخروج بنجاح", { rtl: true });
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      toast.error(err.message || "فشل تسجيل الخروج", { rtl: true });
      // Force logout even if server call fails
      window.location.reload();
    }
  };
  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  useEffect(() => {
    const handleScroll = () => {
      const isMobile = window.innerWidth <= 768;
      const scrolled = window.scrollY >= 100;
      setIsMobileScrolled(isMobile && scrolled);
    };

    // Run once on mount
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);
  const getDisplayName = () => {
    // Prefer Redux state
    const reduxUser = authState?.user;
    const nameFromRedux = reduxUser?.data?.user?.name || reduxUser?.user?.name || reduxUser?.name;
    if (nameFromRedux) return nameFromRedux;

    // Fallback to sessionStorage
    try {
      const storedUser = sessionStorage.getItem("useralbaraqawy");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        return parsed?.data?.user?.name || parsed?.user?.name || parsed?.name || (i18n.language === "ar" ? "أدمن" : "Admin");
      }
    } catch {}

    return i18n.language === "ar" ? "أدمن" : "Admin";
  };

  return (
    <div
      className={`navbar topnav border-bottom shadow-sm ${isSideNavOpen ? "with-sidenav" : "full-width"
        } ${isMobileScrolled ? "fixed-top" : ""}`}
    >
      <div className="container d-flex justify-content-between align-items-center">
        <div className="toggle_sidenav d-flex align-items-center gap-2">
          <span
            className="p-2"
            onClick={toggleSideNav}
            style={{ cursor: "pointer", color: "var(--main-color)" }}
            aria-label="Toggle Side Navigation"
          >
            <i className="fa fa-bars"></i>
          </span>
          <b className="text-md" style={{ color: 'var(--text-primary)', fontWeight: 'bold !important', fontSize: '15px' }}>{title}</b>
        </div>

        <ul className="actions d-flex align-items-center top-actions-top list-unstyled m-0">
        

          {/* Language Switcher */}
          <li className="dropdown mx-3">
            <button
              className="btn btn-outline-light btn-sm dropdown-toggle"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{
                border: '1px solid var(--border-color)',
                borderRadius: '20px',
                padding: '6px 12px',
                fontSize: '14px',
                fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                fontWeight: 'bold',
                color: 'var(--text-primary)'
              }}
            >
              <i className="fa fa-globe mx-1"></i>
              <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{i18n.language === 'ar' ? 'العربية' : 'English'}</span>
            </button>
            <ul className="dropdown-menu dropdown-menu-end" style={{ 
              minWidth: '140px',
              padding: '8px 0',
              marginTop: '5px',
              marginRight: '10px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--basic-color)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
            }}>
              <li>
                <button
                  className={`dropdown-item ${i18n.language === 'ar' ? 'active' : ''}`}
                  onClick={() => i18n.changeLanguage('ar')}
                  style={{ 
                    fontSize: '12px', 
                    fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                    fontWeight: 'bold',
                    padding: '8px 24px',
                    color: i18n.language === 'ar' ? 'var(--main-color)' : 'var(--text-primary)',
                    backgroundColor: i18n.language === 'ar' ? 'rgba(0, 106, 255, 0.1)' : 'transparent',
                    border: 'none',
                    width: '100%',
                    textAlign: 'right',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--main-color)';
                    e.currentTarget.style.backgroundColor = 'rgba(0, 106, 255, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = i18n.language === 'ar' ? 'var(--main-color)' : 'var(--text-primary)';
                    e.currentTarget.style.backgroundColor = i18n.language === 'ar' ? 'rgba(0, 106, 255, 0.1)' : 'transparent';
                  }}
                >
                  <span style={{ fontSize: '12px', fontWeight: 'bold' }}>العربية</span>
                  <span style={{ fontSize: '14px' }}>🇸🇦</span>
                </button>
              </li>
              <li>
                <button
                  className={`dropdown-item ${i18n.language === 'en' ? 'active' : ''}`}
                  onClick={() => i18n.changeLanguage('en')}
                  style={{ 
                    fontSize: '12px', 
                    fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                    fontWeight: 'bold',
                    padding: '8px 24px',
                    color: i18n.language === 'en' ? 'var(--main-color)' : 'var(--text-primary)',
                    backgroundColor: i18n.language === 'en' ? 'rgba(0, 106, 255, 0.1)' : 'transparent',
                    border: 'none',
                    width: '100%',
                    textAlign: 'right',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--main-color)';
                    e.currentTarget.style.backgroundColor = 'rgba(0, 106, 255, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = i18n.language === 'en' ? 'var(--main-color)' : 'var(--text-primary)';
                    e.currentTarget.style.backgroundColor = i18n.language === 'en' ? 'rgba(0, 106, 255, 0.1)' : 'transparent';
                  }}
                >
                  <span style={{ fontSize: '12px', fontWeight: 'bold' }}>English</span>
                  <span style={{ fontSize: '14px' }}>🇺🇸</span>
                </button>
              </li>
            </ul>
          </li>

          {/* User Dropdown */}
          <li className="dropdown">
            <button
              className="dropdown-toggle user-btn border-0 text-sm"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              aria-label="User Menu"
            >
         
              <span className="mx-3 text-sm">{getDisplayName()}</span>{" "}
              <IoIosArrowDown />
            </button>
            <ul className="dropdown-menu dropdown-menu-end" style={{
              padding: '8px 0',
              marginTop: '5px',
              marginRight: '10px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--basic-color)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              minWidth: '140px'
            }}>
              <li>
                <Link
                  to="/profile"
                  className="dropdown-item"
                  style={{ 
                    fontSize: "12px",
                    padding: '8px 16px',
                    color: 'var(--text-primary)',
                    textDecoration: 'none',
                    display: 'block',
                    textAlign: 'right'
                  }}
                >
                  {t("topnav.profile")}
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="dropdown-item"
                  style={{ 
                    fontSize: "12px",
                    padding: '8px 16px',
                    color: 'var(--text-primary)',
                    textDecoration: 'none',
                    display: 'block',
                    textAlign: 'right'
                  }}
                  onClick={handleLogout}
                >
                  {t("topnav.logout")}
                </Link>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
