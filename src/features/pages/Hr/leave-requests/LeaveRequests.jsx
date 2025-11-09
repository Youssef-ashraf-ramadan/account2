import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getLeaveRequests, deleteLeaveRequest, updateLeaveRequestStatus, clearError, clearSuccess } from '../../../../redux/Slices/authSlice';
import { FaPlus, FaEdit, FaTrash, FaEye, FaCheck, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

const LeaveRequests = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { leaveRequests, leaveRequestsPagination, isLoading, error, success } = useSelector((state) => state.auth);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [leaveRequestToDelete, setLeaveRequestToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [leaveRequestToReject, setLeaveRequestToReject] = useState(null);

  useEffect(() => {
    dispatch(getLeaveRequests({ page: currentPage }));
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
    navigate('/leave-requests/add');
  };

  const handleEdit = (id) => {
    navigate(`/leave-requests/edit/${id}`);
  };

  const handleView = (id) => {
    navigate(`/leave-requests/details/${id}`);
  };

  const handleDelete = (leaveRequest) => {
    setLeaveRequestToDelete(leaveRequest);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (leaveRequestToDelete) {
      dispatch(deleteLeaveRequest(leaveRequestToDelete.id));
      setShowDeleteModal(false);
      setLeaveRequestToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setLeaveRequestToDelete(null);
  };

  const handleStatusChange = (id, status) => {
    if (status === 'rejected') {
      const target = leaveRequests.find(r => r.id === id) || { id };
      setLeaveRequestToReject(target);
      setRejectReason('');
      setShowRejectModal(true);
      return;
    }
    dispatch(updateLeaveRequestStatus({ id, status }));
  };

  const confirmReject = () => {
    if (!leaveRequestToReject) return;
    if (!rejectReason.trim()) {
      toast.error('يرجى إدخال سبب الرفض', { rtl: true });
      return;
    }
    dispatch(updateLeaveRequestStatus({ id: leaveRequestToReject.id, status: 'rejected', rejection_reason: rejectReason.trim() }));
    setShowRejectModal(false);
    setLeaveRequestToReject(null);
    setRejectReason('');
  };

  const cancelReject = () => {
    setShowRejectModal(false);
    setLeaveRequestToReject(null);
    setRejectReason('');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return '#28a745';
      case 'rejected':
        return '#dc3545';
      case 'pending':
        return '#ffc107';
      default:
        return '#6c757d';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved':
        return 'موافق عليه';
      case 'rejected':
        return 'مرفوض';
      case 'pending':
        return 'في الانتظار';
      default:
        return 'غير محدد';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG');
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    if (!leaveRequestsPagination || !leaveRequests || leaveRequests.length === 0) {
      return null;
    }

    const { current_page, last_page } = leaveRequestsPagination;
    if (!last_page || last_page <= 1) return null;

    // Always show pagination even if there's only one page
    const pages = [];

    // Previous button
    pages.push(
      <button
        key="prev"
        onClick={() => handlePageChange(current_page - 1)}
        disabled={current_page === 1}
        style={{
          padding: '8px 12px',
          margin: '0 2px',
          backgroundColor: current_page === 1 ? '#666' : '#AC2000',
          color: '#182d40',
          border: 'none',
          borderRadius: '4px',
          cursor: current_page === 1 ? 'not-allowed' : 'pointer',
          fontSize: '14px'
        }}
      >
        السابق
      </button>
    );

    // Page numbers
    for (let i = 1; i <= last_page; i++) {
      if (i === 1 || i === last_page || (i >= current_page - 1 && i <= current_page + 1)) {
        pages.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            style={{
              padding: '8px 12px',
              margin: '0 2px',
              backgroundColor: i === current_page ? '#AC2000' : '#333',
              color: '#182d40',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: i === current_page ? 'bold' : 'normal'
            }}
          >
            {i}
          </button>
        );
      } else if (i === current_page - 2 || i === current_page + 2) {
        pages.push(
          <span key={`ellipsis-${i}`} style={{ color: '#182d40', padding: '0 4px' }}>
            ...
          </span>
        );
      }
    }

    // Next button
    pages.push(
      <button
        key="next"
        onClick={() => handlePageChange(current_page + 1)}
        disabled={current_page === last_page}
        style={{
          padding: '8px 12px',
          margin: '0 2px',
          backgroundColor: current_page === last_page ? '#666' : '#AC2000',
          color: '#182d40',
          border: 'none',
          borderRadius: '4px',
          cursor: current_page === last_page ? 'not-allowed' : 'pointer',
          fontSize: '14px'
        }}
      >
        التالي
      </button>
    );

    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        marginTop: '20px',
        flexWrap: 'wrap',
        gap: '5px'
      }}>
        {pages}
      </div>
    );
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
          طلبات الإجازات
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
          إضافة طلب إجازة
        </button>
      </div>


      {/* الجدول */}
      <div style={{
        backgroundColor: 'var(--basic-color)',
        borderRadius: '12px',
        padding: '20px',
        border: '1px solid var(--border-color)'
      }}>
        {leaveRequests && leaveRequests.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              minWidth: '1200px'
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
                    الموظف
                  </th>
                  <th style={{ 
                    padding: '15px', 
                    textAlign: 'center',
                    color: '#182d40',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}>
                    نوع الإجازة
                  </th>
                  <th style={{ 
                    padding: '15px', 
                    textAlign: 'center',
                    color: '#182d40',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}>
                    تاريخ البداية
                  </th>
                  <th style={{ 
                    padding: '15px', 
                    textAlign: 'center',
                    color: '#182d40',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}>
                    تاريخ النهاية
                  </th>
                  <th style={{ 
                    padding: '15px', 
                    textAlign: 'center',
                    color: '#182d40',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}>
                    السبب
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
                {leaveRequests.map((request, index) => (
                  <tr key={request.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
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
                      <div>
                        <div style={{ fontWeight: 'bold' }}>{request.employee?.name}</div>
                        <div style={{ fontSize: '12px', color: '#ccc' }}>{request.employee?.employee_code}</div>
                      </div>
                    </td>
                    <td style={{ 
                      padding: '15px', 
                      textAlign: 'center',
                      color: '#182d40'
                    }}>
                      {request.leave_type?.name}
                    </td>
                    <td style={{ 
                      padding: '15px', 
                      textAlign: 'center',
                      color: '#182d40'
                    }}>
                      {formatDate(request.start_date)}
                    </td>
                    <td style={{ 
                      padding: '15px', 
                      textAlign: 'center',
                      color: '#182d40'
                    }}>
                      {formatDate(request.end_date)}
                    </td>
                    <td style={{ 
                      padding: '15px', 
                      textAlign: 'center',
                      color: '#182d40'
                    }}>
                      {request.reason || '-'}
                    </td>
                    <td style={{ 
                      padding: '15px', 
                      textAlign: 'center'
                    }}>
                      <span style={{
                        backgroundColor: getStatusColor(request.status),
                        color: '#182d40',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        minWidth: '80px',
                        display: 'inline-block'
                      }}>
                        {getStatusText(request.status)}
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
                          onClick={() => handleView(request.id)}
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
                          onClick={() => handleEdit(request.id)}
                          style={{
                            backgroundColor: 'var(--gray-color)',
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
                          title="تعديل"
                        >
                          <FaEdit style={{ color: '#182d40' }} />
                        </button>
                        {request.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(request.id, 'approved')}
                              style={{
                                backgroundColor: '#28a745',
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
                              title="موافقة"
                            >
                              <FaCheck style={{ color: '#182d40' }} />
                            </button>
                            <button
                              onClick={() => handleStatusChange(request.id, 'rejected')}
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
                              title="رفض"
                            >
                              <FaTimes style={{ color: '#182d40' }} />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(request)}
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
            لا توجد طلبات إجازات
          </div>
        )}

        {/* Pagination */}
        {renderPagination()}
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
              هل أنت متأكد من حذف طلب الإجازة؟
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

      {/* Modal رفض */}
      {showRejectModal && (
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
            maxWidth: '520px',
            width: '92%'
          }}>
            <h3 style={{ color: '#182d40', marginBottom: '12px', fontSize: '18px' }}>سبب الرفض</h3>
            <p style={{ color: '#ccc', marginBottom: '16px', fontSize: '13px' }}>يرجى توضيح سبب رفض طلب الإجازة.</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
              placeholder="اكتب سبب الرفض هنا"
              style={{
                width: '100%',
                padding: '12px 15px',
                backgroundColor: 'var(--basic-color)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                color: '#182d40',
                fontSize: '14px',
                resize: 'vertical'
              }}
            />
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '18px' }}>
              <button
                onClick={cancelReject}
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
                onClick={confirmReject}
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
                تأكيد الرفض
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveRequests;
