const { useState } = React;

const EventModal = ({ date, event, events, onSave, onClose }) => {
    const [title, setTitle] = useState(event?.title || '');
    const [time, setTime] = useState(event?.time || '12:00');
    const [description, setDescription] = useState(event?.description || '');
    const [color, setColor] = useState(event?.color || '#ef4444');

    const colors = [
        '#ef4444', '#f97316', '#f59e0b', '#84cc16',
        '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6',
        '#ec4899', '#f43f5e', '#14b8a6', '#a855f7'
    ];

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!title.trim()) {
            alert('Por favor, insira um título');
            return;
        }

        const dateStr = date.toISOString().split('T')[0];

        if (event) {
            // Update existing event
            const updatedEvents = events.map(e =>
                e.id === event.id
                    ? { ...e, title, time, description, color, date: dateStr }
                    : e
            );
            onSave(updatedEvents);
        } else {
            // Create new event
            const newEvent = {
                id: Date.now(),
                title,
                time,
                description,
                color,
                date: dateStr
            };
            onSave([...events, newEvent]);
        }

        onClose();
    };

    const handleDelete = () => {
        if (event && confirm('Tem certeza que deseja excluir este evento?')) {
            const updatedEvents = events.filter(e => e.id !== event.id);
            onSave(updatedEvents);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="glass-effect rounded-2xl p-6 w-full max-w-md shadow-2xl animate-scale-in">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {event ? 'Editar Evento' : 'Novo Evento'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-600 hover:text-gray-800 text-2xl"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Título</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-white/90 focus:outline-none focus:ring-2 focus:ring-primary-400"
                            placeholder="Título do evento"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Data</label>
                        <input
                            type="text"
                            value={date.toLocaleDateString()}
                            disabled
                            className="w-full px-4 py-2 rounded-lg bg-white/50 text-gray-700"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Horário</label>
                        <input
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-white/90 focus:outline-none focus:ring-2 focus:ring-primary-400"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Descrição</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-white/90 focus:outline-none focus:ring-2 focus:ring-primary-400"
                            rows="3"
                            placeholder="Descrição do evento (opcional)"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Cor</label>
                        <div className="flex gap-2 flex-wrap">
                            {colors.map(c => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => setColor(c)}
                                    className={`w-10 h-10 rounded-lg transition-transform ${color === c ? 'ring-2 ring-white scale-110' : ''
                                        }`}
                                    style={{ backgroundColor: c }}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                        {event && (
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all"
                            >
                                Excluir
                            </button>
                        )}
                        <button
                            type="submit"
                            className="flex-1 py-2 btn-primary text-white rounded-lg"
                        >
                            {event ? 'Atualizar' : 'Criar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Export to window
window.EventModal = EventModal;
