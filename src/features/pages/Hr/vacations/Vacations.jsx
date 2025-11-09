import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getLeaveTypes, deleteLeaveType, clearError, clearSuccess } from '../../../../redux/Slices/authSlice';
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Vacations = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { leaveTypes, leaveTypesPagination, isLoading, error, success } = useSelector((state) => state.auth);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [leaveTypeToDelete, setLeaveTypeToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(getLeaveTypes({ page: currentPage }));
  }, [dispatch, currentPage]);

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

  const handleAdd = () => {
    navigate('/vacations/add');
  };

  const handleEdit = (id) => {
    navigate(`/vacations/edit/${id}`);
  };

  const handleView = (id) => {
    navigate(`/vacations/details/${id}`);
  };

  const handleDelete = (leaveType) => {
    setLeaveTypeToDelete(leaveType);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (leaveTypeToDelete) {
      dispatch(deleteLeaveType(leaveTypeToDelete.id));
      setShowDeleteModal(false);
      setLeaveTypeToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setLeaveTypeToDelete(null);
  };



  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        color: '#182d40'
      }}>
        <div>جاري التحميل...</div>
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
      {/* العنوان */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          color: '#182d40',
          margin: 0,
          fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
        }}>
          أنواع الإجازات
        </h1>

          <button
          onClick={handleAdd}
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
            <FaPlus style={{ color: 'white' }} />
          إضافة نوع إجازة
          </button>
      </div>


      {/* الجدول */}
      <div style={{
        backgroundColor: 'var(--basic-color)',
        borderRadius: '12px',
        padding: '20px',
        border: '1px solid var(--border-color)'
      }}>
        {leaveTypes && leaveTypes.length > 0 ? (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse',
            minWidth: '800px'
          }}>
            <thead>
                <tr style={{ borderBottom: '2px solid #333' }}>
                <th style={{ 
                  padding: '15px', 
                    textAlign: 'center',
                  color: '#182d40',
                    fontSize: '16px',
                    fontWeight: 'bold'
                }}>
                    #
                </th>
                <th style={{ 
                  padding: '15px', 
                    textAlign: 'center',
                  color: '#182d40',
                    fontSize: '16px',
                    fontWeight: 'bold'
                }}>
                    اسم الإجازة
                </th>
                <th style={{ 
                  padding: '15px', 
                    textAlign: 'center',
                  color: '#182d40',
                    fontSize: '16px',
                    fontWeight: 'bold'
                }}>
                    الرصيد الافتراضي
                </th>
                <th style={{ 
                  padding: '15px', 
                    textAlign: 'center',
                  color: '#182d40',
                    fontSize: '16px',
                    fontWeight: 'bold'
                }}>
                  الحالة
                </th>
                <th style={{ 
                  padding: '15px', 
                    textAlign: 'center',
                  color: '#182d40',
                    fontSize: '16px',
                    fontWeight: 'bold'
                }}>
                    الإجراءات
                </th>
              </tr>
            </thead>
            <tbody>
                {leaveTypes.map((leaveType, index) => (
                  <tr key={leaveType.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ 
                      padding: '15px', 
                      textAlign: 'center',
                      color: '#182d40'
                    }}>
                      {index + 1}
                    </td>
                  <td style={{ 
                    padding: '15px', 
                      textAlign: 'center',
                      color: '#182d40'
                  }}>
                      {leaveType.name}
                  </td>
                    <td style={{ 
                      padding: '15px', 
                      textAlign: 'center',
                      color: '#182d40'
                    }}>
                      {leaveType.default_balance} يوم
                  </td>
                    <td style={{ 
                      padding: '15px', 
                      textAlign: 'center'
                    }}>
                    <span style={{
                        backgroundColor: leaveType.is_active ? '#28a745' : '#dc3545',
                      color: '#182d40',
                        padding: '4px 8px',
                        borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                        minWidth: '60px',
                        display: 'inline-block'
                      }}>
                        {leaveType.is_active ? 'نشط' : 'غير نشط'}
                      </span>
                    </td>
                    <td style={{ 
                      padding: '15px', 
                      textAlign: 'center'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        gap: '8px', 
                        justifyContent: 'center',
                        flexWrap: 'wrap'
                      }}>
                      <button
                          onClick={() => handleView(leaveType.id)}
                        style={{
                            backgroundColor: '#17a2b8',
                          color: '#182d40',
                          border: 'none',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '12px'
                          }}
                          title="عرض التفاصيل"
                        >
                          <FaEye style={{ color: '#182d40' }} />
                        </button>
                        <button
                          onClick={() => handleEdit(leaveType.id)}
                          style={{
                            backgroundColor: '#ffc107',
                            color: 'black',
                            border: 'none',
                            padding: '8px 12px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '12px'
                        }}
                        title="تعديل"
                      >
                        <FaEdit style={{ color: '#182d40' }} />
                      </button>
                      <button
                          onClick={() => handleDelete(leaveType)}
                        style={{
                          backgroundColor: 'var(--red-color)',
                          color: '#182d40',
                          border: 'none',
                            padding: '8px 12px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '12px'
                        }}
                        title="حذف"
                      >
                        <FaTrash style={{ color: '#182d40' }} />
                      </button>
                    </div>
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
            color: '#666'
          }}>
            لا توجد أنواع إجازات
          </div>
        )}

        {/* الترقيم */}
        {leaveTypesPagination && leaveTypes && leaveTypes.length > 0 && leaveTypesPagination.last_page > 1 && (
        <div style={{
          padding: '20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px',
          borderTop: '1px solid var(--border-color)'
        }}>
          {/* Previous Button */}
          {leaveTypesPagination.current_page > 1 && (
            <button 
              onClick={() => setCurrentPage(leaveTypesPagination.current_page - 1)}
              style={{
            backgroundColor: 'var(--basic-color)',
            color: '#182d40',
            border: '1px solid var(--border-color)',
            padding: '8px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
              }}
            >
              &lt;&lt;
          </button>
          )}

          {/* Page Numbers */}
          {Array.from({ length: leaveTypesPagination.last_page }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              style={{
                backgroundColor: page === leaveTypesPagination.current_page ? '#AC2000' : '#202938',
            color: '#182d40',
                border: page === leaveTypesPagination.current_page ? 'none' : '1px solid #333',
            padding: '8px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
                fontSize: '14px',
                fontWeight: page === leaveTypesPagination.current_page ? 'bold' : 'normal'
              }}
            >
              {page}
          </button>
          ))}

          {/* Next Button */}
          {leaveTypesPagination.current_page < leaveTypesPagination.last_page && (
            <button 
              onClick={() => setCurrentPage(leaveTypesPagination.current_page + 1)}
              style={{
            backgroundColor: 'var(--basic-color)',
            color: '#182d40',
            border: '1px solid var(--border-color)',
            padding: '8px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
              }}
            >
            &gt;&gt;
          </button>
          )}
        </div>
        )}
        </div>

      {/* Modal حذف */}
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
            padding: '30px',
            borderRadius: '12px',
            border: '1px solid var(--border-color)',
            maxWidth: '400px',
            width: '90%',
            textAlign: 'center'
          }}>
            <h3 style={{ 
            color: '#182d40',
              marginBottom: '20px',
              fontSize: '18px'
            }}>
              تأكيد الحذف
            </h3>
            <p style={{ 
              color: '#ccc', 
              marginBottom: '30px',
            fontSize: '14px'
          }}>
              هل أنت متأكد من حذف نوع الإجازة "{leaveTypeToDelete?.name}"؟
            </p>
            <p style={{ 
            color: '#182d40',
              marginBottom: '30px',
              fontSize: '12px'
            }}>
              هذا الإجراء لا يمكن التراجع عنه.
            </p>
            <div style={{ 
              display: 'flex', 
              gap: '15px', 
              justifyContent: 'center' 
            }}>
              <button
                onClick={cancelDelete}
                style={{
                  backgroundColor: '#666',
            color: '#182d40',
                  border: 'none',
                  padding: '10px 20px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
                }}
              >
                إلغاء
          </button>
              <button
                onClick={confirmDelete}
                style={{
                  backgroundColor: 'var(--red-color)',
            color: '#182d40',
                  border: 'none',
                  padding: '10px 20px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
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

export default Vacations;