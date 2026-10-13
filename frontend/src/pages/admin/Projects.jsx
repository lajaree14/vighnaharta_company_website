import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search } from '../../components/admin/Icons';
import './projects.css';

const CATEGORIES = ['Government', 'Residential', 'Commercial', 'Renovation'];
const STATUSES = ['Pending', 'Ongoing', 'Completed'];

// Construction stages and the share of the contract value that is billed at each one.
// These are EXAMPLE values (they add up to 100%). Agree the final list with whoever
// builds the demand-letter feature, then move it to a shared file (e.g. constants/stages.js).
const STAGES = [
  { name: 'Not Started', percent: 0 },
  { name: 'Foundation', percent: 20 },
  { name: 'Structure', percent: 30 },
  { name: 'Main Work', percent: 20 },
  { name: 'Finishing', percent: 20 },
  { name: 'Handover', percent: 10 },
];

// Progress bar = total of the stage percentages up to and including this stage
const progressFor = (stageName) => {
  const index = STAGES.findIndex((s) => s.name === stageName);
  return STAGES.slice(0, index + 1).reduce((sum, s) => sum + s.percent, 0);
};

// Status follows the stage by default (the admin can still change it afterwards)
const statusForStage = (stageName) => {
  if (stageName === 'Not Started') return 'Pending';
  if (stageName === 'Handover') return 'Completed';
  return 'Ongoing';
};

const formatINR = (amount) =>
  amount ? `₹${Number(amount).toLocaleString('en-IN')}` : '—';

const emptyForm = {
  title: '',
  category: 'Residential',
  location: '',
  clientName: '',
  clientEmail: '',
  contractValue: '',
  stage: 'Not Started',
  status: 'Pending',
  startDate: '',
  endDate: '',
  description: '',
};

const Projects = () => {
  // Sample data - replaced by the Laravel API later
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: 'Highway Widening - Phase 2',
      category: 'Government',
      location: 'Palghar, Maharashtra',
      clientName: 'Public Works Department',
      clientEmail: 'pwd.office@example.com',
      contractValue: 25000000,
      stage: 'Main Work',
      status: 'Ongoing',
      startDate: '2026-01-10',
      endDate: '2026-12-30',
      description: 'Widening of a 12 km highway stretch with new asphalt surfacing and drainage.',
    },
    {
      id: 2,
      title: 'Sai Residency Apartments',
      category: 'Residential',
      location: 'Vasai West',
      clientName: 'Rajesh Patil',
      clientEmail: 'rajesh.patil@example.com',
      contractValue: 18000000,
      stage: 'Structure',
      status: 'Ongoing',
      startDate: '2026-03-01',
      endDate: '2027-02-28',
      description: 'Two-tower residential complex with 48 flats and podium parking.',
    },
    {
      id: 3,
      title: 'Orbit Business Park',
      category: 'Commercial',
      location: 'Andheri East, Mumbai',
      clientName: 'Orbit Realty Pvt. Ltd.',
      clientEmail: 'accounts@orbitrealty.example.com',
      contractValue: 42000000,
      stage: 'Handover',
      status: 'Completed',
      startDate: '2025-02-15',
      endDate: '2026-06-30',
      description: 'Seven-storey office building with two basement parking levels.',
    },
    {
      id: 4,
      title: 'Kulkarni Bungalow',
      category: 'Residential',
      location: 'Nashik',
      clientName: 'Meera Kulkarni',
      clientEmail: 'meera.k@example.com',
      contractValue: 6500000,
      stage: 'Not Started',
      status: 'Pending',
      startDate: '',
      endDate: '',
      description: 'Independent two-floor bungalow on a 2,400 sq ft plot.',
    },
    {
      id: 5,
      title: 'Municipal School Renovation',
      category: 'Renovation',
      location: 'Thane',
      clientName: 'Thane Municipal Corporation',
      clientEmail: 'tmc.works@example.com',
      contractValue: 3200000,
      stage: 'Finishing',
      status: 'Ongoing',
      startDate: '2026-06-01',
      endDate: '2026-10-31',
      description: 'Structural repairs, repainting and new flooring for a municipal school.',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeStatus, setActiveStatus] = useState('All');

  const openModal = (project = null) => {
    setFormError('');
    if (project) {
      setEditingProject(project);
      setFormData({ ...emptyForm, ...project, contractValue: project.contractValue || '' });
    } else {
      setEditingProject(null);
      setFormData(emptyForm);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleStageChange = (stage) => {
    setFormData({ ...formData, stage, status: statusForStage(stage) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const title = formData.title.trim();
    if (!title) {
      setFormError('Please enter a project title.');
      return;
    }
    if (formData.startDate && formData.endDate && formData.endDate < formData.startDate) {
      setFormError('The end date cannot be before the start date.');
      return;
    }

    const cleaned = {
      ...formData,
      title,
      location: formData.location.trim(),
      clientName: formData.clientName.trim(),
      clientEmail: formData.clientEmail.trim(),
      description: formData.description.trim(),
      contractValue: Number(formData.contractValue) || 0,
    };

    if (editingProject) {
      // TODO (backend): if the stage changed, this is where the demand letter gets generated and emailed
      setProjects(projects.map((p) => (p.id === editingProject.id ? { ...p, ...cleaned } : p)));
    } else {
      setProjects([{ id: Date.now(), ...cleaned }, ...projects]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (project) => {
    if (window.confirm(`Delete "${project.title}"? This cannot be undone.`)) {
      setProjects(projects.filter((p) => p.id !== project.id));
    }
  };

  const filteredProjects = projects.filter((p) => {
    const q = searchTerm.toLowerCase();
    const matchesStatus = activeStatus === 'All' || p.status === activeStatus;
    const matchesSearch =
      p.title.toLowerCase().includes(q) ||
      p.clientName.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const countFor = (status) =>
    status === 'All' ? projects.length : projects.filter((p) => p.status === status).length;

  // Shown under the Stage dropdown in the form
  const stageInfo = STAGES.find((s) => s.name === formData.stage);
  const demandAmount = Math.round(((Number(formData.contractValue) || 0) * stageInfo.percent) / 100);

  return (
    <div className="admin-page">

      <div className="page-header">
        <div>
          <h1>Manage Projects</h1>
          <p>Track construction projects, clients and stage-wise progress.</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary">
          <Plus /> Add New Project
        </button>
      </div>

      <div className="toolbar">
        <div className="toolbar-search">
          <Search />
          <input
            type="text"
            placeholder="Search by project, client or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <span className="toolbar-count">
          Total Projects: <strong>{projects.length}</strong>
        </span>
      </div>

      <div className="status-filters">
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
                <th>Project</th>
                <th>Client</th>
                <th>Category</th>
                <th>Progress</th>
                <th>Status</th>
                <th>Contract Value</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project) => {
                  const progress = progressFor(project.stage);
                  return (
                    <tr key={project.id}>
                      <td>
                        <div className="cell-title">{project.title}</div>
                        <div className="cell-sub">{project.location}</div>
                      </td>
                      <td>
                        <div>{project.clientName}</div>
                        <div className="cell-sub">{project.clientEmail}</div>
                      </td>
                      <td><span className="badge">{project.category}</span></td>
                      <td>
                        <div className="progress-cell">
                          <span className="progress-label">{project.stage}</span>
                          <div className="progress">
                            <div
                              className={`progress-fill ${progress === 100 ? 'done' : ''}`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <div className="cell-sub">{progress}% complete</div>
                        </div>
                      </td>
                      <td>
                        <span className={`status-pill ${project.status.toLowerCase()}`}>
                          {project.status}
                        </span>
                      </td>
                      <td className="cell-title">{formatINR(project.contractValue)}</td>
                      <td className="row-actions">
                        <button
                          className="edit"
                          title="Edit"
                          aria-label={`Edit ${project.title}`}
                          onClick={() => openModal(project)}
                        >
                          <Edit2 />
                        </button>
                        <button
                          className="delete"
                          title="Delete"
                          aria-label={`Delete ${project.title}`}
                          onClick={() => handleDelete(project)}
                        >
                          <Trash2 />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="empty-row">No projects found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-box modal-lg">
            <h2>{editingProject ? 'Edit Project' : 'Add New Project'}</h2>

            <form onSubmit={handleSubmit} className="form-group">
              <div className="form-field">
                <label>Project Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Sai Residency Apartments"
                />
              </div>

              <div className="form-row">
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
                  <label>Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Vasai West"
                  />
                </div>
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
                  <label>Client Email</label>
                  <input
                    type="email"
                    required
                    value={formData.clientEmail}
                    onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                    placeholder="Demand letters are sent here"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label>Contract Value (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={formData.contractValue}
                    onChange={(e) => setFormData({ ...formData, contractValue: e.target.value })}
                    placeholder="e.g. 2500000"
                  />
                </div>
                <div className="form-field">
                  <label>Construction Stage</label>
                  <select value={formData.stage} onChange={(e) => handleStageChange(e.target.value)}>
                    {STAGES.map((s) => (
                      <option key={s.name} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                  {stageInfo.percent > 0 && (
                    <small className="field-hint">
                      Payment due at this stage: {stageInfo.percent}%
                      {demandAmount > 0 && ` = ${formatINR(demandAmount)}`}
                    </small>
                  )}
                </div>
              </div>

              <div className="form-row three">
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
                <div className="form-field">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div className="form-field">
                  <label>Expected End</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-field">
                <label>Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Short summary of the work, size, special requirements..."
                ></textarea>
              </div>

              {formError && <div className="form-error">{formError}</div>}

              <div className="modal-actions">
                <button type="button" onClick={closeModal} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingProject ? 'Save Changes' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;