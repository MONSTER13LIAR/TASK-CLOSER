import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { FaSearch, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';

const Layout = ({ username, profilePic, onLogout, children }) => {
    const location = useLocation();

    const navItems = [
        { name: 'Home', path: '/' },
        { name: 'Calendar', path: '/calendar' },
        { name: 'Goals', path: '/goals' },
        { name: 'Profile', path: '/profile' },
        { name: 'About', path: '/about' }
    ];

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', padding: '2rem', gap: '2rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                <div>
                    <h1 style={{ fontSize: '1.8rem', margin: 0 }}>Good to see you, <span style={{ color: 'var(--primary)' }}>{username}</span></h1>
                    <p style={{ color: 'var(--text-muted)', margin: '0.25rem 0 0 0' }}>{format(new Date(), 'EEEE, MMMM do, yyyy')}</p>
                </div>

                <motion.nav
                    className="nav-shiny"
                    initial={{ x: '-50%' }}
                    whileHover={{ scale: 1.05 }}
                    style={{
                        position: 'absolute',
                        left: '50%',
                        display: 'flex',
                        gap: '2rem',
                        background: 'var(--bg-surface)',
                        padding: '0.8rem 2rem',
                        borderRadius: '50px',
                        border: '1px solid rgba(255,255,255,0.05)',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                    }}>
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                style={{
                                    color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                                    fontWeight: isActive ? '600' : '500',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    position: 'relative',
                                    textDecoration: 'none',
                                    transition: 'color 0.2s'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-main)'}
                                onMouseOut={(e) => e.currentTarget.style.color = isActive ? 'var(--text-main)' : 'var(--text-muted)'}
                            >
                                {item.name}
                                {isActive && <motion.div layoutId="nav-underline" style={{ position: 'absolute', bottom: '-8px', left: '0', right: '0', height: '2px', background: 'var(--primary)', borderRadius: '2px' }} />}
                            </Link>
                        );
                    })}
                </motion.nav>

                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <div style={{ padding: '0.5rem', borderRadius: '50%', background: 'var(--bg-surface)', display: 'flex', alignItems: 'center' }}>
                        <FaSearch style={{ color: 'var(--text-muted)' }} />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: '500' }}>{username}</span>
                        {profilePic ? (
                            <img src={profilePic} alt="Profile" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--secondary)' }} />
                        ) : (
                            <FaUserCircle style={{ color: 'var(--secondary)', fontSize: '2.5rem' }} />
                        )}
                        <button
                            onClick={onLogout}
                            title="Logout"
                            style={{
                                marginLeft: '1rem',
                                background: 'rgba(255,118,117,0.1)',
                                color: 'var(--danger)',
                                border: '1px solid var(--danger)',
                                borderRadius: '50%',
                                width: '32px',
                                height: '32px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.9rem'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,118,117,0.2)'}
                            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,118,117,0.1)'}
                        >
                            <FaSignOutAlt />
                        </button>
                    </div>
                </div>
            </header>

            {children}
        </div>
    );
};

export default Layout;
