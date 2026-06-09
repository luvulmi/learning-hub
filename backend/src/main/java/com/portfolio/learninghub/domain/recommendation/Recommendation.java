package com.portfolio.learninghub.domain.recommendation;

import com.portfolio.learninghub.common.entity.BaseTimeEntity;
import com.portfolio.learninghub.domain.user.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "recommendations")
public class Recommendation extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String suggestedTopic;

    @Lob
    @Column(nullable = false)
    private String reason;

    /** 추천 시점에 근거로 삼은 최근 학습 기록의 스냅샷 요약 (조인 없이 추천 이력을 그대로 보존) */
    @Lob
    private String basedOnSummary;

    @Column(nullable = false)
    private boolean accepted;

    @Builder
    private Recommendation(User user, String suggestedTopic, String reason, String basedOnSummary) {
        this.user = user;
        this.suggestedTopic = suggestedTopic;
        this.reason = reason;
        this.basedOnSummary = basedOnSummary;
        this.accepted = false;
    }

    public void markAccepted() {
        this.accepted = true;
    }
}
