package com.ai.ai_integration.dto;

import java.time.Instant;

public record StudyRecordResponse(
        Long id,
        String topic,
        String difficulty,
        String explanation,
        String example,
        String commonMistake,
        String interviewQuestion,
        Instant createdAt) {
}
