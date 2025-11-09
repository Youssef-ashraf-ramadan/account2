import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  getFinancialPeriodDetails, 
  updateFinancialPeriod, 
  clearFinancialPeriodDetails, 
  clearError, 
  clearSuccess 
} from '../../../../redux/Slices/authSlice';

const EditFinancialPeriod = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { financialPeriodDetails, isLoading, error, success } = useSelector((state) => state.auth);
  const [form, setForm] = useState(null);
  const lastErrorRef = useRef({ message: null, time: 0 });
  const lastSuccessRef = useRef({ message: null, time: 0 });

  useEffect(() => {
    dispatch(getFinancialPeriodDetails(id));
    return () => {
      dispatch(clearFinancialPeriodDetails());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (financialPeriodDetails) {
      setForm({
        name: financialPeriodDetails.name || '',
        start_date: financialPeriodDetails.start_date || '',
        end_date: financialPeriodDetails.end_date || '',
        status: financialPeriodDetails.status || 'Open'
      });
    }
  }, [financialPeriodDetails]);

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
        navigate('/financial-periods');
      }, 1200);
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

  const handleChange = (field, value) => {
    setForm((prev) => prev ? ({ ...prev, [field]: value }) : prev);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form) return;
    if (!form.name || !form.start_date || !form.end_date) {
      toast.error('برجاء ملء جميع الحقول المطلوبة', { rtl: true });
      return;
    }
    if (form.end_date < form.start_date) {
      toast.error('تاريخ النهاية يجب أن يكون بعد أو مساوي لتاريخ البداية', { rtl: true });
      return;
    }
    dispatch(updateFinancialPeriod({ id, periodData: form }));
  };

  if (!form) {
    return (
      <div style={{ padding: '30px', backgroundColor: 'var(--dashboard-bg)', minHeight: 'calc(100vh - 80px)', color: '#182d40', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>
        جاري التحميل...
      </div>
    );
  }

  return (
    <div style={{ padding: '30px', backgroundColor: 'var(--dashboard-bg)', minHeight: 'calc(100vh - 80px)', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '30px', color: 'var(--text-primary)', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>
        تعديل الفترة المالية
      </h1>
      <form onSubmit={handleSubmit} style={{ backgroundColor: 'var(--basic-color)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '32px', width: '100%', maxWidth: '720px' }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold', color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>
            اسم الفترة <span style={{ color: 'var(--red-color)' }}>*</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
            style={{ width: '100%', padding: '12px', backgroundColor: 'var(--basic-color)', border: '1px solid var(--border-color)', borderRadius: '8px', color: '#182d40', boxSizing: 'border-box', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 240px', marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold', color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>
              تاريخ البداية <span style={{ color: 'var(--red-color)' }}>*</span>
            </label>
            <input
              type="date"
              value={form.start_date}
              onChange={(e) => handleChange('start_date', e.target.value)}
              required
              style={{ width: '100%', padding: '12px', backgroundColor: 'var(--basic-color)', border: '1px solid var(--border-color)', borderRadius: '8px', color: '#182d40', boxSizing: 'border-box', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}
            />
          </div>
          <div style={{ flex: '1 1 240px', marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold', color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>
              تاريخ النهاية <span style={{ color: 'var(--red-color)' }}>*</span>
            </label>
            <input
              type="date"
              value={form.end_date}
              onChange={(e) => handleChange('end_date', e.target.value)}
              required
              style={{ width: '100%', padding: '12px', backgroundColor: 'var(--basic-color)', border: '1px solid var(--border-color)', borderRadius: '8px', color: '#182d40', boxSizing: 'border-box', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}
            />
          </div>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold', color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>
            الحالة <span style={{ color: 'var(--red-color)' }}>*</span>
          </label>
          <select
            value={form.status}
            onChange={(e) => handleChange('status', e.target.value)}
            required
            style={{ width: '100%', padding: '12px', backgroundColor: 'var(--basic-color)', border: '1px solid var(--border-color)', borderRadius: '8px', color: '#182d40', boxSizing: 'border-box', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}
          >
            <option value="Open">مفتوحة</option>
            <option value="Closed">مغلقة</option>
          </select>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '24px' }}>
          <button
            type="button"
            onClick={() => navigate('/financial-periods')}
            style={{ background: 'var(--gray-color)', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 16px', cursor: 'pointer', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}
          >
            إلغاء
          </button>
          <button
            type="submit"
            disabled={isLoading}
            style={{ background: isLoading ? 'var(--gray-color)' : 'var(--main-color)', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 16px', cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.7 : 1, fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}
          >
            {isLoading ? 'جاري الحفظ...' : 'حفظ التعديلات'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditFinancialPeriod;


