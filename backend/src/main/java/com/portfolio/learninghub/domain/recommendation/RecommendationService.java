package com.portfolio.learninghub.domain.recommendation;

import com.portfolio.learninghub.domain.record.LearningRecord;
import com.portfolio.learninghub.domain.record.LearningRecordRepository;
import com.portfolio.learninghub.domain.recommendation.dto.RecommendationResponse;
import com.portfolio.learninghub.domain.user.User;
import com.portfolio.learninghub.infra.ai.AiServiceClient;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RecommendationService {

    private final RecommendationRepository recommendationRepository;
    private final LearningRecordRepository learningRecordRepository;
    private final AiServiceClient aiServiceClient;

    public List<RecommendationResponse> getMyRecommendations(User user) {
        return recommendationRepository.findAllByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(RecommendationResponse::of)
                .toList();
    }

    @Transactional
    public RecommendationResponse createRecommendation(User user) {
        List<LearningRecord> recentRecords = learningRecordRepository
                .findAllByUser(user, PageRequest.of(0, 10))
                .getContent();

        if (recentRecords.isEmpty()) {
            throw new IllegalStateException("학습 기록이 없습니다.");
        }

        List<AiServiceClient.RecordSummary> summaries = recentRecords.stream()
                .map(r -> new AiServiceClient.RecordSummary(
                        r.getTitle(),
                        r.getCategory().name(),
                        r.getRecordTags().stream()
                                .map(rt -> rt.getTag().getName())
                                .toList()
                ))
                .toList();

        AiServiceClient.AiRecommendResponse aiResponse =
                aiServiceClient.recommend(user.getId(), summaries);

        Recommendation recommendation = Recommendation.builder()
                .user(user)
                .suggestedTopic(aiResponse.suggested_topic())
                .reason(aiResponse.reason())
                .basedOnSummary(aiResponse.based_on_summary())
                .build();

        return RecommendationResponse.of(recommendationRepository.save(recommendation));
    }

    @Transactional
    public RecommendationResponse accept(User user, Long recommendationId) {
        Recommendation recommendation = recommendationRepository.findById(recommendationId)
                .filter(r -> r.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new IllegalArgumentException("추천을 찾을 수 없습니다."));

        recommendation.markAccepted();
        return RecommendationResponse.of(recommendation);
    }
}
