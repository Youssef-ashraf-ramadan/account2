import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getCurrencyDetails, updateCurrency, clearError, clearSuccess } from '../../../../redux/Slices/authSlice';
import { toast } from 'react-toastify';

const EditCurrency = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { currencyDetails, isLoading, error, success } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ name_en: '', name_ar: '', code: '', symbol: '', is_base_currency: false });
  const lastErrorRef = useRef({ message: null, time: 0 });
  const lastSuccessRef = useRef({ message: null, time: 0 });

  useEffect(() => {
    if (id) dispatch(getCurrencyDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (currencyDetails) {
      setForm({
        name_en: currencyDetails.name_en || currencyDetails.name || '',
        name_ar: currencyDetails.name_ar || currencyDetails.name || '',
        code: currencyDetails.code || '',
        symbol: currencyDetails.symbol || '',
        is_base_currency: currencyDetails.is_base_currency || false
      });
    }
  }, [currencyDetails]);

  useEffect(() => {
    if (success) {
      const now = Date.now();
      const last = lastSuccessRef.current;
      if (!last.message || last.message !== success || now - last.time > 2000) {
        toast.success(success, { rtl: true });
        lastSuccessRef.current = { message: success, time: now };
        setTimeout(() => {
          dispatch(clearSuccess());
          navigate('/currencies');
        }, 1500);
      }
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

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateCurrency({ id, data: form }));
  };

  if (isLoading && !currencyDetails) {
    return (
      <div style={{ padding: '30px', backgroundColor: 'var(--dashboard-bg)', minHeight: 'calc(100vh - 80px)', color: '#182d40', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>
        جاري التحميل...
      </div>
    );
  }

  return (
    <div style={{ padding: '30px', backgroundColor: 'var(--dashboard-bg)', minHeight: 'calc(100vh - 80px)', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '30px', color: 'var(--text-primary)', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>تعديل العملة</h1>
      <form onSubmit={handleSubmit} style={{ backgroundColor: 'var(--basic-color)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '32px', width: '100%', maxWidth: '750px' }}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold', color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>الاسم بالإنجليزية <span style={{ color: 'var(--red-color)' }}>*</span></label>
          <input
            type="text"
            value={form.name_en}
            onChange={(e) => setForm({ ...form, name_en: e.target.value })}
            required
            style={{ width: '100%', padding: '12px', backgroundColor: 'var(--basic-color)', border: '1px solid var(--border-color)', borderRadius: '8px', color: '#182d40', boxSizing: 'border-box', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}
          />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold', color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>الاسم بالعربية <span style={{ color: 'var(--red-color)' }}>*</span></label>
          <input
            type="text"
            value={form.name_ar}
            onChange={(e) => setForm({ ...form, name_ar: e.target.value })}
            required
            style={{ width: '100%', padding: '12px', backgroundColor: 'var(--basic-color)', border: '1px solid var(--border-color)', borderRadius: '8px', color: '#182d40', boxSizing: 'border-box', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}
          />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold', color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>الكود <span style={{ color: 'var(--red-color)' }}>*</span></label>
          <input
            type="text"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
            required
            style={{ width: '100%', padding: '12px', backgroundColor: 'var(--basic-color)', border: '1px solid var(--border-color)', borderRadius: '8px', color: '#182d40', boxSizing: 'border-box', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}
          />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold', color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>الرمز <span style={{ color: 'var(--red-color)' }}>*</span></label>
          <input
            type="text"
            value={form.symbol}
            onChange={(e) => setForm({ ...form, symbol: e.target.value })}
            required
            style={{ width: '100%', padding: '12px', backgroundColor: 'var(--basic-color)', border: '1px solid var(--border-color)', borderRadius: '8px', color: '#182d40', boxSizing: 'border-box', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={form.is_base_currency}
              onChange={(e) => setForm({ ...form, is_base_currency: e.target.checked })}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '14px', color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>عملة أساسية</span>
          </label>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '24px' }}>
          <button type="button" onClick={() => navigate('/currencies')} style={{ background: 'var(--gray-color)', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 16px', cursor: 'pointer', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>إلغاء</button>
          <button type="submit" disabled={isLoading} style={{ background: isLoading ? 'var(--gray-color)' : 'var(--main-color)', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 16px', cursor: 'pointer', opacity: isLoading ? 0.7 : 1, fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>{isLoading ? 'جاري الحفظ...' : 'حفظ'}</button>
        </div>
      </form>
    </div>
  );
};

export default EditCurrency;

