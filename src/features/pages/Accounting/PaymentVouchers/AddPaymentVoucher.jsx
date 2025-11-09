import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaPaperclip, FaPlus, FaTimes, FaArrowRight } from 'react-icons/fa';
import {
  addPaymentVoucher,
  getPostingAccounts,
  getCostCentersList,
  clearError,
  clearSuccess
} from '../../../../redux/Slices/authSlice';

const createEmptyDetail = () => ({
  account_id: '',
  amount: '',
  description: '',
  cost_center_id: ''
});

const AddPaymentVoucher = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { postingAccounts, costCentersList, isLoading, error, success } = useSelector((state) => state.auth);
  const lastErrorRef = useRef({ message: null, time: 0 });
  const [form, setForm] = useState({
    voucher_date: '',
    account_id: '',
    total_amount: 0,
    notes: '',
    reference: '',
    details: [createEmptyDetail()]
  });
  const [attachments, setAttachments] = useState([]);
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [searchTerms, setSearchTerms] = useState({});
  const searchInputRefs = useRef({});

  useEffect(() => {
    dispatch(getPostingAccounts());
    dispatch(getCostCentersList({ per_page: 100 }));
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      toast.success(success, { rtl: true });
      dispatch(clearSuccess());
      navigate('/payment-vouchers');
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

  useEffect(() => {
    const total = form.details.reduce((sum, detail) => sum + Number(detail.amount || 0), 0);
    setForm((prev) => ({ ...prev, total_amount: total }));
  }, [form.details]);

  useEffect(() => {
    return () => {
      attachments.forEach((attachment) => {
        if (attachment.url) {
          URL.revokeObjectURL(attachment.url);
        }
      });
    };
  }, [attachments]);

  const findAccountById = useCallback((id) => {
    if (!id) return null;
    return (postingAccounts || []).find((account) => Number(account.id) === Number(id));
  }, [postingAccounts]);

  const filteredAccounts = (key) => {
    const term = (searchTerms[key] || '').toLowerCase();
    return (postingAccounts || []).filter((account) => {
      const nameAr = (account.name_ar || '').toLowerCase();
      const nameEn = (account.name_en || '').toLowerCase();
      const code = (account.code || '').toLowerCase();
      return (
        nameAr.includes(term) ||
        nameEn.includes(term) ||
        code.includes(term)
      );
    });
  };

  const toggleDropdown = (key) => {
    setOpenDropdowns((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      if (!prev[key]) {
        setTimeout(() => {
          if (searchInputRefs.current[key]) {
            searchInputRefs.current[key].focus();
          }
        }, 0);
      }
      return next;
    });
  };

  const handleSelectAccount = (key, accountId, callback) => {
    callback(accountId);
    setOpenDropdowns((prev) => ({ ...prev, [key]: false }));
    setSearchTerms((prev) => ({ ...prev, [key]: '' }));
  };

  const handleAttachmentUpload = (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;
    const nextAttachments = files.map((file) => ({
      id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
      file,
      name: file.name,
      size: file.size,
      url: URL.createObjectURL(file)
    }));
    setAttachments((prev) => [...prev, ...nextAttachments]);
    event.target.value = '';
  };

  const removeAttachment = (attachmentId) => {
    setAttachments((prev) => {
      const attachment = prev.find((item) => item.id === attachmentId);
      if (attachment?.url) {
        URL.revokeObjectURL(attachment.url);
      }
      return prev.filter((item) => item.id !== attachmentId);
    });
  };

  const updateDetail = (idx, field, value) => {
    setForm((prev) => ({
      ...prev,
      details: prev.details.map((detail, index) => index === idx ? { ...detail, [field]: value } : detail)
    }));
  };

  const addDetailRow = () => {
    setForm((prev) => ({ ...prev, details: [...prev.details, createEmptyDetail()] }));
  };

  const removeDetailRow = (idx) => {
    setForm((prev) => ({
      ...prev,
      details: prev.details.filter((_, index) => index !== idx)
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.account_id) {
      toast.error('برجاء اختيار الحساب الدافع', { rtl: true });
      return;
    }
    const normalizedDetails = form.details.map((detail) => ({
      account_id: Number(detail.account_id),
      amount: Number(detail.amount || 0),
      description: detail.description || '',
      cost_center_id: detail.cost_center_id ? Number(detail.cost_center_id) : null
    }));
    if (normalizedDetails.length === 0 || normalizedDetails.some((detail) => !detail.account_id || detail.amount <= 0)) {
      toast.error('برجاء استكمال تفاصيل السند بشكل صحيح', { rtl: true });
      return;
    }
    const total = normalizedDetails.reduce((sum, detail) => sum + Number(detail.amount || 0), 0);
    if (total <= 0) {
      toast.error('إجمالي المبلغ يجب أن يكون أكبر من صفر', { rtl: true });
      return;
    }

    const payload = {
      voucher_date: form.voucher_date,
      account_id: Number(form.account_id),
      total_amount: total,
      notes: form.notes,
      reference: form.reference,
      details: normalizedDetails,
      attachments: attachments.map((attachment) => attachment.file)
    };

    dispatch(addPaymentVoucher(payload));
  };

  const renderAccountSelector = (key, selectedId, onSelect) => {
    const selectedAccount = findAccountById(selectedId);
    return (
      <div style={{ position: 'relative' }}>
        <button
          type="button"
          onClick={() => toggleDropdown(key)}
          style={dropdownToggleStyle}
        >
          {selectedAccount ? `${selectedAccount.name_ar || selectedAccount.name_en || ''} ${selectedAccount.code ? `(${selectedAccount.code})` : ''}` : 'اختر الحساب'}
        </button>
        {openDropdowns[key] && (
          <div style={dropdownMenuStyle}>
            <input
              ref={(ref) => { searchInputRefs.current[key] = ref; }}
              value={searchTerms[key] || ''}
              onChange={(e) => setSearchTerms((prev) => ({ ...prev, [key]: e.target.value }))}
              placeholder="ابحث عن حساب"
              style={dropdownSearchStyle}
            />
            <div style={dropdownListStyle}>
              {(filteredAccounts(key) || []).map((account) => (
                <div
                  key={account.id}
                  onClick={() => handleSelectAccount(key, account.id, onSelect)}
                  style={dropdownItemStyle}
                >
                  <div style={{ fontWeight: 'bold' }}>{account.name_ar || account.name_en || '-'}</div>
                  <div style={{ fontSize: '12px', color: '#6c7a89' }}>{account.code || ''}</div>
                </div>
              ))}
              {(filteredAccounts(key) || []).length === 0 && (
                <div style={emptyDropdownStyle}>لا توجد نتائج مطابقة</div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={pageWrapperStyle}>
      <div style={{ marginBottom: '24px' }}>
        <button
          type="button"
          onClick={() => navigate('/payment-vouchers')}
          style={backButtonStyle}
        >
          <FaArrowRight style={{ color: 'white' }} />
          الرجوع
        </button>
        <h1 style={titleStyle}>إضافة سند صرف</h1>
      </div>
      <form onSubmit={handleSubmit} style={formCardStyle}>
        <div style={formGridStyle}>
          <div>
            <label style={labelStyle}>تاريخ السند <span style={{ color: 'var(--red-color)' }}>*</span></label>
            <input
              type="date"
              value={form.voucher_date}
              onChange={(e) => setForm((prev) => ({ ...prev, voucher_date: e.target.value }))}
              required
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>المرجع</label>
            <input
              type="text"
              value={form.reference}
              onChange={(e) => setForm((prev) => ({ ...prev, reference: e.target.value }))}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>ملاحظات</label>
            <input
              type="text"
              value={form.notes}
              onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>الحساب الدافع <span style={{ color: 'var(--red-color)' }}>*</span></label>
            {renderAccountSelector('main-account', form.account_id, (value) => setForm((prev) => ({ ...prev, account_id: value })))}
          </div>
          <div>
            <label style={labelStyle}>إجمالي المبلغ</label>
            <input
              type="text"
              value={Number(form.total_amount || 0).toLocaleString('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              readOnly
              style={{ ...inputStyle, backgroundColor: '#f4f6f9', fontWeight: 'bold' }}
            />
          </div>
        </div>

        <div style={{ marginTop: '24px' }}>
          <div style={sectionHeaderStyle}>تفاصيل السند</div>
          {form.details.map((detail, idx) => (
            <div key={`detail-${idx}`} style={detailRowStyle}>
              <div style={{ flex: '1 1 320px' }}>
                <label style={labelStyle}>الحساب <span style={{ color: 'var(--red-color)' }}>*</span></label>
                {renderAccountSelector(`detail-account-${idx}`, detail.account_id, (value) => updateDetail(idx, 'account_id', value))}
              </div>
              <div style={{ flex: '1 1 180px' }}>
                <label style={labelStyle}>المبلغ <span style={{ color: 'var(--red-color)' }}>*</span></label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={detail.amount}
                  onChange={(e) => updateDetail(idx, 'amount', e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>
              <div style={{ flex: '1 1 220px' }}>
                <label style={labelStyle}>الوصف</label>
                <input
                  type="text"
                  value={detail.description}
                  onChange={(e) => updateDetail(idx, 'description', e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div style={{ flex: '1 1 220px' }}>
                <label style={labelStyle}>مركز التكلفة</label>
                <select
                  value={detail.cost_center_id}
                  onChange={(e) => updateDetail(idx, 'cost_center_id', e.target.value)}
                  style={inputStyle}
                >
                  <option value="">بدون</option>
                  {(costCentersList || []).map((center) => (
                    <option key={center.id} value={center.id}>
                      {center.name} {center.code ? `(${center.code})` : ''}
                    </option>
                  ))}
                </select>
              </div>
              {form.details.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeDetailRow(idx)}
                  style={removeRowButtonStyle}
                  title="حذف السطر"
                >
                  <FaTimes />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addDetailRow}
            style={addRowButtonStyle}
          >
            <FaPlus /> إضافة سطر
          </button>
        </div>

        <div style={{ marginTop: '24px' }}>
          <div style={sectionHeaderStyle}>المرفقات</div>
          <label style={uploadButtonStyle}>
            <FaPaperclip />
            إرفاق ملفات
            <input type="file" multiple onChange={handleAttachmentUpload} style={{ display: 'none' }} />
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '12px' }}>
            {attachments.map((attachment) => (
              <div key={attachment.id} style={attachmentCardStyle}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>{attachment.name}</div>
                  <div style={{ fontSize: '12px', color: '#6c7a89' }}>{(attachment.size / 1024).toFixed(1)} KB</div>
                </div>
                <button type="button" onClick={() => removeAttachment(attachment.id)} style={removeAttachmentButtonStyle}>
                  <FaTimes />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div style={formActionsStyle}>
          <button
            type="button"
            onClick={() => navigate('/payment-vouchers')}
            style={cancelButtonStyle}
          >
            إلغاء
          </button>
          <button
            type="submit"
            disabled={isLoading}
            style={{
              ...submitButtonStyle,
              opacity: isLoading ? 0.7 : 1
            }}
          >
            {isLoading ? 'جاري الحفظ...' : 'حفظ'}
          </button>
        </div>
      </form>
    </div>
  );
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

const formCardStyle = {
  backgroundColor: 'var(--basic-color)',
  border: '1px solid var(--border-color)',
  borderRadius: '12px',
  padding: '24px'
};

const formGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '16px'
};

const labelStyle = {
  display: 'block',
  marginBottom: '6px',
  color: '#182d40',
  fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
  fontWeight: 'bold'
};

const inputStyle = {
  width: '100%',
  backgroundColor: 'var(--basic-color)',
  border: '1px solid var(--border-color)',
  color: '#182d40',
  borderRadius: '8px',
  padding: '10px',
  fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
  boxSizing: 'border-box'
};

const sectionHeaderStyle = {
  fontSize: '16px',
  marginBottom: '12px',
  color: '#182d40',
  fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
  fontWeight: 'bold'
};

const detailRowStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '16px',
  padding: '12px',
  border: '1px solid var(--border-color)',
  borderRadius: '10px',
  marginBottom: '12px',
  backgroundColor: '#f7f9fc'
};

const addRowButtonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  backgroundColor: 'var(--main-color)',
  color: 'white',
  border: 'none',
  padding: '10px 16px',
  borderRadius: '8px',
  cursor: 'pointer',
  fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
  fontWeight: 'bold'
};

const removeRowButtonStyle = {
  backgroundColor: 'var(--red-color)',
  border: 'none',
  color: 'white',
  padding: '10px',
  borderRadius: '8px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '40px'
};

const uploadButtonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  backgroundColor: 'var(--gray-color)',
  color: 'white',
  border: 'none',
  padding: '10px 16px',
  borderRadius: '8px',
  cursor: 'pointer',
  fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
  fontWeight: 'bold'
};

const attachmentCardStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '12px',
  backgroundColor: 'white',
  border: '1px solid var(--border-color)',
  borderRadius: '10px',
  padding: '10px 14px',
  minWidth: '220px'
};

const removeAttachmentButtonStyle = {
  backgroundColor: 'var(--red-color)',
  border: 'none',
  color: 'white',
  padding: '6px',
  borderRadius: '6px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const formActionsStyle = {
  marginTop: '28px',
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '12px'
};

const cancelButtonStyle = {
  backgroundColor: 'var(--gray-color)',
  color: 'white',
  border: 'none',
  padding: '10px 18px',
  borderRadius: '8px',
  cursor: 'pointer',
  fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
  fontWeight: 'bold'
};

const submitButtonStyle = {
  backgroundColor: 'var(--main-color)',
  color: 'white',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '8px',
  cursor: 'pointer',
  fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
  fontWeight: 'bold'
};

const dropdownToggleStyle = {
  width: '100%',
  backgroundColor: 'var(--basic-color)',
  border: '1px solid var(--border-color)',
  color: '#182d40',
  borderRadius: '8px',
  padding: '10px',
  textAlign: 'right',
  cursor: 'pointer',
  fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
};

const dropdownMenuStyle = {
  position: 'absolute',
  top: 'calc(100% + 6px)',
  right: 0,
  zIndex: 1000,
  width: '100%',
  backgroundColor: 'white',
  border: '1px solid var(--border-color)',
  borderRadius: '10px',
  boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
  padding: '10px'
};

const dropdownSearchStyle = {
  width: '100%',
  padding: '8px',
  border: '1px solid var(--border-color)',
  borderRadius: '6px',
  marginBottom: '8px',
  fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
};

const dropdownListStyle = {
  maxHeight: '220px',
  overflowY: 'auto'
};

const dropdownItemStyle = {
  padding: '10px',
  borderRadius: '6px',
  cursor: 'pointer',
  marginBottom: '4px',
  backgroundColor: '#f6f8fb'
};

const emptyDropdownStyle = {
  padding: '12px',
  color: '#6c7a89',
  textAlign: 'center',
  fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
};

export default AddPaymentVoucher;


