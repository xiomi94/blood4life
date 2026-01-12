import React from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import type { UserProfile } from '../../../context/AuthContext';

interface ProfileDropdownProps {
    user: UserProfile | null;
    userType: 'bloodDonor' | 'hospital' | 'admin' | null;
    onEditProfile: () => void;
    onLogout: () => void;
    pathname: string;
}

/**
 * Reusable Profile Dropdown Component
 * - Shared between all user types
 * - Tailored content based on userType and current path
 * - Text-only version (no emojis/icons as requested)
 */
export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
    user,
    userType,
    onEditProfile,
    onLogout,
    pathname
}) => {
    const { t } = useTranslation();
    const isDashboard = pathname.startsWith('/dashboard');

    return (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl py-1 z-50 ring-1 ring-black ring-opacity-5 border border-gray-100 dark:border-gray-700">
            {/* User Info Header */}
            <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700 mb-1">
                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">
                    {userType === 'admin' ? t('auth.login.admin') : userType === 'hospital' ? t('auth.login.hospital') : t('auth.login.donor')}
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-200 truncate">
                    {userType === 'bloodDonor'
                        ? `${user?.firstName} ${user?.lastName}`
                        : userType === 'hospital'
                            ? user?.name
                            : user?.email}
                </p>
                {userType !== 'admin' && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user?.email}
                    </p>
                )}
            </div>

            {/* Menu Items */}
            <div className="py-1">
                {userType === 'admin' ? (
                    <>
                        <button
                            onClick={onEditProfile}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            {t('header.myProfile')}
                        </button>
                    </>
                ) : (
                    <>
                        {!isDashboard && (
                            <Link
                                to="/dashboard"
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                {t('header.myProfile')}
                            </Link>
                        )}

                        <button
                            onClick={onEditProfile}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            {t('header.editProfile')}
                        </button>
                    </>
                )}

                <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>

                <button
                    onClick={onLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                >
                    {t('header.logout')}
                </button>
            </div>
        </div>
    );
};
