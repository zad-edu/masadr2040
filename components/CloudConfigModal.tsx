import React, { useState } from 'react';

interface CloudConfigModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (binId: string, apiKey: string) => void;
    initialBinId?: string;
    initialApiKey?: string;
}

const CloudConfigModal: React.FC<CloudConfigModalProps> = ({ isOpen, onClose, onSave, initialBinId = '', initialApiKey = '' }) => {
    const [binId, setBinId] = useState(initialBinId);
    const [apiKey, setApiKey] = useState(initialApiKey);

    const handleSave = () => {
        if (binId && apiKey) {
            onSave(binId.trim(), apiKey.trim());
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6 border-b-2 border-teal-100 pb-4">
                    <h2 className="text-2xl font-bold text-gray-800">إعدادات التخزين السحابي</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-3xl">&times;</button>
                </div>
                <div className="space-y-4">
                    <p className="text-gray-600">
                        هذا التطبيق يستخدم خدمة <a href="https://jsonbin.io" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline font-semibold">JSONBin.io</a> لتخزين البيانات سحابياً.
                        للحفظ والمزامنة، تحتاج إلى حساب مجاني.
                    </p>
                    <ol className="list-decimal list-inside bg-gray-50 p-3 rounded-lg text-sm text-gray-700 space-y-1">
                        <li>اذهب إلى <a href="https://jsonbin.io" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline font-semibold">jsonbin.io</a> وأنشئ حساباً مجانياً.</li>
                        <li>من لوحة التحكم، أنشئ "Bin" جديداً فارغاً.</li>
                        <li>انسخ "Bin ID" من عنوان URL الخاص بالـ Bin الجديد.</li>
                        <li>من لوحة التحكم، اذهب إلى صفحة "API Keys" وانسخ مفتاحك السري (X-Master-Key).</li>
                        <li>ألصق القيم أدناه واحفظ.</li>
                    </ol>
                    <div>
                        <label htmlFor="binId" className="block font-bold mb-1">معرّف الحاوية (Bin ID):</label>
                        <input
                            id="binId"
                            type="text"
                            value={binId}
                            onChange={(e) => setBinId(e.target.value)}
                            className="w-full mt-1 p-2 border rounded-md"
                            placeholder="e.g., 66957a6de41b4d34e4171a4f"
                        />
                    </div>
                    <div>
                        <label htmlFor="apiKey" className="block font-bold mb-1">مفتاح الواجهة البرمجية (API Key):</label>
                        <input
                            id="apiKey"
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            className="w-full mt-1 p-2 border rounded-md"
                            placeholder="e.g., $2a$10$..."
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-4 pt-6 mt-6 border-t">
                    <button onClick={onClose} className="py-2 px-6 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300">إغلاق</button>
                    <button onClick={handleSave} className="py-2 px-6 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 disabled:bg-gray-400" disabled={!binId || !apiKey}>
                        حفظ الإعدادات
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CloudConfigModal;
