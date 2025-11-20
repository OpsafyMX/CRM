import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({
    value,
    onChange,
    placeholder = 'Buscar...',
    className = ''
}) => {
    return (
        <div className={`flex items-center gap-2 ${className}`} style={{ position: 'relative' }}>
            <Search
                size={18}
                style={{
                    position: 'absolute',
                    left: '12px',
                    color: 'var(--text-tertiary)'
                }}
            />
            <input
                type="text"
                className="input"
                style={{ paddingLeft: '40px' }}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
};

export default SearchBar;
