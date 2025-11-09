import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../../redux/Slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';

// إضافة CSS للـ placeholder
const style = document.createElement('style');
style.innerHTML = `
  .login-input::placeholder {
    color: rgba(24, 45, 64, 0.5) !important;
    opacity: 1 !important;
  }
  .login-input::-webkit-input-placeholder {
    color: rgba(24, 45, 64, 0.5) !important;
    opacity: 1 !important;
  }
  .login-input::-moz-placeholder {
    color: rgba(24, 45, 64, 0.5) !important;
    opacity: 1 !important;
  }
  .login-input:-ms-input-placeholder {
    color: rgba(24, 45, 64, 0.5) !important;
    opacity: 1 !important;
  }
`;
if (!document.querySelector('#register-placeholder-style')) {
  style.id = 'register-placeholder-style';
  document.head.appendChild(style);
}

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [shake, setShake] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, user, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      navigate('/app');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !phone || !password || !passwordConfirmation) {
      setShake(true);
      toast.error('كل الحقول مطلوبة', { position: 'top-right', rtl: true });
      setTimeout(() => setShake(false), 500);
      return;
    }
    if (password !== passwordConfirmation) {
      setShake(true);
      toast.error('كلمتا المرور غير متطابقتين', { position: 'top-right', rtl: true });
      setTimeout(() => setShake(false), 500);
      return;
    }

    try {
      const result = await dispatch(
        registerUser({ name, email, phone: phone ? `+2${phone}` : '', password, password_confirmation: passwordConfirmation })
      ).unwrap();
      toast.success(result?.message || 'تم إنشاء الحساب بنجاح', {
        autoClose: 1500,
        onClose: () => navigate('/login')
      });
    } catch (err) {
      setShake(true);
      toast.error(err.message || 'فشل إنشاء الحساب', { autoClose: 2000, rtl: true });
      setTimeout(() => setShake(false), 500);
    }
  };

  const LoadingSpinner = () => (
    <div className="spinner-border text-light" role="status" style={{ width: '1.5rem', height: '1.5rem' }}>
      <span className="visually-hidden">Loading...</span>
    </div>
  );

  return (
    <div className="container-fluid d-flex p-0"
      style={{
        minHeight: '100vh',
        background: 'var(--dashboard-bg)',
        overflowY: 'auto'
      }}>
      <ToastContainer />

      {/* النموذج - 100% */}
      <div className="col-12 d-flex justify-content-center align-items-center px-4"
        style={{ background: 'var(--dashboard-bg)', position: 'relative', paddingTop: '40px', paddingBottom: '40px', overflow: 'hidden' }}>
        {/* زخرفة حرف A في الخلفية */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '400px',
          fontWeight: 'bold',
          color: 'var(--main-color)',
          opacity: 0.03,
          fontFamily: 'Arial, sans-serif',
          pointerEvents: 'none',
          userSelect: 'none',
          zIndex: 0
        }}>
          A
        </div>
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className={`${shake ? 'shake-animation' : ''}`}
          style={{ 
            width: '100%', 
            maxWidth: '450px', 
            zIndex: 2,
            backgroundColor: 'var(--basic-color)',
            padding: '40px',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0, 106, 255, 0.15)',
            border: '1px solid var(--border-color)',
            position: 'relative'
          }}>

          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }} className="text-center">
            <h1 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              margin: 0,
              marginBottom: '2rem',
              color: '#182d40',
              fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
            }}>
              Account <span style={{ color: 'var(--main-color)' }}>System</span>
            </h1>
          </motion.div>

          <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-center mb-4 fw-bold"
            style={{ color: '#182d40', fontSize: '24px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>
            إنشاء حساب جديد
          </motion.h2>

          <form onSubmit={handleSubmit}>
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.6 }} className="mb-3">
              <label htmlFor="name" className="form-label fw-medium d-block text-end" style={{ color: '#182d40', marginBottom: '0.5rem', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>الاسم</label>
              <input type="text" className="form-control login-input" id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="الاسم الكامل" required
                style={{ backgroundColor: 'var(--basic-color)', border: '1px solid var(--border-color)', borderRadius: '8px', color: '#182d40', padding: '12px 16px', fontSize: '1.05rem', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }} />
            </motion.div>

            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.65 }} className="mb-3">
              <label htmlFor="email" className="form-label fw-medium d-block text-end" style={{ color: '#182d40', marginBottom: '0.5rem', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>البريد الإلكتروني</label>
              <input type="email" className="form-control login-input" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" required
                style={{ backgroundColor: 'var(--basic-color)', border: '1px solid var(--border-color)', borderRadius: '8px', color: '#182d40', padding: '12px 16px', fontSize: '1.05rem', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }} />
            </motion.div>

            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.68 }} className="mb-3">
              <label htmlFor="phone" className="form-label fw-medium d-block text-end" style={{ color: '#182d40', marginBottom: '0.5rem', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>رقم الهاتف</label>
              <div className="input-group" style={{ direction: 'ltr' }}>
                <span className="input-group-text" style={{ backgroundColor: 'var(--basic-color)', border: '1px solid var(--border-color)', borderRight: '0', color: '#182d40', borderRadius: '8px 0 0 8px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>+2</span>
                <input type="tel" className="form-control login-input" id="phone" value={phone} onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))} placeholder="01xxxxx" required inputMode="numeric" maxLength={11}
                  style={{ backgroundColor: 'var(--basic-color)', border: '1px solid var(--border-color)', borderLeft: '0', borderRadius: '0 8px 8px 0', color: '#182d40', padding: '12px 16px', fontSize: '1.05rem', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }} />
              </div>
            </motion.div>

            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.7 }} className="mb-3">
              <label htmlFor="password" className="form-label fw-medium d-block text-end" style={{ color: '#182d40', marginBottom: '0.5rem', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>كلمة المرور</label>
              <div className="position-relative">
                <input type={showPassword ? 'text' : 'password'} className="form-control login-input" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="************" required
                  style={{ backgroundColor: 'var(--basic-color)', border: '1px solid var(--border-color)', borderRadius: '8px', color: '#182d40', padding: '12px 16px 12px 16px', fontSize: '1.05rem', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }} />
                <button type="button" className="position-absolute" onClick={() => setShowPassword(!showPassword)}
                  style={{ top: '50%', left: '12px', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#182d40', cursor: 'pointer', fontSize: '1.1rem' }}>
                  {showPassword ? <FaEyeSlash style={{ color: '#182d40' }} /> : <FaEye style={{ color: '#182d40' }} />}
                </button>
              </div>
            </motion.div>

            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.75 }} className="mb-4">
              <label htmlFor="password_confirmation" className="form-label fw-medium d-block text-end" style={{ color: '#182d40', marginBottom: '0.5rem', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>تأكيد كلمة المرور</label>
              <div className="position-relative">
                <input type={showPasswordConfirm ? 'text' : 'password'} className="form-control login-input" id="password_confirmation" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} placeholder="************" required
                  style={{ backgroundColor: 'var(--basic-color)', border: '1px solid var(--border-color)', borderRadius: '8px', color: '#182d40', padding: '12px 16px 12px 16px', fontSize: '1.05rem', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }} />
                <button type="button" className="position-absolute" onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                  style={{ top: '50%', left: '12px', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#182d40', cursor: 'pointer', fontSize: '1.1rem' }}>
                  {showPasswordConfirm ? <FaEyeSlash style={{ color: '#182d40' }} /> : <FaEye style={{ color: '#182d40' }} />}
                </button>
              </div>
            </motion.div>

            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="btn w-100 text-white py-3 fw-medium"
              style={{ backgroundColor: 'var(--main-color)', border: 'none', borderRadius: '8px', fontSize: '1.15rem', marginTop: '0.5rem', fontWeight: 'bold', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }} disabled={isLoading}>
              {isLoading ? <LoadingSpinner /> : 'إنشاء الحساب'}
            </motion.button>
          </form>

          <div className="text-center mt-4">
            <span style={{ color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>لديك حساب؟ </span>
            <Link to="/login" style={{ color: 'var(--main-color)', textDecoration: 'none', fontWeight: 'bold', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>سجل الدخول</Link>
          </div>

        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;


