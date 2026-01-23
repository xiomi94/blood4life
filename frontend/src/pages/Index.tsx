import Logo from "../assets/images/LogoShadow.webp";
import HeroImage from "../assets/images/blood_donation_hero.png";
import { useTranslation, Trans } from 'react-i18next';

function Index() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center py-8 sm:py-10 lg:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full p-3 sm:p-6 lg:p-8">

        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          <img
            className="h-16 sm:h-18 md:h-20 w-auto mx-auto mb-3 sm:mb-4"
            src={Logo}
            alt="Blood4Life Logo"
          />
          <h1 className="text-3xl sm:text-4xl lg:text-4xl font-extrabold text-gray-900 dark:text-white">
            {t('index.header.title')}
          </h1>
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">

          {/* Text Content */}
          <div className="space-y-4 sm:space-y-5 lg:space-y-6 text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed text-justify">
            <p className="indent-8">
              {t('index.content.p1')}
            </p>

            <p className="indent-8">
              {t('index.content.p2')}
            </p>

            <p className="indent-8">
              {t('index.content.p3')}
            </p>
          </div>

          {/* Hero Image */}
          <div className="flex justify-center">
            <img
              src={HeroImage}
              alt={t('index.hero.alt')}
              className="w-full max-w-xs sm:max-w-sm md:max-w-md h-auto object-contain rounded-2xl drop-shadow-xl dark:drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] transition-transform duration-500"
            />
          </div>
        </div>

        {/* Footer Slogan */}
        <div className="mt-12 sm:mt-14 lg:mt-16 text-center border-t border-gray-200 dark:border-gray-700 pt-6 sm:pt-7 lg:pt-8">
          <p className="text-xl sm:text-2xl font-semibold text-red-600 dark:text-red-500 italic">
            <Trans i18nKey="index.footerSlogan" />
          </p>
        </div>

      </div>
    </div>
  );
}

export default Index;