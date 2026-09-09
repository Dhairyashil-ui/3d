import React from 'react';
import { Home, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface BreadcrumbItem {
  label: string;
  path?: string;
  link?: string;
  onClick?: () => void;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="naksha-breadcrumb" style={{
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '13px',
      color: '#64748b',
      marginBottom: '16px'
    }}>
      <Link to="/portal/home" style={{ color: '#1b539c', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
        <Home size={14} />
      </Link>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <ChevronRight size={12} style={{ color: '#94a3b8' }} />
            {item.onClick ? (
              <button
                type="button"
                onClick={item.onClick}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  color: '#1b539c',
                  cursor: 'pointer',
                  font: 'inherit',
                  textDecoration: 'none'
                }}
              >
                {item.label}
              </button>
            ) : item.path && !isLast ? (
              <Link to={item.path} style={{ color: '#1b539c', textDecoration: 'none' }}>
                {item.label}
              </Link>
            ) : (
              <span style={{ color: isLast ? '#1e293b' : '#64748b', fontWeight: isLast ? 600 : 400 }}>
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
