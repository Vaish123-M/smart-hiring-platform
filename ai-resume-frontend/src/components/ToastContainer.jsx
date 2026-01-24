import { AlertCircle, CheckCircle, InfoIcon, AlertTriangle, X } from 'lucide-react';

export const ToastContainer = ({ toasts, onRemove }) => {
  const getIcon = (type) => {
    switch(type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'info':
      default:
        return <InfoIcon className="w-5 h-5 text-blue-600" />;
    }
  };

  const getBg = (type) => {
    switch(type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const getTextColor = (type) => {
    switch(type) {
      case 'success':
        return 'text-green-800';
      case 'error':
        return 'text-red-800';
      case 'warning':
        return 'text-yellow-800';
      case 'info':
      default:
        return 'text-blue-800';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md" role="region" aria-live="polite" aria-label="Notifications">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 p-4 rounded-lg border ${getBg(toast.type)} shadow-lg animate-slide-in-right`}
          role="alert"
        >
          {getIcon(toast.type)}
          <span className={`flex-1 text-sm font-medium ${getTextColor(toast.type)}`}>
            {toast.message}
          </span>
          <button
            onClick={() => onRemove(toast.id)}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
