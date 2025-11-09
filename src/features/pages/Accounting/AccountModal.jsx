import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addAccount, updateAccount, clearError, clearSuccess } from '../../../redux/Slices/authSlice';
import { toast } from 'react-toastify';

const AccountModal = ({ isOpen, onClose, mode, parentAccount = null, accountData = null, onSuccess }) => {
  const dispatch = useDispatch();
  const { isLoading, success, error } = useSelector((state) => state.auth);
  const lastErrorRef = useRef({ message: null, time: 0 });
  const lastSuccessRef = useRef({ message: null, time: 0 });

  const [formData, setFormData] = useState({
    name_en: '',
    name_ar: '',
    code: '',
    type: '',
    category: '',
    parent_id: null
  });

  useEffect(() => {
    if (mode === 'edit' && accountData) {
      setFormData({
        name_en: accountData.name_en || '',
        name_ar: accountData.name_ar || accountData.name || '',
        code: accountData.code || '',
        type: accountData.type || '',
        category: accountData.category || '',
        parent_id: accountData.parent_id || null
      });
    } else if (mode === 'add' && parentAccount) {
      setFormData({
        name_en: '',
        name_ar: '',
        code: '',
        type: parentAccount.type || '',
        category: '',
        parent_id: parentAccount.id
      });
    }
  }, [mode, accountData, parentAccount]);

  useEffect(() => {
    // Show success toast only when modal is open (add/edit flows)
    if (!isOpen) return;
    if (success) {
      const now = Date.now();
      const last = lastSuccessRef.current;
      // Only show toast if it's a different message or enough time has passed
      if (!last.message || last.message !== success || now - last.time > 2000) {
        toast.success(success, { rtl: true });
        lastSuccessRef.current = { message: success, time: now };
        // Clear success and close modal after showing toast
        setTimeout(() => {
          dispatch(clearSuccess());
          onSuccess();
          onClose();
        }, 1500);
      }
    }
  }, [success, isOpen, onSuccess, onClose, dispatch]);

  useEffect(() => {
    // Only show error toast when modal is open and user is trying to add/edit
    if (!error || !isOpen) return;
    
    const now = Date.now();
    const last = lastErrorRef.current;
    // Handle error if it's an object with message property
    const errorMessage = typeof error === 'object' && error !== null 
      ? (error.message || JSON.stringify(error))
      : error;
    
    // Only show toast if it's a different message or enough time has passed
    if (!last.message || last.message !== errorMessage || now - last.time > 2000) {
      toast.error(errorMessage, { rtl: true });
      lastErrorRef.current = { message: errorMessage, time: now };
    }
    
    // Clear error after showing toast
    const timer = setTimeout(() => {
      dispatch(clearError());
    }, 3000);
    return () => clearTimeout(timer);
  }, [error, isOpen, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      parent_id: formData.parent_id || undefined
    };

    if (mode === 'add') {
      dispatch(addAccount(data));
    } else if (mode === 'edit') {
      dispatch(updateAccount({ accountId: accountData.id, accountData: data }));
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 999999
    }} onClick={onClose}>
      <div style={{
        background: '#1f2937',
        padding: '2rem',
        borderRadius: '12px',
        width: '90%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflow: 'auto',
        position: 'relative'
      }} onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            background: 'transparent',
            border: 'none',
            color: '#9ca3af',
            cursor: 'pointer',
            fontSize: '24px',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#374151';
            e.target.style.color = '#fff';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent';
            e.target.style.color = '#9ca3af';
          }}
        >
          ×
        </button>
        <h2 style={{ color: '#fff', marginBottom: '1.5rem', fontSize: '18px', textAlign: 'center' }}>
          {mode === 'add' ? 'إضافة حساب جديد' : 'تعديل الحساب'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', color: '#fff', marginBottom: '0.5rem', fontSize: '14px' }}>
              الاسم بالإنجليزية
            </label>
            <input
              type="text"
              name="name_en"
              value={formData.name_en}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                background: '#374151',
                border: '1px solid #4b5563',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px'
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', color: '#fff', marginBottom: '0.5rem', fontSize: '14px' }}>
              الاسم بالعربية
            </label>
            <input
              type="text"
              name="name_ar"
              value={formData.name_ar}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                background: '#374151',
                border: '1px solid #4b5563',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px'
              }}
            />
          </div>


          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', color: '#fff', marginBottom: '0.5rem', fontSize: '14px' }}>
              النوع
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                background: '#374151',
                border: '1px solid #4b5563',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px',
                WebkitAppearance: 'none',
                MozAppearance: 'none',
                appearance: 'none',
                backgroundImage: "url('data:image/svg+xml;utf8,\
<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"10\" height=\"10\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"white\" stroke-width=\"3\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\
<polyline points=\"6 9 12 15 18 9\"/>\
</svg>')",
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'left 12px center',
                backgroundSize: '10px 10px',
                paddingLeft: '2rem'
              }}
            >
              <option value="">اختر النوع</option>
              <option value="Asset">Asset</option>
              <option value="Liability">Liability</option>
              <option value="Equity">Equity</option>
              <option value="Revenue">Revenue</option>
              <option value="Expense">Expense</option>
            </select>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', color: '#fff', marginBottom: '0.5rem', fontSize: '14px' }}>
              الفئة
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                background: '#374151',
                border: '1px solid #4b5563',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px',
                WebkitAppearance: 'none',
                MozAppearance: 'none',
                appearance: 'none',
                backgroundImage: "url('data:image/svg+xml;utf8,\
<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"10\" height=\"10\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"white\" stroke-width=\"3\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\
<polyline points=\"6 9 12 15 18 9\"/>\
</svg>')",
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'left 12px center',
                backgroundSize: '10px 10px',
                paddingLeft: '2rem'
              }}
            >
              <option value="">اختر الفئة</option>
              <option value="heading">heading</option>
              <option value="sub_account">sub_account</option>
              <option value="normal">normal</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '0.75rem',
                background: '#374151',
                border: '1px solid #4b5563',
                borderRadius: '8px',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '0.75rem',
                background: '#AC2000',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontSize: '14px'
              }}
            >
              {isLoading ? 'جاري الحفظ...' : 'حفظ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountModal;

