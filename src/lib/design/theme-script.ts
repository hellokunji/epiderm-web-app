/** Inline before-paint theme bootstrap — avoids FOUC without a UI library. */
export const themeInitScript = `(function(){try{var k='epiderm-theme';var t=localStorage.getItem(k);if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}var r=document.documentElement;r.classList.toggle('dark',t==='dark');r.style.colorScheme=t}catch(e){}})();`;
