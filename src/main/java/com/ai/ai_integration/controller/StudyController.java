package com.ai.ai_integration.controller;

import com.ai.ai_integration.dto.StudyRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Positive;

import com.ai.ai_integration.dto.StudyResponse;
import com.ai.ai_integration.dto.StudyRecordResponse;
import com.ai.ai_integration.service.StudyService;

import org.springframework.data.domain.Page;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@Validated
@RestController
@RequestMapping("/api/study")
public class StudyController {

    private final StudyService studyService;

    public StudyController(StudyService studyService) {
        this.studyService = studyService;
    }

    @PostMapping
    public StudyResponse generateStudyMaterial(
            @Valid @RequestBody StudyRequest request) {

        return studyService.generateStudyMaterial(request);
    }

    @GetMapping("/sessions")
    public Page<StudyRecordResponse> getPreviousSessions(
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "20") @Min(1) @Max(100) int size) {

        return studyService.getPreviousSessions(page, size);
    }

    @GetMapping("/sessions/{id}")
    public StudyRecordResponse getSessionById(
            @PathVariable("id") @Positive Long id) {

        return studyService.getSessionById(id);
    }
}
