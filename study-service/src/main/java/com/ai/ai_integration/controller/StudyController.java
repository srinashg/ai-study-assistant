package com.ai.ai_integration.controller;

import com.ai.ai_integration.dto.StudyRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Positive;

import com.ai.ai_integration.dto.StudyResponse;
import com.ai.ai_integration.dto.StudyRecordResponse;
import com.ai.ai_integration.service.RagService;
import com.ai.ai_integration.service.StudyService;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

@Validated
@RestController
@RequestMapping("/api/study")
public class StudyController {

    private final StudyService studyService;
    private final RagService ragService;

    public StudyController(StudyService studyService, RagService ragService) {
        this.studyService = studyService;
        this.ragService = ragService;
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

    // RAG mode: user uploads notes/PDFs (any file format), the app embeds and
    // retrieves the relevant chunks, and the LLM generates study material grounded in that content.
    // topic is optional: when given, it scopes retrieval to that topic within the notes;
    // when omitted, the whole document is used as context.
    @PostMapping(value = "/rag", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public StudyResponse generateFromSources(
            @RequestParam("files") List<MultipartFile> files,
            @RequestParam(required = false) String topic,
            @RequestParam(required = false) String difficulty) {

        return ragService.generateFromSources(files, topic, difficulty);
    }
}
