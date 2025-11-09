import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAccountLinks, getUnlinkedAccounts, updateAccountLink } from '../../../../redux/Slices/authSlice';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FaLink, FaCheckCircle } from 'react-icons/fa';

const AccountLinks = () => {
  const dispatch = useDispatch();
  const { accountLinks, unlinkedAccounts, isLoading } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({});
  const [searchQueries, setSearchQueries] = useState({});
  const [filteredAccounts, setFilteredAccounts] = useState({});
  const [openDropdowns, setOpenDropdowns] = useState({});

  useEffect(() => {
    dispatch(getAccountLinks());
    dispatch(getUnlinkedAccounts());
  }, [dispatch]);

  const getDisabledAccountIds = React.useCallback((currentKey) => {
    const disabledIds = [];
    
    // الحسابات المختارة في formData
    Object.keys(formData).forEach(key => {
      if (key !== currentKey && formData[key]) {
        disabledIds.push(Number(formData[key]));
      }
    });
    
    // الحسابات المربوطة أصلاً (غير المختارة في formData)
    if (accountLinks?.data) {
      accountLinks.data.forEach(link => {
        if (link.key !== currentKey && link.linked_account && !formData[link.key]) {
          disabledIds.push(link.linked_account.id);
        }
      });
    }
    
    return disabledIds;
  }, [formData, accountLinks]);

  // لا نقوم بتهيئة formData تلقائياً - فقط الحسابات التي يغيرها المستخدم

  useEffect(() => {
    if (unlinkedAccounts?.data && accountLinks?.data) {
      const filtered = {};
      accountLinks.data.forEach(link => {
        const searchQuery = searchQueries[link.key] || '';
        let accounts = unlinkedAccounts.data;
        
        if (searchQuery) {
          const searchTerm = searchQuery.toLowerCase();
          accounts = accounts.filter(account => 
            account.name_ar?.toLowerCase().includes(searchTerm) ||
            account.name_en?.toLowerCase().includes(searchTerm) ||
            account.code?.toLowerCase().includes(searchTerm)
          );
        }
        
        // عرض جميع الحسابات (سنتعامل مع disabled في العرض)
        filtered[link.key] = accounts;
      });
      setFilteredAccounts(filtered);
    } else if (unlinkedAccounts?.data) {
      const filtered = {};
      accountLinks?.data?.forEach(link => {
        // عرض جميع الحسابات
        filtered[link.key] = unlinkedAccounts.data;
      });
      setFilteredAccounts(filtered);
    }
  }, [unlinkedAccounts, formData, accountLinks, searchQueries]);

  const handleSearch = (key, value) => {
    setSearchQueries(prev => ({ ...prev, [key]: value }));
  };

  const handleAccountSelect = (key, accountId) => {
    setFormData(prev => ({ ...prev, [key]: accountId.toString() }));
    setOpenDropdowns(prev => ({ ...prev, [key]: false }));
    setSearchQueries(prev => ({ ...prev, [key]: '' }));
  };

  // إغلاق dropdown عند النقر خارجه
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.account-dropdown-container')) {
        setOpenDropdowns({});
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // جمع فقط الـ links التي تم تغييرها أو اختيارها
    const links = [];
    
    if (accountLinks?.data) {
      accountLinks.data.forEach(link => {
        // فقط الحسابات الموجودة في formData (تم تغييرها أو اختيارها من المستخدم)
        if (formData[link.key]) {
          const newAccountId = Number(formData[link.key]);
          const originalAccountId = link.linked_account?.id;
          
          // إرسال فقط إذا كان الحساب مختلف عن الأصلي أو لم يكن مربوط من قبل
          if (!originalAccountId || newAccountId !== originalAccountId) {
            links.push({
              key: link.key,
              account_id: newAccountId
            });
          }
        }
      });
    }

    if (links.length === 0) {
      toast.error('يرجى اختيار أو تغيير حساب واحد على الأقل', { rtl: true });
      return;
    }

    try {
      for (const link of links) {
        await dispatch(updateAccountLink(link)).unwrap();
      }
      toast.success('تم ربط الحسابات بنجاح', { rtl: true });
      dispatch(getAccountLinks());
    } catch (error) {
      toast.error(error || 'فشل ربط الحسابات', { rtl: true });
    }
  };

  const getCurrentLanguage = () => {
    return localStorage.getItem('i18nextLng') || 'ar';
  };

  const getLabel = (link) => {
    const lang = getCurrentLanguage();
    return lang === 'ar' ? link.label_ar : link.label_en;
  };

  const getAccountName = (account) => {
    const lang = getCurrentLanguage();
    return lang === 'ar' ? account.name_ar : account.name_en;
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border" role="status" style={{ color: 'var(--main-color)' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // التحقق من أن كل الحسابات مربوطة ولا توجد تغييرات
  const allLinked = (() => {
    if (!accountLinks?.data || accountLinks.data.length === 0) return false;
    
    // كل الحسابات يجب أن تكون مربوطة
    const allAccountsLinked = accountLinks.data.every(link => !!link.linked_account);
    
    // لا توجد تغييرات في formData
    const noChanges = Object.keys(formData).length === 0;
    
    return allAccountsLinked && noChanges;
  })();

  return (
    <div className="content-wrapper">
      <div className="container-fluid">
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ color: 'var(--text-primary)', fontFamily: 'Droid Arabic Kufi Bold, sans-serif', fontWeight: 'bold', marginBottom: '20px' }}>
            ربط الحسابات
          </h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{
            backgroundColor: 'var(--basic-color)',
            borderRadius: '12px',
            padding: '30px',
            border: '1px solid var(--border-color)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
          }}>
            {accountLinks?.data?.map((link, index) => {
              const linkedAccount = link.linked_account;
              // الحساب المختار من المستخدم أو الحساب المرتبط الأصلي
              const currentAccountId = formData[link.key] || (linkedAccount ? linkedAccount.id.toString() : null);
              const isDropdownOpen = openDropdowns[link.key];
              const disabledIds = getDisabledAccountIds(link.key);
              let accountsToShow = filteredAccounts[link.key] || unlinkedAccounts?.data || [];
              
              // إضافة الحساب المرتبط الحالي إذا لم يكن موجوداً في القائمة
              if (linkedAccount && !accountsToShow.find(acc => acc.id === linkedAccount.id)) {
                accountsToShow = [linkedAccount, ...accountsToShow];
              }
              
              const searchQuery = searchQueries[link.key] || '';

              return (
                <motion.div
                  key={link.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  style={{ marginBottom: '25px' }}
                >
                  <div style={{
                    backgroundColor: 'rgba(0, 106, 255, 0.05)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    padding: '20px'
                  }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '12px',
                      color: 'var(--text-primary)',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                    }}>
                      {getLabel(link)}
                    </label>

                    <div style={{ position: 'relative' }} className="account-dropdown-container">
                      {linkedAccount && !isDropdownOpen && (
                        <div style={{
                          backgroundColor: 'var(--main-color)',
                          border: '1px solid var(--main-color)',
                          borderRadius: '8px',
                          padding: '15px',
                          marginBottom: '10px'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <FaCheckCircle style={{ color: 'white', fontSize: '1.2rem' }} />
                            <div style={{ flex: 1 }}>
                              <div style={{ color: 'white', fontWeight: 'bold', marginBottom: '5px', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>
                                {getAccountName(linkedAccount)}
                              </div>
                              <div style={{ color: 'white', fontSize: '0.9rem', opacity: 0.9, fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>
                                الكود: {linkedAccount.code} | النوع: {linkedAccount.type}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div
                        style={{
                          position: 'relative',
                          cursor: 'pointer'
                        }}
                        onClick={() => setOpenDropdowns(prev => ({ ...prev, [link.key]: !isDropdownOpen }))}
                      >
                        <input
                          type="text"
                          placeholder={currentAccountId ? 'ابحث لتغيير الحساب...' : 'ابحث عن حساب...'}
                          value={searchQuery || (currentAccountId && (unlinkedAccounts?.data?.find(acc => acc.id.toString() === currentAccountId) ? getAccountName(unlinkedAccounts.data.find(acc => acc.id.toString() === currentAccountId)) : (linkedAccount ? getAccountName(linkedAccount) : '')))}
                          onChange={(e) => {
                            handleSearch(link.key, e.target.value);
                            setOpenDropdowns(prev => ({ ...prev, [link.key]: true }));
                          }}
                          onFocus={() => {
                            setOpenDropdowns(prev => ({ ...prev, [link.key]: true }));
                            if (currentAccountId) {
                              setSearchQueries(prev => ({ ...prev, [link.key]: '' }));
                            }
                          }}
                          onClick={() => {
                            setOpenDropdowns(prev => ({ ...prev, [link.key]: true }));
                          }}
                          readOnly={!isDropdownOpen && currentAccountId && !linkedAccount}
                          style={{
                            width: '100%',
                            padding: '12px 15px',
                            backgroundColor: 'var(--basic-color)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '8px',
                            color: 'var(--text-primary)',
                            fontSize: '14px',
                            fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                            cursor: isDropdownOpen || !currentAccountId ? 'text' : 'pointer'
                          }}
                        />
                      </div>

                      {isDropdownOpen && (
                        <div style={{
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          right: 0,
                          backgroundColor: 'var(--basic-color)',
                          border: '1px solid var(--main-color)',
                          borderRadius: '8px',
                          maxHeight: '300px',
                          overflowY: 'auto',
                          zIndex: 1000,
                          marginTop: '5px',
                          boxShadow: '0 4px 12px rgba(0, 106, 255, 0.15)'
                        }}>
                          {accountsToShow.length > 0 ? (
                            accountsToShow.map(account => {
                              const isDisabled = disabledIds.includes(account.id);
                              const isSelected = account.id.toString() === currentAccountId;
                              return (
                                <div
                                  key={account.id}
                                  onClick={() => !isDisabled && handleAccountSelect(link.key, account.id)}
                                  style={{
                                    padding: '12px 15px',
                                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                                    backgroundColor: isSelected ? 'var(--main-color)' : (isDisabled ? 'rgba(107, 114, 128, 0.2)' : 'transparent'),
                                    color: isSelected ? 'white' : (isDisabled ? '#6b7280' : 'var(--text-primary)'),
                                    opacity: isDisabled ? 0.5 : 1,
                                    borderBottom: '1px solid var(--border-color)',
                                    fontFamily: 'Droid Arabic Kufi Bold, sans-serif'
                                  }}
                                  onMouseEnter={(e) => {
                                    if (!isDisabled) {
                                      if (!isSelected) {
                                        e.target.style.backgroundColor = 'rgba(0, 106, 255, 0.1)';
                                        e.target.style.color = 'var(--main-color)';
                                      }
                                    }
                                  }}
                                  onMouseLeave={(e) => {
                                    if (!isDisabled) {
                                      e.target.style.backgroundColor = isSelected ? 'var(--main-color)' : 'transparent';
                                      e.target.style.color = isSelected ? 'white' : 'var(--text-primary)';
                                    }
                                  }}
                                >
                                  <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', color: isSelected ? 'white' : 'inherit', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>
                                    {isSelected && <FaCheckCircle style={{ color: 'white', fontSize: '0.9rem' }} />}
                                    {getAccountName(account)}
                                  </div>
                                  <div style={{ fontSize: '0.85rem', color: isSelected ? 'white' : 'var(--text-secondary)', marginTop: '4px', opacity: isSelected ? 0.9 : 1, fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>
                                    الكود: {account.code} | النوع: {account.type}
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div style={{ padding: '15px', color: 'var(--text-secondary)', textAlign: 'center', fontFamily: 'Droid Arabic Kufi Bold, sans-serif' }}>
                              لا توجد حسابات متاحة
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                  </div>
                </motion.div>
              );
            })}

            <div style={{ marginTop: '30px', textAlign: 'center' }}>
              <button
                type="submit"
                disabled={allLinked}
                style={{
                  backgroundColor: allLinked ? 'var(--gray-color)' : 'var(--main-color)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 30px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: allLinked ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  fontFamily: 'Droid Arabic Kufi Bold, sans-serif',
                  opacity: allLinked ? 0.6 : 1
                }}
                onMouseEnter={(e) => {
                  if (!allLinked) {
                    e.target.style.backgroundColor = 'var(--sub-light)';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(0, 106, 255, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!allLinked) {
                    e.target.style.backgroundColor = 'var(--main-color)';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }
                }}
              >
                <FaLink style={{ marginLeft: '8px', display: 'inline-block' }} />
                حفظ الربط
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountLinks;

