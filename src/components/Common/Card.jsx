import React from 'react';

const Card = ({
    children,
    className = '',
    glass = false,
    hover = true,
    onClick
}) => {
    const baseClass = glass ? 'card card-glass' : 'card';
    const hoverClass = hover && onClick ? 'cursor-pointer' : '';
    const classes = [baseClass, hoverClass, className]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={classes} onClick={onClick}>
            {children}
        </div>
    );
};

export const CardHeader = ({ children, className = '' }) => (
    <div className={`card-header ${className}`}>{children}</div>
);

export const CardTitle = ({ children, className = '' }) => (
    <h3 className={`card-title ${className}`}>{children}</h3>
);

export const CardBody = ({ children, className = '' }) => (
    <div className={`card-body ${className}`}>{children}</div>
);

export default Card;
