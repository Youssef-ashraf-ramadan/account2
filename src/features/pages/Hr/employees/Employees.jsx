import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getEmployees, deleteEmployee, clearError, clearSuccess } from '../../../../redux/Slices/authSlice';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Employees = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { employees, employeesPagination, isLoading, error, success } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const lastErrorRef = useRef({ message: null, time: 0 });

  // Fetch employees on component mount
  useEffect(() => {
    dispatch(getEmployees({ page: currentPage }));
  }, [dispatch, currentPage]);

  // Handle success and error messages with deduplication
  useEffect(() => {
    if (success) {
      toast.success(success, { rtl: true });
      dispatch(clearSuccess());
    }
  }, [success, dispatch]);

  useEffect(() => {
    if (error) {
      const now = Date.now();
      const last = lastErrorRef.current;
      // Only show toast if it's a different error or enough time has passed since last same error (2 seconds)
      if (!last.message || last.message !== error || now - last.time > 2000) {
      toast.error(error, { rtl: true });
        lastErrorRef.current = { message: error, time: now };
      }
      // Clear error after showing
      const timer = setTimeout(() => {
      dispatch(clearError());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);


  const filteredEmployees = employees?.filter(employee => 
    employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.employee_code?.includes(searchTerm) ||
    employee.position?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleDelete = (employee) => {
    setEmployeeToDelete(employee);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (employeeToDelete) {
      await dispatch(deleteEmployee(employeeToDelete.id));
      setShowDeleteModal(false);
      setEmployeeToDelete(null);
    }
  };

  if (isLoading) {
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
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

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
          الموظفين
        </h1>

        {/* شريط البحث والفلتر */}
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
            onClick={() => navigate('/add-employee')}
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
            اضافة موظف جديد
          </button>
        </div>
      </div>

      {/* جدول الموظفين */}
      <div style={{
        backgroundColor: 'var(--basic-color)',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid var(--border-color)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'separate',
            borderSpacing: 0,
            minWidth: '1500px'
          }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--main-color)' }}>
                <th style={{ 
                  padding: '18px 16px', 
                  textAlign: 'center', 
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  borderBottom: '2px solid var(--border-color)',
                  width: '100px', minWidth: '100px',
                  backgroundColor: 'var(--main-color)',
                  fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                }}>
                  الصورة
                </th>
                <th style={{ 
                  padding: '18px 16px', 
                  textAlign: 'center', 
                  fontWeight: 'bold',
                  fontSize: '14px',
                  borderBottom: '2px solid var(--border-color)',
                  width: '220px', minWidth: '220px',
                  backgroundColor: 'var(--main-color)',
                  color: 'white',
                  fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                }}>
                  اسم الموظف
                </th>
                <th style={{ 
                  padding: '18px 16px', 
                  textAlign: 'center', 
                  fontWeight: 'bold',
                  fontSize: '14px',
                  borderBottom: '2px solid var(--border-color)',
                  width: '140px', minWidth: '140px',
                  backgroundColor: 'var(--main-color)',
                  color: 'white',
                  fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                }}>
                  كود الموظف
                </th>
                <th style={{ 
                  padding: '18px 16px', 
                  textAlign: 'center', 
                  fontWeight: 'bold',
                  fontSize: '14px',
                  borderBottom: '2px solid var(--border-color)',
                  width: '220px', minWidth: '220px',
                  backgroundColor: 'var(--main-color)',
                  color: 'white',
                  fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                }}>
                  البريد الإلكتروني
                </th>
                <th style={{ 
                  padding: '18px 16px', 
                  textAlign: 'center', 
                  fontWeight: 'bold',
                  fontSize: '14px',
                  borderBottom: '2px solid var(--border-color)',
                  width: '140px', minWidth: '140px',
                  backgroundColor: 'var(--main-color)',
                  color: 'white',
                  fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                }}>
                  رقم الهاتف
                </th>
                <th style={{ 
                  padding: '18px 16px', 
                  textAlign: 'center', 
                  fontWeight: 'bold',
                  fontSize: '14px',
                  borderBottom: '2px solid var(--border-color)',
                  width: '140px', minWidth: '140px',
                  backgroundColor: 'var(--main-color)',
                  color: 'white',
                  fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                }}>
                  تاريخ الميلاد
                </th>
                <th style={{ 
                  padding: '18px 16px', 
                  textAlign: 'center', 
                  fontWeight: 'bold',
                  fontSize: '14px',
                  borderBottom: '2px solid var(--border-color)',
                  width: '120px', minWidth: '120px',
                  backgroundColor: 'var(--main-color)',
                  color: 'white',
                  fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                }}>
                  الجنس
                </th>
                <th style={{ 
                  padding: '18px 16px', 
                  textAlign: 'center', 
                  fontWeight: 'bold',
                  fontSize: '14px',
                  borderBottom: '2px solid var(--border-color)',
                  width: '160px', minWidth: '160px',
                  backgroundColor: 'var(--main-color)',
                  color: 'white',
                  fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                }}>
                  القسم
                </th>
                <th style={{ 
                  padding: '18px 16px', 
                  textAlign: 'center', 
                  fontWeight: 'bold',
                  fontSize: '14px',
                  borderBottom: '2px solid var(--border-color)',
                  width: '180px', minWidth: '180px',
                  backgroundColor: 'var(--main-color)',
                  color: 'white',
                  fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                }}>
                  المسمى الوظيفي
                </th>
                <th style={{ 
                  padding: '18px 16px', 
                  textAlign: 'center', 
                  fontWeight: 'bold',
                  fontSize: '14px',
                  borderBottom: '2px solid var(--border-color)',
                  width: '160px', minWidth: '160px',
                  backgroundColor: 'var(--main-color)',
                  color: 'white',
                  fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                }}>
                  الوردية
                </th>
                <th style={{ 
                  padding: '18px 16px', 
                  textAlign: 'center', 
                  fontWeight: 'bold',
                  fontSize: '14px',
                  borderBottom: '2px solid var(--border-color)',
                  width: '120px', minWidth: '120px',
                  backgroundColor: 'var(--main-color)',
                  color: 'white',
                  fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                }}>
                  الحالة
                </th>
                <th style={{ 
                  padding: '18px 16px', 
                  textAlign: 'center', 
                  fontWeight: 'bold',
                  fontSize: '14px',
                  borderBottom: '2px solid var(--border-color)',
                  width: '220px', minWidth: '220px',
                  backgroundColor: 'var(--main-color)',
                  color: 'white',
                  fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                }}>
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee, index) => (
                <tr key={employee.id} style={{ 
                  borderBottom: '1px solid var(--border-color)',
                  backgroundColor: index % 2 === 0 ? 'var(--basic-color)' : '#f0f4fa'
                }}>
                  <td style={{ padding: '18px 16px', textAlign: 'center' }}>
                    {employee.images && employee.images.length > 0 ? (
                    <img 
                        src={employee.images[0].url} 
                      alt={employee.name}
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        objectFit: 'cover'
                      }}
                    />
                    ) : (
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: '#E8E4DF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto'
                      }}>
                        <span style={{ color: '#182d40', fontSize: '12px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>IMG</span>
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '18px 16px', color: '#182d40', textAlign: 'center', fontWeight: 'bold', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>
                    {employee.name}
                  </td>
                  <td style={{ padding: '18px 16px', color: '#182d40', textAlign: 'center', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>
                    {employee.employee_code}
                  </td>
                  <td style={{ padding: '18px 16px', color: '#182d40', textAlign: 'center', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>
                    {employee.email}
                  </td>
                  <td style={{ padding: '18px 16px', color: '#182d40', textAlign: 'center', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>
                    {employee.phone}
                  </td>
                  <td style={{ padding: '18px 16px', color: '#182d40', textAlign: 'center', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>
                    {employee.birth_date ? new Date(employee.birth_date).toLocaleDateString('ar-EG') : '-'}
                  </td>
                  <td style={{ padding: '18px 16px', color: '#182d40', textAlign: 'center', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>
                    {employee.gender === 'male' ? 'ذكر' : 'أنثى'}
                  </td>
                  <td style={{ padding: '18px 16px', color: '#182d40', textAlign: 'center', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>
                    {employee.department}
                  </td>
                  <td style={{ padding: '18px 16px', color: '#182d40', textAlign: 'center', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>
                    {employee.position}
                  </td>
                  <td style={{ padding: '18px 16px', color: '#182d40', textAlign: 'center', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>
                    {employee.work_shift ? employee.work_shift.name : '-'}
                  </td>
                  <td style={{ padding: '18px 16px', textAlign: 'center' }}>
                    <span style={{
                      backgroundColor: employee.is_active ? 'var(--main-color)' : 'var(--red-color)',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      display: 'inline-block',
                      minWidth: '60px',
                      fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                    }}>
                      {employee.is_active ? 'نشط' : 'غير نشط'}
                    </span>
                  </td>
                  <td style={{ padding: '18px 16px' }}>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => navigate(`/edit-employee/${employee.id}`)}
                        style={{
                          backgroundColor: 'var(--gray-color)',
                          color: 'white',
                          border: 'none',
                          padding: '10px 12px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                        }}
                        title="تعديل"
                      >
                        <FaEdit style={{ color: 'white' }} />
                      </button>
                      <button
                        onClick={() => navigate(`/employees/view/${employee.id}`)}
                        style={{
                          backgroundColor: 'var(--gray-color)',
                          color: 'white',
                          border: 'none',
                          padding: '10px 12px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                        }}
                        title="عرض"
                      >
                        <FaEye style={{ color: 'white' }} />
                      </button>
                      <button
                        onClick={() => handleDelete(employee)}
                        style={{
                          backgroundColor: 'var(--red-color)',
                          color: 'white',
                          border: 'none',
                          padding: '10px 12px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
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

        {/* الترقيم */}
        {employeesPagination && (
        <div style={{
          padding: '20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px',
          borderTop: '1px solid var(--border-color)'
        }}>
          {/* Previous Button */}
          {employeesPagination.current_page > 1 && (
            <button 
              onClick={() => setCurrentPage(employeesPagination.current_page - 1)}
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
          {Array.from({ length: employeesPagination.last_page }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              style={{
                backgroundColor: page === employeesPagination.current_page ? 'var(--main-color)' : 'var(--basic-color)',
            color: page === employeesPagination.current_page ? 'white' : '#182d40',
                border: page === employeesPagination.current_page ? 'none' : '1px solid var(--border-color)',
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
          {employeesPagination.current_page < employeesPagination.last_page && (
            <button 
              onClick={() => setCurrentPage(employeesPagination.current_page + 1)}
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

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content" style={{
                backgroundColor: 'var(--basic-color)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
              }}>
                <div className="modal-header" style={{ border: 'none', borderBottom: '1px solid var(--border-color)' }}>
                  <h5 className="modal-title" style={{ 
                    color: '#182d40',
                    fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                    fontWeight: 'bold'
                  }}>تأكيد الحذف</h5>
                </div>
                <div className="modal-body">
                  <p style={{ 
                    color: '#182d40',
                    fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                    fontWeight: 'bold'
                  }}>هل أنت متأكد من حذف الموظف "{employeeToDelete?.name}"؟</p>
                  <p style={{ 
                    color: '#182d40',
                    fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                    fontWeight: 'bold',
                    opacity: 0.7
                  }}>هذا الإجراء لا يمكن التراجع عنه.</p>
                </div>
                <div className="modal-footer" style={{ border: 'none' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowDeleteModal(false)}
                    style={{
                      backgroundColor: 'var(--gray-color)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '8px 20px',
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
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '8px 20px',
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
    </div>
  );
};

export default Employees;
