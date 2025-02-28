'use client';

import { RefObject, useCallback } from 'react';

interface CameraCaptureProps {
  videoRef: RefObject<HTMLVideoElement>;
  canvasRef: RefObject<HTMLCanvasElement>;
  onCaptureStart: () => void;
  onCaptureComplete: (imageBase64: string, imageUrl: string) => void;
}

export function CameraCapture({ 
  videoRef, 
  canvasRef, 
  onCaptureStart, 
  onCaptureComplete 
}: CameraCaptureProps) {
  
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        onCaptureStart();
      }
    } catch (err) {
      throw new Error('Camera access denied or not available');
    }
  }, [videoRef, onCaptureStart]);

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
