import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getCustomers, deleteCustomer, toggleCustomerStatus, clearError, clearSuccess } from '../../../../redux/Slices/authSlice';
import { FaPlus, FaEdit, FaTrash, FaEye, FaPowerOff, FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Customers = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { customers, customersPagination, isLoading, error, success } = useSelector((state) => state.auth);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isActiveFilter, setIsActiveFilter] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
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
    dispatch(getCustomers(params));
  }, [dispatch, currentPage, searchTerm, isActiveFilter]);

  useEffect(() => {
    if (success) {
      toast.success(success, { rtl: true });
      dispatch(clearSuccess());
      dispatch(getCustomers({ page: currentPage, per_page: 10, search: searchTerm || undefined, is_active: isActiveFilter !== '' ? isActiveFilter : undefined }));
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
    setCurrentPage(1); // Reset to first page when searching
    
    // Debounce search
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      // Search will be triggered by useEffect
    }, 500);
  };

  const handleFilterChange = (e) => {
    setIsActiveFilter(e.target.value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleDelete = (customer) => {
    setCustomerToDelete(customer);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (customerToDelete) {
      await dispatch(deleteCustomer(customerToDelete.id));
      setShowDeleteModal(false);
      setCustomerToDelete(null);
    }
  };

  const handleToggleStatus = (id) => {
    dispatch(toggleCustomerStatus(id));
  };

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
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: 'var(--text-primary)', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>العملاء</h1>
        <button
          onClick={() => navigate('/customers/add')}
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
          <FaPlus style={{ color: 'white' }} /> إضافة عميل
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
            placeholder="بحث بالاسم، الكود، البريد الإلكتروني..."
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

      <div style={{ 
        backgroundColor: 'var(--basic-color)', 
        border: '1px solid var(--border-color)', 
        borderRadius: '12px', 
        overflow: 'hidden',
        position: 'relative'
      }}>
        {isLoading && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(240, 244, 250, 0.9)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10,
            borderRadius: '12px'
          }}>
            <div style={{
              color: '#182d40',
              fontSize: '16px',
              fontWeight: 'bold',
              fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
            }}>
              جاري التحميل...
            </div>
          </div>
        )}
        {customers && customers.length > 0 ? (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'separate', 
                borderSpacing: 0,
                minWidth: '1400px'
              }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--main-color)' }}>
                    <th style={{ padding: '18px 16px', textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: '14px', width: '60px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>#</th>
                    <th style={{ padding: '18px 16px', textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: '14px', width: '140px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>الكود</th>
                    <th style={{ padding: '18px 16px', textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: '14px', width: '200px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>الاسم</th>
                    <th style={{ padding: '18px 16px', textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: '14px', width: '180px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>الشخص المسؤول</th>
                    <th style={{ padding: '18px 16px', textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: '14px', width: '200px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>البريد الإلكتروني</th>
                    <th style={{ padding: '18px 16px', textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: '14px', width: '140px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>الهاتف</th>
                    <th style={{ padding: '18px 16px', textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: '14px', width: '180px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>حد الائتمان</th>
                    <th style={{ padding: '18px 16px', textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: '14px', width: '100px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>الحالة</th>
                    <th style={{ padding: '18px 16px', textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: '14px', width: '200px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer, index) => (
                    <tr 
                      key={customer.id} 
                      style={{ 
                        borderBottom: '1px solid var(--border-color)',
                        backgroundColor: index % 2 === 0 ? 'var(--basic-color)' : '#f0f4fa',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(ev) => ev.target.closest('tr').style.backgroundColor = 'rgba(0, 106, 255, 0.08)'}
                      onMouseLeave={(ev) => ev.target.closest('tr').style.backgroundColor = index % 2 === 0 ? 'var(--basic-color)' : '#f0f4fa'}
                    >
                      <td style={{ padding: '18px 16px', textAlign: 'center', color: '#182d40', fontSize: '14px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>
                        {(customersPagination?.current_page - 1) * (customersPagination?.per_page || 10) + index + 1}
                      </td>
                      <td style={{ padding: '18px 16px', textAlign: 'center', color: '#182d40', fontSize: '14px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>{customer.code}</td>
                      <td style={{ padding: '18px 16px', textAlign: 'center', color: '#182d40', fontSize: '14px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>{customer.name_ar || customer.name}</td>
                      <td style={{ padding: '18px 16px', textAlign: 'center', color: '#182d40', fontSize: '14px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>{customer.contact_person || '-'}</td>
                      <td style={{ padding: '18px 16px', textAlign: 'center', color: '#182d40', fontSize: '14px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>{customer.email || '-'}</td>
                      <td style={{ padding: '18px 16px', textAlign: 'center', color: '#182d40', fontSize: '14px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>{customer.phone || '-'}</td>
                      <td style={{ padding: '18px 16px', textAlign: 'center', color: '#182d40', fontSize: '14px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>
                        {customer.credit_limit ? customer.credit_limit.toLocaleString('ar-EG') : '-'}
                      </td>
                      <td style={{ padding: '18px 16px', textAlign: 'center' }}>
                        <span style={{
                          backgroundColor: customer.is_active ? 'var(--main-color)' : 'var(--red-color)',
                          color: 'white',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: 'bold',
                          display: 'inline-block',
                          whiteSpace: 'nowrap',
                          fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                        }}>
                          {customer.is_active ? 'نشط' : 'غير نشط'}
                        </span>
                      </td>
                      <td style={{ padding: '18px 16px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', flexWrap: 'nowrap' }}>
                          <button
                            onClick={() => navigate(`/customers/view/${customer.id}`)}
                            style={{
                              backgroundColor: 'var(--gray-color)',
                              color: 'white',
                              border: 'none',
                              padding: '8px 10px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              minWidth: '36px',
                              height: '36px'
                            }}
                            title="عرض"
                          >
                            <FaEye style={{ color: 'white' }} />
                          </button>
                          <button
                            onClick={() => navigate(`/customers/edit/${customer.id}`)}
                            style={{
                              backgroundColor: 'var(--gray-color)',
                              color: 'white',
                              border: 'none',
                              padding: '8px 10px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              minWidth: '36px',
                              height: '36px'
                            }}
                            title="تعديل"
                          >
                            <FaEdit style={{ color: 'white' }} />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(customer.id)}
                            style={{
                              backgroundColor: customer.is_active ? 'var(--chart-color-2)' : 'var(--main-color)',
                              color: 'white',
                              border: 'none',
                              padding: '8px 10px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '36px',
                              height: '36px',
                              flexShrink: 0
                            }}
                            title={customer.is_active ? 'تعطيل' : 'تفعيل'}
                          >
                            <FaPowerOff style={{ fontSize: '14px', color: 'white' }} />
                          </button>
                          <button
                            onClick={() => handleDelete(customer)}
                            style={{
                              backgroundColor: 'var(--red-color)',
                              color: 'white',
                              border: 'none',
                              padding: '8px 10px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              minWidth: '36px',
                              height: '36px'
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
            {customersPagination && customersPagination.last_page > 1 && (
              <div style={{
                padding: '20px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px',
                borderTop: '1px solid var(--border-color)'
              }}>
                {/* Previous Button */}
                {customersPagination.current_page > 1 && (
                  <button 
                    onClick={() => setCurrentPage(customersPagination.current_page - 1)}
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

                {/* Page Numbers */}
                {Array.from({ length: customersPagination.last_page }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    style={{
                      backgroundColor: page === customersPagination.current_page ? 'var(--main-color)' : 'var(--basic-color)',
                      color: page === customersPagination.current_page ? 'white' : '#182d40',
                      border: page === customersPagination.current_page ? 'none' : '1px solid var(--border-color)',
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

                {/* Next Button */}
                {customersPagination.current_page < customersPagination.last_page && (
                  <button 
                    onClick={() => setCurrentPage(customersPagination.current_page + 1)}
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
          </>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px', 
            color: '#182d40',
            minHeight: '200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
            fontWeight: 'bold',
            fontSize: '16px'
          }}>
            {isLoading ? 'جاري التحميل...' : 'لا توجد عملاء'}
          </div>
        )}
      </div>

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
              هل أنت متأكد من حذف العميل "{customerToDelete?.name_ar || customerToDelete?.name}"؟
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setCustomerToDelete(null);
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

export default Customers;

