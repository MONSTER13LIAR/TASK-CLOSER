import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';
import { FaCalendarAlt, FaTimes, FaPlus, FaTrash } from 'react-icons/fa';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';

// Draggable Event Dot
const DraggableEvent = ({ event, id }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: `event-${id}`,
        data: { event }
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 100,
        position: 'relative' // Ensure it's visible during drag
    } : undefined;

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            style={{ ...style, cursor: 'grab' }}
            title={event.title}
        >
            <div style={{
                width: '8px', // Slightly larger for easier grabbing
                height: '8px',
                borderRadius: '50%',
                background: event.type === 'urgent' ? 'var(--danger)' : event.type === 'meeting' ? 'var(--secondary)' : 'var(--text-muted)',
                border: '1px solid rgba(255,255,255,0.2)'
            }} />
        </div>
    );
};

// Droppable Trash Bin
const DroppableTrash = () => {
    const { setNodeRef, isOver } = useDroppable({
        id: 'trash-bin'
    });

    return (
        <div
            ref={setNodeRef}
            style={{
                color: 'var(--danger)',
                transform: isOver ? 'scale(1.2)' : 'scale(1)',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.5rem',
                cursor: 'pointer'
            }}
            title="Drag here to delete"
        >
            <FaTrash size={18} />
        </div>
    );
};

// Droppable Day Cell
const DroppableDay = ({ day, isToday, isCurrentMonth, children, onClick }) => {
    const { setNodeRef, isOver } = useDroppable({
        id: day.toISOString(),
        data: { date: day }
    });

    return (
        <div
            ref={setNodeRef}
            onClick={onClick}
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                padding: '0.5rem',
                borderRadius: '8px',
                background: isOver
                    ? 'rgba(108, 92, 231, 0.3)'
                    : isToday
                        ? 'rgba(108, 92, 231, 0.2)'
                        : 'transparent',
                border: isToday ? '1px solid var(--primary)' : '1px solid transparent',
                opacity: isCurrentMonth ? 1 : 0.3,
                cursor: 'pointer',
                transition: 'all 0.2s',
                position: 'relative',
                minHeight: '60px' // Ensure drop area has size
            }}
            onMouseEnter={(e) => { if (!isToday && !isOver) e.currentTarget.style.background = 'var(--bg-surface-hover)'; }}
            onMouseLeave={(e) => { if (!isToday && !isOver) e.currentTarget.style.background = 'transparent'; }}
        >
            {children}
        </div>
    );
};

const CalendarView = () => {
    const [currentDate] = useState(new Date());
    const [events, setEvents] = useState(() => {
        const savedEvents = localStorage.getItem('taskcloser_events');
        if (savedEvents) {
            // Parse and convert date strings back to Date objects
            return JSON.parse(savedEvents).map(event => ({
                ...event,
                date: new Date(event.date)
            }));
        }
        return [
            { id: '1', date: new Date(), title: 'Team Sync', type: 'meeting' },
            { id: '2', date: new Date(), title: 'Lunch with Client', type: 'social' },
            { id: '3', date: new Date(new Date().setDate(new Date().getDate() + 2)), title: 'Project Review', type: 'work' },
            { id: '4', date: new Date(new Date().setDate(new Date().getDate() + 5)), title: 'Project Deadline', type: 'urgent' },
            { id: '5', date: new Date(new Date().setDate(new Date().getDate() + 10)), title: 'Design Sprint', type: 'work' },
            { id: '6', date: new Date(new Date().setDate(new Date().getDate() - 2)), title: 'Retrospective', type: 'meeting' }
        ];
    });

    React.useEffect(() => {
        localStorage.setItem('taskcloser_events', JSON.stringify(events));
    }, [events]);

    const [selectedDate, setSelectedDate] = useState(null);
    const [newEventTitle, setNewEventTitle] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    };

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const getEventsForDay = (day) => events.filter(e => isSameDay(new Date(e.date), day));

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over) return;

        const eventId = active.id.replace('event-', '');

        if (over.id === 'trash-bin') {
            setEvents(prevEvents => prevEvents.filter(ev => ev.id !== eventId));
        } else if (active.id !== over.id) {
            // over.id is the ISO date string of the day
            const newDate = new Date(over.id);

            setEvents(prevEvents => prevEvents.map(ev =>
                ev.id === eventId ? { ...ev, date: newDate } : ev
            ));
        }
    };

    const handleDateClick = (day) => {
        setSelectedDate(day);
        setNewEventTitle('');
        setShowModal(true);
    };

    const handleAddEvent = (e) => {
        e.preventDefault();
        if (newEventTitle.trim() && selectedDate) {
            const newEvent = {
                id: Date.now().toString(),
                date: selectedDate,
                title: newEventTitle,
                type: 'work' // Default type for quick add
            };
            setEvents([...events, newEvent]);
            setShowModal(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.02 }}
            className="glass-panel"
            style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', position: 'relative' }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Spotlight overlay */}
            {isHovered && (
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        pointerEvents: 'none',
                        background: `radial-gradient(circle 200px at ${mousePos.x}px ${mousePos.y}px, rgba(108, 92, 231, 0.2) 0%, transparent 70%)`,
                        zIndex: 0
                    }}
                />
            )}
            <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                <h2 style={{ fontSize: '1.2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <FaCalendarAlt style={{ color: 'var(--secondary)' }} /> {format(currentDate, 'MMMM yyyy')}
                </h2>
            </div>

            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '600' }}>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day}>{day}</div>)}
                </div>

                <DndContext onDragEnd={handleDragEnd}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridTemplateRows: 'repeat(6, 1fr)', flex: 1, gap: '0.5rem' }}>
                        {days.map((day, idx) => {
                            const dayEvents = getEventsForDay(day);
                            const isToday = isSameDay(day, new Date());
                            const isCurrentMonth = isSameMonth(day, monthStart);

                            return (
                                <DroppableDay
                                    key={day.toISOString()}
                                    day={day}
                                    isToday={isToday}
                                    isCurrentMonth={isCurrentMonth}
                                    onClick={() => handleDateClick(day)}
                                >
                                    <span style={{
                                        fontSize: '0.9rem',
                                        fontWeight: isToday ? 'bold' : 'normal',
                                        color: isToday ? 'var(--primary)' : 'inherit',
                                        marginBottom: '0.25rem'
                                    }}>{format(day, 'd')}</span>

                                    <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
                                        {dayEvents.map((evt) => (
                                            <DraggableEvent key={evt.id} id={evt.id} event={evt} />
                                        ))}
                                    </div>
                                </DroppableDay>
                            );
                        })}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: '0.5rem' }}>
                        <DroppableTrash />
                    </div>

                    <div style={{ marginTop: '0', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem', flexShrink: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ fontSize: '1rem', margin: 0, color: 'var(--text-muted)' }}>Upcoming Events</h3>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            {events
                                .filter(e => new Date(e.date) >= new Date().setHours(0, 0, 0, 0))
                                .sort((a, b) => new Date(a.date) - new Date(b.date))
                                .slice(0, 3)
                                .map((evt) => (
                                    <div key={evt.id} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.5rem', background: 'var(--bg-app)', borderRadius: '8px' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: evt.type === 'urgent' ? 'var(--danger)' : 'var(--secondary)' }}></div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: '0.9rem', fontWeight: '500' }}>{evt.title}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{format(new Date(evt.date), 'MMM d')} • {evt.type}</div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </DndContext>
            </div>

            {/* Add Event Modal */}
            <AnimatePresence>
                {showModal && (
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 200,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(0,0,0,0.6)',
                        backdropFilter: 'blur(2px)'
                    }} onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            style={{
                                background: 'var(--bg-surface)',
                                border: '1px solid var(--primary)',
                                borderRadius: '16px',
                                padding: '1.5rem',
                                width: '85%',
                                boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Add Event to {format(selectedDate, 'MMM d')}</h3>
                                <button onClick={() => setShowModal(false)} style={{ background: 'transparent', color: 'var(--text-muted)' }}><FaTimes /></button>
                            </div>
                            <form onSubmit={handleAddEvent}>
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Event Title..."
                                    value={newEventTitle}
                                    onChange={(e) => setNewEventTitle(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.8rem',
                                        marginBottom: '1rem',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        background: 'rgba(0,0,0,0.2)',
                                        color: 'white',
                                        outline: 'none'
                                    }}
                                />
                                <button
                                    type="submit"
                                    style={{
                                        width: '100%',
                                        padding: '0.8rem',
                                        background: 'var(--primary)',
                                        color: 'white',
                                        borderRadius: '8px',
                                        fontWeight: '600'
                                    }}
                                >
                                    Add Event
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default CalendarView;
