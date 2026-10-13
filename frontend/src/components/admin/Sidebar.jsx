import React from 'react';
import {
  LayoutDashboard,
  Wrench,
  FolderKanban,
  ImageIcon,
  FileText,
  MessageSquare,
  Mail,
  FileQuestion,
  Settings,
  LogOut,
} from './Icons';

import logo from "../../assets/images/Company_logo.png";

const Sidebar = ({ activeTab, setActiveTab, onLogout }) => {
  const menuSections = [
  {
    title: "MAIN",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
      },
    ],
  },

  {
    title: "MANAGEMENT",
    items: [
      {
        id: "services",
        label: "Services",
        icon: Wrench,
      },
      {
        id: "projects",
        label: "Projects",
        icon: FolderKanban,
      },
      {
        id: "gallery",
        label: "Gallery",
        icon: ImageIcon,
      },
    ],
  },

  {
    title: "COMMUNICATION",
    items: [
      {
        id: "contact",
        label: "Contact Messages",
        icon: Mail,
      },
      {
        id: "quotes",
        label: "Quote Requests",
        icon: FileQuestion,
      },
    ],
  },

  {
    title: "CONTENT",
    items: [
      {
        id: "blog",
        label: "Blog",
        icon: FileText,
      },
      {
        id: "testimonials",
        label: "Testimonials",
        icon: MessageSquare,
      },
    ],
  },
];

  return (
    <aside className="sidebar">
      <div>
        <div className="sidebar-brand">
          <img 
              src={logo} 
              alt="logo" 
              className="sidebar-logo" 
          />
          <div className="brand-text">
            <h2>Vighnaharta</h2>
            <span>Construction</span>
            <small>Admin Panel</small>
          </div>
          </div>

        <nav className="sidebar-nav">
  {menuSections.map((section) => (
    <div key={section.title} className="sidebar-section">

      <p className="sidebar-section-title">
        {section.title}
      </p>

      {section.items.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`sidebar-item ${
              isActive ? "active" : ""
            }`}
          >
            <Icon />
            {item.label}
          </button>
        );
      })}
    </div>
  ))}
</nav>
      </div>

      <div className="sidebar-footer">
        <button
          onClick={() => setActiveTab("settings")}
          className={`sidebar-footer-item ${activeTab === "settings" ? "active" : ""}`}
        >
          <Settings /> Settings
        </button>
        <button className="sidebar-footer-item logout" onClick={onLogout}>
          <LogOut /> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;