import { useLocation, Link } from 'react-router';
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/AuthContext';
import { useNotifications } from '../../../hooks/useNotifications';
import Logo from "../../../assets/images/LogoShadowMini.webp";
import Button from "../../common/ui/Button/Button.tsx";
import EditProfileModal from "../../features/profile/EditProfileModal/EditProfileModal.tsx";
import { NotificationsModal } from '../../features/notifications/NotificationsModal';
import { ProfileDropdown } from '../../features/profile/ProfileDropdown';
import ThemeToggle from '../../common/ui/ThemeToggle/ThemeToggle';
import LanguageSwitcher from '../../common/ui/LanguageSwitcher/LanguageSwitcher';

function Header() {
  const { t } = useTranslation();
  const location = useLocation();
  const { logout, user, isAuthenticated, userType } = useAuth();
  const { unreadCount, notifications, markMultipleAsRead } = useNotifications();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
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
      className={`flex flex-row w-full items-center justify-end ${isAuthenticated ? 'px-4 sm:px-6 lg:px-8 py-3 sm:py-4 relative' : 'px-4 sm:px-6 lg:px-8 py-3 sm:py-4'}`}
    >
      {isAuthenticated ? (
        <>
          <div className="flex flex-row w-full justify-between items-center">
            <Link to="/index" aria-label="Ir a la página principal">
              <img src={Logo} alt="Blood4Life - Plataforma de donación de sangre" className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 rounded-full aspect-square object-contain p-1 cursor-pointer hover:opacity-80 transition-opacity" />
            </Link>
            <div className="flex flex-row w-full items-center justify-end gap-2 sm:gap-3 md:gap-4 h-10 sm:h-12 md:h-14">
              {/* Theme and Language Controls */}
              <ThemeToggle />
              <LanguageSwitcher />

              {/* User Avatar with Dropdown - Moved to Extreme Right */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 overflow-hidden relative"
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

                {/* Notification Badge on Avatar */}
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center px-1 h-4 min-w-[1rem] bg-red-500 text-white text-[10px] font-bold rounded-full ring-2 ring-white dark:ring-gray-900 pointer-events-none z-10">
                    {unreadCount}
                  </span>
                )}

                {isDropdownOpen && (
                  <ProfileDropdown
                    user={user}
                    userType={userType}
                    pathname={location.pathname}
                    unreadCount={unreadCount}
                    onEditProfile={() => {
                      setIsDropdownOpen(false);
                      setIsEditModalOpen(true);
                    }}
                    onOpenNotifications={() => {
                      setIsDropdownOpen(false);
                      setIsNotificationsModalOpen(true);
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
                <img src={Logo} alt="Logo" className="h-10 sm:h-12 md:h-14 w-auto cursor-pointer hover:opacity-80 transition-opacity" />
              </Link>
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4 h-10 sm:h-12 md:h-14">
                <Button to="/index">{t('header.home')}</Button>
                <ThemeToggle />
                <LanguageSwitcher />
              </div>
            </div>
          ) : (
            <>
              {(location.pathname === '/index' || location.pathname === '/') ? (
                <div className="flex items-center gap-2 sm:gap-3 md:gap-4 h-10 sm:h-12 md:h-14">
                  <Button to="/login" className="!px-2 !py-2 !text-xs sm:!px-4 sm:!py-2.5 sm:!text-sm whitespace-nowrap" aria-label={t('header.login')}>
                    <span className="sm:hidden">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                    </span>
                    <span className="hidden sm:inline">{t('header.login')}</span>
                  </Button>
                  <Button to="/register" className="!px-2 !py-2 !text-xs sm:!px-4 sm:!py-2.5 sm:!text-sm whitespace-nowrap" aria-label={t('header.register')}>
                    <span className="sm:hidden">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                      </svg>
                    </span>
                    <span className="hidden sm:inline">{t('header.register')}</span>
                  </Button>
                  <ThemeToggle />
                  <LanguageSwitcher />
                </div>
              ) : (
                // Default fallback for other public pages (like Login)
                <div className="flex items-center gap-2 sm:gap-3 md:gap-4 h-10 sm:h-12 md:h-14">
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

      {/* Notifications Modal */}
      <NotificationsModal
        isOpen={isNotificationsModalOpen}
        onClose={() => setIsNotificationsModalOpen(false)}
        notifications={notifications}
        onMarkAsRead={markMultipleAsRead}
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


