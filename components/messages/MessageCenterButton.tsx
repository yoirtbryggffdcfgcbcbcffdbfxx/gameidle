import React from 'react';
import { useGameContext } from '../../contexts/GameContext';
import MailIcon from '../ui/MailIcon';

const MessageCenterButton: React.FC = () => {
    const { computedState, popups } = useGameContext();
    const { unreadMessageCount } = computedState;
    const { setIsMessageCenterOpen } = popups;

    return (
        <button
            onClick={() => setIsMessageCenterOpen(true)}
            title="Ouvrir le centre de messages"
            className="fixed top-4 left-4 z-[1001] w-12 h-12 md:w-14 md:h-14 bg-black/50 backdrop-blur-sm border-2 border-white/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-white/20 active:scale-100"
        >
            <div className="relative text-white">
                <MailIcon className="w-6 h-6 md:w-7 md:h-7" />
                {unreadMessageCount > 0 && (
                    <span className="absolute -top-1 -right-2 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center font-bold border-2 border-black">
                        {unreadMessageCount > 9 ? '9+' : unreadMessageCount}
                    </span>
                )}
            </div>
        </button>
    );
};

export default MessageCenterButton;
