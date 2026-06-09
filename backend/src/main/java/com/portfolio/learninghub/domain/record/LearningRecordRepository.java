package com.portfolio.learninghub.domain.record;

import com.portfolio.learninghub.domain.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface LearningRecordRepository extends JpaRepository<LearningRecord, Long> {

    Page<LearningRecord> findAllByUser(User user, Pageable pageable);

    // 태그까지 한 번에 fetch — N+1 방지
    @Query("SELECT r FROM LearningRecord r LEFT JOIN FETCH r.recordTags rt LEFT JOIN FETCH rt.tag WHERE r.id = :id")
    Optional<LearningRecord> findByIdWithTags(Long id);

    // 공개 프로필용: 특정 유저의 공개 기록만 조회
    @Query("SELECT r FROM LearningRecord r LEFT JOIN FETCH r.recordTags rt LEFT JOIN FETCH rt.tag WHERE r.user = :user AND r.isPublic = true ORDER BY r.createdAt DESC")
    Page<LearningRecord> findPublicByUser(User user, Pageable pageable);

    Optional<LearningRecord> findByIdAndUser(Long id, User user);
}
