import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getDepartments, deleteDepartment, clearError, clearSuccess } from '../../../../redux/Slices/authSlice';
import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch, FaBuilding, FaFileAlt, FaCalendarAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Departments = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { departments, isLoading, error, success } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState(null);

  useEffect(() => {
    dispatch(getDepartments());
  }, [dispatch]);

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

  const handleAdd = () => {
    navigate('/departments/add');
  };

  const handleEdit = (id) => {
    navigate(`/departments/edit/${id}`);
  };

  const handleView = (id) => {
    navigate(`/departments/details/${id}`);
  };

  const handleDelete = (department) => {
    setDepartmentToDelete(department);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (departmentToDelete) {
      await dispatch(deleteDepartment(departmentToDelete.id));
      dispatch(getDepartments()); // Refresh the list
      setShowDeleteModal(false);
      setDepartmentToDelete(null);
    }
  };

  const filteredDepartments = departments.filter(department =>
    department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    department.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (!dateString) return 'غير محدد';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
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
      color: 'var(--text-primary)'
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
          الأقسام
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
              placeholder="بحث سريع عن القسم"
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
            onClick={handleAdd}
            style={{
              backgroundColor: 'var(--main-color)',
              color: 'white',
              fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <FaPlus style={{ color: 'white' }} />
            اضافة قسم جديد
          </button>
        </div>
      </div>

      {/* جدول الأقسام */}
      <div style={{
        backgroundColor: 'var(--basic-color)',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid var(--border-color)'
      }}>
      

        <div style={{ overflowX: 'auto' }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse',
            minWidth: '800px'
          }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--main-color)' }}>
                <th style={{ 
                  padding: '15px', 
                  textAlign: 'center', 
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '14px',
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
                  fontSize: '14px',
                  borderBottom: '1px solid var(--border-color)',
                  backgroundColor: 'var(--main-color)',
                  fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                }}>
                  <FaBuilding className="mx-2" />
                  اسم القسم
                </th>
                <th style={{ 
                  padding: '15px', 
                  textAlign: 'center', 
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  borderBottom: '1px solid var(--border-color)',
                  backgroundColor: 'var(--main-color)',
                  fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                }}>
                  <FaFileAlt className="mx-2" />
                  الوصف
                </th>
                <th style={{ 
                  padding: '15px', 
                  textAlign: 'center', 
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  borderBottom: '1px solid var(--border-color)',
                  backgroundColor: 'var(--main-color)',
                  fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                }}>
                  <FaCalendarAlt className="mx-2" />
                  تاريخ الإنشاء
                </th>
                <th style={{ 
                  padding: '15px', 
                  textAlign: 'center', 
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  borderBottom: '1px solid var(--border-color)',
                  backgroundColor: 'var(--main-color)',
                  fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                }}>
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredDepartments && filteredDepartments.length > 0 ? (
                filteredDepartments.map((department, index) => (
                  <tr key={department.id} style={{ 
                    borderBottom: '1px solid var(--border-color)'
                  }}>
                    <td style={{ 
                      padding: '15px', 
                    color: '#182d40',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                    }}>
                      {index + 1}
                    </td>
                    <td style={{ 
                      padding: '15px', 
                    color: '#182d40',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                    }}>
                      {department.name}
                    </td>
                    <td style={{ 
                      padding: '15px', 
                    color: '#182d40',
                    opacity: 0.9,
                    fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                    maxWidth: '300px',
                    wordWrap: 'break-word',
                    textAlign: 'center'
                    }}>
                      {department.description}
                    </td>
                    <td style={{ 
                      padding: '15px', 
                    color: '#182d40',
                    opacity: 0.9,
                    fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                    textAlign: 'center'
                    }}>
                      {formatDate(department.created_at)}
                    </td>
                    <td style={{ 
                      padding: '15px', 
                      textAlign: 'center'
                    }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button
                          onClick={() => handleView(department.id)}
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
                          title="عرض التفاصيل"
                        >
                          <FaEye style={{ color: 'white' }} />
                        </button>
                        <button
                          onClick={() => handleEdit(department.id)}
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
                          onClick={() => handleDelete(department)}
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
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ 
                    textAlign: 'center', 
                    padding: '40px',
                    color: '#182d40',
                    fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                    fontWeight: 'bold'
                  }}>
                    لا توجد أقسام
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* الترقيم */}
        <div style={{
          padding: '20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px',
          borderTop: '1px solid var(--border-color)'
        }}>
          <button style={{
            backgroundColor: 'var(--main-color)',
            color: 'white',
            fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
            fontWeight: 'bold',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            1
          </button>
          <button style={{
            backgroundColor: 'var(--basic-color)',
            color: '#182d40',
            border: '1px solid var(--border-color)',
            fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
            fontWeight: 'bold',
            padding: '8px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
          }}>
            2
          </button>
          <button style={{
            backgroundColor: 'var(--basic-color)',
            color: '#182d40',
            border: '1px solid var(--border-color)',
            fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
            fontWeight: 'bold',
            padding: '8px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
          }}>
            3
          </button>
          <button style={{
            backgroundColor: 'var(--basic-color)',
            color: '#182d40',
            border: '1px solid var(--border-color)',
            fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
            fontWeight: 'bold',
            padding: '8px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
          }}>
            4
          </button>
          <button style={{
            backgroundColor: 'var(--basic-color)',
            color: '#182d40',
            border: '1px solid var(--border-color)',
            fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
            fontWeight: 'bold',
            padding: '8px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
          }}>
            5
          </button>
          <button style={{
            backgroundColor: 'var(--basic-color)',
            color: '#182d40',
            border: '1px solid var(--border-color)',
            fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
            fontWeight: 'bold',
            padding: '8px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
          }}>
            &gt;&gt;
          </button>
        </div>
      </div>

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
                }}>هل أنت متأكد من حذف القسم "{departmentToDelete?.name}"؟</p>
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
                    fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                    fontWeight: 'bold',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 20px'
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

export default Departments;
