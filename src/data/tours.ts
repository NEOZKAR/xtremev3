import { Tour } from '../types';

export const tours: Tour[] = [
  {
    id: 'Cabalgatas',
    type: 'Cabalgatas',
    duration: 90,
    maxCapacity: 20,
    price: 1200,
  },
  {
    id: 'Cuatrimotos',
    type: 'Cuatrimotos',
    duration: 90,
    maxCapacity: 12, // 6 ATVs × 2 customers
    price: 1300,
  },
  {
    id: 'Mixto a Venados',
    type: 'Mixto a Venados',
    duration: 105,
    maxCapacity: 20,
    price: 800,
  },
  {
    id: 'Reserva de Venados',
    type: 'Reserva de Venados',
    duration: 90,
    maxCapacity: 20,
    price: 400,
  },
  {
    id: 'Rutas largas',
    type: 'Rutas largas',
    duration: 180,
    maxCapacity: 16,
    price: 0,
  },
  {
    id: 'Túneles Volcánicos',
    type: 'Túneles Volcánicos',
    duration: 120,
    maxCapacity: 20,
    price: 700,
  },
];