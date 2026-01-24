import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const CollapsibleSection = ({ 
  title, 
  children, 
  defaultOpen = true,
  icon: Icon = null,
  count = null 
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition"
        aria-expanded={isOpen}
        aria-controls={`section-${title.toLowerCase().replace(/\s+/g, '-')}`}
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon className="w-5 h-5 text-indigo-600" />}
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          {count !== null && (
            <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-xs font-semibold">
              {count}
            </span>
          )}
        </div>
        <ChevronDown 
          className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      
      {isOpen && (
        <div 
          id={`section-${title.toLowerCase().replace(/\s+/g, '-')}`}
          className="border-t border-gray-200 p-4"
        >
          {children}
        </div>
      )}
    </div>
  );
};
