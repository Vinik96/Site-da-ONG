(function (app) {
  app.feedback = {
    create(documentRef) {
      const successAlert = documentRef.querySelector('#cadastro-alerta-sucesso');
      const errorAlert = documentRef.querySelector('#cadastro-alerta-erro');
      const toast = documentRef.querySelector('#cadastro-toast');
      const toastMessage = documentRef.querySelector('#cadastro-toast-mensagem');
      const modal = documentRef.querySelector('#cadastro-modal');
      const closeButton = modal?.querySelector('.feedback-modal__close');
      let toastTimeout;

      function hideAlerts() {
        if (successAlert) successAlert.hidden = true;
        if (errorAlert) errorAlert.hidden = true;
      }

      function hideToast() {
        if (toast) toast.hidden = true;
        window.clearTimeout(toastTimeout);
      }

      closeButton?.addEventListener('click', () => modal.close());
      modal?.addEventListener('click', event => {
        if (event.target === modal) modal.close();
      });

      return {
        isModalOpen: () => Boolean(modal?.open),
        hideAlerts,
        hideToast,
        showAlert(alert) {
          hideAlerts();
          if (!alert) return;
          alert.hidden = false;
          alert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        },
        showToast(input) {
          if (!toast || !toastMessage) return;
          const label = input.labels?.[0]?.textContent.trim().replace(/:$/, '') || 'Campo';
          toastMessage.textContent = `${label} validado corretamente.`;
          toast.hidden = false;
          window.clearTimeout(toastTimeout);
          toastTimeout = window.setTimeout(() => {
            toast.hidden = true;
          }, 3500);
        },
        openModal() {
          if (modal && !modal.open) modal.showModal();
        },
        successAlert,
        errorAlert
      };
    }
  };
})(window.OngCadastro = window.OngCadastro || {});