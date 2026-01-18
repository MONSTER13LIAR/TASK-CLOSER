import React from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaYoutube } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const About = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel"
            style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto', position: 'relative', padding: '3rem' }}
        >
            <h1 style={{ fontSize: '2.5rem', margin: '0 0 1rem 0', color: 'var(--primary)' }}>About Task Closer</h1>

            <div style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-main)' }}>
                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: 'var(--secondary)' }}>What is Task Closer?</h2>
                    <p style={{ marginBottom: '1rem' }}>
                        Task Closer is a modern, intuitive task management application designed to help you stay organized and productive.
                        With its sleek interface and powerful features, managing your daily tasks and events has never been easier.
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: 'var(--secondary)' }}>Key Features</h2>
                    <ul style={{ paddingLeft: '2rem' }}>
                        <li style={{ marginBottom: '0.8rem' }}>
                            <strong>Smart Task Management:</strong> Create, edit, delete, and reorder tasks with drag-and-drop functionality
                        </li>
                        <li style={{ marginBottom: '0.8rem' }}>
                            <strong>Interactive Calendar:</strong> Visualize your events, drag them between dates, and manage your schedule effortlessly
                        </li>
                        <li style={{ marginBottom: '0.8rem' }}>
                            <strong>Progress Tracking:</strong> Real-time progress bar shows your completion rate
                        </li>
                        <li style={{ marginBottom: '0.8rem' }}>
                            <strong>Local Storage:</strong> Your data is saved automatically and persists between sessions
                        </li>
                        <li style={{ marginBottom: '0.8rem' }}>
                            <strong>Beautiful UI:</strong> Stunning glass-morphism design with interactive spotlight effects
                        </li>
                        <li style={{ marginBottom: '0.8rem' }}>
                            <strong>Celebration Animations:</strong> Get rewarded when you complete all your tasks
                        </li>
                        <li style={{ marginBottom: '0.8rem' }}>
                            <strong>Moonshot Goals:</strong> Track long-term objectives with specific year durations and priority levels
                        </li>
                        <li style={{ marginBottom: '0.8rem' }}>
                            <strong>Profile & Mastery:</strong> Monitor your task completion rates and level up with "Perfect Runs"
                        </li>
                    </ul>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: 'var(--secondary)' }}>How to Use</h2>
                    <div style={{ paddingLeft: '1rem' }}>
                        <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>Tasks</h3>
                        <ul style={{ paddingLeft: '2rem', marginBottom: '1.5rem' }}>
                            <li style={{ marginBottom: '0.5rem' }}>Add new tasks using the input field at the top of the task board</li>
                            <li style={{ marginBottom: '0.5rem' }}>Click the circle to mark tasks as complete</li>
                            <li style={{ marginBottom: '0.5rem' }}>Use the edit icon to rename tasks</li>
                            <li style={{ marginBottom: '0.5rem' }}>Drag tasks to reorder them by priority</li>
                            <li style={{ marginBottom: '0.5rem' }}>Delete unwanted tasks with the trash icon</li>
                        </ul>

                        <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>Calendar</h3>
                        <ul style={{ paddingLeft: '2rem' }}>
                            <li style={{ marginBottom: '0.5rem' }}>Click any date to add a new event</li>
                            <li style={{ marginBottom: '0.5rem' }}>Drag event dots between dates to reschedule</li>
                            <li style={{ marginBottom: '0.5rem' }}>Drag events to the red trash bin to delete them</li>
                            <li style={{ marginBottom: '0.5rem' }}>Navigate between months using the arrow buttons on the calendar page</li>
                            <li style={{ marginBottom: '0.5rem' }}>View all upcoming events in the list below the calendar</li>
                        </ul>

                        <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>Goals</h3>
                        <ul style={{ paddingLeft: '2rem', marginBottom: '1.5rem' }}>
                            <li style={{ marginBottom: '0.5rem' }}>Navigate to the Goals page to set long-term "Moonshot" objectives</li>
                            <li style={{ marginBottom: '0.5rem' }}>Input the title, expected duration in years, and priority</li>
                            <li style={{ marginBottom: '0.5rem' }}>Press <strong>COMMIT</strong> to save your goal permanently</li>
                            <li style={{ marginBottom: '0.5rem' }}>Track your active objectives and delete them as they are achieved</li>
                        </ul>

                        <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>Profile & Stats</h3>
                        <ul style={{ paddingLeft: '2rem' }}>
                            <li style={{ marginBottom: '0.5rem' }}>Visit your Profile to see real-time statistics on your productivity</li>
                            <li style={{ marginBottom: '0.5rem' }}>Track your <strong>Perfect Runs</strong>—every time you finish all your tasks for the day</li>
                            <li style={{ marginBottom: '0.5rem' }}>Level up your <strong>Mastery</strong> as you accumulate more perfect runs</li>
                            <li style={{ marginBottom: '0.5rem' }}>View your overall task completion rate at a glance</li>
                        </ul>
                    </div>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: 'var(--secondary)' }}>Version</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Task Closer v1.1.0</p>
                    <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Built with React, Framer Motion, and modern web technologies</p>
                </section>

                <section>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.5rem',
                        background: 'var(--bg-app)',
                        padding: '2rem',
                        borderRadius: '16px',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        <h2 style={{ fontSize: '1.8rem', margin: 0, color: 'var(--secondary)' }}>Created by Monster Liar</h2>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '2rem'
                        }}>
                            <img
                                src="/monsterliar-avatar.png"
                                alt="MonsterLiar"
                                style={{
                                    width: '120px',
                                    height: '120px',
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    border: '3px solid var(--primary)',
                                    boxShadow: '0 0 20px rgba(108, 92, 231, 0.3)'
                                }}
                            />
                            <p style={{ flex: 1, fontSize: '1.1rem', lineHeight: '1.8', margin: 0 }}>
                                This entire web application is built by <strong style={{ color: 'var(--primary)' }}>MonsterLiar</strong>,
                                a tech enthusiast passionate about creating meaningful, productive tools and thinking with an entrepreneurial vision.
                            </p>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            <a
                                href="https://github.com/MONSTER13LIAR/TASK-CLOSER"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.8rem',
                                    padding: '1rem 2rem',
                                    background: 'linear-gradient(135deg, #24292e 0%, #1b1f23 100%)',
                                    color: 'white',
                                    borderRadius: '12px',
                                    textDecoration: 'none',
                                    fontWeight: '600',
                                    fontSize: '1.1rem',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.4)';
                                    e.currentTarget.style.background = 'linear-gradient(135deg, #2d333b 0%, #22272e 100%)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                    e.currentTarget.style.background = 'linear-gradient(135deg, #24292e 0%, #1b1f23 100%)';
                                }}
                            >
                                <FaGithub size={24} />
                                GitHub
                            </a>

                            <a
                                href="https://x.com/MONSTER13LIAR"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.8rem',
                                    padding: '1rem 2rem',
                                    background: 'linear-gradient(135deg, #000000 0%, #14171a 100%)',
                                    color: 'white',
                                    borderRadius: '12px',
                                    textDecoration: 'none',
                                    fontWeight: '600',
                                    fontSize: '1.1rem',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.4)';
                                    e.currentTarget.style.background = 'linear-gradient(135deg, #18191a 0%, #242526 100%)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                    e.currentTarget.style.background = 'linear-gradient(135deg, #000000 0%, #14171a 100%)';
                                }}
                            >
                                <FaXTwitter size={24} />
                                X
                            </a>

                            <a
                                href="https://www.youtube.com/@MONSTER-LIAR"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.8rem',
                                    padding: '1rem 2rem',
                                    background: 'linear-gradient(135deg, #FF0000 0%, #CC0000 100%)',
                                    color: 'white',
                                    borderRadius: '12px',
                                    textDecoration: 'none',
                                    fontWeight: '600',
                                    fontSize: '1.1rem',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(255,0,0,0.2)';
                                    e.currentTarget.style.background = 'linear-gradient(135deg, #FF3333 0%, #E60000 100%)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                    e.currentTarget.style.background = 'linear-gradient(135deg, #FF0000 0%, #CC0000 100%)';
                                }}
                            >
                                <FaYoutube size={24} />
                                YouTube
                            </a>
                        </div>
                    </div>
                </section>
            </div>
        </motion.div>
    );
};

export default About;
