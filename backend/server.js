const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = "PASTE_YOUR_API_KEY_HERE";

if (!GEMINI_API_KEY || GEMINI_API_KEY === "PASTE_YOUR_API_KEY_HERE") {
    throw new Error("Por favor, substitua 'PASTE_YOUR_API_KEY_HERE' pela sua chave de API do Gemini em backend/server.js");
}
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

app.post('/api/suggest', async (req, res) => {
    try {
        const { events } = req.body;
        const model = genAI.getGenerativeModel({ model: 'gemini-pro-latest' });

        const prompt = `
            Você é "InteliAgenda", um assistente de IA especialista em produtividade e bem-estar.
            Sua meta é analisar o calendário de um usuário e fornecer UMA sugestão acionável e perspicaz.

            Analise o calendário procurando por:
            1.  **Padrões e Anomalias:** Identifique rotinas e perceba quando são interrompidas.
            2.  **Carga de Trabalho e Burnout:** Encontre dias muito cheios sem pausas.
            3.  **Procrastinação de Metas:** Procure por prazos importantes sem tempo de preparação agendado.
            4.  **Lacunas de Bem-Estar:** Note se o usuário está pulando refeições ou não tem tempo livre.

            Hoje é: ${new Date().toLocaleDateString('pt-BR')}.
            Eventos do usuário: ${JSON.stringify(events, null, 2)}

            Baseado na sua análise, forneça sua melhor sugestão no seguinte formato JSON. Todo o texto deve estar em Português do Brasil.
            Use a paleta de cores para categorizar sua sugestão.

            Paleta de Cores:
            - Produtividade/Estudo/Trabalho: '#3b82f6' (Azul)
            - Bem-estar/Saúde/Exercício: '#10b981' (Verde)
            - Lazer/Social/Pessoal: '#8b5cf6' (Roxo)
            - Refeições: '#f59e0b' (Âmbar)
            - Outro/Geral: '#64748b' (Cinza)

            {
              "suggestionType": "CREATE_EVENT" | "OBSERVATION" | "QUESTION",
              "title": "Um título curto e envolvente para sua sugestão.",
              "description": "Sua análise detalhada e raciocínio, em um tom prestativo e encorajador.",
              "eventDetails": {
                "title": "Título do Evento",
                "date": "YYYY-MM-DD",
                "startTime": "HH:MM",
                "endTime": "HH:MM",
                "description": "Descrição do evento.",
                "color": "#3b82f6"
              }
            }

            Responda APENAS com um único objeto JSON válido, sem nenhum outro texto ou markdown.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const jsonResponse = JSON.parse(text.replace(/```json/g, '').replace(/```/g, '').trim());
        res.json({ suggestion: jsonResponse });

    } catch (error) {
        console.error("Erro ao chamar a API Gemini para sugestão:", error);
        res.status(500).json({ error: 'Falha ao obter sugestão da IA. Verifique o console do backend para detalhes.' });
    }
});

app.post('/api/parse-routine', async (req, res) => {
    try {
        const { routineText } = req.body;
        const model = genAI.getGenerativeModel({ model: 'gemini-pro-latest' });

        const prompt = `
            Você é um assistente de calendário especialista. Sua tarefa é ler o texto a seguir, que descreve a rotina semanal de um usuário, e convertê-lo em um array estruturado de objetos de evento.
            Regras:
            1.  Identifique todas as atividades semanais recorrentes.
            2.  Determine o dia da semana, hora de início e hora de término. Se a hora de término não for especificada, assuma a duração de 1 hora.
            3.  A saída DEVE ser um array JSON válido.
            4.  Atribua uma cor relevante da paleta fornecida.
            5.  Todo o texto na saída deve estar em Português do Brasil.
            6.  Para a propriedade 'daysOfWeek', use um array de números onde Domingo=0, Segunda=1, etc.

            Paleta de Cores:
            - Estudo/Trabalho: '#3b82f6' (Azul)
            - Exercício/Saúde: '#10b981' (Verde)
            - Pessoal/Lazer: '#8b5cf6' (Roxo)
            - Refeições: '#f59e0b' (Âmbar)
            - Outro: '#64748b' (Cinza)

            Texto da Rotina do Usuário: "${routineText}"

            Responda APENAS com um único array JSON válido, sem nenhum outro texto ou markdown.
            [
              {
                "title": "Título do Evento",
                "daysOfWeek": [1, 3],
                "startTime": "HH:MM",
                "endTime": "HH:MM",
                "description": "Descrição breve da atividade.",
                "color": "#3b82f6"
              }
            ]
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const jsonResponse = JSON.parse(text.replace(/```json/g, '').replace(/```/g, '').trim());
        res.json({ events: jsonResponse });

    } catch (error) {
        console.error("Erro ao chamar a API Gemini para análise de rotina:", error);
        res.status(500).json({ error: 'Falha ao analisar a rotina com a IA.' });
    }
});

app.listen(port, () => {
    console.log(`Servidor backend escutando em http://localhost:${port}`);
});
