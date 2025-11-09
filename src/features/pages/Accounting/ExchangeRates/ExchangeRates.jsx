import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getExchangeRates, deleteExchangeRate, clearError, clearSuccess } from '../../../../redux/Slices/authSlice';
import { FaPlus, FaTrash, FaEye } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ExchangeRates = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { exchangeRates, exchangeRatesPagination, isLoading, error, success } = useSelector((state) => state.auth);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [rateToDelete, setRateToDelete] = useState(null);
  const lastErrorRef = useRef({ message: null, time: 0 });

  useEffect(() => {
    dispatch(getExchangeRates({ page: currentPage, per_page: 10 }));
  }, [dispatch, currentPage]);

  useEffect(() => {
    if (success) {
      toast.success(success, { rtl: true });
      dispatch(clearSuccess());
      dispatch(getExchangeRates({ page: currentPage, per_page: 10 }));
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

  const handleDelete = (rate) => {
    setRateToDelete(rate);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (rateToDelete) {
      await dispatch(deleteExchangeRate(rateToDelete.id));
      setShowDeleteModal(false);
      setRateToDelete(null);
    }
  };

  const renderPagination = () => {
    if (!exchangeRatesPagination || exchangeRatesPagination.last_page <= 1) return null;
    
    const { current_page, last_page } = exchangeRatesPagination;
    const pages = [];
    
    for (let i = 1; i <= last_page; i++) {
      if (
        i === 1 ||
        i === last_page ||
        (i >= current_page - 2 && i <= current_page + 2)
      ) {
        pages.push(i);
      } else if (i === current_page - 3 || i === current_page + 3) {
        pages.push('...');
      }
    }

    return (
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px' }}>
        <button
          onClick={() => setCurrentPage(current_page - 1)}
          disabled={current_page === 1}
          style={{
            padding: '8px 12px',
            backgroundColor: current_page === 1 ? 'var(--basic-color)' : 'var(--main-color)',
            color: current_page === 1 ? '#182d40' : 'white',
            border: '1px solid var(--border-color)',
            borderRadius: '4px',
            cursor: current_page === 1 ? 'not-allowed' : 'pointer',
            fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
            fontWeight: 'bold'
          }}
        >
          السابق
        </button>
        {pages.map((page, idx) => (
          page === '...' ? (
            <span key={`ellipsis-${idx}`} style={{ padding: '8px', color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>...</span>
          ) : (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              style={{
                padding: '8px 12px',
                backgroundColor: page === current_page ? 'var(--main-color)' : 'var(--basic-color)',
                color: page === current_page ? 'white' : '#182d40',
                border: '1px solid var(--border-color)',
                borderRadius: '4px',
                cursor: 'pointer',
                fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                fontWeight: 'bold'
              }}
            >
              {page}
            </button>
          )
        ))}
        <button
          onClick={() => setCurrentPage(current_page + 1)}
          disabled={current_page === last_page}
          style={{
            padding: '8px 12px',
            backgroundColor: current_page === last_page ? 'var(--basic-color)' : 'var(--main-color)',
            color: current_page === last_page ? '#182d40' : 'white',
            border: '1px solid var(--border-color)',
            borderRadius: '4px',
            cursor: current_page === last_page ? 'not-allowed' : 'pointer',
            fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
            fontWeight: 'bold'
          }}
        >
          التالي
        </button>
      </div>
    );
  };

  if (isLoading && (!exchangeRates || exchangeRates.length === 0)) {
    return (
      <div style={{ 
        padding: '30px', 
        backgroundColor: 'var(--dashboard-bg)', 
        minHeight: 'calc(100vh - 80px)', 
        color: '#182d40',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
        fontWeight: 'bold'
      }}>
        جاري التحميل...
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '30px',
      backgroundColor: 'var(--dashboard-bg)',
      minHeight: 'calc(100vh - 80px)',
      color: 'var(--text-primary)'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: 'var(--text-primary)', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>أسعار الصرف</h1>
        <button
          onClick={() => navigate('/exchange-rates/add')}
          style={{
            backgroundColor: 'var(--main-color)',
            color: 'white',
            border: 'none',
            padding: '12px 20px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
          }}
        >
          <FaPlus style={{ color: 'white' }} /> إضافة سعر صرف
        </button>
      </div>

      {exchangeRates && exchangeRates.length > 0 ? (
        <>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'separate', 
              borderSpacing: 0,
              backgroundColor: 'var(--basic-color)',
              borderRadius: '8px',
              overflow: 'hidden',
              minWidth: '800px'
            }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--main-color)' }}>
                  <th style={{ padding: '18px', textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: '14px', width: '10%', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>ID</th>
                  <th style={{ padding: '18px', textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: '14px', width: '20%', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>التاريخ</th>
                  <th style={{ padding: '18px', textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: '14px', width: '15%', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>سعر الصرف</th>
                  <th style={{ padding: '18px', textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: '14px', width: '20%', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>العملة</th>
                  <th style={{ padding: '18px', textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: '14px', width: '15%', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>رمز العملة</th>
                  <th style={{ padding: '18px', textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: '14px', width: '20%', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {exchangeRates.map((rate, index) => (
                  <tr key={rate.id} style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: index % 2 === 0 ? 'var(--basic-color)' : '#f0f4fa' }}>
                    <td style={{ padding: '18px', textAlign: 'center', fontSize: '14px', color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>{rate.id}</td>
                    <td style={{ padding: '18px', textAlign: 'center', fontSize: '14px', color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>{rate.date}</td>
                    <td style={{ padding: '18px', textAlign: 'center', fontSize: '14px', color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>{rate.rate}</td>
                    <td style={{ padding: '18px', textAlign: 'center', fontSize: '14px', color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>
                      {rate.currency?.name_ar || rate.currency?.name || 'N/A'}
                    </td>
                    <td style={{ padding: '18px', textAlign: 'center', fontSize: '14px', color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>
                      {rate.currency?.code || 'N/A'}
                    </td>
                    <td style={{ padding: '18px', textAlign: 'center', fontSize: '14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                        <button
                          onClick={() => navigate(`/exchange-rates/view/${rate.id}`)}
                          style={{
                            backgroundColor: 'var(--gray-color)',
                            color: 'white',
                            border: 'none',
                            padding: '8px 12px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '12px',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          <FaEye style={{ color: 'white' }} /> عرض
                        </button>
                        <button
                          onClick={() => handleDelete(rate)}
                          style={{
                            backgroundColor: 'var(--red-color)',
                            color: 'white',
                            border: 'none',
                            padding: '8px 12px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '12px',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          <FaTrash style={{ color: 'white' }} /> حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {renderPagination()}
        </>
      ) : (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px', 
          color: '#182d40',
          backgroundColor: 'var(--basic-color)',
          borderRadius: '8px',
          border: '1px solid var(--border-color)',
          fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
          fontWeight: 'bold'
        }}>
          لا توجد أسعار صرف
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 999999
        }}>
          <div style={{
            backgroundColor: 'var(--basic-color)',
            padding: '30px',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '400px',
            border: '1px solid var(--border-color)'
          }}>
            <h2 style={{ color: '#182d40', marginBottom: '20px', fontSize: '20px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>تأكيد الحذف</h2>
            <p style={{ color: '#182d40', marginBottom: '30px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>
              هل أنت متأكد من حذف سعر الصرف هذا؟
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setRateToDelete(null);
                }}
                style={{
                  padding: '10px 20px',
                  backgroundColor: 'var(--gray-color)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                  fontWeight: 'bold'
                }}
              >
                إلغاء
              </button>
              <button
                onClick={confirmDelete}
                style={{
                  padding: '10px 20px',
                  backgroundColor: 'var(--red-color)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                  fontWeight: 'bold'
                }}
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExchangeRates;

