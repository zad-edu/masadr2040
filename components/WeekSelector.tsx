
import React from 'react';
import { WeekOption } from '../types';

interface WeekSelectorProps {
    options: WeekOption[];
    selectedValue: string;
    onChange: (value: string) => void;
}

const WeekSelector: React.FC<WeekSelectorProps> = ({ options, selectedValue, onChange }) => {
    return (
        <div className="mb-6">
            <label htmlFor="week-selector" className="block text-lg font-bold mb-2 text-gray-700">اختر الأسبوع:</label>
            <div className="relative">
                <select
                    id="week-selector"
                    value={selectedValue}
                    onChange={(e) => onChange(e.target.value)}
                    className="block w-full bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-teal-500 focus:border-teal-500 p-3 appearance-none"
                >
                    {options.map(option => (
                        <option 
                            key={option.value} 
                            value={option.value} 
                            disabled={!option.isAvailable} 
                            className={!option.isAvailable ? 'text-gray-500' : ''}
                            title={!option.isAvailable ? 'يفتح الحجز لهذا الأسبوع يوم الأربعاء' : ''}
                        >
                            {option.label}
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-3 text-gray-700">
                    <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
            </div>
        </div>
    );
};

export default WeekSelector;