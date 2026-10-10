(function () {
  const themeKey = 'ong-theme';
  const root = document.documentElement;
  const toggleButton = document.querySelector('.theme-toggle');
  let isDark = localStorage.getItem(themeKey) === 'dark';

  function applyTheme() {
    if (isDark) {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }

    if (toggleButton) {
      toggleButton.setAttribute('aria-pressed', String(isDark));
    }
  }

  applyTheme();

  if (!toggleButton) return;

  toggleButton.addEventListener('click', () => {
    isDark = !isDark;
    applyTheme();
    localStorage.setItem(themeKey, isDark ? 'dark' : 'light');
  });
})();
