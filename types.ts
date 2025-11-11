
export interface Booking {
  id: string;
  day: string; // YYYY-MM-DD format
  period: number; // 1-7
  teacher: string;
  subject: string;
  lesson: string;
  grade: string;
  class: string;
}

export interface WeekOption {
  label: string;
  value: string; // start date of the week (Sunday)
  isAvailable: boolean;
  dates: Date[];
}

export type ModalType = 'booking' | 'details' | 'password' | 'stats' | 'all-bookings' | null;

export interface SelectedSlot {
  day: string;
  period: number;
}
