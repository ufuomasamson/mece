import React from 'react';

interface TikTokIconProps {
  className?: string;
  size?: number;
}

const TikTokIcon: React.FC<TikTokIconProps> = ({ className = '', size = 24 }) => {
  return (
    <img
      src="/images/tiktok-icon.svg"
      alt="TikTok"
      width={size}
      height={size}
      className={className}
    />
  );
};

export default TikTokIcon;
