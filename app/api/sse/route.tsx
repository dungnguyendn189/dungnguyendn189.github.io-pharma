import { NextRequest, } from 'next/server'

// Store active connections
const clients = new Set<ReadableStreamDefaultController>()

export async function GET(request: NextRequest) {
    const stream = new ReadableStream({
        start(controller) {
            // Add client to active connections
            clients.add(controller)

            // Send initial connection message
            controller.enqueue(`data: ${JSON.stringify({
                type: 'connected',
                message: 'Kết nối thành công',
                timestamp: new Date().toISOString()
            })}\n\n`)

            // Cleanup when client disconnects
            request.signal.addEventListener('abort', () => {
                clients.delete(controller)
                controller.close()
            })
        }
    })

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Cache-Control'
        }
    })
}

// Function to broadcast notifications to all clients
interface NotificationData {
    type: string;
    message: string;
    timestamp?: string;
}

export function broadcastNotification(data: NotificationData): void {
    const message = `data: ${JSON.stringify(data)}\n\n`

    clients.forEach((controller: ReadableStreamDefaultController) => {
        try {
            controller.enqueue(message)
        } catch (error) {
            // Remove dead connections
            clients.delete(controller)
            console.log(error, 'Error sending message to client, removing dead connection')
        }
    })
}