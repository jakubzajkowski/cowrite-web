import { apiClient } from './client';
import type { ConversationIdRequest, ConversationIdResponse } from './types';

export const chatApi = {
  createConversation: async (
    conversationId: ConversationIdRequest
  ): Promise<ConversationIdResponse> => {
    return apiClient.post<ConversationIdResponse>(`/api/v1/chat/conversations`, conversationId);
  },
};
