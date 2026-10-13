import React, { useEffect, useState } from 'react';
import { Trash2, Search } from '../../components/admin/Icons';
import './quotes.css';

const STATUSES = ['New', 'Contacted', 'Quoted', 'Closed'];

const formatINR = (amount) =>
  amount ? `₹${Number(amount).toLocaleString('en-IN')}` : '—';

const formatDate = (iso) =>
  new Date(iso).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const Quotes = () => {
  // Sample data - in the final version these come from the public "Request a Quote" form via Laravel
  const [quotes, setQuotes] = useState([
    {
      id: 1,
      name: 'Prakash Naik',
      email: 'prakash.naik@example.com',
      phone: '+91 98220 12345',
      projectType: 'Residential',
      location: 'Vasai East',
      area: 2400,
      budget: 5500000,
      details: 'Two-floor independent house with 4 bedrooms and a small garden. Plot is ready and cleared. Would like to start after Diwali.',
      receivedAt: '2026-09-27T14:10:00',
      status: 'New',
      notes: '',
    },
    {
      id: 2,
      name: 'Shweta Kapoor',
      email: 'shweta.kapoor@example.com',
      phone: '+91 98765 43210',
      projectType: 'Commercial',
      location: 'Andheri East, Mumbai',
      area: 8000,
      budget: 22000000,
      details: 'Ground plus three floors office building with a basement parking. Need a detailed quotation with a phase-wise payment plan.',
      receivedAt: '2026-09-26T11:45:00',
      status: 'Contacted',
      notes: 'Called on 27 Sep. Site visit planned for next Tuesday.',
    },
    {
      id: 3,
      name: 'Vinod Shinde',
      email: 'vinod.shinde@example.com',
      phone: '',
      projectType: 'Renovation',
      location: 'Thane West',
      area: 1100,
      budget: 900000,
      details: 'Full renovation of a 2BHK flat: new flooring, false ceiling, kitchen and bathroom remodelling.',
      receivedAt: '2026-09-23T17:30:00',
      status: 'Quoted',
      notes: 'Quotation of ₹8.6 lakh sent by email on 25 Sep.',
    },
    {
      id: 4,
      name: 'Gram Panchayat Kelwa',
      email: 'kelwa.gp@example.com',
      phone: '+91 97640 11002',
      projectType: 'Government',
      location: 'Kelwa, Palghar',
      area: 0,
      budget: 0,
      details: 'Construction of a 3 km internal concrete road. We need a rate quotation for the tender file.',
      receivedAt: '2026-09-20T09:05:00',
      status: 'Closed',
      notes: 'Client chose another contractor.',
    },
    {
      id: 5,
      name: 'Anita Bhosale',
      email: 'anita.bhosale@example.com',
      phone: '+91 99223 87766',
      projectType: 'Residential',
      location: 'Nashik',
      area: 3200,
      budget: 7800000,
      details: 'Bungalow with a basement and terrace. Looking for a turnkey contractor (design plus construction).',
      receivedAt: '2026-09-25T20:15:00',
      status: 'New',
      notes: '',
    },
  ]);

  const [selected, setSelected] = useState(null); // quote open in the modal
  const [draft, setDraft] = useState({ status: 'New', notes: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [activeStatus, setActiveStatus] = useState('All');

  const newCount = quotes.filter((q) => q.status === 'New').length;

  // Close the modal with the Escape key
  useEffect(() => {
    if (!selected) return;
    const onKey = (e) => e.key === 'Escape' && setSelected(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected]);

  const openQuote = (quote) => {
    setSelected(quote);
    setDraft({ status: quote.status, notes: quote.notes });
  };

  const saveQuote = () => {
    setQuotes(quotes.map((q) =>
      q.id === selected.id ? { ...q, status: draft.status, notes: draft.notes.trim() } : q
    ));
    setSelected(null);
  };

  const handleDelete = (quote) => {
    if (window.confirm(`Delete the quote request from ${quote.name}? This cannot be undone.`)) {
      setQuotes(quotes.filter((q) => q.id !== quote.id));
      setSelected(null);
    }
  };

  const replyLink = (quote) =>
    `mailto:${quote.email}?subject=${encodeURIComponent('Your quotation request - Vighnaharta Construction')}` +
    `&body=${encodeURIComponent(`Dear ${quote.name},\n\nThank you for your interest in Vighnaharta Construction. Regarding your ${quote.projectType.toLowerCase()} project enquiry:\n\n`)}`;

  const filteredQuotes = quotes
    .filter((q) => {
      const term = searchTerm.toLowerCase();
      const matchesStatus = activeStatus === 'All' || q.status === activeStatus;
      const matchesSearch =
        q.name.toLowerCase().includes(term) ||
        q.email.toLowerCase().includes(term) ||
        q.location.toLowerCase().includes(term) ||
        q.projectType.toLowerCase().includes(term);
      return matchesStatus && matchesSearch;
    })
    .sort((a, b) => new Date(b.receivedAt) - new Date(a.receivedAt)); // newest first

  const countFor = (status) =>
    status === 'All' ? quotes.length : quotes.filter((q) => q.status === status).length;

  return (
    <div className="admin-page">

      <div className="page-header">
        <div>
          <h1>Quote Requests</h1>
          <p>Quotation requests submitted through the website. Track each one from first enquiry to final quote.</p>
        </div>
      </div>

      <div className="toolbar">
        <div className="toolbar-search">
          <Search />
          <input
            type="text"
            placeholder="Search by name, email, location or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <span className="toolbar-count">
          New: <strong>{newCount}</strong> of {quotes.length}
        </span>
      </div>

      <div className="quote-filters">
        {['All', ...STATUSES].map((status) => (
          <button
            key={status}
            type="button"
            className={`chip ${activeStatus === status ? 'active' : ''}`}
            onClick={() => setActiveStatus(status)}
          >
            {status} ({countFor(status)})
          </button>
        ))}
      </div>

      <div className="table-card">
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Requester</th>
                <th>Project</th>
                <th>Budget</th>
                <th>Status</th>
                <th>Received</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuotes.length > 0 ? (
                filteredQuotes.map((quote) => (
                  <tr
                    key={quote.id}
                    className={`quote-row ${quote.status === 'New' ? 'is-new' : ''}`}
                    onClick={() => openQuote(quote)}
                  >
                    <td>
                      <div className="cell-title">{quote.name}</div>
                      <div className="cell-sub">{quote.email}</div>
                    </td>
                    <td>
                      <span className="badge">{quote.projectType}</span>
                      <div className="cell-sub">
                        {quote.location}
                        {quote.area > 0 && ` · ${quote.area.toLocaleString('en-IN')} sq ft`}
                      </div>
                    </td>
                    <td className="cell-title">{formatINR(quote.budget)}</td>
                    <td>
                      <span className={`quote-status ${quote.status.toLowerCase()}`}>{quote.status}</span>
                    </td>
                    <td className="quote-date">{formatDate(quote.receivedAt)}</td>
                    <td className="row-actions" onClick={(e) => e.stopPropagation()}>
                      <button
                        className="edit"
                        title="View details"
                        aria-label={`View request from ${quote.name}`}
                        onClick={() => openQuote(quote)}
                      >
                        <EyeIcon />
                      </button>
                      <button
                        className="delete"
                        title="Delete"
                        aria-label={`Delete request from ${quote.name}`}
                        onClick={() => handleDelete(quote)}
                      >
                        <Trash2 />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="empty-row">No quote requests found.</td>
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
            <h2>Quote request from {selected.name}</h2>

            <dl className="quote-meta">
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
                <dt>Project type</dt>
                <dd>{selected.projectType}</dd>
              </div>
              <div>
                <dt>Location</dt>
                <dd>{selected.location || '—'}</dd>
              </div>
              <div>
                <dt>Area</dt>
                <dd>{selected.area > 0 ? `${selected.area.toLocaleString('en-IN')} sq ft` : '—'}</dd>
              </div>
              <div>
                <dt>Expected budget</dt>
                <dd>{formatINR(selected.budget)}</dd>
              </div>
              <div className="wide">
                <dt>Received</dt>
                <dd>{formatDate(selected.receivedAt)}</dd>
              </div>
            </dl>

            <div className="quote-details">
              <h3>Project details</h3>
              <p>{selected.details}</p>
            </div>

            <div className="form-group">
              <div className="form-field">
                <label>Status</label>
                <select
                  value={draft.status}
                  onChange={(e) => setDraft({ ...draft, status: e.target.value })}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label>Internal notes (only visible to you)</label>
                <textarea
                  rows="3"
                  value={draft.notes}
                  onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
                  placeholder="e.g. Called the client, site visit on Tuesday..."
                ></textarea>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-secondary danger" onClick={() => handleDelete(selected)}>
                Delete
              </button>
              <a className="btn-secondary" href={replyLink(selected)}>
                Email client
              </a>
              <button className="btn-primary" onClick={saveQuote}>
                Save changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quotes;