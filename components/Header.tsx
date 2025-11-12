import React from 'react';
import CloudStatusIndicator, { SyncStatus } from './CloudStatusIndicator';

interface HeaderProps {
    syncStatus: SyncStatus;
    onOpenConfig: () => void;
}

const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.532 1.532 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.532 1.532 0 01-.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>;

const Header: React.FC<HeaderProps> = ({ syncStatus, onOpenConfig }) => {
    return (
        <header 
            className="relative text-center bg-gradient-to-br from-teal-600 to-cyan-500 text-white p-8 rounded-2xl shadow-2xl"
        >
            <div className="absolute top-4 left-4 flex items-center gap-2">
                <CloudStatusIndicator status={syncStatus} />
                <button onClick={onOpenConfig} title="إعدادات السحابة" className="text-white opacity-75 hover:opacity-100 transition-opacity">
                    <SettingsIcon />
                </button>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-300 tracking-wide">نظام حجز مركز مصادر التعلم</h1>
            <p className="text-xl md:text-2xl mt-3 font-medium text-gray-200">بمدرسة أبو عبيدة للتعليم الأساسي</p>
            <p className="text-lg md:text-xl mt-2 text-gray-300">(10 – 12)</p>
        </header>
    );
};

export default Header;