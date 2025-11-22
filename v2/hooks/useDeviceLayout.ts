
import { useEffect } from 'react';
import { useGameDispatch } from '../lib/context';
import { setIsMobile } from '../features/ui/actions';

export const useDeviceLayout = () => {
    const dispatch = useGameDispatch();

    useEffect(() => {
        const checkMobile = () => {
            // Seuil Tailwind 'md' (768px)
            const isMobile = window.innerWidth < 768;
            dispatch(setIsMobile(isMobile));
        };

        // Vérification initiale
        checkMobile();

        // Écouteur de redimensionnement
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, [dispatch]);
};
