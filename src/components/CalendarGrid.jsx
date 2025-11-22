const CalendarGrid = ({ days, onDateClick, getEventsForDate, isToday }) => {
    return (
        <div className="glass-effect rounded-2xl p-6 shadow-xl">
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-2 mb-4">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                    <div key={day} className="text-center font-semibold text-gray-700 py-2">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-2">
                {days.map((dayInfo, index) => {
                    const dayEvents = getEventsForDate(dayInfo.date);
                    const isTodayDate = isToday(dayInfo.date);

                    return (
                        <div
                            key={index}
                            onClick={() => dayInfo.isCurrentMonth && onDateClick(dayInfo.date)}
                            className={`
                                calendar-day min-h-[80px] p-2 rounded-lg cursor-pointer
                                ${dayInfo.isCurrentMonth ? 'bg-gray-200' : 'bg-gray-100'}
                                ${isTodayDate ? 'current-day' : ''}
                            `}
                        >
                            <div className={`
                                text-sm font-semibold mb-1
                                ${dayInfo.isCurrentMonth ? 'text-gray-800' : 'text-gray-500'}
                                ${isTodayDate ? 'text-accent-600' : ''}
                            `}>
                                {dayInfo.day}
                            </div>
                            <div className="space-y-1">
                                {dayEvents.slice(0, 2).map(event => (
                                    <div
                                        key={event.id}
                                        className="text-xs px-2 py-1 rounded truncate text-white"
                                        style={{ backgroundColor: event.color }}
                                    >
                                        {event.title}
                                    </div>
                                ))}
                                {dayEvents.length > 2 && (
                                    <div className="text-xs text-gray-600 px-2">
                                        +{dayEvents.length - 2} mais
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// Export to window
window.CalendarGrid = CalendarGrid;
