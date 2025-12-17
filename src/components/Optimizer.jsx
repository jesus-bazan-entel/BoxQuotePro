import React, { useState, useEffect, useRef } from 'react';
import {
    Puzzle,
    Trash2,
    Plus,
    Play,
    RotateCcw,
    LayoutGrid
} from 'lucide-react';
import { NumberInput } from './UIComponents';
import { cn } from '../lib/utils';
import { BinPacker } from '../lib/packer';

export default function Optimizer() {
    // State: Mother Sheet
    const [sheet, setSheet] = useState({ w: 200, h: 100 }); // cm

    // State: Items (Boxes to cut)
    // { id, w, h, q, name }
    const [items, setItems] = useState([
        { id: 1, name: 'Caja A', w: 30, h: 20, q: 5 },
        { id: 2, name: 'Caja B', w: 40, h: 40, q: 2 },
    ]);

    // State: Result
    const [result, setResult] = useState(null);

    const addItem = () => {
        const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
        setItems([...items, { id: newId, name: `Caja ${newId}`, w: 20, h: 20, q: 1 }]);
    };

    const removeItem = (id) => {
        setItems(items.filter(i => i.id !== id));
    };

    const updateItem = (id, field, value) => {
        setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));
    };

    const handleOptimize = () => {
        const packer = new BinPacker(sheet.w, sheet.h);
        // Convert logic items to packer items
        const packerItems = items.map(i => ({
            id: i.id,
            w: i.w,
            h: i.h,
            q: i.q,
            name: i.name,
            color: getColor(i.id)
        }));

        const packResult = packer.fit(packerItems);
        setResult(packResult);
    };

    // Helper for consistent colors
    const getColor = (id) => {
        const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'];
        return colors[id % colors.length];
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
            {/* Configuration */}
            <div className="lg:col-span-5 space-y-6">
                <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center gap-2 mb-6 text-indigo-900">
                        <LayoutGrid className="w-5 h-5" />
                        <h2 className="text-lg font-bold">Plancha Madre (Materia Prima)</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <NumberInput
                            label="Ancho Total"
                            value={sheet.w}
                            onChange={(v) => setSheet(s => ({ ...s, w: v }))}
                            suffix="cm"
                        />
                        <NumberInput
                            label="Alto Total"
                            value={sheet.h}
                            onChange={(v) => setSheet(s => ({ ...s, h: v }))}
                            suffix="cm"
                        />
                    </div>
                </section>

                <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-6 text-indigo-900">
                        <div className="flex items-center gap-2">
                            <Puzzle className="w-5 h-5" />
                            <h2 className="text-lg font-bold">Piezas a Cortar</h2>
                        </div>
                        <button
                            onClick={addItem}
                            className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                        >
                            <Plus size={20} />
                        </button>
                    </div>

                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                        {items.map((item) => (
                            <div key={item.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-end gap-3 group">
                                <div className="flex-1 space-y-2">
                                    <div className="flex gap-2">
                                        <input
                                            value={item.name}
                                            onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                                            className="w-full bg-transparent text-sm font-semibold text-slate-700 focus:outline-none border-b border-transparent focus:border-indigo-300"
                                        />
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="flex flex-col">
                                            <label className="text-[10px] text-slate-400 uppercase font-bold">Ancho</label>
                                            <input
                                                type="number"
                                                value={item.w}
                                                onChange={(e) => updateItem(item.id, 'w', Number(e.target.value))}
                                                className="w-full bg-white rounded border border-slate-200 px-2 py-1 text-xs"
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <label className="text-[10px] text-slate-400 uppercase font-bold">Alto</label>
                                            <input
                                                type="number"
                                                value={item.h}
                                                onChange={(e) => updateItem(item.id, 'h', Number(e.target.value))}
                                                className="w-full bg-white rounded border border-slate-200 px-2 py-1 text-xs"
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <label className="text-[10px] text-slate-400 uppercase font-bold">Cant.</label>
                                            <input
                                                type="number"
                                                value={item.q}
                                                onChange={(e) => updateItem(item.id, 'q', Number(e.target.value))}
                                                className="w-full bg-white rounded border border-slate-200 px-2 py-1 text-xs font-bold text-indigo-600"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeItem(item.id)}
                                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={handleOptimize}
                        className="w-full mt-6 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 transition-all hover:scale-[1.02]"
                    >
                        <Play size={20} fill="currentColor" />
                        Optimizar Cortes
                    </button>
                </section>
            </div>

            {/* Visualizer */}
            <div className="lg:col-span-7">
                <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-slate-800">Visualización de Corte</h2>
                        {result && (
                            <div className="flex items-center gap-4">
                                <div className="text-sm">
                                    <span className="text-slate-500">Eficiencia:</span>
                                    <span className={cn(
                                        "ml-2 font-bold",
                                        result.efficiency > 80 ? 'text-emerald-500' : 'text-amber-500'
                                    )}>{result.efficiency.toFixed(1)}%</span>
                                </div>
                                <div className="text-sm">
                                    <span className="text-slate-500">Piezas:</span>
                                    <span className="ml-2 font-bold text-slate-800">{result.packedItems.length}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 bg-slate-100/50 rounded-xl border border-slate-200 p-4 flex items-center justify-center overflow-auto">
                        {!result ? (
                            <div className="text-center text-slate-400">
                                <LayoutGrid size={48} className="mx-auto mb-3 opacity-20" />
                                <p>Configura las piezas y presiona Optimizar</p>
                            </div>
                        ) : (
                            <div
                                className="relative bg-white border-2 border-slate-800 shadow-xl transition-all duration-500"
                                style={{
                                    // Scale factor for visualization
                                    width: `${Math.min(600, sheet.w * 3)}px`,
                                    aspectRatio: `${sheet.w}/${sheet.h}`
                                }}
                            >
                                {/* Render Items */}
                                {result.packedItems.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="absolute border border-slate-900/10 flex items-center justify-center text-white text-xs font-bold overflow-hidden group hover:z-10 hover:shadow-lg transition-all"
                                        style={{
                                            left: `${(item.x / sheet.w) * 100}%`,
                                            top: `${(item.y / sheet.h) * 100}%`,
                                            width: `${(item.w / sheet.w) * 100}%`,
                                            height: `${(item.h / sheet.h) * 100}%`,
                                            backgroundColor: item.color
                                        }}
                                        title={`${item.name} (${item.w}x${item.h})`}
                                    >
                                        <span className="opacity-80 group-hover:opacity-100">{item.name}</span>
                                        {item.rotated && <RotateCcw size={12} className="absolute top-1 right-1 opacity-50" />}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {result && result.unsuccessfulItems.length > 0 && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-700">
                            <strong>Atención:</strong> {result.unsuccessfulItems.length} pieza(s) no cupieron en la plancha única.
                            <ul className="list-disc pl-4 mt-1 text-xs">
                                {result.unsuccessfulItems.slice(0, 3).map((u, i) => (
                                    <li key={i}>{u.name} ({u.w}x{u.h})</li>
                                ))}
                                {result.unsuccessfulItems.length > 3 && <li>...y más</li>}
                            </ul>
                        </div>
                    )}
                </section>
            </div>
        </div>
    )
}
