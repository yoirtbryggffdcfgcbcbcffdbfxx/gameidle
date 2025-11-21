
import React from 'react';

interface AuthScannerProps {
    status: 'scanning' | 'locked' | 'success';
}

const AuthScanner: React.FC<AuthScannerProps> = ({ status }) => {
    
    // En succès, on passe au Jaune/Or (#eab308) pour matcher la boutique
    // En scan, on reste Cyan (#00ffff)
    // En locked, Rouge
    const borderColor = status === 'success' ? '#eab308' : status === 'locked' ? '#ef4444' : '#00ffff';
    
    return (
        <div className="relative w-48 h-48 flex items-center justify-center">
            {/* Outer Ring - Static */}
            <div className={`absolute inset-0 border-2 rounded-full opacity-30 transition-colors duration-500`} style={{ borderColor: borderColor }}></div>
            
            {/* Spinning Ring - Active only when scanning */}
            {status === 'scanning' && (
                <div className="absolute inset-2 border-t-2 border-b-2 border-cyan-400 rounded-full animate-spin-slow opacity-80"></div>
            )}
            
            {/* Counter Spinning Ring */}
            {status === 'scanning' && (
                <div className="absolute inset-6 border-l-2 border-r-2 border-purple-500 rounded-full animate-spin-reverse-slow opacity-60"></div>
            )}

            {/* Success Pulse (GOLD) */}
            {status === 'success' && (
                <div className="absolute inset-0 bg-yellow-500/20 rounded-full animate-ping"></div>
            )}

            {/* Central Icon */}
            <div className="relative z-10 transition-all duration-500 transform">
                {status === 'success' ? (
                    // Icone Jaune pour le succès
                    <svg className="w-16 h-16 text-yellow-400 drop-shadow-[0_0_15px_rgba(234,179,8,0.8)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                ) : (
                    <svg className={`w-16 h-16 ${status === 'locked' ? 'text-red-500' : 'text-cyan-500/50'} transition-colors duration-300`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.131A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.2-2.858.571-4.171 l-.018.059c1.469-2.381 3.994-3.938 6.947-4.085 3.093-.154 5.856 1.257 7.543 3.742" />
                    </svg>
                )}
            </div>

            {/* Scan Line */}
            {status === 'scanning' && (
                <div className="absolute inset-0 overflow-hidden rounded-full">
                    <div className="animate-gateway-scan"></div>
                </div>
            )}
        </div>
    );
};

export default AuthScanner;
