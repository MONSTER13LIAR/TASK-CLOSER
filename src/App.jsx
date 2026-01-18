import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Onboarding from './components/Onboarding';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import CalendarPage from './components/CalendarPage';
import About from './components/About';
import Goals from './components/Goals';
import Profile from './components/Profile';

function App() {
    const [username, setUsername] = useState(() => localStorage.getItem('taskcloser_username') || '');
    const [profilePic, setProfilePic] = useState(() => localStorage.getItem('taskcloser_profilePic') || null);

    const handleSaveUser = (name, pic) => {
        setUsername(name);
        setProfilePic(pic);
        localStorage.setItem('taskcloser_username', name);
        if (pic) localStorage.setItem('taskcloser_profilePic', pic);
    };

    const handleLogout = () => {
        setUsername('');
        setProfilePic(null);
        localStorage.removeItem('taskcloser_username');
        localStorage.removeItem('taskcloser_profilePic');
    };

    if (!username) {
        return <Onboarding onSave={handleSaveUser} />;
    }

    return (
        <BrowserRouter>
            <Layout username={username} profilePic={profilePic} onLogout={handleLogout}>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/calendar" element={<CalendarPage />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/goals" element={<Goals />} />
                    <Route path="/profile" element={<Profile username={username} profilePic={profilePic} />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}

export default App;
