import { v4 as uuidv4 } from 'uuid';

// Types - similar to struct definitions in C
export interface Message {
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
}

// A simple in-memory store class
export class ChatStore {
  // private static instance - Singleton pattern
  // Map<string, Chat> is exactly like std::map<string, Chat> in C++ or Dict[str, Chat] in Python
  private static chats: Map<string, Chat> = new Map();

  static createChat(title: string = 'New Chat'): Chat {
    const id = uuidv4();
    const newChat: Chat = {
      id,
      title,
      messages: [],
      createdAt: Date.now(),
    };
    this.chats.set(id, newChat);
    return newChat;
  }

  static getChat(id: string): Chat | undefined {
    return this.chats.get(id);
  }

  static getAllChats(): Chat[] {
    // Convert map values to array and sort by newest first
    return Array.from(this.chats.values()).sort((a, b) => b.createdAt - a.createdAt);
  }

  static addMessage(chatId: string, role: 'user' | 'model', content: string): Message | null {
    const chat = this.chats.get(chatId);
    if (!chat) return null;

    const message: Message = {
      role,
      content,
      timestamp: Date.now(),
    };

    chat.messages.push(message);
    return message;
  }

  static updateChatTitle(chatId: string, title: string): void {
    const chat = this.chats.get(chatId);
    if (chat) {
      chat.title = title;
    }
  }
}