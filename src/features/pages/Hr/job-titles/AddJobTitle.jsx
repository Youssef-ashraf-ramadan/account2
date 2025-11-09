import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addPosition, clearError, clearSuccess } from '../../../../redux/Slices/authSlice';
import { FaArrowLeft, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';

const AddJobTitle = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, error, success } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name_en: '',
    name_ar: '',
    description_en: '',
    description_ar: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name_en || !formData.name_ar || !formData.description_en || !formData.description_ar) {
      toast.error('جميع الحقول مطلوبة', { rtl: true });
      return;
    }
    await dispatch(addPosition(formData));
  };

  React.useEffect(() => {
    if (success) {
      toast.success(success, { rtl: true });
      // Navigate after showing toast
      setTimeout(() => {
        navigate('/job-titles');
        dispatch(clearSuccess());
      }, 1500);
    }
    if (error) {
      toast.error(error, { rtl: true });
      // Clear error after showing toast
      setTimeout(() => {
        dispatch(clearError());
      }, 100);
    }
  }, [success, error, navigate, dispatch]);

  const handleCancel = () => {
    navigate('/job-titles');
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
        <button
          onClick={() => navigate('/job-titles')}
          style={{
            backgroundColor: 'var(--gray-color)',
            color: 'white',
            border: 'none',
            padding: '10px',
            borderRadius: '8px',
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '20px',
            fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
            fontWeight: 'bold'
          }}
        >
          <FaArrowLeft style={{ color: 'white' }} />
          الرجوع
        </button>
        
        <h1 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold',
          color: '#182d40',
          margin: 0,
          fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
        }}>
          إضافة مسمى وظيفي جديد
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {/* الاسم بالعربية */}
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                color: '#182d40',
                fontWeight: '500',
                fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
              }}>
                الاسم بالعربية
              </label>
              <input
                type="text"
                name="name_ar"
                value={formData.name_ar}
                onChange={handleInputChange}
                placeholder="اسم المسمى الوظيفي"
                required
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

            {/* الاسم بالإنجليزية */}
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                color: '#182d40',
                fontWeight: '500',
                fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
              }}>
                الاسم بالإنجليزية
              </label>
              <input
                type="text"
                name="name_en"
                value={formData.name_en}
                onChange={handleInputChange}
                placeholder="Position Name in English"
                required
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

            {/* الوصف بالعربية */}
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                color: '#182d40',
                fontWeight: '500',
                fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
              }}>
                الوصف بالعربية
              </label>
              <textarea
                name="description_ar"
                value={formData.description_ar}
                onChange={handleInputChange}
                placeholder="وصف المسمى الوظيفي"
                required
                rows={3}
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

            {/* الوصف بالإنجليزية */}
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                color: '#182d40',
                fontWeight: '500',
                fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
              }}>
                الوصف بالإنجليزية
              </label>
              <textarea
                name="description_en"
                value={formData.description_en}
                onChange={handleInputChange}
                placeholder="Position description in English"
                required
                rows={3}
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
                backgroundColor: isLoading ? 'var(--gray-color)' : 'var(--main-color)',
                color: 'white',
                border: 'none',
                padding: '12px 30px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                opacity: isLoading ? 0.6 : 1
              }}
            >
              <FaPlus style={{ color: 'white' }} />
              {isLoading ? 'جاري الإضافة...' : 'إضافة'}
            </button>
            
            <button
              type="button"
              onClick={handleCancel}
              style={{
                backgroundColor: 'var(--gray-color)',
                color: 'white',
                border: 'none',
                padding: '12px 30px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
              }}
            >
              الغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddJobTitle;
