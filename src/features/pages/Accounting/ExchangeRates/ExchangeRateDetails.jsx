import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getExchangeRateDetails, getEffectiveExchangeRate, clearExchangeRateDetails, getCurrencies } from '../../../../redux/Slices/authSlice';

const ExchangeRateDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { exchangeRateDetails, effectiveExchangeRate, isLoading, currencies } = useSelector((s) => s.auth);
  const [showEffective, setShowEffective] = useState(false);
  const [effectiveParams, setEffectiveParams] = useState({
    currency_id: '',
    date: ''
  });

  useEffect(() => {
    if (id) {
      dispatch(getExchangeRateDetails(id));
    }
    dispatch(getCurrencies({ page: 1, per_page: 100 }));
    return () => {
      dispatch(clearExchangeRateDetails());
    };
  }, [dispatch, id]);

  const handleGetEffective = () => {
    if (effectiveParams.currency_id && effectiveParams.date) {
      dispatch(getEffectiveExchangeRate({
        currency_id: effectiveParams.currency_id,
        date: effectiveParams.date
      }));
      setShowEffective(true);
    }
  };

  if (isLoading && !exchangeRateDetails) {
    return (
      <div style={{ padding: '30px', backgroundColor: 'var(--dashboard-bg)', minHeight: 'calc(100vh - 80px)', color: '#182d40', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>
        جاري التحميل...
      </div>
    );
  }

  if (!exchangeRateDetails) {
    return (
      <div style={{ padding: '30px', backgroundColor: 'var(--dashboard-bg)', minHeight: 'calc(100vh - 80px)', color: '#182d40' }}>
        <button onClick={() => navigate('/exchange-rates')} style={{ background: 'var(--gray-color)', color: 'white', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', marginBottom: '12px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>رجوع</button>
        <p style={{ fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold', color: '#182d40' }}>لا توجد بيانات</p>
      </div>
    );
  }

  const rate = exchangeRateDetails.data || exchangeRateDetails;

  return (
    <div style={{ padding: '30px', backgroundColor: 'var(--dashboard-bg)', minHeight: 'calc(100vh - 80px)', color: 'var(--text-primary)' }}>
      <button onClick={() => navigate('/exchange-rates')} style={{ background: 'var(--gray-color)', color: 'white', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', marginBottom: '20px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>رجوع</button>
      
      <div style={{ backgroundColor: 'var(--basic-color)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden', marginBottom: '20px' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--main-color)' }}>
          <strong style={{ fontSize: '18px', color: 'white', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>تفاصيل سعر الصرف #{rate.id}</strong>
        </div>
        <div style={{ padding: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <div style={{ color: '#182d40', fontSize: '12px', marginBottom: '4px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold', opacity: 0.7 }}>ID</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>{rate.id || '-'}</div>
            </div>
            <div>
              <div style={{ color: '#182d40', fontSize: '12px', marginBottom: '4px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold', opacity: 0.7 }}>التاريخ</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>{rate.date || '-'}</div>
            </div>
            <div>
              <div style={{ color: '#182d40', fontSize: '12px', marginBottom: '4px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold', opacity: 0.7 }}>سعر الصرف</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>{rate.rate || '-'}</div>
            </div>
            {rate.currency && (
              <>
                <div>
                  <div style={{ color: '#182d40', fontSize: '12px', marginBottom: '4px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold', opacity: 0.7 }}>اسم العملة</div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>{rate.currency.name_ar || rate.currency.name || '-'}</div>
                </div>
                <div>
                  <div style={{ color: '#182d40', fontSize: '12px', marginBottom: '4px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold', opacity: 0.7 }}>كود العملة</div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>{rate.currency.code || '-'}</div>
                </div>
                <div>
                  <div style={{ color: '#182d40', fontSize: '12px', marginBottom: '4px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold', opacity: 0.7 }}>رمز العملة</div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>{rate.currency.symbol || '-'}</div>
                </div>
                <div>
                  <div style={{ color: '#182d40', fontSize: '12px', marginBottom: '4px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold', opacity: 0.7 }}>حالة العملة</div>
                  <span style={{
                    backgroundColor: rate.currency.is_active ? 'var(--main-color)' : 'var(--red-color)',
                    color: 'white',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    display: 'inline-block',
                    fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                  }}>
                    {rate.currency.is_active ? 'نشط' : 'غير نشط'}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Effective Exchange Rate Section */}
      <div style={{ backgroundColor: 'var(--basic-color)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--main-color)' }}>
          <strong style={{ fontSize: '18px', color: 'white', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>عرض السعر الفعلي</strong>
        </div>
        <div style={{ padding: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold', color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>
                العملة
              </label>
              <select
                value={effectiveParams.currency_id}
                onChange={(e) => setEffectiveParams(prev => ({ ...prev, currency_id: e.target.value }))}
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
              >
                <option value="">اختر العملة</option>
                {(currencies || []).map((currency) => (
                  <option key={currency.id} value={currency.id}>
                    {currency.code} - {currency.name_ar || currency.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold', color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>
                التاريخ
              </label>
              <input
                type="date"
                value={effectiveParams.date}
                onChange={(e) => setEffectiveParams(prev => ({ ...prev, date: e.target.value }))}
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
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button
                onClick={handleGetEffective}
                disabled={!effectiveParams.currency_id || !effectiveParams.date}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: effectiveParams.currency_id && effectiveParams.date ? 'var(--main-color)' : 'var(--gray-color)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: effectiveParams.currency_id && effectiveParams.date ? 'pointer' : 'not-allowed',
                  opacity: effectiveParams.currency_id && effectiveParams.date ? 1 : 0.6,
                  fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                }}
              >
                عرض السعر الفعلي
              </button>
            </div>
          </div>
          
          {showEffective && effectiveExchangeRate && (
            <div style={{ 
              marginTop: '20px', 
              padding: '16px', 
              backgroundColor: 'var(--basic-color)', 
              borderRadius: '8px',
              border: '1px solid var(--border-color)'
            }}>
              <div style={{ color: '#182d40', fontSize: '12px', marginBottom: '8px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold', opacity: 0.7 }}>السعر الفعلي</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--main-color)', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>
                {effectiveExchangeRate.rate || effectiveExchangeRate.data?.rate || 'N/A'}
              </div>
              {effectiveExchangeRate.currency && (
                <div style={{ marginTop: '12px', fontSize: '14px', color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>
                  العملة: {effectiveExchangeRate.currency.name_ar || effectiveExchangeRate.currency.name || 'N/A'}
                </div>
              )}
              {effectiveExchangeRate.date && (
                <div style={{ marginTop: '8px', fontSize: '14px', color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>
                  التاريخ: {effectiveExchangeRate.date}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExchangeRateDetails;

