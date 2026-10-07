(function () {
  function initialize() {
    window.OngCadastro.registrationForm.initialize();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }
})();
