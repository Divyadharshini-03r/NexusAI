package com.enterprise.ai;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

/**
 * Entry point for the Enterprise AI Data Intelligence Platform.
 * Converts natural language into safe, optimized SQL via an LLM (OpenAI GPT-4.1),
 * inspects the connected database schema, and executes read-only queries.
 */
@SpringBootApplication
@EnableCaching
public class EnterpriseAiApplication {
    public static void main(String[] args) {
        SpringApplication.run(EnterpriseAiApplication.class, args);
    }
}
