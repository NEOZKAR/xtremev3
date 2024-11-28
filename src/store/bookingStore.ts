import { create } from 'zustand';
import { Booking } from '../types';

interface BookingStore {
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  updateBooking: (id: string, booking: Partial<Booking>) => void;
  cancelBooking: (id: string, reason: Booking['cancellationReason']) => void;
}

export const useBookingStore = create<BookingStore>((set) => ({
  bookings: [],
  addBooking: (booking) =>
    set((state) => ({ bookings: [...state.bookings, booking] })),
  updateBooking: (id, updatedBooking) =>
    set((state) => ({
      bookings: state.bookings.map((booking) =>
        booking.id === id ? { ...booking, ...updatedBooking } : booking
      ),
    })),
  cancelBooking: (id, reason) =>
    set((state) => ({
      bookings: state.bookings.map((booking) =>
        booking.id === id
          ? { ...booking, cancelled: true, cancellationReason: reason }
          : booking
      ),
    })),
}));