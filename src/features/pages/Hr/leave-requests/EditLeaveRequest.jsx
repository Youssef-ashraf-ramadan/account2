import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getLeaveRequestDetails, updateLeaveRequest, getEmployees, getLeaveTypes, clearError, clearSuccess } from '../../../../redux/Slices/authSlice';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import { toast } from 'react-toastify';

const EditLeaveRequest = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { leaveRequestDetails, employees, leaveTypes, isLoading, error, success } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    employee_id: '',
    leave_type_id: '',
    start_date: '',
    end_date: '',
    reason: ''
  });

  useEffect(() => {
    if (id) {
      dispatch(getLeaveRequestDetails(id));
    }
    dispatch(getEmployees());
    dispatch(getLeaveTypes());
  }, [id, dispatch]);

  useEffect(() => {
    if (leaveRequestDetails) {
      setFormData({
        employee_id: leaveRequestDetails.employee?.id || '',
        leave_type_id: leaveRequestDetails.leave_type?.id || '',
        start_date: leaveRequestDetails.start_date ? leaveRequestDetails.start_date.split('T')[0] : '',
        end_date: leaveRequestDetails.end_date ? leaveRequestDetails.end_date.split('T')[0] : '',
        reason: leaveRequestDetails.reason || ''
      });
    }
  }, [leaveRequestDetails]);

  useEffect(() => {
    if (success) {
      toast.success(success, { rtl: true });
      dispatch(clearSuccess());
      navigate('/leave-requests');
    }
    if (error) {
      toast.error(error, { rtl: true });
      dispatch(clearError());
    }
  }, [success, error, navigate, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.employee_id || !formData.leave_type_id || !formData.start_date || !formData.end_date) {
      toast.error('جميع الحقول المطلوبة يجب ملؤها', { rtl: true });
      return;
    }
    
    // Validate dates
    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);
    
    if (startDate >= endDate) {
      toast.error('تاريخ البداية يجب أن يكون قبل تاريخ النهاية', { rtl: true });
      return;
    }
    
    await dispatch(updateLeaveRequest({ id, leaveRequestData: formData }));
  };

  const handleCancel = () => {
    navigate('/leave-requests');
  };

  if (isLoading && !leaveRequestDetails) {
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
          تعديل طلب الإجازة
        </h1>
      </div>

      {/* النموذج */}
      <div style={{
        backgroundColor: 'var(--basic-color)',
        borderRadius: '12px',
        padding: '30px',
        border: '1px solid var(--border-color)'
      }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
            {/* العمود الأيسر */}
            <div style={{ flex: '1', minWidth: '300px' }}>
              {/* الموظف */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  color: 'var(--text-primary)',
                  fontWeight: '500'
                }}>
                  الموظف *
                </label>
                <select
                  name="employee_id"
                  value={formData.employee_id}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    backgroundColor: 'var(--basic-color)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    fontSize: '14px'
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

              {/* نوع الإجازة */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  color: 'var(--text-primary)',
                  fontWeight: '500'
                }}>
                  نوع الإجازة *
                </label>
                <select
                  name="leave_type_id"
                  value={formData.leave_type_id}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    backgroundColor: 'var(--basic-color)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    fontSize: '14px'
                  }}
                >
                  <option value="" style={{ backgroundColor: 'var(--basic-color)' }}>اختر نوع الإجازة</option>
                  {leaveTypes?.map(leaveType => (
                    <option key={leaveType.id} value={leaveType.id} style={{ backgroundColor: 'var(--basic-color)' }}>
                      {leaveType.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* العمود الأيمن */}
            <div style={{ flex: '1', minWidth: '300px' }}>
              {/* تاريخ البداية */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  color: 'var(--text-primary)',
                  fontWeight: '500'
                }}>
                  تاريخ البداية *
                </label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    backgroundColor: 'var(--basic-color)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    fontSize: '14px',
                    colorScheme: 'dark'
                  }}
                />
              </div>

              {/* تاريخ النهاية */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  color: 'var(--text-primary)',
                  fontWeight: '500'
                }}>
                  تاريخ النهاية *
                </label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 15px',
                    backgroundColor: 'var(--basic-color)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    fontSize: '14px',
                    colorScheme: 'dark'
                  }}
                />
              </div>
            </div>
          </div>

          {/* السبب - col-12 */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              color: 'var(--text-primary)',
              fontWeight: '500'
            }}>
              السبب
            </label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              placeholder="أدخل سبب الإجازة"
              rows="4"
              style={{
                width: '100%',
                padding: '12px 15px',
                backgroundColor: 'var(--basic-color)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                fontSize: '14px',
                resize: 'vertical'
              }}
            />
          </div>

          {/* أزرار الإجراء */}
          <div style={{ 
            display: 'flex', 
            gap: '15px', 
            marginTop: '30px',
            justifyContent: 'center'
          }}>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                backgroundColor: isLoading ? '#666' : '#AC2000',
                color: 'var(--text-primary)',
                border: 'none',
                padding: '12px 30px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                opacity: isLoading ? 0.6 : 1
              }}
            >
              {isLoading ? (
                <>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid white',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  جاري التحديث...
                </>
              ) : (
                <>
                  <FaSave style={{ color: '#182d40' }} />
                  حفظ التغييرات
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={handleCancel}
              style={{
                backgroundColor: '#666',
                color: 'var(--text-primary)',
                border: 'none',
                padding: '12px 30px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default EditLeaveRequest;
