package com.ai.ai_integration.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/*
AgentRequest is an immutable data transfer object (DTO), therefore we define it as a record instead of a class.
documentId and difficulty are optional: documentId scopes the agent's searchNotes tool to one previously
uploaded RAG document, and difficulty falls back to a default when omitted.
 */
public record AgentRequest(
    @NotBlank(message = "Message cannot be blank") @Size(max = 2000, message = "Message cannot exceed 2000 characters")
    String message,
    String documentId,
    @Size(max = 50, message = "Difficulty cannot exceed 50 characters")
    String difficulty
) {}
