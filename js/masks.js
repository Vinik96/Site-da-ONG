(function (app) {
  app.masks = {
    apply(documentRef, maskLibrary) {
      const cpfInput = documentRef.querySelector('#cpf');
      const telefoneInput = documentRef.querySelector('#telefone');
      const cepInput = documentRef.querySelector('#cep');

      if (typeof maskLibrary !== 'function') {
        return { cpf: null, telefone: null, cep: null };
      }

      return {
        cpf: cpfInput ? maskLibrary(cpfInput, { mask: '000.000.000-00' }) : null,
        telefone: telefoneInput ? maskLibrary(telefoneInput, { mask: '(00) 00000-0000' }) : null,
        cep: cepInput ? maskLibrary(cepInput, { mask: '00000-000' }) : null
      };
    }
  };
})(window.OngCadastro = window.OngCadastro || {});