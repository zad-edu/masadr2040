import React, { useMemo, useRef } from 'react';
import { Booking } from '../types';

// Add type declarations for global libraries
declare global {
    interface Window {
        jspdf: any;
        html2canvas: any;
    }
}

const DownloadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 9.707a1 1 0 011.414 0L9 11.086V3a1 1 0 112 0v8.086l1.293-1.379a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>;

interface StatsModalProps {
    isOpen: boolean;
    onClose: () => void;
    bookings: Booking[];
    teachers: string[];
    subjects: string[];
}

const BarChart = ({ title, data, colorClass }: { title: string, data: [string, number][], colorClass: string }) => {
    const topItems = data.slice(0, 5); // Show top 5
    const maxCount = topItems.length > 0 ? topItems[0][1] : 0;

    if (topItems.length === 0) {
        return (
             <div className="bg-gray-50 p-4 rounded-lg h-full flex flex-col justify-center">
                <h3 className="text-lg font-bold text-gray-800 text-center">{title}</h3>
                <p className="text-center text-gray-500 mt-4">لا توجد بيانات لعرضها</p>
            </div>
        )
    }

    return (
        <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">{title}</h3>
            <div className="space-y-4">
                {topItems.map(([label, count]) => {
                    const barWidth = maxCount > 0 ? (count / maxCount) * 100 : 0;
                    return (
                        <div key={label}>
                            <div className="flex justify-between items-center mb-1 text-sm">
                                <div className="font-semibold text-gray-700 truncate pr-2">
                                   <span>{label}</span>
                                </div>
                                <span className="font-bold text-gray-600">{count} حصص</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-4">
                                <div
                                    className={`${colorClass} h-4 rounded-full transition-all duration-500 ease-out`}
                                    style={{ width: `${barWidth}%` }}
                                ></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

const StatsModal: React.FC<StatsModalProps> = ({ isOpen, onClose, bookings }) => {
    const contentRef = useRef<HTMLDivElement>(null);

    const handleDownloadPdf = async () => {
        const { jsPDF } = window.jspdf;
        const content = contentRef.current;
        const modalBody = content?.parentElement as HTMLElement | null;
        const innerScrollable = content?.querySelector<HTMLElement>('.overflow-y-auto.max-h-64');

        if (!content || !modalBody) return;

        // Store original styles
        const originalContentOverflow = content.style.overflowY;
        const originalModalBodyMaxHeight = modalBody.style.maxHeight;
        const originalInnerOverflow = innerScrollable ? innerScrollable.style.overflowY : '';
        const originalInnerMaxHeight = innerScrollable ? innerScrollable.style.maxHeight : '';
        
        try {
            // Temporarily change styles to capture full content
            content.style.overflowY = 'visible';
            modalBody.style.maxHeight = 'none';
            if (innerScrollable) {
                innerScrollable.style.overflowY = 'visible';
                innerScrollable.style.maxHeight = 'none';
            }

            const canvas = await window.html2canvas(content, { scale: 2, useCORS: true });
            
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'pt',
                format: [canvas.width, canvas.height]
            });
            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save('statistics.pdf');
        } catch (error) {
            console.error("Error generating PDF:", error);
        } finally {
            // Restore original styles
            content.style.overflowY = originalContentOverflow;
            modalBody.style.maxHeight = originalModalBodyMaxHeight;
            if (innerScrollable) {
                innerScrollable.style.overflowY = originalInnerOverflow;
                innerScrollable.style.maxHeight = originalInnerMaxHeight;
            }
        }
    };

    const subjectStats = useMemo(() => {
        const counts = new Map<string, number>();
        bookings.forEach(booking => {
            counts.set(booking.subject, (counts.get(booking.subject) || 0) + 1);
        });
        return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
    }, [bookings]);
    
    const teacherStats = useMemo(() => {
         const counts = new Map<string, number>();
        bookings.forEach(booking => {
            counts.set(booking.teacher, (counts.get(booking.teacher) || 0) + 1);
        });
        return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
    }, [bookings]);
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-5xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                 <div className="flex justify-between items-center mb-6 border-b-2 border-teal-100 pb-4">
                    <h2 className="text-2xl font-bold text-gray-800">إحصائيات عامة</h2>
                    <div className="flex items-center gap-2 no-print">
                         <button onClick={handleDownloadPdf} className="flex items-center gap-2 bg-blue-100 text-blue-700 font-semibold py-2 px-4 rounded-lg hover:bg-blue-200 transition">
                            <DownloadIcon />
                            <span>تنزيل PDF</span>
                        </button>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-3xl">&times;</button>
                    </div>
                </div>
                <div ref={contentRef} className="overflow-y-auto space-y-6 pr-2 p-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         <div className="md:col-span-1 bg-blue-50 p-4 rounded-lg text-center flex flex-col justify-center">
                            <h3 className="text-lg font-bold text-blue-800">إجمالي الحصص المحجوزة</h3>
                            <p className="text-5xl font-extrabold text-blue-600 mt-2">{bookings.length}</p>
                        </div>
                        <div className="md:col-span-2">
                             <BarChart title="أكثر المواد حجزاً (أعلى 5)" data={subjectStats} colorClass="bg-green-500" />
                        </div>
                    </div>
                    
                    <div>
                        <BarChart title="أكثر المعلمين حجزاً (أعلى 5)" data={teacherStats} colorClass="bg-purple-500" />
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">تفاصيل حجوزات المواد</h3>
                        <div className="overflow-y-auto max-h-64">
                            <table className="w-full text-right">
                                <thead className="sticky top-0 bg-gray-100 z-10">
                                    <tr className="border-b-2">
                                        <th className="p-2">المادة</th>
                                        <th className="p-2">عدد الحصص</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {subjectStats.length > 0 ? (
                                        subjectStats.map(([subject, count]) => (
                                            <tr key={subject} className="border-b hover:bg-gray-100">
                                                <td className="p-2 font-medium">
                                                    <span>{subject}</span>
                                                </td>
                                                <td className="p-2">{count}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={2} className="text-center p-4 text-gray-500">لا توجد حجوزات.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default StatsModal;