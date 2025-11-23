const { useState, useEffect, useMemo } = React;
const { useAuth } = window;
const { CalendarHeader, CalendarGrid, WeekView, DayView, EventModal, OnboardingModal, RoutineModal, MultiSelectToolbar, ConfirmModal, InfoModal } = window;

const Calendar = () => {
    const { user, logout, showOnboarding, completeOnboarding, weekStartDay, updateWeekStartDay } = useAuth();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [modalState, setModalState] = useState({ isOpen: false, event: null, date: null });
    const [view, setView] = useState('month');
    const [isRoutineModalOpen, setIsRoutineModalOpen] = useState(false);
    const [isParsingRoutine, setIsParsingRoutine] = useState(false);
    const [aiSuggestion, setAiSuggestion] = useState(null);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [selectedEvents, setSelectedEvents] = useState(new Set());
    const [showMultiDeleteConfirm, setShowMultiDeleteConfirm] = useState(false);
    const [infoModal, setInfoModal] = useState({ isOpen: false, title: '', message: '' });
    const [searchQuery, setSearchQuery] = useState('');

    const isSelectionMode = selectedEvents.size > 0;

    useEffect(() => {
        const storedEvents = localStorage.getItem(`events_${user.id}`);
        if (storedEvents) {
            setEvents(JSON.parse(storedEvents).map(e => ({ ...e, date: e.date.split('T')[0] })));
        }
    }, [user.id]);

    useEffect(() => {
        const checkNotifications = () => {
            const now = new Date();
            const fifteenMinutesFromNow = new Date(now.getTime() + 15 * 60 * 1000);
            events.forEach(event => {
                if (!event.startTime) return;
                const eventStartTime = new Date(`${event.date}T${event.startTime}`);
                if (eventStartTime > now && eventStartTime <= fifteenMinutesFromNow) {
                    const notificationId = `notif_${event.id}`;
                    if (!localStorage.getItem(notificationId)) {
                        notifyUser(event);
                        localStorage.setItem(notificationId, 'true');
                    }
                }
            });
        };
        const intervalId = setInterval(checkNotifications, 60000);
        return () => clearInterval(intervalId);
    }, [events]);

    const notifyUser = (event) => {
        if (!('Notification' in window)) return;
        const showNotification = () => {
            new Notification('Lembrete de Evento', {
                body: `Seu evento "${event.title}" começa em 15 minutos.`,
                icon: 'favicon.ico'
            });
        };
        if (Notification.permission === 'granted') {
            showNotification();
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') showNotification();
            });
        }
    };

    const saveEvents = (newEvents) => {
        setEvents(newEvents);
        localStorage.setItem(`events_${user.id}`, JSON.stringify(newEvents));
    };

    const showInfo = (title, message) => setInfoModal({ isOpen: true, title, message });

    const filteredEvents = useMemo(() => {
        if (!searchQuery) return events;
        return events.filter(event =>
            event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [events, searchQuery]);

    const handleParseRoutine = async (routineText) => {
        setIsParsingRoutine(true);
        try {
            const response = await fetch('http://localhost:3001/api/parse-routine', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ routineText }) });
            if (!response.ok) throw new Error('A resposta do servidor para análise de rotina não foi OK');
            const data = await response.json();
            if (data.events) {
                const newEvents = generateRecurringEvents(data.events, new Date());
                saveEvents([...events, ...newEvents]);
                showInfo('Sucesso!', `${newEvents.length} novos eventos recorrentes foram adicionados.`);
            }
        } catch (error) {
            showInfo('Erro na Análise', `Não foi possível analisar sua rotina. \n\nErro: ${error.message}`);
        } finally {
            setIsParsingRoutine(false);
            setIsRoutineModalOpen(false);
        }
    };

    const generateRecurringEvents = (routineEvents, startDate) => {
        const generatedEvents = [];
        const fromDate = new Date(startDate);
        fromDate.setHours(0, 0, 0, 0);
        const recurrenceId = `recur_${Date.now()}`;
        for (let monthOffset = 0; monthOffset < 3; monthOffset++) {
            const firstDayOfTargetMonth = new Date(fromDate.getFullYear(), fromDate.getMonth() + monthOffset, 1);
            const year = firstDayOfTargetMonth.getFullYear();
            const month = firstDayOfTargetMonth.getMonth();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const startDay = (year === fromDate.getFullYear() && month === fromDate.getMonth()) ? fromDate.getDate() : 1;
            for (let day = startDay; day <= daysInMonth; day++) {
                const currentDate = new Date(year, month, day);
                const dayOfWeek = currentDate.getDay();
                routineEvents.forEach(routineEvent => {
                    if (routineEvent.daysOfWeek.includes(dayOfWeek)) {
                        generatedEvents.push({ ...routineEvent, id: Date.now() + Math.random(), date: currentDate.toISOString().split('T')[0], recurrenceId });
                    }
                });
            }
        }
        return generatedEvents;
    };

    const handleGetAISuggestion = async () => {
        setIsAiLoading(true);
        setAiSuggestion(null);
        try {
            const response = await fetch('http://localhost:3001/api/suggest', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ events }) });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'A resposta do servidor não foi OK');
            }
            const data = await response.json();
            if (data.suggestion) setAiSuggestion(data.suggestion);
        } catch (error) {
            showInfo('Erro na IA', `Não foi possível obter uma sugestão da IA. \n\nErro: ${error.message}`);
        } finally {
            setIsAiLoading(false);
        }
    };

    const handleAcceptAISuggestion = () => {
        if (!aiSuggestion || aiSuggestion.suggestionType !== 'CREATE_EVENT') return;
        const newEvent = { ...aiSuggestion.eventDetails, id: Date.now() };
        saveEvents([...events, newEvent]);
        setAiSuggestion(null);
    };

    const toggleEventSelection = (eventId) => {
        setSelectedEvents(prev => {
            const newSelected = new Set(prev);
            if (newSelected.has(eventId)) newSelected.delete(eventId);
            else newSelected.add(eventId);
            return newSelected;
        });
    };

    const handleDeleteSelected = () => {
        if (selectedEvents.size > 0) setShowMultiDeleteConfirm(true);
    };

    const confirmMultiDelete = () => {
        const ids = Array.from(selectedEvents);
        saveEvents(events.filter(e => !ids.includes(e.id)));
        setSelectedEvents(new Set());
        setShowMultiDeleteConfirm(false);
    };

    const cancelSelection = () => setSelectedEvents(new Set());

    const handleEventClick = (event, e) => {
        if (isSelectionMode) toggleEventSelection(event.id);
        else openModalForExistingEvent(event, e);
    };

    const getEventsForDate = (date) => filteredEvents.filter(event => event.date === date.toISOString().split('T')[0]).sort((a, b) => a.startTime.localeCompare(b.startTime));
    const isToday = (date) => new Date().toDateString() === date.toDateString();
    const handlePrev = () => { const d = new Date(currentDate); if (view === 'month') d.setMonth(d.getMonth() - 1); else if (view === 'week') d.setDate(d.getDate() - 7); else d.setDate(d.getDate() - 1); setCurrentDate(d); };
    const handleNext = () => { const d = new Date(currentDate); if (view === 'month') d.setMonth(d.getMonth() + 1); else if (view === 'week') d.setDate(d.getDate() + 7); else d.setDate(d.getDate() + 1); setCurrentDate(d); };
    const handleToday = () => setCurrentDate(new Date());
    const openModalForNewEvent = (date) => { if (!isSelectionMode) setModalState({ isOpen: true, date, event: null }); };
    const openModalForExistingEvent = (event, e) => { if (e) e.stopPropagation(); setModalState({ isOpen: true, date: new Date(event.date + 'T00:00:00'), event }); };
    const closeModal = () => setModalState({ isOpen: false, event: null, date: null });

    const monthYear = useMemo(() => {
        if (view === 'day') return currentDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
        if (view === 'week') {
            const s = new Date(currentDate);
            s.setDate(s.getDate() - (s.getDay() - weekStartDay + 7) % 7);
            const e = new Date(s);
            e.setDate(e.getDate() + 6);
            return `${s.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })} - ${e.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' })}`;
        }
        return currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' }).replace(/^\w/, c => c.toUpperCase());
    }, [currentDate, view, weekStartDay]);

    const daysForGrid = useMemo(() => {
        const d = [];
        const y = currentDate.getFullYear();
        const m = currentDate.getMonth();
        const f = new Date(y, m, 1);
        const s = (f.getDay() - weekStartDay + 7) % 7;
        const p = new Date(y, m, 0).getDate();
        for (let i = s - 1; i >= 0; i--) d.push({ day: p - i, isCurrentMonth: false, date: new Date(y, m - 1, p - i) });
        const c = new Date(y, m + 1, 0).getDate();
        for (let i = 1; i <= c; i++) d.push({ day: i, isCurrentMonth: true, date: new Date(y, m, i) });
        const r = 42 - d.length;
        for (let i = 1; i <= r; i++) d.push({ day: i, isCurrentMonth: false, date: new Date(y, m + 1, i) });
        return d;
    }, [currentDate, weekStartDay]);

    const weekForView = useMemo(() => {
        const s = new Date(currentDate);
        s.setDate(s.getDate() - (s.getDay() - weekStartDay + 7) % 7);
        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date(s);
            d.setDate(d.getDate() + i);
            return d;
        });
    }, [currentDate, weekStartDay]);

    const dayEvents = useMemo(() => getEventsForDate(currentDate), [currentDate, filteredEvents]);

    return (
        <div className="min-h-screen p-4 md:p-8 animate-fade-in">
            {showOnboarding && <OnboardingModal onClose={completeOnboarding} />}
            {isRoutineModalOpen && <RoutineModal onClose={() => setIsRoutineModalOpen(false)} onParse={handleParseRoutine} isLoading={isParsingRoutine} />}
            {infoModal.isOpen && <InfoModal title={infoModal.title} message={infoModal.message} onClose={() => setInfoModal({ isOpen: false, title: '', message: '' })} />}
            
            <div className="max-w-7xl mx-auto">
                <CalendarHeader monthYear={monthYear} onPrev={handlePrev} onNext={handleNext} onToday={handleToday} userName={user.name} onLogout={logout} view={view} setView={setView} onOpenRoutineModal={() => setIsRoutineModalOpen(true)} weekStartDay={weekStartDay} setWeekStartDay={updateWeekStartDay} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                
                {view === 'month' && <CalendarGrid days={daysForGrid} onDateClick={openModalForNewEvent} getEventsForDate={getEventsForDate} isToday={isToday} onEventClick={handleEventClick} weekStartDay={weekStartDay} selectedEvents={selectedEvents} onToggleSelect={toggleEventSelection} isSelectionMode={isSelectionMode} />}
                {view === 'week' && <WeekView week={weekForView} events={filteredEvents} onEventClick={handleEventClick} weekStartDay={weekStartDay} selectedEvents={selectedEvents} onToggleSelect={toggleEventSelection} isSelectionMode={isSelectionMode} />}
                {view === 'day' && <DayView date={currentDate} events={dayEvents} onEventClick={handleEventClick} selectedEvents={selectedEvents} onToggleSelect={toggleEventSelection} isSelectionMode={isSelectionMode} />}
            </div>

            <MultiSelectToolbar selectedCount={selectedEvents.size} onDelete={handleDeleteSelected} onCancel={cancelSelection} />
            {showMultiDeleteConfirm && <ConfirmModal title="Confirmar Exclusão Múltipla" message={`Tem certeza que deseja excluir os ${selectedEvents.size} eventos selecionados?`} onConfirm={confirmMultiDelete} onCancel={() => setShowMultiDeleteConfirm(false)} />}
            {modalState.isOpen && !isSelectionMode && <EventModal date={modalState.date} event={modalState.event} events={events} onSave={saveEvents} onClose={closeModal} weekStartDay={weekStartDay} showInfo={showInfo} />}
        </div>
    );
};

window.Calendar = Calendar;
