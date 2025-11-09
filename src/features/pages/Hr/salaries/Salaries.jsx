import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getSalaries, clearError, clearSuccess } from '../../../../redux/Slices/authSlice';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Salaries = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { salaries, salariesPagination, isLoading, error, success } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(getSalaries({ page: currentPage }));
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

  const filteredData = salaries?.filter(salary => 
    salary.employee?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    salary.employee?.employee_code?.includes(searchTerm) ||
    salary.employee?.phone?.includes(searchTerm)
  ) || [];

  const handlePageChange = (page) => {
    setCurrentPage(page);
    dispatch(getSalaries({ page }));
  };

  const getStatusColor = (status) => {
    return status === 'مدفوع' ? '#AC2000' : '#dc3545';
  };

  return (
    <div style={{ 
      padding: '30px',
      backgroundColor: 'var(--dashboard-bg)',
      minHeight: 'calc(100vh - 80px)',
      color: '#182d40'
    }}>
      {/* العنوان والبحث */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          marginBottom: '20px',
          color: '#182d40',
          fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
        }}>
          المرتبات
        </h1>

        {/* شريط البحث */}
        <div style={{ 
          display: 'flex', 
          gap: '20px', 
          alignItems: 'center',
          marginBottom: '20px',
          flexWrap: 'wrap'
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
              placeholder="بحث سريع عن موظف"
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
            onClick={() => navigate('/salaries/add')}
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
            <FaPlus style={{ color: 'white' }} />
            اضافة راتب جديد
          </button>
        </div>
      </div>

      {/* جدول المرتبات */}
      <div style={{
        backgroundColor: 'var(--basic-color)',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid var(--border-color)'
      }}>
        <div style={{
          padding: '20px',
          borderBottom: '1px solid var(--border-color)',
          backgroundColor: 'var(--basic-color)'
        }}>
          <h3 style={{ 
            margin: 0, 
            fontSize: '18px', 
            fontWeight: 'bold',
            color: '#182d40',
            fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
          }}>
            مرتبات الموظفين
          </h3>
        </div>

        {isLoading ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '40px',
            color: '#182d40'
          }}>
            <div style={{ 
              fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
              fontWeight: 'bold'
            }}>جاري التحميل...</div>
          </div>
        ) : filteredData && filteredData.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              minWidth: '1000px'
            }}>
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
                    الراتب الأساسي
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
                    البدلات
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
                    الخصومات
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
                    تاريخ السريان
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
                {filteredData.map((salary, index) => (
                  <tr key={salary.id} style={{ 
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
                        <div style={{ fontWeight: 'bold', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>{salary.employee?.name}</div>
                        <div style={{ fontSize: '12px', color: '#182d40', opacity: 0.7, fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>{salary.employee?.employee_code}</div>
                        <div style={{ fontSize: '12px', color: '#182d40', opacity: 0.7, fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>{salary.employee?.phone}</div>
                      </div>
                    </td>
                    <td style={{ 
                      padding: '15px', 
                      textAlign: 'center',
                      color: '#182d40',
                      fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                      fontWeight: 'bold'
                    }}>
                      {parseFloat(salary.base_salary).toLocaleString('ar-EG')} جنيه
                    </td>
                    <td style={{ 
                      padding: '15px', 
                      textAlign: 'center',
                      color: '#182d40',
                      fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                    }}>
                      <div style={{ fontSize: '12px' }}>
                        {salary.allowances?.housing && (
                          <div style={{ fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>سكن: {salary.allowances.housing.toLocaleString('ar-EG')} جنيه</div>
                        )}
                        {salary.allowances?.transportation && (
                          <div style={{ fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>مواصلات: {salary.allowances.transportation.toLocaleString('ar-EG')} جنيه</div>
                        )}
                      </div>
                    </td>
                    <td style={{ 
                      padding: '15px', 
                      textAlign: 'center',
                      color: '#182d40',
                      fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                    }}>
                      <div style={{ fontSize: '12px' }}>
                        {salary.deductions?.social_insurance && (
                          <div style={{ fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>تأمين اجتماعي: {salary.deductions.social_insurance.toLocaleString('ar-EG')} جنيه</div>
                        )}
                      </div>
                    </td>
                    <td style={{ 
                      padding: '15px', 
                      textAlign: 'center',
                      color: '#182d40',
                      fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                    }}>
                      {new Date(salary.effective_date).toLocaleDateString('ar-EG')}
                    </td>
                    <td style={{ padding: '15px' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button
                          onClick={() => navigate(`/salaries/details/${salary.employee?.id}`)}
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
            لا توجد رواتب
          </div>
        )}

        {/* الباجينيشن */}
        {salariesPagination && salariesPagination.last_page > 1 && (
          <div style={{
            padding: '20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
            borderTop: '1px solid var(--border-color)',
            flexWrap: 'wrap'
          }}>
            {/* زر السابق */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              style={{
                padding: '8px 12px',
                margin: '0 2px',
                backgroundColor: currentPage === 1 ? 'var(--basic-color)' : 'var(--basic-color)',
                color: '#182d40',
                border: '1px solid var(--border-color)',
                borderRadius: '4px',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                fontWeight: 'bold',
                opacity: currentPage === 1 ? 0.6 : 1
              }}
            >
              السابق
            </button>

            {/* أرقام الصفحات */}
            {Array.from({ length: salariesPagination.last_page }, (_, i) => i + 1).map(page => {
              if (page === 1 || page === salariesPagination.last_page || 
                  (page >= currentPage - 1 && page <= currentPage + 1)) {
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    style={{
                      padding: '8px 12px',
                      margin: '0 2px',
                      backgroundColor: page === currentPage ? 'var(--main-color)' : 'var(--basic-color)',
                      color: page === currentPage ? 'white' : '#182d40',
                      border: page === currentPage ? 'none' : '1px solid var(--border-color)',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                    }}
                  >
                    {page}
                  </button>
                );
              } else if (page === currentPage - 2 || page === currentPage + 2) {
                return (
                  <span key={`ellipsis-${page}`} style={{ color: '#182d40', padding: '0 4px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>
                    ...
                  </span>
                );
              }
              return null;
            })}

            {/* زر التالي */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === salariesPagination.last_page}
              style={{
                padding: '8px 12px',
                margin: '0 2px',
                backgroundColor: currentPage === salariesPagination.last_page ? 'var(--basic-color)' : 'var(--basic-color)',
                color: '#182d40',
                border: '1px solid var(--border-color)',
                borderRadius: '4px',
                cursor: currentPage === salariesPagination.last_page ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                fontWeight: 'bold',
                opacity: currentPage === salariesPagination.last_page ? 0.6 : 1
              }}
            >
              التالي
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Salaries;
