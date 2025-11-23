const { useState, useEffect } = React;
const { ConfirmModal, RecurringDeleteModal } = window;

const EventModal = ({ date, event, events, onSave, onClose, weekStartDay = 0, showInfo }) => {
    const [isEditing, setIsEditing] = useState(!event);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [showRecurringDelete, setShowRecurringDelete] = useState(false);
    const [errors, setErrors] = useState({});

    const [title, setTitle] = useState(event?.title || '');
    const [startTime, setStartTime] = useState(event?.startTime || '12:00');
    const [endTime, setEndTime] = useState(event?.endTime || '13:00');
    const [description, setDescription] = useState(event?.description || '');
    const [color, setColor] = useState(event?.color || '#ef4444');
    
    const [recurrence, setRecurrence] = useState('none');
    const [selectedDays, setSelectedDays] = useState([]);
    
    const dayLabels = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
    const orderedDayInfo = [...dayLabels.slice(weekStartDay), ...dayLabels.slice(0, weekStartDay)].map((label, index) => ({ label, originalIndex: (index + weekStartDay) % 7 }));

    useEffect(() => {
        if (isEditing && !event) {
            const [hours, minutes] = startTime.split(':').map(Number);
            const startDate = new Date();
            startDate.setHours(hours, minutes, 0, 0);
            startDate.setHours(startDate.getHours() + 1);
            const newEndTime = `${String(startDate.getHours()).padStart(2, '0')}:${String(startDate.getMinutes()).padStart(2, '0')}`;
            setEndTime(newEndTime);
        }
    }, [startTime, isEditing, event]);

    const colors = ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#14b8a6', '#a855f7'];

    const validateForm = () => {
        const newErrors = {};
        if (!title.trim()) newErrors.title = 'O título é obrigatório.';
        if (startTime >= endTime) newErrors.time = 'O horário de término deve ser posterior ao de início.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        if (!event && recurrence !== 'none') {
            const newEvents = generateRecurringEvents(recurrence, date);
            onSave([...events, ...newEvents]);
            showInfo('Sucesso!', `${newEvents.length} eventos recorrentes foram adicionados.`);
        } else {
            const dateStr = (event ? new Date(event.date + 'T00:00:00') : date).toISOString().split('T')[0];
            const eventData = { ...event, id: event?.id || Date.now(), title, startTime, endTime, description, color, date: dateStr };
            const updatedEvents = event ? events.map(e => (e.id === event.id ? eventData : e)) : [...events, eventData];
            onSave(updatedEvents);
        }
        onClose();
    };
    
    const generateRecurringEvents = (frequency, startDate) => {
        const generatedEvents = [];
        const fromDate = new Date(startDate);
        fromDate.setHours(0, 0, 0, 0);
        const recurrenceId = `recur_${Date.now()}`;
        const eventData = { title, startTime, endTime, description, color, recurrenceId };

        if (frequency === 'weekly') {
            const daysToRepeat = selectedDays.length > 0 ? selectedDays : [fromDate.getDay()];
            for (let i = 0; i < 13; i++) { // 13 weeks
                daysToRepeat.forEach(day => {
                    const targetDate = new Date(fromDate);
                    targetDate.setDate(targetDate.getDate() - fromDate.getDay() + day + (i * 7));
                    if (targetDate >= fromDate) {
                        generatedEvents.push({ ...eventData, id: Date.now() + Math.random(), date: targetDate.toISOString().split('T')[0] });
                    }
                });
            }
        } else {
            const limit = frequency === 'daily' ? 90 : (frequency === 'monthly' ? 12 : 5); // Days, Months, or Years
            for (let i = 0; i < limit; i++) {
                const currentDate = new Date(fromDate);
                if (frequency === 'daily') {
                    currentDate.setDate(currentDate.getDate() + i);
                } else if (frequency === 'monthly') {
                    currentDate.setMonth(currentDate.getMonth() + i);
                    if (currentDate.getDate() !== fromDate.getDate()) continue;
                } else if (frequency === 'annual') {
                    currentDate.setFullYear(currentDate.getFullYear() + i);
                    if (currentDate.getDate() !== fromDate.getDate()) continue;
                }
                generatedEvents.push({ ...eventData, id: Date.now() + Math.random(), date: currentDate.toISOString().split('T')[0] });
            }
        }
        return generatedEvents;
    };

    const handleDelete = () => {
        if (event?.recurrenceId) setShowRecurringDelete(true);
        else setShowConfirmDelete(true);
    };

    const confirmDeleteSingle = () => { if (event) { onSave(events.filter(e => e.id !== event.id)); setShowConfirmDelete(false); setShowRecurringDelete(false); onClose(); } };
    const confirmDeleteAll = () => { if (event?.recurrenceId) { onSave(events.filter(e => e.recurrenceId !== event.recurrenceId)); setShowRecurringDelete(false); onClose(); } };
    const toggleSelectedDay = (dayIndex) => setSelectedDays(prev => prev.includes(dayIndex) ? prev.filter(d => d !== dayIndex) : [...prev, dayIndex]);
    const getEventDateTime = (eventDate, eventTime) => { const [year, month, day] = eventDate.split('-').map(Number); const [hours, minutes] = eventTime.split(':').map(Number); return new Date(year, month - 1, day, hours, minutes); };
    const handleDownloadICS = (evt) => { const start = getEventDateTime(evt.date, evt.startTime); const end = getEventDateTime(evt.date, evt.endTime); const toICS = (d) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'; const content = `BEGIN:VCALENDAR\\r\\nVERSION:2.0\\r\\nBEGIN:VEVENT\\r\\nDTSTART:${toICS(start)}\\r\\nDTEND:${toICS(end)}\\r\\nSUMMARY:${evt.title}\\r\\nDESCRIPTION:${evt.description || ''}\\r\\nEND:VEVENT\\r\\nEND:VCALENDAR`; const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' }); const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = `${evt.title}.ics`; document.body.appendChild(link); link.click(); document.body.removeChild(link); };
    const getGoogleCalendarLink = (evt) => { const start = getEventDateTime(evt.date, evt.startTime); const end = getEventDateTime(evt.date, evt.endTime); const toGoogle = (d) => d.toISOString().replace(/-|:|\.\d\d\d/g, ''); const url = new URL('https://calendar.google.com/calendar/render'); url.searchParams.append('action', 'TEMPLATE'); url.searchParams.append('text', evt.title); url.searchParams.append('dates', `${toGoogle(start)}/${toGoogle(end)}`); url.searchParams.append('details', evt.description || ''); return url.toString(); };
    const getOutlookCalendarLink = (evt) => { const start = getEventDateTime(evt.date, evt.startTime); const end = getEventDateTime(evt.date, evt.endTime); const url = new URL('https://outlook.live.com/calendar/0/deeplink/compose'); url.searchParams.append('path', '/calendar/action/compose'); url.searchParams.append('rru', 'addevent'); url.searchParams.append('startdt', start.toISOString()); url.searchParams.append('enddt', end.toISOString()); url.searchParams.append('subject', evt.title); url.searchParams.append('body', evt.description || ''); return url.toString(); };

    const renderDetailView = () => (
        <div className="p-1">
            <div className="flex justify-between items-start mb-4"><h2 className="text-2xl font-bold text-black" style={{ borderLeftColor: event.color, borderLeftWidth: '4px', paddingLeft: '10px' }}>{event.title}</h2><button onClick={onClose} className="text-black hover:text-black text-2xl ml-4">×</button></div>
            <p className="text-sm text-black mt-1 pl-3 mb-4">{new Date(event.date + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })} de {event.startTime} às {event.endTime}</p>
            {event.description && <p className="text-black whitespace-pre-wrap bg-white/50 p-3 rounded-lg mb-4">{event.description}</p>}
            <div className="border-t pt-4"><p className="text-sm font-medium text-gray-600 mb-2">Ações</p><div className="flex flex-wrap gap-2 mt-2"><a href={getGoogleCalendarLink(event)} target="_blank" rel="noopener noreferrer" className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 rounded transition-all">Adicionar ao Google</a><a href={getOutlookCalendarLink(event)} target="_blank" rel="noopener noreferrer" className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 rounded transition-all">Adicionar ao Outlook</a><button onClick={() => handleDownloadICS(event)} className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 rounded transition-all">Baixar .ics</button></div></div>
            <div className="mt-6 flex gap-2"><button onClick={handleDelete} className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all">Excluir</button><button onClick={() => setIsEditing(true)} className="flex-1 py-2 btn-primary text-white rounded-lg">Editar</button></div>
        </div>
    );

    const renderFormView = () => (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-between items-center"><h2 className="text-2xl font-bold text-black">{event ? 'Editar Evento' : 'Novo Evento'}</h2><button onClick={onClose} className="text-black hover:text-black text-2xl">×</button></div>
            <div><label className="block text-black font-medium mb-1">Título</label><input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={`w-full px-4 py-2 rounded-lg bg-white/90 focus:outline-none focus:ring-2 ${errors.title ? 'ring-red-500' : 'focus:ring-primary-400'}`} placeholder="Título do evento" />{errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}</div>
            <div className="grid grid-cols-2 gap-4"><div><label className="block text-black font-medium mb-1">Início</label><input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-white/90 focus:outline-none focus:ring-2 focus:ring-primary-400" /></div><div><label className="block text-black font-medium mb-1">Fim</label><input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-white/90 focus:outline-none focus:ring-2 focus:ring-primary-400" /></div></div>{errors.time && <p className="text-red-500 text-xs -mt-2 text-center">{errors.time}</p>}
            
            {!event && (
                <div>
                    <label className="block text-black font-medium mb-2">Repetir</label>
                    <select value={recurrence} onChange={(e) => setRecurrence(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-white/90 focus:outline-none focus:ring-2 focus:ring-primary-400">
                        <option value="none">Não se repete</option>
                        <option value="daily">Diariamente</option>
                        <option value="weekly">Semanalmente</option>
                        <option value="monthly">Mensalmente</option>
                        <option value="annual">Anualmente</option>
                    </select>
                </div>
            )}

            {recurrence === 'weekly' && !event && (
                <div className="animate-fade-in">
                    <label className="block text-black font-medium mb-2">Nos dias</label>
                    <div className="flex justify-between gap-1">{orderedDayInfo.map(({ label, originalIndex }) => (<button key={originalIndex} type="button" onClick={() => toggleSelectedDay(originalIndex)} className={`w-10 h-10 rounded-full transition-colors font-semibold ${selectedDays.includes(originalIndex) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black hover:bg-gray-300'}`}>{label}</button>))}</div>
                </div>
            )}

            <div><label className="block text-black font-medium mb-2">Descrição</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-white/90 focus:outline-none focus:ring-2 focus:ring-primary-400" rows="3" placeholder="Descrição do evento (opcional)" /></div>
            <div><label className="block text-black font-medium mb-2">Cor</label><div className="flex gap-2 flex-wrap">{colors.map(c => <button key={c} type="button" onClick={() => setColor(c)} className={`w-10 h-10 rounded-lg transition-transform ${color === c ? 'ring-2 ring-black scale-110' : ''}`} style={{ backgroundColor: c }} />)}</div></div>
            <div className="flex gap-2 pt-4"><button type="button" onClick={onClose} className="flex-1 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded-lg transition-all">Cancelar</button><button type="submit" className="flex-1 py-2 btn-primary text-white rounded-lg">{event ? 'Atualizar' : 'Criar'}</button></div>
        </form>
    );

    return (
        <>
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100] animate-fade-in" onClick={onClose}><div className="glass-effect rounded-2xl p-6 w-full max-w-md shadow-2xl animate-scale-in" onClick={(e) => e.stopPropagation()}>{isEditing ? renderFormView() : renderDetailView()}</div></div>
            {showConfirmDelete && <ConfirmModal title="Confirmar Exclusão" message={`Tem certeza que deseja excluir o evento "${event.title}"?`} onConfirm={confirmDeleteSingle} onCancel={() => setShowConfirmDelete(false)} />}
            {showRecurringDelete && <RecurringDeleteModal onConfirmSingle={confirmDeleteSingle} onConfirmAll={confirmDeleteAll} onCancel={() => setShowRecurringDelete(false)} />}
        </>
    );
};

window.EventModal = EventModal;
