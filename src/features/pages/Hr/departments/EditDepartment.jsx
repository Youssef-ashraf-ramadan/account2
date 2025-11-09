import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getDepartmentDetails, updateDepartment, clearError, clearSuccess } from '../../../../redux/Slices/authSlice';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import { toast } from 'react-toastify';

const EditDepartment = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { departmentDetails, isLoading, error, success } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name_en: '',
    name_ar: '',
    description_en: '',
    description_ar: ''
  });

  useEffect(() => {
    if (id) {
      dispatch(getDepartmentDetails(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (departmentDetails) {
      setFormData({
        name_en: departmentDetails.name_en || departmentDetails.name || '',
        name_ar: departmentDetails.name_ar || departmentDetails.name || '',
        description_en: departmentDetails.description_en || departmentDetails.description || '',
        description_ar: departmentDetails.description_ar || departmentDetails.description || ''
      });
    }
  }, [departmentDetails]);

  useEffect(() => {
    if (success) {
      toast.success(success, { 
        rtl: true,
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
      setTimeout(() => {
        navigate('/departments');
        dispatch(clearSuccess());
      }, 2000);
    }
    if (error) {
      toast.error(error, { 
        rtl: true,
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
      setTimeout(() => {
        dispatch(clearError());
      }, 100);
    }
  }, [success, error, navigate, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name_en || !formData.name_ar || !formData.description_en || !formData.description_ar) {
      toast.error('جميع الحقول مطلوبة', { rtl: true });
      return;
    }
    await dispatch(updateDepartment({ id, departmentData: formData }));
  };

  const handleCancel = () => {
    navigate('/departments');
  };

  if (isLoading && !departmentDetails) {
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
                تعديل القسم
              </h1>
              <button
                onClick={handleCancel}
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
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                {/* الاسم بالعربية */}
                <div>
                  <label style={{ 
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: 'bold',
                    color: '#182d40',
                    fontSize: '14px',
                    fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                    fontWeight: 'bold'
                  }}>
                    الاسم بالعربية *
                  </label>
                  <input
                    type="text"
                    name="name_ar"
                    value={formData.name_ar}
                    onChange={handleChange}
                    placeholder="أدخل اسم القسم بالعربية"
                    required
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      backgroundColor: 'var(--basic-color)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      color: '#182d40',
                      fontSize: '14px',
                      fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                    }}
                  />
                </div>

                {/* الاسم بالإنجليزية */}
                <div>
                  <label style={{ 
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: 'bold',
                    color: 'var(--text-primary)',
                    fontSize: '14px'
                  }}>
                    الاسم بالإنجليزية *
                  </label>
                  <input
                    type="text"
                    name="name_en"
                    value={formData.name_en}
                    onChange={handleChange}
                    placeholder="أدخل اسم القسم بالإنجليزية"
                    required
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      backgroundColor: 'var(--basic-color)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)',
                      fontSize: '14px'
                    }}
                  />
                </div>

                {/* الوصف بالعربية */}
                <div>
                  <label style={{ 
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: 'bold',
                    color: 'var(--text-primary)',
                    fontSize: '14px'
                  }}>
                    الوصف بالعربية *
                  </label>
                  <textarea
                    name="description_ar"
                    value={formData.description_ar}
                    onChange={handleChange}
                    placeholder="أدخل وصف القسم بالعربية"
                    rows="3"
                    required
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      backgroundColor: 'var(--basic-color)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      color: '#182d40',
                      fontSize: '14px',
                      resize: 'vertical',
                      fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                    }}
                  />
                </div>

                {/* الوصف بالإنجليزية */}
                <div>
                  <label style={{ 
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: 'bold',
                    color: 'var(--text-primary)',
                    fontSize: '14px'
                  }}>
                    الوصف بالإنجليزية *
                  </label>
                  <textarea
                    name="description_en"
                    value={formData.description_en}
                    onChange={handleChange}
                    placeholder="أدخل وصف القسم بالإنجليزية"
                    rows="3"
                    required
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      backgroundColor: 'var(--basic-color)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      color: '#182d40',
                      fontSize: '14px',
                      resize: 'vertical',
                      fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                    }}
                  />
                </div>
              </div>

              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: '15px' 
              }}>
                <button
                  type="button"
                  onClick={handleCancel}
                  style={{
                    backgroundColor: 'var(--gray-color)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 25px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                  }}
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    backgroundColor: isLoading ? 'var(--gray-color)' : 'var(--main-color)',
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
                    opacity: isLoading ? 0.7 : 1
                  }}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      جاري الحفظ...
                    </>
                  ) : (
                    <>
                      <FaSave style={{ color: 'white' }} />
                      حفظ التغييرات
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditDepartment;
