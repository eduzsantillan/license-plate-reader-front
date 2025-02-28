'use client';

interface ResultDisplayProps {
  isLoading: boolean;
  licensePlate: string | null;
  error: string | null;
}

export function ResultDisplay({ isLoading, licensePlate, error }: ResultDisplayProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">Processing image...</p>
      </div>
    );
  }

  if (licensePlate) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">License Plate Detected</h2>
        <div className="inline-block px-8 py-4 bg-blue-100 dark:bg-blue-900 rounded-lg">
          <p className="text-3xl font-bold text-blue-800 dark:text-blue-200">{licensePlate}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border-l-4 border-red-500">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Error</h2>
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          If this error persists, please try with a different image or check your network connection.
        </p>
      </div>
    );
  }

  return null;
}
