import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getDepartmentDetails, clearError, clearSuccess } from '../../../../redux/Slices/authSlice';
import { FaArrowLeft, FaEdit, FaTrash, FaBuilding, FaCalendarAlt, FaInfoCircle, FaFileAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

const DepartmentDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { departmentDetails, isLoading, error, success } = useSelector((state) => state.auth);

  useEffect(() => {
    if (id) {
      dispatch(getDepartmentDetails(id));
    }
  }, [id, dispatch]);

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

  const handleEdit = () => {
    navigate(`/edit-department/${id}`);
  };

  const handleDelete = () => {
    navigate(`/departments`);
  };

  const handleBack = () => {
    navigate('/departments');
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

  if (!departmentDetails) {
    return (
      <div style={{ 
        padding: '30px',
        backgroundColor: 'var(--dashboard-bg)',
        minHeight: 'calc(100vh - 80px)',
        color: '#182d40',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <i className="fas fa-exclamation-triangle" style={{ fontSize: '3rem', color: 'var(--chart-color-2)', marginBottom: '20px' }}></i>
          <h5 style={{ color: '#182d40', marginBottom: '10px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>لم يتم العثور على القسم</h5>
          <p style={{ color: '#182d40', marginBottom: '20px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold', opacity: 0.7 }}>قد يكون القسم غير موجود أو تم حذفه</p>
          <button
            onClick={handleBack}
            style={{
              backgroundColor: 'var(--main-color)',
              color: 'white',
              fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
              border: 'none',
              padding: '12px 25px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              margin: '0 auto'
            }}
          >
            <FaArrowLeft style={{ color: 'white' }} />
            العودة للأقسام
          </button>
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
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h1 style={{ 
                margin: 0, 
                fontSize: '24px', 
                fontWeight: 'bold',
                color: '#182d40',
                fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
              }}>
                تفاصيل القسم
              </h1>
              <button
                onClick={handleBack}
                style={{
                  backgroundColor: 'var(--gray-color)',
                  color: 'white',
                  fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <FaArrowLeft style={{ color: 'white' }} />
                رجوع
              </button>
            </div>
          </div>

          <div style={{ padding: '30px' }}>
            <div style={{ marginBottom: '30px' }}>
              <div style={{
                backgroundColor: 'var(--basic-color)',
                borderRadius: '8px',
                padding: '20px',
                border: '1px solid var(--border-color)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                  <FaBuilding style={{ fontSize: '1.2rem', color: '#182d40', marginLeft: '10px' }} />
                  <h3 style={{ margin: 0, color: '#182d40', fontSize: '18px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>معلومات القسم</h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ 
                      display: 'block',
                      marginBottom: '5px',
                      color: '#182d40',
                      fontSize: '14px',
                      opacity: 0.7,
                      fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                      fontWeight: 'bold'
                    }}>
                      اسم القسم
                    </label>
                    <p style={{ 
                      margin: 0, 
                      color: '#182d40', 
                      fontSize: '16px', 
                      fontWeight: 'bold',
                      fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                    }}>
                      {departmentDetails.name}
                    </p>
                  </div>
                  <div>
                    <label style={{ 
                      display: 'block',
                      marginBottom: '5px',
                      color: '#6c757d',
                      fontSize: '14px'
                    }}>
                      تاريخ الإنشاء
                    </label>
                    <p style={{ 
                      margin: 0, 
                      color: '#182d40', 
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                    }}>
                      <FaCalendarAlt style={{ color: '#182d40' }} />
                      {new Date(departmentDetails.created_at).toLocaleDateString('ar-EG', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <div style={{
                backgroundColor: 'var(--basic-color)',
                borderRadius: '8px',
                padding: '20px',
                border: '1px solid var(--border-color)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                  <FaFileAlt style={{ fontSize: '1.2rem', color: '#182d40', marginLeft: '10px' }} />
                  <h3 style={{ margin: 0, color: '#182d40', fontSize: '18px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>وصف القسم</h3>
                </div>
                <p style={{ 
                  margin: 0, 
                  color: '#182d40', 
                  lineHeight: '1.6',
                  fontSize: '14px',
                  fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                }}>
                  {departmentDetails.description}
                </p>
              </div>
            </div>

            <div>
              <div style={{
                backgroundColor: 'var(--basic-color)',
                borderRadius: '8px',
                padding: '20px',
                border: '1px solid var(--border-color)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                  <h3 style={{ margin: 0, color: '#182d40', fontSize: '18px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>الإجراءات</h3>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <button
                    onClick={handleEdit}
                    style={{
                      backgroundColor: 'var(--gray-color)',
                      color: 'white',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <FaEdit style={{ color: 'white' }} />
                    تعديل القسم
                  </button>
                  <button
                    onClick={handleDelete}
                    style={{
                      backgroundColor: 'var(--red-color)',
                      color: 'white',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <FaTrash style={{ color: 'white' }} />
                    حذف القسم
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentDetails;
