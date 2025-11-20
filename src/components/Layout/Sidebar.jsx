import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    TrendingUp,
    CheckSquare,
    Activity,
    BarChart3,
    Moon,
    Sun,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [theme, setTheme] = useState('light');

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    const navItems = [
        { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/contacts', icon: Users, label: 'Contactos' },
        { to: '/deals', icon: TrendingUp, label: 'Deals' },
        { to: '/tasks', icon: CheckSquare, label: 'Tareas' },
        { to: '/activities', icon: Activity, label: 'Actividades' },
        { to: '/reports', icon: BarChart3, label: 'Reportes' }
    ];

    return (
        <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                {!collapsed && (
                    <div className="sidebar-logo">
                        <div className="logo-icon">
                            <TrendingUp size={24} />
                        </div>
                        <h2 className="logo-text">CRM Pro</h2>
                    </div>
                )}
                <button
                    className="sidebar-toggle"
                    onClick={() => setCollapsed(!collapsed)}
                    title={collapsed ? 'Expandir' : 'Contraer'}
                >
                    {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
            </div>

            <nav className="sidebar-nav">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            `nav-item ${isActive ? 'active' : ''}`
                        }
                        title={collapsed ? item.label : ''}
                    >
                        <item.icon size={20} className="nav-icon" />
                        {!collapsed && <span className="nav-label">{item.label}</span>}
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <button
                    className="theme-toggle"
                    onClick={toggleTheme}
                    title={theme === 'light' ? 'Modo oscuro' : 'Modo claro'}
                >
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    {!collapsed && (
                        <span>{theme === 'light' ? 'Modo Oscuro' : 'Modo Claro'}</span>
                    )}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
