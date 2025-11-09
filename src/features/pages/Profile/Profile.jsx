import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getUserProfile } from '../../../redux/Slices/authSlice';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaCheckCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { profile, isLoading, error } = useSelector((state) => state.auth);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      // البيانات تأتي مباشرة من الـ response وليس داخل data object
      setProfileData(profile);
    }
  }, [profile]);

  useEffect(() => {
    if (error) {
      toast.error(error, { rtl: true });
    }
  }, [error]);

  const formatDate = (dateString) => {
    if (!dateString) return 'غير محدد';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const LoadingSpinner = () => (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div 
      className="container-fluid d-flex justify-content-center align-items-center"
      style={{
        minHeight: '100vh',
        background: 'var(--dashboard-bg)',
        position: 'relative',
        padding: '40px 0'
      }}
    >
      {/* Background pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        opacity: 0.1
      }}></div>

      <div className="row justify-content-center w-100">
        <div className="col-md-10 col-lg-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="card shadow-lg border-0"
            style={{ 
              borderRadius: '15px',
              backgroundColor: 'var(--basic-color)',
              backdropFilter: 'none',
              border: '1px solid var(--border-color)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
            }}
          >
            <div 
              className="card-header text-white py-4" 
              style={{ 
                borderRadius: '15px 15px 0 0',
                background: 'linear-gradient(135deg, var(--main-color) 0%, var(--sub-light) 100%)',
                border: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center'
              }}
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="d-flex justify-content-center mb-3"
              >
                <div 
                  className="d-flex align-items-center justify-content-center"
                  style={{
                    width: '80px',
                    height: '80px',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    borderRadius: '50%',
                    fontSize: '2rem'
                  }}
                >
                  <FaUser style={{ color: 'white' }} />
                </div>
              </motion.div>
              <h4 className="mb-0" style={{ 
                fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                fontWeight: 'bold',
                textAlign: 'center',
                display: 'block',
                margin: '0 auto',
                color: 'white'
              }}>
                الملف الشخصي
              </h4>
            </div>

            <div className="card-body p-4" style={{ backgroundColor: 'var(--basic-color)' }}>
              {profileData ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="row g-3">
                    {/* الصف الأول: الاسم الكامل والبريد الإلكتروني */}
                    <div className="col-12 col-md-6">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="info-item"
                        style={{
                          backgroundColor: 'rgba(0, 106, 255, 0.05)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '12px',
                          padding: '20px',
                          height: '100%',
                          transition: 'all 0.3s ease',
                          cursor: 'default'
                        }}
                        whileHover={{
                          backgroundColor: 'rgba(0, 106, 255, 0.1)',
                          borderColor: 'var(--main-color)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(0, 106, 255, 0.15)'
                        }}
                      >
                        <div className="d-flex align-items-center mb-3">
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            backgroundColor: 'rgba(0, 106, 255, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginLeft: '12px'
                          }}>
                            <FaUser style={{ fontSize: '1.1rem', color: '#182d40' }} />
                          </div>
                          <h6 className="mb-0" style={{ fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                            الاسم الكامل
                          </h6>
                        </div>
                        <p className="mb-0" style={{ fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontSize: '1rem', color: 'var(--text-primary)', fontWeight: 'bold' }}>
                          {profileData.name || 'غير محدد'}
                        </p>
                      </motion.div>
                    </div>

                    <div className="col-12 col-md-6">
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        className="info-item"
                        style={{
                          backgroundColor: 'rgba(0, 106, 255, 0.05)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '12px',
                          padding: '20px',
                          height: '100%',
                          transition: 'all 0.3s ease',
                          cursor: 'default'
                        }}
                        whileHover={{
                          backgroundColor: 'rgba(0, 106, 255, 0.1)',
                          borderColor: 'var(--main-color)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(0, 106, 255, 0.15)'
                        }}
                      >
                        <div className="d-flex align-items-center mb-3">
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            backgroundColor: 'rgba(0, 106, 255, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginLeft: '12px'
                          }}>
                            <FaEnvelope style={{ fontSize: '1.1rem', color: '#182d40' }} />
                          </div>
                          <h6 className="mb-0" style={{ fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                            البريد الإلكتروني
                          </h6>
                        </div>
                        <p className="mb-0" style={{ fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontSize: '1rem', color: 'var(--text-primary)', fontWeight: 'bold' }}>
                          {profileData.email || 'غير محدد'}
                        </p>
                      </motion.div>
                    </div>

                    {/* الصف الثاني: رقم الهاتف وحالة الحساب */}
                    <div className="col-12 col-md-6">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 }}
                        className="info-item"
                        style={{
                          backgroundColor: 'rgba(0, 106, 255, 0.05)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '12px',
                          padding: '20px',
                          height: '100%',
                          transition: 'all 0.3s ease',
                          cursor: 'default'
                        }}
                        whileHover={{
                          backgroundColor: 'rgba(0, 106, 255, 0.1)',
                          borderColor: 'var(--main-color)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(0, 106, 255, 0.15)'
                        }}
                      >
                        <div className="d-flex align-items-center mb-3">
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            backgroundColor: 'rgba(0, 106, 255, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginLeft: '12px'
                          }}>
                            <FaPhone style={{ fontSize: '1.1rem', color: '#182d40' }} />
                          </div>
                          <h6 className="mb-0" style={{ fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                            رقم الهاتف
                          </h6>
                        </div>
                        <p className="mb-0" style={{ fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontSize: '1rem', color: 'var(--text-primary)', fontWeight: 'bold' }}>
                          {profileData.phone || 'غير محدد'}
                        </p>
                      </motion.div>
                    </div>

                    <div className="col-12 col-md-6">
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 }}
                        className="info-item"
                        style={{
                          backgroundColor: 'rgba(0, 106, 255, 0.05)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '12px',
                          padding: '20px',
                          height: '100%',
                          transition: 'all 0.3s ease',
                          cursor: 'default'
                        }}
                        whileHover={{
                          backgroundColor: 'rgba(0, 106, 255, 0.1)',
                          borderColor: 'var(--main-color)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(0, 106, 255, 0.15)'
                        }}
                      >
                        <div className="d-flex align-items-center mb-3">
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            backgroundColor: 'rgba(0, 106, 255, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginLeft: '12px'
                          }}>
                            <FaCheckCircle style={{ fontSize: '1.1rem', color: '#182d40' }} />
                          </div>
                          <h6 className="mb-0" style={{ fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                            حالة الحساب
                          </h6>
                        </div>
                        <p className="mb-0" style={{ fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontSize: '1rem' }}>
                          <span style={{ 
                            fontSize: '0.85rem', 
                            padding: '6px 12px', 
                            borderRadius: '6px', 
                            fontWeight: '500',
                            backgroundColor: profileData.is_active ? 'var(--main-color)' : 'var(--red-color)',
                            color: 'var(--text-primary)',
                            display: 'inline-block'
                          }}>
                            {profileData.is_active ? 'نشط' : 'غير نشط'}
                          </span>
                        </p>
                      </motion.div>
                    </div>

                    {/* الصف الثالث: تاريخ الإنشاء وتاريخ تأكيد البريد */}
                    <div className="col-12 col-md-6">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.9 }}
                        className="info-item"
                        style={{
                          backgroundColor: 'rgba(0, 106, 255, 0.05)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '12px',
                          padding: '20px',
                          height: '100%',
                          transition: 'all 0.3s ease',
                          cursor: 'default'
                        }}
                        whileHover={{
                          backgroundColor: 'rgba(0, 106, 255, 0.1)',
                          borderColor: 'var(--main-color)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(0, 106, 255, 0.15)'
                        }}
                      >
                        <div className="d-flex align-items-center mb-3">
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            backgroundColor: 'rgba(0, 106, 255, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginLeft: '12px'
                          }}>
                            <FaCalendarAlt style={{ fontSize: '1.1rem', color: '#182d40' }} />
                          </div>
                          <h6 className="mb-0" style={{ fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                            تاريخ الإنشاء
                          </h6>
                        </div>
                        <p className="mb-0" style={{ fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontSize: '1rem', color: 'var(--text-primary)', fontWeight: 'bold' }}>
                          {formatDate(profileData.created_at)}
                        </p>
                      </motion.div>
                    </div>

                    {profileData.email_verified_at && (
                      <div className="col-12 col-md-6">
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.0 }}
                          className="info-item"
                          style={{
                            backgroundColor: 'rgba(172, 32, 0, 0.1)',
                            border: '1px solid rgba(172, 32, 0, 0.3)',
                            borderRadius: '12px',
                            padding: '20px',
                            height: '100%',
                            transition: 'all 0.3s ease',
                            cursor: 'default'
                          }}
                          whileHover={{
                            backgroundColor: 'rgba(172, 32, 0, 0.15)',
                            borderColor: 'rgba(172, 32, 0, 0.5)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 12px rgba(172, 32, 0, 0.2)'
                          }}
                        >
                          <div className="d-flex align-items-center mb-3">
                            <div style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '10px',
                              backgroundColor: 'rgba(0, 106, 255, 0.1)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginLeft: '12px'
                            }}>
                              <FaCheckCircle style={{ fontSize: '1.1rem', color: '#182d40' }} />
                            </div>
                            <h6 className="mb-0" style={{ fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                              تاريخ تأكيد البريد الإلكتروني
                            </h6>
                          </div>
                          <p className="mb-0" style={{ fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontSize: '1rem', color: 'var(--text-primary)', fontWeight: 'bold' }}>
                            {formatDate(profileData.email_verified_at)}
                          </p>
                        </motion.div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : (
                <div className="text-center py-4">
                  <p style={{ fontFamily: 'Droid Arabic Kufi Bold, sans-serif', color: 'var(--text-primary)', fontWeight: 'bold' }}>
                    لا توجد بيانات متاحة
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;



