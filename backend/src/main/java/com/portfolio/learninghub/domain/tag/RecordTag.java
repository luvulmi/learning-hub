package com.portfolio.learninghub.domain.tag;

import com.portfolio.learninghub.domain.record.LearningRecord;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * LearningRecord와 Tag의 다대다 관계를 명시적으로 풀어낸 연결 엔티티.
 * {@code @ManyToMany} 대신 사용해 조인 쿼리를 직접 제어할 수 있게 한다.
 */
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "record_tags")
public class RecordTag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "record_id", nullable = false)
    private LearningRecord record;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tag_id", nullable = false)
    private Tag tag;

    @Builder
    private RecordTag(LearningRecord record, Tag tag) {
        this.record = record;
        this.tag = tag;
    }
}
