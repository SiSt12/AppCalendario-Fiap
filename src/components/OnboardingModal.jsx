const OnboardingModal = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[100] animate-fade-in">
            <div className="glass-effect rounded-2xl p-8 w-full max-w-lg shadow-2xl animate-scale-in text-center">
                <h2 className="text-3xl font-bold text-black mb-4">Bem-vindo ao seu Calendário Inteligente!</h2>
                <p className="text-black mb-6">
                    Este não é um calendário comum. Nossa IA está aqui para ajudar você a otimizar sua rotina e melhorar sua qualidade de vida.
                </p>
                <div className="text-left bg-white/50 p-4 rounded-lg mb-6">
                    <h3 className="font-semibold text-lg text-black mb-2">Como funciona?</h3>
                    <p className="text-sm text-gray-800">
                        Para receber sugestões personalizadas, comece a adicionar seus eventos. Quanto mais informações você fornecer, mais inteligentes serão as recomendações.
                    </p>
                    <ul className="list-disc list-inside text-sm text-gray-800 mt-2 space-y-1">
                        <li>Adicione suas <strong className="text-black">provas e exames</strong>.</li>
                        <li>Marque seus <strong className="text-black">compromissos e reuniões</strong>.</li>
                        <li>Defina seus <strong className="text-black">objetivos pessoais</strong>, como "Ir à academia".</li>
                    </ul>
                </div>
                <button
                    onClick={onClose}
                    className="btn-primary text-white px-8 py-3 rounded-lg text-lg font-semibold transition-transform hover:scale-105"
                >
                    Começar a Planejar
                </button>
            </div>
        </div>
    );
};

window.OnboardingModal = OnboardingModal;
