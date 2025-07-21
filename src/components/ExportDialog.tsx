import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Download, Settings, FileText, Palette, Smartphone, Search } from 'lucide-react';
import { ExportService, ExportOptions } from '../services/export-service';
import { SiteData, UserData } from '../types';

interface ExportDialogProps {
  siteData: SiteData;
  userData: UserData;
  onExport?: () => void;
}

export const ExportDialog: React.FC<ExportDialogProps> = ({ siteData, userData, onExport }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    includeBranding: true,
    theme: 'modern',
    responsive: true,
    seoOptimized: true
  });

  const handleExport = async () => {
    if (!siteData || !userData) {
      alert('No data to export');
      return;
    }

    setIsExporting(true);
    try {
      console.log('🚀 Starting export with options:', exportOptions);
      
      // Generate the export
      const result = await ExportService.exportSite(siteData, userData, exportOptions);
      
      // Create downloadable files
      const siteName = userData.email.split('@')[0] || 'scopestudio-site';
      ExportService.createDownloadableFiles(result, siteName);
      
      console.log('✅ Export completed successfully');
      
      // Close dialog and call callback
      setIsOpen(false);
      onExport?.();
      
      // Show success message
      alert(`Site exported successfully! Files downloaded as ${siteName}-${new Date().toISOString().split('T')[0]}.zip`);
      
    } catch (error) {
      console.error('❌ Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const themeOptions = [
    { value: 'modern', label: 'Modern', description: 'Gradient backgrounds, bold typography' },
    { value: 'classic', label: 'Classic', description: 'Professional, clean design' },
    { value: 'minimal', label: 'Minimal', description: 'Simple, clean layout' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="inline-flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Site
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Export Your Site
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Export Preview */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Export Summary</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <div>• {siteData.pages.length} pages</div>
              <div>• {exportOptions.theme} theme</div>
              <div>• {exportOptions.responsive ? 'Responsive' : 'Desktop only'}</div>
              <div>• {exportOptions.includeBranding ? 'With branding' : 'Brandless'}</div>
            </div>
          </div>

          {/* Theme Selection */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Theme
            </Label>
            <Select 
              value={exportOptions.theme} 
              onValueChange={(value) => setExportOptions(prev => ({ ...prev, theme: value as 'modern' | 'classic' | 'minimal' }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {themeOptions.map(theme => (
                  <SelectItem key={theme.value} value={theme.value}>
                    <div>
                      <div className="font-medium">{theme.label}</div>
                      <div className="text-xs text-gray-500">{theme.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Export Options */}
          <div className="space-y-4">
            <Label className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Export Options
            </Label>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Include Branding</Label>
                  <p className="text-xs text-gray-500">Add ScopeStudio footer to exported site</p>
                </div>
                <Switch
                  checked={exportOptions.includeBranding}
                  onCheckedChange={(checked) => setExportOptions(prev => ({ ...prev, includeBranding: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium flex items-center gap-1">
                    <Smartphone className="h-3 w-3" />
                    Responsive Design
                  </Label>
                  <p className="text-xs text-gray-500">Optimize for mobile devices</p>
                </div>
                <Switch
                  checked={exportOptions.responsive}
                  onCheckedChange={(checked) => setExportOptions(prev => ({ ...prev, responsive: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium flex items-center gap-1">
                    <Search className="h-3 w-3" />
                    SEO Optimized
                  </Label>
                  <p className="text-xs text-gray-500">Include meta tags and structured data</p>
                </div>
                <Switch
                  checked={exportOptions.seoOptimized}
                  onCheckedChange={(checked) => setExportOptions(prev => ({ ...prev, seoOptimized: checked }))}
                />
              </div>
            </div>
          </div>

          {/* Plan Limitations */}
          {userData.plan === 'free' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <div className="text-yellow-600 mt-0.5">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-sm text-yellow-800">
                  <p className="font-medium">Free Plan Limitation</p>
                  <p className="text-xs mt-1">Upgrade to Pro to remove branding and get unlimited exports.</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isExporting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleExport}
              disabled={isExporting}
              className="flex-1"
            >
              {isExporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Export Site
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 