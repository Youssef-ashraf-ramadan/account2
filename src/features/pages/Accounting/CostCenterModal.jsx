import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addCostCenter, updateCostCenter, clearError, clearSuccess } from '../../../redux/Slices/authSlice';
import { toast } from 'react-toastify';

const CostCenterModal = ({ isOpen, onClose, mode, parentCostCenter = null, costCenterData = null, onSuccess }) => {
  const dispatch = useDispatch();
  const { isLoading, success, error } = useSelector((state) => state.auth);
  const lastErrorRef = useRef({ message: null, time: 0 });
  const lastSuccessRef = useRef({ message: null, time: 0 });

  const [formData, setFormData] = useState({
    name_en: '',
    name_ar: '',
    code: '',
    is_active: true,
    parent_id: null
  });

  useEffect(() => {
    if (mode === 'edit' && costCenterData) {
      setFormData({
        name_en: costCenterData.name_en || '',
        name_ar: costCenterData.name_ar || costCenterData.name || '',
        code: costCenterData.code || '',
        is_active: costCenterData.is_active !== undefined ? costCenterData.is_active : true,
        parent_id: costCenterData.parent_id || null
      });
    } else if (mode === 'add' && parentCostCenter) {
      setFormData({
        name_en: '',
        name_ar: '',
        code: '',
        is_active: true,
        parent_id: parentCostCenter.id
      });
    } else {
      setFormData({
        name_en: '',
        name_ar: '',
        code: '',
        is_active: true,
        parent_id: null
      });
    }
  }, [mode, costCenterData, parentCostCenter]);

  useEffect(() => {
    if (!isOpen) return;
    if (success) {
      const now = Date.now();
      const last = lastSuccessRef.current;
      if (!last.message || last.message !== success || now - last.time > 2000) {
        toast.success(success, { rtl: true });
        lastSuccessRef.current = { message: success, time: now };
        setTimeout(() => {
          dispatch(clearSuccess());
          onSuccess();
          onClose();
        }, 1500);
      }
    }
  }, [success, isOpen, onSuccess, onClose, dispatch]);

  useEffect(() => {
    if (!error || !isOpen) return;
    
    const now = Date.now();
    const last = lastErrorRef.current;
    const errorMessage = typeof error === 'object' && error !== null 
      ? (error.message || JSON.stringify(error))
      : error;
    
    if (!last.message || last.message !== errorMessage || now - last.time > 2000) {
      toast.error(errorMessage, { rtl: true });
      lastErrorRef.current = { message: errorMessage, time: now };
    }
    
    const timer = setTimeout(() => {
      dispatch(clearError());
    }, 3000);
    return () => clearTimeout(timer);
  }, [error, isOpen, dispatch]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      name_en: formData.name_en,
      name_ar: formData.name_ar,
      code: formData.code,
      is_active: formData.is_active,
      parent_id: formData.parent_id || null
    };

    if (mode === 'add') {
      dispatch(addCostCenter(data));
    } else if (mode === 'edit') {
      dispatch(updateCostCenter({ id: costCenterData.id, data }));
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
          {mode === 'add' ? 'إضافة مركز تكلفة جديد' : 'تعديل مركز التكلفة'}
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
              الكود
            </label>
            <input
              type="text"
              name="code"
              value={formData.code}
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

          {mode === 'edit' && (
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff', fontSize: '14px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  style={{
                    width: '18px',
                    height: '18px',
                    cursor: 'pointer'
                  }}
                />
                نشط
              </label>
            </div>
          )}

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

export default CostCenterModal;
