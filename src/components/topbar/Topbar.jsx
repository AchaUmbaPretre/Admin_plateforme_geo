import React, { useState } from "react";
import "./topbar.scss";
import iconPhoto from "../../assets/logo.jpeg";
import iconUser from "../../assets/user.png";
import {
  BellOutlined,
  DashOutlined,
  MailOutlined,
} from "@ant-design/icons";

const Topbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="topbar">
      {/* LEFT : Logo */}
      <div className="topbar-left">
        <img src={iconPhoto} alt="Logo" className="topbar-img" />
      </div>

      {/* RIGHT : Icons + User */}
      <div className="topbar-right">
        <button className="icon-btn" aria-label="Notifications">
          <BellOutlined />
        </button>

        <button className="icon-btn" aria-label="Messages">
          <MailOutlined />
        </button>

        <div className="topbar-user">
          <img src={iconUser} alt="Utilisateur" className="user-logo" />
          <div className="user-info">
            <span className="name">Acha</span>
            <span className="role">Admin</span>
          </div>
        </div>

        {/* Options / Logout */}
        <button className="icon-btn" aria-label="Options utilisateur">
          <DashOutlined />
        </button>

        {/* Hamburger mobile */}
        <button
          className={`hamburger ${menuOpen ? "open" : ""}`}
          aria-label="Menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="line" />
          <span className="line" />
          <span className="line" />
        </button>
      </div>
    </header>
  );
};

export default Topbar;
