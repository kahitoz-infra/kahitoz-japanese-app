'use client';

import Calendar from "./components/Calendar";
import RecapBlock from "./components/RecapBlock";
import Navbar from "../common_components/Navbar";
import CherryBlossomSnowfall from "../common_components/CherryBlossomSnowfall";
import MotivationalQuotes from "../common_components/MotivationalQuotes";

export default function Dashboard() {
  const username = "Username"; // Replace this with a dynamic user name if available

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      {/* 🌸 Background Snowfall */}
      <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 0, width: '100%', height: '100%' }}>
        <CherryBlossomSnowfall />
      </div>

      {/* 🔼 Main content */}
      <main
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: '40px',
          width: '100%',
        }}
      >
        {/* 🌞 Greeting */}
        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}> Welcome Back!</h2>
          <p style={{ margin: 0, fontSize: '1.2rem', color: '#666', fontWeight:'bold' }}>おかえり</p>
        </div>

        {/* 💬 Motivational Quote inside styled box */}
        <div
          style={{
            marginTop: '10px',
            backgroundColor: 'var(--quote-bg)',
            borderRadius: '12px',
            padding: '15px 20px',
            marginBottom: '20px',
            width: '80%',
            maxWidth: '600px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            textAlign: 'center',
          }}
        >
          <MotivationalQuotes />
        </div>

        {/* ✅ Recap Block aligned left */}
        <div style={{ alignSelf: 'center', marginLeft: '20px' }}>
          <RecapBlock kanji="日" meaning="Sun / Day" reading="にち / ひ" />
        </div>

        <Calendar />
        <Navbar />
      </main>

      {/* 🌓 CSS for light/dark quote box color */}
      <style jsx global>{`
        :root {
          --quote-bg: #FFF0C9;
        }
        @media (prefers-color-scheme: dark) {
          :root {
            --quote-bg: #AAD0C7;
          }
        }
      `}</style>
    </div>
  );
}
