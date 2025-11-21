
import React from 'react';

const ShopBackground: React.FC = () => (
    <div className="absolute inset-0 bg-[#0a0700] z-[-1] overflow-hidden">
        <div 
            className="absolute -left-1/2 -top-1/2 w-[200%] h-[200%] opacity-50"
            style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23d4af37\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                animation: 'pan 60s linear infinite',
                willChange: 'transform',
            }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#1c1600] via-[#4d3800]/50 to-[#000000]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,193,7,0.4),rgba(255,255,255,0))]"></div>
    </div>
);

export default ShopBackground;
