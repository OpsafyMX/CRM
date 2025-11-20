import React from 'react';
import { getInitials } from '../../utils/helpers';

const Avatar = ({ name, src, size = 'md', className = '' }) => {
    const sizes = {
        sm: '32px',
        md: '40px',
        lg: '48px',
        xl: '64px'
    };

    const fontSizes = {
        sm: '12px',
        md: '14px',
        lg: '16px',
        xl: '20px'
    };

    const avatarStyle = {
        width: sizes[size],
        height: sizes[size],
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: fontSizes[size],
        fontWeight: '600',
        color: 'white',
        background: 'linear-gradient(135deg, var(--primary-500), var(--secondary-500))',
        flexShrink: 0
    };

    if (src) {
        return (
            <img
                src={src}
                alt={name}
                style={{
                    ...avatarStyle,
                    objectFit: 'cover'
                }}
                className={className}
            />
        );
    }

    return (
        <div style={avatarStyle} className={className}>
            {getInitials(name)}
        </div>
    );
};

export default Avatar;
