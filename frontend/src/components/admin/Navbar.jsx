import React, { useEffect, useRef, useState } from 'react';
import { Search, Bell, Mail, FileQuestion } from './Icons';

// Sample data - once the backend exists, replace this with the real unread
// contact messages + new quote requests (see TODO below).
const NOTIFICATIONS = [
  {
    id: 1,
    type: 'message',
    title: 'New message from Amit Deshmukh',
    detail: 'Hello, I own a 3,000 sq ft plot in Vasai and want to build...',
    time: '2 hours ago',
  },
  {
    id: 2,
    type: 'quote',
    title: 'New quote request from Prakash Naik',
    detail: 'Residential project in Vasai East, 2,400 sq ft',
    time: '5 hours ago',
  },
  {
    id: 3,
    type: 'message',
    title: 'New message from Neha Sharma',
    detail: 'Do you take up renovation work for commercial offices?',
    time: '1 day ago',
  },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  // Close the dropdown on outside click or Escape
  useEffect(() => {
    const handleClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    const handleKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, []);

  const count = NOTIFICATIONS.length;

  return (
    <header className="navbar">
      <div className="navbar-search">
        <Search />
        <input type="text" placeholder="Search..." />
      </div>

      <div className="navbar-right">
        <div className="navbar-bell-wrap" ref={wrapRef}>
          <button
            className="navbar-bell"
            onClick={() => setOpen(!open)}
            aria-label="Notifications"
            aria-expanded={open}
          >
            <Bell />
            {count > 0 && <span className="navbar-bell-dot"></span>}
          </button>

          {open && (
            <div className="navbar-dropdown">
              <div className="navbar-dropdown-head">
                <span>Notifications</span>
                {count > 0 && <span className="navbar-dropdown-count">{count} new</span>}
              </div>

              <div className="navbar-dropdown-list">
                {count > 0 ? (
                  NOTIFICATIONS.map((n) => (
                    <div className="navbar-dropdown-item" key={n.id}>
                      <span className={`navbar-dropdown-icon ${n.type}`}>
                        {n.type === 'quote' ? <FileQuestion /> : <Mail />}
                      </span>
                      <div className="navbar-dropdown-text">
                        <p className="navbar-dropdown-title">{n.title}</p>
                        <p className="navbar-dropdown-detail">{n.detail}</p>
                        <span className="navbar-dropdown-time">{n.time}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="navbar-dropdown-empty">You're all caught up.</div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="navbar-user">
          <span className="navbar-user-name">Admin</span>
          <div className="navbar-avatar">AD</div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;