import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage, type LanguageCode } from '../../../../context/LanguageContext';
import { Globe } from 'lucide-react';
import styles from './LanguageSwitcher.module.css';

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
        <div className={styles.languageSwitcher} ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                className={styles.button}
                aria-label={t('language.select')}
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                <Globe className={styles.icon} size={16} />
                {CurrentFlagComponent && <CurrentFlagComponent className={styles.buttonFlag} />}
            </button>

            {isOpen && (
                <div className={styles.dropdown} role="menu">
                    {languages.map((lang) => {
                        const FlagComponent = lang.FlagComponent;
                        return (
                            <button
                                key={lang.code}
                                onClick={() => handleLanguageChange(lang.code)}
                                className={`${styles.dropdownItem} ${currentLanguage === lang.code ? styles.active : ''
                                    }`}
                                role="menuitem"
                                aria-label={`${t('language.select')}: ${lang.nativeName}`}
                            >
                                <FlagComponent className={styles.flagIcon} />
                                <span className={styles.langName}>{lang.nativeName}</span>
                                {currentLanguage === lang.code && (
                                    <span className={styles.checkmark}>✓</span>
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
