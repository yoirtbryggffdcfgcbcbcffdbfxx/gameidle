import React, { useState, useEffect, useRef } from 'react';

interface FlowingParticleProps {
  id: number;
  startX: number;
  startY: number;
  color: string;
  animSpeed: number;
  onComplete: (id: number) => void;
}

const FlowingParticle: React.FC<FlowingParticleProps> = ({ id, startX, startY, color, animSpeed, onComplete }) => {
  const [style, setStyle] = useState<React.CSSProperties>({
    left: startX,
    top: startY,
    background: color,
    position: 'fixed',
    borderRadius: '50%',
    pointerEvents: 'none',
    zIndex: 1000,
    width: `${6 + Math.random() * 6}px`,
    height: `${6 + Math.random() * 6}px`,
  });
  // FIX: Explicitly initialize useRef with undefined and provide a more accurate type.
  // This resolves the "Expected 1 arguments, but got 0" error, which is likely from a strict linter rule.
  const requestRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const energyBarEl = document.getElementById('energyBar');
    if (!energyBarEl) return;
    
    const targetRect = energyBarEl.getBoundingClientRect();
    const currentWidth = parseFloat(energyBarEl.style.width || '0');
    const endX = targetRect.left + (targetRect.width * (currentWidth / 100));
    const endY = targetRect.top + targetRect.height / 2;
    const duration = (400 + Math.random() * 300) / animSpeed;

    const animate = (time: number) => {
      if (startTimeRef.current === undefined) {
        startTimeRef.current = time;
      }
      const elapsed = time - startTimeRef.current!;
      const progress = Math.min(elapsed / duration, 1);
      
      const currentX = startX + (endX - startX) * progress;
      const currentY = startY + (endY - startY) * progress;
      const offsetX = Math.sin(progress * Math.PI * 2) * 8;

      setStyle(prevStyle => ({
        ...prevStyle,
        left: `${currentX + offsetX}px`,
        top: `${currentY}px`,
        opacity: 1 - progress,
        transform: `rotate(${progress * 720}deg) scale(${1 - progress})`,
      }));

      if (progress < 1) {
        requestRef.current = requestAnimationFrame(animate);
      } else {
        onComplete(id);
      }
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, startX, startY, animSpeed, color, onComplete]);

  return <div style={style}></div>;
};

export default FlowingParticle;
