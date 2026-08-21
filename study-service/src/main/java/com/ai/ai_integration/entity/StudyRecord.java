package com.ai.ai_integration.entity;

import java.time.Instant;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "study_records")
public class StudyRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String topic;

    @Column(nullable = false, length = 50)
    private String difficulty;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String explanation;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String example;

    // name field is included in @Column if column name != field name
    @Column(name = "common_mistake", nullable = false, columnDefinition = "TEXT")
    private String commonMistake;

    @Column(name = "interview_question", nullable = false, columnDefinition = "TEXT")
    private String interviewQuestion;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    protected StudyRecord() {
        // Required by JPA.
    }

    public StudyRecord(
            String topic,
            String difficulty,
            String explanation,
            String example,
            String commonMistake,
            String interviewQuestion) {
        this.topic = topic;
        this.difficulty = difficulty;
        this.explanation = explanation;
        this.example = example;
        this.commonMistake = commonMistake;
        this.interviewQuestion = interviewQuestion;
    }

    public Long getId() {
        return id;
    }

    public String getTopic() {
        return topic;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public String getExplanation() {
        return explanation;
    }

    public String getExample() {
        return example;
    }

    public String getCommonMistake() {
        return commonMistake;
    }

    public String getInterviewQuestion() {
        return interviewQuestion;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
