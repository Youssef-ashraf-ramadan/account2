import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { generatePayslip, getEmployees, clearError, clearSuccess } from '../../../../redux/Slices/authSlice';
import { FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';

const GeneratePayslip = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { employees, isLoading, error, success } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    employee_id: '',
    year: '',
    month: ''
  });

  useEffect(() => {
    dispatch(getEmployees());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      toast.success(success, { rtl: true });
      dispatch(clearSuccess());
      navigate('/payslips');
    }
    if (error) {
      toast.error(error, { rtl: true });
      dispatch(clearError());
    }
  }, [success, error, dispatch, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.employee_id) {
      toast.error('يرجى اختيار الموظف', { rtl: true });
      return;
    }
    
    if (!formData.year) {
      toast.error('يرجى إدخال السنة', { rtl: true });
      return;
    }


    const payslipData = {
      employee_id: parseInt(formData.employee_id),
      year: parseInt(formData.year),
      month: parseInt(formData.month)
    };

    dispatch(generatePayslip(payslipData));
  };


  return (
    <div style={{ 
      padding: '30px',
      backgroundColor: 'var(--dashboard-bg)',
      minHeight: 'calc(100vh - 80px)',
      color: '#182d40'
    }}>
      {/* العنوان */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '15px',
          marginBottom: '20px'
        }}>
          <button
            onClick={() => navigate('/payslips')}
            style={{
              backgroundColor: 'var(--gray-color)',
              color: 'white',
              border: 'none',
              padding: '10px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
              fontWeight: 'bold'
            }}
          >
            <FaArrowLeft style={{ color: 'white' }} />
            العودة
          </button>
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold',
            color: '#182d40',
            margin: 0,
            fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
          }}>
            توليد كشف راتب
          </h1>
        </div>
      </div>

      {/* النموذج */}
      <div style={{
        backgroundColor: 'var(--basic-color)',
        borderRadius: '12px',
        padding: '30px',
        border: '1px solid var(--border-color)',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <form onSubmit={handleSubmit}>
          {/* الموظف */}
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
              name="employee_id"
              value={formData.employee_id}
              onChange={handleInputChange}
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

          {/* السنة */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              color: '#182d40',
              fontWeight: '500',
              fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
            }}>
              السنة *
            </label>
            <input
              type="month"
              name="year"
              value={formData.year ? `${formData.year}-${formData.month?.padStart(2, '0') || '01'}` : ''}
              onChange={(e) => {
                const [year, month] = e.target.value.split('-');
                setFormData(prev => ({
                  ...prev,
                  year: year,
                  month: month
                }));
              }}
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
              className="month-input-white"
            />
          </div>


          {/* أزرار الإجراء */}
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => navigate('/payslips')}
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
              type="submit"
              disabled={isLoading}
              style={{
                backgroundColor: isLoading ? 'var(--gray-color)' : 'var(--main-color)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                opacity: isLoading ? 0.6 : 1,
                fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
              }}
            >
              {isLoading ? 'جاري التوليد...' : 'توليد كشف الراتب'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GeneratePayslip;

