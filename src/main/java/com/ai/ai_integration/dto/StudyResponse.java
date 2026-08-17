package com.ai.ai_integration.dto;

/*
StudyResponse is an immutable data transfer object (DTO), therefore we define it as a record instead of a class.
This allows us to create instances of StudyResponse with the specified explanation, example, common mistake, and interview question, and ensures that the values cannot be modified after creation.
 */
public record StudyResponse(String explanation, String example, String commonMistake, String interviewQuestion) {}
