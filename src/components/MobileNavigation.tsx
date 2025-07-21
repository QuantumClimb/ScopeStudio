import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  Menu, 
  X, 
  Home, 
  User, 
  Settings, 
  Download, 
  Eye, 
  Plus,
  Smartphone,
  Monitor,
  Tablet,
  FileText,
  ArrowRight
} from 'lucide-react';
import { useMobile } from '../hooks/use-mobile';
import { Link } from 'react-router-dom';
import type { UserData, SiteData } from '../types';

interface MobileNavigationProps {
  userData: UserData | null;
  siteData: SiteData;
  activePageId: string;
  onPageSelect: (pageId: string) => void;
  onExport: () => void;
  onPreview: () => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  userData,
  siteData,
  activePageId,
  onPageSelect,
  onExport,
  onPreview,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { deviceType, isLandscape, screenWidth } = useMobile();

  const handlePageSelect = (pageId: string) => {
    onPageSelect(pageId);
    setIsOpen(false);
  };

  const handleExport = () => {
    onExport();
    setIsOpen(false);
  };

  const handlePreview = () => {
    onPreview();
    setIsOpen(false);
  };

  return (
    <div className="mobile-only">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="outline" 
            size="icon" 
            className="fixed top-4 left-4 z-50 mobile-touch-target mobile-haptic ios-button-secondary"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="mobile-sheet w-[300px] sm:w-[400px] mobile-safe-left">
          <SheetHeader className="mobile-safe-top">
            <SheetTitle className="mobile-flex-center mobile-inline-stack">
              <Smartphone className="h-5 w-5" />
              <span className="mobile-text-medium">ScopeStudio</span>
              <Badge variant="secondary" className="ml-auto mobile-badge-secondary">
                {deviceType}
              </Badge>
            </SheetTitle>
          </SheetHeader>

          <div className="mobile-stack mobile-safe-bottom">
            {/* User Info */}
            <div className="mobile-card">
              <div className="mobile-flex-center mobile-inline-stack">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="mobile-text-small font-medium text-gray-800">
                    {userData?.email || 'Guest'}
                  </p>
                  <Badge variant="outline" className="mobile-badge-secondary">
                    {userData?.plan || 'free'} plan
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            {/* Quick Actions */}
            <div className="mobile-card">
              <h3 className="mobile-text-medium mb-3">Quick Actions</h3>
              <div className="mobile-grid-2 gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handlePreview}
                  className="mobile-haptic mobile-touch-target"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleExport}
                  className="mobile-haptic mobile-touch-target"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            <Separator />

            {/* Pages */}
            <div className="mobile-card">
              <h3 className="mobile-text-medium mb-3">
                Pages ({siteData?.pages?.length || 0})
              </h3>
              <div className="mobile-stack">
                {siteData?.pages?.map((page) => (
                  <Button
                    key={page.id}
                    variant={activePageId === page.id ? "default" : "ghost"}
                    size="sm"
                    className="w-full justify-start mobile-haptic mobile-touch-target"
                    onClick={() => handlePageSelect(page.id)}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    <div className="flex-1 text-left">
                      <div className="mobile-text-small font-medium">{page.name}</div>
                      <div className="mobile-text-small text-gray-500 truncate">
                        {page.title}
                      </div>
                    </div>
                    {activePageId === page.id && (
                      <Badge variant="secondary" className="ml-auto mobile-badge-primary">
                        Active
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Device Info */}
            <div className="mobile-card">
              <h3 className="mobile-text-medium mb-3">Device Info</h3>
              <div className="mobile-stack">
                <div className="mobile-flex-center mobile-inline-stack">
                  <Monitor className="h-3 w-3 text-gray-500" />
                  <span className="mobile-text-small text-gray-600">
                    {screenWidth} × {window.innerHeight}px
                  </span>
                </div>
                <div className="mobile-flex-center mobile-inline-stack">
                  <Tablet className="h-3 w-3 text-gray-500" />
                  <span className="mobile-text-small text-gray-600">
                    {isLandscape ? 'Landscape' : 'Portrait'}
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Navigation Links */}
            <div className="mobile-card">
              <h3 className="mobile-text-medium mb-3">Navigation</h3>
              <div className="mobile-stack">
                <Link to="/" className="block">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start mobile-haptic mobile-touch-target"
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Home
                    <ArrowRight className="h-4 w-4 ml-auto" />
                  </Button>
                </Link>
                <Link to="/pricing" className="block">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start mobile-haptic mobile-touch-target"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Pricing
                    <ArrowRight className="h-4 w-4 ml-auto" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Footer */}
            <div className="mobile-card text-center">
              <div className="mobile-text-small text-gray-500">
                <div className="font-medium mb-1">ScopeStudio v1.0</div>
                <div>by Quantum Climb</div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}; 