// components/Header/Header.tsx
import { useLocation, Link } from 'react-router';
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/AuthContext';
import Logo from "../../../assets/images/LogoShadowMini.webp";
import Button from "../../common/ui/Button/Button.tsx";
import EditProfileModal from "../../features/profile/EditProfileModal/EditProfileModal.tsx";
import { ProfileDropdown } from '../../features/profile/ProfileDropdown';
import ThemeToggle from '../../common/ui/ThemeToggle/ThemeToggle';
import LanguageSwitcher from '../../common/ui/LanguageSwitcher/LanguageSwitcher';

function Header() {
  const { t } = useTranslation();
  const location = useLocation();
  const { logout, user, isAuthenticated, userType } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div
      className={`flex flex-row w-full items-center justify-end ${isAuthenticated ? 'px-8 py-4 relative' : 'px-8 py-4'}`}
    >
      {isAuthenticated ? (
        <>
          <div className="flex flex-row w-full justify-between items-center">
            <Link to="/index" aria-label="Ir a la página principal">
              <img src={Logo} alt="Blood4Life - Plataforma de donación de sangre" className="h-14 w-auto cursor-pointer hover:opacity-80 transition-opacity" />
            </Link>
            <div className="flex flex-row w-full items-center justify-end gap-4">
              {/* Theme and Language Controls */}
              <ThemeToggle />
              <LanguageSwitcher />

              {/* User Avatar with Dropdown - Moved to Extreme Right */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-10 h-10 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 overflow-hidden"
                  aria-label={t('header.userMenu')}
                  aria-haspopup="true"
                  aria-expanded={isDropdownOpen}
                >
                  {user?.imageName ? (
                    <img
                      src={`/images/${user.imageName}`}
                      alt="Foto de perfil del usuario"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback if image fails to load
                        (e.target as HTMLImageElement).style.display = 'none';
                        (e.target as HTMLImageElement).parentElement!.classList.add('bg-gradient-to-br', 'from-blue-500', 'to-purple-600');
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600"></div>
                  )}
                </button>

                {isDropdownOpen && (
                  <ProfileDropdown
                    user={user}
                    userType={userType}
                    pathname={location.pathname}
                    onEditProfile={() => {
                      setIsDropdownOpen(false);
                      setIsEditModalOpen(true);
                    }}
                    onLogout={() => {
                      setIsDropdownOpen(false);
                      setShowLogoutConfirm(true);
                    }}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-300 dark:bg-gray-700"></div>
        </>
      ) : (
        // Public Header (Login/Register)
        <>
          {(location.pathname === '/register' || location.pathname === '/registerbloodDonor' || location.pathname === '/registerhospital') ? (
            <div className="flex flex-row w-full justify-between items-center">
              <Link to="/index">
                <img src={Logo} alt="Logo" className="h-14 w-auto cursor-pointer hover:opacity-80 transition-opacity" />
              </Link>
              <div className="flex items-center gap-4">
                <Button to="/index">{t('header.home')}</Button>
                <ThemeToggle />
                <LanguageSwitcher />
              </div>
            </div>
          ) : (
            <>
              {(location.pathname === '/index' || location.pathname === '/') ? (
                <div className="flex items-center gap-4 h-14">
                  <Button to="/login">
                    {t('header.login')}
                  </Button>
                  <Button to="/register">
                    {t('header.register')}
                  </Button>
                  <ThemeToggle />
                  <LanguageSwitcher />
                </div>
              ) : (
                // Default fallback for other public pages (like Login)
                <div className="flex items-center gap-4 h-14">
                  <Button to="/index">
                    {t('header.home')}
                  </Button>
                  <ThemeToggle />
                  <LanguageSwitcher />
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">{t('header.logout')}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{t('header.logoutConfirm')}</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {t('header.cancel')}
              </button>
              <button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  logout();
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                {t('header.logout')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;

