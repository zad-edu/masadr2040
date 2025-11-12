import React, { useState, useEffect, useRef, forwardRef } from 'react';

interface SearchableDropdownProps {
    options: string[];
    selectedValue: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

const SearchableDropdown = forwardRef<HTMLInputElement, SearchableDropdownProps>(({ options, selectedValue, onChange, placeholder }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
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
    
    const filteredOptions = options.filter(option =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (option: string) => {
        onChange(option);
        setSearchTerm('');
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <input
                ref={ref}
                type="text"
                className="w-full mt-1 p-2 border rounded-md"
                value={searchTerm || selectedValue}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    if (selectedValue) onChange(''); // Clear selection when user types
                    if (!isOpen) setIsOpen(true);
                }}
                onFocus={() => {
                    setSearchTerm('');
                    setIsOpen(true);
                }}
                placeholder={placeholder}
            />
            {isOpen && (
                <ul className="absolute z-10 w-full bg-white border rounded-md mt-1 max-h-60 overflow-y-auto shadow-lg">
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map(option => (
                            <li
                                key={option}
                                className="p-2 hover:bg-teal-100 cursor-pointer"
                                onClick={() => handleSelect(option)}
                            >
                                {option}
                            </li>
                        ))
                    ) : (
                        <li className="p-2 text-gray-500">لا توجد نتائج</li>
                    )}
                </ul>
            )}
        </div>
    );
});

export default SearchableDropdown;