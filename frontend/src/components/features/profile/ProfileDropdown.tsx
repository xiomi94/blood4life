import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import type { UserProfile, UserType } from '../../../types/common.types';

interface ProfileDropdownProps {
    user: UserProfile | null;
    userType: UserType | null;
    onEditProfile: () => void;
    onOpenNotifications?: () => void;
    onLogout: () => void;
    pathname: string;
    unreadCount?: number;
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
    onOpenNotifications,
    onLogout,
    pathname,
    unreadCount = 0
}) => {
    const { t } = useTranslation();
    const isDashboard = pathname.startsWith('/dashboard');

    return (
        <div className="absolute right-0 top-12 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 py-2 z-50 animate-fadeIn">
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    {userType?.toUpperCase()}
                </span>
                <span className="block text-sm font-bold text-gray-800 dark:text-white truncate">
                    {userType === 'hospital' ? (user as any)?.name : user?.email}
                </span>
                <span className="block text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user?.email}
                </span>
            </div>

            <div className="py-2 space-y-1">
                {userType === 'admin' ? (
                    <>
                        <Link
                            to="/dashboard"
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            {t('header.dashboard')}
                        </Link>
                        <button
                            onClick={onEditProfile}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            {t('header.editProfile')}
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

                        <button
                            onClick={onOpenNotifications}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex justify-between items-center"
                        >
                            <span>{t('notifications.menuTitle')}</span>
                            {unreadCount > 0 && (
                                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
                                    {unreadCount}
                                </span>
                            )}
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
