export const popupsCss = `
/* ============================================= */
/*          POPUPS & MODALS                      */
/* ============================================= */

/* Generic Popup */
@keyframes pop {
    0% { transform: translateX(-50%) scale(0.5); opacity: 0; }
    50% { transform: translateX(-50%) scale(1.2); opacity: 1; }
    100% { transform: translateX(-50%) scale(1); opacity: 1; }
}
.animate-pop {
    animation: pop 0.3s ease-in-out;
}

/* Main Popup Scale-in */
@keyframes popup-scale-in {
    0% { transform: scale(0.5); opacity: 0; }
    50% { transform: scale(1.1); opacity: 1; }
    100% { transform: scale(1); opacity: 1; }
}
.animate-popup-scale {
    animation: popup-scale-in 0.3s ease-in-out;
}

/* Notification Toast */
@keyframes toast-in {
    from { transform: translateY(-100%); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}
@keyframes toast-out {
    from { transform: translateY(0); opacity: 1; }
    to { transform: translateY(-100%); opacity: 0; }
}
.animate-toast-in {
    animation: toast-in 0.3s ease-out forwards;
}
.animate-toast-out {
    animation: toast-out 0.3s ease-out forwards;
}

/* Sliding Up Panel (Mobile Menus) */
@keyframes slide-in-up {
    from {
        transform: translateY(100%);
    }
    to {
        transform: translateY(0);
    }
}
.animate-slide-in-up {
    animation: slide-in-up 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

@keyframes slide-out-down {
    from {
        transform: translateY(0);
    }
    to {
        transform: translateY(100%);
    }
}
.animate-slide-out-down {
    animation: slide-out-down 0.3s cubic-bezier(0.55, 0.085, 0.68, 0.53) forwards;
}
`;
