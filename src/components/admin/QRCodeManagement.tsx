import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { QrCode, Download, Copy, Globe, Smartphone, Users, FileText, Settings } from 'lucide-react';
import QRCode from 'qrcode';

interface QRCodeData {
  id: string;
  title: string;
  url: string;
  type: string;
  description: string;
  qrCodeDataUrl: string;
  createdAt: string;
}

const QRCodeManagement: React.FC = () => {
  const [qrCodes, setQrCodes] = useState<QRCodeData[]>([]);
  const [newQRCode, setNewQRCode] = useState({
    title: '',
    url: '',
    type: 'website',
    description: ''
  });
  const [generating, setGenerating] = useState(false);
  const { toast } = useToast();

  const qrCodeTypes = [
    { value: 'website', label: 'Website', icon: Globe, description: 'Direct link to your website' },
    { value: 'registration', label: 'Registration Form', icon: FileText, description: 'Link to registration form' },
    { value: 'contact', label: 'Contact Page', icon: Users, description: 'Link to contact information' },
    { value: 'custom', label: 'Custom URL', icon: Settings, description: 'Any custom URL you specify' }
  ];

  const getTypeIcon = (type: string) => {
    const typeConfig = qrCodeTypes.find(t => t.value === type);
    if (typeConfig) {
      const IconComponent = typeConfig.icon;
      return <IconComponent className="h-5 w-5" />;
    }
    return <Globe className="h-5 w-5" />;
  };

  const getTypeLabel = (type: string) => {
    const typeConfig = qrCodeTypes.find(t => t.value === type);
    return typeConfig ? typeConfig.label : 'Custom';
  };

  const generateQRCode = async () => {
    if (!newQRCode.title || !newQRCode.url) {
      toast({
        title: "Error",
        description: "Please fill in both title and URL",
        variant: "destructive"
      });
      return;
    }

    setGenerating(true);
    try {
      // Generate QR code data URL
      const qrCodeDataUrl = await QRCode.toDataURL(newQRCode.url, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      const qrCodeData: QRCodeData = {
        id: Date.now().toString(),
        title: newQRCode.title,
        url: newQRCode.url,
        type: newQRCode.type,
        description: newQRCode.description,
        qrCodeDataUrl,
        createdAt: new Date().toISOString()
      };

      setQrCodes(prev => [qrCodeData, ...prev]);
      setNewQRCode({ title: '', url: '', type: 'website', description: '' });

      toast({
        title: "Success",
        description: "QR Code generated successfully!",
        variant: "default"
      });
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast({
        title: "Error",
        description: "Failed to generate QR code",
        variant: "destructive"
      });
    } finally {
      setGenerating(false);
    }
  };

  const downloadQRCode = (qrCode: QRCodeData) => {
    const link = document.createElement('a');
    link.download = `${qrCode.title}-QR-Code.png`;
    link.href = qrCode.qrCodeDataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Downloaded",
      description: "QR Code downloaded successfully!",
      variant: "default"
    });
  };

  const copyURL = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "Copied",
      description: "URL copied to clipboard!",
      variant: "default"
    });
  };

  const deleteQRCode = (id: string) => {
    setQrCodes(prev => prev.filter(qr => qr.id !== id));
    toast({
      title: "Deleted",
      description: "QR Code deleted successfully!",
      variant: "default"
    });
  };

  const getDefaultURL = (type: string) => {
    const baseUrl = window.location.origin;
    switch (type) {
      case 'website':
        return baseUrl;
      case 'registration':
        return `${baseUrl}/participate`;
      case 'contact':
        return `${baseUrl}/contact`;
      default:
        return '';
    }
  };

  const handleTypeChange = (type: string) => {
    setNewQRCode(prev => ({
      ...prev,
      type,
      url: getDefaultURL(type)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <QrCode className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">QR Code Management</h2>
      </div>
      
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="text-purple-800">Generate New QR Code</CardTitle>
          <CardDescription className="text-purple-600">
            Create QR codes that users can scan to access different parts of your website.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">QR Code Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Website Homepage, Registration Form"
                value={newQRCode.title}
                onChange={(e) => setNewQRCode(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">QR Code Type</Label>
              <Select value={newQRCode.type} onValueChange={handleTypeChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {qrCodeTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center space-x-2">
                        <type.icon className="h-4 w-4" />
                        <span>{type.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">URL *</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://yourwebsite.com"
              value={newQRCode.url}
              onChange={(e) => setNewQRCode(prev => ({ ...prev, url: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              placeholder="Brief description of what this QR code links to"
              value={newQRCode.description}
              onChange={(e) => setNewQRCode(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <Button
            onClick={generateQRCode}
            disabled={generating || !newQRCode.title || !newQRCode.url}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
          >
            {generating ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Generating QR Code...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <QrCode className="h-4 w-4" />
                <span>Generate QR Code</span>
              </div>
            )}
          </Button>
        </CardContent>
      </Card>

      {qrCodes.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Generated QR Codes</h3>
          <div className="grid gap-4">
            {qrCodes.map((qrCode) => (
              <Card key={qrCode.id} className="bg-white/80 backdrop-blur-sm border-gray-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                    {/* QR Code Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={qrCode.qrCodeDataUrl}
                        alt={`QR Code for ${qrCode.title}`}
                        className="w-32 h-32 border border-gray-200 rounded-lg"
                      />
                    </div>

                    {/* QR Code Details */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(qrCode.type)}
                        <h4 className="text-lg font-semibold">{qrCode.title}</h4>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {getTypeLabel(qrCode.type)}
                        </span>
                      </div>
                      
                      {qrCode.description && (
                        <p className="text-gray-600 text-sm">{qrCode.description}</p>
                      )}
                      
                      <div className="flex items-center space-x-2">
                        <Globe className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600 font-mono">{qrCode.url}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyURL(qrCode.url)}
                          className="h-6 px-2"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <p className="text-xs text-gray-500">
                        Created: {new Date(qrCode.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col space-y-2">
                      <Button
                        onClick={() => downloadQRCode(qrCode)}
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      
                      <Button
                        onClick={() => deleteQRCode(qrCode.id)}
                        variant="outline"
                        size="sm"
                        className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800">How to Use QR Codes</CardTitle>
          <CardDescription className="text-green-600">
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Generate QR codes for different pages on your website</li>
              <li>Download the QR codes as PNG images</li>
              <li>Print them on business cards, flyers, or posters</li>
              <li>Users can scan with their phone camera to visit your website</li>
              <li>Great for offline marketing and easy website access</li>
            </ul>
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};

export default QRCodeManagement;
