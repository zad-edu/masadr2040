import React from 'react';
import { Booking } from '../types';

interface BookingDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    booking: Booking;
    onEdit: () => void;
    onDelete: () => void;
}

const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({ isOpen, onClose, booking, onEdit, onDelete }) => {
    if (!isOpen) return null;
    
    const dayName = new Date(booking.day).toLocaleDateString('ar-OM', { weekday: 'long' });
    const formattedDate = new Date(booking.day).toLocaleDateString('ar-OM', { day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6 border-b-2 border-teal-100 pb-4">
                    <h2 className="text-2xl font-bold text-gray-800">تفاصيل الحجز</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-3xl">&times;</button>
                </div>
                
                <div className="space-y-3 text-lg">
                    <p><strong>التاريخ:</strong> {`${dayName} - ${formattedDate}`}</p>
                    <p><strong>الحصة:</strong> {`الحصة ${booking.period}`}</p>
                    <p><strong>المعلم:</strong> {booking.teacher}</p>
                    <p><strong>المادة:</strong> {booking.subject}</p>
                    <p><strong>الدرس:</strong> {booking.lesson}</p>
                    <p><strong>الصف:</strong> {booking.class}</p>
                </div>

                <div className="flex justify-end gap-4 pt-6 mt-6 border-t">
                    <button onClick={onClose} className="py-2 px-6 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300">خروج</button>
                    <button onClick={onDelete} className="py-2 px-6 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700">إلغاء الحجز</button>
                    <button onClick={onEdit} className="py-2 px-6 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600">تعديل الحجز</button>
                </div>
            </div>
        </div>
    );
};

export default BookingDetailsModal;