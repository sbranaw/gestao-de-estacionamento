# Gestão de Estacionamento - Portaria

Este é um sistema web desenvolvido para o controle de acesso e gestão de veículos em portarias de condomínios, empresas ou estacionamentos particulares. A aplicação visa simplificar o registro e a monitorização de veículos, proporcionando uma interface intuitiva e funcionalidades de resposta rápida para os porteiros ou operadores.

## Para que serve a aplicação?

A aplicação funciona como um painel de controle (Dashboard) para o operador da portaria. Ela permite:
- **Controlar o fluxo de entrada e saída:** Registrar visualmente se um veículo está "Presente no Pátio" ou "Fora".
- **Gerir permissões:** Identificar rapidamente se um veículo está "Autorizado", com status "Pendente" ou "Não Autorizado" para entrar.
- **Organizar vagas:** Classificar o tipo de vaga utilizada (Fixa, Esporádica ou Visitante) e o tipo de veículo (Carro ou Moto).
- **Manter um cadastro detalhado:** Armazenar informações importantes como nome do proprietário/condutor, unidade/bloco correspondente, telefone de contato, placa, modelo e cor do veículo.

## Funcionalidades de Ponta a Ponta

A aplicação foi desenhada para cobrir todo o ciclo de vida do controle de um veículo:

1. **Visualização Geral (Dashboard):** 
   - A tela inicial exibe cartões (cards) para cada veículo cadastrado, mostrando a placa, o status atual (No Pátio, Aguardando, Não Autorizado), além de detalhes como nome, unidade e modelo do veículo.
   - Design moderno utilizando efeitos *glassmorphism* e ícones Phosphor para melhor legibilidade.

2. **Cadastro de Novos Veículos:**
   - Através do botão "Novo Registro", o operador pode adicionar um veículo ao sistema, preenchendo todos os dados necessários (Nome, Unidade, Telefone, Placa, Modelo, Tipo, Tipo de Vaga e Status de Autorização).

3. **Edição e Exclusão:**
   - Clicando em qualquer cartão de veículo, um modal é aberto exibindo todos os detalhes.
   - O operador pode clicar em "Editar" para atualizar informações ou "Excluir" para remover o registro do sistema de forma permanente.

4. **Controle de Entrada e Saída:**
   - Nos cartões dos veículos autorizados que estão fora do pátio, há um botão para "Liberar Entrada". Ao clicar, o sistema registra a hora exata da entrada e muda o status para "Presente".
   - Para os veículos que estão no pátio, o botão muda para "Registrar Saída", permitindo liberar o veículo do sistema.

5. **Busca e Filtros Inteligentes:**
   - **Barra de Busca:** Permite procurar instantaneamente veículos por placa, nome do proprietário ou unidade/bloco.
   - **Filtros Rápidos:** Botões na parte superior permitem filtrar a visualização por: Todos, Presentes no Pátio, Aguardando Liberação, Não Autorizados, Vagas Fixas, Vagas Esporádicas e Vagas Visitantes.

6. **Armazenamento de Dados:**
   - Todo o sistema funciona nativamente no navegador utilizando o `localStorage`. Isso significa que os dados não são perdidos ao recarregar a página, não necessitando de um banco de dados externo ou servidor complexo para funcionar de forma imediata.

## Como rodar o projeto

Por ser uma aplicação baseada inteiramente no lado do cliente (Frontend) utilizando HTML, CSS (Vanilla) e JavaScript, não há necessidade de instalação de dependências ou de um servidor backend complexo (Node.js, Python, etc).

Para rodar a aplicação na sua máquina, siga os passos abaixo:

1. **Faça o download ou clone o repositório:**
   Tenha certeza de que todos os arquivos (`index.html`, pasta `css` e pasta `js`) estão no mesmo diretório.

2. **Execute no Navegador:**
   A forma mais simples de rodar é simplesmente dar um duplo clique no arquivo `index.html`. O arquivo será aberto no seu navegador padrão (Chrome, Edge, Firefox, Safari) e a aplicação estará pronta para uso.

3. **Utilizando uma extensão de Live Server (Opcional, porém recomendado):**
   Se você estiver utilizando um editor de código como o **Visual Studio Code (VSCode)**, é recomendado o uso da extensão "Live Server".
   - Abra a pasta do projeto no VSCode.
   - Instale a extensão "Live Server".
   - Clique com o botão direito no arquivo `index.html` e selecione **"Open with Live Server"**.
   - Isso iniciará um servidor local e abrirá a aplicação automaticamente no navegador, recarregando a página sempre que alguma alteração no código for salva.

> **Nota sobre os Dados:** Como a aplicação utiliza o `localStorage` do navegador para persistir as informações, se você abrir o arquivo `index.html` em navegadores diferentes ou limpar o cache/dados do seu navegador, as informações cadastradas serão reiniciadas para os dados de exemplo (mock data) padrões.