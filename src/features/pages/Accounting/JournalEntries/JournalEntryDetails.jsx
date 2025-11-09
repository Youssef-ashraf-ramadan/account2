import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getJournalEntryDetails, clearError } from '../../../../redux/Slices/authSlice';
import { toast } from 'react-toastify';
import { FaArrowRight } from 'react-icons/fa';

const JournalEntryDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { journalEntryDetails, isLoading, error } = useSelector((s) => s.auth);
  const lastErrorRef = useRef({ message: null, time: 0 });

  useEffect(() => {
    dispatch(getJournalEntryDetails(id));
  }, [dispatch, id]);

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

  if (isLoading || !journalEntryDetails) {
    return (<div style={{ padding: '30px', backgroundColor: 'var(--dashboard-bg)', minHeight: 'calc(100vh - 80px)', color: '#182d40', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>جاري التحميل...</div>);
  }

  const e = journalEntryDetails;
  const formattedDate = e.entry_date ? new Date(e.entry_date).toLocaleDateString('ar-EG') : '-';
  const attachments = Array.isArray(e.attachments)
    ? e.attachments
    : Array.isArray(e.attachments?.data)
      ? e.attachments.data
      : [];

  const formatFileSize = (value) => {
    if (!value) return '';
    const size = Number(value);
    if (Number.isNaN(size)) return '';
    if (size >= 1024 * 1024)
      return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    if (size >= 1024)
      return `${(size / 1024).toFixed(2)} KB`;
    return `${size} B`;
  };

  return (
    <div style={{ padding: '30px', backgroundColor: 'var(--dashboard-bg)', minHeight: 'calc(100vh - 80px)', color: 'var(--text-primary)' }}>
      <div style={{ marginBottom: '30px' }}>
        <button onClick={() => navigate('/journal-entries')} style={{ background: 'var(--gray-color)', color: 'white', border: 'none', borderRadius: 8, padding: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', fontSize: '14px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>
          <FaArrowRight style={{ color: 'white' }} />
          الرجوع
        </button>
      </div>
      <div style={{ backgroundColor: 'var(--basic-color)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--main-color)' }}>
          <strong style={{ color: 'white', fontSize: '18px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>تفاصيل القيد #{e.id}</strong>
        </div>
        <div style={{ padding: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div><div style={{ color: '#182d40', fontSize: 12, opacity: 0.7, fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold', marginBottom: '4px' }}>التاريخ</div><div style={{ color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>{formattedDate}</div></div>
            <div><div style={{ color: '#182d40', fontSize: 12, opacity: 0.7, fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold', marginBottom: '4px' }}>المرجع</div><div style={{ color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>{e.reference || '-'}</div></div>
            <div><div style={{ color: '#182d40', fontSize: 12, opacity: 0.7, fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold', marginBottom: '4px' }}>الحالة</div><div><span style={{ backgroundColor: e.status === 'posted' ? 'var(--main-color)' : e.status === 'accepted' ? 'var(--chart-color-2)' : 'var(--gray-color)', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>{e.status === 'posted' ? 'مرحل' : e.status === 'accepted' ? 'مقبول' : 'مسودة'}</span></div></div>
            <div><div style={{ color: '#182d40', fontSize: 12, opacity: 0.7, fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold', marginBottom: '4px' }}>المنشئ</div><div style={{ color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>{e.creator || '-'}</div></div>
          </div>
          <div style={{ marginBottom: '12px' }}>
            <div style={{ color: '#182d40', fontSize: 12, opacity: 0.7, fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold', marginBottom: '4px' }}>الوصف</div>
            <div style={{ color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>{e.description || '-'}</div>
          </div>
          <div style={{ marginTop: '20px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '16px', fontWeight: 'bold', color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>المرفقات</h3>
            {attachments.length > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: '15px',
                marginBottom: '24px'
              }}>
                {attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    onClick={() => window.open(attachment.url, '_blank', 'noopener,noreferrer')}
                    style={{
                      backgroundColor: 'var(--basic-color)',
                      padding: '18px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                      alignItems: 'center',
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.boxShadow = '0 12px 28px rgba(15, 31, 51, 0.18)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ fontSize: '28px', color: 'var(--main-color)' }}>📄</div>
                    <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', textAlign: 'center', wordBreak: 'break-word' }}>
                      {attachment.original_name || attachment.file_name || `مرفق ${attachment.id}`}
                    </div>
                    <div style={{ fontSize: '12px', color: '#182d40', opacity: 0.7, fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>
                      {formatFileSize(attachment.size)}
                    </div>
                    <div style={{ fontSize: '12px', color: '#182d40', opacity: 0.7, fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>
                      النوع: {attachment.mime_type || '-'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                backgroundColor: 'var(--basic-color)',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                padding: '16px',
                fontSize: '14px',
                color: '#182d40',
                fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                textAlign: 'center',
                marginBottom: '24px'
              }}>
                لا توجد مرفقات
              </div>
            )}

            <h3 style={{ fontSize: '18px', marginBottom: '16px', fontWeight: 'bold', color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>تفاصيل السطور</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--main-color)' }}>
                    {[
                      { label: '#', width: '60px' },
                      { label: 'الحساب', width: '180px' },
                      { label: 'الكود', width: '100px' },
                      { label: 'النوع', width: '120px' },
                      { label: 'الفئة', width: '120px' },
                      { label: 'مدين', width: '130px' },
                      { label: 'دائن', width: '130px' },
                      { label: 'الوصف', width: '200px' }
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
                          fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                        }}
                      >
                        {h.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(e.details || []).map((d, idx) => (
                    <tr 
                      key={d.id} 
                      style={{ 
                        borderBottom: '1px solid var(--border-color)',
                        backgroundColor: idx % 2 === 0 ? 'var(--basic-color)' : '#f0f4fa',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(ev) => ev.target.closest('tr').style.backgroundColor = 'rgba(0, 106, 255, 0.08)'}
                      onMouseLeave={(ev) => ev.target.closest('tr').style.backgroundColor = idx % 2 === 0 ? 'var(--basic-color)' : '#f0f4fa'}
                    >
                      <td style={{ padding: '18px 16px', textAlign: 'center', color: '#182d40', fontSize: '14px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>{idx + 1}</td>
                      <td style={{ padding: '18px 16px', textAlign: 'center', color: '#182d40', fontSize: '14px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>{d.account?.name_ar || d.account?.name || '-'}</td>
                      <td style={{ padding: '18px 16px', textAlign: 'center', color: '#182d40', fontSize: '14px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>{d.account?.code || '-'}</td>
                      <td style={{ padding: '18px 16px', textAlign: 'center', color: '#182d40', fontSize: '14px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>{d.account?.type || '-'}</td>
                      <td style={{ padding: '18px 16px', textAlign: 'center', color: '#182d40', fontSize: '14px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>{d.account?.category || '-'}</td>
                      <td style={{ padding: '18px 16px', textAlign: 'center', color: '#182d40', fontSize: '14px', fontWeight: 'bold', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>
                        {parseFloat(d.debit || 0).toLocaleString('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td style={{ padding: '18px 16px', textAlign: 'center', color: '#182d40', fontSize: '14px', fontWeight: 'bold', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>
                        {parseFloat(d.credit || 0).toLocaleString('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td style={{ padding: '18px 16px', textAlign: 'center', color: '#182d40', fontSize: '14px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>{d.line_description || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalEntryDetails;


