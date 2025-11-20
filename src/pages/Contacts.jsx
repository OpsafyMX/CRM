import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import Layout from '../components/Layout/Layout';
import Card from '../components/Common/Card';
import Button from '../components/Common/Button';
import SearchBar from '../components/Common/SearchBar';
import Modal from '../components/Common/Modal';
import Avatar from '../components/Common/Avatar';
import Badge from '../components/Common/Badge';
import { Plus, Mail, Phone, Building, Trash2, Edit } from 'lucide-react';
import { validateEmail, validatePhone } from '../utils/helpers';
import './Contacts.css';

const Contacts = () => {
    const { contacts, addContact, updateContact, deleteContact } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingContact, setEditingContact] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        position: '',
        tags: '',
        notes: ''
    });

    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (contact.company && contact.company.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateEmail(formData.email)) {
            alert('Email inválido');
            return;
        }
        if (formData.phone && !validatePhone(formData.phone)) {
            alert('Teléfono inválido');
            return;
        }

        if (editingContact) {
            updateContact(editingContact.id, formData);
        } else {
            addContact(formData);
        }

        setShowModal(false);
        setEditingContact(null);
        setFormData({ name: '', email: '', phone: '', company: '', position: '', tags: '', notes: '' });
    };

    const handleEdit = (contact) => {
        setEditingContact(contact);
        setFormData({
            name: contact.name,
            email: contact.email,
            phone: contact.phone || '',
            company: contact.company || '',
            position: contact.position || '',
            tags: contact.tags || '',
            notes: contact.notes || ''
        });
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('¿Estás seguro de eliminar este contacto?')) {
            deleteContact(id);
        }
    };

    return (
        <Layout title="Contactos">
            <div className="contacts-container">
                <div className="contacts-header">
                    <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Buscar contactos..." />
                    <Button icon={<Plus size={18} />} onClick={() => setShowModal(true)}>
                        Nuevo Contacto
                    </Button>
                </div>

                <div className="contacts-grid">
                    {filteredContacts.map(contact => (
                        <Card key={contact.id} className="contact-card">
                            <div className="contact-card-header">
                                <Avatar name={contact.name} size="lg" />
                                <div className="contact-actions">
                                    <button className="icon-btn" onClick={() => handleEdit(contact)}>
                                        <Edit size={16} />
                                    </button>
                                    <button className="icon-btn danger" onClick={() => handleDelete(contact.id)}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <div className="contact-info">
                                <h3 className="contact-name">{contact.name}</h3>
                                {contact.position && contact.company && (
                                    <p className="contact-position">{contact.position} at {contact.company}</p>
                                )}
                                <div className="contact-details">
                                    <div className="contact-detail-item">
                                        <Mail size={14} />
                                        <span>{contact.email}</span>
                                    </div>
                                    {contact.phone && (
                                        <div className="contact-detail-item">
                                            <Phone size={14} />
                                            <span>{contact.phone}</span>
                                        </div>
                                    )}
                                    {contact.company && (
                                        <div className="contact-detail-item">
                                            <Building size={14} />
                                            <span>{contact.company}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {filteredContacts.length === 0 && (
                    <div className="empty-state">
                        <p>No se encontraron contactos</p>
                    </div>
                )}
            </div>

            <Modal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false);
                    setEditingContact(null);
                    setFormData({ name: '', email: '', phone: '', company: '', position: '', tags: '', notes: '' });
                }}
                title={editingContact ? 'Editar Contacto' : 'Nuevo Contacto'}
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setShowModal(false)}>Cancelar</Button>
                        <Button onClick={handleSubmit}>Guardar</Button>
                    </>
                }
            >
                <form onSubmit={handleSubmit} className="contact-form">
                    <div className="input-group">
                        <label className="input-label">Nombre *</label>
                        <input
                            type="text"
                            className="input"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Email *</label>
                        <input
                            type="email"
                            className="input"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Teléfono</label>
                        <input
                            type="tel"
                            className="input"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Empresa</label>
                        <input
                            type="text"
                            className="input"
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Cargo</label>
                        <input
                            type="text"
                            className="input"
                            value={formData.position}
                            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                        />
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

export default Contacts;
