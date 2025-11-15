import React from 'react';

// Import all the new icons
import Buy10Icon from './Buy10Icon';
import PercentIcon from './PercentIcon';
import TrendingUpIcon from './TrendingUpIcon';
import HighlightIcon from './HighlightIcon';
import MaxIcon from './MaxIcon';
import Buy100Icon from './Buy100Icon';

interface ShopIconRendererProps {
    iconId: string;
    className?: string;
}

const ShopIconRenderer: React.FC<ShopIconRendererProps> = ({ iconId, className }) => {
    switch (iconId) {
        case 'buy_10':
            return <Buy10Icon className={className} />;
        case 'percent':
            return <PercentIcon className={className} />;
        case 'trending_up':
            return <TrendingUpIcon className={className} />;
        case 'highlight':
            return <HighlightIcon className={className} />;
        case 'max':
            return <MaxIcon className={className} />;
        case 'buy_100':
            return <Buy100Icon className={className} />;
        default:
            return <span className="text-5xl">{iconId}</span>;
    }
};

export default ShopIconRenderer;
