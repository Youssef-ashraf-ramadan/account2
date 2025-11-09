import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addSalary, getEmployees, clearError, clearSuccess } from '../../../../redux/Slices/authSlice';
import { FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';

const AddSalary = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { employees, isLoading, error, success } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    employee_id: '',
    base_salary: '',
    allowances: {
      housing: '',
      transportation: ''
    },
    deductions: {
      social_insurance: ''
    },
    effective_date: ''
  });

  useEffect(() => {
    dispatch(getEmployees());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      toast.success(success, { rtl: true });
      dispatch(clearSuccess());
      navigate('/salaries');
    }
    if (error) {
      toast.error(error, { rtl: true });
      dispatch(clearError());
    }
  }, [success, error, dispatch, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('allowances.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        allowances: {
          ...prev.allowances,
          [field]: value
        }
      }));
    } else if (name.startsWith('deductions.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        deductions: {
          ...prev.deductions,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.employee_id) {
      toast.error('يرجى اختيار الموظف', { rtl: true });
      return;
    }
    
    if (!formData.base_salary) {
      toast.error('يرجى إدخال الراتب الأساسي', { rtl: true });
      return;
    }

    if (parseFloat(formData.base_salary) < 0) {
      toast.error('الراتب الأساسي لا يمكن أن يكون سالباً', { rtl: true });
      return;
    }

    if (formData.allowances.housing && parseFloat(formData.allowances.housing) < 0) {
      toast.error('بدل السكن لا يمكن أن يكون سالباً', { rtl: true });
      return;
    }

    if (formData.allowances.transportation && parseFloat(formData.allowances.transportation) < 0) {
      toast.error('بدل المواصلات لا يمكن أن يكون سالباً', { rtl: true });
      return;
    }

    if (formData.deductions.social_insurance && parseFloat(formData.deductions.social_insurance) < 0) {
      toast.error('التأمين الاجتماعي لا يمكن أن يكون سالباً', { rtl: true });
      return;
    }

    if (!formData.effective_date) {
      toast.error('يرجى إدخال تاريخ السريان', { rtl: true });
      return;
    }

    // تحويل البيانات إلى الأرقام المطلوبة
    const salaryData = {
      employee_id: parseInt(formData.employee_id),
      base_salary: parseFloat(formData.base_salary),
      allowances: {
        housing: formData.allowances.housing ? parseFloat(formData.allowances.housing) : 0,
        transportation: formData.allowances.transportation ? parseFloat(formData.allowances.transportation) : 0
      },
      deductions: {
        social_insurance: formData.deductions.social_insurance ? parseFloat(formData.deductions.social_insurance) : 0
      },
      effective_date: formData.effective_date
    };

    dispatch(addSalary(salaryData));
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
            onClick={() => navigate('/salaries')}
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
            إضافة راتب جديد
          </h1>
        </div>
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
                  color: '#182d40',
                  fontWeight: 'bold',
                  fontSize: '14px',
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

              {/* الراتب الأساسي */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  color: '#182d40',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                }}>
                  الراتب الأساسي *
                </label>
                <input
                  type="number"
                  name="base_salary"
                  value={formData.base_salary}
                  onChange={handleInputChange}
                  min="0"
                  placeholder="أدخل الراتب الأساسي"
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
                />
              </div>

              {/* تاريخ السريان */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  color: '#182d40',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                }}>
                  تاريخ السريان *
                </label>
                <input
                  type="date"
                  name="effective_date"
                  value={formData.effective_date}
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
                />
              </div>
            </div>

            {/* العمود الأيمن */}
            <div style={{ flex: '1', minWidth: '300px' }}>
              {/* البدلات */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  color: '#182d40',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                }}>
                  البدلات
                </label>
                
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '5px', 
                    color: '#182d40',
                    fontSize: '12px',
                    fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                    fontWeight: 'bold',
                    opacity: 0.8
                  }}>
                    بدل السكن
                  </label>
                  <input
                    type="number"
                    name="allowances.housing"
                    value={formData.allowances.housing}
                    onChange={handleInputChange}
                    min="0"
                    placeholder="0"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      backgroundColor: 'var(--basic-color)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '6px',
                      color: '#182d40',
                      fontSize: '14px',
                      fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                    }}
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '5px', 
                    color: '#182d40',
                    fontSize: '12px',
                    fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                    fontWeight: 'bold',
                    opacity: 0.8
                  }}>
                    بدل المواصلات
                  </label>
                  <input
                    type="number"
                    name="allowances.transportation"
                    value={formData.allowances.transportation}
                    onChange={handleInputChange}
                    min="0"
                    placeholder="0"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      backgroundColor: 'var(--basic-color)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '6px',
                      color: '#182d40',
                      fontSize: '14px',
                      fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                    }}
                  />
                </div>
              </div>

              {/* الخصومات */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  color: '#182d40',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                }}>
                  الخصومات
                </label>
                
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '5px', 
                    color: '#182d40',
                    fontSize: '12px',
                    fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                    fontWeight: 'bold',
                    opacity: 0.8
                  }}>
                    التأمين الاجتماعي
                  </label>
                  <input
                    type="number"
                    name="deductions.social_insurance"
                    value={formData.deductions.social_insurance}
                    onChange={handleInputChange}
                    min="0"
                    placeholder="0"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      backgroundColor: 'var(--basic-color)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '6px',
                      color: '#182d40',
                      fontSize: '14px',
                      fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* أزرار الإجراء */}
          <div className="action-btns">
            <button
              type="button"
              onClick={() => navigate('/salaries')}
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
              {isLoading ? 'جاري الحفظ...' : 'حفظ الراتب'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSalary;