import { tavily as Tavily } from "@tavily/core";

import { config } from "../config/config.js";

const tvly = Tavily({ apiKey: config.internetSearch.tavilyApiKey });

export async function searchInternet({ query }: { query: string }) {
    try {
        const response = await tvly.search(query,
            {
                limit: 5,
                maxResults: 5,
                searchDepth: "basic",
            }
        );
        console.log(response);
        return JSON.stringify(response);
    } catch (error) {
        console.error("Error during internet search:", error);
        throw error;
    }

}