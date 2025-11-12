import React from 'react';
import { WeekOption, Booking } from '../types';

interface TimetableProps {
    week: WeekOption;
    bookings: Booking[];
    onSlotClick: (day: string, period: number) => void;
}

const Timetable: React.FC<TimetableProps> = ({ week, bookings, onSlotClick }) => {
    const days = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس"];
    const periods = Array.from({ length: 7 }, (_, i) => i + 1);

    return (
        <div className="overflow-x-auto">
            <div className="grid grid-cols-8 gap-2" style={{minWidth: '900px'}}>
                {/* Header Row: Empty corner + Period labels */}
                <div className="p-2"></div> {/* Empty corner */}
                {periods.map(period => (
                    <div key={period} className="text-center font-bold bg-indigo-100 text-indigo-800 p-3 rounded-lg">
                        الحصة {period}
                    </div>
                ))}

                {/* Data Rows: One row per day */}
                {days.map((dayName, dayIndex) => {
                    const date = week.dates[dayIndex];
                    if (!date) return null; // Should not happen, but good practice
                    const dateString = date.toISOString().split('T')[0];

                    return (
                        <React.Fragment key={dayName}>
                            {/* Row Header (Day name and date) */}
                            <div className="text-center font-bold bg-indigo-100 text-indigo-800 p-3 rounded-lg flex flex-col items-center justify-center">
                                <div>{dayName}</div>
                                <div className="text-sm font-normal">
                                    {date.toLocaleDateString('ar-OM', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                </div>
                            </div>

                            {/* Period cells for the day */}
                            {periods.map(period => {
                                const booking = bookings.find(b => b.day === dateString && b.period === period);
                                const isBooked = !!booking;
                                const baseCellClasses = 'p-3 border rounded-lg text-center cursor-pointer transition-all duration-200 transform hover:scale-105 hover:shadow-lg h-24 flex flex-col justify-center items-center text-sm';
                                
                                const cellVariantClasses = isBooked 
                                    ? 'bg-red-200 border-red-400 hover:bg-red-300'
                                    : 'bg-sky-50 border-sky-200 hover:bg-sky-100';
                                
                                return (
                                    <div
                                        key={`${dateString}-${period}`}
                                        onClick={() => onSlotClick(dateString, period)}
                                        className={`${baseCellClasses} ${cellVariantClasses}`}
                                    >
                                        {booking ? (
                                            <div className="font-bold text-red-800 text-xs sm:text-sm flex flex-col justify-center items-center h-full w-full text-center px-1">
                                                <UserIcon />
                                                <span className="mt-1">{booking.teacher}</span>
                                            </div>
                                        ) : (
                                            <span className="font-semibold text-sky-700">متاح</span>
                                        )}
                                    </div>
                                );
                            })}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};

const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>;

export default Timetable;