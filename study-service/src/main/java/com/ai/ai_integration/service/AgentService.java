package com.ai.ai_integration.service;

import com.ai.ai_integration.dto.AgentRequest;
import com.ai.ai_integration.dto.StudyResponse;
import com.ai.ai_integration.entity.StudyRecord;
import com.ai.ai_integration.repository.StudyRecordRepository;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class AgentService {

    private static final String DEFAULT_DIFFICULTY = "intermediate";

    private final ChatClient chatClient;
    private final StudyTools studyTools;
    private final StudyRecordRepository studyRecordRepository;

    public AgentService(
            ChatClient.Builder chatClientBuilder,
            StudyTools studyTools,
            StudyRecordRepository studyRecordRepository) {
        this.chatClient = chatClientBuilder.build();
        this.studyTools = studyTools;
        this.studyRecordRepository = studyRecordRepository;
    }

    public StudyResponse answer(AgentRequest request) {
        String message = request.message().trim();
        String resolvedDifficulty = StringUtils.hasText(request.difficulty())
                ? request.difficulty().trim()
                : DEFAULT_DIFFICULTY;
        String documentIdHint = StringUtils.hasText(request.documentId())
                ? "The student's uploaded notes are stored under documentId \"%s\" — pass this exact value to searchNotes if it would help answer their question."
                        .formatted(request.documentId())
                : "The student has not uploaded any notes for this request, so searchNotes will not find anything for them.";

        // Tools are offered, not forced: the model decides whether retrieving notes or past
        // sessions would improve the answer, and falls back to its own knowledge otherwise.
        String prompt = """
                You are a study assistant helping a %s student. The student asked:
                "%s"

                %s
                You also have a findPastSessions tool to check whether the student has studied a related topic before.
                Use these tools only when they would materially improve the answer; if a tool returns nothing useful,
                answer from your own knowledge instead of saying you don't know.

                Return:
                - a simple explanation
                - an example
                - a common mistake
                - an interview question
                """.formatted(resolvedDifficulty, message, documentIdHint);

        StudyResponse response = StudyResponseValidator.requireComplete(chatClient
                .prompt()
                .tools(studyTools)
                .user(prompt)
                .call()
                .entity(StudyResponse.class));

        StudyRecord record = new StudyRecord(
                message.length() > 255 ? message.substring(0, 255) : message,
                resolvedDifficulty,
                response.explanation(),
                response.example(),
                response.commonMistake(),
                response.interviewQuestion());
        studyRecordRepository.save(record);

        return response;
    }
}
