import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useGameContext } from '../../contexts/GameContext';
import { BuyAmount } from '../../hooks/ui/useForge';

interface AmountDialProps {
    options: BuyAmount[];
    activeOption: BuyAmount;
    onOptionSelect: (option: BuyAmount) => void;
}

const isTouchDevice = () => {
    return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
};

const AmountDial: React.FC<AmountDialProps> = ({ options, activeOption, onOptionSelect }) => {
    const { playSfx } = useGameContext();
    const [isDragging, setIsDragging] = useState(false);
    const [isListOpen, setIsListOpen] = useState(false);
    
    const startY = useRef(0);
    const accumulatedY = useRef(0);
    const clickStartTimestamp = useRef(0);

    const isMobile = useMemo(() => isTouchDevice(), []);
    const isDisabled = options.length <= 1;

    const activeIndex = useMemo(() => options.findIndex(t => t === activeOption), [options, activeOption]);

    const handleSelectByIndex = useCallback((index: number) => {
        const newIndex = (index + options.length) % options.length;
        if (newIndex !== activeIndex) {
            onOptionSelect(options[newIndex]);
            playSfx('ui_hover');
        }
    }, [options, onOptionSelect, playSfx, activeIndex]);
    
    const handleMove = useCallback((clientY: number) => {
        if (!isDragging || isDisabled) return;
        const deltaY = clientY - startY.current;
        accumulatedY.current += deltaY;
        startY.current = clientY;

        const selectionThreshold = 30;
        if (Math.abs(accumulatedY.current) > selectionThreshold) {
            const direction = accumulatedY.current > 0 ? -1 : 1; // Inverted scroll
            handleSelectByIndex(activeIndex + direction);
            accumulatedY.current = 0;
        }
    }, [isDragging, activeIndex, handleSelectByIndex, isDisabled]);
    
    useEffect(() => {
        if (isMobile) return;
        const onMouseMove = (e: MouseEvent) => handleMove(e.clientY);
        if (isDragging) window.addEventListener('mousemove', onMouseMove);
        return () => window.removeEventListener('mousemove', onMouseMove);
    }, [isDragging, handleMove, isMobile]);

    const handleInteractionEnd = useCallback(() => {
        const clickDuration = Date.now() - clickStartTimestamp.current;
        if (isDragging && clickDuration < 200 && !isDisabled) {
             setIsListOpen(prev => !prev);
        }
        setIsDragging(false);
        accumulatedY.current = 0;
    }, [isDragging, isDisabled]);

    useEffect(() => {
        if (isMobile) return;
        if (isDragging) {
            window.addEventListener('mouseup', handleInteractionEnd);
            window.addEventListener('touchend', handleInteractionEnd);
        }
        return () => {
            window.removeEventListener('mouseup', handleInteractionEnd);
            window.removeEventListener('touchend', handleInteractionEnd);
        };
    }, [isDragging, handleInteractionEnd, isMobile]);

    const handleInteractionStart = (clientY: number) => {
        if (isDisabled) return;
        setIsDragging(true);
        startY.current = clientY;
        clickStartTimestamp.current = Date.now();
    };

    const handleWheel = (e: React.WheelEvent) => {
        if (isDisabled) return;
        e.preventDefault();
        const direction = e.deltaY > 0 ? 1 : -1;
        handleSelectByIndex(activeIndex + direction);
    };

    const handleDirectSelect = (option: BuyAmount) => {
        onOptionSelect(option);
        setIsListOpen(false);
    };

    const handleMobileClick = () => {
        if (isDisabled) return;
        playSfx('ui_hover');
        setIsListOpen(prev => !prev);
    };

    const buttonEventHandlers = isMobile
        ? { onClick: handleMobileClick }
        : {
            onMouseDown: (e: React.MouseEvent) => handleInteractionStart(e.clientY),
            onTouchStart: (e: React.TouchEvent) => handleInteractionStart(e.touches[0].clientY),
            onWheel: handleWheel
          };

    return (
        <div className="relative">
             {isListOpen && <div className="fixed inset-0 z-[14] bg-black/50" onClick={() => setIsListOpen(false)}></div>}
            <button
                {...buttonEventHandlers}
                disabled={isDisabled}
                className="amount-dial-button"
                title={isDisabled ? "Débloquez plus d'options dans la boutique" : "Changer le montant d'achat"}
            >
                <span className="text-xs px-2 opacity-80">Acheter:</span>
                <span className="font-bold text-cyan-300">x{activeOption}</span>
                {!isDisabled && <span className="text-xl transition-transform duration-200 ml-2" style={{ transform: isListOpen || (isDragging && !isMobile) ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>}
            </button>

            {!isDisabled && (
                 <div className={`amount-dial-list ${(!isMobile && isDragging) || isListOpen ? 'open' : ''}`}>
                    <div className="indicator-arrow up">▲</div>
                    {options.map((option) => (
                        <button
                            key={option}
                            onClick={() => handleDirectSelect(option)}
                            className={`amount-dial-item ${option === activeOption ? 'active' : ''}`}
                        >
                            x{option}
                        </button>
                    ))}
                    <div className="indicator-arrow down">▼</div>
                </div>
            )}
        </div>
    );
};

export default AmountDial;