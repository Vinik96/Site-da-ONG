(function () {
  document.querySelectorAll('.menu-toggle[aria-controls]').forEach(button => {
    const navigation = document.getElementById(button.getAttribute('aria-controls'));
    if (!navigation) return;

    function setExpanded(expanded) {
      button.setAttribute('aria-expanded', String(expanded));
      button.setAttribute('aria-label', expanded ? 'Fechar menu principal' : 'Abrir menu principal');
    }

    button.addEventListener('click', () => {
      setExpanded(button.getAttribute('aria-expanded') !== 'true');
    });

    function closeOnEscape(event) {
      if (event.key !== 'Escape' || button.getAttribute('aria-expanded') !== 'true') return;
      setExpanded(false);
      button.focus();
    }

    button.addEventListener('keydown', closeOnEscape);
    navigation.addEventListener('keydown', closeOnEscape);
  });
})();