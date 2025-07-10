package com.research.assistant;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.ollama.OllamaChatModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ResearchService {

    private ChatClient chatClient;

    public ResearchService(OllamaChatModel chatModel) {
        this.chatClient = ChatClient.create(chatModel);
    }


    public String processContent(ResearchRequest request) {
        // 1. Build the prompt
        String prompt = buildPrompt(request);

        // 2. Query the AI model API
        String response = chatClient.prompt()
                .user(prompt)
                .call()
                .content();

        // 3. Return the parsed response
        return response;
    }

    private String buildPrompt(ResearchRequest request) {
        StringBuilder prompt = new StringBuilder();
        switch (request.getOperation()) {
            case "summarize":
                prompt.append("Act as an expert researcher. Summarize the following content clearly in 3-4 sentences:\n\n");
                break;
            case "suggest":
                prompt.append("Act as a domain expert. Based on the following content, suggest related topics and recommend further readings. Use markdown format with clear headings and bullet points:\n\n");
                break;
            default:
                throw new IllegalArgumentException("Unknown operation: " + request.getOperation());
        }
        prompt.append(request.getContent());
        return prompt.toString();
    }
}
