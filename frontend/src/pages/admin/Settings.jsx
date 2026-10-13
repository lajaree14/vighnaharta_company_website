import React, { useEffect, useRef, useState } from 'react';
import './settings.css';

const TABS = [
  { id: 'company', label: 'Company Profile' },
  { id: 'account', label: 'Account & Password' },
  { id: 'stages', label: 'Payment Stages' },
  { id: 'rates', label: 'Estimator Rates' },
];

const PROJECT_TYPES = ['Residential', 'Commercial', 'Renovation'];
const QUALITIES = ['Basic', 'Standard', 'Premium'];

const EXAMPLE_CONTRACT = 5000000; // ₹50 lakh, only used for the example column

const isUrl = (value) => !value || /^https?:\/\/\S+\.\S+/.test(value);
const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const formatINR = (amount) => `₹${Math.round(amount).toLocaleString('en-IN')}`;

/* ------------------------------------------------------------------ */
/* Tab 1: Company profile (shown in the website footer / contact page) */
/* ------------------------------------------------------------------ */
const CompanyTab = ({ value, onSave }) => {
  const [form, setForm] = useState(value);
  const [error, setError] = useState('');

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleaned = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, v.trim()]));

    if (!cleaned.name) return setError('Company name is required.');
    if (!isEmail(cleaned.email)) return setError('Please enter a valid company email address.');

    const links = [['facebook', 'Facebook'], ['instagram', 'Instagram'], ['linkedin', 'LinkedIn']];
    for (const [key, label] of links) {
      if (!isUrl(cleaned[key])) {
        return setError(`The ${label} link must be a full web address starting with https://`);
      }
    }

    setError('');
    setForm(cleaned);
    onSave(cleaned);
  };

  return (
    <form className="card settings-section" onSubmit={handleSubmit}>
      <div className="settings-head">
        <h2>Company Profile</h2>
        <p>These details appear in the website header, footer and Contact Us page.</p>
      </div>

      <div className="form-group">
        <div className="form-row">
          <div className="form-field">
            <label>Company Name</label>
            <input type="text" required value={form.name} onChange={set('name')} />
          </div>
          <div className="form-field">
            <label>Tagline <span className="optional">(optional)</span></label>
            <input type="text" value={form.tagline} onChange={set('tagline')} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label>Email</label>
            <input type="email" required value={form.email} onChange={set('email')} />
          </div>
          <div className="form-field">
            <label>Phone</label>
            <input type="tel" value={form.phone} onChange={set('phone')} />
          </div>
        </div>

        <div className="form-field">
          <label>Office Address</label>
          <textarea rows="2" value={form.address} onChange={set('address')}></textarea>
        </div>

        <div className="form-field">
          <label>Working Hours</label>
          <input type="text" value={form.hours} onChange={set('hours')} />
        </div>
      </div>

      <div className="settings-subhead">Social media links <span className="optional">(optional)</span></div>
      <div className="form-group">
        <div className="form-row three">
          <div className="form-field">
            <label>Facebook</label>
            <input type="url" value={form.facebook} onChange={set('facebook')} placeholder="https://facebook.com/..." />
          </div>
          <div className="form-field">
            <label>Instagram</label>
            <input type="url" value={form.instagram} onChange={set('instagram')} placeholder="https://instagram.com/..." />
          </div>
          <div className="form-field">
            <label>LinkedIn</label>
            <input type="url" value={form.linkedin} onChange={set('linkedin')} placeholder="https://linkedin.com/..." />
          </div>
        </div>
      </div>

      {error && <div className="form-error">{error}</div>}

      <div className="settings-actions">
        <button type="submit" className="btn-primary">Save Company Details</button>
      </div>
    </form>
  );
};

/* ------------------------------------------------------------------ */
/* Tab 2: Admin account + change password                              */
/* ------------------------------------------------------------------ */
const AccountTab = ({ value, onSave, onPasswordChanged }) => {
  const [profile, setProfile] = useState(value);
  const [profileError, setProfileError] = useState('');

  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  const [pwError, setPwError] = useState('');
  const [showPw, setShowPw] = useState(false);

  const handleProfile = (e) => {
    e.preventDefault();
    const name = profile.name.trim();
    const email = profile.email.trim();
    if (!name) return setProfileError('Please enter your name.');
    if (!isEmail(email)) return setProfileError('Please enter a valid email address.');
    setProfileError('');
    setProfile({ name, email });
    onSave({ name, email });
  };

  const handlePassword = (e) => {
    e.preventDefault();
    if (!pw.current) return setPwError('Enter your current password.');
    if (pw.next.length < 8) return setPwError('The new password must be at least 8 characters long.');
    if (pw.next === pw.current) return setPwError('The new password must be different from the current one.');
    if (pw.next !== pw.confirm) return setPwError('The new password and its confirmation do not match.');
    // TODO (backend): send current + new password to Laravel, which checks the current one
    setPwError('');
    setPw({ current: '', next: '', confirm: '' });
    onPasswordChanged();
  };

  const pwType = showPw ? 'text' : 'password';

  return (
    <div className="settings-panel">
      <form className="card settings-section" onSubmit={handleProfile}>
        <div className="settings-head">
          <h2>Admin Account</h2>
          <p>The name and email you use to sign in to this panel.</p>
        </div>

        <div className="form-group">
          <div className="form-row">
            <div className="form-field">
              <label>Name</label>
              <input
                type="text"
                required
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </div>
            <div className="form-field">
              <label>Email (login)</label>
              <input
                type="email"
                required
                autoComplete="username"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              />
            </div>
          </div>
        </div>

        {profileError && <div className="form-error">{profileError}</div>}

        <div className="settings-actions">
          <button type="submit" className="btn-primary">Save Account</button>
        </div>
      </form>

      <form className="card settings-section" onSubmit={handlePassword}>
        <div className="settings-head">
          <h2>Change Password</h2>
          <p>Use at least 8 characters. Avoid passwords you use on other sites.</p>
        </div>

        <div className="form-group">
          <div className="form-field">
            <label>Current Password</label>
            <input
              type={pwType}
              autoComplete="current-password"
              value={pw.current}
              onChange={(e) => setPw({ ...pw, current: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>New Password</label>
              <input
                type={pwType}
                autoComplete="new-password"
                value={pw.next}
                onChange={(e) => setPw({ ...pw, next: e.target.value })}
              />
            </div>
            <div className="form-field">
              <label>Confirm New Password</label>
              <input
                type={pwType}
                autoComplete="new-password"
                value={pw.confirm}
                onChange={(e) => setPw({ ...pw, confirm: e.target.value })}
              />
            </div>
          </div>

          <label className="checkbox-row">
            <input type="checkbox" checked={showPw} onChange={(e) => setShowPw(e.target.checked)} />
            Show passwords
          </label>
        </div>

        {pwError && <div className="form-error">{pwError}</div>}

        <div className="settings-actions">
          <button type="submit" className="btn-primary">Update Password</button>
        </div>
      </form>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Tab 3: Payment stages used by the progress-based demand letters     */
/* ------------------------------------------------------------------ */
const StagesTab = ({ value, onSave }) => {
  const nextId = useRef(value.length + 1);
  const [rows, setRows] = useState(
    value.map((s, i) => ({ id: i + 1, name: s.name, percent: String(s.percent) }))
  );

  const total = rows.reduce((sum, r) => sum + (Number(r.percent) || 0), 0);

  // Returns the first problem found, or '' when everything is valid
  const findProblem = () => {
    const names = rows.map((r) => r.name.trim().toLowerCase());
    if (names.some((n) => !n)) return 'Every stage needs a name.';
    if (new Set(names).size !== names.length) return 'Stage names must be different from each other.';
    if (names.includes('not started')) return '"Not Started" is added automatically - use a different name.';
    if (rows.some((r) => r.percent === '' || Number(r.percent) < 0 || Number(r.percent) > 100)) {
      return 'Each percentage must be between 0 and 100.';
    }
    if (total !== 100) return `The percentages must add up to exactly 100% (currently ${total}%).`;
    return '';
  };

  const problem = findProblem();

  const update = (id, key, val) =>
    setRows(rows.map((r) => (r.id === id ? { ...r, [key]: val } : r)));

  const addRow = () => {
    nextId.current += 1;
    setRows([...rows, { id: nextId.current, name: '', percent: '0' }]);
  };

  const removeRow = (id) => setRows(rows.filter((r) => r.id !== id));

  const move = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= rows.length) return;
    const copy = [...rows];
    [copy[index], copy[target]] = [copy[target], copy[index]];
    setRows(copy);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (problem) return;
    onSave(rows.map((r) => ({ name: r.name.trim(), percent: Number(r.percent) })));
  };

  let running = 0;

  return (
    <form className="card settings-section" onSubmit={handleSubmit}>
      <div className="settings-head">
        <h2>Payment Stages</h2>
        <p>
          When a project moves to a new stage, the demand letter asks the client for that stage's
          percentage of the contract value. Keep the stages in the order the work happens.
        </p>
      </div>

      <div className="table-scroll">
        <table className="settings-table">
          <thead>
            <tr>
              <th style={{ width: 40 }}>#</th>
              <th>Stage name</th>
              <th style={{ width: 120 }}>Payment %</th>
              <th style={{ width: 110 }}>Progress after</th>
              <th style={{ width: 150 }}>Example (₹50 lakh)</th>
              <th style={{ width: 120, textAlign: 'right' }}>Order / remove</th>
            </tr>
          </thead>
          <tbody>
            <tr className="fixed-row">
              <td>-</td>
              <td>Not Started <span className="optional">(added automatically)</span></td>
              <td>0%</td>
              <td>0%</td>
              <td>-</td>
              <td></td>
            </tr>

            {rows.map((row, index) => {
              running += Number(row.percent) || 0;
              const amount = (EXAMPLE_CONTRACT * (Number(row.percent) || 0)) / 100;
              return (
                <tr key={row.id}>
                  <td>{index + 1}</td>
                  <td>
                    <input
                      type="text"
                      value={row.name}
                      aria-label={`Name of stage ${index + 1}`}
                      onChange={(e) => update(row.id, 'name', e.target.value)}
                      placeholder="e.g. Foundation"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      value={row.percent}
                      aria-label={`Payment percentage for stage ${index + 1}`}
                      onChange={(e) => update(row.id, 'percent', e.target.value)}
                    />
                  </td>
                  <td>{running}%</td>
                  <td>{formatINR(amount)}</td>
                  <td>
                    <div className="row-tools">
                      <button type="button" className="icon-btn" title="Move up" aria-label="Move stage up"
                        onClick={() => move(index, -1)} disabled={index === 0}>↑</button>
                      <button type="button" className="icon-btn" title="Move down" aria-label="Move stage down"
                        onClick={() => move(index, 1)} disabled={index === rows.length - 1}>↓</button>
                      <button type="button" className="icon-btn danger" title="Remove stage" aria-label="Remove stage"
                        onClick={() => removeRow(row.id)} disabled={rows.length <= 1}>✕</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="settings-footer-row">
        <button type="button" className="btn-secondary" onClick={addRow}>+ Add stage</button>
        <span className={`total-pill ${total === 100 ? 'ok' : 'bad'}`}>Total: {total}%</span>
      </div>

      {problem && <div className="form-error">{problem}</div>}

      <div className="settings-actions">
        <button type="submit" className="btn-primary" disabled={!!problem}>Save Payment Stages</button>
      </div>
    </form>
  );
};

/* ------------------------------------------------------------------ */
/* Tab 4: Rates and location factors used by the Cost Estimator        */
/* ------------------------------------------------------------------ */
const RatesTab = ({ rates, locations, onSave }) => {
  const nextId = useRef(locations.length + 1);

  const [rateDraft, setRateDraft] = useState(
    Object.fromEntries(
      PROJECT_TYPES.map((t) => [t, Object.fromEntries(QUALITIES.map((q) => [q, String(rates[t][q])]))])
    )
  );
  const [locDraft, setLocDraft] = useState(
    locations.map((l, i) => ({ id: i + 1, name: l.name, factor: String(l.factor) }))
  );
  const [error, setError] = useState('');

  const setRate = (type, quality, val) =>
    setRateDraft({ ...rateDraft, [type]: { ...rateDraft[type], [quality]: val } });

  const updateLoc = (id, key, val) =>
    setLocDraft(locDraft.map((l) => (l.id === id ? { ...l, [key]: val } : l)));

  const addLoc = () => {
    nextId.current += 1;
    setLocDraft([...locDraft, { id: nextId.current, name: '', factor: '1' }]);
  };

  const removeLoc = (id) => setLocDraft(locDraft.filter((l) => l.id !== id));

  const handleSubmit = (e) => {
    e.preventDefault();

    for (const type of PROJECT_TYPES) {
      for (const quality of QUALITIES) {
        const n = Number(rateDraft[type][quality]);
        if (!(n > 0)) return setError(`Enter a rate above 0 for ${type} - ${quality}.`);
      }
    }

    if (locDraft.length === 0) return setError('Add at least one location.');
    const names = locDraft.map((l) => l.name.trim().toLowerCase());
    if (names.some((n) => !n)) return setError('Every location needs a name.');
    if (new Set(names).size !== names.length) return setError('Location names must be different from each other.');
    for (const l of locDraft) {
      const f = Number(l.factor);
      if (!(f >= 0.5 && f <= 3)) return setError(`The factor for ${l.name.trim()} must be between 0.5 and 3.`);
    }

    setError('');
    onSave(
      Object.fromEntries(
        PROJECT_TYPES.map((t) => [t, Object.fromEntries(QUALITIES.map((q) => [q, Number(rateDraft[t][q])]))])
      ),
      locDraft.map((l) => ({ name: l.name.trim(), factor: Number(l.factor) }))
    );
  };

  return (
    <form className="settings-panel" onSubmit={handleSubmit}>
      <div className="card settings-section">
        <div className="settings-head">
          <h2>Construction Rates (₹ per sq ft)</h2>
          <p>
            The website's Cost Estimator uses these rates. Suggested formula: plot area x floors x
            rate x location factor.
          </p>
        </div>

        <div className="table-scroll">
          <table className="settings-table">
            <thead>
              <tr>
                <th>Project type</th>
                {QUALITIES.map((q) => <th key={q}>{q}</th>)}
              </tr>
            </thead>
            <tbody>
              {PROJECT_TYPES.map((type) => (
                <tr key={type}>
                  <td className="row-label">{type}</td>
                  {QUALITIES.map((quality) => (
                    <td key={quality}>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={rateDraft[type][quality]}
                        aria-label={`${type} ${quality} rate per square foot`}
                        onChange={(e) => setRate(type, quality, e.target.value)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card settings-section">
        <div className="settings-head">
          <h2>Location Factors</h2>
          <p>
            Costs differ by area. 1.00 means the base rate; 1.15 adds 15%, 0.95 gives 5% off.
            These are the locations a visitor can pick in the estimator.
          </p>
        </div>

        <div className="table-scroll">
          <table className="settings-table">
            <thead>
              <tr>
                <th>Location</th>
                <th style={{ width: 140 }}>Factor</th>
                <th style={{ width: 70, textAlign: 'right' }}>Remove</th>
              </tr>
            </thead>
            <tbody>
              {locDraft.map((loc) => (
                <tr key={loc.id}>
                  <td>
                    <input
                      type="text"
                      value={loc.name}
                      aria-label="Location name"
                      onChange={(e) => updateLoc(loc.id, 'name', e.target.value)}
                      placeholder="e.g. Thane"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min="0.5"
                      max="3"
                      step="0.01"
                      value={loc.factor}
                      aria-label={`Factor for ${loc.name || 'location'}`}
                      onChange={(e) => updateLoc(loc.id, 'factor', e.target.value)}
                    />
                  </td>
                  <td>
                    <div className="row-tools">
                      <button type="button" className="icon-btn danger" title="Remove location"
                        aria-label="Remove location" onClick={() => removeLoc(loc.id)}>✕</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="settings-footer-row">
          <button type="button" className="btn-secondary" onClick={addLoc}>+ Add location</button>
        </div>

        {error && <div className="form-error">{error}</div>}

        <div className="settings-actions">
          <button type="submit" className="btn-primary">Save Rates</button>
        </div>
      </div>
    </form>
  );
};

/* ------------------------------------------------------------------ */
/* The Settings page                                                   */
/* ------------------------------------------------------------------ */
const Settings = () => {
  const [tab, setTab] = useState('company');
  const [toast, setToast] = useState('');
  const timerRef = useRef(null);

  // Sample data - replaced by the Laravel API later
  const [company, setCompany] = useState({
    name: 'Vighnaharta Construction',
    tagline: 'Building trust, one project at a time.',
    email: 'info@vighnaharta.example',
    phone: '+91 98765 43210',
    address: 'Vasai West, Maharashtra',
    hours: 'Mon - Sat, 9:00 AM - 6:00 PM',
    facebook: '',
    instagram: '',
    linkedin: '',
  });
  const [account, setAccount] = useState({ name: 'Admin', email: 'admin@vighnaharta.com' });
  const [stages, setStages] = useState([
    { name: 'Foundation', percent: 20 },
    { name: 'Structure', percent: 30 },
    { name: 'Main Work', percent: 20 },
    { name: 'Finishing', percent: 20 },
    { name: 'Handover', percent: 10 },
  ]);
  const [rates, setRates] = useState({
    Residential: { Basic: 1800, Standard: 2200, Premium: 2800 },
    Commercial: { Basic: 2200, Standard: 2700, Premium: 3400 },
    Renovation: { Basic: 900, Standard: 1300, Premium: 1800 },
  });
  const [locations, setLocations] = useState([
    { name: 'Vasai-Virar', factor: 1 },
    { name: 'Mumbai', factor: 1.25 },
    { name: 'Thane', factor: 1.15 },
    { name: 'Nashik', factor: 0.95 },
  ]);

  const showToast = (message) => {
    setToast(message);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setToast(''), 3000);
  };

  useEffect(() => () => clearTimeout(timerRef.current), []);

  return (
    <div className="admin-page">

      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p>Manage your company details, admin account, billing stages and estimator rates.</p>
        </div>
      </div>

      <div className="settings-tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            className={`settings-tab ${tab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'company' && (
        <CompanyTab
          value={company}
          onSave={(data) => { setCompany(data); showToast('Company details saved.'); }}
        />
      )}

      {tab === 'account' && (
        <AccountTab
          value={account}
          onSave={(data) => { setAccount(data); showToast('Account details saved.'); }}
          onPasswordChanged={() => showToast('Password updated.')}
        />
      )}

      {tab === 'stages' && (
        <StagesTab
          value={stages}
          onSave={(data) => { setStages(data); showToast('Payment stages saved.'); }}
        />
      )}

      {tab === 'rates' && (
        <RatesTab
          rates={rates}
          locations={locations}
          onSave={(newRates, newLocations) => {
            setRates(newRates);
            setLocations(newLocations);
            showToast('Estimator rates saved.');
          }}
        />
      )}

      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
};

export default Settings;