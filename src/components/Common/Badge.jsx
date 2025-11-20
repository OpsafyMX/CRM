import React from 'react';

const Badge = ({ children, variant = 'primary', className = '' }) => {
    const classes = `badge badge-${variant} ${className}`;

    return (
        <span className={classes}>
            {children}
        </span>
    );
};

export default Badge;
