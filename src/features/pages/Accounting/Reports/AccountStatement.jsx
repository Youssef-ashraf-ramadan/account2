import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FaSearch, FaSync } from 'react-icons/fa';
import {
  getAccountStatement,
  clearAccountStatement,
  getPostingAccounts,
  clearError
} from '../../../../redux/Slices/authSlice';

const AccountStatement = () => {
  const dispatch = useDispatch();
  const {
    accountStatementTotals,
    accountStatementMovements,
    accountStatementMeta,
    postingAccounts,
    isLoading,
    error
  } = useSelector((state) => state.auth);
  const [filters, setFilters] = useState({
    account_id: '',
    start_date: '',
    end_date: '',
    page: 1
  });
  const lastErrorRef = useRef({ message: null, time: 0 });

  useEffect(() => {
    dispatch(getPostingAccounts());
    return () => {
      dispatch(clearAccountStatement());
    };
  }, [dispatch]);

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
    if (!filters.account_id) {
      toast.error('برجاء اختيار حساب أولاً', { rtl: true });
      return;
    }
    dispatch(getAccountStatement({ ...filters, page: 1 }));
    setFilters((prev) => ({ ...prev, page: 1 }));
  };

  const handleReset = () => {
    dispatch(clearAccountStatement());
    setFilters({ account_id: '', start_date: '', end_date: '', page: 1 });
  };

  const movementsData = accountStatementMovements?.data || [];
  const pagination = useMemo(() => ({
    current_page: accountStatementMovements?.current_page || 1,
    last_page: accountStatementMovements?.last_page || 1,
    per_page: accountStatementMovements?.per_page || 15,
    total: accountStatementMovements?.total || 0
  }), [accountStatementMovements]);

  const handlePageChange = (page) => {
    if (!filters.account_id || page === pagination.current_page) return;
    const nextFilters = { ...filters, page };
    setFilters(nextFilters);
    dispatch(getAccountStatement(nextFilters));
  };

  const renderValue = (value) => {
    const numeric = Number(value || 0);
    return numeric.toLocaleString('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div style={{ padding: '30px', backgroundColor: 'var(--dashboard-bg)', minHeight: 'calc(100vh - 80px)', color: 'var(--text-primary)' }}>
      <h1 style={{ fontSize: '22px', marginBottom: '20px', color: 'var(--text-primary)', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>
        كشف الحسابات
      </h1>

      <form onSubmit={handleSubmit} style={{ backgroundColor: 'var(--basic-color)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ flex: '1 1 260px', minWidth: '260px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>
              الحساب <span style={{ color: 'var(--red-color)' }}>*</span>
            </label>
            <select
              value={filters.account_id}
              onChange={(e) => setFilters((prev) => ({ ...prev, account_id: e.target.value }))}
              required
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--basic-color)', color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}
            >
              <option value="">اختر الحساب</option>
              {(postingAccounts || []).map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name_ar || account.name_en || account.code} {account.code ? `(${account.code})` : ''}
                </option>
              ))}
            </select>
            <small style={{ display: 'block', marginTop: '6px', color: '#6c7a89', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>
              في حال لم يظهر الحساب المطلوب يرجى التواصل مع فريق الباك إند لإتاحة القائمة.
            </small>
          </div>
          <div style={{ flex: '1 1 200px', minWidth: '200px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>
              من تاريخ
            </label>
            <input
              type="date"
              value={filters.start_date || ''}
              onChange={(e) => setFilters((prev) => ({ ...prev, start_date: e.target.value }))}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--basic-color)', color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}
            />
          </div>
          <div style={{ flex: '1 1 200px', minWidth: '200px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>
              إلى تاريخ
            </label>
            <input
              type="date"
              value={filters.end_date || ''}
              onChange={(e) => setFilters((prev) => ({ ...prev, end_date: e.target.value }))}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--basic-color)', color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}
            />
          </div>
        </div>
        <div style={{ marginTop: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            type="submit"
            disabled={isLoading}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--main-color)', border: 'none', color: 'white', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold', opacity: isLoading ? 0.7 : 1 }}
          >
            <FaSearch /> عرض الكشف
          </button>
          <button
            type="button"
            onClick={handleReset}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--gray-color)', border: 'none', color: 'white', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}
          >
            <FaSync /> إعادة تعيين
          </button>
        </div>
      </form>

  {accountStatementMeta && (
        <div style={{ marginBottom: '16px', color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>
          الحساب رقم: {accountStatementMeta.account_id || '-'} | الفترة: {accountStatementMeta.start_date || '-'} إلى {accountStatementMeta.end_date || '-'}
        </div>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
        {accountStatementTotals ? (
          <>
            {[
              { label: 'رصيد افتتاحي', value: accountStatementTotals.opening_balance },
              { label: 'إجمالي مدين', value: accountStatementTotals.total_debit },
              { label: 'إجمالي دائن', value: accountStatementTotals.total_credit },
              { label: 'رصيد ختامي', value: accountStatementTotals.closing_balance }
            ].map(({ label, value }) => (
              <div key={label} style={{ flex: '1 1 200px', minWidth: '180px', backgroundColor: 'var(--basic-color)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px', textAlign: 'center', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>
                <div style={{ color: '#6c7a89', fontSize: '12px' }}>{label}</div>
                <div style={{ fontWeight: 'bold', color: '#182d40', marginTop: '6px', fontSize: '16px' }}>{renderValue(value)}</div>
              </div>
            ))}
          </>
        ) : (
          <div style={{ color: '#6c7a89', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>
            ستظهر ملخصات الرصيد هنا بعد اختيار الحساب وتشغيل التقرير.
          </div>
        )}
      </div>

      <div style={{ backgroundColor: 'var(--basic-color)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--main-color)', color: 'white' }}>
                {['التاريخ', 'الوصف', 'مدين', 'دائن', 'الرصيد'].map((label) => (
                  <th key={label} style={{ padding: '14px 12px', fontSize: '13px', textAlign: 'center', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', borderBottom: '1px solid var(--border-color)' }}>
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading && movementsData.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '30px', textAlign: 'center', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', color: '#182d40' }}>
                    جاري التحميل...
                  </td>
                </tr>
              )}
              {!isLoading && movementsData.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '30px', textAlign: 'center', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', color: '#182d40' }}>
                    لم يتم العثور على حركات للحساب ضمن الفترة المحددة.
                  </td>
                </tr>
              )}
              {movementsData.map((movement, idx) => (
                <tr key={`${movement.id || movement.reference || idx}`} style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: idx % 2 === 0 ? 'var(--basic-color)' : '#f4f7fb' }}>
                  <td style={{ padding: '12px', textAlign: 'center', color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>{movement.date || '-'}</td>
                  <td style={{ padding: '12px', textAlign: 'center', color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>{movement.description || movement.reference || '-'}</td>
                  <td style={{ padding: '12px', textAlign: 'center', color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>{renderValue(movement.debit)}</td>
                  <td style={{ padding: '12px', textAlign: 'center', color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>{renderValue(movement.credit)}</td>
                  <td style={{ padding: '12px', textAlign: 'center', color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>{renderValue(movement.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {pagination.last_page > 1 && (
          <div style={{ padding: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', borderTop: '1px solid var(--border-color)' }}>
            {Array.from({ length: pagination.last_page }, (_, index) => index + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                style={{
                  backgroundColor: page === pagination.current_page ? 'var(--main-color)' : 'var(--basic-color)',
                  color: page === pagination.current_page ? 'white' : '#182d40',
                  border: '1px solid var(--border-color)',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                  fontWeight: 'bold'
                }}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountStatement;


