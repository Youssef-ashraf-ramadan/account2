import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getCurrencies, deleteCurrency, toggleCurrencyStatus, clearError, clearSuccess } from '../../../../redux/Slices/authSlice';
import { FaPlus, FaEdit, FaTrash, FaEye, FaPowerOff } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Currencies = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currencies, currenciesPagination, isLoading, error, success } = useSelector((state) => state.auth);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currencyToDelete, setCurrencyToDelete] = useState(null);
  const lastErrorRef = useRef({ message: null, time: 0 });

  useEffect(() => {
    dispatch(getCurrencies({ page: currentPage, per_page: 10 }));
  }, [dispatch, currentPage]);

  useEffect(() => {
    if (success) {
      toast.success(success, { rtl: true });
      dispatch(clearSuccess());
      dispatch(getCurrencies({ page: currentPage, per_page: 10 }));
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

  const handleDelete = (currency) => {
    setCurrencyToDelete(currency);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (currencyToDelete) {
      await dispatch(deleteCurrency(currencyToDelete.id));
      setShowDeleteModal(false);
      setCurrencyToDelete(null);
    }
  };

  const handleToggleStatus = (id) => {
    dispatch(toggleCurrencyStatus(id));
  };

  if (isLoading && (!currencies || currencies.length === 0)) {
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
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: 'var(--text-primary)', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>العملات</h1>
        <button
          onClick={() => navigate('/currencies/add')}
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
          <FaPlus style={{ color: 'white' }} /> إضافة عملة
        </button>
      </div>

      <div style={{
        backgroundColor: 'var(--basic-color)',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid var(--border-color)'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'separate',
            borderSpacing: 0
          }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--main-color)' }}>
                {[
                  { label: '#', width: '80px' },
                  { label: 'الاسم', width: '200px' },
                  { label: 'الكود', width: '120px' },
                  { label: 'الرمز', width: '120px' },
                  { label: 'الحالة', width: '120px' },
                  { label: 'العملة الأساسية', width: '150px' },
                  { label: 'الإجراءات', width: '220px' }
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
              {(currencies || []).length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ padding: '40px', textAlign: 'center', color: '#182d40', fontSize: '16px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>
                    لا توجد عملات متاحة
                  </td>
                </tr>
              ) : (
                (currencies || []).map((currency, idx) => (
                  <tr 
                    key={currency.id} 
                    style={{ 
                      borderBottom: '1px solid var(--border-color)',
                      backgroundColor: idx % 2 === 0 ? 'var(--basic-color)' : '#f0f4fa',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(ev) => ev.target.closest('tr').style.backgroundColor = 'rgba(0, 106, 255, 0.08)'}
                    onMouseLeave={(ev) => ev.target.closest('tr').style.backgroundColor = idx % 2 === 0 ? 'var(--basic-color)' : '#f0f4fa'}
                  >
                    <td style={{ padding: '18px 16px', textAlign: 'center', color: '#182d40', fontSize: '14px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>
                      {(currenciesPagination?.current_page - 1) * (currenciesPagination?.per_page || 10) + idx + 1}
                    </td>
                    <td style={{ padding: '18px 16px', textAlign: 'center', color: '#182d40', fontSize: '14px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>
                      {currency.name || '-'}
                    </td>
                    <td style={{ padding: '18px 16px', textAlign: 'center', color: '#182d40', fontSize: '14px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>
                      {currency.code || '-'}
                    </td>
                    <td style={{ padding: '18px 16px', textAlign: 'center', color: '#182d40', fontSize: '14px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>
                      {currency.symbol || '-'}
                    </td>
                    <td style={{ padding: '18px 16px', textAlign: 'center' }}>
                      <span style={{ 
                        backgroundColor: currency.is_active ? 'var(--main-color)' : 'var(--red-color)', 
                        color: 'white', 
                        padding: '6px 14px', 
                        borderRadius: '20px', 
                        fontSize: '12px',
                        fontWeight: 'bold',
                        display: 'inline-block',
                        fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                      }}>
                        {currency.is_active ? 'نشط' : 'غير نشط'}
                      </span>
                    </td>
                    <td style={{ padding: '18px 16px', textAlign: 'center' }}>
                      <span style={{ 
                        backgroundColor: currency.is_base_currency ? 'var(--main-color)' : 'var(--gray-color)', 
                        color: 'white', 
                        padding: '6px 14px', 
                        borderRadius: '20px', 
                        fontSize: '12px',
                        fontWeight: 'bold',
                        display: 'inline-block',
                        fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                      }}>
                        {currency.is_base_currency ? 'نعم' : 'لا'}
                      </span>
                    </td>
                    <td style={{ padding: '18px 16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center', flexWrap: 'nowrap' }}>
                        <button 
                          title="عرض" 
                          onClick={() => navigate(`/currencies/view/${currency.id}`)} 
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
                        >
                          <FaEye style={{ color: 'white' }} />
                        </button>
                        <button 
                          title="تعديل" 
                          onClick={() => navigate(`/currencies/edit/${currency.id}`)} 
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
                        >
                          <FaEdit style={{ color: 'white' }} />
                        </button>
                        <button 
                          title="تفعيل/تعطيل" 
                          onClick={() => handleToggleStatus(currency.id)} 
                          style={{ 
                            backgroundColor: currency.is_active ? 'var(--chart-color-2)' : 'var(--main-color)', 
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
                        >
                          <FaPowerOff style={{ color: 'white' }} />
                        </button>
                        <button 
                          title="حذف" 
                          onClick={() => handleDelete(currency)} 
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
                        >
                          <FaTrash style={{ color: 'white' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {currenciesPagination && (currencies && currencies.length > 0) && currenciesPagination.last_page > 1 && (
          <div style={{ padding: '16px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'center', gap: '8px' }}>
            {Array.from({ length: currenciesPagination.last_page }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setCurrentPage(p)} style={{ backgroundColor: p === currenciesPagination.current_page ? 'var(--main-color)' : 'var(--basic-color)', color: p === currenciesPagination.current_page ? 'white' : '#182d40', border: '1px solid var(--border-color)', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>{p}</button>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal show d-block" style={{ 
          backgroundColor: 'rgba(0,0,0,0.5)', 
          position: 'fixed',
          inset: 0,
          zIndex: 999999
        }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{
              backgroundColor: 'var(--basic-color)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            }}>
              <div className="modal-header" style={{ border: 'none', borderBottom: '1px solid var(--border-color)', width: '100%', textAlign: 'center', display: 'block' }}>
                <h5 className="modal-title" style={{ color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>تأكيد الحذف</h5>
              </div>
              <div className="modal-body" style={{ textAlign: 'center' }}>
                <p style={{ color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>هل أنت متأكد من حذف العملة "{currencyToDelete?.name}"؟</p>
                <p style={{ color: 'var(--red-color)', fontSize: '13px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>هذا الإجراء لا يمكن التراجع عنه.</p>
              </div>
              <div className="modal-footer" style={{ border: 'none', justifyContent: 'center' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteModal(false)}
                  style={{
                    backgroundColor: 'var(--gray-color)',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 20px',
                    color: 'white',
                    cursor: 'pointer',
                    fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                    fontWeight: 'bold'
                  }}
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={confirmDelete}
                  style={{
                    backgroundColor: 'var(--red-color)',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 20px',
                    color: 'white',
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
        </div>
      )}
    </div>
  );
};

export default Currencies;

