import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaHome, FaShieldAlt, FaUsers, FaBook, FaGraduationCap, FaSchool, FaLanguage, FaBuilding, FaLayerGroup, FaDoorOpen, FaChartLine, FaUserGraduate, FaBox, FaChalkboardTeacher, FaLock, FaUserTie, FaClock, FaMoneyBillWave, FaCalendarAlt, FaCogs, FaChartBar, FaKey, FaCog, FaChevronDown, FaCalculator, FaCashRegister, FaWarehouse, FaTruck, FaPhone, FaCalendarCheck, FaHandHoldingUsd, FaGift, FaMinus, FaLightbulb, FaFileInvoice, FaClipboard, FaProjectDiagram, FaBookOpen, FaExchangeAlt, FaStore, FaLink, FaUniversity, FaBoxOpen } from "react-icons/fa";
import './SideNavMenu.css';

const SideNavMenu = ({ handleLinkClick }) => {
  const location = useLocation();
  const [isHrDropdownOpen, setIsHrDropdownOpen] = React.useState(false);
  const [isReportsDropdownOpen, setIsReportsDropdownOpen] = React.useState(false);
  
  // استخدام Redux store للحصول على بيانات المستخدم
  const user = useSelector((state) => state.auth.user);
  
  // fallback للبيانات من sessionStorage في حالة عدم وجود بيانات في Redux store
  const getUserData = () => {
    if (user) return user;
    
    const storedUser = sessionStorage.getItem("useralbaraqawy");
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch {
        return null;
      }
    }
    return null;
  };

  // تعريف القوائم
  const menuItems = [
    {
      path: "/",
      icon: <FaHome style={{ fontSize: "20px", color: "var(--main-color)" }} />,
      text: "الرئيسية"
    },
  ];

  const userData = getUserData();

  // دالة للتحكم في فتح وإغلاق dropdown HR
  const toggleHrDropdown = () => {
    const newValue = !isHrDropdownOpen;
    setIsHrDropdownOpen(newValue);
    // إغلاق dropdown التقارير عند فتح HR
    if (newValue) {
      setIsReportsDropdownOpen(false);
    }
  };

  // إغلاق الـ dropdown عند النقر خارجه
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      // التحقق من أن النقر ليس داخل dropdown menu أو على زر dropdown
      const clickedElement = event.target;
      const isInsideDropdownMenu = clickedElement.closest('.dropdown-menu');
      const isDropdownButton = clickedElement.closest('.dropdown-toggle');
      
      // إذا كان النقر داخل dropdown menu أو على زر dropdown، لا تغلق
      if (isInsideDropdownMenu || isDropdownButton) {
        return;
      }
      
      // إغلاق الـ dropdowns عند النقر خارجها
      if (isHrDropdownOpen) {
        setIsHrDropdownOpen(false);
      }
      if (isReportsDropdownOpen) {
        setIsReportsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isHrDropdownOpen, isReportsDropdownOpen]);

  // إغلاق الـ dropdowns عند تغيير الصفحة
  React.useEffect(() => {
    setIsHrDropdownOpen(false);
    setIsReportsDropdownOpen(false);
  }, [location.pathname]);

  // إذا لم يكن هناك مستخدم، اعرض القائمة الافتراضية
    if (!userData) {
    return (
      <ul className="mb-0 list-unstyled main-ul" style={{ gap: "0.5rem", marginTop: "20px" }}>
        {/* عرض عناصر القائمة من menuItems */}
        {menuItems.map((item, index) => (
          <li key={index} className={location.pathname === item.path ? 'active' : ''} style={{ marginBottom: "0.25rem", position: 'relative' }}>
            <div className="icon" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "25px", height: "25px" }}>
              {item.icon}
            </div>
            <Link to={item.path} onClick={handleLinkClick}>
              <span style={{ marginRight: "0.25rem" }}>{item.text}</span>
            </Link>
          </li>
        ))}

        {/* HR Dropdown */}
        <li className="dropdown hr-dropdown" style={{ marginBottom: "0.25rem", position: 'relative' }}>
          <div className="icon" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "25px", height: "25px" }}>
            <FaBuilding style={{ fontSize: "20px", color: "#6B8E5A" }} />
          </div>
          <button 
            className="btn dropdown-toggle" 
            type="button" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleHrDropdown();
            }}
            aria-expanded={isHrDropdownOpen}
            style={{
              background: "none",
              border: "none",
              color: "#182d40",
              borderRadius: "25px",
              width: "74%",
              marginInline: "4px",
              textAlign: "right",
              padding : "8px 0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer"
            }}
          >
            <span style={{ marginRight: "0.25rem", fontSize: "16px" }}>قسم HR</span>
          </button>
          {isHrDropdownOpen && (
            <ul className="dropdown-menu" style={{ 
              backgroundColor: "#FFFFFF",
              border: "1px solid #6B8E5A",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              minWidth: "200px",
              position: "absolute",
              top: "40px",
              zIndex: 1000,
              display: "block"
            }}>
            <li>
              <Link 
                className={`dropdown-item ${location.pathname === "/employees" ? 'active' : ''}`} 
                to="/employees" 
                onClick={() => {
                  handleLinkClick();
                  setIsHrDropdownOpen(false);
                }}
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  padding: "8px 16px",
                  color: "#182d40",
                  textDecoration: "none"
                }}
              >
                <FaUserTie style={{ fontSize: "16px", marginLeft: "8px" }} />
                الموظفين
              </Link>
            </li>
            <li>
              <Link 
                className={`dropdown-item ${location.pathname === "/attendance" ? 'active' : ''}`} 
                to="/attendance" 
                onClick={() => {
                  handleLinkClick();
                  setIsHrDropdownOpen(false);
                }}
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  padding: "8px 16px",
                  color: "#182d40",
                  textDecoration: "none"
                }}
              >
                <FaClock style={{ fontSize: "16px", marginLeft: "8px" }} />
                الحضور والانصراف
              </Link>
            </li>
            <li>
              <Link 
                className={`dropdown-item ${location.pathname === "/salaries" ? 'active' : ''}`} 
                to="/salaries" 
                onClick={() => {
                  handleLinkClick();
                  setIsHrDropdownOpen(false);
                }}
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  padding: "8px 16px",
                  color: "#182d40",
                  textDecoration: "none"
                }}
              >
                <FaMoneyBillWave style={{ fontSize: "16px", marginLeft: "8px" }} />
                المرتبات
              </Link>
            </li>
            <li>
              <Link 
                className={`dropdown-item ${location.pathname === "/vacations" ? 'active' : ''}`} 
                to="/vacations" 
                onClick={() => {
                  handleLinkClick();
                  setIsHrDropdownOpen(false);
                }}
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  padding: "8px 16px",
                  color: "#182d40",
                  textDecoration: "none"
                }}
              >
                <FaCalendarAlt style={{ fontSize: "16px", marginLeft: "8px" }} />
                الإجازات
              </Link>
            </li>
            <li>
              <Link 
                className={`dropdown-item ${location.pathname === "/leave-requests" ? 'active' : ''}`} 
                to="/leave-requests" 
                onClick={() => {
                  handleLinkClick();
                  setIsHrDropdownOpen(false);
                }}
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  padding: "8px 16px",
                  color: "#182d40",
                  textDecoration: "none"
                }}
              >
                <FaCalendarCheck style={{ fontSize: "16px", marginLeft: "8px" }} />
                طلبات الإجازات
              </Link>
            </li>
            <li>
              <Link 
                className={`dropdown-item ${location.pathname === "/shifts" ? 'active' : ''}`} 
                to="/shifts" 
                onClick={() => {
                  handleLinkClick();
                  setIsHrDropdownOpen(false);
                }}
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  padding: "8px 16px",
                  color: "#182d40",
                  textDecoration: "none"
                }}
              >
                <FaCogs style={{ fontSize: "16px", marginLeft: "8px" }} />
                الورديات
              </Link>
            </li>
            <li>
              <Link 
                className={`dropdown-item ${location.pathname === "/job-titles" ? 'active' : ''}`} 
                to="/job-titles" 
                onClick={() => {
                  handleLinkClick();
                  setIsHrDropdownOpen(false);
                }}
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  padding: "8px 16px",
                  color: "#182d40",
                  textDecoration: "none"
                }}
              >
                <FaUserTie style={{ fontSize: "16px", marginLeft: "8px" }} />
                المسمى الوظيفي
              </Link>
            </li>
          <li>
            <Link 
              className={`dropdown-item ${location.pathname === "/payslips" ? 'active' : ''}`} 
              to="/payslips" 
              onClick={() => {
                handleLinkClick();
                setIsHrDropdownOpen(false);
              }}
              style={{ 
                display: "flex", 
                alignItems: "center", 
                padding: "8px 16px",
                color: "#182d40",
                textDecoration: "none"
              }}
            >
              <FaFileInvoice style={{ fontSize: "16px", marginLeft: "8px" }} />
              كشف الرواتب
              </Link>
            </li>
          </ul>
          )}
        </li>
      </ul>
    );
  }


  // عرض جميع القوائم بدون تصفية
  const filteredMenuItems = menuItems;
  

  return (
    <ul className="mb-0  list-unstyled main-ul" style={{ gap: "0.5rem", marginTop: "10px" }}>
      {/* الرئيسية */}
      <li className={location.pathname === "/" ? 'active' : ''} style={{ marginBottom: "0.25rem", position: 'relative', zIndex: -1 }}>
        <div className="icon" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "25px", height: "25px" }}>
          <FaHome style={{ fontSize: "20px", color: "#182d40" }} />
        </div>
        <Link to="/" onClick={handleLinkClick}>
          <span style={{ marginRight: "0.25rem", color: "#182d40" }}>الرئيسية</span>
        </Link>
      </li>

      {/* HR Dropdown */}
      <li className="dropdown hr-dropdown" style={{ marginBottom: "0.25rem", position: 'relative', zIndex: 232323 }}>
        <div 
          className="icon" 
          style={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            width: "25px", 
            height: "25px" 
          }}
        >
            <FaBuilding 
              style={{ 
                fontSize: "20px", 
                color: "#182d40"
              }} 
            />
        </div>
        <button 
          className="btn dropdown-toggle" 
          type="button" 
          onClick={toggleHrDropdown}
          style={{
            background: "none",
            border: "none",
            color: "#182d40",
            borderRadius: "25px",
            width: "74%",
            marginInline: "4px",
            textAlign: "right",
            padding : "8px 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <span style={{ marginRight: "0.25rem", fontSize: "16px", color: "#182d40" }}>قسم HR</span>
        </button>
        {isHrDropdownOpen && (
          <ul className="dropdown-menu" style={{ 
            backgroundColor: "#FFFFFF",
            border: "1px solid #6B8E5A",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            minWidth: "200px",
            position: "absolute",
            top: "40px",
            zIndex: 1000,
            display: "block"
          }}>
          <li>
            <Link 
              className={`dropdown-item ${location.pathname === "/employees" ? 'active' : ''}`} 
              to="/employees" 
              onClick={() => {
                handleLinkClick();
                setIsHrDropdownOpen(false);
              }}
              style={{ 
                display: "flex", 
                alignItems: "center", 
                padding: "8px 16px",
                color: "#182d40",
                textDecoration: "none"
              }}
            >
              <FaUserTie style={{ fontSize: "16px", marginLeft: "8px" }} />
              الموظفين
            </Link>
          </li>
          <li>
            <Link 
              className={`dropdown-item ${location.pathname === "/attendance" ? 'active' : ''}`} 
              to="/attendance" 
              onClick={() => {
                handleLinkClick();
                setIsHrDropdownOpen(false);
              }}
              style={{ 
                display: "flex", 
                alignItems: "center", 
                padding: "8px 16px",
                color: "#182d40",
                textDecoration: "none"
              }}
            >
              <FaClock style={{ fontSize: "16px", marginLeft: "8px" }} />
              الحضور والانصراف
            </Link>
          </li>
          <li>
            <Link 
              className={`dropdown-item ${location.pathname === "/salaries" ? 'active' : ''}`} 
              to="/salaries" 
              onClick={() => {
                handleLinkClick();
                setIsHrDropdownOpen(false);
              }}
              style={{ 
                display: "flex", 
                alignItems: "center", 
                padding: "8px 16px",
                color: "#182d40",
                textDecoration: "none"
              }}
            >
              <FaMoneyBillWave style={{ fontSize: "16px", marginLeft: "8px" }} />
              المرتبات
            </Link>
          </li>
          <li>
            <Link 
              className={`dropdown-item ${location.pathname === "/vacations" ? 'active' : ''}`} 
              to="/vacations" 
              onClick={() => {
                handleLinkClick();
                setIsHrDropdownOpen(false);
              }}
              style={{ 
                display: "flex", 
                alignItems: "center", 
                padding: "8px 16px",
                color: "#182d40",
                textDecoration: "none"
              }}
            >
              <FaCalendarAlt style={{ fontSize: "16px", marginLeft: "8px" }} />
              الإجازات
            </Link>
          </li>
          <li>
            <Link 
              className={`dropdown-item ${location.pathname === "/leave-requests" ? 'active' : ''}`} 
              to="/leave-requests" 
              onClick={() => {
                handleLinkClick();
                setIsHrDropdownOpen(false);
              }}
              style={{ 
                display: "flex", 
                alignItems: "center", 
                padding: "8px 16px",
                color: "#182d40",
                textDecoration: "none"
              }}
            >
              <FaCalendarCheck style={{ fontSize: "16px", marginLeft: "8px" }} />
              طلبات الإجازات
            </Link>
          </li>
          <li>
            <Link 
              className={`dropdown-item ${location.pathname === "/shifts" ? 'active' : ''}`} 
              to="/shifts" 
              onClick={() => {
                handleLinkClick();
                setIsHrDropdownOpen(false);
              }}
              style={{ 
                display: "flex", 
                alignItems: "center", 
                padding: "8px 16px",
                color: "#182d40",
                textDecoration: "none"
              }}
            >
              <FaCogs style={{ fontSize: "16px", marginLeft: "8px" }} />
              الورديات
            </Link>
          </li>
          <li>
            <Link 
              className={`dropdown-item ${location.pathname === "/job-titles" ? 'active' : ''}`} 
              to="/job-titles" 
              onClick={() => {
                handleLinkClick();
                setIsHrDropdownOpen(false);
              }}
              style={{ 
                display: "flex", 
                alignItems: "center", 
                padding: "8px 16px",
                color: "#182d40",
                textDecoration: "none"
              }}
            >
              <FaUserTie style={{ fontSize: "16px", marginLeft: "8px" }} />
              المسمى الوظيفي
            </Link>
          </li>
          <li>
            <Link 
              className={`dropdown-item ${location.pathname === "/payslips" ? 'active' : ''}`} 
              to="/payslips" 
              onClick={() => {
                handleLinkClick();
                setIsHrDropdownOpen(false);
              }}
              style={{ 
                display: "flex", 
                alignItems: "center", 
                padding: "8px 16px",
                color: "#182d40",
                textDecoration: "none"
              }}
            >
              <FaFileInvoice style={{ fontSize: "16px", marginLeft: "8px" }} />
              كشف الرواتب
            </Link>
          </li>
          <li>
            <Link 
              className={`dropdown-item ${location.pathname === "/departments" ? 'active' : ''}`} 
              to="/departments" 
              onClick={() => {
                handleLinkClick();
                setIsHrDropdownOpen(false);
              }}
              style={{ 
                display: "flex", 
                alignItems: "center", 
                padding: "8px 16px",
                color: "#182d40",
                textDecoration: "none"
              }}
            >
              <FaLayerGroup style={{ fontSize: "16px", marginLeft: "8px" }} />
              الأقسام
            </Link>
          </li>
        </ul>
        )}
      </li>

      {/* التقارير Dropdown */}
      <li className={`dropdown ${location.pathname.startsWith('/reports') ? 'active' : ''}`} style={{ marginBottom: "0.25rem", position: 'relative', display: 'flex', zIndex: -1 }}>
        <div className="icon" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "25px", height: "25px" }}>
          <FaChartBar style={{ fontSize: "20px", color: "#182d40" }} />
        </div>
        <button
          className="btn dropdown-toggle"
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            const newValue = !isReportsDropdownOpen;
            setIsReportsDropdownOpen(newValue);
            // إغلاق dropdown HR عند فتح التقارير
            if (newValue) {
              setIsHrDropdownOpen(false);
            }
          }}
          style={{
            background: "none",
            border: "none",
            color: "#182d40",
            borderRadius: "25px",
            width: "74%",
            marginInline: "4px",
            textAlign: "right",
            padding: "8px 0",
            display: "flex",
            alignItems: "center",
            cursor: "pointer"
          }}
        >
          <span style={{ marginRight: "0.25rem", fontSize: "16px", color: "#182d40" }}>التقارير</span>
        
        </button>
        {isReportsDropdownOpen && (
          <ul className="dropdown-menu" style={{ 
            backgroundColor: "#FFFFFF",
            border: "1px solid #6B8E5A",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            minWidth: "200px",
            position: "absolute",
            top: "40px",
            right: "0",
            zIndex: 1000,
            display: "block",
            marginTop: "5px"
          }}>
            <li>
              <Link 
                className={`dropdown-item ${location.pathname === "/reports/leave" ? 'active' : ''}`} 
                to="/reports/leave" 
                onClick={handleLinkClick}
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  padding: "8px 16px",
                  color: "#182d40",
                  textDecoration: "none"
                }}
              >
                <FaCalendarAlt style={{ fontSize: "16px", marginLeft: "8px" }} />
                طلبات الإجازة
              </Link>
            </li>
            <li>
              <Link 
                className={`dropdown-item ${location.pathname === "/reports/attendance" ? 'active' : ''}`} 
                to="/reports/attendance" 
                onClick={handleLinkClick}
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  padding: "8px 16px",
                  color: "#182d40",
                  textDecoration: "none"
                }}
              >
                <FaClipboard style={{ fontSize: "16px", marginLeft: "8px" }} />
                الحضور والانصراف
              </Link>
            </li>
            <li>
              <Link 
                className={`dropdown-item ${location.pathname === "/reports/payroll" ? 'active' : ''}`} 
                to="/reports/payroll" 
                onClick={handleLinkClick}
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  padding: "8px 16px",
                  color: "#182d40",
                  textDecoration: "none"
                }}
              >
                <FaFileInvoice style={{ fontSize: "16px", marginLeft: "8px" }} />
                كشف الراتب
            </Link>
          </li>
        </ul>
        )}
      </li>

      {/* الشجرة المحاسبية */}
      <li className={location.pathname === "/accounts/tree" ? 'active' : ''} style={{ marginBottom: "0.25rem", position: 'relative', display: 'flex', zIndex: -1 }}>
        <div className="icon" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "25px", height: "25px" }}>
          <FaProjectDiagram style={{ fontSize: "20px", color: "#182d40" }} />
        </div>
        <Link to="/accounts/tree" onClick={handleLinkClick}>
          <span style={{ marginRight: "0.25rem", color: "#182d40" }}>الشجرة المحاسبية</span>
        </Link>
      </li>
      <li className={location.pathname.startsWith("/journal-entries") ? 'active' : ''} style={{ marginBottom: "0.25rem", position: 'relative', display: 'flex', zIndex: -1 }}>
        <div className="icon" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "25px", height: "25px" }}>
          <FaBookOpen style={{ fontSize: "20px", color: "#182d40" }} />
        </div>
        <Link to="/journal-entries" onClick={handleLinkClick}>
          <span style={{ marginRight: "0.25rem", color: "#182d40" }}>القيود اليومية</span>
        </Link>
      </li>

      {/* مراكز التكلفة */}
      <li className={location.pathname.startsWith('/cost-centers') ? 'active' : ''} style={{ marginBottom: "0.25rem", position: 'relative', display: 'flex', zIndex: -1 }}>
        <div className="icon" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "25px", height: "25px" }}>
          <FaLayerGroup style={{ fontSize: "20px", color: "#182d40" }} />
        </div>
        <Link to="/cost-centers/tree" onClick={handleLinkClick}>
          <span style={{ marginRight: "0.25rem", color: "#182d40" }}>مراكز التكلفة</span>
        </Link>
      </li>

      {/* العملات */}
      <li className={location.pathname.startsWith('/currencies') ? 'active' : ''} style={{ marginBottom: "0.25rem", position: 'relative', display: 'flex', zIndex: -1 }}>
        <div className="icon" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "25px", height: "25px" }}>
          <FaMoneyBillWave style={{ fontSize: "20px", color: "#182d40" }} />
        </div>
        <Link to="/currencies" onClick={handleLinkClick}>
          <span style={{ marginRight: "0.25rem", color: "#182d40" }}>العملات</span>
        </Link>
      </li>

      {/* أسعار الصرف */}
      <li className={location.pathname.startsWith('/exchange-rates') ? 'active' : ''} style={{ marginBottom: "0.25rem", position: 'relative', display: 'flex', zIndex: -1 }}>
        <div className="icon" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "25px", height: "25px" }}>
          <FaExchangeAlt style={{ fontSize: "20px", color: "#182d40" }} />
        </div>
        <Link to="/exchange-rates" onClick={handleLinkClick}>
          <span style={{ marginRight: "0.25rem", color: "#182d40" }}>أسعار الصرف</span>
        </Link>
      </li>

      {/* الموردون */}
      <li className={location.pathname.startsWith('/vendors') ? 'active' : ''} style={{ marginBottom: "0.25rem", position: 'relative', display: 'flex', zIndex: -1 }}>
        <div className="icon" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "25px", height: "25px" }}>
          <FaStore style={{ fontSize: "20px", color: "#182d40" }} />
        </div>
        <Link to="/vendors" onClick={handleLinkClick}>
          <span style={{ marginRight: "0.25rem", color: "#182d40" }}>الموردون</span>
        </Link>
      </li>

      {/* العملاء */}
      <li className={location.pathname.startsWith('/customers') ? 'active' : ''} style={{ marginBottom: "0.25rem", position: 'relative', display: 'flex', zIndex: -1 }}>
        <div className="icon" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "25px", height: "25px" }}>
          <FaUsers style={{ fontSize: "20px", color: "#182d40" }} />
        </div>
        <Link to="/customers" onClick={handleLinkClick}>
          <span style={{ marginRight: "0.25rem", color: "#182d40" }}>العملاء</span>
        </Link>
      </li>

      {/* البنوك */}
      <li className={location.pathname.startsWith('/banks') ? 'active' : ''} style={{ marginBottom: "0.25rem", position: 'relative', display: 'flex', zIndex: -1 }}>
        <div className="icon" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "25px", height: "25px" }}>
          <FaUniversity style={{ fontSize: "20px", color: "#182d40" }} />
        </div>
        <Link to="/banks" onClick={handleLinkClick}>
          <span style={{ marginRight: "0.25rem", color: "#182d40" }}>البنوك</span>
        </Link>
      </li>

      {/* الخزائن */}
      <li className={location.pathname.startsWith('/safes') ? 'active' : ''} style={{ marginBottom: "0.25rem", position: 'relative', display: 'flex', zIndex: -1 }}>
        <div className="icon" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "25px", height: "25px" }}>
          <FaBoxOpen style={{ fontSize: "20px", color: "#182d40" }} />
        </div>
        <Link to="/safes" onClick={handleLinkClick}>
          <span style={{ marginRight: "0.25rem", color: "#182d40" }}>الخزائن</span>
        </Link>
      </li>

      {/* ربط الحسابات */}
      <li className={location.pathname.startsWith('/account-links') ? 'active' : ''} style={{ marginBottom: "0.25rem", position: 'relative', display: 'flex', zIndex: -1 }}>
        <div className="icon" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "25px", height: "25px" }}>
          <FaLink style={{ fontSize: "20px", color: "#182d40" }} />
        </div>
        <Link to="/account-links" onClick={handleLinkClick}>
          <span style={{ marginRight: "0.25rem", color: "#182d40" }}>ربط الحسابات</span>
        </Link>
      </li>
    </ul>
  );
};

export default SideNavMenu;
