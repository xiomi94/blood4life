import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { Notification } from '../../../services/notificationService';

interface NotificationsModalProps {
    isOpen: boolean;
    onClose: () => void;
    notifications: Notification[];
    onMarkAsRead: (ids: number[]) => Promise<void>;
}

export const NotificationsModal = ({ isOpen, onClose, notifications, onMarkAsRead }: NotificationsModalProps) => {
    const { t } = useTranslation();
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [isMarking, setIsMarking] = useState(false);
    const [viewingNotification, setViewingNotification] = useState<Notification | null>(null);

    // Reset selection when modal opens or notifications change
    useEffect(() => {
        if (isOpen) {
            setSelectedIds([]);
            setViewingNotification(null);
        }
    }, [isOpen, notifications]);

    // Lock body scroll logic
    useEffect(() => {
        if (isOpen) {
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            document.body.style.overflow = 'hidden';

            return () => {
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.width = '';
                document.body.style.overflow = '';
                window.scrollTo(0, scrollY);
            };
        }
    }, [isOpen]);

    const toggleSelection = (id: number) => {
        setSelectedIds(prev =>
            prev.includes(id)
                ? prev.filter(selectedId => selectedId !== id)
                : [...prev, id]
        );
    };

    const handleCheckboxClick = (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        toggleSelection(id);
    };

    const handleMarkSelectedAsRead = async () => {
        if (selectedIds.length === 0) return;

        try {
            setIsMarking(true);
            await onMarkAsRead(selectedIds);
            setSelectedIds([]);
        } catch (error) {
            console.error('Error marking notifications as read', error);
        } finally {
            setIsMarking(false);
        }
    };

    // Helper to parse message
    const getMessageParts = (msg: string) => {
        const parts = msg.split('|');
        if (parts.length > 1) {
            return { title: parts[0], detail: parts[1] };
        }
        return { title: msg, detail: msg };
    };

    // Helper to parse message
    const renderDetailContent = (detailString: string) => {
        try {
            const data = JSON.parse(detailString);
            if (data.nombre && data.dni) {
                return (
                    <div className="w-full bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-start">

                        {/* Header: Avatar + Nombre */}
                        <div className="flex items-center gap-4 mb-5">
                            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                {data.nombre}
                            </h3>
                        </div>

                        {/* DNI */}
                        <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 mb-5 pl-1">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0c0 .884-.5 2-2 2h4c-1.5 0-2-1.116-2-2z" />
                            </svg>
                            <span className="text-base text-gray-600 dark:text-gray-300">DNI: <span className="font-bold text-gray-900 dark:text-white uppercase">{data.dni}</span></span>
                        </div>

                        {/* Tipo Sangre Badge - Rosa/Rojo como en la imagen */}
                        <div className="inline-flex items-center gap-2 px-6 py-2 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full border border-red-100 dark:border-red-800/30 shadow-sm">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                            <span className="font-bold text-lg">{data.tipoSangre}</span>
                        </div>
                    </div>
                );
            }
        } catch (e) {
            console.error("Error rendering notification detail", e);
        }

        return (
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                <p>{detailString}</p>
            </div>
        );
    };

    if (!isOpen) return null;

    const displayedNotifications = notifications.filter(n => !n.read);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Main Modal */}
            <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-lg w-full mx-4 max-h-[80vh] flex flex-col z-50">
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                        {t('notifications.title')}
                    </h2>

                    <div className="flex items-center gap-3">
                        {/* Mark Read Button */}
                        {selectedIds.length > 0 && (
                            <button
                                onClick={handleMarkSelectedAsRead}
                                disabled={isMarking}
                                className="text-sm px-3 py-1.5 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors font-medium"
                            >
                                {isMarking ? '...' : (t('notifications.markAllRead') || 'Marcar leídas')}
                            </button>
                        )}

                        <button
                            onClick={onClose}
                            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="p-0 overflow-y-auto flex-1 min-h-[200px]">
                    {displayedNotifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full p-8 text-center text-gray-500 dark:text-gray-400">
                            <svg className="w-12 h-12 mb-3 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            <p>{t('notifications.empty')}</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100 dark:divide-gray-700">
                            {displayedNotifications.map((notification) => {
                                const { title } = getMessageParts(notification.message);
                                return (
                                    <div
                                        key={notification.id}
                                        className={`flex items-start justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors cursor-pointer ${selectedIds.includes(notification.id) ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                                        onClick={() => setViewingNotification(notification)}
                                    >
                                        <div className="flex-1 pr-4">
                                            <p className="text-gray-800 dark:text-gray-200 text-sm font-medium leading-relaxed">
                                                {title}
                                            </p>
                                            <span className="text-xs text-gray-400 dark:text-gray-500 mt-1 block">
                                                {notification.dateNotification}
                                            </span>
                                        </div>

                                        {/* Checkbox Area */}
                                        <div
                                            className="flex-shrink-0 pt-0.5 pl-2"
                                            onClick={(e) => handleCheckboxClick(e, notification.id)}
                                        >
                                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedIds.includes(notification.id)
                                                ? 'bg-blue-600 border-blue-600'
                                                : 'border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-800 hover:border-blue-400'
                                                }`}>
                                                {selectedIds.includes(notification.id) && (
                                                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 text-right rounded-b-xl">
                    <span className="text-xs text-gray-400">
                        {displayedNotifications.length} {t('notifications.new')}
                    </span>
                </div>
            </div>

            {/* Detail Modal Overlay */}
            {viewingNotification && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => setViewingNotification(null)}
                    ></div>
                    <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-sm w-full p-6 animate-in fade-in zoom-in duration-200 z-10 transition-all">
                        <div className="flex justify-end mb-2">
                            <button
                                onClick={() => setViewingNotification(null)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {renderDetailContent(getMessageParts(viewingNotification.message).detail)}

                        <div className="flex justify-center pt-6">
                            <button
                                onClick={() => setViewingNotification(null)}
                                className="w-full py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition font-medium"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
