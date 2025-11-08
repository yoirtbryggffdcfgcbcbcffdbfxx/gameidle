import React from 'react';

const LoadingScreen: React.FC = () => {
    const BoltIcon = () => (
        <svg
            className="w-20 h-20 text-cyan-400 drop-shadow-[0_0_5px_#00ffff] animate-spin-slow animate-loading-pulse"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M11.049 2.927c.3-.921-.755-1.688-1.54-1.118l-7.1 4.25a1 1 0 00.588 1.815l5.093-.935a1 1 0 011.135.848l-.715 4.987a1 1 0 001.523.96l6.5-5.333a1 1 0 00-.67-1.701l-4.823.834a1 1 0 01-.99-1.138l.6-4.251z"
            />
        </svg>
    );

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-[var(--bg-from)] to-[var(--bg-to)] flex flex-col justify-center items-center z-[100]">
            <BoltIcon />
            <h2 className="text-2xl text-[var(--text-header)] tracking-widest [text-shadow:1px_1px_#000] mt-4">
                CHARGEMENT...
            </h2>
            <div className="w-64 h-2 bg-black/50 rounded-full mt-4 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full animate-progress-fill"></div>
            </div>
        </div>
    );
};

export default LoadingScreen;