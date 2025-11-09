import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUser, FaClock, FaMoneyBillWave, FaCalendarAlt, FaCalendarCheck, FaCogs, FaChartBar, FaKey, FaCog, FaChevronDown, FaFileInvoice } from 'react-icons/fa';

const HrLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // قائمة HR
  const hrMenuItems = [
    {
      path: "/employees",
      icon: <FaUser />,
      text: "الموظفين",
      subItems: [
        { path: "/employees", text: "جميع الموظفين" },
        { path: "/employees/add", text: "إضافة موظف جديد" }
      ]
    },
    {
      path: "/attendance",
      icon: <FaClock />,
      text: "الحضور والانصراف"
    },
    {
      path: "/salaries",
      icon: <FaMoneyBillWave />,
      text: "المرتبات",
      subItems: [
        { path: "/salaries", text: "مرتبات الموظفين" },
        { path: "/salaries/add", text: "إضافة راتب جديد" }
      ]
    },
    {
      path: "/vacations",
      icon: <FaCalendarAlt />,
      text: "الإجازات",
      subItems: [
        { path: "/vacations", text: "الاجازات" },
        { path: "/vacations/add", text: "إضافة نوع اجازة جديد" }
      ]
    },
    {
      path: "/leave-requests",
      icon: <FaCalendarCheck />,
      text: "طلبات الإجازات",
      subItems: [
        { path: "/leave-requests", text: "طلبات الإجازات" },
        { path: "/leave-requests/add", text: "إضافة طلب إجازة جديد" }
      ]
    },
    {
      path: "/shifts",
      icon: <FaCogs />,
      text: "الورديات",
      subItems: [
        { path: "/shifts", text: "الدوريات" },
        { path: "/shifts/add", text: "إضافة دورية جديدة" }
      ]
    },
    {
      path: "/job-titles",
      icon: <FaUser />,
      text: "المسمى الوظيفي",
      subItems: [
        { path: "/job-titles", text: "المسمى الوظيفي" },
        { path: "/job-titles/add", text: "إضافة مسمى وظيفي جديد" }
      ]
    },
    {
      path: "/payslips",
      icon: <FaFileInvoice />,
      text: "كشف الرواتب"
    },
    {
      path: "/reports",
      icon: <FaChartBar />,
      text: "التقارير"
    },
    {
      path: "/permissions",
      icon: <FaKey />,
      text: "الصلاحيات"
    },
    {
      path: "/settings",
      icon: <FaCog />,
      text: "الإعدادات"
    }
  ];

  const isActive = (path) => {
    if (path === "/employees") {
      return location.pathname === "/employees" || location.pathname.startsWith("/employees");
    }
    return location.pathname.startsWith(path);
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/") return "لوحة تحكم HR";
    if (path.includes("/employees")) return "الموظفين";
    if (path.includes("/attendance")) return "الحضور والانصراف";
    if (path.includes("/salaries")) return "المرتبات";
    if (path.includes("/vacations")) return "الإجازات";
    if (path.includes("/leave-requests")) return "طلبات الإجازات";
    if (path.includes("/shifts")) return "الورديات";
    if (path.includes("/job-titles")) return "المسمى الوظيفي";
    if (path.includes("/payslips")) return "كشف الرواتب";
    if (path.includes("/reports")) return "التقارير";
    if (path.includes("/permissions")) return "الصلاحيات";
    if (path.includes("/settings")) return "الإعدادات";
    return "لوحة تحكم HR";
  };

  const getCurrentDate = () => {
    const now = new Date();
    const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    
    const dayName = days[now.getDay()];
    const day = now.getDate();
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    
    return `اليوم هو ${dayName}، ${day} ${month} ${year}م.`;
  };

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh', 
      backgroundColor: '#121828',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* السايدبار */}
      <div style={{
        width: isSidebarOpen ? '280px' : '0',
        backgroundColor: '#202938',
        transition: 'width 0.3s ease',
        overflow: 'hidden',
        borderLeft: '1px solid #333'
      }}>
        <div style={{ padding: '20px' }}>
          {/* عنوان السايدبار */}
          <h3 style={{ 
            color: 'white', 
            marginBottom: '30px',
            fontSize: '18px',
            fontWeight: 'bold'
          }}>
            لوحة تحكم HR
          </h3>

          {/* قائمة التنقل */}
          <nav>
            {hrMenuItems.map((item, index) => (
              <div key={index} style={{ marginBottom: '8px' }}>
                <div
                  onClick={() => {
                    if (item.subItems) {
                      // إذا كان لديه عناصر فرعية، افتح/أغلق
                      return;
                    }
                    navigate(item.path);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    backgroundColor: isActive(item.path) ? '#0CAD5D' : 'transparent',
                    color: 'white',
                    transition: 'background-color 0.2s ease',
                    marginBottom: '4px'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive(item.path)) {
                      e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive(item.path)) {
                      e.target.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <span style={{ marginLeft: '12px', fontSize: '16px' }}>
                    {item.icon}
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>
                    {item.text}
                  </span>
                  {item.subItems && (
                    <FaChevronDown style={{ 
                      marginRight: 'auto', 
                      fontSize: '12px',
                      transform: 'rotate(-90deg)'
                    }} />
                  )}
                </div>

                {/* العناصر الفرعية */}
                {item.subItems && isActive(item.path) && (
                  <div style={{ marginRight: '20px', marginTop: '4px' }}>
                    {item.subItems.map((subItem, subIndex) => (
                      <div
                        key={subIndex}
                        onClick={() => navigate(subItem.path)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '8px 16px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          backgroundColor: location.pathname === subItem.path ? 'rgba(172, 32, 0, 0.2)' : 'transparent',
                          color: 'white',
                          transition: 'background-color 0.2s ease',
                          marginBottom: '2px',
                          fontSize: '13px'
                        }}
                        onMouseEnter={(e) => {
                          if (location.pathname !== subItem.path) {
                            e.target.style.backgroundColor = 'rgba(255,255,255,0.05)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (location.pathname !== subItem.path) {
                            e.target.style.backgroundColor = 'transparent';
                          }
                        }}
                      >
                        {subItem.text}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        backgroundColor: '#121828'
      }}>
        {/* النافبار العلوي */}
        <div style={{
          backgroundColor: '#202938',
          padding: '20px 30px',
          borderBottom: '1px solid #333',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* معلومات المستخدم */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img 
              src="/user.webp" 
              alt="User" 
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                marginLeft: '15px'
              }}
            />
            <div>
              <div style={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>
                أحمد
              </div>
              <div style={{ color: '#ccc', fontSize: '14px' }}>
                HR Office
              </div>
            </div>
          </div>

          {/* رسالة الترحيب والتاريخ */}
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ color: 'white', fontSize: '18px', fontWeight: 'bold', marginBottom: '5px' }}>
              مرحبًا بك، أستاذ أحمد
            </div>
            <div style={{ color: '#ccc', fontSize: '14px' }}>
              {getCurrentDate()}
            </div>
          </div>

          {/* شعار الشركة */}
          <div style={{ textAlign: 'left' }}>
            <div style={{ 
              color: 'white', 
              fontSize: '24px', 
              fontWeight: 'bold',
              fontFamily: 'Arial, sans-serif'
            }}>
              ACE
            </div>
            <div style={{ 
              color: 'white', 
              fontSize: '14px',
              fontFamily: 'Arial, sans-serif'
            }}>
              ALBARQAWY
            </div>
          </div>
        </div>

        {/* المحتوى */}
        <div style={{ flex: 1, padding: '0' }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default HrLayout;
