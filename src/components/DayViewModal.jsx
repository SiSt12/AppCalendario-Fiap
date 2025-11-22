const { useState } = React;

const DayViewModal = ({ date, events, onSave, onClose }) => {
    const [showEventForm, setShowEventForm] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [title, setTitle] = useState('');
    const [time, setTime] = useState('12:00');
    const [description, setDescription] = useState('');
    const [color, setColor] = useState('#ef4444');

    const colors = [
        '#ef4444', '#f97316', '#f59e0b', '#84cc16',
        '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6',
        '#ec4899', '#f43f5e', '#14b8a6', '#a855f7'
    ];

    const dateStr = date.toISOString().split('T')[0];
    const dayEvents = events.filter(e => e.date === dateStr);

    const handleAddNew = () => {
        setEditingEvent(null);
        setTitle('');
        setTime('12:00');
        setDescription('');
        setColor('#ef4444');
        setShowEventForm(true);
    };

    const handleEdit = (event) => {
        setEditingEvent(event);
        setTitle(event.title);
        setTime(event.time);
        setDescription(event.description || '');
        setColor(event.color);
        setShowEventForm(true);
    };

    const handleDelete = (eventId) => {
        if (confirm('Tem certeza que deseja excluir este evento?')) {
            const updatedEvents = events.filter(e => e.id !== eventId);
            onSave(updatedEvents);
        }
    };

    const handleSaveEvent = (e) => {
        e.preventDefault();

        if (!title.trim()) {
            alert('Por favor, insira um título');
            return;
        }

        if (editingEvent) {
            // Update existing event
            const updatedEvents = events.map(ev =>
                ev.id === editingEvent.id
                    ? { ...ev, title, time, description, color, date: dateStr }
                    : ev
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

        setShowEventForm(false);
    };

    const handleCancelForm = () => {
        setShowEventForm(false);
        setEditingEvent(null);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in" onClick={onClose}>
            <div className="glass-effect rounded-2xl p-6 w-full max-w-2xl shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            {date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
                                .split(' ')
                                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                .join(' ')}
                        </h2>
                        <p className="text-gray-600 text-sm mt-1">{dayEvents.length} evento(s)</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-600 hover:text-gray-800 text-2xl"
                    >
                        ×
                    </button>
                </div>

                {/* Event Form */}
                {showEventForm ? (
                    <form onSubmit={handleSaveEvent} className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-800">
                            {editingEvent ? 'Editar Evento' : 'Novo Evento'}
                        </h3>

                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Título</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="Título do evento"
                                autoFocus
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Horário</label>
                            <input
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Descrição</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                                rows="2"
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
                                        className={`w-8 h-8 rounded-lg transition-transform ${color === c ? 'ring-2 ring-gray-800 scale-110' : ''}`}
                                        style={{ backgroundColor: c }}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                            <button
                                type="button"
                                onClick={handleCancelForm}
                                className="flex-1 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="flex-1 py-2 btn-primary text-white rounded-lg"
                            >
                                {editingEvent ? 'Atualizar' : 'Criar'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <button
                        onClick={handleAddNew}
                        className="w-full py-3 mb-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-all"
                    >
                        + Adicionar Evento
                    </button>
                )}

                {/* Events List */}
                <div className="space-y-3">
                    {dayEvents.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">Nenhum evento neste dia</p>
                    ) : (
                        dayEvents
                            .sort((a, b) => a.time.localeCompare(b.time))
                            .map(event => (
                                <div
                                    key={event.id}
                                    className="p-4 rounded-lg bg-white border-l-4 hover:shadow-md transition-all"
                                    style={{ borderLeftColor: event.color }}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-semibold text-gray-800">{event.time}</span>
                                                <span className="text-lg font-bold text-gray-900">{event.title}</span>
                                            </div>
                                            {event.description && (
                                                <p className="text-gray-600 text-sm mt-1">{event.description}</p>
                                            )}
                                        </div>
                                        <div className="flex gap-2 ml-4">
                                            <button
                                                onClick={() => handleEdit(event)}
                                                className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-all"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDelete(event.id)}
                                                className="px-3 py-1 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded transition-all"
                                            >
                                                Excluir
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                    )}
                </div>
            </div>
        </div>
    );
};

// Export to window
window.DayViewModal = DayViewModal;
