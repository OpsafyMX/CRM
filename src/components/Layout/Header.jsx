import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Bell, Search, LogOut, User, Settings } from 'lucide-react';
import Avatar from '../Common/Avatar';
import './Header.css';

const Header = ({ title }) => {
    const { user, logout } = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);

    return (
        <header className="header">
            <div className="header-left">
                <h1 className="header-title">{title}</h1>
            </div>

            <div className="header-right">
                <div className="header-search">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Buscar en CRM..."
                        className="header-search-input"
                    />
                </div>

                <button className="header-icon-btn" title="Notificaciones">
                    <Bell size={20} />
                    <span className="notification-badge">3</span>
                </button>

                <div className="user-menu-container">
                    <button
                        className="user-menu-trigger"
                        onClick={() => setShowUserMenu(!showUserMenu)}
                    >
                        <Avatar name={user?.name || 'Usuario'} src={user?.avatar} size="sm" />
                        <span className="user-name">{user?.name || 'Usuario'}</span>
                    </button>

                    {showUserMenu && (
                        <div className="user-menu-dropdown">
                            <div className="user-menu-header">
                                <Avatar name={user?.name || 'Usuario'} src={user?.avatar} size="md" />
                                <div>
                                    <div className="user-menu-name">{user?.name}</div>
                                    <div className="user-menu-email">{user?.email}</div>
                                </div>
                            </div>
                            <div className="user-menu-divider" />
                            <button className="user-menu-item">
                                <User size={16} />
                                Perfil
                            </button>
                            <button className="user-menu-item">
                                <Settings size={16} />
                                Configuración
                            </button>
                            <div className="user-menu-divider" />
                            <button className="user-menu-item danger" onClick={logout}>
                                <LogOut size={16} />
                                Cerrar Sesión
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
