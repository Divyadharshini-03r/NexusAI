package com.enterprise.ai.service;

import com.enterprise.ai.dto.Dtos.SchemaResponse;
import com.enterprise.ai.dto.Dtos.TableInfo;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Calls OpenAI GPT-4.1 to translate natural language into SQL, then to
 * produce a beginner-friendly explanation. The database schema is injected
 * into the prompt as context so the model produces accurate joins.
 */
@Service
public class LlmSqlService {

    private final RestClient http;
    private final SchemaService schemaService;
    private final ObjectMapper mapper = new ObjectMapper();

    @Value("${openai.api-key:}") private String apiKey;
    @Value("${openai.model:gpt-4.1}") private String model;
    @Value("${openai.base-url:https://api.openai.com/v1}") private String baseUrl;

    public LlmSqlService(RestClient http, SchemaService schemaService) {
        this.http = http;
        this.schemaService = schemaService;
    }

    public String generateSql(String question) {
        String prompt = "You are an expert SQL generator. Using ONLY the schema below, write a single "
                + "read-only SQL query answering the user's question. Return ONLY the SQL, no prose.\n\n"
                + schemaAsPrompt(schemaService.loadSchema()) + "\n\nQuestion: " + question;
        return chat("You output SQL only. Never explain.", prompt).trim();
    }

    public String explainSql(String sql) {
        return chat("You explain SQL to non-technical business users.",
                "Explain this query in beginner-friendly language, covering tables used, why joins "
                        + "exist, WHERE, GROUP BY, and aggregates:\n\n" + sql);
    }

    public List<String> suggestOptimizations(String sql) {
        String out = chat("You are a SQL performance reviewer.",
                "Return 3-6 short optimization hints for this SQL (missing indexes, SELECT *, "
                        + "cartesian products, unnecessary joins). One per line, no numbering.\n\n" + sql);
        return out.lines().map(String::trim).filter(s -> !s.isBlank()).toList();
    }

    private String schemaAsPrompt(SchemaResponse schema) {
        return schema.tables().stream().map(this::tableAsPrompt).collect(Collectors.joining("\n"));
    }

    private String tableAsPrompt(TableInfo t) {
        String cols = t.columns().stream()
                .map(c -> "  " + c.name() + " " + c.type()
                        + (c.primaryKey() ? " PK" : "")
                        + (c.foreignKey() != null ? " -> " + c.foreignKey() : ""))
                .collect(Collectors.joining("\n"));
        return "TABLE " + t.name() + "\n" + cols;
    }

    private String chat(String system, String user) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException("OPENAI_API_KEY is not configured");
        }
        Map<String, Object> body = Map.of(
                "model", model,
                "messages", List.of(
                        Map.of("role", "system", "content", system),
                        Map.of("role", "user", "content", user)),
                "temperature", 0.1);
        try {
            String response = http.post()
                    .uri(baseUrl + "/chat/completions")
                    .header("Authorization", "Bearer " + apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .body(String.class);
            JsonNode node = mapper.readTree(response);
            return node.path("choices").get(0).path("message").path("content").asText();
        } catch (Exception e) {
            throw new RuntimeException("LLM call failed: " + e.getMessage(), e);
        }
    }
}
