package com.ai.ai_integration.service;

import com.ai.ai_integration.dto.StudyResponse;
import com.ai.ai_integration.entity.StudyRecord;
import com.ai.ai_integration.repository.StudyRecordRepository;

import org.apache.tika.exception.TikaException;
import org.apache.tika.metadata.Metadata;
import org.apache.tika.parser.AutoDetectParser;
import org.apache.tika.sax.BodyContentHandler;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.document.Document;
import org.springframework.ai.transformer.splitter.TokenTextSplitter;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import org.xml.sax.SAXException;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class RagService {

    private static final String DEFAULT_DIFFICULTY = "intermediate";
    private static final int TOP_K = 5;

    private final ChatClient chatClient;
    private final VectorStore vectorStore;
    private final TokenTextSplitter textSplitter;
    private final StudyRecordRepository studyRecordRepository;

    public RagService(
            ChatClient.Builder chatClientBuilder,
            VectorStore vectorStore,
            StudyRecordRepository studyRecordRepository) {
        this.chatClient = chatClientBuilder.build();
        this.vectorStore = vectorStore;
        this.textSplitter = new TokenTextSplitter();
        this.studyRecordRepository = studyRecordRepository;
    }

    public StudyResponse generateFromSources(List<MultipartFile> files, String topic, String difficulty) {
        // 1. must accept at least one source file
        if (files == null || files.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "At least one source file is required");
        }

        String resolvedDifficulty = StringUtils.hasText(difficulty) ? difficulty.trim() : DEFAULT_DIFFICULTY;
        boolean topicSpecified = StringUtils.hasText(topic);

        // tagged with a per-request documentId so retrieval only pulls chunks from this upload
        String documentId = UUID.randomUUID().toString();
        List<Document> sourceDocuments = files.stream()
                .map(file -> toDocument(file, documentId))
                .toList();
        List<Document> chunks = textSplitter.apply(sourceDocuments);
        vectorStore.add(chunks);

        String resolvedTopic;
        String context;
        if (topicSpecified) {
            // a topic narrows a large multi-topic document down to the relevant chunks to make the prompt more focused and the response more accurate
            resolvedTopic = topic.trim();
            // gets K most relevant chunks from uploaded notes based on topic
            // context is the concatenation of those chunks, separated by "---" to help the LLM distinguish them
            List<Document> relevantChunks = vectorStore.similaritySearch(SearchRequest.builder()
                    .query(resolvedTopic)
                    .topK(TOP_K)
                    .filterExpression("documentId == '" + documentId + "'")
                    .build());
            context = relevantChunks.stream().map(Document::getText).collect(Collectors.joining("\n---\n"));
        } else {
            // if topic not specified, derive a topic from the uploaded files and use all chunks as context
            // context is the full text - concat of all chunks, separated by "---" to help the LLM distinguish them
            resolvedTopic = deriveTopic(files);
            context = chunks.stream().map(Document::getText).collect(Collectors.joining("\n---\n"));
        }

        // 2. prompt engineering
        String prompt = topicSpecified
                ? """
                    Using ONLY the context below, explain the topic "%s" for a %s student.
                    If the context does not contain enough information to answer fully, say so explicitly instead of making things up.

                    Context:
                    %s

                    Return:
                    - a simple explanation
                    - an example
                    - a common mistake
                    - an interview question
                    """.formatted(resolvedTopic, resolvedDifficulty, context)
                : """
                    Using ONLY the notes below, generate study material for a %s student.
                    If the notes do not contain enough information, say so explicitly instead of making things up.

                    Notes:
                    %s

                    Return:
                    - a simple explanation of the main concept covered
                    - an example
                    - a common mistake
                    - an interview question
                    """.formatted(resolvedDifficulty, context);

        // 3. validate that the StudyResponse object has all required fields populated; if not, throw 502 Bad Gateway
        StudyResponse response = StudyResponseValidator.requireComplete(chatClient
                .prompt()
                .user(prompt)
                .call()
                .entity(StudyResponse.class));

        // 4. save the generated study material to the database for future retrieval
        StudyRecord record = new StudyRecord(
                resolvedTopic,
                resolvedDifficulty,
                response.explanation(),
                response.example(),
                response.commonMistake(),
                response.interviewQuestion());
        studyRecordRepository.save(record); //repository saves the record to the database

        return response;
    }

    // study_records.topic is NOT NULL; since RAG mode has no user-supplied topic, label it by source filenames
    /*
    1. creates topic for files based on filenames, joined by commas (if file has no filename, uses "uploaded notes" instead)
    2. filename is truncated to 255 characters to fit in database column
     */
    private String deriveTopic(List<MultipartFile> files) {
        String joined = files.stream()
                .map(file -> Objects.requireNonNullElse(file.getOriginalFilename(), "uploaded notes"))
                .collect(Collectors.joining(", "));
        return joined.length() > 255 ? joined.substring(0, 255) : joined;
    }

    // Tika auto-detects the file format (PDF, DOCX, TXT, PPTX, HTML, ...) and extracts plain text.
    private Document toDocument(MultipartFile file, String documentId) {
        try (InputStream stream = file.getInputStream()) {
            BodyContentHandler handler = new BodyContentHandler(-1);
            new AutoDetectParser().parse(stream, handler, new Metadata());
            return new Document(handler.toString(), Map.of(
                    "documentId", documentId,
                    "filename", Objects.requireNonNullElse(file.getOriginalFilename(), "unknown")));
        } catch (IOException | SAXException | TikaException e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Could not read file: " + file.getOriginalFilename(),
                    e);
        }
    }
}
