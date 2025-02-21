package handlers

import (
	"sync"

	"github.com/gofiber/websocket/v2"
)

var clients = make(map[*websocket.Conn]bool) // Connected clients
var mu sync.Mutex                            // Mutex to protect the clients map

func HandleWebSocket(c *websocket.Conn) {
	// Register the client
	mu.Lock()
	clients[c] = true
	mu.Unlock()

	defer func() {
		// Unregister the client on disconnect
		mu.Lock()
		delete(clients, c)
		mu.Unlock()
		c.Close()
	}()

	// Handle WebSocket connections for real-time updates
	for {
		_, msg, err := c.ReadMessage()
		if err != nil {
			break
		}

		// Broadcast message to all connected clients
		mu.Lock()
		for client := range clients {
			if err := client.WriteMessage(websocket.TextMessage, msg); err != nil {
				// Handle error (e.g., log it)
				client.Close()
				delete(clients, client) // Remove client if there's an error
			}
		}
		mu.Unlock()
	}
}
