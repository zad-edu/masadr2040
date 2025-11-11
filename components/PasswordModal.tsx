
import React, { useState } from 'react';

interface PasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    correctPassword?: string;
}

const PasswordModal: React.FC<PasswordModalProps> = ({ isOpen, onClose, onSuccess, correctPassword = "2410" }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === correctPassword) {
            onSuccess();
            setPassword('');
            setError('');
        } else {
            setError('كلمة المرور غير صحيحة.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-center mb-6">إدخال كلمة المرور</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setError('');
                        }}
                        className="w-full p-3 border rounded-lg text-center text-xl tracking-widest"
                        autoFocus
                    />
                    {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
                    <div className="flex justify-center gap-4 mt-6">
                        <button type="button" onClick={onClose} className="py-2 px-6 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300">إلغاء</button>
                        <button type="submit" className="py-2 px-6 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700">دخول</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PasswordModal;
