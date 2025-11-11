import React, { useState, useMemo, useRef } from 'react';
import { Booking } from '../types';

// Add type declarations for global libraries
declare global {
    interface Window {
        jspdf: any;
        html2canvas: any;
    }
}

const DownloadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 9.707a1 1 0 011.414 0L9 11.086V3a1 1 0 112 0v8.086l1.293-1.379a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>;

interface AllBookingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    bookings: Booking[];
}

const AllBookingsModal: React.FC<AllBookingsModalProps> = ({ isOpen, onClose, bookings }) => {
    const [selectedSubject, setSelectedSubject] = useState<string>('all');
    const [selectedMonth, setSelectedMonth] = useState<string>('all');
    const contentRef = useRef<HTMLDivElement>(null);

    const handleDownloadPdf = async () => {
        const { jsPDF } = window.jspdf;
        const content = contentRef.current;
        const modalBody = content?.parentElement as HTMLElement | null;

        if (!content || !modalBody) return;

        // Store original styles to revert back to
        const originalContentOverflow = content.style.overflowY;
        const originalModalBodyMaxHeight = modalBody.style.maxHeight;

        try {
            // Temporarily change styles to capture the full scrollable content
            content.style.overflowY = 'visible';
            modalBody.style.maxHeight = 'none';

            const canvas = await window.html2canvas(content, { scale: 2, useCORS: true });
            
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'pt',
                format: [canvas.width, canvas.height]
            });
            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save('all-bookings.pdf');
        } catch (error) {
            console.error("Error generating PDF:", error);
        } finally {
            // Restore original styles after capture
            content.style.overflowY = originalContentOverflow;
            modalBody.style.maxHeight = originalModalBodyMaxHeight;
        }
    };

    const uniqueSubjects = useMemo(() => [...new Set(bookings.map(b => b.subject))].sort(), [bookings]);
    
    const uniqueMonths = useMemo(() => {
        const monthSet = new Set<string>();
        bookings.forEach(b => {
            monthSet.add(b.day.substring(0, 7)); // YYYY-MM
        });
        return Array.from(monthSet).sort().reverse();
    }, [bookings]);

    const filteredAndSortedBookings = useMemo(() => {
        return bookings
            .filter(booking => {
                const subjectMatch = selectedSubject === 'all' || booking.subject === selectedSubject;
                const monthMatch = selectedMonth === 'all' || booking.day.startsWith(selectedMonth);
                return subjectMatch && monthMatch;
            })
            .sort((a, b) => {
                const dateA = new Date(a.day).getTime();
                const dateB = new Date(b.day).getTime();
                if (dateA !== dateB) {
                    return dateA - dateB;
                }
                return a.period - b.period;
            });
    }, [bookings, selectedSubject, selectedMonth]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-4xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6 border-b-2 border-teal-100 pb-4 gap-4 flex-wrap">
                    <h2 className="text-2xl font-bold text-gray-800">جميع الحجوزات</h2>
                    <div className="flex items-center gap-2 flex-wrap no-print">
                        {/* Month Filter */}
                         <select
                            id="month-filter"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 p-2"
                        >
                            <option value="all">كل الشهور</option>
                            {uniqueMonths.map(month => (
                                <option key={month} value={month}>{new Date(month + '-02').toLocaleDateString('ar-OM', { month: 'long', year: 'numeric' })}</option>
                            ))}
                        </select>
                        {/* Subject Filter */}
                         <select
                            id="subject-filter"
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 p-2"
                        >
                            <option value="all">كل المواد</option>
                            {uniqueSubjects.map(subject => (
                                <option key={subject} value={subject}>{subject}</option>
                            ))}
                        </select>
                        <button onClick={handleDownloadPdf} className="flex items-center gap-2 bg-blue-100 text-blue-700 font-semibold py-2 px-4 rounded-lg hover:bg-blue-200 transition">
                            <DownloadIcon />
                            <span>تنزيل PDF</span>
                        </button>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-3xl self-start no-print">&times;</button>
                </div>
                <div ref={contentRef} className="overflow-y-auto">
                    <table className="w-full text-right border-collapse">
                        <thead className="sticky top-0 bg-gray-100">
                            <tr>
                                <th className="p-3 border-b-2">التاريخ</th>
                                <th className="p-3 border-b-2">الحصة</th>
                                <th className="p-3 border-b-2">المعلم</th>
                                <th className="p-3 border-b-2">المادة</th>
                                <th className="p-3 border-b-2">الصف</th>
                                <th className="p-3 border-b-2">الدرس</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAndSortedBookings.length > 0 ? (
                                filteredAndSortedBookings.map(booking => (
                                    <tr key={booking.id} className="hover:bg-gray-50">
                                        <td className="p-3 border-b">{new Date(booking.day).toLocaleDateString('ar-OM')}</td>
                                        <td className="p-3 border-b">{booking.period}</td>
                                        <td className="p-3 border-b">{booking.teacher}</td>
                                        <td className="p-3 border-b">{booking.subject}</td>
                                        <td className="p-3 border-b">{booking.class}</td>
                                        <td className="p-3 border-b">{booking.lesson}</td>
                                    </tr>
                                ))
                             ) : (
                                <tr>
                                    <td colSpan={6} className="text-center p-8 text-gray-500">
                                        لا توجد حجوزات تطابق هذا الفلتر.
                                    </td>
                                </tr>
                             )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AllBookingsModal;