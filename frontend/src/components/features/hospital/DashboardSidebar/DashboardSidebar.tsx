import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../../context/AuthContext';
import { NewsModal } from '../../../modals/NewsModal';

interface DashboardSidebarProps {
    onCreateCampaign: () => void;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ onCreateCampaign }) => {
    const { t } = useTranslation();
    const { logout } = useAuth();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden fixed top-[77px] left-4 z-40 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
                aria-label="Open menu"
            >
                <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={closeMobileMenu}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                w-80 border-r border-gray-200 dark:border-gray-700 
                bg-gradient-to-b from-white via-gray-50 to-gray-100 
                dark:from-gray-900 dark:via-gray-900 dark:to-gray-950
                flex flex-col py-4 min-h-full relative shadow-xl
                lg:relative
                fixed top-0 left-0 h-full z-50
                transform transition-transform duration-300 ease-in-out
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                {/* Mobile Close Button */}
                <button
                    onClick={closeMobileMenu}
                    className="lg:hidden absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    aria-label="Close menu"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Action Button - Nueva Campaña */}
                <div className="px-4 mb-6 mt-12 lg:mt-0">
                    <button
                        onClick={() => {
                            onCreateCampaign();
                            closeMobileMenu();
                        }}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 
                        dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-500 dark:hover:to-blue-600
                        text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 
                        shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        {t('dashboard.sidebar.newCampaign')}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 flex flex-col">
                    <div className="space-y-1">
                        {/* Inicio */}
                        <a
                            href="/index"
                            onClick={closeMobileMenu}
                            className="group flex items-center gap-3 px-3 py-3 text-gray-700 dark:text-gray-300 
                            hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100/50 
                            dark:hover:from-blue-900/30 dark:hover:to-blue-800/20 
                            rounded-xl transition-all duration-200 hover:shadow-md"
                        >
                            <div className="w-9 h-9 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center 
                            group-hover:bg-blue-500 group-hover:text-white transition-all duration-200 group-hover:scale-110">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                    />
                                </svg>
                            </div>
                            <span className="font-medium group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                                {t('dashboard.sidebar.home')}
                            </span>
                        </a>

                        {/* Mis Campañas */}
                        <a
                            href="#"
                            onClick={closeMobileMenu}
                            className="group flex items-center gap-3 px-3 py-3 text-gray-700 dark:text-gray-300 
                            hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-100/50 
                            dark:hover:from-red-900/30 dark:hover:to-pink-800/20 
                            rounded-xl transition-all duration-200 hover:shadow-md"
                        >
                            <div className="w-9 h-9 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center 
                            group-hover:bg-red-500 group-hover:text-white transition-all duration-200 group-hover:scale-110">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                </svg>
                            </div>
                            <span className="font-medium group-hover:text-red-700 dark:group-hover:text-red-400 transition-colors">
                                {t('dashboard.sidebar.myCampaigns')}
                            </span>
                        </a>

                        {/* Noticias */}
                        <button
                            onClick={() => {
                                setIsNewsModalOpen(true);
                                closeMobileMenu();
                            }}
                            className="group flex items-center gap-3 px-3 py-3 text-gray-700 dark:text-gray-300 
                            hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100/50 
                            dark:hover:from-purple-900/30 dark:hover:to-purple-800/20 
                            rounded-xl transition-all duration-200 relative w-full text-left hover:shadow-md"
                        >
                            <div className="w-9 h-9 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center 
                            group-hover:bg-purple-500 group-hover:text-white transition-all duration-200 group-hover:scale-110">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                    />
                                </svg>
                            </div>
                            <span className="font-medium group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors">
                                {t('dashboard.sidebar.news')}
                            </span>
                            <span className="absolute right-3 top-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-lg animate-pulse">
                                {t('dashboard.sidebar.newBadge')}
                            </span>
                        </button>
                    </div>

                    {/* Separador visual */}
                    <div className="my-4 border-t border-gray-300 dark:border-gray-700"></div>

                    {/* Logout Button */}
                    <button
                        onClick={() => {
                            setShowLogoutConfirm(true);
                            closeMobileMenu();
                        }}
                        className="group flex items-center gap-3 px-3 py-3 text-red-600 dark:text-red-400 
                        hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100/50 
                        dark:hover:from-red-900/30 dark:hover:to-red-800/20 
                        rounded-xl transition-all duration-200 hover:shadow-md"
                    >
                        <div className="w-9 h-9 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center 
                        group-hover:bg-red-500 group-hover:text-white transition-all duration-200 group-hover:scale-110">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </div>
                        <span className="font-medium group-hover:text-red-700 dark:group-hover:text-red-300 transition-colors">
                            {t('header.logout')}
                        </span>
                    </button>
                </nav>

                {/* Logout Confirmation Modal - Duplicated for Sidebar context */}
                {showLogoutConfirm && (
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">{t('header.logout')}</h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-6">{t('header.logoutConfirm')}</p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setShowLogoutConfirm(false)}
                                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                    {t('header.cancel')}
                                </button>
                                <button
                                    onClick={() => {
                                        setShowLogoutConfirm(false);
                                        logout();
                                    }}
                                    className="px-4 py-2 bg-[#E7000B] hover:bg-[#c40009] text-white rounded-lg"
                                >
                                    {t('header.logout')}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* News Modal */}
                <NewsModal isOpen={isNewsModalOpen} onClose={() => setIsNewsModalOpen(false)} />
            </aside>
        </>
    );
};

export default DashboardSidebar;
