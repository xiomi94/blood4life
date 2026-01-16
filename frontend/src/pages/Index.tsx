import Logo from "../assets/images/LogoShadow.webp";
import HeroImage from "../assets/images/blood_donation_hero.png";
import { useTranslation, Trans } from 'react-i18next';

function Index() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full p-4 sm:p-8">

        {/* Header Section */}
        <div className="text-center mb-12">
          <img
            className="h-20 w-auto mx-auto mb-4"
            src={Logo}
            alt="Blood4Life Logo"
          />
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
            {t('index.header.title')}
          </h1>
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* Text Content */}
          <div className="space-y-6 text-lg text-gray-700 dark:text-gray-300 leading-relaxed text-justify">
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
              className="w-full max-w-md h-auto object-contain rounded-2xl drop-shadow-xl dark:drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] transition-transform duration-500"
            />
          </div>
        </div>

        {/* Footer Slogan */}
        <div className="mt-16 text-center border-t border-gray-200 dark:border-gray-700 pt-8">
          <p className="text-2xl font-semibold text-red-600 dark:text-red-500 italic">
            <Trans i18nKey="index.footerSlogan" />
          </p>
        </div>

      </div>
    </div>
  );
}

export default Index;