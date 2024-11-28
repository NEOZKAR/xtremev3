export type TourType = 'Cabalgatas' | 'Cuatrimotos' | 'Mixto a Venados' | 'Reserva de Venados' | 'Rutas largas' | 'Túneles Volcánicos';

export type PaymentMethod = 'Efectivo' | 'Terminal' | 'Transferencia';
export type PaymentStatus = 'Pendiente' | 'Liquidado';
export type CancellationReason = 'Cancelado por el Cliente' | 'Cancelado por el Clima' | 'Otro';

export interface Tour {
  id: string;
  type: TourType;
  duration: number; // in minutes
  maxCapacity: number;
  price: number;
}

export interface Guide {
  id: string;
  name: string;
  roles: ('guide' | 'seller' | 'cashier')[];
}

export interface Vehicle {
  id: string;
  type: string;
  capacity: number;
  isATV?: boolean;
}

export interface Booking {
  id: string;
  tourType: TourType;
  date: Date;
  customers: number;
  guideId: string;
  vehicleIds: string[];
  baseCost: number;
  totalCost: number;
  deposit: number;
  remainingPayment: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  sellerId: string;
  cashierId: string;
  notes?: string;
  cancellationReason?: CancellationReason;
  cancelled?: boolean;
}