import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Get the request body
    const body = await request.json();
    
    // Validate the request body
    if (!body.imageBase64) {
      return NextResponse.json(
        { error: 'imageBase64 is required' },
        { status: 400 }
      );
    }

    // Forward the request to the actual API
    const response = await fetch('https://rmldoerrhd.execute-api.us-east-1.amazonaws.com/dev/license-plate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        minConfidence: body.minConfidence || 90,
        imageBase64: body.imageBase64
      }),
    });

    // Get the response data
    const data = await response.json();

    // Return the response with the appropriate status code
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('API proxy error:', error);
    
    // Return a server error response
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
