// lib/sse.ts (tạo file mới)
export interface NotificationData {
    id: string
    title: string
    message: string
    type: 'info' | 'success' | 'warning' | 'error'
    timestamp: number
}

let clients: { id: string, controller: ReadableStreamDefaultController }[] = []

export function addClient(id: string, controller: ReadableStreamDefaultController) {
    clients.push({ id, controller })
}

export function removeClient(id: string) {
    clients = clients.filter(client => client.id !== id)
}

export function broadcastNotification(data: NotificationData) {
    const message = `data: ${JSON.stringify(data)}\n\n`

    clients.forEach(client => {
        try {
            client.controller.enqueue(new TextEncoder().encode(message))
        } catch (error) {
            console.error('Error sending notification to client:', error)
            // Remove client nếu lỗi
            removeClient(client.id)
        }
    })
}