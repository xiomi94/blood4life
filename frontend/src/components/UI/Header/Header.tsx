// components/Header/Header.tsx
import { useLocation, Link } from 'react-router';
import Logo from "../../../assets/images/LogoShadowMini.webp";
import Button from "../Button/Button.tsx"

function Header() {
  const location = useLocation();

  return (
    <div className="flex flex-row h-20 w-full items-center justify-end">
      {(location.pathname === '/register' || location.pathname === '/registerbloodDonor' || location.pathname === '/registerhospital') ? (
        <>
          <div className="flex flex-row w-full justify-between p-3 items-center">
            <Link to="/index">
              <img src={Logo} alt="Logo" className="h-14 w-auto cursor-pointer hover:opacity-80 transition-opacity" />
            </Link>
            <Button to="/index">Inicio</Button>
          </div>
        </>
      ) : (
        <>
          {(location.pathname === '/index' || location.pathname === '/') && (
            <div className="flex items-center space-x-3 pr-4">
              <Button to="/login">
                Iniciar sesión
              </Button>
              <Button to="/register">
                Registrarse
              </Button>
            </div>
          )}
          {(location.pathname === '/login' || location.pathname === '/registerbloodDonor' || location.pathname === '/registerhospital') && (
            <div className="flex items-center space-x-3 pr-4">
              <Button to="/index">
                Inicio
              </Button>
            </div>
          )}
          {(location.pathname === '/dashboard') && (
            <div className="flex flex-row w-full justify-between items-center space-x-3 p-4">
              <Link to="/index">
                <img src={Logo} alt="Logo" className="h-14 w-auto cursor-pointer hover:opacity-80 transition-opacity" />
              </Link>
              <div className="flex items-center gap-4">
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
                {/* User Avatar */}
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full"></div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Header;

