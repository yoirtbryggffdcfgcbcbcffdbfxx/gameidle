export const themesCss = `
/* ============================================= */
/*          THEMES                               */
/* ============================================= */
:root {
    --bg-from: #1e1e2f;
    --bg-to: #2a2a3f;
    --text-main: #ffffff;
    --text-header: #ffcc00;
    --bg-popup: #222;
    --bg-upgrade: rgba(0,0,0,0.3);
    --border-color: #444;
    --cursor-color: #00ffff;
}
:root[data-theme='light'] {
    --bg-from: #eef2f3;
    --bg-to: #8e9eab;
    --text-main: #2c3e50;
    --text-header: #d35400;
    --bg-popup: #f4f4f4;
    --bg-upgrade: rgba(255,255,255,0.4);
    --border-color: #bdc3c7;
    --cursor-color: #d35400;
}
:root[data-theme='matrix'] {
    --bg-from: #000000;
    --bg-to: #0d0d0d;
    --text-main: #00ff41;
    --text-header: #39ff14;
    --bg-popup: #0a0a0a;
    --bg-upgrade: rgba(0, 255, 65, 0.1);
    --border-color: #00ff41;
    --cursor-color: #00ff41;
}
:root[data-theme='solaris'] {
    --bg-from: #ff7e5f;
    --bg-to: #feb47b;
    --text-main: #ffffff;
    --text-header: #4a1c0d;
    --bg-popup: #ff6a3d;
    --bg-upgrade: rgba(255, 255, 255, 0.2);
    --border-color: #ffffff;
    --cursor-color: #ffffff;
}
:root[data-theme='cyberpunk'] {
    --bg-from: #0b022d;
    --bg-to: #3a0ca3;
    --text-main: #f0f0f0;
    --text-header: #ff00c8;
    --bg-popup: #1e0a4f;
    --bg-upgrade: rgba(255, 0, 200, 0.15);
    --border-color: #00f5d4;
    --cursor-color: #ff00c8;
}
`;
