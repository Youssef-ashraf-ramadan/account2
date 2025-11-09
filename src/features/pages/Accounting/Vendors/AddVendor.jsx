import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addVendor, clearError, clearSuccess } from '../../../../redux/Slices/authSlice';
import { toast } from 'react-toastify';

const AddVendor = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, success } = useSelector((state) => state.auth);
  const lastErrorRef = useRef({ message: null, time: 0 });
  const lastSuccessRef = useRef({ message: null, time: 0 });

  const [formData, setFormData] = useState({
    name_en: '',
    name_ar: '',
    contact_person: '',
    email: '',
    phone: '',
    address: '',
    tax_number: ''
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
        navigate('/vendors');
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
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addVendor(formData));
  };

  return (
    <div style={{ 
      padding: '30px',
      backgroundColor: 'var(--dashboard-bg)',
      minHeight: 'calc(100vh - 80px)',
      color: 'var(--text-primary)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '30px', color: 'var(--text-primary)', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>إضافة مورد جديد</h1>
      
      <form onSubmit={handleSubmit} style={{ 
        backgroundColor: 'var(--basic-color)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        padding: '32px',
        width: '100%',
        maxWidth: '750px'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
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

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold', color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>
              الشخص المسؤول
            </label>
            <input
              type="text"
              name="contact_person"
              value={formData.contact_person}
              onChange={handleChange}
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
              البريد الإلكتروني
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
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
              الهاتف
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
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
              الرقم الضريبي
            </label>
            <input
              type="text"
              name="tax_number"
              value={formData.tax_number}
              onChange={handleChange}
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

          <div style={{ gridColumn: '1 / span 2' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold', color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>
              العنوان
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
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
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '24px' }}>
          <button
            type="button"
            onClick={() => navigate('/vendors')}
            style={{
              padding: '12px 24px',
              backgroundColor: 'var(--gray-color)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
            }}
          >
            إلغاء
          </button>
          <button
            type="submit"
            disabled={isLoading}
            style={{
              padding: '12px 24px',
              backgroundColor: isLoading ? 'var(--gray-color)' : 'var(--main-color)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: isLoading ? 'not-allowed' : 'pointer',
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

export default AddVendor;

