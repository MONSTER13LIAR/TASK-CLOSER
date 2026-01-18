import React from 'react';
import TaskBoard from './TaskBoard';
import CalendarView from './CalendarView';

const Dashboard = () => {
    return (
        <main className="dashboard-grid">
            <CalendarView />
            <TaskBoard />
        </main>
    );
};

export default Dashboard;
