package com.ai.ai_integration.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/*
StudyRequest is an immutable data transfer object (DTO), therefore we define it as a record instead of a class.
This allows us to create instances of StudyRequest with the specified topic and difficulty, and ensures that the values cannot be modified after creation.
 */
public record StudyRequest(
    @NotBlank(message = "Topic cannot be blank") @Size(max = 255, message = "Topic cannot exceed 255 characters")
    String topic,
    @NotBlank(message = "Difficulty cannot be blank") @Size(max = 50, message = "Difficulty cannot exceed 50 characters")
    String difficulty
) {}
