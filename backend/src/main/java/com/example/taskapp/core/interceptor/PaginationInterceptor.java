package com.example.taskapp.core.interceptor;

import org.apache.ibatis.executor.parameter.ParameterHandler;
import org.apache.ibatis.executor.statement.StatementHandler;
import org.apache.ibatis.mapping.BoundSql;
import org.apache.ibatis.plugin.*;
import org.apache.ibatis.reflection.MetaObject;
import org.apache.ibatis.reflection.SystemMetaObject;
import org.springframework.stereotype.Component;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.Map;
import java.util.Properties;

@Intercepts({
        @Signature(type = StatementHandler.class, method = "prepare", args = {Connection.class, Integer.class})
})
@Component
public class PaginationInterceptor implements Interceptor {

    @Override
    public Object intercept(Invocation invocation) throws Throwable {
        StatementHandler statementHandler = (StatementHandler) invocation.getTarget();
        MetaObject metaObject = SystemMetaObject.forObject(statementHandler);
        
        // Skip if not a select statement
        while (metaObject.hasGetter("h")) {
            Object object = metaObject.getValue("h");
            metaObject = SystemMetaObject.forObject(object);
        }
        while (metaObject.hasGetter("target")) {
            Object object = metaObject.getValue("target");
            metaObject = SystemMetaObject.forObject(object);
        }

        BoundSql boundSql = (BoundSql) metaObject.getValue("delegate.boundSql");
        Object parameterObject = boundSql.getParameterObject();

        if (parameterObject instanceof Map) {
            Map<?, ?> paramMap = (Map<?, ?>) parameterObject;
            
            if (paramMap.containsKey("limit") && paramMap.containsKey("offset")) {
                Object limitObj = paramMap.get("limit");
                Object offsetObj = paramMap.get("offset");

                if (limitObj != null && offsetObj != null) {
                    Integer limit = (Integer) limitObj;
                    Integer offset = (Integer) offsetObj;

                    String originalSql = boundSql.getSql();
                    
                    if (originalSql.trim().toUpperCase().startsWith("SELECT") 
                        && !originalSql.toUpperCase().contains("LIMIT")) {
                        
                        StringBuilder sqlBuilder = new StringBuilder(originalSql);

                        // Dynamic Sorting
                        if (paramMap.containsKey("sortBy") && paramMap.get("sortBy") != null) {
                            String sortBy = (String) paramMap.get("sortBy");
                            // Basic SQL injection prevention: only allow alphanumeric and underscore
                            if (sortBy.matches("^[a-zA-Z0-9_.]+$")) {
                                String direction = "ASC";
                                if (paramMap.containsKey("sortDirection") && "DESC".equalsIgnoreCase((String) paramMap.get("sortDirection"))) {
                                    direction = "DESC";
                                }
                                sqlBuilder.append(" ORDER BY ").append(sortBy).append(" ").append(direction);
                            }
                        }

                        String finalSql = sqlBuilder.toString();

                        // Execute Count Query
                        Connection connection = (Connection) invocation.getArgs()[0];
                        String countSql = "SELECT COUNT(*) FROM (" + finalSql + ") AS total_count";
                        
                        try (PreparedStatement countStmt = connection.prepareStatement(countSql)) {
                            ParameterHandler parameterHandler = (ParameterHandler) metaObject.getValue("delegate.parameterHandler");
                            parameterHandler.setParameters(countStmt);
                            
                            try (ResultSet rs = countStmt.executeQuery()) {
                                if (rs.next()) {
                                    PageContext.setTotal(rs.getLong(1));
                                }
                            }
                        }
                        
                        // Append LIMIT and OFFSET to main query
                        String paginatedSql = finalSql + " LIMIT " + limit + " OFFSET " + offset;
                        metaObject.setValue("delegate.boundSql.sql", paginatedSql);
                    }
                }
            }
        }
        
        return invocation.proceed();
    }

    @Override
    public Object plugin(Object target) {
        return Plugin.wrap(target, this);
    }

    @Override
    public void setProperties(Properties properties) {
    }
}
