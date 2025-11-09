import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FaSearch, FaSync, FaChevronDown, FaChevronRight, FaFileExcel } from 'react-icons/fa';
import {
  getTrialBalance,
  clearTrialBalance,
  clearError
} from '../../../../redux/Slices/authSlice';

const TrialBalance = () => {
  const dispatch = useDispatch();
  const { trialBalanceTree, trialBalanceTotals, trialBalanceMeta, isLoading, error } = useSelector((state) => state.auth);
  const currentDateString = () => new Date().toISOString().slice(0, 10);
  const startOfYearString = () => {
    const now = new Date();
    return new Date(now.getFullYear(), 0, 1).toISOString().slice(0, 10);
  };
  const [filters, setFilters] = useState({
    start_date: '',
    end_date: '',
    include_zero_balance: false
  });
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const lastErrorRef = useRef({ message: null, time: 0 });

  useEffect(() => {
    dispatch(getTrialBalance(filters));
    return () => {
      dispatch(clearTrialBalance());
    };
  }, [dispatch]);

  useEffect(() => {
    if (Array.isArray(trialBalanceTree) && trialBalanceTree.length > 0) {
      const collectIds = (nodes, acc = []) => {
        nodes.forEach((node) => {
          acc.push(node.id);
          if (Array.isArray(node.children) && node.children.length > 0) {
            collectIds(node.children, acc);
          }
        });
        return acc;
      };
      const allIds = collectIds(trialBalanceTree, []);
      setExpandedNodes(new Set(allIds));
    } else {
      setExpandedNodes(new Set());
    }
  }, [trialBalanceTree]);

  useEffect(() => {
    if (error) {
      const now = Date.now();
      const last = lastErrorRef.current;
      if (!last.message || last.message !== error || now - last.time > 2000) {
        toast.error(error, { rtl: true });
        lastErrorRef.current = { message: error, time: now };
      }
      setTimeout(() => dispatch(clearError()), 3000);
    }
  }, [error, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(getTrialBalance(filters));
  };

  const handleReset = () => {
    const defaultFilters = {
      start_date: '',
      end_date: '',
      include_zero_balance: false
    };
    setFilters(defaultFilters);
    dispatch(getTrialBalance(defaultFilters));
  };

  const toggleNode = useCallback((nodeId) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  }, []);

  const flattenTree = useCallback((nodes, level = 0) => {
    if (!Array.isArray(nodes)) return [];
    return nodes.flatMap((node) => {
      const row = { node, level };
      const shouldExpand = expandedNodes.has(node.id) || level === 0;
      const children = shouldExpand ? flattenTree(node.children || [], level + 1) : [];
      return [row, ...children];
    });
  }, [expandedNodes]);

  const rows = useMemo(() => flattenTree(trialBalanceTree || []), [trialBalanceTree, flattenTree]);

  const renderValue = (value) => {
    const numeric = Number(value || 0);
    return numeric.toLocaleString('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const metaInfo = useMemo(() => {
    if (!trialBalanceMeta) return null;
    const { start_date, end_date } = trialBalanceMeta;
    return `الفترة: ${start_date || '-'} إلى ${end_date || '-'}`;
  }, [trialBalanceMeta]);

  return (
    <div style={{ padding: '30px', backgroundColor: 'var(--dashboard-bg)', minHeight: 'calc(100vh - 80px)', color: 'var(--text-primary)' }}>
      <h1 style={{ fontSize: '22px', marginBottom: '20px', color: 'var(--text-primary)', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>
        ميزان المراجعة
      </h1>

      <form onSubmit={handleSubmit} style={{ backgroundColor: 'var(--basic-color)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'flex-end' }}>
          <div style={{ flex: '1 1 200px', minWidth: '200px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#182د40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>
              من تاريخ
            </label>
            <input
              type="date"
              value={filters.start_date || ''}
              onChange={(e) => setFilters((prev) => ({ ...prev, start_date: e.target.value }))}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--basic-color)', color: '#182د40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}
            />
          </div>
          <div style={{ flex: '1 1 200px', minWidth: '200px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#182د40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>
              إلى تاريخ
            </label>
            <input
              type="date"
              value={filters.end_date || ''}
              onChange={(e) => setFilters((prev) => ({ ...prev, end_date: e.target.value }))}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--basic-color)', color: '#182د40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '200px', marginBottom: '6px' }}>
            <input
              type="checkbox"
              checked={filters.include_zero_balance}
              onChange={(e) => setFilters((prev) => ({ ...prev, include_zero_balance: e.target.checked }))}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <span style={{ fontFamily: 'Droid Arabic Kufi Bold, sans-serif', color: '#182د40' }}>إظهار الحسابات ذات الرصيد الصفري</span>
          </div>
        </div>
        <div style={{ marginTop: '20px', display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            type="submit"
            disabled={isLoading}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--main-color)', border: 'none', color: 'white', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold', opacity: isLoading ? 0.7 : 1 }}
          >
            <FaSearch /> بحث
          </button>
          <button
            type="button"
            onClick={handleReset}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--gray-color)', border: 'none', color: 'white', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}
          >
            <FaSync /> إعادة تعيين
          </button>
        </div>
      </form>

      {metaInfo && (
        <div style={{ marginBottom: '12px', color: '#182d40', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold' }}>
          {metaInfo}
        </div>
      )}

      <div style={{ backgroundColor: 'var(--basic-color)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--main-color)', color: 'white' }}>
                {[
                  { label: 'كود الحساب', width: '130px' },
                  { label: 'الحساب', width: '260px' },
                  { label: 'رصيد افتتاحي مدين', width: '160px' },
                  { label: 'رصيد افتتاحي دائن', width: '160px' },
                  { label: 'حركة الفترة مدين', width: '160px' },
                  { label: 'حركة الفترة دائن', width: '160px' },
                  { label: 'الإجمالي مدين', width: '160px' },
                  { label: 'الإجمالي دائن', width: '160px' },
                  { label: 'رصيد ختامي مدين', width: '160px' },
                  { label: 'رصيد ختامي دائن', width: '160px' }
                ].map(({ label, width }) => (
                  <th
                    key={label}
                    style={{ padding: '12px 14px', minWidth: width, width, fontSize: '13px', textAlign: 'center', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', borderBottom: '1px solid var(--border-color)' }}
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading && rows.length === 0 && (
                <tr>
                  <td colSpan={10} style={{ padding: '30px', textAlign: 'center', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', color: '#182d40' }}>
                    جاري التحميل...
                  </td>
                </tr>
              )}
              {!isLoading && rows.length === 0 && (
                <tr>
                  <td colSpan={10} style={{ padding: '30px', textAlign: 'center', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', color: '#182d40' }}>
                    لا توجد بيانات متاحة للمعايير المحددة
                  </td>
                </tr>
              )}
              {rows.map(({ node, level }) => {
                const hasChildren = Array.isArray(node.children) && node.children.length > 0;
                const isExpanded = expandedNodes.has(node.id) || level === 0;
                return (
                  <tr key={node.id} style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: level % 2 === 0 ? 'var(--basic-color)' : '#f7f9fc' }}>
                    <td style={{ padding: '12px 10px', textAlign: 'center', minWidth: '130px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', color: '#182د40' }}>{node.code || '-'}</td>
                    <td style={{ padding: '12px 10px', minWidth: '260px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', color: '#182د40' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingInlineStart: `${level * 20}px` }}>
                        {hasChildren ? (
                          <button
                            type="button"
                            onClick={() => {}}
                            aria-label="العناصر الفرعية"
                            style={{
                              border: '1px solid var(--border-color)',
                              background: 'var(--main-color)',
                              color: 'white',
                              cursor: 'default',
                              width: '22px',
                              height: '22px',
                              borderRadius: '6px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                            disabled
                          >
                            <FaChevronDown size={12} />
                          </button>
                        ) : (
                          <span style={{ width: '22px' }} />
                        )}
                        <span style={{ flex: 1 }}>{node.name_ar || node.name_en || node.name || '-'}</span>
                      </div>
                    </td>
                    <td style={cellStyle}>{renderValue(node.opening_debit)}</td>
                    <td style={cellStyle}>{renderValue(node.opening_credit)}</td>
                    <td style={cellStyle}>{renderValue(node.period_debit)}</td>
                    <td style={cellStyle}>{renderValue(node.period_credit)}</td>
                    <td style={cellStyle}>{renderValue(node.total_debit)}</td>
                    <td style={cellStyle}>{renderValue(node.total_credit)}</td>
                    <td style={cellStyle}>{renderValue(node.closing_debit)}</td>
                    <td style={cellStyle}>{renderValue(node.closing_credit)}</td>
                  </tr>
                );
              })}
              {trialBalanceTotals && (
                <tr style={{ backgroundColor: '#eef3ff', borderTop: '2px solid var(--main-color)' }}>
                  <td style={{ ...cellStyle, fontWeight: 'bold', color: 'var(--main-color)' }}>الإجمالي</td>
                  <td style={{ ...cellStyle, minWidth: '260px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingInlineStart: '0' }}>
                      <span style={{ width: '22px' }} />
                      <span style={{ fontWeight: 'bold', color: 'var(--main-color)' }}>—</span>
                    </div>
                  </td>
                  <td style={{ ...cellStyle, fontWeight: 'bold' }}>{renderValue(trialBalanceTotals.opening_debit)}</td>
                  <td style={{ ...cellStyle, fontWeight: 'bold' }}>{renderValue(trialBalanceTotals.opening_credit)}</td>
                  <td style={{ ...cellStyle, fontWeight: 'bold' }}>{renderValue(trialBalanceTotals.period_debit)}</td>
                  <td style={{ ...cellStyle, fontWeight: 'bold' }}>{renderValue(trialBalanceTotals.period_credit)}</td>
                  <td style={{ ...cellStyle, fontWeight: 'bold' }}>{renderValue(trialBalanceTotals.total_debit)}</td>
                  <td style={{ ...cellStyle, fontWeight: 'bold' }}>{renderValue(trialBalanceTotals.total_credit)}</td>
                  <td style={{ ...cellStyle, fontWeight: 'bold' }}>{renderValue(trialBalanceTotals.closing_debit)}</td>
                  <td style={{ ...cellStyle, fontWeight: 'bold' }}>{renderValue(trialBalanceTotals.closing_credit)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {trialBalanceTotals && false && (
        <div style={totalsWrapperStyle}>
          <h3 style={{ marginBottom: '4px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', color: '#182د40', fontWeight: 'bold', fontSize: '14px' }}>إجمالي الميزان</h3>
          <div style={totalsRowStyle}>
            {[
              { label: 'إجمالي الافتتاحي مدين', value: trialBalanceTotals.opening_debit },
              { label: 'إجمالي الافتتاحي دائن', value: trialBalanceTotals.opening_credit },
              { label: 'إجمالي حركة الفترة مدين', value: trialBalanceTotals.period_debit },
              { label: 'إجمالي حركة الفترة دائن', value: trialBalanceTotals.period_credit },
              { label: 'إجمالي المدين', value: trialBalanceTotals.total_debit },
              { label: 'إجمالي الدائن', value: trialBalanceTotals.total_credit },
              { label: 'إجمالي الختامي مدين', value: trialBalanceTotals.closing_debit },
              { label: 'إجمالي الختامي دائن', value: trialBalanceTotals.closing_credit }
            ].map(({ label, value }) => (
              <div key={label} style={totalsCardStyle}>
                <div style={{ color: '#6c7a89', fontSize: '12px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>{label}</div>
                <div style={{ fontWeight: 'bold', color: '#182د40', marginTop: '6px', fontSize: '16px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>{renderValue(value)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const cellStyle = {
  padding: '12px 10px',
  textAlign: 'center',
  fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
  color: '#182d40'
};

const totalsWrapperStyle = {
  marginTop: '24px',
  backgroundColor: 'var(--basic-color)',
  border: '1px solid var(--border-color)',
  borderRadius: '12px',
  padding: '18px'
};

const totalsRowStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  gap: '12px'
};

const totalsCardStyle = {
  backgroundColor: 'white',
  border: '1px solid var(--border-color)',
  borderRadius: '10px',
  padding: '12px 16px',
  textAlign: 'center',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
};

export default TrialBalance;


