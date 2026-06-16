package com.portfolio.learninghub.domain.recommendation;

import com.portfolio.learninghub.domain.recommendation.dto.RecommendationResponse;
import com.portfolio.learninghub.domain.user.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "AI 추천")
@SecurityRequirement(name = "JWT")
@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationService recommendationService;

    @Operation(summary = "추천 목록 조회")
    @GetMapping
    ResponseEntity<List<RecommendationResponse>> getMyRecommendations(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(recommendationService.getMyRecommendations(user));
    }

    @Operation(summary = "새 추천 생성", description = "최근 학습 기록 기반으로 AI가 다음 토픽을 추천합니다.")
    @PostMapping
    ResponseEntity<RecommendationResponse> createRecommendation(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(recommendationService.createRecommendation(user));
    }

    @Operation(summary = "추천 수락")
    @PostMapping("/{id}/accept")
    ResponseEntity<RecommendationResponse> accept(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        return ResponseEntity.ok(recommendationService.accept(user, id));
    }
}
