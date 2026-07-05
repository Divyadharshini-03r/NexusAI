package com.enterprise.ai.controller;

import com.enterprise.ai.dto.Dtos.*;
import com.enterprise.ai.service.LlmSqlService;
import com.enterprise.ai.service.QueryExecutionService;
import com.enterprise.ai.service.SchemaService;
import com.enterprise.ai.util.SqlSafetyValidator;
import org.springframework.web.bind.annotation.*;

/** REST API consumed by the React frontend. */
@RestController
@RequestMapping("/api")
public class ApiController {

    private final LlmSqlService llm;
    private final QueryExecutionService executor;
    private final SchemaService schema;

    public ApiController(LlmSqlService llm, QueryExecutionService executor, SchemaService schema) {
        this.llm = llm;
        this.executor = executor;
        this.schema = schema;
    }

    @PostMapping("/ask")
    public AskResponse ask(@RequestBody AskRequest req) {
        String sql = llm.generateSql(req.question());
        SqlSafetyValidator.Result safety = SqlSafetyValidator.validate(sql);
        String explanation = safety.ok() ? llm.explainSql(sql) : null;
        return new AskResponse(
                sql,
                explanation,
                safety.ok(),
                safety.reason(),
                safety.ok() ? llm.suggestOptimizations(sql) : java.util.List.of());
    }

    @PostMapping("/execute")
    public ExecuteResponse execute(@RequestBody ExecuteRequest req) {
        return executor.execute(req.sql());
    }

    @GetMapping("/schema")
    public SchemaResponse schema() { return schema.loadSchema(); }

    @PostMapping("/schema/refresh")
    public SchemaResponse refresh() { schema.refresh(); return schema.loadSchema(); }
}
