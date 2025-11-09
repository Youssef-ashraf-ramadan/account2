import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getSalaryDetails, clearError } from '../../../../redux/Slices/authSlice';
import { FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';

const SalaryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { salaryDetails, isLoading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (id) {
      dispatch(getSalaryDetails(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (error) {
      toast.error(error, { rtl: true });
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG');
  };

  const formatCurrency = (amount) => {
    return parseFloat(amount).toLocaleString('ar-EG') + ' جنيه';
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
        <div style={{ 
          fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
          fontWeight: 'bold'
        }}>جاري التحميل...</div>
      </div>
    );
  }

  if (!salaryDetails) {
    return (
      <div style={{ 
        padding: '30px',
        backgroundColor: 'var(--dashboard-bg)',
        minHeight: 'calc(100vh - 80px)',
        color: '#182d40',
        textAlign: 'center'
      }}>
        <div style={{ 
          fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
          fontWeight: 'bold'
        }}>لا توجد بيانات</div>
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
      {/* العنوان */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '15px',
          marginBottom: '20px'
        }}>
          <button
            onClick={() => navigate('/salaries')}
            style={{
              backgroundColor: 'var(--gray-color)',
              color: 'white',
              border: 'none',
              padding: '10px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
              fontWeight: 'bold'
            }}
          >
            <FaArrowLeft style={{ color: 'white' }} />
            العودة
          </button>
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold',
            color: '#182d40',
            margin: 0,
            fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
          }}>
            تفاصيل الراتب
          </h1>
        </div>
      </div>

      {/* تفاصيل الراتب */}
      <div style={{
        backgroundColor: 'var(--basic-color)',
        borderRadius: '12px',
        padding: '20px',
        border: '1px solid var(--border-color)'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {/* الراتب الأساسي */}
          <div>
            <h3 style={{ 
              color: '#182d40',
              marginBottom: '10px',
              fontSize: '16px',
              fontWeight: 'bold',
              fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
            }}>
              الراتب الأساسي
            </h3>
            <div style={{
              backgroundColor: 'var(--basic-color)',
              padding: '15px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              textAlign: 'center'
            }}>
              <div style={{ 
                fontSize: '20px', 
                fontWeight: 'bold',
                color: '#182d40',
                fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
              }}>
                {formatCurrency(salaryDetails.base_salary)}
              </div>
            </div>
          </div>

          {/* تاريخ السريان */}
          <div>
            <h3 style={{ 
              color: '#182d40',
              marginBottom: '10px',
              fontSize: '16px',
              fontWeight: 'bold',
              fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
            }}>
              تاريخ السريان
            </h3>
            <div style={{
              backgroundColor: 'var(--basic-color)',
              padding: '15px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              textAlign: 'center'
            }}>
              <div style={{ 
                fontSize: '16px', 
                fontWeight: 'bold',
                color: '#182d40',
                fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
              }}>
                {formatDate(salaryDetails.effective_date)}
              </div>
            </div>
          </div>

          {/* البدلات */}
          <div>
            <h3 style={{ 
              color: '#182d40',
              marginBottom: '10px',
              fontSize: '16px',
              fontWeight: 'bold',
              fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
            }}>
              البدلات
            </h3>
            <div style={{
              backgroundColor: 'var(--basic-color)',
              padding: '15px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)'
            }}>
              {salaryDetails.allowances?.housing && (
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                  padding: '8px',
                  backgroundColor: 'var(--main-color)',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                }}>
                  <span style={{ color: 'white', fontWeight: 'bold' }}>بدل السكن:</span>
                  <span style={{ color: 'white' }}>{formatCurrency(salaryDetails.allowances.housing)}</span>
                </div>
              )}
              {salaryDetails.allowances?.transportation && (
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                  padding: '8px',
                  backgroundColor: 'var(--main-color)',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                }}>
                  <span style={{ color: 'white', fontWeight: 'bold' }}>بدل المواصلات:</span>
                  <span style={{ color: 'white' }}>{formatCurrency(salaryDetails.allowances.transportation)}</span>
                </div>
              )}
              {(!salaryDetails.allowances?.housing && !salaryDetails.allowances?.transportation) && (
                <div style={{ 
                  textAlign: 'center', 
                  color: '#182d40',
                  fontStyle: 'italic',
                  fontSize: '14px',
                  fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                  fontWeight: 'bold',
                  opacity: 0.7
                }}>
                  لا توجد بدلات
                </div>
              )}
            </div>
          </div>

          {/* الخصومات */}
          <div>
            <h3 style={{ 
              color: '#182d40',
              marginBottom: '10px',
              fontSize: '16px',
              fontWeight: 'bold',
              fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
            }}>
              الخصومات
            </h3>
            <div style={{
              backgroundColor: 'var(--basic-color)',
              padding: '15px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)'
            }}>
              {salaryDetails.deductions?.social_insurance && (
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                  padding: '8px',
                  backgroundColor: 'rgba(220, 53, 69, 0.1)',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                }}>
                  <span style={{ color: 'var(--red-color)', fontWeight: 'bold' }}>التأمين الاجتماعي:</span>
                  <span style={{ color: '#182d40', fontWeight: 'bold' }}>{formatCurrency(salaryDetails.deductions.social_insurance)}</span>
                </div>
              )}
              {!salaryDetails.deductions?.social_insurance && (
                <div style={{ 
                  textAlign: 'center', 
                  color: '#182d40',
                  fontStyle: 'italic',
                  fontSize: '14px',
                  fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                  fontWeight: 'bold',
                  opacity: 0.7
                }}>
                  لا توجد خصومات
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ملخص الراتب */}
        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: 'var(--basic-color)',
          borderRadius: '8px',
          border: '1px solid var(--border-color)'
        }}>
          <h3 style={{ 
            color: '#182d40',
            marginBottom: '12px',
            fontSize: '16px',
            fontWeight: 'bold',
            textAlign: 'center',
            fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
          }}>
            ملخص الراتب
          </h3>
          <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '15px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                color: '#182d40', 
                fontSize: '12px', 
                marginBottom: '4px',
                fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                fontWeight: 'bold',
                opacity: 0.8
              }}>الراتب الأساسي</div>
              <div style={{ 
                color: '#182d40', 
                fontSize: '16px', 
                fontWeight: 'bold',
                fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
              }}>
                {formatCurrency(salaryDetails.base_salary)}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                color: '#182d40', 
                fontSize: '12px', 
                marginBottom: '4px',
                fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                fontWeight: 'bold',
                opacity: 0.8
              }}>إجمالي البدلات</div>
              <div style={{ 
                color: '#182d40', 
                fontSize: '16px', 
                fontWeight: 'bold',
                fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
              }}>
                {formatCurrency((salaryDetails.allowances?.housing || 0) + (salaryDetails.allowances?.transportation || 0))}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                color: '#182d40', 
                fontSize: '12px', 
                marginBottom: '4px',
                fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                fontWeight: 'bold',
                opacity: 0.8
              }}>إجمالي الخصومات</div>
              <div style={{ 
                color: 'var(--red-color)', 
                fontSize: '16px', 
                fontWeight: 'bold',
                fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
              }}>
                {formatCurrency(salaryDetails.deductions?.social_insurance || 0)}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                color: '#182d40', 
                fontSize: '12px', 
                marginBottom: '4px',
                fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                fontWeight: 'bold',
                opacity: 0.8
              }}>صافي الراتب</div>
              <div style={{ 
                color: 'white', 
                fontSize: '18px', 
                fontWeight: 'bold',
                padding: '8px 16px',
                backgroundColor: 'var(--main-color)',
                borderRadius: '8px',
                fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
              }}>
                {formatCurrency(
                  parseFloat(salaryDetails.base_salary) + 
                  (salaryDetails.allowances?.housing || 0) + 
                  (salaryDetails.allowances?.transportation || 0) - 
                  (salaryDetails.deductions?.social_insurance || 0)
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalaryDetails;
