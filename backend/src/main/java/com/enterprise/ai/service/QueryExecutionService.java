package com.enterprise.ai.service;

import com.enterprise.ai.dto.Dtos.ExecuteResponse;
import com.enterprise.ai.util.SqlSafetyValidator;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.*;

/** Executes a validated SELECT and returns rows plus execution metrics. */
@Service
public class QueryExecutionService {

    private final JdbcTemplate jdbc;

    public QueryExecutionService(JdbcTemplate jdbc) { this.jdbc = jdbc; }

    public ExecuteResponse execute(String sql) {
        SqlSafetyValidator.Result safety = SqlSafetyValidator.validate(sql);
        if (!safety.ok()) {
            throw new SecurityException(safety.reason());
        }
        long start = System.currentTimeMillis();
        List<Map<String, Object>> rows = jdbc.queryForList(sql);
        long elapsed = System.currentTimeMillis() - start;
        List<String> columns = rows.isEmpty() ? List.of() : new ArrayList<>(rows.get(0).keySet());
        return new ExecuteResponse(columns, rows, elapsed, rows.size(), "success");
    }
}
