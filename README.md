# Site da ONG

Site institucional estático de uma organização não governamental, com páginas de apresentação, projetos e cadastro de voluntários. A interface é feita com HTML, CSS e JavaScript no navegador, sem framework ou servidor de aplicação. O Webpack gera uma versão otimizada para produção.

## Conteúdo

- [Visão geral](#visao-geral)
- [Páginas](#paginas)
- [Funcionalidades](#funcionalidades)
- [Tecnologias e arquitetura](#tecnologias-e-arquitetura)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Pré-requisitos](#pre-requisitos)
- [Instalação de dependências](#instalacao-de-dependencias)
- [Execução local](#execucao-local)
- [Cadastro e armazenamento](#cadastro-e-armazenamento)
- [Limitações e privacidade](#limitacoes-e-privacidade)
- [Build de produção](#build-de-producao)
- [Testes](#testes)

## Visão geral

O projeto apresenta informações institucionais e projetos da ONG, além de permitir o preenchimento de um formulário de voluntariado. O layout é responsivo e compartilha cabeçalho e navegação entre as páginas.

A navegação é feita por links HTML convencionais. Não há roteador, renderização dinâmica de páginas ou templates JavaScript no projeto.

## Páginas

- `index.html`: página principal com imagem de destaque e mensagem institucional.
- `projetos.html`: cartões com imagens, descrições e indicadores de status dos projetos.
- `cadastro.html`: formulário de voluntariado com dados pessoais e áreas de interesse.

## Funcionalidades

- Navegação compartilhada entre as páginas, incluindo menu adaptado para telas menores.
- Modo escuro com paleta própria, seleção persistente entre as páginas e controle acessível na navegação.
- Layout responsivo para celulares, tablets e desktops.
- Máscaras de entrada para CPF, telefone e CEP.
- Validação de campos do formulário e mensagens junto aos campos inválidos.
- Erros associados aos campos com `aria-invalid` e `aria-describedby`, com foco direcionado ao primeiro campo inválido.
- Indicadores de foco visíveis nos campos e no diálogo do cadastro.
- Toast temporário quando um campo válido perde o foco.
- Alertas de sucesso ou erro abaixo do formulário.
- Modal exibido quando todos os campos passam pela validação no navegador.
- Salvamento automático dos campos em um rascunho local, restaurado ao abrir novamente a página.

## Tecnologias e arquitetura

- HTML5 para a estrutura das páginas.
- CSS3 para estilos, variáveis de cores e espaçamento, componentes e breakpoints responsivos; o Webpack processa e extrai o CSS.
- JavaScript sem framework para máscaras, validação, persistência local e feedback; o Webpack reúne os módulos e minimiza o bundle de produção.
- `html-webpack-plugin` gera e minifica as três páginas HTML; `sharp` converte os PNGs originais para WebP durante a cópia para `dist/`, e as páginas geradas apontam para os arquivos convertidos.
- IMask carregado pelo CDN `https://unpkg.com/imask` e usado na página de cadastro.

Os módulos do cadastro usam o namespace global `OngCadastro`. `js/src/index.js` importa os scripts na ordem necessária; `js/JavaScript.js` inicializa `registrationForm` depois que o documento está disponível.

## Estrutura do projeto

```text
.
|-- README.md
|-- package.json
|-- package-lock.json
|-- index.html
|-- projetos.html
|-- cadastro.html
|-- css/
|   `-- style.css
|-- js/
|   |-- src/
|   |   `-- index.js            # Entrada do bundle Webpack
|   |-- JavaScript.js       # Ponto de entrada; inicialização
|   |-- registrationForm.js # Coordenação do formulário e eventos
|   |-- masks.js            # Máscaras de CPF, telefone e CEP
|   |-- theme.js            # Alternância e persistência do tema
|   |-- validation.js       # Regras e mensagens de validação
|   |-- draftStorage.js     # Rascunho salvo no localStorage
|   `-- feedback.js         # Alertas, toast e modal
|-- webpack/
|   `-- webpack.config.js
`-- imagens/
    |-- estrela.png
    |-- home-fundo.png
    |-- home-fundo-2.png
    |-- calendario.png
    |-- projeto A.png
    |-- projeto B.png
    `-- projeto C.png
```

## Pré-requisitos

- Navegador moderno com suporte a HTML5, CSS Grid, `localStorage` e ao elemento `<dialog>`.
- Conexão com a internet para carregar o IMask pelo CDN na página de cadastro.
- Opcional: Python 3 para iniciar um servidor HTTP local.
- Node.js e npm para instalar as dependências e gerar o build.

Não é necessário instalar um framework ou servidor backend para visualizar as páginas.

## Instalação de dependências

Na raiz do projeto, instale as dependências registradas no `package-lock.json` com:

```powershell
npm ci
```

A página de cadastro obtém a biblioteca IMask pelo CDN declarado em `cadastro.html`. Ela precisa de acesso à internet; sem conexão, as máscaras de CPF, telefone e CEP não serão aplicadas.

## Execução local

É possível abrir `index.html` diretamente no navegador. Para uma origem HTTP local, abra o PowerShell na pasta raiz do projeto e execute:

```powershell
py -m http.server 8000
```

Se o comando `py` não estiver disponível, use:

```powershell
python -m http.server 8000
```

Acesse `http://localhost:8000/` no navegador. Para interromper o servidor, pressione `Ctrl+C` no terminal.

## Cadastro e armazenamento

A página aplica as máscaras e valida os campos no cliente. Os rascunhos são gravados no `localStorage` do navegador sob a chave `meuRascunho` e restaurados quando a página é aberta novamente.

O envio atual é interceptado pelo JavaScript para exibir o resultado da validação. O formulário aponta para `processar_cadastro.php`, mas esse arquivo/backend não existe neste repositório. Assim, o modal significa que os campos foram validados no navegador; os dados ainda não são enviados nem salvos em um servidor.

## Limitações e privacidade

O rascunho local inclui dados pessoais, como nome, data de nascimento, e-mail, CPF, telefone e endereço. Ele fica armazenado sem criptografia no navegador e pode permanecer disponível para outras pessoas que usem o mesmo perfil. Para remover o rascunho, abra o console do navegador na página do cadastro e execute:

```javascript
localStorage.removeItem('meuRascunho');
```

Não use dados pessoais reais em testes. Antes de publicar um cadastro funcional, implemente um backend seguro, validação no servidor, política de privacidade e tratamento apropriado desses dados.

## Build de produção

O Webpack está configurado em `webpack/webpack.config.js`. A entrada `js/src/index.js` importa os estilos e os módulos JavaScript na ordem necessária. No desenvolvimento, o `style-loader` injeta o CSS; no build de produção, o `mini-css-extract-plugin` o extrai e o `css-minimizer-webpack-plugin` o minifica. O Webpack também minimiza o JavaScript, enquanto `html-webpack-plugin` gera e minifica as três páginas HTML. Durante a compilação, `sharp` converte os PNGs originais para WebP com qualidade 82, e as páginas compiladas são atualizadas para carregar essas versões. Os PNGs-fonte não são alterados. O resultado pronto para publicação fica em `dist/`.

Na raiz do projeto, execute:

```powershell
npm run build
```

Para compilar sem as otimizações de produção ou recompilar automaticamente ao alterar os arquivos:

```powershell
npm run dev
npm run watch
```

Para testar a versão de produção, sirva a pasta `dist/` por HTTP:

```powershell
py -m http.server 8000 --directory .\dist
```

Abra `http://localhost:8000/`. Repita `npm run build` depois de alterar o código ou as imagens para atualizar os arquivos minificados e WebP.

## Testes

O repositório ainda não possui uma suíte automatizada. Depois de instalar as dependências, valide a compilação com `npm run build` e confira a versão gerada no navegador:

1. Abra as três páginas e teste a navegação e o menu em larguras de celular e desktop.
2. Na página de cadastro, envie o formulário vazio e confirme o alerta, o foco no primeiro erro e os atributos `aria-invalid`/`aria-describedby` dos campos.
3. Preencha dados fictícios válidos e confira as máscaras, o toast ao sair de um campo e seu desaparecimento após alguns segundos.
4. Envie o formulário válido e confira o alerta abaixo do formulário, a abertura do modal e o fechamento pelo botão ou pela tecla `Esc`.
5. Recarregue a página e confirme que os campos preenchidos foram restaurados do rascunho local.
