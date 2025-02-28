'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { CameraCapture } from './CameraCapture';
import { FileUpload } from './FileUpload';
import { ResultDisplay } from './ResultDisplay';
import { recognizeLicensePlate } from './ApiService';

export function LicensePlateScanner() {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [licensePlate, setLicensePlate] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetState = () => {
    setCapturedImage(null);
    setLicensePlate(null);
    setError(null);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCaptureStart = () => {
    setCameraActive(true);
    resetState();
  };

  const handleImageProcessing = async (imageBase64: string, imageUrl: string) => {
    setCapturedImage(imageUrl);
    setIsLoading(true);
    setError(null);
    
    try {
      const { status, data } = await recognizeLicensePlate(imageBase64);
      
      if (status === 200 && data.licensePlate) {
        setLicensePlate(data.licensePlate);
      } else if (status === 404) {
        setError(data.error || 'No license plate detected in the image');
      } else if (status >= 400 && status < 500) {
        setError(data.error || `Client error (${status}): Please check your request`);
      } else if (status >= 500) {
        setError(data.error || `Server error (${status}): Please try again later`);
      } else {
        setError(`Unexpected response from server (${status})`);
      }
    } catch (err) {
      console.error('Error processing image:', err);
      
      if (err instanceof DOMException && err.name === 'AbortError') {
        setError('Request timed out. Please try again.');
      } else if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const { startCamera, captureImage } = CameraCapture({
    videoRef,
    canvasRef,
    onCaptureStart: handleCaptureStart,
    onCaptureComplete: handleImageProcessing
  });

  const { handleFileUpload, triggerFileUpload } = FileUpload({
    fileInputRef,
    onUploadStart: resetState,
    onUploadComplete: handleImageProcessing,
    onUploadError: setError
  });

  return (
    <div className="flex flex-col items-center w-full">
      <div className="relative w-full max-w-md h-80 bg-black rounded-lg overflow-hidden mb-4">
        {!capturedImage && (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`}
          />
        )}
        
        {capturedImage && (
          <div className="relative w-full h-full">
            <Image 
              src={capturedImage} 
              alt="Captured license plate" 
              className="object-cover"
              fill
              sizes="(max-width: 768px) 100vw, 500px"
              priority
            />
          </div>
        )}
        
        <canvas ref={canvasRef} className="hidden" />
        
        {!cameraActive && !capturedImage && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-gray-800 bg-opacity-70">
            <Image 
              src="/camera.svg" 
              alt="Camera" 
              width={64} 
              height={64}
              className="mb-4 opacity-70"
            />
            <p>Select an option below</p>
          </div>
        )}
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />
      
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        {!cameraActive && !capturedImage && !isLoading && (
          <>
            <button
              onClick={startCamera}
              className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
                <circle cx="12" cy="13" r="3"></circle>
              </svg>
              Use Camera
            </button>
            
            <button
              onClick={triggerFileUpload}
              className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              Upload Image
            </button>
          </>
        )}
        
        {cameraActive && (
          <button
            onClick={captureImage}
            className="px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors"
          >
            Capture
          </button>
        )}
        
        {capturedImage && !isLoading && (
          <button
            onClick={resetState}
            className="px-6 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 2v6h6"></path>
              <path d="M21 12A9 9 0 0 0 6 5.3L3 8"></path>
              <path d="M21 22v-6h-6"></path>
              <path d="M3 12a9 9 0 0 0 15 6.7l3-2.7"></path>
            </svg>
            Try Again
          </button>
        )}
      </div>
      
      <div className="w-full max-w-md">
        <ResultDisplay 
          isLoading={isLoading}
          licensePlate={licensePlate}
          error={error}
        />
      </div>
    </div>
  );
}
