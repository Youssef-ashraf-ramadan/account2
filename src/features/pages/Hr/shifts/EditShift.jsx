import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getWorkShiftDetails, updateWorkShift, clearError, clearSuccess } from '../../../../redux/Slices/authSlice';
import { toast } from 'react-toastify';
import { FaArrowRight, FaPlus, FaTrash } from 'react-icons/fa';

const EditShift = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { workShiftDetails, isLoading, error, success } = useSelector((state) => state.auth);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const lastErrorRef = useRef({ message: null, time: 0 });
  const lastSuccessRef = useRef({ message: null, time: 0 });

  const [formData, setFormData] = useState({
    name_en: '',
    name_ar: '',
    details: [
      { day_of_week: 'saturday', is_off_day: true, start_time: '', end_time: '' },
      { day_of_week: 'sunday', is_off_day: false, start_time: '09:00', end_time: '17:00' },
      { day_of_week: 'monday', is_off_day: false, start_time: '09:00', end_time: '17:00' },
      { day_of_week: 'tuesday', is_off_day: false, start_time: '09:00', end_time: '17:00' },
      { day_of_week: 'wednesday', is_off_day: false, start_time: '09:00', end_time: '17:00' },
      { day_of_week: 'thursday', is_off_day: false, start_time: '09:00', end_time: '17:00' },
      { day_of_week: 'friday', is_off_day: true, start_time: '', end_time: '' }
    ]
  });

  const daysOfWeek = [
    { key: 'saturday', label: 'السبت' },
    { key: 'sunday', label: 'الأحد' },
    { key: 'monday', label: 'الاثنين' },
    { key: 'tuesday', label: 'الثلاثاء' },
    { key: 'wednesday', label: 'الأربعاء' },
    { key: 'thursday', label: 'الخميس' },
    { key: 'friday', label: 'الجمعة' }
  ];

  useEffect(() => {
    if (id) {
      dispatch(getWorkShiftDetails(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (workShiftDetails) {
      setFormData({
        name_en: workShiftDetails.name_en || workShiftDetails.name || '',
        name_ar: workShiftDetails.name_ar || workShiftDetails.name || '',
        details: workShiftDetails.details || formData.details
      });
    }
  }, [workShiftDetails]);

  useEffect(() => {
    if (success) {
      const now = Date.now();
      const last = lastSuccessRef.current;
      // Only show toast if it's a different message or enough time has passed
      if (!last.message || last.message !== success || now - last.time > 2000) {
        toast.success(success, { rtl: true });
        lastSuccessRef.current = { message: success, time: now };
        // Clear success and navigate after showing toast (give time for toast to appear)
        setTimeout(() => {
          dispatch(clearSuccess());
          navigate('/shifts');
        }, 1500);
      }
    }
  }, [success, dispatch, navigate]);

  useEffect(() => {
    if (error) {
      const now = Date.now();
      const last = lastErrorRef.current;
      // Only show toast if it's a different message or enough time has passed
      if (!last.message || last.message !== error || now - last.time > 2000) {
        toast.error(error, { rtl: true });
        lastErrorRef.current = { message: error, time: now };
      }
      // Clear error after showing toast
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDayChange = (dayIndex, field, value) => {
    setFormData(prev => ({
      ...prev,
      details: prev.details.map((day, index) => 
        index === dayIndex 
          ? { ...day, [field]: value }
          : day
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate that all non-off days have start_time and end_time
    const invalidDays = formData.details.filter(day => 
      !day.is_off_day && (!day.start_time || !day.end_time)
    );

    if (invalidDays.length > 0) {
      toast.error('يرجى تحديد وقت البداية والنهاية لجميع أيام العمل', { rtl: true });
      setIsSubmitting(false);
      return;
    }

    try {
      await dispatch(updateWorkShift({ id, data: formData }));
    } catch (err) {
      console.error('Error updating shift:', err);
    } finally {
      setIsSubmitting(false);
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
        alignItems: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid var(--gray-color)',
            borderTop: '4px solid var(--main-color)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }} />
          <p style={{ 
            fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
            fontWeight: 'bold'
          }}>جاري التحميل...</p>
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
      <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          marginBottom: '20px',
          color: '#182d40',
          margin: 0,
          fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
        }}>
          تعديل الوردية
        </h1>
        <button
          onClick={() => navigate('/shifts')}
          style={{
            backgroundColor: 'var(--gray-color)',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
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
          <FaArrowRight style={{ color: 'white' }} />
          العودة للقائمة
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{
        backgroundColor: 'var(--basic-color)',
        borderRadius: '12px',
        padding: '30px',
        border: '1px solid var(--border-color)'
      }}>
        {/* اسم الوردية */}
        <div style={{ marginBottom: '25px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            color: '#182d40',
            fontWeight: 'bold',
            fontSize: '14px',
            fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
          }}>
            اسم الوردية (عربي) *
          </label>
          <input
            type="text"
            name="name_ar"
            value={formData.name_ar}
            onChange={handleInputChange}
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
            placeholder="مثال: الوردية الصباحية"
          />
        </div>

        <div style={{ marginBottom: '25px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            color: '#182d40',
            fontWeight: 'bold',
            fontSize: '14px',
            fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
          }}>
            اسم الوردية (إنجليزي) *
          </label>
          <input
            type="text"
            name="name_en"
            value={formData.name_en}
            onChange={handleInputChange}
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
            placeholder="Example: Morning Shift"
          />
        </div>

        {/* تفاصيل الأيام */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{
            color: '#182d40',
            marginBottom: '20px',
            fontSize: '18px',
            fontWeight: 'bold',
            fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
          }}>
            تفاصيل الأيام
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {formData.details.map((day, index) => (
              <div key={day.day_of_week} style={{
                backgroundColor: 'var(--basic-color)',
                padding: '20px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '15px'
                }}>
                  <h4 style={{
                    color: '#182d40',
                    margin: 0,
                    fontSize: '16px',
                    fontWeight: 'bold',
                    fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                  }}>
                    {daysOfWeek.find(d => d.key === day.day_of_week)?.label}
                  </h4>
                  
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#182d40',
                    cursor: 'pointer',
                    fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                    fontWeight: 'bold'
                  }}>
                    <input
                      type="checkbox"
                      checked={day.is_off_day}
                      onChange={(e) => handleDayChange(index, 'is_off_day', e.target.checked)}
                      style={{
                        width: '18px',
                        height: '18px',
                        accentColor: 'var(--main-color)'
                      }}
                    />
                    يوم إجازة
                  </label>
                </div>

                {!day.is_off_day && (
                  <div style={{
                    display: 'flex',
                    gap: '15px',
                    alignItems: 'center'
                  }}>
                    <div style={{ flex: 1 }}>
                      <label style={{
                        display: 'block',
                        marginBottom: '5px',
                        color: '#182d40',
                        fontSize: '14px',
                        fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                        fontWeight: 'bold'
                      }}>
                        وقت البداية
                      </label>
                      <input
                        type="time"
                        value={day.start_time}
                        onChange={(e) => handleDayChange(index, 'start_time', e.target.value)}
                        required={!day.is_off_day}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          backgroundColor: 'var(--basic-color)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '6px',
                          color: '#182d40',
                          fontSize: '14px',
                          fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                        }}
                      />
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <label style={{
                        display: 'block',
                        marginBottom: '5px',
                        color: '#182d40',
                        fontSize: '14px',
                        fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                        fontWeight: 'bold'
                      }}>
                        وقت النهاية
                      </label>
                      <input
                        type="time"
                        value={day.end_time}
                        onChange={(e) => handleDayChange(index, 'end_time', e.target.value)}
                        required={!day.is_off_day}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          backgroundColor: 'var(--basic-color)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '6px',
                          color: '#182d40',
                          fontSize: '14px',
                          fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* أزرار التحكم */}
        <div style={{
          display: 'flex',
          gap: '15px',
          justifyContent: 'center',
          marginTop: '30px'
        }}>
          <button
            type="button"
            onClick={() => navigate('/shifts')}
            style={{
              backgroundColor: 'var(--gray-color)',
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
            <FaArrowRight style={{ color: 'white' }} />
            إلغاء
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              backgroundColor: isSubmitting ? 'var(--gray-color)' : 'var(--main-color)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              opacity: isSubmitting ? 0.7 : 1,
              fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
            }}
          >
            {isSubmitting ? (
              <>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid white',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                جاري الحفظ...
              </>
            ) : (
              <>
                <FaPlus style={{ color: 'white' }} />
                تحديث الوردية
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditShift;
