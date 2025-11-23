const DayView = ({ date, events, onEventClick, selectedEvents, onToggleSelect, isSelectionMode }) => {
    const hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);

    const getEventPosition = (event) => {
        if (!event.startTime || !event.endTime) return { top: 0, height: 0, isValid: false };
        const [startH, startM] = event.startTime.split(':').map(Number);
        const [endH, endM] = event.endTime.split(':').map(Number);
        const top = (startH + startM / 60) * 60;
        const height = ((endH + endM / 60) - (startH + startM / 60)) * 60;
        return { top, height: Math.max(height, 20), isValid: true };
    };

    return (
        <div className="bg-white/80 rounded-lg shadow-lg p-4">
            <div className="grid grid-cols-[auto_1fr] h-full">
                <div className="w-16">{hours.map(hour => (<div key={hour} className="h-15 relative"><span className="absolute right-2 -top-2.5 text-xs text-gray-500">{hour}</span></div>))}</div>
                <div className="relative border-l border-gray-200">
                    <div className="relative top-0 left-0 right-0 bottom-0">
                        {hours.map(hour => (<div key={hour} className="h-15 border-t border-gray-200"></div>))}
                        <div className="absolute top-0 left-0 right-0 bottom-0 p-1">
                            {events.map(event => {
                                const { top, height, isValid } = getEventPosition(event);
                                if (!isValid) return null;
                                const isSelected = selectedEvents.has(event.id);
                                return (
                                    <div
                                        key={event.id}
                                        onClick={(e) => { e.stopPropagation(); onEventClick(event, e); }}
                                        className={`absolute w-[calc(100%-0.5rem)] p-2 rounded-lg text-white cursor-pointer z-10 group ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
                                        style={{ backgroundColor: event.color, top: `${top}px`, height: `${height}px`, overflow: 'hidden' }}
                                    >
                                        <div
                                            className={`absolute top-0 right-0 w-5 h-5 flex items-center justify-center bg-black/20 rounded-bl-md opacity-0 group-hover:opacity-100 transition-opacity ${isSelectionMode && 'opacity-100'}`}
                                            onClick={(e) => { e.stopPropagation(); onToggleSelect(event.id); }}
                                        >
                                            <div className={`w-3 h-3 border-2 border-white rounded-sm ${isSelected ? 'bg-white' : ''}`}></div>
                                        </div>
                                        <p className="font-bold text-sm">{event.title}</p>
                                        <p className="text-xs">{event.startTime} - {event.endTime}</p>
                                        {event.description && <p className="text-xs mt-1 truncate">{event.description}</p>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

window.DayView = DayView;
