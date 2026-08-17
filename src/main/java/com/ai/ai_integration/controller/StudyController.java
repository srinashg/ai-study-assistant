package com.ai.ai_integration.controller;

import com.ai.ai_integration.dto.StudyRequest;
import com.ai.ai_integration.dto.StudyResponse;
import com.ai.ai_integration.service.StudyService;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/study")
public class StudyController {

    private final StudyService studyService;

    public StudyController(StudyService studyService) {
        this.studyService = studyService;
    }

    @PostMapping
    public StudyResponse generateStudyMaterial(
            @RequestBody StudyRequest request) {

        return studyService.generateStudyMaterial(request);
    }
}
