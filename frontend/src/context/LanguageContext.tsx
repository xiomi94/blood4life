import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ES, GB, DE, FR, JP, CN } from 'country-flag-icons/react/3x2';

// Language codes
export type LanguageCode = 'es' | 'en' | 'de' | 'fr' | 'ja' | 'zh';

// Language information
export interface Language {
    code: LanguageCode;
    name: string;
    nativeName: string;
    FlagComponent: any;
}

// Available languages
export const languages: Language[] = [
    { code: 'es', name: 'Spanish', nativeName: 'Español', FlagComponent: ES },
    { code: 'en', name: 'English', nativeName: 'English', FlagComponent: GB },
    { code: 'de', name: 'German', nativeName: 'Deutsch', FlagComponent: DE },
    { code: 'fr', name: 'French', nativeName: 'Français', FlagComponent: FR },
    { code: 'ja', name: 'Japanese', nativeName: '日本語', FlagComponent: JP },
    { code: 'zh', name: 'Chinese', nativeName: '中文', FlagComponent: CN },
];

interface LanguageContextType {
    currentLanguage: LanguageCode;
    changeLanguage: (lang: LanguageCode) => void;
    languages: Language[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
    children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
    const { i18n } = useTranslation();
    const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>(
        (localStorage.getItem('language') as LanguageCode) || 'es'
    );

    useEffect(() => {
        // Initialize i18n with the saved language
        i18n.changeLanguage(currentLanguage);
    }, []);

    const changeLanguage = (lang: LanguageCode) => {
        i18n.changeLanguage(lang);
        setCurrentLanguage(lang);
        localStorage.setItem('language', lang);
    };

    return (
        <LanguageContext.Provider value={{ currentLanguage, changeLanguage, languages }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = (): LanguageContextType => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
