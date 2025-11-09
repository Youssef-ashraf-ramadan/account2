import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getLeaveTypeDetails, deleteLeaveType, clearError, clearSuccess } from '../../../../redux/Slices/authSlice';
import { FaArrowLeft, FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';

const VacationDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { leaveTypeDetails, isLoading, error, success } = useSelector((state) => state.auth);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(getLeaveTypeDetails(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (success) {
      toast.success(success, { rtl: true });
      dispatch(clearSuccess());
      navigate('/vacations');
    }
    if (error) {
      toast.error(error, { rtl: true });
      dispatch(clearError());
    }
  }, [success, error, navigate, dispatch]);

  const handleEdit = () => {
    navigate(`/vacations/edit/${id}`);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    dispatch(deleteLeaveType(id));
    setShowDeleteModal(false);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
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

  if (!leaveTypeDetails) {
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
          onClick={() => navigate('/vacations')}
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
          تفاصيل نوع الإجازة
        </h1>
      </div>

      {/* تفاصيل الإجازة */}
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
                الاسم بالعربي
              </label>
              <div style={{
                padding: '12px 15px',
                backgroundColor: 'var(--basic-color)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                fontSize: '16px'
              }}>
                {leaveTypeDetails.name_ar || leaveTypeDetails.name || 'غير محدد'}
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
                الاسم بالإنجليزي
              </label>
              <div style={{
                padding: '12px 15px',
                backgroundColor: 'var(--basic-color)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                fontSize: '16px'
              }}>
                {leaveTypeDetails.name_en || leaveTypeDetails.name || 'غير محدد'}
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
                الرصيد الافتراضي
              </label>
              <div style={{
                padding: '12px 15px',
                backgroundColor: 'var(--basic-color)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                fontSize: '16px'
              }}>
                {leaveTypeDetails.default_balance} يوم
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
                  backgroundColor: leaveTypeDetails.is_active ? '#28a745' : '#dc3545',
                  color: 'var(--text-primary)',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {leaveTypeDetails.is_active ? 'نشط' : 'غير نشط'}
                </span>
              </div>
            </div>
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
              هل أنت متأكد من حذف نوع الإجازة "{leaveTypeDetails.name_ar || leaveTypeDetails.name}"؟
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

export default VacationDetails;
