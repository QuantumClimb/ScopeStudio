import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  Eye, 
  Download, 
  Settings 
} from 'lucide-react';
import { useMobile } from '../hooks/use-mobile';

interface MobileBottomNavigationProps {
  onPreview?: () => void;
  onExport?: () => void;
  activePageId?: string;
}

export const MobileBottomNavigation: React.FC<MobileBottomNavigationProps> = ({
  onPreview,
  onExport,
  activePageId
}) => {
  const location = useLocation();
  const { isMobile } = useMobile();

  if (!isMobile) return null;

  const navItems = [
    {
      icon: Home,
      label: 'Home',
      href: '/',
      active: location.pathname === '/'
    },
    {
      icon: FileText,
      label: 'Editor',
      href: '/dashboard',
      active: location.pathname === '/dashboard'
    },
    {
      icon: Eye,
      label: 'Preview',
      href: '/preview',
      active: location.pathname === '/preview',
      action: onPreview
    },
    {
      icon: Download,
      label: 'Export',
      href: '#',
      active: false,
      action: onExport
    },
    {
      icon: Settings,
      label: 'Settings',
      href: '/pricing',
      active: location.pathname === '/pricing'
    }
  ];

  return (
    <nav className="mobile-nav">
      <div className="mobile-grid-3 gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          
          if (item.action) {
            return (
              <button
                key={item.label}
                onClick={item.action}
                className={`mobile-nav-item mobile-haptic mobile-touch-target ${
                  item.active ? 'active' : ''
                }`}
              >
                <Icon className="h-5 w-5 mb-1" />
                <span className="mobile-text-small">{item.label}</span>
              </button>
            );
          }

          return (
            <Link
              key={item.label}
              to={item.href}
              className={`mobile-nav-item mobile-haptic mobile-touch-target ${
                item.active ? 'active' : ''
              }`}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="mobile-text-small">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}; 