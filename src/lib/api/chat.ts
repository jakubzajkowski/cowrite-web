// Simple mock LLM chat API helper. Replace with real backend / OpenAI call when available.
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: Date;
}

export interface SendChatRequest {
  messages: ChatMessage[]; // full conversation context
  prompt: string; // latest user prompt
  signal?: AbortSignal;
}

// Simulate an LLM streaming response token-by-token.
export async function* streamMockLLMResponse(): AsyncGenerator<string, void> {
  const fakeAnswer =
    `Jasne! To jest przykładowa odpowiedź asystenta.\n\n` +
    `1. W prawdziwej implementacji wywołaj tutaj swoje API.\n` +
    `2. Ten strumień generuje tokeny aby zasymulować streaming.\n` +
    `3. Możesz łatwo podmienić to na fetch + ReadableStream.\n\n` +
    `Powiedz czego potrzebujesz dalej?`;
  const tokens = fakeAnswer.split(/(?<=\s)/); // keep spaces
  for (const t of tokens) {
    // Artificial delay

    await new Promise(r => setTimeout(r, 40 + Math.random() * 40));
    yield t;
  }
}
