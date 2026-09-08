package com.ai.ai_integration.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ai.ai_integration.entity.StudyRecord;

public interface StudyRecordRepository extends JpaRepository<StudyRecord, Long> {

    List<StudyRecord> findTop5ByTopicContainingIgnoreCaseOrderByCreatedAtDesc(String topic);
}
