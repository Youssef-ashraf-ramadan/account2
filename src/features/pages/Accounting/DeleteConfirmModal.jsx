import React from 'react';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, accountName }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 999999
    }} onClick={onClose}>
      <div style={{
        background: '#1f2937',
        padding: '2rem',
        borderRadius: '12px',
        width: '90%',
        maxWidth: '400px',
        position: 'relative'
      }} onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            background: 'transparent',
            border: 'none',
            color: '#9ca3af',
            cursor: 'pointer',
            fontSize: '24px',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#374151';
            e.target.style.color = '#fff';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent';
            e.target.style.color = '#9ca3af';
          }}
        >
          ×
        </button>

        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <div style={{
            width: '60px',
            height: '60px',
            margin: '0 auto 1.5rem',
            borderRadius: '50%',
            background: 'rgba(239, 68, 68, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{ fontSize: '32px', color: '#ef4444' }}>⚠️</span>
          </div>
          
          <h3 style={{ color: '#fff', marginBottom: '0.5rem', fontSize: '18px', fontWeight: 600 }}>
            تأكيد الحذف
          </h3>
          
          <p style={{ color: '#9ca3af', marginBottom: '1.5rem', fontSize: '14px', lineHeight: '1.5' }}>
            هل أنت متأكد من حذف حساب
          </p>
          
          {accountName && (
            <p style={{ color: '#fff', marginBottom: '1.5rem', fontSize: '16px', fontWeight: 600 }}>
              {accountName}
            </p>
          )}
          
          <p style={{ color: '#ef4444', marginBottom: '1.5rem', fontSize: '13px' }}>
            لا يمكن التراجع عن هذه العملية
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '0.75rem',
              background: '#374151',
              border: '1px solid #4b5563',
              borderRadius: '8px',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 500,
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#4b5563';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#374151';
            }}
          >
            إلغاء
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: '0.75rem',
              background: '#ef4444',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 500,
              transition: 'all 0.2s',
              boxShadow: '0 2px 4px rgba(239, 68, 68, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#dc2626';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#ef4444';
            }}
          >
            حذف
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;

