package com.ai.ai_integration.service;

import com.ai.ai_integration.dto.StudyRequest;
import com.ai.ai_integration.dto.StudyResponse;
import com.ai.ai_integration.dto.StudyRecordResponse;
import com.ai.ai_integration.entity.StudyRecord;
import com.ai.ai_integration.repository.StudyRecordRepository;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class StudyService {

    private final ChatClient chatClient;
    private final StudyRecordRepository studyRecordRepository;

    public StudyService(
            ChatClient.Builder chatClientBuilder,
            StudyRecordRepository studyRecordRepository) {
        this.chatClient = chatClientBuilder.build();
        this.studyRecordRepository = studyRecordRepository;
    }

    public StudyResponse generateStudyMaterial(StudyRequest request) {

        // store topic and difficulty obtained from studyrequest as strings
        // define prompt which has placeholders for those strings
        String topic = request.topic().trim();
        String difficulty = request.difficulty().trim();

        String prompt = """
            Explain the following topic for a %s student:

            Topic: %s

            Return:
            - a simple explanation
            - an example
            - a common mistake
            - an interview question
            """.formatted(
                difficulty,
                topic
            );

        // Send prompt to Spring AI ChatClient

        // chatClient builds new chat request > give user prompt to request > calls AI provider >
        // fetches and deserializes response > validates structure and content of response >
        // returns successful StudyResponse object
        StudyResponse response = StudyResponseValidator.requireComplete(chatClient
                .prompt()
                .user(prompt)
                .call()
                .entity(StudyResponse.class));

        // StudyRecord entity takes in response fields > repository saves record to database >
        // return StudyResponse object to controller
        StudyRecord record = new StudyRecord(
                topic,
                difficulty,
                response.explanation(),
                response.example(),
                response.commonMistake(),
                response.interviewQuestion());
        studyRecordRepository.save(record);

        return response;
    }

    // returns a paginated list of previous study sessions in descending date order
    // ex: page=0&size=20 returns the 20 most recent study sessions
    public Page<StudyRecordResponse> getPreviousSessions(int page, int size) {
        PageRequest pageRequest = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.DESC, "createdAt")); // todo: fix Non type-safe property reference createdAt
        return studyRecordRepository.findAll(pageRequest).map(this::toRecordResponse);
    }

    // find and retrieve existing study session
    public StudyRecordResponse getSessionById(Long id) {
        return studyRecordRepository.findById(id)
                .map(this::toRecordResponse)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Study session not found"));
    }

    // converts StudyRecord entity to StudyRecordResponse DTO
    private StudyRecordResponse toRecordResponse(StudyRecord record) {
        return new StudyRecordResponse(
                record.getId(),
                record.getTopic(),
                record.getDifficulty(),
                record.getExplanation(),
                record.getExample(),
                record.getCommonMistake(),
                record.getInterviewQuestion(),
                record.getCreatedAt());
    }
}
