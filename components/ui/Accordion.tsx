
import React from 'react';
import ChevronDownIcon from './ChevronDownIcon';

interface AccordionProps {
    title: string;
    icon: React.ReactNode;
    isOpen: boolean;
    onToggle: () => void;
    colorClass?: string;
    children: React.ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({ 
    title, 
    icon, 
    isOpen, 
    onToggle, 
    colorClass = "text-white", 
    children 
}) => {
    return (
        <div className="border-b border-white/10 last:border-b-0">
            <button
                onClick={onToggle}
                className="w-full flex justify-between items-center p-3 text-left transition-colors hover:bg-white/5"
                aria-expanded={isOpen}
            >
                <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 ${colorClass}`}>{icon}</div>
                    <span className={`font-bold ${colorClass}`}>{title}</span>
                </div>
                <ChevronDownIcon className={`w-5 h-5 text-gray-400 accordion-chevron-rotation ${isOpen ? 'open' : ''}`} />
            </button>
            <div className={`accordion-content ${isOpen ? 'open' : ''}`}>
                <div>
                    <div className="p-3 pt-0">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Accordion;
