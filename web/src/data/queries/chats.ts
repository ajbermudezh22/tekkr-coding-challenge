import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../client";

export interface Message {
  role: "user" | "assistant"; // Mapping 'model' from backend to 'assistant' for UI consistency if needed, or keeping as is.
  content: string;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
}

// Fetch all chats
export function useChatsQuery() {
  return useQuery({
    queryKey: ["chats"],
    queryFn: async () => {
      const response = await apiClient.get<Chat[]>("/chats");
      return response.data;
    },
  });
}

// Fetch specific chat messages
export function useChatQuery(chatId: string | null) {
  return useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      if (!chatId) return null;
      const response = await apiClient.get<Chat>(`/chats/${chatId}`);
      // Backend returns 'model', frontend expects 'assistant' usually, 
      // but let's normalize it here or in the UI. 
      // The backend stores 'role': 'user' | 'model'.
      // The frontend Message type (from message.tsx) expects 'user' | 'assistant'.
      // We should map it.
      const data = response.data;
      return {
        ...data,
        messages: data.messages.map(m => ({
            ...m,
            role: (m.role as any) === 'model' ? 'assistant' : m.role
        }))
      };
    },
    enabled: !!chatId,
  });
}

// Create new chat
export function useCreateChatMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.post<Chat>("/chats");
      return response.data;
    },
    onSuccess: (newChat) => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
      return newChat;
    },
  });
}

// Send message
export function useSendMessageMutation(chatId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ content, model }: { content: string; model: string }) => {
      const response = await apiClient.post(`/chats/${chatId}/messages`, { content, model });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat", chatId] });
      // Also invalidate chats list if we want to update "last message" preview or order
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
}

