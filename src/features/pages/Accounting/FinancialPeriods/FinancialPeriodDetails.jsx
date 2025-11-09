import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  getFinancialPeriodDetails, 
  clearFinancialPeriodDetails, 
  clearError 
} from '../../../../redux/Slices/authSlice';

const FinancialPeriodDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { financialPeriodDetails, isLoading, error } = useSelector((state) => state.auth);
  const lastErrorRef = useRef({ message: null, time: 0 });

  useEffect(() => {
    dispatch(getFinancialPeriodDetails(id));
    return () => {
      dispatch(clearFinancialPeriodDetails());
    };
  }, [dispatch, id]);

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

  if (isLoading && !financialPeriodDetails) {
    return (
      <div style={{ padding: '30px', backgroundColor: 'var(--dashboard-bg)', minHeight: 'calc(100vh - 80px)', color: '#182d40', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>
        جاري التحميل...
      </div>
    );
  }

  if (!financialPeriodDetails) {
    return (
      <div style={{ padding: '30px', backgroundColor: 'var(--dashboard-bg)', minHeight: 'calc(100vh - 80px)', color: '#182d40', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>
        <p>لم يتم العثور على بيانات الفترة المالية.</p>
        <button
          onClick={() => navigate('/financial-periods')}
          style={{ backgroundColor: 'var(--main-color)', border: 'none', color: 'white', padding: '10px 18px', borderRadius: '8px', cursor: 'pointer', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}
        >
          العودة لقائمة الفترات
        </button>
      </div>
    );
  }

  const infoRow = (label, value) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}>
      <span style={{ fontWeight: 'bold', color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>{label}</span>
      <span style={{ color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>{value || '-'}</span>
    </div>
  );

  return (
    <div style={{ padding: '30px', backgroundColor: 'var(--dashboard-bg)', minHeight: 'calc(100vh - 80px)', color: 'var(--text-primary)', display: 'flex', justifyContent: 'center' }}>
      <div style={{ backgroundColor: 'var(--basic-color)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '32px', width: '100%', maxWidth: '720px' }}>
        <h1 style={{ fontSize: '24px', marginBottom: '24px', color: 'var(--text-primary)', textAlign: 'center', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>
          تفاصيل الفترة المالية
        </h1>
        {infoRow('اسم الفترة', financialPeriodDetails.name)}
        {infoRow('تاريخ البداية', financialPeriodDetails.start_date)}
        {infoRow('تاريخ النهاية', financialPeriodDetails.end_date)}
        {infoRow('الحالة', financialPeriodDetails.status)}
        {infoRow('تم الإنشاء بواسطة', financialPeriodDetails.created_by)}
        {infoRow('تاريخ الإنشاء', financialPeriodDetails.created_at)}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '24px' }}>
          <button
            onClick={() => navigate(`/financial-periods/edit/${financialPeriodDetails.id}`)}
            style={{ backgroundColor: 'var(--gray-color)', border: 'none', color: 'white', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}
          >
            تعديل
          </button>
          <button
            onClick={() => navigate('/financial-periods')}
            style={{ backgroundColor: 'var(--main-color)', border: 'none', color: 'white', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}
          >
            العودة للقائمة
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinancialPeriodDetails;


