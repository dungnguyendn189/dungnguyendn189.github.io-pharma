import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Test basic connectivity
    console.log('=== BASIC DEBUG ===')
    console.log('Environment:', process.env.NODE_ENV)
    console.log('Database URL exists:', !!process.env.DATABASE_URL)
    console.log('Database URL preview:', process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 20) + '...' : 'NOT SET')
    
    return NextResponse.json({
      status: 'success',
      message: 'Basic debug successful',
      environment: process.env.NODE_ENV,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      databaseUrlPreview: process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 20) + '...' : 'NOT SET',
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('=== BASIC DEBUG ERROR ===', error)
    
    return NextResponse.json({
      status: 'error',
      message: 'Basic debug failed',
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : null,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
