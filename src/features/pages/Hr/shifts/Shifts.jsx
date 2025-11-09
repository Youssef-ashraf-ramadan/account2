import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getWorkShifts, deleteWorkShift, clearError, clearSuccess } from '../../../../redux/Slices/authSlice';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Shifts = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { workShifts, isLoading, error, success } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [shiftToDelete, setShiftToDelete] = useState(null);

  // Fetch work shifts on component mount
  useEffect(() => {
    dispatch(getWorkShifts());
  }, [dispatch]);

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

  // Filter work shifts based on search term
  const filteredData = workShifts?.filter(shift => 
    shift.name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getStatusColor = (status) => {
    return status === 'نشط' ? '#AC2000' : '#dc3545';
  };

  const handleAdd = () => {
    navigate('/shifts/add');
  };

  const handleEdit = (id) => {
    navigate(`/shifts/edit/${id}`);
  };

  const handleView = (id) => {
    navigate(`/shifts/details/${id}`);
  };

  const handleDelete = (shift) => {
    setShiftToDelete(shift);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (shiftToDelete) {
      await dispatch(deleteWorkShift(shiftToDelete.id));
      setShowDeleteModal(false);
      setShiftToDelete(null);
    }
  };

  return (
    <div style={{ 
      padding: '30px',
      backgroundColor: 'var(--dashboard-bg)',
      minHeight: 'calc(100vh - 80px)',
      color: '#182d40'
    }}>
      {/* العنوان والبحث */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          marginBottom: '20px',
          color: '#182d40',
          fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
        }}>
          الورديات
        </h1>

        {/* شريط البحث والتاريخ */}
        <div style={{ 
          display: 'flex', 
          gap: '20px', 
          alignItems: 'center',
          marginBottom: '20px',
          flexWrap: 'wrap'
        }}>
          <div style={{ position: 'relative', flex: '1', minWidth: '300px' }}>
            <FaSearch style={{
              position: 'absolute',
              right: '15px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#182d40',
              fontSize: '16px'
            }} />
            <input
              type="text"
              placeholder="بحث سريع عن نوع الاجازة"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 45px 12px 15px',
                backgroundColor: 'var(--basic-color)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                color: '#182d40',
                fontSize: '14px',
                fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
              }}
            />
          </div>


          <button
            onClick={handleAdd}
            style={{
              backgroundColor: 'var(--main-color)',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
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
            <FaPlus style={{ color: 'white' }} />
            إضافة وردية
          </button>
        </div>
      </div>

      {/* جدول الورديات */}
      <div style={{
        backgroundColor: 'var(--basic-color)',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid var(--border-color)'
      }}>
      

        <div style={{ overflowX: 'auto' }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse',
            minWidth: '800px'
          }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--main-color)' }}>
                <th style={{ 
                  padding: '15px', 
                  textAlign: 'center', 
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  borderBottom: '1px solid var(--border-color)',
                  backgroundColor: 'var(--main-color)',
                  fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                }}>
                  اسم الوردية
                </th>
                <th style={{ 
                  padding: '15px', 
                  textAlign: 'center', 
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  borderBottom: '1px solid var(--border-color)',
                  backgroundColor: 'var(--main-color)',
                  fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                }}>
                  عدد أيام العمل
                </th>
                <th style={{ 
                  padding: '15px', 
                  textAlign: 'center', 
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  borderBottom: '1px solid var(--border-color)',
                  backgroundColor: 'var(--main-color)',
                  fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                }}>
                  أيام الإجازة
                </th>
                <th style={{ 
                  padding: '15px', 
                  textAlign: 'center', 
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  borderBottom: '1px solid var(--border-color)',
                  backgroundColor: 'var(--main-color)',
                  fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                }}>
                  أنشى من
                </th>
                <th style={{ 
                  padding: '15px', 
                  textAlign: 'center', 
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  borderBottom: '1px solid var(--border-color)',
                  backgroundColor: 'var(--main-color)',
                  fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                }}>
                  الحالة
                </th>
                <th style={{ 
                  padding: '15px', 
                  textAlign: 'center', 
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  borderBottom: '1px solid var(--border-color)',
                  backgroundColor: 'var(--main-color)',
                  fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                }}>
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="6" style={{ 
                    padding: '40px', 
                    textAlign: 'center', 
                    color: '#182d40',
                    fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                    fontWeight: 'bold'
                  }}>
                    جاري التحميل...
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ 
                    padding: '40px', 
                    textAlign: 'center', 
                    color: '#182d40',
                    fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                    fontWeight: 'bold'
                  }}>
                    لا توجد ورديات
                  </td>
                </tr>
              ) : (
                filteredData.map((shift, index) => (
                <tr key={shift.id} style={{ 
                  borderBottom: '1px solid var(--border-color)'
                }}>
                    <td style={{ 
                      padding: '15px', 
                      color: '#182d40',
                      fontWeight: '500',
                      textAlign: 'center',
                      fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                    }}>
                      {shift.name_ar || shift.name}
                    </td>
                    <td style={{ 
                      padding: '15px', 
                      color: '#182d40', 
                      textAlign: 'center',
                      fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                    }}>
                      {shift.work_days_count ? `${shift.work_days_count} أيام` : '--'}
                    </td>
                    <td style={{ 
                      padding: '15px', 
                      color: '#182d40', 
                      textAlign: 'center',
                      fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                    }}>
                      {shift.details && shift.details.length > 0 ? 
                        shift.details.filter(d => d.is_off_day).map(d => {
                          const dayNames = {
                            'saturday': 'السبت',
                            'sunday': 'الأحد', 
                            'monday': 'الاثنين',
                            'tuesday': 'الثلاثاء',
                            'wednesday': 'الأربعاء',
                            'thursday': 'الخميس',
                            'friday': 'الجمعة'
                          };
                          return dayNames[d.day_of_week] || d.day_of_week;
                        }).join(', ') || 'لا توجد' : 
                        'لا توجد'
                      }
                    </td>
                    <td style={{ 
                      padding: '15px', 
                      color: '#182d40', 
                      textAlign: 'center',
                      fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                    }}>
                      {shift.created_at ? new Date(shift.created_at).toLocaleDateString('ar-EG') : '--'}
                    </td>
                    <td style={{ padding: '15px', textAlign: 'center' }}>
                      <span style={{
                        backgroundColor: shift.is_active ? 'var(--main-color)' : 'var(--red-color)',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                      }}>
                        {shift.is_active ? 'نشط' : 'غير نشط'}
                      </span>
                    </td>
                    <td style={{ padding: '15px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button
                          onClick={() => handleView(shift.id)}
                          style={{
                            backgroundColor: 'var(--gray-color)',
                            color: 'white',
                            border: 'none',
                            padding: '8px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                          }}
                          title="عرض التفاصيل"
                        >
                          <FaEye style={{ color: 'white' }} />
                        </button>
                        <button
                          onClick={() => handleEdit(shift.id)}
                        style={{
                          backgroundColor: 'var(--gray-color)',
                          color: 'white',
                          border: 'none',
                          padding: '8px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                        }}
                        title="تعديل"
                      >
                        <FaEdit style={{ color: 'white' }} />
                      </button>
                      <button
                          onClick={() => handleDelete(shift)}
                        style={{
                          backgroundColor: 'var(--red-color)',
                          color: 'white',
                          border: 'none',
                          padding: '8px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                        }}
                        title="حذف"
                      >
                        <FaTrash style={{ color: 'white' }} />
                      </button>
                    </div>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* الترقيم */}
        <div style={{
          padding: '20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px',
          borderTop: '1px solid var(--border-color)'
        }}>
          <button style={{
            backgroundColor: 'var(--main-color)',
            color: 'white',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
          }}>
            1
          </button>
          <button style={{
            backgroundColor: 'var(--basic-color)',
            color: '#182d40',
            border: '1px solid var(--border-color)',
            padding: '8px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
            fontWeight: 'bold'
          }}>
            2
          </button>
          <button style={{
            backgroundColor: 'var(--basic-color)',
            color: '#182d40',
            border: '1px solid var(--border-color)',
            padding: '8px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
            fontWeight: 'bold'
          }}>
            3
          </button>
          <button style={{
            backgroundColor: 'var(--basic-color)',
            color: '#182d40',
            border: '1px solid var(--border-color)',
            padding: '8px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
            fontWeight: 'bold'
          }}>
            4
          </button>
          <button style={{
            backgroundColor: 'var(--basic-color)',
            color: '#182d40',
            border: '1px solid var(--border-color)',
            padding: '8px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
            fontWeight: 'bold'
          }}>
            5
          </button>
          <button style={{
            backgroundColor: 'var(--basic-color)',
            color: '#182d40',
            border: '1px solid var(--border-color)',
            padding: '8px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
            fontWeight: 'bold'
          }}>
            &gt;&gt;
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
              هل أنت متأكد من حذف الوردية "{shiftToDelete?.name_ar || shiftToDelete?.name}"؟
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

export default Shifts;
