import React, { createContext, useState, useContext, useEffect } from "react";
import { useTranslation } from 'react-i18next';

const TitleContext = createContext();

export const TitleProvider = ({ children }) => {
  const { t, i18n } = useTranslation('global');

  // Track the translation key (e.g., 'sidenav.home', 'sidenav.exportRequests')
  const [titleKey, setTitleKey] = useState('sidenav.home');
  const [title, setTitle] = useState(t(titleKey));

  // Update title when language or key changes
  useEffect(() => {
    setTitle(t(titleKey));
  }, [titleKey, i18n.language, t]);

  // Expose title and a way to change the key
  return (
    <TitleContext.Provider value={{ title, setTitle: setTitleKey }}>
      {children}
    </TitleContext.Provider>
  );
};

export const useTitle = () => useContext(TitleContext);
