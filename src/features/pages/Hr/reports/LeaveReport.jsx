import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getLeaveReports, clearError, clearReports } from '../../../../redux/Slices/authSlice';
import { FaCalendarAlt, FaFileExcel } from 'react-icons/fa';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';

const LeaveReport = () => {
  const dispatch = useDispatch();
  const { leaveReports, isLoading, error } = useSelector((state) => state.auth);
  const [leaveDates, setLeaveDates] = useState({ start_date: '', end_date: '' });

  useEffect(() => {
    return () => {
      // Reset when component unmounts
      setLeaveDates({ start_date: '', end_date: '' });
      dispatch(clearReports());
    };
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error, { rtl: true });
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleGenerateReport = async () => {
    if (!leaveDates.start_date || !leaveDates.end_date) {
      toast.error('يرجى اختيار تاريخ البداية والنهاية', { rtl: true });
      return;
    }
    await dispatch(getLeaveReports(leaveDates));
  };

  const handleExportToExcel = () => {
    if (!leaveReports || !leaveReports.data || leaveReports.data.length === 0) {
      toast.error('لا توجد بيانات للتصدير', { rtl: true });
      return;
    }

    const data = leaveReports.data.map((item, index) => ({
      'المسلسل': index + 1,
      'الموظف': item.employee_name || 'غير متوفر',
      'القسم': item.department || 'غير متوفر',
      'نوع الإجازة': item.leave_type || 'غير متوفر',
      'تاريخ البداية': item.start_date || 'غير متوفر',
      'تاريخ النهاية': item.end_date || 'غير متوفر',
      'الحالة': item.status === 'approved' ? 'موافق عليه' : item.status === 'rejected' ? 'مرفوض' : item.status === 'pending' ? 'قيد الانتظار' : item.status || 'غير معروف'
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'طلبات الإجازة');
    XLSX.writeFile(wb, `تقرير_طلبات_الاجازة_${leaveDates.start_date}_${leaveDates.end_date}.xlsx`);
    toast.success('تم تصدير الملف بنجاح', { rtl: true });
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
          color: '#182d40',
          marginBottom: '20px',
          fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
        }}>
          تقرير طلبات الإجازة
        </h1>
      </div>

      {/* اختيار التاريخ */}
      <div style={{
        backgroundColor: 'var(--basic-color)',
        borderRadius: '12px',
        padding: '20px',
        border: '1px solid var(--border-color)',
        marginBottom: '30px'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              color: '#182d40',
              fontSize: '14px',
              fontWeight: 'bold',
              fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
            }}>
              تاريخ البداية
            </label>
            <input
              type="date"
              value={leaveDates.start_date}
              onChange={(e) => setLeaveDates({ ...leaveDates, start_date: e.target.value })}
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
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              color: '#182d40',
              fontSize: '14px',
              fontWeight: 'bold',
              fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
            }}>
              تاريخ النهاية
            </label>
            <input
              type="date"
              value={leaveDates.end_date}
              onChange={(e) => setLeaveDates({ ...leaveDates, end_date: e.target.value })}
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
        </div>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={handleGenerateReport}
            disabled={isLoading}
            style={{
              backgroundColor: isLoading ? 'var(--gray-color)' : 'var(--main-color)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              opacity: isLoading ? 0.6 : 1,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
            }}
          >
            <FaCalendarAlt style={{ color: 'white' }} />
            {isLoading ? 'جاري التوليد...' : 'عرض التقرير'}
          </button>
          {leaveReports && leaveReports.data && leaveReports.data.length > 0 && (
            <button
              onClick={handleExportToExcel}
              style={{
                backgroundColor: 'var(--chart-color-2)',
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
              <FaFileExcel style={{ color: 'white' }} />
              تصدير Excel
            </button>
          )}
        </div>
      </div>

      {/* عرض النتائج */}
      {leaveReports && leaveReports.data && leaveReports.data.length > 0 ? (
        <div style={{
          backgroundColor: 'var(--basic-color)',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{ overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--main-color)', borderBottom: '2px solid var(--border-color)' }}>
                  <th style={{ padding: '16px 20px', textAlign: 'center', color: 'white', fontWeight: 'bold', minWidth: '60px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>#</th>
                  <th style={{ padding: '16px 20px', textAlign: 'center', color: 'white', fontWeight: 'bold', minWidth: '150px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>الموظف</th>
                  <th style={{ padding: '16px 20px', textAlign: 'center', color: 'white', fontWeight: 'bold', minWidth: '200px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>القسم</th>
                  <th style={{ padding: '16px 20px', textAlign: 'center', color: 'white', fontWeight: 'bold', minWidth: '150px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>نوع الإجازة</th>
                  <th style={{ padding: '16px 20px', textAlign: 'center', color: 'white', fontWeight: 'bold', minWidth: '140px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>تاريخ البداية</th>
                  <th style={{ padding: '16px 20px', textAlign: 'center', color: 'white', fontWeight: 'bold', minWidth: '140px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>تاريخ النهاية</th>
                  <th style={{ padding: '16px 20px', textAlign: 'center', color: 'white', fontWeight: 'bold', minWidth: '140px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>الحالة</th>
                </tr>
              </thead>
              <tbody>
                {leaveReports.data.map((item, index) => (
                  <tr key={item.leave_request_id || index} style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: index % 2 === 0 ? 'var(--basic-color)' : '#f0f4fa' }}>
                    <td style={{ padding: '16px 20px', textAlign: 'center', color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>{index + 1}</td>
                    <td style={{ padding: '16px 20px', textAlign: 'center', color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>{item.employee_name || 'غير متوفر'}</td>
                    <td style={{ padding: '16px 20px', textAlign: 'center', color: '#182d40', whiteSpace: 'normal', lineHeight: '1.5', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>{item.department || 'غير متوفر'}</td>
                    <td style={{ padding: '16px 20px', textAlign: 'center', color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>{item.leave_type || 'غير متوفر'}</td>
                    <td style={{ padding: '16px 20px', textAlign: 'center', color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>
                      {item.start_date ? new Date(item.start_date).toLocaleDateString('ar-EG') : 'غير متوفر'}
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'center', color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>
                      {item.end_date ? new Date(item.end_date).toLocaleDateString('ar-EG') : 'غير متوفر'}
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'center', color: '#182d40' }}>
                      <span style={{
                        padding: '6px 18px',
                        borderRadius: '20px',
                        backgroundColor: item.status === 'approved' ? 'var(--main-color)' : item.status === 'rejected' ? 'var(--red-color)' : 'var(--chart-color-2)',
                        color: 'white',
                        fontSize: '13px',
                        fontWeight: 'bold',
                        display: 'inline-block',
                        whiteSpace: 'nowrap',
                        fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                      }}>
                        {item.status === 'approved' ? 'موافق عليه' : item.status === 'rejected' ? 'مرفوض' : item.status === 'pending' ? 'قيد الانتظار' : item.status || 'غير معروف'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : leaveReports && (!leaveReports.data || leaveReports.data.length === 0) && !isLoading ? (
        <div style={{
          backgroundColor: 'var(--basic-color)',
          borderRadius: '12px',
          padding: '40px',
          border: '1px solid var(--border-color)',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '18px',
            color: '#182d40',
            fontWeight: 'bold',
            fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
          }}>
            لا توجد بيانات
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default LeaveReport;

