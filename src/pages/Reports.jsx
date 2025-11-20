import React from 'react';
import { useData } from '../contexts/DataContext';
import Layout from '../components/Layout/Layout';
import Card, { CardHeader, CardTitle, CardBody } from '../components/Common/Card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const Reports = () => {
    const { contacts, deals, tasks } = useData();

    // Deal stages distribution
    const stagesData = [
        { name: 'Lead', value: deals.filter(d => d.stage === 'lead').length },
        { name: 'Contactado', value: deals.filter(d => d.stage === 'contacted').length },
        { name: 'Propuesta', value: deals.filter(d => d.stage === 'proposal').length },
        { name: 'Negociación', value: deals.filter(d => d.stage === 'negotiation').length },
        { name: 'Ganado', value: deals.filter(d => d.stage === 'won').length },
        { name: 'Perdido', value: deals.filter(d => d.stage === 'lost').length }
    ].filter(item => item.value > 0);

    // Tasks by priority
    const tasksData = [
        { name: 'Alta', value: tasks.filter(t => t.priority === 'high').length },
        { name: 'Media', value: tasks.filter(t => t.priority === 'medium').length },
        { name: 'Baja', value: tasks.filter(t => t.priority === 'low').length }
    ];

    const COLORS = ['#3b82f6', '#a855f7', '#f59e0b', '#22c55e', '#ef4444', '#6b7280'];

    return (
        <Layout title="Reportes">
            <div className="grid grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Distribución de Deals por Etapa</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={stagesData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {stagesData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardBody>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Tareas por Prioridad</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={tasksData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill="#3b82f6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardBody>
                </Card>

                <Card className="col-span-2">
                    <CardHeader>
                        <CardTitle>Resumen General</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <div className="grid grid-cols-4 gap-4">
                            <div className="stat-box">
                                <div className="stat-value">{contacts.length}</div>
                                <div className="stat-label">Total Contactos</div>
                            </div>
                            <div className="stat-box">
                                <div className="stat-value">{deals.length}</div>
                                <div className="stat-label">Total Deals</div>
                            </div>
                            <div className="stat-box">
                                <div className="stat-value">{tasks.length}</div>
                                <div className="stat-label">Total Tareas</div>
                            </div>
                            <div className="stat-box">
                                <div className="stat-value">{deals.filter(d => d.stage === 'won').length}</div>
                                <div className="stat-label">Deals Ganados</div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>

            <style>{`
        .stat-box {
          padding: var(--space-4);
          background: var(--bg-secondary);
          border-radius: var(--radius-lg);
          text-align: center;
        }
        .stat-value {
          font-size: var(--font-size-3xl);
          font-weight: 700;
          color: var(--primary-600);
        }
        .stat-label {
          font-size: var(--font-size-sm);
          color: var(--text-secondary);
          margin-top: var(--space-1);
        }
        .col-span-2 {
          grid-column: span 2;
        }
      `}</style>
        </Layout>
    );
};

export default Reports;
