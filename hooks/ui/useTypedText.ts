import { useState, useEffect, useRef } from 'react';
import { sfx } from '../../audio/sfx';

export const useTypedText = (text: string, speed: number = 35) => {
    const [typedText, setTypedText] = useState('');
    const [isTypingComplete, setIsTypingComplete] = useState(false);
    
    const requestRef = useRef<number | undefined>(undefined);
    const lastUpdateTimeRef = useRef<number>(0);
    const charIndexRef = useRef<number>(0);

    useEffect(() => {
        setTypedText('');
        setIsTypingComplete(false);
        lastUpdateTimeRef.current = 0;
        charIndexRef.current = 0;

        if (!text) {
            setIsTypingComplete(true);
            return;
        }

        const animate = (time: number) => {
            if (lastUpdateTimeRef.current === 0) {
                lastUpdateTimeRef.current = time;
            }

            const elapsed = time - lastUpdateTimeRef.current;

            if (elapsed > speed) {
                if (charIndexRef.current < text.length) {
                    charIndexRef.current++;
                    setTypedText(text.substring(0, charIndexRef.current));
                    
                    if (sfx.typing) {
                        sfx.typing.currentTime = 0;
                        sfx.typing.volume = 0.3;
                        sfx.typing.play().catch(() => {});
                    }
                    lastUpdateTimeRef.current = time;
                } else {
                    setIsTypingComplete(true);
                    if (requestRef.current) cancelAnimationFrame(requestRef.current);
                    return;
                }
            }
            requestRef.current = requestAnimationFrame(animate);
        };

        requestRef.current = requestAnimationFrame(animate);

        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
        };
    }, [text, speed]);

    return { typedText, isTypingComplete };
};