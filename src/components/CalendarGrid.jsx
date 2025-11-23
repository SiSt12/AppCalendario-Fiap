const CalendarGrid = ({ days, onDateClick, getEventsForDate, isToday, onEventClick, weekStartDay, selectedEvents, onToggleSelect, isSelectionMode }) => {
    const dayLabels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const orderedDayLabels = [...dayLabels.slice(weekStartDay), ...dayLabels.slice(0, weekStartDay)];

    return (
        <div className="grid grid-cols-7 gap-1 text-center text-sm">
            {orderedDayLabels.map(day => (
                <div key={day} className="font-bold text-black p-2">{day}</div>
            ))}

            {days.map(({ day, isCurrentMonth, date }) => {
                const eventsOnDay = getEventsForDate(date);
                const dayClasses = [
                    'calendar-day', 'relative', 'h-24 md:h-32', 'p-2', 'border', 'rounded-lg', 'overflow-hidden',
                    isCurrentMonth ? 'bg-white/80 border-gray-200' : 'bg-gray-200/50 border-gray-100 text-gray-400',
                    isToday(date) ? 'current-day' : '',
                    isSelectionMode ? 'cursor-default' : 'cursor-pointer',
                ].join(' ');

                return (
                    <div key={date.toISOString()} className={dayClasses} onClick={() => onDateClick(date)}>
                        <span className="font-medium">{day}</span>
                        <div className="mt-1 space-y-1">
                            {eventsOnDay.slice(0, 2).map(event => {
                                const isSelected = selectedEvents.has(event.id);
                                return (
                                    <div
                                        key={event.id}
                                        onClick={(e) => { e.stopPropagation(); onEventClick(event, e); }}
                                        className={`relative text-xs text-white p-1 rounded-md truncate cursor-pointer group ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
                                        style={{ backgroundColor: event.color }}
                                    >
                                        <div
                                            className={`absolute top-0 right-0 w-5 h-5 flex items-center justify-center bg-black/20 rounded-bl-md opacity-0 group-hover:opacity-100 transition-opacity ${isSelectionMode && 'opacity-100'}`}
                                            onClick={(e) => { e.stopPropagation(); onToggleSelect(event.id); }}
                                        >
                                            <div className={`w-3 h-3 border-2 border-white rounded-sm ${isSelected ? 'bg-white' : ''}`}></div>
                                        </div>
                                        {event.startTime && <span className="font-semibold">{event.startTime}</span>} {event.title}
                                    </div>
                                );
                            })}
                            {eventsOnDay.length > 2 && (
                                <div className="text-xs text-gray-500">+ {eventsOnDay.length - 2} mais</div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

window.CalendarGrid = CalendarGrid;
