import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUserCircle, FaCheckCircle, FaTasks, FaTrophy, FaChartBar, FaUser } from 'react-icons/fa';

const Profile = ({ username, profilePic }) => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);
    const [stats, setStats] = useState({
        totalTasks: 0,
        completedTasks: 0,
        perfectRuns: 0
    });

    useEffect(() => {
        // Load task stats
        const savedTasks = JSON.parse(localStorage.getItem('taskcloser_tasks') || '[]');
        const total = savedTasks.length;
        const completed = savedTasks.filter(t => t.completed).length;

        // Load perfect runs
        const perfect = parseInt(localStorage.getItem('taskcloser_perfect_completions') || '0');

        setStats({
            totalTasks: total,
            completedTasks: completed,
            perfectRuns: perfect
        });
    }, []);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    };

    const completionRate = stats.totalTasks > 0
        ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
        : 0;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel"
            style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                position: 'relative',
                padding: '3rem'
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
                        background: `radial-gradient(circle 400px at ${mousePos.x}px ${mousePos.y}px, rgba(108, 92, 231, 0.15) 0%, transparent 70%)`,
                        zIndex: 0
                    }}
                />
            )}

            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%', gap: '3rem' }}>
                {/* Profile Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
                    <div style={{ position: 'relative' }}>
                        {profilePic ? (
                            <img
                                src={profilePic}
                                alt="Profile"
                                style={{
                                    width: '150px',
                                    height: '150px',
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    border: '4px solid var(--primary)',
                                    boxShadow: '0 0 30px var(--primary-glow)'
                                }}
                            />
                        ) : (
                            <FaUserCircle style={{ fontSize: '150px', color: 'var(--text-muted)' }} />
                        )}
                        <div style={{
                            position: 'absolute',
                            bottom: '5px',
                            right: '5px',
                            background: 'var(--secondary)',
                            padding: '10px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 0 15px var(--secondary)'
                        }}>
                            <FaTrophy size={20} color="white" />
                        </div>
                    </div>
                    <div>
                        <h1 style={{ fontSize: '3rem', margin: 0, letterSpacing: '-1px' }}>{username}</h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FaUser color="var(--primary)" /> Task Closer Elite Member
                        </p>
                    </div>
                </div>

                {/* Statistics Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>

                    {/* Real-time Progress Card */}
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        padding: '2rem',
                        borderRadius: '24px',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.5rem'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, color: 'var(--text-muted)', fontSize: '1rem', fontWeight: '600' }}>CURRENT PROGRESS</h3>
                            <FaTasks color="var(--primary)" size={24} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                            <span style={{ fontSize: '3rem', fontWeight: 'bold' }}>{stats.completedTasks}</span>
                            <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>/ {stats.totalTasks} Tasks</span>
                        </div>
                        <div style={{ width: '100%', height: '10px', background: 'rgba(0,0,0,0.3)', borderRadius: '5px', overflow: 'hidden' }}>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${completionRate}%` }}
                                style={{ height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--secondary))' }}
                            />
                        </div>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            {completionRate}% of today's workload completed
                        </p>
                    </div>

                    {/* Perfect Completions Card */}
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        padding: '2rem',
                        borderRadius: '24px',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.5rem',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, color: 'var(--text-muted)', fontSize: '1rem', fontWeight: '600' }}>PERFECT RUNS</h3>
                            <FaCheckCircle color="var(--secondary)" size={24} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                            <span style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--secondary)' }}>{stats.perfectRuns}</span>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                            Number of times you've wiped out every single task and got the "Well Done" celebration.
                        </p>

                        {/* Background Decoration */}
                        <div style={{ position: 'absolute', bottom: '-20px', right: '-10px', opacity: 0.1 }}>
                            <FaTrophy size={100} />
                        </div>
                    </div>

                    {/* Mastery Level Card */}
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        padding: '2rem',
                        borderRadius: '24px',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.5rem'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, color: 'var(--text-muted)', fontSize: '1rem', fontWeight: '600' }}>MASTERY</h3>
                            <FaChartBar color="#f1c40f" size={24} />
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '600' }}>
                            Level {Math.floor(stats.perfectRuns / 5) + 1}
                        </div>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            {stats.perfectRuns % 5} / 5 Perfect Runs to next level
                        </p>
                        <div style={{ width: '100%', height: '10px', background: 'rgba(0,0,0,0.3)', borderRadius: '5px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${(stats.perfectRuns % 5) * 20}%`, background: '#f1c40f' }} />
                        </div>
                    </div>

                </div>
            </div>
        </motion.div>
    );
};

export default Profile;
