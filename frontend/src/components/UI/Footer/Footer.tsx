// components/Footer/Footer.tsx
import { useLocation } from 'react-router';
import ButtonFooter from '../../UI/ButtonFooter/ButtonFooter';
import ThemeToggle from '../ThemeToggle/ThemeToggle';

function Footer() {
  const location = useLocation();

  const isSpecialRoute = location.pathname === '/dashboard';

  return (
    <div className="w-full mx-auto">

      {isSpecialRoute ? (
        <footer role="contentinfo" className="p-4 md:flex md:items-center md:justify-between md:p-6 border-t border-gray-300 dark:border-gray-700" style={{ transition: 'border-color 0.3s ease-in-out' }}>
          <p className="text-sm text-gray-600 dark:text-gray-100 sm:text-center" style={{ transition: 'color 0.3s ease-in-out' }}>
            Blood4Life © 2025. Todos los derechos reservados.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-3 sm:mt-0">
            <ButtonFooter className="text-sm text-gray-600 dark:text-gray-100 hover:underline">
              Sobre nosotros
            </ButtonFooter>
            <ButtonFooter className="text-sm text-gray-600 dark:text-gray-100 hover:underline">
              Política de privacidad
            </ButtonFooter>
            <ThemeToggle />
          </div>
        </footer>
      ) : (
        <footer role="contentinfo" className="p-4 rounded-lg md:flex md:items-center md:justify-between md:p-6">
          <p className="text-sm text-gray-600 dark:text-gray-100 sm:text-center" style={{ transition: 'color 0.3s ease-in-out' }}>
            Blood4Life © 2025. Todos los derechos reservados.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-3 sm:mt-0">
            <ButtonFooter className="text-sm text-gray-600 dark:text-gray-100 hover:underline">
              Sobre nosotros
            </ButtonFooter>
            <ButtonFooter className="text-sm text-gray-600 dark:text-gray-100 hover:underline">
              Política de privacidad
            </ButtonFooter>
            <ThemeToggle />
          </div>
        </footer>
      )}
    </div>
  );
}

export default Footer;
