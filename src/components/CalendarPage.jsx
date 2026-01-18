import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { FaCalendarAlt, FaTimes, FaChevronLeft, FaChevronRight, FaTrash } from 'react-icons/fa';
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
        position: 'relative'
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
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: event.type === 'urgent' ? 'var(--danger)' : event.type === 'meeting' ? 'var(--secondary)' : 'var(--text-muted)',
                border: '1px solid rgba(255,255,255,0.2)'
            }} />
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
                padding: '0.8rem',
                borderRadius: '12px',
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
                minHeight: '80px'
            }}
            onMouseEnter={(e) => { if (!isToday && !isOver) e.currentTarget.style.background = 'var(--bg-surface-hover)'; }}
            onMouseLeave={(e) => { if (!isToday && !isOver) e.currentTarget.style.background = 'transparent'; }}
        >
            {children}
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
            <FaTrash size={20} />
        </div>
    );
};

const CalendarPage = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState(() => {
        const savedEvents = localStorage.getItem('taskcloser_events');
        if (savedEvents) {
            return JSON.parse(savedEvents).map(event => ({
                ...event,
                date: new Date(event.date)
            }));
        }
        return [];
    });

    const [selectedDate, setSelectedDate] = useState(null);
    const [newEventTitle, setNewEventTitle] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    React.useEffect(() => {
        localStorage.setItem('taskcloser_events', JSON.stringify(events));
    }, [events]);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    };

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

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
                type: 'work'
            };
            setEvents([...events, newEvent]);
            setShowModal(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel"
            style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}
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
                        background: `radial-gradient(circle 250px at ${mousePos.x}px ${mousePos.y}px, rgba(108, 92, 231, 0.2) 0%, transparent 70%)`,
                        zIndex: 0
                    }}
                />
            )}

            <div style={{ padding: '2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                <h1 style={{ fontSize: '2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <FaCalendarAlt style={{ color: 'var(--secondary)' }} /> {format(currentDate, 'MMMM yyyy')}
                </h1>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={prevMonth} style={{ background: 'var(--bg-app)', color: 'var(--text-main)', padding: '0.8rem', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <FaChevronLeft size={20} />
                    </button>
                    <button onClick={nextMonth} style={{ background: 'var(--bg-app)', color: 'var(--text-main)', padding: '0.8rem', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <FaChevronRight size={20} />
                    </button>
                </div>
            </div>

            <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1, overflow: 'auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '1rem', fontWeight: '600' }}>
                    {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => <div key={day}>{day}</div>)}
                </div>

                <DndContext onDragEnd={handleDragEnd}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridAutoRows: '1fr', gap: '0.8rem', flex: 1 }}>
                        {days.map((day) => {
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
                                        fontSize: '1.1rem',
                                        fontWeight: isToday ? 'bold' : 'normal',
                                        color: isToday ? 'var(--primary)' : 'inherit',
                                        marginBottom: '0.5rem'
                                    }}>{format(day, 'd')}</span>

                                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
                                        {dayEvents.map((evt) => (
                                            <DraggableEvent key={evt.id} id={evt.id} event={evt} />
                                        ))}
                                    </div>
                                </DroppableDay>
                            );
                        })}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem' }}>
                        <DroppableTrash />
                    </div>
                </DndContext>

                {/* Upcoming Events Section */}
                <div style={{ marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', margin: '0 0 1.5rem 0', color: 'var(--text-main)' }}>Upcoming Events</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '300px', overflowY: 'auto' }}>
                        {events
                            .filter(e => new Date(e.date) >= new Date().setHours(0, 0, 0, 0))
                            .sort((a, b) => new Date(a.date) - new Date(b.date))
                            .map((evt) => (
                                <div key={evt.id} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    padding: '1rem',
                                    background: 'var(--bg-app)',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(255,255,255,0.05)'
                                }}>
                                    <div style={{
                                        width: '12px',
                                        height: '12px',
                                        borderRadius: '50%',
                                        background: evt.type === 'urgent' ? 'var(--danger)' : evt.type === 'meeting' ? 'var(--secondary)' : 'var(--text-muted)',
                                        flexShrink: 0
                                    }}></div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '1.1rem', fontWeight: '500', color: 'var(--text-main)' }}>{evt.title}</div>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                                            {format(new Date(evt.date), 'EEEE, MMMM do, yyyy')} • {evt.type}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        {events.filter(e => new Date(e.date) >= new Date().setHours(0, 0, 0, 0)).length === 0 && (
                            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                                No upcoming events
                            </div>
                        )}
                    </div>
                </div>
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
                                padding: '2rem',
                                width: '400px',
                                boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <h3 style={{ margin: 0, fontSize: '1.3rem' }}>Add Event to {selectedDate && format(selectedDate, 'MMM d')}</h3>
                                <button onClick={() => setShowModal(false)} style={{ background: 'transparent', color: 'var(--text-muted)' }}><FaTimes size={20} /></button>
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
                                        padding: '1rem',
                                        marginBottom: '1.5rem',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        background: 'rgba(0,0,0,0.2)',
                                        color: 'white',
                                        fontSize: '1rem',
                                        outline: 'none'
                                    }}
                                />
                                <button
                                    type="submit"
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        background: 'var(--primary)',
                                        color: 'white',
                                        borderRadius: '8px',
                                        fontWeight: '600',
                                        fontSize: '1rem'
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

export default CalendarPage;
