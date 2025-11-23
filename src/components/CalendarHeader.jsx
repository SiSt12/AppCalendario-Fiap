const CalendarHeader = ({ monthYear, onPrev, onNext, onToday, userName, onLogout, view, setView, onOpenRoutineModal, weekStartDay, setWeekStartDay, searchQuery, setSearchQuery }) => {
    const viewOptions = [
        { key: 'month', label: 'Mês' },
        { key: 'week', label: 'Semana' },
        { key: 'day', label: 'Dia' },
    ];

    const toggleWeekStart = () => {
        const newStartDay = weekStartDay === 0 ? 1 : 0;
        setWeekStartDay(newStartDay);
    };

    return (
        <>
            <div className="glass-effect rounded-2xl p-6 mb-6 shadow-xl">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-black">InteliAgenda</h1>
                        <p className="text-black">Bem-vindo de volta, {userName}!</p>
                    </div>
                    <div className="w-full md:w-auto">
                        <input
                            type="text"
                            placeholder="Pesquisar eventos..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                        />
                    </div>
                    <button
                        onClick={onLogout}
                        className="px-6 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg transition-all"
                    >
                        Sair
                    </button>
                </div>
            </div>

            <div className="glass-effect rounded-2xl p-6 mb-6 shadow-xl">
                <div className="flex flex-wrap justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-bold text-black">{monthYear}</h2>
                        <div className="flex gap-2">
                            <button onClick={onPrev} className="px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg transition-all">←</button>
                            <button onClick={onToday} className="px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg transition-all">Hoje</button>
                            <button onClick={onNext} className="px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg transition-all">→</button>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={onOpenRoutineModal} className="px-3 py-1 text-sm font-medium bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors">Descrever Rotina</button>
                        <button onClick={toggleWeekStart} className="px-3 py-1 text-sm font-medium bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors" title={`Mudar início da semana para ${weekStartDay === 0 ? 'Segunda' : 'Domingo'}`}>Início: {weekStartDay === 0 ? 'Dom' : 'Seg'}</button>
                        <div className="flex items-center bg-gray-300 rounded-lg p-1">
                            {viewOptions.map(option => (
                                <button
                                    key={option.key}
                                    onClick={() => setView(option.key)}
                                    className={`px-4 py-1 text-sm font-medium rounded-md transition-colors ${view === option.key ? 'bg-white text-black shadow' : 'text-gray-600 hover:bg-white/50'}`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

window.CalendarHeader = CalendarHeader;
