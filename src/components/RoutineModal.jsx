const { useState } = React;

const RoutineModal = ({ onClose, onParse, isLoading }) => {
    const [routineText, setRoutineText] = useState('');

    const handleSubmit = () => {
        if (routineText.trim()) {
            onParse(routineText);
        } else {
            alert("Por favor, descreva sua rotina na caixa de texto.");
        }
    };

    const placeholderText = `Exemplo:
"Minha semana é bem corrida. Eu tenho aula de Cálculo toda segunda e quarta das 19h às 22h. Faço academia nas terças e quintas de manhã, das 8h às 9h. Meu estágio é de segunda a sexta, das 14h às 18h. Gosto de reservar a noite de sexta para sair com amigos."`;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[100] animate-fade-in">
            <div className="glass-effect rounded-2xl p-8 w-full max-w-2xl shadow-2xl animate-scale-in">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-3xl font-bold text-black">Descreva sua Rotina Semanal</h2>
                    <button onClick={onClose} className="text-black hover:text-black text-3xl">&times;</button>
                </div>
                <p className="text-black mb-6">
                    Escreva sobre suas atividades semanais fixas em linguagem natural. A IA irá analisar o texto e preencher seu calendário automaticamente.
                </p>
                <textarea
                    value={routineText}
                    onChange={(e) => setRoutineText(e.target.value)}
                    className="w-full h-48 p-4 rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                    placeholder={placeholderText}
                />
                <div className="mt-6 text-right">
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="btn-primary text-white px-8 py-3 rounded-lg text-lg font-semibold transition-transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Analisando...' : 'Analisar e Preencher Calendário'}
                    </button>
                </div>
            </div>
        </div>
    );
};

window.RoutineModal = RoutineModal;
