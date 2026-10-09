(function (app) {
  app.registrationForm = {
    initialize(documentRef = document) {
      const form = documentRef.querySelector('form');
      if (!form) return;

      const fields = app.validation.getFields(documentRef);
      const masks = app.masks.apply(documentRef, window.IMask);
      const feedback = app.feedback.create(documentRef);

      app.draftStorage.restore(fields, masks, window.localStorage);
      app.draftStorage.bindAutosave(fields, window.localStorage);
      app.validation.bindBlur(fields, field => {
        if (!feedback.isModalOpen()) feedback.showToast(field.input);
      });

      form.addEventListener('input', feedback.hideAlerts);
      form.addEventListener('submit', event => {
        event.preventDefault();
        feedback.hideToast();

        if (app.validation.validateAll(fields)) {
          feedback.showAlert(feedback.successAlert);
          feedback.openModal();
        } else {
          feedback.showAlert(feedback.errorAlert);
          const firstInvalidField = fields.find(field => field.input.getAttribute('aria-invalid') === 'true');
          firstInvalidField?.input.focus();
        }
      });
    }
  };
})(window.OngCadastro = window.OngCadastro || {});