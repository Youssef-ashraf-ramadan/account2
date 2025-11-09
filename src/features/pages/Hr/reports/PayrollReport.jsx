import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getPayrollReports, clearError, clearReports } from '../../../../redux/Slices/authSlice';
import { FaCalendarAlt, FaFileExcel } from 'react-icons/fa';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';

const PayrollReport = () => {
  const dispatch = useDispatch();
  const { payrollReports, isLoading, error } = useSelector((state) => state.auth);
  const [reportDate, setReportDate] = useState('');

  useEffect(() => {
    return () => {
      // Reset when component unmounts
      setReportDate('');
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
    if (!reportDate) {
      toast.error('يرجى اختيار السنة والشهر', { rtl: true });
      return;
    }
    const [year, month] = reportDate.split('-');
    await dispatch(getPayrollReports({ year: year, month: month }));
  };

  const handleExportToExcel = () => {
    if (!payrollReports || !payrollReports.data || payrollReports.data.length === 0) {
      toast.error('لا توجد بيانات للتصدير', { rtl: true });
      return;
    }

    const data = payrollReports.data.map((item, index) => ({
      'المسلسل': index + 1,
      'الموظف': item.employee_name,
      'القسم': item.department,
      'الراتب الأساسي': parseFloat(item.base_salary),
      'البدلات': parseFloat(item.total_allowances),
      'الخصومات': parseFloat(item.total_deductions),
      'صافي الراتب': parseFloat(item.net_salary),
      'الحالة': item.status === 'generated' ? 'تم التوليد' : item.status || 'غير معروف'
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'كشف الرواتب');
    XLSX.writeFile(wb, `كشف_الرواتب_${reportDate}.xlsx`);
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
          تقرير كشف الرواتب
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
        <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '200px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              color: '#182d40',
              fontSize: '14px',
              fontWeight: 'bold',
              fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
            }}>
              السنة والشهر
            </label>
            <input
              type="month"
              value={reportDate}
              onChange={(e) => setReportDate(e.target.value)}
              className="month-input-white"
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
          {payrollReports && payrollReports.data && payrollReports.data.length > 0 && (
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
      {payrollReports && payrollReports.data && payrollReports.data.length > 0 && (
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
                  <th style={{ padding: '16px 20px', textAlign: 'center', color: 'white', fontWeight: 'bold', minWidth: '150px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>الراتب الأساسي</th>
                  <th style={{ padding: '16px 20px', textAlign: 'center', color: 'white', fontWeight: 'bold', minWidth: '130px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>البدلات</th>
                  <th style={{ padding: '16px 20px', textAlign: 'center', color: 'white', fontWeight: 'bold', minWidth: '130px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>الخصومات</th>
                  <th style={{ padding: '16px 20px', textAlign: 'center', color: 'white', fontWeight: 'bold', minWidth: '140px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>صافي الراتب</th>
                  <th style={{ padding: '16px 20px', textAlign: 'center', color: 'white', fontWeight: 'bold', minWidth: '140px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>الحالة</th>
                </tr>
              </thead>
              <tbody>
                {payrollReports.data.map((item, index) => (
                  <tr key={item.employee_id} style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: index % 2 === 0 ? 'var(--basic-color)' : '#f0f4fa' }}>
                    <td style={{ padding: '16px 20px', textAlign: 'center', color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>{index + 1}</td>
                    <td style={{ padding: '16px 20px', textAlign: 'center', color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>{item.employee_name}</td>
                    <td style={{ padding: '16px 20px', textAlign: 'center', color: '#182d40', whiteSpace: 'normal', lineHeight: '1.5', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>{item.department}</td>
                    <td style={{ padding: '16px 20px', textAlign: 'center', color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>
                      {parseFloat(item.base_salary).toLocaleString('ar-EG')} جنيه
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'center', color: 'var(--main-color)', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>
                      {parseFloat(item.total_allowances).toLocaleString('ar-EG')} جنيه
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'center', color: 'var(--red-color)', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>
                      {parseFloat(item.total_deductions).toLocaleString('ar-EG')} جنيه
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'center', color: 'var(--main-color)', fontWeight: 'bold', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>
                      {parseFloat(item.net_salary).toLocaleString('ar-EG')} جنيه
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'center', color: '#182d40' }}>
                      <span style={{
                        padding: '6px 18px',
                        borderRadius: '20px',
                        backgroundColor: item.status === 'generated' ? 'var(--main-color)' : 'var(--red-color)',
                        color: 'white',
                        fontSize: '13px',
                        fontWeight: 'bold',
                        display: 'inline-block',
                        whiteSpace: 'nowrap',
                        fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
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

      {/* عرض رسالة لا توجد بيانات */}
      {payrollReports && (
        (!payrollReports.data || 
         payrollReports.data.length === 0 || 
         (Array.isArray(payrollReports.data) && payrollReports.data.length > 0 && 
          payrollReports.data.every(item => 
            !item || 
            Object.keys(item).length === 0 || 
            (item.employee_name === null || item.employee_name === undefined || item.employee_name === '') &&
            (item.department === null || item.department === undefined || item.department === '') &&
            (item.base_salary === null || item.base_salary === undefined || item.base_salary === '')
          )
         )
        ) && (
          <div style={{
            backgroundColor: 'var(--basic-color)',
            borderRadius: '12px',
            padding: '40px 20px',
            border: '1px solid var(--border-color)',
            textAlign: 'center'
          }}>
            <div style={{
              color: '#182d40',
              fontSize: '18px',
              fontWeight: 'bold',
              fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
            }}>
              لا توجد بيانات
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default PayrollReport;

