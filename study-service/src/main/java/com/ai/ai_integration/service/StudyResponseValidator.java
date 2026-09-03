package com.ai.ai_integration.service;

import com.ai.ai_integration.dto.StudyResponse;

import org.springframework.http.HttpStatus;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

final class StudyResponseValidator {

    private StudyResponseValidator() {
    }

    // validates that the StudyResponse object has all required fields populated
    static StudyResponse requireComplete(StudyResponse response) {
        if (response == null
                || !StringUtils.hasText(response.explanation())
                || !StringUtils.hasText(response.example())
                || !StringUtils.hasText(response.commonMistake())
                || !StringUtils.hasText(response.interviewQuestion())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "AI provider returned incomplete study material");
        }
        return response;
    }
}
