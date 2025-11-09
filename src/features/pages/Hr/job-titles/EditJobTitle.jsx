import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getJobTitleDetails, updateJobTitle, clearError, clearSuccess } from '../../../../redux/Slices/authSlice';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import { toast } from 'react-toastify';

const EditJobTitle = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { jobTitleDetails, isLoading, error, success } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name_en: '',
    name_ar: '',
    description_en: '',
    description_ar: ''
  });

  useEffect(() => {
    if (id) {
      dispatch(getJobTitleDetails(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (jobTitleDetails) {
      setFormData({
        name_en: jobTitleDetails.name_en || jobTitleDetails.name || '',
        name_ar: jobTitleDetails.name_ar || jobTitleDetails.name || '',
        description_en: jobTitleDetails.description_en || jobTitleDetails.description || '',
        description_ar: jobTitleDetails.description_ar || jobTitleDetails.description || ''
      });
    }
  }, [jobTitleDetails]);

  useEffect(() => {
    if (success) {
      toast.success(success, { rtl: true });
      setTimeout(() => {
        navigate('/job-titles');
        dispatch(clearSuccess());
      }, 1500);
    }
    if (error) {
      toast.error(error, { rtl: true });
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
    await dispatch(updateJobTitle({ id, jobTitleData: formData }));
  };

  const handleCancel = () => {
    navigate('/job-titles');
  };

  if (isLoading && !jobTitleDetails) {
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
                تعديل المسمى الوظيفي
              </h1>
              <button
                onClick={handleCancel}
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
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: 'bold',
                  color: '#182d40',
                  fontSize: '14px',
                  fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                }}>
                  الاسم بالعربية *
                </label>
                <input
                  type="text"
                  name="name_ar"
                  value={formData.name_ar}
                  onChange={handleChange}
                  placeholder="أدخل الاسم بالعربية"
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

              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: 'bold',
                  color: '#182d40',
                  fontSize: '14px',
                  fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                }}>
                  الاسم بالإنجليزية *
                </label>
                <input
                  type="text"
                  name="name_en"
                  value={formData.name_en}
                  onChange={handleChange}
                  placeholder="أدخل الاسم بالإنجليزية"
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

              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: 'bold',
                  color: '#182d40',
                  fontSize: '14px',
                  fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                }}>
                  الوصف بالعربية *
                </label>
                <textarea
                  name="description_ar"
                  value={formData.description_ar}
                  onChange={handleChange}
                  placeholder="أدخل الوصف بالعربية"
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
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ marginBottom: '30px' }}>
                <label style={{ 
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: 'bold',
                  color: '#182d40',
                  fontSize: '14px',
                  fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                }}>
                  الوصف بالإنجليزية *
                </label>
                <textarea
                  name="description_en"
                  value={formData.description_en}
                  onChange={handleChange}
                  placeholder="أدخل الوصف بالإنجليزية"
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
                    resize: 'vertical'
                  }}
                />
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
                  border: 'none',
                  padding: '12px 25px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  opacity: isLoading ? 0.7 : 1,
                  fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
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

export default EditJobTitle;
