package com.ai.ai_integration.service;

import com.ai.ai_integration.dto.StudyRecordResponse;
import com.ai.ai_integration.entity.StudyRecord;
import com.ai.ai_integration.repository.StudyRecordRepository;

import org.springframework.ai.document.Document;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

// Tools the study assistant agent can choose to call. Spring AI exposes these to the model
// via ChatClient.prompt().tools(...) and runs the call/response loop automatically.
@Component
public class StudyTools {

    private static final int TOP_K = 5;

    private final VectorStore vectorStore;
    private final StudyRecordRepository studyRecordRepository;

    public StudyTools(VectorStore vectorStore, StudyRecordRepository studyRecordRepository) {
        this.vectorStore = vectorStore;
        this.studyRecordRepository = studyRecordRepository;
    }

    @Tool(description = "Search the student's uploaded notes for content relevant to a query. "
            + "Only useful if a documentId was provided; returns the most relevant excerpts, "
            + "or says so explicitly if nothing matches.")
    public String searchNotes(
            @ToolParam(description = "What to search for in the notes") String query,
            @ToolParam(description = "The documentId of the uploaded notes to search within", required = false) String documentId) {
        if (!StringUtils.hasText(documentId)) {
            return "No documentId was provided, so there are no uploaded notes to search.";
        }

        List<Document> matches = vectorStore.similaritySearch(SearchRequest.builder()
                .query(query)
                .topK(TOP_K)
                .filterExpression("documentId == '" + documentId + "'")
                .build());

        if (matches.isEmpty()) {
            return "No matching content found in the uploaded notes.";
        }
        return matches.stream().map(Document::getText).collect(Collectors.joining("\n---\n"));
    }

    @Tool(description = "Look up the student's past study sessions on a given topic, "
            + "to avoid repeating an explanation or to build on it.")
    public List<StudyRecordResponse> findPastSessions(
            @ToolParam(description = "The topic to look up past sessions for") String topic) {
        return studyRecordRepository.findTop5ByTopicContainingIgnoreCaseOrderByCreatedAtDesc(topic).stream()
                .map(StudyTools::toRecordResponse)
                .toList();
    }

    private static StudyRecordResponse toRecordResponse(StudyRecord record) {
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
