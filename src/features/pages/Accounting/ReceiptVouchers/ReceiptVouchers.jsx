import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaPlus, FaEye, FaPaperPlane, FaTrash } from 'react-icons/fa';
import {
  getReceiptVouchers,
  postReceiptVoucher,
  deleteReceiptVoucher,
  clearError,
  clearSuccess
} from '../../../../redux/Slices/authSlice';

const ReceiptVouchers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { receiptVouchers, receiptVouchersPagination, isLoading, error, success } = useSelector((state) => state.auth);
  const [currentPage, setCurrentPage] = useState(1);
  const lastErrorRef = useRef({ message: null, time: 0 });

  useEffect(() => {
    dispatch(getReceiptVouchers({ page: currentPage, per_page: 10 }));
  }, [dispatch, currentPage]);

  useEffect(() => {
    if (success) {
      toast.success(success, { rtl: true });
      dispatch(clearSuccess());
      dispatch(getReceiptVouchers({ page: currentPage, per_page: 10 }));
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

  const handlePost = (id) => {
    dispatch(postReceiptVoucher(id));
  };

  const handleDelete = (id) => {
    if (window.confirm('هل أنت متأكد من حذف إيصال الاستلام؟')) {
      dispatch(deleteReceiptVoucher(id));
    }
  };

  const renderStatusBadge = (status) => {
    const normalized = (status || '').toLowerCase();
    const baseStyle = {
      padding: '6px 14px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: 'bold',
      display: 'inline-block',
      color: 'white',
      fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
    };
    if (normalized === 'posted') {
      return <span style={{ ...baseStyle, backgroundColor: 'var(--main-color)' }}>مرحل</span>;
    }
    return <span style={{ ...baseStyle, backgroundColor: 'var(--gray-color)' }}>مسودة</span>;
  };

  const renderTableBody = () => {
    if (isLoading && (!receiptVouchers || receiptVouchers.length === 0)) {
      return (
        <tr>
          <td colSpan="8" style={emptyStateStyle}>جاري التحميل...</td>
        </tr>
      );
    }
    if (!receiptVouchers || receiptVouchers.length === 0) {
      return (
        <tr>
          <td colSpan="8" style={emptyStateStyle}>لا توجد إيصالات استلام متاحة</td>
        </tr>
      );
    }

    return receiptVouchers.map((voucher, idx) => {
      const isDraft = (voucher.status || '').toLowerCase() === 'draft';
      const baseRowStyle = {
        borderBottom: '1px solid var(--border-color)',
        backgroundColor: idx % 2 === 0 ? 'var(--basic-color)' : '#f0f4fa',
        transition: 'background-color 0.2s'
      };
      return (
        <tr
          key={voucher.id}
          style={baseRowStyle}
          onMouseEnter={(ev) => {
            const row = ev.currentTarget;
            row.style.backgroundColor = 'rgba(0, 106, 255, 0.08)';
          }}
          onMouseLeave={(ev) => {
            const row = ev.currentTarget;
            row.style.backgroundColor = idx % 2 === 0 ? 'var(--basic-color)' : '#f0f4fa';
          }}
        >
          <td style={cellStyle}>{(receiptVouchersPagination?.current_page - 1) * (receiptVouchersPagination?.per_page || 10) + idx + 1}</td>
          <td style={cellStyle}>{voucher.voucher_date || '-'}</td>
          <td style={cellStyle}>{voucher.reference || '-'}</td>
          <td style={cellStyle}>{voucher?.account?.name_ar || voucher?.account?.name_en || '-'}</td>
          <td style={{ ...cellStyle, fontWeight: 'bold' }}>{Number(voucher.total_amount || 0).toLocaleString('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          <td style={cellStyle}>{renderStatusBadge(voucher.status)}</td>
          <td style={cellStyle}>{voucher.posted_at || '-'}</td>
          <td style={cellStyle}>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <button
                title="عرض"
                onClick={() => navigate(`/receipt-vouchers/view/${voucher.id}`)}
                style={iconButtonStyle}
              >
                <FaEye style={{ color: 'white' }} />
              </button>
              <button
                title="ترحيل"
                disabled={!isDraft}
                onClick={() => { if (isDraft) handlePost(voucher.id); }}
                style={{
                  ...iconButtonStyle,
                  backgroundColor: isDraft ? 'var(--main-color)' : 'var(--border-color)',
                  cursor: isDraft ? 'pointer' : 'not-allowed',
                  opacity: isDraft ? 1 : 0.6
                }}
                onMouseEnter={(ev) => { if (isDraft) ev.currentTarget.style.opacity = '0.9'; }}
                onMouseLeave={(ev) => { ev.currentTarget.style.opacity = isDraft ? '1' : '0.6'; }}
              >
                <FaPaperPlane style={{ color: 'white' }} />
              </button>
              <button
                title="حذف"
                disabled={!isDraft}
                onClick={() => { if (isDraft) handleDelete(voucher.id); }}
                style={{
                  ...iconButtonStyle,
                  backgroundColor: isDraft ? 'var(--red-color)' : 'var(--border-color)',
                  cursor: isDraft ? 'pointer' : 'not-allowed',
                  opacity: isDraft ? 1 : 0.6
                }}
                onMouseEnter={(ev) => { if (isDraft) ev.currentTarget.style.opacity = '0.9'; }}
                onMouseLeave={(ev) => { ev.currentTarget.style.opacity = isDraft ? '1' : '0.6'; }}
              >
                <FaTrash style={{ color: 'white' }} />
              </button>
            </div>
          </td>
        </tr>
      );
    });
  };

  return (
    <div style={pageWrapperStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>إيصال استلام نقدية</h1>
        <button
          onClick={() => navigate('/receipt-vouchers/add')}
          style={addButtonStyle}
        >
          <FaPlus style={{ color: 'white' }} /> إضافة إيصال
        </button>
      </div>

      <div style={cardStyle}>
        <div style={{ overflowX: 'auto' }}>
          <table style={tableStyle}>
            <thead>
              <tr style={{ backgroundColor: 'var(--main-color)' }}>
                {['#', 'التاريخ', 'المرجع', 'الحساب', 'المبلغ', 'الحالة', 'تاريخ الترحيل', 'الإجراءات'].map((label) => (
                  <th key={label} style={headerCellStyle}>{label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {renderTableBody()}
            </tbody>
          </table>
        </div>

        {receiptVouchersPagination && (receiptVouchers?.length || 0) > 0 && receiptVouchersPagination.last_page > 1 && (
          <div style={paginationStyle}>
            {Array.from({ length: receiptVouchersPagination.last_page }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                style={{
                  ...paginationButtonStyle,
                  backgroundColor: page === receiptVouchersPagination.current_page ? 'var(--main-color)' : 'var(--basic-color)',
                  color: page === receiptVouchersPagination.current_page ? 'white' : '#182d40',
                  border: page === receiptVouchersPagination.current_page ? 'none' : '1px solid var(--border-color)'
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

const pageWrapperStyle = {
  padding: '30px',
  backgroundColor: 'var(--dashboard-bg)',
  minHeight: 'calc(100vh - 80px)',
  color: 'var(--text-primary)'
};

const headerStyle = {
  marginBottom: '20px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const titleStyle = {
  fontSize: '20px',
  margin: 0,
  color: 'var(--text-primary)',
  fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
  fontWeight: 'bold'
};

const addButtonStyle = {
  backgroundColor: 'var(--main-color)',
  border: 'none',
  color: 'white',
  padding: '10px 14px',
  borderRadius: '8px',
  cursor: 'pointer',
  display: 'flex',
  gap: '8px',
  alignItems: 'center',
  fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
  fontWeight: 'bold'
};

const cardStyle = {
  backgroundColor: 'var(--basic-color)',
  border: '1px solid var(--border-color)',
  borderRadius: '12px',
  overflow: 'hidden'
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'separate',
  borderSpacing: 0
};

const headerCellStyle = {
  padding: '18px 16px',
  color: 'white',
  borderBottom: '2px solid var(--border-color)',
  fontSize: '14px',
  fontWeight: 'bold',
  textAlign: 'center',
  backgroundColor: 'var(--main-color)',
  fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
};

const cellStyle = {
  padding: '16px 14px',
  textAlign: 'center',
  color: '#182d40',
  fontSize: '14px',
  fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
};

const emptyStateStyle = {
  padding: '40px',
  textAlign: 'center',
  color: '#182d40',
  fontSize: '16px',
  fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
  fontWeight: 'bold'
};

const paginationStyle = {
  padding: '16px',
  borderTop: '1px solid var(--border-color)',
  display: 'flex',
  justifyContent: 'center',
  gap: '8px'
};

const paginationButtonStyle = {
  padding: '8px 12px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 'bold',
  fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
};

const iconButtonStyle = {
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
};

export default ReceiptVouchers;


