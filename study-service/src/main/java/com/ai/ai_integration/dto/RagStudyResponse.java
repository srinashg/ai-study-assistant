package com.ai.ai_integration.dto;

/*
RagStudyResponse wraps the generated StudyResponse together with the documentId the
uploaded notes were embedded under, so a client can later target that same document
from the agent endpoint (e.g. StudyTools.searchNotes).
 */
public record RagStudyResponse(
        String documentId,
        String explanation,
        String example,
        String commonMistake,
        String interviewQuestion) {

    public static RagStudyResponse of(String documentId, StudyResponse response) {
        return new RagStudyResponse(
                documentId,
                response.explanation(),
                response.example(),
                response.commonMistake(),
                response.interviewQuestion());
    }
}
