import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getVendors, deleteVendor, toggleVendorStatus, clearError, clearSuccess } from '../../../../redux/Slices/authSlice';
import { FaPlus, FaEdit, FaTrash, FaEye, FaPowerOff } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Vendors = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { vendors, vendorsPagination, isLoading, error, success } = useSelector((state) => state.auth);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [vendorToDelete, setVendorToDelete] = useState(null);
  const lastErrorRef = useRef({ message: null, time: 0 });
  const shouldNavigateToLastPageRef = useRef(false);

  useEffect(() => {
    dispatch(getVendors({ page: currentPage, per_page: 10 }));
  }, [dispatch, currentPage]);

  useEffect(() => {
    if (success) {
      toast.success(success, { rtl: true });
      // التحقق إذا كانت الرسالة تتعلق بإضافة مورد جديد
      if (success.includes('إضافة') || success.includes('تم إضافة')) {
        shouldNavigateToLastPageRef.current = true;
      }
      dispatch(clearSuccess());
      // إعادة جلب البيانات للحصول على آخر pagination
      dispatch(getVendors({ page: 1, per_page: 10 }));
    }
  }, [success, dispatch]);

  // عند تحديث vendorsPagination بعد إضافة مورد جديد، انتقل إلى آخر صفحة
  useEffect(() => {
    if (vendorsPagination && vendorsPagination.last_page > 0 && shouldNavigateToLastPageRef.current) {
      const lastPage = vendorsPagination.last_page;
      if (currentPage !== lastPage) {
        setCurrentPage(lastPage);
      }
      shouldNavigateToLastPageRef.current = false; // إعادة تعيين الـ flag
    }
  }, [vendorsPagination, currentPage]);

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

  const handleDelete = (vendor) => {
    setVendorToDelete(vendor);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (vendorToDelete) {
      await dispatch(deleteVendor(vendorToDelete.id));
      setShowDeleteModal(false);
      setVendorToDelete(null);
    }
  };

  const handleToggleStatus = (id) => {
    dispatch(toggleVendorStatus(id));
  };

  const renderPagination = () => {
    if (!vendorsPagination) return null;
    
    const { current_page, last_page } = vendorsPagination;
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

  if (isLoading && (!vendors || vendors.length === 0)) {
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
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: 'var(--text-primary)', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>الموردون</h1>
        <button
          onClick={() => navigate('/vendors/add')}
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
          <FaPlus style={{ color: 'white' }} /> إضافة مورد
        </button>
      </div>

      {vendors && vendors.length > 0 ? (
        <>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'separate', 
              borderSpacing: 0,
              backgroundColor: 'var(--basic-color)',
              borderRadius: '8px',
              overflow: 'hidden',
              minWidth: '1200px'
            }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--main-color)' }}>
                  <th style={{ padding: '18px', textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: '14px', width: '6%', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>ID</th>
                  <th style={{ padding: '18px', textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: '14px', width: '12%', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>الكود</th>
                  <th style={{ padding: '18px', textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: '14px', width: '15%', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>الاسم</th>
                  <th style={{ padding: '18px', textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: '14px', width: '18%', minWidth: '180px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>الشخص المسؤول</th>
                  <th style={{ padding: '18px', textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: '14px', width: '15%', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>البريد الإلكتروني</th>
                  <th style={{ padding: '18px', textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: '14px', width: '12%', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>الهاتف</th>
                  <th style={{ padding: '18px', textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: '14px', width: '8%', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>الحالة</th>
                  <th style={{ padding: '18px', textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: '14px', width: '14%', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map((vendor, index) => (
                  <tr key={vendor.id} style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: index % 2 === 0 ? 'var(--basic-color)' : '#f0f4fa' }}>
                    <td style={{ padding: '18px', textAlign: 'center', fontSize: '14px', color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>
                      {(vendorsPagination?.current_page - 1) * (vendorsPagination?.per_page || 10) + index + 1}
                    </td>
                    <td style={{ padding: '18px', textAlign: 'center', fontSize: '14px', color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>{vendor.code}</td>
                    <td style={{ padding: '18px', textAlign: 'center', fontSize: '14px', color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>{vendor.name}</td>
                    <td style={{ padding: '18px', textAlign: 'center', fontSize: '14px', color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>{vendor.contact_person || 'N/A'}</td>
                    <td style={{ padding: '18px', textAlign: 'center', fontSize: '14px', color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>{vendor.email || 'N/A'}</td>
                    <td style={{ padding: '18px', textAlign: 'center', fontSize: '14px', color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>{vendor.phone || 'N/A'}</td>
                    <td style={{ padding: '18px', textAlign: 'center', fontSize: '14px' }}>
                      <span style={{
                        backgroundColor: vendor.is_active ? 'var(--main-color)' : 'var(--red-color)',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap',
                        display: 'inline-block',
                        fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                      }}>
                        {vendor.is_active ? 'نشط' : 'غير نشط'}
                      </span>
                    </td>
                    <td style={{ padding: '18px', textAlign: 'center', fontSize: '14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'nowrap', whiteSpace: 'nowrap' }}>
                        <button
                          onClick={() => navigate(`/vendors/view/${vendor.id}`)}
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
                          onClick={() => navigate(`/vendors/edit/${vendor.id}`)}
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
                          <FaEdit style={{ color: 'white' }} /> تعديل
                        </button>
                        <button
                          onClick={() => handleToggleStatus(vendor.id)}
                          style={{
                            backgroundColor: vendor.is_active ? 'var(--chart-color-2)' : 'var(--main-color)',
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
                          <FaPowerOff style={{ color: 'white' }} /> {vendor.is_active ? 'تعطيل' : 'تفعيل'}
                        </button>
                        <button
                          onClick={() => handleDelete(vendor)}
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
          لا توجد موردين
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
              هل أنت متأكد من حذف المورد "{vendorToDelete?.name}"؟
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setVendorToDelete(null);
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

export default Vendors;

