package com.enterprise.ai.util;

import java.util.Set;
import java.util.regex.Pattern;

/**
 * SQL safety validator. Blocks every destructive keyword and only allows
 * queries that begin with SELECT or WITH (read-only CTE). Enforced server-side
 * before any SQL touches the database.
 */
public final class SqlSafetyValidator {

    private static final Set<String> BLOCKED = Set.of(
            "DROP", "DELETE", "UPDATE", "ALTER", "TRUNCATE",
            "CREATE", "EXEC", "EXECUTE", "INSERT", "GRANT", "REVOKE", "MERGE"
    );

    private static final Pattern BLOCKED_PATTERN = Pattern.compile(
            "\\b(" + String.join("|", BLOCKED) + ")\\b", Pattern.CASE_INSENSITIVE);

    private static final Pattern ALLOWED_START = Pattern.compile(
            "^\\s*(WITH|SELECT)\\b", Pattern.CASE_INSENSITIVE);

    private SqlSafetyValidator() {}

    public record Result(boolean ok, String reason) {}

    public static Result validate(String sql) {
        if (sql == null || sql.isBlank()) return new Result(false, "Empty query.");
        String stripped = stripComments(sql);
        if (!ALLOWED_START.matcher(stripped).find()) {
            return new Result(false, "Query must start with SELECT or WITH.");
        }
        var m = BLOCKED_PATTERN.matcher(stripped);
        if (m.find()) return new Result(false, "Destructive keyword blocked: " + m.group().toUpperCase());
        if (stripped.contains(";") && stripped.indexOf(';') < stripped.trim().length() - 1) {
            return new Result(false, "Multiple statements are not permitted.");
        }
        return new Result(true, null);
    }

    private static String stripComments(String sql) {
        return sql.replaceAll("--.*?(\\r?\\n|$)", " ")
                  .replaceAll("/\\*.*?\\*/", " ");
    }
}
