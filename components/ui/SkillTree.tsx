import React, { useLayoutEffect, useRef, useState, useMemo } from 'react';
import { AscensionUpgrade, CoreUpgrade } from '../../types';

type SkillTreeUpgrade = (AscensionUpgrade | CoreUpgrade) & { cost: number };

interface SkillTreeProps {
    upgrades: SkillTreeUpgrade[];
    purchasedIds: string[];
    onBuy: (id: string) => void;
    currency: number;
    currencyType: string;
    themeColor: 'yellow' | 'purple';
    children?: React.ReactNode; // For central component like QuantumCore
}

interface NodePosition {
    id: string;
    x: number;
    y: number;
}

interface Line {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    isUnlocked: boolean;
}

const SkillTree: React.FC<SkillTreeProps> = ({ upgrades, purchasedIds, onBuy, currency, currencyType, themeColor, children }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [nodePositions, setNodePositions] = useState<NodePosition[]>([]);
    const [lines, setLines] = useState<Line[]>([]);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    const theme = {
        yellow: {
            button: 'bg-yellow-600 hover:enabled:bg-yellow-500',
            border: 'border-yellow-500',
            text: 'text-yellow-400',
            line: '#eab308'
        },
        purple: {
            button: 'bg-purple-600 hover:enabled:bg-purple-500',
            border: 'border-purple-500',
            text: 'text-purple-400',
            line: '#a855f7'
        }
    }[themeColor];

    const maxRadius = useMemo(() => Math.max(...upgrades.map(u => u.position.radius)), [upgrades]);

    useLayoutEffect(() => {
        const calculatePositions = () => {
            if (!containerRef.current) return;
            const container = containerRef.current;
            const { width, height } = container.getBoundingClientRect();
            
            if (width === 0 || height === 0) return;
            
            setDimensions({ width, height });

            const centerX = width / 2;
            const centerY = height / 2;
            const radiusStep = Math.min(width, height) / (2 * (maxRadius + 0.5));
            
            const newPositions: NodePosition[] = upgrades.map(upgrade => {
                if (upgrade.position.radius === 0) {
                    return { id: upgrade.id, x: centerX, y: centerY };
                }
                const angleRad = (upgrade.position.angle * Math.PI) / 180;
                const r = upgrade.position.radius * radiusStep;
                return {
                    id: upgrade.id,
                    x: centerX + r * Math.cos(angleRad),
                    y: centerY + r * Math.sin(angleRad),
                };
            });
            setNodePositions(newPositions);

            const newLines: Line[] = [];
            upgrades.forEach(upgrade => {
                if (upgrade.required.length > 0) {
                    const childPos = newPositions.find(p => p.id === upgrade.id);
                    if (!childPos) return;

                    upgrade.required.forEach(reqId => {
                        const parentPos = newPositions.find(p => p.id === reqId);
                        if (!parentPos) return;

                        newLines.push({
                            x1: parentPos.x,
                            y1: parentPos.y,
                            x2: childPos.x,
                            y2: childPos.y,
                            isUnlocked: purchasedIds.includes(upgrade.id) && purchasedIds.includes(reqId)
                        });
                    });
                }
            });
            setLines(newLines);
        };
        
        calculatePositions();

        const resizeObserver = new ResizeObserver(calculatePositions);
        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }
        return () => resizeObserver.disconnect();

    }, [upgrades, maxRadius, purchasedIds]);
    
    const nodeSize = 64;

    return (
        <div ref={containerRef} className="relative w-full h-full p-2">
            <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
                {lines.map((line, index) => (
                    <line 
                        key={index}
                        x1={line.x1} y1={line.y1}
                        x2={line.x2} y2={line.y2}
                        stroke={line.isUnlocked ? theme.line : 'rgba(107, 114, 128, 0.5)'}
                        strokeWidth="2"
                        className="transition-all duration-500"
                    />
                ))}
            </svg>
            
            {children && dimensions.width > 0 && (
                 <div className="absolute z-20" style={{
                    top: dimensions.height / 2,
                    left: dimensions.width / 2,
                    transform: 'translate(-50%, -50%)'
                 }}>
                     {children}
                 </div>
            )}

            {nodePositions.map(pos => {
                const upgrade = upgrades.find(u => u.id === pos.id);
                if (!upgrade || upgrade.position.radius === 0) return null;

                const isPurchased = purchasedIds.includes(upgrade.id);
                const canAfford = currency >= upgrade.cost;
                const requirementsMet = upgrade.required.every(reqId => purchasedIds.includes(reqId));
                const isBuyable = canAfford && !isPurchased && requirementsMet;

                let borderClass = 'border-gray-600';
                if (isPurchased) borderClass = 'border-green-500 scale-110';
                else if (isBuyable) borderClass = theme.border;

                return (
                    <div 
                        key={upgrade.id}
                        id={`skill-${upgrade.id}`}
                        className="group absolute z-10"
                        style={{
                            left: pos.x - (nodeSize / 2),
                            top: pos.y - (nodeSize / 2),
                            width: nodeSize,
                            height: nodeSize,
                        }}
                    >
                        <button
                            onClick={() => onBuy(upgrade.id)}
                            disabled={!isBuyable}
                            className={`w-full h-full rounded-full border-2 flex items-center justify-center p-1 text-center transition-all duration-300
                            ${isPurchased ? 'bg-green-800/50' : 'bg-black/40'}
                            ${isBuyable ? `animate-attention-pulse cursor-pointer` : ''}
                            ${!isPurchased && !requirementsMet ? 'opacity-50' : ''}
                            ${borderClass}`}
                        >
                            <span className="text-[10px] leading-tight">{upgrade.name}</span>
                        </button>
                        <div className={`absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 p-2 bg-gray-900 border border-gray-600 rounded-lg text-xs z-30 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity`}>
                            <p className={`font-bold ${theme.text}`}>{upgrade.name}</p>
                            <p className="my-1">{upgrade.description}</p>
                            <p>Coût: <span className={canAfford ? 'text-green-400' : 'text-red-400'}>{upgrade.cost} {currencyType}</span></p>
                            {!isPurchased && !requirementsMet && <p className="text-red-400 mt-1 text-[10px]">Requiert: {upgrades.find(u => u.id === upgrade.required[0])?.name}</p>}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default SkillTree;