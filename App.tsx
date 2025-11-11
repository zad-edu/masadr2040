import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Booking, WeekOption, ModalType, SelectedSlot } from './types';
import { TEACHERS, SUBJECTS, GRADES, PASSWORD } from './constants';
import Header from './components/Header';
import WeekSelector from './components/WeekSelector';
import Timetable from './components/Timetable';
import BookingModal from './components/BookingModal';
import BookingDetailsModal from './components/BookingDetailsModal';
import PasswordModal from './components/PasswordModal';
import StatsModal from './components/StatsModal';
import AllBookingsModal from './components/AllBookingsModal';
import ToastContainer from './components/ToastContainer';

const App: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [weekOptions, setWeekOptions] = useState<WeekOption[]>([]);
    const [selectedWeek, setSelectedWeek] = useState<WeekOption | null>(null);
    const [activeModal, setActiveModal] = useState<ModalType>(null);
    const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null);
    const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
    const [passwordAction, setPasswordAction] = useState<(() => void) | null>(null);
    const [toasts, setToasts] = useState<{ id: number, message: string, type: 'success' | 'error' | 'info' }[]>([]);
    const [lastAuthTimestamp, setLastAuthTimestamp] = useState<number | null>(null);

    const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(toast => toast.id !== id));
        }, 5000);
    };

    useEffect(() => {
        const storedBookings = localStorage.getItem('lrcBookings');
        if (storedBookings) {
            try {
                const parsedBookings = JSON.parse(storedBookings);
                if (Array.isArray(parsedBookings)) {
                    setBookings(parsedBookings);
                }
            } catch (error) {
                console.error("Failed to parse bookings from localStorage", error);
                setBookings([]);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('lrcBookings', JSON.stringify(bookings));
    }, [bookings]);

    const getWeekDates = (startDate: Date): Date[] => {
        const dates: Date[] = [];
        for (let i = 0; i < 5; i++) {
            const newDate = new Date(startDate);
            newDate.setDate(startDate.getDate() + i);
            dates.push(newDate);
        }
        return dates;
    };
    
    const formatDate = (date: Date) => {
        return date.toLocaleDateString('ar-OM', { year: 'numeric', month: '2-digit', day: '2-digit' });
    }

    useEffect(() => {
        const today = new Date();
        const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

        // Calculate current week's Sunday
        const currentSunday = new Date(today);
        currentSunday.setDate(today.getDate() - dayOfWeek);
        
        // Calculate next week's Sunday
        const nextSunday = new Date(currentSunday);
        nextSunday.setDate(currentSunday.getDate() + 7);

        const currentWeekDates = getWeekDates(currentSunday);
        const nextWeekDates = getWeekDates(nextSunday);

        const isNextWeekAvailable = dayOfWeek >= 3; // Wednesday (3) or later

        const options: WeekOption[] = [
            {
                label: `الأسبوع الحالي (${formatDate(currentWeekDates[0])} - ${formatDate(currentWeekDates[4])}) - متاح للحجز`,
                value: currentSunday.toISOString().split('T')[0],
                isAvailable: true,
                dates: currentWeekDates,
            },
            {
                label: `الأسبوع القادم (${formatDate(nextWeekDates[0])} - ${formatDate(nextWeekDates[4])}) - ${isNextWeekAvailable ? 'متاح للحجز' : 'غير متاح للحجز'}`,
                value: nextSunday.toISOString().split('T')[0],
                isAvailable: isNextWeekAvailable,
                dates: nextWeekDates,
            }
        ];
        
        setWeekOptions(options);
        setSelectedWeek(options[0]);
    }, []);
    
    const handleWeekChange = (value: string) => {
        const week = weekOptions.find(w => w.value === value);
        if (week && week.isAvailable) {
            setSelectedWeek(week);
        } else {
            addToast('هذا الأسبوع غير متاح للحجز بعد.', 'error');
        }
    };

    const handleSlotClick = (day: string, period: number) => {
        const existingBooking = bookings.find(b => b.day === day && b.period === period);
        setSelectedSlot({ day, period });
        if (existingBooking) {
            setEditingBooking(existingBooking);
            setActiveModal('details');
        } else {
            setEditingBooking(null);
            setActiveModal('booking');
        }
    };

    const closeModal = () => {
        setActiveModal(null);
        setSelectedSlot(null);
        setEditingBooking(null);
        setPasswordAction(null);
    };
    
    const handleBookingSubmit = (bookingData: Omit<Booking, 'id'>) => {
        const weeklyBookings = bookings.filter(b => {
          if (b.teacher !== bookingData.teacher) return false;
          const weekDates = selectedWeek?.dates.map(d => d.toISOString().split('T')[0]) || [];
          return weekDates.includes(b.day);
        });
        
        const dailyBookings = bookings.filter(b => b.teacher === bookingData.teacher && b.day === bookingData.day);

        if (editingBooking) {
            if(weeklyBookings.filter(b => b.id !== editingBooking.id).length >= 6) {
                addToast('لقد وصلت للحد الأقصى للحجز الأسبوعي (6 حصص).', 'error');
                return;
            }
            if(dailyBookings.filter(b => b.id !== editingBooking.id).length >= 3) {
                addToast('لقد وصلت للحد الأقصى للحجز اليومي (3 حصص).', 'error');
                return;
            }

            const updatedBookings = bookings.map(b => b.id === editingBooking.id ? { ...bookingData, id: editingBooking.id } : b);
            setBookings(updatedBookings);
            addToast('تم تعديل الحجز بنجاح!', 'success');
        } else {
            if(weeklyBookings.length >= 6) {
                addToast('لقد وصلت للحد الأقصى للحجز الأسبوعي (6 حصص).', 'error');
                return;
            }
             if(dailyBookings.length >= 3) {
                addToast('لقد وصلت للحد الأقصى للحجز اليومي (3 حصص).', 'error');
                return;
            }

            setBookings([...bookings, { ...bookingData, id: Date.now().toString() }]);
            addToast('تم تأكيد الحجز بنجاح!', 'success');
        }
        
        closeModal();
    };
    
    const handlePasswordSuccess = () => {
        setLastAuthTimestamp(Date.now());
        if (passwordAction) {
            passwordAction();
        }
        setPasswordAction(null);
    };

    const handleOpenEdit = () => {
        setActiveModal('booking');
    };

    const handleDeleteBooking = () => {
        if (editingBooking) {
            setBookings(bookings.filter(b => b.id !== editingBooking.id));
            addToast('تم إلغاء الحجز بنجاح.', 'success');
            closeModal();
        }
    };
    
    const requestPassword = (action: () => void) => {
        setPasswordAction(() => action);
        setActiveModal('password');
    };
    
    const handleProtectedAction = (action: () => void) => {
        const now = Date.now();
        const fiveMinutes = 5 * 60 * 1000;
        
        if (lastAuthTimestamp && (now - lastAuthTimestamp < fiveMinutes)) {
            action();
        } else {
            requestPassword(action);
        }
    };

    const currentBooking = useMemo(() => {
        if (!selectedSlot) return undefined;
        return bookings.find(b => b.day === selectedSlot.day && b.period === selectedSlot.period);
    }, [bookings, selectedSlot]);

    return (
        <div className="bg-gray-100 min-h-screen text-gray-800">
            <div className="container mx-auto p-4 md:p-8">
                <Header />
                <main className="mt-8 bg-white p-6 rounded-2xl shadow-lg">
                    <WeekSelector options={weekOptions} selectedValue={selectedWeek?.value || ''} onChange={handleWeekChange} />
                    {selectedWeek && <Timetable week={selectedWeek} bookings={bookings} onSlotClick={handleSlotClick} />}
                </main>
                 <footer className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4 flex-wrap">
                     <button onClick={() => handleProtectedAction(() => setActiveModal('all-bookings'))} className="flex items-center justify-center gap-2 bg-teal-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-teal-700 transition-all duration-300 transform hover:-translate-y-1">
                        <ListIcon />
                        <span>عرض كل الحجوزات</span>
                    </button>
                    <button onClick={() => handleProtectedAction(() => setActiveModal('stats'))} className="flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-300 transform hover:-translate-y-1">
                        <ChartIcon />
                        <span>عرض الإحصائيات</span>
                    </button>
                </footer>
            </div>
            
            {activeModal === 'booking' && selectedSlot && (
                <BookingModal
                    isOpen={true}
                    onClose={closeModal}
                    onSubmit={handleBookingSubmit}
                    teachers={TEACHERS}
                    subjects={SUBJECTS}
                    grades={GRADES}
                    slot={selectedSlot}
                    existingBooking={editingBooking}
                    addToast={addToast}
                    allBookings={bookings}
                    selectedWeek={selectedWeek}
                />
            )}
            
            {activeModal === 'details' && editingBooking && (
                <BookingDetailsModal
                    isOpen={true}
                    onClose={closeModal}
                    booking={editingBooking}
                    onEdit={() => handleProtectedAction(handleOpenEdit)}
                    onDelete={() => handleProtectedAction(handleDeleteBooking)}
                />
            )}
            
            {activeModal === 'password' && (
                <PasswordModal
                    isOpen={true}
                    onClose={closeModal}
                    onSuccess={handlePasswordSuccess}
                    correctPassword={PASSWORD}
                />
            )}
            
            {activeModal === 'stats' && (
                <StatsModal
                    isOpen={true}
                    onClose={closeModal}
                    bookings={bookings}
                    teachers={TEACHERS}
                    subjects={SUBJECTS}
                />
            )}
            
            {activeModal === 'all-bookings' && (
                 <AllBookingsModal
                    isOpen={true}
                    onClose={closeModal}
                    bookings={bookings}
                />
            )}

            <ToastContainer toasts={toasts} setToasts={setToasts} />
        </div>
    );
};

const ChartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
const ListIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>;

export default App;