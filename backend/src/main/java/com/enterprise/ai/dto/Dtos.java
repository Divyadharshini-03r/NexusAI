package com.enterprise.ai.dto;

import java.util.List;
import java.util.Map;

public class Dtos {
    public record AskRequest(String question) {}
    public record AskResponse(String sql, String explanation, boolean safe, String safetyReason,
                              List<String> optimizations) {}
    public record ExecuteRequest(String sql) {}
    public record ExecuteResponse(List<String> columns, List<Map<String, Object>> rows,
                                  long executionMs, int rowCount, String status) {}
    public record ColumnInfo(String name, String type, boolean primaryKey, String foreignKey) {}
    public record TableInfo(String name, List<ColumnInfo> columns) {}
    public record SchemaResponse(List<TableInfo> tables) {}
}
