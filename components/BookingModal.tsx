import React, { useState, useEffect, useRef } from 'react';
import { Booking, SelectedSlot, WeekOption } from '../types';
import SearchableDropdown from './SearchableDropdown';
import IconDropdown from './IconDropdown';

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (bookingData: Omit<Booking, 'id'>) => void;
    teachers: string[];
    subjects: string[];
    grades: Record<string, string[]>;
    slot: SelectedSlot;
    existingBooking?: Booking | null;
    addToast: (message: string, type: 'error' | 'success' | 'info') => void;
    allBookings: Booking[];
    selectedWeek: WeekOption | null;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, onSubmit, teachers, subjects, grades, slot, existingBooking, addToast, allBookings, selectedWeek }) => {
    const [teacher, setTeacher] = useState('');
    const [subject, setSubject] = useState('');
    const [lesson, setLesson] = useState('');
    const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
    const [selectedClass, setSelectedClass] = useState('');
    const [validationError, setValidationError] = useState<string | null>(null);
    const teacherInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (existingBooking) {
            setTeacher(existingBooking.teacher);
            setSubject(existingBooking.subject);
            setLesson(existingBooking.lesson);
            setSelectedGrade(existingBooking.grade);
            setSelectedClass(existingBooking.class);
        } else {
            setTeacher('');
            setSubject('');
            setLesson('');
            setSelectedGrade(null);
            setSelectedClass('');
        }
        setValidationError(null);

        if (isOpen) {
            setTimeout(() => {
                teacherInputRef.current?.focus();
            }, 100);
        }
    }, [existingBooking, isOpen]);

    useEffect(() => {
        setValidationError(null); 

        if (!teacher || !selectedWeek) {
            return;
        }

        const isEditing = !!existingBooking;

        // --- Weekly bookings check ---
        const weeklyBookings = allBookings.filter(b => {
            if (b.teacher !== teacher) return false;
            if (isEditing && b.id === existingBooking.id) return false;
            const weekDatesStr = selectedWeek.dates.map(d => d.toISOString().split('T')[0]);
            return weekDatesStr.includes(b.day);
        });

        if (weeklyBookings.length >= 6) {
            const message = 'وصل هذا المعلم للحد الأقصى للحجز الأسبوعي (6 حصص).';
            setValidationError(message);
            addToast(message, 'error');
            return;
        }

        // --- Daily bookings check ---
        const dailyBookings = allBookings.filter(b => {
            if (b.teacher !== teacher) return false;
            if (isEditing && b.id === existingBooking.id) return false;
            return b.day === slot.day;
        });
        
        if (dailyBookings.length >= 3) {
            const message = 'وصل هذا المعلم للحد الأقصى للحجز اليومي (3 حصص).';
            setValidationError(message);
            addToast(message, 'error');
            return;
        }

    }, [teacher, allBookings, selectedWeek, slot, existingBooking, addToast]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!teacher || !subject || !lesson || !selectedGrade || !selectedClass) {
            addToast('الرجاء تعبئة جميع الحقول المطلوبة.', 'error');
            return;
        }
        if (validationError) {
            addToast(validationError, 'error');
            return;
        }
        onSubmit({
            day: slot.day,
            period: slot.period,
            teacher,
            subject,
            lesson,
            grade: selectedGrade,
            class: selectedClass,
        });
    };

    if (!isOpen) return null;
    
    const dayName = new Date(slot.day).toLocaleDateString('ar-OM', { weekday: 'long' });
    const formattedDate = new Date(slot.day).toLocaleDateString('ar-OM', { day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6 border-b-2 border-teal-100 pb-4">
                    <h2 className="text-2xl font-bold text-gray-800">{existingBooking ? 'تعديل الحجز' : 'بيانات الحجز'}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-3xl">&times;</button>
                </div>
                
                <div className="text-center mb-6 p-3 bg-teal-50 rounded-lg text-teal-800 font-semibold">
                    {`الحصة ${slot.period} - يوم ${dayName} - ${formattedDate}`}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="font-bold">المعلم:</label>
                        <SearchableDropdown
                            ref={teacherInputRef}
                            options={teachers}
                            selectedValue={teacher}
                            onChange={setTeacher}
                            placeholder="ابحث عن اسم المعلم..."
                        />
                        {validationError && (
                            <p className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded-md">{validationError}</p>
                        )}
                    </div>
                    <div>
                        <label className="font-bold">المادة:</label>
                         <IconDropdown
                            options={subjects}
                            selectedValue={subject}
                            onChange={setSubject}
                            placeholder="اختر المادة..."
                        />
                    </div>
                    <div>
                        <label className="font-bold">عنوان الدرس:</label>
                        <input type="text" value={lesson} onChange={e => setLesson(e.target.value)} className="w-full mt-1 p-2 border rounded-md" placeholder="اكتب عنوان الدرس" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {Object.keys(grades).map(grade => (
                             <div key={grade}>
                                <label className="font-bold">{`الصف ${grade}`}:</label>
                                <select 
                                    value={selectedGrade === grade ? selectedClass : ""} 
                                    onChange={e => { setSelectedGrade(grade); setSelectedClass(e.target.value); }}
                                    className="w-full mt-1 p-2 border rounded-md bg-gray-50"
                                >
                                    <option value="">اختر...</option>
                                    {grades[grade].map(cls => <option key={cls} value={cls}>{cls}</option>)}
                                </select>
                             </div>
                        ))}
                    </div>

                    <div className="flex justify-end gap-4 pt-6">
                        <button type="button" onClick={onClose} className="py-2 px-6 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300">إلغاء</button>
                        <button 
                            type="submit" 
                            className="py-2 px-6 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            disabled={!!validationError}
                        >
                            {existingBooking ? 'حفظ التعديلات' : 'تأكيد الحجز'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookingModal;