# Calendário

Aplicativo de calendário em React com autenticação e gerenciamento de eventos.

## 🚀 Como Usar

1. Abra `index.html` no navegador ou execute:
   ```bash
   npx -y http-server -p 8000
   ```
2. Acesse `http://localhost:8000`
3. Cadastre-se e comece a usar!

## ✨ Funcionalidades

- **Autenticação** - Login e cadastro com localStorage
- **Visualização Mensal** - Navegue entre meses
- **Gerenciar Eventos** - Adicione, edite e exclua eventos
- **Cores Vibrantes** - 12 cores para organizar seus eventos
- **Visualização por Dia** - Clique em um dia para ver todos os eventos
- **Design Responsivo** - Funciona em desktop e mobile
- **Dados Persistentes** - Tudo salvo no navegador

## 📁 Estrutura

```
src/
├── App.jsx                    # Componente principal
├── context/
│   └── AuthContext.jsx        # Autenticação
├── components/
│   ├── CalendarGrid.jsx       # Grade do calendário
│   ├── CalendarHeader.jsx     # Cabeçalho e navegação
│   ├── DayViewModal.jsx       # Popup de visualização do dia
│   └── EventModal.jsx         # Modal de eventos (legado)
└── pages/
    ├── Login.jsx              # Página de login
    ├── Register.jsx           # Página de cadastro
    └── Calendar.jsx           # Calendário principal
```

## 🔧 Tecnologias

- React 18 (CDN)
- Tailwind CSS (CDN)
- Babel Standalone
- localStorage

## 📝 Observações

Aplicativo standalone - não requer Node.js ou npm. Todas as dependências são carregadas via CDN.
