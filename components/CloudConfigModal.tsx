import React, { useState } from 'react';

interface CloudConfigModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (binId: string) => void;
    initialBinId?: string;
}

const CloudConfigModal: React.FC<CloudConfigModalProps> = ({ isOpen, onClose, onSave, initialBinId = '' }) => {
    const [binId, setBinId] = useState(initialBinId);

    const handleSave = () => {
        if (binId) {
            onSave(binId.trim());
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
                        هذا التطبيق يستخدم خدمة <a href="https://www.npoint.io/" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline font-semibold">npoint.io</a> لتخزين البيانات سحابياً مجاناً وبدون الحاجة لحساب.
                    </p>
                    <ol className="list-decimal list-inside bg-gray-50 p-3 rounded-lg text-sm text-gray-700 space-y-1">
                        <li>اذهب إلى <a href="https://www.npoint.io/" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline font-semibold">www.npoint.io</a>.</li>
                        <li>في محرر النصوص، ألصق `[]` (قوسان مربعان فارغان).</li>
                        <li>اضغط على زر "Save" الأخضر.</li>
                        <li>سيتم إنشاء رابط لك، مثال: `https://api.npoint.io/a1b2c3d4e5`.</li>
                        <li>انسخ المعرّف فقط (الجزء الأخير من الرابط، مثل `a1b2c3d4e5`).</li>
                        <li>ألصق المعرّف في الحقل أدناه.</li>
                    </ol>
                    <div>
                        <label htmlFor="binId" className="block font-bold mb-1">معرّف npoint ID:</label>
                        <input
                            id="binId"
                            type="text"
                            value={binId}
                            onChange={(e) => setBinId(e.target.value)}
                            className="w-full mt-1 p-2 border rounded-md"
                            placeholder="e.g., a1b2c3d4e5f6a1b2c3d4e5f6"
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-4 pt-6 mt-6 border-t">
                    <button onClick={onClose} className="py-2 px-6 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300">إغلاق</button>
                    <button onClick={handleSave} className="py-2 px-6 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 disabled:bg-gray-400" disabled={!binId}>
                        حفظ الإعدادات
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CloudConfigModal;