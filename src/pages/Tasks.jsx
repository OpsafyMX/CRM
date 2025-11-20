import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import Layout from '../components/Layout/Layout';
import Card from '../components/Common/Card';
import Button from '../components/Common/Button';
import Badge from '../components/Common/Badge';
import Modal from '../components/Common/Modal';
import { Plus, CheckCircle2, Circle } from 'lucide-react';
import { formatDate, isOverdue } from '../utils/dateUtils';
import './Tasks.css';

const Tasks = () => {
    const { tasks, addTask, updateTask, deleteTask } = useData();
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        dueDate: '',
        priority: 'medium'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        addTask(formData);
        setShowModal(false);
        setFormData({ title: '', description: '', dueDate: '', priority: 'medium' });
    };

    const toggleTask = (taskId, completed) => {
        updateTask(taskId, { completed: !completed });
    };

    const pendingTasks = tasks.filter(t => !t.completed);
    const completedTasks = tasks.filter(t => t.completed);

    return (
        <Layout title="Tareas">
            <div className="tasks-container">
                <div className="tasks-header">
                    <div className="tasks-stats">
                        <span className="stat">{pendingTasks.length} pendientes</span>
                        <span className="stat">{completedTasks.length} completadas</span>
                    </div>
                    <Button icon={<Plus size={18} />} onClick={() => setShowModal(true)}>
                        Nueva Tarea
                    </Button>
                </div>

                <div className="tasks-sections">
                    <div className="tasks-section">
                        <h2 className="section-title">Pendientes</h2>
                        <div className="tasks-list">
                            {pendingTasks.map(task => (
                                <Card key={task.id} className="task-card">
                                    <div className="task-checkbox">
                                        <button
                                            className="checkbox-btn"
                                            onClick={() => toggleTask(task.id, task.completed)}
                                        >
                                            <Circle size={20} />
                                        </button>
                                    </div>
                                    <div className="task-content">
                                        <h3 className="task-title">{task.title}</h3>
                                        {task.description && (
                                            <p className="task-description">{task.description}</p>
                                        )}
                                        <div className="task-meta">
                                            <Badge variant={
                                                task.priority === 'high' ? 'danger' :
                                                    task.priority === 'medium' ? 'warning' : 'gray'
                                            }>
                                                {task.priority === 'high' ? 'Alta' :
                                                    task.priority === 'medium' ? 'Media' : 'Baja'}
                                            </Badge>
                                            {task.dueDate && (
                                                <span className={`task-date ${isOverdue(task.dueDate) ? 'overdue' : ''}`}>
                                                    {formatDate(task.dueDate)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>

                    <div className="tasks-section">
                        <h2 className="section-title">Completadas</h2>
                        <div className="tasks-list">
                            {completedTasks.map(task => (
                                <Card key={task.id} className="task-card completed">
                                    <div className="task-checkbox">
                                        <button
                                            className="checkbox-btn checked"
                                            onClick={() => toggleTask(task.id, task.completed)}
                                        >
                                            <CheckCircle2 size={20} />
                                        </button>
                                    </div>
                                    <div className="task-content">
                                        <h3 className="task-title">{task.title}</h3>
                                        {task.description && (
                                            <p className="task-description">{task.description}</p>
                                        )}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Nueva Tarea"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setShowModal(false)}>Cancelar</Button>
                        <Button onClick={handleSubmit}>Guardar</Button>
                    </>
                }
            >
                <form onSubmit={handleSubmit} className="task-form">
                    <div className="input-group">
                        <label className="input-label">Título *</label>
                        <input
                            type="text"
                            className="input"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Descripción</label>
                        <textarea
                            className="input"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                        />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Fecha de Vencimiento</label>
                        <input
                            type="date"
                            className="input"
                            value={formData.dueDate}
                            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                        />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Prioridad</label>
                        <select
                            className="input"
                            value={formData.priority}
                            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        >
                            <option value="low">Baja</option>
                            <option value="medium">Media</option>
                            <option value="high">Alta</option>
                        </select>
                    </div>
                </form>
            </Modal>
        </Layout>
    );
};

export default Tasks;
