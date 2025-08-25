import React, { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';
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
        console.log('Fetching social media links from:', API_ENDPOINTS.SOCIAL_MEDIA.GET_ALL);
        const response = await fetch(API_ENDPOINTS.SOCIAL_MEDIA.GET_ALL);
        console.log('Social media response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Social media response data:', data);
          // The API returns { settings: [...] }, so we need to extract the settings array
          const links = data.settings || data || [];
          console.log('Extracted social media links:', links);
          // Ensure it's an array
          if (Array.isArray(links)) {
            setSocialLinks(links);
          } else {
            console.error('Social media data is not an array:', links);
            setSocialLinks([]);
          }
        } else {
          console.error('Social media response not ok:', response.status);
        }
      } catch (error) {
        console.error('Error fetching social media links:', error);
        setSocialLinks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSocialLinks();
  }, []);

  // Icon mapping for different platforms using custom SVG icons
  const getIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'facebook':
        return (
          <img 
            src="/images/facebook-round-color-icon.svg" 
            alt="Facebook" 
            className="h-6 w-6"
          />
        );
      case 'twitter':
        return (
          <img 
            src="/images/twitter-square-color-icon.svg" 
            alt="Twitter" 
            className="h-6 w-6"
          />
        );
      case 'instagram':
        return (
          <img 
            src="/images/ig-instagram-icon.svg" 
            alt="Instagram" 
            className="h-6 w-6"
          />
        );
      case 'linkedin':
        return (
          <img 
            src="/images/linkedin-app-icon.svg" 
            alt="LinkedIn" 
            className="h-6 w-6"
          />
        );
      case 'youtube':
        return (
          <img 
            src="/images/youtube-color-icon.svg" 
            alt="YouTube" 
            className="h-6 w-6"
          />
        );
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

  // Safety check: ensure socialLinks is an array
  if (!Array.isArray(socialLinks) || socialLinks.length === 0) {
    // Show default social media icons as fallback
    const defaultSocialLinks = [
      { platform: 'facebook', url: '#', icon_name: 'facebook', display_name: 'Facebook' },
      { platform: 'twitter', url: '#', icon_name: 'twitter', display_name: 'Twitter' },
      { platform: 'instagram', url: '#', icon_name: 'instagram', display_name: 'Instagram' },
      { platform: 'linkedin', url: '#', icon_name: 'linkedin', display_name: 'LinkedIn' },
      { platform: 'youtube', url: '#', icon_name: 'youtube', display_name: 'YouTube' }
    ];
    
    return (
      <>
        {defaultSocialLinks.map((link) => (
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
