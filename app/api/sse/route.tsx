import { addClient, removeClient } from '@/app/api/lib/sse'

export async function GET() {
    const clientId = Math.random().toString(36).substring(7)

    const stream = new ReadableStream({
        start(controller) {
            // Add client to list
            addClient(clientId, controller)

            // Send initial connection message
            controller.enqueue(
                new TextEncoder().encode(`data: ${JSON.stringify({
                    type: 'connected',
                    message: 'Connected to notifications'
                })}\n\n`)
            )
        },

        cancel() {
            // Remove client when connection closes
            removeClient(clientId)
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

