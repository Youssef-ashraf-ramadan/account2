import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getSafeDetails, clearSafeDetails } from '../../../../redux/Slices/authSlice';
import { FaArrowRight, FaEdit } from 'react-icons/fa';

const SafeDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { safeDetails, isLoading } = useSelector((s) => s.auth);

  useEffect(() => {
    if (id) {
      dispatch(getSafeDetails(id));
    }
    return () => {
      dispatch(clearSafeDetails());
    };
  }, [dispatch, id]);

  if (isLoading) {
    return (
      <div style={{ padding: '30px', backgroundColor: 'var(--dashboard-bg)', minHeight: 'calc(100vh - 80px)', color: '#182d40', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>
        جاري التحميل...
      </div>
    );
  }

  if (!safeDetails) {
    return (
      <div style={{ padding: '30px', backgroundColor: 'var(--dashboard-bg)', minHeight: 'calc(100vh - 80px)', color: '#182d40' }}>
        <button onClick={() => navigate('/safes')} style={{ background: 'var(--gray-color)', color: 'white', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', marginBottom: '12px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>رجوع</button>
        <p style={{ fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold', color: '#182d40' }}>لا توجد بيانات</p>
      </div>
    );
  }

  const safe = safeDetails.data || safeDetails;

  return (
    <div style={{ padding: '30px', backgroundColor: 'var(--dashboard-bg)', minHeight: 'calc(100vh - 80px)', color: 'var(--text-primary)' }}>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={() => navigate('/safes')} style={{ background: 'var(--gray-color)', color: 'white', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>
          <FaArrowRight style={{ color: 'white' }} /> الرجوع
        </button>
        <button
          onClick={() => navigate(`/safes/edit/${id}`)}
          style={{
            backgroundColor: 'var(--gray-color)',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
          }}
        >
          <FaEdit style={{ color: 'white' }} /> تعديل الخزنة
        </button>
      </div>
      
      <div style={{ backgroundColor: 'var(--basic-color)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--main-color)' }}>
          <strong style={{ fontSize: '18px', color: 'white', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>تفاصيل الخزنة #{safe.id}</strong>
        </div>
        <div style={{ padding: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <div style={{ color: '#182d40', fontSize: '12px', marginBottom: '8px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold', opacity: 0.7 }}>ID</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>{safe.id || '-'}</div>
            </div>
            <div>
              <div style={{ color: '#182d40', fontSize: '12px', marginBottom: '8px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold', opacity: 0.7 }}>الاسم بالإنجليزية</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>{safe.name_en || safe.name || '-'}</div>
            </div>
            <div>
              <div style={{ color: '#182d40', fontSize: '12px', marginBottom: '8px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold', opacity: 0.7 }}>الاسم بالعربية</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>{safe.name_ar || safe.name || '-'}</div>
            </div>
            <div>
              <div style={{ color: '#182d40', fontSize: '12px', marginBottom: '8px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold', opacity: 0.7 }}>الحالة</div>
              <span style={{
                backgroundColor: safe.is_active ? 'var(--main-color)' : 'var(--red-color)',
                color: 'white',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 'bold',
                display: 'inline-block',
                fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
              }}>
                {safe.is_active ? 'نشط' : 'غير نشط'}
              </span>
            </div>
            {safe.notes && (
              <div style={{ gridColumn: '1 / span 2' }}>
                <div style={{ color: '#182d40', fontSize: '12px', marginBottom: '8px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold', opacity: 0.7 }}>ملاحظات</div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>{safe.notes}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafeDetails;

