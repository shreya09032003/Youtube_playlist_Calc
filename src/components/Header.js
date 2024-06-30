// Header.js
import React from 'react';
import { FaShareAlt } from 'react-icons/fa';

const Header = () => {
  const shareUrl = window.location.href; 

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: document.title,
        url: shareUrl
      }).then(() => {
        console.log('Shared successfully');
      }).catch((error) => {
        console.error('Error sharing:', error);
      });
    } else {
      console.warn('Web Share API not supported.');
      const el = document.createElement('textarea');
      el.value = shareUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      alert('Link copied to clipboard. Share it with friends!');
    }
  };

  return (
    <header className="header" style={{ color: 'white', padding: '2px', textAlign: 'center' }}>
      <div className="header-content">
        <div className="share-section">
          <span style={{ margin: '2px', fontWeight: 'bold' , fontSize:'20px' }}>Share with friends</span>
          <FaShareAlt className="share-icon" onClick={handleShare} style={{ cursor: 'pointer' }} />
        </div>
      </div>
    </header>
  );
}

export default Header;
