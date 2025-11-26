// components/Header/Header.tsx
import { useLocation, Link } from 'react-router-dom';
import Logo from "../../../assets/images/LogoShadowMini.webp";
import Button from "../Button/Button.tsx"

function Header() {
  const location = useLocation();

  return (
    <div className="flex flex-row h-20 w-full bg-red-200 items-center justify-between">
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
          <div></div>
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
        </>
      )}
    </div>
  );
}

export default Header;