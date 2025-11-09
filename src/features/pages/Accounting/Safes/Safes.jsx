import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getSafes, deleteSafe, toggleSafeStatus, clearError, clearSuccess } from '../../../../redux/Slices/authSlice';
import { FaPlus, FaEdit, FaTrash, FaEye, FaPowerOff, FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Safes = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { safes, safesPagination, isLoading, error, success } = useSelector((state) => state.auth);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isActiveFilter, setIsActiveFilter] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [safeToDelete, setSafeToDelete] = useState(null);
  const lastErrorRef = useRef({ message: null, time: 0 });
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    const params = {
      page: currentPage,
      per_page: 10
    };
    if (searchTerm) {
      params.search = searchTerm;
    }
    if (isActiveFilter !== '') {
      params.is_active = isActiveFilter;
    }
    dispatch(getSafes(params));
  }, [dispatch, currentPage, searchTerm, isActiveFilter]);

  useEffect(() => {
    if (success) {
      toast.success(success, { rtl: true });
      dispatch(clearSuccess());
      dispatch(getSafes({ page: currentPage, per_page: 10, search: searchTerm || undefined, is_active: isActiveFilter !== '' ? isActiveFilter : undefined }));
    }
  }, [success, dispatch, currentPage, searchTerm, isActiveFilter]);

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

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      // Search will be triggered by useEffect
    }, 500);
  };

  const handleFilterChange = (e) => {
    setIsActiveFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleDelete = (safe) => {
    setSafeToDelete(safe);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (safeToDelete) {
      await dispatch(deleteSafe(safeToDelete.id));
      setShowDeleteModal(false);
      setSafeToDelete(null);
    }
  };

  const handleToggleStatus = (id) => {
    dispatch(toggleSafeStatus(id));
  };

  if (isLoading && (!safes || safes.length === 0)) {
    return (
      <div style={{ 
        padding: '30px', 
        backgroundColor: 'var(--dashboard-bg)', 
        minHeight: 'calc(100vh - 80px)', 
        color: 'var(--text-primary)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
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
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: 'var(--text-primary)', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>الخزائن</h1>
        <button
          onClick={() => navigate('/safes/add')}
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
          <FaPlus style={{ color: 'white' }} /> إضافة خزنة
        </button>
      </div>

      {/* Filters */}
      <div style={{ 
        display: 'flex', 
        gap: '15px', 
        marginBottom: '20px',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '300px' }}>
          <FaSearch style={{
            position: 'absolute',
            right: '15px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#182d40',
            fontSize: '16px'
          }} />
          <input
            type="text"
            placeholder="بحث بالاسم..."
            value={searchTerm}
            onChange={handleSearchChange}
            style={{
              width: '100%',
              padding: '12px 45px 12px 15px',
              backgroundColor: 'var(--basic-color)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              color: 'var(--text-primary)',
              fontSize: '14px',
              fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
            }}
          />
        </div>
        <select
          value={isActiveFilter}
          onChange={handleFilterChange}
          style={{
            padding: '12px 15px',
            backgroundColor: 'var(--basic-color)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            color: 'var(--text-primary)',
            fontSize: '14px',
            minWidth: '150px',
            cursor: 'pointer',
            fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
          }}
        >
          <option value="">جميع الحالات</option>
          <option value="1">نشط</option>
          <option value="0">غير نشط</option>
        </select>
      </div>

      {safes && safes.length > 0 ? (
        <>
          <div style={{ 
            backgroundColor: 'var(--basic-color)', 
            border: '1px solid var(--border-color)', 
            borderRadius: '12px', 
            overflow: 'hidden' 
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'separate', 
                borderSpacing: 0,
                minWidth: '800px'
              }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--main-color)' }}>
                    <th style={{ padding: '18px 16px', textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: '14px', width: '60px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>#</th>
                    <th style={{ padding: '18px 16px', textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: '14px', width: '250px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>الاسم</th>
                    <th style={{ padding: '18px 16px', textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: '14px', width: '100px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>الحالة</th>
                    <th style={{ padding: '18px 16px', textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: '14px', width: '200px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {safes.map((safe, index) => (
                    <tr 
                      key={safe.id} 
                      style={{ 
                        borderBottom: '1px solid var(--border-color)',
                        backgroundColor: index % 2 === 0 ? 'var(--basic-color)' : '#f0f4fa',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(ev) => ev.target.closest('tr').style.backgroundColor = 'rgba(0, 106, 255, 0.08)'}
                      onMouseLeave={(ev) => ev.target.closest('tr').style.backgroundColor = index % 2 === 0 ? 'var(--basic-color)' : '#f0f4fa'}
                    >
                      <td style={{ padding: '18px 16px', textAlign: 'center', color: '#182d40', fontSize: '14px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>
                        {(safesPagination?.current_page - 1) * (safesPagination?.per_page || 10) + index + 1}
                      </td>
                      <td style={{ padding: '18px 16px', textAlign: 'center', color: '#182d40', fontSize: '14px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>{safe.name_ar || safe.name}</td>
                      <td style={{ padding: '18px 16px', textAlign: 'center' }}>
                        <span style={{
                          backgroundColor: safe.is_active ? 'var(--main-color)' : 'var(--red-color)',
                          color: 'white',
                          padding: '6px 14px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          display: 'inline-block',
                          fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                        }}>
                          {safe.is_active ? 'نشط' : 'غير نشط'}
                        </span>
                      </td>
                      <td style={{ padding: '18px 16px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <button
                            onClick={() => navigate(`/safes/view/${safe.id}`)}
                            style={{
                              backgroundColor: 'var(--gray-color)',
                              color: 'white',
                              border: 'none',
                              padding: '8px 12px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                            title="عرض"
                          >
                            <FaEye style={{ color: 'white' }} />
                          </button>
                          <button
                            onClick={() => navigate(`/safes/edit/${safe.id}`)}
                            style={{
                              backgroundColor: 'var(--gray-color)',
                              color: 'white',
                              border: 'none',
                              padding: '8px 12px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                            title="تعديل"
                          >
                            <FaEdit style={{ color: 'white' }} />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(safe.id)}
                            style={{
                              backgroundColor: safe.is_active ? 'var(--chart-color-2)' : 'var(--main-color)',
                              color: 'white',
                              border: 'none',
                              padding: '8px 12px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                            title={safe.is_active ? 'تعطيل' : 'تفعيل'}
                          >
                            <FaPowerOff style={{ color: 'white' }} />
                          </button>
                          <button
                            onClick={() => handleDelete(safe)}
                            style={{
                              backgroundColor: 'var(--red-color)',
                              color: 'white',
                              border: 'none',
                              padding: '8px 12px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                            title="حذف"
                          >
                            <FaTrash style={{ color: 'white' }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {safesPagination && safesPagination.last_page > 1 && (
              <div style={{
                padding: '20px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px',
                borderTop: '1px solid var(--border-color)'
              }}>
                {safesPagination.current_page > 1 && (
                  <button 
                    onClick={() => setCurrentPage(safesPagination.current_page - 1)}
                    style={{
                      backgroundColor: 'var(--basic-color)',
                      color: '#182d40',
                      border: '1px solid var(--border-color)',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                      fontWeight: 'bold'
                    }}
                  >
                    &lt;&lt;
                  </button>
                )}

                {Array.from({ length: safesPagination.last_page }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    style={{
                      backgroundColor: page === safesPagination.current_page ? 'var(--main-color)' : 'var(--basic-color)',
                      color: page === safesPagination.current_page ? 'white' : '#182d40',
                      border: page === safesPagination.current_page ? 'none' : '1px solid var(--border-color)',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                    }}
                  >
                    {page}
                  </button>
                ))}

                {safesPagination.current_page < safesPagination.last_page && (
                  <button 
                    onClick={() => setCurrentPage(safesPagination.current_page + 1)}
                    style={{
                      backgroundColor: 'var(--basic-color)',
                      color: '#182d40',
                      border: '1px solid var(--border-color)',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                      fontWeight: 'bold'
                    }}
                  >
                    &gt;&gt;
                  </button>
                )}
              </div>
            )}
          </div>
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
          fontWeight: 'bold',
          fontSize: '16px'
        }}>
          لا توجد خزائن
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
              هل أنت متأكد من حذف الخزنة "{safeToDelete?.name_ar || safeToDelete?.name}"؟
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSafeToDelete(null);
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

export default Safes;

