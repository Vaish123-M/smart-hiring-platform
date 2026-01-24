import { Loader } from 'lucide-react';

export const LoadingIndicator = ({ message = 'Loading...', fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
        <div className="bg-white rounded-lg p-8 flex flex-col items-center gap-4">
          <Loader className="w-12 h-12 text-indigo-600 animate-spin" />
          <p className="text-gray-700 font-medium">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-3 py-8">
      <Loader className="w-6 h-6 text-indigo-600 animate-spin" />
      <p className="text-gray-600">{message}</p>
    </div>
  );
};
