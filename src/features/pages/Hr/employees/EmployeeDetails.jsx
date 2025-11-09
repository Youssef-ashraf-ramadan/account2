import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getEmployeeDetails, clearError, clearSuccess } from '../../../../redux/Slices/authSlice';
import { FaArrowLeft, FaEdit, FaTrash, FaUser, FaCalendarAlt, FaEnvelope, FaPhone, FaBuilding, FaBriefcase, FaClock, FaImage, FaIdCard } from 'react-icons/fa';
import { toast } from 'react-toastify';

const EmployeeDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { employeeDetails, isLoading, error, success } = useSelector((state) => state.auth);

  useEffect(() => {
    if (id) {
      dispatch(getEmployeeDetails(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (success) {
      toast.success(success, { rtl: true });
      dispatch(clearSuccess());
    }
    if (error) {
      toast.error(error, { rtl: true });
      dispatch(clearError());
    }
  }, [success, error, dispatch]);

  const handleEdit = () => {
    navigate(`/edit-employee/${id}`);
  };

  const handleDelete = () => {
    navigate(`/employees`);
  };

  const handleBack = () => {
    navigate('/employees');
  };

  if (isLoading) {
    return (
      <div style={{ 
        padding: '30px',
        backgroundColor: 'var(--dashboard-bg)',
        minHeight: 'calc(100vh - 80px)',
        color: '#182d40',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
        fontWeight: 'bold'
      }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!employeeDetails) {
    return (
      <div style={{ 
        padding: '30px',
        backgroundColor: 'var(--dashboard-bg)',
        minHeight: 'calc(100vh - 80px)',
        color: '#182d40',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <i className="fas fa-exclamation-triangle" style={{ fontSize: '3rem', color: 'var(--chart-color-2)', marginBottom: '20px' }}></i>
          <h5 style={{ color: '#182d40', marginBottom: '10px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>لم يتم العثور على الموظف</h5>
          <p style={{ color: '#182d40', marginBottom: '20px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold', opacity: 0.7 }}>قد يكون الموظف غير موجود أو تم حذفه</p>
          <button
            onClick={handleBack}
            style={{
              backgroundColor: 'var(--main-color)',
              color: 'white',
              border: 'none',
              padding: '12px 25px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              margin: '0 auto',
              fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
              fontWeight: 'bold'
            }}
          >
            <FaArrowLeft style={{ color: 'white' }} />
            العودة للموظفين
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '30px',
      backgroundColor: 'var(--dashboard-bg)',
      minHeight: 'calc(100vh - 80px)',
      color: 'var(--text-primary)'
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{
          backgroundColor: 'var(--basic-color)',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{
            padding: '20px',
            borderBottom: '1px solid var(--border-color)',
            backgroundColor: 'var(--basic-color)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h1 style={{ 
                margin: 0, 
                fontSize: '24px', 
                fontWeight: 'bold',
                color: '#182d40',
                fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
              }}>
                تفاصيل الموظف
              </h1>
              <button
                onClick={handleBack}
                style={{
                  backgroundColor: 'var(--gray-color)',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                }}
              >
                <FaArrowLeft style={{ color: 'white' }} />
                رجوع
              </button>
            </div>
          </div>

          <div style={{ padding: '30px' }}>
            {/* صورة الموظف والمعلومات الأساسية */}
            <div style={{ marginBottom: '30px' }}>
              <div style={{
                backgroundColor: 'var(--basic-color)',
                borderRadius: '8px',
                padding: '20px',
                border: '1px solid var(--border-color)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                  <FaUser style={{ fontSize: '1.2rem', color: '#182d40', marginLeft: '10px' }} />
                  <h3 style={{ margin: 0, color: '#182d40', fontSize: '18px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>المعلومات الشخصية</h3>
                </div>
                
                <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
                  {/* صورة الموظف */}
                  <div style={{ textAlign: 'center' }}>
                    {employeeDetails.images && employeeDetails.images.length > 0 ? (
                      <img 
                        src={employeeDetails.images[0].url} 
                        alt="صورة الموظف"
                        style={{
                          width: '120px',
                          height: '120px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '3px solid var(--main-color)'
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        backgroundColor: '#333',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '3px solid #AC2000'
                      }}>
                        <FaImage style={{ fontSize: '2rem', color: '#666' }} />
                      </div>
                    )}
                  </div>

                  {/* المعلومات الأساسية */}
                  <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <label style={{ 
                        display: 'block',
                        marginBottom: '5px',
                        color: '#182d40',
                        fontSize: '14px',
                        opacity: 0.7,
                        fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                        fontWeight: 'bold'
                      }}>
                        اسم الموظف
                      </label>
                      <p style={{ 
                        margin: 0, 
                        color: '#182d40', 
                        fontSize: '18px', 
                        fontWeight: 'bold',
                        fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                      }}>
                        {employeeDetails.name}
                      </p>
                    </div>
                    
                    <div>
                      <label style={{ 
                        display: 'block',
                        marginBottom: '5px',
                        color: '#182d40',
                        fontSize: '14px',
                        opacity: 0.7,
                        fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                        fontWeight: 'bold'
                      }}>
                        كود الموظف
                      </label>
                      <p style={{ 
                        margin: 0, 
                        color: '#182d40', 
                        fontSize: '16px',
                        fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <FaIdCard />
                        {employeeDetails.employee_code}
                      </p>
                    </div>

                    <div>
                      <label style={{ 
                        display: 'block',
                        marginBottom: '5px',
                        color: '#6c757d',
                        fontSize: '14px'
                      }}>
                        البريد الإلكتروني
                      </label>
                      <p style={{ 
                        margin: 0, 
                        color: '#182d40', 
                        fontSize: '14px',
                        fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <FaEnvelope style={{ color: '#182d40' }} />
                        {employeeDetails.email}
                      </p>
                    </div>

                    <div>
                      <label style={{ 
                        display: 'block',
                        marginBottom: '5px',
                        color: '#6c757d',
                        fontSize: '14px'
                      }}>
                        رقم الهاتف
                      </label>
                      <p style={{ 
                        margin: 0, 
                        color: '#182d40', 
                        fontSize: '14px',
                        fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <FaPhone style={{ color: '#182d40' }} />
                        {employeeDetails.phone}
                      </p>
                    </div>

                    <div>
                      <label style={{ 
                        display: 'block',
                        marginBottom: '5px',
                        color: '#6c757d',
                        fontSize: '14px'
                      }}>
                        تاريخ الميلاد
                      </label>
                      <p style={{ 
                        margin: 0, 
                        color: '#182d40', 
                        fontSize: '14px',
                        fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <FaCalendarAlt style={{ color: '#182d40' }} />
                        {new Date(employeeDetails.birth_date).toLocaleDateString('ar-EG', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>

                    <div>
                      <label style={{ 
                        display: 'block',
                        marginBottom: '5px',
                        color: '#6c757d',
                        fontSize: '14px'
                      }}>
                        الجنس
                      </label>
                      <p style={{ 
                        margin: 0, 
                        color: 'var(--text-primary)', 
                        fontSize: '14px'
                      }}>
                        {employeeDetails.gender === 'male' ? 'ذكر' : 'أنثى'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* المعلومات الوظيفية */}
            <div style={{ marginBottom: '30px' }}>
              <div style={{
                backgroundColor: 'var(--basic-color)',
                borderRadius: '8px',
                padding: '20px',
                border: '1px solid var(--border-color)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                  <FaBriefcase style={{ fontSize: '1.2rem', color: '#182d40', marginLeft: '10px' }} />
                  <h3 style={{ margin: 0, color: '#182d40', fontSize: '18px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>المعلومات الوظيفية</h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ 
                      display: 'block',
                      marginBottom: '5px',
                      color: '#182d40',
                      fontSize: '14px',
                      opacity: 0.7,
                      fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                      fontWeight: 'bold'
                    }}>
                      القسم
                    </label>
                    <p style={{ 
                      margin: 0, 
                      color: '#182d40', 
                      fontSize: '16px', 
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                    }}>
                      <FaBuilding style={{ color: '#182d40' }} />
                      {employeeDetails.department}
                    </p>
                  </div>
                  <div>
                    <label style={{ 
                      display: 'block',
                      marginBottom: '5px',
                      color: '#182d40',
                      fontSize: '14px',
                      opacity: 0.7,
                      fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                      fontWeight: 'bold'
                    }}>
                      المسمى الوظيفي
                    </label>
                    <p style={{ 
                      margin: 0, 
                      color: '#182d40', 
                      fontSize: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                    }}>
                      <FaBriefcase style={{ color: '#182d40' }} />
                      {employeeDetails.position}
                    </p>
                  </div>
                  <div>
                    <label style={{ 
                      display: 'block',
                      marginBottom: '5px',
                      color: '#182d40',
                      fontSize: '14px',
                      opacity: 0.7,
                      fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                      fontWeight: 'bold'
                    }}>
                      الوردية
                    </label>
                    <p style={{ 
                      margin: 0, 
                      color: '#182d40', 
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                    }}>
                      <FaClock style={{ color: '#182d40' }} />
                      {employeeDetails.work_shift ? employeeDetails.work_shift.name : 'غير محدد'}
                    </p>
                  </div>
                  <div>
                    <label style={{ 
                      display: 'block',
                      marginBottom: '5px',
                      color: '#182d40',
                      fontSize: '14px',
                      opacity: 0.7,
                      fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                      fontWeight: 'bold'
                    }}>
                      الحالة
                    </label>
                    <p style={{ 
                      margin: 0, 
                      color: '#182d40', 
                      fontSize: '14px',
                      fontWeight: 'bold',
                      fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                    }}>
                      {employeeDetails.is_active ? 'نشط' : 'غير نشط'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* تاريخ الإنشاء */}
            <div style={{ marginBottom: '30px' }}>
              <div style={{
                backgroundColor: 'var(--basic-color)',
                borderRadius: '8px',
                padding: '20px',
                border: '1px solid var(--border-color)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                  <FaCalendarAlt style={{ fontSize: '1.2rem', color: '#182d40', marginLeft: '10px' }} />
                  <h3 style={{ margin: 0, color: '#182d40', fontSize: '18px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>معلومات إضافية</h3>
                </div>
                <div>
                  <label style={{ 
                    display: 'block',
                    marginBottom: '5px',
                    color: '#182d40',
                    fontSize: '14px',
                    opacity: 0.7,
                    fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                    fontWeight: 'bold'
                  }}>
                    تاريخ الإنشاء
                  </label>
                  <p style={{ 
                    margin: 0, 
                    color: '#182d40', 
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                  }}>
                    <FaCalendarAlt style={{ color: '#182d40' }} />
                    {new Date(employeeDetails.created_at).toLocaleDateString('ar-EG', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* الإجراءات */}
            <div>
              <div style={{
                backgroundColor: 'var(--basic-color)',
                borderRadius: '8px',
                padding: '20px',
                border: '1px solid var(--border-color)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                  <h3 style={{ margin: 0, color: '#182d40', fontSize: '18px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>الإجراءات</h3>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <button
                    onClick={handleEdit}
                    style={{
                      backgroundColor: 'var(--gray-color)',
                      color: 'white',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <FaEdit style={{ color: 'white' }} />
                    تعديل الموظف
                  </button>
                  <button
                    onClick={handleDelete}
                    style={{
                      backgroundColor: 'var(--red-color)',
                      color: 'white',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                    }}
                  >
                    <FaTrash style={{ color: 'white' }} />
                    حذف الموظف
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;
