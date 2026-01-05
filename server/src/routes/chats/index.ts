import { FastifyPluginAsync } from "fastify"
import { ChatStore } from "../../services/storage"
import { LLMService } from "../../services/llm"

const chats: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  
  // GET /api/chats - List all chats
  fastify.get('/', async function (request, reply) {
    return ChatStore.getAllChats();
  })

  // POST /api/chats - Create a new chat
  fastify.post('/', async function (request, reply) {
    const chat = ChatStore.createChat("New Chat");
    return chat;
  })

  // GET /api/chats/:id - Get specific chat history
  fastify.get<{ Params: { id: string } }>('/:id', async function (request, reply) {
    const chat = ChatStore.getChat(request.params.id);
    if (!chat) {
      reply.code(404);
      return { error: "Chat not found" };
    }
    return chat;
  })

  // POST /api/chats/:id/messages - Send message & get reply
  fastify.post<{ Params: { id: string }, Body: { content: string; model?: string } }>('/:id/messages', async function (request, reply) {
    const { id } = request.params;
    const { content, model } = request.body;

    const chat = ChatStore.getChat(id);
    if (!chat) {
      reply.code(404);
      return { error: "Chat not found" };
    }

    // 1. Save User Message
    ChatStore.addMessage(id, 'user', content);

    // 2. Prepare history for openAI
    const history = chat.messages.map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));
    const historyForLLM = history.slice(0, -1); 

    // 3. Generate AI Response
    const aiResponseText = await LLMService.generateResponse(historyForLLM, content, model);

    // 4. Save AI Message
    const aiMessage = ChatStore.addMessage(id, 'model', aiResponseText);

    // 5. Auto-generate title if this is the first exchange
    if (chat.messages.length === 2 && chat.title === "New Chat") {
        LLMService.generateTitle(content, model).then(title => {
            ChatStore.updateChatTitle(id, title);
        });
    }

    return aiMessage;
  })
}

export default chats;
