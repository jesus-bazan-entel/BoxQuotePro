import React, { useState, useEffect } from 'react';
import {
  Box,
  Printer,
  Calculator,
  LayoutGrid
} from 'lucide-react';
import { cn } from './lib/utils';
import QuoteCalculator from './components/QuoteCalculator';
import Optimizer from './components/Optimizer';

function App() {
  const [activeTab, setActiveTab] = useState('quote'); // 'quote' | 'optimizer'

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-indigo-100 selection:text-indigo-900 pb-12">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200 print:static print:border-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <Box size={24} strokeWidth={2.5} />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-700 to-indigo-500 bg-clip-text text-transparent">
              BoxQuote Pro
            </h1>
          </div>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors print:hidden"
          >
            <Printer size={18} />
            <span className="hidden sm:inline">Imprimir Reporte</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8 print:hidden">
          <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 flex items-center gap-1">
            <TabButton
              active={activeTab === 'quote'}
              onClick={() => setActiveTab('quote')}
              icon={<Calculator size={18} />}
              label="Cotizador"
            />
            <TabButton
              active={activeTab === 'optimizer'}
              onClick={() => setActiveTab('optimizer')}
              icon={<LayoutGrid size={18} />}
              label="Optimizador de Cortes IA"
            />
          </div>
        </div>

        {/* Content Area */}
        {activeTab === 'quote' ? <QuoteCalculator /> : <Optimizer />}

      </main>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300",
        active
          ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
      )}
    >
      {icon}
      {label}
    </button>
  )
}

export default App;
