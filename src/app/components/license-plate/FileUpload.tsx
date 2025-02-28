'use client';

import { RefObject, useCallback } from 'react';

interface FileUploadProps {
  fileInputRef: RefObject<HTMLInputElement | null>;
  onUploadStart: () => void;
  onUploadComplete: (imageBase64: string, imageUrl: string) => void;
  onUploadError: (error: string) => void;
}

export function FileUpload({ 
  fileInputRef, 
  onUploadStart, 
  onUploadComplete, 
  onUploadError 
}: FileUploadProps) {
  
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    onUploadStart();
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const result = e.target?.result as string;
      const base64Data = result.split(',')[1];
      onUploadComplete(base64Data, result);
    };
    
    reader.onerror = () => {
      onUploadError('Error reading the uploaded file');
    };
    
    reader.readAsDataURL(file);
  }, [onUploadStart, onUploadComplete, onUploadError]);

  const triggerFileUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, [fileInputRef]);

  return { handleFileUpload, triggerFileUpload };
}
