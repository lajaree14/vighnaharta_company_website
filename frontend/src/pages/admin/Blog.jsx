import React, { useRef, useState } from 'react';
import { Plus, Edit2, Trash2, Search } from '../../components/admin/Icons';
import './blog.css';

const CATEGORIES = ['Company News', 'Project Updates', 'Construction Tips', 'Industry Insights'];
const STATUSES = ['Published', 'Draft'];
const MAX_SIZE_MB = 5;
const EXCERPT_MAX = 160;

const slugify = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

const countWords = (text) => (text.trim() ? text.trim().split(/\s+/).length : 0);

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

const emptyForm = {
  title: '',
  category: 'Company News',
  author: 'Admin',
  excerpt: '',
  content: '',
  status: 'Draft',
};

const Blog = () => {
  // Sample data - replaced by the Laravel API later (image: null shows a placeholder)
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: '5 Things to Check Before You Start Building Your Home',
      category: 'Construction Tips',
      author: 'Admin',
      excerpt: 'From land documents to soil testing, here is a simple checklist to review before the first brick is laid.',
      content:
        'Building a home is one of the biggest investments you will make. Before construction begins, confirm the land title and approvals, get a soil test done, finalise your architectural drawings, agree on a detailed budget, and choose a contractor who provides stage-wise billing and clear timelines.',
      image: null,
      status: 'Published',
      createdAt: '2026-09-22',
    },
    {
      id: 2,
      title: 'Vighnaharta Construction Completes the Orbit Business Park',
      category: 'Project Updates',
      author: 'Admin',
      excerpt: 'Our seven-storey commercial complex in Andheri East has been handed over ahead of schedule.',
      content:
        'We are proud to announce the successful handover of the Orbit Business Park, a seven-storey office building with two basement parking levels. The project was completed ahead of schedule thanks to careful planning and a dedicated site team.',
      image: null,
      status: 'Published',
      createdAt: '2026-09-10',
    },
    {
      id: 3,
      title: 'How Monsoon Affects Road Construction and How We Plan for It',
      category: 'Industry Insights',
      author: 'Admin',
      excerpt: '',
      content:
        'Road construction in the monsoon needs careful drainage planning, material storage and work sequencing. Here is how our team schedules asphalt work around the rains.',
      image: null,
      status: 'Draft',
      createdAt: '2026-09-25',
    },
    {
      id: 4,
      title: 'Understanding Stage-Wise Payments in Construction',
      category: 'Construction Tips',
      author: 'Admin',
      excerpt: 'Why linking payments to construction stages protects both the builder and the client.',
      content:
        'Stage-wise payment means the client pays a fixed percentage as each construction stage is completed, such as foundation, structure, and finishing. This keeps the project transparent and the cash flow predictable for both sides.',
      image: null,
      status: 'Published',
      createdAt: '2026-08-30',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null); // new file picked in the modal (sent to Laravel later)
  const [preview, setPreview] = useState(null);     // what the upload box shows
  const [formError, setFormError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeStatus, setActiveStatus] = useState('All');
  const fileInputRef = useRef(null);

  // Free a temporary preview URL that was never saved to a post
  const discardTempPreview = () => {
    if (preview && preview !== editingPost?.image) URL.revokeObjectURL(preview);
  };

  const openModal = (post = null) => {
    setFormError('');
    setImageFile(null);
    if (post) {
      setEditingPost(post);
      setFormData({
        title: post.title,
        category: post.category,
        author: post.author,
        excerpt: post.excerpt,
        content: post.content,
        status: post.status,
      });
      setPreview(post.image);
    } else {
      setEditingPost(null);
      setFormData(emptyForm);
      setPreview(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    discardTempPreview();
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
    discardTempPreview();
    setFormError('');
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    discardTempPreview();
    setImageFile(null);
    setPreview(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const title = formData.title.trim();
    const content = formData.content.trim();

    if (!title) {
      setFormError('Please enter a post title.');
      return;
    }
    if (!content) {
      setFormError('Please write some content for the post.');
      return;
    }

    const cleaned = {
      ...formData,
      title,
      content,
      author: formData.author.trim() || 'Admin',
      excerpt: formData.excerpt.trim(),
      image: preview,
    };

    if (editingPost) {
      // the old photo was replaced or removed
      if (editingPost.image && editingPost.image !== preview && editingPost.image.startsWith('blob:')) {
        URL.revokeObjectURL(editingPost.image);
      }
      setPosts(posts.map((p) => (p.id === editingPost.id ? { ...p, ...cleaned } : p)));
    } else {
      setPosts([{ id: Date.now(), createdAt: new Date().toISOString().slice(0, 10), ...cleaned }, ...posts]);
    }

    // the preview URL now belongs to the post, so don't revoke it
    setImageFile(null);
    setPreview(null);
    setIsModalOpen(false);
  };

  const handleDelete = (post) => {
    if (window.confirm(`Delete "${post.title}"? This cannot be undone.`)) {
      if (post.image?.startsWith('blob:')) URL.revokeObjectURL(post.image);
      setPosts(posts.filter((p) => p.id !== post.id));
    }
  };

  const filteredPosts = posts
    .filter((p) => {
      const q = searchTerm.toLowerCase();
      const matchesStatus = activeStatus === 'All' || p.status === activeStatus;
      const matchesSearch =
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt)); // newest first

  const countFor = (status) =>
    status === 'All' ? posts.length : posts.filter((p) => p.status === status).length;

  const words = countWords(formData.content);
  const readMinutes = Math.max(1, Math.ceil(words / 200));
  const slug = slugify(formData.title);

  return (
    <div className="admin-page">

      <div className="page-header">
        <div>
          <h1>Manage Blog</h1>
          <p>Write and publish news, project updates and tips for your website visitors.</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary">
          <Plus /> New Post
        </button>
      </div>

      <div className="toolbar">
        <div className="toolbar-search">
          <Search />
          <input
            type="text"
            placeholder="Search by title, category or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <span className="toolbar-count">
          Total Posts: <strong>{posts.length}</strong>
        </span>
      </div>

      <div className="blog-filters">
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
                <th>Post</th>
                <th>Category</th>
                <th>Author</th>
                <th>Status</th>
                <th>Date</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <tr key={post.id}>
                    <td>
                      <div className="post-cell">
                        <div className="post-thumb">
                          {post.image ? (
                            <img src={post.image} alt="" loading="lazy" />
                          ) : (
                            <ImageIcon />
                          )}
                        </div>
                        <div className="post-text">
                          <div className="cell-title post-title">{post.title}</div>
                          <div className="cell-sub post-excerpt">
                            {post.excerpt || post.content}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td><span className="badge">{post.category}</span></td>
                    <td className="post-author">{post.author}</td>
                    <td>
                      <span className={`post-status ${post.status.toLowerCase()}`}>{post.status}</span>
                    </td>
                    <td className="post-date">{formatDate(post.createdAt)}</td>
                    <td className="row-actions">
                      <button
                        className="edit"
                        title="Edit"
                        aria-label={`Edit ${post.title}`}
                        onClick={() => openModal(post)}
                      >
                        <Edit2 />
                      </button>
                      <button
                        className="delete"
                        title="Delete"
                        aria-label={`Delete ${post.title}`}
                        onClick={() => handleDelete(post)}
                      >
                        <Trash2 />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="empty-row">No posts found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-box modal-lg">
            <h2>{editingPost ? 'Edit Post' : 'New Post'}</h2>

            <form onSubmit={handleSubmit} className="form-group">
              <div className="form-field">
                <label>Cover Image <span className="optional">(optional)</span></label>
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
                      <img src={preview} alt="Cover preview" className="upload-preview" />
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
                {preview && (
                  <button type="button" className="link-btn" onClick={removeImage}>
                    Remove image
                  </button>
                )}
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
                <label>Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. 5 Things to Check Before You Build"
                />
                {slug && <small className="field-hint">Web address: /blog/{slug}</small>}
              </div>

              <div className="form-row three">
                <div className="form-field">
                  <label>Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="form-field">
                  <label>Author</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="Admin"
                  />
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
              </div>

              <div className="form-field">
                <label>Short Summary <span className="optional">(shown on the blog list)</span></label>
                <textarea
                  rows="2"
                  maxLength={EXCERPT_MAX}
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="One or two sentences that make people want to read the post..."
                ></textarea>
                <small className="field-hint">{formData.excerpt.length}/{EXCERPT_MAX} characters</small>
              </div>

              <div className="form-field">
                <label>Content</label>
                <textarea
                  rows="8"
                  required
                  className="content-textarea"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write your post here. Leave a blank line between paragraphs."
                ></textarea>
                <small className="field-hint">
                  {words} {words === 1 ? 'word' : 'words'} · about {readMinutes} min read
                </small>
              </div>

              {formError && <div className="form-error">{formError}</div>}

              <div className="modal-actions">
                <button type="button" onClick={closeModal} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingPost
                    ? 'Save Changes'
                    : formData.status === 'Published'
                    ? 'Publish Post'
                    : 'Save Draft'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;