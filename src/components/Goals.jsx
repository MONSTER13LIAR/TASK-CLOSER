import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBullseye, FaTrash, FaPlus, FaTrophy, FaCalendarAlt } from 'react-icons/fa';

const Goals = () => {
    const [goals, setGoals] = useState(() => {
        const savedGoals = localStorage.getItem('taskcloser_goals');
        return savedGoals ? JSON.parse(savedGoals) : [];
    });

    const [title, setTitle] = useState('');
    const [years, setYears] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        localStorage.setItem('taskcloser_goals', JSON.stringify(goals));
    }, [goals]);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    };

    const handleAddGoal = (e) => {
        e.preventDefault();
        if (!title.trim() || !years) return;

        const newGoal = {
            id: Date.now().toString(),
            title: title.trim(),
            years: parseInt(years),
            priority,
            createdAt: new Date().toISOString(),
        };

        setGoals([newGoal, ...goals]);
        setTitle('');
        setYears('');
        setPriority('Medium');
    };

    const handleDeleteGoal = (id) => {
        setGoals(goals.filter(goal => goal.id !== id));
    };

    const getPriorityColor = (p) => {
        switch (p) {
            case 'High': return 'var(--danger)';
            case 'Medium': return 'var(--primary)';
            case 'Low': return 'var(--secondary)';
            default: return 'var(--text-muted)';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel"
            style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                position: 'relative',
                padding: '2rem'
            }}
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
                        background: `radial-gradient(circle 300px at ${mousePos.x}px ${mousePos.y}px, rgba(108, 92, 231, 0.15) 0%, transparent 70%)`,
                        zIndex: 0
                    }}
                />
            )}

            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flex: 1, flexDirection: 'column', gap: '2rem' }}>
                <header style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <FaBullseye style={{ fontSize: '2.5rem', color: 'var(--primary)' }} />
                    <h1 style={{ fontSize: '2.2rem', margin: 0 }}>Moonshot <span style={{ color: 'var(--primary)' }}>Goals</span></h1>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1fr) 2fr', gap: '2rem', flex: 1, overflow: 'hidden' }}>
                    {/* Add Goal Section */}
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        padding: '2rem',
                        borderRadius: '24px',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.5rem',
                        height: 'fit-content'
                    }}>
                        <h2 style={{ fontSize: '1.4rem', margin: 0, color: 'var(--text-main)' }}>Set New Objective</h2>

                        <form onSubmit={handleAddGoal} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Goal Title</label>
                                <input
                                    type="text"
                                    placeholder="What do you want to achieve?"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    style={{
                                        background: 'rgba(0,0,0,0.2)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '12px',
                                        padding: '1rem',
                                        color: 'white',
                                        outline: 'none',
                                        fontSize: '1rem'
                                    }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Duration (Years)</label>
                                    <input
                                        type="number"
                                        min="1"
                                        placeholder="0"
                                        value={years}
                                        onChange={(e) => setYears(e.target.value)}
                                        style={{
                                            background: 'rgba(0,0,0,0.2)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '12px',
                                            padding: '1rem',
                                            color: 'white',
                                            outline: 'none',
                                            fontSize: '1rem'
                                        }}
                                    />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Priority</label>
                                    <select
                                        value={priority}
                                        onChange={(e) => setPriority(e.target.value)}
                                        style={{
                                            background: 'rgba(0,0,0,0.2)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '12px',
                                            padding: '1rem',
                                            color: 'white',
                                            outline: 'none',
                                            fontSize: '1rem',
                                            appearance: 'none',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <option value="High">High</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Low">Low</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                type="submit"
                                style={{
                                    marginTop: '0.5rem',
                                    padding: '1.2rem',
                                    background: 'var(--primary)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '15px',
                                    fontSize: '1.1rem',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    boxShadow: '0 0 20px var(--primary-glow)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.8rem',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.filter = 'brightness(1.1)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.filter = 'none';
                                }}
                            >
                                <FaPlus /> COMMIT
                            </button>
                        </form>
                    </div>

                    {/* Goals List Section */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', overflow: 'auto', paddingRight: '0.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ fontSize: '1.4rem', margin: 0 }}>Active Objectives</h2>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total: {goals.length}</span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <AnimatePresence>
                                {goals.map((goal) => (
                                    <motion.div
                                        key={goal.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        layout
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.02)',
                                            padding: '1.5rem',
                                            borderRadius: '20px',
                                            border: '1px solid rgba(255, 255, 255, 0.03)',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                            <div style={{
                                                width: '50px',
                                                height: '50px',
                                                borderRadius: '15px',
                                                background: 'rgba(108, 92, 231, 0.1)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'var(--primary)'
                                            }}>
                                                <FaTrophy size={20} />
                                            </div>
                                            <div>
                                                <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-main)' }}>{goal.title}</h3>
                                                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.4rem', fontSize: '0.85rem' }}>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)' }}>
                                                        <FaCalendarAlt size={12} /> {goal.years} Year{goal.years > 1 ? 's' : ''}
                                                    </span>
                                                    <span style={{
                                                        color: getPriorityColor(goal.priority),
                                                        fontWeight: '600',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.4rem'
                                                    }}>
                                                        • {goal.priority} Priority
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleDeleteGoal(goal.id)}
                                            style={{
                                                background: 'transparent',
                                                color: 'rgba(255, 255, 255, 0.2)',
                                                border: 'none',
                                                cursor: 'pointer',
                                                padding: '0.5rem',
                                                transition: 'all 0.2s ease'
                                            }}
                                            onMouseOver={(e) => e.currentTarget.style.color = 'var(--danger)'}
                                            onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.2)'}
                                        >
                                            <FaTrash size={18} />
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {goals.length === 0 && (
                                <div style={{
                                    textAlign: 'center',
                                    padding: '4rem 2rem',
                                    color: 'var(--text-muted)',
                                    background: 'rgba(255, 255, 255, 0.01)',
                                    borderRadius: '24px',
                                    border: '2px dashed rgba(255, 255, 255, 0.05)'
                                }}>
                                    <FaBullseye size={40} style={{ marginBottom: '1rem', opacity: 0.2 }} />
                                    <p style={{ margin: 0 }}>No goals set yet. Start by committing your first objective!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Goals;
