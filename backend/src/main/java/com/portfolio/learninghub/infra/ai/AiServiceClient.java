package com.portfolio.learninghub.infra.ai;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Component
public class AiServiceClient {

    private final RestClient restClient;

    public AiServiceClient(@Value("${app.ai-service-url}") String aiServiceUrl) {
        this.restClient = RestClient.builder()
                .baseUrl(aiServiceUrl)
                .build();
    }

    public record RecordSummary(String title, String category, List<String> tags) {}

    public record AiRecommendResponse(
            Long user_id,
            String suggested_topic,
            String reason,
            String based_on_summary
    ) {}

    public AiRecommendResponse recommend(Long userId, List<RecordSummary> records) {
        return restClient.post()
                .uri("/recommend")
                .body(Map.of("user_id", userId, "records", records))
                .retrieve()
                .body(AiRecommendResponse.class);
    }
}
