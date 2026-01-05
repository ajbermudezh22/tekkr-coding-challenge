import {ChatSidebar} from "../components/chat-sidebar";
import {useEffect, useState} from "react";
import {ChatInputBox} from "../components/chat-input-box";
import {AssistantLoadingIndicator, MessageContainer, MessageContent} from "../components/message";
import {useChatQuery, useChatsQuery, useCreateChatMutation, useSendMessageMutation} from "../data/queries/chats";
import Spinner from "../components/ui/spinner";

export function HomePage () {
    const [chatId, setChatId] = useState<string | null>(() => {
        return new URLSearchParams(window.location.search).get("chatId");
    });

    const handleChatSelect = (id: string) => {
        setChatId(id);
        const url = new URL(window.location.href);
        url.searchParams.set("chatId", id);
        window.history.pushState({}, "", url);
    };

    const { data: chats } = useChatsQuery();
    const createChat = useCreateChatMutation();

    const handleCreateChat = async () => {
        const newChat = await createChat.mutateAsync();
        handleChatSelect(newChat.id);
    };

    const sidebarChats = chats?.map(c => ({ name: c.title, id: c.id })) || [];

    return <div className={"flex flex-col items-center"}>
        <ChatSidebar 
            chats={sidebarChats} 
            selectedChatId={chatId} 
            onSelectChat={handleChatSelect} 
            onCreateChat={handleCreateChat}
        />
        <div className={"flex flex-col pt-8 max-w-4xl ms-64 w-full p-6 min-h-screen relative"}>
            {chatId ? <ChatWindow chatId={chatId} /> : <div className="text-center mt-20 text-muted-foreground">Select a chat or start a new one</div>}
        </div>
    </div>
}

function ChatWindow ({ chatId }: { chatId: string }) {
    const { data: chat, isLoading } = useChatQuery(chatId);
    const sendMessage = useSendMessageMutation(chatId);
    const [selectedModel, setSelectedModel] = useState("gpt-3.5-turbo");

    const handleSend = async (content: string) => {
        await sendMessage.mutateAsync({ content, model: selectedModel });
    };

    if (isLoading) return <div className="flex justify-center mt-10"><Spinner /></div>;
    if (!chat) return <div>Chat not found</div>;

    return <div className={"flex flex-col gap-4 pb-32"}>
        <div className="flex justify-between items-center border-b pb-2 mb-4">
            <h2 className="text-2xl font-bold">{chat.title}</h2>
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">Model:</span>
                <select 
                    value={selectedModel} 
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="h-8 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                    <option value="gpt-4o">GPT-4o</option>
                </select>
            </div>
        </div>

        {chat.messages.map((message, index) => (
            <MessageContainer role={message.role} key={index}>
                <MessageContent content={message.content} />
            </MessageContainer>
        ))}
        {sendMessage.isPending && <AssistantLoadingIndicator />}
        
        <div className="fixed bottom-0 left-64 right-0 p-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t z-10 flex justify-center">
           <div className="max-w-4xl w-full">
               <ChatInputBox onSend={handleSend} disabled={sendMessage.isPending} />
           </div>
        </div>
    </div>
}
