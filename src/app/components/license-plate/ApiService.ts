'use client';

import { ApiResponse } from './types';

export async function recognizeLicensePlate(imageBase64: string): Promise<{
  status: number;
  data: ApiResponse;
}> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);
  
  try {
    const response = await fetch('/api/license-plate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        minConfidence: 90,
        imageBase64
      }),
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    let data: ApiResponse;
    try {
      data = await response.json();
    } catch (jsonError) {
      console.error('Error parsing JSON response:', jsonError);
      throw new Error('Invalid response from server');
    }
    
    return {
      status: response.status,
      data
    };
  } finally {
    clearTimeout(timeoutId);
  }
}
