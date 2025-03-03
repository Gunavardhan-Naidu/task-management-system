export const connectWebSocket = (onMessage) => {
    const socket = new WebSocket('ws://localhost:8080/tasks/ws');
    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        onMessage(data);
    };
    return socket;
};