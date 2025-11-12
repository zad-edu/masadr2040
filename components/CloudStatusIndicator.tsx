import React from 'react';

export type SyncStatus = 'syncing' | 'synced' | 'offline' | 'error';

interface CloudStatusIndicatorProps {
    status: SyncStatus;
}

const CloudStatusIndicator: React.FC<CloudStatusIndicatorProps> = ({ status }) => {
    const statusConfig: Record<SyncStatus, { className: string; title: string }> = {
        syncing: {
            className: 'bg-green-500 animate-pulse',
            title: 'جاري المزامنة...',
        },
        synced: {
            className: 'bg-green-500',
            title: 'متصل ومزامن',
        },
        offline: {
            className: 'bg-red-500',
            title: 'غير متصل بالإنترنت أو خطأ في الشبكة',
        },
        error: {
            className: 'bg-yellow-500',
            title: 'خطأ في الإعدادات! اضغط على أيقونة الترس لإصلاحها.',
        },
    };

    const config = statusConfig[status] || statusConfig.offline;

    return (
        <div className="flex items-center justify-center h-6 w-6" title={config.title}>
            <span className={`h-3 w-3 rounded-full transition-colors duration-300 ${config.className}`}></span>
        </div>
    );
};

export default CloudStatusIndicator;