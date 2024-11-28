import React, { useState, useMemo } from 'react';
import { Button } from './ui/Button';
import { tours } from '../data/tours';
import { staff } from '../data/staff';
import { vehicles } from '../data/vehicles';
import { useBookingStore } from '../store/bookingStore';
import type { TourType, PaymentMethod } from '../types';

export function BookingForm() {
  const addBooking = useBookingStore((state) => state.addBooking);
  const [formData, setFormData] = useState({
    tourType: '' as TourType,
    date: '',
    time: '',
    customers: 1,
    guideId: '',
    sellerId: '',
    cashierId: '',
    vehicleIds: [] as string[],
    paymentMethod: 'Efectivo' as PaymentMethod,
    deposit: 0,
    manualCost: 0,
    useManualCost: false,
  });

  const tour = useMemo(
    () => tours.find((t) => t.type === formData.tourType),
    [formData.tourType]
  );

  const baseCost = useMemo(() => {
    if (!tour) return 0;
    return formData.useManualCost
      ? formData.manualCost
      : tour.price * formData.customers;
  }, [tour, formData.customers, formData.useManualCost, formData.manualCost]);

  const totalCost = useMemo(() => {
    if (!baseCost) return 0;
    return formData.paymentMethod === 'Terminal'
      ? baseCost * 1.04
      : baseCost;
  }, [baseCost, formData.paymentMethod]);

  const remainingPayment = totalCost - formData.deposit;

  const availableVehicles = useMemo(() => {
    if (!formData.tourType) return [];

    switch (formData.tourType) {
      case 'Cuatrimotos':
        return vehicles.filter((v) => v.isATV);
      case 'Mixto a Venados':
      case 'Rutas largas':
        return vehicles;
      case 'Cabalgatas':
      case 'Reserva de Venados':
      case 'Túneles Volcánicos':
        return vehicles.filter((v) => !v.isATV);
      default:
        return [];
    }
  }, [formData.tourType]);

  const handleVehicleSelection = (vehicleId: string) => {
    const vehicle = vehicles.find((v) => v.id === vehicleId);
    if (!vehicle) return;

    if (vehicle.isATV) {
      const currentATVs = formData.vehicleIds.filter((id) =>
        vehicles.find((v) => v.id === id)?.isATV
      );
      if (currentATVs.length >= 3) {
        alert('Un guía solo puede llevar hasta 3 cuatrimotos por tour.');
        return;
      }
    }

    setFormData((prev) => ({
      ...prev,
      vehicleIds: prev.vehicleIds.includes(vehicleId)
        ? prev.vehicleIds.filter((id) => id !== vehicleId)
        : [...prev.vehicleIds, vehicleId],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tour) return;

    addBooking({
      id: crypto.randomUUID(),
      ...formData,
      date: new Date(`${formData.date}T${formData.time}`),
      baseCost,
      totalCost,
      remainingPayment,
      paymentStatus: remainingPayment <= 0 ? 'Liquidado' : 'Pendiente',
    });

    setFormData({
      tourType: '' as TourType,
      date: '',
      time: '',
      customers: 1,
      guideId: '',
      sellerId: '',
      cashierId: '',
      vehicleIds: [],
      paymentMethod: 'Efectivo',
      deposit: 0,
      manualCost: 0,
      useManualCost: false,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tour
          </label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.tourType}
            onChange={(e) =>
              setFormData({
                ...formData,
                tourType: e.target.value as TourType,
                vehicleIds: [],
              })
            }
            required
          >
            <option value="">Selecciona un tour</option>
            {tours.map((tour) => (
              <option key={tour.id} value={tour.type}>
                {tour.type}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Fecha
            </label>
            <input
              type="date"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Hora
            </label>
            <input
              type="time"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Número de Clientes
          </label>
          <input
            type="number"
            min="1"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.customers}
            onChange={(e) =>
              setFormData({ ...formData, customers: Number(e.target.value) })
            }
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Vendedor
            </label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.sellerId}
              onChange={(e) =>
                setFormData({ ...formData, sellerId: e.target.value })
              }
              required
            >
              <option value="">Selecciona un vendedor</option>
              {staff
                .filter((s) => s.roles.includes('seller'))
                .map((seller) => (
                  <option key={seller.id} value={seller.id}>
                    {seller.name}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Personal que recibe el pago
            </label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.cashierId}
              onChange={(e) =>
                setFormData({ ...formData, cashierId: e.target.value })
              }
              required
            >
              <option value="">Selecciona un personal</option>
              {staff
                .filter((s) => s.roles.includes('cashier'))
                .map((cashier) => (
                  <option key={cashier.id} value={cashier.id}>
                    {cashier.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Guía
          </label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.guideId}
            onChange={(e) =>
              setFormData({ ...formData, guideId: e.target.value })
            }
            required
          >
            <option value="">Selecciona un guía</option>
            {staff
              .filter((s) => s.roles.includes('guide'))
              .map((guide) => (
                <option key={guide.id} value={guide.id}>
                  {guide.name}
                </option>
              ))}
          </select>
        </div>

        {formData.tourType && availableVehicles.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {availableVehicles[0].isATV ? 'Cuatrimotos' : 'Vehículos'} Disponibles
            </label>
            <div className="grid grid-cols-2 gap-2">
              {availableVehicles.map((vehicle) => (
                <button
                  key={vehicle.id}
                  type="button"
                  onClick={() => handleVehicleSelection(vehicle.id)}
                  className={`p-2 rounded border ${
                    formData.vehicleIds.includes(vehicle.id)
                      ? 'bg-blue-100 border-blue-500'
                      : 'border-gray-300 hover:border-blue-500'
                  }`}
                >
                  {vehicle.type} ({vehicle.capacity} personas)
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Método de Pago
            </label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.paymentMethod}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  paymentMethod: e.target.value as PaymentMethod,
                })
              }
              required
            >
              <option value="Efectivo">Efectivo</option>
              <option value="Terminal">Terminal (+4%)</option>
              <option value="Transferencia">Transferencia</option>
            </select>
          </div>

          {tour && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="useManualCost"
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  checked={formData.useManualCost}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      useManualCost: e.target.checked,
                      manualCost: e.target.checked ? tour.price * formData.customers : 0,
                    })
                  }
                />
                <label
                  htmlFor="useManualCost"
                  className="text-sm font-medium text-gray-700"
                >
                  Editar costo manualmente
                </label>
              </div>

              {formData.useManualCost ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Costo Manual del Tour
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={formData.manualCost}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        manualCost: Number(e.target.value),
                      })
                    }
                    required
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Costo del Tour
                  </label>
                  <div className="mt-1 block w-full p-2 bg-gray-50 rounded-md border border-gray-300">
                    ${baseCost.toFixed(2)}
                  </div>
                </div>
              )}

              {formData.paymentMethod === 'Terminal' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Costo Total (con cargo del 4%)
                  </label>
                  <div className="mt-1 block w-full p-2 bg-gray-50 rounded-md border border-gray-300">
                    ${totalCost.toFixed(2)}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Anticipo
                </label>
                <input
                  type="number"
                  min="0"
                  max={totalCost}
                  step="0.01"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.deposit}
                  onChange={(e) =>
                    setFormData({ ...formData, deposit: Number(e.target.value) })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Pago Restante
                </label>
                <div className="mt-1 block w-full p-2 bg-gray-50 rounded-md border border-gray-300">
                  ${remainingPayment.toFixed(2)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Button type="submit" className="w-full">
        Registrar Venta
      </Button>
    </form>
  );
}