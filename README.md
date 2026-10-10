# Site da ONG

Site institucional estático de uma organização não governamental, com páginas de apresentação, projetos e cadastro de voluntários. A interface é feita com HTML, CSS e JavaScript no navegador, sem framework, servidor de aplicação ou processo de compilação obrigatório.

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
- [Build](#build)
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
- CSS3 para estilos, variáveis de cores e espaçamento, componentes e breakpoints responsivos.
- JavaScript sem framework para máscaras, validação, persistência local e feedback.
- IMask carregado pelo CDN `https://unpkg.com/imask` e usado na página de cadastro.

Os scripts do cadastro usam o namespace global `OngCadastro` e são carregados com `defer` na ordem necessária. `js/JavaScript.js` é o ponto de entrada e inicializa `registrationForm` depois que o documento está disponível.

## Estrutura do projeto

```text
.
|-- README.md
|-- index.html
|-- projetos.html
|-- cadastro.html
|-- css/
|   `-- style.css
|-- js/
|   |-- JavaScript.js       # Ponto de entrada; inicialização
|   |-- registrationForm.js # Coordenação do formulário e eventos
|   |-- masks.js            # Máscaras de CPF, telefone e CEP
|   |-- validation.js       # Regras e mensagens de validação
|   |-- draftStorage.js     # Rascunho salvo no localStorage
|   `-- feedback.js         # Alertas, toast e modal
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
- Opcional: Node.js para verificar a sintaxe dos arquivos JavaScript.

Não é necessário instalar um framework, gerenciador de pacotes ou servidor backend para visualizar as páginas.

## Instalação de dependências

Não há dependências locais declaradas e o projeto não contém `package.json`. Portanto, não é necessário executar `npm install` ou outro comando de instalação.

A página de cadastro obtém a biblioteca IMask diretamente do CDN declarado em `cadastro.html`. Ela precisa de acesso à internet. Sem conexão, o formulário continua disponível, mas as máscaras de CPF, telefone e CEP não serão aplicadas.

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

## Build

Não há bundler nem etapa de compilação configurados. Os arquivos HTML, CSS, JavaScript e imagens podem ser publicados diretamente. O comando abaixo cria uma pasta `dist` com uma cópia estática do site; ele não transpila, otimiza ou minifica os arquivos.

Execute no PowerShell, a partir da raiz do projeto:

```powershell
New-Item -ItemType Directory -Force -Path .\dist, .\dist\css, .\dist\js, .\dist\imagens | Out-Null
Copy-Item -Path .\index.html, .\projetos.html, .\cadastro.html -Destination .\dist -Force
Copy-Item -Path .\css\* -Destination .\dist\css -Recurse -Force
Copy-Item -Path .\js\* -Destination .\dist\js -Recurse -Force
Copy-Item -Path .\imagens\* -Destination .\dist\imagens -Recurse -Force
```

Para servir a cópia, execute:

```powershell
Set-Location .\dist
py -m http.server 8000
```

Depois acesse `http://localhost:8000/`.

## Testes

O repositório não possui suíte automatizada, framework de testes ou comando `npm test`. O comando abaixo verifica erros de sintaxe nos scripts JavaScript; ele requer Node.js e não substitui testes de comportamento:

```powershell
Get-ChildItem .\js\*.js -File | ForEach-Object {
    node --check $_.FullName
    if ($LASTEXITCODE -ne 0) {
        throw "Erro de sintaxe em $($_.Name)"
    }
}
```

Faça também uma verificação manual no navegador:

1. Abra as três páginas e teste a navegação e o menu em larguras de celular e desktop.
2. Na página de cadastro, envie o formulário vazio e confirme o alerta, o foco no primeiro erro e os atributos `aria-invalid`/`aria-describedby` dos campos.
3. Preencha dados fictícios válidos e confira as máscaras, o toast ao sair de um campo e seu desaparecimento após alguns segundos.
4. Envie o formulário válido e confira o alerta abaixo do formulário, a abertura do modal e o fechamento pelo botão ou pela tecla `Esc`.
5. Recarregue a página e confirme que os campos preenchidos foram restaurados do rascunho local.
