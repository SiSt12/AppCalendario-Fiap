const CalendarHeader = ({ monthYear, onPrevMonth, onNextMonth, onToday, userName, onLogout }) => {
    return (
        <>
            {/* User Header */}
            <div className="glass-effect rounded-2xl p-6 mb-6 shadow-xl">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-1">Meu Calendário</h1>
                        <p className="text-gray-600">Bem-vindo de volta, {userName}!</p>
                    </div>
                    <button
                        onClick={onLogout}
                        className="px-6 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg transition-all"
                    >
                        Sair
                    </button>
                </div>
            </div>

            {/* Calendar Navigation */}
            <div className="glass-effect rounded-2xl p-6 mb-6 shadow-xl">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <h2 className="text-2xl font-bold text-gray-800">{monthYear}</h2>
                    <div className="flex gap-2">
                        <button
                            onClick={onPrevMonth}
                            className="px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg transition-all"
                        >
                            ← Anterior
                        </button>
                        <button
                            onClick={onToday}
                            className="px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg transition-all"
                        >
                            Hoje
                        </button>
                        <button
                            onClick={onNextMonth}
                            className="px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg transition-all"
                        >
                            Próximo →
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

// Export to window
window.CalendarHeader = CalendarHeader;
