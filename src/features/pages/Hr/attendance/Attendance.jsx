import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAttendance, checkIn, checkOut, getEmployees, clearError, clearSuccess } from '../../../../redux/Slices/authSlice';
import { FaSearch, FaEdit, FaTrash, FaEye, FaSignInAlt, FaSignOutAlt, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Attendance = () => {
  const dispatch = useDispatch();
  const { attendance, attendancePagination, employees, isLoading, error, success } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showCheckOutModal, setShowCheckOutModal] = useState(false);
  const [checkInData, setCheckInData] = useState({ employee_id: '', check_in_notes: '' });
  const [checkOutData, setCheckOutData] = useState({ employee_id: '', check_out_notes: '' });

  useEffect(() => {
    dispatch(getAttendance());
    dispatch(getEmployees());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      toast.success(success, { rtl: true });
      dispatch(clearSuccess());
      setShowCheckInModal(false);
      setShowCheckOutModal(false);
      setCheckInData({ employee_id: '', check_in_notes: '' });
      setCheckOutData({ employee_id: '', check_out_notes: '' });
    }
    if (error) {
      toast.error(error, { rtl: true });
      dispatch(clearError());
    }
  }, [success, error, dispatch]);

  const filteredData = attendance?.filter(record => 
    record.employee?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.employee?.employee_code?.includes(searchTerm)
  ) || [];

  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    dispatch(getAttendance({ page }));
  };

  const handleCheckIn = async () => {
    if (!checkInData.employee_id) {
      toast.error('يرجى اختيار الموظف', { rtl: true });
      return;
    }
    try {
      await dispatch(checkIn(checkInData)).unwrap();
      // تحديث البيانات بعد النجاح
      dispatch(getAttendance({ page: currentPage }));
    } catch (error) {
      // سيتم التعامل مع الخطأ في useEffect
    }
  };

  const handleCheckOut = async () => {
    if (!checkOutData.employee_id) {
      toast.error('يرجى اختيار الموظف', { rtl: true });
      return;
    }
    try {
      await dispatch(checkOut(checkOutData)).unwrap();
      // تحديث البيانات بعد النجاح
      dispatch(getAttendance({ page: currentPage }));
    } catch (error) {
      // سيتم التعامل مع الخطأ في useEffect
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG');
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return '#AC2000';
      case 'absent':
        return '#dc3545';
      case 'late':
        return '#ffc107';
      default:
        return '#666';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'present':
        return 'حاضر';
      case 'absent':
        return 'غائب';
      case 'late':
        return 'متأخر';
      default:
        return 'غير محدد';
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
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <h1 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          color: '#182d40',
          margin: 0,
          fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
        }}>
          الحضور والانصراف
        </h1>

        {/* أزرار تسجيل الدخول والخروج */}
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowCheckInModal(true)}
            style={{
            backgroundColor: 'var(--main-color)',
            color: 'white',
            border: 'none',
            padding: '12px 20px',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
          }}
        >
            <FaSignInAlt style={{ color: 'white' }} />
            تسجيل حضور
          </button>
          
          <button
            onClick={() => setShowCheckOutModal(true)}
            style={{
              backgroundColor: 'var(--red-color)',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
          display: 'flex', 
          alignItems: 'center',
              gap: '8px',
              fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
            }}
          >
            <FaSignOutAlt style={{ color: 'white' }} />
            تسجيل انصراف
          </button>
        </div>
      </div>

      {/* شريط البحث */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ position: 'relative', width: '100%' }}>
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
            placeholder="بحث عن الموظف..."
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
      </div>

      {/* جدول الحضور والانصراف */}
      <div style={{
        backgroundColor: 'var(--basic-color)',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid var(--border-color)'
      }}>
       

        {isLoading ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '40px',
            color: '#182d40'
          }}>
            <div style={{ 
              fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
              fontWeight: 'bold'
            }}>جاري التحميل...</div>
          </div>
        ) : filteredData && filteredData.length > 0 ? (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse',
              minWidth: '1200px'
          }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--main-color)' }}>
                <th style={{ 
                  padding: '15px', 
                    textAlign: 'center', 
                  color: 'white',
                  fontWeight: 'bold',
                    fontSize: '16px',
                  borderBottom: '1px solid var(--border-color)',
                  backgroundColor: 'var(--main-color)',
                  fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                }}>
                    #
                </th>
                <th style={{ 
                  padding: '15px', 
                    textAlign: 'center', 
                  color: 'white',
                  fontWeight: 'bold',
                    fontSize: '16px',
                  borderBottom: '1px solid var(--border-color)',
                  backgroundColor: 'var(--main-color)',
                  fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                }}>
                    الموظف
                </th>
                <th style={{ 
                  padding: '15px', 
                    textAlign: 'center', 
                  color: 'white',
                  fontWeight: 'bold',
                    fontSize: '16px',
                  borderBottom: '1px solid var(--border-color)',
                  backgroundColor: 'var(--main-color)',
                  fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                }}>
                    تاريخ العمل
                </th>
                <th style={{ 
                  padding: '15px', 
                    textAlign: 'center', 
                  color: 'white',
                  fontWeight: 'bold',
                    fontSize: '16px',
                  borderBottom: '1px solid var(--border-color)',
                  backgroundColor: 'var(--main-color)',
                  fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                }}>
                    وقت الدخول
                </th>
                <th style={{ 
                  padding: '15px', 
                    textAlign: 'center', 
                  color: 'white',
                  fontWeight: 'bold',
                    fontSize: '16px',
                  borderBottom: '1px solid var(--border-color)',
                  backgroundColor: 'var(--main-color)',
                  fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                }}>
                    وقت الخروج
                </th>
                <th style={{ 
                  padding: '15px', 
                    textAlign: 'center', 
                  color: 'white',
                  fontWeight: 'bold',
                    fontSize: '16px',
                  borderBottom: '1px solid var(--border-color)',
                  backgroundColor: 'var(--main-color)',
                  fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                }}>
                    الملاحظات
                </th>
                <th style={{ 
                  padding: '15px', 
                    textAlign: 'center', 
                  color: 'white',
                  fontWeight: 'bold',
                    fontSize: '16px',
                  borderBottom: '1px solid var(--border-color)',
                  backgroundColor: 'var(--main-color)',
                  fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                }}>
                  الحالة
                </th>
              </tr>
            </thead>
            <tbody>
                {filteredData.map((record, index) => (
                  <tr key={record.id} style={{ 
                    borderBottom: '1px solid var(--border-color)',
                    backgroundColor: index % 2 === 0 ? 'var(--basic-color)' : '#f0f4fa'
                  }}>
                    <td style={{ 
                      padding: '15px', 
                      textAlign: 'center',
                      color: '#182d40',
                      fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                      fontWeight: 'bold'
                    }}>
                      {index + 1}
                  </td>
                    <td style={{ 
                      padding: '15px', 
                      textAlign: 'center',
                      color: '#182d40',
                      fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                    }}>
                      <div>
                        <div style={{ fontWeight: 'bold', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>{record.employee?.name}</div>
                        <div style={{ fontSize: '12px', color: '#182d40', opacity: 0.7, fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>{record.employee?.employee_code}</div>
                      </div>
                  </td>
                  <td style={{ 
                    padding: '15px', 
                      textAlign: 'center',
                      color: '#182d40',
                      fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                  }}>
                      {formatDate(record.work_date)}
                  </td>
                    <td style={{ 
                      padding: '15px', 
                      textAlign: 'center',
                      color: '#182d40',
                      fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                    }}>
                      {record.check_in ? formatTime(record.check_in) : '-'}
                  </td>
                    <td style={{ 
                      padding: '15px', 
                      textAlign: 'center',
                      color: '#182d40',
                      fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                    }}>
                      {record.check_out ? formatTime(record.check_out) : '-'}
                  </td>
                    <td style={{ 
                      padding: '15px', 
                      textAlign: 'center',
                      color: '#182d40'
                    }}>
                      <div style={{ textAlign: 'right', fontSize: '12px' }}>
                        {record.notes ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {record.notes.split('\n').map((note, index) => {
                              const isCheckout = note.includes('Checkout');
                              const noteText = isCheckout ? note.replace('Checkout Notes: ', '') : note;
                              return (
                                <div 
                                  key={index} 
                                  className="attendance-note-card"
                                  style={{ 
                                    position: 'relative',
                                    marginBottom: '8px',
                                    padding: '12px 16px',
                                    backgroundColor: isCheckout ? 'rgba(220, 53, 69, 0.1)' : 'rgba(0, 106, 255, 0.1)',
                                    border: `2px solid ${isCheckout ? 'var(--red-color)' : 'var(--main-color)'}`,
                                    borderRadius: '12px',
                                    fontSize: '12px',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                                    backdropFilter: 'blur(10px)'
                                  }}
                                >
                                  {/* أيقونة */}
                                  <div 
                                    className="note-icon"
                                    style={{
                                      position: 'absolute',
                                      top: '-8px',
                                      right: '12px',
                                      width: '20px',
                                      height: '20px',
                                      backgroundColor: isCheckout ? 'var(--red-color)' : 'var(--main-color)',
                                      borderRadius: '50%',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontSize: '10px',
                                      color: 'white',
                                      fontWeight: 'bold',
                                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                                      transition: 'transform 0.3s ease'
                                    }}
                                  >
                                    {isCheckout ? '↩' : '✓'}
                                  </div>
                                  
                                  {/* نوع الملاحظة */}
                                  <div style={{
                                    color: isCheckout ? 'var(--red-color)' : 'var(--main-color)',
                                    fontWeight: 'bold',
                                    marginBottom: '4px',
                                    fontSize: '11px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                                  }}>
                                    {isCheckout ? 'ملاحظة انصراف:' : 'ملاحظة حضور:'}
                                  </div>
                                  
                                  {/* نص الملاحظة */}
                                  <div style={{
                                    color: '#182d40',
                                    lineHeight: '1.4',
                                    wordBreak: 'break-word',
                                    fontSize: '11px',
                                    fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                                  }}>
                                    {noteText}
                                  </div>
                                  
                                  {/* خط زمني */}
                                  <div 
                                    className="note-timeline"
                                    style={{
                                      position: 'absolute',
                                      bottom: '0',
                                      left: '0',
                                      right: '0',
                                      height: '2px',
                                      background: `linear-gradient(90deg, ${isCheckout ? 'var(--red-color)' : 'var(--main-color)'}, transparent)`,
                                      borderRadius: '0 0 12px 12px',
                                      transition: 'opacity 0.3s ease'
                                    }}
                                  ></div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div style={{
                            padding: '20px',
                            textAlign: 'center',
                            color: '#182d40',
                            fontSize: '14px',
                            fontStyle: 'italic',
                            fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                            fontWeight: 'bold',
                            opacity: 0.7
                          }}>
                            <div style={{
                              width: '40px',
                              height: '40px',
                              margin: '0 auto 8px',
                              backgroundColor: 'var(--gray-color)',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '18px'
                            }}>
                              📝
                            </div>
                            لا توجد ملاحظات
                          </div>
                        )}
                      </div>
                    </td>
                    <td style={{ 
                      padding: '15px', 
                      textAlign: 'center'
                    }}>
                      <span style={{
                        backgroundColor: record.status === 'present' ? 'var(--main-color)' : record.status === 'absent' ? 'var(--red-color)' : '#ffc107',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        minWidth: '80px',
                        display: 'inline-block',
                        fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                      }}>
                        {getStatusText(record.status)}
                    </span>
                  </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: '#182d40',
            fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
            fontWeight: 'bold'
          }}>
            لا توجد سجلات حضور وانصراف
          </div>
        )}

        {/* الباجينيشن */}
        {attendancePagination && attendancePagination.last_page > 1 && (
          <div style={{
            padding: '20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
            borderTop: '1px solid var(--border-color)',
            flexWrap: 'wrap'
          }}>
            {/* زر السابق */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              style={{
                padding: '8px 12px',
                margin: '0 2px',
                backgroundColor: currentPage === 1 ? 'var(--basic-color)' : 'var(--basic-color)',
                color: currentPage === 1 ? '#182d40' : '#182d40',
                border: '1px solid var(--border-color)',
                borderRadius: '4px',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                fontWeight: 'bold',
                opacity: currentPage === 1 ? 0.6 : 1
              }}
            >
              السابق
            </button>

            {/* أرقام الصفحات */}
            {Array.from({ length: attendancePagination.last_page }, (_, i) => i + 1).map(page => {
              if (page === 1 || page === attendancePagination.last_page || 
                  (page >= currentPage - 1 && page <= currentPage + 1)) {
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    style={{
                      padding: '8px 12px',
                      margin: '0 2px',
                      backgroundColor: page === currentPage ? 'var(--main-color)' : 'var(--basic-color)',
                      color: page === currentPage ? 'white' : '#182d40',
                      border: page === currentPage ? 'none' : '1px solid var(--border-color)',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                    }}
                  >
                    {page}
                  </button>
                );
              } else if (page === currentPage - 2 || page === currentPage + 2) {
                return (
                  <span key={`ellipsis-${page}`} style={{ color: '#182d40', padding: '0 4px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>
                    ...
                  </span>
                );
              }
              return null;
            })}

            {/* زر التالي */}
                      <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === attendancePagination.last_page}
              style={{
                padding: '8px 12px',
                margin: '0 2px',
                backgroundColor: currentPage === attendancePagination.last_page ? 'var(--basic-color)' : 'var(--basic-color)',
                color: '#182d40',
                border: '1px solid var(--border-color)',
                borderRadius: '4px',
                cursor: currentPage === attendancePagination.last_page ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                fontWeight: 'bold',
                opacity: currentPage === attendancePagination.last_page ? 0.6 : 1
              }}
            >
              التالي
            </button>
          </div>
        )}
      </div>

      {/* Modal تسجيل حضور */}
      {showCheckInModal && (
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
            padding: '30px',
            borderRadius: '12px',
            border: '1px solid var(--border-color)',
            maxWidth: '500px',
            width: '90%'
          }}>
            <h3 style={{ 
              color: '#182d40', 
              marginBottom: '20px', 
              fontSize: '18px',
              fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
              fontWeight: 'bold'
            }}>تسجيل حضور</h3>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                color: '#182d40',
                fontWeight: '500',
                fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
              }}>
                الموظف *
              </label>
              <select
                value={checkInData.employee_id}
                onChange={(e) => setCheckInData({...checkInData, employee_id: e.target.value})}
                        style={{
                  width: '100%',
                  padding: '12px 15px',
                  backgroundColor: 'var(--basic-color)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                          color: '#182d40',
                          fontSize: '14px',
                          fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                        }}
              >
                <option value="" style={{ backgroundColor: 'var(--basic-color)' }}>اختر الموظف</option>
                {employees?.map(employee => (
                  <option key={employee.id} value={employee.id} style={{ backgroundColor: 'var(--basic-color)' }}>
                    {employee.name} - {employee.employee_code}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                color: '#182d40',
                fontWeight: '500',
                fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
              }}>
                ملاحظات الحضور
              </label>
              <textarea
                value={checkInData.check_in_notes}
                onChange={(e) => setCheckInData({...checkInData, check_in_notes: e.target.value})}
                placeholder="ملاحظات حول الحضور..."
                rows="3"
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  backgroundColor: 'var(--basic-color)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  color: '#182d40',
                  fontSize: '14px',
                  resize: 'vertical',
                  fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                      <button
                onClick={() => setShowCheckInModal(false)}
                        style={{
                          backgroundColor: 'var(--gray-color)',
                          color: 'white',
                          border: 'none',
                  padding: '10px 20px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                          fontWeight: 'bold'
                        }}
                      >
                إلغاء
                      </button>
                      <button
                onClick={handleCheckIn}
                disabled={isLoading}
                        style={{
                  backgroundColor: isLoading ? 'var(--gray-color)' : 'var(--main-color)',
                          color: 'white',
                          border: 'none',
                  padding: '10px 20px',
                          borderRadius: '6px',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  opacity: isLoading ? 0.6 : 1,
                  fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                  fontWeight: 'bold'
                        }}
                      >
                {isLoading ? 'جاري التسجيل...' : 'تسجيل حضور'}
                      </button>
                    </div>
          </div>
        </div>
      )}

      {/* Modal تسجيل انصراف */}
      {showCheckOutModal && (
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
            padding: '30px',
            borderRadius: '12px',
            border: '1px solid var(--border-color)',
            maxWidth: '500px',
            width: '90%'
          }}>
            <h3 style={{ 
              color: '#182d40', 
              marginBottom: '20px', 
              fontSize: '18px',
              fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
              fontWeight: 'bold'
            }}>تسجيل انصراف</h3>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
            color: '#182d40',
                fontWeight: '500',
                fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
              }}>
                الموظف *
              </label>
              <select
                value={checkOutData.employee_id}
                onChange={(e) => setCheckOutData({...checkOutData, employee_id: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  backgroundColor: 'var(--basic-color)',
            border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  color: '#182d40',
            fontSize: '14px',
            fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                }}
              >
                <option value="" style={{ backgroundColor: 'var(--basic-color)' }}>اختر الموظف</option>
                {employees?.map(employee => (
                  <option key={employee.id} value={employee.id} style={{ backgroundColor: 'var(--basic-color)' }}>
                    {employee.name} - {employee.employee_code}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                color: '#182d40',
                fontWeight: '500',
                fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
              }}>
                ملاحظات الانصراف
              </label>
              <textarea
                value={checkOutData.check_out_notes}
                onChange={(e) => setCheckOutData({...checkOutData, check_out_notes: e.target.value})}
                placeholder="ملاحظات حول الانصراف..."
                rows="3"
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  backgroundColor: 'var(--basic-color)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  color: '#182d40',
                  fontSize: '14px',
                  resize: 'vertical',
                  fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => setShowCheckOutModal(false)}
                style={{
                  backgroundColor: 'var(--gray-color)',
            color: 'white',
                  border: 'none',
                  padding: '10px 20px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
            fontWeight: 'bold'
                }}
              >
                إلغاء
          </button>
              <button
                onClick={handleCheckOut}
                disabled={isLoading}
                style={{
                  backgroundColor: isLoading ? 'var(--gray-color)' : 'var(--red-color)',
            color: 'white',
                  border: 'none',
                  padding: '10px 20px',
            borderRadius: '6px',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  opacity: isLoading ? 0.6 : 1,
                  fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                  fontWeight: 'bold'
                }}
              >
                {isLoading ? 'جاري التسجيل...' : 'تسجيل انصراف'}
          </button>
        </div>
      </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;
