// A biblioteca IMask é carregada antes deste arquivo pelo CDN em cadastro.html.
function aplicarMascaras() {
  const cpfInput = document.querySelector('#cpf');
  const telefoneInput = document.querySelector('#telefone');
  const cepInput = document.querySelector('#cep');

  return {
    cpf: cpfInput ? IMask(cpfInput, { mask: '000.000.000-00' }) : null,
    telefone: telefoneInput ? IMask(telefoneInput, { mask: '(00) 00000-0000' }) : null,
    cep: cepInput ? IMask(cepInput, { mask: '00000-000' }) : null
  };
}

function iniciarFormulario() {
  // 1. Aplica as máscaras imediatamente nos campos presentes na tela
  const mascaras = aplicarMascaras();

  const form = document.querySelector('form');
  if (!form) return; // Se não houver formulário na página atual, encerra a validação

  // 2. SELEÇÃO DOS ELEMENTOS
  const nameInput = document.querySelector('#nome');
  const dateInput = document.querySelector('#data-nascimento');
  const emailInput = document.querySelector('#email');
  const cpfInput = document.querySelector('#cpf');
  const telefoneInput = document.querySelector('#telefone');
  const cepInput = document.querySelector('#cep');
  const enderecoInput = document.querySelector('#endereco');
  const cidadeInput = document.querySelector('#cidade');
  const estadoInput = document.querySelector('#estado');

  // REGEX DE VALIDAÇÃO
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const regexCpf = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
  const regexTelefone = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
  const regexCep = /^\d{5}-\d{3}$/;
  const regexEndereco = /^.{5,100}$/;
  const regexCidade = /^[A-Za-zÀ-ÿ\s]{2,}$/;
  const regexEstado = /^[A-Za-zÀ-ÿ\s]{2,}$/;

  // FUNÇÕES AUXILIARES DE MENSAGEM
  function exibirMensagem(input, texto) {
    if (!input) return;
    const container = input.parentElement;
    let mensagemElemento = container.querySelector('.mensagem-validacao');
    if (!mensagemElemento) {
      mensagemElemento = document.createElement('span');
      mensagemElemento.className = 'mensagem-validacao texto-erro';
      container.appendChild(mensagemElemento);
    }
    mensagemElemento.textContent = texto;
  }

  function limparMensagem(input) {
    if (!input) return;
    const container = input.parentElement;
    const mensagemElemento = container.querySelector('.mensagem-validacao');
    if (mensagemElemento) mensagemElemento.remove();
  }

  // VALIDACÕES INDIVIDUAIS
  function validarCampo(input, regex, mensagem) {
    if (!input) return true;
    const valor = input.value.trim();
    const valido = regex ? (valor !== '' && regex.test(valor)) : valor !== '';

    if (!valido) {
      input.classList.add('input-erro');
      input.classList.remove('input-sucesso');
      exibirMensagem(input, mensagem);
      return false;
    }
    input.classList.remove('input-erro');
    input.classList.add('input-sucesso');
    limparMensagem(input);
    return true;
  }

  // EVENTOS DE BLUR
  if (nameInput) nameInput.addEventListener('blur', () => validarCampo(nameInput, null, 'Insira seu nome completo'));
  if (dateInput) dateInput.addEventListener('blur', () => validarCampo(dateInput, null, 'Insira sua data de nascimento'));
  if (emailInput) emailInput.addEventListener('blur', () => validarCampo(emailInput, regexEmail, 'Insira um e-mail válido'));
  if (cpfInput) cpfInput.addEventListener('blur', () => validarCampo(cpfInput, regexCpf, 'Insira um CPF válido'));
  if (telefoneInput) telefoneInput.addEventListener('blur', () => validarCampo(telefoneInput, regexTelefone, 'Insira um telefone válido'));
  if (cepInput) cepInput.addEventListener('blur', () => validarCampo(cepInput, regexCep, 'Insira um CEP válido'));
  if (enderecoInput) enderecoInput.addEventListener('blur', () => validarCampo(enderecoInput, regexEndereco, 'Insira um endereço válido'));
  if (cidadeInput) cidadeInput.addEventListener('blur', () => validarCampo(cidadeInput, regexCidade, 'Insira uma cidade válida'));
  if (estadoInput) estadoInput.addEventListener('blur', () => validarCampo(estadoInput, regexEstado, 'Insira um estado válido'));

  // GERENCIAMENTO DE RASCUNHO (LOCALSTORAGE)
  function salvarRascunho() {
    const dadosRascunho = {
      nome: nameInput?.value || '',
      dataNascimento: dateInput?.value || '',
      email: emailInput?.value || '',
      cpf: cpfInput?.value || '',
      telefone: telefoneInput?.value || '',
      cep: cepInput?.value || '',
      endereco: enderecoInput?.value || '',
      cidade: cidadeInput?.value || '',
      estado: estadoInput?.value || ''
    };
    localStorage.setItem('meuRascunho', JSON.stringify(dadosRascunho));
  }

  function restaurarRascunho() {
    const dadosSalvos = localStorage.getItem('meuRascunho');
    if (dadosSalvos) {
      const d = JSON.parse(dadosSalvos);
      if (nameInput) nameInput.value = d.nome || '';
      if (dateInput) dateInput.value = d.dataNascimento || '';
      if (emailInput) emailInput.value = d.email || '';
      if (cpfInput) mascaras.cpf.value = d.cpf || '';
      if (telefoneInput) mascaras.telefone.value = d.telefone || '';
      if (cepInput) mascaras.cep.value = d.cep || '';
      if (enderecoInput) enderecoInput.value = d.endereco || '';
      if (cidadeInput) cidadeInput.value = d.cidade || '';
      if (estadoInput) estadoInput.value = d.estado || '';
    }
  }

  restaurarRascunho();

  [nameInput, dateInput, emailInput, cpfInput, telefoneInput, cepInput, enderecoInput, cidadeInput, estadoInput]
    .filter(Boolean)
    .forEach(el => el.addEventListener('input', salvarRascunho));

  // SUBMIT
  form.addEventListener('submit', function(event) {
    event.preventDefault();

    const formValido = [
      validarCampo(nameInput, null, 'Insira seu nome completo'),
      validarCampo(dateInput, null, 'Insira sua data de nascimento'),
      validarCampo(emailInput, regexEmail, 'Insira um e-mail válido'),
      validarCampo(cpfInput, regexCpf, 'Insira um CPF válido'),
      validarCampo(telefoneInput, regexTelefone, 'Insira um telefone válido'),
      validarCampo(cepInput, regexCep, 'Insira um CEP válido'),
      validarCampo(enderecoInput, regexEndereco, 'Insira um endereço válido'),
      validarCampo(cidadeInput, regexCidade, 'Insira uma cidade válida'),
      validarCampo(estadoInput, regexEstado, 'Insira um estado válido')
    ].every(Boolean);

    if (formValido) {
      const formData = new FormData(form);
      console.log('Dados interceptados:', Object.fromEntries(formData.entries()));
      alert('Cadastro realizado com sucesso!');
      form.reset();
      localStorage.removeItem('meuRascunho');
    } else {
      alert('Por favor, preencha todos os campos corretamente.');
    }
  });
}

// Execução única: o cadastro é uma página HTML estática, não uma SPA.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', iniciarFormulario, { once: true });
} else {
  iniciarFormulario();
}
