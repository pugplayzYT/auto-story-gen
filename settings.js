const settings = document.getElementById('settings');
const themeSelect = document.getElementById('theme');
const media = matchMedia('(prefers-color-scheme: dark)');
let theme = 'system';
try { theme = localStorage.getItem('story-theme') || 'system'; } catch {}
if (!['system', 'dark', 'light'].includes(theme)) theme = 'system';
themeSelect.value = theme;
function applyTheme() {
  const resolved = theme === 'system' ? (media.matches ? 'dark' : 'light') : theme;
  document.documentElement.dataset.theme = resolved;
  document.querySelector('meta[name="theme-color"]').content = resolved === 'dark' ? '#18241f' : '#f5f2ea';
}
applyTheme();
media.addEventListener('change', applyTheme);
themeSelect.addEventListener('change', () => {
  theme = themeSelect.value;
  try { localStorage.setItem('story-theme', theme); } catch {}
  applyTheme();
});
document.getElementById('open-settings').addEventListener('click', () => settings.showModal());
document.getElementById('close-settings').addEventListener('click', () => settings.close());
settings.addEventListener('click', event => { if (event.target === settings) { const r = settings.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) settings.close(); } });
const install = document.getElementById('install');
const help = document.getElementById('install-help');
let installPrompt;
window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault(); installPrompt = event; install.hidden = false;
});
install.addEventListener('click', async () => {
  if (!installPrompt) return;
  const prompt = installPrompt; installPrompt = null; install.hidden = true;
  try { await prompt.prompt(); await prompt.userChoice; } catch { help.textContent = 'Use your browser’s Install app or Add to Home Screen option.'; }
});
function installed() { install.hidden = true; installPrompt = null; help.textContent = 'This app is installed. You can open it from your device’s app launcher.'; }
window.addEventListener('appinstalled', installed);
if (matchMedia('(display-mode: standalone)').matches || navigator.standalone) installed();
const status = document.getElementById('offline-status');
if ('serviceWorker' in navigator && window.isSecureContext) {
  navigator.serviceWorker.register('./sw.js').then(() => navigator.serviceWorker.ready).then(() => {
    status.textContent = 'Ready for offline use on this device.';
  }).catch(() => { status.textContent = 'Offline setup failed. Reconnect and reload to try again.'; });
} else {
  status.textContent = 'Offline installation requires HTTPS or a local development server and a browser that supports it.';
}
