import { useNavigate } from 'react-router';
import Logo from '../../assets/images/LogoShadow.webp';
import { useTranslation } from 'react-i18next';

const PrivacyPolicyPage = () => {
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
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            {t('privacyPolicy.title')}
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {t('privacyPolicy.lastUpdate')}
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8 mt-8 text-gray-700 dark:text-gray-300 text-base leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{t('privacyPolicy.sections.intro.title')}</h2>
            <p>
              {t('privacyPolicy.sections.intro.text')}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{t('privacyPolicy.sections.responsible.title')}</h2>
            <p>
              {t('privacyPolicy.sections.responsible.text')}<br />
              <strong>{t('privacyPolicy.sections.responsible.company')}</strong><br />
              {t('privacyPolicy.sections.responsible.address')}<br />
              {t('privacyPolicy.sections.responsible.email')}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{t('privacyPolicy.sections.dataCollected.title')}</h2>
            <p>
              {t('privacyPolicy.sections.dataCollected.text')}<br />
              <ul className="list-disc list-inside ml-4 mt-2 mb-2">
                <li>{t('privacyPolicy.sections.dataCollected.list.id')}</li>
                <li>{t('privacyPolicy.sections.dataCollected.list.contact')}</li>
                <li>{t('privacyPolicy.sections.dataCollected.list.health')}</li>
                <li>{t('privacyPolicy.sections.dataCollected.list.session')}</li>
              </ul>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{t('privacyPolicy.sections.purpose.title')}</h2>
            <p>
              {t('privacyPolicy.sections.purpose.text')}
              <ul className="list-disc list-inside ml-4 mt-2">
                <li>{t('privacyPolicy.sections.purpose.list.users')}</li>
                <li>{t('privacyPolicy.sections.purpose.list.appointments')}</li>
                <li>{t('privacyPolicy.sections.purpose.list.comms')}</li>
                <li>{t('privacyPolicy.sections.purpose.list.legal')}</li>
              </ul>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{t('privacyPolicy.sections.legalBasis.title')}</h2>
            <p>
              {t('privacyPolicy.sections.legalBasis.text')}
              <ul className="list-disc list-inside ml-4 mt-2">
                <li>{t('privacyPolicy.sections.legalBasis.list.consent')}</li>
                <li>{t('privacyPolicy.sections.legalBasis.list.publicInterest')}</li>
                <li>{t('privacyPolicy.sections.legalBasis.list.legal')}</li>
              </ul>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{t('privacyPolicy.sections.recipients.title')}</h2>
            <p>
              {t('privacyPolicy.sections.recipients.text')}
              <ul className="list-disc list-inside ml-4 mt-2">
                <li>{t('privacyPolicy.sections.recipients.list.hospitals')}</li>
                <li>{t('privacyPolicy.sections.recipients.list.authorities')}</li>
                <li>{t('privacyPolicy.sections.recipients.list.tech')}</li>
              </ul>
              {t('privacyPolicy.sections.recipients.noSale')}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{t('privacyPolicy.sections.retention.title')}</h2>
            <p>
              {t('privacyPolicy.sections.retention.text')}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{t('privacyPolicy.sections.rights.title')}</h2>
            <p>
              {t('privacyPolicy.sections.rights.text')}
              <ul className="list-disc list-inside ml-4 mt-2">
                <li>{t('privacyPolicy.sections.rights.list.access')}</li>
                <li>{t('privacyPolicy.sections.rights.list.rectification')}</li>
                <li>{t('privacyPolicy.sections.rights.list.deletion')}</li>
                <li>{t('privacyPolicy.sections.rights.list.limitation')}</li>
                <li>{t('privacyPolicy.sections.rights.list.portability')}</li>
                <li>{t('privacyPolicy.sections.rights.list.opposition')}</li>
              </ul>
              {t('privacyPolicy.sections.rights.contact')}
            </p>
          </section>
        </div>

        {/* Back Button */}
        <div className="mt-12 flex justify-center">
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            {t('privacyPolicy.backButton')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
