import { format, formatDistanceToNow, isToday, isYesterday, parseISO } from 'date-fns';
import es from 'date-fns/locale/es'; // ✅ IMPORT CORRECTO

export const formatDate = (date) => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'dd/MM/yyyy', { locale: es });
};

export const formatDateTime = (date) => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, "dd/MM/yyyy 'a las' HH:mm", { locale: es });
};

export const formatRelativeTime = (date) => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? parseISO(date) : date;

    if (isToday(dateObj)) {
        return 'Hoy a las ' + format(dateObj, 'HH:mm', { locale: es });
    }

    if (isYesterday(dateObj)) {
        return 'Ayer a las ' + format(dateObj, 'HH:mm', { locale: es });
    }

    return formatDistanceToNow(dateObj, { addSuffix: true, locale: es });
};

export const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    const dateObj = typeof dueDate === 'string' ? parseISO(dueDate) : dueDate;
    return dateObj < new Date();
};
