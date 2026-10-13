import React, { useState } from 'react';
import { FolderKanban, Wrench, Mail, FileQuestion, Plus, Calculator, FileText, BarChart3 } from '../../components/admin/Icons';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const Dashboard = () => {
  const [stats] = useState({
    totalProjects: 35,
    activeServices: 8,
    quoteRequests: 12,
    pendingMessages: 5,
    projectStatus: { completed: 20, ongoing: 12, pending: 3 },
  });

  const pieData = [
    { name: 'Completed', value: stats.projectStatus.completed, color: '#10B981' },
    { name: 'Ongoing', value: stats.projectStatus.ongoing, color: '#3B82F6' },
    { name: 'Pending', value: stats.projectStatus.pending, color: '#F59E0B' },
  ];

  const totalStatus = pieData.reduce((sum, d) => sum + d.value, 0);

  const barData = [
    { month: 'Jan', estimates: 18 },
    { month: 'Feb', estimates: 28 },
    { month: 'Mar', estimates: 20 },
    { month: 'Apr', estimates: 12 },
    { month: 'May', estimates: 28 },
    { month: 'Jun', estimates: 22 },
    { month: 'Jul', estimates: 35 },
    { month: 'Aug', estimates: 34 },
    { month: 'Sep', estimates: 16 },
  ];

  return (
    <div className="admin-page">
      <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--slate-900)', margin: 0 }}>Overview</h1>

      {/* Top 4 Stat Cards */}
      <div className="stat-grid">
        <div className="stat-card primary">
          <div>
            <p className="stat-card-label">Total Projects</p>
            <h3 className="stat-card-value">{stats.totalProjects}</h3>
          </div>
          <FolderKanban />
        </div>

        <div className="stat-card">
          <div>
            <p className="stat-card-label">Active Services</p>
            <h3 className="stat-card-value">{stats.activeServices}</h3>
          </div>
          <div className="stat-icon-wrap blue">
            <Wrench />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <p className="stat-card-label">Quote Requests</p>
            <h3 className="stat-card-value">{stats.quoteRequests}</h3>
          </div>
          <div className="stat-icon-wrap amber">
            <FileQuestion />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <p className="stat-card-label">Pending Messages</p>
            <h3 className="stat-card-value">{stats.pendingMessages}</h3>
          </div>
          <div className="stat-icon-wrap emerald">
            <Mail />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="chart-grid">
        <div className="card">
          <h2>Project Status</h2>
          <div className="chart-box donut-box">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={4} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="donut-center">
              <strong>{totalStatus}</strong>
              <span>Projects</span>
            </div>
          </div>
          <div className="chart-legend">
            {pieData.map((d) => (
              <span key={d.name}>
                <span className="legend-dot" style={{ background: d.color }} />
                {d.name} ({d.value})
              </span>
            ))}
          </div>
        </div>

        <div className="card">
          <h2>Monthly Estimates Generated</h2>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tickLine={false} interval={0} tick={{ fontSize: 12 }} />
                <YAxis tickLine={false} allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="estimates" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 style={{ marginBottom: 16 }}>Quick Actions</h2>
        <div className="action-grid">
          <button className="action-btn blue">
            <Plus /> Add Project
          </button>
          <button className="action-btn emerald">
            <Calculator /> New Estimate
          </button>
          <button className="action-btn amber">
            <FileText /> Demand Letter
          </button>
          <button className="action-btn purple">
            <BarChart3 /> Update BOQ
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;