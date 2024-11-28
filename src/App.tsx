import React from 'react';
import { BookingForm } from './components/BookingForm';
import { BookingList } from './components/BookingList';
import { Compass } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2">
            <Compass className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              Sistema de Ventas Xtreme Adventure
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Registro de Ventas</h2>
            <BookingForm />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">Ventas recientes</h2>
            <BookingList />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;