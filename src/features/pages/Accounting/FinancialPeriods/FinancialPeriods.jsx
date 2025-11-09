import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaPlus, FaEye, FaEdit, FaTrash, FaLock } from 'react-icons/fa';
import { 
  getFinancialPeriods, 
  deleteFinancialPeriod, 
  closeFinancialPeriod, 
  clearError, 
  clearSuccess 
} from '../../../../redux/Slices/authSlice';

const FinancialPeriods = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { financialPeriods, financialPeriodsPagination, isLoading, error, success } = useSelector((state) => state.auth);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [periodToDelete, setPeriodToDelete] = useState(null);
  const [periodToClose, setPeriodToClose] = useState(null);
  const lastErrorRef = useRef({ message: null, time: 0 });
  const lastSuccessRef = useRef({ message: null, time: 0 });
  const perPage = 15;

  useEffect(() => {
    dispatch(getFinancialPeriods({ page: currentPage, per_page: perPage }));
  }, [dispatch, currentPage]);

  useEffect(() => {
    if (success) {
      const now = Date.now();
      const last = lastSuccessRef.current;
      if (!last.message || last.message !== success || now - last.time > 2000) {
        toast.success(success, { rtl: true });
        lastSuccessRef.current = { message: success, time: now };
      }
      setShowDeleteModal(false);
      setShowCloseModal(false);
      setPeriodToDelete(null);
      setPeriodToClose(null);
      dispatch(clearSuccess());
      dispatch(getFinancialPeriods({ page: currentPage, per_page: perPage }));
    }
  }, [success, dispatch, currentPage]);

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

  const handleDeleteClick = (period) => {
    setPeriodToDelete(period);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!periodToDelete) return;
    await dispatch(deleteFinancialPeriod(periodToDelete.id));
  };

  const handleCloseClick = (period) => {
    setPeriodToClose(period);
    setShowCloseModal(true);
  };

  const confirmClose = async () => {
    if (!periodToClose) return;
    await dispatch(closeFinancialPeriod(periodToClose.id));
  };

  const statusBadgeStyles = (status) => {
    const normalized = (status || '').toLowerCase();
    if (normalized === 'open') {
      return { backgroundColor: 'var(--chart-color-2)', color: 'white' };
    }
    if (normalized === 'closed') {
      return { backgroundColor: 'var(--gray-color)', color: 'white' };
    }
    return { backgroundColor: 'var(--border-color)', color: '#182d40' };
  };

  if (isLoading && (!financialPeriods || financialPeriods.length === 0)) {
    return (
      <div style={{ padding: '30px', backgroundColor: 'var(--dashboard-bg)', minHeight: 'calc(100vh - 80px)', color: '#182d40', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>
        جاري التحميل...
      </div>
    );
  }

  return (
    <div style={{ padding: '30px', backgroundColor: 'var(--dashboard-bg)', minHeight: 'calc(100vh - 80px)', color: 'var(--text-primary)' }}>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '20px', margin: 0, color: 'var(--text-primary)', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>الفترات المالية</h1>
        <button
          onClick={() => navigate('/financial-periods/add')}
          style={{ backgroundColor: 'var(--main-color)', border: 'none', color: 'white', padding: '10px 14px', borderRadius: '8px', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}
        >
          <FaPlus style={{ color: 'white' }} /> إضافة فترة مالية
        </button>
      </div>

      <div style={{ backgroundColor: 'var(--basic-color)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--main-color)' }}>
                {[
                  { label: '#', width: '60px' },
                  { label: 'الاسم', width: '240px' },
                  { label: 'تاريخ البداية', width: '160px' },
                  { label: 'تاريخ النهاية', width: '160px' },
                  { label: 'الحالة', width: '140px' },
                  { label: 'تم الإنشاء بواسطة', width: '180px' },
                  { label: 'تاريخ الإنشاء', width: '180px' },
                  { label: 'الإجراءات', width: '260px' }
                ].map((h) => (
                  <th
                    key={h.label}
                    style={{
                      padding: '18px 16px',
                      color: 'white',
                      borderBottom: '2px solid var(--border-color)',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      textAlign: 'center',
                      width: h.width,
                      minWidth: h.width,
                      backgroundColor: 'var(--main-color)',
                      fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                    }}
                  >
                    {h.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(financialPeriods || []).length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ padding: '40px', textAlign: 'center', color: '#182d40', fontSize: '16px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>
                    لا توجد فترات مالية متاحة
                  </td>
                </tr>
              ) : (
                (financialPeriods || []).map((period, idx) => {
                  const isOpen = (period.status || '').toLowerCase() === 'open';
                  return (
                    <tr
                      key={period.id}
                      style={{
                        borderBottom: '1px solid var(--border-color)',
                        backgroundColor: idx % 2 === 0 ? 'var(--basic-color)' : '#f0f4fa',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(ev) => {
                        const row = ev.target.closest('tr');
                        if (row) row.style.backgroundColor = 'rgba(0, 106, 255, 0.08)';
                      }}
                      onMouseLeave={(ev) => {
                        const row = ev.target.closest('tr');
                        if (row) row.style.backgroundColor = idx % 2 === 0 ? 'var(--basic-color)' : '#f0f4fa';
                      }}
                    >
                      <td style={{ padding: '18px 16px', textAlign: 'center', color: '#182d40', fontSize: '14px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>
                        {(financialPeriodsPagination?.current_page - 1) * (financialPeriodsPagination?.per_page || perPage) + idx + 1}
                      </td>
                      <td style={{ padding: '18px 16px', textAlign: 'center', color: '#182d40', fontSize: '14px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>
                        {period.name || '-'}
                      </td>
                      <td style={{ padding: '18px 16px', textAlign: 'center', color: '#182d40', fontSize: '14px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>
                        {period.start_date || '-'}
                      </td>
                      <td style={{ padding: '18px 16px', textAlign: 'center', color: '#182d40', fontSize: '14px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>
                        {period.end_date || '-'}
                      </td>
                      <td style={{ padding: '18px 16px', textAlign: 'center' }}>
                        <span style={{ 
                          ...statusBadgeStyles(period.status),
                          padding: '6px 14px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          display: 'inline-block',
                          fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                        }}>
                          {period.status || '-'}
                        </span>
                      </td>
                      <td style={{ padding: '18px 16px', textAlign: 'center', color: '#182d40', fontSize: '14px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>
                        {period.created_by || '-'}
                      </td>
                      <td style={{ padding: '18px 16px', textAlign: 'center', color: '#182d40', fontSize: '14px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>
                        {period.created_at || '-'}
                      </td>
                      <td style={{ padding: '18px 16px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center', flexWrap: 'nowrap' }}>
                          <button
                            title="عرض"
                            onClick={() => navigate(`/financial-periods/view/${period.id}`)}
                            style={{
                              backgroundColor: 'var(--gray-color)',
                              color: 'white',
                              border: 'none',
                              padding: '10px 12px',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontSize: '14px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.2s'
                            }}
                            onMouseEnter={(ev) => { ev.target.style.opacity = '0.9'; }}
                            onMouseLeave={(ev) => { ev.target.style.opacity = '1'; }}
                          >
                            <FaEye style={{ color: 'white' }} />
                          </button>
                          <button
                            title="تعديل"
                            onClick={() => navigate(`/financial-periods/edit/${period.id}`)}
                            style={{
                              backgroundColor: 'var(--gray-color)',
                              color: 'white',
                              border: 'none',
                              padding: '10px 12px',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontSize: '14px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.2s'
                            }}
                            onMouseEnter={(ev) => { ev.target.style.opacity = '0.9'; }}
                            onMouseLeave={(ev) => { ev.target.style.opacity = '1'; }}
                          >
                            <FaEdit style={{ color: 'white' }} />
                          </button>
                          <button
                            title="إغلاق الفترة"
                            disabled={!isOpen}
                            onClick={() => { if (isOpen) handleCloseClick(period); }}
                            style={{
                              backgroundColor: isOpen ? 'var(--main-color)' : 'var(--border-color)',
                              color: 'white',
                              border: 'none',
                              padding: '10px 12px',
                              borderRadius: '8px',
                              cursor: isOpen ? 'pointer' : 'not-allowed',
                              fontSize: '14px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.2s',
                              opacity: isOpen ? 1 : 0.6
                            }}
                            onMouseEnter={(ev) => { if (isOpen) ev.target.style.opacity = '0.9'; }}
                            onMouseLeave={(ev) => { ev.target.style.opacity = isOpen ? '1' : '0.6'; }}
                          >
                            <FaLock style={{ color: 'white' }} />
                          </button>
                          <button
                            title="حذف"
                            onClick={() => handleDeleteClick(period)}
                            style={{
                              backgroundColor: 'var(--red-color)',
                              color: 'white',
                              border: 'none',
                              padding: '10px 12px',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontSize: '14px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.2s'
                            }}
                            onMouseEnter={(ev) => { ev.target.style.opacity = '0.9'; }}
                            onMouseLeave={(ev) => { ev.target.style.opacity = '1'; }}
                          >
                            <FaTrash style={{ color: 'white' }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {financialPeriodsPagination && (financialPeriods && financialPeriods.length > 0) && financialPeriodsPagination.last_page > 1 && (
          <div style={{ padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', borderTop: '1px solid var(--border-color)' }}>
            {Array.from({ length: financialPeriodsPagination.last_page }, (_, idx) => idx + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                style={{
                  backgroundColor: page === financialPeriodsPagination.current_page ? 'var(--main-color)' : 'var(--basic-color)',
                  color: page === financialPeriodsPagination.current_page ? 'white' : '#182d40',
                  border: '1px solid var(--border-color)',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                }}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999999 }}>
          <div style={{ backgroundColor: 'var(--basic-color)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '24px', width: '90%', maxWidth: '420px' }}>
            <h3 style={{ color: '#182d40', marginBottom: '12px', fontSize: '18px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>تأكيد الحذف</h3>
            <p style={{ color: '#182d40', marginBottom: '8px', fontSize: '14px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>
              هل أنت متأكد من حذف الفترة المالية "{periodToDelete?.name}"؟
            </p>
            <p style={{ color: 'var(--red-color)', marginBottom: '20px', fontSize: '12px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>
              هذا الإجراء لا يمكن التراجع عنه.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                onClick={() => { setShowDeleteModal(false); setPeriodToDelete(null); }}
                style={{ backgroundColor: 'var(--gray-color)', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 16px', cursor: 'pointer', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}
              >
                إلغاء
              </button>
              <button
                onClick={confirmDelete}
                style={{ backgroundColor: 'var(--red-color)', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 16px', cursor: 'pointer', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Close Confirmation Modal */}
      {showCloseModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999999 }}>
          <div style={{ backgroundColor: 'var(--basic-color)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '24px', width: '90%', maxWidth: '420px' }}>
            <h3 style={{ color: '#182d40', marginBottom: '12px', fontSize: '18px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>تأكيد الإغلاق</h3>
            <p style={{ color: '#182d40', marginBottom: '8px', fontSize: '14px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>
              هل أنت متأكد من إغلاق الفترة المالية "{periodToClose?.name}"؟
            </p>
            <p style={{ color: 'var(--main-color)', marginBottom: '20px', fontSize: '12px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>
              عملية الإغلاق ستكون Soft Close كما هو محدد.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                onClick={() => { setShowCloseModal(false); setPeriodToClose(null); }}
                style={{ backgroundColor: 'var(--gray-color)', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 16px', cursor: 'pointer', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}
              >
                إلغاء
              </button>
              <button
                onClick={confirmClose}
                style={{ backgroundColor: 'var(--main-color)', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 16px', cursor: 'pointer', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialPeriods;


