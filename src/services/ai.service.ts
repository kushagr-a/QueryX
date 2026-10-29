import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";
import { tool } from "@langchain/core/tools";
import { createAgent } from "langchain";
import { ChatMistralAI } from "@langchain/mistralai"
import * as z from "zod"

import { searchInternet } from "./internet.service.js"
import { config } from "../config/config.js";


// gemini model for generating responses
const geminiModel = new ChatGoogleGenerativeAI({
    model: "gemini-3.5-flash-lite",
    apiKey: config.ai.apiKey,
});

// mistral model for generating responses
const mistralModel = new ChatMistralAI({
    model: "mistral-small-latest",
    apiKey: config.ai.mistralApiKey,
});

// tool for searching the internet using the Tavily API
const searchInternetTool = tool(
    async (query: string) => {
        return await searchInternet({query});
    },
    {
        name: "searchInternet",
        description: "Search the internet for information",
        schema: z.object({
            query: z.string().describe("The search query"),
        }),
    }
)

// create an agent that uses the gemini model and the searchInternet tool
const internetSearchAgent = createAgent({
    model: geminiModel as any,
    tools: [searchInternetTool],
})

// this function generates a response based on the user's messages and the AI's previous messages
export async function generateResponse(messages: any) {
    const response = await internetSearchAgent.invoke({
        messages: [
            new SystemMessage(`
                You are a helpful assistant that provides information and answers questions based on the user's messages and the AI's previous messages 
                and search internt tool for geeting latest information from the internet. 
                You should provide accurate and relevant information to the user based on the context of the conversation.
                `),
            ...messages.map((msg: { role: string; content: string }) => {
                if (msg.role === "user") {
                    return new HumanMessage(msg.content);
                } else if (msg.role === "ai") {
                    return new AIMessage(msg.content);
                }
                return new HumanMessage(msg.content);
            }),
        ],
    });

    return response.messages[response.messages.length - 1].content;
}

// this function generates a concise and descriptive title for a chat conversation based on the user's message
export async function generateChatTitle(message: string) {

    try {

        const response = await geminiModel.invoke([
            new SystemMessage(`You are a helpful assistant that generates a concise and descriptive title for a chat conversation based on the user's message. 
            The title should be relevant, clear, and capture the essence of the conversation. Please provide the title in a single 
            line without any additional context or explanation with in 10 words.`),

            new HumanMessage(`Generate a title for a chat conversation based on the following message: "${message}"`)
        ]);

        const content = (response as unknown as { content: unknown }).content;

        return typeof content === "string"
            ? content
            : JSON.stringify(content)

    } catch (error) {
        console.error("Chat title generation failed:", error);

        return "New Chat";
    }

}



