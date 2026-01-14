import { useState } from 'react';
import { Clock } from 'lucide-react';

const ExpirySelector = ({ duration, setDuration }) => {
    const [isCustom, setIsCustom] = useState(false);
    const [unit, setUnit] = useState('m'); // 'm' or 'h'
    const [customValue, setCustomValue] = useState(''); // Local state for input value before conversion

    const handleCustomChange = (val, newUnit) => {
        const value = val === '' ? '' : parseInt(val);
        setCustomValue(value);
        
        const effectiveUnit = newUnit || unit;
        setUnit(effectiveUnit);

        if (value === '') {
             setDuration('');
             return;
        }

        // Calculate total minutes for parent
        const totalMinutes = effectiveUnit === 'h' ? value * 60 : value;
        setDuration(totalMinutes);
    };

    const toggleUnit = () => {
        const newUnit = unit === 'm' ? 'h' : 'm';
        handleCustomChange(customValue, newUnit);
    };
    const options = [
        { label: '1m', full: '1 Min', value: 1 },
        { label: '5m', full: '5 Mins', value: 5 },
        { label: '30m', full: '30 Mins', value: 30 },
        { label: '1h', full: '1 Hour', value: 60 },
        { label: '24h', full: '1 Day', value: 1440 },
    ];

    return (
        <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-ghost-accent" />
                <label className="text-sm font-medium text-gray-300">Time to Live</label>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
                {options.map((opt) => (
                    <button
                        key={opt.value}
                        onClick={() => {
                            setDuration(opt.value);
                            setIsCustom(false);
                        }}
                        className={`relative py-2.5 rounded-xl text-sm font-medium transition-all overflow-hidden border ${
                            duration === opt.value && !isCustom
                                ? 'border-ghost-accent bg-ghost-accent/10 text-ghost-accent shadow-lg shadow-ghost-accent/10'
                                : 'border-dark-700 bg-dark-800 text-gray-400 hover:border-gray-600 hover:text-gray-200'
                        }`}
                    >
                        {opt.label}
                    </button>
                ))}
                
                {/* Custom Input Integrated Button */}
                <div className={`relative rounded-xl border transition-all overflow-hidden ${
                    isCustom 
                    ? 'border-ghost-accent bg-ghost-accent/10 shadow-lg shadow-ghost-accent/10 col-span-1' 
                    : 'border-dark-700 bg-dark-800 hover:border-gray-600 col-span-1'
                }`}>
                    {isCustom ? (
                        <div className="flex items-center h-full px-2">
                            <input 
                                autoFocus
                                type="number" 
                                min="1"
                                value={customValue}
                                onChange={(e) => handleCustomChange(e.target.value)}
                                className="w-full bg-transparent text-center text-ghost-accent font-bold text-sm focus:outline-none"
                                placeholder={unit === 'h' ? 'Hrs' : 'Min'}
                            />
                            <button 
                                onClick={(e) => { e.stopPropagation(); toggleUnit(); }}
                                className="ml-1 px-1 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-ghost-accent/20 hover:bg-ghost-accent/40 text-ghost-accent rounded transition-colors"
                            >
                                {unit}
                            </button>
                        </div>
                    ) : (
                        <button 
                            onClick={() => setIsCustom(true)}
                            className="w-full h-full flex items-center justify-center text-sm font-medium text-gray-400 hover:text-gray-200"
                        >
                            Custom
                        </button>
                    )}
                </div>
            </div>

            <div className="mt-3 flex justify-between items-center px-1">
                <span className="text-xs text-gray-500">Duration</span>
                <span className="text-xs text-ghost-accent font-medium tracking-wide">
                    {isCustom 
                        ? `${customValue || 0} ${unit === 'h' ? 'Hours' : 'Minutes'}` 
                        : options.find(o => o.value === duration)?.full}
                </span>
            </div>
        </div>
    );
};

export default ExpirySelector;
