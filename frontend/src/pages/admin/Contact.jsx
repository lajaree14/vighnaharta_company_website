import React, { useEffect, useState } from 'react';
import { Trash2, Search } from '../../components/admin/Icons';
import './contact.css';

const formatDate = (iso) =>
  new Date(iso).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const Contact = () => {
  // Sample data - in the final version these come from the public Contact form via Laravel
  const [messages, setMessages] = useState([
    {
      id: 1,
      name: 'Amit Deshmukh',
      email: 'amit.deshmukh@example.com',
      phone: '+91 98200 11223',
      message:
        'Hello, I own a 3,000 sq ft plot in Vasai and want to build a two-floor house. Could someone from your team call me to discuss the process and timeline?',
      receivedAt: '2026-09-27T10:42:00',
      isRead: false,
    },
    {
      id: 2,
      name: 'Neha Sharma',
      email: 'neha.sharma@example.com',
      phone: '+91 97300 45678',
      message:
        'Do you take up renovation work for commercial offices? We need to redo the flooring and partitions of a 2,000 sq ft office in Andheri.',
      receivedAt: '2026-09-26T16:05:00',
      isRead: false,
    },
    {
      id: 3,
      name: 'Suresh Patil',
      email: 'suresh.patil@example.com',
      phone: '',
      message: 'Please share details of your completed road projects and whether you register for government tenders.',
      receivedAt: '2026-09-24T09:15:00',
      isRead: true,
    },
    {
      id: 4,
      name: 'Kavita Joshi',
      email: 'kavita.joshi@example.com',
      phone: '+91 99870 33445',
      message: 'Thank you for the quick estimate. We would like to visit your ongoing site in Thane this weekend if possible.',
      receivedAt: '2026-09-21T18:30:00',
      isRead: true,
    },
    {
      id: 5,
      name: 'Rohan Mehta',
      email: 'rohan.mehta@example.com',
      phone: '+91 98111 90909',
      message: 'Looking for a contractor for a 12-flat residential building in Nashik. Kindly get in touch.',
      receivedAt: '2026-09-18T12:20:00',
      isRead: false,
    },
  ]);

  const [selected, setSelected] = useState(null); // message open in the modal
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const unreadCount = messages.filter((m) => !m.isRead).length;

  // Close the modal with the Escape key
  useEffect(() => {
    if (!selected) return;
    const onKey = (e) => e.key === 'Escape' && setSelected(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected]);

  const setRead = (id, isRead) =>
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, isRead } : m)));

  // Opening a message marks it as read
  const openMessage = (msg) => {
    if (!msg.isRead) setRead(msg.id, true);
    setSelected({ ...msg, isRead: true });
  };

  const markAllRead = () =>
    setMessages((prev) => prev.map((m) => ({ ...m, isRead: true })));

  const handleDelete = (msg) => {
    if (window.confirm(`Delete the message from ${msg.name}? This cannot be undone.`)) {
      setMessages((prev) => prev.filter((m) => m.id !== msg.id));
      setSelected(null);
    }
  };

  const replyLink = (msg) =>
    `mailto:${msg.email}?subject=${encodeURIComponent('Re: Your enquiry to Vighnaharta Construction')}` +
    `&body=${encodeURIComponent(`Dear ${msg.name},\n\nThank you for contacting Vighnaharta Construction.\n\n`)}`;

  const filteredMessages = messages
    .filter((m) => {
      const q = searchTerm.toLowerCase();
      const matchesFilter =
        activeFilter === 'All' ||
        (activeFilter === 'Unread' && !m.isRead) ||
        (activeFilter === 'Read' && m.isRead);
      const matchesSearch =
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.message.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => new Date(b.receivedAt) - new Date(a.receivedAt)); // newest first

  const countFor = (filter) =>
    filter === 'All'
      ? messages.length
      : filter === 'Unread'
      ? unreadCount
      : messages.length - unreadCount;

  return (
    <div className="admin-page">

      <div className="page-header">
        <div>
          <h1>Contact Messages</h1>
          <p>Enquiries sent through the Contact Us form on the website.</p>
        </div>
        <button
          onClick={markAllRead}
          className="btn-secondary"
          disabled={unreadCount === 0}
        >
          Mark all as read
        </button>
      </div>

      <div className="toolbar">
        <div className="toolbar-search">
          <Search />
          <input
            type="text"
            placeholder="Search by name, email or message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <span className="toolbar-count">
          Unread: <strong>{unreadCount}</strong> of {messages.length}
        </span>
      </div>

      <div className="message-filters">
        {['All', 'Unread', 'Read'].map((filter) => (
          <button
            key={filter}
            type="button"
            className={`chip ${activeFilter === filter ? 'active' : ''}`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter} ({countFor(filter)})
          </button>
        ))}
      </div>

      <div className="table-card">
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Sender</th>
                <th>Message</th>
                <th>Received</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMessages.length > 0 ? (
                filteredMessages.map((msg) => (
                  <tr
                    key={msg.id}
                    className={`message-row ${msg.isRead ? '' : 'unread'}`}
                    onClick={() => openMessage(msg)}
                  >
                    <td>
                      <div className="sender">
                        <span className="unread-dot" aria-label={msg.isRead ? 'Read' : 'Unread'} />
                        <div>
                          <div className="cell-title">{msg.name}</div>
                          <div className="cell-sub">{msg.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="message-preview" title={msg.message}>
                      {msg.message}
                    </td>
                    <td className="message-date">{formatDate(msg.receivedAt)}</td>
                    <td className="row-actions" onClick={(e) => e.stopPropagation()}>
                      <button
                        className="edit"
                        title={msg.isRead ? 'Mark as unread' : 'Mark as read'}
                        aria-label={msg.isRead ? 'Mark as unread' : 'Mark as read'}
                        onClick={() => setRead(msg.id, !msg.isRead)}
                      >
                        <MailIcon open={msg.isRead} />
                      </button>
                      <button
                        className="delete"
                        title="Delete"
                        aria-label={`Delete message from ${msg.name}`}
                        onClick={() => handleDelete(msg)}
                      >
                        <Trash2 />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="empty-row">No messages found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div
          className="modal-overlay"
          onMouseDown={(e) => { if (e.target === e.currentTarget) setSelected(null); }}
        >
          <div className="modal-box modal-lg">
            <h2>Message from {selected.name}</h2>

            <dl className="message-meta">
              <div>
                <dt>Email</dt>
                <dd><a href={`mailto:${selected.email}`}>{selected.email}</a></dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>
                  {selected.phone ? <a href={`tel:${selected.phone.replace(/\s/g, '')}`}>{selected.phone}</a> : '—'}
                </dd>
              </div>
              <div>
                <dt>Received</dt>
                <dd>{formatDate(selected.receivedAt)}</dd>
              </div>
            </dl>

            <div className="message-body">{selected.message}</div>

            <div className="modal-actions">
              <button className="btn-secondary danger" onClick={() => handleDelete(selected)}>
                Delete
              </button>
              <button
                className="btn-secondary"
                onClick={() => {
                  setRead(selected.id, false);
                  setSelected(null);
                }}
              >
                Mark as unread
              </button>
              <a className="btn-primary" href={replyLink(selected)}>
                Reply by Email
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Small inline icon (closed envelope = unread, open envelope = read)
const MailIcon = ({ open }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {open ? (
      <>
        <path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6Z" />
        <path d="m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10" />
      </>
    ) : (
      <>
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </>
    )}
  </svg>
);

export default Contact;