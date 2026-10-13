import React, { useRef, useState } from 'react';
import { Plus, Edit2, Trash2, Search } from '../../components/admin/Icons';
import './testimonials.css';

const STATUSES = ['Published', 'Hidden'];
const MAX_SIZE_MB = 2;
const MESSAGE_MAX = 300;

const initialsOf = (name) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

const StarIcon = ({ filled }) => (
  <svg viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

// Read-only stars shown on the cards
const Stars = ({ rating }) => (
  <div className="stars" role="img" aria-label={`${rating} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((n) => (
      <StarIcon key={n} filled={n <= rating} />
    ))}
  </div>
);

const emptyForm = {
  clientName: '',
  role: '',
  message: '',
  rating: 5,
  status: 'Published',
};

const Testimonials = () => {
  // Sample data - replaced by the Laravel API later (photo: null shows the client's initials)
  const [items, setItems] = useState([
    {
      id: 1,
      clientName: 'Rajesh Patil',
      role: 'Homeowner, Vasai',
      message:
        'Vighnaharta built our two-floor house on time and within budget. The stage-wise payment letters made everything transparent. Highly recommended!',
      rating: 5,
      photo: null,
      status: 'Published',
      createdAt: '2026-09-15',
    },
    {
      id: 2,
      clientName: 'Orbit Realty Pvt. Ltd.',
      role: 'Commercial client, Mumbai',
      message:
        'They delivered our seven-storey office building ahead of schedule. Quality of work and communication were excellent throughout.',
      rating: 5,
      photo: null,
      status: 'Published',
      createdAt: '2026-08-28',
    },
    {
      id: 3,
      clientName: 'Meera Kulkarni',
      role: 'Homeowner, Nashik',
      message: 'Good team and honest pricing. The site was kept clean and we always knew what stage the work was at.',
      rating: 4,
      photo: null,
      status: 'Published',
      createdAt: '2026-08-05',
    },
    {
      id: 4,
      clientName: 'Suresh Jadhav',
      role: 'Contractor, Palghar',
      message: 'Reliable partner on the highway widening work. Machinery and manpower were always ready.',
      rating: 4,
      photo: null,
      status: 'Hidden',
      createdAt: '2026-07-19',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [photoFile, setPhotoFile] = useState(null); // new file picked in the modal (sent to Laravel later)
  const [preview, setPreview] = useState(null);     // what the avatar shows in the modal
  const [formError, setFormError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeStatus, setActiveStatus] = useState('All');
  const fileInputRef = useRef(null);

  // Free a temporary preview URL that was never saved to a testimonial
  const discardTempPreview = () => {
    if (preview && preview !== editingItem?.photo) URL.revokeObjectURL(preview);
  };

  const openModal = (item = null) => {
    setFormError('');
    setPhotoFile(null);
    if (item) {
      setEditingItem(item);
      setFormData({
        clientName: item.clientName,
        role: item.role,
        message: item.message,
        rating: item.rating,
        status: item.status,
      });
      setPreview(item.photo);
    } else {
      setEditingItem(null);
      setFormData(emptyForm);
      setPreview(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    discardTempPreview();
    setPhotoFile(null);
    setPreview(null);
    setIsModalOpen(false);
  };

  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setFormError('Please choose an image file (JPG, PNG or WEBP).');
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setFormError(`Photo must be smaller than ${MAX_SIZE_MB} MB.`);
      return;
    }
    discardTempPreview();
    setFormError('');
    setPhotoFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const removePhoto = () => {
    discardTempPreview();
    setPhotoFile(null);
    setPreview(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const clientName = formData.clientName.trim();
    const message = formData.message.trim();

    if (!clientName) {
      setFormError("Please enter the client's name.");
      return;
    }
    if (!message) {
      setFormError('Please enter the testimonial message.');
      return;
    }

    const cleaned = {
      ...formData,
      clientName,
      role: formData.role.trim(),
      message,
      photo: preview,
    };

    if (editingItem) {
      // the old photo was replaced or removed
      if (editingItem.photo && editingItem.photo !== preview && editingItem.photo.startsWith('blob:')) {
        URL.revokeObjectURL(editingItem.photo);
      }
      setItems(items.map((t) => (t.id === editingItem.id ? { ...t, ...cleaned } : t)));
    } else {
      setItems([{ id: Date.now(), createdAt: new Date().toISOString().slice(0, 10), ...cleaned }, ...items]);
    }

    // the preview URL now belongs to the testimonial, so don't revoke it
    setPhotoFile(null);
    setPreview(null);
    setIsModalOpen(false);
  };

  const handleDelete = (item) => {
    if (window.confirm(`Delete the testimonial from ${item.clientName}? This cannot be undone.`)) {
      if (item.photo?.startsWith('blob:')) URL.revokeObjectURL(item.photo);
      setItems(items.filter((t) => t.id !== item.id));
    }
  };

  // Quick show/hide from the card, no need to open the form
  const toggleStatus = (item) =>
    setItems(items.map((t) =>
      t.id === item.id ? { ...t, status: t.status === 'Published' ? 'Hidden' : 'Published' } : t
    ));

  const filteredItems = items
    .filter((t) => {
      const q = searchTerm.toLowerCase();
      const matchesStatus = activeStatus === 'All' || t.status === activeStatus;
      const matchesSearch =
        t.clientName.toLowerCase().includes(q) ||
        t.role.toLowerCase().includes(q) ||
        t.message.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt)); // newest first

  const countFor = (status) =>
    status === 'All' ? items.length : items.filter((t) => t.status === status).length;

  const averageRating = items.length
    ? (items.reduce((sum, t) => sum + t.rating, 0) / items.length).toFixed(1)
    : '—';

  return (
    <div className="admin-page">

      <div className="page-header">
        <div>
          <h1>Manage Testimonials</h1>
          <p>Add what clients say about your work. Only published ones appear on the website.</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary">
          <Plus /> Add Testimonial
        </button>
      </div>

      <div className="toolbar">
        <div className="toolbar-search">
          <Search />
          <input
            type="text"
            placeholder="Search by client or message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <span className="toolbar-count">
          Average rating: <strong>{averageRating}</strong> / 5 from {items.length}
        </span>
      </div>

      <div className="testimonial-filters">
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

      <div className="testimonial-grid">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div className={`testimonial-card ${item.status === 'Hidden' ? 'is-hidden' : ''}`} key={item.id}>
              <div className="testimonial-top">
                <div className="avatar">
                  {item.photo ? <img src={item.photo} alt="" /> : <span>{initialsOf(item.clientName)}</span>}
                </div>
                <div className="testimonial-who">
                  <p className="testimonial-name">{item.clientName}</p>
                  {item.role && <p className="testimonial-role">{item.role}</p>}
                </div>
                <div className="testimonial-actions">
                  <button
                    className="t-action edit"
                    title="Edit"
                    aria-label={`Edit testimonial from ${item.clientName}`}
                    onClick={() => openModal(item)}
                  >
                    <Edit2 />
                  </button>
                  <button
                    className="t-action delete"
                    title="Delete"
                    aria-label={`Delete testimonial from ${item.clientName}`}
                    onClick={() => handleDelete(item)}
                  >
                    <Trash2 />
                  </button>
                </div>
              </div>

              <Stars rating={item.rating} />
              <p className="testimonial-message">{item.message}</p>

              <div className="testimonial-footer">
                <span className={`t-status ${item.status.toLowerCase()}`}>{item.status}</span>
                <span className="testimonial-date">{formatDate(item.createdAt)}</span>
                <button type="button" className="t-toggle" onClick={() => toggleStatus(item)}>
                  {item.status === 'Published' ? 'Hide' : 'Publish'}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="testimonial-empty">No testimonials found.</div>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-box modal-lg">
            <h2>{editingItem ? 'Edit Testimonial' : 'Add Testimonial'}</h2>

            <form onSubmit={handleSubmit} className="form-group">
              <div className="form-field">
                <label>Client Photo <span className="optional">(optional)</span></label>
                <div className="photo-picker">
                  <div className="avatar avatar-lg">
                    {preview ? (
                      <img src={preview} alt="Client preview" />
                    ) : (
                      <span>{initialsOf(formData.clientName) || '?'}</span>
                    )}
                  </div>
                  <div className="photo-buttons">
                    <button type="button" className="btn-secondary" onClick={() => fileInputRef.current?.click()}>
                      {preview ? 'Change photo' : 'Upload photo'}
                    </button>
                    {preview && (
                      <button type="button" className="link-btn" onClick={removePhoto}>
                        Remove
                      </button>
                    )}
                    <small className="field-hint">JPG, PNG or WEBP, up to {MAX_SIZE_MB} MB. Without a photo, the initials are shown.</small>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="upload-input"
                  onChange={(e) => {
                    handleFile(e.target.files[0]);
                    e.target.value = ''; // lets you pick the same file again
                  }}
                />
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label>Client Name</label>
                  <input
                    type="text"
                    required
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    placeholder="e.g. Rajesh Patil"
                  />
                </div>
                <div className="form-field">
                  <label>Role / Location <span className="optional">(optional)</span></label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g. Homeowner, Vasai"
                  />
                </div>
              </div>

              <div className="form-field">
                <label>Rating</label>
                <div className="rating-input" role="radiogroup" aria-label="Rating">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      role="radio"
                      aria-checked={formData.rating === n}
                      aria-label={`${n} star${n > 1 ? 's' : ''}`}
                      className={`rating-star ${n <= formData.rating ? 'on' : ''}`}
                      onClick={() => setFormData({ ...formData, rating: n })}
                    >
                      <StarIcon filled={n <= formData.rating} />
                    </button>
                  ))}
                  <span className="rating-text">{formData.rating} / 5</span>
                </div>
              </div>

              <div className="form-field">
                <label>Testimonial</label>
                <textarea
                  rows="4"
                  required
                  maxLength={MESSAGE_MAX}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="What did the client say about working with you?"
                ></textarea>
                <small className="field-hint">{formData.message.length}/{MESSAGE_MAX} characters</small>
              </div>

              <div className="form-field">
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {formError && <div className="form-error">{formError}</div>}

              <div className="modal-actions">
                <button type="button" onClick={closeModal} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingItem ? 'Save Changes' : 'Add Testimonial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Testimonials;