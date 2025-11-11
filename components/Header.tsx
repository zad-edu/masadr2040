import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="text-center bg-gradient-to-br from-teal-600 to-cyan-500 text-white p-8 rounded-2xl shadow-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-300 tracking-wide">نظام حجز مركز مصادر التعلم</h1>
            <p className="text-xl md:text-2xl mt-3 font-medium text-gray-200">بمدرسة أبو عبيدة للتعليم الأساسي</p>
            <p className="text-lg md:text-xl mt-2 text-gray-300">(10 – 12)</p>
        </header>
    );
};

export default Header;