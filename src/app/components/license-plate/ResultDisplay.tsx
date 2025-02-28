'use client';

interface ResultDisplayProps {
  isLoading: boolean;
  licensePlate: string | null;
  error: string | null;
}

export function ResultDisplay({ isLoading, licensePlate, error }: ResultDisplayProps) {
  const isCameraError = error && (
    error.includes('camera') || 
    error.includes('Camera') || 
    error.includes('media') || 
    error.includes('Media') ||
    error.includes('permission')
  );

  return (
    <div className="w-full">
      {isLoading && (
        <div className="flex flex-col items-center justify-center p-6 bg-gray-100 rounded-lg">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mb-3"></div>
          <p className="text-gray-700">Processing image...</p>
        </div>
      )}
      
      {!isLoading && licensePlate && (
        <div className="p-6 bg-green-100 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800 mb-2">License Plate Detected</h3>
          <div className="bg-white p-4 rounded border-2 border-green-500 text-center">
            <p className="text-3xl font-bold tracking-wider text-gray-800">{licensePlate}</p>
          </div>
        </div>
      )}
      
      {!isLoading && error && (
        <div className={`p-6 ${isCameraError ? 'bg-yellow-100' : 'bg-red-100'} rounded-lg`}>
          <h3 className={`text-lg font-semibold ${isCameraError ? 'text-yellow-800' : 'text-red-800'} mb-2`}>
            {isCameraError ? 'Camera Issue' : 'Error'}
          </h3>
          <p className={`${isCameraError ? 'text-yellow-700' : 'text-red-700'}`}>{error}</p>
          {isCameraError && (
            <div className="mt-3 text-sm text-gray-700">
              <p>Possible solutions:</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Make sure you&apos;ve granted camera permissions in your browser</li>
                <li>Try using a different browser (Chrome or Firefox recommended)</li>
                <li>Use the &quot;Upload Image&quot; option instead</li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
