import React from 'react';

interface ToggleSwitchProps {
    label: string;
    enabled: boolean;
    onChange: (enabled: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ label, enabled, onChange }) => {
    return (
        <label className="flex items-center justify-between cursor-pointer text-xs">
            <span>{label}</span>
            <div className="relative">
                <input type="checkbox" className="sr-only" checked={enabled} onChange={(e) => onChange(e.target.checked)} />
                <div className={`block w-10 h-5 rounded-full transition ${enabled ? 'bg-cyan-500' : 'bg-gray-600'}`}></div>
                <div className={`dot absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform ${enabled ? 'transform translate-x-full' : ''}`}></div>
            </div>
        </label>
    );
};

export default ToggleSwitch;
