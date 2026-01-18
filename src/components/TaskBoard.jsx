import React, { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FaPlus, FaCheckCircle, FaRegCircle, FaTasks, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';

const SortableItem = ({ id, task, onToggle, onDelete, onEdit }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(task.title);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleSave = () => {
        if (editTitle.trim()) {
            onEdit(id, editTitle.trim());
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        setEditTitle(task.title);
        setIsEditing(false);
    };

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    };

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        marginBottom: '0.8rem',
        background: isDragging ? 'var(--bg-surface-hover)' : 'var(--bg-surface)',
        padding: '1.2rem',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        cursor: isEditing ? 'default' : 'grab',
        border: isDragging ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.03)',
        boxShadow: isDragging ? '0 10px 30px rgba(0,0,0,0.5)' : 'none',
        zIndex: isDragging ? 10 : 1,
        position: 'relative',
        overflow: 'hidden'
    };

    const dragProps = isEditing ? {} : { ...attributes, ...listeners };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...dragProps}
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
                        background: `radial-gradient(circle 150px at ${mousePos.x}px ${mousePos.y}px, rgba(108, 92, 231, 0.25) 0%, transparent 70%)`,
                        zIndex: 0
                    }}
                />
            )}

            <div onPointerDown={(e) => e.stopPropagation()} onClick={() => !isEditing && onToggle(id)} style={{ cursor: 'pointer', display: 'flex', position: 'relative', zIndex: 1 }}>
                {task.completed ? <FaCheckCircle size={22} color="var(--secondary)" /> : <FaRegCircle size={22} color="var(--text-muted)" />}
            </div>

            {isEditing ? (
                <div style={{ flex: 1, display: 'flex', gap: '0.5rem', position: 'relative', zIndex: 1 }}>
                    <input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        autoFocus
                        style={{
                            flex: 1,
                            background: 'rgba(0,0,0,0.2)',
                            border: '1px solid var(--primary)',
                            borderRadius: '4px',
                            color: 'white',
                            padding: '0.3rem 0.5rem',
                            outline: 'none'
                        }}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') handleCancel(); }}
                    />
                    <button onClick={handleSave} onPointerDown={(e) => e.stopPropagation()} style={{ color: 'var(--secondary)', background: 'transparent' }}><FaSave size={18} /></button>
                    <button onClick={handleCancel} onPointerDown={(e) => e.stopPropagation()} style={{ color: 'var(--danger)', background: 'transparent' }}><FaTimes size={18} /></button>
                </div>
            ) : (
                <>
                    <span style={{
                        flex: 1,
                        textDecoration: task.completed ? 'line-through' : 'none',
                        color: task.completed ? 'var(--text-muted)' : 'var(--text-main)',
                        fontWeight: '500',
                        fontSize: '1rem',
                        position: 'relative',
                        zIndex: 1
                    }}>
                        {task.title}
                    </span>

                    <div style={{ display: 'flex', gap: '0.5rem', opacity: isDragging ? 0 : 1, position: 'relative', zIndex: 1 }}>
                        <button
                            onClick={() => setIsEditing(true)}
                            onPointerDown={(e) => e.stopPropagation()}
                            style={{ background: 'transparent', color: 'var(--text-muted)', padding: '4px' }}
                            title="Edit"
                        >
                            <FaEdit size={16} />
                        </button>
                        <button
                            onClick={() => onDelete(id)}
                            onPointerDown={(e) => e.stopPropagation()}
                            style={{ background: 'transparent', color: 'var(--danger)', padding: '4px' }}
                            title="Delete"
                        >
                            <FaTrash size={16} />
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

const TaskBoard = () => {
    const [tasks, setTasks] = useState(() => {
        const savedTasks = localStorage.getItem('taskcloser_tasks');
        return savedTasks ? JSON.parse(savedTasks) : [
            { id: '1', title: 'Complete Frontend UI', completed: false, tag: 'Design' },
            { id: '2', title: 'Review Product Roadmap', completed: true, tag: 'Strategy' },
            { id: '3', title: 'Client Meeting Preparation', completed: false, tag: 'Meeting' },
            { id: '4', title: 'Fix Navigation Bug', completed: false, tag: 'Dev' },
            { id: '5', title: 'Update documentation', completed: false, tag: 'Docs' },
        ];
    });

    React.useEffect(() => {
        localStorage.setItem('taskcloser_tasks', JSON.stringify(tasks));
    }, [tasks]);

    const [newTask, setNewTask] = useState('');
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    };

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            setTasks((items) => {
                const oldIndex = items.findIndex((i) => i.id === active.id);
                const newIndex = items.findIndex((i) => i.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const toggleTask = (id) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const deleteTask = (id) => {
        setTasks(tasks.filter(t => t.id !== id));
    };

    const editTask = (id, newTitle) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, title: newTitle } : t));
    };

    const addTask = (e) => {
        e.preventDefault();
        if (!newTask.trim()) return;
        const task = {
            id: Date.now().toString(),
            title: newTask,
            completed: false,
        };
        setTasks([task, ...tasks]);
        setNewTask('');
    };

    const allCompleted = tasks.length > 0 && tasks.every(t => t.completed);

    React.useEffect(() => {
        if (allCompleted) {
            // Increment perfect completions counter
            const currentPerfect = parseInt(localStorage.getItem('taskcloser_perfect_completions') || '0');
            localStorage.setItem('taskcloser_perfect_completions', (currentPerfect + 1).toString());

            const timer = setTimeout(() => {
                setTasks([]);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [allCompleted]);

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.02 }}
            className="glass-panel"
            style={{ flex: 1.5, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', position: 'relative' }}
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
            <div style={{
                opacity: allCompleted ? 0.2 : 1,
                transition: 'opacity 0.5s',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                pointerEvents: allCompleted ? 'none' : 'auto',
                position: 'relative',
                zIndex: 1
            }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ fontSize: '1.2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            <FaTasks style={{ color: 'var(--primary)' }} /> Today's Tasks
                        </h2>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{tasks.length > 0 ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0}% Done</span>
                    </div>

                    <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${tasks.length > 0 ? (tasks.filter(t => t.completed).length / tasks.length) * 100 : 0}%` }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                            style={{ height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--secondary))', borderRadius: '3px' }}
                        />
                    </div>
                </div>

                <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
                    <form onSubmit={addTask} style={{ marginBottom: '1.5rem', position: 'relative' }}>
                        <input
                            type="text"
                            placeholder="Add a new task..."
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '1rem 3.5rem 1rem 1rem',
                                borderRadius: '12px',
                                border: 'none',
                                background: 'var(--bg-app)',
                                color: 'white',
                                fontSize: '1rem',
                                outline: 'none'
                            }}
                        />
                        <button
                            type="submit"
                            style={{
                                position: 'absolute',
                                right: '0.5rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'var(--primary)',
                                color: 'white',
                                borderRadius: '50%',
                                width: '36px',
                                height: '36px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 2px 10px var(--primary-glow)'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1.05)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1)'}
                        >
                            <FaPlus />
                        </button>
                    </form>

                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
                            {tasks.map((task) => (
                                <SortableItem key={task.id} id={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} onEdit={editTask} />
                            ))}
                        </SortableContext>
                    </DndContext>
                </div>
            </div>

            {allCompleted && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 20
                }}
                >
                    <motion.div
                        animate={{
                            rotate: [0, 10, -10, 10, 0],
                            scale: [1, 1.2, 1]
                        }}
                        transition={{ duration: 0.8 }}
                        style={{ fontSize: '4rem' }}
                    >
                        🎉
                    </motion.div>
                    <motion.h2
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        style={{ fontSize: '2rem', background: 'linear-gradient(to right, #6c5ce7, #00cec9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: '1rem 0' }}
                    >
                        Well Done!
                    </motion.h2>
                </div>
            )}
        </motion.div>
    );
};

export default TaskBoard;
