import React, { useEffect, useState } from "react";
import "./style/admin.css";
import Sidebar from "./components/admin/Sidebar";
import Navbar from "./components/admin/Navbar";
import Dashboard from "./pages/admin/Dashboard";
import Service from "./pages/admin/Service";
import Gallery from "./pages/admin/Gallery"; 
import Projects from "./pages/admin/Projects";
import Contact from "./pages/admin/Contact";
import Quotes from "./pages/admin/Quotes";
import Blog from "./pages/admin/Blog";
import Testimonials from "./pages/admin/Testimonials";
import Settings from "./pages/admin/Settings";
import Login from "./pages/admin/Login";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  // TEMPORARY client-side login, until the Laravel backend exists (see Login.jsx).
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem("admin_logged_in") === "true"
  );

  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem("admin_logged_in", "true");
    } else {
      localStorage.removeItem("admin_logged_in");
    }
  }, [isLoggedIn]);

  const handleLogin = () => setIsLoggedIn(true);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      setIsLoggedIn(false);
      setActiveTab("dashboard");
    }
  };

  const renderPage = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "services":
        return <Service />;
      case "projects":
        return <Projects />;
      case "gallery":
        return <Gallery />;
      case "contact":
        return <Contact />;
      case "quotes":
        return <Quotes />;
      case "blog":
        return <Blog />;
      case "testimonials":
        return <Testimonials />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="admin-layout">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />
      <div className="admin-main">
        <Navbar />
        <main className="admin-content">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;// demo change
