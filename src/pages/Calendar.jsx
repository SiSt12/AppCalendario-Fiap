const { useState, useEffect } = React;
const { useAuth } = window;
const { CalendarHeader } = window;
const { CalendarGrid } = window;
const { DayViewModal } = window;

const Calendar = () => {
    const { user, logout } = useAuth();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [showDayView, setShowDayView] = useState(false);

    useEffect(() => {
        const storedEvents = localStorage.getItem(`events_${user.id}`);
        if (storedEvents) {
            setEvents(JSON.parse(storedEvents));
        }
    }, [user.id]);

    const saveEvents = (newEvents) => {
        setEvents(newEvents);
        localStorage.setItem(`events_${user.id}`, JSON.stringify(newEvents));
    };

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];

        // Previous month days
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = startingDayOfWeek - 1; i >= 0; i--) {
            days.push({
                day: prevMonthLastDay - i,
                isCurrentMonth: false,
                date: new Date(year, month - 1, prevMonthLastDay - i)
            });
        }

        // Current month days
        for (let i = 1; i <= daysInMonth; i++) {
            days.push({
                day: i,
                isCurrentMonth: true,
                date: new Date(year, month, i)
            });
        }

        // Next month days
        const remainingDays = 42 - days.length;
        for (let i = 1; i <= remainingDays; i++) {
            days.push({
                day: i,
                isCurrentMonth: false,
                date: new Date(year, month + 1, i)
            });
        }

        return days;
    };

    const getEventsForDate = (date) => {
        const dateStr = date.toISOString().split('T')[0];
        return events.filter(event => event.date === dateStr);
    };

    const isToday = (date) => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const handleToday = () => {
        setCurrentDate(new Date());
    };

    const handleDateClick = (date) => {
        setSelectedDate(date);
        setShowDayView(true);
    };

    const days = getDaysInMonth(currentDate);
    const monthYear = currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    return (
        <div className="min-h-screen p-4 md:p-8 animate-fade-in">
            <div className="max-w-7xl mx-auto">
                <CalendarHeader
                    monthYear={monthYear}
                    onPrevMonth={handlePrevMonth}
                    onNextMonth={handleNextMonth}
                    onToday={handleToday}
                    userName={user.name}
                    onLogout={logout}
                />

                <CalendarGrid
                    days={days}
                    onDateClick={handleDateClick}
                    getEventsForDate={getEventsForDate}
                    isToday={isToday}
                />
            </div>

            {showDayView && selectedDate && (
                <DayViewModal
                    date={selectedDate}
                    events={events}
                    onSave={saveEvents}
                    onClose={() => setShowDayView(false)}
                />
            )}
        </div>
    );
};

// Export to window
window.Calendar = Calendar;
