package com.portfolio.learninghub.domain.recommendation.dto;

import com.portfolio.learninghub.domain.recommendation.Recommendation;

import java.time.LocalDateTime;

public record RecommendationResponse(
        Long id,
        String suggestedTopic,
        String reason,
        boolean accepted,
        LocalDateTime createdAt
) {
    public static RecommendationResponse of(Recommendation r) {
        return new RecommendationResponse(
                r.getId(),
                r.getSuggestedTopic(),
                r.getReason(),
                r.isAccepted(),
                r.getCreatedAt()
        );
    }
}
