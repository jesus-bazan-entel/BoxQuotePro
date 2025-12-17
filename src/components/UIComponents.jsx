import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

// Reusable Components
export function NumberInput({ label, value, onChange, suffix, prefix, icon, step = "any" }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                {icon && icon}
                {label}
            </label>
            <div className="relative group">
                {prefix && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium pointer-events-none">
                        {prefix}
                    </div>
                )}
                <input
                    type="number"
                    step={step}
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className={cn(
                        "w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 font-medium transition-all",
                        "focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500",
                        prefix && "pl-7",
                        suffix && "pr-10"
                    )}
                />
                {suffix && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium pointer-events-none">
                        {suffix}
                    </div>
                )}
            </div>
        </div>
    )
}

export function MaterialOption({ label, sub, value, selected, onClick, price }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "relative p-4 rounded-xl border-2 text-left transition-all duration-200",
                selected
                    ? "border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600 ring-offset-2"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
            )}
        >
            <div className="flex justify-between items-start mb-1">
                <span className={cn("font-bold", selected ? "text-indigo-900" : "text-slate-700")}>{label}</span>
                {selected && <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse" />}
            </div>
            <div className="text-xs text-slate-500 mb-3">{sub}</div>
            <div className={cn("text-sm font-medium", selected ? "text-indigo-700" : "text-slate-600")}>
                ${price.toFixed(2)} / m²
            </div>
        </button>
    )
}

export function CostRow({ label, value, detail, color, total }) {
    const numericValue = Number(value) || 0; // Guard against NaN
    const numericTotal = Number(total) || 1; // Prevent div by zero
    const percentage = Math.min((numericValue / numericTotal) * 100, 100);

    return (
        <div>
            <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600">{label}</span>
                <span className="font-bold text-slate-800">${numericValue.toFixed(2)}</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                    className={cn("h-full rounded-full transition-all duration-500", color)}
                    style={{ width: `${percentage}%` }}
                />
            </div>
            {detail && <div className="text-xs text-slate-400 mt-1 text-right">{detail}</div>}
        </div>
    )
}
