import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaArrowRight, FaPaperPlane, FaTrash } from 'react-icons/fa';
import {
  getReceiptVoucherDetails,
  postReceiptVoucher,
  deleteReceiptVoucher,
  clearReceiptVoucherDetails,
  clearError,
  clearSuccess
} from '../../../../redux/Slices/authSlice';

const ReceiptVoucherDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { receiptVoucherDetails, isLoading, error, success } = useSelector((state) => state.auth);
  const lastErrorRef = useRef({ message: null, time: 0 });

  useEffect(() => {
    dispatch(getReceiptVoucherDetails(id));
    return () => {
      dispatch(clearReceiptVoucherDetails());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (success) {
      toast.success(success, { rtl: true });
      dispatch(clearSuccess());
      dispatch(getReceiptVoucherDetails(id));
    }
  }, [success, dispatch, id]);

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

  const handlePost = () => {
    dispatch(postReceiptVoucher(id));
  };

  const handleDelete = () => {
    if (window.confirm('هل أنت متأكد من حذف إيصال الاستلام؟')) {
      dispatch(deleteReceiptVoucher(id)).then(() => {
        navigate('/receipt-vouchers');
      });
    }
  };

  const isDraft = (receiptVoucherDetails?.status || '').toLowerCase() === 'draft';

  const renderDetailRows = () => {
    const rows = receiptVoucherDetails?.details || [];
    if (!Array.isArray(rows) || rows.length === 0) {
      return (
        <tr>
          <td colSpan="4" style={emptyStateStyle}>لا توجد تفاصيل متاحة</td>
        </tr>
      );
    }
    return rows.map((row, idx) => (
      <tr key={row.id || idx} style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: idx % 2 === 0 ? 'var(--basic-color)' : '#f7f9fc' }}>
        <td style={detailCellStyle}>{row?.account?.name_ar || row?.account?.name_en || row.account_name || '-'}</td>
        <td style={detailCellStyle}>{row?.account?.code || row.account_code || '-'}</td>
        <td style={{ ...detailCellStyle, fontWeight: 'bold' }}>{Number(row.amount || 0).toLocaleString('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        <td style={detailCellStyle}>{row.description || '-'}</td>
      </tr>
    ));
  };

  const renderAttachments = () => {
    const attachments = receiptVoucherDetails?.attachments;
    if (!Array.isArray(attachments) || attachments.length === 0) {
      return <div style={{ color: '#6c7a89', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>لا توجد مرفقات</div>;
    }
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
        {attachments.map((attachment) => (
          <a
            key={attachment.id}
            href={attachment.url || attachment.path || '#'}
            target="_blank"
            rel="noreferrer"
            style={attachmentLinkStyle}
          >
            {attachment.file_name || attachment.name || `مرفق ${attachment.id}`}
          </a>
        ))}
      </div>
    );
  };

  return (
    <div style={pageWrapperStyle}>
      <button
        type="button"
        onClick={() => navigate('/receipt-vouchers')}
        style={backButtonStyle}
      >
        <FaArrowRight style={{ color: 'white' }} />
        الرجوع
      </button>
      <h1 style={titleStyle}>تفاصيل إيصال استلام نقدية</h1>

      {isLoading && !receiptVoucherDetails ? (
        <div style={loadingStyle}>جاري التحميل...</div>
      ) : (
        <div style={cardStyle}>
          <div style={infoGridStyle}>
            <InfoRow label="رقم الإيصال" value={receiptVoucherDetails?.reference || '-'} />
            <InfoRow label="تاريخ الإيصال" value={receiptVoucherDetails?.voucher_date || '-'} />
            <InfoRow label="الحالة" value={renderStatusBadge(receiptVoucherDetails?.status)} />
            <InfoRow label="الحساب المستلم" value={receiptVoucherDetails?.account?.name_ar || receiptVoucherDetails?.account?.name_en || '-'} />
            <InfoRow label="الكود" value={receiptVoucherDetails?.account?.code || '-'} />
            <InfoRow label="المبلغ الإجمالي" value={Number(receiptVoucherDetails?.total_amount || 0).toLocaleString('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} />
            <InfoRow label="ملاحظات" value={receiptVoucherDetails?.notes || '-'} />
            <InfoRow label="أنشئ بواسطة" value={receiptVoucherDetails?.created_by || '-'} />
            <InfoRow label="تاريخ الترحيل" value={receiptVoucherDetails?.posted_at || '-'} />
          </div>

          <div style={{ marginTop: '30px' }}>
            <div style={sectionHeaderStyle}>تفاصيل الحسابات</div>
            <div style={{ overflowX: 'auto' }}>
              <table style={tableStyle}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--main-color)' }}>
                    {['الحساب', 'الكود', 'المبلغ', 'الوصف'].map((label) => (
                      <th key={label} style={headerCellStyle}>{label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {renderDetailRows()}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ marginTop: '30px' }}>
            <div style={sectionHeaderStyle}>المرفقات</div>
            {renderAttachments()}
          </div>

          <div style={actionsStyle}>
            <button
              type="button"
              onClick={handlePost}
              disabled={!isDraft}
              style={{
                ...primaryButtonStyle,
                backgroundColor: isDraft ? 'var(--main-color)' : 'var(--border-color)',
                cursor: isDraft ? 'pointer' : 'not-allowed',
                opacity: isDraft ? 1 : 0.6
              }}
            >
              <FaPaperPlane />
              ترحيل
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={!isDraft}
              style={{
                ...deleteButtonStyle,
                cursor: isDraft ? 'pointer' : 'not-allowed',
                opacity: isDraft ? 1 : 0.6
              }}
            >
              <FaTrash />
              حذف
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const InfoRow = ({ label, value }) => (
  <div>
    <div style={infoLabelStyle}>{label}</div>
    <div style={infoValueStyle}>{value || '-'}</div>
  </div>
);

const renderStatusBadge = (status) => {
  const normalized = (status || '').toLowerCase();
  const baseStyle = {
    display: 'inline-block',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
  };
  if (normalized === 'posted') {
    return <span style={{ ...baseStyle, backgroundColor: 'var(--main-color)' }}>مرحل</span>;
  }
  return <span style={{ ...baseStyle, backgroundColor: 'var(--gray-color)' }}>مسودة</span>;
};

const pageWrapperStyle = {
  padding: '30px',
  backgroundColor: 'var(--dashboard-bg)',
  minHeight: 'calc(100vh - 80px)',
  color: 'var(--text-primary)'
};

const backButtonStyle = {
  backgroundColor: 'var(--gray-color)',
  color: 'white',
  border: 'none',
  padding: '10px 14px',
  borderRadius: '8px',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '16px',
  fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
  fontWeight: 'bold'
};

const titleStyle = {
  fontSize: '20px',
  margin: 0,
  color: 'var(--text-primary)',
  fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
  fontWeight: 'bold'
};

const loadingStyle = {
  marginTop: '40px',
  textAlign: 'center',
  color: '#182d40',
  fontSize: '16px',
  fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
  fontWeight: 'bold'
};

const cardStyle = {
  marginTop: '24px',
  backgroundColor: 'var(--basic-color)',
  border: '1px solid var(--border-color)',
  borderRadius: '12px',
  padding: '24px'
};

const infoGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '16px'
};

const infoLabelStyle = {
  fontSize: '12px',
  color: '#6c7a89',
  fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
  marginBottom: '4px'
};

const infoValueStyle = {
  fontSize: '14px',
  color: '#182d40',
  fontWeight: 'bold',
  fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
};

const sectionHeaderStyle = {
  fontSize: '16px',
  marginBottom: '12px',
  color: '#182d40',
  fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
  fontWeight: 'bold'
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'separate',
  borderSpacing: 0
};

const headerCellStyle = {
  padding: '16px 14px',
  color: 'white',
  borderBottom: '2px solid var(--border-color)',
  fontSize: '14px',
  fontWeight: 'bold',
  textAlign: 'center',
  fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
};

const detailCellStyle = {
  padding: '14px 12px',
  textAlign: 'center',
  color: '#182d40',
  fontSize: '13px',
  fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
};

const emptyStateStyle = {
  padding: '30px',
  textAlign: 'center',
  color: '#182d40',
  fontSize: '14px',
  fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
};

const attachmentLinkStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '10px 16px',
  backgroundColor: '#f1f4f9',
  border: '1px solid var(--border-color)',
  borderRadius: '8px',
  color: 'var(--main-color)',
  textDecoration: 'none',
  fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
  fontWeight: 'bold'
};

const actionsStyle = {
  marginTop: '32px',
  display: 'flex',
  gap: '12px'
};

const primaryButtonStyle = {
  backgroundColor: 'var(--main-color)',
  color: 'white',
  border: 'none',
  padding: '10px 18px',
  borderRadius: '8px',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
  fontWeight: 'bold'
};

const deleteButtonStyle = {
  backgroundColor: 'var(--red-color)',
  color: 'white',
  border: 'none',
  padding: '10px 18px',
  borderRadius: '8px',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
  fontWeight: 'bold'
};

export default ReceiptVoucherDetails;


