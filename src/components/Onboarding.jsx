import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaArrowRight, FaCamera } from 'react-icons/fa';

const Onboarding = ({ onSave }) => {
    const [name, setName] = useState('');
    const [profilePic, setProfilePic] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePic(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) onSave(name.trim(), profilePic);
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            background: 'radial-gradient(circle at center, #1e2130 0%, #0f111a 100%)'
        }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel"
                style={{ padding: '3rem', width: '100%', maxWidth: '400px', textAlign: 'center' }}
            >
                <h1 style={{ marginBottom: '0.5rem', fontSize: '2rem', background: 'linear-gradient(to right, #6c5ce7, #00cec9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>TASK CLOSER</h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Master your day, one task at a time.</p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                    <div
                        onClick={() => fileInputRef.current.click()}
                        style={{
                            width: '100px',
                            height: '100px',
                            borderRadius: '50%',
                            background: profilePic ? `url(${profilePic}) center/cover no-repeat` : 'rgba(255,255,255,0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            marginBottom: '1.5rem',
                            border: '2px dashed var(--border)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        {!profilePic && <FaCamera style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }} />}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            style={{ display: 'none' }}
                        />
                    </div>

                    <input
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '1rem',
                            borderRadius: '8px',
                            border: '1px solid var(--border)',
                            background: 'rgba(0,0,0,0.2)',
                            color: 'white',
                            marginBottom: '1.5rem',
                            fontSize: '1rem',
                            outline: 'none',
                            textAlign: 'center'
                        }}
                        autoFocus
                    />
                    <button
                        type="submit"
                        style={{
                            width: '100%',
                            padding: '1rem',
                            borderRadius: '8px',
                            background: 'var(--primary)',
                            color: 'white',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            boxShadow: '0 4px 15px var(--primary-glow)',
                            transition: 'transform 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        Get Started <FaArrowRight />
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default Onboarding;
