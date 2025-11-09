import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getPayslips, clearError, clearSuccess } from '../../../../redux/Slices/authSlice';
import { FaSearch, FaEye, FaFilePdf, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Payslips = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { payslips, payslipsPagination, isLoading, error, success } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(getPayslips({ page: currentPage }));
  }, [dispatch, currentPage]);

  useEffect(() => {
    if (success) {
      toast.success(success, { rtl: true });
      dispatch(clearSuccess());
    }
    if (error) {
      toast.error(error, { rtl: true });
      dispatch(clearError());
    }
  }, [success, error, dispatch]);

  const filteredData = payslips?.filter(payslip => 
    payslip.employee?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payslip.employee?.employee_code?.includes(searchTerm) ||
    payslip.pay_period?.includes(searchTerm)
  ) || [];

  const handlePageChange = (page) => {
    setCurrentPage(page);
    dispatch(getPayslips({ page }));
  };

  return (
    <div style={{ 
      padding: '30px',
      backgroundColor: 'var(--dashboard-bg)',
      minHeight: 'calc(100vh - 80px)',
      color: '#182d40'
    }}>
      {/* العنوان */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold',
          color: '#182d40',
          marginBottom: '20px',
          fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
        }}>
          كشف الرواتب
        </h1>

        {/* شريط البحث وأزرار الإجراءات */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: '1', maxWidth: '800px', position: 'relative' }}>
            <FaSearch style={{ 
              position: 'absolute', 
              right: '15px', 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: '#182d40',
              fontSize: '18px'
            }} />
            <input
              type="text"
              placeholder="ابحث بالاسم أو كود الموظف أو فترة الراتب..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 45px 12px 15px',
                backgroundColor: 'var(--basic-color)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                color: '#182d40',
                fontSize: '14px',
                fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
              }}
            />
          </div>
          <button
            onClick={() => navigate('/payslips/generate')}
            style={{
              backgroundColor: 'var(--main-color)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
            }}
          >
            <FaPlus style={{ color: 'white' }} />
            توليد كشف راتب جديد
          </button>
        </div>
      </div>

      {/* الجدول */}
      <div style={{
        backgroundColor: 'var(--basic-color)',
        borderRadius: '12px',
        border: '1px solid var(--border-color)',
        overflow: 'hidden'
      }}>
        {filteredData.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--main-color)' }}>
                  <th style={{ 
                    padding: '15px', 
                    textAlign: 'center', 
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    borderBottom: '1px solid var(--border-color)',
                    backgroundColor: 'var(--main-color)',
                    fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                  }}>
                    #
                  </th>
                  <th style={{ 
                    padding: '15px', 
                    textAlign: 'center', 
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    borderBottom: '1px solid var(--border-color)',
                    backgroundColor: 'var(--main-color)',
                    fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                  }}>
                    الموظف
                  </th>
                  <th style={{ 
                    padding: '15px', 
                    textAlign: 'center', 
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    borderBottom: '1px solid var(--border-color)',
                    backgroundColor: 'var(--main-color)',
                    fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                  }}>
                    فترة الراتب
                  </th>
                  <th style={{ 
                    padding: '15px', 
                    textAlign: 'center', 
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    borderBottom: '1px solid var(--border-color)',
                    backgroundColor: 'var(--main-color)',
                    fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                  }}>
                    إجمالي الراتب
                  </th>
                  <th style={{ 
                    padding: '15px', 
                    textAlign: 'center', 
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    borderBottom: '1px solid var(--border-color)',
                    backgroundColor: 'var(--main-color)',
                    fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                  }}>
                    صافي الراتب
                  </th>
                  <th style={{ 
                    padding: '15px', 
                    textAlign: 'center', 
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    borderBottom: '1px solid var(--border-color)',
                    backgroundColor: 'var(--main-color)',
                    fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                  }}>
                    الحالة
                  </th>
                  <th style={{ 
                    padding: '15px', 
                    textAlign: 'center', 
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    borderBottom: '1px solid var(--border-color)',
                    backgroundColor: 'var(--main-color)',
                    fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                  }}>
                    الإجراء
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((payslip, index) => (
                  <tr key={payslip.id} style={{ 
                    borderBottom: '1px solid var(--border-color)',
                    backgroundColor: index % 2 === 0 ? 'var(--basic-color)' : '#f0f4fa'
                  }}>
                    <td style={{ 
                      padding: '15px', 
                      textAlign: 'center',
                      color: '#182d40',
                      fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                      fontWeight: 'bold'
                    }}>
                      {index + 1}
                    </td>
                    <td style={{ 
                      padding: '15px', 
                      textAlign: 'center',
                      color: '#182d40',
                      fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                    }}>
                      <div>
                        <div style={{ fontWeight: 'bold', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>{payslip.employee?.name || 'غير متوفر'}</div>
                        <div style={{ fontSize: '12px', color: '#182d40', opacity: 0.7, fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>{payslip.employee?.employee_code || '-'}</div>
                      </div>
                    </td>
                    <td style={{ 
                      padding: '15px', 
                      textAlign: 'center',
                      color: '#182d40',
                      fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                    }}>
                      {payslip.pay_period || 'غير متوفر'}
                    </td>
                    <td style={{ 
                      padding: '15px', 
                      textAlign: 'center',
                      color: '#182d40',
                      fontWeight: 'bold',
                      fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                    }}>
                      {payslip.gross_salary ? `${parseFloat(payslip.gross_salary).toLocaleString('ar-EG')} جنيه` : 'غير متوفر'}
                    </td>
                    <td style={{ 
                      padding: '15px', 
                      textAlign: 'center',
                      color: 'var(--main-color)',
                      fontWeight: 'bold',
                      fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                    }}>
                      {payslip.net_salary ? `${parseFloat(payslip.net_salary).toLocaleString('ar-EG')} جنيه` : 'غير متوفر'}
                    </td>
                    <td style={{ 
                      padding: '15px', 
                      textAlign: 'center',
                      color: '#182d40',
                      fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                    }}>
                      <span style={{
                        padding: '5px 15px',
                        borderRadius: '20px',
                        backgroundColor: payslip.status === 'generated' ? 'rgba(0, 106, 255, 0.1)' : payslip.status === 'paid' ? 'rgba(0, 106, 255, 0.15)' : 'rgba(220, 53, 69, 0.1)',
                        color: payslip.status === 'generated' ? 'var(--main-color)' : payslip.status === 'paid' ? 'var(--main-color)' : 'var(--red-color)',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                      }}>
                        {payslip.status === 'generated' ? 'تم التوليد' : payslip.status === 'paid' ? 'مدفوع' : payslip.status || 'غير متوفر'}
                      </span>
                    </td>
                    <td style={{ padding: '15px' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button
                          onClick={() => navigate(`/payslips/${payslip.id}`)}
                          style={{
                            backgroundColor: 'var(--gray-color)',
                            color: 'white',
                            border: 'none',
                            padding: '8px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                          }}
                          title="عرض التفاصيل"
                        >
                          <FaEye style={{ color: 'white' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: '#182d40',
            fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
            fontWeight: 'bold'
          }}>
            لا توجد كشوف رواتب
          </div>
        )}

        {/* الباجينيشن */}
        {payslipsPagination && payslipsPagination.last_page > 1 && (
          <div style={{
            padding: '20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
            borderTop: '1px solid var(--border-color)',
            flexWrap: 'wrap'
          }}>
            {payslipsPagination.current_page > 1 && (
              <button
                onClick={() => handlePageChange(payslipsPagination.current_page - 1)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: 'var(--basic-color)',
                  color: '#182d40',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                  fontWeight: 'bold'
                }}
              >
                السابق
              </button>
            )}
            
            {Array.from({ length: payslipsPagination.last_page }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: page === payslipsPagination.current_page ? 'var(--main-color)' : 'var(--basic-color)',
                  color: page === payslipsPagination.current_page ? 'white' : '#182d40',
                  border: page === payslipsPagination.current_page ? 'none' : '1px solid var(--border-color)',
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
            
            {payslipsPagination.current_page < payslipsPagination.last_page && (
              <button
                onClick={() => handlePageChange(payslipsPagination.current_page + 1)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: 'var(--basic-color)',
                  color: '#182d40',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                  fontWeight: 'bold'
                }}
              >
                التالي
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Payslips;

