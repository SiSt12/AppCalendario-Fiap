# InteliAgenda: Calendário Inteligente com IA

## Visão Geral

InteliAgenda é uma aplicação de calendário moderna e responsiva, projetada para ir além do agendamento tradicional. Integrada com a Inteligência Artificial do Google (Gemini), a aplicação atua como um assistente pessoal para ajudar estudantes e profissionais a otimizar suas rotinas, gerenciar o tempo de forma eficaz e promover um melhor equilíbrio entre trabalho e vida pessoal.

Este projeto foi desenvolvido como uma solução para o desafio de aprimorar a qualidade de vida em um mundo cada vez mais digital e acelerado.

## Funcionalidades

- **Assistente com Inteligência Artificial:** Um assistente de IA (Gemini) que analisa a agenda do usuário para:
  - Identificar padrões e anomalias na rotina.
  - Sugerir pausas para evitar burnout em dias muito cheios.
  - Recomendar horários de estudo antes de provas e exames.
  - Promover o bem-estar ao notar a falta de pausas para almoço ou descanso.
- **Criação de Calendário por Descrição:** Permite que o usuário descreva sua rotina semanal em linguagem natural, e a IA preenche o calendário automaticamente.
- **Gerenciamento Avançado de Eventos:**
  - Criação, edição e exclusão de eventos com horários de início e fim.
  - Suporte para eventos recorrentes (diário, semanal, mensal e anual).
  - Exclusão inteligente de eventos recorrentes (apenas uma instância ou toda a série).
  - Seleção múltipla para exclusão de vários eventos de uma só vez.
- **Múltiplas Visualizações de Calendário:**
  - **Mensal:** Visão geral completa do mês.
  - **Semanal:** Grade horária detalhada de segunda a domingo.
  - **Diária:** Foco total no dia, com eventos organizados por hora.
- **Personalização e Integração:**
  - Opção para o usuário definir o início da semana (Domingo ou Segunda).
  - Integração para adicionar eventos ao Google Calendar e Outlook.
  - Download de eventos no formato `.ics` para importação em outros calendários.
- **Experiência do Usuário:**
  - Onboarding guiado para novos usuários.
  - Interface de usuário coesa com modais personalizados para todas as interações.
  - Notificações de desktop para lembretes de eventos.
  - Pesquisa de eventos em tempo real.
  - Autenticação segura com dados persistentes no `localStorage`.

## Tecnologias Utilizadas

O projeto utiliza uma arquitetura full-stack:

- **Frontend:**
  - **React 18** (carregado via CDN)
  - **Tailwind CSS** (carregado via CDN para estilização)
  - **Babel Standalone** (para transpilação de JSX no navegador)
- **Backend:**
  - **Node.js**
  - **Express.js** (para o servidor da API)
  - **Google Generative AI SDK** (`@google/generative-ai`)
  - **`cors`** e **`dotenv`** (para segurança e gerenciamento de ambiente)

## Instruções de Execução

Para executar o projeto, é necessário rodar o backend e o frontend simultaneamente em terminais separados.

### 1. Executar o Backend (Servidor da IA)

O backend é responsável pela comunicação segura com a API do Gemini.

1.  **Navegue até a pasta do backend:**
    ```bash
    cd backend
    ```

2.  **Instale as dependências do Node.js:**
    ```bash
    npm install
    ```

3.  **Configure a chave de API:**
    - **Opção A (Recomendado):** Crie um arquivo chamado `.env` na pasta `backend` e adicione sua chave de API:
      ```
      GEMINI_API_KEY=SUA_CHAVE_DE_API_AQUI
      ```
    - **Opção B (Demonstração):** Se preferir, você pode inserir a chave de API diretamente no arquivo `backend/server.js`, substituindo o placeholder.

4.  **Inicie o servidor:**
    ```bash
    node server.js
    ```
    - O terminal deve exibir a mensagem: `Servidor backend escutando em http://localhost:3001`. Mantenha este terminal em execução.

### 2. Executar o Frontend (Interface do Calendário)

O frontend é a interface com a qual o usuário interage.

1.  **Abra um novo terminal** na pasta raiz do projeto.
2.  Utilize um servidor web para servir os arquivos estáticos. Se você possui Node.js, o `http-server` é uma opção simples:
    ```bash
    npx -y http-server -p 8000
    ```
3.  **Acesse a aplicação** em seu navegador no seguinte endereço:
    ```
    http://localhost:8000
    ```

Após seguir estes passos, a aplicação estará totalmente funcional.

## Estrutura do Projeto

```
.
├── backend/
│   ├── node_modules/
│   ├── .env               
│   ├── package.json
│   └── server.js         
│
├── src/
│   ├── App.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── components/
│   │   ├── CalendarGrid.jsx, CalendarHeader.jsx, DayView.jsx, WeekView.jsx
│   │   ├── EventModal.jsx, ConfirmModal.jsx, InfoModal.jsx
│   │   ├── OnboardingModal.jsx, RoutineModal.jsx, MultiSelectToolbar.jsx
│   └── pages/
│       ├── Calendar.jsx, Login.jsx, Register.jsx
│
├── .gitignore
├── index.html             
└── README.md
```
