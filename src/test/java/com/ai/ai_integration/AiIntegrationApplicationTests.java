package com.ai.ai_integration;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.ai.ai_integration.entity.StudyRecord;
import com.ai.ai_integration.repository.StudyRecordRepository;
import com.ai.ai_integration.service.StudyService;

@SpringBootTest
class AiIntegrationApplicationTests {

	@Autowired
	private StudyRecordRepository studyRecordRepository;

	@Autowired
	private StudyService studyService;

	@Test
	void contextLoads() {
	}

	@Test
	void persistsStudyRecord() {
		StudyRecord saved = studyRecordRepository.saveAndFlush(new StudyRecord(
				"PostgreSQL",
				"beginner",
				"A relational database.",
				"SELECT * FROM study_records;",
				"Skipping indexes.",
				"What is an index?"));

		assertThat(saved.getId()).isNotNull();
		assertThat(saved.getCreatedAt()).isNotNull();
		assertThat(studyRecordRepository.findById(saved.getId()))
				.isPresent()
				.get()
				.extracting(StudyRecord::getTopic)
				.isEqualTo("PostgreSQL");

		assertThat(studyService.getSessionById(saved.getId()).topic())
				.isEqualTo("PostgreSQL");
		assertThat(studyService.getPreviousSessions(0, 20).getContent())
				.extracting(record -> record.id())
				.contains(saved.getId());
	}

}
