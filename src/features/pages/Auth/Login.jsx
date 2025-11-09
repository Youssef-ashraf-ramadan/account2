import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { motion } from 'framer-motion';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaEnvelope, FaArrowLeft } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../../redux/Slices/authSlice';
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
if (!document.querySelector('#login-placeholder-style')) {
  style.id = 'login-placeholder-style';
  document.head.appendChild(style);
}

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [shake, setShake] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoading, error, user } = useSelector((state) => state.auth);

    // إذا كان المستخدم مسجل مسبقاً (من sessionStorage) نحوله مباشرة عند فتح الصفحة
    useEffect(() => {
        try {
            const storedUser = sessionStorage.getItem('useralbaraqawy');
            if (storedUser) {
                const parsed = JSON.parse(storedUser);
                const token = parsed?.token || parsed?.data?.token || parsed?.user?.token || parsed?.result?.token;
                if (token) {
                    navigate('/');
                }
            }
        } catch {}
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setShake(true);
            toast.error('يجب إدخال البريد الإلكتروني وكلمة المرور', {
                position: "top-right",
                rtl: true
            });
            setTimeout(() => setShake(false), 500);
            return;
        }

        try {
            const result = await dispatch(loginUser({ email, password })).unwrap();
            const successMessage = (result && (result.message === 'front.login-success')) ? 'تم تسجيل الدخول بنجاح' : (result?.message || 'تم تسجيل الدخول بنجاح');
            toast.success(successMessage, { rtl: true, autoClose: 1200 });
            setTimeout(() => navigate('/'), 1200);
        } catch (err) {
            setShake(true);
            toast.error(err.message || 'فشل تسجيل الدخول', {
                autoClose: 1500
            });
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
                    height: '100vh',
                    background: 'var(--dashboard-bg)',
                    overflow: 'hidden',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0
                }}>
            <ToastContainer />
            
            {/* النموذج - 100% */}
            <div className="col-12 d-flex justify-content-center align-items-center px-4"
                style={{
                    background: 'var(--dashboard-bg)',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
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

                        {/* العنوان */}
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring' }}
                        className="text-center">
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

                    {/* عنوان تسجيل الدخول */}
                    <motion.h2
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        className="text-center mb-5 fw-bold"
                            style={{ 
                            color: '#182d40', 
                            fontSize: '25px',
                            fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                                fontWeight: 'bold'
                            }}>
                        سجل دخول الى حسابك
                    </motion.h2>


                        <form onSubmit={handleSubmit}>
                        {/* البريد الإلكتروني */}
                            <motion.div
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="mb-4">
                            <label htmlFor="email" className="form-label fw-medium d-block text-end" style={{ 
                                color: '#182d40', 
                                marginBottom: '0.5rem',
                                fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                                fontWeight: 'bold'
                            }}>
                                البريد الإلكتروني <span style={{ color: 'var(--red-color)' }}>*</span>
                                </label>
                                    <input
                                type="email"
                                        className="form-control login-input"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                        required
                                        style={{ 
                                    backgroundColor: 'var(--basic-color)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '8px',
                                    color: '#182d40',
                                    padding: '12px 16px',
                                    fontSize: '1.1rem',
                                    fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                                }}
                            />
                            </motion.div>

                            {/* حقل كلمة المرور */}
                            <motion.div
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.7 }}
                                className="mb-4">
                            <label htmlFor="password" className="form-label fw-medium d-block text-end" style={{ 
                                color: '#182d40', 
                                marginBottom: '0.5rem',
                                fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                                fontWeight: 'bold'
                            }}>
                                    كلمة المرور <span style={{ color: 'var(--red-color)' }}>*</span>
                                </label>
                            <div className="position-relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="form-control login-input"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    placeholder="************"
                                        required
                                    style={{ 
                                        backgroundColor: 'var(--basic-color)',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '8px',
                                        color: '#182d40',
                                        padding: '12px 16px 12px 16px',
                                        fontSize: '1.1rem',
                                        fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                                    }}
                                    />
                                    <button
                                        type="button"
                                    className="position-absolute"
                                        onClick={() => setShowPassword(!showPassword)}
                                    style={{ 
                                        top: '50%',
                                        left: '12px',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        color: '#182d40',
                                        cursor: 'pointer',
                                        fontSize: '1.2rem'
                                    }}>
                                    {showPassword ? <FaEyeSlash style={{ color: '#182d40' }} /> : <FaEye style={{ color: '#182d40' }} />}
                                    </button>
                                </div>
                            </motion.div>

                            {/* زر تسجيل الدخول */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="btn w-100 text-white py-3 fw-medium"
                                style={{
                                backgroundColor: 'var(--main-color)',
                                    border: 'none',
                                borderRadius: '8px',
                                fontSize: '1.2rem',
                                marginTop: '1rem',
                                fontWeight: 'bold',
                                fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                                }}
                                disabled={isLoading}>
                                {isLoading ? <LoadingSpinner /> : 'تسجيل الدخول'}
                            </motion.button>
                        <div className="text-center mt-3">
                            <span style={{ color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>لا تملك حسابًا؟ </span>
                            <Link to="/register" style={{ color: 'var(--main-color)', textDecoration: 'none', fontWeight: 'bold', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>إنشاء حساب</Link>
                        </div>
                        </form>

                </motion.div>
            </div>

        </div>
    );
};

export default LoginPage;