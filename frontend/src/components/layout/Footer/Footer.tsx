// components/Footer/Footer.tsx
import { useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import ButtonFooter from '../../common/ui/ButtonFooter/ButtonFooter';

function Footer() {
  const location = useLocation();
  const { t } = useTranslation();

  const isSpecialRoute = location.pathname === '/dashboard';

  return (
    <div className="w-full mx-auto">

      {isSpecialRoute ? (
        <footer role="contentinfo" className="p-4 md:flex md:items-center md:justify-between md:p-6 border-t border-gray-300 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-100 sm:text-center">
            {t('footer.copyright')}
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-3 sm:mt-0">
            <ButtonFooter to="/about-us" className="text-sm text-gray-600 dark:text-gray-100 hover:underline">
              {t('footer.aboutUs')}
            </ButtonFooter>
            <ButtonFooter to="/privacy-policy" className="text-sm text-gray-600 dark:text-gray-100 hover:underline">
              {t('footer.privacyPolicy')}
            </ButtonFooter>
          </div>
        </footer>
      ) : (
        <footer role="contentinfo" className="p-4 rounded-lg md:flex md:items-center md:justify-between md:p-6">
          <p className="text-sm text-gray-600 dark:text-gray-100 sm:text-center">
            {t('footer.copyright')}
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-3 sm:mt-0">
            <ButtonFooter to="/about-us" className="text-sm text-gray-600 dark:text-gray-100 hover:underline">
              {t('footer.aboutUs')}
            </ButtonFooter>
            <ButtonFooter to="/privacy-policy" className="text-sm text-gray-600 dark:text-gray-100 hover:underline">
              {t('footer.privacyPolicy')}
            </ButtonFooter>
          </div>
        </footer>
      )}
    </div>
  );
}

export default Footer;
