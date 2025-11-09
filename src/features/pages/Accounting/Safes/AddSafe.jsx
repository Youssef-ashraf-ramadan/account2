import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addSafe, clearError, clearSuccess } from '../../../../redux/Slices/authSlice';
import { FaArrowRight } from 'react-icons/fa';
import { toast } from 'react-toastify';

const AddSafe = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, success } = useSelector((state) => state.auth);
  const lastErrorRef = useRef({ message: null, time: 0 });
  const lastSuccessRef = useRef({ message: null, time: 0 });

  const [formData, setFormData] = useState({
    name_en: '',
    name_ar: '',
    is_active: true,
    notes: ''
  });

  useEffect(() => {
    if (success) {
      const now = Date.now();
      const last = lastSuccessRef.current;
      if (!last.message || last.message !== success || now - last.time > 2000) {
        toast.success(success, { rtl: true });
        lastSuccessRef.current = { message: success, time: now };
      }
      setTimeout(() => {
        dispatch(clearSuccess());
        navigate('/safes');
      }, 1500);
    }
  }, [success, dispatch, navigate]);

  useEffect(() => {
    if (error) {
      const now = Date.now();
      const last = lastErrorRef.current;
      if (!last.message || last.message !== error || now - last.time > 2000) {
        toast.error(error, { rtl: true });
        lastErrorRef.current = { message: error, time: now };
      }
      setTimeout(() => dispatch(clearError()), 3000);
    }
  }, [error, dispatch]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      is_active: formData.is_active ? true : false
    };
    dispatch(addSafe(submitData));
  };

  return (
    <div style={{ 
      padding: '30px',
      backgroundColor: 'var(--dashboard-bg)',
      minHeight: 'calc(100vh - 80px)',
      color: 'var(--text-primary)'
    }}>
      <div style={{ marginBottom: '30px' }}>
        <button
          onClick={() => navigate('/safes')}
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
            marginBottom: '20px',
            fontSize: '14px',
            fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
            fontWeight: 'bold'
          }}
        >
          <FaArrowRight style={{ color: 'white' }} />
          الرجوع
        </button>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: 'var(--text-primary)', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>إضافة خزنة جديدة</h1>
      </div>
      
      <form onSubmit={handleSubmit} style={{ 
        backgroundColor: 'var(--basic-color)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        padding: '32px',
        width: '100%',
        maxWidth: '900px'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold', color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>
              الاسم بالإنجليزية <span style={{ color: 'var(--red-color)' }}>*</span>
            </label>
            <input
              type="text"
              name="name_en"
              value={formData.name_en}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: 'var(--basic-color)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                color: '#182d40',
                fontSize: '14px',
                boxSizing: 'border-box',
                fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold', color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>
              الاسم بالعربية <span style={{ color: 'var(--red-color)' }}>*</span>
            </label>
            <input
              type="text"
              name="name_ar"
              value={formData.name_ar}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: 'var(--basic-color)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                color: '#182d40',
                fontSize: '14px',
                boxSizing: 'border-box',
                fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              style={{
                width: '20px',
                height: '20px',
                cursor: 'pointer'
              }}
            />
            <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#182d40', cursor: 'pointer', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>
              نشط
            </label>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold', color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>
            ملاحظات
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="4"
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: 'var(--basic-color)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              color: 'var(--text-primary)',
              fontSize: '14px',
              boxSizing: 'border-box',
              resize: 'vertical'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '30px' }}>
          <button
            type="button"
            onClick={() => navigate('/safes')}
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
              opacity: isLoading ? 0.7 : 1,
              fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
            }}
          >
            {isLoading ? 'جاري الحفظ...' : 'حفظ'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSafe;

