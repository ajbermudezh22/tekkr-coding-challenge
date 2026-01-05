import OpenAI from 'openai';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

const API_KEY = process.env.OPENAI_API_KEY;

if (!API_KEY) {
  console.error("Missing OPENAI_API_KEY in .env file");
}

const openai = new OpenAI({
  apiKey: API_KEY || "",
});

export class LLMService {
  static async generateResponse(history: { role: string; parts: { text: string }[] }[], newMessage: string, modelName: string = "gpt-3.5-turbo") {
    try {
      // Map Gemini-style history to OpenAI format
      const openaiHistory = history.map(msg => ({
        role: msg.role === 'model' ? 'assistant' : msg.role,
        content: msg.parts[0].text
      })) as OpenAI.Chat.Completions.ChatCompletionMessageParam[];

      // Add system prompt to history or messages
      const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        ...openaiHistory,
        { role: 'user', content: newMessage },
        { role: 'system', content: "If the user asks for a project plan, output it strictly in this JSON format wrapped in <project-plan> tags: <project-plan>{ \"workstreams\": [ { \"title\": \"...\", \"description\": \"...\", \"deliverables\": [ { \"title\": \"...\", \"description\": \"...\" } ] } ] }</project-plan>. Do not use markdown code blocks for the JSON." }
      ];

      const completion = await openai.chat.completions.create({
        messages: messages,
        model: modelName,
      });

      return completion.choices[0].message.content || "";
    } catch (error) {
      console.error("LLM Error:", error);
      
      // FALLBACK MOCK RESPONSE FOR DEMO PURPOSES
      // This ensures the UI features can be demonstrated even if the API Key is invalid.
      if (newMessage.toLowerCase().includes("plan") || newMessage.toLowerCase().includes("coffee") || newMessage.toLowerCase().includes("hello")) {
        if (newMessage.toLowerCase().includes("hello")) {
          return "Hello! I am a simulated assistant because the OPENAI_API_KEY is missing or invalid. Ask me for a 'coffee shop project plan' to see a demo!";
        }
        return `I couldn't connect to the AI model with the current key, but here is what the **Project Plan** feature looks like:\n\n<project-plan>{
  "workstreams": [
    {
      "title": "Business Strategy",
      "description": "Define the core value proposition and financial model.",
      "deliverables": [
        { "title": "Market Analysis", "description": "Analyze competitors and target demographics." },
        { "title": "Financial Projections", "description": "Create 3-year P&L and cash flow statements." }
      ]
    },
    {
      "title": "Location & Buildout",
      "description": "Secure and prepare the physical space.",
      "deliverables": [
        { "title": "Site Selection", "description": "Evaluate foot traffic and lease terms." },
        { "title": "Interior Design", "description": "Finalize layout, furniture, and branding elements." }
      ]
    },
    {
      "title": "Operations & Staffing",
      "description": "Set up day-to-day workflows and hire the team.",
      "deliverables": [
        { "title": "Menu Development", "description": "Select coffee beans and food items." },
        { "title": "Hiring Plan", "description": "Recruit and train baristas and managers." }
      ]
    }
  ]
}</project-plan>\n\nLet me know if you would like to adjust any of these workstreams!`;
      }
      
      return "I'm sorry, I encountered an error connecting to the AI provider. Please ensure you have created a 'server/.env' file with a valid OPENAI_API_KEY.";
    }
  }

  static async generateTitle(firstMessage: string, modelName: string = "gpt-3.5-turbo"): Promise<string> {
    try {
        const completion = await openai.chat.completions.create({
            messages: [
                { role: 'system', content: "Generate a short, concise title (max 5 words) for a chat that starts with the following message. Do not use quotes." },
                { role: 'user', content: firstMessage }
            ],
            model: modelName,
        });
        return completion.choices[0].message.content || "New Chat";
    } catch (error) {
        console.error("Title Generation Error:", error);
        return "New Chat";
    }
  }
}
