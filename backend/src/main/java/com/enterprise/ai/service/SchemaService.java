package com.enterprise.ai.service;

import com.enterprise.ai.dto.Dtos.ColumnInfo;
import com.enterprise.ai.dto.Dtos.SchemaResponse;
import com.enterprise.ai.dto.Dtos.TableInfo;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.ResultSet;
import java.util.*;

/** Inspects JDBC metadata to extract tables, columns, PKs, and FKs. Results are cached. */
@Service
public class SchemaService {

    private final DataSource dataSource;

    public SchemaService(DataSource dataSource) { this.dataSource = dataSource; }

    @Cacheable("schema")
    public SchemaResponse loadSchema() {
        List<TableInfo> tables = new ArrayList<>();
        try (Connection conn = dataSource.getConnection()) {
            DatabaseMetaData meta = conn.getMetaData();
            try (ResultSet rs = meta.getTables(null, null, "%", new String[]{"TABLE"})) {
                while (rs.next()) {
                    String tableName = rs.getString("TABLE_NAME");
                    tables.add(new TableInfo(tableName, loadColumns(meta, tableName)));
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Schema inspection failed: " + e.getMessage(), e);
        }
        return new SchemaResponse(tables);
    }

    private List<ColumnInfo> loadColumns(DatabaseMetaData meta, String table) throws Exception {
        Set<String> pks = new HashSet<>();
        try (ResultSet rs = meta.getPrimaryKeys(null, null, table)) {
            while (rs.next()) pks.add(rs.getString("COLUMN_NAME"));
        }
        Map<String, String> fks = new HashMap<>();
        try (ResultSet rs = meta.getImportedKeys(null, null, table)) {
            while (rs.next()) fks.put(rs.getString("FKCOLUMN_NAME"),
                    rs.getString("PKTABLE_NAME") + "." + rs.getString("PKCOLUMN_NAME"));
        }
        List<ColumnInfo> cols = new ArrayList<>();
        try (ResultSet rs = meta.getColumns(null, null, table, "%")) {
            while (rs.next()) {
                String name = rs.getString("COLUMN_NAME");
                cols.add(new ColumnInfo(name, rs.getString("TYPE_NAME"), pks.contains(name), fks.get(name)));
            }
        }
        return cols;
    }

    @CacheEvict(value = "schema", allEntries = true)
    public void refresh() {}
}
