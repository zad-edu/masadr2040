import React from 'react';
import CloudStatusIndicator, { SyncStatus } from './CloudStatusIndicator';

interface HeaderProps {
    syncStatus: SyncStatus;
    onSettingsClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ syncStatus, onSettingsClick }) => {
    return (
        <header 
            className="relative text-center bg-gradient-to-br from-teal-600 to-cyan-500 text-white p-8 rounded-2xl shadow-2xl"
        >
            <div className="absolute top-4 left-4">
                <CloudStatusIndicator status={syncStatus} />
            </div>
            <div className="absolute top-4 right-4">
                <button 
                    onClick={onSettingsClick} 
                    className="p-2 rounded-full hover:bg-white/20 transition-colors"
                    aria-label="إعدادات التخزين السحابي"
                    title="إعدادات التخزين السحابي"
                >
                    <SettingsIcon />
                </button>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-300 tracking-wide">نظام حجز مركز مصادر التعلم</h1>
            <p className="text-xl md:text-2xl mt-3 font-medium text-gray-200">بمدرسة أبو عبيدة للتعليم الأساسي</p>
            <p className="text-lg md:text-xl mt-2 text-gray-300">(10 – 12)</p>
        </header>
    );
};

const SettingsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

export default Header;