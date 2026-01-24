import { HelpCircle } from 'lucide-react';
import { useState } from 'react';

export const Tooltip = ({ text, children, icon = false, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2',
    right: 'left-full ml-2',
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        className="inline-block cursor-help"
        role="tooltip"
      >
        {icon ? (
          <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600 transition" />
        ) : (
          children
        )}
      </div>

      {isVisible && (
        <div
          className={`absolute ${positionClasses[position]} left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs rounded py-2 px-3 whitespace-nowrap z-10 pointer-events-none`}
        >
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -translate-y-full border-4 border-transparent border-t-gray-900" />
        </div>
      )}
    </div>
  );
};
