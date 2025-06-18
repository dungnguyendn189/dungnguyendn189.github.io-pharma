// hooks/useNotifications.ts
import { useState, useEffect } from 'react'

interface Notification {
    type: string
    message: string
    data?: unknown
    timestamp: string
    read?: boolean
}

export function useNotifications() {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [isConnected, setIsConnected] = useState(false)

    const clearNotifications = () => {
        setNotifications([])
    }

    // Simulate connection status
    useEffect(() => {
        setIsConnected(true)
    }, [])

    return {
        notifications,
        isConnected,
        clearNotifications
    }
}