import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getWorkShiftDetails, clearError, clearSuccess } from '../../../../redux/Slices/authSlice';
import { toast } from 'react-toastify';
import { FaArrowRight, FaEdit, FaTrash } from 'react-icons/fa';

const ShiftDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { workShiftDetails, isLoading, error, success } = useSelector((state) => state.auth);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const daysOfWeek = [
    { key: 'saturday', label: 'السبت' },
    { key: 'sunday', label: 'الأحد' },
    { key: 'monday', label: 'الاثنين' },
    { key: 'tuesday', label: 'الثلاثاء' },
    { key: 'wednesday', label: 'الأربعاء' },
    { key: 'thursday', label: 'الخميس' },
    { key: 'friday', label: 'الجمعة' }
  ];

  useEffect(() => {
    if (id) {
      dispatch(getWorkShiftDetails(id));
    }
  }, [dispatch, id]);

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
    navigate(`/shifts/edit/${id}`);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    // Implement delete functionality
    setShowDeleteModal(false);
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
        alignItems: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid var(--gray-color)',
            borderTop: '4px solid var(--main-color)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }} />
          <p style={{ 
            fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
            fontWeight: 'bold'
          }}>جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!workShiftDetails) {
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
          <p style={{ 
            fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
            fontWeight: 'bold'
          }}>لا توجد بيانات</p>
          <button
            onClick={() => navigate('/shifts')}
            style={{
              backgroundColor: 'var(--main-color)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              marginTop: '20px',
              fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
            }}
          >
            العودة للقائمة
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
      color: '#182d40'
    }}>
      <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          marginBottom: '20px',
          color: '#182d40',
          margin: 0,
          fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
        }}>
          تفاصيل الوردية
        </h1>
        <button
          onClick={() => navigate('/shifts')}
          style={{
            backgroundColor: 'var(--gray-color)',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
          }}
        >
          <FaArrowRight style={{ color: 'white' }} />
          العودة للقائمة
        </button>
      </div>

      <div style={{
        backgroundColor: 'var(--basic-color)',
        borderRadius: '12px',
        padding: '30px',
        border: '1px solid var(--border-color)',
        marginBottom: '30px'
      }}>
        {/* معلومات الوردية */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{
            color: '#182d40',
            marginBottom: '20px',
            fontSize: '18px',
            fontWeight: 'bold',
            fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
          }}>
            معلومات الوردية
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#182d40',
                fontSize: '14px',
                fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                fontWeight: 'bold',
                opacity: 0.8
              }}>
                اسم الوردية (عربي)
              </label>
              <p style={{
                color: '#182d40',
                fontSize: '16px',
                fontWeight: 'bold',
                margin: 0,
                fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
              }}>
                {workShiftDetails.name_ar || workShiftDetails.name}
              </p>
            </div>
            
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#182d40',
                fontSize: '14px',
                fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                fontWeight: 'bold',
                opacity: 0.8
              }}>
                اسم الوردية (إنجليزي)
              </label>
              <p style={{
                color: '#182d40',
                fontSize: '16px',
                fontWeight: 'bold',
                margin: 0,
                fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
              }}>
                {workShiftDetails.name_en || workShiftDetails.name}
              </p>
            </div>
            
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#182d40',
                fontSize: '14px',
                fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                fontWeight: 'bold',
                opacity: 0.8
              }}>
                عدد أيام العمل
              </label>
              <p style={{
                color: '#182d40',
                fontSize: '16px',
                fontWeight: 'bold',
                margin: 0,
                fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
              }}>
                {workShiftDetails.work_days_count ? `${workShiftDetails.work_days_count} أيام` : '--'}
              </p>
            </div>
            
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#182d40',
                fontSize: '14px',
                fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                fontWeight: 'bold',
                opacity: 0.8
              }}>
                الحالة
              </label>
              <span style={{
                backgroundColor: workShiftDetails.is_active ? 'var(--main-color)' : 'var(--red-color)',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 'bold',
                fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
              }}>
                {workShiftDetails.is_active ? 'نشط' : 'غير نشط'}
              </span>
            </div>
          </div>
        </div>

        {/* تفاصيل الأيام */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{
            color: '#182d40',
            marginBottom: '20px',
            fontSize: '18px',
            fontWeight: 'bold',
            fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
          }}>
            تفاصيل الأيام
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {workShiftDetails.details && workShiftDetails.details.map((day, index) => (
              <div key={day.day_of_week} style={{
                backgroundColor: 'var(--basic-color)',
                padding: '20px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '15px'
                }}>
                  <h4 style={{
                    color: '#182d40',
                    margin: 0,
                    fontSize: '16px',
                    fontWeight: 'bold',
                    fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                  }}>
                    {daysOfWeek.find(d => d.key === day.day_of_week)?.label}
                  </h4>
                  
                  <span style={{
                    backgroundColor: day.is_off_day ? 'var(--red-color)' : 'var(--main-color)',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                  }}>
                    {day.is_off_day ? 'يوم إجازة' : 'يوم عمل'}
                  </span>
                </div>

                {!day.is_off_day && (
                  <div style={{
                    display: 'flex',
                    gap: '15px',
                    alignItems: 'center'
                  }}>
                    <div style={{ flex: 1 }}>
                      <label style={{
                        display: 'block',
                        marginBottom: '5px',
                        color: '#182d40',
                        fontSize: '14px',
                        fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                        fontWeight: 'bold',
                        opacity: 0.8
                      }}>
                        وقت البداية
                      </label>
                      <p style={{
                        color: '#182d40',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        margin: 0,
                        fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                      }}>
                        {day.start_time || '--'}
                      </p>
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <label style={{
                        display: 'block',
                        marginBottom: '5px',
                        color: '#182d40',
                        fontSize: '14px',
                        fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                        fontWeight: 'bold',
                        opacity: 0.8
                      }}>
                        وقت النهاية
                      </label>
                      <p style={{
                        color: '#182d40',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        margin: 0,
                        fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                      }}>
                        {day.end_time || '--'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* أزرار التحكم */}
        <div style={{
          display: 'flex',
          gap: '15px',
          justifyContent: 'center',
          marginTop: '30px'
        }}>
          <button
            onClick={handleEdit}
            style={{
            backgroundColor: 'var(--gray-color)',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
          }}
        >
            <FaEdit style={{ color: 'white' }} />
            تعديل
          </button>
          
          <button
            onClick={handleDelete}
            style={{
              backgroundColor: 'var(--red-color)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
            }}
          >
            <FaTrash style={{ color: 'white' }} />
            حذف
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'var(--basic-color)',
            borderRadius: '12px',
            padding: '30px',
            maxWidth: '400px',
            width: '90%',
            border: '1px solid var(--border-color)'
          }}>
            <h3 style={{
              color: '#182d40',
              marginBottom: '20px',
              fontSize: '18px',
              fontWeight: 'bold',
              textAlign: 'center',
              fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
            }}>
              تأكيد الحذف
            </h3>
            <p style={{
              color: '#182d40',
              marginBottom: '10px',
              textAlign: 'center',
              fontSize: '16px',
              fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
              fontWeight: 'bold'
            }}>
              هل أنت متأكد من حذف الوردية "{workShiftDetails.name_ar || workShiftDetails.name}"؟
            </p>
            <p style={{
              color: '#182d40',
              marginBottom: '30px',
              textAlign: 'center',
              fontSize: '14px',
              fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
              fontWeight: 'bold',
              opacity: 0.8
            }}>
              هذا الإجراء لا يمكن التراجع عنه.
            </p>
            <div style={{
              display: 'flex',
              gap: '15px',
              justifyContent: 'center'
            }}>
              <button
                onClick={() => setShowDeleteModal(false)}
                style={{
                  backgroundColor: 'var(--gray-color)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                }}
              >
                إلغاء
              </button>
              <button
                onClick={confirmDelete}
                style={{
                  backgroundColor: 'var(--red-color)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                }}
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShiftDetails;
