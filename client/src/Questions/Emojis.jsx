

import React, { useEffect, useRef } from 'react';

const FloatingIcons = () => {
  const animationRef = useRef(null);

  useEffect(() => {
    const icons = [
      { id: 'puzzle', src: '/assets/puzzlee.png' },
      { id: 'brain', src: '/assets/brain.png' },
      { id: 'letter', src: '/assets/letter.png' },
      { id: 'star', src: '/assets/star.png' },
      { id: 'eye', src: '/assets/eye.png' },
      { id: 'math', src: '/assets/sigma.png' },
      { id: 'music', src: '/assets/music.png' },
      { id: 'timer', src: '/assets/timer.png' }
    ];

    const container = animationRef.current;
    if (!container) return;

    container.innerHTML = '';

    // Inject keyframes for floating animation
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes float {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
        100% { transform: translateY(0px); }
      }
      .float-icon {
        animation: float 3s ease-in-out infinite;
      }
    `;
    document.head.appendChild(style);

    const centerX = container.offsetWidth / 2;
    const centerY = container.offsetHeight / 2;
    const radius = 100;

    icons.forEach((icon, index) => {
      const angle = (2 * Math.PI / icons.length) * index;
      const x = centerX + radius * Math.cos(angle) - 24;
      const y = centerY + radius * Math.sin(angle) - 24;

      const iconElement = document.createElement('div');
      iconElement.className = 'absolute w-12 h-12 flex items-center justify-center rounded-full float-icon';
      iconElement.style.left = `${x}px`;
      iconElement.style.top = `${y}px`;
      iconElement.style.opacity = '0.9';

   
      iconElement.style.animationDelay = `${index * 0.3}s`;

      if (icon.src) {
        const img = document.createElement('img');
        img.src = icon.src;
        img.className = 'w-6 h-6';
        img.alt = icon.id;
        iconElement.appendChild(img);
      } else {
        const emojiMap = {
          'puzzle': '🧩',
          'brain': '🧠',
          'letter': 'Aa',
          'star': '⭐',
          'eye': '👁️',
          'math': '∑',
          'music': '🎵',
          'clock': '⏰'
        };
        iconElement.textContent = emojiMap[icon.id] || '✨';
        iconElement.style.fontSize = '24px';
      }

      container.appendChild(iconElement);
    });

    // Center memoji
    const memojiContainer = document.createElement('div');
    memojiContainer.className = 'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-30 h-30';

    const memoji = document.createElement('img');
    memoji.src = "/assets/56 5.png";
    memoji.className = 'w-full h-full object-contain';
    memoji.alt = 'Character Avatar';

    memojiContainer.appendChild(memoji);
    container.appendChild(memojiContainer);

    return () => {
      container.innerHTML = '';
      document.head.removeChild(style);
    };
  }, []);

  return (
  <>
    <div ref={animationRef} className="relative w-full h-64">
    
    </div>
    <div className=' flex flex-col items-center'>
    <h2 className='text-2xl font-semibold text-green-800 mt-3'>
    One more step to go!
    </h2>
    <p className="text-gray-700 mt-2">
        You're almost there. Just a few more questions to complete your assessment.
      </p>
    </div>
    </>
  
  );
};

export default FloatingIcons;
