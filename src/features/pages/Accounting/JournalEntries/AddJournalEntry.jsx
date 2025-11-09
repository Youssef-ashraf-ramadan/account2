import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addJournalEntry, getPostingAccounts, clearError, clearSuccess } from '../../../../redux/Slices/authSlice';
import { toast } from 'react-toastify';
import { FaPaperclip, FaTimes, FaArrowRight } from 'react-icons/fa';
import './journalEntries.css';

const emptyLine = () => ({ account_id: '', debit: 0, credit: 0, line_description: '' });

const AddJournalEntry = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, success, postingAccounts } = useSelector((s) => s.auth);
  const lastErrorRef = useRef({ message: null, time: 0 });
  const [searchTerms, setSearchTerms] = useState({});
  const [openDropdowns, setOpenDropdowns] = useState({});
  const searchInputRefs = useRef({});

  useEffect(() => {
    dispatch(getPostingAccounts());
  }, [dispatch]);

  const [form, setForm] = useState({
    entry_date: '',
    description: '',
    reference: '',
    status: 'draft',
    entryable_id: null,
    entryable_type: null,
    details: [emptyLine(), emptyLine()]
  });
  const [attachments, setAttachments] = useState([]);

  useEffect(() => {
    if (success) {
      toast.success(success, { rtl: true });
      dispatch(clearSuccess());
      navigate('/journal-entries');
    }
  }, [success, dispatch, navigate]);

  useEffect(() => {
    if (error) {
      const now = Date.now(); const last = lastErrorRef.current;
      if (!last.message || last.message !== error || now - last.time > 2000) {
        toast.error(error, { rtl: true });
        lastErrorRef.current = { message: error, time: now };
      }
      setTimeout(() => dispatch(clearError()), 3000);
    }
  }, [error, dispatch]);

  const updateLine = (idx, field, value) => {
    setForm((prev) => ({
      ...prev,
      details: prev.details.map((l, i) => i === idx ? { ...l, [field]: value } : l)
    }));
  };

  const addLine = () => setForm((p) => ({ ...p, details: [...p.details, emptyLine()] }));
  const removeLine = (idx) => setForm((p) => ({ ...p, details: p.details.filter((_, i) => i !== idx) }));

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    const newAttachments = files.map(file => ({
      id: Date.now() + Math.random(),
      file: file,
      name: file.name,
      size: file.size,
      url: URL.createObjectURL(file)
    }));
    
    setAttachments(prev => [...prev, ...newAttachments]);
    // Reset input
    e.target.value = '';
  };

  const removeAttachment = (attachmentId) => {
    setAttachments(prev => {
      const attachment = prev.find(a => a.id === attachmentId);
      if (attachment && attachment.url) {
        URL.revokeObjectURL(attachment.url);
      }
      return prev.filter(a => a.id !== attachmentId);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Prepare details array
    const detailsArray = form.details.map((d) => ({
      account_id: Number(d.account_id),
      debit: Number(d.debit || 0),
      credit: Number(d.credit || 0),
      line_description: d.line_description
    }));
    
    // Validate lines
    const hasInvalidAccount = detailsArray.some((detail) => !detail.account_id || Number(detail.account_id) === 0);
    if (hasInvalidAccount) {
      toast.error('برجاء اختيار حساب صالح لكل سطر', { rtl: true });
      return;
    }
    const detailsString = JSON.stringify(detailsArray);

    const formPayload = {
      entry_date: form.entry_date,
      description: form.description,
      reference: form.reference,
      status: form.status,
      entryable_id: form.entryable_id,
      entryable_type: form.entryable_type,
      details: detailsString
    };

    // Create FormData if there are attachments, otherwise use JSON
    if (attachments.length > 0) {
      const formDataToSend = new FormData();
      
      // Add all form fields
      formDataToSend.append('entry_date', form.entry_date);
      formDataToSend.append('description', form.description);
      formDataToSend.append('reference', form.reference);
      formDataToSend.append('status', form.status);
      if (form.entryable_id) {
        formDataToSend.append('entryable_id', form.entryable_id);
      }
      if (form.entryable_type) {
        formDataToSend.append('entryable_type', form.entryable_type);
      }
      
      formDataToSend.append('details', detailsString);
      
      // Add attachments
      attachments.forEach((attachment, index) => {
        formDataToSend.append(`attachments[${index}]`, attachment.file);
      });
      
      dispatch(addJournalEntry(formDataToSend));
    } else {
      dispatch(addJournalEntry(formPayload));
    }
  };

  return (
    <div style={{ padding: '30px', backgroundColor: 'var(--dashboard-bg)', minHeight: 'calc(100vh - 80px)', color: 'var(--text-primary)' }}>
      <div style={{ marginBottom: '30px' }}>
        <button
          onClick={() => navigate('/journal-entries')}
          style={{
            backgroundColor: 'var(--gray-color)',
            color: 'white',
            border: 'none',
            padding: '10px',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '20px',
            fontSize: '14px',
            fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
            fontWeight: 'bold'
          }}
        >
          <FaArrowRight style={{ color: 'white' }} />
          الرجوع
        </button>
        <h1 style={{ fontSize: '20px', margin: 0, color: 'var(--text-primary)', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>إضافة قيد يومي</h1>
      </div>
      <form onSubmit={handleSubmit} className="journal-form">
        <div className="journal-grid">
          <div>
            <label style={{ display: 'block', marginBottom: 6, color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>التاريخ</label>
            <input type="date" value={form.entry_date} onChange={(e) => setForm({ ...form, entry_date: e.target.value })} required style={{ width: '100%', backgroundColor: 'var(--basic-color)', border: '1px solid var(--border-color)', color: '#182d40', borderRadius: 8, padding: '10px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>المرجع</label>
            <input type="text" value={form.reference} onChange={(e) => setForm({ ...form, reference: e.target.value })} style={{ width: '100%', backgroundColor: 'var(--basic-color)', border: '1px solid var(--border-color)', color: '#182d40', borderRadius: 8, padding: '10px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }} />
          </div>
          <div className="journal-grid__full">
            <label style={{ display: 'block', marginBottom: 6, color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>الوصف</label>
            <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ width: '100%', backgroundColor: 'var(--basic-color)', border: '1px solid var(--border-color)', color: '#182d40', borderRadius: 8, padding: '10px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }} />
          </div>
          <div className="journal-grid__full">
            <label style={{ display: 'block', marginBottom: 6, color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>الحالة</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} style={{ width: '100%', backgroundColor: 'var(--basic-color)', border: '1px solid var(--border-color)', color: '#182d40', borderRadius: 8, padding: '10px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>
              <option value="draft">draft</option>
              <option value="accepted">accepted</option>
              <option value="posted">posted</option>
            </select>
          </div>
        </div>

        <div className="detail-section">
          <h3 style={{ fontSize: '16px', marginBottom: '10px', color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>تفاصيل القيد</h3>
          {form.details.map((line, idx) => {
            const searchTerm = searchTerms[idx] || '';
            const filteredAccounts = (postingAccounts || []).filter((acc) => {
              if (!searchTerm) return true;
              const searchLower = searchTerm.toLowerCase();
              const codeMatch = acc.code?.toLowerCase().includes(searchLower);
              const nameMatch = acc.name_ar?.toLowerCase().includes(searchLower) || acc.name?.toLowerCase().includes(searchLower);
              return codeMatch || nameMatch;
            });
            
            return (
              <div key={idx} className="detail-row">
                <div style={{ position: 'relative' }}>
                  <div
                    onClick={() => {
                      setOpenDropdowns(prev => ({ ...prev, [idx]: !prev[idx] }));
                      setTimeout(() => {
                        if (searchInputRefs.current[idx]) {
                          searchInputRefs.current[idx].focus();
                        }
                      }, 100);
                    }}
                    style={{
                      width: '100%',
                      padding: '10px',
                      backgroundColor: 'var(--basic-color)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      color: '#182d40',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      boxSizing: 'border-box',
                      fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                    }}
                  >
                    <span>
                      {line.account_id 
                        ? (() => {
                            const selected = postingAccounts?.find(acc => String(acc.id) === String(line.account_id));
                            return selected ? `${selected.code} - ${selected.name_ar || selected.name}` : 'اختر الحساب';
                          })()
                        : 'اختر الحساب'}
                    </span>
                    <span style={{ fontSize: '12px' }}>▼</span>
                  </div>
                  {openDropdowns[idx] && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        backgroundColor: 'var(--basic-color)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '0 0 8px 8px',
                        zIndex: 1000,
                        maxHeight: '300px',
                        overflowY: 'auto',
                        boxShadow: '0 4px 6px rgba(0, 106, 255, 0.1)'
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        ref={(el) => searchInputRefs.current[idx] = el}
                        type="text"
                        placeholder="ابحث عن الحساب..."
                        value={searchTerm}
                        onChange={(e) => {
                          const searchValue = e.target.value;
                          setSearchTerms(prev => ({ ...prev, [idx]: searchValue }));
                          if (searchValue) {
                            dispatch(getPostingAccounts(searchValue));
                          } else {
                            dispatch(getPostingAccounts());
                          }
                        }}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          width: '100%',
                          padding: '10px',
                          backgroundColor: 'var(--basic-color)',
                          border: 'none',
                          borderBottom: '1px solid var(--border-color)',
                          color: '#182d40',
                          fontSize: '14px',
                          boxSizing: 'border-box',
                          fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                        }}
                      />
                      <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                        {filteredAccounts.length > 0 ? (
                          filteredAccounts.map((acc) => {
                            const isSelectedInOtherLine = form.details.some((d, i) => {
                              if (i === idx) return false;
                              const otherLineAccountId = d.account_id ? String(d.account_id) : '';
                              const currentAccountId = String(acc.id);
                              return otherLineAccountId === currentAccountId && otherLineAccountId !== '';
                            });
                            const isSelected = String(line.account_id) === String(acc.id);
                            return (
                              <div
                                key={acc.id}
                                onClick={() => {
                                  if (!isSelectedInOtherLine) {
                                    updateLine(idx, 'account_id', acc.id);
                                    setOpenDropdowns(prev => ({ ...prev, [idx]: false }));
                                    setSearchTerms(prev => ({ ...prev, [idx]: '' }));
                                  }
                                }}
                                style={{
                                  padding: '10px',
                                  cursor: isSelectedInOtherLine ? 'not-allowed' : 'pointer',
                                  backgroundColor: isSelected ? 'var(--main-color)' : isSelectedInOtherLine ? 'rgba(0, 106, 255, 0.1)' : 'transparent',
                                  color: isSelectedInOtherLine ? '#888' : isSelected ? 'white' : '#182d40',
                                  borderBottom: '1px solid var(--border-color)',
                                  opacity: isSelectedInOtherLine ? 0.5 : 1,
                                  fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                                  fontWeight: 'bold'
                                }}
                                onMouseEnter={(e) => {
                                  if (!isSelectedInOtherLine && !isSelected) {
                                    e.target.style.backgroundColor = 'rgba(0, 106, 255, 0.1)';
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (!isSelectedInOtherLine && !isSelected) {
                                    e.target.style.backgroundColor = 'transparent';
                                  }
                                }}
                              >
                                {acc.code} - {acc.name_ar || acc.name} {isSelectedInOtherLine ? '(مختار بالفعل)' : ''}
                              </div>
                            );
                          })
                        ) : (
                          <div style={{ padding: '10px', color: '#182d40', textAlign: 'center', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>
                            لا توجد نتائج
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {openDropdowns[idx] && (
                    <div
                      style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 999
                      }}
                      onClick={() => {
                        setOpenDropdowns(prev => ({ ...prev, [idx]: false }));
                      }}
                    />
                  )}
                </div>
                <input type="number" step="0.01" placeholder="مدين" value={line.debit} onChange={(e) => updateLine(idx, 'debit', e.target.value)} style={{ backgroundColor: 'var(--basic-color)', border: '1px solid var(--border-color)', color: '#182d40', borderRadius: 8, padding: '10px', width: '100%', boxSizing: 'border-box', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }} />
                <input type="number" step="0.01" placeholder="دائن" value={line.credit} onChange={(e) => updateLine(idx, 'credit', e.target.value)} style={{ backgroundColor: 'var(--basic-color)', border: '1px solid var(--border-color)', color: '#182d40', borderRadius: 8, padding: '10px', width: '100%', boxSizing: 'border-box', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }} />
                <input type="text" placeholder="الوصف" value={line.line_description} onChange={(e) => updateLine(idx, 'line_description', e.target.value)} style={{ backgroundColor: 'var(--basic-color)', border: '1px solid var(--border-color)', color: '#182d40', borderRadius: 8, padding: '10px', width: '100%', boxSizing: 'border-box', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }} />
                <button type="button" onClick={() => removeLine(idx)} className="detail-remove" style={{ background: 'var(--red-color)', color: 'white', border: 'none', borderRadius: 8, padding: '10px', cursor: 'pointer', fontSize: '12px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>حذف</button>
              </div>
            );
          })}
          <button type="button" onClick={addLine} className="detail-add-line">+ إضافة سطر</button>
        </div>

        {/* المرفقات */}
        <div style={{ marginTop: '24px', marginBottom: '24px' }}>
          <label style={{ 
            display: 'block',
            marginBottom: '15px',
            fontWeight: 'bold',
            color: '#182d40',
            fontSize: '16px',
            fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
          }}>
            المرفقات (اختياري)
          </label>
          
          {/* زر رفع الملفات */}
          <div style={{ marginBottom: '20px' }}>
            <input
              type="file"
              id="fileUpload"
              multiple
              accept="*/*"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            <label
              htmlFor="fileUpload"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'transparent',
                color: '#182d40',
                padding: '12px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                border: '2px solid var(--main-color)',
                transition: 'all 0.3s ease',
                fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
              }}
            >
              <FaPaperclip style={{ color: 'var(--main-color)' }} />
              إضافة مرفقات
            </label>
          </div>
          
          {/* عرض الملفات المرفوعة */}
          {attachments.length > 0 && (
            <div className="attachments-grid">
              {attachments.map((attachment) => (
                <div key={attachment.id} style={{
                  backgroundColor: 'var(--basic-color)',
                  padding: '15px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  position: 'relative'
                }}>
                  <button
                    type="button"
                    onClick={() => removeAttachment(attachment.id)}
                    style={{
                      position: 'absolute',
                      top: '5px',
                      left: '5px',
                      backgroundColor: 'var(--red-color)',
                      color: 'var(--text-primary)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '25px',
                      height: '25px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px'
                    }}
                  >
                    <FaTimes style={{ color: 'white' }} />
                  </button>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <FaPaperclip style={{ fontSize: '24px', color: 'var(--main-color)' }} />
                    <div style={{
                      fontSize: '12px',
                      color: '#182d40',
                      textAlign: 'center',
                      wordBreak: 'break-word',
                      maxWidth: '100%',
                      fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                      fontWeight: 'bold'
                    }}>
                      {attachment.name}
                    </div>
                    <div style={{
                      fontSize: '10px',
                      color: '#182d40',
                      opacity: 0.7,
                      fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                    }}>
                      {(attachment.size / 1024).toFixed(2)} KB
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button type="button" onClick={() => navigate('/journal-entries')} style={{ background: 'var(--gray-color)', color: 'white', border: 'none', borderRadius: 8, padding: '10px 16px', cursor: 'pointer', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>إلغاء</button>
          <button type="submit" disabled={isLoading} style={{ background: isLoading ? 'var(--gray-color)' : 'var(--main-color)', color: 'white', border: 'none', borderRadius: 8, padding: '10px 16px', cursor: 'pointer', opacity: isLoading ? 0.7 : 1, fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>{isLoading ? 'جاري الحفظ...' : 'حفظ'}</button>
        </div>
      </form>
    </div>
  );
};

export default AddJournalEntry;


