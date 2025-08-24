import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { API_ENDPOINTS } from '@/config/api';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube, 
  Globe,
  Save,
  ExternalLink,
  Settings
} from 'lucide-react';
import TikTokIcon from '../icons/TikTokIcon';

interface SocialMediaSetting {
  id: number;
  platform: string;
  url: string;
  is_active: boolean;
  icon_name: string;
  display_name: string;
  created_at: string;
  updated_at: string;
}

const SocialMediaManagement: React.FC = () => {
  const [socialMediaSettings, setSocialMediaSettings] = useState<SocialMediaSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | null>(null);
  const { toast } = useToast();
  const { token } = useAuth();

  // Icon mapping for different platforms
  const getIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'facebook':
        return <Facebook className="h-5 w-5" />;
      case 'twitter':
        return <Twitter className="h-5 w-5" />;
      case 'instagram':
        return <Instagram className="h-5 w-5" />;
      case 'linkedin':
        return <Linkedin className="h-5 w-5" />;
      case 'youtube':
        return <Youtube className="h-5 w-5" />;
      case 'tiktok':
        return <TikTokIcon className="h-5 w-5" />;
      default:
        return <Globe className="h-5 w-5" />;
    }
  };

  // Load social media settings
  const loadSocialMediaSettings = async () => {
    if (!token) return;

    try {
      const response = await fetch(API_ENDPOINTS.ADMIN.SOCIAL_MEDIA, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSocialMediaSettings(data.settings || []);
      } else {
        toast({
          title: "Error",
          description: "Failed to load social media settings",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error loading social media settings:', error);
      toast({
        title: "Error",
        description: "Failed to load social media settings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Update social media setting
  const updateSocialMediaSetting = async (id: number, updates: Partial<SocialMediaSetting>) => {
    if (!token) return;

    setSaving(id);
    try {
      // Find the setting to get the platform name
      const setting = socialMediaSettings.find(s => s.id === id);
      if (!setting) {
        toast({
          title: "Error",
          description: "Setting not found",
          variant: "destructive"
        });
        return;
      }

      const response = await fetch(API_ENDPOINTS.ADMIN.UPDATE_SOCIAL_MEDIA, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          platform: setting.platform,
          updates: updates
        })
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Success",
          description: data.message,
          variant: "default"
        });

        // Update local state
        setSocialMediaSettings(prev => 
          prev.map(setting => 
            setting.id === id 
              ? { ...setting, ...updates, updated_at: new Date().toISOString() }
              : setting
          )
        );
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.error || "Failed to update setting",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error updating social media setting:', error);
      toast({
        title: "Error",
        description: "Failed to update setting",
        variant: "destructive"
      });
    } finally {
      setSaving(null);
    }
  };

  // Handle URL change
  const handleUrlChange = (id: number, newUrl: string) => {
    setSocialMediaSettings(prev => 
      prev.map(setting => 
        setting.id === id 
          ? { ...setting, url: newUrl }
          : setting
      )
    );
  };

  // Handle active toggle
  const handleActiveToggle = (id: number, isActive: boolean) => {
    updateSocialMediaSetting(id, { is_active: isActive });
  };

  // Handle save button click
  const handleSave = (id: number) => {
    const setting = socialMediaSettings.find(s => s.id === id);
    if (setting) {
      updateSocialMediaSetting(id, {
        url: setting.url,
        is_active: setting.is_active,
        icon_name: setting.icon_name,
        display_name: setting.display_name
      });
    }
  };

  // Test social media link
  const testLink = (url: string) => {
    if (url && url !== 'https://facebook.com/mece' && url !== 'https://tiktok.com/@mece') {
      window.open(url, '_blank');
    }
  };

  useEffect(() => {
    loadSocialMediaSettings();
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Settings className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Social Media Management</h2>
      </div>
      
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">Manage Social Media Links</CardTitle>
          <CardDescription className="text-blue-600">
            Configure social media links that will appear in the homepage footer. 
            Users can click these links to visit your social media accounts.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-6">
        {socialMediaSettings.map((setting) => (
          <Card key={setting.id} className="bg-white/80 backdrop-blur-sm border-gray-200 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg text-white">
                    {getIcon(setting.icon_name)}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{setting.display_name}</CardTitle>
                    <CardDescription className="text-sm text-gray-600">
                      Platform: {setting.platform}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor={`active-${setting.id}`} className="text-sm font-medium">
                    Active
                  </Label>
                  <Switch
                    id={`active-${setting.id}`}
                    checked={setting.is_active}
                    onCheckedChange={(checked) => handleActiveToggle(setting.id, checked)}
                    className="data-[state=checked]:bg-blue-600"
                  />
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`url-${setting.id}`} className="text-sm font-medium">
                  Social Media URL
                </Label>
                <div className="flex space-x-2">
                  <Input
                    id={`url-${setting.id}`}
                    type="url"
                    placeholder="https://example.com/your-profile"
                    value={setting.url}
                    onChange={(e) => handleUrlChange(setting.id, e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => testLink(setting.url)}
                    disabled={!setting.url || setting.url === 'https://facebook.com/mece'}
                    className="px-3"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="text-xs text-gray-500">
                  Last updated: {new Date(setting.updated_at).toLocaleDateString()}
                </div>
                <Button
                  onClick={() => handleSave(setting.id)}
                  disabled={saving === setting.id}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  {saving === setting.id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800">How It Works</CardTitle>
          <CardDescription className="text-green-600">
            Set up and manage your social media presence
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-1 mt-2 text-green-700">
            <li>Set the URL for each social media platform</li>
            <li>Toggle the "Active" switch to show/hide links on the homepage</li>
            <li>Links will appear in the footer with appropriate icons</li>
            <li>Users can click these links to visit your social media accounts</li>
            <li>Changes are saved automatically when you click "Save Changes"</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default SocialMediaManagement;
