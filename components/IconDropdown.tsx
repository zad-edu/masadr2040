import React, { useState, useEffect, useRef } from 'react';
import SubjectIcon from './SubjectIcon';

interface IconDropdownProps {
    options: string[];
    selectedValue: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

const IconDropdown: React.FC<IconDropdownProps> = ({ options, selectedValue, onChange, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (option: string) => {
        onChange(option);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                className="w-full mt-1 p-2 border rounded-md bg-gray-50 text-right flex justify-between items-center"
                onClick={() => setIsOpen(!isOpen)}
            >
                {selectedValue ? (
                    <div className="flex items-center gap-2">
                        <SubjectIcon subject={selectedValue} />
                        <span>{selectedValue}</span>
                    </div>
                ) : (
                    <span className="text-gray-500">{placeholder}</span>
                )}
                 <svg className="fill-current h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </button>
            {isOpen && (
                <ul className="absolute z-20 w-full bg-white border rounded-md mt-1 max-h-60 overflow-y-auto shadow-lg">
                    {options.map(option => (
                        <li
                            key={option}
                            className="p-2 hover:bg-teal-100 cursor-pointer flex items-center gap-2"
                            onClick={() => handleSelect(option)}
                        >
                            <SubjectIcon subject={option} />
                            <span>{option}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default IconDropdown;
