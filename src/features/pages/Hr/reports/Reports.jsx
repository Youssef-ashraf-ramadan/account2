import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getLeaveReports, getAttendanceReports, getPayrollReports, clearError } from '../../../../redux/Slices/authSlice';
import { FaSearch, FaCalendarAlt, FaClipboardList, FaFileInvoice } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Reports = () => {
  const dispatch = useDispatch();
  const { leaveReports, attendanceReports, payrollReports, isLoading, error } = useSelector((state) => state.auth);
  
  const [selectedReport, setSelectedReport] = useState(null);
  const [leaveDates, setLeaveDates] = useState({ start_date: '', end_date: '' });
  const [attendanceDate, setAttendanceDate] = useState('');
  const [payrollDate, setPayrollDate] = useState('');

  useEffect(() => {
    if (error) {
      toast.error(error, { rtl: true });
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleLeaveReport = async () => {
    if (!leaveDates.start_date || !leaveDates.end_date) {
      toast.error('يرجى اختيار تاريخ البداية والنهاية', { rtl: true });
      return;
    }
    await dispatch(getLeaveReports(leaveDates));
    setSelectedReport('leave');
  };

  const handleAttendanceReport = async () => {
    if (!attendanceDate) {
      toast.error('يرجى اختيار السنة والشهر', { rtl: true });
      return;
    }
    const [year, month] = attendanceDate.split('-');
    await dispatch(getAttendanceReports({ year: year, month: month }));
    setSelectedReport('attendance');
  };

  const handlePayrollReport = async () => {
    if (!payrollDate) {
      toast.error('يرجى اختيار السنة والشهر', { rtl: true });
      return;
    }
    const [year, month] = payrollDate.split('-');
    await dispatch(getPayrollReports({ year: year, month: month }));
    setSelectedReport('payroll');
  };

  return (
    <div style={{ 
      padding: '30px',
      backgroundColor: 'var(--dashboard-bg)',
      minHeight: 'calc(100vh - 80px)',
      color: 'var(--text-primary)'
    }}>
      {/* العنوان */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold',
          color: 'var(--text-primary)',
          marginBottom: '20px'
        }}>
          التقارير
        </h1>
      </div>

      {/* التقارير */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {/* تقرير طلبات الإجازة */}
        <div style={{
          backgroundColor: 'var(--basic-color)',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{ marginBottom: '20px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '15px'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                backgroundColor: 'rgba(236, 72, 153, 0.2)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                color: '#ec4899'
              }}>
                <FaCalendarAlt style={{ color: '#182d40' }} />
              </div>
              <h2 style={{ 
                fontSize: '18px',
                fontWeight: 'bold',
                color: 'var(--text-primary)',
                margin: 0
              }}>
                تقرير طلبات الإجازة
              </h2>
            </div>
            <p style={{ color: '#ccc', fontSize: '14px', margin: 0 }}>
              تقرير شامل عن طلبات الإجازات في فترة محددة
            </p>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              color: 'var(--text-primary)',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              تاريخ البداية
            </label>
            <input
              type="date"
              value={leaveDates.start_date}
              onChange={(e) => setLeaveDates({ ...leaveDates, start_date: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 12px',
                backgroundColor: 'var(--basic-color)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                color: 'var(--text-primary)',
                fontSize: '14px',
                marginBottom: '15px'
              }}
            />
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              color: 'var(--text-primary)',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              تاريخ النهاية
            </label>
            <input
              type="date"
              value={leaveDates.end_date}
              onChange={(e) => setLeaveDates({ ...leaveDates, end_date: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 12px',
                backgroundColor: 'var(--basic-color)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                color: 'var(--text-primary)',
                fontSize: '14px'
              }}
            />
          </div>

          <button
            onClick={handleLeaveReport}
            disabled={isLoading}
            style={{
              width: '100%',
              backgroundColor: isLoading ? '#666' : '#ec4899',
              color: 'var(--text-primary)',
              border: 'none',
              padding: '12px',
              borderRadius: '8px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              opacity: isLoading ? 0.6 : 1
            }}
          >
            {isLoading ? 'جاري التوليد...' : 'عرض التقرير'}
          </button>
        </div>

        {/* تقرير الحضور والانصراف */}
        <div style={{
          backgroundColor: 'var(--basic-color)',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{ marginBottom: '20px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '15px'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                color: '#3b82f6'
              }}>
                <FaClipboardList />
              </div>
              <h2 style={{ 
                fontSize: '18px',
                fontWeight: 'bold',
                color: 'var(--text-primary)',
                margin: 0
              }}>
                تقرير الحضور والانصراف
              </h2>
            </div>
            <p style={{ color: '#ccc', fontSize: '14px', margin: 0 }}>
              تقرير تفصيلي عن الحضور والغياب لشهر محدد
            </p>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              color: 'var(--text-primary)',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              السنة والشهر
            </label>
            <input
              type="month"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              className="month-input-white"
              style={{
                width: '100%',
                padding: '10px 12px',
                backgroundColor: 'var(--basic-color)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                color: 'var(--text-primary)',
                fontSize: '14px'
              }}
            />
          </div>

          <button
            onClick={handleAttendanceReport}
            disabled={isLoading}
            style={{
              width: '100%',
              backgroundColor: isLoading ? '#666' : '#3b82f6',
              color: 'var(--text-primary)',
              border: 'none',
              padding: '12px',
              borderRadius: '8px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              opacity: isLoading ? 0.6 : 1
            }}
          >
            {isLoading ? 'جاري التوليد...' : 'عرض التقرير'}
          </button>
        </div>

        {/* تقرير كشف الراتب */}
        <div style={{
          backgroundColor: 'var(--basic-color)',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{ marginBottom: '20px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '15px'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                backgroundColor: 'rgba(172, 32, 0, 0.2)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                color: '#AC2000'
              }}>
                <FaFileInvoice />
              </div>
              <h2 style={{ 
                fontSize: '18px',
                fontWeight: 'bold',
                color: 'var(--text-primary)',
                margin: 0
              }}>
                تقرير كشف الراتب
              </h2>
            </div>
            <p style={{ color: '#ccc', fontSize: '14px', margin: 0 }}>
              تقرير شامل عن كشوف الرواتب لشهر محدد
            </p>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              color: 'var(--text-primary)',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              السنة والشهر
            </label>
            <input
              type="month"
              value={payrollDate}
              onChange={(e) => setPayrollDate(e.target.value)}
              className="month-input-white"
              style={{
                width: '100%',
                padding: '10px 12px',
                backgroundColor: 'var(--basic-color)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                color: 'var(--text-primary)',
                fontSize: '14px'
              }}
            />
          </div>

          <button
            onClick={handlePayrollReport}
            disabled={isLoading}
            style={{
              width: '100%',
              backgroundColor: isLoading ? '#666' : '#AC2000',
              color: 'var(--text-primary)',
              border: 'none',
              padding: '12px',
              borderRadius: '8px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              opacity: isLoading ? 0.6 : 1
            }}
          >
            {isLoading ? 'جاري التوليد...' : 'عرض التقرير'}
          </button>
        </div>
      </div>

      {/* عرض النتائج */}
      {selectedReport && (
        <div style={{
          marginTop: '30px',
          backgroundColor: 'var(--basic-color)',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid var(--border-color)'
        }}>
          <h3 style={{ 
            fontSize: '20px',
            fontWeight: 'bold',
            color: 'var(--text-primary)',
            marginBottom: '20px'
          }}>
            نتائج التقرير
          </h3>
          
          {selectedReport === 'leave' && leaveReports && (
            <div style={{ color: 'var(--text-primary)' }}>
              <div style={{ 
                backgroundColor: 'var(--basic-color)',
                padding: '15px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                overflow: 'auto',
                maxHeight: '500px'
              }}>
                <pre style={{ 
                  color: 'var(--text-primary)', 
                  fontSize: '12px', 
                  whiteSpace: 'pre-wrap',
                  margin: 0,
                  fontFamily: 'Courier New, monospace'
                }}>
                  {JSON.stringify(leaveReports, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {selectedReport === 'attendance' && attendanceReports && (
            <div style={{ color: 'var(--text-primary)' }}>
              <div style={{ 
                backgroundColor: 'var(--basic-color)',
                padding: '15px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                overflow: 'auto',
                maxHeight: '500px'
              }}>
                <pre style={{ 
                  color: 'var(--text-primary)', 
                  fontSize: '12px', 
                  whiteSpace: 'pre-wrap',
                  margin: 0,
                  fontFamily: 'Courier New, monospace'
                }}>
                  {JSON.stringify(attendanceReports, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {selectedReport === 'payroll' && payrollReports && payrollReports.data && payrollReports.data.length > 0 && (
            <div style={{ color: 'var(--text-primary)' }}>
              <div style={{ overflow: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #AC2000' }}>
                      <th style={{ padding: '12px', textAlign: 'center', color: 'var(--text-primary)', fontWeight: 'bold' }}>#</th>
                      <th style={{ padding: '12px', textAlign: 'center', color: 'var(--text-primary)', fontWeight: 'bold' }}>الموظف</th>
                      <th style={{ padding: '12px', textAlign: 'center', color: 'var(--text-primary)', fontWeight: 'bold' }}>القسم</th>
                      <th style={{ padding: '12px', textAlign: 'center', color: 'var(--text-primary)', fontWeight: 'bold' }}>الراتب الأساسي</th>
                      <th style={{ padding: '12px', textAlign: 'center', color: 'var(--text-primary)', fontWeight: 'bold' }}>البدلات</th>
                      <th style={{ padding: '12px', textAlign: 'center', color: 'var(--text-primary)', fontWeight: 'bold' }}>الخصومات</th>
                      <th style={{ padding: '12px', textAlign: 'center', color: 'var(--text-primary)', fontWeight: 'bold' }}>صافي الراتب</th>
                      <th style={{ padding: '12px', textAlign: 'center', color: 'var(--text-primary)', fontWeight: 'bold' }}>الحالة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payrollReports.data.map((item, index) => (
                      <tr key={item.employee_id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '12px', textAlign: 'center', color: 'var(--text-primary)' }}>{index + 1}</td>
                        <td style={{ padding: '12px', textAlign: 'center', color: 'var(--text-primary)' }}>{item.employee_name}</td>
                        <td style={{ padding: '12px', textAlign: 'center', color: 'var(--text-primary)' }}>{item.department}</td>
                        <td style={{ padding: '12px', textAlign: 'center', color: 'var(--text-primary)' }}>
                          {parseFloat(item.base_salary).toLocaleString('ar-EG')} جنيه
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center', color: '#AC2000' }}>
                          {parseFloat(item.total_allowances).toLocaleString('ar-EG')} جنيه
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center', color: '#dc3545' }}>
                          {parseFloat(item.total_deductions).toLocaleString('ar-EG')} جنيه
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center', color: '#AC2000', fontWeight: 'bold' }}>
                          {parseFloat(item.net_salary).toLocaleString('ar-EG')} جنيه
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center', color: 'var(--text-primary)' }}>
                          <span style={{
                            padding: '5px 15px',
                            borderRadius: '20px',
                            backgroundColor: item.status === 'generated' ? 'rgba(172, 32, 0, 0.2)' : 'rgba(220, 53, 69, 0.2)',
                            color: item.status === 'generated' ? '#AC2000' : '#dc3545',
                            fontSize: '12px',
                            fontWeight: 'bold'
                          }}>
                            {item.status === 'generated' ? 'تم التوليد' : item.status || 'غير معروف'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Reports;

