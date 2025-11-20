import React from 'react';
import { useData } from '../contexts/DataContext';
import Layout from '../components/Layout/Layout';
import Card, { CardHeader, CardTitle, CardBody } from '../components/Common/Card';
import { Users, TrendingUp, CheckSquare, DollarSign, ArrowUp, ArrowDown } from 'lucide-react';
import ActivityFeed from '../components/Dashboard/ActivityFeed';
import SalesChart from '../components/Dashboard/SalesChart';
import './Dashboard.css';

const Dashboard = () => {
    const { contacts, deals, tasks, activities } = useData();

    // Calculate KPIs
    const totalContacts = contacts.length;
    const activeDeals = deals.filter(d => !['won', 'lost'].includes(d.stage)).length;
    const pendingTasks = tasks.filter(t => !t.completed).length;
    const totalRevenue = deals
        .filter(d => d.stage === 'won')
        .reduce((sum, d) => sum + (d.value || 0), 0);

    // Mock percentage changes (in a real app, calculate from historical data)
    const kpis = [
        {
            id: 'contacts',
            title: 'Total Contactos',
            value: totalContacts,
            change: 12.5,
            icon: Users,
            color: 'primary',
            trend: 'up'
        },
        {
            id: 'deals',
            title: 'Deals Activos',
            value: activeDeals,
            change: 8.2,
            icon: TrendingUp,
            color: 'secondary',
            trend: 'up'
        },
        {
            id: 'tasks',
            title: 'Tareas Pendientes',
            value: pendingTasks,
            change: -5.4,
            icon: CheckSquare,
            color: 'warning',
            trend: 'down'
        },
        {
            id: 'revenue',
            title: 'Revenue Total',
            value: `$${(totalRevenue / 1000).toFixed(1)}K`,
            change: 15.8,
            icon: DollarSign,
            color: 'success',
            trend: 'up'
        }
    ];

    return (
        <Layout title="Dashboard">
            <div className="dashboard-container">
                {/* KPI Cards */}
                <div className="kpi-grid">
                    {kpis.map(kpi => (
                        <Card key={kpi.id} className="kpi-card" glass>
                            <div className="kpi-header">
                                <div className={`kpi-icon kpi-icon-${kpi.color}`}>
                                    <kpi.icon size={24} />
                                </div>
                                <div className={`kpi-change ${kpi.trend}`}>
                                    {kpi.trend === 'up' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                                    {Math.abs(kpi.change)}%
                                </div>
                            </div>
                            <div className="kpi-content">
                                <div className="kpi-value">{kpi.value}</div>
                                <div className="kpi-title">{kpi.title}</div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Charts and Activity Feed */}
                <div className="dashboard-main">
                    <div className="dashboard-chart">
                        <Card>
                            <CardHeader>
                                <CardTitle>Ventas de los Últimos 6 Meses</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <SalesChart />
                            </CardBody>
                        </Card>
                    </div>

                    <div className="dashboard-activity">
                        <Card>
                            <CardHeader>
                                <CardTitle>Actividad Reciente</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <ActivityFeed activities={activities.slice(0, 10)} />
                            </CardBody>
                        </Card>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="quick-stats">
                    <Card>
                        <CardHeader>
                            <CardTitle>Resumen Rápido</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <div className="stat-list">
                                <div className="stat-item">
                                    <span className="stat-label">Conversión de Deals</span>
                                    <span className="stat-value">32%</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-label">Tareas Completadas</span>
                                    <span className="stat-value">{tasks.filter(t => t.completed).length}/{tasks.length}</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-label">Contactos Nuevos (mes)</span>
                                    <span className="stat-value">24</span>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
