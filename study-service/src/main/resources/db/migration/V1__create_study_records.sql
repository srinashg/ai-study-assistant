CREATE TABLE study_records (
    id BIGSERIAL PRIMARY KEY,
    topic VARCHAR(255) NOT NULL,
    difficulty VARCHAR(50) NOT NULL,
    explanation TEXT NOT NULL,
    example TEXT NOT NULL,
    common_mistake TEXT NOT NULL,
    interview_question TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_study_records_created_at
    ON study_records (created_at DESC);
