import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Booking, WeekOption, ModalType, SelectedSlot } from './types';
import { TEACHERS, SUBJECTS, GRADES, PASSWORD, JSONBIN_BIN_ID, JSONBIN_API_KEY } from './constants';
import Header from './components/Header';
import WeekSelector from './components/WeekSelector';
import Timetable from './components/Timetable';
import BookingModal from './components/BookingModal';
import BookingDetailsModal from './components/BookingDetailsModal';
import PasswordModal from './components/PasswordModal';
import StatsModal from './components/StatsModal';
import AllBookingsModal from './components/AllBookingsModal';
import ToastContainer from './components/ToastContainer';
import CloudConfigModal from './components/CloudConfigModal';
import { SyncStatus } from './components/CloudStatusIndicator';

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
    const [syncStatus, setSyncStatus] = useState<SyncStatus>('offline');
    const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
    const [cloudConfig, setCloudConfig] = useState<{ binId: string, apiKey: string }>({
        binId: localStorage.getItem('jsonbin_bin_id') || JSONBIN_BIN_ID,
        apiKey: localStorage.getItem('jsonbin_api_key') || JSONBIN_API_KEY,
    });
    const isInitialMount = useRef(true);
    const syncTimeoutRef = useRef<number | null>(null);
    const isPolling = useRef(false);
    const savedPollCallback = useRef<() => void>();

    const addToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(toast => toast.id !== id));
        }, 5000);
    }, []);

    const generateSampleDataForCurrentWeek = useCallback((): Booking[] => {
        const today = new Date();
        const dayOfWeek = today.getDay(); // 0 = Sunday
        const currentSunday = new Date(today);
        currentSunday.setHours(0, 0, 0, 0);
        currentSunday.setDate(today.getDate() - dayOfWeek);

        const sampleBookings: Booking[] = [];

        // Sample 1: Monday, Period 2
        const monday = new Date(currentSunday);
        monday.setDate(currentSunday.getDate() + 1);
        sampleBookings.push({
            id: 'sample-' + Date.now() + '-1',
            day: monday.toISOString().split('T')[0],
            period: 2,
            teacher: 'محمد بن سالم بن محمد النبهاني',
            subject: 'اللغة العربية',
            lesson: 'درس تجريبي في البلاغة',
            grade: '12',
            class: '1/12',
        });

        // Sample 2: Wednesday, Period 4
        const wednesday = new Date(currentSunday);
        wednesday.setDate(currentSunday.getDate() + 3);
        sampleBookings.push({
            id: 'sample-' + Date.now() + '-2',
            day: wednesday.toISOString().split('T')[0],
            period: 4,
            teacher: 'خالد بن محمد بن سيف النبهاني (رياضة)',
            subject: 'الرياضة المدرسية',
            lesson: 'حصصة تدريبية لكرة القدم',
            grade: '11',
            class: '3/11',
        });
        
        return sampleBookings;
    }, []);

    const saveBookings = useCallback(async (currentBookings: Booking[]) => {
        localStorage.setItem('lrcBookings', JSON.stringify(currentBookings));
    
        if (!navigator.onLine) {
            setSyncStatus('offline');
            addToast('أنت غير متصل، تم حفظ التغييرات محلياً.', 'info');
            return;
        }
        
        if (cloudConfig.binId === "YOUR_BIN_ID_HERE" || cloudConfig.apiKey === "YOUR_API_KEY_HERE") {
            addToast('إعدادات السحابة غير مكتملة. تم الحفظ محلياً فقط.', 'error');
            setSyncStatus('offline');
            return;
        }
    
        setSyncStatus('syncing');
        try {
            const response = await fetch(`https://api.jsonbin.io/v3/b/${cloudConfig.binId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': cloudConfig.apiKey,
                    'X-Bin-Private': 'true',
                },
                body: JSON.stringify(currentBookings),
            });
            
            if (!response.ok) {
                let errorMessage = 'فشل الحفظ في السحابة';
                try {
                    const errorData = await response.json();
                    switch(response.status) {
                        case 401:
                            errorMessage = 'فشل المصادقة. يرجى التحقق من مفتاح API.';
                            break;
                        case 404:
                            errorMessage = 'الحاوية غير موجودة. يرجى التحقق من معرّف الحاوية (Bin ID).';
                            break;
                        case 422:
                            errorMessage = `خطأ في البيانات المرسلة: ${errorData.message || 'بيانات غير صالحة'}`;
                            break;
                        default:
                            errorMessage = errorData.message || `حدث خطأ غير متوقع (${response.status})`;
                    }
                } catch (e) {
                    errorMessage = `حدث خطأ في الشبكة (${response.status} ${response.statusText})`;
                }
                throw new Error(errorMessage);
            }
            setSyncStatus('synced');
        } catch (error: any) {
            console.error("Failed to save to cloud", error);
            setSyncStatus('offline');
            const finalMessage = error.message.includes('Failed to fetch') 
                ? 'فشل الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت.' 
                : error.message;
            addToast(finalMessage, 'error');
        }
    }, [addToast, cloudConfig]);

    const loadFromLocalStorage = useCallback(() => {
        const storedBookings = localStorage.getItem('lrcBookings');
        if (storedBookings) {
            try {
                const parsedBookings = JSON.parse(storedBookings);
                if (Array.isArray(parsedBookings)) {
                    setBookings(parsedBookings);
                }
            } catch (e) { console.error("Failed to parse local bookings", e); }
        } else {
            const sampleData = generateSampleDataForCurrentWeek();
            setBookings(sampleData);
            localStorage.setItem('lrcBookings', JSON.stringify(sampleData));
            addToast('مرحباً بك! تم إضافة بيانات حجز تجريبية.', 'success');
        }
    }, [addToast, generateSampleDataForCurrentWeek]);

    const fetchBookings = useCallback(async () => {
        setSyncStatus('syncing');
        if (!navigator.onLine) {
            loadFromLocalStorage();
            setSyncStatus('offline');
            addToast('أنت غير متصل، تم تحميل البيانات المحلية.', 'info');
            return;
        }
    
        if (cloudConfig.binId === "YOUR_BIN_ID_HERE" || cloudConfig.apiKey === "YOUR_API_KEY_HERE") {
            setSyncStatus('offline');
            loadFromLocalStorage();
            return;
        }
        
        try {
            const response = await fetch(`https://api.jsonbin.io/v3/b/${cloudConfig.binId}/latest`, {
                headers: {
                    'X-Master-Key': cloudConfig.apiKey,
                }
            });
    
            if (!response.ok) {
                if (response.status === 404) {
                    addToast('حاوية جديدة مكتشفة. جاري الإعداد الأولي...', 'info');
                    try {
                        const createResponse = await fetch(`https://api.jsonbin.io/v3/b/${cloudConfig.binId}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-Master-Key': cloudConfig.apiKey,
                                'X-Bin-Private': 'true',
                            },
                            body: JSON.stringify([]), // Create it empty first
                        });
    
                        if (!createResponse.ok) {
                            let initErrorMessage = 'فشل تهيئة الحاوية السحابية';
                             try {
                                const errorData = await createResponse.json();
                                switch(createResponse.status) {
                                    case 401:
                                        initErrorMessage = 'فشل المصادقة عند إنشاء الحاوية. يرجى التحقق من مفتاح API.';
                                        break;
                                    case 422:
                                        initErrorMessage = `فشل تهيئة الحاوية: ${errorData.message || 'بيانات غير صالحة'}`;
                                        break;
                                    default:
                                        initErrorMessage = errorData.message || `حدث خطأ غير متوقع (${createResponse.status})`;
                                }
                            } catch (e) {
                                initErrorMessage = `حدث خطأ في الشبكة (${createResponse.status} ${createResponse.statusText})`;
                            }
                            throw new Error(initErrorMessage);
                        }
                        
                        const sampleData = generateSampleDataForCurrentWeek();
                        setBookings(sampleData);
                        localStorage.setItem('lrcBookings', JSON.stringify(sampleData));
                        addToast('تم إعداد الحاوية السحابية بنجاح! أضفنا لك بعض الحجوزات التجريبية.', 'success');
                        setSyncStatus('synced');
    
                    } catch (creationError: any) {
                        throw new Error(creationError.message);
                    }
                    return;
                }
                
                let errorMessage = 'فشل تحميل البيانات من السحابة';
                 try {
                    const errorData = await response.json();
                    switch(response.status) {
                        case 401:
                            errorMessage = 'فشل المصادقة. يرجى التحقق من مفتاح API.';
                            break;
                        default:
                            errorMessage = errorData.message || `حدث خطأ غير متوقع (${response.status})`;
                    }
                } catch(e) {
                    errorMessage = `حدث خطأ في الشبكة (${response.status} ${response.statusText})`;
                }
                throw new Error(errorMessage);
            }
            
            const data = await response.json();
            const record = data.record;

            const isEmpty = (Array.isArray(record) && record.length === 0) || 
                            (typeof record === 'object' && record !== null && !Array.isArray(record) && Object.keys(record).length === 0);

            if (isEmpty) {
                const sampleData = generateSampleDataForCurrentWeek();
                setBookings(sampleData);
                localStorage.setItem('lrcBookings', JSON.stringify(sampleData));
                addToast('مرحباً بك! تم إضافة بيانات حجز تجريبية للبدء.', 'success');
            } else if (Array.isArray(record)) {
                setBookings(record);
                localStorage.setItem('lrcBookings', JSON.stringify(record));
            } else {
                throw new Error('تم استلام بيانات غير متوقعة من السحابة.');
            }
            setSyncStatus('synced');
        } catch (error: any) {
            console.error("Failed to fetch or process from cloud", error);
            addToast(error.message.includes('Failed to fetch') 
                ? 'فشل الاتصال بالخادم. سيتم استخدام البيانات المحلية.'
                : error.message, 'error');
            setSyncStatus('offline');
            loadFromLocalStorage();
        }
    }, [addToast, loadFromLocalStorage, generateSampleDataForCurrentWeek, cloudConfig]);
    
    useEffect(() => {
        if (cloudConfig.binId === "YOUR_BIN_ID_HERE" || cloudConfig.apiKey === "YOUR_API_KEY_HERE") {
            if (isInitialMount.current) {
                addToast('مرحباً بك! يرجى إعداد التخزين السحابي أولاً.', 'info');
                setIsConfigModalOpen(true);
            } else {
                addToast('إعدادات السحابة غير مكتملة. التطبيق يعمل بالوضع المحلي.', 'info');
            }
            setSyncStatus('offline');
            loadFromLocalStorage();
        } else {
            fetchBookings();
        }
    }, [cloudConfig, fetchBookings, loadFromLocalStorage, addToast]);


    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        
        if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
        
        syncTimeoutRef.current = window.setTimeout(() => {
            saveBookings(bookings);
        }, 1500);

        return () => {
            if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
        };
    }, [bookings, saveBookings]);
    
    useEffect(() => {
        const handleOnline = () => {
            addToast('تم استعادة الاتصال بالإنترنت. جاري مزامنة التغييرات...', 'success');
            const localData = localStorage.getItem('lrcBookings');
            if (localData) {
                try {
                    const parsedBookings = JSON.parse(localData);
                    if (Array.isArray(parsedBookings)) {
                        saveBookings(parsedBookings);
                    }
                } catch (e) {
                    console.error("Could not sync local data on reconnect", e);
                }
            }
        };
        const handleOffline = () => {
            addToast('تم فقدان الاتصال بالإنترنت. التغييرات ستحفظ محلياً.', 'info');
            setSyncStatus('offline');
        };
        
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [addToast, saveBookings]);

    // This effect updates the polling callback on every render so it has the latest state.
    useEffect(() => {
        savedPollCallback.current = async () => {
            if (isPolling.current || syncStatus === 'syncing' || !navigator.onLine) {
                return;
            }

            if (cloudConfig.binId === "YOUR_BIN_ID_HERE" || cloudConfig.apiKey === "YOUR_API_KEY_HERE") {
                return;
            }

            isPolling.current = true;
            try {
                const response = await fetch(`https://api.jsonbin.io/v3/b/${cloudConfig.binId}/latest`, {
                    headers: { 'X-Master-Key': cloudConfig.apiKey }
                });

                if (!response.ok) {
                    console.error(`Polling failed with status: ${response.status}`);
                    return;
                }

                const data = await response.json();
                const cloudRecord = data.record;

                if (!Array.isArray(cloudRecord)) {
                    console.error('Polled data is not in the expected format.');
                    return;
                }

                if (JSON.stringify(cloudRecord) !== JSON.stringify(bookings)) {
                    setBookings(cloudRecord);
                    localStorage.setItem('lrcBookings', JSON.stringify(cloudRecord));
                    addToast('تم تحديث البيانات تلقائياً من السحابة.', 'info');
                    setSyncStatus('synced');
                }
            } catch (error) {
                console.error("Error during polling for updates:", error);
                 if (error instanceof Error && error.message.includes('Failed to fetch')) {
                    setSyncStatus('offline');
                }
            } finally {
                isPolling.current = false;
            }
        };
    });

    // This effect sets up the interval and runs only once on component mount.
    useEffect(() => {
        const tick = () => {
            savedPollCallback.current?.();
        };
        const intervalId = setInterval(tick, 20000); // Poll every 20 seconds
        return () => clearInterval(intervalId);
    }, []);


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

        const currentSunday = new Date(today);
        currentSunday.setDate(today.getDate() - dayOfWeek);
        
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
    
    const handleSaveConfig = (binId: string, apiKey: string) => {
        localStorage.setItem('jsonbin_bin_id', binId);
        localStorage.setItem('jsonbin_api_key', apiKey);
        setCloudConfig({ binId, apiKey });
        setIsConfigModalOpen(false);
        addToast('تم حفظ إعدادات السحابة! جاري المزامنة...', 'success');
    };

    const currentBooking = useMemo(() => {
        if (!selectedSlot) return undefined;
        return bookings.find(b => b.day === selectedSlot.day && b.period === selectedSlot.period);
    }, [bookings, selectedSlot]);

    return (
        <div className="bg-gray-100 min-h-screen text-gray-800">
            <div className="container mx-auto p-4 md:p-8">
                <Header syncStatus={syncStatus} onOpenConfig={() => setIsConfigModalOpen(true)} />
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
            
            <CloudConfigModal
                isOpen={isConfigModalOpen}
                onClose={() => setIsConfigModalOpen(false)}
                onSave={handleSaveConfig}
                initialBinId={cloudConfig.binId !== 'YOUR_BIN_ID_HERE' ? cloudConfig.binId : ''}
                initialApiKey={cloudConfig.apiKey !== 'YOUR_API_KEY_HERE' ? cloudConfig.apiKey : ''}
            />

            <ToastContainer toasts={toasts} setToasts={setToasts} />
        </div>
    );
};

const ChartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
const ListIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>;

export default App;