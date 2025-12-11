// components/Header/Header.tsx
import { useLocation, Link } from 'react-router';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../context/AuthContext';
import Logo from "../../../assets/images/LogoShadowMini.webp";
import Button from "../Button/Button.tsx";
import EditProfileModal from "../../EditProfileModal/EditProfileModal.tsx"

function Header() {
  const location = useLocation();
  const { logout, user, isAuthenticated } = useAuth();
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
      className={`flex flex-row w-full items-center justify-end ${isAuthenticated ? 'border-b border-gray-300 px-8 py-4' : 'px-8 py-4'
        }`}
    >
      {isAuthenticated ? (
        <div className="flex flex-row w-full justify-between items-center">
          <Link to="/index">
            <img src={Logo} alt="Logo" className="h-14 w-auto cursor-pointer hover:opacity-80 transition-opacity" />
          </Link>
          <div className="flex flex-row w-full items-center justify-end gap-4">
            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full"></span>
            </button>
            {/* Bell */}
            <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            {/* User Avatar with Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-10 h-10 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 overflow-hidden"
                aria-haspopup="true"
                aria-expanded={isDropdownOpen}
              >
                {user?.imageName ? (
                  <img
                    src={`/images/${user.imageName}`}
                    alt="Profile"
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
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5">
                  {location.pathname === '/index' || location.pathname === '/' ? (
                    <>
                      <Link
                        to="/index" // TODO: Change to /campaigns when available
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Campañas
                      </Link>
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Mi perfil
                      </Link>
                    </>
                  ) : (
                    // Default for Dashboard and other authenticated pages
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        setIsEditModalOpen(true);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Editar mi perfil
                    </button>
                  )}
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      setShowLogoutConfirm(true);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        // Public Header (Login/Register)
        <>
          {(location.pathname === '/register' || location.pathname === '/registerbloodDonor' || location.pathname === '/registerhospital') ? (
            <div className="flex flex-row w-full justify-between items-center">
              <Link to="/index">
                <img src={Logo} alt="Logo" className="h-14 w-auto cursor-pointer hover:opacity-80 transition-opacity" />
              </Link>
              <Button to="/index">Inicio</Button>
            </div>
          ) : (
            <>
              {(location.pathname === '/index' || location.pathname === '/') ? (
                <div className="flex items-center space-x-3">
                  <Button to="/login">
                    Iniciar sesión
                  </Button>
                  <Button to="/register">
                    Registrarse
                  </Button>
                </div>
              ) : (
                // Default fallback for other public pages (like Login)
                <div className="flex items-center space-x-3">
                  <Button to="/index">
                    Inicio
                  </Button>
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
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Cerrar Sesión</h3>
            <p className="text-gray-600 mb-6">¿Estás seguro de que deseas cerrar sesión?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  logout();
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;

