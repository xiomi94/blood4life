import { useState } from 'react';
import { useTheme } from '../../../../context/ThemeContext';
import { Moon, Sun } from 'lucide-react';

const ThemeToggle = () => {
    const { isDarkMode, toggleTheme } = useTheme();
    const [isTransitioning, setIsTransitioning] = useState(false);

    const handleToggle = () => {
        // Prevent rapid clicking to avoid photosensitive seizure effects
        if (isTransitioning) return;

        setIsTransitioning(true);
        toggleTheme();

        // Re-enable after transition completes (1300ms for maximum safety)
        setTimeout(() => {
            setIsTransitioning(false);
        }, 1300);
    };

    return (
        <button
            type="button"
            onClick={handleToggle}
            disabled={isTransitioning}
            aria-label={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            className="inline-flex items-center justify-center px-[13px] py-2 sm:py-2.5 md:py-3 bg-transparent hover:bg-gray-800/10 dark:hover:bg-gray-700/20 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm font-poppins font-medium transition-all duration-150 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isDarkMode ? (
                <Moon size={20} className="inline-block" />
            ) : (
                <Sun size={20} className="inline-block" />
            )}
        </button>
    );
}

export default ThemeToggle;
