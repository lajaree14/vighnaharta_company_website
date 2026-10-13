import React, { useState } from 'react';
import { Plus, Edit2, Trash2, CheckCircle, Search } from '../../components/admin/Icons';

const Service = () => {
  const [services, setServices] = useState([
    {
      id: 1,
      title: 'Government Road Infrastructure',
      category: 'Government',
      description: 'Highways, asphalt paving, bridge construction, and city road development.',
      status: 'Active',
    },
    {
      id: 2,
      title: 'Residential Construction',
      category: 'Residential',
      description: 'Custom homes, luxury villas, apartment complexes, and complete residential layouts.',
      status: 'Active',
    },
    {
      id: 3,
      title: 'Commercial Projects',
      category: 'Commercial',
      description: 'Office towers, shopping malls, industrial warehouses, and corporate spaces.',
      status: 'Active',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({ title: '', category: 'Residential', description: '', status: 'Active' });
  const [searchTerm, setSearchTerm] = useState('');

  const openModal = (service = null) => {
    if (service) {
      setEditingService(service);
      setFormData({ title: service.title, category: service.category, description: service.description, status: service.status });
    } else {
      setEditingService(null);
      setFormData({ title: '', category: 'Residential', description: '', status: 'Active' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingService) {
      setServices(services.map(s => s.id === editingService.id ? { ...s, ...formData } : s));
    } else {
      const newService = { id: Date.now(), ...formData };
      setServices([...services, newService]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      setServices(services.filter(s => s.id !== id));
    }
  };

  const filteredServices = services.filter(s =>
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-page">

      <div className="page-header">
        <div>
          <h1>Manage Services</h1>
          <p>Add, update, or remove company construction offerings.</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary">
          <Plus /> Add New Service
        </button>
      </div>

      <div className="toolbar">
        <div className="toolbar-search">
          <Search />
          <input
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <span className="toolbar-count">
          Total Services: <strong>{services.length}</strong>
        </span>
      </div>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Description</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredServices.length > 0 ? (
              filteredServices.map((service) => (
                <tr key={service.id}>
                  <td className="cell-title">{service.title}</td>
                  <td><span className="badge">{service.category}</span></td>
                  <td style={{ color: 'var(--slate-500)', maxWidth: 320, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {service.description}
                  </td>
                  <td>
                    <span className={`badge-status ${service.status === 'Inactive' ? 'inactive' : ''}`}>
                      <CheckCircle /> {service.status}
                    </span>
                  </td>
                  <td className="row-actions">
                    <button className="edit" onClick={() => openModal(service)}>
                      <Edit2 />
                    </button>
                    <button className="delete" onClick={() => handleDelete(service.id)}>
                      <Trash2 />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="empty-row">No services found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>{editingService ? 'Edit Service' : 'Add New Service'}</h2>

            <form onSubmit={handleSubmit} className="form-group">
              <div className="form-field">
                <label>Service Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Bridge & Highway Infrastructure"
                />
              </div>

              <div className="form-field">
                <label>Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="Government">Government Projects</option>
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Renovation">Renovation</option>
                </select>
              </div>

              <div className="form-field">
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="form-field">
                <label>Description</label>
                <textarea
                  rows="3"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Provide details about what this service offers..."
                ></textarea>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingService ? 'Save Changes' : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Service;