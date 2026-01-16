import { useNavigate } from 'react-router';
import Logo from '../../assets/images/LogoShadow.webp';
import { useTranslation } from 'react-i18next';

const AboutUsPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">

        {/* Header Section */}
        <div className="text-center">
          <img
            className="mx-auto h-24 w-auto mb-4"
            src={Logo}
            alt="Blood4Life Logo"
          />
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
            {t('aboutUs.title')}
          </h1>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
            {t('aboutUs.subtitle')}
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-12 mt-12">
          {/* Mission */}
          <section>
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-500 mb-4 border-b border-red-100 pb-2">
              {t('aboutUs.mission.title')}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
              {t('aboutUs.mission.text')}
            </p>
          </section>

          {/* Vision */}
          <section>
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-500 mb-4 border-b border-red-100 pb-2">
              {t('aboutUs.vision.title')}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
              {t('aboutUs.vision.text')}
            </p>
          </section>

          {/* Values */}
          <section>
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-500 mb-4 border-b border-red-100 pb-2">
              {t('aboutUs.values.title')}
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-red-50 dark:bg-gray-700 p-6 rounded-lg text-center">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{t('aboutUs.values.solidarity.title')}</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('aboutUs.values.solidarity.text')}
                </p>
              </div>
              <div className="bg-red-50 dark:bg-gray-700 p-6 rounded-lg text-center">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{t('aboutUs.values.transparency.title')}</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('aboutUs.values.transparency.text')}
                </p>
              </div>
              <div className="bg-red-50 dark:bg-gray-700 p-6 rounded-lg text-center">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{t('aboutUs.values.innovation.title')}</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('aboutUs.values.innovation.text')}
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Back Button */}
        <div className="mt-12 flex justify-center">
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            {t('aboutUs.backButton')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
