package com.ai.ai_integration.dto;

/*
StudyRequest is an immutable data transfer object (DTO), therefore we define it as a record instead of a class.
This allows us to create instances of StudyRequest with the specified topic and difficulty, and ensures that the values cannot be modified after creation.
 */
public record StudyRequest(String topic, String difficulty) {}
