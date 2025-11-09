import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getLeaveRequestDetails, deleteLeaveRequest, updateLeaveRequestStatus, clearError, clearSuccess } from '../../../../redux/Slices/authSlice';
import { FaArrowLeft, FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

const LeaveRequestDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { leaveRequestDetails, isLoading, error, success } = useSelector((state) => state.auth);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(getLeaveRequestDetails(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (success) {
      toast.success(success, { rtl: true });
      dispatch(clearSuccess());
      if (success.includes('حذف')) {
        navigate('/leave-requests');
      }
    }
    if (error) {
      toast.error(error, { rtl: true });
      dispatch(clearError());
    }
  }, [success, error, navigate, dispatch]);

  const handleEdit = () => {
    navigate(`/leave-requests/edit/${id}`);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    dispatch(deleteLeaveRequest(id));
    setShowDeleteModal(false);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleStatusChange = (status) => {
    dispatch(updateLeaveRequestStatus({ id, status }));
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

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        color: 'var(--text-primary)'
      }}>
        <div>جاري التحميل...</div>
      </div>
    );
  }

  if (!leaveRequestDetails) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        color: 'var(--text-primary)'
      }}>
        <div>لا توجد بيانات</div>
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
      {/* العنوان */}
      <div style={{ marginBottom: '30px' }}>
        <button
          onClick={() => navigate('/leave-requests')}
          style={{
            backgroundColor: '#666',
            color: 'var(--text-primary)',
            border: 'none',
            padding: '10px',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '20px',
            fontSize: '14px'
          }}
        >
          <FaArrowLeft style={{ color: '#182d40' }} />
          الرجوع
        </button>
        
        <h1 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold',
          color: 'var(--text-primary)',
          margin: 0
        }}>
          تفاصيل طلب الإجازة
        </h1>
      </div>

      {/* تفاصيل طلب الإجازة */}
      <div style={{
        backgroundColor: 'var(--basic-color)',
        borderRadius: '12px',
        padding: '30px',
        border: '1px solid var(--border-color)'
      }}>
        <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
          {/* العمود الأيسر */}
          <div style={{ flex: '1', minWidth: '300px' }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                color: 'var(--text-primary)',
                fontWeight: 'bold',
                fontSize: '14px'
              }}>
                الموظف
              </label>
              <div style={{
                padding: '12px 15px',
                backgroundColor: 'var(--basic-color)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                fontSize: '16px'
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{leaveRequestDetails.employee?.name}</div>
                <div style={{ fontSize: '14px', color: '#ccc', marginBottom: '3px' }}>كود الموظف: {leaveRequestDetails.employee?.employee_code}</div>
                <div style={{ fontSize: '14px', color: '#ccc', marginBottom: '3px' }}>البريد الإلكتروني: {leaveRequestDetails.employee?.email}</div>
                <div style={{ fontSize: '14px', color: '#ccc', marginBottom: '3px' }}>رقم الهاتف: {leaveRequestDetails.employee?.phone}</div>
                <div style={{ fontSize: '14px', color: '#ccc', marginBottom: '3px' }}>تاريخ الميلاد: {formatDate(leaveRequestDetails.employee?.birth_date)}</div>
                <div style={{ fontSize: '14px', color: '#ccc', marginBottom: '3px' }}>الجنس: {leaveRequestDetails.employee?.gender === 'male' ? 'ذكر' : 'أنثى'}</div>
                <div style={{ fontSize: '14px', color: '#ccc' }}>الحالة: {leaveRequestDetails.employee?.is_active ? 'نشط' : 'غير نشط'}</div>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                color: 'var(--text-primary)',
                fontWeight: 'bold',
                fontSize: '14px'
              }}>
                نوع الإجازة
              </label>
              <div style={{
                padding: '12px 15px',
                backgroundColor: 'var(--basic-color)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                fontSize: '16px'
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{leaveRequestDetails.leave_type?.name}</div>
                <div style={{ fontSize: '14px', color: '#ccc', marginBottom: '3px' }}>الرصيد الافتراضي: {leaveRequestDetails.leave_type?.default_balance} يوم</div>
                <div style={{ fontSize: '14px', color: '#ccc' }}>الحالة: {leaveRequestDetails.leave_type?.is_active ? 'نشط' : 'غير نشط'}</div>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                color: 'var(--text-primary)',
                fontWeight: 'bold',
                fontSize: '14px'
              }}>
                السبب
              </label>
              <div style={{
                padding: '12px 15px',
                backgroundColor: 'var(--basic-color)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                fontSize: '16px',
                minHeight: '80px'
              }}>
                {leaveRequestDetails.reason || 'لا يوجد سبب محدد'}
              </div>
            </div>
          </div>

          {/* العمود الأيمن */}
          <div style={{ flex: '1', minWidth: '300px' }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                color: 'var(--text-primary)',
                fontWeight: 'bold',
                fontSize: '14px'
              }}>
                تواريخ الإجازة
              </label>
              <div style={{
                padding: '12px 15px',
                backgroundColor: 'var(--basic-color)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                fontSize: '16px'
              }}>
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>تاريخ البداية:</span> {formatDate(leaveRequestDetails.start_date)}
                </div>
                <div>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>تاريخ النهاية:</span> {formatDate(leaveRequestDetails.end_date)}
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                color: 'var(--text-primary)',
                fontWeight: 'bold',
                fontSize: '14px'
              }}>
                الحالة
              </label>
              <div style={{
                padding: '12px 15px',
                backgroundColor: 'var(--basic-color)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                fontSize: '16px'
              }}>
                <span style={{
                  backgroundColor: getStatusColor(leaveRequestDetails.status),
                  color: 'var(--text-primary)',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {getStatusText(leaveRequestDetails.status)}
                </span>
              </div>
            </div>

            {leaveRequestDetails.approver && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  color: 'var(--text-primary)',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}>
                  المعتمد
                </label>
                <div style={{
                  padding: '12px 15px',
                  backgroundColor: 'var(--basic-color)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  fontSize: '16px'
                }}>
                  <div style={{ fontWeight: 'bold' }}>{leaveRequestDetails.approver.name}</div>
                  <div style={{ fontSize: '14px', color: '#ccc' }}>ID: {leaveRequestDetails.approver.id}</div>
                </div>
              </div>
            )}

            {leaveRequestDetails.rejection_reason && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  color: 'var(--text-primary)',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}>
                  سبب الرفض
                </label>
                <div style={{
                  padding: '12px 15px',
                  backgroundColor: 'var(--basic-color)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  fontSize: '16px'
                }}>
                  {leaveRequestDetails.rejection_reason}
                </div>
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                color: 'var(--text-primary)',
                fontWeight: 'bold',
                fontSize: '14px'
              }}>
                معلومات إضافية
              </label>
              <div style={{
                padding: '12px 15px',
                backgroundColor: 'var(--basic-color)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                fontSize: '16px'
              }}>
                <div style={{ marginBottom: '5px' }}>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>رقم الطلب:</span> {leaveRequestDetails.id}
                </div>
                <div style={{ fontSize: '14px', color: '#ccc' }}>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>تاريخ الإنشاء:</span> {formatDate(leaveRequestDetails.created_at)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* أزرار التحكم */}
        <div style={{
          display: 'flex',
          gap: '15px',
          justifyContent: 'center',
          marginTop: '30px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={handleEdit}
            style={{
              backgroundColor: 'var(--gray-color)',
              color: 'var(--text-primary)',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <FaEdit style={{ color: '#182d40' }} />
            تعديل
          </button>
          
          {leaveRequestDetails.status === 'pending' && (
            <>
              <button
                onClick={() => handleStatusChange('approved')}
                style={{
                  backgroundColor: '#28a745',
                  color: 'var(--text-primary)',
                  border: 'none',
                  padding: '12px 20px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <FaCheck style={{ color: '#182d40' }} />
                موافقة
              </button>
              <button
                onClick={() => handleStatusChange('rejected')}
                style={{
                  backgroundColor: 'var(--red-color)',
                  color: 'var(--text-primary)',
                  border: 'none',
                  padding: '12px 20px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <FaTimes style={{ color: '#182d40' }} />
                رفض
              </button>
            </>
          )}
          
          <button
            onClick={handleDelete}
            style={{
              backgroundColor: 'var(--red-color)',
              color: 'var(--text-primary)',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <FaTrash style={{ color: '#182d40' }} />
            حذف
          </button>
        </div>
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
              color: 'var(--text-primary)', 
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
              color: 'var(--text-primary)', 
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
                  color: 'var(--text-primary)',
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
                  color: 'var(--text-primary)',
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

export default LeaveRequestDetails;
