import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import Layout from '../components/Layout/Layout';
import Card from '../components/Common/Card';
import Button from '../components/Common/Button';
import Badge from '../components/Common/Badge';
import Modal from '../components/Common/Modal';
import { Plus, DollarSign } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';
import './Deals.css';

const STAGES = [
    { id: 'lead', label: 'Lead', color: 'gray' },
    { id: 'contacted', label: 'Contactado', color: 'primary' },
    { id: 'proposal', label: 'Propuesta', color: 'secondary' },
    { id: 'negotiation', label: 'Negociación', color: 'warning' },
    { id: 'won', label: 'Ganado', color: 'success' },
    { id: 'lost', label: 'Perdido', color: 'danger' }
];

const Deals = () => {
    const { deals, contacts, addDeal, updateDeal, deleteDeal } = useData();
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        value: '',
        contactId: '',
        stage: 'lead',
        notes: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        addDeal({ ...formData, value: parseFloat(formData.value) });
        setShowModal(false);
        setFormData({ title: '', value: '', contactId: '', stage: 'lead', notes: '' });
    };

    const handleStageChange = (dealId, newStage) => {
        updateDeal(dealId, { stage: newStage });
    };

    return (
        <Layout title="Pipeline de Ventas">
            <div className="deals-container">
                <div className="deals-header">
                    <Button icon={<Plus size={18} />} onClick={() => setShowModal(true)}>
                        Nuevo Deal
                    </Button>
                </div>

                <div className="deals-board">
                    {STAGES.map(stage => {
                        const stageDeals = deals.filter(d => d.stage === stage.id);
                        const stageValue = stageDeals.reduce((sum, d) => sum + (d.value || 0), 0);

                        return (
                            <div key={stage.id} className="deal-column">
                                <div className="deal-column-header">
                                    <h3>{stage.label}</h3>
                                    <Badge variant={stage.color}>{stageDeals.length}</Badge>
                                </div>
                                <div className="deal-column-value">{formatCurrency(stageValue)}</div>
                                <div className="deal-column-cards">
                                    {stageDeals.map(deal => {
                                        const contact = contacts.find(c => c.id === deal.contactId);
                                        return (
                                            <Card key={deal.id} className="deal-card">
                                                <h4 className="deal-title">{deal.title}</h4>
                                                <div className="deal-value">
                                                    <DollarSign size={16} />
                                                    {formatCurrency(deal.value)}
                                                </div>
                                                {contact && (
                                                    <p className="deal-contact">{contact.name}</p>
                                                )}
                                                <select
                                                    className="deal-stage-select"
                                                    value={deal.stage}
                                                    onChange={(e) => handleStageChange(deal.id, e.target.value)}
                                                >
                                                    {STAGES.map(s => (
                                                        <option key={s.id} value={s.id}>{s.label}</option>
                                                    ))}
                                                </select>
                                            </Card>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Nuevo Deal"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setShowModal(false)}>Cancelar</Button>
                        <Button onClick={handleSubmit}>Guardar</Button>
                    </>
                }
            >
                <form onSubmit={handleSubmit} className="deal-form">
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
                        <label className="input-label">Valor *</label>
                        <input
                            type="number"
                            className="input"
                            value={formData.value}
                            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Contacto</label>
                        <select
                            className="input"
                            value={formData.contactId}
                            onChange={(e) => setFormData({ ...formData, contactId: e.target.value })}
                        >
                            <option value="">Seleccionar contacto</option>
                            {contacts.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="input-group">
                        <label className="input-label">Notas</label>
                        <textarea
                            className="input"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            rows={3}
                        />
                    </div>
                </form>
            </Modal>
        </Layout>
    );
};

export default Deals;
