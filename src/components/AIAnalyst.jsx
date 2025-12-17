import React, { useState, useEffect } from 'react';
import {
    Brain,
    Sparkles,
    History,
    AlertTriangle,
    Key,
    RefreshCw,
    TrendingDown
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { analyzeQuotesWithGemini } from '../lib/aiSelect';

export default function AIAnalyst() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('quotes')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(50);

        if (!error && data) {
            setHistory(data);
        }
        setLoading(false);
    };

    const handleRunAnalysis = async () => {
        if (!apiKey) return alert("Por favor ingresa tu API Key de Gemini");
        if (history.length === 0) return alert("No hay historial para analizar");

        setAnalyzing(true);
        try {
            const text = await analyzeQuotesWithGemini(apiKey, history);
            setAnalysisResult(text);
        } catch (e) {
            alert(e.message);
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">

            {/* Configuration & History Sidebar */}
            <div className="lg:col-span-4 space-y-6">



                {/* Recent Quotes List */}
                <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex-1 flex flex-col h-[500px]">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-indigo-900">
                            <History className="w-5 h-5" />
                            <h2 className="text-lg font-bold">Historial ({history.length})</h2>
                        </div>
                        <button onClick={fetchHistory} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                            <RefreshCw size={16} className={loading ? "animate-spin text-indigo-600" : "text-slate-400"} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                        {loading && <p className="text-center text-sm text-slate-400 py-10">Cargando datos...</p>}

                        {!loading && history.length === 0 && (
                            <div className="text-center py-10 opacity-50">
                                <History size={48} className="mx-auto mb-2" />
                                <p className="text-sm">Sin cotizaciones guardadas aún.</p>
                            </div>
                        )}

                        {history.map((item) => (
                            <div key={item.id} className="p-3 border border-slate-100 rounded-lg hover:border-indigo-200 hover:bg-indigo-50/30 transition-all text-sm group relative">
                                <div className="flex justify-between font-bold text-slate-700">
                                    <span>{item.length_cm}x{item.width_cm}x{item.height_cm} cm</span>
                                    <span className="text-emerald-600">${item.final_unit_price}</span>
                                </div>
                                <div className="flex justify-between text-xs text-slate-500 mt-1">
                                    <span>Vol: {item.volume} | Mat: {item.material_type}</span>
                                    <span
                                        className={item.margin_percent < 20 ? "text-red-500 font-bold" : "text-slate-400"}
                                    >
                                        Mg: {item.margin_percent}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Main Analysis Area */}
            <div className="lg:col-span-8">
                <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 min-h-[600px] flex flex-col items-center justify-center relative overflow-hidden">

                    {!analysisResult && !analyzing && (
                        <div className="text-center max-w-md">
                            <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Brain size={48} />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">Análisis de Rentabilidad IA</h2>
                            <p className="text-slate-500 mb-8">
                                Utiliza Inteligencia Artificial para auditar tu historial de cotizaciones, detectar fugas de dinero y sugerir optimizaciones de margen.
                            </p>
                            <button
                                onClick={handleRunAnalysis}
                                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-lg shadow-xl shadow-indigo-200 hover:scale-[1.02] transition-transform flex items-center gap-2 mx-auto"
                            >
                                <Sparkles size={20} />
                                Analizar Mi Negocio
                            </button>
                        </div>
                    )}

                    {analyzing && (
                        <div className="text-center animate-pulse">
                            <Brain size={64} className="mx-auto text-indigo-500 mb-4 animate-bounce" />
                            <h3 className="text-xl font-bold text-slate-800">Analizando patrones...</h3>
                            <p className="text-slate-500">Conectando con Gemini 1.5 Pro</p>
                        </div>
                    )}

                    {analysisResult && (
                        <div className="w-full h-full text-left animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                                <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-700 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
                                    <Sparkles className="text-indigo-600" />
                                    Reporte de Inteligencia
                                </h2>
                                <button
                                    onClick={() => setAnalysisResult(null)}
                                    className="text-sm text-slate-400 hover:text-indigo-600 underline"
                                >
                                    Resetear
                                </button>
                            </div>

                            <div className="prose prose-indigo max-w-none text-slate-600 bg-slate-50 p-6 rounded-xl border border-slate-100">
                                {/* Simple formatting for the result since it's raw text/markdown */}
                                <div className="whitespace-pre-line leading-relaxed">
                                    {analysisResult}
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            </div>

        </div>
    )
}
