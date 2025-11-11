import React from 'react';

const iconClasses = "h-5 w-5 inline-block align-middle";

// Individual icon components with color
const PrayerBeadsIcon = () => <svg className={iconClasses} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 7.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM14.5 4.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM11.5 2.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM8 4.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 7.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" stroke="#8B572A" strokeWidth="1.5"/><path d="M16 7.5a5.5 5.5 0 00-11 0" stroke="#8B572A" strokeWidth="1.5" strokeLinecap="round"/><path d="M10.5 8.5a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" stroke="#8B572A" strokeWidth="1.5"/><path d="M12 10v3m-1 3h2" stroke="#8B572A" strokeWidth="1.5" strokeLinecap="round"/><path d="M12 16v4m-2 2h4m-3-2h2m-3-2h2" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round"/></svg>
const ArabicBookIcon = () => <svg className={iconClasses} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 19V6.2C4 5.0799 4 4.51984 4.21799 4.09202C4.40973 3.71569 4.71569 3.40973 5.09202 3.21799C5.51984 3 6.0799 3 7.2 3H12" stroke="#A16207" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M20 19V6.2C20 5.0799 20 4.51984 19.782 4.09202C19.5903 3.71569 19.2843 3.40973 18.908 3.21799C18.4802 3 17.9201 3 16.8 3H12" stroke="#A16207" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 3V19M12 3H11C9.89543 3 9 3.89543 9 5V7C9 8.10457 9.89543 9 11 9H12M12 3H13C14.1046 3 15 3.89543 15 5V7C15 8.10457 14.1046 9 13 9H12" stroke="#A16207" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 16H7" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round"/><path d="M17 12H15" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round"/></svg>
const EnglishGlobeIcon = () => <svg className={iconClasses} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 2c-3.1 0-5.8 1.8-7.2 4.5M12 22c3.1 0 5.8-1.8 7.2-4.5M2 12h20M12 2a14.2 14.2 0 00-3 10c0 3.9 1.3 7.4 3.5 10" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 2a14.2 14.2 0 013 10c0 3.9-1.3 7.4-3.5 10" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
const SocialStudiesIcon = () => <svg className={iconClasses} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="6" r="3" fill="#34D399"/><path d="M17 18c0-2.76-2.24-5-5-5s-5 2.24-5 5h10z" fill="#34D399"/><circle cx="6" cy="9" r="2" fill="#FBBF24"/><path d="M9 18c0-1.66-1.34-3-3-3s-3 1.34-3 3h6z" fill="#FBBF24"/><circle cx="18" cy="9" r="2" fill="#F87171"/><path d="M21 18c0-1.66-1.34-3-3-3s-3 1.34-3 3h6z" fill="#F87171"/></svg>
const MathIcon = () => <svg className={iconClasses} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2z" stroke="#6B7280" strokeWidth="2"/><path d="M8 8h8M8 12h8M8 16h8" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round"/></svg>
const PhysicsIcon = () => <svg className={iconClasses} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="2" fill="#3B82F6"/><ellipse cx="12" cy="12" rx="10" ry="4" stroke="#F87171" strokeWidth="1.5"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" stroke="#F87171" strokeWidth="1.5"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" stroke="#F87171" strokeWidth="1.5"/></svg>
const ChemistryIcon = () => <svg className={iconClasses} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 3h12l-2 18H8L6 3z" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 3h8" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round"/><path d="M10 12c.5-1 1.5-1 2 0 .5 1 1.5 1 2 0" stroke="#34D399" strokeWidth="1.5" strokeLinecap="round"/><path d="M9 16c.5-1 1.5-1 2 0 .5 1 1.5 1 2 0" stroke="#34D399" strokeWidth="1.5" strokeLinecap="round"/></svg>
const BiologyIcon = () => <svg className={iconClasses} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#ECFCCB"/><path d="M12 22c-3.1-.2-5.8-1.8-7.3-4.5M12 22c3.1-.2 5.8-1.8 7.3-4.5M12 2C8.9 2.2 6.2 3.8 4.7 6.5M12 2c3.1.2 5.8 1.8 7.3 4.5" stroke="#4D7C0F" strokeWidth="2" strokeLinecap="round"/><path d="M12 12a5 5 0 00-5 5h10a5 5 0 00-5-5zM12 2v10" stroke="#4D7C0F" strokeWidth="2" strokeLinecap="round"/></svg>
const HistoryIcon = () => <svg className={iconClasses} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 3h10v18H7v-2a2 2 0 100-4v-2a2 2 0 110-4V7a2 2 0 100-4V3z" stroke="#D97706" strokeWidth="2" fill="#FEF3C7" strokeLinecap="round" strokeLinejoin="round"/><path d="M7 3a2 2 0 10-4 2.828V18.17A2 2 0 107 21v-2a2 2 0 100-4v-2a2 2 0 110-4V7a2 2 0 100-4V3z" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
const ArtsIcon = () => <svg className={iconClasses} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.16 3.11c4.95.83 8.28 5.74 7.45 10.69-.83 4.95-5.74 8.28-10.69 7.45-4.95-.83-8.28-5.74-7.45-10.69.83-4.95 5.74-8.28 10.69-7.45z" fill="#D2B48C" stroke="#854D0E" strokeWidth="1.5"/><circle cx="15.5" cy="7.5" r="1.5" fill="#EF4444"/><circle cx="17.5" cy="11.5" r="1.5" fill="#3B82F6"/><circle cx="14.5" cy="15.5" r="1.5" fill="#FBBF24"/><circle cx="9.5" cy="16.5" r="1.5" fill="#34D399"/><path d="M8 8a2 2 0 00-4 0h8a4 4 0 11-8 0" stroke="#854D0E" strokeWidth="1.5"/></svg>
const MusicIcon = () => <svg className={iconClasses} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="18" r="3" stroke="#8B5CF6" strokeWidth="2"/><circle cx="16" cy="16" r="3" stroke="#8B5CF6" strokeWidth="2"/><path d="M11 18V5.5a2.5 2.5 0 012.5-2.5H19v10.5" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round"/></svg>
const SportsIcon = () => <svg className={iconClasses} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="#1F2937" strokeWidth="2"/><path d="M12 2l-2.83 4.86L4 8l5 4-1.88 6.14L12 15.27l4.88 2.87L15 12l5-4-5.17-1.14L12 2z" fill="#1F2937"/></svg>
const ItIcon = () => <svg className={iconClasses} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="4" width="18" height="12" rx="2" stroke="#0EA5E9" strokeWidth="2"/><path d="M7 20h10M12 16v4M8 8l2 2-2 2M13 8h3" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round"/></svg>
const TravelIcon = () => <svg className={iconClasses} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 16V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2h14a2 2 0 002-2z" stroke="#F97316" strokeWidth="2" fill="#FFEDD5"/><path d="M8 6V4h8v2M10 11h4" stroke="#F97316" strokeWidth="2" strokeLinecap="round"/></svg>
const CareerIcon = () => <svg className={iconClasses} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 20h16" stroke="#14B8A6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M14.36 4.36a2.05 2.05 0 012.9 2.9l-9.58 9.58-3.54.7.7-3.54L14.36 4.36z" stroke="#14B8A6" strokeWidth="2" strokeLinejoin="round" fill="#E6FFFA"/></svg>
const LifeSkillsIcon = () => <svg className={iconClasses} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 19a1 1 0 01-1-1v-2a1 1 0 011-1h6a1 1 0 011 1v2a1 1 0 01-1 1H9z" stroke="#F59E0B" strokeWidth="2"/><path d="M12 15V9" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/><path d="M12 9a4 4 0 100-8 4 4 0 000 8z" fill="#FEF08A" stroke="#F59E0B" strokeWidth="2"/><path d="M10 5h4" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/></svg>
const LibraryIcon = () => <svg className={iconClasses} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="3" width="12" height="18" rx="1" fill="#A78BFA" stroke="#5B21B6" strokeWidth="2"/><rect x="9" y="8" width="6" height="8" rx="1" fill="#EDE9FE" stroke="#5B21B6" strokeWidth="2"/></svg>
const DefaultIcon = () => <svg className={iconClasses} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 22h6c5 0 7-2 7-7V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M15.5 12h-7" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 15.5v-7" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>;


const subjectIconMap: Record<string, React.FC> = {
    "التربية الإسلامية": PrayerBeadsIcon,
    "اللغة العربية": ArabicBookIcon,
    "اللغة الإنجليزية": EnglishGlobeIcon,
    "الدراسات الاجتماعية": SocialStudiesIcon,
    "الرياضيات": MathIcon,
    "الفيزياء": PhysicsIcon,
    "الكيمياء": ChemistryIcon,
    "الأحياء": BiologyIcon,
    "العلوم البيئية": BiologyIcon,
    "الجغرافيا": EnglishGlobeIcon,
    "التاريخ": HistoryIcon,
    "الفنون التشكيلية": ArtsIcon,
    "المهارات الموسيقة": MusicIcon,
    "الرياضة المدرسية": SportsIcon,
    "تقنية المعلومات": ItIcon,
    "السفر والسياحة": TravelIcon,
    "التوجيه المهني": CareerIcon,
    "المهارات الحياتية": LifeSkillsIcon,
    "مسؤول مركز مصادر التعلم": LibraryIcon,
};

interface SubjectIconProps {
    subject: string;
}

const SubjectIcon: React.FC<SubjectIconProps> = ({ subject }) => {
    const IconComponent = subjectIconMap[subject] || DefaultIcon; // Default icon
    return <IconComponent />;
};

export default SubjectIcon;