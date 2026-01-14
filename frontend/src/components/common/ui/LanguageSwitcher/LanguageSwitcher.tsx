import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage, type LanguageCode } from '../../../../context/LanguageContext';
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
    const { t } = useTranslation();
    const { currentLanguage, changeLanguage, languages } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    // Close dropdown when pressing Escape
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen]);

    const handleLanguageChange = (lang: LanguageCode) => {
        changeLanguage(lang);
        setIsOpen(false);
    };

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    // Get current language object to access its flag component
    const currentLang = languages.find(lang => lang.code === currentLanguage);
    const CurrentFlagComponent = currentLang?.FlagComponent;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                aria-label={t('language.select')}
                aria-expanded={isOpen}
                aria-haspopup="true"
                className="inline-flex items-center justify-center gap-1.5 px-[13px] py-2 sm:py-2.5 md:py-3 bg-transparent hover:bg-gray-800/10 dark:hover:bg-gray-700/20 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm font-poppins font-medium transition-all duration-150 transform active:scale-95"
            >
                <Globe size={20} />
                {CurrentFlagComponent && <CurrentFlagComponent className="w-7 h-5 rounded" />}
            </button>

            {isOpen && (
                <div
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50"
                    role="menu"
                >
                    {languages.map((lang) => {
                        const FlagComponent = lang.FlagComponent;
                        return (
                            <button
                                key={lang.code}
                                onClick={() => handleLanguageChange(lang.code)}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${currentLanguage === lang.code ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                                    }`}
                                role="menuitem"
                                aria-label={`${t('language.select')}: ${lang.nativeName}`}
                            >
                                <FlagComponent className="w-6 h-4 rounded shadow-sm" />
                                <span className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                                    {lang.nativeName}
                                </span>
                                {currentLanguage === lang.code && (
                                    <span className="text-blue-600 dark:text-blue-400 font-bold">✓</span>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default LanguageSwitcher;
