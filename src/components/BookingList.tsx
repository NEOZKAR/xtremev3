import React from 'react';
import { format } from 'date-fns';
import { useBookingStore } from '../store/bookingStore';
import { Button } from './ui/Button';
import { staff } from '../data/staff';

export function BookingList() {
  const bookings = useBookingStore((state) => state.bookings);
  const cancelBooking = useBookingStore((state) => state.cancelBooking);

  const getStaffName = (id: string) => {
    return staff.find((s) => s.id === id)?.name || 'Unknown';
  };

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <div
          key={booking.id}
          className="border rounded-lg p-4 shadow-sm bg-white"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">
                {booking.tourType}
              </h3>
              <p className="text-gray-600">
                {format(booking.date, 'PPP p')}
              </p>
              <p className="text-sm text-gray-600">
                Clientes: {booking.customers}
              </p>
              <p className="text-sm text-gray-600">
                Vendedor: {getStaffName(booking.sellerId)}
              </p>
              <p className="text-sm text-gray-600">
                Personal que recibe pago: {getStaffName(booking.cashierId)}
              </p>
              <p className="text-sm text-gray-600">
                Guía: {getStaffName(booking.guideId)}
              </p>
              <div className="mt-2 space-y-1">
                <p className="text-sm">
                  Costo base: ${booking.baseCost.toFixed(2)}
                </p>
                {booking.paymentMethod === 'Terminal' && (
                  <p className="text-sm">
                    Costo total (con cargo 4%): ${booking.totalCost.toFixed(2)}
                  </p>
                )}
                <p className="text-sm">
                  Método de pago: {booking.paymentMethod}
                </p>
                <p className="text-sm">
                  Anticipo: ${booking.deposit.toFixed(2)}
                </p>
                <p>
                  Estado de Pago:{' '}
                  <span
                    className={
                      booking.paymentStatus === 'Liquidado'
                        ? 'text-green-600 font-medium'
                        : 'text-red-600 font-medium'
                    }
                  >
                    {booking.paymentStatus}
                    {booking.paymentStatus === 'Pendiente' &&
                      ` ($${booking.remainingPayment.toFixed(2)} pendiente)`}
                  </span>
                </p>
              </div>
            </div>
            {!booking.cancelled && (
              <Button
                variant="destructive"
                onClick={() => cancelBooking(booking.id, 'Cancelado por el Cliente')}
              >
                Cancelar
              </Button>
            )}
          </div>
          {booking.cancelled && (
            <div className="mt-2 text-red-600">
              CANCELADO - {booking.cancellationReason}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}