import React from 'react';
import { motion } from 'framer-motion';
import { FaTrash } from 'react-icons/fa';

const DeleteConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "تأكيد الحذف",
  message = "هل أنت متأكد من حذف هذا العنصر؟",
  itemName = "",
  isLoading = false 
}) => {
  if (!isOpen) return null;

  const fullMessage = itemName ? `هل أنت متأكد من حذف ${itemName}؟` : message;

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <motion.div 
          className="modal-content"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{ 
            border: 'none',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
          }}
        >
          <div className="modal-header" style={{ 
            border: 'none', 
            padding: '24px 24px 0 24px',
            backgroundColor: 'white'
          }}>
            <h5 className="modal-title fw-bold" style={{ 
              color: '#6B46C1',
              fontSize: '1.25rem',
              margin: 0
            }}>
              {title}
            </h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose}
              style={{ fontSize: '0.8rem' }}
              aria-label="Close"
            >
            </button>
          </div>
          
          <div className="modal-body" style={{ 
            padding: '16px 24px',
            backgroundColor: 'white'
          }}>
            <p className="mb-2" style={{ 
              color: '#374151',
              fontSize: '1rem',
              lineHeight: '1.5'
            }}>
              {fullMessage}
            </p>
            <p className="mb-0 text-muted" style={{ 
              fontSize: '0.875rem'
            }}>
              لا يمكن التراجع عن هذا الإجراء.
            </p>
          </div>
          
          <div className="modal-footer" style={{ 
            border: 'none',
            padding: '0 24px 24px 24px',
            backgroundColor: 'white',
            justifyContent: 'flex-end',
            gap: '12px'
          }}>
            <motion.button
              type="button"
              className="btn"
              onClick={onClose}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                backgroundColor: 'white',
                border: '1px solid #D1D5DB',
                color: '#374151',
                borderRadius: '8px',
                padding: '10px 20px',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
              disabled={isLoading}
            >
              إلغاء
            </motion.button>
            
            <motion.button
              type="button"
              className="btn d-flex align-items-center gap-2"
              onClick={onConfirm}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                backgroundColor: '#DC2626',
                border: 'none',
                color: 'white',
                borderRadius: '8px',
                padding: '10px 20px',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="spinner-border spinner-border-sm" role="status" style={{ width: '14px', height: '14px' }}>
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  جاري الحذف...
                </>
              ) : (
                <>
                  <FaTrash style={{ fontSize: '0.75rem' }} />
                  حذف
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
