import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import { generateId } from '../utils/helpers';

const DataContext = createContext();

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within DataProvider');
    }
    return context;
};

export const DataProvider = ({ children }) => {
    const [contacts, setContacts] = useState([]);
    const [deals, setDeals] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [activities, setActivities] = useState([]);

    // Load data from localStorage
    useEffect(() => {
        setContacts(storage.get('contacts') || []);
        setDeals(storage.get('deals') || []);
        setTasks(storage.get('tasks') || []);
        setActivities(storage.get('activities') || []);
    }, []);

    // Contacts CRUD
    const addContact = (contact) => {
        const newContact = {
            id: generateId(),
            ...contact,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        const updated = [...contacts, newContact];
        setContacts(updated);
        storage.set('contacts', updated);
        addActivity({
            type: 'contact_created',
            description: `Contacto creado: ${contact.name}`,
            contactId: newContact.id
        });
        return newContact;
    };

    const updateContact = (id, updates) => {
        const updated = contacts.map(c =>
            c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
        );
        setContacts(updated);
        storage.set('contacts', updated);
        addActivity({
            type: 'contact_updated',
            description: `Contacto actualizado: ${updates.name || 'Sin nombre'}`,
            contactId: id
        });
    };

    const deleteContact = (id) => {
        const contact = contacts.find(c => c.id === id);
        const updated = contacts.filter(c => c.id !== id);
        setContacts(updated);
        storage.set('contacts', updated);
        if (contact) {
            addActivity({
                type: 'contact_deleted',
                description: `Contacto eliminado: ${contact.name}`,
                contactId: id
            });
        }
    };

    const getContactById = (id) => contacts.find(c => c.id === id);

    // Deals CRUD
    const addDeal = (deal) => {
        const newDeal = {
            id: generateId(),
            ...deal,
            stage: deal.stage || 'lead',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        const updated = [...deals, newDeal];
        setDeals(updated);
        storage.set('deals', updated);
        addActivity({
            type: 'deal_created',
            description: `Deal creado: ${deal.title}`,
            dealId: newDeal.id
        });
        return newDeal;
    };

    const updateDeal = (id, updates) => {
        const oldDeal = deals.find(d => d.id === id);
        const updated = deals.map(d =>
            d.id === id ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d
        );
        setDeals(updated);
        storage.set('deals', updated);

        if (oldDeal && updates.stage && oldDeal.stage !== updates.stage) {
            addActivity({
                type: 'deal_stage_changed',
                description: `Deal "${oldDeal.title}" movido a ${updates.stage}`,
                dealId: id
            });
        }
    };

    const deleteDeal = (id) => {
        const deal = deals.find(d => d.id === id);
        const updated = deals.filter(d => d.id !== id);
        setDeals(updated);
        storage.set('deals', updated);
        if (deal) {
            addActivity({
                type: 'deal_deleted',
                description: `Deal eliminado: ${deal.title}`,
                dealId: id
            });
        }
    };

    const getDealById = (id) => deals.find(d => d.id === id);

    // Tasks CRUD
    const addTask = (task) => {
        const newTask = {
            id: generateId(),
            ...task,
            completed: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        const updated = [...tasks, newTask];
        setTasks(updated);
        storage.set('tasks', updated);
        addActivity({
            type: 'task_created',
            description: `Tarea creada: ${task.title}`,
            taskId: newTask.id
        });
        return newTask;
    };

    const updateTask = (id, updates) => {
        const oldTask = tasks.find(t => t.id === id);
        const updated = tasks.map(t =>
            t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
        );
        setTasks(updated);
        storage.set('tasks', updated);

        if (oldTask && updates.completed !== undefined && oldTask.completed !== updates.completed) {
            addActivity({
                type: updates.completed ? 'task_completed' : 'task_reopened',
                description: `Tarea ${updates.completed ? 'completada' : 'reabierta'}: ${oldTask.title}`,
                taskId: id
            });
        }
    };

    const deleteTask = (id) => {
        const task = tasks.find(t => t.id === id);
        const updated = tasks.filter(t => t.id !== id);
        setTasks(updated);
        storage.set('tasks', updated);
        if (task) {
            addActivity({
                type: 'task_deleted',
                description: `Tarea eliminada: ${task.title}`,
                taskId: id
            });
        }
    };

    const getTaskById = (id) => tasks.find(t => t.id === id);

    // Activities
    const addActivity = (activity) => {
        const newActivity = {
            id: generateId(),
            ...activity,
            createdAt: new Date().toISOString()
        };
        const updated = [newActivity, ...activities];
        setActivities(updated);
        storage.set('activities', updated);
    };

    const value = {
        // Contacts
        contacts,
        addContact,
        updateContact,
        deleteContact,
        getContactById,

        // Deals
        deals,
        addDeal,
        updateDeal,
        deleteDeal,
        getDealById,

        // Tasks
        tasks,
        addTask,
        updateTask,
        deleteTask,
        getTaskById,

        // Activities
        activities,
        addActivity
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
