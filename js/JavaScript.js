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
  const successAlert = document.querySelector('#cadastro-alerta-sucesso');
  const errorAlert = document.querySelector('#cadastro-alerta-erro');
  const toast = document.querySelector('#cadastro-toast');
  const toastMessage = document.querySelector('#cadastro-toast-mensagem');
  const cadastroModal = document.querySelector('#cadastro-modal');
  const closeModalButton = cadastroModal?.querySelector('.feedback-modal__close');
  let toastTimeout;

  function ocultarAlertas() {
    if (successAlert) successAlert.hidden = true;
    if (errorAlert) errorAlert.hidden = true;
  }

  function exibirAlerta(alerta) {
    ocultarAlertas();
    if (!alerta) return;
    alerta.hidden = false;
    alerta.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function exibirToast(input) {
    if (!toast || !toastMessage) return;
    const nomeCampo = input.labels?.[0]?.textContent.trim().replace(/:$/, '') || 'Campo';
    toastMessage.textContent = `${nomeCampo} validado corretamente.`;
    toast.hidden = false;
    window.clearTimeout(toastTimeout);
    toastTimeout = window.setTimeout(() => {
      toast.hidden = true;
    }, 3500);
  }

  function ocultarToast() {
    if (toast) toast.hidden = true;
    window.clearTimeout(toastTimeout);
  }

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

  function validarAoSair(input, regex, mensagem) {
    if (!input) return;
    input.addEventListener('blur', () => {
      if (validarCampo(input, regex, mensagem) && !cadastroModal?.open) {
        exibirToast(input);
      }
    });
  }

  // EVENTOS DE BLUR
  validarAoSair(nameInput, null, 'Insira seu nome completo');
  validarAoSair(dateInput, null, 'Insira sua data de nascimento');
  validarAoSair(emailInput, regexEmail, 'Insira um e-mail válido');
  validarAoSair(cpfInput, regexCpf, 'Insira um CPF válido');
  validarAoSair(telefoneInput, regexTelefone, 'Insira um telefone válido');
  validarAoSair(cepInput, regexCep, 'Insira um CEP válido');
  validarAoSair(enderecoInput, regexEndereco, 'Insira um endereço válido');
  validarAoSair(cidadeInput, regexCidade, 'Insira uma cidade válida');
  validarAoSair(estadoInput, regexEstado, 'Insira um estado válido');

  closeModalButton?.addEventListener('click', () => cadastroModal.close());
  cadastroModal?.addEventListener('click', event => {
    if (event.target === cadastroModal) cadastroModal.close();
  });

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

  form.addEventListener('input', ocultarAlertas);

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
      exibirAlerta(successAlert);
      ocultarToast();
      if (cadastroModal && !cadastroModal.open) cadastroModal.showModal();
    } else {
      ocultarToast();
      exibirAlerta(errorAlert);
    }
  });
}

// Execução única: o cadastro é uma página HTML estática, não uma SPA.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', iniciarFormulario, { once: true });
} else {
  iniciarFormulario();
}
