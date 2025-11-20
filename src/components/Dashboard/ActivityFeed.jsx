import React from 'react';
import { formatRelativeTime } from '../../utils/dateUtils';
import {
    UserPlus,
    TrendingUp,
    CheckCircle2,
    Phone,
    Mail,
    FileText,
    Trash2
} from 'lucide-react';
import './ActivityFeed.css';

const ActivityFeed = ({ activities }) => {
    const getIcon = (type) => {
        switch (type) {
            case 'contact_created':
                return <UserPlus size={16} />;
            case 'contact_updated':
                return <FileText size={16} />;
            case 'contact_deleted':
                return <Trash2 size={16} />;
            case 'deal_created':
            case 'deal_stage_changed':
                return <TrendingUp size={16} />;
            case 'task_completed':
                return <CheckCircle2 size={16} />;
            case 'call':
                return <Phone size={16} />;
            case 'email':
                return <Mail size={16} />;
            default:
                return <FileText size={16} />;
        }
    };

    const getIconColor = (type) => {
        if (type.includes('contact')) return 'primary';
        if (type.includes('deal')) return 'secondary';
        if (type.includes('task')) return 'success';
        if (type.includes('deleted')) return 'danger';
        return 'gray';
    };

    if (!activities || activities.length === 0) {
        return (
            <div className="activity-empty">
                <p>No hay actividades recientes</p>
            </div>
        );
    }

    return (
        <div className="activity-feed">
            {activities.map((activity) => (
                <div key={activity.id} className="activity-item">
                    <div className={`activity-icon activity-icon-${getIconColor(activity.type)}`}>
                        {getIcon(activity.type)}
                    </div>
                    <div className="activity-content">
                        <p className="activity-description">{activity.description}</p>
                        <span className="activity-time">
                            {formatRelativeTime(activity.createdAt)}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ActivityFeed;
