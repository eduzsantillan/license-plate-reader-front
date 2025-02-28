'use client';

import { RefObject, useCallback } from 'react';

interface CameraCaptureProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  onCaptureStart: () => void;
  onCaptureComplete: (imageBase64: string, imageUrl: string) => void;
  onError?: (error: string) => void;
}

export function CameraCapture({ 
  videoRef, 
  canvasRef, 
  onCaptureStart, 
  onCaptureComplete,
  onError
}: CameraCaptureProps) {
  
  const startCamera = useCallback(async () => {
    try {
      console.log('Requesting camera access...');
      
      // Check if mediaDevices is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Media devices API not available in this browser');
      }
      
      const constraints = { 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      };
      
      console.log('Camera constraints:', constraints);
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('Camera access granted, stream received');
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        onCaptureStart();
        console.log('Video element initialized with camera stream');
      } else {
        console.error('Video element reference is null');
      }
    } catch (error) {
      console.error('Camera error:', error);
      if (onError) {
        if (error instanceof Error) {
          onError(`Camera error: ${error.message}`);
        } else {
          onError('Camera access denied or not available. Please check your browser permissions.');
        }
      }
    }
  }, [videoRef, onCaptureStart, onError]);

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  }, [videoRef]);

  const captureImage = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageBase64 = canvas.toDataURL('image/jpeg').split(',')[1];
        const imageUrl = canvas.toDataURL('image/jpeg');
        
        stopCamera();
        onCaptureComplete(imageBase64, imageUrl);
      }
    }
  }, [videoRef, canvasRef, stopCamera, onCaptureComplete]);

  return { startCamera, stopCamera, captureImage };
}
