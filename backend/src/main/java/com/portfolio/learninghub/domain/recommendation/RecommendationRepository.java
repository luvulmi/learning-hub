package com.portfolio.learninghub.domain.recommendation;

import com.portfolio.learninghub.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RecommendationRepository extends JpaRepository<Recommendation, Long> {
    List<Recommendation> findAllByUserOrderByCreatedAtDesc(User user);
}
