import React, { useState, useEffect } from 'react';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube, 
  Globe 
} from 'lucide-react';
import TikTokIcon from './icons/TikTokIcon';
import { API_ENDPOINTS } from '@/config/api';

interface SocialMediaLink {
  platform: string;
  url: string;
  icon_name: string;
  display_name: string;
}

const SocialMediaLinks: React.FC = () => {
  const [socialLinks, setSocialLinks] = useState<SocialMediaLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.SOCIAL_MEDIA.GET_ALL);
        if (response.ok) {
          const data = await response.json();
          setSocialLinks(data);
        }
      } catch (error) {
        console.error('Error fetching social media links:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSocialLinks();
  }, []);

  // Icon mapping for different platforms
  const getIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'facebook':
        return <Facebook className="h-6 w-6" />;
      case 'twitter':
        return <Twitter className="h-6 w-6" />;
      case 'instagram':
        return <Instagram className="h-6 w-6" />;
      case 'linkedin':
        return <Linkedin className="h-6 w-6" />;
      case 'youtube':
        return <Youtube className="h-6 w-6" />;
      case 'tiktok':
        return <TikTokIcon className="h-6 w-6" />;
      default:
        return <Globe className="h-6 w-6" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center space-x-6">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="w-12 h-12 bg-primary-foreground/20 rounded-full animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (socialLinks.length === 0) {
    return null; // Don't show anything if no social links
  }

  return (
    <>
      {socialLinks.map((link) => (
        <a
          key={link.platform}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group p-3 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-full transition-all duration-300 transform-gpu hover:scale-110 hover:rotate-3"
          title={link.display_name}
        >
          <div className="text-primary-foreground group-hover:text-primary-foreground transition-colors duration-300">
            {getIcon(link.icon_name)}
          </div>
        </a>
      ))}
    </>
  );
};

export default SocialMediaLinks;
