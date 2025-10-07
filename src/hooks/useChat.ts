import { useEffect, useState } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  status?: 'pending' | 'completed' | 'error';
}

interface UseChatOptions {
  conversationId: number | null;
}

export const useChat = ({ conversationId }: UseChatOptions) => {
  const [connected, setConnected] = useState(false);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!conversationId) return;

    const wsInstance = new WebSocket(`ws://localhost:8000/ws/chat/${conversationId}`);
    setWs(wsInstance);

    wsInstance.onopen = () => {
      console.log('WebSocket connected');
      setConnected(true);
    };

    wsInstance.onmessage = event => {
      const response = event.data;

      // Add AI response message
      setMessages(prev => [
        ...prev,
        {
          id: `${Date.now()}-assistant`,
          role: 'assistant',
          content: response,
          timestamp: new Date(),
          status: 'completed',
        },
      ]);

      setIsLoading(false);
    };

    wsInstance.onclose = () => {
      console.log('WebSocket disconnected');
      setConnected(false);
      setIsLoading(false);
    };

    wsInstance.onerror = error => {
      console.error('WebSocket error:', error);
      setConnected(false);
      setIsLoading(false);
    };

    return () => {
      wsInstance.close();
      setWs(null);
      setConnected(false);
    };
  }, [conversationId]);

  const sendMessage = (content: string) => {
    if (!ws || !connected || !content.trim()) return;

    // Add user message to the chat
    const userMessage: Message = {
      id: `${Date.now()}-user`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
      status: 'completed',
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Send message to backend via WebSocket
    ws.send(content.trim());
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return {
    connected,
    messages,
    isLoading,
    sendMessage,
    clearMessages,
  };
};
