(function (app) {
  const fieldRules = [
    { id: 'nome', storageKey: 'nome', message: 'Insira seu nome completo' },
    { id: 'data-nascimento', storageKey: 'dataNascimento', message: 'Insira sua data de nascimento' },
    { id: 'email', storageKey: 'email', regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Insira um e-mail válido' },
    { id: 'cpf', storageKey: 'cpf', regex: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/, message: 'Insira um CPF válido' },
    { id: 'telefone', storageKey: 'telefone', regex: /^\(\d{2}\)\s\d{4,5}-\d{4}$/, message: 'Insira um telefone válido' },
    { id: 'cep', storageKey: 'cep', regex: /^\d{5}-\d{3}$/, message: 'Insira um CEP válido' },
    { id: 'endereco', storageKey: 'endereco', regex: /^.{5,100}$/, message: 'Insira um endereço válido' },
    { id: 'cidade', storageKey: 'cidade', regex: /^[A-Za-zÀ-ÿ\s]{2,}$/, message: 'Insira uma cidade válida' },
    { id: 'estado', storageKey: 'estado', regex: /^[A-Za-zÀ-ÿ\s]{2,}$/, message: 'Insira um estado válido' }
  ];

  function getFields(documentRef) {
    return fieldRules
      .map(rule => ({ ...rule, input: documentRef.querySelector(`#${rule.id}`) }))
      .filter(field => field.input);
  }

  function showMessage(input, text) {
    const container = input.parentElement;
    let message = container.querySelector('.mensagem-validacao');

    if (!message) {
      message = document.createElement('span');
      message.className = 'mensagem-validacao texto-erro';
      container.appendChild(message);
    }

    message.textContent = text;
  }

  function clearMessage(input) {
    const message = input.parentElement.querySelector('.mensagem-validacao');
    if (message) message.remove();
  }

  function validateField(field) {
    const value = field.input.value.trim();
    const valid = field.regex ? value !== '' && field.regex.test(value) : value !== '';

    if (!valid) {
      field.input.classList.add('input-erro');
      field.input.classList.remove('input-sucesso');
      showMessage(field.input, field.message);
      return false;
    }

    field.input.classList.remove('input-erro');
    field.input.classList.add('input-sucesso');
    clearMessage(field.input);
    return true;
  }

  app.validation = {
    getFields,
    validateField,
    validateAll(fields) {
      return fields.map(validateField).every(Boolean);
    },
    bindBlur(fields, onValid) {
      fields.forEach(field => {
        field.input.addEventListener('blur', () => {
          if (validateField(field)) onValid(field);
        });
      });
    }
  };
})(window.OngCadastro = window.OngCadastro || {});