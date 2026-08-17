package com.ai.ai_integration.service;

import com.ai.ai_integration.dto.StudyRequest;
import com.ai.ai_integration.dto.StudyResponse;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class StudyService {

    private final ChatClient chatClient;

    public StudyService(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
    }

    public StudyResponse generateStudyMaterial(StudyRequest request) {

        String prompt = """
            Explain the following topic for a %s student:

            Topic: %s

            Return:
            - a simple explanation
            - an example
            - a common mistake
            - an interview question
            """.formatted(
                request.difficulty(),
                request.topic()
            );

        // Send prompt to Spring AI ChatClient

        StudyResponse response = chatClient
        .prompt()
        .user(prompt)
        .call()
        .entity(StudyResponse.class);

        return response;
    }
}
