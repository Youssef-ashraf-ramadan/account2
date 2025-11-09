import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getCurrencyDetails } from '../../../../redux/Slices/authSlice';

const CurrencyDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { currencyDetails, isLoading } = useSelector((s) => s.auth);

  useEffect(() => {
    if (id) dispatch(getCurrencyDetails(id));
  }, [dispatch, id]);

  if (isLoading) {
    return (
      <div style={{ padding: '30px', backgroundColor: 'var(--dashboard-bg)', minHeight: 'calc(100vh - 80px)', color: '#182d40', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>
        جاري التحميل...
      </div>
    );
  }

  if (!currencyDetails) {
    return (
      <div style={{ padding: '30px', backgroundColor: 'var(--dashboard-bg)', minHeight: 'calc(100vh - 80px)', color: '#182d40' }}>
        <button onClick={() => navigate('/currencies')} style={{ background: 'var(--gray-color)', color: 'white', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', marginBottom: '12px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>رجوع</button>
        <p style={{ fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold', color: '#182d40' }}>لا توجد بيانات</p>
      </div>
    );
  }

  const c = currencyDetails.data || currencyDetails;

  return (
    <div style={{ padding: '30px', backgroundColor: 'var(--dashboard-bg)', minHeight: 'calc(100vh - 80px)', color: 'var(--text-primary)' }}>
      <button onClick={() => navigate('/currencies')} style={{ background: 'var(--gray-color)', color: 'white', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', marginBottom: '12px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>رجوع</button>
      <div style={{ backgroundColor: 'var(--basic-color)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--main-color)' }}>
          <strong style={{ fontSize: '18px', color: 'white', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>تفاصيل العملة #{c.id}</strong>
        </div>
        <div style={{ padding: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <div style={{ color: '#182d40', fontSize: '12px', marginBottom: '4px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold', opacity: 0.7 }}>الاسم بالإنجليزية</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>{c.name_en || c.name || '-'}</div>
            </div>
            <div>
              <div style={{ color: '#182d40', fontSize: '12px', marginBottom: '4px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold', opacity: 0.7 }}>الاسم بالعربية</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>{c.name_ar || c.name || '-'}</div>
            </div>
            <div>
              <div style={{ color: '#182d40', fontSize: '12px', marginBottom: '4px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold', opacity: 0.7 }}>الكود</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>{c.code || '-'}</div>
            </div>
            <div>
              <div style={{ color: '#182d40', fontSize: '12px', marginBottom: '4px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold', opacity: 0.7 }}>الرمز</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>{c.symbol || '-'}</div>
            </div>
            <div>
              <div style={{ color: '#182d40', fontSize: '12px', marginBottom: '4px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold', opacity: 0.7 }}>الحالة</div>
              <span style={{
                backgroundColor: c.is_active ? 'var(--main-color)' : 'var(--red-color)',
                color: 'white',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 'bold',
                display: 'inline-block',
                fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
              }}>
                {c.is_active ? 'نشط' : 'غير نشط'}
              </span>
            </div>
            <div>
              <div style={{ color: '#182d40', fontSize: '12px', marginBottom: '4px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold', opacity: 0.7 }}>العملة الأساسية</div>
              <span style={{
                backgroundColor: c.is_base_currency ? 'var(--main-color)' : 'var(--gray-color)',
                color: 'white',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 'bold',
                display: 'inline-block',
                fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
              }}>
                {c.is_base_currency ? 'نعم' : 'لا'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyDetails;

