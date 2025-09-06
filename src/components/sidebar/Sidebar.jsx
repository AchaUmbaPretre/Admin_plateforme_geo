import React, { useState, useEffect } from "react";
import {
  HomeOutlined,
  DatabaseOutlined,
  CreditCardOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import "./sidebar.scss";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeKey, setActiveKey] = useState(location.pathname);

  const menuItems = [
    { key: "/", label: "Accueil", icon: <HomeOutlined /> },
    { key: "/donnees", label: "Données", icon: <DatabaseOutlined /> },
    { key: "/paiement", label: "Paiement", icon: <CreditCardOutlined /> },
    { key: "/utilisateurs", label: "Utilisateurs", icon: <UserOutlined /> },
    { key: "/logout", label: "Déconnexion", icon: <LogoutOutlined />, danger: true },
  ];

  useEffect(() => {
    setActiveKey(location.pathname);
  }, [location.pathname]);

  const handleClick = (item) => {
    if (item.key === "/logout") {
      localStorage.removeItem("token");
      navigate("/login");
    } else {
      setActiveKey(item.key);
      navigate(item.key);
    }
  };

  return (
    <aside className="sidebar">

      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <div
            key={item.key}
            className={`menu-item ${item.danger ? "danger" : ""} ${activeKey === item.key ? "active" : ""}`}
            onClick={() => handleClick(item)}
          >
            <span className="icon">{item.icon}</span>
            <span className="label">{item.label}</span>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
