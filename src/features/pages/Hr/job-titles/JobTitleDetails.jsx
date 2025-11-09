import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getJobTitleDetails, clearError, clearSuccess } from '../../../../redux/Slices/authSlice';
import { FaArrowLeft, FaEdit, FaTrash, FaBriefcase, FaFileAlt, FaCalendarAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

const JobTitleDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { jobTitleDetails, isLoading, error, success } = useSelector((state) => state.auth);

  useEffect(() => {
    if (id) {
      dispatch(getJobTitleDetails(id));
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
    navigate(`/job-titles/edit/${id}`);
  };

  const handleDelete = () => {
    navigate(`/job-titles`);
  };

  const handleBack = () => {
    navigate('/job-titles');
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
        alignItems: 'center'
      }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!jobTitleDetails) {
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
          <i className="fas fa-exclamation-triangle" style={{ fontSize: '3rem', color: '#ffc107', marginBottom: '20px' }}></i>
          <h5 style={{ 
            color: '#182d40', 
            marginBottom: '10px',
            fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
            fontWeight: 'bold'
          }}>لم يتم العثور على المسمى الوظيفي</h5>
          <p style={{ 
            color: '#182d40', 
            marginBottom: '20px',
            fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
            fontWeight: 'bold',
            opacity: 0.8
          }}>قد يكون المسمى الوظيفي غير موجود أو تم حذفه</p>
          <button
            onClick={handleBack}
            style={{
                  backgroundColor: 'var(--main-color)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 25px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  margin: '0 auto',
                  fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                }}
              >
                <FaArrowLeft style={{ color: 'white' }} />
                العودة للمسميات الوظيفية
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
                تفاصيل المسمى الوظيفي
              </h1>
              <button
                onClick={handleBack}
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
                  gap: '8px',
                  fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
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
                    <FaBriefcase style={{ fontSize: '1.2rem', color: 'var(--main-color)', marginLeft: '10px' }} />
                  <h3 style={{ margin: 0, color: '#182d40', fontSize: '18px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>معلومات المسمى الوظيفي</h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ 
                      display: 'block',
                      marginBottom: '5px',
                      color: '#182d40',
                      fontSize: '14px',
                      fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                      fontWeight: 'bold',
                      opacity: 0.8
                    }}>
                      الاسم بالعربية
                    </label>
                    <p style={{ 
                      margin: 0, 
                      color: '#182d40', 
                      fontSize: '16px', 
                      fontWeight: 'bold',
                      fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                    }}>
                      {jobTitleDetails.name_ar || jobTitleDetails.name}
                    </p>
                  </div>
                  <div>
                    <label style={{ 
                      display: 'block',
                      marginBottom: '5px',
                      color: '#182d40',
                      fontSize: '14px',
                      fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                      fontWeight: 'bold',
                      opacity: 0.8
                    }}>
                      الاسم بالإنجليزية
                    </label>
                    <p style={{ 
                      margin: 0, 
                      color: '#182d40', 
                      fontSize: '16px', 
                      fontWeight: 'bold',
                      fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                    }}>
                      {jobTitleDetails.name_en || jobTitleDetails.name}
                    </p>
                  </div>
                </div>
                <div style={{ marginTop: '15px' }}>
                  <label style={{ 
                    display: 'block',
                    marginBottom: '5px',
                      color: '#182d40',
                      fontSize: '14px',
                      fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                      fontWeight: 'bold',
                      opacity: 0.8
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
                      fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                      fontWeight: 'bold'
                    }}>
                    <FaCalendarAlt style={{ color: 'var(--main-color)' }} />
                    {new Date(jobTitleDetails.created_at).toLocaleDateString('ar-EG', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
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
                    <FaFileAlt style={{ fontSize: '1.2rem', color: 'var(--main-color)', marginLeft: '10px' }} />
                  <h3 style={{ margin: 0, color: '#182d40', fontSize: '18px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>الوصف</h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ 
                      display: 'block',
                      marginBottom: '5px',
                      color: '#182d40',
                      fontSize: '14px',
                      fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                      fontWeight: 'bold',
                      opacity: 0.8
                    }}>
                      الوصف بالعربية
                    </label>
                    <p style={{ 
                      margin: 0, 
                      color: '#182d40', 
                      lineHeight: '1.6',
                      fontSize: '14px',
                      fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                    }}>
                      {jobTitleDetails.description_ar || jobTitleDetails.description}
                    </p>
                  </div>
                  <div>
                    <label style={{ 
                      display: 'block',
                      marginBottom: '5px',
                      color: '#182d40',
                      fontSize: '14px',
                      fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                      fontWeight: 'bold',
                      opacity: 0.8
                    }}>
                      الوصف بالإنجليزية
                    </label>
                    <p style={{ 
                      margin: 0, 
                      color: '#182d40', 
                      lineHeight: '1.6',
                      fontSize: '14px',
                      fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                    }}>
                      {jobTitleDetails.description_en || jobTitleDetails.description}
                    </p>
                  </div>
                </div>
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
                    gap: '8px',
                    fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                  }}
                >
                    <FaEdit style={{ color: 'white' }} />
                    تعديل المسمى الوظيفي
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
                      gap: '8px',
                      fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                    }}
                  >
                    <FaTrash style={{ color: 'white' }} />
                    حذف المسمى الوظيفي
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

export default JobTitleDetails;
