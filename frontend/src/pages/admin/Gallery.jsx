import React, { useRef, useState } from 'react';
import { Plus, Edit2, Trash2, Search } from '../../components/admin/Icons';
import './gallery.css';

const CATEGORIES = ['Residential', 'Commercial', 'Government', 'Renovation'];
const MAX_SIZE_MB = 5;

const ImageIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="9" cy="9" r="2" />
    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
  </svg>
);

const UploadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const emptyForm = { caption: '', category: 'Residential' };

const Gallery = () => {
  // image: null shows a placeholder until a real photo is uploaded
  const [images, setImages] = useState([
    { id: 1, caption: 'Highway Bridge Construction', category: 'Government', image: null },
    { id: 2, caption: 'Luxury Villa Exterior', category: 'Residential', image: null },
    { id: 3, caption: 'Corporate Office Tower', category: 'Commercial', image: null },
    { id: 4, caption: 'Apartment Complex Foundation', category: 'Residential', image: null },
    { id: 5, caption: 'Asphalt Road Paving', category: 'Government', image: null },
    { id: 6, caption: 'Office Interior Renovation', category: 'Renovation', image: null },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null); // new file picked in the modal (this is what we send to Laravel later)
  const [preview, setPreview] = useState(null);     // what the upload box shows
  const [formError, setFormError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const fileInputRef = useRef(null);

  const openModal = (item = null) => {
    setFormError('');
    setImageFile(null);
    if (item) {
      setEditingImage(item);
      setFormData({ caption: item.caption, category: item.category });
      setPreview(item.image);
    } else {
      setEditingImage(null);
      setFormData(emptyForm);
      setPreview(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    // free the temporary preview if it was never saved
    if (imageFile && preview) URL.revokeObjectURL(preview);
    setImageFile(null);
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
      setFormError(`Image must be smaller than ${MAX_SIZE_MB} MB.`);
      return;
    }
    if (imageFile && preview) URL.revokeObjectURL(preview);
    setFormError('');
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const caption = formData.caption.trim();

    if (!caption) {
      setFormError('Please enter a caption.');
      return;
    }
    if (!editingImage && !imageFile) {
      setFormError('Please select an image to upload.');
      return;
    }

    if (editingImage) {
      if (imageFile && editingImage.image?.startsWith('blob:')) {
        URL.revokeObjectURL(editingImage.image); // old photo replaced
      }
      setImages(images.map((img) =>
        img.id === editingImage.id
          ? { ...img, caption, category: formData.category, image: preview }
          : img
      ));
    } else {
      // newest first, so the admin sees the upload straight away
      setImages([{ id: Date.now(), caption, category: formData.category, image: preview }, ...images]);
    }

    // the preview URL now belongs to the gallery item, so don't revoke it
    setImageFile(null);
    setPreview(null);
    setIsModalOpen(false);
  };

  const handleDelete = (item) => {
    if (window.confirm('Delete this image from the gallery?')) {
      if (item.image?.startsWith('blob:')) URL.revokeObjectURL(item.image);
      setImages(images.filter((img) => img.id !== item.id));
    }
  };

  const filteredImages = images.filter((img) => {
    const q = searchTerm.toLowerCase();
    const matchesCategory = activeCategory === 'All' || img.category === activeCategory;
    const matchesSearch =
      img.caption.toLowerCase().includes(q) || img.category.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const countFor = (cat) =>
    cat === 'All' ? images.length : images.filter((img) => img.category === cat).length;

  return (
    <div className="admin-page">

      <div className="page-header">
        <div>
          <h1>Manage Gallery</h1>
          <p>Upload and organise photos of your completed and ongoing work.</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary">
          <Plus /> Upload Image
        </button>
      </div>

      <div className="toolbar">
        <div className="toolbar-search">
          <Search />
          <input
            type="text"
            placeholder="Search gallery..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <span className="toolbar-count">
          Total Images: <strong>{images.length}</strong>
        </span>
      </div>

      <div className="gallery-filters">
        {['All', ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            type="button"
            className={`chip ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat} ({countFor(cat)})
          </button>
        ))}
      </div>

      <div className="gallery-grid">
        {filteredImages.length > 0 ? (
          filteredImages.map((item) => (
            <div className="gallery-card" key={item.id}>
              <div className="gallery-thumb">
                {item.image ? (
                  <img src={item.image} alt={item.caption} loading="lazy" />
                ) : (
                  <div className="gallery-placeholder"><ImageIcon /></div>
                )}
                <div className="gallery-actions">
                  <button
                    className="gallery-action edit"
                    title="Edit"
                    aria-label={`Edit ${item.caption}`}
                    onClick={() => openModal(item)}
                  >
                    <Edit2 />
                  </button>
                  <button
                    className="gallery-action delete"
                    title="Delete"
                    aria-label={`Delete ${item.caption}`}
                    onClick={() => handleDelete(item)}
                  >
                    <Trash2 />
                  </button>
                </div>
              </div>
              <div className="gallery-info">
                <p className="gallery-caption">{item.caption}</p>
                <span className="badge">{item.category}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="gallery-empty">No images found.</div>
        )}
      </div>

      {isModalOpen && (
        <div
          className="modal-overlay"
          onMouseDown={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div className="modal-box">
            <h2>{editingImage ? 'Edit Image' : 'Upload Image'}</h2>

            <form onSubmit={handleSubmit} className="form-group">
              <div className="form-field">
                <label>Image</label>
                <div
                  className="upload-zone"
                  role="button"
                  tabIndex={0}
                  onClick={() => fileInputRef.current?.click()}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      fileInputRef.current?.click();
                    }
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleFile(e.dataTransfer.files[0]);
                  }}
                >
                  {preview ? (
                    <>
                      <img src={preview} alt="Preview" className="upload-preview" />
                      <span>Click or drop to replace</span>
                    </>
                  ) : (
                    <>
                      <UploadIcon />
                      <strong>Click to upload or drag and drop</strong>
                      <span>JPG, PNG or WEBP, up to {MAX_SIZE_MB} MB</span>
                    </>
                  )}
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

              <div className="form-field">
                <label>Caption</label>
                <input
                  type="text"
                  required
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  placeholder="e.g. Highway Bridge Construction"
                />
              </div>

              <div className="form-field">
                <label>Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {formError && <div className="form-error">{formError}</div>}

              <div className="modal-actions">
                <button type="button" onClick={closeModal} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingImage ? 'Save Changes' : 'Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;