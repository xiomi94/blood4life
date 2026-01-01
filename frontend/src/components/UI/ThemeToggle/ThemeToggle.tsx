import { useState } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import styles from './ThemeToggle.module.css';

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
        <label className={styles.switch}>
            <input
                id="input"
                type="checkbox"
                checked={isDarkMode}
                onChange={handleToggle}
                disabled={isTransitioning}
                aria-label={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            />
            <div className={`${styles.slider} ${styles.round}`}>
                <div className={styles.sunMoon}>
                    {/* Moon dots */}
                    <svg id="moon-dot-1" className={styles.moonDot} viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="50"></circle>
                    </svg>
                    <svg id="moon-dot-2" className={styles.moonDot} viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="50"></circle>
                    </svg>
                    <svg id="moon-dot-3" className={styles.moonDot} viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="50"></circle>
                    </svg>

                    {/* Light rays */}
                    <svg id="light-ray-1" className={styles.lightRay} viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="50"></circle>
                    </svg>
                    <svg id="light-ray-2" className={styles.lightRay} viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="50"></circle>
                    </svg>
                    <svg id="light-ray-3" className={styles.lightRay} viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="50"></circle>
                    </svg>

                    {/* Clouds */}
                    <svg id="cloud-1" className={styles.cloudDark} viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="50"></circle>
                    </svg>
                    <svg id="cloud-2" className={styles.cloudDark} viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="50"></circle>
                    </svg>
                    <svg id="cloud-3" className={styles.cloudDark} viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="50"></circle>
                    </svg>
                    <svg id="cloud-4" className={styles.cloudLight} viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="50"></circle>
                    </svg>
                    <svg id="cloud-5" className={styles.cloudLight} viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="50"></circle>
                    </svg>
                    <svg id="cloud-6" className={styles.cloudLight} viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="50"></circle>
                    </svg>
                </div>

                {/* Stars */}
                <div className={styles.stars}>
                    <svg id="star-1" className={styles.star} viewBox="0 0 20 20">
                        <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z"></path>
                    </svg>
                    <svg id="star-2" className={styles.star} viewBox="0 0 20 20">
                        <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z"></path>
                    </svg>
                    <svg id="star-3" className={styles.star} viewBox="0 0 20 20">
                        <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z"></path>
                    </svg>
                    <svg id="star-4" className={styles.star} viewBox="0 0 20 20">
                        <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z"></path>
                    </svg>
                </div>
            </div>
        </label>
    );
};

export default ThemeToggle;
