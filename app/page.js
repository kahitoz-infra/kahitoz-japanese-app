'use client';

import { useState } from 'react';
import Login from './Screens/Login';
import Navbar from './common_components/Navbar';

import Dashboard from './Screens/Dashboard';
import CustomQuizPage from './Screens/CustomQuiz';
import ViewAll from './Screens/ViewAll';
import Settings from './Screens/Settings';
// import Chat from './Chat'; // when available

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard'); // default view

  const renderPage = () => {
    switch (currentPage) {
      case 'quiz':
        return <CustomQuizPage />;
      case 'viewall':
        return <ViewAll />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        {renderPage()}
      </main>

      <Navbar setCurrentPage={setCurrentPage} />
    </div>
  );
}
