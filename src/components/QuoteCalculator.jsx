import React, { useState } from 'react';
import {
    Package,
    Layers,
    Factory,
    Megaphone,
    Target,
    TrendingUp,
    Calculator,
    PieChart
} from 'lucide-react';
import { cn } from '../lib/utils';
import { NumberInput, MaterialOption, CostRow } from './UIComponents';
import { supabase } from '../lib/supabase';
import { Save } from 'lucide-react';

export default function QuoteCalculator() {
    // State: Material Costs
    const [materialCosts, setMaterialCosts] = useState({
        typeA: 0.85, // Default example
        typeB: 1.20,
    });

    // State: Dimensions (cm)
    const [dimensions, setDimensions] = useState({
        length: 30,
        width: 20,
        height: 15,
    });

    // State: Selection & Ops
    const [selectedMaterial, setSelectedMaterial] = useState('A');
    const [operationalCosts, setOperationalCosts] = useState({
        fabrication: 0.50,
        marketing: 0.20,
    });
    const [margin, setMargin] = useState(30); // %
    const [volume, setVolume] = useState(1000);

    // Calculations
    const calculations = React.useMemo(() => {
        // Area in cm^2
        const areaRawCm2 =
            2 * (dimensions.length * dimensions.width) +
            2 * (dimensions.length * dimensions.height) +
            2 * (dimensions.width * dimensions.height);

        // Area in m^2 with waste factor (1.25)
        // Formula: (AreaRaw / 10000) * 1.25
        const areaFinalM2 = (areaRawCm2 / 10000) * 1.25;

        // Material Cost
        const pricePerM2 = selectedMaterial === 'A' ? materialCosts.typeA : materialCosts.typeB;
        const costMaterial = areaFinalM2 * pricePerM2;

        // Total Unit Cost
        const costUnitTotal = costMaterial + parseFloat(operationalCosts.fabrication) + parseFloat(operationalCosts.marketing);

        // Unit Price with Margin
        const priceUnit = costUnitTotal * (1 + margin / 100);

        // Profit
        const profitUnit = priceUnit - costUnitTotal;

        // Project Totals
        const totalProjectCost = costUnitTotal * volume;
        const totalProjectRevenue = priceUnit * volume;
        const totalProjectProfit = profitUnit * volume;

        return {
            areaRawCm2,
            areaFinalM2,
            costMaterial,
            costUnitTotal,
            priceUnit,
            profitUnit,
            totalProjectCost,
            totalProjectRevenue,
            totalProjectProfit
        };
    }, [materialCosts, dimensions, selectedMaterial, operationalCosts, margin, volume]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">

            {/* LEFT PANEL: Configuration */}
            <div className="lg:col-span-7 space-y-6 print:w-full">

                {/* 1. Project & Dimensions */}
                <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center gap-2 mb-6 text-indigo-900">
                        <Package className="w-5 h-5" />
                        <h2 className="text-lg font-bold">Especificaciones del Producto</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                        <NumberInput
                            label="Largo (L)"
                            value={dimensions.length}
                            onChange={(v) => setDimensions(d => ({ ...d, length: v }))}
                            suffix="cm"
                        />
                        <NumberInput
                            label="Ancho (W)"
                            value={dimensions.width}
                            onChange={(v) => setDimensions(d => ({ ...d, width: v }))}
                            suffix="cm"
                        />
                        <NumberInput
                            label="Alto (H)"
                            value={dimensions.height}
                            onChange={(v) => setDimensions(d => ({ ...d, height: v }))}
                            suffix="cm"
                        />
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <label className="block text-sm font-medium text-slate-700 mb-3">Volumen del Proyecto (Unidades)</label>
                        <input
                            type="number"
                            value={volume}
                            onChange={(e) => setVolume(Number(e.target.value))}
                            className="w-full text-2xl font-bold text-slate-900 bg-transparent border-b-2 border-slate-200 focus:border-indigo-500 focus:outline-none transition-colors py-1"
                        />
                    </div>
                </section>

                {/* 2. Material Costs & Selection */}
                <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center gap-2 mb-6 text-indigo-900">
                        <Layers className="w-5 h-5" />
                        <h2 className="text-lg font-bold">Material e Insumos</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col gap-2">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Costo Plancha A ($/m²)</label>
                            <div className="flex items-center">
                                <span className="text-slate-400 mr-2">$</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={materialCosts.typeA}
                                    onChange={(e) => setMaterialCosts(prev => ({ ...prev, typeA: Number(e.target.value) }))}
                                    className="w-full bg-transparent font-medium focus:outline-none"
                                />
                            </div>
                        </div>
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col gap-2">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Costo Plancha B ($/m²)</label>
                            <div className="flex items-center">
                                <span className="text-slate-400 mr-2">$</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={materialCosts.typeB}
                                    onChange={(e) => setMaterialCosts(prev => ({ ...prev, typeB: Number(e.target.value) }))}
                                    className="w-full bg-transparent font-medium focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <MaterialOption
                            label="Tipo A"
                            sub="Corrugado Simple"
                            value="A"
                            selected={selectedMaterial === 'A'}
                            onClick={() => setSelectedMaterial('A')}
                            price={materialCosts.typeA}
                        />
                        <MaterialOption
                            label="Tipo B"
                            sub="Corrugado Doble"
                            value="B"
                            selected={selectedMaterial === 'B'}
                            onClick={() => setSelectedMaterial('B')}
                            price={materialCosts.typeB}
                        />
                    </div>
                </section>

                {/* 3. Operational Costs */}
                <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center gap-2 mb-6 text-indigo-900">
                        <Factory className="w-5 h-5" />
                        <h2 className="text-lg font-bold">Costos Operativos (Unitarios)</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <NumberInput
                            label="Costo Fabricación"
                            icon={<Factory size={16} />}
                            value={operationalCosts.fabrication}
                            onChange={(v) => setOperationalCosts(c => ({ ...c, fabrication: v }))}
                            prefix="$"
                            step="0.01"
                        />
                        <NumberInput
                            label="Costo Marketing"
                            icon={<Megaphone size={16} />}
                            value={operationalCosts.marketing}
                            onChange={(v) => setOperationalCosts(c => ({ ...c, marketing: v }))}
                            prefix="$"
                            step="0.01"
                        />
                    </div>
                </section>

                {/* 4. Margin Strategy */}
                <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2 text-indigo-900">
                            <Target className="w-5 h-5" />
                            <h2 className="text-lg font-bold">Estrategia de Precio</h2>
                        </div>
                        <div className="text-2xl font-bold text-indigo-600">{margin}% <span className="text-sm font-normal text-slate-500">Margen</span></div>
                    </div>

                    <div className="px-2">
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={margin}
                            onChange={(e) => setMargin(Number(e.target.value))}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                        <div className="flex justify-between mt-2 text-xs text-slate-400 font-medium">
                            <span>0% (Costo)</span>
                            <span>50%</span>
                            <span>100% (x2)</span>
                        </div>
                    </div>
                </section>

            </div>

            {/* RIGHT PANEL: Results (Sticky) */}
            <div className="lg:col-span-5 space-y-6 print:break-before-page">
                <div className="sticky top-24 space-y-6">

                    {/* Hero Card */}
                    <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-700"></div>
                        <div className="relative z-10">
                            <div className="mb-1 text-indigo-300 text-sm font-medium uppercase tracking-wider">Precio Unitario Sugerido</div>
                            <div className="text-5xl font-bold mb-4 tracking-tight">
                                ${calculations.priceUnit.toFixed(2)}
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm text-emerald-400 bg-emerald-400/10 w-fit px-3 py-1 rounded-full border border-emerald-400/20">
                                    <TrendingUp size={14} />
                                    <span>Ganancia: ${calculations.profitUnit.toFixed(2)} / unidad</span>
                                </div>
                                <button
                                    onClick={async () => {
                                        const { error } = await supabase.from('quotes').insert({
                                            length_cm: dimensions.length,
                                            width_cm: dimensions.width,
                                            height_cm: dimensions.height,
                                            material_type: selectedMaterial,
                                            volume: volume,
                                            material_unit_cost: selectedMaterial === 'A' ? materialCosts.typeA : materialCosts.typeB,
                                            fab_cost: operationalCosts.fabrication,
                                            mkt_cost: operationalCosts.marketing,
                                            margin_percent: margin,
                                            final_unit_price: calculations.priceUnit,
                                            unif_profit: calculations.profitUnit,
                                            total_project_profit: calculations.totalProjectProfit
                                        });

                                        if (error) alert('Error al guardar: ' + error.message);
                                        else alert('Cotización guardada en Historial.');
                                    }}
                                    className="p-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white transition-colors shadow-lg shadow-indigo-900/50"
                                    title="Guardar en Base de Datos"
                                >
                                    <Save size={20} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Breakdown */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center gap-2 mb-6 text-indigo-900">
                            <Calculator className="w-5 h-5" />
                            <h2 className="text-lg font-bold">Estructura de Costos</h2>
                        </div>

                        <div className="space-y-4">
                            <CostRow
                                label="Material (Cartón)"
                                value={calculations.costMaterial}
                                color="bg-blue-500"
                                total={calculations.priceUnit}
                                detail={`${calculations.areaFinalM2.toFixed(4)} m² incl. desp.`}
                            />
                            <CostRow
                                label="Fabricación"
                                value={operationalCosts.fabrication}
                                color="bg-amber-500"
                                total={calculations.priceUnit}
                            />
                            <CostRow
                                label="Marketing / Otros"
                                value={operationalCosts.marketing}
                                color="bg-purple-500"
                                total={calculations.priceUnit}
                            />
                            <div className="pt-4 mt-4 border-t border-slate-100 flex justify-between items-end">
                                <span className="text-slate-500 font-medium">Costo Total Unitario</span>
                                <span className="text-xl font-bold text-slate-800">${calculations.costUnitTotal.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Project KPIs */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center gap-2 mb-6 text-indigo-900">
                            <PieChart className="w-5 h-5" />
                            <h2 className="text-lg font-bold">Resumen del Proyecto</h2>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-indigo-50 rounded-xl">
                                <div className="text-xs font-semibold text-indigo-600 uppercase mb-1">Costo Total</div>
                                <div className="text-lg font-bold text-indigo-900">${calculations.totalProjectCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                            </div>
                            <div className="p-4 bg-emerald-50 rounded-xl">
                                <div className="text-xs font-semibold text-emerald-600 uppercase mb-1">Beneficio Total</div>
                                <div className="text-lg font-bold text-emerald-900">${calculations.totalProjectProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                            </div>
                        </div>

                        <div className="mt-4 p-4 bg-slate-50 rounded-xl flex justify-between items-center text-sm">
                            <span className="text-slate-500">Superficie Total Requerida</span>
                            <span className="font-mono font-bold text-slate-700">
                                {((calculations.areaFinalM2 * volume)).toFixed(2)} m²
                            </span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
